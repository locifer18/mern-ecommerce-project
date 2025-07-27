import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import { useSearch } from '../context/search';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';
import '../styles/Search.css'
import { FaSearch, FaShoppingCart, FaEye, FaStar, FaFilter, FaSort } from 'react-icons/fa';

const Search = () => {
    const [values, setValues] = useSearch();
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [sortBy, setSortBy] = useState("newest");
    const [filteredResults, setFilteredResults] = useState([]);

    // Initialize filtered results with search results
    useEffect(() => {
        if (values?.results) {
            setFilteredResults(values.results);
        }
    }, [values?.results]);

    // Add to cart function
    const handleAddToCart = (product) => {
        const existingItem = cart.find(item => item._id === product._id);

        if (existingItem) {
            // If item exists, update quantity
            const updatedCart = cart.map(item =>
                item._id === product._id
                    ? { ...item, quantity: (item.quantity || 1) + 1 }
                    : item
            );
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            toast.success('Item quantity updated in cart');
        } else {
            // Add new item with quantity 1
            const newItem = { ...product, quantity: 1 };
            setCart([...cart, newItem]);
            localStorage.setItem('cart', JSON.stringify([...cart, newItem]));
            toast.success('Item added to cart');
        }
    };

    // Sort products
    useEffect(() => {
        if (values?.results?.length > 0) {
            let sorted = [...values.results];

            switch (sortBy) {
                case "price-low-high":
                    sorted.sort((a, b) => a.price - b.price);
                    break;
                case "price-high-low":
                    sorted.sort((a, b) => b.price - a.price);
                    break;
                case "name-a-z":
                    sorted.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case "name-z-a":
                    sorted.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                default: // newest
                    // Assuming products are already sorted by newest
                    break;
            }

            setFilteredResults(sorted);
        }
    }, [sortBy, values?.results]);

    return (
        <Layout title="Search Results - ShopEase">
            <div className="search-results-page">
                {/* Header Section */}
                <section className="py-4" style={{ background: 'linear-gradient(135deg, #4a6cf7 0%, #2a3f9d 100%)', color: 'white' }}>
                    <div className="container">
                        <div className="d-flex align-items-center mb-3">
                            <FaSearch className="me-3" style={{ fontSize: '2rem' }} />
                            <div>
                                <h1 className="mb-1">Search Results</h1>
                                <p className="lead mb-0">
                                    {filteredResults?.length < 1
                                        ? "No products found matching your search"
                                        : `Found ${filteredResults?.length} product${filteredResults?.length > 1 ? 's' : ''}`}
                                </p>
                            </div>
                        </div>
                        {values?.keyword && (
                            <p className="mb-0">
                                Search term: <span className="fw-bold">{values.keyword}</span>
                            </p>
                        )}
                    </div>
                </section>

                <div className="container py-5">
                    {filteredResults?.length > 0 ? (
                        <>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h2 className="mb-0">Products</h2>
                                </div>
                                <div className="d-flex align-items-center">
                                    <FaSort className="me-2" />
                                    <select
                                        className="form-select"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="newest">Newest</option>
                                        <option value="price-low-high">Price: Low to High</option>
                                        <option value="price-high-low">Price: High to Low</option>
                                        <option value="name-a-z">Name: A to Z</option>
                                        <option value="name-z-a">Name: Z to A</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row g-4">
                                {filteredResults.map((p) => {
                                    return (
                                        <div className="col-md-6 col-lg-4" key={p._id}>
                                            <div className="product-card h-100">
                                                <div className="product-img-container">
                                                    <img
                                                        src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                                                        className="product-img"
                                                        alt={p.name}
                                                    />
                                                </div>
                                                <div className="product-body">
                                                    {p.category && (
                                                        <div className="product-category">{p.category.name}</div>
                                                    )}
                                                    <h3 className="product-title">
                                                        <Link to={`/product/${p.slug}`}>{p.name}</Link>
                                                    </h3>
                                                    <div className="product-price-rating">
                                                        <div className="product-price">
                                                            ${p.price.toLocaleString("en-US", {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2
                                                            })}
                                                        </div>
                                                    </div>
                                                    <p className="product-description">{p.description.substring(0, 60)}...</p>
                                                    <div className="product-actions">
                                                        <button
                                                            className="btn btn-add-to-cart"
                                                            onClick={() => handleAddToCart(p)}
                                                        >
                                                            <FaShoppingCart className="me-2" /> Add to Cart
                                                        </button>
                                                        <button
                                                            className="btn btn-quick-view"
                                                            onClick={() => navigate(`/product/${p.slug}`)}
                                                        >
                                                            <FaEye />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-5">
                            <div className="mb-4">
                                <FaSearch style={{ fontSize: '4rem', color: '#ddd' }} />
                            </div>
                            <h2>No products found</h2>
                            <p className="lead mb-4">We couldn't find any products matching your search criteria.</p>
                            <div>
                                <Link to="/" className="btn btn-primary me-3">
                                    Continue Shopping
                                </Link>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => {
                                        setValues({ ...values, keyword: '', results: [] });
                                        navigate('/');
                                    }}
                                >
                                    Clear Search
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default Search