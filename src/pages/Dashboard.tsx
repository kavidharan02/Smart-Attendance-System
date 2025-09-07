import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX } from 'lucide-react';
import { AttendanceStats, AttendanceRecord } from '../types';
import { api } from '../lib/api';
import { format, subDays } from 'date-fns';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch today's stats
      const todayStats = await api.getAttendanceStats();
      setStats(todayStats);

      // Fetch recent attendance records
      const records = await api.getAttendanceRecords({
        start_date: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
        end_date: format(new Date(), 'yyyy-MM-dd'),
      });
      setRecentAttendance(records.slice(0, 10)); // Latest 10 records

      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Set mock data for demo
      setStats({
        total_students: 150,
        present_today: 120,
        absent_today: 25,
        late_today: 5,
        attendance_rate: 80.0,
      });
      setRecentAttendance([]);
      
    } finally {
      setLoading(false);
    }
  };

  // Charts removed for minimal dashboard

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of today's attendance</p>
      </div>

      {/* Minimal stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Total Users</div>
              <div className="text-2xl font-bold text-gray-900">{stats.total_students}</div>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
          <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Present Today</div>
              <div className="text-2xl font-bold text-gray-900">{stats.present_today}</div>
            </div>
            <UserCheck className="h-8 w-8 text-green-500" />
          </div>
          <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Absent Today</div>
              <div className="text-2xl font-bold text-gray-900">{stats.absent_today}</div>
            </div>
            <UserX className="h-8 w-8 text-red-500" />
          </div>
        </div>
      )}

      

      {/* Recent Attendance */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Attendance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentAttendance.length > 0 ? (
                recentAttendance.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.student_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(record.date), 'MMM dd, yyyy')}
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
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No recent attendance records found
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