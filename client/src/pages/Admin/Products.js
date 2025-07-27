import React, { useEffect, useState } from 'react'
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaFilter, FaPlus, FaEye } from 'react-icons/fa';
import "../../styles/Product.css";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [categories, setCategories] = useState([]);
    const [sortBy, setSortBy] = useState('newest');

    // Get all products
    const getAllProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product`);
            if (data?.success) {
                setProducts(data?.products);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong in getting products');
            setLoading(false);
        }
    }

    // Get all categories for filter product.price.toFixed
    const getAllCategories = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`);
            if (data?.success) {
                setCategories(data?.category);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Lifecycle method
    useEffect(() => {
        getAllProducts();
        getAllCategories();
    }, []);

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = categoryFilter === 'all' ||
            (product.category && product.category._id === categoryFilter);

        return matchesSearch && matchesCategory;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low-high':
                return a.price - b.price;
            case 'price-high-low':
                return b.price - a.price;
            case 'name-a-z':
                return a.name.localeCompare(b.name);
            case 'name-z-a':
                return b.name.localeCompare(a.name);
            default: // newest
                return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });

    //delete product
    const handleDelete = async (id) => {
        try {
            let answer = window.prompt("Are You Sure want to delete this product ? ");
            if (!answer) return;
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/product/delete-product/${id}`);
            toast.success("Product DEleted Succfully");
            getAllProducts();
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    return (
        <Layout title='Products - Admin Dashboard'>
            <div className='admin-products-page'>
                <div className='row'>
                    <div className='col-lg-3 col-xl-2 mb-4 mb-lg-0'>
                        <AdminMenu />
                    </div>
                    <div className='col-lg-9 col-xl-10'>
                        <div className='card border-0 shadow-sm'>
                            <div className='card-body p-4'>
                                <div className='d-flex justify-content-between align-items-center mb-4 flex-wrap'>
                                    <h2 className='mb-0'>Products Management</h2>
                                    <Link to="/dashboard/admin/create-product" className='btn btn-primary'>
                                        <FaPlus className='me-2' /> Add New Product
                                    </Link>
                                </div>

                                {/* Filters and Search */}
                                <div className='row mb-4'>
                                    <div className='col-md-4 mb-3 mb-md-0'>
                                        <div className='input-group'>
                                            <span className='input-group-text bg-white'>
                                                <FaSearch />
                                            </span>
                                            <input
                                                type='text'
                                                className='form-control'
                                                placeholder='Search products...'
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className='col-md-4 mb-3 mb-md-0'>
                                        <div className='input-group'>
                                            <span className='input-group-text bg-white'>
                                                <FaFilter />
                                            </span>
                                            <select
                                                className='form-select'
                                                value={categoryFilter}
                                                onChange={(e) => setCategoryFilter(e.target.value)}
                                            >
                                                <option value='all'>All Categories</option>
                                                {categories.map(category => (
                                                    <option key={category._id} value={category._id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className='input-group'>
                                            <span className='input-group-text bg-white'>
                                                Sort By
                                            </span>
                                            <select
                                                className='form-select'
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value)}
                                            >
                                                <option value='newest'>Newest</option>
                                                <option value='price-low-high'>Price: Low to High</option>
                                                <option value='price-high-low'>Price: High to Low</option>
                                                <option value='name-a-z'>Name: A to Z</option>
                                                <option value='name-z-a'>Name: Z to A</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Products Grid */}
                                {loading ? (
                                    <div className='text-center py-5'>
                                        <div className='spinner-border text-primary' role='status'>
                                            <span className='visually-hidden'>Loading...</span>
                                        </div>
                                        <p className='mt-3'>Loading products...</p>
                                    </div>
                                ) : sortedProducts.length === 0 ? (
                                    <div className='text-center py-5'>
                                        <h3>No products found</h3>
                                        <p className='text-muted'>
                                            {searchTerm || categoryFilter !== 'all'
                                                ? 'Try adjusting your search or filter'
                                                : 'Start by adding some products'}
                                        </p>
                                        {(searchTerm || categoryFilter !== 'all') && (
                                            <button
                                                className='btn btn-outline-primary mt-2'
                                                onClick={() => {
                                                    setSearchTerm('');
                                                    setCategoryFilter('all');
                                                }}
                                            >
                                                Clear Filters
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className='row g-4'>
                                        {sortedProducts.map((product) => (
                                            <div className='col-sm-6 col-md-4 col-lg-3' key={product._id}>
                                                <div className='product-card h-100'>
                                                    <div className='product-img-container'>
                                                        <img
                                                            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                                                            className='product-img'
                                                            alt={product.name}
                                                        />
                                                        <div className='product-actions'>
                                                            <Link
                                                                to={`/dashboard/admin/product/${product.slug}`}
                                                                className='action-btn edit'
                                                                title='Edit'
                                                            >
                                                                <FaEdit />
                                                            </Link>
                                                            <Link
                                                                to={`/product/${product.slug}`}
                                                                className='action-btn view'
                                                                title='View'
                                                                target='_blank'
                                                            >
                                                                <FaEye />
                                                            </Link>
                                                            <button
                                                                className='action-btn delete'
                                                                onClick={() => handleDelete(product._id)}
                                                                title='Delete'
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className='product-body'>
                                                        <h5 className='product-title'>{product.name}</h5>
                                                        <div className='product-category'>{product.category?.name || 'No Category'}</div>
                                                        <div className='product-price-stock'>
                                                            <div className='product-price'>${product.price}</div>
                                                            <div className='product-stock'>
                                                                <span className={`stock-badge ${product.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                                                    {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                        <style jsx="true">{`
                .admin-products-page {
                    background-color: #f8f9fa;
                }
                
                .product-card {
                    background-color: #fff;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;
                }
                
                .product-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
                }
                
                .product-img-container {
                    position: relative;
                    height: 200px;
                    overflow: hidden;
                }
                
                .product-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }
                
                .product-card:hover .product-img {
                    transform: scale(1.05);
                }
                
                .product-actions {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    opacity: 0;
                    transform: translateX(10px);
                    transition: all 0.3s ease;
                }
                
                .product-card:hover .product-actions {
                    opacity: 1;
                    transform: translateX(0);
                }
                
                .action-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .action-btn.edit {
                    background-color: #4a6cf7;
                }
                
                .action-btn.view {
                    background-color: #17a2b8;
                }
                
                .action-btn.delete {
                    background-color: #dc3545;
                }
                
                .action-btn:hover {
                    transform: scale(1.1);
                }
                
                .product-body {
                    padding: 15px;
                }
                
                .product-title {
                    font-size: 1rem;
                    font-weight: 600;
                    margin-bottom: 5px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .product-category {
                    font-size: 0.8rem;
                    color: #777;
                    margin-bottom: 10px;
                }
                
                .product-price-stock {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .product-price {
                    font-weight: 600;
                    color: #4a6cf7;
                }
                
                .stock-badge {
                    font-size: 0.8rem;
                    padding: 2px 8px;
                    border-radius: 20px;
                }
                
                .stock-badge.in-stock {
                    background-color: rgba(40, 167, 69, 0.1);
                    color: #28a745;
                }
                
                .stock-badge.out-of-stock {
                    background-color: rgba(220, 53, 69, 0.1);
                    color: #dc3545;
                }
            `}</style>
        </Layout>
    )
}

export default Products