import { PER_PAGE } from '../common/utils/helper';

export const fetchImages = async (q = '', page = 1, perPage = PER_PAGE) => {
  const hasAbsoluteURL = typeof window === 'undefined'; // when server side calling

  const searchParams = new URLSearchParams({
    search: q,
    page: isNaN(page) ? 1 : parseInt(page),
    perPage: isNaN(perPage) ? PER_PAGE : parseInt(perPage),
  }).toString();

  const apiURL = hasAbsoluteURL
    ? `${process.env.API_URL}/api/get-image?${searchParams}`
    : `/api/get-image?${searchParams}`;

  const res = await fetch(apiURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res.json();
};
