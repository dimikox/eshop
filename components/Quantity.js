import styles from "/app/page.module.css";
import React, {useEffect, useState} from 'react';
import useProducts from "../app/store/useProducts";

const Quantity = ({ quantity, setCurrentItemQuantity }) => {
    const [counter, setCounter] = useState(quantity);
    const { calculateTotalPrice, selectedProducts } = useProducts();

    const incrementCounter = () => {
        setCounter(counter + 1);
        setCurrentItemQuantity(counter)
        console.log('counter ', counter)
    };

    const decrementCounter = () => {
        if (counter > 1) {
            setCounter(counter - 1);
            setCurrentItemQuantity(counter)
            console.log('counter ', counter)
        }
    };

    useEffect(() => {
        calculateTotalPrice()
    }, [selectedProducts]);

    return (
        <div className={styles.quantityItem}>
            <span onClick={decrementCounter}>-</span>
            <div>{ counter }</div>
            <span onClick={incrementCounter}>+</span>
        </div>
    )
}

export default Quantity;
