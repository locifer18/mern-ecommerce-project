import React, { useState, useEffect } from "react";
import Layout from '../components/Layout/Layout'
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/cart";
import '../styles/CategoryProductStyles.css'
import toast from "react-hot-toast";
import { FaShoppingCart, FaEye, FaStar, FaArrowLeft, FaFilter, FaSort } from 'react-icons/fa';

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useCart();
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const getProductsByCat = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setFilteredProducts(data?.products);
      setCategory(data?.category);
      
      // Set initial price range based on actual product prices
      if (data?.products?.length > 0) {
        const prices = data.products.map(p => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([Math.floor(minPrice), Math.ceil(maxPrice)]);
      }
      
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.slug) getProductsByCat();
  }, [params?.slug]);

  // Filter and sort products whenever products, sortBy, or priceRange changes
  useEffect(() => {
    let filtered = [...products];

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
  }, [products, sortBy, priceRange]);

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

  // Reset filters function
  const handleResetFilters = () => {
    if (products.length > 0) {
      const prices = products.map(p => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([Math.floor(minPrice), Math.ceil(maxPrice)]);
    } else {
      setPriceRange([0, 1000]);
    }
    setSortBy("newest");
  };

  // Get max price for range slider
  const getMaxPrice = () => {
    if (products.length > 0) {
      return Math.ceil(Math.max(...products.map(p => p.price)));
    }
    return 1000;
  };

  return (
    <Layout title={`${category?.name || 'Category'} - ShopEase`}>
      <div className="category-products-page">
        {/* Header Section */}
        <section className="py-4" style={{ background: 'linear-gradient(135deg, #4a6cf7 0%, #2a3f9d 100%)', color: 'white' }}>
          <div className="container">
            <div className="d-flex align-items-center mb-3">
              <Link to="/categories" className="text-white text-decoration-none d-flex align-items-center">
                <FaArrowLeft className="me-2" /> All Categories
              </Link>
            </div>
            <h1 className="mb-2">{category?.name || 'Products'}</h1>
            <p className="lead mb-0">
              {filteredProducts?.length} of {products?.length} products found
            </p>
          </div>
        </section>

        <div className="container py-5">
          <div className="row">
            {/* Filters Sidebar */}
            <div className="col-lg-3 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-4">
                    <FaFilter className="me-2" style={{ color: '#4a6cf7' }} />
                    <h4 className="mb-0">Filters</h4>
                  </div>

                  <div className="mb-4">
                    <h5 className="mb-3">Price Range</h5>
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

                  <div className="mb-4">
                    <h5 className="mb-3">Sort By</h5>
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

                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={handleResetFilters}
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="col-lg-9">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Loading products...</p>
                </div>
              ) : filteredProducts?.length === 0 ? (
                <div className="text-center py-5">
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or check back later for new products.</p>
                  {products?.length > 0 && (
                    <button
                      className="btn btn-primary mt-3"
                      onClick={handleResetFilters}
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="row g-4">
                  {filteredProducts.map((p) => {
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
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;