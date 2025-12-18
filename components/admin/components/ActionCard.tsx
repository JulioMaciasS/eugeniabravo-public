// app/components/AdminDashboard/ActionCard.tsx
"use client";

import React from "react";
import Link from "next/link";

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
}

export default function ActionCard({ title, description, icon, to }: ActionCardProps) {
  return (
    <Link href={to} className="block w-full h-full">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:border-[#009483] hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
        <div className="flex flex-col h-full">
          <div className="bg-[#009483]/10 text-[#009483] p-3 rounded-full w-12 h-12 flex items-center justify-center group-hover:bg-[#009483] group-hover:text-white transition-all duration-300 mb-4">
            {icon}
          </div>
          <div className="flex-1 flex flex-col">
            <h3 className="text-lg font-semibold text-navy-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed flex-1">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}