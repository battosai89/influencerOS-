'use client';

import TargetCursor from '@/components/TargetCursor';

export default function TestCursor() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <TargetCursor />
      
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-8">Target Cursor Test</h1>
        
        <div className="space-y-8">
          <div className="cursor-target bg-blue-600 hover:bg-blue-700 p-6 rounded-lg transition-colors">
            <h2 className="text-xl font-semibold mb-2">Hover Target</h2>
            <p>Hover over this card to see the target cursor corners track the element boundaries.</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Non-Target Area</h2>
            <p>This area uses the default cursor behavior.</p>
          </div>
          
          <div className="cursor-target bg-green-600 hover:bg-green-700 p-6 rounded-lg transition-colors">
            <h2 className="text-xl font-semibold mb-2">Another Target</h2>
            <p>Try moving between different target elements to see the smooth transitions.</p>
          </div>
        </div>
        
        <div className="mt-12">
          <p className="text-gray-400">The cursor should spin continuously and track target elements.</p>
          <p className="text-sm text-gray-500 mt-2">Click to see the click animation effect.</p>
        </div>
      </div>
    </div>
  );
}