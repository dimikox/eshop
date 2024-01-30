import styles from "../app/page.module.css";
import useProducts from "../app/store/useProducts";
import CentsToEuro from "../utils/centsToEuro";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import AddToCart from "../components/AddToCart";
import couponList from "../mock/coupon.json";

export default function Cart() {
  const [inputValue, setInputValue] = useState('');
  const [couponMessage, setCouponMessage] = useState();
  const {
      selectedProducts,
      removeProductFromSelected,
      calculateCoupon,
      removeCoupon
  } = useProducts();

    const removeItem = (id) => {
        removeProductFromSelected(id)
    }

    useEffect(() => {
    }, [selectedProducts]);

    const checkCoupon = () => {
        const couponItem = couponList.find(item => item.name === inputValue);

        if (couponItem) {
            setCouponMessage('');
            if (couponItem.name === "SUMMER" && selectedProducts.total < 300) {
                setCouponMessage('Minimum purchase of 5€ required for discount.');
            } else if (couponItem.name === "ILIKEAPPLES"
                && selectedProducts.products.every(
                    product => !product.name.toLowerCase().includes('apple')
                )) {
                setCouponMessage('None of your selected products include items eligible for this discount.');
            } else if (couponItem.name === "ILIKEPEARS"
                && selectedProducts.products.every(
                    product => !product.name.toLowerCase().includes('pear')
                )) {
                setCouponMessage('None of your selected products include items eligible for this discount.');
            } else if (couponItem.name === "GREEN"
                && selectedProducts.products.every(
                    product => !(product.name.toLowerCase().includes('pear') || product.name.toLowerCase().includes('avocado'))
                )) {
                setCouponMessage('None of your selected products include items eligible for this discount.');
            } else {
                calculateCoupon(couponItem.name, couponItem.discount);
            }
        } else {
            setCouponMessage('Coupon not found');
        }
    };

  return (
    <main className={styles.main}>
        {
            selectedProducts?.products?.length > 0 ?
                <div>
                    <div className={styles.wrapperTable}>
                        <div>
                            <table className={styles.cartTable}>
                                <thead>
                                <tr>
                                    <th></th>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    selectedProducts?.products?.map((selectedProduct, index) => {
                                        return (
                                            <tr key={selectedProduct?.id}>
                                                <td>
                                                    <button className={styles.remove} onClick={() => removeItem(selectedProduct.id)}>
                                                        <img src="close.png" alt="close mini cart"/>
                                                    </button>
                                                </td>
                                                <td>{selectedProduct?.name}</td>
                                                <td>{CentsToEuro(selectedProduct?.singlePrice)}€</td>
                                                <td>
                                                    <AddToCart
                                                        product={selectedProduct}
                                                        selectedProducts={selectedProducts}
                                                        isCart={true}
                                                    />
                                                </td>
                                                <td>{CentsToEuro(selectedProduct?.price)}€</td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {
                        selectedProducts?.products?.length > 0 ?
                            <div>
                                <div className={styles.totalCouponWrapper}>
                                    <div className={styles.coupon}>
                                        {
                                            selectedProducts?.coupon?.exist ?
                                                <div>
                                                    <div className={styles.acceptedCoupon}>{selectedProducts?.coupon?.discount}</div>
                                                    <div className={styles.removeCoupon} onClick={() => removeCoupon(selectedProducts?.coupon?.name)}>
                                                        <img src="close.png" alt="remove coupon"/>
                                                    </div>
                                                </div> :
                                                <div>
                                                    <input
                                                        type="text"
                                                        name="coupon"
                                                        placeholder="coupon"
                                                        value={inputValue}
                                                        onChange={(e) => setInputValue(e.target.value)}
                                                    />
                                                    <button onClick={() => checkCoupon()}>APPLY</button>
                                                </div>
                                        }
                                        <div className={styles.errorCoupon}>{couponMessage}</div>
                                    </div>
                                    <div className={styles.totalCartPage}>
                                        {
                                            selectedProducts?.coupon?.exist ?
                                                <div className={styles.oldTotalPrice}>{CentsToEuro(selectedProducts.price_before_discount)}€</div> :
                                                null
                                        }
                                        <div>{CentsToEuro(selectedProducts?.total)}€</div>
                                    </div>
                                </div>
                                <div className={styles.goToBtn}>
                                    <Link href="/checkout">Checkout</Link>
                                </div>
                            </div> : null
                    }
                </div> : 'No items'
        }

    </main>
  );
}
