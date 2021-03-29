import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import styles from "../../styles/SelectImage.module.css";

function SelectedImage() {
  const router = useRouter();
  const finalImage = useRef();
  const selectedImage = useRef();
  const imgCanvas = useRef();
  const { url, text } = router.query;

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.addEventListener(
      "load",
      () => {
        const canvas = imgCanvas.current;
        let context = canvas.getContext("2d");

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
          saveAs(blob, "just-downloaded-image.png");
        });
      });
  }

  return (
    <div style={{ textAlign: "center" }}>
      <button className={styles.downloadBtn} onClick={downloadImage}>
        Download Generated Image
      </button>
      <div ref={finalImage} className={styles.renderImg}>
        <p className={styles.renderText}>{text}</p>
        <canvas ref={imgCanvas} className={styles.image} />
      </div>
    </div>
  );
}

export default SelectedImage;
