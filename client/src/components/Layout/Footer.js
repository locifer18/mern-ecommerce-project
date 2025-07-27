import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaCreditCard, FaPaypal, FaApplePay, FaGooglePay, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';
import '../../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-6 mb-5 mb-lg-0">
                            <div className="footer-widget">
                                <h3 className="widget-title">ShopEase</h3>
                                <p className="widget-text">
                                    Your one-stop destination for all your shopping needs. We offer a wide range of products
                                    with the best prices and quality.
                                </p>
                                <div className="social-links">
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                        <FaFacebookF />
                                    </a>
                                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                        <FaTwitter />
                                    </a>
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                        <FaInstagram />
                                    </a>
                                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                        <FaLinkedinIn />
                                    </a>
                                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                        <FaYoutube />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-6 mb-5 mb-lg-0">
                            <div className="footer-widget">
                                <h3 className="widget-title">Quick Links</h3>
                                <ul className="widget-links">
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/categories">Shop</Link></li>
                                    <li><Link to="/categories">Categories</Link></li>
                                    <li><Link to="/about">About Us</Link></li>
                                    <li><Link to="/contact">Contact</Link></li>
                                    <li><Link to="/policy">Policy</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-6 mb-5 mb-md-0">
                            <div className="footer-widget">
                                <h3 className="widget-title">Customer Service</h3>
                                <ul className="widget-links">
                                    <li><Link to="/faq">FAQ</Link></li>
                                    <li><Link to="/shipping">Shipping Policy</Link></li>
                                    <li><Link to="/returns">Returns & Exchanges</Link></li>
                                    <li><Link to="/terms">Terms & Conditions</Link></li>
                                    <li><Link to="/privacy">Privacy Policy</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="footer-widget">
                                <h3 className="widget-title">Contact Info</h3>
                                <ul className="contact-info">
                                    <li>
                                        <FaMapMarkerAlt className="me-2" />
                                        <span>123 Commerce Street, Business City, Country</span>
                                    </li>
                                    <li>
                                        <FaPhoneAlt className="me-2" />
                                        <span>+1 (555) 123-4567</span>
                                    </li>
                                    <li>
                                        <FaEnvelope className="me-2" />
                                        <span>support@shopease.com</span>
                                    </li>
                                    <li>
                                        <FaClock className="me-2" />
                                        <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
                                    </li>
                                </ul>
                                <div className="payment-methods">
                                    <span className="payment-icon"><FaCreditCard /></span>
                                    <span className="payment-icon"><FaPaypal /></span>
                                    <span className="payment-icon"><FaApplePay /></span>
                                    <span className="payment-icon"><FaGooglePay /></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <p className="copyright">
                                &copy; {new Date().getFullYear()} ShopEase. All Rights Reserved.
                            </p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <div className="footer-links">
                                <Link to="/terms">Terms</Link>
                                <Link to="/privacy">Privacy</Link>
                                <Link to="/cookies">Cookies</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;