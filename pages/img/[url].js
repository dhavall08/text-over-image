import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { Button, Container, Icon, Loader } from 'semantic-ui-react';
import Head from 'next/head';
import { getTitle } from '../../common/utils/helper';
import TextTweaker from '../../common/TextTweaker';
import { useMutation } from 'react-query';
import { sendDownloadCount } from '../../apis';

const initStyle = {
  fontSize: 'calc(1.8vw + 1vh)',
  color: '#000000',
  backgroundColor: '#ffffff8c',
};

function SelectedImage() {
  const router = useRouter();
  const finalImage = useRef();
  const selectedImage = useRef();
  const imgCanvas = useRef();
  const [textStyle, setTextStyle] = useState(initStyle);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const callDownloadCount = useMutation(sendDownloadCount);
  const { url, text, id } = router.query;

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.addEventListener(
      'load',
      () => {
        const canvas = imgCanvas.current;
        const context = canvas.getContext('2d');

        canvas.width = image.width;
        canvas.height = image.height;

        context.drawImage(image, 0, 0);
        setError(false);
        setLoaded(true);
      },
      false
    );

    image.addEventListener('error', (e) => {
      console.log(e);
      setLoaded(true);
      setError(true);
    });

    image.src = url;
    selectedImage.current = image;
  }, [url]);

  const changeHandler = useCallback((cssProp, cssValue) => {
    if (cssProp === 'reset') {
      setTextStyle(initStyle);
      return;
    }
    setTextStyle((prev) => ({ ...prev, [cssProp]: cssValue }));
  }, []);

  function downloadImage() {
    // to prevent white space, used previous version: 1.0.0-alpha.12 of html2canvas
    setLoading(true);
    finalImage.current &&
      html2canvas(finalImage.current, { logging: false }).then(function (
        canvas
      ) {
        canvas?.toBlob(function (blob) {
          trackDownload(); // update unsplash about a download
          saveAs(blob, `image-${new Date().toISOString()}.png`);
          setLoading(false);
        });
      });
  }

  function trackDownload() {
    if (!id) {
      return;
    }

    callDownloadCount.mutate(id);
  }

  return (
    <Container>
      <Head>
        <title>{getTitle('Generate Image')}</title>
      </Head>
      <div className="download-btn">
        <Button
          labelPosition="left"
          content="Back to home"
          icon="left arrow"
          onClick={() => router.back()}
        />
        <Button
          size="huge"
          positive
          animated="fade"
          disabled={!loaded}
          loading={loading}
          onClick={downloadImage}
        >
          <Button.Content visible>Download Image</Button.Content>
          <Button.Content hidden>
            <Icon name="download" />
          </Button.Content>
        </Button>
      </div>
      {!loaded && <Loader active inline="centered" />}
      {error && (
        <p>
          Oops! Something went wrong while loading image. Try with a different
          image.
        </p>
      )}
      <div ref={finalImage} className="render-img">
        <p className="render-text" style={textStyle}>
          {text}
        </p>
        <canvas ref={imgCanvas} className="canvas-image" />
      </div>
      <div className="sticky-panel">
        <TextTweaker changeHandler={changeHandler} values={textStyle} />
      </div>
    </Container>
  );
}

export default SelectedImage;
