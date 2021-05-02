import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import 'semantic-ui-css/semantic.min.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const queryClientRef = useRef();
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      if (window.gtag) {
        setTimeout(() => {
          window.gtag('event', 'page_view', {
            page_location: window.location.href,
            page_path: window.location.pathname + location.search,
          });
        }, 0);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
