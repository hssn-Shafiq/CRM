// TermsPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const TermsCondition = () => {
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
            <h1 className="text-center fw-bold mb-5">Terms & Conditions</h1>
            <p className="text-muted text-center mb-5">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">1. Acceptance of Terms</h3>
              <p>
                By accessing and using AF1 CRM ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p>
                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and AF1 CRM ("Company," "we," "us," or "our"), concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related to it.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">2. Use License</h3>
              <p>Permission is granted to temporarily download one copy of AF1 CRM per device for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul>
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                <li>attempt to decompile or reverse engineer any software contained in AF1 CRM</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
                <li>transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
              <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.</p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">3. Service Description</h3>
              <p>AF1 CRM provides a comprehensive customer relationship management platform that includes:</p>
              <ul>
                <li><strong>Social media management</strong> and scheduling tools for multiple platforms</li>
                <li><strong>Email marketing</strong> automation and campaign management</li>
                <li><strong>Shopify integration</strong> and e-commerce management features</li>
                <li><strong>Analytics and reporting</strong> features with real-time data</li>
                <li><strong>Customer data management</strong> and segmentation tools</li>
                <li><strong>Lead tracking</strong> and conversion optimization</li>
                <li><strong>Campaign scheduling</strong> and automation workflows</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">4. User Accounts</h3>
              <p>
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password that you use to access the service and for maintaining the confidentiality of your account.
              </p>
              <p>
                You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account. You may not use as a username the name of another person or entity or that is not lawfully available for use.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">5. Privacy Policy</h3>
              <p>
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices regarding the collection, use, and disclosure of your personal information.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">6. Prohibited Uses</h3>
              <p>You may not use our service:</p>
              <ul>
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
                <li>To collect or track the personal information of others</li>
                <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">7. Content</h3>
              <p>
                Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
              </p>
              <p>
                By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">8. Termination</h3>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will cease immediately.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">9. Disclaimer</h3>
              <p>
                The information on this platform is provided on an 'as is' basis. To the fullest extent permitted by law, AF1 CRM excludes all representations, warranties, conditions and terms whether express or implied, statutory or otherwise.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">10. Limitations</h3>
              <p>
                In no event shall AF1 CRM or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use AF1 CRM, even if AF1 CRM or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">11. Governing Law</h3>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of [Your Jurisdiction] and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">12. Contact Information</h3>
              <p>
                Questions about the Terms of Service should be sent to us through our contact form or support channels available in the platform. We will respond to your inquiries within 48 hours during business days.
              </p>
            </div>

            <div className="text-center bg-light p-4 rounded border d-flex flex-column align-items-center justify-content-center">
              <h4 className="fw-bold mb-3">Ready to Get Started?</h4>
              <p className="mb-3">By clicking the button below, you agree to these Terms & Conditions and our Privacy Policy.</p>
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
        
        h3.text-primary {
          color: #667eea !important;
        }
        
        ul li {
          margin-bottom: 8px;
        }
        
        .bg-light {
          background-color: #f8f9fa !important;
        }
      `}</style>
    </div>
   </>
  );
};

export default TermsCondition;