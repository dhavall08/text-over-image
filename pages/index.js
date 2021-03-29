import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, memo, useRef } from "react";
import {
  Button,
  Card,
  Container,
  Form,
  Grid,
  Header,
  Icon,
  Image,
  Input,
  Pagination,
  Segment,
} from "semantic-ui-react";
import styles from "../styles/Home.module.css";

const Photo = memo(({ details, clickHandler = () => {} }) => {
  const { user, urls } = details;

  return (
    <Card onClick={() => clickHandler(details)}>
      <Image wrapped ui={false} src={urls.small} />
      <Card.Content extra>
        <Icon name="user" />
        {user.name}
      </Card.Content>
    </Card>
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
  const rightPart = useRef();

  function scrollToTop() {
    rightPart.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToTop();
  }, [selectedImage]);

  useEffect(() => {
    if (filters !== initialFilter) {
      scrollToTop();
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
    setSelectedImage(null);

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
      <>
        <Segment>
          <Button
            icon
            labelPosition="left"
            content="Back"
            icon="left arrow"
            onClick={() => setSelectedImage(null)}
          />
        </Segment>
        <Segment>
          <Form onSubmit={processImage}>
            <Form.Field>
              <label>Enter the text to add over image:</label>
              <textarea
                placeholder="Your text..."
                rows={2}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <label>Selected image:</label>
              <Photo details={selectedImage} />
            </Form.Field>
            <Button type="submit" primary>
              Generate
            </Button>
          </Form>
        </Segment>
      </>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Image Text Creator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Container fluid>
          <Grid>
            <Grid.Row>
              <Grid.Column
                computer={4}
                mobile={16}
                tablet={5}
                className={styles.leftPart}
              >
                <Header
                  as="h1"
                  content="Text over Image"
                  subheader="Select a photo after searching below. Add text and download!"
                />
                <div>
                  <Form onSubmit={searchQuery}>
                    <Input
                      fluid
                      disabled={loading}
                      loading={loading}
                      action={{ icon: "search" }}
                      placeholder="Search image here..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    {/* <Button
                      floated="right"
                      icon="close"
                      disabled={loading}
                      onClick={() => setSearch("")}
                    /> */}
                  </Form>
                </div>
              </Grid.Column>
              <Grid.Column
                computer={12}
                mobile={16}
                tablet={11}
                className={styles.rightPart}
              >
                <Segment.Group>
                  {selectedImageView || (
                    <>
                      <Segment loading={loading} padded="very">
                        <span ref={rightPart} />
                        {data?.results?.length > 0 && (
                          <p>
                            Showing {(page - 1) * perPage + 1} to{" "}
                            {page * perPage > data.total
                              ? data.total
                              : page * perPage}{" "}
                            photos out of {data.total}
                          </p>
                        )}
                        <Card.Group itemsPerRow={4} stackable>
                          {data?.results?.length < 1 ? (
                            <p>No results</p>
                          ) : (
                            data?.results?.map((item) => (
                              <Photo
                                key={item.id}
                                details={item}
                                clickHandler={setSelectedImage}
                              />
                            ))
                          )}
                        </Card.Group>
                      </Segment>
                      {data?.results?.length < data?.total && (
                        <Segment textAlign="right">
                          <Pagination
                            activePage={page}
                            boundaryRange={0}
                            ellipsisItem={null}
                            siblingRange={1}
                            totalPages={data.total_pages}
                            onPageChange={(e, data) => {
                              setFilters((prev) => ({
                                ...prev,
                                page: data.activePage,
                              }));
                            }}
                          />
                        </Segment>
                      )}
                    </>
                  )}
                </Segment.Group>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </main>

      <footer className={styles.footer}>
        Image Text Creator by Dhaval Laiya. Thanks to Unsplash.
      </footer>
    </div>
  );
}
