"use client";

import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";
import { ArrowRight, MessageCircle, Phone, Users, BookOpen, Camera, Zap, Check, Menu, X, Star } from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Clean & Minimal */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-10 h-10">
                  {/* Chat bubble with Responsely text */}
                  <path d="M15 20 C15 15, 20 10, 25 10 L65 10 C70 10, 75 15, 75 20 L75 45 C75 50, 70 55, 65 55 L35 55 L25 65 L25 55 C20 55, 15 50, 15 45 Z" 
                        fill="none" 
                        stroke="black" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"/>
                  <path d="M55 35 C55 30, 60 25, 65 25 L85 25 C90 25, 95 30, 95 35 L95 55 C95 60, 90 65, 85 65 L75 65 L70 70 L70 65 C65 65, 60 60, 60 55 L60 40 C60 37, 57 35, 55 35 Z" 
                        fill="none" 
                        stroke="black" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Responsely</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                How it works
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Pricing
              </Link>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900" asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6" asChild>
                <Link href="/sign-up">Get started</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-100 bg-white py-4">
              <div className="space-y-4">
                <Link 
                  href="#how-it-works" 
                  className="block px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How it works
                </Link>
                <Link 
                  href="#pricing" 
                  className="block px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
                <div className="px-4 pt-4 space-y-3">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href="/sign-up">Get started</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section - ExpressVPN Style */}
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  AI Customer Service That{" "}
                  <span className="text-blue-600">Actually Works</span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Resolve 90% of customer issues instantly with AI that understands context, speaks naturally, and escalates intelligently.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg" asChild>
                  <Link href="/sign-up">
                    Get started free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold border-2 border-gray-300" asChild>
                  <Link href="#how-it-works">
                    See how it works
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Free 14-day trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>

            {/* Right Column - Illustration */}
            <div className="lg:pl-8">
              <div className="relative">
                {/* Your actual illustration */}
                <div className="relative">
                  <img 
                    src="/illustration.png" 
                    alt="AI Customer Support Interface" 
                    className="w-full h-auto rounded-3xl shadow-lg"
                  />
                </div>
                
                {/* Floating elements for visual interest */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-300 rounded-full opacity-80"></div>
                <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-pink-300 rounded-full opacity-60"></div>
                <div className="absolute top-1/2 -left-4 w-6 h-6 bg-green-300 rounded-full opacity-70"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Customer service that actually resolves issues
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From chat to voice calls, our AI handles 90% of customer interactions while seamlessly escalating complex issues to your team.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative mb-8">
                {/* Illustration placeholder */}
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-lg">
                  <MessageCircle className="w-12 h-12 text-blue-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Customer asks question
              </h3>
              <p className="text-gray-600">
                Via chat, email, or phone call - your customers reach out with their questions and issues.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-lg">
                  <Zap className="w-12 h-12 text-purple-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                AI analyzes & responds
              </h3>
              <p className="text-gray-600">
                Our AI understands context, searches your knowledge base, and provides accurate, helpful responses instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-lg">
                  <Users className="w-12 h-12 text-green-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Smart escalation
              </h3>
              <p className="text-gray-600">
                Complex issues are automatically escalated to your team with full context and conversation history.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold" asChild>
              <Link href="/sign-up">
                Start resolving issues faster
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section - Clean Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need for customer success
            </h2>
            <p className="text-xl text-gray-600">
              All the tools to transform your customer service experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: "AI Customer Support",
                description: "Understands context and intent, not just keywords. Provides helpful, accurate responses every time."
              },
              {
                icon: Phone,
                title: "AI Voice Agent",
                description: "Natural phone conversations with sub-second response times. Available 24/7 for your customers."
              },
              {
                icon: Zap,
                title: "Smart Escalation",
                description: "Automatically escalates complex issues to your team with complete conversation context."
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Unified workspace where your team can collaborate, assign tickets, and track performance."
              },
              {
                icon: BookOpen,
                title: "Knowledge Base",
                description: "AI-powered search that finds answers instantly from your documentation and FAQs."
              },
              {
                icon: Camera,
                title: "Visual Context",
                description: "Screenshot capture so you can see exactly what customers see for faster resolution."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Loved by growing companies
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Responsely reduced our response time by 70% and our customers love getting instant, accurate help. It's like having our best support agent available 24/7.",
                author: "Sarah Chen",
                role: "Head of Customer Success",
                company: "TechFlow Inc"
              },
              {
                quote: "The voice agent feature is incredible. Our phone support is now completely automated for common issues, freeing up our team for complex problems.",
                author: "Michael Rodriguez", 
                role: "CEO",
                company: "GrowthLabs"
              },
              {
                quote: "Setup took 5 minutes and we saw immediate results. The AI understands context better than solutions that cost 10x more.",
                author: "Emma Thompson",
                role: "Support Manager", 
                company: "CloudSync"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-sm font-semibold">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Clean ExpressVPN Style */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your business needs
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-600 ml-2">forever</span>
                </div>
                <p className="text-gray-600">Perfect for small teams getting started</p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "Basic chat support",
                  "Up to 100 messages/month", 
                  "1 team member",
                  "Email support"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button variant="outline" className="w-full py-3 text-lg font-semibold border-2" asChild>
                <Link href="/sign-up">Get started free</Link>
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-blue-600 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-4 py-2">
                  Most Popular
                </Badge>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900">$10</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                <p className="text-gray-600">Everything you need to scale customer success</p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "Everything in Free",
                  "AI Customer Support",
                  "AI Voice Agent", 
                  "Phone System",
                  "Team collaboration",
                  "Knowledge Base",
                  "Screenshot services",
                  "Unlimited messages",
                  "Priority support"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg font-semibold" asChild>
                <Link href="/sign-up">Start 14-day free trial</Link>
              </Button>
            </div>
          </div>

          {/* Pricing FAQ */}
          <div className="text-center mt-12">
            <p className="text-gray-600">
              Questions about pricing?{" "}
              <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
                Contact our team
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Ready to transform your customer service?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of companies using Responsely to deliver exceptional customer experiences that drive growth.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg" asChild>
                <Link href="/sign-up">
                  Get started free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold border-2" asChild>
                <Link href="/contact">Contact sales</Link>
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 pt-4">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-10 h-10">
                    {/* Chat bubble with Responsely text */}
                    <path d="M15 20 C15 15, 20 10, 25 10 L65 10 C70 10, 75 15, 75 20 L75 45 C75 50, 70 55, 65 55 L35 55 L25 65 L25 55 C20 55, 15 50, 15 45 Z" 
                          fill="none" 
                          stroke="black" 
                          strokeWidth="3" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"/>
                    <path d="M55 35 C55 30, 60 25, 65 25 L85 25 C90 25, 95 30, 95 35 L95 55 C95 60, 90 65, 85 65 L75 65 L70 70 L70 65 C65 65, 60 60, 60 55 L60 40 C60 37, 57 35, 55 35 Z" 
                          fill="none" 
                          stroke="black" 
                          strokeWidth="3" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900">Responsely</span>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                AI-powered customer service that actually resolves issues. Transform your support experience today.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-3">
                {[
                  { name: "Features", href: "#how-it-works" },
                  { name: "Pricing", href: "#pricing" },
                  { name: "Integrations", href: "/integrations" },
                  { name: "API", href: "/docs" }
                ].map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-600 hover:text-gray-900 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-3">
                {[
                  { name: "About", href: "/about" },
                  { name: "Blog", href: "/blog" },
                  { name: "Careers", href: "/careers" },
                  { name: "Contact", href: "/contact" }
                ].map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-600 hover:text-gray-900 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-3">
                {[
                  { name: "Help Center", href: "/help" },
                  { name: "Documentation", href: "/docs" },
                  { name: "Status", href: "/status" },
                  { name: "Privacy", href: "/privacy" },
                  { name: "Terms", href: "/terms" }
                ].map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-600 hover:text-gray-900 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 text-sm">
                &copy; {new Date().getFullYear()} Responsely. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <Link href="/privacy" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}