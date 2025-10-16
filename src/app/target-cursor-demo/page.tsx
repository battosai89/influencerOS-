import TargetCursor from '@/components/TargetCursor';

export default function TargetCursorDemo() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <TargetCursor />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Target Cursor Demo
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800 p-6 rounded-lg cursor-target">
            <h2 className="text-2xl font-semibold mb-4">Interactive Button</h2>
            <p className="text-gray-300 mb-4">
              Hover over this button to see the target cursor effect!
            </p>
            <button className="cursor-target bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors">
              Click me!
            </button>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg cursor-target">
            <h2 className="text-2xl font-semibold mb-4">Hover Target</h2>
            <p className="text-gray-300 mb-4">
              This entire card is a hover target with the target cursor.
            </p>
            <div className="cursor-target bg-green-600 hover:bg-green-700 p-4 rounded text-center">
              Hover target area
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Mixed Content</h2>
          <p className="text-gray-300 mb-6">
            Some elements have the target cursor, others use the default.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="cursor-target bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
              Target Cursor
            </div>
            <div className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded cursor-pointer">
              Default Cursor
            </div>
            <div className="cursor-target bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded">
              Target Cursor
            </div>
            <div className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded cursor-pointer">
              Default Cursor
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-400">
            Move your mouse around to see the target cursor in action!
          </p>
          <p className="text-sm text-gray-500 mt-2">
            The cursor will change appearance when hovering over target elements.
          </p>
        </div>
      </div>
    </div>
  );
}