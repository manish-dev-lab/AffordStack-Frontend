import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Universal ScrollToTop component:
 * When navigating to any route (or changing URL query params),
 * resets window scroll to the top (0, 0), preventing previous page's
 * scroll position from bleeding into newly opened pages.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
