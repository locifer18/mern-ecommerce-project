import React, { useEffect, useState } from 'react'
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import toast from 'react-hot-toast';
import axios from 'axios';
import { Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { set } from 'mongoose';

const UpdateProduct = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [shipping, setShipping] = useState('');
    const [category, setCategory] = useState('');
    const [photo, setPhoto] = useState('');
    const [id, setId] = useState('');
    const navigate = useNavigate();
    const params = useParams()

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
            toast.error('Error fetching categories');
        }
    }

    useEffect(() => {
        getAllCategories();
    }, []);

    //get single product
    const getSingleProduct = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`);
            setName(data.product.name);
            setId(data.product._id);
            setDescription(data.product.description);
            setPrice(data.product.price);
            setQuantity(data.product.quantity);
            setShipping(data.product.shipping);
            setCategory(data.product.category._id);
        } catch (error) {
            toast.error('Error in getting single product');
        }
    }

    useEffect(() => {
        getSingleProduct();
        // eslint-disable-next-line
    }, []);

    // Function to Update a new product
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            productData.append("category", category);
            productData.append("shipping", shipping);
            photo && productData.append("photo", photo);

            const { data } = await axios.put(
                `${process.env.REACT_APP_API}/api/v1/product/update-product/${id}`,
                productData
            );
            if (data?.success) {
                toast.success(data?.message);
                navigate('/dashboard/admin/products');
            } else {
                toast.success(`${name} is created`);
                navigate('/dashboard/admin/products');
            }
        } catch (error) {
            toast.error('Error in creating product');
        }
    }

    //delete a product
    const handleDelete = async () => {
        try {
            let answer = window.prompt("Are you sure you want to delete this product?");
            if (!answer) return;
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/product/delete-product/${id}`);
            if (data?.success) {
                toast.success(data?.message);
                navigate('/dashboard/admin/products');
            } else {
                toast.error(data?.message);
            }
        } catch (error) {
            toast.error('Error in deleting product');
        }
    }

    return (
        <Layout title={'Update Product - Admin Dashboard'} description={'Update Product Page'}>
            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-lg-3 col-xl-2 mb-4 mb-lg-0'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <h1>Update Product</h1>
                        <div className='m-1 w-75'>
                            <Select variant={false} placeholder="Select a category" size="large" showSearch className='form-select mb-3' onChange={(value) => { setCategory(value) }} value={category}>
                                {categories?.map((c) => (
                                    <Select.Option key={c._id} value={c._id}>
                                        {c.name}
                                    </Select.Option>
                                ))}
                            </Select>
                            <div className='mb-3'>
                                <label className='btn btn-outline-secondary col-md-12' >
                                    {photo ? photo.name : "Upload Image"}
                                    <input type='file' name='photo' accept='image/*' onChange={(e) => setPhoto(e.target.files[0])} hidden />
                                </label>
                            </div>
                            <div className='mb-3'>
                                {photo ? (
                                    <div className='text-center'>
                                        <img src={URL.createObjectURL(photo)} alt='product_photo' height={'200px'} className='img img-responsive' />
                                    </div>
                                ) : (
                                    <div className='text-center'>
                                        <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${id}`} alt='product_photo' height={'200px'} className='img img-responsive' />
                                    </div>
                                )}
                            </div>
                            <div className='mb-3'>
                                <input type='text' value={name} placeholder='Write a name' className='form-control' onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <textarea type='text' value={description} placeholder='Write a description' className='form-control' onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <input type='number' value={price} placeholder='Write a Price' className='form-control' onChange={(e) => setPrice(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <input type='number' value={quantity} placeholder='Write a Quantity' className='form-control' onChange={(e) => setQuantity(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <Select variant={false} placeholder="Select Shipping" size="large" showSearch className='form-select mb-3' onChange={(value) => { setShipping(value) }} value={shipping ? 'Yes' : 'NO'} >
                                    <Select.Option value="0">No</Select.Option>
                                    <Select.Option value="1">Yes</Select.Option>
                                </Select>
                            </div>
                            <div className='mb-3'>
                                <button className='btn btn-primary' onClick={(e) => { handleUpdate(e) }}>Update Product</button>
                            </div>
                            <div className='mb-3'>
                                <button className='btn btn-danger' onClick={(e) => { handleDelete(e) }}>Delete Product</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>)
}

export default UpdateProduct