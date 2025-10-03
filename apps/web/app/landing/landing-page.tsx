"use client"

import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";
import Script from 'next/script';
import Image from "next/image";
import { ArrowRight, MessageCircle, Phone, Users, BookOpen, Camera, Zap, Check, Menu, X, Star, LucideIcon } from "lucide-react";
import { useState } from "react";

// Types
interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface NavLink {
  name: string;
  href: string;
}

interface PricingFeature {
  text: string;
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
  ctaVariant: "default" | "outline";
}

// Constants
const NAV_LINKS: NavLink[] = [
  { name: "How it works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
];

const FEATURES: Feature[] = [
  {
    icon: MessageCircle,
    title: "Affordable Time-Saving Chat",
    description: "Get time back from answering the same questions. AI handles repetitive inquiries so you can focus on growing your business."
  },
  {
    icon: Phone,
    title: "Phone-Based AI Support",
    description: "VAPI plugin integration provides natural phone conversations. Your customers get instant help via voice calls."
  },
  {
    icon: Zap,
    title: "Context-Based AI Answers",
    description: "AI understands your business context and provides accurate, personalized responses that actually help your customers."
  },
  {
    icon: Users,
    title: "Smart Escalation",
    description: "Complex issues automatically escalate to your team with complete conversation context and history."
  },
  {
    icon: BookOpen,
    title: "Impact Reporting",
    description: "Track and report on the impact your support is having. See response times, resolution rates, and customer satisfaction."
  },
  {
    icon: Camera,
    title: "Visual Context",
    description: "Screenshot capture so you can see exactly what customers see for faster resolution and better understanding."
  }
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Responsely gave us our time back! We were spending hours answering the same questions. Now our AI handles 80% of inquiries and our customers get instant help.",
    author: "Sarah Chen",
    role: "Owner",
    company: "Local Bakery"
  },
  {
    quote: "The phone support with VAPI is a game-changer. Our customers can call and get help immediately, even when we're closed. It's like having a 24/7 receptionist.",
    author: "Michael Rodriguez", 
    role: "Founder",
    company: "Small Tech Shop"
  },
  {
    quote: "For $20/month, we get professional customer service that actually understands our business. The reporting shows us exactly how much time we're saving.",
    author: "Emma Thompson",
    role: "Manager", 
    company: "Family Restaurant"
  }
];

const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for small businesses getting started",
    features: [
      "Basic chat support",
      "Up to 100 messages/month", 
      "1 team member",
      "Email support"
    ],
    ctaText: "Get started free",
    ctaVariant: "outline"
  },
  {
    name: "Pro",
    price: "$20",
    period: "/month",
    description: "Everything small businesses need for professional customer service",
    features: [
      "Everything in Free",
      "Affordable Time-Saving Chat",
      "Phone-Based AI Support",
      "Context-Based AI Answers",
      "Impact Reporting",
      "Smart Escalation",
      "Visual Context",
      "Unlimited messages",
      "Priority support"
    ],
    isPopular: true,
    ctaText: "Start 14-day free trial",
    ctaVariant: "default"
  }
];

const TRUST_INDICATORS: PricingFeature[] = [
  { text: "Free 14-day trial" },
  { text: "No credit card required" },
  { text: "Cancel anytime" }
];

const FOOTER_LINKS = {
  product: [
    { name: "Features", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "Integrations", href: "/integrations" },
    { name: "API", href: "/docs" }
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" }
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Documentation", href: "/docs" },
    { name: "Status", href: "/status" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" }
  ]
};

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-white" style={{ scrollBehavior: 'smooth' }}>
      {/* Header - Clean & Minimal */}
      <header className="bg-white border-b border-gray-100">

        {/* Responsely widget */}
        <Script 
          src="https://responsely-widget.vercel.app/widget.js"
          data-organization-id="org_32L1uTeAUOuCH8tmVIhJXM8ExVe"
          strategy="afterInteractive"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <Image 
                  src="/responsely-logo-transparent-bg.png" 
                  alt="Responsely Logo"
                  width={48}
                  height={48}
                  className="w-12 h-12"
                />
              </div>
              <span className="text-xl font-bold text-gray-900">Responsely</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {NAV_LINKS.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
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
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-100 bg-white py-4">
              <div className="space-y-4">
                {NAV_LINKS.map((link) => (
                  <Link 
                    key={link.name}
                    href={link.href} 
                    className="block px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                    onClick={closeMenu}
                  >
                    {link.name}
                  </Link>
                ))}
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
                  AI Customer Service that{" "}
                  <span className="text-blue-600">saves you time</span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Stop answering the same questions over and over. Let AI handle customer inquiries while you focus on growing your small business.
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
                {/* Optimized image */}
                <div className="relative">
                  <Image 
                    src="/illustration.png" 
                    alt="AI Customer Support Interface showing chat conversation and analytics dashboard"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-3xl shadow-lg"
                    priority
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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
              How small businesses save time with AI
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From chat to phone calls, our AI handles repetitive questions so you can focus on what matters most - growing your business.
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
              Everything small businesses need for professional support
            </h2>
            <p className="text-xl text-gray-600">
              Affordable tools that save you time and help your customers get the answers they need
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
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
              Trusted by small businesses like yours
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 italic leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
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
            {PRICING_PLANS.map((plan, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-3xl p-8 shadow-sm border ${
                  plan.isPopular 
                    ? 'border-2 border-blue-600 shadow-lg relative' 
                    : 'border-gray-200'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-2">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.ctaVariant} 
                  className={`w-full py-3 text-lg font-semibold ${
                    plan.ctaVariant === 'default' 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'border-2'
                  }`} 
                  asChild
                >
                  <Link href="/sign-up">{plan.ctaText}</Link>
                </Button>
              </div>
            ))}
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
              Ready to get your time back?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join small businesses using Responsely to stop answering the same questions and focus on what matters most - growing your business.
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
              {TRUST_INDICATORS.map((indicator, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{indicator.text}</span>
                </div>
              ))}
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
                <div className="w-12 h-12 flex items-center justify-center">
                  <Image 
                    src="/responsely-logo-transparent-bg.png" 
                    alt="Responsely Logo"
                    width={48}
                    height={48}
                  />
                </div>
                <span className="text-xl font-bold text-gray-900">Responsely</span>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Affordable AI customer service for small businesses. Get your time back and let AI handle repetitive questions.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-3">
                {FOOTER_LINKS.product.map((link) => (
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
                {FOOTER_LINKS.company.map((link) => (
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
                {FOOTER_LINKS.support.map((link) => (
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