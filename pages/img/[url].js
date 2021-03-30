import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import styles from '../../styles/SelectImage.module.css';
import { Button, Container, Icon } from 'semantic-ui-react';

function SelectedImage() {
  const router = useRouter();
  const finalImage = useRef();
  const selectedImage = useRef();
  const imgCanvas = useRef();
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
      },
      false
    );
    image.src = url;
    selectedImage.current = image;
  }, [url]);

  function downloadImage() {
    finalImage.current &&
      html2canvas(finalImage.current).then(function (canvas) {
        canvas?.toBlob(function (blob) {
          saveAs(blob, `image-${new Date().toISOString()}.png`);
        });
      });
  }

  return (
    <Container>
      <div className={styles.downloadBtn}>
        <Button positive animated="fade" onClick={downloadImage}>
          <Button.Content visible>Download Generated Image</Button.Content>
          <Button.Content hidden>
            <Icon name="download" />
          </Button.Content>
        </Button>
      </div>
      <div ref={finalImage} className={styles.renderImg}>
        <p className={styles.renderText}>{text}</p>
        <canvas ref={imgCanvas} className={styles.image} />
      </div>
    </Container>
  );
}

export default SelectedImage;
