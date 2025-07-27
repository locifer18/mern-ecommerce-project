import React from 'react';
import Layout from "../../components/Layout/Layout";
import AdminMenu from '../../components/Layout/AdminMenu';
import DashboardStats from '../../components/DashboardStats';
import { useAuth } from '../../context/auth';

const AdminDashboard = () => {
    const [auth] = useAuth();

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
        <Layout title="Admin Dashboard - ShopEase">
            <div className="container-fluid py-5">
                <div className="row">
                    <div className="col-lg-3 mb-4 mb-lg-0">
                        <AdminMenu />
                    </div>
                    <div className="col-lg-9">
                        <div className="admin-dashboard">
                            <div className="welcome-header mb-4">
                                <h2>Welcome, {name}</h2>
                                <p className="text-muted">Here's what's happening with your store today.</p>
                            </div>

                            <DashboardStats />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
