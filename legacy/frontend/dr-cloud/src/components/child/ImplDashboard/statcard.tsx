// components/ui/Dashboard/StatCard.tsx
"use client"

import React from 'react';
import { Stat } from '../../ui/Dashboard/types';

interface StatCardProps {
  stat: Stat;
}

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  const Icon = stat.icon;

  return (
    <div
      className={`${stat.bg} relative group p-3 lg:p-4 rounded-xl border ${stat.borderColor} transition-all duration-300
        hover:shadow-lg hover:-translate-y-0.5 cursor-pointer`}
    >
      <div className="flex flex-col h-full">
        <div className={`${stat.bg} rounded-lg w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center mb-2 lg:mb-3
          group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`h-4 w-4 lg:h-5 lg:w-5 ${stat.color}`} />
        </div>
        
        <div className="space-y-1">
          <p className="text-xs lg:text-sm font-medium text-gray-600">{stat.label}</p>
          <p className={`text-lg lg:text-xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
