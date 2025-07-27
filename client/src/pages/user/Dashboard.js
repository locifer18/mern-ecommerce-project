import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout'
import { useAuth } from '../../context/auth';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaHeart, FaMapMarkerAlt, FaUser, FaBox, FaTruck, FaCheck, FaTimes } from 'react-icons/fa';
import UserMenu from '../../components/Layout/UserMenu';
import "../../styles/DashboardStyles.css";

const Dashboard = () => {
    const [auth] = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Get user dashboard stats
    const getUserStats = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/user-stats`, {
                headers: {
                    Authorization: auth?.token
                }
            });

            if (data?.success) {
                setStats(data.stats);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth?.token) {
            getUserStats();
        }
    }, [auth?.token]);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const capitalizeWords = (text) => {
        if (!text) return '';
        return text
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const name = capitalizeWords(auth?.user?.name);


    return (
        <Layout title="User Dashboard - ShopEase">
            <div className="container-fluid py-5">
                <div className="row">
                    <div className="col-lg-3 mb-4 mb-lg-0">
                        <UserMenu />
                    </div>
                    <div className="col-lg-9">
                        <div className="welcome-header mb-4">
                            <h2>Welcome, {name}</h2>
                            <p className="text-muted">Here's an overview of your account</p>
                        </div>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-3">Loading your dashboard...</p>
                            </div>
                        ) : (
                            <>
                                {/* Quick Stats */}
                                <div className="row g-4 mb-4">
                                    <div className="col-md-6 col-lg-3">
                                        <div className="card stat-card h-100">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center">
                                                    <div className="stat-icon bg-primary-light">
                                                        <FaShoppingBag className="text-primary" />
                                                    </div>
                                                    <div className="ms-3">
                                                        <h6 className="stat-label">Orders</h6>
                                                        <h3 className="stat-value">{stats?.totalOrders || 0}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-3">
                                        <div className="card stat-card h-100">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center">
                                                    <div className="stat-icon bg-success-light">
                                                        <FaHeart className="text-success" />
                                                    </div>
                                                    <div className="ms-3">
                                                        <h6 className="stat-label">Wishlist</h6>
                                                        <h3 className="stat-value">{auth?.user?.wishlist?.length || 0}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-3">
                                        <div className="card stat-card h-100">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center">
                                                    <div className="stat-icon bg-info-light">
                                                        <FaMapMarkerAlt className="text-info" />
                                                    </div>
                                                    <div className="ms-3">
                                                        <h6 className="stat-label">Addresses</h6>
                                                        <h3 className="stat-value">{auth?.user?.shippingAddresses?.length || 0}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-3">
                                        <div className="card stat-card h-100">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center">
                                                    <div className="stat-icon bg-warning-light">
                                                        <FaUser className="text-warning" />
                                                    </div>
                                                    <div className="ms-3">
                                                        <h6 className="stat-label">Account</h6>
                                                        <h3 className="stat-value">Active</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    {/* Order Status */}
                                    <div className="card mb-4">
                                        <div className="card-header bg-white">
                                            <h5 className="mb-0">Order Status</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="row g-4">
                                                <div className="col-md-3 col-6">
                                                    <div className="order-status-box text-center p-3">
                                                        <div className="status-icon processing mb-2">
                                                            <FaBox />
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


                                    {/* Recent Orders */}
                                    <div className="card">
                                        <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                            <h5 className="mb-0">Recent Orders</h5>
                                            <Link to="/dashboard/user/orders" className="btn btn-sm btn-outline-primary">View All</Link>
                                        </div>
                                        <div className="card-body p-0">
                                            {!Array.isArray(stats?.recentOrders) || stats?.recentOrders?.length === 0 ? (
                                                <div className="text-center py-4">
                                                    <p className="mb-0">You haven't placed any orders yet.</p>
                                                </div>
                                            ) : (
                                                <div className="table-responsive">
                                                    <table className="table table-hover mb-0">
                                                        <thead>
                                                            <tr>
                                                                <th>Order ID</th>
                                                                <th>Date</th>
                                                                <th>Status</th>
                                                                <th>Total</th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {Array.isArray(stats?.recentOrders) && stats.recentOrders.map(order => (
                                                                <tr key={order._id}>
                                                                    <td>#{order?._id ? order._id.substring(0, 8) : 'Unknown'}</td>
                                                                    <td>{order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown'}</td>
                                                                    <td>
                                                                        <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                                                                            {order.status}
                                                                        </span>
                                                                    </td>
                                                                    <td>{formatCurrency(order.totalAmount || 0)}</td>
                                                                    <td>
                                                                        <Link
                                                                            to={order?._id ? `/dashboard/user/order/${order._id}` : '#'}
                                                                            className="btn btn-sm btn-outline-primary"
                                                                        >
                                                                            Details
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>


        </Layout>
    );
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

export default Dashboard;