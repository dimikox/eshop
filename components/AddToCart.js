import styles from "/app/page.module.css";
import React, {useEffect, useState} from 'react';
import useProducts from "../app/store/useProducts";
import Quantity from "./Quantity";

const AddToCart = ({ product, setIsClicked, selectedProducts, isCart }) => {
    const [counter, setCounter] = useState(product?.quantity);
    const { addProductToSelected, updateProductInSelected } = useProducts();

    const addProduct = () => {
        addProductToSelected(product, counter);
        setIsClicked(true)
    };

    const updatePrice = () => {
        updateProductInSelected(product.id, counter);
    };

    const incrementCounter = () => {
        setCounter(counter + 1);
    };

    const decrementCounter = () => {
        if (counter > 1) {
            setCounter(counter - 1);
        }
    };

    useEffect(() => {
        setCounter(product?.quantity ? product?.quantity : 1);
    }, [selectedProducts]);

    return (
        <div className={styles.addToCard}>
            <div className={styles.quantityItem}>
                <span onClick={decrementCounter}>-</span>
                <div>{ counter }</div>
                <span onClick={incrementCounter}>+</span>
            </div>
            {
                isCart ? <button onClick={updatePrice}>update</button> :
                    <button onClick={addProduct}>
                        <img src="cart.png" alt="add to cart"/>
                    </button>
            }
        </div>
    )
}

export default AddToCart;
