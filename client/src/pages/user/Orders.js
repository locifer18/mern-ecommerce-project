import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/auth';
import moment from "moment";
import toast from 'react-hot-toast';
import { FaShoppingBag, FaBox, FaTruck, FaCheck, FaSpinner, FaSearch, FaFilter, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "../../styles/Order.css"

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [auth] = useAuth();
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
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

        return 'Unknown Product';
    };

    // Get orders and fetch missing product details
    const getOrders = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/orders`, {
                headers: {
                    Authorization: auth?.token
                }
            });

            let ordersArray = [];
            if (Array.isArray(data)) {
                ordersArray = data;
            } else if (Array.isArray(data?.orders)) {
                ordersArray = data.orders;
            } else {
                console.error("Invalid data format from orders API:", data);
                setOrders([]);
                return;
            }

            setOrders(ordersArray);

            // Fetch missing product details
            const productIds = new Set();
            ordersArray.forEach(order => {
                if (Array.isArray(order.products)) {
                    order.products.forEach(item => {
                        const productId = typeof item?.product === 'string' ? item.product : item?.product?._id;
                        if (productId && !productDetails[productId]) {
                            productIds.add(productId);
                        }
                    });
                }
            });

            // Fetch all missing product details
            const productPromises = Array.from(productIds).map(id => fetchProductDetails(id));
            await Promise.allSettled(productPromises);

        } catch (error) {
            console.log(error);
            toast.error(`Error fetching orders: ${error.response?.data?.message || error.message}`);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth?.token) getOrders();
    }, [auth?.token]);

    // Filter orders by status
    const filteredOrders = Array.isArray(orders) ? orders.filter(order => {
        if (filterStatus === 'all') return true;
        return order?.status?.toLowerCase() === filterStatus.toLowerCase();
    }) : [];

    // Search orders
    const searchedOrders = Array.isArray(filteredOrders) ? filteredOrders.filter(order => {
        if (!searchTerm) return true;
        const searchValue = searchTerm.toLowerCase();
        return (
            order?.buyer?.name?.toLowerCase().includes(searchValue) ||
            order?._id?.toLowerCase().includes(searchValue) ||
            order?.status?.toLowerCase().includes(searchValue)
        );
    }) : [];

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'processing':
                return <FaSpinner className="status-icon processing" />;
            case 'shipped':
                return <FaTruck className="status-icon shipped" />;
            case 'delivered':
                return <FaCheck className="status-icon delivered" />;
            default:
                return <FaBox className="status-icon" />;
        }
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

    return (
        <Layout title="My Orders - ShopEase">
            <div className='orders-page'>
                <div className='container-fluid py-5'>
                    <div className='row'>
                        <div className='col-lg-3 mb-4 mb-lg-0'>
                            <UserMenu />
                        </div>
                        <div className='col-lg-9'>
                            <div className='card border-0 shadow-sm'>
                                <div className='card-body p-4'>
                                    <div className='d-flex justify-content-between align-items-center mb-4'>
                                        <h2 className='mb-0'>My Orders</h2>
                                        <div className='d-flex'>
                                            <div className='search-box me-3'>
                                                <div className='input-group'>
                                                    <span className='input-group-text bg-white'>
                                                        <FaSearch />
                                                    </span>
                                                    <input
                                                        type='text'
                                                        className='form-control'
                                                        placeholder='Search orders...'
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className='filter-box'>
                                                <div className='input-group'>
                                                    <span className='input-group-text bg-white'>
                                                        <FaFilter />
                                                    </span>
                                                    <select
                                                        className='form-select'
                                                        value={filterStatus}
                                                        onChange={(e) => setFilterStatus(e.target.value)}
                                                    >
                                                        <option value='all'>All Status</option>
                                                        <option value='processing'>Processing</option>
                                                        <option value='shipped'>Shipped</option>
                                                        <option value='delivered'>Delivered</option>
                                                        <option value='cancelled'>Cancelled</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {loading ? (
                                        <div className='text-center py-5'>
                                            <div className='spinner-border text-primary' role='status'>
                                                <span className='visually-hidden'>Loading...</span>
                                            </div>
                                            <p className='mt-3'>Loading your orders...</p>
                                        </div>
                                    ) : !Array.isArray(searchedOrders) || searchedOrders.length === 0 ? (
                                        <div className='text-center py-5'>
                                            <FaShoppingBag style={{ fontSize: '4rem', color: '#ddd' }} />
                                            <h3 className='mt-3'>No orders found</h3>
                                            <p className='text-muted'>
                                                {searchTerm || filterStatus !== 'all'
                                                    ? 'Try adjusting your search or filter'
                                                    : 'You haven\'t placed any orders yet'}
                                            </p>
                                            {(searchTerm || filterStatus !== 'all') && (
                                                <button
                                                    className='btn btn-outline-primary mt-2'
                                                    onClick={() => {
                                                        setSearchTerm('');
                                                        setFilterStatus('all');
                                                    }}
                                                >
                                                    Clear Filters
                                                </button>
                                            )}
                                            {!orders.length && (
                                                <Link to='/' className='btn btn-primary mt-3'>
                                                    Start Shopping
                                                </Link>
                                            )}
                                        </div>
                                    ) : (
                                        <div className='orders-list'>
                                            {searchedOrders.map((order, index) => (
                                                <div className='order-card mb-4 animate-fade-in' key={order?._id || index}>
                                                    <div className='order-header'>
                                                        <div className='order-header-left'>
                                                            <div className='order-id'>
                                                                Order #{order?._id?.substring(0, 8) || 'Unknown'}
                                                            </div>
                                                            <div className='order-date'>
                                                                {order?.createdAt ? moment(order.createdAt).format('MMM DD, YYYY') : 'Unknown date'}
                                                            </div>
                                                        </div>
                                                        <div className='order-header-right'>
                                                            <div className='order-status'>
                                                                <span className={`badge ${getStatusBadgeClass(order?.status)}`}>
                                                                    {getStatusIcon(order?.status)} {order?.status || 'Unknown'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='order-body'>
                                                        <div className='order-products'>
                                                            {Array.isArray(order?.products) ? order.products.map((p, i) => (
                                                                <div className='order-product' key={i}>
                                                                    <div className='product-image'>
                                                                        <img
                                                                            src={getProductImageUrl(p)}
                                                                            alt={getProductName(p)}
                                                                            className="img-fluid rounded"
                                                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                                            onError={(e) => {
                                                                                e.target.onerror = null;
                                                                                e.target.src = '/images/placeholder.png';
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className='product-details'>
                                                                        <div className='product-name'>{getProductName(p)}</div>
                                                                        <div className='product-price'>
                                                                            ${p?.price ? parseFloat(p.price).toFixed(2) : '0.00'} x {p?.quantity}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )) : (
                                                                <div className="text-muted">No product details available</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className='order-footer'>
                                                        <div className='order-total'>
                                                            Total: <span>${order?.totalAmount ? parseFloat(order.totalAmount).toFixed(2) : '0.00'}</span>
                                                        </div>
                                                        <div className='order-actions'>
                                                            <Link
                                                                to={`/dashboard/user/order/${order?._id}`}
                                                                className='btn btn-outline-primary btn-sm'
                                                            >
                                                                <FaEye className='me-1' /> View Details
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Orders;