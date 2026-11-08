'use client';

import { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE, revealScale, revealUp, staggerParent } from '@/app/lib/motion';
import { cn } from '@/app/lib/design-system';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: 'up' | 'scale';
  once?: boolean;
};

export function Reveal({ children, className, delay = 0, variant = 'up', once = true }: RevealProps) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={variant === 'up' ? revealUp : revealScale}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-12% 0px -10% 0px' }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  delay = 0,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={staggerParent(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px' }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={revealUp} className={className}>
      {children}
    </motion.div>
  );
}

export function Words({
  text,
  className,
  wordClassName,
  delay = 0,
  accent,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  accent?: string;
}) {
  const reduced = useReducedMotion();
  const words = text.split(' ');

  if (reduced) {
    return (
      <span className={className}>
        {text}
        {accent ? <span className="serif text-primary-light"> {accent}</span> : null}
      </span>
    );
  }

  return (
    <span className={cn('inline', className)}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className={cn('inline-block', wordClassName)}
            initial={{ y: '110%', opacity: 0, rotate: 2 }}
            animate={{ y: '0%', opacity: 1, rotate: 0 }}
            transition={{ duration: 1, ease: EASE, delay: delay + index * 0.055 }}
          >
            {word}
            {index < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
      {accent ? (
        <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="serif inline-block text-primary-light"
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 1.1, ease: EASE, delay: delay + words.length * 0.055 }}
          >
            {'\u00A0'}
            {accent}
          </motion.span>
        </span>
      ) : null}
    </span>
  );
}
