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
  List,
  Pagination,
  Segment,
} from 'semantic-ui-react';

import EmojiPicker from '../common/EmojiPicker';
import Photo from '../common/Photo';
import { appName, baseTitle, PER_PAGE } from '../common/utils/helper';
import { fetchImages } from '../apis';
import { useQuery } from 'react-query';
import quotes from '../constants/inspirations.json';

export default function Home() {
  const router = useRouter();
  const inputRef = useRef();
  const { q, page = 1, perPage = PER_PAGE } = router.query;
  const [search, setSearch] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const { data, isLoading, isFetching } = useQuery(
    ['images', { q, page, perPage }], // refetch on changes of variable
    () => fetchImages(q, page, perPage),
    {
      enabled: !!q, // to prevent initial call
      keepPreviousData: true, // update data only when new data arrives
      onSuccess: () => scrollToTop(),
      refetchOnWindowFocus: false,
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

  function clearSearch() {
    setSearch('');
    inputRef.current?.focus();
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

    if (!selectedImage || !text.trim()) {
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

  function generateQuote() {
    const random = Math.floor(Math.random() * quotes.length);
    const text = quotes[random].text;
    const author = quotes[random].author;
    setText(author ? `${text} \n— ${author}` : text);
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
                required
                placeholder="Your text..."
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <Button
                basic
                labelPosition="left"
                color="green"
                content="Inspirational Quote"
                icon="quote left"
                type="button"
                onClick={generateQuote}
              />
              <Button
                basic
                labelPosition="left"
                color="purple"
                content={open ? 'Close Emoji' : 'Add Emoji'}
                icon={open ? 'close' : 'plus'}
                type="button"
                onClick={() => setOpen((prev) => !prev)}
              />
            </Form.Field>
            <Form.Field>
              <EmojiPicker open={open} selectEmoji={selectEmoji} />
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
    <div className="container-app">
      <Head>
        <title>{baseTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <Container fluid>
          <Grid>
            <Grid.Row>
              <Grid.Column computer={4} mobile={16} tablet={5}>
                <div className="left-part">
                  <Header
                    as="h1"
                    content="Text over Image"
                    subheader="by Dhaval Laiya"
                  />
                  <List divided ordered relaxed="very" size="large">
                    <List.Item>
                      <List.Content>
                        <List.Header>Search images:</List.Header>
                        <List.Description>
                          <Form
                            className="search-form"
                            onSubmit={(e) => searchQuery(e, 1)}
                          >
                            <Input
                              fluid
                              ref={inputRef}
                              required
                              loading={isLoading || isFetching}
                              action={{
                                icon: !isLoading && !isFetching && 'search',
                              }}
                              placeholder="Search image here..."
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                            />
                            {search !== '' && (
                              <i
                                tabIndex={0}
                                aria-hidden="true"
                                className="close icon"
                                onClick={clearSearch}
                              />
                            )}
                          </Form>
                        </List.Description>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Icon name="mouse pointer" verticalAlign="middle" />
                      <List.Content>
                        <List.Description>Select an image.</List.Description>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Icon name="text cursor" verticalAlign="middle" />
                      <List.Content>
                        <List.Description>
                          Write/Generate text with emoji.
                        </List.Description>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Icon name="download" verticalAlign="middle" />
                      <List.Content>
                        <List.Description>Download image!</List.Description>
                      </List.Content>
                    </List.Item>
                  </List>
                </div>
              </Grid.Column>
              <Grid.Column computer={12} mobile={16} tablet={11}>
                <div className="right-part">
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
                            images out of {data.total}
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
                            }}
                          />
                        </Segment>
                      )}
                    </Segment.Group>
                  )}
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </main>

      <footer className="footer">
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
