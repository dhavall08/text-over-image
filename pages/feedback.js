import Head from 'next/head';
import { getTitle } from '../common/utils/helper';

const metaDesc =
  'Hey, I would love to hear your thoughts or feedback on how I can improve your experience.';

const feedbackFormID =
  '1FAIpQLSeVilvV6pa7ruyjLG1o8Rib0v3BHCiqPTXTfLaTJNk1VFDqcQ';

function feedback() {
  return (
    <div>
      <Head>
        <title>{getTitle('Feedback')}</title>
        <meta property="og:title" content={getTitle('Feedback')} />
        <meta property="og:title" content={getTitle('Feedback')} />
        <meta name="description" content={metaDesc} />
        <meta property="og:description" content={metaDesc} />
        <meta property="twitter:description" content={metaDesc} />
      </Head>
      <iframe
        src={`https://docs.google.com/forms/d/e/${feedbackFormID}/viewform?embedded=true`}
        style={{ height: '98vh', width: '100%' }}
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
      >
        Loading…
      </iframe>
    </div>
  );
}

export default feedback;
