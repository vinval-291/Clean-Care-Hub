import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, CheckCircle2, Clock, MessageSquare, Users } from 'lucide-react';

const valueProps = [
  {
    title: "Vetted Professionals",
    description: "Every worker is properly screened, background-checked, and verified for your peace of mind.",
    icon: <ShieldCheck className="w-8 h-8 text-brand-primary" />
  },
  {
    title: "Reliable Delivery",
    description: "We pride ourselves on consistent, high-quality service that you can depend on every time.",
    icon: <CheckCircle2 className="w-8 h-8 text-brand-primary" />
  },
  {
    title: "Transparent Pricing",
    description: "No hidden fees. Our clear pricing structure ensures you know exactly what you're paying for.",
    icon: <Clock className="w-8 h-8 text-brand-primary" />
  },
  {
    title: "Easy Digital Booking",
    description: "Book instantly via our platform or WhatsApp for ultimate convenience.",
    icon: <MessageSquare className="w-8 h-8 text-brand-primary" />
  }
];

const About = () => {
  return (
    <div className="pt-20">
      {/* About Hero */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-3">About Clean & Care Hub</h2>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6">Your Trusted Partner in Home Support</h1>
              <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                Clean & Care Hub is a domestic service coordination company designed to connect households with trusted and professional home service providers. 
                Our platform focuses on providing reliable access to cleaning, cooking, babysitting, and other home assistance services.
              </p>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                    <Users className="text-white w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Our Mission</h4>
                </div>
                <p className="text-slate-600 leading-relaxed italic">
                  "To provide convenient access to trustworthy domestic services by connecting clients with trained, vetted, and dependable service providers while maintaining high standards of customer satisfaction and safety."
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=1000" 
                alt="Our Team" 
                className="rounded-[3rem] shadow-2xl w-full h-[500px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-accent/20 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000" 
                  alt="Home Care" 
                  className="rounded-[3rem] shadow-xl w-full h-[400px] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -top-6 -left-6 bg-brand-primary text-white p-8 rounded-3xl shadow-lg hidden md:block">
                  <div className="text-4xl font-display font-bold mb-1">5+</div>
                  <div className="text-sm font-medium opacity-80">Years of Excellence</div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-3">Our Story</h2>
              <h3 className="text-4xl font-display font-bold text-slate-900 mb-6">Born from a Need for Trust</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Clean & Care Hub was founded when we realized how difficult it was for busy professionals and families to find reliable, trustworthy domestic help. We saw a gap in the market for a service that didn't just provide workers, but provided *verified* and *coordinated* care.
              </p>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Today, we are more than just a cleaning company. We are a coordination hub that ensures safety, quality, and professionalism in every home we enter. Our rigorous vetting process is at the heart of everything we do.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">1,200+</div>
                  <div className="text-sm text-slate-500">Service Hours/Month</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">150+</div>
                  <div className="text-sm text-slate-500">Vetted Professionals</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process - Timeline */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-teal-400 uppercase tracking-widest mb-3">Our Process</h2>
            <h3 className="text-4xl font-display font-bold mb-4">How We Ensure Quality</h3>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
            
            {[
              { title: "Recruitment", desc: "We source experienced professionals with proven track records in domestic care." },
              { title: "Vetting", desc: "Rigorous background checks, identity verification, and reference calls." },
              { title: "Training", desc: "Specialized training in professional standards, safety, and customer service." },
              { title: "Deployment", desc: "Matching the right professional with your specific household needs." }
            ].map((step, i) => (
              <div key={i} className="relative z-10 bg-slate-900 p-6">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center font-bold text-xl mb-6 mx-auto md:mx-0">
                  {i + 1}
                </div>
                <h4 className="text-xl font-bold mb-3 text-center md:text-left">{step.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed text-center md:text-left">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-3">Our Values</h2>
            <h3 className="text-4xl font-display font-bold text-slate-900 mb-4">The Clean & Care Difference</h3>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col gap-4 p-6 rounded-3xl border border-slate-100 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-brand-secondary rounded-xl flex items-center justify-center">
                  {prop.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">{prop.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{prop.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
