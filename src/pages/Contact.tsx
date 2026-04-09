import React from 'react';
import { motion } from 'motion/react';
import { Phone, MessageSquare, Mail, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const whatsappNumber = "+2348146856984";
  const defaultMessage = encodeURIComponent("Hello Clean & Care Hub, I'm interested in booking a service. Could you please provide more information?");
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\s+/g, '')}?text=${defaultMessage}`;

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-booking-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingData: {
            service: formData.subject,
            date: 'N/A (Contact Form)',
            time: 'N/A (Contact Form)',
            fullName: formData.name,
            phone: `Email: ${formData.email}`,
            address: 'N/A (Contact Form)',
            notes: formData.message,
            id: `contact-${Date.now()}`
          }
        }),
      });

      if (response.ok) {
        alert("Thank you for your message! We'll get back to you shortly.");
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending contact message:', error);
      alert("Something went wrong. Please try again or contact us via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-3">Get In Touch</h2>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-4">We're Here to Help</h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Have questions about our services or need a custom quote? Reach out to us through any of these channels.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div className="p-8 rounded-3xl bg-brand-secondary border border-teal-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:text-brand-primary transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">WhatsApp</p>
                      <p className="text-sm text-slate-500">+234 814 685 6984</p>
                    </div>
                  </a>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Email</p>
                      <p className="text-sm text-slate-500">cleanandcarehub26@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Location</p>
                      <p className="text-sm text-slate-500">Lagos, Nigeria</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-slate-900 text-white">
                <h3 className="text-xl font-bold mb-4">Business Hours</h3>
                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span>Mon - Fri</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="p-8 lg:p-12 rounded-[3rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-primary transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-primary transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-900 mb-2">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-primary transition-colors"
                    placeholder="How can we help?"
                  />
                </div>
                <div className="mb-8">
                  <label className="block text-sm font-bold text-slate-900 mb-2">Message</label>
                  <textarea 
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-primary transition-colors resize-none"
                    placeholder="Tell us more about your needs..."
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-primary text-white py-5 rounded-full font-bold text-lg hover:bg-teal-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Visit & Connect */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-2xl font-display font-bold text-slate-900 mb-6">Our Location</h3>
              <div className="aspect-video bg-slate-100 rounded-3xl mb-8 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=1000" 
                  alt="Map Placeholder" 
                  className="w-full h-full object-cover opacity-50 grayscale"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center">
                      <MapPin className="text-white w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-slate-900">Lagos, Nigeria</div>
                  </div>
                </div>
              </div>
              <p className="text-slate-600">
                While we primarily operate as a coordination hub serving various locations across Lagos, our central office handles all vetting and administration.
              </p>
            </div>

            <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-display font-bold mb-6">Connect With Us</h3>
                <p className="text-slate-400 mb-8">
                  Follow us on social media for home care tips, service updates, and special offers.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'Instagram', handle: '@cleancarehub' },
                    { name: 'Facebook', handle: 'Clean & Care Hub' },
                    { name: 'Twitter', handle: '@cleancarehub' },
                    { name: 'LinkedIn', handle: 'Clean & Care Hub' }
                  ].map((social, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                      <div className="text-xs text-slate-500 mb-1">{social.name}</div>
                      <div className="font-bold text-sm">{social.handle}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-12 p-6 rounded-2xl bg-brand-primary/20 border border-brand-primary/30">
                <p className="text-sm text-teal-100">
                  <span className="font-bold text-white">Pro Tip:</span> Booking via WhatsApp is 3x faster for urgent requests!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
