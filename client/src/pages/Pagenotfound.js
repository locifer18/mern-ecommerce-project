import React from 'react'
import Layout from '../components/Layout/Layout'
import { Link } from "react-router-dom";
import '../styles/PNFStyles.css'
import { FaExclamationTriangle, FaArrowLeft, FaSearch, FaHome } from 'react-icons/fa';

const Pagenotfound = () => {
    return (
        <Layout title="Page Not Found - ShopEase">
            <div className='pnf-container'>
                <div className='pnf-content'>
                    <div className='pnf-icon'>
                        <FaExclamationTriangle />
                    </div>
                    <h1 className='pnf-title'>404</h1>
                    <h2 className='pnf-heading'>Oops! Page Not Found</h2>
                    <p className='pnf-message'>
                        The page you are looking for might have been removed, had its name changed, 
                        or is temporarily unavailable.
                    </p>
                    <div className='pnf-actions'>
                        <Link to="/" className='pnf-btn primary'>
                            <FaHome className='btn-icon' /> Back to Home
                        </Link>
                        <Link to="/categories" className='pnf-btn secondary'>
                            <FaSearch className='btn-icon' /> Browse Categories
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Pagenotfound