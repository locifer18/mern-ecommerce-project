import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaHeart, FaMapMarkerAlt, FaBell, FaSignOutAlt } from 'react-icons/fa';
import '../../styles/DashboardStyles.css';

const UserMenu = () => {
    return (
        <div className="user-menu">
            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    <div className="list-group list-group-flush">
                        <NavLink 
                            to="/dashboard/user" 
                            className="list-group-item list-group-item-action"
                        >
                            <FaUser className="menu-icon" /> Dashboard
                        </NavLink>
                        <NavLink 
                            to="/dashboard/user/profile" 
                            className="list-group-item list-group-item-action"
                        >
                            <FaUser className="menu-icon" /> Profile
                        </NavLink>
                        <NavLink 
                            to="/dashboard/user/orders" 
                            className="list-group-item list-group-item-action"
                        >
                            <FaShoppingBag className="menu-icon" /> Orders
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserMenu;