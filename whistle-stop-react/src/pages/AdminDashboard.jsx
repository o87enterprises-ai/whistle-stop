import { useState } from 'react';
import { useApp } from '../context/AppContext';
import BackgroundScene from '../components/BackgroundScene';
import Logo from '../components/Logo';

function MiniBarChart({ data, height = 120 }) {
  const maxVal = Math.max(...data.map(d => d.hours));
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((d, i) => (<div key={i} className="flex-1 flex flex-col items-center gap-1"><div className="w-full bg-whistle-crimson rounded-sm transition-all" style={{ height: `${(d.hours / maxVal) * 100}%`, minHeight: 4 }} /><span className="text-[10px] text-gray-500">{d.name}</span></div>))}
    </div>
  );
}
function MiniLineChart({ data, height = 50 }) {
  const maxVal = Math.max(...data);
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / maxVal) * 100}`).join(' ');
  return (<svg viewBox="0 0 100 100" className="w-full" style={{ height }} preserveAspectRatio="none"><polyline points={points} fill="none" stroke="#dc2626" strokeWidth="2" vectorEffect="non-scaling-stroke" /></svg>);
}

function PermissionsModal({ onClose, permissions, setPermissions, Icons }) {
  const [selected, setSelected] = useState({ ...permissions });
  const toggle = (key) => setSelected(prev => ({ ...prev, [key]: !prev[key] }));
  const groups = [
    { title: 'PHONE & COMMUNICATIONS', icon: '📱', items: [{ key: 'phoneCalls', label: 'Phone Calls', desc: 'Make/receive calls via VoIP' },{ key: 'faceTime', label: 'FaceTime / Video Calls', desc: 'Video consultations with clients' },{ key: 'smsPager', label: 'SMS Pager System', desc: 'Text clients when chair is ready' },{ key: 'pushNotifications', label: 'Push Notifications', desc: 'Booking reminders & alerts' },{ key: 'voicemail', label: 'Voicemail Transcription', desc: 'Auto-transcribe missed calls' }] },
    { title: 'DEVICE ACCESS', icon: '📷', items: [{ key: 'camera', label: 'Camera Access', desc: 'Security feeds & client photos' },{ key: 'microphone', label: 'Microphone', desc: 'Voice commands & recording' },{ key: 'location', label: 'Location Services', desc: 'Geofencing for reminders' },{ key: 'bluetooth', label: 'Bluetooth', desc: 'POS terminal & card reader' }] },
    { title: 'DATA & STORAGE', icon: '💾', items: [{ key: 'contacts', label: 'Contacts Sync', desc: 'Import client phone books' },{ key: 'calendar', label: 'Calendar Access', desc: 'Sync with Google/Outlook/Apple' },{ key: 'photos', label: 'Photo Library', desc: 'Store before/after photos' },{ key: 'fileSystem', label: 'File System', desc: 'Export reports & receipts' }] },
  ];
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} style={{ animation: 'fadeIn 0.3s ease-out' }}>
        <div className="flex items-center justify-between mb-6"><div><h3 className="font-display text-xl font-bold">DEVICE PERMISSIONS</h3><p className="text-xs text-gray-500">Manage platform access</p></div><button onClick={onClose} className="text-gray-400 hover:text-whistle-white"><Icons.X className="w-5 h-5" /></button></div>
        {groups.map(g => (<div key={g.title} className="mb-6"><h4 className="text-xs font-bold tracking-wider text-whistle-crimson mb-3 flex items-center gap-2"><span>{g.icon}</span> {g.title}</h4><div className="space-y-2">{g.items.map(item => (<div key={item.key} className="flex items-center justify-between p-3 bg-whistle-grey/30 rounded-lg hover:bg-whistle-grey/50 transition-colors"><div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-gray-500">{item.desc}</p></div><button onClick={() => toggle(item.key)} className={`w-10 h-5 rounded-full relative transition-colors flex-shrink-0 ${selected[item.key] ? 'bg-whistle-crimson' : 'bg-whistle-grey'}`}><div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${selected[item.key] ? 'left-5' : 'left-0.5'}`} /></button></div>))}</div></div>))}
        <div className="flex gap-3 mt-6 pt-6 border-t border-white/10"><button onClick={onClose} className="flex-1 bg-whistle-grey py-3 rounded font-medium hover:bg-whistle-charcoal transition-colors">CANCEL</button><button onClick={() => { setPermissions(selected); onClose(); }} className="flex-1 bg-whistle-crimson py-3 rounded font-bold hover:bg-whistle-red transition-colors">SAVE PERMISSIONS</button></div>
      </div>
    </div>
  );
}

