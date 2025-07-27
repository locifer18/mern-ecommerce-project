import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import { useAuth } from '../context/auth'
import axios from 'axios';
import toast from 'react-hot-toast';
import Checkbox from 'antd/es/checkbox/Checkbox';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/cart';
import { FaShoppingCart, FaEye, FaStar, FaHeart, FaTruck, FaShieldAlt, FaUndo, FaHeadset } from 'react-icons/fa'
import "../styles/HomePage.css"

const HomePage = () => {
    const [auth, setAuth] = useAuth();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [cart, setCart] = useCart([]);
    const [sortBy, setSortBy] = useState("newest");
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    

    const navigate = useNavigate();

    //get all products
    const getAllProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`);
            if (data?.success) {
                setProducts(data?.products);
                setFilteredProducts(data?.products);
                
                // Set initial price range based on actual product prices
                if (data?.products?.length > 0) {
                    const prices = data.products.map(p => p.price);
                    const minPrice = Math.min(...prices);
                    const maxPrice = Math.max(...prices);
                    setPriceRange([Math.floor(minPrice), Math.ceil(maxPrice)]);
                }
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    useEffect(() => {
        if (checked.length === 0) {
            getAllProducts();
        }
    }, [checked.length, page]);

    // Filter and sort products whenever products, sortBy, priceRange, or checked changes
    useEffect(() => {
        let filtered = [...products];

        // Apply category filter
        if (checked.length > 0) {
            filtered = filtered.filter(product => 
                checked.includes(product.category._id || product.category)
            );
        }

        // Apply price range filter
        filtered = filtered.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        // Apply sorting
        switch (sortBy) {
            case "price-low-high":
                filtered.sort((a, b) => a.price - b.price);
                break;
            case "price-high-low":
                filtered.sort((a, b) => b.price - a.price);
                break;
            case "name-a-z":
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-z-a":
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "newest":
            default:
                // Assuming newer products have later createdAt dates
                filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                break;
        }

        setFilteredProducts(filtered);
    }, [products, sortBy, priceRange, checked]);

    // Function to fetch all categories
    const getAllCategories = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`);
            if (data?.success) {
                setCategories(data?.category);
            } else {
                toast.error(data?.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllCategories();
    }, []);

    const getTotal = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-count`);
            setTotal(data?.total || 0);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getTotal();
    }, []);

    // Function to handle category filter
    const handleFilter = (value, id) => {
        let all = [...checked];
        if (value) {
            all.push(id);
        } else {
            all = all.filter((c) => c !== id);
        }
        setChecked(all);
    }

    // Get filtered products from API (when using category filters)
    const getFilteredProducts = async () => {
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/product-filters`, { 
                checked, 
                radio: [] // Empty radio since we're using price range sliders
            });
            if (data?.products) {
                setProducts(data.products);
                setFilteredProducts(data.products);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (checked.length) {
            getFilteredProducts();
        }
    }, [checked]);

    //load more
    const loadMore = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`);
            setLoading(false);
            const newProducts = [...products, ...data?.products];
            setProducts(newProducts);
            setFilteredProducts(newProducts);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (page === 1) return;
        loadMore();
    }, [page]);

    //add to cart
    const handleCart = async (p) => {
        const existingItem = cart.find(item => item._id === p._id);
        if (existingItem) {
            const updateCart = cart.map(item => 
                item._id === p._id 
                    ? { ...item, quantity: (item.quantity || 1) + 1 } 
                    : item
            );
            setCart(updateCart);
            localStorage.setItem("cart", JSON.stringify(updateCart));
            toast.success("Item quantity updated in cart");
        } else {
            const newItem = { ...p, quantity: 1 };
            const updateCart = [...cart, newItem];
            setCart(updateCart);
            localStorage.setItem("cart", JSON.stringify(updateCart));
            toast.success("Item added to cart");
        }
    }

    // Reset all filters
    const resetFilters = () => {
        setChecked([]);
        setSortBy("newest");
        if (products.length > 0) {
            const prices = products.map(p => p.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            setPriceRange([Math.floor(minPrice), Math.ceil(maxPrice)]);
        } else {
            setPriceRange([0, 1000]);
        }
        getAllProducts();
    }

    // Get max price for range slider
    const getMaxPrice = () => {
        if (products.length > 0) {
            return Math.ceil(Math.max(...products.map(p => p.price)));
        }
        return 1000;
    };

    return (
        <Layout title="ShopEase - Premium Shopping Experience" description="Shop the latest products with best deals" keywords="e-commerce, online shopping, products, deals" author="ShopEase">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="hero-content">
                                <h1>Discover Amazing Products at Great Prices</h1>
                                <p>Shop the latest trends and find everything you need with our premium selection of products. Enjoy fast shipping and excellent customer service.</p>
                                <Link to="/categories" className="btn hero-btn">Shop Now</Link>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <img src="https://marketingreport.one/Article%20Images/Key%20Industy%20Images/e_commerce_Marketing_Report.jpg" alt="Hero Banner" className="hero-image" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Pills */}
            <section className="category-container">
                <div className="container">
                    <h2 className="category-title">Shop by Category</h2>
                    <div className="category-pills">
                        <Link to="/categories" className="category-pill active">All</Link>
                        {categories?.slice(0, 8).map((c) => (
                            <Link key={c._id} to={`/category/${c.slug}`} className="category-pill">{c.name}</Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="products-container">
                <div className="container">
                    <div className="row">
                        {/* Filters */}
                        <div className="col-lg-3 col-md-4">
                            <div className="filters-container">
                                <h3 className="filters-title">Filters</h3>

                                {/* Sort By Filter */}
                                <div className="filter-group">
                                    <h4 className="filter-group-title">Sort By</h4>
                                    <div className="filter-options">
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

                                {/* Category Filter */}
                                <div className="filter-group">
                                    <h4 className="filter-group-title">Categories</h4>
                                    <div className="filter-options">
                                        {categories?.map((c) => (
                                            <div className="filter-checkbox" key={c._id}>
                                                <Checkbox 
                                                    onChange={(e) => handleFilter(e.target.checked, c._id)}
                                                    checked={checked.includes(c._id)}
                                                >
                                                    {c.name}
                                                </Checkbox>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range Filter */}
                                <div className="filter-group">
                                    <h4 className="filter-group-title">Price Range</h4>
                                    <div className="filter-options">
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="me-2">$</span>
                                            <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                placeholder="Min"
                                                value={priceRange[0]}
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value) || 0;
                                                    setPriceRange([value, priceRange[1]]);
                                                }}
                                            />
                                            <span className="mx-2">-</span>
                                            <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                placeholder="Max"
                                                value={priceRange[1]}
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value) || getMaxPrice();
                                                    setPriceRange([priceRange[0], value]);
                                                }}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label small">Min: ${priceRange[0]}</label>
                                            <input
                                                type="range"
                                                className="form-range"
                                                min="0"
                                                max={getMaxPrice()}
                                                step="10"
                                                value={priceRange[0]}
                                                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label small">Max: ${priceRange[1]}</label>
                                            <input
                                                type="range"
                                                className="form-range"
                                                min="0"
                                                max={getMaxPrice()}
                                                step="10"
                                                value={priceRange[1]}
                                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="filter-actions">
                                    <button
                                        className="btn btn-reset-filters"
                                        onClick={resetFilters}
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Products */}
                        <div className="col-lg-9 col-md-8">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2 className="section-title">Featured Products</h2>
                                <div className="products-count">
                                    {filteredProducts?.length} of {products?.length} products
                                </div>
                            </div>

                            {filteredProducts?.length === 0 ? (
                                <div className="text-center py-5">
                                    <h3>No products found</h3>
                                    <p>Try adjusting your filters or check back later for new products.</p>
                                    {products?.length > 0 && (
                                        <button
                                            className="btn btn-primary mt-3"
                                            onClick={resetFilters}
                                        >
                                            Reset Filters
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="row">
                                    {filteredProducts?.map((p) => {
                                        return (
                                            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6" key={p._id}>
                                                <div className="product-card">
                                                    <div className="product-img-container">
                                                        <img
                                                            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                                                            className="product-img"
                                                            alt={p.name}
                                                        />
                                                        <div className="product-badge">New</div>
                                                    </div>
                                                    <div className="product-body">
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
                                                        <p className="product-description">{p.description.substring(0, 100)}...</p>
                                                        <div className="product-actions">
                                                            <button
                                                                className="btn btn-add-to-cart"
                                                                onClick={() => handleCart(p)}
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
                            )}

                            {/* Load More */}
                            {products && products.length < total && filteredProducts.length > 0 && (
                                <div className="load-more-container">
                                    <button
                                        className="btn btn-load-more"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPage(page + 1);
                                        }}
                                        disabled={loading}
                                    >
                                        {loading ? "Loading..." : "Load More Products"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FaTruck />
                                </div>
                                <h3 className="feature-title">Free Shipping</h3>
                                <p className="feature-description">Free shipping on all orders over $50</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FaShieldAlt />
                                </div>
                                <h3 className="feature-title">Secure Payment</h3>
                                <p className="feature-description">100% secure payment processing</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FaUndo />
                                </div>
                                <h3 className="feature-title">Easy Returns</h3>
                                <p className="feature-description">30 days return policy for eligible items</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FaHeadset />
                                </div>
                                <h3 className="feature-title">24/7 Support</h3>
                                <p className="feature-description">Dedicated support team available 24/7</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default HomePage