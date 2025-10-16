'use client';

import { Plug } from "lucide-react";

export default function ConnectorsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Plug className="w-8 h-8 text-orange-400" />
        <h1 className="text-3xl font-bold text-white">Connectors</h1>
      </div>
      <div className="bg-brand-surface futuristic-border rounded-xl p-8 text-center hover:shadow-glow-md transition-all duration-300">
        <Plug className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-400 mb-2">Connectors</h3>
        <p className="text-gray-500">Integrate with external platforms and services.</p>
      </div>
    </div>
  );
}