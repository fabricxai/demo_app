import { useParams } from 'react-router';

/**
 * For routes like `/crm/leads/:subpage`, use the URL segment as the active subpage.
 * On the index route (`/crm/leads` with no param), use the prop from the router element.
 */
export function useRouteSubpage(
  fallback: string,
  propInitial?: string,
): string {
  const { subpage } = useParams<{ subpage?: string }>();
  if (subpage != null && subpage !== '') {
    return subpage;
  }
  return propInitial ?? fallback;
}
