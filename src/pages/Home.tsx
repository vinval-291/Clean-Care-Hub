import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Star, Phone, ShieldCheck, Sparkles, Mail } from 'lucide-react';

const Home = () => {
  const adminEmail = "Cleanandcarehub26@gmail.com";
  const emailLink = `mailto:${adminEmail}`;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-secondary py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold uppercase tracking-wider mb-6">
                <Star className="w-3 h-3 fill-current" />
                Trusted Home Service Coordination
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 leading-[1.1] mb-6">
                Your Home, <br />
                <span className="text-brand-primary italic">Our Care.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                Connecting households with trusted, professional domestic service providers. 
                From cleaning to childcare, we ensure your home runs smoothly and safely.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/booking"
                  className="bg-brand-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-800 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-teal-900/20"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href={emailLink}
                  className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Email Booking
                </a>
              </div>
              
              <div className="mt-12 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                      <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <div className="text-sm text-slate-500">
                  <span className="font-bold text-slate-900">500+</span> happy families served
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] lg:aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1000" 
                  alt="Professional Cleaning Service" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              
              {/* Floating Card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-xs hidden sm:block"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <ShieldCheck className="text-teal-600 w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Verified Staff</div>
                    <div className="text-xs text-slate-500">100% Background Checked</div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  "The peace of mind knowing my home is in safe hands is priceless."
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-teal-50/50 -skew-x-12 transform translate-x-1/2"></div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-3">Simple Process</h2>
            <h3 className="text-4xl font-display font-bold text-slate-900 mb-4">How It Works</h3>
            <p className="text-slate-600 max-w-2xl mx-auto">Getting professional help for your home has never been easier. Follow these three simple steps.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Choose Service", desc: "Select from our range of domestic services including cleaning, childcare, and more." },
              { step: "02", title: "Book Instantly", desc: "Fill out our quick booking form or reach out via Email for immediate scheduling." },
              { step: "03", title: "Relax & Enjoy", desc: "Our vetted professionals handle the work while you focus on what matters most." }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="text-8xl font-display font-black text-slate-100 absolute -top-10 -left-4 group-hover:text-teal-50 transition-colors">{item.step}</div>
                <div className="relative z-10">
                  <h4 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h4>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Bento Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-brand-primary rounded-[3rem] p-12 text-white relative overflow-hidden">
              <div className="relative z-10">
                <ShieldCheck className="w-16 h-16 mb-8 text-teal-200" />
                <h3 className="text-4xl font-display font-bold mb-6">Safety & Trust First</h3>
                <p className="text-xl text-teal-50 mb-8 max-w-md">
                  We understand that your home is your sanctuary. That's why every single professional on our platform undergoes a rigorous multi-stage vetting process.
                </p>
                <ul className="space-y-4">
                  {["Background Checks", "Skill Verification", "Identity Authentication", "Reference Checks"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-teal-400/30 flex items-center justify-center">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            </div>
            
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="text-brand-primary w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Excellence in Every Task</h3>
                <p className="text-slate-600 leading-relaxed">
                  We don't just provide services; we provide excellence. Our team is trained to meet the highest standards of professional home care.
                </p>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="text-3xl font-display font-bold text-brand-primary">98%</div>
                <div className="text-sm text-slate-500 font-medium">Customer Satisfaction Rate</div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[3rem] p-10 text-white lg:col-span-3 grid md:grid-cols-3 gap-12 items-center">
              <div className="md:col-span-2">
                <h3 className="text-3xl font-display font-bold mb-4">Professional Coordination</h3>
                <p className="text-slate-400 text-lg">
                  Clean & Care Hub acts as your dedicated coordinator. We manage the schedules, handle the payments, and ensure quality control so you don't have to.
                </p>
              </div>
              <Link 
                to="/about"
                className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-center hover:bg-teal-50 transition-all"
              >
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-3">Testimonials</h2>
            <h3 className="text-4xl font-display font-bold text-slate-900 mb-4">What Our Clients Say</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Johnson", role: "Working Mother", text: "The babysitting service has been a lifesaver. Knowing my kids are with a vetted professional gives me such peace of mind." },
              { name: "David Okoro", role: "Business Owner", text: "Clean & Care Hub handles our office cleaning perfectly. They are reliable, thorough, and very professional." },
              { name: "Aisha Bello", role: "Homeowner", text: "I've tried many cleaning services, but the level of detail and coordination here is unmatched. Highly recommended!" }
            ].map((t, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 relative"
              >
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-brand-primary text-brand-primary" />)}
                </div>
                <p className="text-slate-700 mb-8 italic leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                    <img src={`https://picsum.photos/seed/t${i}/100/100`} alt={t.name} referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-brand-secondary rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Sparkles className="text-brand-primary w-10 h-10" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6">Ready to Experience <br /> Better Home Care?</h2>
          <p className="text-xl text-slate-600 mb-10">
            Join hundreds of families who trust Clean & Care Hub for their domestic needs. 
            Professional, safe, and reliable service is just a click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/booking"
              className="bg-brand-primary text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-teal-800 transition-all shadow-xl shadow-teal-900/20"
            >
              Book Your Service
            </Link>
            <Link 
              to="/services"
              className="bg-slate-50 text-slate-900 border border-slate-200 px-10 py-5 rounded-full font-bold text-xl hover:bg-slate-100 transition-all"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
