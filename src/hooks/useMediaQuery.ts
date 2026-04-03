import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = () => setMatches(mq.matches);
    mq.addEventListener('change', handler);
    setMatches(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/** Viewports below this are treated as “mobile / small tablet” for ERP layout */
export const MOBILE_ERP_BREAKPOINT = '(max-width: 1023px)';

export function useIsMobileErpLayout() {
  return useMediaQuery(MOBILE_ERP_BREAKPOINT);
}
