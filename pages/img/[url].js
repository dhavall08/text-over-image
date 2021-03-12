import { useRouter } from "next/router";
import styles from "../../styles/SelectImage.module.css";

function SelectedImage() {
  const router = useRouter();
  const { url } = router.query;

  return (
    <div>
      <img className={styles.image} src={url} alt={"abc"} />
    </div>
  );
}

export default SelectedImage;
