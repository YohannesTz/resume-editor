
import { useState, useEffect, useCallback } from 'react';

export function useResizablePanel(initialWidth, minWidth, maxWidth) {
  const [width, setWidth] = useState(initialWidth);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const newWidth = e.clientX;
      setWidth(Math.min(Math.max(newWidth, minWidth), maxWidth));
    }
  }, [isDragging, minWidth, maxWidth]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return { width, isDragging, handleMouseDown };
}
