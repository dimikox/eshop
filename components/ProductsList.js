import styles from "../app/page.module.css";
import React, { useEffect, useState } from 'react';
import useProducts from "../app/store/useProducts";
import CentsToEuro from '/utils/centsToEuro';
import AddToCart from "./AddToCart";
import MiniCart from "./MiniCart";

const ProductsList = () => {
    const { products, data, selectedProducts } = useProducts();
    const [hoveredItem, setHoveredItem] = useState(null);
    const [isClicked, setIsClicked] = useState(false);

    const handleMouseEnter = (productId) => {
        setHoveredItem(productId);
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
    };

    useEffect(() => {
        products();
    }, []);

    return (
        <div>
            <button className={styles.openMiniCart} onClick={() => setIsClicked(true)}>
                <span>{selectedProducts?.products?.length}</span>
                <img src="cart.png" alt="open cart"/>
            </button>
            <div className={styles.grid}>
                {
                    data?.map((product, index) => {
                        return (
                            <div
                                key={product.id}
                                className={`${styles.productCard} ${hoveredItem === product.id ? styles.show : ''}`}
                                onMouseEnter={() => handleMouseEnter(product.id)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className={styles.productImgWrapper}>
                                    <img src="fruits.jpeg" alt="product image" />
                                    <AddToCart
                                        product={product}
                                        setIsClicked={setIsClicked}
                                        selectedProducts={selectedProducts}
                                    />
                                </div>
                                <div className={styles.productCardContent}>
                                    <div>{product.name}</div>
                                    <div>{CentsToEuro(product?.price)}€</div>
                                </div>

                            </div>
                        )
                    })
                }

                <MiniCart setIsClicked={setIsClicked} isClicked={isClicked} />
            </div>
        </div>
    );
}

export default ProductsList;
