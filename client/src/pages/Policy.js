import React from 'react'
import Layout from '../components/Layout/Layout'
import { FaShieldAlt, FaUserLock, FaCookieBite, FaEnvelope } from 'react-icons/fa'

const Policy = () => {
  return (
    <Layout title="Privacy Policy - ShopEase" description="Privacy Policy and Terms of Service for ShopEase" keywords="privacy policy, terms of service, data protection, cookies, e-commerce" author="ShopEase">
      <div className="policy-page">
        {/* Header Section */}
        <section className="py-5" style={{ background: 'linear-gradient(135deg, #4a6cf7 0%, #2a3f9d 100%)', color: 'white' }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <div className="d-flex align-items-center mb-3">
                  <FaShieldAlt className="me-3" style={{ fontSize: '2.5rem' }} />
                  <h1 className="mb-0">Privacy Policy</h1>
                </div>
                <p className="lead">Your privacy matters to us. This policy outlines how we collect, use, and protect your information when you use our services.</p>
                <p>Last Updated: June 15, 2023</p>
              </div>
              <div className="col-lg-6">
                <img src="/images/contactus.jpeg" alt="Privacy Policy" className="img-fluid rounded shadow" />
              </div>
            </div>
          </div>
        </section>

        {/* Policy Content */}
        <section className="py-5">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body p-4">
                    <h2 className="mb-4">1. Information We Collect</h2>
                    <p>We collect several types of information from and about users of our website, including:</p>
                    <ul className="mb-4">
                      <li className="mb-2">Personal information such as name, email address, postal address, phone number, and payment information when you register, make a purchase, or fill out forms on our site.</li>
                      <li className="mb-2">Usage data including your IP address, browser type, operating system, referring URLs, and information about how you interact with our website.</li>
                      <li className="mb-2">Device information such as your device type, model, and operating system.</li>
                      <li>Location information when you allow us to access your device's location.</li>
                    </ul>

                    <h2 className="mb-4">2. How We Use Your Information</h2>
                    <p>We use the information we collect for various purposes, including:</p>
                    <ul className="mb-4">
                      <li className="mb-2">Processing and fulfilling your orders</li>
                      <li className="mb-2">Providing customer support and responding to your inquiries</li>
                      <li className="mb-2">Sending transactional emails and order confirmations</li>
                      <li className="mb-2">Sending marketing communications (with your consent)</li>
                      <li className="mb-2">Improving our website and services</li>
                      <li>Detecting and preventing fraud</li>
                    </ul>

                    <h2 className="mb-4">3. Information Sharing</h2>
                    <p>We do not sell or rent your personal information to third parties. We may share your information with:</p>
                    <ul className="mb-4">
                      <li className="mb-2">Service providers who help us operate our business (payment processors, shipping companies, etc.)</li>
                      <li className="mb-2">Law enforcement agencies when required by law</li>
                      <li>Business partners with your consent</li>
                    </ul>

                    <h2 className="mb-4">4. Your Rights</h2>
                    <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
                    <ul className="mb-4">
                      <li className="mb-2">The right to access your personal information</li>
                      <li className="mb-2">The right to correct inaccurate information</li>
                      <li className="mb-2">The right to delete your information</li>
                      <li className="mb-2">The right to restrict processing</li>
                      <li>The right to data portability</li>
                    </ul>
                  </div>
                  <div className="card border-0 shadow-sm">

                    <div className="card-body p-4">
                      <h2 className="mb-4">5. Security</h2>
                      <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage.</p>

                      <h2 className="mb-4">6. Cookies</h2>
                      <p>We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>

                      <h2 className="mb-4">7. Changes to This Policy</h2>
                      <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>

                      <h2 className="mb-4">8. Contact Us</h2>
                      <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                      <p><strong>Email:</strong> privacy@shopease.com</p>
                      <p><strong>Address:</strong> 123 Commerce Street, Business District, City, Country</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="sticky-top" style={{ top: '100px' }}>
                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body p-4">
                      <h4 className="mb-3">Quick Links</h4>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item px-0 py-2 border-bottom">
                          <a href="#" className="text-decoration-none d-flex justify-content-between align-items-center">
                            Terms of Service
                            <span>→</span>
                          </a>
                        </li>
                        <li className="list-group-item px-0 py-2 border-bottom">
                          <a href="#" className="text-decoration-none d-flex justify-content-between align-items-center">
                            Shipping Policy
                            <span>→</span>
                          </a>
                        </li>
                        <li className="list-group-item px-0 py-2 border-bottom">
                          <a href="#" className="text-decoration-none d-flex justify-content-between align-items-center">
                            Return Policy
                            <span>→</span>
                          </a>
                        </li>
                        <li className="list-group-item px-0 py-2">
                          <a href="#" className="text-decoration-none d-flex justify-content-between align-items-center">
                            FAQ
                            <span>→</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                      <h4 className="mb-3">Need Help?</h4>
                      <p>If you have any questions about our policies or need assistance, our support team is here to help.</p>
                      <a href="/contact-us" className="btn btn-primary w-100">Contact Support</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Policy Features */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row g-4">
              <div className="col-md-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center">
                    <div className="mb-3" style={{ color: '#4a6cf7', fontSize: '2.5rem' }}>
                      <FaUserLock />
                    </div>
                    <h5 className="card-title">Data Protection</h5>
                    <p className="card-text">We implement strong security measures to protect your personal information.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center">
                    <div className="mb-3" style={{ color: '#4a6cf7', fontSize: '2.5rem' }}>
                      <FaCookieBite />
                    </div>
                    <h5 className="card-title">Cookie Policy</h5>
                    <p className="card-text">We use cookies to enhance your browsing experience and analyze site traffic.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center">
                    <div className="mb-3" style={{ color: '#4a6cf7', fontSize: '2.5rem' }}>
                      <FaShieldAlt />
                    </div>
                    <h5 className="card-title">GDPR Compliance</h5>
                    <p className="card-text">We respect your privacy rights under GDPR and other privacy regulations.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center">
                    <div className="mb-3" style={{ color: '#4a6cf7', fontSize: '2.5rem' }}>
                      <FaEnvelope />
                    </div>
                    <h5 className="card-title">Communication</h5>
                    <p className="card-text">You can opt out of marketing communications at any time.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}



export default Policy