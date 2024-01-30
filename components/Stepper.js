import styles from "/app/page.module.css";
import Link from "next/link";
import { useRouter } from 'next/router';

const Stepper = () => {
    const router = useRouter();

    const isActive = (path) => router.pathname === path ? styles.active : '';

    return (
        <div className={styles.stepper}>
            <div className={isActive('/')}>
                <Link href="/">
                    <div>1</div>
                    <div>Catalog</div>
                </Link>
            </div>
            <div className={isActive('/cart')}>
                <Link href="/cart">
                    <div>2</div>
                    <div>Cart</div>
                </Link>
            </div>
            <div className={isActive('/checkout')}>
                <Link href="/checkout">
                    <div>3</div>
                    <div>Checkout</div>
                </Link>
            </div>
        </div>
    )
}

export default Stepper;
