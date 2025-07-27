import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/auth';
import { useCart } from '../context/cart';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout'
import "../styles/CartStyles.css";
import axios from 'axios';
import DropIn from 'braintree-web-drop-in-react';
import toast from 'react-hot-toast';
import { FaShoppingCart, FaTrash, FaArrowLeft } from 'react-icons/fa';

const CartPage = () => {
    const [auth, setAuth] = useAuth();
    const [cart, setCart] = useCart();
    const [clientToken, setClientToken] = useState("");
    const [instance, setInstance] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    //total Price
    const totalPrice = () => {
        try {
            let total = 0;
            cart.forEach((item) => {
                const price = Number(item?.price) || 0;
                const quantity = Number(item?.quantity) || 1;
                total += price * quantity;
            });

            return total.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
            });
        } catch (error) {
            console.log("Error calculating total price:", error);
            return "$0.00";
        }
    };

    //delete item
    const removeCartItem = (pid) => {
        try {
            let myCart = [...cart];
            let index = myCart.findIndex((item) => item._id === pid)
            myCart.splice(index, 1);
            setCart(myCart);
            localStorage.setItem("cart", JSON.stringify(myCart));
        } catch (error) {
            console.log(error)
        }
    }

    // Update quantity
    const updateQuantity = (pid, newQuantity) => {
        try {
            if (newQuantity <= 0) {
                removeCartItem(pid);
                return
            };
            const updateCart = cart.map(item => item._id === pid ? { ...item, quantity: newQuantity } : item);
            setCart(updateCart)
            localStorage.setItem("cart", JSON.stringify(updateCart));
        } catch (error) {
            console.log(error);
        }
    }

    // Get total items count
    const getTotalItems = () => {
        return cart.reduce((total, item) => total + (item.quantity || 1), 0);
    }

    //get payment gateway token
    const getToken = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/braintree/token`);
            setClientToken(data?.clientToken);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getToken();
    }, [auth?.token]);

    //handle payments
    const handlePayment = async () => {
        if (!instance) {
            toast.error("Payment gateway is not ready");
            return;
        }

        if (loading) return;

        setLoading(true);
        try {
            const { nonce } = await instance.requestPaymentMethod();
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/braintree/payment`, {
                nonce,
                cart,
            });

            if (data.ok) {
                toast.success("Payment Completed Successfully");
                localStorage.removeItem("cart");
                setCart([]);
                navigate("/dashboard/user/orders");
            } else {
                toast.error("Payment failed");
            }

            //  Always teardown DropIn to destroy old nonce
            await instance.teardown();
            setInstance(null);
            getToken(); // re-fetch new client token
        } catch (error) {
            console.error("Payment error:", error);
            toast.error(error?.response?.data?.message || "Payment failed. Try again.");

            // Tear down instance even on failure
            if (instance) {
                try {
                    await instance.teardown();
                    setInstance(null);
                    getToken(); // refresh client token for retry
                } catch (teardownError) {
                    console.error("DropIn teardown error:", teardownError);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const numericTotal = () => {
        try {
            let total = 0;
            cart.forEach((item) => {
                const price = Number(item?.price) || 0;
                const quantity = Number(item?.quantity) || 1;
                total += price * quantity;
            });
            return total.toFixed(2);
        } catch (error) {
            return "0.00";
        }
    }
    return (
        <Layout title="Shopping Cart">
            <div className='cart-page'>
                <div className='container'>
                    <div className='row mb-4'>
                        <div className='col-md-12'>
                            <div className='cart-header'>
                                <h1 className='text-center p-3'>
                                    <FaShoppingCart className='cart-icon me-2' />
                                    Your Shopping Cart
                                </h1>
                                <p className='text-center cart-subtitle'>
                                    {cart?.length ? `You have ${getTotalItems()} items in your cart ${auth?.token ? "" : "please login to checkout!"}` : "Your cart is empty"}
                                </p>
                                {!cart?.length && (
                                    <div className='empty-cart-container'>
                                        <div className='empty-cart-message'>
                                            <FaShoppingCart className='empty-cart-icon' />
                                            <p>Your cart is empty</p>
                                            <Link to="/" className='btn btn-primary continue-shopping'>
                                                <FaArrowLeft className='me-2' /> Continue Shopping
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {cart?.length > 0 && (
                        <div className='row'>
                            <div className='col-lg-8 col-md-7 mb-4'>
                                <div className='cart-items-container'>
                                    {cart?.map((p) => (
                                        <div className='cart-item' key={p._id}>
                                            <div className='row align-items-center'>
                                                <div className='col-md-3 col-sm-4 mb-3 mb-md-0'>
                                                    <div className='cart-item-image'>
                                                        <img
                                                            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                                                            alt={p.name}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='col-md-5 col-sm-8'>
                                                    <div className='cart-item-details'>
                                                        <h4 className='cart-item-name'>{p.name}</h4>
                                                        {p.variantOptions && (
                                                            <div className='cart-item-variant'>
                                                                {Object.entries(p.variantOptions).map(([key, value]) => (
                                                                    <span key={key} className='variant-badge'>
                                                                        {key}: {value}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <p className='cart-item-desc'>{p.description.substring(0, 60)}...</p>
                                                        <p className='cart-item-price'>${p.price}</p>
                                                    </div>
                                                </div>
                                                <div className='col-md-4 mt-3 mt-md-0'>
                                                    <div className='cart-item-actions'>
                                                        <div className='quantity-controls'>
                                                            <button
                                                                className='btn btn-quantity'
                                                                onClick={() => updateQuantity(p._id, (p.quantity || 1) - 1)}
                                                            >
                                                                -
                                                            </button>
                                                            <span className='quantity-value'>{p.quantity || 1}</span>
                                                            <button
                                                                className='btn btn-quantity'
                                                                onClick={() => updateQuantity(p._id, (p.quantity || 1) + 1)}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <div className='cart-item-subtotal'>
                                                            <p>Subtotal: <span>${((p.price || 0) * (p.quantity || 1)).toFixed(2)}</span></p>
                                                        </div>
                                                        <button
                                                            className='btn btn-remove'
                                                            onClick={() => removeCartItem(p._id)}
                                                        >
                                                            <FaTrash className='me-2' /> Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className='cart-actions mt-3'>
                                    <Link to="/" className='btn btn-outline-primary continue-shopping'>
                                        <FaArrowLeft className='me-2' /> Continue Shopping
                                    </Link>
                                </div>
                            </div>

                            <div className='col-lg-4 col-md-5'>
                                <div className='cart-summary'>
                                    <h2>Order Summary</h2>
                                    <div className='summary-details'>
                                        <div className='summary-item'>
                                            <span>Items ({getTotalItems()}):</span>
                                            <span>{totalPrice()}</span>
                                        </div>
                                        <div className='summary-item'>
                                            <span>Shipping:</span>
                                            <span>Free</span>
                                        </div>
                                        <div className='summary-divider'></div>
                                        <div className='summary-item total'>
                                            <span>Order Total:</span>
                                            <span>{totalPrice()}</span>
                                        </div>
                                    </div>

                                    {auth?.token ? (
                                        <>
                                            {clientToken ? (
                                                <div className='payment-section'>
                                                    <h4>Payment Method</h4>
                                                    <DropIn
                                                        options={{
                                                            authorization: clientToken,
                                                            googlePay: {
                                                                googlePayVersion: 2,
                                                                merchantId: '', // Use test merchant ID or leave blank for sandbox
                                                                transactionInfo: {
                                                                    currencyCode: 'USD',
                                                                    totalPriceStatus: 'FINAL',
                                                                    totalPrice: numericTotal(),
                                                                }
                                                            },
                                                            card: {
                                                                cardholderName: {
                                                                    required: true
                                                                }
                                                            }
                                                        }}
                                                        onInstance={(instance) => setInstance(instance)}
                                                    />
                                                    <button
                                                        className='btn btn-primary btn-checkout'
                                                        onClick={handlePayment}
                                                        disabled={loading || !instance}
                                                    >
                                                        {loading ? "Processing..." : "Complete Order"}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className='payment-loading'>
                                                    <div className='spinner-border text-primary' role='status'>
                                                        <span className='visually-hidden'>Loading...</span>
                                                    </div>
                                                    <p>Loading payment options...</p>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className='login-prompt'>
                                            <p>Please login to complete your purchase</p>
                                            <button
                                                className='btn btn-primary btn-checkout'
                                                onClick={() => navigate("/login", { state: "/cart" })}>
                                                Login to Checkout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </Layout >
    )
}

export default CartPage