import { useState, useEffect, createContext, useContext } from 'react';

// All SVG icons inlined - zero cross-file imports
const I = (d, p) => <svg {...p} width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{__html: d}} />;
const sd = {
  Home:'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  Users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  Calendar:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  Settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  Bell:'<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  MessageSquare:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  TrendingUp:'<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  Clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  Phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  UserPlus:'<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>',
  Zap:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  Camera:'<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  Search:'<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  MoreHorizontal:'<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  ArrowUpRight:'<line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>',
  ArrowRight:'<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  Send:'<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  X:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  Video:'<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>',
  User:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  ChevronDown:'<polyline points="6 9 12 15 18 9"/>',
  ChevronLeft:'<polyline points="15 18 9 12 15 6"/>',
  ChevronRight:'<polyline points="9 18 15 12 9 6"/>',
  Facebook:'<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  Instagram:'<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
  Youtube:'<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/>',
  Scissors:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>',
  DollarSign:'<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  Gift:'<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',
  ArrowLeft:'<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  Check:'<polyline points="20 6 9 17 4 12"/>',
  Shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  Plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  Minus:'<line x1="5" y1="12" x2="19" y2="12"/>',
  CalendarSync:'<path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/><path d="M16 18l-4 2 4 2"/><path d="M8 18l4 2-4 2"/>',
  ShoppingCart:'<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
  CreditCard:'<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
  Lock:'<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  Wifi:'<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>',
  BellOff:'<path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><path d="M6.26 6.26A5.73 5.73 0 0 1 18 8c0 7-3 9-3 9h-6"/><path d="M18 8a3 3 0 0 0-3-3"/><line x1="1" y1="1" x2="23" y2="23"/>',
  Activity:'<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  Crown:'<path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M3 20h18"/>',
  LogOut:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  BarChart:'<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
  FileText:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  Heart:'<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  Star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  Edit:'<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  Trash:'<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  Eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  Image:'<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
  Download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  MapPin:'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  Layers:'<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
};
const Icons = {};
Object.keys(sd).forEach(k => { Icons[k] = (p) => I(sd[k], p); });

