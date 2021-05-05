import { createApi } from 'unsplash-js';

const upsplashKey = process.env.UNSPLASH_ACCESS_KEY;

export default async (req, res) => {
  try {
    const unsplash = createApi({
      accessKey: upsplashKey,
    });

    if (!req.body.photo_id) {
      return res.status(404).json('No photos selected.');
    }

    const result = await unsplash.photos.get({ photoId: req.body.photo_id });
    if (result.errors) {
      console.log('error occurred: ', result.errors[0]);
      return res.status(500).json(result.errors[0]);
    }

    if (result.type === 'success') {
      const photo = result.response;
      const triggerResult = await unsplash.photos.trackDownload({
        downloadLocation: photo.links.download_location,
      });
      return res.send(triggerResult);
    }

    res.send(result);
  } catch (e) {
    console.log('error occurred: ', e);
    res.status(500).json(e.message);
  }
};
