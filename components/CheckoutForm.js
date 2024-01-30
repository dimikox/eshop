import React, { useState } from 'react'
import styles from "../app/page.module.css";
import ProductsList from "./ProductsList";

const CheckoutForm = () => {
    const [nameError, setNameError] = useState('');
    const [numberError, setNumberError] = useState('');
    const [dateError, setDateError] = useState('');
    const [cvvError, setCvvError] = useState('');

    const [showSuccess, setShowSuccess] = useState(false);

    const [card, setCard] = useState({
        name: '',
        number: '',
        date: '',
        cvv: ''
    })

    const validateForm = (cardholderName, cardNumber, cvv, expirationDate) => {
        const today = getCurrentDate();

        const cardNumberRegex = /^(?:\d\s*){16}$/;
        const cardholderNameRegex = /^[A-Za-z\s]+$/;
        const cvvRegex = /^\d{3,4}$/;

        // Reset error messages
        setNameError('');
        setNumberError('');
        setDateError('');
        setCvvError('');

        // Check for empty fields and display error messages
        if (!cardholderName.trim()) {
            setNameError('Required field');
            return false;
        } else if (!cardholderNameRegex.test(cardholderName)) {
            setNameError('Card name field allows only letters and spaces.');
            return false;
        }

        if (!cardNumber.trim()) {
            setNumberError('Required field');
            return false;
        } else if (!cardNumberRegex.test(cardNumber)) {
            setNumberError('Card number field allows only 16 digits and spaces.');
            return false;
        }

        if (!expirationDate.trim()) {
            setDateError('Required field');
            return false;
        } else if (compareDates(expirationDate, today) === 'older') {
            setDateError('Card expired date field allows only future dates.');
            return false;
        }

        if (!cvv.trim()) {
            setCvvError('Required field');
            return false;
        } else if (!cvvRegex.test(cvv)) {
            setCvvError('CVV field allows only 3 or 4 digits.');
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('card ', card)

        const isValid = validateForm(
            card.name,
            card.number,
            card.cvv,
            card.date
        );

        if (isValid) {
            setShowSuccess(true)
        } else {
            console.log("Form is invalid");
        }
    };

    const numberFormat = (value) => {
        const v = value.replace(/[^0-9]/gi, '').substr(0, 16);

        const parts = [];
        for (let i = 0; i < v.length; i += 4) {
            parts.push(v.substr(i, 4));
        }

        return parts.join(' ');
    };

    const dateFormat = (value) => {
        const expdate = value
        const expDateFormatter =
            expdate.replace(/\//g, '').substring(0, 2) +
            (expdate.length > 2 ? '/' : '') +
            expdate.replace(/\//g, '').substring(2, 4)

        return expDateFormatter
    }

    const getCurrentDate = () => {
        const currentDate = new Date();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = (currentDate.getFullYear() % 100).toString().padStart(2, '0'); // Get last two digits of the year
        return `${month}/${year}`;
    };

    const compareDates = (date1, date2) => {
        const [month1, year1] = date1.split('/');
        const [month2, year2] = date2.split('/');

        const jsDate1 = new Date(`20${year1}`, month1 - 1, 1); // Months are zero-based
        const jsDate2 = new Date(`20${year2}`, month2 - 1, 1);

        if (jsDate1.getTime() < jsDate2.getTime()) {
            return 'older';
        } else if (jsDate1.getTime() > jsDate2.getTime()) {
            return 'future';
        }
    };

    return (
        <div className={styles.form}>
            {
                showSuccess ?
                    <div className={styles.success}>Your order has been successfully processed.</div> :
                    null
            }
            <h1>Card Details</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name on Card:</label>
                    <input
                        type="text"
                        placeholder=""
                        onChange={(e) =>
                            setCard({
                                ...card,
                                name: e.target.value,
                            })
                        }
                    />
                    {
                        nameError ? <div className={styles.error}>{nameError}</div> : null
                    }
                </div>
                <div>
                    <label>Card Number:</label>
                    <input
                        type="text"
                        data-mask="0000 0000 0000 0000"
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        value={numberFormat(card.number)}
                        onChange={(e) =>
                            setCard({
                                ...card,
                                number: e.target.value,
                            })
                        }
                    />
                    {
                        numberError ? <div className={styles.error}>{numberError}</div> : null
                    }
                </div>
                <div>
                    <div>
                        <label>Expiry date:</label>
                        <input
                            type="text"
                            name="expiry-data"
                            placeholder="mm / yy"
                            onChange={(e) =>
                                setCard({
                                    ...card,
                                    date: e.target.value,
                                })
                            }
                            value={dateFormat(card.date)}
                        />
                        {
                            dateError ? <div className={styles.error}>{dateError}</div> : null
                        }
                    </div>
                    <div>
                        <label>Cvv:</label>
                        <input
                            type="password"
                            data-mask="000"
                            placeholder="000"
                            maxLength={3}
                            pattern="[0-9][0-9][0-9]"
                            onChange={(e) =>
                                setCard({
                                    ...card,
                                    cvv: e.target.value,
                                })
                            }
                        />
                        {
                            cvvError ? <div className={styles.error}>{cvvError}</div> : null
                        }
                    </div>
                </div>
                <input className={styles.submit} type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default CheckoutForm;
