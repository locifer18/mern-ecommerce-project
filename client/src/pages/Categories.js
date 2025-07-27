import React from 'react'
import { Link } from 'react-router-dom';
import { FaTags, FaArrowRight } from 'react-icons/fa';
import Layout from '../components/Layout/Layout';
import useCategory from '../hooks/useCategory';
import "../styles/Category.css";

const Categories = () => {
    const categories = useCategory();
    return (
        <Layout title="Shop by Categories - ShopEase">
            <div className="categories-page">
                {/* Header Section */}
                <section className="py-5" style={{ background: 'linear-gradient(135deg, #4a6cf7 0%, #2a3f9d 100%)', color: 'white' }}>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 text-center text-lg-start mb-4 mb-lg-0">
                                <div className="d-inline-flex align-items-center mb-3">
                                    <FaTags className="me-3" style={{ fontSize: '2.5rem' }} />
                                    <h1 className="mb-0">Shop by Categories</h1>
                                </div>
                                <p className="lead">Browse our wide range of product categories and find exactly what you're looking for.</p>
                            </div>
                            <div className="col-lg-6">
                                <div className="d-flex justify-content-center justify-content-lg-end">
                                    <div className="search-container">
                                        <input 
                                            type="text" 
                                            className="form-control form-control-lg" 
                                            placeholder="Search categories..." 
                                            style={{ borderRadius: '30px', paddingLeft: '20px', paddingRight: '20px' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Grid */}
                <section className="py-5">
                    <div className="container">
                        <div className="row g-4">
                            {categories?.length === 0 ? (
                                <div className="col-12 text-center py-5">
                                    <h3>No categories found</h3>
                                    <p>Please check back later for updated categories.</p>
                                </div>
                            ) : (
                                categories?.map((c) => (
                                    <div className="col-md-6 col-lg-4" key={c._id}>
                                        <Link to={`/category/${c.slug}`} className="text-decoration-none">
                                            <div className="card h-100 border-0 shadow-sm category-card">
                                                <div className="card-body p-4">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <h3 className="card-title mb-0">{c.name}</h3>
                                                        <div className="category-icon">
                                                            <FaArrowRight />
                                                        </div>
                                                    </div>
                                                    <p className="text-muted mt-3 mb-0">Explore our collection of {c.name}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {/* Featured Categories */}
                <section className="py-5 bg-light">
                    <div className="container">
                        <div className="text-center mb-5">
                            <h2 className="mb-3">Featured Categories</h2>
                            <p className="lead">Discover our most popular product categories</p>
                        </div>
                        
                        <div className="row g-4">
                            {categories?.slice(0, 3).map((c) => (
                                <div className="col-md-4" key={`featured-${c._id}`}>
                                    <div className="card border-0 shadow-sm overflow-hidden featured-category">
                                        <div className="position-relative">
                                            <div className="category-image" style={{ height: '200px', background: '#f0f4ff' }}>
                                                <div className="d-flex align-items-center justify-content-center h-100">
                                                    <FaTags style={{ fontSize: '4rem', color: '#4a6cf7', opacity: '0.3' }} />
                                                </div>
                                            </div>
                                            <div className="category-overlay">
                                                <div className="category-content">
                                                    <h3>{c.name}</h3>
                                                    <Link to={`/category/${c.slug}`} className="btn btn-light btn-sm">
                                                        Shop Now <FaArrowRight className="ms-2" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-body p-5 text-center">
                                        <h2 className="mb-3">Can't find what you're looking for?</h2>
                                        <p className="lead mb-4">Our customer support team is here to help you find the perfect product.</p>
                                        <Link to="/contact" className="btn btn-primary btn-lg">
                                            Contact Us
                                        </Link>
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

export default Categories