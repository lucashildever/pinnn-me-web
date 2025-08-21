import { useRef, useCallback } from "react";

interface UseTabsDraggerReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  dragEvents: {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
  hasMoved: React.RefObject<boolean>;
}

export function useTabsDragger(): UseTabsDraggerReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const hasMoved = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isDragging.current = true;
    hasMoved.current = false;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
    containerRef.current.style.cursor = "grabbing";
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    e.preventDefault();
    hasMoved.current = true;
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = x - startX.current;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = "grab";
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    isDragging.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = "grab";
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!containerRef.current) return;
    isDragging.current = true;
    hasMoved.current = false;
    startX.current = e.touches[0].clientX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    e.preventDefault();
    hasMoved.current = true;
    const x = e.touches[0].clientX - containerRef.current.offsetLeft;
    const walk = x - startX.current;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  return {
    containerRef,
    dragEvents: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    hasMoved,
  };
}