function ApiKeysPanel({ Icons }) {
  const [keys] = useState([
    { id: 1, name: 'Facebook/Instagram', key: 'EAACEdEose0cBA...', status: 'connected', category: 'Social Media', desc: 'Ad campaigns, page posting' },
    { id: 2, name: 'Stripe Payments', key: 'pk_live_51Nq...x7Kp', status: 'connected', category: 'Payment Processing', desc: 'Credit card & Apple/Google Pay' },
    { id: 3, name: 'PayPal Business', key: 'A21AAFbPn...x9Qw', status: 'pending', category: 'Payment Processing', desc: 'Online checkout & invoicing' },
    { id: 4, name: 'Google Maps', key: 'AIzaSyD...8fGh', status: 'connected', category: 'Location', desc: 'Store locator & directions' },
    { id: 5, name: 'Twilio SMS', key: 'AC7e4...2f1b', status: 'connected', category: 'Communications', desc: 'SMS pager system' },
    { id: 6, name: 'SendGrid Email', key: 'SG.8xKp...v2Nq', status: 'connected', category: 'Communications', desc: 'Email receipts & newsletters' },
    { id: 7, name: 'Shopify Dropship', key: 'shpat_a1b2...c3d4', status: 'pending', category: 'Affiliate / E-commerce', desc: 'Product catalog & fulfillment' },
    { id: 8, name: 'Amazon Associates', key: 'AKIAI...X7NQ', status: 'inactive', category: 'Affiliate / E-commerce', desc: 'Product recommendations' },
    { id: 9, name: 'Ring Camera API', key: 'rc_7f2a...e4b1', status: 'connected', category: 'Security', desc: 'Live security feed integration' },
    { id: 10, name: 'Google Calendar', key: 'ya29.a0AfH6...x8Kp', status: 'connected', category: 'Scheduling', desc: 'Appointment sync' },
    { id: 11, name: 'Square POS', key: 'sq0idp-a1b2...c3d4', status: 'pending', category: 'Payment Processing', desc: 'In-person card processing' },
    { id: 12, name: 'Yelp for Business', key: 'YELP-API-KEY...x9Qw', status: 'connected', category: 'Reviews / Marketing', desc: 'Review responses' },
  ]);
  const [filter, setFilter] = useState('all');
  const categories = ['all', ...new Set(keys.map(k => k.category))];
  const filtered = filter === 'all' ? keys : keys.filter(k => k.category === filter);
  const statusColors = { connected: 'bg-green-500', pending: 'bg-yellow-500', inactive: 'bg-gray-500' };
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4"><div><h3 className="font-display text-lg font-bold flex items-center gap-2"><Icons.Settings className="w-5 h-5 text-whistle-crimson" /> PLATFORM API KEYS</h3><p className="text-xs text-gray-500">Manage third-party integrations</p></div><div className="text-xs text-gray-500"><span className="text-green-500 font-bold">{keys.filter(k => k.status === 'connected').length}</span> connected · <span className="text-yellow-500 font-bold">{keys.filter(k => k.status === 'pending').length}</span> pending</div></div>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">{categories.map(cat => (<button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filter === cat ? 'bg-whistle-crimson text-whistle-white' : 'bg-whistle-grey/50 text-gray-400 hover:text-whistle-white'}`}>{cat === 'all' ? 'ALL' : cat}</button>))}</div>
      <div className="space-y-3 max-h-96 overflow-y-auto">{filtered.map(k => (<div key={k.id} className="p-4 bg-whistle-grey/30 rounded-lg hover:bg-whistle-grey/50 transition-colors"><div className="flex items-start justify-between mb-2"><div className="flex items-center gap-3"><div className={`w-3 h-3 rounded-full ${statusColors[k.status]}`} /><div><p className="text-sm font-semibold">{k.name}</p><p className="text-xs text-gray-500">{k.category}</p></div></div><span className={`text-xs px-2 py-1 rounded ${k.status === 'connected' ? 'bg-green-500/20 text-green-400' : k.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>{k.status.toUpperCase()}</span></div><div className="flex items-center justify-between"><code className="text-xs bg-whistle-black/50 px-2 py-1 rounded text-gray-400 font-mono">{k.key}</code><span className="text-xs text-gray-500">{k.desc}</span></div><div className="flex gap-2 mt-3"><button className="text-xs bg-whistle-grey/50 hover:bg-whistle-grey px-3 py-1.5 rounded transition-colors">Rotate Key</button><button className="text-xs bg-whistle-grey/50 hover:bg-whistle-grey px-3 py-1.5 rounded transition-colors">Test Connection</button>{k.status === 'inactive' && <button className="text-xs bg-whistle-crimson/20 text-whistle-crimson hover:bg-whistle-crimson hover:text-whistle-white px-3 py-1.5 rounded transition-colors">Connect</button>}</div></div>))}</div>
    </div>
  );
}

