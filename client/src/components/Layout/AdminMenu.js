import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaTachometerAlt, FaBox, FaPlus, FaUsers, FaShoppingBag, FaTags, FaComments, FaCubes } from 'react-icons/fa'
import '../../styles/AdminDashboard.css'

const AdminMenu = () => {
  return (
    <div className="admin-sidebar">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-dark text-white">
          <h4 className="mb-0">Admin Panel</h4>
        </div>
        <div className="list-group list-group-flush">
          <NavLink 
            to="/dashboard/admin" 
            className="list-group-item list-group-item-action sidebar-link"
            end
          >
            <FaTachometerAlt className="sidebar-icon" /> Dashboard
          </NavLink>
          <NavLink 
            to="/dashboard/admin/create-category" 
            className="list-group-item list-group-item-action sidebar-link"
          >
            <FaTags className="sidebar-icon" /> Create Category
          </NavLink>
          <NavLink 
            to="/dashboard/admin/create-product" 
            className="list-group-item list-group-item-action sidebar-link"
          >
            <FaPlus className="sidebar-icon" /> Create Product
          </NavLink>
          <NavLink 
            to="/dashboard/admin/products" 
            className="list-group-item list-group-item-action sidebar-link"
          >
            <FaBox className="sidebar-icon" /> Products
          </NavLink>
        
          <NavLink 
            to="/dashboard/admin/orders" 
            className="list-group-item list-group-item-action sidebar-link"
          >
            <FaShoppingBag className="sidebar-icon" /> Orders
          </NavLink>
          <NavLink 
            to="/dashboard/admin/users" 
            className="list-group-item list-group-item-action sidebar-link"
          >
            <FaUsers className="sidebar-icon" /> Users
          </NavLink>
         
        </div>
      </div>


    </div>
  )
}

export default AdminMenu