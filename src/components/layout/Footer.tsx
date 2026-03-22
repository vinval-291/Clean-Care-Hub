import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageSquare, Star } from 'lucide-react';
import Logo from '../common/Logo';

const Footer = () => {
  const whatsappNumber = "+2348146856984";
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\s+/g, '')}`;

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Logo className="mb-6" />
            <p className="text-slate-500 mb-6 max-w-xs">
              The most trusted and reliable home service coordination brand, known for professionalism, safety, and excellence.
            </p>
            <div className="flex gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-brand-primary hover:text-brand-primary transition-all cursor-pointer">
                  <Star className="w-4 h-4" />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Services</h4>
            <ul className="space-y-4 text-slate-500">
              <li><Link to="/services" className="hover:text-brand-primary transition-colors">Home Cleaning</Link></li>
              <li><Link to="/services" className="hover:text-brand-primary transition-colors">Office Cleaning</Link></li>
              <li><Link to="/services" className="hover:text-brand-primary transition-colors">Deep Cleaning</Link></li>
              <li><Link to="/services" className="hover:text-brand-primary transition-colors">Childcare Support</Link></li>
              <li><Link to="/services" className="hover:text-brand-primary transition-colors">Meal Preparation</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Company</h4>
            <ul className="space-y-4 text-slate-500">
              <li><Link to="/about" className="hover:text-brand-primary transition-colors">About Us</Link></li>
              <li><Link to="/about" className="hover:text-brand-primary transition-colors">Our Vision</Link></li>
              <li><Link to="/contact" className="hover:text-brand-primary transition-colors">Contact</Link></li>
              <li><Link to="#" className="hover:text-brand-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Contact</h4>
            <ul className="space-y-4 text-slate-500">
              <li className="flex items-start gap-3">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-brand-primary transition-colors">
                  <Phone className="w-5 h-5 text-brand-primary shrink-0" />
                  <span>WhatsApp Booking Available</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-brand-primary shrink-0" />
                <span>cleanandcarehub26@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Clean & Care Hub. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-slate-400">
            <Link to="#" className="hover:text-slate-600">Terms of Service</Link>
            <Link to="#" className="hover:text-slate-600">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
