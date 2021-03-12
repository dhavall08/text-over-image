import { createApi } from "unsplash-js";

const upsplashKey = process.env.UNSPLASH_ACCESS_KEY;

export default async (req, res) => {
  try {
    const unsplash = createApi({
      accessKey: upsplashKey,
    });

    const { search, filters } = req.body;
    const result = await unsplash.search.getPhotos({
      query: search,
      ...filters,
    });
    if (result.errors) {
      console.log("error occurred: ", result.errors[0]);
      res.status(500).json(result.errors[0]);
    } else {
      res.status(200).json(result.response);
    }
  } catch (e) {
    console.log("error occurred: ", e);
    res.status(500).json(e.message);
  }
};
