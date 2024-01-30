import styles from "../app/page.module.css";
import CheckoutForm from "../components/CheckoutForm";

export default function Cart() {

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <CheckoutForm />
      </div>
    </main>
  );
}
