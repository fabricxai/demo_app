import { motion, type HTMLMotionProps } from 'motion/react';
import { cn } from '../ui/utils';
import { fabricRightDrawerClass, fabricRightDrawerClassWithZ } from './drawerChrome';

const defaultSpring = {
  type: 'spring' as const,
  damping: 30,
  stiffness: 300,
};

export type FabricRightDrawerSurfaceProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  maxWidth: string;
  /** `elevated` → z-[101] for stacks */
  zVariant?: 'default' | 'elevated';
  children: React.ReactNode;
};

/**
 * Animated right drawer panel with shared FabricXAI positioning and styling.
 */
export function FabricRightDrawerSurface({
  maxWidth,
  zVariant = 'default',
  className,
  children,
  initial = { x: '100%' },
  animate = { x: 0 },
  exit = { x: '100%' },
  transition = defaultSpring,
  ...motionProps
}: FabricRightDrawerSurfaceProps) {
  const shell =
    zVariant === 'elevated'
      ? fabricRightDrawerClassWithZ(maxWidth, 'z-[101]', className)
      : fabricRightDrawerClass(maxWidth, className);

  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      className={cn(shell)}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
