import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import {
    FaShoppingBag,
    FaUsers,
    FaBoxOpen,
    FaTags,
    FaMoneyBillWave,
    FaSpinner,
    FaTruck,
    FaCheck,
    FaTimes,
    FaExclamationTriangle
} from 'react-icons/fa';
import '../styles/AdminDashboard.css';

const DashboardStats = () => {
    const [auth] = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch dashboard stats
    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/stats`, {
                headers: {
                    Authorization: auth?.token,
                },
            }
            );
            if (res.data?.success) {
                setStats(res.data.stats);
            } else {
                setError('Failed to fetch dashboard statistics');
            }

            setLoading(false);
        } catch (error) {
            console.log(error);
            setError('Error fetching dashboard statistics');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth?.token) {
            fetchStats();
        }
    }, [auth?.token]);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading dashboard statistics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                <FaExclamationTriangle className="me-2" />
                {error}
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    return (
        <div className="dashboard-stats">
            {/* Summary Cards */}
            <div className="row g-4 mb-4">
                <div className="col-xl-3 col-md-6">
                    <div className="card stat-card h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="stat-icon bg-primary-light">
                                    <FaShoppingBag className="text-primary" />
                                </div>
                                <div className="ms-3">
                                    <h6 className="stat-label">Total Orders</h6>
                                    <h3 className="stat-value">{stats?.totalOrders || 0}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="card stat-card h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="stat-icon bg-success-light">
                                    <FaMoneyBillWave className="text-success" />
                                </div>
                                <div className="ms-3">
                                    <h6 className="stat-label">Total Revenue</h6>
                                    <h3 className="stat-value">{formatCurrency(stats?.totalRevenue || 0)}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="card stat-card h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="stat-icon bg-info-light">
                                    <FaUsers className="text-info" />
                                </div>
                                <div className="ms-3">
                                    <h6 className="stat-label">Total Users</h6>
                                    <h3 className="stat-value">{stats?.totalUsers || 0}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="card stat-card h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="stat-icon bg-warning-light">
                                    <FaBoxOpen className="text-warning" />
                                </div>
                                <div className="ms-3">
                                    <h6 className="stat-label">Total Products</h6>
                                    <h3 className="stat-value">{stats?.totalProducts || 0}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Status */}
            <div className="row mb-4">
                <div className="col-md-6 mb-4 mb-md-0">
                    <div className="card h-100">
                        <div className="card-header">
                            <h5 className="card-title mb-0">Order Status</h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-4">
                                <div className="col-md-3 col-6">
                                    <div className="order-status-box text-center p-3">
                                        <div className="status-icon processing mb-2">
                                            <FaSpinner />
                                        </div>
                                        <h4 className="status-count">{stats?.orderStats?.processing || 0}</h4>
                                        <p className="status-label">Processing</p>
                                    </div>
                                </div>
                                <div className="col-md-3 col-6">
                                    <div className="order-status-box text-center p-3">
                                        <div className="status-icon shipped mb-2">
                                            <FaTruck />
                                        </div>
                                        <h4 className="status-count">{stats?.orderStats?.shipped || 0}</h4>
                                        <p className="status-label">Shipped</p>
                                    </div>
                                </div>
                                <div className="col-md-3 col-6">
                                    <div className="order-status-box text-center p-3">
                                        <div className="status-icon delivered mb-2">
                                            <FaCheck />
                                        </div>
                                        <h4 className="status-count">{stats?.orderStats?.delivered || 0}</h4>
                                        <p className="status-label">Delivered</p>
                                    </div>
                                </div>
                                <div className="col-md-3 col-6">
                                    <div className="order-status-box text-center p-3">
                                        <div className="status-icon cancelled mb-2">
                                            <FaTimes />
                                        </div>
                                        <h4 className="status-count">{stats?.orderStats?.cancelled || 0}</h4>
                                        <p className="status-label">Cancelled</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="card-title mb-0">Low Stock Products</h5>
                            <Link to="/dashboard/admin/products" className="btn btn-sm btn-outline-primary">View All</Link>
                        </div>
                        <div className="card-body p-0">
                            <ul className="list-group list-group-flush">
                                {stats?.lowStockProducts?.length > 0 ? stats.lowStockProducts.map(product => (
                                    <li key={product._id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-1">{product.name}</h6>
                                            <p className="text-muted mb-0">${parseFloat(product.price).toFixed(2)}</p>
                                        </div>
                                        <span className={`badge bg-${product.quantity <= 5 ? 'danger' : 'warning'}`}>
                                            {product.quantity} left
                                        </span>
                                    </li>
                                )) : (
                                    <li className="list-group-item text-center">No low stock products found</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">Recent Orders</h5>
                    <Link to="/dashboard/admin/orders" className="btn btn-sm btn-outline-primary">View All</Link>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.recentOrders?.length > 0 ? stats.recentOrders.map(order => (
                                    <tr key={order._id}>
                                        <td>#{order._id.substring(0, 8)}</td>
                                        <td>{order.buyer?.name || 'N/A'}</td>
                                        <td>
                                            <span className={`badge bg-${order.status === 'Processing' ? 'warning' :
                                                order.status === 'Shipped' ? 'info' :
                                                    order.status === 'Delivered' ? 'success' :
                                                        'danger'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>{formatCurrency(order.totalAmount || 0)}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">No recent orders found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;