import { useState } from 'react';
import { useApp } from '../context/AppContext';

function ClientAuth() {
  const { navigate, login, Icons } = useApp();
  const [formData, setFormData] = useState({ name: '', phone: '', elite: false, password: '' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => { login({ name: formData.name, phone: formData.phone, elite: formData.elite }, false); navigate('/client/dashboard'); }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass-card rounded-lg p-12 max-w-md w-full text-center" style={{ animation: 'fadeIn 0.5s ease-out' }}>
          <div className="w-16 h-16 bg-whistle-crimson rounded-full flex items-center justify-center mx-auto mb-4"><Icons.Check className="w-8 h-8 text-whistle-white" /></div>
          <h3 className="font-display text-2xl text-whistle-white mb-2">PROFILE CREATED</h3>
          <p className="text-gray-400 mb-6">Redirecting to your dashboard...</p>
          <div className="w-full bg-whistle-grey rounded-full h-1 overflow-hidden"><div className="bg-whistle-crimson h-full rounded-full" style={{ animation: 'fillWidth 2s ease-out' }} /></div>
        </div>
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } } @keyframes fillWidth { from { width: 0%; } to { width: 100%; } }`}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-card rounded-lg p-8 md:p-12 max-w-2xl w-full" style={{ animation: 'fadeSlideUp 0.6s ease-out' }}>
        <button onClick={() => navigate('/')} className="mb-8 flex items-center gap-2 text-gray-400 hover:text-whistle-white transition-colors"><Icons.ArrowLeft className="w-5 h-5" /><span>Back to Portal</span></button>
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-whistle-white mb-2">WELCOME TO THE WHISTLE STOP</h2>
          <p className="text-whistle-crimson font-display text-xl tracking-wider">CUSTOMER PORTAL</p>
          <p className="text-gray-400 mt-4 text-sm">Track your style, schedule with precision, and earn rewards.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div><label className="block text-xs font-bold tracking-widest text-gray-400 mb-2 uppercase">Full Name</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-field w-full" placeholder="Enter your full name" /></div>
          <div><label className="block text-xs font-bold tracking-widest text-gray-400 mb-2 uppercase">Mobile Number</label><input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="input-field w-full" placeholder="+1 (555) 000-0000" /></div>
          <div className="flex items-start gap-3 p-4 bg-whistle-crimson/10 border border-whistle-crimson/30 rounded-lg">
            <input type="checkbox" id="eliteCheck" checked={formData.elite} onChange={(e) => setFormData({...formData, elite: e.target.checked})} className="mt-1 w-4 h-4 accent-whistle-crimson cursor-pointer" />
            <label htmlFor="eliteCheck" className="text-sm cursor-pointer"><span className="text-whistle-white font-semibold">Join Elite membership for $5/month.</span><span className="text-gray-400 block text-xs mt-1">Unlock 10% off, priority booking, and exclusive flash sales.</span></label>
          </div>
          <div><label className="block text-xs font-bold tracking-widest text-gray-400 mb-2 uppercase">Create Password</label><input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="input-field w-full" placeholder="••••••••" /></div>
          <button type="submit" className="btn-primary">COMPLETE CUSTOMER PROFILE</button>
        </form>
        <style>{`@keyframes fadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    </div>
  );
}

export default ClientAuth;
