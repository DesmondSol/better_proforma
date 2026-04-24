
import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, MessageSquare } from 'lucide-react';

interface ContactPageProps {
  onGetStarted: () => void;
}

const ContactPage: React.FC<ContactPageProps> = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-display">
            Get in <span className="text-blue-600">Touch</span>
          </h1>
          <p className="text-xl text-slate-600">
            Have questions about Proforma? We're here to help. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Email Us</p>
                    <a href="mailto:liyusoftwaresolutions@gmail.com" className="text-lg font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                      liyusoftwaresolutions@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Live Chat</p>
                    <p className="text-lg font-semibold text-slate-800">
                      Available Mon-Fri, 9am-5pm
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Location</p>
                    <p className="text-lg font-semibold text-slate-800">
                      Addis Ababa, Ethiopia
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="font-semibold text-slate-800 mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  {['Twitter', 'LinkedIn', 'Instagram', 'Facebook'].map((social) => (
                    <a key={social} href="#" className="text-slate-400 hover:text-blue-600 transition-colors text-sm font-medium">
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-10">
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                    <Send className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Message Sent!</h3>
                  <p className="text-slate-600 mb-8 max-w-md">
                    Thank you for contacting us. We've received your message and will get back to you shortly.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange as any}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value="">Select a topic</option>
                      <option value="support">Technical Support</option>
                      <option value="sales">Sales & Pricing</option>
                      <option value="feedback">Feedback & Suggestions</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
