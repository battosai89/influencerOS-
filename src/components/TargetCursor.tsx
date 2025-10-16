"use client";

import { useEffect, useState } from 'react';

interface TargetCursorProps {
  children?: React.ReactNode;

}

const TargetCursor = ({ children }: TargetCursorProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Check if hovering over clickable elements
      const elementAtPoint = document.elementFromPoint(e.clientX, e.clientY);
      if (elementAtPoint) {
        const isClickable = elementAtPoint.matches('button, a, [role="button"], input, textarea, select, [onclick], [data-cursor-target]');
        setIsHovering(isClickable);
      }
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    // Add event listeners to all clickable elements
    const clickableElements = document.querySelectorAll('button, a, [role="button"], input, textarea, select');
    clickableElements.forEach(element => {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    });

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clickableElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      {children}
      {isHovering && (
        <div
          className="fixed pointer-events-none z-50 transition-all duration-200 ease-out"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-6 h-6 border-2 border-brand-primary rounded-full animate-pulse">
            <div className="w-full h-full bg-brand-primary/20 rounded-full animate-ping" />
          </div>
        </div>
      )}
    </>
  );
};

export default TargetCursor;