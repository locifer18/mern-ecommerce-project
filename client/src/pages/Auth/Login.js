import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/AuthStyles.css';
import { useAuth } from '../../context/auth';
import { FaEnvelope, FaLock, FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [auth, setAuth] = useAuth()
    const location = useLocation()

    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            // Sending a POST request to the backend API to register the user
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/login`, {
                email,
                password
            });
            if (res && res.data.success) {
                toast.success(res.data.message);
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token
                })
                localStorage.setItem('auth', JSON.stringify(res.data))
                navigate(location.state?.from ? location.state.from : "/");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Registration failed. Please try again.");
        }
    }

    return (
        <Layout title="Login - ShopEase" description="Login to your ShopEase account" keywords="login, e-commerce, account access" author="ShopEase">
            <div className='auth-container'>
                <div className='auth-card'>
                    <div className='auth-header'>
                        <h2 className='auth-title'>Welcome Back</h2>
                        <p className='auth-subtitle'>Login to your account</p>
                    </div>
                    
                    <div className='auth-form'>
                        <form onSubmit={handlesubmit}>
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <div className="input-group">
                                    <span className="input-group-text"><FaEnvelope /></span>
                                    <input 
                                        type="email" 
                                        id="email"
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        className="form-control" 
                                        placeholder="Enter your email" 
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <div className="d-flex justify-content-between align-items-center">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <button 
                                        type="button" 
                                        onClick={() => navigate("/forgot-password")} 
                                        className="forgot-btn"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                                <div className="input-group">
                                    <span className="input-group-text"><FaLock /></span>
                                    <input 
                                        type="password" 
                                        id="password"
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        className="form-control" 
                                        placeholder="Enter your password" 
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <button type="submit" className="auth-btn">Login</button>
                            
                            <div className="auth-divider">
                                <span className="auth-divider-text">Or login with</span>
                            </div>
                            
                            <div className="social-login">
                                <button type="button" className="social-btn">
                                    <FaGoogle />
                                </button>
                                <button type="button" className="social-btn">
                                    <FaFacebookF />
                                </button>
                                <button type="button" className="social-btn">
                                    <FaApple />
                                </button>
                            </div>
                        </form>
                        
                        <div className="auth-footer">
                            <p>Don't have an account? <Link to="/register" className="auth-link">Register</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Login