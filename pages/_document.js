import Document, { Html, Head, Main, NextScript } from 'next/document';
import Router from 'next/router';

Router.onRouteChangeComplete = () => {
  if (window.gtag) {
    setTimeout(() => {
      // GA4
      window.gtag('event', 'page_view', {
        page_location: window.location.href,
        page_path: window.location.pathname + location.search,
      });
    }, 0);
  }
};

export default class extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_ANALYTICS_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_ANALYTICS_ID}');
          `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
