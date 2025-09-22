import React from "react";
import {
    BarChart3,
    CheckCircle,
    Shield,
    Building2,
    Users,
    TrendingUp,
    Brain,
    Heart,
    Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { File } from "lucide-react";
import VideoShowcase from "./VideoShowcase";

const DemoProjects: React.FC = () => {
    const navigate = useNavigate();
    return (
        <section
            id="demos"
            className="py-20 bg-[#fdfdf7] "
        >
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Demo Projects
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Experience our AI-powered solutions through interactive
                            demonstrations
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Finance Demo */}
                        <div className="group bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-8 hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 bg-blue-800 rounded-xl flex items-center justify-center">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                    Finance
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                MIDAS Financial Analytics
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Comprehensive financial analytics with real-time market data,
                                risk assessment, and automated reporting features.
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-1" /> Portfolio Data
                                    </span>
                                    <span className="flex items-center">
                                        <Shield className="w-4 h-4 mr-1" /> Secure
                                    </span>
                                </div>
                                <a
                                    href="https://midas.goldenhillsindia.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-900 transition-colors group-hover:scale-105 transform inline-block"
                                >
                                    View Demo
                                </a>

                            </div>
                        </div>


                        {/* Real Estate Demo */}
                        <div className="group bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl p-8 hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-white" />
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                    AI Assistant
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                GID AI  Assistant
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Comprehensive real estate intelligence with automated company and portfolio insights.
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-1" /> AI Powered
                                    </span>
                                    <span className="flex items-center">
                                        <Users className="w-4 h-4 mr-1" /> Multi-user
                                    </span>
                                </div>

                                <button
                                    onClick={() => navigate("/real-estate")}
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors group-hover:scale-105 transform"
                                >
                                    View Demo
                                </button>
                            </div>
                        </div>

                        {/* Investment Demo */}
                        <div className="group bg-gradient-to-br from-yellow-50 to-white border border-yellow-100 rounded-2xl p-8 hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                                    <File className="w-6 h-6 text-white" />
                                </div>
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                                    AI summary
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                S1 Documnet Summary                            </h3>
                            <p className="text-gray-600 mb-6">
                                AI-driven insights and summaries for S1 filings, helping investors
                                make informed decisions.
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-1" /> AI Powered
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

                        {/* Healthcare Demo */}
                        <div className="group bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-2xl p-8 hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                                    <Home className="w-6 h-6 text-white" />
                                </div>
                                <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                                    Real Estate
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                Real Estate Due Diligence Document Insights
                            </h3>
                            <p className="text-gray-600 mb-6">
                                AI-driven analysis of key property and financial documents
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-1" /> AI Powered
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
                        <div className="md:col-span-2">
                            <VideoShowcase />
                        </div>                    </div>
                </div>
            </div>
        </section>
    );
};

export default DemoProjects;
