import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  User, 
  LogOut, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  ChevronRight,
  ShieldCheck,
  Search
} from 'lucide-react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  Timestamp 
} from 'firebase/firestore';
import { auth, db } from '../firebase';

interface Booking {
  id: string;
  service: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  date: string;
  time: string;
  notes?: string;
  status: string;
  createdAt: any;
}

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: any;
}

const Admin = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'messages'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const adminEmails = ['kuteyioluwaloyevincent291@gmail.com', 'cleanandcarehub26@gmail.com'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && user.email && adminEmails.includes(user.email)) {
      // Subscribe to bookings
      const bQuery = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      const unsubscribeBookings = onSnapshot(bQuery, (snapshot) => {
        const bList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Booking[];
        setBookings(bList);
      });

      // Subscribe to messages
      const mQuery = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const unsubscribeMessages = onSnapshot(mQuery, (snapshot) => {
        const mList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Message[];
        setMessages(mList);
      });

      return () => {
        unsubscribeBookings();
        unsubscribeMessages();
      };
    }
  }, [user]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const formatDate = (val: any) => {
    if (!val) return 'N/A';
    const date = val instanceof Timestamp ? val.toDate() : new Date(val);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!user || !user.email || !adminEmails.includes(user.email)) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl text-center border border-slate-100"
        >
          <div className="w-20 h-20 bg-teal-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="text-brand-primary w-10 h-10" />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-4">Admin Access</h1>
          <p className="text-slate-600 mb-8">
            This area is restricted to authorized managers. Please sign in with your admin account.
          </p>
          <button 
            onClick={handleLogin}
            className="w-full bg-brand-primary text-white px-8 py-4 rounded-full font-bold hover:bg-teal-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-teal-100"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  const filteredBookings = bookings.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.phone.includes(searchTerm)
  );

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center">
              <LayoutDashboard className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-xs text-slate-500">Welcome back, {user.displayName}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-600 hover:text-red-600 font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Calendar className="text-blue-600 w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider text-xs">Total Bookings</p>
              <h3 className="text-2xl font-bold text-slate-900">{bookings.length}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <MessageSquare className="text-brand-primary w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider text-xs">Messages</p>
              <h3 className="text-2xl font-bold text-slate-900">{messages.length}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Clock className="text-amber-600 w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider text-xs">Recent Activity</p>
              <h3 className="text-sm font-bold text-slate-900">Updated just now</h3>
            </div>
          </div>
        </div>

        {/* Filters & Tabs */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex bg-slate-100 p-1 rounded-2xl w-full md:w-auto">
              <button 
                onClick={() => setActiveTab('bookings')}
                className={`flex-1 md:w-40 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'bookings' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Bookings
              </button>
              <button 
                onClick={() => setActiveTab('messages')}
                className={`flex-1 md:w-40 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'messages' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Messages
              </button>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-primary text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'bookings' ? (
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Date/Time</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Created</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center font-bold">
                            {booking.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{booking.name}</p>
                            <p className="text-xs text-slate-500">{booking.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="px-3 py-1 bg-teal-50 text-brand-primary rounded-full text-xs font-bold ring-1 ring-teal-100">
                          {booking.service}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-sm font-medium text-slate-700">{booking.date}</div>
                        <div className="text-xs text-slate-500">{booking.time}</div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700 ring-1 ring-green-200' : 
                          'bg-amber-100 text-amber-700 ring-1 ring-amber-200'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-sm text-slate-500">
                        {formatDate(booking.createdAt)}
                      </td>
                      <td className="px-6 py-6">
                        <button 
                          onClick={() => {
                            const msg = encodeURIComponent(`*Update for Booking:* ${booking.service}%0A*Customer:* ${booking.name}%0A*Status:* Requesting confirmation...`);
                            window.open(`https://wa.me/${booking.phone.replace(/\D/g, '')}?text=${msg}`, '_blank');
                          }}
                          className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"
                          title="Contact via WhatsApp"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredBookings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center text-slate-500">
                        No bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Sender</th>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Message</th>
                    <th className="px-6 py-4">Received</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMessages.map((msg) => (
                    <tr key={msg.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-6">
                        <p className="font-bold text-slate-900">{msg.name}</p>
                        <p className="text-xs text-slate-500">{msg.email}</p>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-sm font-bold text-slate-700">{msg.subject}</span>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-sm text-slate-600 line-clamp-2 max-w-xs">{msg.message}</p>
                      </td>
                      <td className="px-6 py-6 text-sm text-slate-500">
                        {formatDate(msg.createdAt)}
                      </td>
                      <td className="px-6 py-6">
                        <a 
                          href={`mailto:${msg.email}?subject=RE: ${msg.subject}`}
                          className="p-2 hover:bg-slate-200 rounded-lg transition-colors inline-block text-slate-600"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </a>
                      </td>
                    </tr>
                  ))}
                  {filteredMessages.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-slate-500">
                        No messages found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
