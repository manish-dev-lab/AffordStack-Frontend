import React, { useEffect, useRef, useState } from 'react';

type AnimationType = 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-up';

interface RevealProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delayMs?: number;
  durationMs?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  animation = 'fade-up',
  delayMs = 0,
  durationMs = 700,
  threshold = 0.15,
  className = '',
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(node);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);

  // Initial hidden states depending on animation type
  const getInitialTransform = () => {
    switch (animation) {
      case 'fade-up':
        return 'translateY(36px)';
      case 'slide-left':
        return 'translateX(-40px)';
      case 'slide-right':
        return 'translateX(40px)';
      case 'scale-up':
        return 'scale(0.94)';
      case 'fade-in':
      default:
        return 'translateY(0)';
    }
  };

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'none' : getInitialTransform(),
    transition: `opacity ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
    willChange: 'opacity, transform',
  };

  return (
    <div ref={elementRef} style={style} className={className}>
      {children}
    </div>
  );
};
