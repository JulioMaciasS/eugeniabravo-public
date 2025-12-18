import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">{title}</h3>
          <p className="text-3xl font-bold text-navy-900">{value}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;