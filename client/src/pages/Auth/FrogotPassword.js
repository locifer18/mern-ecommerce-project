import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/AuthStyles.css';
import { FaEnvelope, FaLock, FaQuestion, FaUndo } from 'react-icons/fa';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgot-password`, {
                email,
                newPassword,
                question
            });
            if (res && res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            } else {
                toast.error(res.data.message);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Password reset failed. Please try again.");
            setLoading(false);
        }
    }

    return (
        <Layout title="Reset Password - ShopEase">
            <div className='auth-container'>
                <div className='auth-card'>
                    <div className='auth-header'>
                        <h2 className='auth-title'>Reset Password</h2>
                        <p className='auth-subtitle'>Enter your details to reset your password</p>
                    </div>
                    
                    <div className='auth-form'>
                        <form onSubmit={handleSubmit}>
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
                                <label htmlFor="question" className="form-label">Security Question</label>
                                <div className="input-group">
                                    <span className="input-group-text"><FaQuestion /></span>
                                    <input 
                                        type="text" 
                                        id="question"
                                        value={question} 
                                        onChange={(e) => setQuestion(e.target.value)} 
                                        className="form-control" 
                                        placeholder="What is your favorite sport?" 
                                        required 
                                    />
                                </div>
                                <small className="form-text text-muted">
                                    Enter the answer to your security question
                                </small>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="newPassword" className="form-label">New Password</label>
                                <div className="input-group">
                                    <span className="input-group-text"><FaLock /></span>
                                    <input 
                                        type="password" 
                                        id="newPassword"
                                        value={newPassword} 
                                        onChange={(e) => setNewPassword(e.target.value)} 
                                        className="form-control" 
                                        placeholder="Enter your new password" 
                                        required 
                                    />
                                </div>
                                <small className="form-text text-muted">
                                    Password must be at least 6 characters long
                                </small>
                            </div>
                            
                            <button 
                                type="submit" 
                                className="auth-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Resetting...
                                    </>
                                ) : (
                                    <>
                                        <FaUndo className="me-2" /> Reset Password
                                    </>
                                )}
                            </button>
                        </form>
                        
                        <div className="auth-footer">
                            <p>Remember your password? <Link to="/login" className="auth-link">Login</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ForgotPassword