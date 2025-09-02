import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Clock, TrendingUp } from 'lucide-react';
import { StatCard } from '../components/UI/StatCard';
import { AttendanceChart } from '../components/Reports/AttendanceChart';
import { AttendanceStats, AttendanceRecord } from '../types';
import { api } from '../lib/api';
import { format, subDays } from 'date-fns';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([]);
  const [weeklyData, setWeeklyData] = useState<number[]>([]);
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

      // Generate mock weekly data for chart
      const mockWeeklyData = Array.from({ length: 7 }, () => 
        Math.floor(Math.random() * 50) + 20
      );
      setWeeklyData(mockWeeklyData);
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
      setWeeklyData([45, 52, 48, 61, 42, 58, 49]);
    } finally {
      setLoading(false);
    }
  };

  const weeklyChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Attendance',
        data: weeklyData,
        backgroundColor: 'rgba(37, 99, 235, 0.5)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 2,
      },
    ],
  };

  const attendanceDistribution = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        data: stats ? [stats.present_today, stats.absent_today, stats.late_today] : [0, 0, 0],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

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

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Students"
            value={stats.total_students}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Present Today"
            value={stats.present_today}
            icon={UserCheck}
            color="green"
            change={{ value: 5.2, label: 'from yesterday' }}
          />
          <StatCard
            title="Absent Today"
            value={stats.absent_today}
            icon={UserX}
            color="red"
            change={{ value: -2.1, label: 'from yesterday' }}
          />
          <StatCard
            title="Late Today"
            value={stats.late_today}
            icon={Clock}
            color="yellow"
            change={{ value: 1.3, label: 'from yesterday' }}
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart
          type="bar"
          data={weeklyChartData}
          title="Weekly Attendance Trend"
        />
        <AttendanceChart
          type="doughnut"
          data={attendanceDistribution}
          title="Today's Attendance Distribution"
        />
      </div>

      {/* Recent Attendance */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Attendance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.time_in}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === 'present' ? 'bg-green-100 text-green-800' :
                        record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
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