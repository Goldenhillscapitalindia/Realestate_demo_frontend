import { useState } from 'react';
import { MapPin, Shield, FileText, Users, X, Linkedin, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const footerLinks = [
    {
      id: 'privacy',
      icon: Shield,
      label: 'Privacy Policy',
      content: {
        title: 'Privacy Policy',
        body: `
    <p class="text-sm text-gray-500 mb-4"><em>Last updated: September 2025</em></p>

    <p>At Golden Hills India, we are committed to protecting your privacy and ensuring the security of your personal information. This policy outlines how we collect, use, and safeguard your data.</p>
<br>
    <p><strong>Data Collection:</strong> We collect information you provide directly to us, such as when you contact us or request our services.</p>
<br>
    <p><strong>Data Usage:</strong> Your information is used solely to provide and improve our services, communicate with you, and comply with legal obligations.</p>
<br>
    <p><strong>Data Protection:</strong> We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or misuse.</p>
<br>
    <p><strong>Third Parties:</strong> We do not sell, trade, or rent your personal information to third parties without your explicit consent.</p>
<br>
    <p>Contact us at <strong>contact@goldenhillsindia.com</strong> for any privacy-related questions.</p>
  `
      }
    },
    {
      id: 'terms',
      icon: FileText,
      label: 'Terms of Use',
      content: {
        title: 'Terms of Use',
        body: `<p>Welcome to Golden Hills India. By accessing our website and services, you agree to comply with these terms and conditions.</p>

<p><strong>Service Usage:</strong> Our services are provided for business purposes only. You agree to use them in accordance with applicable laws and regulations.</p>
<br>
<p><strong>Intellectual Property:</strong> All content, software, and materials on our platform are protected by intellectual property rights.</p>
<br>
<p><strong>Limitation of Liability:</strong> Golden Hills India shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.</p>
<br>
<p><strong>Modifications:</strong> We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of any changes.</p>
<br>
<p>For questions regarding these terms, contact <strong>contact@goldenhillsindia.com</strong>.</p>`
      },
    },
    {
      id: 'about',
      icon: Users,
      label: 'About Us',
      content: {
        title: 'About Golden Hills India',
        body: `<p>Golden Hills India is a pioneering technology and analytics firm dedicated to empowering industries with fluid intelligence and precision.</p>

<p><strong>Our Mission:</strong> To transform complex data challenges into strategic opportunities through innovative AI solutions and advanced analytics.</p>
<br>
<p><strong>Our Vision:</strong> To be the global leader in intelligent business transformation, helping organizations unlock their full potential through data-driven insights.</p>
<br>
<p><strong>Our Values:</strong></p>
<ul>
  <li><strong>Innovation:</strong> Continuously pushing the boundaries of what's possible with AI and analytics</li>
  <li><strong>Excellence:</strong> Delivering exceptional quality in every project and solution</li>
  <li><strong>Integrity:</strong> Building trust through transparent and ethical business practices</li>
  <li><strong>Collaboration:</strong> Working closely with clients to achieve shared success</li>
</ul>
<br>
<p>Founded by visionary leaders with years of experience in financial technology and data architecture, we bring together cutting-edge technology with deep industry expertise.</p>`
      },
    },
    {
      id: 'address',
      icon: MapPin,
      label: 'Address',
      content: {
        title: 'Our Location',
        body: `Golden Hills Capital India Pvt Ltd.<br/>
Unit A, 26th Floor, Eastern Block,<br/>
Vamsiram Suvarna Durga Tech Park,<br/>
Survey No 142, Nanakramguda, Financial District,<br/>
Hyderabad, Telangana 500032<br/><br/>

<strong>Phone:</strong> +91 7207011234<br/>
<strong>Email:</strong> ghcadmin@goldenhillsindia.com<br/><br/>

For urgent inquiries outside business hours, please email us and we'll respond within 24 hours.`,
        isAddress: true
      },
    },
  ];

  const openModal = (linkId: string) => {
    setActiveModal(linkId);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'unset';
  };

  const activeContent = footerLinks.find(link => link.id === activeModal)?.content;

  return (
    <>
      <footer className="relative py-3 px-3 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gray-900" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className='mb-9'></div>
   
          {/* Floating Orbs Navigation */}
          <div className="flex justify-center items-center space-x-8 mb-10">
            {footerLinks.map((link, index) => (
              <button
                key={link.id}
                onClick={() => openModal(link.id)}
                className="group relative"
              >
                <div
                  className="w-14 h-14 border border-white rounded-full flex items-center justify-center shadow-lg hover:border-yellow-400 hover:scale-110 transition-all duration-500"
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  <link.icon className="w-6 h-6 text-white group-hover:text-yellow-400 transition-colors" />
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-md rounded-lg px-2 py-1 shadow-elegant whitespace-nowrap">
                    <span className="text-xs font-medium text-foreground">
                      {link.label}
                    </span>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/90 rotate-45" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* ✅ Company Tagline */}
    

          {/* Company Info */}
          <div className="text-center text-s text-white">
            © 2025 Golden Hills India. All rights reserved.
          </div>

          {/* Social Icons */}
          <div className="flex justify-center space-x-6 mt-6">
            <a
              href="https://www.linkedin.com/company/golden-hills-capital/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-white hover:border-yellow-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6 text-white hover:text-yellow-400 transition-colors" />
            </a>
            <a
              href="https://www.instagram.com/goldenhillsindia"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-white hover:border-yellow-400 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6 text-white hover:text-yellow-400 transition-colors" />
            </a>
            <a
              href="https://www.youtube.com/@goldenhillsindia"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-white hover:border-yellow-400 transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-6 h-6 text-white hover:text-yellow-400 transition-colors" />
            </a>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {activeModal && activeContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-4xl max-h-[80vh] bg-white rounded-3xl shadow-elegant animate-scale-in overflow-hidden">
            {/* Header */}
            <div className="bg-blue-900 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">{activeContent.title}</h2>
                <button
                  onClick={closeModal}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-8 overflow-y-auto max-h-[60vh] space-y-6">
              <div
                className="prose prose-lg max-w-none text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: activeContent.body }}
              />

              {activeContent.isAddress && (
                <div className="w-full h-64 rounded-2xl overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.1327984030914!2d78.39875!3d17.443676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb916718d39ae7%3A0x67d87622ad1cb355!2sGolden%20Hills%20Capital%20India%20Private%20Limited.!5e0!3m2!1sen!2sin!4v1691497295681!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
