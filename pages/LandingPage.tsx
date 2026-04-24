
import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, SlidersHorizontal, Users, Calculator, 
  FileDown, Mail, Globe, Heart, Coffee, Building2, 
  Package, ArrowRight, Star, Check, Zap, TrendingUp,
  Shield, Clock, MessageCircle, Menu, X, LayoutTemplate, FolderOpen
} from 'lucide-react';
import FeaturesPage from './FeaturesPage';
import HowItWorksPage from './HowItWorksPage';
import PricingPage from './PricingPage';
import ContactPage from './ContactPage';
import AboutPage from './AboutPage';
import BlogPage from './BlogPage';
import SupportPage from './SupportPage';
import SEO from '../components/SEO';

interface LandingPageProps {
  onGetStarted: () => void;
}

type MarketingView = 'home' | 'features' | 'how-it-works' | 'pricing' | 'testimonials' | 'contact' | 'about' | 'blog' | 'support';

// Intersection Observer hook for scroll animations
const useOnScreen = (ref: React.RefObject<Element>, threshold = 0.2) => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { threshold }
    );
    
    if (ref.current) observer.observe(ref.current);
    
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, threshold]);

  return isIntersecting;
};

// FeatureCard component definition
const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: { 
  icon: React.ElementType, 
  title: string, 
  description: string,
  delay?: number
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);
  
  // FIX: Using a type assertion to 'string' to resolve TypeScript's 'never' type inference issue.
  const visibilityClass = (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10') as string;
  const cardClassName = `bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/30 transition-all duration-700 transform ${visibilityClass} hover:-translate-y-3 hover:shadow-2xl group`;
  
  const cardStyle: React.CSSProperties = {
    transitionDelay: `${delay}ms`
  };

  return (
    <div 
      ref={ref}
      className={cardClassName}
      style={cardStyle}
    >
      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-bold font-display text-slate-800 mb-4">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
};

// StepItem component definition
const StepItem = ({ step, icon: Icon, title, description, isLeft = false }: {
  step: number,
  icon: React.ElementType,
  title: string,
  description: string,
  isLeft?: boolean
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);
  
  // FIX: Using a type assertion to 'string' to resolve TypeScript's 'never' type inference issue.
  const transformClass = (isVisible 
    ? 'opacity-100 translate-x-0' 
    : (isLeft ? 'opacity-0 -translate-x-10' : 'opacity-0 translate-x-10')) as string;
    
  const contentClassName = `bg-white p-8 rounded-2xl shadow-xl border border-white/30 transition-all duration-700 transform ${transformClass}`;

  return (
    <div ref={ref} className={`relative flex ${isLeft ? 'md:flex-row-reverse' : ''} items-center mb-20`}>
      {/* Content */}
      <div className={`md:w-1/2 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
        <div className={contentClassName}>
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full mr-4">
              {step}
            </div>
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          </div>
          <p className="text-slate-600">{description}</p>
        </div>
      </div>
      
      {/* Icon */}
      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center w-16 h-16 bg-white border-4 border-blue-100 rounded-full shadow-lg z-10">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// TestimonialCard component definition
const TestimonialCard = ({ name, role, content, delay = 0 }: {
  name: string,
  role: string,
  content: string,
  delay?: number
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);
  
  // FIX: Using a type assertion to 'string' to resolve TypeScript's 'never' type inference issue.
  const visibilityClass = (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10') as string;
  const cardClassName = `bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/30 transition-all duration-700 transform ${visibilityClass}`;
  
  const cardStyle: React.CSSProperties = {
    transitionDelay: `${delay}ms`
  };

  return (
    <div 
      ref={ref}
      className={cardClassName}
      style={cardStyle}
    >
      <div className="flex items-center mb-6">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
        ))}
      </div>
      <p className="text-slate-700 italic mb-6 leading-relaxed">"{content}"</p>
      <div>
        <p className="font-semibold text-slate-800">{name}</p>
        <p className="text-slate-600 text-sm">{role}</p>
      </div>
    </div>
  );
};

const TestimonialsView: React.FC = () => {
    return (
        <div className="pt-24 pb-16">
            <div className="container mx-auto px-4">
                 <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-display">
                        Loved by <span className="text-blue-600">Ethiopian Businesses</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        See why hundreds of local businesses trust Proforma for their daily quotation needs.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <TestimonialCard
                        name="Tigist Alemu"
                        role="Fashion Designer, Addis Ababa"
                        content="Proforma has transformed how I run my boutique. The quotations look so professional, and being able to calculate VAT automatically saves me hours every month. Ameseginalehu!"
                        delay={0}
                    />
                    <TestimonialCard
                        name="Dawit Kebede"
                        role="Electronics Importer"
                        content="I used to write receipts by hand. Now I create digital quotations in seconds and send them to my customers on Telegram. It's fast, easy, and free."
                        delay={100}
                    />
                    <TestimonialCard
                        name="Mahder Tadesse"
                        role="Consultant & Trainer"
                        content="The ability to manage my client list is a game changer. I have recurring clients, and Proforma remembers all their TIN numbers and addresses for me."
                        delay={200}
                    />
                    <TestimonialCard
                        name="Robel Haile"
                        role="Graphic Designer"
                        content="Finally, a quotation app that understands Ethiopian context. The layout is perfect for our standard paper sizes and the currency formatting is spot on."
                        delay={300}
                    />
                    <TestimonialCard
                        name="Sara Mohammed"
                        role="Café Owner"
                        content="I use the catalog feature to store all my catering menu items. When someone asks for a quote for an event, I can send it to them in under 2 minutes."
                        delay={400}
                    />
                    <TestimonialCard
                        name="Abdi Yusuf"
                        role="Freelance Developer"
                        content="Simple, clean, and effective. I love that I can download the PDF and just email it. It makes my freelance business look much more established."
                        delay={500}
                    />
                </div>
            </div>
        </div>
    )
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [currentView, setCurrentView] = useState<MarketingView>('home');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  
  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Reset scroll on view change
  useEffect(() => {
    window.scrollTo(0,0);
    setMobileMenuOpen(false);
  }, [currentView]);

  // Parallax effect for hero
  useEffect(() => {
    const handleParallax = () => {
      if (heroRef.current && currentView === 'home') {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroRef.current.style.transform = `translateY(${rate}px)`;
      }
    };
    
    window.addEventListener('scroll', handleParallax);
    return () => window.removeEventListener('scroll', handleParallax);
  }, [currentView]);
  
  // Stats counter animation
  const Counter: React.FC<{ end: number, suffix?: string }> = ({ end, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isVisible = useOnScreen(ref);
    
    useEffect(() => {
      if (isVisible) {
        let start = 0;
        const duration = 2000; // 2 seconds
        const increment = end / (duration / 16); // 60fps
        
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);
        
        return () => clearInterval(timer);
      }
    }, [isVisible, end]);
    
    return <span ref={ref}>{count}{suffix}</span>;
  };

  const navLinks = [
    { label: 'Home', view: 'home' as MarketingView },
    { label: 'Features', view: 'features' as MarketingView },
    { label: 'How It Works', view: 'how-it-works' as MarketingView },
    { label: 'Testimonials', view: 'testimonials' as MarketingView },
  ];

  const renderContent = () => {
      switch(currentView) {
          case 'features': return (
            <>
                <SEO title="Proforma - Features | Quotations, VAT Calc, Catalog" description="Discover powerful features like automatic VAT calculation, client management, and product catalogs tailored for Ethiopia." />
                <FeaturesPage onGetStarted={onGetStarted} />
            </>
          );
          case 'how-it-works': return (
            <>
                <SEO title="Proforma - How It Works" description="Learn how to set up your profile, add clients, and create professional quotations in 4 easy steps." />
                <HowItWorksPage onGetStarted={onGetStarted} />
            </>
          );
          case 'pricing': return (
            <>
                <SEO title="Proforma - Free for Everyone" description="Proforma is free for everyone. Start creating professional quotations and invoices today." />
                <div className="pt-24 pb-16 text-center container mx-auto">
                    <h1 className="text-4xl font-bold mb-4">Everything is Free</h1>
                    <p className="text-xl text-slate-600 mb-8">We've decided to make Proforma free for everyone. No catch, no credit card required.</p>
                    <button onClick={onGetStarted} className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold">Start Now</button>
                </div>
            </>
          );
          case 'testimonials': return (
            <>
                 <SEO title="Proforma - Customer Stories" description="See why hundreds of Ethiopian businesses trust Proforma for their daily quotation needs." />
                 <TestimonialsView />
            </>
          );
          case 'contact': return (
            <>
                <SEO title="Contact Proforma - Support & Sales" description="Get in touch with our team for support, feedback, or sales inquiries." />
                <ContactPage onGetStarted={onGetStarted} />
            </>
          );
          case 'about': return (
            <>
                <SEO title="About Proforma - Our Mission" description="We are building the digital infrastructure for Ethiopian SMEs. Learn more about our story and mission." />
                <AboutPage onGetStarted={onGetStarted} />
            </>
          );
          case 'blog': return (
            <>
                <SEO title="Proforma Blog - Business Tips & Tax Guides" description="Read our latest articles on quotation tips, VAT compliance, and business growth in Ethiopia." />
                <BlogPage />
            </>
          );
          case 'support': return (
            <>
                <SEO title="Proforma Support - Help Center & Privacy" description="Find answers to common questions, read our privacy policy, and get support." />
                <SupportPage onGetStarted={onGetStarted} />
            </>
          );
          default: return (
            <>
            <SEO title="Proforma - Free Quotation Generator for Ethiopia | VAT & TIN Ready" />
            {/* Enhanced Hero Section with Parallax */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 pt-16 pb-32 text-center overflow-hidden">
            <div className="container mx-auto relative z-10">
                <div className="max-w-4xl mx-auto">
                <div className="inline-block mb-6 px-4 py-2 bg-white/50 backdrop-blur-lg rounded-full border border-white/30 text-slate-700 font-medium animate-bounce">
                    🚀 Trusted by <Counter end={500} suffix="+" /> businesses worldwide
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-slate-900 font-display tracking-tight mb-6">
                    Create Quotations <br />
                    That <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Impress</span>
                </h1>
                
                <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-600 leading-relaxed">
                    The simplest way to create and manage professional quotations & invoices. 
                    Streamline your billing and focus on what you do best.
                </p>
                
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                    onClick={onGetStarted}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:scale-105 flex items-center space-x-2 group"
                    >
                    <span>Start For Free</span>
                    <Zap className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    </button>
                    
                    <button 
                        onClick={() => setCurrentView('how-it-works')}
                        className="px-8 py-4 bg-white/80 backdrop-blur-lg text-slate-700 font-semibold text-lg rounded-xl border border-white/30 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 group"
                    >
                    <span>How it works</span>
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    </button>
                </div>
                
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                    {[
                    { icon: Shield, text: 'Secure & Reliable' },
                    { icon: Clock, text: 'Save 5+ Hours/Week' },
                    { icon: TrendingUp, text: 'Increase Revenue' },
                    { icon: Check, text: 'Professional Results' }
                    ].map((item, index) => (
                    <div key={index} className="flex flex-col items-center text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg mb-3">
                        <item.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">{item.text}</p>
                    </div>
                    ))}
                </div>
                </div>
            </div>
            </section>

            {/* Enhanced Features Section */}
            <section ref={featuresRef} className="py-24 bg-gradient-to-b from-white/50 to-white/30 backdrop-blur-md border-t border-white/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-bold font-display text-slate-800 mb-4">
                    Your Billing, <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">Supercharged</span>
                </h2>
                <p className="text-slate-600 text-xl max-w-2xl mx-auto">
                    From automated calculations to beautiful templates, we've got you covered.
                </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureCard 
                    icon={LayoutTemplate}
                    title="Industry Templates"
                    description="Access 10+ industry-specific template packs (Construction, Web Dev, Graphics) to speed up your work."
                    delay={0}
                />
                <FeatureCard 
                    icon={FolderOpen}
                    title="Client Folders"
                    description="Organize work by client. Keep track of every version and history of your invoices automatically."
                    delay={100}
                />
                <FeatureCard 
                    icon={Calculator}
                    title="Auto Calculations"
                    description="Automatic tax, discount, and total calculations eliminate costly errors and save you time."
                    delay={200}
                />
                <FeatureCard 
                    icon={FileDown}
                    title="Instant PDF Export"
                    description="Download and share print-ready PDF quotations with a single click. Professional results in seconds."
                    delay={300}
                />
                </div>
                
                {/* Stats Section */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {[
                    { number: 500, suffix: '+', label: 'Happy Customers' },
                    { number: 10000, suffix: '+', label: 'Quotations Created' },
                    { number: 98, suffix: '%', label: 'Satisfaction Rate' },
                    { number: 5, suffix: 'hrs', label: 'Time Saved Weekly' }
                ].map((stat, index) => (
                    <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                        <Counter end={stat.number} suffix={stat.suffix} />
                    </div>
                    <p className="text-slate-600">{stat.label}</p>
                    </div>
                ))}
                </div>
            </div>
            </section>

            {/* Enhanced How It Works Section */}
            <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                <h2 className="text-4xl font-bold text-slate-800 mb-4">
                    Get Started in <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">4 Easy Steps</span>
                </h2>
                <p className="text-slate-600 text-xl max-w-2xl mx-auto">
                    Follow our simple, guided process to create your first professional quotation in just a few minutes.
                </p>
                </div>
                
                <div className="max-w-4xl mx-auto relative">
                {/* Vertical connecting line */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 to-indigo-200 -translate-x-1/2"></div>
                
                <StepItem 
                    step={1}
                    icon={Building2}
                    title="Set Your Company Profile"
                    description="Add your business name, logo, and contact details. This info will auto-populate on all your documents for a consistent brand identity."
                    isLeft={false}
                />
                
                <StepItem 
                    step={2}
                    icon={Package}
                    title="Build Your Catalog"
                    description="Save your products and services for quick selection. Add them to quotations with a single click, saving time on every transaction."
                    isLeft={true}
                />
                
                <StepItem 
                    step={3}
                    icon={Users}
                    title="Add Your Clients"
                    description="Manage your client information in one place. Select them when creating quotations to auto-fill their details automatically."
                    isLeft={false}
                />
                
                <StepItem 
                    step={4}
                    icon={FileDown}
                    title="Create & Download"
                    description="Generate a professional quotation or invoice and download it as a print-ready PDF instantly. Share with clients in seconds."
                    isLeft={true}
                />
                </div>
            </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-gradient-to-b from-white to-indigo-50/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                <h2 className="text-4xl font-bold text-slate-800 mb-4">
                    What Our <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Customers Say</span>
                </h2>
                <p className="text-slate-600 text-xl max-w-2xl mx-auto">
                    Don't just take our word for it. Here's what our users have to say about Proforma.
                </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <TestimonialCard
                    name="Tigist Alemu"
                    role="Fashion Designer"
                    content="Proforma has saved me so much time. I used to spend hours creating quotations, now it takes minutes. My clients love the professional look!"
                    delay={0}
                />
                <TestimonialCard
                    name="Dawit Kebede"
                    role="Importer & Distributor"
                    content="The auto-calculations feature eliminated my quoting errors. I've recovered thousands in previously missed charges. Highly recommended!"
                    delay={100}
                />
                <TestimonialCard
                    name="Mahder Tadesse"
                    role="Business Consultant"
                    content="As a consultant with multiple clients, Proforma makes managing my quotations effortless. The client management system is a game-changer."
                    delay={200}
                />
                </div>
            </div>
            </section>

            {/* Enhanced CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Quotations?
                </h2>
                <p className="text-blue-100 text-xl max-w-2xl mx-auto mb-10">
                Join thousands of businesses already using Proforma to save time and get paid faster.
                </p>
                <button
                onClick={onGetStarted}
                className="px-10 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-2xl transform hover:scale-105 flex items-center space-x-2 mx-auto group"
                >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                </button>
                <p className="mt-4 text-blue-200 text-sm">
                No credit card required • Completely Free • Cancel anytime
                </p>
            </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                <h2 className="text-4xl font-bold text-slate-800 mb-4">
                    Frequently Asked <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Questions</span>
                </h2>
                <p className="text-slate-600 text-xl max-w-2xl mx-auto">
                    Got questions? We've got answers. If you can't find what you're looking for, contact our support team.
                </p>
                </div>
                
                <div className="max-w-3xl mx-auto grid gap-6">
                {[
                    {
                    question: "How long does it take to set up?",
                    answer: "Most users are up and running in under 10 minutes. Our intuitive interface guides you through the setup process step by step."
                    },
                    {
                    question: "Can I customize the quotation templates?",
                    answer: "Yes! We offer a variety of professionally designed templates that you can customize with your logo, colors, and business information."
                    },
                    {
                    question: "Is there a mobile app?",
                    answer: "Our web application is fully responsive and works great on mobile devices. We're also developing dedicated mobile apps for iOS and Android."
                    },
                    {
                    question: "What payment methods do you Accept?",
                    answer: "We accept all popular payment processors like Telebirr, Cbe, Chapa, Stripe, PayPal, and Square, allowing for easy pay directly online."
                    }
                ].map((faq, index) => (
                    <div key={index} className="bg-slate-50/80 backdrop-blur-lg rounded-2xl p-6 border border-slate-200/50 transition-all duration-300 hover:shadow-lg">
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">{faq.question}</h3>
                    <p className="text-slate-600">{faq.answer}</p>
                    </div>
                ))}
                </div>
            </div>
            </section>
            </>
          );
      }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 text-slate-800 font-sans selection:bg-blue-200 overflow-hidden flex flex-col">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-indigo-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 right-1/4 w-64 h-64 bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Header with scroll effect */}
      <header className={`py-4 px-4 sm:px-8 flex justify-between items-center fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg py-3' : 'bg-transparent'
      }`}>
        <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => setCurrentView('home')}
        >
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Proforma</h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
                <button 
                    key={link.view}
                    onClick={() => setCurrentView(link.view)}
                    className={`text-sm font-medium transition-colors ${currentView === link.view ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
                >
                    {link.label}
                </button>
            ))}
        </nav>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={onGetStarted}
            className="px-3 sm:px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5 text-sm sm:text-base group flex items-center space-x-2"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-slate-600 p-2"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
              {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden">
              <nav className="flex flex-col space-y-6 text-center">
                {navLinks.map(link => (
                    <button 
                        key={link.view}
                        onClick={() => {
                            setCurrentView(link.view);
                            setMobileMenuOpen(false);
                        }}
                        className={`text-xl font-medium ${currentView === link.view ? 'text-blue-600' : 'text-slate-600'}`}
                    >
                        {link.label}
                    </button>
                ))}
              </nav>
          </div>
      )}
      
      <main className="flex-grow">
          {renderContent()}
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-slate-900 text-white py-16 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div 
                className="flex items-center space-x-3 mb-6 cursor-pointer"
                onClick={() => setCurrentView('home')}
              >
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display">Proforma</h3>
              </div>
              <p className="text-slate-400 mb-4">
                The simplest way to create and manage professional quotations & invoices.
              </p>
            </div>
            
            <div>
                <h4 className="text-lg font-semibold mb-6">Product</h4>
                <ul className="space-y-3">
                    <li><button onClick={() => setCurrentView('features')} className="text-slate-400 hover:text-white transition-colors">Features</button></li>
                    <li><button onClick={() => setCurrentView('how-it-works')} className="text-slate-400 hover:text-white transition-colors">How It Works</button></li>
                    <li><button onClick={() => setCurrentView('testimonials')} className="text-slate-400 hover:text-white transition-colors">Testimonials</button></li>
                </ul>
            </div>
             <div>
                <h4 className="text-lg font-semibold mb-6">Company</h4>
                <ul className="space-y-3">
                    <li><button onClick={() => setCurrentView('contact')} className="text-slate-400 hover:text-white transition-colors">Contact</button></li>
                    <li><button onClick={() => setCurrentView('about')} className="text-slate-400 hover:text-white transition-colors">About</button></li>
                    <li><button onClick={() => setCurrentView('blog')} className="text-slate-400 hover:text-white transition-colors">Blog</button></li>
                </ul>
            </div>
             <div>
                <h4 className="text-lg font-semibold mb-6">Support</h4>
                <ul className="space-y-3">
                    <li><button onClick={() => setCurrentView('support')} className="text-slate-400 hover:text-white transition-colors">Help Center</button></li>
                    <li><button onClick={() => setCurrentView('support')} className="text-slate-400 hover:text-white transition-colors">Privacy Policy</button></li>
                    <li><button onClick={() => setCurrentView('contact')} className="text-slate-400 hover:text-white transition-colors">Contact Us</button></li>
                </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-center">
            <p className="font-semibold text-slate-300 mb-2">
              Powered by <a href="https://liyu.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                Liyu Solutions
              </a>
            </p>
            <p className="text-slate-500">
              &copy; {new Date().getFullYear()} Proforma. All rights reserved.
            </p>
            <p className="mt-4 flex items-center justify-center space-x-2 text-slate-500 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>&</span>
              <Coffee className="w-4 h-4 text-yellow-600" />
              <span>by</span>
              <a href="https://www.linkedin.com/in/sol-tig/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200">
                Solomon T
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating CTA Button */}
      {currentView === 'home' && (
        <div className={`fixed bottom-6 right-6 z-40 transition-all duration-300 transform ${
            scrolled ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
            <button
            onClick={onGetStarted}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 group"
            >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
