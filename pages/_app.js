import React from 'react';
import "../app/globals.css"
import Container from "../components/Container";
import Stepper from "../components/Stepper";

export default function App({ Component, pageProps }) {
    return (
        <Container>
            <Stepper />
            <Component {...pageProps} />
        </Container>
    )
}
