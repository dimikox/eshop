import styles from "../app/page.module.css";
import ProductsList from '../components/ProductsList';

export default function Home() {

  return (
      <main className={styles.main}>
          <ProductsList />
      </main>
  );
}
