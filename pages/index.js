import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import {
  Button,
  Card,
  Container,
  Form,
  Grid,
  Header,
  Input,
  Pagination,
  Segment,
} from 'semantic-ui-react';
import styles from '../styles/Home.module.css';

import EmojiPicker from '../common/EmojiPicker';
import Photo from '../common/Photo';
import { appName, baseTitle, PER_PAGE } from '../common/utils/helper';
import { fetchImages } from '../apis';
import { useQuery } from 'react-query';

export default function Home() {
  const router = useRouter();
  const inputRef = useRef();
  const { q, page = 1, perPage = PER_PAGE } = router.query;
  const [search, setSearch] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [text, setText] = useState('');
  const { data, isLoading, isFetching } = useQuery(
    ['images', { q, page, perPage }], // refetch on changes of variable
    () => fetchImages(q, page, perPage),
    {
      enabled: !!q, // to prevent initial call
      keepPreviousData: true, // update data only when new data arrives
      onSuccess: () => scrollToTop(),
    }
  );
  const rightPart = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    q && setSearch(q);
  }, [q]);

  function scrollToTop() {
    rightPart.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function searchQuery(e, newPage = 1) {
    e?.preventDefault();
    if (!search || !search.trim()) {
      return;
    }

    setText('');
    imageSelectionHandler(null);

    router.push({
      query: {
        q: search,
        page: newPage,
        perPage: isNaN(perPage) ? PER_PAGE : perPage,
      },
    });
  }

  function processImage(e) {
    e?.preventDefault();
    if (!selectedImage) {
      return;
    }

    router.push({
      pathname: '/img/[url]',
      query: { url: selectedImage?.urls?.regular || '', text },
    });
  }

  function selectEmoji(emoji) {
    setText((prev) => `${prev}${emoji.native}`);
  }

  function imageSelectionHandler(value) {
    setSelectedImage(value);
    scrollToTop();
  }

  let selectedImageView = null;
  if (selectedImage) {
    selectedImageView = (
      <Form onSubmit={processImage}>
        <Segment.Group>
          <Segment>
            <Button
              labelPosition="left"
              content="Back"
              icon="left arrow"
              type="button"
              onClick={() => imageSelectionHandler(null)}
            />
          </Segment>
          <Segment>
            <Form.Field>
              <label>Enter the text to add over image:</label>
              <textarea
                autoFocus
                placeholder="Your text..."
                rows={2}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <EmojiPicker selectEmoji={selectEmoji} />
            </Form.Field>
            <Form.Field>
              <label>Selected image:</label>
              <div style={{ maxWidth: '180px' }}>
                <Photo details={selectedImage} />
              </div>
            </Form.Field>
          </Segment>
          <Segment textAlign="right">
            <Button type="submit" primary size="massive">
              Generate Image
            </Button>
          </Segment>
        </Segment.Group>
      </Form>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{baseTitle}</title>
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
                  <Form onSubmit={(e) => searchQuery(e, 1)}>
                    <Input
                      fluid
                      ref={inputRef}
                      // disabled={isLoading || isFetching}
                      loading={isLoading || isFetching}
                      action={{ icon: 'search' }}
                      placeholder="Search image here..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    {/* <Button
                      floated="right"
                      icon="close"
                      disabled={isLoading}
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
                {selectedImageView || (
                  <Segment.Group>
                    <Segment loading={isLoading || isFetching} padded="very">
                      <span ref={rightPart} />
                      {data?.results?.length > 0 && (
                        <p>
                          Showing {(page - 1) * perPage + 1} to{' '}
                          {page * perPage > data.total
                            ? data.total
                            : page * perPage}{' '}
                          photos out of {data.total}
                        </p>
                      )}
                      <Card.Group itemsPerRow={4} stackable>
                        {data?.results?.length >= 1 ? (
                          data?.results?.map((item) => (
                            <Photo
                              key={item.id}
                              details={item}
                              clickHandler={imageSelectionHandler}
                            />
                          ))
                        ) : (
                          <p>{q ? 'No results.' : 'Search something!'}</p>
                        )}
                      </Card.Group>
                    </Segment>
                    {data?.results?.length < data?.total && (
                      <Segment textAlign="right">
                        <Pagination
                          activePage={page}
                          boundaryRange={0}
                          ellipsisItem={null}
                          prevItem={null}
                          nextItem={null}
                          siblingRange={1}
                          totalPages={data.total_pages}
                          onPageChange={(e, data) => {
                            searchQuery(undefined, data.activePage);
                            /* setFilters((prev) => ({
                              ...prev,
                              page: data.activePage,
                            })); */
                          }}
                        />
                      </Segment>
                    )}
                  </Segment.Group>
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </main>

      <footer className={styles.footer}>
        {baseTitle} by&nbsp;
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://github.com/dhavall08`}
        >
          Dhaval Laiya
        </a>
        . Thanks to&nbsp;
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://unsplash.com/?utm_source=${appName}&utm_medium=referral`}
        >
          Unsplash
        </a>
        .
      </footer>
    </div>
  );
}
