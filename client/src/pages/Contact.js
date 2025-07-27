import React from 'react'
import Layout from '../components/Layout/Layout'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeadset, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPaperPlane } from 'react-icons/fa'
import '../styles/ContactStyles.css'

const Contact = () => {
    return (
        <Layout title="Contact Us - ShopEase">
            <div className="contactus">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-12 text-center">
                            <h1 className="mb-3">Get In Touch</h1>
                            <p className="lead">We'd love to hear from you. Here's how you can reach us.</p>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-lg-7 mb-4 mb-lg-0">
                            <div className="contact-form">
                                <h3 className="mb-4">Send Us a Message</h3>
                                <form>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="name" className="form-label">Your Name</label>
                                                <input type="text" className="form-control" id="name" placeholder="Enter your name" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="email" className="form-label">Email Address</label>
                                                <input type="email" className="form-control" id="email" placeholder="Enter your email" required />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="form-group mb-3">
                                        <label htmlFor="subject" className="form-label">Subject</label>
                                        <input type="text" className="form-control" id="subject" placeholder="Enter subject" required />
                                    </div>
                                    
                                    <div className="form-group mb-4">
                                        <label htmlFor="message" className="form-label">Message</label>
                                        <textarea className="form-control" id="message" rows="5" placeholder="Enter your message" required></textarea>
                                    </div>
                                    
                                    <button type="submit" className="btn btn-primary">
                                        <FaPaperPlane className="me-2" /> Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                        
                        <div className="col-lg-5">
                            <div className="contact-info">
                                <h3 className="mb-4">Contact Information</h3>
                                <p className="mb-4">Feel free to contact us with any questions or inquiries. We're available 24/7 to assist you.</p>
                                
                                <div className="contact-info-item">
                                    <div className="contact-icon">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div>
                                        <h5>Our Location</h5>
                                        <p>123 Commerce Street, Business District, City, Country</p>
                                    </div>
                                </div>
                                
                                <div className="contact-info-item">
                                    <div className="contact-icon">
                                        <FaEnvelope />
                                    </div>
                                    <div>
                                        <h5>Email Us</h5>
                                        <p>support@shopease.com</p>
                                        <p>info@shopease.com</p>
                                    </div>
                                </div>
                                
                                <div className="contact-info-item">
                                    <div className="contact-icon">
                                        <FaPhone />
                                    </div>
                                    <div>
                                        <h5>Call Us</h5>
                                        <p>+1 (555) 123-4567</p>
                                        <p>+1 (555) 987-6543 (Toll Free)</p>
                                    </div>
                                </div>
                                
                                <div className="contact-info-item">
                                    <div className="contact-icon">
                                        <FaHeadset />
                                    </div>
                                    <div>
                                        <h5>Customer Support</h5>
                                        <p>Available 24/7 for your questions</p>
                                    </div>
                                </div>
                                
                                <div className="mt-4">
                                    <h5 className="mb-3">Follow Us</h5>
                                    <div className="d-flex gap-3">
                                        <a href="https://facebook.com" className="social-icon" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                                        <a href="https://twitter.com" className="social-icon" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                                        <a href="https://instagram.com" className="social-icon" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                                        <a href="https://linkedin.com" className="social-icon" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row mt-5">
                        <div className="col-12">
                            <div className="map-container" style={{ height: '400px', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596552044!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1644982669427!5m2!1sen!2sin" 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    allowFullScreen="" 
                                    loading="lazy"
                                    title="Google Maps"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Contact