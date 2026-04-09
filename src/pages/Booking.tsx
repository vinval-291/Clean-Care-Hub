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
        `*Time:* ${formData.time}%0A` +
        `*Name:* ${formData.name}%0A` +
        `*Phone:* ${formData.phone}%0A` +
        `*Address:* ${formData.address}%0A` +
        `*Notes:* ${formData.notes || 'None'}`;
      
      const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\+/g, '')}?text=${message}`;

      // 3. Move to success step
      setStep(4);
      
      // 4. Optionally open WhatsApp (delayed slightly for UX)
      setTimeout(() => {
        window.open(whatsappLink, '_blank');
      }, 1500);

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
                  <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Booking Received!</h2>
                  <p className="text-slate-600 mb-8">
                    Thank you, {formData.name}. Your details have been saved to our database. 
                    We're opening WhatsApp to send your booking summary to our team for instant confirmation.
                  </p>
                  <button 
                    type="button"
                    onClick={() => window.location.href = '/'}
                    className="bg-brand-primary text-white px-8 py-4 rounded-full font-bold hover:bg-teal-800 transition-all"
                  >
                    Return Home
                  </button>
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
