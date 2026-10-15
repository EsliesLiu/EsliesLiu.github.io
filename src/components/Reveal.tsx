import { useEffect, useState, type ReactNode } from 'react';
import AnimatedContent from './AnimatedContent/AnimatedContent';

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

// 首屏 HTML 先给可见内容。确认可以动之后再交给 GSAP，避免没 JS 时卡片停在 opacity: 0。
export default function Reveal({ children, delay = 0, className }: Props) {
  const [motionOk, setMotionOk] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setMotionOk(!reduce);
  }, []);

  if (!motionOk) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatedContent
      className={className}
      delay={delay}
      distance={18}
      duration={0.65}
      ease="power3.out"
      initialOpacity={0}
      animateOpacity
      threshold={0.2}
    >
      {children}
    </AnimatedContent>
  );
}