function AdminDashboard() {
  const { navigate, logout, currentUser, appointments, customers, barbers, flashSale, revenue, Icons, bgImages } = useApp();
  const { adminTab, setAdminTab } = useApp();
  const [flashSaleActive, setFlashSaleActive] = useState(flashSale.active);
  const [chatMessages, setChatMessages] = useState([{ user: 'You', text: 'Hey dude!', time: 'Just now' }, { user: 'Alex - Trim Update?', text: 'Can I get your appointment?', time: '2 min ago' }]);
  const [chatInput, setChatInput] = useState('');
  const [showBlastModal, setShowBlastModal] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [permissions, setPermissions] = useState({ phoneCalls: true, faceTime: true, smsPager: true, pushNotifications: true, voicemail: false, camera: true, microphone: false, location: true, bluetooth: true, contacts: false, calendar: true, photos: true, fileSystem: true });
  const [blastText, setBlastText] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [businessHours, setBusinessHours] = useState({ monday: { open: '09:00', close: '18:00' }, tuesday: { open: '09:00', close: '18:00' }, wednesday: { open: '09:00', close: '18:00' }, thursday: { open: '09:00', close: '20:00' }, friday: { open: '09:00', close: '20:00' }, saturday: { open: '08:00', close: '17:00' }, sunday: { open: '10:00', close: '15:00' } });

  const sendChat = () => { if (!chatInput.trim()) return; setChatMessages(prev => [...prev, { user: 'You', text: chatInput, time: 'Just now' }]); setChatInput(''); };
  const peakHoursData = revenue.hours.map((h, i) => ({ name: h, hours: revenue.weekly[i] || 0 }));
  const socialFeed = [{ user: 'Best Creations', text: 'Post on photo of their haircut at your branch...', time: '2m ago' }];
  const filteredCustomers = customerSearch ? customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase())) : customers;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'Home' },
    { id: 'barbers', label: 'Barbers', icon: 'Users' },
    { id: 'customers', label: 'Customers', icon: 'User' },
    { id: 'appointments', label: 'Schedule', icon: 'Calendar' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart' },
    { id: 'flash-sales', label: 'Flash Sales', icon: 'Zap' },
    { id: 'settings', label: 'Settings', icon: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-whistle-black relative">
      <BackgroundScene bgImages={bgImages} />
      <div className="relative z-10">
      {/* Top Nav */}
      <header className="bg-whistle-charcoal/80 backdrop-blur-xl border-b border-white/10 px-3 md:px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-6">
            <div className="flex items-center gap-2 text-whistle-white" style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1.2rem)' }}><Logo /></div>
            <nav className="hidden md:flex items-center gap-2">{tabs.map(item => (<button key={item.id} onClick={() => setAdminTab(item.id)} className={`px-3 py-2 rounded text-sm capitalize transition-colors ${adminTab === item.id ? 'bg-whistle-crimson text-whistle-white' : 'text-gray-400 hover:text-whistle-white hover:bg-whistle-grey'}`}>{item.label}</button>))}</nav>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={() => setShowPermissions(true)} className="text-gray-400 hover:text-whistle-white relative" title="Permissions"><Icons.Shield className="w-4 h-4 md:w-5 md:h-5" /><span className="absolute -top-1 -right-1 w-3.5 h-3.5 md:w-4 md:h-4 bg-whistle-crimson rounded-full text-xs flex items-center justify-center text-[8px]">{Object.values(permissions).filter(Boolean).length}</span></button>
            <button onClick={() => setShowApiKeys(!showApiKeys)} className={`text-gray-400 hover:text-whistle-white hidden md:block ${showApiKeys ? 'text-whistle-crimson' : ''}`} title="API Keys"><Icons.Settings className="w-5 h-5" /></button>
            <button className="text-gray-400 hover:text-whistle-white relative"><Icons.Bell className="w-4 h-4 md:w-5 md:h-5" /><span className="absolute -top-1 -right-1 w-3.5 h-3.5 md:w-4 md:h-4 bg-whistle-crimson rounded-full text-xs flex items-center justify-center">3</span></button>
            <div className="flex items-center gap-2"><div className="w-7 h-7 md:w-8 md:h-8 bg-whistle-grey rounded-full flex items-center justify-center"><Icons.User className="w-3.5 h-3.5 md:w-4 md:h-4" /></div><span className="text-sm hidden md:block">{currentUser?.name || 'Admin'}</span><Icons.ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 hidden md:block" /></div>
            <button onClick={() => { logout(); navigate('/'); }} className="text-gray-400 hover:text-whistle-white"><Icons.X className="w-4 h-4 md:w-5 md:h-5" /></button>
          </div>
        </div>
      </header>

      {showApiKeys && <ApiKeysPanel Icons={Icons} />}

      <div className="flex">
        {/* Sidebar - horizontal scroll on mobile, vertical on desktop */}
        <aside className="hidden md:flex md:w-16 md:bg-whistle-charcoal/80 md:backdrop-blur-xl md:border-r md:border-white/10 md:min-h-screen md:py-4 md:flex-col md:items-center md:gap-2">
          {tabs.map((item) => {
            const SidebarIcon = Icons[item.icon];
            return (
              <button key={item.id} onClick={() => setAdminTab(item.id)} className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${adminTab === item.id ? 'bg-whistle-crimson text-whistle-white' : 'text-gray-400 hover:text-whistle-white hover:bg-whistle-grey'}`} title={item.label}><SidebarIcon className="w-5 h-5" /></button>
            );
          })}
        </aside>
        {/* Mobile tab bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-whistle-charcoal/80 backdrop-blur-xl border-t border-white/10 px-2 py-2 flex items-center justify-around">
          {tabs.map((item) => {
            const MobileIcon = Icons[item.icon];
            return (
              <button key={item.id} onClick={() => setAdminTab(item.id)} className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors min-w-0 flex-1 ${adminTab === item.id ? 'text-whistle-crimson' : 'text-gray-500'}`}>
                <MobileIcon className="w-5 h-5" />
                <span className="text-[10px] truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto pb-20 md:pb-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-6">ADMIN DASHBOARD</h1>

          {/* ===== DASHBOARD TAB ===== */}
          {adminTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div className="glass-card p-5"><h3 className="text-xs font-bold tracking-wider text-gray-400 mb-2">DAILY FORECAST</h3><div className="flex items-end gap-2 mb-1"><span className="text-3xl font-bold">${revenue.daily.toLocaleString()}.00</span><Icons.ArrowUpRight className="w-5 h-5 text-green-500 mb-1" /></div><p className="text-xs text-gray-500">Projected Revenue</p><div className="mt-4"><MiniLineChart data={revenue.weekly.slice(-4)} height={50} /></div></div>
              <div className="glass-card p-5"><h3 className="text-xs font-bold tracking-wider text-gray-400 mb-3">QUICK ACTIONS</h3><div className="space-y-2"><button className="w-full bg-whistle-grey hover:bg-whistle-crimson py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"><Icons.Calendar className="w-4 h-4" /> NEW APPOINTMENT</button><button className="w-full bg-whistle-grey hover:bg-whistle-crimson py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"><Icons.UserPlus className="w-4 h-4" /> CLIENT CHECK-IN</button><button onClick={() => setShowBlastModal(true)} className="w-full bg-whistle-grey hover:bg-whistle-crimson py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"><Icons.MessageSquare className="w-4 h-4" /> SEND BLAST</button><button className="w-full bg-whistle-grey hover:bg-whistle-crimson py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"><Icons.Zap className="w-4 h-4" /> FLASH SALE</button><button onClick={() => setShowPermissions(true)} className="w-full bg-whistle-grey hover:bg-whistle-crimson py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"><Icons.Shield className="w-4 h-4" /> PERMISSIONS</button></div></div>
              <div className="glass-card p-5 col-span-2"><h3 className="text-xs font-bold tracking-wider text-gray-400 mb-3">PEAK/VALLEY HOURS</h3><MiniBarChart data={peakHoursData} height={120} /></div>
              <div className="glass-card p-5 col-span-2"><h3 className="text-xs font-bold tracking-wider text-gray-400 mb-3">SCHEDULED APPOINTMENTS</h3><div className="space-y-2 max-h-44 overflow-y-auto">{appointments.map(apt => (<div key={apt.id} className="flex items-center justify-between text-sm py-2 border-b border-white/5 last:border-0"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-whistle-grey rounded-full flex items-center justify-center"><Icons.User className="w-4 h-4" /></div><div><p className="font-medium">{apt.barber}</p><p className="text-xs text-gray-500">{apt.service}</p></div></div><span className="text-whistle-crimson font-medium">{apt.time}</span></div>))}</div></div>
              <div className="glass-card p-5"><h3 className="text-xs font-bold tracking-wider text-gray-400 mb-3">COMMUNICATIONS HUB</h3><div className="bg-whistle-grey/50 rounded-lg p-3 mb-4"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-whistle-crimson rounded-full flex items-center justify-center"><Icons.User className="w-4 h-4" /></div><div><p className="text-sm font-medium">Alex Alex</p><p className="text-xs text-gray-500">TRYON 2026</p></div></div></div><div className="grid grid-cols-3 gap-1 mb-3">{[1,2,3,4,5,6,7,8,9,'*',0,'#'].map(k => (<button key={k} className="py-2 bg-whistle-grey/50 hover:bg-whistle-crimson rounded text-sm font-medium transition-colors">{k}</button>))}</div><button className="w-full bg-whistle-crimson py-2 rounded-full flex items-center justify-center gap-2"><Icons.Phone className="w-4 h-4" /> CALL</button><div className="mt-4 pt-4 border-t border-white/10"><h4 className="text-xs font-bold text-gray-400 mb-2">CALL HISTORY</h4>{[{ name: 'Glori Harvey', time: '15 min' }, { name: 'Yann Koun', time: '0.2 min' }, { name: 'Dessa Morcos', time: '23 min' }].map((c, i) => (<div key={i} className="flex items-center justify-between text-xs py-1"><span>{c.name}</span><span className="text-gray-500">{c.time}</span></div>))}</div></div>
              <div className="glass-card p-5"><h3 className="text-xs font-bold tracking-wider text-gray-400 mb-3">DIRECT MESSAGING</h3><div className="bg-whistle-grey/30 rounded-lg p-3 mb-3 max-h-28 overflow-y-auto">{chatMessages.map((msg, i) => (<div key={i} className={`mb-2 ${msg.user === 'You' ? 'text-right' : ''}`}><span className="text-xs font-medium text-whistle-crimson">{msg.user}</span><p className="text-xs bg-whistle-grey/50 rounded p-2 mt-1 inline-block max-w-full">{msg.text}</p></div>))}</div><div className="flex gap-2"><input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendChat()} className="flex-1 input-field text-xs py-2" placeholder="Send a message..." /><button onClick={sendChat} className="bg-whistle-crimson p-2 rounded hover:bg-whistle-red transition-colors"><Icons.Send className="w-3 h-3" /></button></div><div className="mt-3 pt-3 border-t border-white/10"><h4 className="text-xs font-bold text-gray-400 mb-1">SOCIAL NEWS FEED</h4>{socialFeed.map((p, i) => (<div key={i} className="mb-1"><p className="text-xs font-medium">{p.user}</p><p className="text-xs text-gray-500">{p.text}</p><p className="text-xs text-whistle-crimson">{p.time}</p></div>))}</div></div>
              <div className="glass-card p-5 col-span-2"><h3 className="text-xs font-bold tracking-wider text-gray-400 mb-3">LIVE SECURITY FEEDS</h3><div className="grid grid-cols-2 gap-2">{[1, 2, 3, 4].map(cam => (<div key={cam} className="aspect-video bg-whistle-grey/50 rounded-lg overflow-hidden relative"><div className="absolute inset-0 bg-gradient-to-br from-whistle-charcoal to-whistle-grey flex items-center justify-center"><Icons.Camera className="w-8 h-8 text-gray-600" /></div><div className="absolute top-2 left-2 bg-whistle-crimson/80 px-2 py-1 rounded text-xs font-bold"><span className="animate-pulse">●</span> CAM {cam}</div><div className="absolute bottom-2 right-2 text-xs text-gray-500">LIVE</div></div>))}</div></div>
              <div className="glass-card p-5"><h3 className="text-xs font-bold tracking-wider text-gray-400 mb-3">FLASH SALE MANAGER</h3><div className="flex items-center justify-between mb-3"><span className={`text-xs ${flashSaleActive ? 'text-whistle-crimson' : 'text-gray-500'}`}>{flashSaleActive ? 'ACTIVE' : 'INACTIVE'}</span><button onClick={() => setFlashSaleActive(!flashSaleActive)} className={`w-10 h-5 rounded-full relative transition-colors ${flashSaleActive ? 'bg-whistle-crimson' : 'bg-whistle-grey'}`}><div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${flashSaleActive ? 'left-5' : 'left-0.5'}`} /></button></div>{flashSaleActive && (<div className="bg-whistle-crimson/20 border border-whistle-crimson/50 rounded-lg p-4"><div className="flex items-center gap-2 mb-2"><Icons.Zap className="w-4 h-4 text-whistle-crimson" /><span className="text-sm font-bold text-whistle-crimson">{flashSale.title}</span></div><p className="text-xs text-gray-400 mb-2">{flashSale.time}</p><p className="text-xs text-whistle-white">{flashSale.spotsLeft} spots left</p><div className="w-full bg-whistle-grey rounded-full h-1 mt-2"><div className="bg-whistle-crimson h-full rounded-full" style={{ width: `${(flashSale.spotsLeft / 10) * 100}%` }} /></div></div>)}</div>
              <div className="glass-card p-5"><h3 className="text-xs font-bold tracking-wider text-gray-400 mb-3">CUSTOMER DATABASE</h3><div className="relative mb-3"><Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" /><input type="text" className="input-field w-full text-xs pl-10 py-2" placeholder="Search..." /></div><div className="space-y-2">{customers.slice(0, 5).map(c => (<div key={c.id} className="flex items-center justify-between text-xs py-2 border-b border-white/5 last:border-0"><div className="flex items-center gap-2"><div className="w-6 h-6 bg-whistle-grey rounded-full flex items-center justify-center"><Icons.User className="w-3 h-3" /></div><span>{c.name}</span></div><button className="text-whistle-crimson hover:text-whistle-white"><Icons.MoreHorizontal className="w-4 h-4" /></button></div>))}</div><button className="w-full mt-3 bg-whistle-grey/50 hover:bg-whistle-grey py-2 rounded text-xs font-medium transition-colors">Quick View</button></div>
            </div>
          )}

          {/* ===== BARBERS TAB ===== */}
          {adminTab === 'barbers' && (
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-6"><h2 className="font-display text-2xl font-bold">BARBER MANAGEMENT</h2><button className="btn-crimson flex items-center gap-2"><Icons.Plus className="w-4 h-4" /> ADD BARBER</button></div>
              <div className="grid md:grid-cols-2 gap-4">
                {barbers.map(b => (
                  <div key={b.id} className="glass-card p-6 hover:bg-whistle-grey/30 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4"><div className="w-12 h-12 bg-whistle-grey rounded-full flex items-center justify-center"><Icons.User className="w-6 h-6 text-gray-400" /></div><div><p className="font-bold text-lg">{b.name}</p><div className="flex items-center gap-1 text-yellow-500"><Icons.Star className="w-4 h-4" /><span className="text-sm text-gray-300">{b.rating}</span></div></div></div>
                      <button className="text-gray-400 hover:text-whistle-white"><Icons.Edit className="w-4 h-4" /></button>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">{b.skills.map(s => (<span key={s} className="bg-whistle-grey/50 text-xs px-2 py-1 rounded">{s}</span>))}</div>
                    <div className="grid grid-cols-3 gap-4 text-center text-xs"><div><p className="text-lg font-bold text-whistle-white">{b.clientsToday}</p><p className="text-gray-500">Today</p></div><div><p className="text-lg font-bold text-whistle-white">${b.revenue}</p><p className="text-gray-500">Revenue</p></div><div><p className="text-lg font-bold text-whistle-white">{b.capacity}</p><p className="text-gray-500">Capacity</p></div></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== CUSTOMERS TAB ===== */}
          {adminTab === 'customers' && (
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-6"><h2 className="font-display text-2xl font-bold">CUSTOMER DATABASE</h2><span className="text-sm text-gray-400">{customers.length} total customers</span></div>
              <div className="relative mb-6"><Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" /><input type="text" value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} className="input-field w-full pl-12 py-3" placeholder="Search customers by name or phone..." /></div>
              <div className="glass-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-white/10 text-xs text-gray-400 uppercase tracking-wider"><th className="p-4 text-left">Customer</th><th className="p-4 text-left">Phone</th><th className="p-4 text-center">Visits</th><th className="p-4 text-center">Spent</th><th className="p-4 text-center">Status</th><th className="p-4 text-center">Last Visit</th><th className="p-4 text-center">Actions</th></tr></thead>
                    <tbody>{filteredCustomers.map(c => (<tr key={c.id} className="border-b border-white/5 hover:bg-whistle-grey/30 transition-colors"><td className="p-4"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-whistle-grey rounded-full flex items-center justify-center"><Icons.User className="w-4 h-4" /></div><span className="font-medium">{c.name}</span>{c.elite && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">ELITE</span>}</div></td><td className="p-4 text-gray-400">{c.phone}</td><td className="p-4 text-center">{c.visits}</td><td className="p-4 text-center font-medium">${c.spent}</td><td className="p-4 text-center"><span className={`px-2 py-1 rounded text-xs ${c.elite ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{c.elite ? 'Elite' : 'Standard'}</span></td><td className="p-4 text-center text-gray-400">{c.lastVisit}</td><td className="p-4 text-center"><div className="flex items-center justify-center gap-2"><button onClick={() => setSelectedCustomer(c)} className="text-gray-400 hover:text-whistle-white"><Icons.Eye className="w-4 h-4" /></button><button className="text-gray-400 hover:text-whistle-white"><Icons.Edit className="w-4 h-4" /></button></div></td></tr>))}</tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===== APPOINTMENTS TAB ===== */}
          {adminTab === 'appointments' && (
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-6"><h2 className="font-display text-2xl font-bold">APPOINTMENT SCHEDULE</h2><button className="btn-crimson flex items-center gap-2"><Icons.Plus className="w-4 h-4" /> NEW APPOINTMENT</button></div>
              <div className="glass-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-white/10 text-xs text-gray-400 uppercase tracking-wider"><th className="p-4 text-left">Client</th><th className="p-4 text-left">Service</th><th className="p-4 text-left">Barber</th><th className="p-4 text-center">Time</th><th className="p-4 text-center">Price</th><th className="p-4 text-center">Status</th><th className="p-4 text-center">Actions</th></tr></thead>
                    <tbody>{appointments.map(apt => (<tr key={apt.id} className="border-b border-white/5 hover:bg-whistle-grey/30 transition-colors"><td className="p-4 font-medium">{apt.client}</td><td className="p-4">{apt.service}</td><td className="p-4 text-gray-400">{apt.barber}</td><td className="p-4 text-center font-bold text-whistle-white">{apt.time}</td><td className="p-4 text-center">${apt.price}</td><td className="p-4 text-center"><span className={`px-2 py-1 rounded text-xs ${apt.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{apt.status}</span></td><td className="p-4 text-center"><div className="flex items-center justify-center gap-2"><button className="text-gray-400 hover:text-whistle-white"><Icons.Edit className="w-4 h-4" /></button><button className="text-gray-400 hover:text-whistle-red"><Icons.Trash className="w-4 h-4" /></button></div></td></tr>))}</tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===== ANALYTICS TAB ===== */}
          {adminTab === 'analytics' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <h2 className="font-display text-2xl font-bold">ANALYTICS</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[{ label: 'Daily Revenue', value: `$${revenue.daily}`, icon: 'DollarSign' }, { label: 'Weekly Avg', value: `$${Math.round(revenue.weekly.reduce((a,b) => a+b,0) / revenue.weekly.length)}`, icon: 'TrendingUp' }, { label: 'Total Appointments', value: appointments.length, icon: 'Calendar' }, { label: 'Active Customers', value: customers.length, icon: 'Users' }].map((s, i) => {
                  const StatIcon = Icons[s.icon];
                  return (<div key={i} className="glass-card p-6"><StatIcon className="w-6 h-6 text-whistle-crimson mb-3" /><p className="text-2xl font-bold">{s.value}</p><p className="text-xs text-gray-500">{s.label}</p></div>);
                })}
              </div>
              <div className="glass-card p-6"><h3 className="font-display text-lg font-bold mb-4">MONTHLY REVENUE</h3><MiniBarChart data={revenue.hours.map((h, i) => ({ name: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i] || h, hours: revenue.monthly?.[i] || revenue.weekly[i] || 0 }))} height={200} /></div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6"><h3 className="font-display text-lg font-bold mb-4">TOP BARBERS</h3>{barbers.sort((a,b) => b.revenue - a.revenue).slice(0, 3).map((b, i) => (<div key={b.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"><div className="flex items-center gap-3"><span className="text-whistle-crimson font-bold">#{i + 1}</span><Icons.User className="w-5 h-5 text-gray-400" /><span>{b.name}</span></div><span className="font-bold">${b.revenue}</span></div>))}</div>
                <div className="glass-card p-6"><h3 className="font-display text-lg font-bold mb-4">POPULAR SERVICES</h3>{[
                    { service: 'Taper Cut', count: 45, pct: 30 },
                    { service: 'Fade', count: 38, pct: 25 },
                    { service: 'Beard Trim', count: 32, pct: 21 },
                    { service: 'Classic Cut', count: 22, pct: 15 },
                    { service: 'Hot Towel Shave', count: 14, pct: 9 },
                  ].map((s, i) => (<div key={i} className="py-3 border-b border-white/5 last:border-0"><div className="flex items-center justify-between mb-1"><span className="text-sm">{s.service}</span><span className="text-xs text-gray-500">{s.count} ({s.pct}%)</span></div><div className="w-full bg-whistle-grey rounded-full h-1.5"><div className="bg-whistle-crimson h-full rounded-full" style={{ width: `${s.pct * 3}%` }} /></div></div>))}</div>
              </div>
            </div>
          )}

          {/* ===== FLASH SALES TAB ===== */}
          {adminTab === 'flash-sales' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between"><h2 className="font-display text-2xl font-bold">FLASH SALE MANAGER</h2><button className="btn-crimson flex items-center gap-2"><Icons.Plus className="w-4 h-4" /> CREATE SALE</button></div>
              <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-6"><h3 className="font-display text-lg font-bold">Active Sale</h3><div className="flex items-center gap-3"><span className={`text-sm font-bold ${flashSaleActive ? 'text-whistle-crimson' : 'text-gray-500'}`}>{flashSaleActive ? 'ACTIVE' : 'INACTIVE'}</span><button onClick={() => setFlashSaleActive(!flashSaleActive)} className={`w-12 h-6 rounded-full relative transition-colors ${flashSaleActive ? 'bg-whistle-crimson' : 'bg-whistle-grey'}`}><div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${flashSaleActive ? 'left-6' : 'left-0.5'}`} /></button></div></div>
                {flashSaleActive ? (
                  <div className="bg-whistle-crimson/20 border border-whistle-crimson/50 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4"><Icons.Zap className="w-6 h-6 text-whistle-crimson" /><h4 className="text-xl font-bold text-whistle-crimson">{flashSale.title}</h4></div>
                    <div className="grid grid-cols-3 gap-4 mb-4 text-center"><div><p className="text-sm text-gray-400">Time</p><p className="font-bold">{flashSale.time}</p></div><div><p className="text-sm text-gray-400">Spots Left</p><p className="font-bold text-whistle-crimson">{flashSale.spotsLeft}</p></div><div><p className="text-sm text-gray-400">Discount</p><p className="font-bold text-whistle-crimson">15%</p></div></div>
                    <div className="w-full bg-whistle-grey rounded-full h-2"><div className="bg-whistle-crimson h-full rounded-full" style={{ width: `${(flashSale.spotsLeft / 10) * 100}%` }} /></div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500"><Icons.Zap className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No active flash sale</p></div>
                )}
              </div>
            </div>
          )}

          {/* ===== SETTINGS TAB ===== */}
          {adminTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="font-display text-2xl font-bold">SETTINGS</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2"><Icons.Clock className="w-5 h-5 text-whistle-crimson" /> BUSINESS HOURS</h3>
                  {Object.entries(businessHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <span className="text-sm capitalize">{day}</span>
                      <div className="flex items-center gap-2"><input type="time" value={hours.open} onChange={() => {}} className="bg-whistle-grey/50 border border-white/10 rounded px-2 py-1 text-sm text-whistle-white" /><span className="text-gray-500">-</span><input type="time" value={hours.close} onChange={() => {}} className="bg-whistle-grey/50 border border-white/10 rounded px-2 py-1 text-sm text-whistle-white" /></div>
                    </div>
                  ))}
                  <button className="w-full mt-4 bg-whistle-grey hover:bg-whistle-crimson py-2 rounded text-sm font-medium transition-colors">SAVE HOURS</button>
                </div>
                <div className="glass-card p-6">
                  <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2"><Icons.Shield className="w-5 h-5 text-whistle-crimson" /> DEVICE PERMISSIONS</h3>
                  {Object.entries(permissions).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <button onClick={() => setPermissions(p => ({ ...p, [key]: !p[key] }))} className={`w-10 h-5 rounded-full relative transition-colors ${val ? 'bg-whistle-crimson' : 'bg-whistle-grey'}`}><div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${val ? 'left-5' : 'left-0.5'}`} /></button>
                    </div>
                  ))}
                  <button className="w-full mt-4 bg-whistle-grey hover:bg-whistle-crimson py-2 rounded text-sm font-medium transition-colors">SAVE PERMISSIONS</button>
                </div>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2"><Icons.Layers className="w-5 h-5 text-whistle-crimson" /> INTEGRATIONS & API KEYS</h3>
                <p className="text-sm text-gray-400 mb-4">Manage connections to third-party services for payments, social media, scheduling, and more.</p>
                <button onClick={() => setShowApiKeys(!showApiKeys)} className="btn-crimson">VIEW API KEYS</button>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-display text-lg font-bold mb-4 text-red-400">DANGER ZONE</h3>
                <div className="flex gap-4"><button className="bg-whistle-grey hover:bg-red-600 py-3 px-6 rounded text-sm font-medium transition-colors">Export All Data</button><button className="bg-whistle-grey hover:bg-red-600 py-3 px-6 rounded text-sm font-medium transition-colors">Reset Settings</button></div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Blast Modal */}
      {showBlastModal && (<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowBlastModal(false)}><div className="glass-card p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()} style={{ animation: 'fadeIn 0.3s ease-out' }}><div className="flex items-center justify-between mb-4"><h3 className="font-display text-xl font-bold">SEND BLAST MESSAGE</h3><button onClick={() => setShowBlastModal(false)} className="text-gray-400 hover:text-whistle-white"><Icons.X className="w-5 h-5" /></button></div><textarea className="input-field w-full h-32 resize-none" placeholder="Type your message to all customers..." value={blastText} onChange={(e) => setBlastText(e.target.value)} /><div className="flex gap-3 mt-4"><button onClick={() => setShowBlastModal(false)} className="flex-1 bg-whistle-grey py-3 rounded font-medium hover:bg-whistle-charcoal transition-colors">CANCEL</button><button className="flex-1 bg-whistle-crimson py-3 rounded font-medium hover:bg-whistle-red transition-colors">SEND TO ALL</button></div></div></div>)}

      {/* Permissions Modal */}
      {showPermissions && (<PermissionsModal onClose={() => setShowPermissions(false)} permissions={permissions} setPermissions={setPermissions} Icons={Icons} />)}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
      </div>
    </div>
  );
}

export default AdminDashboard;
