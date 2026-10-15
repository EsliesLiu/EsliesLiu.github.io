import { motion, useReducedMotion } from 'motion/react';

type Props = {
  text: string;
};

// 首屏名字不靠 IntersectionObserver。观察器偶发不触发时，字会一直停在 opacity: 0。
export default function HeroTitle({ text }: Props) {
  const reduce = useReducedMotion();
  const letters = text.split('');

  return (
    <span className="blur-text flex flex-wrap" aria-label={text}>
      {letters.map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          aria-hidden="true"
          initial={reduce ? false : { filter: 'blur(8px)', opacity: 0.2, y: -10 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            delay: reduce ? 0 : index * 0.028,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: 'inline-block', willChange: 'transform, filter, opacity' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  );
}
