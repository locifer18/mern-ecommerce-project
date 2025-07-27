import React from 'react'
import { FaCheckCircle, FaUsers, FaShippingFast, FaHeadset, FaAward, FaStar } from 'react-icons/fa'
import '../styles/AboutStyles.css'
import Layout from '../components/Layout/Layout'

const About = () => {
    return (
        <Layout title="About Us - ShopEase">
            <div className="about-page">
                {/* Hero Section */}
                <section className="about-hero py-5" style={{ background: 'linear-gradient(135deg, #4a6cf7 0%, #2a3f9d 100%)', color: 'white' }}>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 mb-4 mb-lg-0">
                                <h1 className="display-4 fw-bold mb-4">About ShopEase</h1>
                                <p className="lead mb-4">We're dedicated to providing the best shopping experience with quality products and exceptional customer service.</p>
                                <div className="d-flex flex-wrap">
                                    <div className="me-4 mb-3">
                                        <div className="d-flex align-items-center">
                                            <FaCheckCircle className="me-2" />
                                            <span>Premium Quality</span>
                                        </div>
                                    </div>
                                    <div className="me-4 mb-3">
                                        <div className="d-flex align-items-center">
                                            <FaCheckCircle className="me-2" />
                                            <span>24/7 Support</span>
                                        </div>
                                    </div>
                                    <div className="me-4 mb-3">
                                        <div className="d-flex align-items-center">
                                            <FaCheckCircle className="me-2" />
                                            <span>Fast Shipping</span>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="d-flex align-items-center">
                                            <FaCheckCircle className="me-2" />
                                            <span>Secure Payments</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <img src="/images/about.jpeg" alt="About ShopEase" className="img-fluid rounded shadow" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Story Section */}
                <section className="py-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 mb-4 mb-lg-0">
                                <img src="/images/contactus.jpeg" alt="Our Story" className="img-fluid rounded shadow" />
                            </div>
                            <div className="col-lg-6">
                                <h2 className="mb-4">Our Story</h2>
                                <p className="mb-4">ShopEase was founded in 2020 with a simple mission: to make online shopping easy, enjoyable, and accessible to everyone. What started as a small venture has now grown into a trusted e-commerce platform serving thousands of customers.</p>
                                <p className="mb-4">Our team is passionate about curating high-quality products and providing an exceptional shopping experience. We work directly with manufacturers and brands to ensure that every item in our catalog meets our strict quality standards.</p>
                                <p>We believe in building lasting relationships with our customers through transparency, reliability, and outstanding service. Your satisfaction is our top priority, and we're constantly working to improve and innovate.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="py-5 bg-light">
                    <div className="container">
                        <div className="text-center mb-5">
                            <h2 className="mb-3">Why Choose ShopEase</h2>
                            <p className="lead">We're committed to providing the best shopping experience</p>
                        </div>
                        <div className="row g-4">
                            <div className="col-md-6 col-lg-3">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body text-center">
                                        <div className="mb-3" style={{ color: '#4a6cf7', fontSize: '2.5rem' }}>
                                            <FaUsers />
                                        </div>
                                        <h5 className="card-title">Customer First</h5>
                                        <p className="card-text">We prioritize our customers' needs and satisfaction above everything else.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-3">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body text-center">
                                        <div className="mb-3" style={{ color: '#4a6cf7', fontSize: '2.5rem' }}>
                                            <FaShippingFast />
                                        </div>
                                        <h5 className="card-title">Fast Delivery</h5>
                                        <p className="card-text">We ensure quick processing and shipping to get your orders to you on time.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-3">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body text-center">
                                        <div className="mb-3" style={{ color: '#4a6cf7', fontSize: '2.5rem' }}>
                                            <FaHeadset />
                                        </div>
                                        <h5 className="card-title">24/7 Support</h5>
                                        <p className="card-text">Our dedicated support team is always available to assist you with any questions.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-3">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body text-center">
                                        <div className="mb-3" style={{ color: '#4a6cf7', fontSize: '2.5rem' }}>
                                            <FaAward />
                                        </div>
                                        <h5 className="card-title">Quality Products</h5>
                                        <p className="card-text">We carefully select and verify all products to ensure premium quality.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-5">
                    <div className="container">
                        <div className="text-center mb-5">
                            <h2 className="mb-3">Meet Our Team</h2>
                            <p className="lead">The dedicated people behind ShopEase</p>
                        </div>
                        <div className="row g-4">
                            <div className="col-md-6 col-lg-3">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body text-center">
                                        <div className="rounded-circle overflow-hidden mx-auto mb-3" style={{ width: '120px', height: '120px' }}>
                                            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Team Member" className="img-fluid" />
                                        </div>
                                        <h5 className="card-title">John Doe</h5>
                                        <p className="text-muted">CEO & Founder</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-3">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body text-center">
                                        <div className="rounded-circle overflow-hidden mx-auto mb-3" style={{ width: '120px', height: '120px' }}>
                                            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Team Member" className="img-fluid" />
                                        </div>
                                        <h5 className="card-title">Jane Smith</h5>
                                        <p className="text-muted">Operations Manager</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-3">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body text-center">
                                        <div className="rounded-circle overflow-hidden mx-auto mb-3" style={{ width: '120px', height: '120px' }}>
                                            <img src="https://randomuser.me/api/portraits/men/67.jpg" alt="Team Member" className="img-fluid" />
                                        </div>
                                        <h5 className="card-title">Mike Johnson</h5>
                                        <p className="text-muted">Product Manager</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-3">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body text-center">
                                        <div className="rounded-circle overflow-hidden mx-auto mb-3" style={{ width: '120px', height: '120px' }}>
                                            <img src="https://randomuser.me/api/portraits/women/23.jpg" alt="Team Member" className="img-fluid" />
                                        </div>
                                        <h5 className="card-title">Sarah Williams</h5>
                                        <p className="text-muted">Customer Support</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    )
}

export default About