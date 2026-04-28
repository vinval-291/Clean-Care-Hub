import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, User, Phone, CheckCircle2, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const Booking = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    service: '',
    email: '',
    date: '',
    time: '',
    address: '',
    name: '',
    phone: '',
    notes: ''
  });

  const services = [
    "Home Cleaning",
    "Office Cleaning",
    "Deep Cleaning",
    "Cooking & Meal Prep",
    "Babysitting & Childcare",
    "Laundry & Ironing"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const path = 'bookings';
    try {
      // 1. Save to Firestore
      const docRef = await addDoc(collection(db, path), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // 2. Send Email via Backend
      try {
        await fetch('/api/send-booking-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingData: {
              ...formData,
              fullName: formData.name, // Mapping 'name' to 'fullName' for the backend
              id: docRef.id
            }
          }),
        });
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // We don't block the user if the email fails, as Firestore and WhatsApp are primary
      }

      // 3. Prepare WhatsApp Message
      const whatsappNumber = "+2348146856984";
      const message = `*New Booking Request*%0A%0A` +
        `*Service:* ${formData.service}%0A` +
        `*Date:* ${formData.date}%0A` +
        `*Time:* ${formData.time}%0A%0A` +
        `*Customer Details:*%0A` +
        `*Name:* ${formData.name}%0A` +
        `*Email:* ${formData.email}%0A` +
        `*Phone:* ${formData.phone}%0A` +
        `*Address:* ${formData.address}%0A%0A` +
        `*Notes:* ${formData.notes || 'None'}%0A%0A` +
        `*Booking ID:* ${docRef.id}`;
      
      const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\+/g, '')}?text=${message}`;

      // 3. Move to success step
      setStep(4);
      
      // 4. Optionally open WhatsApp (delayed slightly for UX)
      // We'll let the user click the button in Step 4 for a smoother transition
      // but we can also auto-redirect if they prefer.
      // setTimeout(() => {
      //   window.open(whatsappLink, '_blank');
      // }, 1500);

    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Book Your Service</h1>
            <p className="text-slate-600">Complete the form below to schedule your professional home care.</p>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-12 px-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                  step >= i ? 'bg-brand-primary text-white' : 'bg-white text-slate-400 border border-slate-200'
                }`}>
                  {step > i ? <CheckCircle2 className="w-6 h-6" /> : i}
                </div>
                {i < 3 && (
                  <div className={`flex-1 h-1 mx-4 rounded-full transition-colors ${
                    step > i ? 'bg-brand-primary' : 'bg-slate-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-teal-50 rounded-[2rem] border border-teal-100">
              <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-10 h-10 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-slate-900 mb-1">Fast Track Booking</h3>
                <p className="text-slate-600 mb-4 md:mb-0">Get notified 3X faster! Chat directly with our managers for instant scheduling.</p>
              </div>
              <button 
                type="button"
                onClick={() => {
                  const whatsappNumber = "+2348146856984";
                  const message = encodeURIComponent("Hello Clean & Care Hub, I'd like to book a service via WhatsApp for faster notification.");
                  window.open(`https://wa.me/${whatsappNumber.replace(/\+/g, '')}?text=${message}`, '_blank');
                }}
                className="bg-brand-primary text-white px-8 py-4 rounded-full font-bold hover:bg-teal-800 transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-teal-200"
              >
                Book via WhatsApp
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Select Service & Schedule</h2>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Service Type</label>
                    <select 
                      name="service"
                      required
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-primary appearance-none bg-white"
                    >
                      <option value="">Choose a service...</option>
                      {services.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">Preferred Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                          type="date" 
                          name="date"
                          required
                          value={formData.date}
                          onChange={handleInputChange}
                          className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">Preferred Time</label>
                      <div className="relative">
                        <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                          type="time" 
                          name="time"
                          required
                          value={formData.time}
                          onChange={handleInputChange}
                          className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-primary"
                        />
                      </div>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.service || !formData.date || !formData.time}
                    className="w-full bg-brand-primary text-white py-5 rounded-full font-bold text-lg hover:bg-teal-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Location Details</h2>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Service Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-6 top-6 text-slate-400 w-5 h-5" />
                      <textarea 
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-primary resize-none"
                        placeholder="Enter your full address..."
                      ></textarea>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-slate-100 text-slate-900 py-5 rounded-full font-bold text-lg hover:bg-slate-200 transition-all"
                    >
                      Back
                    </button>
                    <button 
                      type="button"
                      onClick={nextStep}
                      disabled={!formData.address}
                      className="flex-[2] bg-brand-primary text-white py-5 rounded-full font-bold text-lg hover:bg-teal-800 transition-all disabled:opacity-50"
                    >
                      Next Step
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Personal Information</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                          type="text" 
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-primary"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">Email Address</label>
                      <div className="relative">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                          type="email" 
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-primary"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                          type="tel" 
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-primary"
                          placeholder="+234..."
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Additional Notes (Optional)</label>
                    <textarea 
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-primary resize-none"
                      placeholder="Any special instructions?"
                    ></textarea>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-slate-100 text-slate-900 py-5 rounded-full font-bold text-lg hover:bg-slate-200 transition-all"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      disabled={!formData.name || !formData.phone || isSubmitting}
                      className="flex-[2] bg-brand-primary text-white py-5 rounded-full font-bold text-lg hover:bg-teal-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Confirm Booking'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="text-teal-600 w-12 h-12" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Booking Saved!</h2>
                  <p className="text-slate-600 mb-8">
                    Thank you, {formData.name}. Your details have been saved to our database. 
                    To get notified 3X faster, click the button below to send your booking summary to our managers via WhatsApp.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                      type="button"
                      onClick={() => {
                        const whatsappNumber = "+2348146856984";
                        const message = `*New Booking Request*%0A%0A` +
                          `*Service:* ${formData.service}%0A` +
                          `*Date:* ${formData.date}%0A` +
                          `*Time:* ${formData.time}%0A%0A` +
                          `*Customer Details:*%0A` +
                          `*Name:* ${formData.name}%0A` +
                          `*Email:* ${formData.email}%0A` +
                          `*Phone:* ${formData.phone}%0A` +
                          `*Address:* ${formData.address}%0A%0A` +
                          `*Notes:* ${formData.notes || 'None'}`;
                        window.open(`https://wa.me/${whatsappNumber.replace(/\+/g, '')}?text=${message}`, '_blank');
                      }}
                      className="w-full sm:w-auto bg-brand-primary text-white px-8 py-4 rounded-full font-bold hover:bg-teal-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-100"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Complete on WhatsApp
                    </button>
                    <button 
                      type="button"
                      onClick={() => window.location.href = '/'}
                      className="w-full sm:w-auto bg-slate-100 text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-slate-200 transition-all"
                    >
                      Return Home
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;
