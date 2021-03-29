import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, memo } from "react";
import styles from "../styles/Home.module.css";

const Photo = memo(({ details, clickHandler }) => {
  const { user, urls } = details;

  return (
    <div
      className={styles.imageItem}
      tabIndex={0}
      onClick={() => clickHandler(details)}
    >
      <img className="img" src={urls.small} />
      <a
        className={styles.credit}
        target="_blank"
        href={`https://unsplash.com/@${user.username}`}
      >
        by {user.name}
      </a>
    </div>
  );
});

const initialFilter = { perPage: 10, page: 1 };

export default function Home() {
  const router = useRouter();
  const { q, page, perPage } = router.query;
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState(initialFilter);
  const [selectedImage, setSelectedImage] = useState(null);
  const [text, setText] = useState("");

  useEffect(() => {
    if (filters !== initialFilter) {
      searchQuery();
    }
  }, [filters]);

  useEffect(() => {
    if (!q) {
      setSearch("");
      setData(null);
      setFilters(initialFilter);
      return;
    }

    setSearch(q);
    searchPhotos();

    if (
      parseInt(page) &&
      parseInt(perPage) &&
      (filters.page !== parseInt(page) || filters.perPage !== parseInt(perPage))
    ) {
      setFilters({ page: parseInt(page), perPage: parseInt(perPage) });
    }
  }, [q, page, perPage]);

  function searchQuery(e) {
    e?.preventDefault();
    if (!search) {
      return;
    }

    setText("");
    router.push({
      query: {
        q: search,
        text,
        page: q !== search ? 1 : filters.page,
        perPage: filters.perPage,
      },
    });
  }

  function processImage(e) {
    e?.preventDefault();
    if (!selectedImage) {
      return;
    }

    router.push({
      pathname: "/img/[url]",
      query: { url: selectedImage?.urls?.regular || "", text },
    });
  }

  async function searchPhotos() {
    setLoading(true);
    let res = await fetch("/api/get-image", {
      method: "POST",
      body: JSON.stringify({
        search: q,
        filters: { page: parseInt(page), perPage: parseInt(perPage) },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    res = await res.json();
    setData(res);
    setLoading(false);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }

  let selectedImageView = null;
  if (selectedImage) {
    selectedImageView = (
      <div>
        <form onSubmit={processImage}>
          <p>Enter the text to add over image:</p>
          <input
            type="text"
            // className={styles.inputField}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </form>
        <p>Selected image: (click of unselect)</p>
        <Photo
          details={selectedImage}
          clickHandler={() => setSelectedImage(null)}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Image Text Creator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Add text instantly</h1>
        <p>Select a photo after searching below. Add text and download!</p>
        <div>
          <form onSubmit={searchQuery}>
            <div className={styles.inputContainer}>
              <input
                type="text"
                className={styles.inputField}
                placeholder="Search image here"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && !loading && (
                <button
                  className={styles.crossIcon}
                  type="button"
                  onClick={() => setSearch("")}
                >
                  ✕
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className={styles.searchIcon}
              >
                {loading ? "..." : "⇢"}
              </button>
            </div>
          </form>
        </div>
        {selectedImageView || (
          <>
            {data?.results?.length > 0 && (
              <p>
                Showing {data.results?.length} photos out of {data?.total}
              </p>
            )}
            <div className={styles.imageContainer}>
              {data?.results?.length < 1 && <p>No results</p>}
              {data?.results?.map((item) => (
                <Photo
                  key={item.id}
                  details={item}
                  clickHandler={setSelectedImage}
                />
              ))}
              {data?.results?.length < data?.total &&
                data?.total_pages > page && (
                  <button
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                    }
                  >
                    {loading ? "Getting..." : "Next page..."}
                  </button>
                )}
            </div>
          </>
        )}
      </main>

      <footer className={styles.footer}>
        Image Text Creator by Dhaval Laiya. Thanks to Unsplash.
      </footer>
    </div>
  );
}
