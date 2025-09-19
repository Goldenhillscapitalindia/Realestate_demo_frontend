import React, { useState, useEffect } from 'react';
import {
  Menu, X, ChevronRight, Brain, BarChart3, Shield, Cloud,
  Building2, TrendingUp, Heart, DollarSign, Mail, Phone, MapPin,
  Linkedin, Twitter, Youtube, Play, CheckCircle, Globe, Users, Stethoscope,
  
} from 'lucide-react';
import logo from './assests/Color logo - no background.png'
import Footer from './Footer';
import image from './assests/videoframe_11070.png'
import Contact from './Contact';
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
        }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img
                src={logo}
                alt="Golden Hills Logo"
                className="w-40 h-20 object-contain"
              />

            </div>


            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-800 font-medium transition-colors">Home</a>
              <a href="#about" className="text-gray-700 hover:text-blue-800 font-medium transition-colors">About</a>
              <a href="#industries" className="text-gray-700 hover:text-blue-800 font-medium transition-colors">Industries</a>
              <a href="#solutions" className="text-gray-700 hover:text-blue-800 font-medium transition-colors">AI Solutions</a>
              <a href="#demos" className="text-gray-700 hover:text-blue-800 font-medium transition-colors">Demo Projects</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-800 font-medium transition-colors">Contact</a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-3 pt-4">
                <a href="#home" className="text-gray-700 hover:text-blue-800 font-medium transition-colors">Home</a>
                <a href="#about" className="text-gray-700 hover:text-blue-800 font-medium transition-colors">About</a>
                <a href="#industries" className="text-gray-700 hover:text-blue-800 font-medium transition-colors">Industries</a>
                <a href="#solutions" className="text-gray-700 hover:text-blue-800 font-medium transition-colors">AI Solutions</a>
                <a href="#demos" className="text-gray-700 hover:text-blue-800 font-medium transition-colors">Demo Projects</a>
                <a href="#contact" className="text-gray-700 hover:text-blue-800 font-medium transition-colors">Contact</a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-20 min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-slate-50 flex items-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 border border-blue-300/30 rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border border-blue-400/40 rounded-full"></div>
          <div className="absolute bottom-32 left-1/4 w-16 h-16 border border-blue-300/30 rounded-full"></div>
          <div className="absolute bottom-20 right-1/3 w-20 h-20 border border-blue-400/40 rounded-full"></div>
        </div>
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Building Tomorrow's
                    <span className="text-blue-800"> Web Solutions</span>,
                    <span className="text-blue-600"> Today</span>.
                  </h1>
                  <p className="text-xl text-gray-700 mt-6 leading-relaxed">
                    We integrate Artificial Intelligence into Finance, Real Estate, Healthcare,
                    and Investment platforms to drive growth and innovation for businesses worldwide.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Link to Demo Projects */}
                  <a
                    href="#demos"
                    className="bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-900 transition-all transform hover:scale-105 flex items-center justify-center"
                  >
                    View Demo Projects
                    <Play className="ml-2 w-5 h-5" />
                  </a>

                  {/* Link to Contact */}
                  <a
                    href="#contact"
                    className="bg-white text-blue-800 px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center"
                  >
                    contact us
                    <Play className="ml-2 w-5 h-5" />
                  </a>
                </div>


                <div className="flex items-center space-x-8 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-800">50+</div>
                    <div className="text-sm text-gray-600">Projects Delivered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-800">12+</div>
                    <div className="text-sm text-gray-600">Years of Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-800">98%</div>
                    <div className="text-sm text-gray-600">Client Satisfaction</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-white/80 to-blue-100/60 backdrop-blur-sm rounded-2xl border border-blue-200/30 flex items-center justify-center p-8">
                  {/* AI Investment Growth Visualization */}
                  <div className="w-full h-full relative">
                    {/* Central AI Brain */}
                    <div className="absolute inset-0">
                      <img
                        src={image}
                        alt="Card background"
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    </div>


                    {/* Growth Chart Lines */}
                    <svg className="w-full h-full absolute inset-0" viewBox="0 0 300 200">
                      <path
                        d="M50 150 Q100 120 150 100 T250 50"
                        stroke="rgb(30, 58, 138)"
                        strokeWidth="3"
                        fill="none"
                        className="animate-pulse"
                      />
                      <path
                        d="M50 160 Q120 140 180 110 T280 70"
                        stroke="rgb(59, 130, 246)"
                        strokeWidth="2"
                        fill="none"
                        className="animate-pulse"
                        style={{ animationDelay: '0.5s' }}
                      />
                    </svg>

                    {/* Data Points */}
                    <div className="absolute top-8 right-8 w-3 h-3 bg-blue-800 rounded-full animate-ping"></div>
                    <div className="absolute top-16 left-12 w-2 h-2 bg-blue-600 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
                    <div className="absolute bottom-12 right-16 w-4 h-4 bg-blue-800 rounded-full animate-ping" style={{ animationDelay: '0.7s' }}></div>
                    <div className="absolute bottom-20 left-8 w-2 h-2 bg-blue-600 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>

                    {/* Investment Icons */}
                    <div className="absolute top-4 left-4">
                      <div className="w-8 h-8 bg-blue-100/60 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-blue-800" />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="w-8 h-8 bg-blue-100/60 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="w-8 h-8 bg-blue-100/60 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-blue-800" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <div className="w-8 h-8 bg-blue-100/60 rounded-lg flex items-center justify-center">
                        <Brain className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-300/30 rounded-full animate-ping" />
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-blue-200/40 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Demo Projects Section */}
      <section id="demos" className="py-20 bg-gradient-to-br from-emerald-50/20 to-teal-50/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Demo Projects</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience our AI-powered solutions through interactive demonstrations
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="group bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-8 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-blue-800 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">Finance</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">AI-Driven Finance Dashboard</h3>
                <p className="text-gray-600 mb-6">Comprehensive financial analytics with real-time market data, risk assessment, and automated reporting features.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" /> Live Data
                    </span>
                    <span className="flex items-center">
                      <Shield className="w-4 h-4 mr-1" /> Secure
                    </span>
                  </div>
                  <button className="bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-900 transition-colors group-hover:scale-105 transform">
                    View Demo
                  </button>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl p-8 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">Real Estate</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Real Estate Property Portal</h3>
                <p className="text-gray-600 mb-6">Smart property management platform with AI valuations, market analysis, and tenant management systems.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" /> AI Powered
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" /> Multi-user
                    </span>
                  </div>
                  <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors group-hover:scale-105 transform">
                    View Demo
                  </button>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-yellow-50 to-white border border-yellow-100 rounded-2xl p-8 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">Investment</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Stock Market Insights Platform</h3>
                <p className="text-gray-600 mb-6">Advanced trading platform with predictive analytics, portfolio optimization, and automated trading strategies.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" /> Real-time
                    </span>
                    <span className="flex items-center">
                      <Brain className="w-4 h-4 mr-1" /> AI Insights
                    </span>
                  </div>
                  <button className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors group-hover:scale-105 transform">
                    View Demo
                  </button>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-2xl p-8 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">Healthcare</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Healthcare Data Intelligence</h3>
                <p className="text-gray-600 mb-6">Medical data platform with AI diagnostics, patient management, and healthcare analytics for better outcomes.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" /> HIPAA
                    </span>
                    <span className="flex items-center">
                      <Shield className="w-4 h-4 mr-1" /> Secure
                    </span>
                  </div>
                  <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors group-hover:scale-105 transform">
                    View Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-20 bg-gradient-to-br from-gray-50 to-slate-100/50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Industries We Transform</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Delivering AI-powered solutions across key sectors to revolutionize business operations
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-blue-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Finance Services</h3>
                <p className="text-gray-600 mb-4">Advanced fintech solutions with AI-driven risk assessment and automated trading systems.</p>
                <button className="text-blue-800 font-semibold hover:text-blue-900 flex items-center">
                  {/* Explore Demo <ChevronRight className="ml-1 w-4 h-4" /> */}
                </button>
              </div>

              <div className="group p-8 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-yellow-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Stock Market & Investments</h3>
                <p className="text-gray-600 mb-4">Intelligent trading platforms with predictive analytics and portfolio optimization.</p>
                <button className="text-yellow-600 font-semibold hover:text-yellow-700 flex items-center">
                  {/* Explore Demo <ChevronRight className="ml-1 w-4 h-4" /> */}
                </button>
              </div>

              <div className="group p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Real Estate Platforms</h3>
                <p className="text-gray-600 mb-4">Smart property management with AI valuations and market trend analysis.</p>
                <button className="text-green-600 font-semibold hover:text-green-700 flex items-center">
                  {/* Explore Demo <ChevronRight className="ml-1 w-4 h-4" /> */}
                </button>
              </div>

              <div className="group p-8 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Healthcare Solutions</h3>
                <p className="text-gray-600 mb-4">Medical data intelligence with AI diagnostics and patient management systems.</p>
                <button className="text-red-600 font-semibold hover:text-red-700 flex items-center">
                  {/* Explore Demo <ChevronRight className="ml-1 w-4 h-4" /> */}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Solutions Section */}
      <section id="solutions" className="py-20 bg-gradient-to-br from-indigo-50/30 to-purple-50/20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">AI-Powered Features</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Cutting-edge artificial intelligence capabilities that drive business transformation
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-800 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Predictive Analytics</h3>
                <p className="text-gray-600">Advanced machine learning algorithms that forecast market trends and business outcomes.</p>
              </div>

              <div className="text-center p-6">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Dashboards</h3>
                <p className="text-gray-600">Intelligent data visualization with automated insights and customizable reporting.</p>
              </div>

              <div className="text-center p-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Insights</h3>
                <p className="text-gray-600">Live data processing and instant alerts for critical business events and opportunities.</p>
              </div>

              <div className="text-center p-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Cloud className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Cloud Integration</h3>
                <p className="text-gray-600">Enterprise-grade security with seamless cloud deployment and scalable infrastructure.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-amber-50/20 to-orange-50/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">About Golden Hills India</h2>
                <p className="text-xl text-gray-600 mb-6">
                  Golden Hills India is a trusted technology partner delivering enterprise-grade solutions
                  with AI integration. Our mission is to empower businesses worldwide with secure, scalable,
                  and intelligent platforms.
                </p>
                <p className="text-gray-600 mb-8">
                  With over a decade of experience in software development and artificial intelligence,
                  we have successfully delivered 500+ projects across 15+ countries. Our team of expert
                  developers and AI specialists work closely with clients to transform their vision into
                  cutting-edge digital solutions.
                </p>

                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-3xl font-bold text-blue-800 mb-1">12+</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-3xl font-bold text-blue-800 mb-1">50+</div>
                    <div className="text-sm text-gray-600">projects</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-3xl font-bold text-blue-800 mb-1">24/7</div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-3xl font-bold text-blue-800 mb-1">ISO 27001</div>
                    <div className="text-sm text-gray-600">Certified</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-blue-100 via-white to-yellow-100 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-50 h-50 bg-gradient-to-br from-white-300 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                      <img src={logo} className="w-40 h-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Global Innovation</h3>
                    <p className="text-gray-600">Transforming businesses worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      {/* <section id="contact" className="py-20 bg-gradient-to-br from-rose-50/20 to-pink-50/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Let's Collaborate</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Ready to transform your business with AI-powered solutions? Get in touch with our experts.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-800" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Location</h3>
                    <p className="text-gray-600">
                      Golden Hills Capital India Pvt Ltd.<br />
                      Unit A, 26th Floor, Eastern Block,<br />
                      Vamsiram Suvarna Durga Tech Park,<br />
                      Survey No 142, Nanakramguda, Financial District,<br />
                      Hyderabad, Telangana 500032<br /><br />

                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-800" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600"><strong>Phone:</strong> +91 7207011234<br />
                    </p>
                    <p className="text-gray-600">+1 555 123 4567 (US)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-800" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600"><strong>Email:</strong> contact@goldenhillsindia.com<br /><br /></p>
                    <p className="text-gray-600">sales@goldenhillsindia.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="your.email@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      placeholder="Tell us about your project requirements..."
                    ></textarea>
                  </div>

                  <button className="w-full bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <Contact />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;