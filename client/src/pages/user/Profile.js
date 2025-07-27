import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu';
import { useAuth } from '../../context/auth';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock } from 'react-icons/fa';

const Profile = () => {
    const [auth, setAuth] = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    // Set initial form values
    useEffect(() => {
        if (auth?.user) {
            const { name, email, phone, address } = auth.user;
            setName(name || '');
            setEmail(email || '');
            setPhone(phone || '');
            setAddress(address || '');
        }
    }, [auth?.user]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.put(
                `${process.env.REACT_APP_API}/api/v1/auth/profile`,
                { name, email, password, phone, address },
                {
                    headers: {
                        Authorization: auth?.token
                    }
                }
            );
            
            if (data?.success) {
                setAuth({ ...auth, user: data?.updatedUser });
                
                // Update localStorage
                let localStorageData = JSON.parse(localStorage.getItem('auth'));
                localStorageData.user = data.updatedUser;
                localStorage.setItem('auth', JSON.stringify(localStorageData));
                
                toast.success('Profile updated successfully');
                setPassword('');
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast.error('Error updating profile');
            setLoading(false);
        }
    };

    return (
        <Layout title="My Profile - ShopEase">
            <div className="container-fluid py-5">
                <div className="row">
                    <div className="col-lg-3 mb-4 mb-lg-0">
                        <UserMenu />
                    </div>
                    <div className="col-lg-9">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <ul className="nav nav-tabs mb-4">
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('profile')}
                                        >
                                            <FaUser className="me-2" /> Profile
                                        </button>
                                    </li>
                                  
                                </ul>
                                
                                {activeTab === 'profile' ? (
                                    <div className="profile-tab">
                                        <h2 className="mb-4">My Profile</h2>
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="name" className="form-label">
                                                        <FaUser className="me-2" /> Full Name
                                                    </label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        id="name" 
                                                        value={name} 
                                                        onChange={(e) => setName(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="email" className="form-label">
                                                        <FaEnvelope className="me-2" /> Email Address
                                                    </label>
                                                    <input 
                                                        type="email" 
                                                        className="form-control" 
                                                        id="email" 
                                                        value={email} 
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        disabled
                                                    />
                                                    <small className="text-muted">Email cannot be changed</small>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="phone" className="form-label">
                                                        <FaPhone className="me-2" /> Phone Number
                                                    </label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        id="phone" 
                                                        value={phone} 
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="password" className="form-label">
                                                        <FaLock className="me-2" /> Password
                                                    </label>
                                                    <input 
                                                        type="password" 
                                                        className="form-control" 
                                                        id="password" 
                                                        value={password} 
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        placeholder="Enter new password (leave empty to keep current)"
                                                    />
                                                    <small className="text-muted">Minimum 6 characters</small>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="address" className="form-label">
                                                    <FaMapMarkerAlt className="me-2" /> Default Address
                                                </label>
                                                <textarea 
                                                    className="form-control" 
                                                    id="address" 
                                                    rows="3" 
                                                    value={address} 
                                                    onChange={(e) => setAddress(e.target.value)}
                                                    required
                                                ></textarea>
                                            </div>
                                            <button 
                                                type="submit" 
                                                className="btn btn-primary"
                                                disabled={loading}
                                            >
                                                {loading ? 'Updating...' : 'Update Profile'}
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="addresses-tab">
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;