// Barbershop-themed background images (free from Unsplash)
const bgImages = [
  'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1920&q=80', // Barber shop interior
  'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1920&q=80', // Straight razor
  'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1920&q=80', // Haircut
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1920&q=80', // Fade
];

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [page, setPage] = useState(window.location.hash.slice(1) || '/');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [clientTab, setClientTab] = useState('dashboard');
  const [adminTab, setAdminTab] = useState('dashboard');

  // Shopping cart state
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [paymentState, setPaymentState] = useState({ step: null, booking: null, orderTotal: 0, receipt: null });

  // Chair availability queue
  const [chairQueue, setChairQueue] = useState([
    { id: 1, chair: 'Chair 1', barber: 'David Barber', client: 'Liam M.', service: 'Taper Cut', status: 'in-progress', eta: '12 min', phone: '+1-555-0101' },
    { id: 2, chair: 'Chair 2', barber: 'Dennis Ronan', client: 'Sarah L.', service: 'Beard Trim', status: 'in-progress', eta: '8 min', phone: '+1-555-0102' },
    { id: 3, chair: 'Chair 3', barber: 'David Rothham', client: '—', service: 'Available', status: 'available', eta: null, phone: null },
    { id: 4, chair: 'Chair 4', barber: 'David Maxim', client: 'Mike R.', service: 'Fade', status: 'in-progress', eta: '20 min', phone: '+1-555-0103' },
    { id: 5, chair: 'Chair 5', barber: 'David Smith', client: '—', service: 'Available', status: 'available', eta: null, phone: null },
  ]);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'chair-ready', title: 'Your Chair Is Ready!', message: 'Chair 3 is ready for your appointment. Please head to the shop.', time: '2m ago', read: false },
    { id: 2, type: 'payment', title: 'Payment Confirmed', message: 'Your payment of $35.00 has been processed successfully.', time: '5m ago', read: false },
    { id: 3, type: 'flash-sale', title: 'Flash Sale Active', message: '15% OFF BEARD TRIMS from 1:00 PM - 3:00 PM!', time: '15m ago', read: true },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  const appointments = [
    { id: 1, barber: 'David Barber', service: 'Taper Cut', time: '1:00 PM', client: 'Liam M.', status: 'completed', price: 35 },
    { id: 2, barber: 'Dennis Ronan', service: 'Classic Cut', time: '1:00 PM', client: 'Sarah L.', status: 'completed', price: 30 },
    { id: 3, barber: 'David Rothham', service: 'Beard Trims', time: '2:00 PM', client: 'Mike R.', status: 'completed', price: 25 },
    { id: 4, barber: 'David Barber', service: 'Fade', time: '3:00 PM', client: 'John D.', status: 'upcoming', price: 40 },
    { id: 5, barber: 'David Maxim', service: 'Pompadour', time: '4:00 PM', client: 'Chris P.', status: 'upcoming', price: 45 },
    { id: 6, barber: 'David Rothham', service: 'Buzz Cut', time: '5:00 PM', client: 'Tom H.', status: 'upcoming', price: 25 },
    { id: 7, barber: 'David Smith', service: 'Hot Towel Shave', time: '6:00 PM', client: 'Steve W.', status: 'upcoming', price: 30 },
    { id: 8, barber: 'David Barber', service: 'Line Up', time: '7:00 PM', client: 'Bob M.', status: 'upcoming', price: 20 },
  ];

  const customerHistory = [
    { id: 1, service: 'Taper Cut', barber: 'David Barber', date: '2026-03-28', price: 35, tip: 10 },
    { id: 2, service: 'Beard Trim', barber: 'Dennis Ronan', date: '2026-03-14', price: 25, tip: 5 },
    { id: 3, service: 'Classic Cut', barber: 'David Barber', date: '2026-02-28', price: 30, tip: 8 },
    { id: 4, service: 'Fade', barber: 'David Maxim', date: '2026-02-14', price: 40, tip: 10 },
    { id: 5, service: 'Hot Towel Shave', barber: 'David Smith', date: '2026-01-30', price: 30, tip: 7 },
  ];

  const customers = [
    { id: 1, name: 'Liam M.', phone: '+1-555-0101', visits: 14, services: 22, spent: 1450, saved: 210, elite: true, lastVisit: '2026-03-28' },
    { id: 2, name: 'Sarah L.', phone: '+1-555-0102', visits: 8, services: 12, spent: 890, saved: 120, elite: false, lastVisit: '2026-03-25' },
    { id: 3, name: 'Mike R.', phone: '+1-555-0103', visits: 22, services: 35, spent: 2100, saved: 340, elite: true, lastVisit: '2026-03-20' },
    { id: 4, name: 'John D.', phone: '+1-555-0104', visits: 5, services: 8, spent: 420, saved: 60, elite: false, lastVisit: '2026-03-18' },
    { id: 5, name: 'Chris P.', phone: '+1-555-0105', visits: 3, services: 5, spent: 250, saved: 30, elite: false, lastVisit: '2026-03-15' },
    { id: 6, name: 'Tom H.', phone: '+1-555-0106', visits: 12, services: 18, spent: 980, saved: 150, elite: true, lastVisit: '2026-03-10' },
  ];

  const barbers = [
    { id: 1, name: 'David Barber', skills: ['Fade', 'Taper', 'Classic Cut'], capacity: 8, rating: 4.9, clientsToday: 6, revenue: 850 },
    { id: 2, name: 'Dennis Ronan', skills: ['Beard Trim', 'Hot Towel', 'Line Up'], capacity: 6, rating: 4.7, clientsToday: 4, revenue: 620 },
    { id: 3, name: 'David Rothham', skills: ['Buzz Cut', 'Line Up', 'Fade'], capacity: 7, rating: 4.8, clientsToday: 5, revenue: 710 },
    { id: 4, name: 'David Maxim', skills: ['Modern Styles', 'Textured Crop', 'Pompadour'], capacity: 8, rating: 4.6, clientsToday: 3, revenue: 540 },
    { id: 5, name: 'David Smith', skills: ['Classic Cut', 'Pompadour', 'Hot Towel'], capacity: 6, rating: 4.8, clientsToday: 4, revenue: 680 },
  ];

  const flashSale = { active: true, title: '15% OFF BEARD TRIMS!', time: '1:00 PM - 3:00 PM', spotsLeft: 3 };
  const revenue = { daily: 2150, weekly: [180, 210, 190, 250, 160, 180, 140, 100], hours: ['10P','12PM','2PM','4PM','6PM','8PM','10PM'], monthly: [4200, 3800, 5100, 4600, 3900, 4800, 5200, 4100, 3700, 4500, 5000, 4300] };

  // Cart functions
  const addToCart = (item) => setCart(prev => [...prev, { ...item, cartId: Date.now() + Math.random() }]);
  const removeFromCart = (cartId) => setCart(prev => prev.filter(i => i.cartId !== cartId));
  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const cartCount = cart.length;

  // Chair queue functions
  const joinChairQueue = (clientData) => {
    const availableChair = chairQueue.find(c => c.status === 'available');
    if (!availableChair) return null;
    const newEntry = { id: Date.now(), chair: availableChair.chair, barber: availableChair.barber, client: clientData.name, service: clientData.service, status: 'waiting', eta: '~15 min', phone: clientData.phone };
    setChairQueue(prev => prev.map(c => c.id === availableChair.id ? { ...c, ...newEntry } : c));
    setTimeout(() => {
      setChairQueue(prev => prev.map(c => c.id === newEntry.id ? { ...c, status: 'ready', eta: 'NOW' } : c));
      setNotifications(prev => [{ id: Date.now(), type: 'chair-ready', title: 'Your Chair Is Ready!', message: `${availableChair.chair} is ready for ${clientData.service}. Please head to the shop.`, time: 'Just now', read: false }, ...prev]);
    }, 10000);
    return newEntry;
  };

  const notifyPhone = (phone, message) => {
    setNotifications(prev => [{ id: Date.now(), type: 'sms', title: `SMS to ${phone}`, message, time: 'Just now', read: false }, ...prev]);
  };

  // Payment functions
  const startBookingPayment = (booking) => setPaymentState({ step: 'payment', booking, orderTotal: booking.price, receipt: null });
  const startCartPayment = () => setPaymentState({ step: 'payment', booking: null, orderTotal: cartTotal, receipt: null });
  const completePayment = (details) => {
    const receipt = { id: `TXN-${Date.now().toString(36).toUpperCase()}`, date: new Date().toLocaleString(), items: paymentState.booking ? [{ name: paymentState.booking.service, price: paymentState.booking.price }] : [...cart], total: paymentState.orderTotal, method: details.method, last4: details.last4 };
    setPaymentState(prev => ({ ...prev, step: 'receipt', receipt }));
    clearCart();
    return receipt;
  };
  const closePayment = () => setPaymentState({ step: null, booking: null, orderTotal: 0, receipt: null });

  const markNotificationRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const unreadCount = notifications.filter(n => !n.read).length;

  const navigate = (path) => { window.location.hash = path; setPage(path); };
  const login = (user, admin = false) => { setCurrentUser(user); setIsAdmin(admin); };
  const logout = () => { setCurrentUser(null); setIsAdmin(false); navigate('/'); };

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash.slice(1) || '/';
      setPage(hash);
      // Auto-set tab based on URL
      if (hash.startsWith('/client/')) setClientTab(hash.split('/')[2] || 'dashboard');
      if (hash.startsWith('/admin/')) setAdminTab(hash.split('/')[2] || 'dashboard');
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <AppContext.Provider value={{
      page, navigate, currentUser, isAdmin, clientTab, adminTab, setClientTab, setAdminTab,
      appointments, customers, barbers, customerHistory, flashSale, revenue, bgImages,
      login, logout, Icons,
      cart, setCart, addToCart, removeFromCart, clearCart, cartTotal, cartCount,
      showCart, setShowCart,
      paymentState, setPaymentState, startBookingPayment, startCartPayment, completePayment, closePayment,
      chairQueue, setChairQueue, joinChairQueue, notifyPhone,
      notifications, setNotifications, showNotifications, setShowNotifications, markNotificationRead, markAllRead, unreadCount,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
