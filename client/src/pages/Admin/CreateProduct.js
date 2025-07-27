import React, { useEffect, useState } from 'react'
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import toast from 'react-hot-toast';
import axios from 'axios';
import { Select } from 'antd';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [shipping, setShipping] = useState('');
    const [category, setCategory] = useState('');
    const [photo, setPhoto] = useState('');
    const navigate = useNavigate();

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

    // Function to create a new product
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            productData.append("category", category);
            productData.append("shipping", shipping);
            productData.append("photo", photo);

            const { data } = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/product/create-product`,
                productData
            );
            if (data?.success) {
                toast.success(data?.message);
                setPhoto('');
                setName('');
                setDescription('');
                setPrice('');
                setQuantity('');
                setShipping('');
            } else {
                toast.success(`${name} is created`);
                navigate('/dashboard/admin/products');
            }
        } catch (error) {
            toast.error('Error in creating product');
        }
    }
    return (
        <Layout title={'Create Product - Admin Dashboard'} description={'Create Product Page'}>
            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-lg-3 col-xl-2 mb-4 mb-lg-0'>
                            <AdminMenu />
                        </div>
                    <div className='col-md-9'>
                        <h1>Create Product</h1>
                        <div className='m-1 w-75'>
                            <Select variant={false} placeholder="Select a category" size="large" showSearch className='form-select mb-3' onChange={(value) => { setCategory(value) }}>
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
                                {photo && (
                                    <div className='text-center'>
                                        <img src={URL.createObjectURL(photo)} alt='product_photo' height={'200px'} className='img img-responsive' />
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
                                <Select variant={false} placeholder="Select Shipping" size="large" showSearch className='form-select mb-3' onChange={(value) => { setShipping(value) }}>
                                    <Select.Option value="0">No</Select.Option>
                                    <Select.Option value="1">Yes</Select.Option>
                                </Select>
                            </div>
                            <div className='mb-3'>
                                <button className='btn btn-primary' onClick={(e) => { handleCreate(e) }}>Create Product</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>)
}

export default CreateProduct