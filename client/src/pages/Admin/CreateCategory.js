import React, { useEffect, useState } from 'react'
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import axios from 'axios';
import toast from 'react-hot-toast';
import CategoryForm from '../../components/From/CategoryForm';
import { Modal } from 'antd';
import { FaPlus, FaEdit, FaTrash, FaTags, FaSearch } from 'react-icons/fa';

const CreateCategory = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [selected, setSelected] = useState(null);
    const [visible, setVisible] = useState(false);
    const [updateName, setUpdateName] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Function to fetch all categories
    const getAllCategories = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`);
            if (data?.success) {
                setCategories(data?.category);
            } else {
                toast.error(data?.message);
            }
            setLoading(false);
        } catch (error) {
            toast.error('Error fetching categories');
            setLoading(false);
        }
    }

    // Function to create a new category
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/category/create-category`, { name });
            if (data?.success) {
                toast.success(`${name} is created`);
                getAllCategories();
                setName('');
            }
        } catch (error) {
            toast.error('Error in creating category');
        }
    }

    // Function to delete a category
    const handleDelete = async (id, categoryName) => {
        try {
            const confirmed = window.confirm(`Are you sure you want to delete "${categoryName}"?`);
            if (confirmed) {
                const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/category/delete-category/${id}`);
                if (data?.success) {
                    toast.success(`${categoryName} is deleted`);
                    getAllCategories();
                } else {
                    toast.error(data?.message);
                }
            }
        } catch (error) {
            toast.error('Error in deleting category');
        }
    }

    // Function to update a category
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/category/update-category/${selected._id}`, {
                name: updateName
            });
            if (data?.success) {
                toast.success(`Category is updated`);
                setSelected(null)
                setUpdateName("")
                setVisible(false)
                setIsUpdate(false)
                getAllCategories();
            } else {
                toast.error(data?.message);
            }
        } catch (error) {
            toast.error('Error in updating category');
        }
    }

    // Filter categories based on search term
    const filteredCategories = categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // useEffect to fetch all categories
    useEffect(() => {
        getAllCategories();
    }, [])

    return (
        <Layout title='Categories - Admin Dashboard'>
            <div className='admin-categories-page'>
                <div className='container-fluid py-5'>
                    <div className='row'>
                        <div className='col-lg-3 col-xl-2 mb-4 mb-lg-0'>
                            <AdminMenu />
                        </div>
                        <div className='col-lg-9 col-xl-10'>
                            <div className='card border-0 shadow-sm'>
                                <div className='card-body p-4'>
                                    <div className='d-flex justify-content-between align-items-center mb-4'>
                                        <h2 className='mb-0'>Categories Management</h2>
                                    </div>

                                    <div className='row'>
                                        <div className='col-lg-5 mb-4 mb-lg-0'>
                                            <div className='card border-0 shadow-sm h-100'>
                                                <div className='card-body p-4'>
                                                    <div className='d-flex align-items-center mb-3'>
                                                        <FaPlus className='me-2 text-primary' />
                                                        <h4 className='mb-0'>Add New Category</h4>
                                                    </div>
                                                    <CategoryForm 
                                                        handleSubmit={handleSubmit} 
                                                        value={name} 
                                                        setValue={setName} 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-lg-7'>
                                            <div className='card border-0 shadow-sm'>
                                                <div className='card-body p-4'>
                                                    <div className='d-flex justify-content-between align-items-center mb-3'>
                                                        <div className='d-flex align-items-center'>
                                                            <FaTags className='me-2 text-primary' />
                                                            <h4 className='mb-0'>All Categories</h4>
                                                        </div>
                                                        <div className='search-box'>
                                                            <div className='input-group'>
                                                                <span className='input-group-text bg-white'>
                                                                    <FaSearch />
                                                                </span>
                                                                <input 
                                                                    type='text' 
                                                                    className='form-control' 
                                                                    placeholder='Search categories...'
                                                                    value={searchTerm}
                                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {loading ? (
                                                        <div className='text-center py-5'>
                                                            <div className='spinner-border text-primary' role='status'>
                                                                <span className='visually-hidden'>Loading...</span>
                                                            </div>
                                                            <p className='mt-3'>Loading categories...</p>
                                                        </div>
                                                    ) : filteredCategories.length === 0 ? (
                                                        <div className='text-center py-5'>
                                                            <h5>No categories found</h5>
                                                            <p className='text-muted'>
                                                                {searchTerm 
                                                                    ? 'Try adjusting your search' 
                                                                    : 'Start by adding some categories'}
                                                            </p>
                                                            {searchTerm && (
                                                                <button 
                                                                    className='btn btn-outline-primary mt-2'
                                                                    onClick={() => setSearchTerm('')}
                                                                >
                                                                    Clear Search
                                                                </button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className='table-responsive'>
                                                            <table className='table table-hover'>
                                                                <thead>
                                                                    <tr>
                                                                        <th scope='col'>Name</th>
                                                                        <th scope='col'>Slug</th>
                                                                        <th scope='col' className='text-end'>Actions</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {filteredCategories.map((c) => (
                                                                        <tr key={c._id}>
                                                                            <td className='fw-medium'>{c.name}</td>
                                                                            <td className='text-muted'>{c.slug}</td>
                                                                            <td className='text-end'>
                                                                                <button 
                                                                                    onClick={() => { 
                                                                                        setVisible(true); 
                                                                                        setUpdateName(c.name); 
                                                                                        setSelected(c); 
                                                                                        setIsUpdate(true) 
                                                                                    }} 
                                                                                    className='btn btn-sm btn-primary me-2'
                                                                                >
                                                                                    <FaEdit /> Edit
                                                                                </button>
                                                                                <button 
                                                                                    onClick={() => handleDelete(c._id, c.name)} 
                                                                                    className='btn btn-sm btn-danger'
                                                                                >
                                                                                    <FaTrash /> Delete
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Update Category Modal */}
            <Modal 
                title={
                    <div className='d-flex align-items-center'>
                        <FaEdit className='me-2 text-primary' />
                        <span>Update Category</span>
                    </div>
                } 
                onCancel={() => {
                    setVisible(false);
                    setIsUpdate(false);
                }} 
                footer={null} 
                open={visible}
            >
                <CategoryForm 
                    value={updateName} 
                    setValue={setUpdateName} 
                    isUpdate={isUpdate} 
                    handleSubmit={handleUpdate} 
                />
            </Modal>

            <style jsx="true">{`
                .admin-categories-page {
                    background-color: #f8f9fa;
                }
                
                .search-box {
                    max-width: 250px;
                }
                
                @media (max-width: 767px) {
                    .search-box {
                        max-width: 100%;
                        margin-top: 15px;
                    }
                }
            `}</style>
        </Layout>
    )
}

export default CreateCategory