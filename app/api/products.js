import axios from 'axios'

export const getProducts = () => {
    return axios ({
        method: 'GET',
        url: `https://demo0336234.mockable.io/products`,
    })
}


