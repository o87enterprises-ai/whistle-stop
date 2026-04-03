import { useState } from 'react';
import { useApp } from '../context/AppContext';

function ChairAvailabilityQueue() {
  const { chairQueue, joinChairQueue, notifyPhone, notifications, setShowNotifications, unreadCount, Icons } = useApp();
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinData, setJoinData] = useState({ name: '', phone: '', service: 'Taper Cut' });
  const [joined, setJoined] = useState(false);
  const [showNotifyPanel, setShowNotifyPanel] = useState(false);

  const statusColors = {
    'in-progress': 'bg-yellow-500',
    available: 'bg-green-500',
    waiting: 'bg-blue-500',
    ready: 'bg-whistle-crimson',
  };

  const statusLabels = {
    'in-progress': 'IN USE',
    available: 'AVAILABLE',
    waiting: 'WAITING',
    ready: 'READY',
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!joinData.name || !joinData.phone) return;
    const result = joinChairQueue(joinData);
    if (result) {
      setJoined(true);
      notifyPhone(joinData.phone, `You've been added to the queue for ${joinData.service}. We'll notify you when your chair is ready.`);
    }
  };

  const availableCount = chairQueue.filter(c => c.status === 'available').length;

  return (
    <>
      {/* Notification Bell */}
      <div className="fixed top-4 right-4 z-[60] flex items-center gap-2">
        <button
          onClick={() => setShowNotifyPanel(!showNotifyPanel)}
          className="relative bg-whistle-charcoal/90 backdrop-blur-xl border border-white/10 rounded-full p-3 hover:bg-whistle-grey transition-colors"
          title="Notifications"
        >
          {showNotifyPanel ? <Icons.BellOff className="w-5 h-5" /> : <Icons.Bell className="w-5 h-5" />}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-whistle-crimson rounded-full text-xs flex items-center justify-center font-bold animate-pulse">{unreadCount}</span>
          )}
        </button>
      </div>

      {/* Notification Panel */}
      {showNotifyPanel && (
        <div className="fixed top-16 right-4 z-[60] w-80 md:w-96 glass-card max-h-[70vh] overflow-y-auto" style={{ animation: 'fadeIn 0.2s ease-out' }}>
          <div className="p-4 flex items-center justify-between border-b border-white/10">
            <h3 className="font-display font-bold text-sm">NOTIFICATIONS</h3>
            <button onClick={() => { setShowNotifyPanel(false); }} className="text-gray-400 hover:text-whistle-white"><Icons.X className="w-4 h-4" /></button>
          </div>
          <div className="divide-y divide-white/5">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">No notifications</div>
            ) : (
              notifications.map(n => (
                <div key={n.id} className={`p-4 ${n.read ? 'opacity-50' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${n.type === 'chair-ready' ? 'bg-whistle-crimson' : n.type === 'payment' ? 'bg-green-500' : n.type === 'sms' ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{n.title}</p>
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

      {/* Chair Queue Section */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-sm font-bold tracking-wider flex items-center gap-2">
            <Icons.Wifi className="w-4 h-4 text-whistle-crimson" /> CHAIR AVAILABILITY
          </h3>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-green-400">{availableCount} OPEN</span>
          </div>
        </div>

        {/* Chair List */}
        <div className="space-y-2 mb-4">
          {chairQueue.map(chair => (
            <div key={chair.id} className="flex items-center justify-between py-2.5 px-3 bg-whistle-grey/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${statusColors[chair.status]} ${chair.status === 'ready' ? 'animate-pulse' : ''}`} />
                <div>
                  <p className="text-xs font-bold">{chair.chair}</p>
                  <p className="text-[10px] text-gray-500">{chair.barber}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  chair.status === 'available' ? 'bg-green-500/20 text-green-400' :
                  chair.status === 'ready' ? 'bg-whistle-crimson/20 text-whistle-crimson' :
                  chair.status === 'waiting' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>{statusLabels[chair.status]}</span>
                {chair.eta && <p className="text-[10px] text-gray-500 mt-0.5">{chair.eta}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Join Queue Form */}
        {!joined ? (
          showJoinForm ? (
            <form onSubmit={handleJoin} className="space-y-3">
              <input type="text" value={joinData.name} onChange={(e) => setJoinData({...joinData, name: e.target.value})} className="input-field w-full text-sm py-2" placeholder="Your Name" required />
              <input type="tel" value={joinData.phone} onChange={(e) => setJoinData({...joinData, phone: e.target.value})} className="input-field w-full text-sm py-2" placeholder="Phone for SMS notification" required />
              <select value={joinData.service} onChange={(e) => setJoinData({...joinData, service: e.target.value})} className="input-field w-full text-sm py-2">
                {['Taper Cut','Fade','Beard Trim','Classic Cut','Hot Towel Shave','Line Up','Pompadour','Buzz Cut'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowJoinForm(false)} className="flex-1 bg-whistle-grey py-2 rounded text-sm font-medium hover:bg-whistle-charcoal transition-colors">CANCEL</button>
                <button type="submit" className="flex-1 bg-whistle-crimson py-2 rounded text-sm font-bold hover:bg-whistle-red transition-colors">JOIN QUEUE</button>
              </div>
              <p className="text-[10px] text-gray-500 text-center">You'll receive an SMS when your chair is ready</p>
            </form>
          ) : (
            <button onClick={() => setShowJoinForm(true)} className="w-full bg-whistle-grey/50 hover:bg-whistle-crimson py-2.5 rounded text-sm font-bold transition-colors flex items-center justify-center gap-2">
              <Icons.UserPlus className="w-4 h-4" /> JOIN THE QUEUE
            </button>
          )
        ) : (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
            <Icons.Check className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-green-400">YOU'RE IN THE QUEUE!</p>
            <p className="text-xs text-gray-400 mt-1">We'll notify you via SMS when your chair is ready</p>
            <p className="text-xs text-whistle-crimson font-bold mt-2">~15 min estimated wait</p>
          </div>
        )}
      </div>
    </>
  );
}

export default ChairAvailabilityQueue;
