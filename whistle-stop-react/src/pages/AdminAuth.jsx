import { useState } from 'react';
import { useApp } from '../context/AppContext';

function AdminAuth() {
  const { navigate, login, Icons } = useApp();
  const [step, setStep] = useState(1);
  const [licenseId, setLicenseId] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleVerify = () => { if (licenseId && password) setStep(2); };
  const handleActivate = () => {
    setSuccess(true);
    setTimeout(() => { login({ name: 'Alex Alex', role: 'admin' }, true); navigate('/admin/dashboard'); }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass-card rounded-lg p-12 max-w-md w-full text-center" style={{ animation: 'fadeIn 0.5s ease-out' }}>
          <div className="w-16 h-16 bg-whistle-crimson rounded-full flex items-center justify-center mx-auto mb-4"><Icons.Check className="w-8 h-8 text-whistle-white" /></div>
          <h3 className="font-display text-2xl text-whistle-white mb-2">DASHBOARD ACTIVATED</h3>
          <p className="text-gray-400 mb-6">Loading admin interface...</p>
          <div className="w-full bg-whistle-grey rounded-full h-1 overflow-hidden"><div className="bg-whistle-crimson h-full rounded-full" style={{ animation: 'fillWidth 2s ease-out' }} /></div>
        </div>
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } } @keyframes fillWidth { from { width: 0%; } to { width: 100%; } }`}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-card rounded-lg p-8 md:p-12 max-w-3xl w-full" style={{ animation: 'fadeSlideUp 0.6s ease-out' }}>
        <button onClick={() => navigate('/')} className="mb-8 flex items-center gap-2 text-gray-400 hover:text-whistle-white transition-colors"><Icons.ArrowLeft className="w-5 h-5" /><span>Back to Portal</span></button>
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-whistle-white mb-2">SECURE ADMIN ACCESS</h2>
          <p className="text-whistle-crimson font-display text-xl tracking-wider">& CONFIGURATION</p>
          <p className="text-gray-400 mt-4 text-sm">Verify your professional credentials to begin managing The Whistle Stop.</p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="border-l-2 border-whistle-crimson pl-4 mb-8"><h3 className="font-display text-lg text-whistle-white mb-1">STEP 1: ADMIN CREDENTIALS</h3><p className="text-xs text-gray-500">Required for professional verification</p></div>
            <div><label className="block text-xs font-bold tracking-widest text-gray-400 mb-2 uppercase">Professional License ID</label><input type="text" required value={licenseId} onChange={(e) => setLicenseId(e.target.value)} className="input-field w-full" placeholder="LIC-XXXX-XXXX" /></div>
            <div><label className="block text-xs font-bold tracking-widest text-gray-400 mb-2 uppercase">Admin Password</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field w-full" placeholder="••••••••" /></div>
            <button onClick={handleVerify} className="btn-crimson">VERIFY ID</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="border-l-2 border-whistle-crimson pl-4 mb-8"><h3 className="font-display text-lg text-whistle-white mb-1">STEP 2: INITIALIZE SYSTEM</h3><p className="text-xs text-gray-500">Configure your shop settings</p></div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: <Icons.Users className="w-4 h-4" />, title: 'Add Your Barbers', desc: 'Name, Skills, Capacity' },
                { icon: <Icons.Clock className="w-4 h-4" />, title: 'Set Business Hours', desc: 'Operating schedule' },
                { icon: <Icons.CalendarSync className="w-4 h-4" />, title: 'Sync 3rd Party Calendars', desc: 'Google, Outlook, Apple Calendar integration', full: true },
              ].map((item, i) => (
                <div key={i} className={`p-4 border border-whistle-grey rounded hover:border-whistle-crimson transition-colors cursor-pointer group ${item.full ? 'md:col-span-2' : ''}`}>
                  <div className="flex items-center gap-3 mb-2"><div className="w-8 h-8 rounded bg-whistle-grey flex items-center justify-center group-hover:bg-whistle-crimson transition-colors">{item.icon}</div><span className="font-display text-whistle-white">{item.title}</span></div>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
            <button onClick={handleActivate} className="w-full border-2 border-whistle-grey text-whistle-crimson font-display font-bold text-lg tracking-wider py-4 rounded hover:border-whistle-crimson hover:bg-whistle-crimson hover:text-whistle-white transition-all">ACTIVATE MAIN DASHBOARD</button>
          </div>
        )}
        <style>{`@keyframes fadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    </div>
  );
}

export default AdminAuth;
