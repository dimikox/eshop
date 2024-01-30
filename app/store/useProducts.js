import create from "zustand";
import generateUniqueId from "../../utils/uniqueId";
import { getProducts } from "../api/products";
import { persist, createJSONStorage } from 'zustand/middleware';

const calculateTotalPrice = (products) => {
    return products?.reduce((acc, product) => {
        return acc + product?.price;
    }, 0);
};

const useProductsStore = create(
    persist(
        (set, get) => ({
            data: [],
            loading: false,
            hasErrors: false,
            selectedProducts: {
                products: [],
                total: 0,
                price_before_discount: 0,
                coupon: {
                    exist: false,
                    name: '',
                    discount: 0
                }
            },
            products: () => {
                set(() => ({ loading: true }));

                getProducts()
                    .then((response) => {
                        set((state) => ({ data: response.data.products, loading: false }));
                    })
                    .catch((error) => {
                        console.error("Error fetching products:", error);
                        set(() => ({ loading: false, hasErrors: true }));
                    });
            },
            addProductToSelected: async (product, quantity) => {
                set(() => ({ loading: true }));
                set((state) => {
                    const uniqueId = generateUniqueId();
                    const updatedProducts = [
                        ...(state?.selectedProducts?.products || []),
                        {
                            id: uniqueId,
                            productId: product.id,
                            name: product.name,
                            price: product.price * quantity,
                            singlePrice: product.price,
                            quantity: quantity,
                        },
                    ];

                    // Calculate totalPrice
                    const totalPrice = calculateTotalPrice(updatedProducts);

                    // Update state
                    set({
                        selectedProducts: {
                            products: updatedProducts,
                            total: totalPrice
                        },
                        loading: false
                    });

                    // Update local storage
                    localStorage.setItem('MY_PRODUCTS', JSON.stringify(updatedProducts));
                    localStorage.setItem('TOTAL_PRICE', JSON.stringify(totalPrice));

                    // Return the updated state
                    return {
                        selectedProducts: {
                            products: updatedProducts,
                            total: totalPrice,
                        },
                        loading: false };
                });
            },
            updateProductInSelected: async (productId, newQuantity) => {
                set(() => ({ loading: true }));
                set((state) => {
                    const existingItemIndex = state.selectedProducts?.products?.findIndex(item => item.id === productId);

                    const updatedSelectedProducts = [...state.selectedProducts?.products];
                    updatedSelectedProducts[existingItemIndex].quantity = newQuantity;
                    updatedSelectedProducts[existingItemIndex].price = updatedSelectedProducts[existingItemIndex].quantity * updatedSelectedProducts[existingItemIndex].singlePrice;

                    // Calculate totalPrice
                    const totalPrice = calculateTotalPrice(updatedSelectedProducts);

                    // Update state
                    set({
                        selectedProducts: {
                            products: updatedSelectedProducts,
                            total: totalPrice
                        },
                        loading: false
                    });

                    // Update local storage
                    localStorage.setItem('MY_PRODUCTS', JSON.stringify(updatedSelectedProducts));
                    localStorage.setItem('TOTAL_PRICE', JSON.stringify(totalPrice));

                    return {
                        selectedProducts: {
                            products: updatedSelectedProducts,
                            total: totalPrice,
                        },
                        loading: false,
                    };
                });
            },
            removeProductFromSelected: async (productId) => {
                set(() => ({ loading: true }));
                set((state) => {
                    const updatedProducts = state.selectedProducts?.products?.filter((product) => product.id !== productId);

                    // Calculate totalPrice
                    const totalPrice = calculateTotalPrice(updatedProducts);

                    // Update state
                    set({
                        selectedProducts: {
                            products: updatedProducts,
                            total: totalPrice
                        },
                        loading: false,
                    });

                    // Update local storage
                    localStorage.setItem('MY_PRODUCTS', JSON.stringify(updatedProducts));
                    localStorage.setItem('TOTAL_PRICE', JSON.stringify(totalPrice));

                    // Return the updated state
                    return {
                        selectedProducts: {
                            products: updatedProducts,
                            total: totalPrice,
                        },
                        loading: false,
                    };
                });
            },
            calculateCoupon: (coupon, discount) => {
                set(() => ({ loading: true }));
                set( () => {
                    const total = get().selectedProducts?.total;
                    let discountedPrice = 0;
                    let updatedProducts = get().selectedProducts?.products;
                    switch (coupon) {
                        case "HAPPYBIRTHDAY":
                            const happyBirthday = get().selectedProducts?.total * 0.8; // 20% discount
                            discountedPrice = happyBirthday;
                            set(() => ({
                                selectedProducts: {
                                    products: get().selectedProducts?.products,
                                    price_before_discount: total,
                                    total: discountedPrice,
                                },
                                loading: false,
                            }));
                            break;
                        case "SUMMER":
                            const summer = get().selectedProducts?.total - 200; // -2€ discount
                            discountedPrice = summer;
                            set(() => ({
                                selectedProducts: {
                                    products: get().selectedProducts?.products,
                                    price_before_discount: total,
                                    total: discountedPrice,
                                },
                                loading: false,
                            }));
                            break;
                        case "ILIKEAPPLES":
                            updatedProducts = get().selectedProducts?.products.map((product) => {
                                if (product.name.toLowerCase().includes("apple")) {
                                    // Apply 60% discount to items with "apple" in the name
                                    discountedPrice = product.price * 0.4; // 60% discount
                                    return {
                                        ...product,
                                        price_before_discount: product.price, // Save the older price
                                        price: discountedPrice, // Update the price with discountedPrice
                                    };
                                } else {
                                    // Keep non-"apple" items unchanged
                                    return product;
                                }

                            });

                            // Calculate totalPrice
                            const totalPriceAfterDiscountApple = calculateTotalPrice(updatedProducts);

                            set(() => ({
                                selectedProducts: {
                                    products: updatedProducts,
                                    price_before_discount: total,
                                    total: totalPriceAfterDiscountApple,
                                },
                                loading: false,
                            }));
                            break;
                        case "ILIKEPEARS":
                            updatedProducts = get().selectedProducts?.products.map((product) => {
                                if (product.name.toLowerCase().includes("pear")) {
                                    // Apply 60% discount to items with "apple" in the name
                                    discountedPrice = product.price * 0.6; // 40% discount
                                    return {
                                        ...product,
                                        price_before_discount: product.price, // Save the older price
                                        price: discountedPrice, // Update the price with discountedPrice
                                    };
                                } else {
                                    // Keep non-"apple" items unchanged
                                    return product;
                                }

                            });

                            // Calculate totalPrice
                            const totalPriceAfterDiscountPear = calculateTotalPrice(updatedProducts);

                            set(() => ({
                                selectedProducts: {
                                    products: updatedProducts,
                                    price_before_discount: total,
                                    total: totalPriceAfterDiscountPear,
                                },
                                loading: false,
                            }));
                            break;
                        case "GREEN":
                            updatedProducts = get().selectedProducts?.products.map((product) => {
                                if (product.name.toLowerCase().includes("pear") || product.name.toLowerCase().includes("avocado")) {
                                    discountedPrice = product.price * 0.7; // 30% discount
                                    return {
                                        ...product,
                                        price_before_discount: product.price, // Save the older price
                                        price: discountedPrice, // Update the price with discountedPrice
                                    };
                                } else {
                                    return product;
                                }

                            });

                            // Calculate totalPrice
                            const totalPriceAfterDiscountGreen = calculateTotalPrice(updatedProducts);

                            set(() => ({
                                selectedProducts: {
                                    products: updatedProducts,
                                    price_before_discount: total,
                                    total: totalPriceAfterDiscountGreen,
                                },
                                loading: false,
                            }));
                            break;
                        default:
                            set(() => ({ loading: false }));
                            set((state) => ({ discount: false }));
                    }

                    // Update local storage
                    localStorage.setItem('MY_PRODUCTS', JSON.stringify(updatedProducts));
                    localStorage.setItem('PRICE_BEFORE_DISCOUNT', JSON.stringify(total));
                    localStorage.setItem('TOTAL_PRICE', JSON.stringify(get().selectedProducts?.total));
                    localStorage.setItem('HAS_COUPON', JSON.stringify(true));
                    localStorage.setItem('COUPON_NAME', JSON.stringify(coupon));
                    localStorage.setItem('COUPON_DISCOUNT', JSON.stringify(discount));

                    // Return the updated state
                    return {
                        selectedProducts: {
                            products: updatedProducts,
                            total: get().selectedProducts?.total,
                            price_before_discount: total,
                            coupon: {
                                exist: true,
                                name: coupon,
                                discount: discount
                            }
                        },
                        loading: false,
                    };
                });
            },
            removeCoupon: (coupon) => {
                set(() => ({ loading: true }));
                set( () => {
                    const total = get().selectedProducts?.price_before_discount;
                    let updatedProducts = get().selectedProducts?.products;
                    let discountedPrice = 0;
                    switch (coupon) {
                        case "HAPPYBIRTHDAY":
                            set(() => ({
                                selectedProducts: {
                                    products: get().selectedProducts?.products,
                                    price_before_discount: 0,
                                    total: total,
                                },
                                loading: false,
                            }));
                            break;
                        case "SUMMER":
                            set(() => ({
                                selectedProducts: {
                                    products: get().selectedProducts?.products,
                                    price_before_discount: 0,
                                    total: total,
                                },
                                loading: false,
                            }));
                            break;
                        case "ILIKEAPPLES":
                            updatedProducts = get().selectedProducts?.products.map((product) => {
                                if (product.name.toLowerCase().includes("apple")) {
                                    // Apply 60% discount to items with "apple" in the name
                                    discountedPrice = product.price * 0.4; // 60% discount
                                    return {
                                        ...product,
                                        price: product.price_before_discount,
                                        price_before_discount: 0,
                                    };
                                } else {
                                    return product;
                                }

                            });

                            // Calculate totalPrice
                            const totalPriceAfterDiscountApple = calculateTotalPrice(updatedProducts);

                            set(() => ({
                                selectedProducts: {
                                    products: updatedProducts,
                                    price_before_discount: total,
                                    total: totalPriceAfterDiscountApple,
                                },
                                loading: false,
                            }));
                            break;
                        case "ILIKEPEARS":
                            updatedProducts = get().selectedProducts?.products.map((product) => {
                                if (product.name.toLowerCase().includes("pear")) {
                                    // Apply 60% discount to items with "apple" in the name
                                    discountedPrice = product.price * 0.4; // 60% discount
                                    return {
                                        ...product,
                                        price: product.price_before_discount,
                                        price_before_discount: 0,
                                    };
                                } else {
                                    return product;
                                }

                            });

                            // Calculate totalPrice
                            const totalPriceAfterDiscountPear = calculateTotalPrice(updatedProducts);

                            set(() => ({
                                selectedProducts: {
                                    products: updatedProducts,
                                    price_before_discount: total,
                                    total: totalPriceAfterDiscountPear,
                                },
                                loading: false,
                            }));
                            break;
                        case "GREEN":
                            updatedProducts = get().selectedProducts?.products.map((product) => {
                                if (product.name.toLowerCase().includes("pear") || product.name.toLowerCase().includes("avocado")) {
                                    discountedPrice = product.price * 0.7;
                                    return {
                                        ...product,
                                        price: product.price_before_discount,
                                        price_before_discount: 0,
                                    };
                                } else {
                                    return product;
                                }

                            });

                            // Calculate totalPrice
                            const totalPriceAfterDiscountGreen = calculateTotalPrice(updatedProducts);

                            set(() => ({
                                selectedProducts: {
                                    products: updatedProducts,
                                    price_before_discount: total,
                                    total: totalPriceAfterDiscountGreen,
                                },
                                loading: false,
                            }));
                            break;

                        default:
                            set(() => ({ loading: false }));
                            set((state) => ({ discount: false }));
                    }

                    // Update local storage
                    localStorage.setItem('MY_PRODUCTS', JSON.stringify(updatedProducts));
                    localStorage.setItem('PRICE_BEFORE_DISCOUNT', JSON.stringify(0));
                    localStorage.setItem('TOTAL_PRICE', JSON.stringify(total));
                    localStorage.setItem('HAS_COUPON', JSON.stringify(false));
                    localStorage.setItem('COUPON_NAME', JSON.stringify(''));
                    localStorage.setItem('COUPON_DISCOUNT', JSON.stringify(''));

                    // Return the updated state
                    return {
                        selectedProducts: {
                            products: get().selectedProducts?.products,
                            total: total,
                            price_before_discount: 0,
                            coupon: {
                                exist: false,
                                name: '',
                                discount: ''
                            }
                        },
                        loading: false,
                    };
                });
            },
        }),
        {
            // ...
            partialize: (state) => ({
                selectedProducts: {
                    products: JSON.parse(localStorage.getItem('MY_PRODUCTS')),
                    total: JSON.parse(localStorage.getItem('TOTAL_PRICE')),
                    price_before_discount: JSON.parse(localStorage.getItem('PRICE_BEFORE_DISCOUNT')),
                    coupon: {
                        exist: JSON.parse(localStorage.getItem('HAS_COUPON')),
                        name: JSON.parse(localStorage.getItem('COUPON_NAME')),
                        discount: JSON.parse(localStorage.getItem('COUPON_DISCOUNT')),
                    }
                },
            }),
        },
    )
);

export default useProductsStore;
