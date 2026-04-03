import { type ClassValue } from 'clsx';
import { cn } from '../ui/utils';

/** Matches `TopBar` (`h-16` = 4rem). All right drawers start directly under it. */
export const FABRIC_DRAWER_TOP = 'top-16';

/**
 * Matches `MainLayout` footer band (`py-2.5` + single text line). Keep in sync if footer height changes.
 * 2.5rem ≈ 40px.
 */
export const FABRIC_DRAWER_BOTTOM = 'bottom-10';

const FABRIC_DRAWER_BASE =
  'fixed right-0 w-full min-h-0 border-l border-white/10 shadow-2xl flex flex-col bg-gradient-to-br from-[#101725] to-[#182336]';

/**
 * Standard FabricXAI right detail drawer shell (fixed, z-50).
 * Use for `motion.div` and other full-height right panels.
 */
export function fabricRightDrawerClass(maxWidth: string, ...rest: ClassValue[]) {
  return cn(
    FABRIC_DRAWER_BASE,
    FABRIC_DRAWER_TOP,
    FABRIC_DRAWER_BOTTOM,
    'z-50',
    maxWidth,
    ...rest,
  );
}

/** Same shell with custom z-index (e.g. nested modals). */
export function fabricRightDrawerClassWithZ(
  maxWidth: string,
  zClass: string,
  ...rest: ClassValue[]
) {
  return cn(
    FABRIC_DRAWER_BASE,
    FABRIC_DRAWER_TOP,
    FABRIC_DRAWER_BOTTOM,
    zClass,
    maxWidth,
    ...rest,
  );
}

/**
 * Pin Radix `SheetContent` under the app `TopBar` and above the footer (overrides default `inset-y-0` / `h-full`).
 */
export function fabricSheetChromeClass(...rest: ClassValue[]) {
  return cn(
    '!top-16 !bottom-10 !h-auto !max-h-none min-h-0 flex flex-col !gap-0',
    ...rest,
  );
}

/** Right panel with custom bottom (e.g. agent co-pilot to screen bottom). */
export function fabricRightPanelClass(
  maxWidth: string,
  options: { bottom?: string; z?: string } = {},
  ...rest: ClassValue[]
) {
  return cn(
    FABRIC_DRAWER_BASE,
    FABRIC_DRAWER_TOP,
    options.bottom ?? FABRIC_DRAWER_BOTTOM,
    options.z ?? 'z-50',
    maxWidth,
    'flex flex-col',
    ...rest,
  );
}
