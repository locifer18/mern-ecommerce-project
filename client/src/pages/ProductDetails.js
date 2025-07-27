import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/auth'
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';
import { FaShoppingCart, FaArrowLeft, FaStar, FaStarHalfAlt} from 'react-icons/fa';
import '../styles/ProductDetailsStyles.css';

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Get product details  
  const getAllProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use the slug directly from params
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`);

      if (data?.success && data?.product) {
        setProduct(data.product);

        // Only call getRelatedProduct if both IDs exist
        if (data.product._id && data.product.category?._id) {
          await getRelatedProduct(data.product._id, data.product.category._id);
        }
      } else {
        console.log('Product not found:', params.slug);
        setError('Product not found');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      if (error.response?.status === 404) {
        setError(`Product "${params.slug}" not found. It may have been removed or renamed.`);
      } else {
        setError('Failed to load product. Please try again.');
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    if (params?.slug) {
      getAllProducts();
    }
  }, [params?.slug]);

  // Track recently viewed products
  useEffect(() => {
    if (product) {
      // Get existing recently viewed products
      const recentlyViewed = localStorage.getItem('recentlyViewed')
        ? JSON.parse(localStorage.getItem('recentlyViewed'))
        : [];

      // Create simplified product object
      const productToSave = {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        description: product.description?.substring(0, 100) || ''
      };

      // Remove product if it already exists in the list
      const filteredProducts = recentlyViewed.filter(p => p._id !== product._id);

      // Add product to the beginning of the list
      const updatedProducts = [productToSave, ...filteredProducts].slice(0, 8);

      // Save to localStorage
      localStorage.setItem('recentlyViewed', JSON.stringify(updatedProducts));
    }
  }, [product]);

  // Get related products
  const getRelatedProduct = async (pid, cid) => {
    // Skip API call if product ID or category ID is missing
    if (!pid || !cid) return;

    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`);
      setRelated(data?.products || []);
    } catch (error) {
      console.error('Error fetching related products:', error);
      // Don't set error state for related products as it's not critical
    }
  }

  // Add to cart function
  const addToCart = (productToAdd) => {
    if (!productToAdd || !productToAdd._id) {
      toast.error('Invalid product');
      return;
    }

    // Check if product has variants and one is selected
    if (productToAdd.variants && productToAdd.variants.length > 0 && !selectedVariant) {
      toast.error('Please select product options');
      return;
    }

    // Check if selected variant is in stock
    if (selectedVariant && selectedVariant.quantity <= 0) {
      toast.error('Selected variant is out of stock');
      return;
    }

    try {
      // Create item to add with variant info if available
      const itemToAdd = selectedVariant ?
        {
          ...productToAdd,
          variantId: selectedVariant._id,
          variantOptions: selectedVariant.options,
          price: selectedVariant.price || productToAdd.price
        } :
        productToAdd;

      // Check if item with same variant exists in cart
      const existingItemIndex = cart.findIndex(item => {
        if (selectedVariant) {
          return item._id === productToAdd._id && item.variantId === selectedVariant._id;
        }
        return item._id === productToAdd._id;
      });

      if (existingItemIndex !== -1) {
        // If item exists, update quantity
        const updatedCart = [...cart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: (updatedCart[existingItemIndex].quantity || 1) + 1
        };
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        toast.success('Item quantity updated in cart');
      } else {
        // Add new item with quantity 1
        const newItem = { ...itemToAdd, quantity: 1 };
        const updatedCart = [...cart, newItem];
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        toast.success('Item added to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  }

  // Error state
  if (error) {
    return (
      <Layout title="Error">
        <div className="container py-5">
          <div className="text-center">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error</h4>
              <p>{error}</p>
            </div>
            <Link to="/" className="btn btn-primary">
              <FaArrowLeft className="me-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={product?.name || "Product Details"}>
      <div className='product-details-container'>
        <div className='container'>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading product details...</p>
            </div>
          ) : product ? (
            <>
              <div className='product-breadcrumb'>
                <Link to="/">Home</Link>
                <span>/</span>
                {product.category && (
                  <>
                    <Link to={`/category/${product.category.slug}`}>{product.category.name}</Link>
                    <span>/</span>
                  </>
                )}
                <span>{product.name}</span>
              </div>

              <div className='row'>
                <div className='col-lg-5 col-md-6 mb-4'>
                  <div className='product-image-container'>
                    <img className='product-image'
                      src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                      alt='Product' 
                    />
                  </div>
                </div>
                
                <div className='col-lg-7 col-md-6'>
                  <div className='product-info'>
                    <h1 className='product-title'>{product.name}</h1>

                    <div className='product-price'>
                      ${product.price ? parseFloat(product.price).toFixed(2) : '0.00'}
                    </div>

                    <div className='product-description'>
                      <p>{product.description || 'No description available'}</p>
                    </div>



                    <div className='product-meta'>
                      {product.category && (
                        <div className='meta-item'>
                          <div className='meta-label'>Category:</div>
                          <div className='meta-value'>{product.category.name}</div>
                        </div>
                      )}
                      <div className='meta-item'>
                        <div className='meta-label'>Availability:</div>
                        <div className='meta-value'>
                          {selectedVariant ?
                            (selectedVariant.quantity > 0 ? 'In Stock' : 'Out of Stock') :
                            (product.quantity > 0 ? 'In Stock' : 'Out of Stock')}
                        </div>
                      </div>
                    </div>

                    <div className='product-actions'>
                      <button
                        className='btn btn-add-to-cart'
                        onClick={() => addToCart(product)}
                        disabled={!product._id}
                      >
                        <FaShoppingCart className='icon' /> Add to Cart
                      </button>
                      <Link to="/cart" className='btn btn-buy-now'>View Cart</Link>
                    </div>


                  </div>
                </div>
              </div>

              <div className="product-tabs mt-5">
                <ul className="nav nav-tabs" id="productTabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="description-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#description"
                      type="button"
                      role="tab"
                    >
                      Description
                    </button>
                  </li>
                  
                </ul>

                <div className="tab-content p-4 border border-top-0 rounded-bottom" id="productTabsContent">
                  <div
                    className="tab-pane fade show active"
                    id="description"
                    role="tabpanel"
                  >
                    <h4>Product Description</h4>
                    <p>{product.description || 'No detailed description available for this product.'}</p>

                    {product.features && (
                      <div className="mt-4">
                        <h5>Features</h5>
                        <ul>
                          {product.features.split('\n').map((feature, index) => (
                            <li key={index}>{feature.trim()}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className="tab-pane fade"
                  id="faq"
                  role="tabpanel"
                >

                  <div className="text-center mt-4">
                    <Link to={`/product/${params.slug}/faqs`} className="btn btn-outline-primary">
                      View All FAQs & Ask Questions
                    </Link>
                  </div>
                </div>

                <div
                  className="tab-pane fade"
                  id="delivery"
                  role="tabpanel"
                >
                </div>
              </div>

              {related && related.length > 0 && (
                <div className='related-products'>
                  <h2 className='related-products-title'>Related Products</h2>
                  <div className='row'>
                    {related.map((p) => (
                      <div className='col-lg-3 col-md-4 col-sm-6 mb-4' key={p._id}>
                        <div className='related-product-card'>
                          <Link to={`/product/${p.slug}`}>
                            <img
                              src={`http://localhost:8080/api/v1/product/product-photo/${p._id}`}
                              className='card-img-top related-product-img'
                              alt={p.name || 'Related product'}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/placeholder.png';
                              }}
                            />
                          </Link>
                          <div className='related-product-body'>
                            <Link to={`/product/${p.slug}`} className="text-decoration-none">
                              <h5 className='related-product-title'>{p.name}</h5>
                            </Link>
                            <p className='related-product-price'>
                              ${p.price ? parseFloat(p.price).toFixed(2) : '0.00'}
                            </p>
                            <p className='related-product-desc'>
                              {p.description ? `${p.description.substring(0, 60)}...` : 'No description available'}
                            </p>
                            <button
                              className='btn btn-related-add'
                              onClick={() => addToCart(p)}
                              disabled={!p._id}
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-5">
              <div className="alert alert-warning" role="alert">
                <h4 className="alert-heading">Product Not Found</h4>
                <p>The product you're looking for doesn't exist or has been removed.</p>
              </div>
              <Link to="/" className="btn btn-primary">
                <FaArrowLeft className="me-2" />
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout >
  )
}

export default ProductDetails