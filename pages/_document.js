import Document, { Html, Head, Main, NextScript } from 'next/document';

const metaDesc =
  'Create social media post with your text over any of the large stock photos. Download and share easily. Create morning WhatsApp status, birthday status, motivational facebook images and lot more.';

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
          <meta property="og:title" content="Text over image by Dhaval Laiya" />
          <meta
            property="twitter:title"
            content="Text over image by Dhaval Laiya"
          />
          <meta name="description" content={metaDesc} />
          <meta property="og:description" content={metaDesc} />
          <meta property="twitter:description" content={metaDesc} />
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
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
