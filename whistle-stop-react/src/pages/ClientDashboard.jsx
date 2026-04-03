import { useState } from 'react';
import { useApp } from '../context/AppContext';
import BackgroundScene from '../components/BackgroundScene';
import { ShoppingCart, PaymentModal } from '../components/ShoppingCart';
import ChairAvailabilityQueue from '../components/ChairAvailabilityQueue';
import PaymentInline from '../components/PaymentInline';

const hairStyles = [
  { name: 'Classic Fade', url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=300&q=80' },
  { name: 'Textured Crop', url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300&q=80' },
  { name: 'Pompadour', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&q=80' },
  { name: 'Beard & Fade', url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=300&q=80' },
  { name: 'Modern Mullet', url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=300&q=80' },
  { name: 'Buzz Cut', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
  { name: 'Slick Back', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80' },
  { name: 'Side Part', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80' },
];
const products = [
  { name: 'Cornated Pomades', price: 24.99, desc: 'Strong hold, matte finish' },
  { name: 'Pomades Oils', price: 19.99, desc: 'Natural shine & conditioning' },
  { name: 'Pomwdeo Oils', price: 29.99, desc: 'Premium argan blend' },
  { name: 'Hair Clay', price: 22.99, desc: 'Textured, low shine' },
  { name: 'Beard Oil', price: 18.99, desc: 'Softens & moisturizes' },
  { name: 'Wax Pomade', price: 26.99, desc: 'All-day hold' },
];
const timeSlots = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'];

function ClientDashboard() {
  const { currentUser, navigate, logout, Icons, customerHistory, appointments, bgImages,
    cartCount, setShowCart, cart, addToCart, clearCart, cartTotal,
    startBookingPayment, paymentState, closePayment, completePayment,
    chairQueue, joinChairQueue, notifyPhone,
    notifications, setShowNotifications, showNotifications, markNotificationRead, markAllRead, unreadCount,
  } = useApp();
  const { setClientTab, clientTab } = useApp();
  const [chatMessages, setChatMessages] = useState([{ from: 'bot', text: 'Hello! I\'m your Whistle Stop assistant. How can I help you today?' }]);
  const [chatInput, setChatInput] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [profile, setProfile] = useState({ name: currentUser?.name || '', phone: currentUser?.phone || '', email: '', birthday: '', notes: '' });
  const [bookingPayment, setBookingPayment] = useState(null);

  const first = currentUser?.name?.split(' ')[0] || 'ALEX';

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { from: 'user', text: chatInput }]);
    setChatInput('');
    setTimeout(() => setChatMessages(prev => [...prev, { from: 'bot', text: 'Thanks! Our team will get back to you shortly.' }]), 800);
  };

  const bookAppointment = (slot) => {
    const booking = { time: slot, date: selectedDate.toLocaleDateString(), barber: 'David Barber', service: selectedStyle?.name || 'Taper Cut', price: 35 };
    setBookingPayment(booking);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'Home' },
    { id: 'book', label: 'Book', icon: 'Calendar' },
    { id: 'history', label: 'History', icon: 'FileText' },
    { id: 'shop', label: 'Shop', icon: 'ShoppingCart' },
    { id: 'styles', label: 'Styles', icon: 'Scissors' },
    { id: 'rewards', label: 'Rewards', icon: 'Crown' },
    { id: 'support', label: 'Support', icon: 'MessageSquare' },
    { id: 'settings', label: 'Settings', icon: 'Settings' },
  ];

  return (
    <div className="min-h-screen relative">
      <BackgroundScene bgImages={bgImages} />
      <div className="relative z-10">
      {/* Header */}
      <header className="bg-whistle-charcoal/80 backdrop-blur-xl border-b border-white/10 px-4 md:px-6 py-3 md:py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-gray-400 hover:text-whistle-white"><Icons.Home className="w-4 h-4 md:w-5 md:h-5" /></button>
            <h1 className="font-display text-base md:text-lg font-bold">THE WHISTLE STOP</h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            {/* Notifications */}
            <button onClick={() => setShowNotifications(!showNotifications)} className="text-gray-400 hover:text-whistle-white relative">
              <Icons.Bell className="w-4 h-4 md:w-5 md:h-5" />
              {unreadCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-whistle-crimson rounded-full text-[9px] flex items-center justify-center font-bold animate-pulse">{unreadCount}</span>}
            </button>
            {/* Cart */}
            <button onClick={() => setShowCart(true)} className="text-gray-400 hover:text-whistle-white relative">
              <Icons.ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
              {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-whistle-crimson rounded-full text-[9px] flex items-center justify-center font-bold">{cartCount}</span>}
            </button>
            <span className="text-xs md:text-sm text-gray-400 hidden sm:block">Welcome, <span className="text-whistle-white font-semibold">{first}</span></span>
            <button onClick={logout} className="text-xs text-whistle-crimson hover:text-whistle-white flex items-center gap-1"><Icons.LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" /><span className="hidden sm:inline">Logout</span></button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 pb-20 md:pb-6">
        {/* Tab Navigation - scrollable pills on desktop, hidden on mobile (bottom bar instead) */}
        <div className="hidden md:flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => {
            const TabIcon = Icons[tab.icon];
            return (
              <button key={tab.id} onClick={() => setClientTab(tab.id)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${clientTab === tab.id ? 'bg-whistle-crimson text-whistle-white shadow-lg shadow-whistle-crimson/30' : 'bg-whistle-grey/50 text-gray-400 hover:text-whistle-white hover:bg-whistle-grey'}`}>
                <TabIcon className="w-4 h-4" />{tab.label}
              </button>
            );
          })}
        </div>
        {/* Mobile bottom tab bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-whistle-charcoal/80 backdrop-blur-xl border-t border-white/10 px-1 py-1 flex items-center justify-around safe-area-bottom">
          {tabs.map(tab => {
            const MobileIcon = Icons[tab.icon];
            return (
              <button key={tab.id} onClick={() => setClientTab(tab.id)} className={`flex flex-col items-center gap-0.5 px-1.5 py-1.5 rounded-lg transition-colors min-w-0 flex-1 ${clientTab === tab.id ? 'text-whistle-crimson' : 'text-gray-500'}`}>
                <MobileIcon className="w-5 h-5" />
                <span className="text-[9px] truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ===== DASHBOARD TAB ===== */}
        {clientTab === 'dashboard' && (
          <>
            <div className="mb-8">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">WELCOME, <span className="text-whistle-crimson">{first}!</span></h2>
              <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2"><Icons.Clock className="w-4 h-4" /> VISITS: 14</span>
                <span className="flex items-center gap-2"><Icons.Scissors className="w-4 h-4" /> SERVICES: 22</span>
                <span className="flex items-center gap-2"><Icons.DollarSign className="w-4 h-4" /> TOTAL SPENT: $1,450.00</span>
                <span className="flex items-center gap-2 text-whistle-crimson">SAVED: $210.00</span>
              </div>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Appointment Scheduler */}
                <div className="glass-card p-6">
                  <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2"><Icons.Calendar className="w-5 h-5 text-whistle-crimson" /> APPOINTMENT SCHEDULER</h3>
                  <div className="flex items-center justify-between mb-4">
                    <button className="text-gray-400 hover:text-whistle-white"><Icons.ChevronLeft className="w-5 h-5" /></button>
                    <span className="font-medium">{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    <button className="text-gray-400 hover:text-whistle-white"><Icons.ChevronRight className="w-5 h-5" /></button>
                  </div>
                  <div className="text-center mb-4"><span className="text-whistle-crimson font-semibold">Today</span></div>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button key={slot} onClick={() => bookAppointment(slot)} className="py-3 px-4 bg-whistle-grey/50 hover:bg-whistle-crimson text-sm font-medium rounded transition-colors">{slot}</button>
                    ))}
                  </div>
                  <button onClick={() => bookAppointment('1:00 PM')} className="w-full mt-4 bg-whistle-crimson text-whistle-white font-bold py-3 rounded hover:bg-whistle-red transition-colors">AVAILABLE TIME</button>
                </div>
                {/* Hair Styling Menu */}
                <div className="glass-card p-6">
                  <h3 className="font-display text-lg font-bold mb-4">HAIR STYLING MENU</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {hairStyles.map((s) => (
                      <div key={s.name} onClick={() => setSelectedStyle(s)} className={`group relative overflow-hidden rounded-lg cursor-pointer ${selectedStyle?.name === s.name ? 'ring-2 ring-whistle-crimson' : ''}`}>
                        <img src={s.url} alt={s.name} className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300" onError={(e) => { e.target.style.background = '#2a2a2a'; e.target.style.display = 'block'; }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-whistle-black/80 to-transparent flex items-end"><span className="text-xs font-medium p-2">{s.name}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                {/* Rewards */}
                <div className="glass-card p-6">
                  <h3 className="font-display text-base font-bold mb-4 flex items-center gap-2"><Icons.Gift className="w-5 h-5 text-whistle-crimson" /> REWARDS PROGRAM</h3>
                  <div className="text-xl font-bold mb-2">100 / 150 <span className="text-sm text-gray-400 font-normal">POINTS TO NEXT REWARD</span></div>
                  <div className="w-full bg-whistle-grey rounded-full h-3 overflow-hidden mb-2"><div className="bg-gradient-to-r from-whistle-crimson to-whistle-red h-full rounded-full" style={{ width: '66%' }} /></div>
                  <p className="text-xs text-gray-400">Progress to is free service</p>
                </div>
                {/* Share Your Look */}
                <div className="glass-card p-6">
                  <h3 className="font-display text-base font-bold mb-4">SHARE YOUR LOOK</h3>
                  <p className="text-xs text-gray-400 mb-4">Post a photo of your haircut directly to integrated social media.</p>
                  <div className="bg-whistle-grey/30 rounded-lg p-3 mb-4"><span className="text-whistle-crimson font-medium">#MyWhistleStopLook</span></div>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-[#1877F2] p-3 rounded hover:opacity-80 transition-opacity"><Icons.Facebook className="w-5 h-5 mx-auto" /></button>
                    <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded hover:opacity-80 transition-opacity"><Icons.Instagram className="w-5 h-5 mx-auto" /></button>
                    <button className="flex-1 bg-[#FF0000] p-3 rounded hover:opacity-80 transition-opacity"><Icons.Youtube className="w-5 h-5 mx-auto" /></button>
                  </div>
                </div>
                {/* Chair Availability Queue */}
                <ChairAvailabilityQueue />
              </div>
            </div>
          </>
        )}

        {/* ===== BOOK TAB ===== */}
        {clientTab === 'book' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl font-bold mb-6">BOOK APPOINTMENT</h2>
            {bookingPayment ? (
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-lg font-bold flex items-center gap-2"><Icons.Lock className="w-5 h-5 text-whistle-crimson" /> PAYMENT REQUIRED TO CONFIRM</h3>
                  <button onClick={() => setBookingPayment(null)} className="text-gray-400 hover:text-whistle-white"><Icons.X className="w-5 h-5" /></button>
                </div>
                <div className="bg-whistle-crimson/10 border border-whistle-crimson/30 rounded-lg p-4 mb-6">
                  <p className="text-xs text-gray-400 mb-1">Booking Details</p>
                  <p className="font-bold">{bookingPayment.service}</p>
                  <p className="text-sm text-gray-400">{bookingPayment.date} at {bookingPayment.time}</p>
                  <p className="text-sm text-gray-400">Barber: {bookingPayment.barber}</p>
                </div>
                <PaymentInline onComplete={() => setBookingPayment(null)} total={bookingPayment.price} booking={bookingPayment} />
              </div>
            ) : (
              <div className="glass-card p-6 space-y-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest text-gray-400 mb-2 uppercase">SELECT STYLE</label>
                  <div className="grid grid-cols-4 gap-2">
                    {hairStyles.map(s => (
                      <button key={s.name} onClick={() => setSelectedStyle(s)} className={`p-2 rounded text-xs font-medium transition-colors ${selectedStyle?.name === s.name ? 'bg-whistle-crimson text-whistle-white' : 'bg-whistle-grey/50 hover:bg-whistle-grey text-gray-300'}`}>{s.name}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest text-gray-400 mb-2 uppercase">SELECT DATE</label>
                  <div className="flex gap-2">
                    {['Today','Tomorrow','Fri','Sat','Sun'].map((d,i) => (
                      <button key={d} className="flex-1 py-3 bg-whistle-grey/50 hover:bg-whistle-crimson rounded text-sm font-medium transition-colors">{d}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest text-gray-400 mb-2 uppercase">SELECT TIME</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map(slot => (
                      <button key={slot} onClick={() => bookAppointment(slot)} className="py-3 bg-whistle-grey/50 hover:bg-whistle-crimson rounded text-sm font-medium transition-colors">{slot}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest text-gray-400 mb-2 uppercase">SELECT BARBER</label>
                  <div className="space-y-2">
                    {['David Barber','Dennis Ronan','David Rothham','David Maxim','David Smith'].map(b => (
                      <button key={b} className="w-full py-3 bg-whistle-grey/50 hover:bg-whistle-crimson rounded text-sm font-medium transition-colors text-left px-4">{b}</button>
                    ))}
                  </div>
                </div>
                <button onClick={() => bookAppointment('1:00 PM')} className="w-full bg-whistle-crimson text-whistle-white font-bold py-4 rounded hover:bg-whistle-red transition-colors">CONFIRM BOOKING</button>
              </div>
            )}
          </div>
        )}

        {/* ===== HISTORY TAB ===== */}
        {clientTab === 'history' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl font-bold mb-6">VISIT HISTORY</h2>
            <div className="glass-card divide-y divide-white/5">
              {customerHistory.map(h => (
                <div key={h.id} className="p-4 flex items-center justify-between hover:bg-whistle-grey/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-whistle-grey rounded-full flex items-center justify-center"><Icons.Scissors className="w-5 h-5 text-gray-400" /></div>
                    <div><p className="font-medium">{h.service}</p><p className="text-xs text-gray-500">with {h.barber}</p></div>
                  </div>
                  <div className="text-right"><p className="text-sm text-whistle-white">${h.price}</p><p className="text-xs text-gray-500">{h.date}</p></div>
                </div>
              ))}
            </div>
            <div className="mt-6 glass-card p-6">
              <h3 className="font-display text-lg font-bold mb-4">SUMMARY</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div><p className="text-2xl font-bold text-whistle-white">{customerHistory.length}</p><p className="text-xs text-gray-500">Total Visits</p></div>
                <div><p className="text-2xl font-bold text-whistle-white">${customerHistory.reduce((a,b) => a + b.price, 0)}</p><p className="text-xs text-gray-500">Total Spent</p></div>
                <div><p className="text-2xl font-bold text-whistle-crimson">${customerHistory.reduce((a,b) => a + b.tip, 0)}</p><p className="text-xs text-gray-500">Tips Given</p></div>
              </div>
            </div>
          </div>
        )}

        {/* ===== SHOP TAB ===== */}
        {clientTab === 'shop' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold">PRODUCT SHOP</h2>
              {cart.length > 0 && <span className="bg-whistle-crimson text-whistle-white text-xs px-3 py-1 rounded-full font-bold">{cart.length} in cart</span>}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((p, i) => (
                <div key={p.name} className="glass-card p-6 text-center hover:bg-whistle-grey/50 transition-colors">
                  <div className="w-20 h-20 mx-auto mb-4 bg-whistle-grey/50 rounded-lg flex items-center justify-center"><Icons.Gift className="w-10 h-10 text-gray-600" /></div>
                  <p className="font-medium text-sm mb-1">{p.name}</p>
                  <p className="text-xs text-gray-500 mb-3">{p.desc}</p>
                  <p className="text-whistle-crimson font-bold text-lg mb-3">${p.price}</p>
                  <button onClick={() => addToCart({ name: p.name, price: p.price, desc: p.desc })} className="w-full bg-whistle-crimson/20 text-whistle-crimson text-xs font-bold py-2 rounded hover:bg-whistle-crimson hover:text-whistle-white transition-all">ADD TO CART</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== STYLES TAB ===== */}
        {clientTab === 'styles' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-bold mb-6">HAIR STYLING MENU</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hairStyles.map(s => (
                <div key={s.name} className="group relative overflow-hidden rounded-lg">
                  <img src={s.url} alt={s.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" onError={(e) => { e.target.style.background = '#2a2a2a'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-whistle-black/90 via-transparent to-transparent flex flex-col justify-end p-4">
                    <span className="font-display text-lg font-bold">{s.name}</span>
                    <button onClick={() => { setSelectedStyle(s); setClientTab('book'); }} className="mt-2 bg-whistle-crimson text-whistle-white text-xs font-bold py-2 rounded hover:bg-whistle-red transition-colors">BOOK THIS STYLE</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== REWARDS TAB ===== */}
        {clientTab === 'rewards' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="glass-card p-8 text-center">
              <Icons.Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold mb-2">REWARDS PROGRAM</h2>
              <p className="text-gray-400 mb-6">Earn points with every visit!</p>
              <div className="text-4xl font-bold mb-2">100 / 150</div>
              <p className="text-sm text-gray-400 mb-4">POINTS TO NEXT FREE SERVICE</p>
              <div className="w-full bg-whistle-grey rounded-full h-4 overflow-hidden mb-6"><div className="bg-gradient-to-r from-whistle-crimson via-yellow-500 to-whistle-crimson h-full rounded-full" style={{ width: '66%', animation: 'fillWidth 1s ease-out' }} /></div>
              <button className="btn-crimson">REDEEM POINTS</button>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-display text-lg font-bold mb-4">YOUR BENEFITS</h3>
              {currentUser?.elite && <p className="text-whistle-crimson font-bold text-sm mb-4">✓ ELITE MEMBER ACTIVE</p>}
              {['10% off every service','Priority booking access','Exclusive flash sales','Birthday free service','Referral rewards: $10 credit'].map((b, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
                  <Icons.Check className="w-5 h-5 text-whistle-crimson flex-shrink-0" /><span className="text-sm">{b}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== SUPPORT TAB ===== */}
        {clientTab === 'support' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-2xl font-bold mb-6">CHATBOT / SUPPORT</h2>
            <div className="glass-card">
              <div className="bg-whistle-grey/30 rounded-lg p-4 max-h-96 overflow-y-auto mb-4 space-y-3">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.from === 'user' ? 'bg-whistle-crimson text-whistle-white' : 'bg-whistle-grey/50 text-gray-300'}`}>{msg.text}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendChat()} className="flex-1 input-field text-sm py-3" placeholder="Type a message..." />
                <button onClick={sendChat} className="bg-whistle-crimson p-3 rounded hover:bg-whistle-red transition-colors"><Icons.Send className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button className="glass-card p-4 text-center hover:bg-whistle-grey/50 transition-colors"><Icons.Phone className="w-6 h-6 mx-auto mb-2 text-whistle-crimson" /><p className="text-sm font-medium">Call Us</p></button>
              <button className="glass-card p-4 text-center hover:bg-whistle-grey/50 transition-colors"><Icons.MapPin className="w-6 h-6 mx-auto mb-2 text-whistle-crimson" /><p className="text-sm font-medium">Get Directions</p></button>
            </div>
          </div>
        )}

        {/* ===== SETTINGS TAB ===== */}
        {clientTab === 'settings' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-2xl font-bold mb-6">ACCOUNT SETTINGS</h2>
            <div className="glass-card p-6 space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-whistle-grey rounded-full flex items-center justify-center"><Icons.User className="w-10 h-10 text-gray-400" /></div>
                <div><p className="font-bold text-lg">{profile.name || 'Guest'}</p><p className="text-sm text-gray-400">{currentUser?.elite ? 'Elite Member' : 'Standard'}</p></div>
              </div>
              <div><label className="block text-xs font-bold tracking-widest text-gray-400 mb-2 uppercase">Full Name</label><input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="input-field w-full" /></div>
              <div><label className="block text-xs font-bold tracking-widest text-gray-400 mb-2 uppercase">Email</label><input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="input-field w-full" placeholder="you@email.com" /></div>
              <div><label className="block text-xs font-bold tracking-widest text-gray-400 mb-2 uppercase">Phone</label><input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="input-field w-full" /></div>
              <div><label className="block text-xs font-bold tracking-widest text-gray-400 mb-2 uppercase">Birthday</label><input type="date" value={profile.birthday} onChange={(e) => setProfile({...profile, birthday: e.target.value})} className="input-field w-full" /></div>
              <button className="btn-crimson">SAVE CHANGES</button>
            </div>
          </div>
        )}
      </div>

      {/* Notification Panel */}
      {showNotifications && (
        <div className="fixed top-16 right-4 z-[60] w-80 md:w-96 glass-card max-h-[70vh] overflow-y-auto" style={{ animation: 'fadeIn 0.2s ease-out' }}>
          <div className="p-4 flex items-center justify-between border-b border-white/10">
            <h3 className="font-display font-bold text-sm">NOTIFICATIONS</h3>
            <div className="flex items-center gap-2">
              <button onClick={markAllRead} className="text-xs text-whistle-crimson hover:text-whistle-white">Mark all read</button>
              <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-whistle-white"><Icons.X className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="divide-y divide-white/5">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">No notifications</div>
            ) : (
              notifications.map(n => (
                <div key={n.id} className={`p-4 ${n.read ? 'opacity-50' : ''}`} onClick={() => markNotificationRead(n.id)}>
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${n.type === 'chair-ready' ? 'bg-whistle-crimson animate-pulse' : n.type === 'payment' ? 'bg-green-500' : n.type === 'sms' ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.message}</p>
                      <p className="text-xs text-gray-600 mt-1">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Shopping Cart */}
      <ShoppingCart />
      {/* Payment Modal for cart */}
      {paymentState.step && !paymentState.booking && <PaymentModal />}

      </div>
    </div>
  );
}

export default ClientDashboard;
