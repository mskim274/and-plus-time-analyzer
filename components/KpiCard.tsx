
import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-slate-100 p-5 rounded-xl shadow-sm flex items-center space-x-4 transition-transform transform hover:-translate-y-1 hover:shadow-md">
      <div className="flex-shrink-0 bg-white p-3 rounded-full shadow">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 truncate">{title}</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default KpiCard;
