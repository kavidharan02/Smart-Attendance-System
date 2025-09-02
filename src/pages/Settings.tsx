import React, { useState } from 'react';
import { Save, Camera, Shield, Bell, Database } from 'lucide-react';
import { Button } from '../components/UI/Button';
import toast from 'react-hot-toast';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    recognition: {
      confidence_threshold: 0.8,
      liveness_detection: true,
      max_faces_per_frame: 3,
      recognition_timeout: 5,
    },
    camera: {
      resolution: '1280x720',
      fps: 30,
      auto_adjust_lighting: true,
    },
    attendance: {
      late_threshold_minutes: 15,
      auto_mark_absent_hours: 24,
      allow_manual_override: true,
    },
    notifications: {
      email_reports: true,
      daily_summary: true,
      low_attendance_alerts: true,
      system_alerts: true,
    },
    database: {
      backup_frequency: 'daily',
      retention_days: 365,
      cleanup_old_photos: false,
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Mock API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure face recognition and attendance parameters</p>
        </div>
        
        <Button
          onClick={handleSave}
          loading={isSaving}
          icon={Save}
        >
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Face Recognition Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Face Recognition</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confidence Threshold
              </label>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={settings.recognition.confidence_threshold}
                onChange={(e) => handleSettingChange('recognition', 'confidence_threshold', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>50%</span>
                <span className="font-medium">
                  {(settings.recognition.confidence_threshold * 100).toFixed(0)}%
                </span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Liveness Detection
              </label>
              <input
                type="checkbox"
                checked={settings.recognition.liveness_detection}
                onChange={(e) => handleSettingChange('recognition', 'liveness_detection', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Faces Per Frame
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.recognition.max_faces_per_frame}
                onChange={(e) => handleSettingChange('recognition', 'max_faces_per_frame', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recognition Timeout (seconds)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.recognition.recognition_timeout}
                onChange={(e) => handleSettingChange('recognition', 'recognition_timeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Camera Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Camera className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Camera Configuration</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resolution
              </label>
              <select
                value={settings.camera.resolution}
                onChange={(e) => handleSettingChange('camera', 'resolution', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="640x480">640x480 (VGA)</option>
                <option value="1280x720">1280x720 (HD)</option>
                <option value="1920x1080">1920x1080 (Full HD)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frame Rate (FPS)
              </label>
              <select
                value={settings.camera.fps}
                onChange={(e) => handleSettingChange('camera', 'fps', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={15}>15 FPS</option>
                <option value={24}>24 FPS</option>
                <option value={30}>30 FPS</option>
                <option value={60}>60 FPS</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Auto-adjust Lighting
              </label>
              <input
                type="checkbox"
                checked={settings.camera.auto_adjust_lighting}
                onChange={(e) => handleSettingChange('camera', 'auto_adjust_lighting', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Attendance Rules */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Database className="h-5 w-5 text-purple-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Attendance Rules</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Late Threshold (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={settings.attendance.late_threshold_minutes}
                onChange={(e) => handleSettingChange('attendance', 'late_threshold_minutes', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Mark as late if arrival is beyond this time
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Auto-mark Absent After (hours)
              </label>
              <input
                type="number"
                min="1"
                max="48"
                value={settings.attendance.auto_mark_absent_hours}
                onChange={(e) => handleSettingChange('attendance', 'auto_mark_absent_hours', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Allow Manual Override
              </label>
              <input
                type="checkbox"
                checked={settings.attendance.allow_manual_override}
                onChange={(e) => handleSettingChange('attendance', 'allow_manual_override', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Email Reports
              </label>
              <input
                type="checkbox"
                checked={settings.notifications.email_reports}
                onChange={(e) => handleSettingChange('notifications', 'email_reports', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Daily Summary
              </label>
              <input
                type="checkbox"
                checked={settings.notifications.daily_summary}
                onChange={(e) => handleSettingChange('notifications', 'daily_summary', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Low Attendance Alerts
              </label>
              <input
                type="checkbox"
                checked={settings.notifications.low_attendance_alerts}
                onChange={(e) => handleSettingChange('notifications', 'low_attendance_alerts', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                System Alerts
              </label>
              <input
                type="checkbox"
                checked={settings.notifications.system_alerts}
                onChange={(e) => handleSettingChange('notifications', 'system_alerts', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Database className="h-5 w-5 text-red-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Data Management</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Backup Frequency
            </label>
            <select
              value={settings.database.backup_frequency}
              onChange={(e) => handleSettingChange('database', 'backup_frequency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Retention (days)
            </label>
            <input
              type="number"
              min="30"
              max="3650"
              value={settings.database.retention_days}
              onChange={(e) => handleSettingChange('database', 'retention_days', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="cleanup_photos"
              checked={settings.database.cleanup_old_photos}
              onChange={(e) => handleSettingChange('database', 'cleanup_old_photos', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
            />
            <label htmlFor="cleanup_photos" className="text-sm font-medium text-gray-700">
              Auto-cleanup old photos
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};