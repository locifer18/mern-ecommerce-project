import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu';
import { useAuth } from '../../context/auth';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { FaBox, FaTruck, FaCheck, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';
import '../../styles/Order.css';

const OrderDetails = () => {
    const [auth] = useAuth();
    const params = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [productDetails, setProductDetails] = useState({}); // Cache for product details

    // Fetch product details by ID
    const fetchProductDetails = async (productId) => {
        try {
            if (productDetails[productId]) {
                return productDetails[productId]; // Return cached data
            }

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${productId}`);
            
            // Cache the product details
            setProductDetails(prev => ({
                ...prev,
                [productId]: data.product
            }));
            
            return data.product;
        } catch (error) {
            console.log(`Error fetching product ${productId}:`, error);
            return null;
        }
    };

    // Get product image URL
    const getProductImageUrl = (item) => {
        let productId = null;

        // Try different possible structures
        if (item?.product?._id) {
            productId = item.product._id;
        } else if (item?.product && typeof item.product === 'string') {
            productId = item.product;
        } else if (item?._id) {
            productId = item._id;
        } else if (item?.productId) {
            productId = item.productId;
        }

        return productId ?
            `${process.env.REACT_APP_API}/api/v1/product/product-photo/${productId}` :
            '/images/placeholder.png';
    };

    // Get product name with fallback
    const getProductName = (item) => {
        // Try different possible structures
        if (item?.product?.name) return item.product.name;
        if (item?.product?.title) return item.product.title;
        if (item?.name) return item.name;
        if (item?.title) return item.title;

        // If we have a product ID, check if we've fetched its details
        const productId = typeof item?.product === 'string' ? item.product : item?.product?._id;
        if (productId && productDetails[productId]) {
            return productDetails[productId].name || productDetails[productId].title || 'Unknown Product';
        }

        return 'Loading...'; // Show loading instead of unknown for better UX
    };

    // Get product description
    const getProductDescription = (item) => {
        const productId = typeof item?.product === 'string' ? item.product : item?.product?._id;
        if (productId && productDetails[productId]) {
            return productDetails[productId].description || '';
        }
        return item?.product?.description || item?.description || '';
    };

    // Get order details and fetch missing product details
    const getOrderDetails = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(
                `${process.env.REACT_APP_API}/api/v1/auth/order/${params.id}`,
                {
                    headers: {
                        Authorization: auth?.token
                    }
                }
            );

            if (data?.success) {
                setOrder(data.order);

                // Fetch missing product details
                const productIds = new Set();
                if (Array.isArray(data.order.products)) {
                    data.order.products.forEach(item => {
                        const productId = typeof item?.product === 'string' ? item.product : item?.product?._id;
                        if (productId && !productDetails[productId]) {
                            productIds.add(productId);
                        }
                    });
                }

                // Fetch all missing product details
                const productPromises = Array.from(productIds).map(id => fetchProductDetails(id));
                await Promise.allSettled(productPromises);
            }
        } catch (error) {
            console.log(error);
            toast.error(`Error fetching order details: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth?.token && params.id) {
            getOrderDetails();
        }
    }, [auth?.token, params.id]);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    // Get status badge class
    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'processing':
                return 'bg-warning';
            case 'shipped':
                return 'bg-info';
            case 'delivered':
                return 'bg-success';
            case 'cancelled':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'processing':
                return <FaBox />;
            case 'shipped':
                return <FaTruck />;
            case 'delivered':
                return <FaCheck />;
            default:
                return <FaBox />;
        }
    };

    return (
        <Layout title="Order Details - ShopEase">
            <div className="container-fluid py-5">
                <div className="row">
                    <div className="col-lg-3 mb-4 mb-lg-0">
                        <UserMenu />
                    </div>
                    <div className="col-lg-9">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <h2 className="mb-4">Order Details</h2>

                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-3">Loading order details...</p>
                                    </div>
                                ) : !order ? (
                                    <div className="alert alert-warning">
                                        Order not found or you don't have permission to view it.
                                    </div>
                                ) : (
                                    <>
                                        {/* Order Summary */}
                                        <div className="order-summary mb-4">
                                            <div className="row g-4">
                                                <div className="col-md-6">
                                                    <div className="order-info">
                                                        <h5 className="mb-3">Order Information</h5>
                                                        <p className="mb-2">
                                                            <strong>Order ID:</strong> #{order?._id?.substring(0, 8)}
                                                        </p>
                                                        <p className="mb-2">
                                                            <strong>Date:</strong> {moment(order?.createdAt).format('MMMM DD, YYYY')}
                                                        </p>
                                                        <p className="mb-2">
                                                            <strong>Payment:</strong> {order?.payment?.success || order?.payment?.id ? 'Paid' : 'Pending'}
                                                        </p>
                                                        <div className="d-flex align-items-center">
                                                            <strong className="me-2">Status:</strong>
                                                            <span className={`badge ${getStatusBadgeClass(order?.status)} d-flex align-items-center`}>
                                                                {getStatusIcon(order?.status)}
                                                                <span className="ms-1">{order?.status}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="shipping-info">
                                                        <h5 className="mb-3">Shipping Information</h5>
                                                        <p className="mb-2 d-flex align-items-center">
                                                            <FaUser className="me-2 text-primary" />
                                                            <span>{order?.shippingAddress?.name || auth?.user?.name}</span>
                                                        </p>
                                                        <p className="mb-2 d-flex align-items-center">
                                                            <FaMapMarkerAlt className="me-2 text-primary" />
                                                            <span>
                                                                {order?.shippingAddress?.address || auth?.user?.address || 'Address not provided'}
                                                            </span>
                                                        </p>
                                                        <p className="mb-2 d-flex align-items-center">
                                                            <FaPhone className="me-2 text-primary" />
                                                            <span>{order?.shippingAddress?.phone || auth?.user?.phone || 'N/A'}</span>
                                                        </p>
                                                        <p className="mb-2 d-flex align-items-center">
                                                            <FaEnvelope className="me-2 text-primary" />
                                                            <span>{auth?.user?.email}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="order-items mb-4">
                                            <h5 className="mb-3">Order Items</h5>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>Product</th>
                                                            <th>Price</th>
                                                            <th>Quantity</th>
                                                            <th className="text-end">Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.isArray(order?.products) && order.products.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        <img
                                                                            src={getProductImageUrl(item)}
                                                                            alt={getProductName(item)}
                                                                            className="img-fluid rounded"
                                                                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                                            onError={(e) => {
                                                                                e.target.onerror = null;
                                                                                e.target.src = '/images/placeholder.png';
                                                                            }}
                                                                        />
                                                                        <div className="ms-3">
                                                                            <div className='product-name fw-semibold'>{getProductName(item)}</div>
                                                                            {getProductDescription(item) && (
                                                                                <small className="text-muted">
                                                                                    {getProductDescription(item).length > 100 
                                                                                        ? `${getProductDescription(item).substring(0, 100)}...`
                                                                                        : getProductDescription(item)
                                                                                    }
                                                                                </small>
                                                                            )}
                                                                            {item?.variantOptions && (
                                                                                <div className="order-item-variant mt-1">
                                                                                    {Object.entries(item.variantOptions).map(([key, value]) => (
                                                                                        <span key={key} className="badge bg-light text-dark me-1">
                                                                                            {key}: {value}
                                                                                        </span>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="align-middle">{formatCurrency(item?.price || 0)}</td>
                                                                <td className="align-middle">{item?.quantity || 1}</td>
                                                                <td className="text-end align-middle fw-semibold">
                                                                    {formatCurrency((item?.price || 0) * (item?.quantity || 1))}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Order Summary */}
                                        <div className="order-total">
                                            <div className="row">
                                                <div className="col-md-6 offset-md-6">
                                                    <div className="card bg-light">
                                                        <div className="card-body">
                                                            <h5 className="mb-3">Order Summary</h5>
                                                            <div className="d-flex justify-content-between mb-2">
                                                                <span>Subtotal:</span>
                                                                <span>{formatCurrency(order?.totalAmount || 0)}</span>
                                                            </div>
                                                            <div className="d-flex justify-content-between mb-2">
                                                                <span>Shipping:</span>
                                                                <span className="text-success">Free</span>
                                                            </div>
                                                            <div className="d-flex justify-content-between mb-2">
                                                                <span>Tax:</span>
                                                                <span>$0.00</span>
                                                            </div>
                                                            <hr />
                                                            <div className="d-flex justify-content-between fw-bold fs-5">
                                                                <span>Total:</span>
                                                                <span className="text-primary">{formatCurrency(order?.totalAmount || 0)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Status Timeline (Optional Enhancement) */}
                                        <div className="order-timeline mt-4">
                                            <h5 className="mb-3">Order Status</h5>
                                            <div className="d-flex align-items-center">
                                                <div className={`status-step ${['processing', 'shipped', 'delivered'].includes(order?.status?.toLowerCase()) ? 'active' : ''}`}>
                                                    <FaBox />
                                                    <span className="ms-2">Processing</span>
                                                </div>
                                                <div className="status-line"></div>
                                                <div className={`status-step ${['shipped', 'delivered'].includes(order?.status?.toLowerCase()) ? 'active' : ''}`}>
                                                    <FaTruck />
                                                    <span className="ms-2">Shipped</span>
                                                </div>
                                                <div className="status-line"></div>
                                                <div className={`status-step ${order?.status?.toLowerCase() === 'delivered' ? 'active' : ''}`}>
                                                    <FaCheck />
                                                    <span className="ms-2">Delivered</span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default OrderDetails;