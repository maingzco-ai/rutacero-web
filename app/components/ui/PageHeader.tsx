'use client';

import { motion } from 'framer-motion';
import { EASE, staggerParent, revealUp } from '@/app/lib/motion';
import { cn } from '@/app/lib/design-system';
import { Words } from '../fx/Reveal';

export function PageHeader({
  eyebrow,
  title,
  accent,
  description,
  actions,
  className,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.header
      variants={staggerParent(0.08)}
      initial="hidden"
      animate="show"
      className={cn('relative', className)}
    >
      <motion.div variants={revealUp} className="flex items-center gap-3">
        <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_14px_3px_rgba(92,233,220,0.5)]" />
        <p className="hud">{eyebrow}</p>
        <span className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
      </motion.div>

      <motion.h1
        variants={revealUp}
        className="display mt-4 text-[2.5rem] leading-[0.95] text-text sm:text-[3.4rem]"
      >
        <Words text={title} accent={accent} delay={0.05} />
      </motion.h1>

      {description && (
        <motion.p
          variants={revealUp}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-4 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-[15px]"
        >
          {description}
        </motion.p>
      )}

      {actions && <motion.div variants={revealUp} className="mt-6">{actions}</motion.div>}
    </motion.header>
  );
}
