import { useEffect, useState } from 'react';
import Particles from './Particles/Particles';

// 触控屏少画一些粒子。系统要求减少动效时不挂 WebGL，底下的静态渐变还在。
export default function HeroBackdrop() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setCount(0);
      return;
    }
    const compact = window.matchMedia('(max-width: 720px)').matches;
    // 数量和尺寸按宽屏首屏调过：连线能看出来，但不盖住名字。
    setCount(compact ? 64 : 120);
  }, []);

  if (count === 0) return null;

  return (
    <div className="hero-particles">
      <Particles
        particleCount={count}
        particleSpread={11}
        speed={0.055}
        particleColors={['#7ee0ff', '#8b909a', '#e8e6e3']}
        particleBaseSize={150}
        sizeRandomness={0.85}
        cameraDistance={22}
        glow={0.75}
        twinkle={0.35}
        connections
        connectionDistance={128}
        moveParticlesOnHover
        particleHoverFactor={0.35}
        hoverEffect="parallax"
        clickBurst={false}
        opacity={1}
      />
    </div>
  );
}
