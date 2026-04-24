
import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, ArrowLeft, Clock, Tag, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: React.ReactNode;
  category: string;
  author: string;
  date: string;
  image: string;
  readTime: string;
}

const BlogPage: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Scroll to top when opening a post or going back
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedPost]);

  const posts: BlogPost[] = [
    {
      id: 1,
      title: "5 Invoicing Mistakes That Are Costing You Money",
      excerpt: "Are you making these common billing errors? Learn how to fix them and get paid faster.",
      category: "Invoicing Tips",
      author: "Solomon T",
      date: "Nov 15, 2024",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1200",
      content: (
        <>
            <p className="mb-6 text-lg leading-relaxed text-slate-700">Invoicing seems simple: you do the work, you send the bill, you get paid. But for many Ethiopian businesses, the reality is often messier. Small mistakes in your invoicing process can lead to delayed payments, tax compliance issues with the Ministry of Revenues, or lost revenue.</p>
            
            <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4">1. Missing or Incorrect TIN Numbers</h3>
            <p className="mb-6 leading-relaxed text-slate-700">In Ethiopia, a Tax Identification Number (TIN) is mandatory for valid tax invoices. If you forget to include your client's TIN, or if you mis-type it, the invoice may be rejected by their finance department because they cannot claim it as a deductible expense. Always double-check TINs before hitting send.</p>
            
            <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4">2. Vague Descriptions</h3>
            <p className="mb-6 leading-relaxed text-slate-700">Writing "Consulting Services" or "Goods" is rarely enough. Clients often need specific breakdowns for their own internal auditing. Instead of "Web Design", try "Website Redesign: Homepage and Contact Page Layouts - 10 Hours". Clarity reduces the "back-and-forth" questions that delay payment.</p>
            
            <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4">3. Getting the VAT Calculation Wrong</h3>
            <p className="mb-6 leading-relaxed text-slate-700">The standard VAT rate is 15%. Calculating this manually on a piece of paper often leads to rounding errors. If your total doesn't match the line items exactly, accountants will reject the invoice. Using a digital tool like Proforma ensures your math is always 100% accurate.</p>
            
            <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4">4. Not Sending Invoices Immediately</h3>
            <p className="mb-6 leading-relaxed text-slate-700">The best time to invoice is the moment the work is approved. Waiting until the end of the month slows down your cash flow. If you finish a job on the 5th, but invoice on the 30th, you've essentially given your client a free 25-day loan.</p>
            
            <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4">5. Forgetting Payment Terms</h3>
            <p className="mb-6 leading-relaxed text-slate-700">Does the client have 7 days to pay? 30 days? If you don't state it clearly on the invoice, they will prioritize other bills that do have deadlines. Always include a specific due date and payment instructions (e.g., your CBE or Dashen Bank account number).</p>
        </>
      )
    },
    {
      id: 2,
      title: "Understanding VAT in Ethiopia: A Simple Guide",
      excerpt: "Everything small business owners need to know about Value Added Tax registration and compliance.",
      category: "Tax & Compliance",
      author: "Solomon T",
      date: "Nov 10, 2024",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1586483777028-3b6e012c9b22?auto=format&fit=crop&q=80&w=1200",
      content: (
        <>
            <p className="mb-6 text-lg leading-relaxed text-slate-700">Value Added Tax (VAT) is a consumption tax placed on a product whenever value is added at each stage of the supply chain. In Ethiopia, the standard rate is 15%, but navigating the rules can be tricky for new business owners.</p>
            
            <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Who Needs to Register?</h3>
            <p className="mb-6 leading-relaxed text-slate-700">According to Ethiopian tax law, registration for VAT is mandatory if your annual taxable turnover exceeds 1,000,000 ETB. However, you can also voluntarily register if your turnover is lower but you want the benefits of being part of the VAT system, such as claiming back input VAT.</p>
            
            <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4">The Invoice Requirements</h3>
            <p className="mb-6 leading-relaxed text-slate-700">A VAT invoice is a legal document. It must contain specific information to be valid:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-700">
                <li>The words "VAT INVOICE" clearly displayed.</li>
                <li>Your business name and TIN.</li>
                <li>The purchaser's name and TIN.</li>
                <li>The VAT registration number.</li>
                <li>The date of the transaction.</li>
                <li>A description of goods/services.</li>
                <li>The taxable amount and the VAT amount shown separately.</li>
            </ul>
            
            <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4">TOT vs VAT</h3>
            <p className="mb-6 leading-relaxed text-slate-700">If you are not registered for VAT, you might be liable for Turnover Tax (TOT). TOT is generally 2% on goods and 10% on services. You cannot charge VAT if you are only registered for TOT, and you cannot charge TOT if you are registered for VAT. Mixing these up is a common compliance failure.</p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-sm text-blue-800"><strong>Note:</strong> This article is for informational purposes. Always consult a certified tax professional or the Ministry of Revenues for official advice.</p>
            </div>
        </>
      )
    },
    {
      id: 3,
      title: "Digital Transformation for Addis Ababa SMEs",
      excerpt: "How local businesses are using technology to leapfrog traditional barriers to growth.",
      category: "Business Growth",
      author: "Solomon T",
      date: "Nov 05, 2024",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
      content: (
        <>
            <p className="mb-6 text-lg leading-relaxed text-slate-700">The business landscape in Addis Ababa is changing rapidly. Gone are the days when a physical shop and a paper ledger were enough. Today, digital transformation is not just a buzzword; it's a survival strategy.</p>
            
            <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4">The Rise of Digital Payments</h3>
            <p className="mb-6 leading-relaxed text-slate-700">With the explosion of Telebirr, CBE Birr, and Amole, carrying cash is becoming less common for large transactions. Businesses that refuse digital payments are turning away customers. Integrating these payment methods into your billing workflow is essential.</p>
            
            <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Cloud-Based Management</h3>
            <p className="mb-6 leading-relaxed text-slate-700">SMEs are moving away from Excel files saved on a single laptop. Cloud tools allow teams to access inventory data, client lists, and financial reports from anywhere—whether they are in Bole, Piassa, or traveling abroad.</p>
            
            <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Social Commerce</h3>
            <p className="mb-6 leading-relaxed text-slate-700">Telegram and TikTok have become the new marketplaces. However, closing a sale on Telegram often gets messy. Tools like Proforma bridge the gap by allowing you to send a professional link or PDF quote directly in the chat, converting a casual conversation into a formal business transaction.</p>
        </>
      )
    },
    {
      id: 4,
      title: "The Difference Between Proforma and Commercial Invoices",
      excerpt: "Confused by the terminology? We break down exactly when to use which document.",
      category: "Education",
      author: "Solomon T",
      date: "Oct 28, 2024",
      readTime: "3 min read",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200",
      content: (
        <>
            <p className="mb-6 text-lg leading-relaxed text-slate-700">In the world of trade, paperwork is king. But knowing which paper to use when can be confusing. Two terms that often trip up new business owners are "Proforma Invoice" and "Commercial Invoice".</p>
            
            <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4">What is a Proforma Invoice?</h3>
            <p className="mb-6 leading-relaxed text-slate-700">A Proforma invoice is essentially a "pre-invoice" or a formal quote. It declares: <em>"If you buy these things from me, this is exactly what it will cost."</em></p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-700">
                <li><strong>Purpose:</strong> To help the buyer arrange payment or get approval from their boss.</li>
                <li><strong>Legal Status:</strong> It is generally NOT a demand for payment and cannot be used to reclaim VAT.</li>
                <li><strong>Timing:</strong> Sent <em>before</em> the goods are delivered or work starts.</li>
            </ul>

            <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4">What is a Commercial Invoice?</h3>
            <p className="mb-6 leading-relaxed text-slate-700">A Commercial invoice is the final bill. It declares: <em>"You have bought these things, and you now owe me this amount."</em></p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-700">
                <li><strong>Purpose:</strong> To request payment and record the transaction for tax purposes.</li>
                <li><strong>Legal Status:</strong> It is a binding legal document used for accounting and tax filing.</li>
                <li><strong>Timing:</strong> Sent <em>after</em> or <em>when</em> the goods are delivered.</li>
            </ul>
        </>
      )
    },
    {
      id: 5,
      title: "How to Brand Your Invoices for Professionalism",
      excerpt: "Your invoice is a marketing tool. Learn how to use it to reinforce your brand identity.",
      category: "Branding",
      author: "Solomon T",
      date: "Oct 20, 2024",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&q=80&w=1200",
      content: (
        <>
            <p className="mb-6 text-lg leading-relaxed text-slate-700">An invoice is often the last touchpoint you have with a client during a project. Sending a messy, generic Excel sheet or a handwritten scrap of paper says "I am an amateur." Sending a branded, sleek PDF says "I am a professional."</p>
            
            <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4">1. Your Logo Matters</h3>
            <p className="mb-6 leading-relaxed text-slate-700">Your logo should be prominent at the top. It triggers brand recognition. Even if you are a freelancer, having a personal logo or a nice wordmark sets you apart from the competition.</p>
            
            <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4">2. Color Consistency</h3>
            <p className="mb-6 leading-relaxed text-slate-700">If your website is blue and your business card is blue, your invoice shouldn't be red. Use accent colors in your invoice template (for lines, headers, or footers) that match your primary brand color.</p>
            
            <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4">3. The "Thank You" Note</h3>
            <p className="mb-6 leading-relaxed text-slate-700">Never underestimate politeness. Including a "Thank you for your business" or "It was a pleasure working with you" in the notes section leaves a positive final impression, increasing the likelihood of repeat business.</p>
        </>
      )
    },
    {
      id: 6,
      title: "Top 3 Payment Gateways in Ethiopia for 2024",
      excerpt: "A comparison of Telebirr, Chapa, and others for accepting digital payments.",
      category: "Payments",
      author: "Solomon T",
      date: "Oct 15, 2024",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1200",
      content: (
        <>
            <p className="mb-6 text-lg leading-relaxed text-slate-700">Accepting digital payments is no longer optional. But which provider should you choose? Here is a quick breakdown of the top contenders in the Ethiopian market right now.</p>
            
            <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4">1. Telebirr</h3>
            <p className="mb-6 leading-relaxed text-slate-700"><strong>Best for:</strong> Micro-transactions and reaching the mass market.<br/>With millions of users, Telebirr is ubiquitous. If you sell low-cost items to the general public, this is a must-have. The integration for businesses is improving, allowing for merchant accounts and QR code payments.</p>
            
            <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4">2. Chapa</h3>
            <p className="mb-6 leading-relaxed text-slate-700"><strong>Best for:</strong> E-commerce and Developers.<br/>Chapa has revolutionized the developer experience. Their API is clean, modern, and easy to integrate into websites. They support international cards as well, which is great if you have diaspora clients.</p>
            
            <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4">3. CBE Birr / Bank Apps</h3>
            <p className="mb-6 leading-relaxed text-slate-700"><strong>Best for:</strong> B2B and larger transactions.<br/>Most established businesses bank with CBE. Transfers within the CBE ecosystem are free and instant. For high-value invoices, a direct bank transfer reference is still the most trusted method.</p>
        </>
      )
    }
  ];

  if (selectedPost) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-white">
        {/* Progress Bar (Simulated) */}
        <div className="fixed top-0 left-0 h-1 bg-blue-600 z-50 w-full opacity-0 animate-fade-in" style={{animationDuration: '0.5s', opacity: 1}} />
        
        <div className="container mx-auto px-4 max-w-4xl">
          <button 
            onClick={() => setSelectedPost(null)}
            className="group flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors mb-8 font-medium"
          >
            <div className="p-2 rounded-full bg-slate-100 group-hover:bg-blue-50 transition-colors">
                <ArrowLeft className="w-5 h-5" />
            </div>
            <span>Back to Blog</span>
          </button>

          <article className="animate-fade-in-up">
            <div className="mb-8">
                <div className="flex flex-wrap gap-4 items-center text-sm text-slate-500 mb-6">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold">{selectedPost.category}</span>
                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {selectedPost.date}</span>
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {selectedPost.readTime}</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 font-display leading-tight">{selectedPost.title}</h1>
                <div className="flex items-center space-x-3 pb-8 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                        <User className="w-6 h-6 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">{selectedPost.author}</p>
                        <p className="text-xs text-slate-500">Editor in Chief</p>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-xl mb-12 h-64 md:h-96 w-full">
                <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
            </div>

            <div className="prose prose-lg prose-slate max-w-none mb-12">
                {selectedPost.content}
            </div>

            <div className="border-t border-slate-200 pt-8 mt-12">
                <h4 className="font-bold text-slate-900 mb-4">Share this article</h4>
                <div className="flex space-x-4">
                    <button className="p-3 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors">
                        <Twitter className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors">
                        <Facebook className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors">
                        <Linkedin className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-display">
            Resources & <span className="text-blue-600">Insights</span>
          </h1>
          <p className="text-xl text-slate-600">
            Expert advice, industry news, and practical tips to help you run your business better.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {['All Posts', 'Invoicing Tips', 'Tax & Compliance', 'Business Growth', 'Payments'].map((cat, i) => (
            <button 
              key={i}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${i === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article 
                key={post.id} 
                onClick={() => setSelectedPost(post)}
                className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full group cursor-pointer hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-600 uppercase tracking-wide">
                  {post.category}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-slate-600 mb-6 text-sm line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                    <button className="text-blue-600 font-semibold text-sm flex items-center hover:text-blue-700 transition-colors group-hover:translate-x-2 duration-300">
                        Read Article <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-24 bg-blue-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">Subscribe to our newsletter</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Get the latest updates, tips, and free resources delivered directly to your inbox. No spam, ever.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-6 py-3 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-400 placeholder:text-slate-400"
            />
            <button className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
              Subscribe
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlogPage;
