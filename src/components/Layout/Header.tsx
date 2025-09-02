import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <div className="lg:pl-64 flex flex-col">
      <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
        <button
          type="button"
          className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
          onClick={onMenuClick}
          title="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="flex-1 px-4 flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900">
              Smart Attendance System
            </h1>
          </div>
          
          <div className="ml-4 flex items-center md:ml-6">
            <button 
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              title="Notifications"
            >
              <Bell className="h-6 w-6" />
            </button>
            
            <div className="ml-3 relative">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                  {user?.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};