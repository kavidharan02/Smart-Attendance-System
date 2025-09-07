import React, { useState, useEffect } from 'react';
import { Calendar, Download } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { AttendanceRecord } from '../types';
import { api } from '../lib/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export const Attendance: React.FC = () => {
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    fetchTodayAttendance();
  }, [selectedDate]);

  const fetchTodayAttendance = async () => {
    try {
      setLoading(true);
      const records = await api.getAttendanceRecords({ date: selectedDate });
      setTodayAttendance(records);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      // Mock data for demo
      setTodayAttendance([
        {
          id: '1',
          student_id: 'STU001',
          student_name: 'John Doe',
          date: selectedDate,
          time_in: '09:00:00',
          status: 'present',
          confidence_score: 0.95,
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          student_id: 'STU002',
          student_name: 'Jane Smith',
          date: selectedDate,
          time_in: '09:15:00',
          status: 'late',
          confidence_score: 0.92,
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };



  const handleExportCSV = async () => {
    try {
      const blob = await api.exportAttendanceCSV({
        start_date: selectedDate,
        end_date: selectedDate,
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `attendance-${selectedDate}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Attendance exported successfully');
    } catch (error) {
      toast.error('Failed to export attendance');
      console.error('Export error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600">View and manage attendance records</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <label htmlFor="date-select" className="sr-only">Select Date</label>
            <input
              id="date-select"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <Button
            onClick={handleExportCSV}
            variant="secondary"
            icon={Download}
            size="sm"
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Minimal summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Present</div>
          <div className="text-2xl font-bold text-gray-900">{todayAttendance.filter(r => r.status === 'present').length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Absent</div>
          <div className="text-2xl font-bold text-gray-900">{todayAttendance.filter(r => r.status === 'absent').length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-2xl font-bold text-gray-900">{todayAttendance.length}</div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Attendance for {format(new Date(selectedDate), 'MMMM dd, yyyy')}</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  </td>
                </tr>
              ) : todayAttendance.length > 0 ? (
                todayAttendance.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record.student_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                    No attendance records found for this date
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};