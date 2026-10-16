import { useEffect, useState } from 'react';
import Particles from './Particles/Particles';

const NIGHT = ['#7ee0ff', '#8b909a', '#e8e6e3'];

// WebGL 吃不了 var()。只在浏览器里读计算后的主题色；服务端没有 document。
function readPalette() {
  if (typeof document === 'undefined') return NIGHT;
  const style = getComputedStyle(document.documentElement);
  const pick = (name: string) => style.getPropertyValue(name).trim();
  const colors = [pick('--color-accent'), pick('--color-muted'), pick('--color-ink')].filter(Boolean);
  return colors.length > 0 ? colors : NIGHT;
}

// 触控屏少画一些粒子。系统要求减少动效时不挂 WebGL，底下的静态渐变还在。
export default function HeroBackdrop() {
  const [count, setCount] = useState(0);
  const [colors, setColors] = useState(NIGHT);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sync = () => setColors(readPalette());
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    if (!reduce) {
      const compact = window.matchMedia('(max-width: 720px)').matches;
      // 数量和尺寸按宽屏首屏调过：连线能看出来，但不盖住名字。
      setCount(compact ? 64 : 120);
    }

    return () => observer.disconnect();
  }, []);

  if (count === 0) return null;

  return (
    <div className="hero-particles">
      <Particles
        particleCount={count}
        particleSpread={11}
        speed={0.055}
        particleColors={colors}
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
