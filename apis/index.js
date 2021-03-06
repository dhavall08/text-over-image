import { PER_PAGE } from '../common/utils/helper';

export const fetchImages = async (q = '', page = 1, perPage = PER_PAGE) => {
  const hasAbsoluteURL = typeof window === 'undefined'; // when calling server side

  const searchParams = new URLSearchParams({
    search: q,
    page: isNaN(page) ? 1 : parseInt(page),
    perPage: isNaN(perPage) ? PER_PAGE : parseInt(perPage),
  }).toString();

  const apiURL = hasAbsoluteURL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/get-image?${searchParams}`
    : `/api/get-image?${searchParams}`;

  const res = await fetch(apiURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res.json();
};

export const sendDownloadCount = async (id) => {
  const apiURL = '/api/trigger-download';
  const res = await fetch(apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ photo_id: id }),
  });

  return res.json();
};
