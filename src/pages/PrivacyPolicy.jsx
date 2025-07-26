// PrivacyPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login'); // Redirect to your login page
  };

  return (
   <>
   <Header />
    <div className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <h1 className="text-center fw-bold mb-5">Privacy Policy</h1>
            <p className="text-muted text-center mb-5">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="mb-4">
              <h3 className="fw-bold text-success">1. Introduction</h3>
              <p>
                At AF1 CRM, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services.
              </p>
              <p>
                We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-success">2. Information We Collect</h3>
              
              <h5 className="fw-bold mt-4">Personal Information</h5>
              <p>We may collect personally identifiable information that you provide directly to us, including:</p>
              <ul>
                <li><strong>Contact Information:</strong> Name, email address, phone number, and mailing address</li>
                <li><strong>Account Credentials:</strong> Username, password, and security questions</li>
                <li><strong>Profile Information:</strong> Business information, preferences, and profile picture</li>
                <li><strong>Payment Information:</strong> Billing address, payment method, and transaction history</li>
                <li><strong>Communication Data:</strong> Records of your correspondence with us</li>
              </ul>
              
              <h5 className="fw-bold mt-4">Usage Data</h5>
              <p>We automatically collect certain information when you use our service:</p>
              <ul>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, and operating system</li>
                <li><strong>Usage Data:</strong> Log data, access times, pages viewed, and usage patterns</li>
                <li><strong>Cookies and Tracking:</strong> Information collected through cookies and similar technologies</li>
                <li><strong>Social Media Data:</strong> Information from connected social media accounts (with your permission)</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-success">3. How We Use Your Information</h3>
              <p>We use the collected information for various legitimate business purposes:</p>
              <ul>
                <li><strong>Service Provision:</strong> To provide and maintain our CRM services</li>
                <li><strong>Account Management:</strong> To create and manage your user account</li>
                <li><strong>Communication:</strong> To notify you about changes, updates, and support</li>
                <li><strong>Customer Support:</strong> To provide technical assistance and resolve issues</li>
                <li><strong>Analytics:</strong> To analyze usage patterns and improve our services</li>
                <li><strong>Security:</strong> To monitor and detect security threats and unauthorized access</li>
                <li><strong>Legal Compliance:</strong> To fulfill legal obligations and protect our rights</li>
                <li><strong>Marketing:</strong> To send you promotional materials (with your consent)</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-success">4. Information Sharing and Disclosure</h3>
              <p>We do not sell, trade, or otherwise transfer your personal information to outside parties except in the following circumstances:</p>
              <ul>
                <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
                <li><strong>Service Providers:</strong> With trusted third parties who assist us in operating our platform</li>
                <li><strong>Legal Requirements:</strong> To comply with legal obligations, court orders, or government requests</li>
                <li><strong>Business Protection:</strong> To protect and defend our rights, property, and safety</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or asset sale</li>
                <li><strong>Emergency Situations:</strong> When necessary to protect the vital interests of individuals</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-success">5. Data Security</h3>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Our security measures include:
              </p>
              <ul>
                <li><strong>Encryption:</strong> Data encryption in transit and at rest</li>
                <li><strong>Access Controls:</strong> Strict access controls and authentication requirements</li>
                <li><strong>Regular Audits:</strong> Security audits and vulnerability assessments</li>
                <li><strong>Staff Training:</strong> Regular security training for our employees</li>
                <li><strong>Incident Response:</strong> Procedures for responding to security incidents</li>
              </ul>
              <p>
                However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee absolute security.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-success">6. Social Media Integration</h3>
              <p>Our platform integrates with various social media platforms. When you connect your social media accounts:</p>
              <ul>
                <li><strong>Limited Access:</strong> We access only the permissions you explicitly grant</li>
                <li><strong>Token Storage:</strong> We store necessary authentication tokens for posting and analytics</li>
                <li><strong>Privacy Respect:</strong> We do not access private messages or personal posts beyond granted permissions</li>
                <li><strong>Revocable Access:</strong> You can revoke permissions at any time through your social media account settings</li>
                <li><strong>Data Minimization:</strong> We only collect data necessary for the services you use</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-success">7. Email Marketing</h3>
              <p>If you use our email marketing features:</p>
              <ul>
                <li><strong>Data Processing:</strong> We process email lists on your behalf as a data processor</li>
                <li><strong>Campaign Logs:</strong> We maintain logs of email campaigns for analytics and compliance</li>
                <li><strong>Compliance:</strong> We comply with anti-spam regulations (CAN-SPAM, GDPR, etc.)</li>
                <li><strong>Unsubscribe:</strong> Recipients can unsubscribe at any time through automated processes</li>
                <li><strong>Consent Management:</strong> We help you manage consent and preferences</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-success">8. Data Retention</h3>
              <p>
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Specific retention periods include:
              </p>
              <ul>
                <li><strong>Account Data:</strong> Retained while your account is active</li>
                <li><strong>Transaction Records:</strong> Retained for 7 years for accounting purposes</li>
                <li><strong>Support Communications:</strong> Retained for 3 years</li>
                <li><strong>Analytics Data:</strong> Anonymized after 2 years</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-success">9. Your Rights</h3>
              <p>You have certain rights regarding your personal information:</p>
              <div className="row">
                <div className="col-md-6">
                  <ul>
                    <li><strong>Access:</strong> The right to access your personal information</li>
                    <li><strong>Rectification:</strong> The right to rectify inaccurate information</li>
                    <li><strong>Erasure:</strong> The right to erase your personal information</li>
                    <li><strong>Restriction:</strong> The right to restrict processing</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul>
                    <li><strong>Portability:</strong> The right to data portability</li>
                    <li><strong>Object:</strong> The right to object to processing</li>
                    <li><strong>Withdraw Consent:</strong> The right to withdraw consent</li>
                    <li><strong>Complaint:</strong> The right to lodge a complaint with authorities</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-success">10. International Data Transfers</h3>
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure that such transfers are subject to appropriate safeguards, including:
              </p>
              <ul>
                <li>Adequacy decisions by the European Commission</li>
                <li>Standard contractual clauses approved by the European Commission</li>
                <li>Binding corporate rules</li>
                <li>Certification mechanisms</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-success">11. Children's Privacy</h3>
              <p>
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-success">12. Changes to This Privacy Policy</h3>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-success">13. Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us through our support channels available in the platform. We are committed to resolving any privacy concerns promptly and effectively.
              </p>
              <div className="bg-light p-3 rounded mt-3">
                <p className="mb-0"><strong>Data Protection Officer:</strong> privacy@af1crm.com</p>
                <p className="mb-0"><strong>Support Team:</strong> Available through the platform's help center</p>
              </div>
            </div>

            <div className="text-center bg-light p-4 rounded border d-flex flex-column align-items-center justify-content-center">
              <h4 className="fw-bold mb-3">Ready to Experience Secure CRM?</h4>
              <p className="mb-3">Your privacy and data security are our top priorities. Start using AF1 CRM with confidence.</p>
              <button className="btn btn-primary btn-lg px-5" onClick={handleLogin}>
                Login to Your Account
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .btn-primary {
          background: linear-gradient(45deg, #667eea, #764ba2);
          border: none;
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        h3.text-success {
          color: #28a745 !important;
        }
        
        h5.fw-bold {
          color: #495057;
          margin-top: 1.5rem;
        }
        
        ul li {
          margin-bottom: 8px;
        }
        
        .bg-light {
          background-color: #f8f9fa !important;
        }
        
        strong {
          color: #495057;
        }
      `}</style>
    </div>
   </>
  );
};

export default PrivacyPolicy;