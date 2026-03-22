import React from 'react';
import { motion } from 'motion/react';
import { Home, Sparkles, Utensils, Baby, Shirt, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    title: "Home & Office Cleaning",
    description: "Professional cleaning for your living or workspaces, ensuring a pristine environment.",
    icon: <Home className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Deep Cleaning",
    description: "Thorough, detailed cleaning for those hard-to-reach places and seasonal refreshes.",
    icon: <Sparkles className="w-6 h-6" />,
    color: "bg-teal-50 text-teal-600"
  },
  {
    title: "Cooking & Meal Prep",
    description: "Nutritious and delicious meal preparation tailored to your dietary preferences.",
    icon: <Utensils className="w-6 h-6" />,
    color: "bg-orange-50 text-orange-600"
  },
  {
    title: "Babysitting & Childcare",
    description: "Trusted, vetted support for your little ones when you need a helping hand.",
    icon: <Baby className="w-6 h-6" />,
    color: "bg-purple-50 text-purple-600"
  },
  {
    title: "Laundry & Ironing",
    description: "Expert care for your garments, from washing to perfectly pressed finishes.",
    icon: <Shirt className="w-6 h-6" />,
    color: "bg-pink-50 text-pink-600"
  }
];

const Services = () => {
  return (
    <div className="pt-20">
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-3">Our Core Services</h2>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-4">Comprehensive Care for Your Home</h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              We provide a structured, professional, and secure system that ensures quality service delivery across all domestic needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 rounded-3xl border border-slate-100 bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-6`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {service.description}
                </p>
                <Link 
                  to="/booking"
                  className="text-brand-primary font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all"
                >
                  Book This Service <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
            
            {/* Special CTA Card */}
            <div className="p-8 rounded-3xl bg-brand-primary text-white flex flex-col justify-center items-center text-center">
              <h3 className="text-2xl font-bold mb-4">Need a Custom Package?</h3>
              <p className="text-teal-100 mb-8">We tailor our services to fit your unique household requirements.</p>
              <Link 
                to="/contact"
                className="bg-white text-brand-primary px-6 py-3 rounded-full font-bold hover:bg-teal-50 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-3">Transparent Pricing</h2>
            <h3 className="text-4xl font-display font-bold text-slate-900 mb-4">Service Packages</h3>
            <p className="text-slate-600 max-w-2xl mx-auto">Choose a plan that fits your household needs. All plans include our rigorous vetting and coordination.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: "Basic Care", 
                price: "Custom", 
                desc: "Ideal for occasional cleaning or one-off tasks.",
                features: ["Standard Cleaning", "Vetted Professional", "WhatsApp Support", "Flexible Scheduling"]
              },
              { 
                name: "Premium Home", 
                price: "Custom", 
                desc: "Our most popular choice for busy families.",
                features: ["Deep Cleaning", "Childcare Support", "Priority Booking", "Dedicated Coordinator", "Monthly Reports"],
                popular: true
              },
              { 
                name: "Corporate/Office", 
                price: "Custom", 
                desc: "Tailored solutions for professional spaces.",
                features: ["Office Sanitization", "After-hours Service", "Recurring Schedule", "Insurance Coverage", "Service Level Agreement"]
              }
            ].map((plan, i) => (
              <div key={i} className={`p-10 rounded-[3rem] bg-white border ${plan.popular ? 'border-brand-primary shadow-xl ring-4 ring-teal-50' : 'border-slate-100 shadow-sm'} relative`}>
                {plan.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>}
                <h4 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h4>
                <div className="text-4xl font-display font-bold text-brand-primary mb-4">{plan.price}</div>
                <p className="text-slate-500 text-sm mb-8">{plan.desc}</p>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-slate-700 text-sm">
                      <div className="w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-brand-primary" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/booking" 
                  className={`w-full py-4 rounded-full font-bold text-center block transition-all ${plan.popular ? 'bg-brand-primary text-white hover:bg-teal-600' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
                >
                  Get a Quote
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-3">Common Questions</h2>
            <h3 className="text-4xl font-display font-bold text-slate-900 mb-4">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-6">
            {[
              { q: "How do you vet your professionals?", a: "Our vetting process includes identity verification, criminal background checks, skill assessments, and thorough reference checks from previous employers." },
              { q: "Can I request the same person every time?", a: "Yes, for recurring services, we strive to assign the same professional to your home to ensure consistency and build trust." },
              { q: "What if I'm not satisfied with the service?", a: "Customer satisfaction is our priority. If you're not happy with a service, contact us within 24 hours and we will address the issue, which may include a re-clean at no extra cost." },
              { q: "Are your services insured?", a: "We maintain professional liability coverage for all our coordinated services to provide extra peace of mind for our clients." }
            ].map((faq, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
                <h4 className="text-lg font-bold text-slate-900 mb-3">{faq.q}</h4>
                <p className="text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
