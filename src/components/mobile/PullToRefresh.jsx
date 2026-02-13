import React, { useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';

export default function PullToRefresh({ onRefresh, children }) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef(null);
  
  const threshold = 80;

  const handleTouchStart = (e) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (refreshing) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    if (diff > 0 && containerRef.current?.scrollTop === 0) {
      setPulling(true);
      setPullDistance(Math.min(diff, threshold * 1.5));
      
      if (diff < threshold) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !refreshing) {
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
    setPulling(false);
    setPullDistance(0);
    startY.current = 0;
  };

  const rotation = Math.min((pullDistance / threshold) * 360, 360);

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {(pulling || refreshing) && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 z-50"
          style={{ height: `${Math.min(pullDistance, threshold)}px` }}
        >
          <Loader2
            className={`w-6 h-6 text-primary ${refreshing ? 'animate-spin' : ''}`}
            style={{ transform: refreshing ? 'none' : `rotate(${rotation}deg)` }}
          />
        </div>
      )}
      <div style={{ transform: pulling || refreshing ? `translateY(${Math.min(pullDistance, threshold)}px)` : 'translateY(0)', transition: pulling ? 'none' : 'transform 0.3s' }}>
        {children}
      </div>
    </div>
  );
}