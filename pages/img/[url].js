import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import styles from '../../styles/SelectImage.module.css';
import { Button, Container, Icon, Loader } from 'semantic-ui-react';
import Head from 'next/head';
import { getTitle } from '../../common/utils/helper';

function SelectedImage() {
  const router = useRouter();
  const finalImage = useRef();
  const selectedImage = useRef();
  const imgCanvas = useRef();
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { url, text } = router.query;

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
        setLoaded(true);
      },
      false
    );
    image.src = url;
    selectedImage.current = image;
  }, [url]);

  function downloadImage() {
    // to prevent white space, used previous version: 1.0.0-alpha.12 of html2canvas
    setLoading(true);
    finalImage.current &&
      html2canvas(finalImage.current).then(function (canvas) {
        canvas?.toBlob(function (blob) {
          saveAs(blob, `image-${new Date().toISOString()}.png`);
          setLoading(false);
        });
      });
  }

  return (
    <Container>
      <Head>
        <title>{getTitle('Generated Image')}</title>
      </Head>
      <div className={styles.downloadBtn}>
        <Button
          labelPosition="left"
          content="Back"
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
          <Button.Content visible>Download Generated Image</Button.Content>
          <Button.Content hidden>
            <Icon name="download" />
          </Button.Content>
        </Button>
      </div>
      {!loaded && <Loader active inline="centered" />}
      <div ref={finalImage} className={styles.renderImg}>
        <p className={styles.renderText}>{text}</p>
        <canvas ref={imgCanvas} className={styles.image} />
      </div>
    </Container>
  );
}

export default SelectedImage;
