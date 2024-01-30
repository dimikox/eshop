import styles from "/app/page.module.css";
import React, { useEffect, useState } from 'react';
import useProducts from "../app/store/useProducts";
import CentsToEuro from '/utils/centsToEuro';
import Link from 'next/link'

const MiniCart = ({ setIsClicked, isClicked }) => {
    const { selectedProducts, removeProductFromSelected } = useProducts();

    const closeMiniCart = () => {
        setIsClicked(false)
    }

    const removeItem = (id) => {
        removeProductFromSelected(id)
    }

    return (
        <div className={`${styles.sidebar} ${isClicked ? styles.show : ''}`}>
            <button className={styles.close} onClick={closeMiniCart}>
                <img src="close.png" alt="close mini cart"/>
            </button>
            {
                selectedProducts?.products?.length > 0 ?
                    <div className={styles.itemWrapper}>
                        {
                            selectedProducts?.products?.map((selectedProduct, index) => {
                                return (
                                    <div key={selectedProduct.id} className={styles.itemContent}>
                                        <div className={styles.name}>{selectedProduct.name}</div>
                                        <div className={styles.price}>
                                            <div>Price:</div>
                                            <div>{CentsToEuro(selectedProduct?.price)}€</div>
                                        </div>
                                        <div className={styles.quantity}>
                                            <div>Quantity</div>
                                            <div>{selectedProduct.quantity}Kg</div>
                                        </div>
                                        <button className={styles.remove} onClick={() => removeItem(selectedProduct.id)}>
                                            <img src="close.png" alt="close mini cart"/>
                                        </button>
                                    </div>
                                )
                            })
                        }
                    </div>:
                    <div>No items</div>
            }

            {
                selectedProducts?.products?.length > 0 ?
                    <div>
                        {
                            selectedProducts?.coupon?.exist ?
                                <div className={styles.hasCouponMiniCart}>
                                    <div>{selectedProducts?.coupon?.discount}</div>
                                    <div className={styles.oldTotalPrice}>{CentsToEuro(selectedProducts.price_before_discount)}€</div>
                                </div> :
                                null
                        }
                        <div className={styles.total}>
                            <div>Total:</div>
                            <div>{CentsToEuro(selectedProducts?.total)}€</div>
                        </div>

                        <div className={styles.btnWrapper}>
                            <Link href="/cart">Cart</Link>
                            <Link href="/checkout">Checkout</Link>
                        </div>
                    </div> : null
            }


        </div>
    )
};

export default MiniCart;
