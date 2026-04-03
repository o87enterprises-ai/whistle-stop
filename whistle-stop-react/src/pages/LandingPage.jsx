import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import BackgroundScene from '../components/BackgroundScene';
import ChairAvailabilityQueue from '../components/ChairAvailabilityQueue';

function BarberPole3D() {
  return (
    <div className="relative w-32 h-32 mx-auto">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-28 relative overflow-hidden rounded-full border-2 border-gray-600" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(4px)' }}>
          <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(45deg, #dc2626, #dc2626 8px, #f5f5f5 8px, #f5f5f5 16px, #1a1a1a 16px, #1a1a1a 24px)', animation: 'barberSlide 2s linear infinite' }} />
        </div>
        <div className="absolute -top-1 w-16 h-4 bg-gradient-to-b from-gray-300 to-gray-500 rounded-t-full" />
        <div className="absolute -bottom-1 w-16 h-4 bg-gradient-to-b from-gray-500 to-gray-300 rounded-b-full" />
      </div>
      <style>{`@keyframes barberSlide { 0% { background-position: 0 0; } 100% { background-position: 0 100%; } }`}</style>
    </div>
  );
}

function LandingPage() {
  const { navigate, appointments, Icons, bgImages } = useApp();
  const [progress, setProgress] = useState(0);
  useEffect(() => { const t = setTimeout(() => setProgress(65), 500); return () => clearTimeout(t); }, []);

  return (
    <>
      <BackgroundScene bgImages={bgImages} />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-12">
        <div style={{ animation: 'fadeSlideUp 0.8s ease-out' }}>
          <BarberPole3D />
          <h1 className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-whistle-white text-center mt-4 md:mt-6 mb-3 md:mb-4">THE WHISTLE STOP</h1>
          <p className="text-sm md:text-base lg:text-lg text-gray-400 max-w-2xl mx-auto text-center font-light leading-relaxed px-2">A modern companion for classic craftsmanship. Experience precision grooming, or manage your craft, from one central platform.</p>
          <p className="text-xs text-gray-600 mt-3 md:mt-4 tracking-widest uppercase text-center">(Select your path below to begin)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto my-8 md:my-12 w-full px-2 md:px-4" style={{ animation: 'fadeSlideUp 0.8s ease-out 0.2s both' }}>
          <button onClick={() => navigate('/client/dashboard')} className="group relative bg-whistle-white text-whistle-black p-6 md:p-12 rounded-lg text-left overflow-hidden hover:-translate-y-1 transition-all duration-400 hover:shadow-2xl hover:shadow-whistle-crimson/20">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3 md:mb-4"><span className="font-display text-xl sm:text-3xl md:text-4xl font-bold tracking-wider">FOR CLIENTS</span><Icons.ArrowRight className="w-6 h-6 md:w-8 md:h-8 transform group-hover:translate-x-2 transition-transform" /></div>
              <p className="text-xs md:text-sm text-gray-600 font-medium">Schedule, join the Elite program, track your history.</p>
              <div className="mt-4 md:mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-xs font-bold tracking-widest text-whistle-crimson">ENTER CLIENT PORTAL</span><div className="h-px w-12 bg-whistle-crimson" /></div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-whistle-crimson transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </button>
          <button onClick={() => navigate('/admin/dashboard')} className="group relative bg-whistle-crimson text-whistle-white p-6 md:p-12 rounded-lg text-left overflow-hidden hover:-translate-y-1 transition-all duration-400 hover:shadow-2xl hover:shadow-whistle-crimson/40">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3 md:mb-4"><span className="font-display text-xl sm:text-3xl md:text-4xl font-bold tracking-wider">FOR ADMINS</span><Icons.ArrowRight className="w-6 h-6 md:w-8 md:h-8 transform group-hover:translate-x-2 transition-transform" /></div>
              <p className="text-xs md:text-sm text-red-100 font-medium">Manage your team, track revenue, set flash sales.</p>
              <div className="mt-4 md:mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-xs font-bold tracking-widest text-whistle-white">ENTER ADMIN DASHBOARD</span><div className="h-px w-12 bg-whistle-white" /></div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-whistle-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </button>
        </div>

        <div className="max-w-3xl mx-auto mb-8 w-full px-2 md:px-4" style={{ animation: 'fadeSlideUp 0.8s ease-out 0.4s both' }}>
          <ChairAvailabilityQueue />
        </div>

        <div className="text-center max-w-2xl mx-auto" style={{ animation: 'fadeSlideUp 0.8s ease-out 0.6s both' }}>
          <h3 className="font-display text-2xl tracking-wider mb-4 text-whistle-white">JOIN THE ELITE <span className="text-whistle-crimson">(Preview)</span></h3>
          <p className="text-gray-400 mb-6">Skip the queue and unlock exclusive benefits.</p>
          <div className="glass-card rounded-lg p-6 inline-block text-left">
            <p className="text-sm font-bold text-whistle-white mb-4">Just $5 / Month Includes:</p>
            {['10% OFF EVERY SERVICE', 'PRIORITY BOOKING ACCESS', 'EXCLUSIVE FLASH SALES'].map((item) => (
              <div key={item} className="flex items-center gap-2 mb-2 text-sm text-gray-300">
                <svg className="w-4 h-4 text-whistle-crimson" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                <span className="font-semibold text-whistle-white">{item}</span>
              </div>
            ))}
            <p className="text-xs text-gray-500 mt-4 italic">Click 'FOR CLIENTS' above to join.</p>
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeSlideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </>
  );
}

export default LandingPage;
