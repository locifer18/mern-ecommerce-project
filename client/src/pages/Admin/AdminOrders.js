import React, { useEffect, useState } from 'react'
import Layout from "../../components/Layout/Layout";
import moment from "moment";
import { useAuth } from '../../context/auth';
import axios from 'axios';
import { Select } from 'antd';
import { FaShoppingBag, FaSearch, FaFilter, FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';
import AdminMenu from '../../components/Layout/AdminMenu';
import "../../styles/AdminDashboard.css";

const AdminOrder = () => {
    const [status, setStatus] = useState(["Not Process", "Processing", "Shipped", "Delivered", "Cancel"])
    const [orders, setOrders] = useState([]);
    const [auth, setAuth] = useAuth();
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    // Get orders
    const getOrders = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/all-orders`);

            // Ensure orders is always an array
            if (Array.isArray(data)) {
                setOrders(data);
            } else if (data?.orders && Array.isArray(data.orders)) {
                setOrders(data.orders);
            } else {
                console.error("Invalid data format from orders API:", data);
                setOrders([]);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setOrders([]);
            setLoading(false);
        }
    }
    useEffect(() => {
        if (auth?.token) getOrders();
    }, [auth?.token]);

    // Change order status
    const handleChange = async (orderId, value) => {
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/auth/order-status/${orderId}`, { status: value });
            toast.success('Order status updated');
            getOrders();
        } catch (error) {
            console.log(error);
            toast.error('Error updating order status');
        }
    }

    // Calculate order total properly with quantity
    const calculateTotal = (order) => {
        if (!order || !Array.isArray(order.products)) return 0;

        // Check if totalAmount is already provided in the order
        if (order.totalAmount && typeof order.totalAmount === 'number') {
            return order.totalAmount;
        }

        return order.products.reduce((total, product) => {
            // Handle different product structures
            let price = 0;
            let quantity = 1;

            if (product.product && typeof product.product === 'object') {
                // Nested product object (populated from MongoDB)
                price = Number(product.product.price) || 0;
                quantity = Number(product.quantity) || 1;
            } else if (product._id && product.price) {
                // Direct product object
                price = Number(product.price) || 0;
                quantity = Number(product.quantity) || 1;
            }

            return total + (price * quantity);
        }, 0);
    };

    // Calculate total items with quantity
    const calculateTotalItems = (order) => {
        if (!order || !Array.isArray(order.products)) return 0;

        return order.products.reduce((total, product) => {
            // Check if product has a quantity field
            const quantity = Number(product.quantity) || 1;
            return total + quantity;
        }, 0);
    };

    // Filter orders by status
    const filteredOrders = Array.isArray(orders) ?
        orders.filter(order => {
            if (filterStatus === 'all') return true;
            return order?.status === filterStatus;
        }) : [];

    // Search orders
    const searchedOrders = Array.isArray(filteredOrders) ?
        filteredOrders.filter(order => {
            if (!searchTerm) return true;
            const searchValue = searchTerm.toLowerCase();
            return (
                order?.buyer?.name?.toLowerCase().includes(searchValue) ||
                order?._id?.toLowerCase().includes(searchValue) ||
                order?.status?.toLowerCase().includes(searchValue)
            );
        }) : [];

    // Sort orders
    const sortedOrders = Array.isArray(searchedOrders) ?
        [...searchedOrders].sort((a, b) => {
            switch (sortBy) {
                case 'oldest':
                    return new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0);
                case 'price-low-high':
                    return calculateTotal(a) - calculateTotal(b);
                case 'price-high-low':
                    return calculateTotal(b) - calculateTotal(a);
                default: // newest
                    return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
            }
        }) : [];

    // Get status badge class
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Processing':
                return 'bg-warning text-dark';
            case 'Shipped':
                return 'bg-info text-white';
            case 'Delivered':
                return 'bg-success text-white';
            case 'Cancel':
                return 'bg-danger text-white';
            default:
                return 'bg-secondary text-white';
        }
    };

    return (
        <Layout title="All Orders - Admin Dashboard">
            <div className='admin-orders-page'>
                <div className='container-fluid py-5'>
                    <div className='row'>
                        <div className='col-lg-3 col-xl-2 mb-4 mb-lg-0'>
                            <AdminMenu />
                        </div>
                        <div className='col-lg-9 col-xl-10'>
                            <div className='card border-0 shadow-sm'>
                                <div className='card-body p-4'>
                                    {/* Header Section */}
                                    <div className='d-flex justify-content-between align-items-center mb-4 flex-wrap'>
                                        <div className='d-flex align-items-center'>
                                            <FaShoppingBag className='me-2 text-primary' style={{ fontSize: '1.5rem' }} />
                                            <div>
                                                <h2 className='mb-0'>All Orders</h2>
                                                <p className='text-muted mb-0 small'>
                                                    Total Orders: {sortedOrders.length}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Search, Filter and Sort Controls */}
                                        <div className='d-flex flex-wrap mt-3 mt-md-0'>
                                            <div className='search-box me-3 mb-2 mb-md-0'>
                                                <div className='input-group'>
                                                    <span className='input-group-text bg-white border-end-0'>
                                                        <FaSearch className='text-muted' />
                                                    </span>
                                                    <input
                                                        type='text'
                                                        className='form-control border-start-0'
                                                        placeholder='Search orders...'
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className='filter-box me-3 mb-2 mb-md-0'>
                                                <div className='input-group'>
                                                    <span className='input-group-text bg-white border-end-0'>
                                                        <FaFilter className='text-muted' />
                                                    </span>
                                                    <select
                                                        className='form-select border-start-0'
                                                        value={filterStatus}
                                                        onChange={(e) => setFilterStatus(e.target.value)}
                                                    >
                                                        <option value='all'>All Status</option>
                                                        {status.map((s, i) => (
                                                            <option key={i} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='sort-box'>
                                                <select
                                                    className='form-select'
                                                    value={sortBy}
                                                    onChange={(e) => setSortBy(e.target.value)}
                                                >
                                                    <option value='newest'>Newest First</option>
                                                    <option value='oldest'>Oldest First</option>
                                                    <option value='price-high-low'>Price: High to Low</option>
                                                    <option value='price-low-high'>Price: Low to High</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Orders Table */}
                                    {loading ? (
                                        <div className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <p className="mt-3 text-muted">Loading orders...</p>
                                        </div>
                                    ) : sortedOrders.length === 0 ? (
                                        <div className="text-center py-5">
                                            <div className="alert alert-info border-0 rounded-3">
                                                <FaShoppingBag size={48} className="text-info mb-3" />
                                                <h5>No orders found</h5>
                                                <p className="mb-0">No orders match your current filters.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-hover align-middle">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th className="border-0">Order ID</th>
                                                        <th className="border-0">Customer</th>
                                                        <th className="border-0">Date</th>
                                                        <th className="border-0">Amount & Items</th>
                                                        <th className="border-0">Status</th>
                                                        <th className="border-0">Update Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sortedOrders.map((o, i) => (
                                                        <tr key={o._id}>
                                                            <td>
                                                                <code className="bg-light px-2 py-1 rounded">
                                                                    #{o._id.substring(0, 8).toUpperCase()}
                                                                </code>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <div className="customer-avatar me-3">
                                                                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                                                            style={{ width: '40px', height: '40px' }}>
                                                                            <FaUser />
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <h6 className="mb-1 fw-semibold">{o?.buyer?.name}</h6>
                                                                        <div className="small text-muted d-flex align-items-center mb-1">
                                                                            <FaEnvelope className="me-2" size={12} />
                                                                            {o?.buyer?.email}
                                                                        </div>
                                                                        {o?.buyer?.phone && (
                                                                            <div className="small text-muted d-flex align-items-center">
                                                                                <FaPhone className="me-2" size={12} />
                                                                                {o?.buyer?.phone}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="fw-semibold">
                                                                    {moment(o?.createdAt).format("MMM D, YYYY")}
                                                                </div>
                                                                <div className="small text-muted">
                                                                    {moment(o?.createdAt).format("h:mm A")}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="fw-bold text-success fs-6">
                                                                    ${calculateTotal(o).toFixed(2)}
                                                                </div>
                                                                <div className="small text-muted">
                                                                    {calculateTotalItems(o)} items
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className={`badge rounded-pill ${getStatusBadgeClass(o?.status)}`}>
                                                                    {o?.status}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <Select
                                                                    variant={false}
                                                                    onChange={(value) => handleChange(o._id, value)}
                                                                    defaultValue={o?.status}
                                                                    className="status-select"
                                                                    style={{ minWidth: '130px' }}
                                                                >
                                                                    {status.map((s, i) => (
                                                                        <Select.Option key={i} value={s}>
                                                                            {s}
                                                                        </Select.Option>
                                                                    ))}
                                                                </Select>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* Order Summary Statistics */}
                                    {sortedOrders.length > 0 && (
                                        <div className="row mt-4">
                                            <div className="col-md-3 col-sm-6 mb-3">
                                                <div className="card bg-primary text-white border-0">
                                                    <div className="card-body text-center">
                                                        <h5>{sortedOrders.length}</h5>
                                                        <small>Total Orders</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6 mb-3">
                                                <div className="card bg-success text-white border-0">
                                                    <div className="card-body text-center">
                                                        <h5>${sortedOrders.reduce((total, order) => total + calculateTotal(order), 0).toFixed(2)}</h5>
                                                        <small>Total Revenue</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6 mb-3">
                                                <div className="card bg-info text-white border-0">
                                                    <div className="card-body text-center">
                                                        <h5>{sortedOrders.reduce((total, order) => total + calculateTotalItems(order), 0)}</h5>
                                                        <small>Total Items</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6 mb-3">
                                                <div className="card bg-warning text-dark border-0">
                                                    <div className="card-body text-center">
                                                        <h5>${(sortedOrders.reduce((total, order) => total + calculateTotal(order), 0) / sortedOrders.length).toFixed(2)}</h5>
                                                        <small>Avg Order Value</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default AdminOrder