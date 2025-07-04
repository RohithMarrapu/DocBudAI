'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  MessageCircle, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Shield, 
  Zap,
  Star,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

export default function LandingPage() {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Get instant answers from your PDFs with our advanced AI processing engine."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Private",
      description: "Your documents are processed securely and never stored permanently."
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Natural Conversations",
      description: "Chat with your documents as if you're talking to a knowledgeable assistant."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Any PDF Format",
      description: "Works with research papers, reports, manuals, and any PDF document."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Research Scientist",
      content: "DocBudAI has revolutionized how I analyze research papers. What used to take hours now takes minutes.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Legal Consultant",
      content: "The accuracy and speed of document analysis is incredible. It's like having a research assistant 24/7.",
      rating: 5
    },
    {
      name: "Dr. Emily Watson",
      role: "Academic Researcher",
      content: "I can now quickly extract key insights from hundreds of papers. This tool is a game-changer.",
      rating: 5
    }
  ];

  return (
    <>
      <Head>
        <title>DocBudAI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    DocBudAI
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link href="/chat">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Try Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-8">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Powered by Advanced AI</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 leading-tight">
                Chat with Your
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PDF Documents
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                Transform any PDF into an intelligent conversation. Ask questions, get instant answers, 
                and unlock insights from your documents with the power of AI.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Link href="/chat">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg h-auto">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Start Chatting Free
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-gray-300 hover:bg-gray-50 px-8 py-4 text-lg h-auto"
                  onClick={() => window.open('#documentation', '_blank')}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Read Documentation
                </Button>
              </div>

              {/* Demo Preview */}
              <div className="relative max-w-5xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200/50">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="ml-4 text-sm text-gray-600 font-medium">DocBudAI</span>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-green-500 p-2 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-green-900">research-paper.pdf is ready</p>
                          <p className="text-sm text-green-700">Ask any question about your document</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-end">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-tr-lg px-6 py-3 max-w-xs">
                          <p className="text-sm">What are the main findings of this research?</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-lg px-6 py-3 max-w-md">
                          <p className="text-sm text-gray-700">The research presents three key findings: 1) AI models show 94% accuracy in document analysis, 2) Processing time reduced by 80% compared to manual review...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose DocBudAI?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience the future of document interaction with our cutting-edge AI technology.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="group p-6 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform duration-300 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Get started in three simple steps and unlock the power of your documents.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Upload Your PDF",
                  description: "Simply drag and drop your PDF document or click to browse and select your file.",
                  icon: <FileText className="h-8 w-8" />
                },
                {
                  step: "02", 
                  title: "AI Processing",
                  description: "Our advanced AI analyzes and understands your document's content in seconds.",
                  icon: <Sparkles className="h-8 w-8" />
                },
                {
                  step: "03",
                  title: "Start Chatting",
                  description: "Ask questions in natural language and get instant, accurate answers from your document.",
                  icon: <MessageCircle className="h-8 w-8" />
                }
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                        {step.step}
                      </div>
                      <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-xl text-blue-600">
                        {step.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ChevronRight className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Documents?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who are already using DocBudAI to unlock insights from their documents.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg h-auto font-semibold">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Start Free Today
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
            
            <p className="text-blue-200 text-sm mt-6">
               Process up to 10 documents free
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-3 mb-4 md:mb-0">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">DocBudAI</h3>
                  <p className="text-gray-400 text-sm">PDF Intelligence Platform</p>
                </div>
              </div>
              
              <div className="text-center md:text-right">
                <p className="text-gray-400 text-sm">
                  © 2025 DocBudAI. All rights reserved.
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Powered by Advanced AI Technology
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}