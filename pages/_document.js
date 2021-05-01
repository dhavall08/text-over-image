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
          <meta property="og:title" content="Text over image" />
          <meta property="twitter:title" content="Text over image" />
          <meta
            name="description"
            content="Create social media post with your text over any of the large stock photos. Download and share easily."
          />
          <meta
            property="og:description"
            content="Create social media post with your text over any of the large stock photos. Download and share easily."
          />
          <meta
            property="twitter:description"
            content="Create social media post with your text over any of the large stock photos. Download and share easily."
          />
          <meta
            property="og:image"
            content={`${process.env.URL}/og-image.jpg`}
          />
          <meta
            property="twitter:image"
            content={`${process.env.URL}/og-image.jpg`}
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="627" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
