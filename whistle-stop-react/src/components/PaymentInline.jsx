import { useState } from 'react';
import { useApp } from '../context/AppContext';

function PaymentInline({ onComplete, total, booking }) {
  const { completePayment, Icons } = useApp();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const formatCard = (v) => {
    const cleaned = v.replace(/\D/g, '').slice(0, 16);
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };
  const formatExpiry = (v) => {
    const cleaned = v.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 2) return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    return cleaned;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      completePayment({ method: 'Credit Card', last4: cardNumber.replace(/\s/g, '').slice(-4) });
      setDone(true);
      setTimeout(() => onComplete(), 2000);
    }, 2000);
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"><Icons.Check className="w-7 h-7 text-white" /></div>
        <h4 className="font-display text-lg font-bold mb-2">PAYMENT CONFIRMED</h4>
        <p className="text-sm text-gray-400">Your booking is secured!</p>
        <div className="mt-3 w-32 mx-auto bg-whistle-grey rounded-full h-1.5 overflow-hidden"><div className="bg-green-500 h-full rounded-full" style={{ animation: 'fillWidth 2s ease-out' }} /></div>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="text-center py-8">
        <div className="w-10 h-10 border-4 border-whistle-grey border-t-whistle-crimson rounded-full animate-spin mx-auto mb-3" />
        <p className="font-medium text-sm">Processing Payment...</p>
        <p className="text-xs text-gray-500 mt-1">Please do not close</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-[10px] font-bold tracking-widest text-gray-400 mb-1 uppercase">Cardholder Name</label>
        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="input-field w-full text-sm py-2" placeholder="JOHN DOE" />
      </div>
      <div>
        <label className="block text-[10px] font-bold tracking-widest text-gray-400 mb-1 uppercase">Card Number</label>
        <div className="relative">
          <Icons.CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" required value={cardNumber} onChange={(e) => setCardNumber(formatCard(e.target.value))} className="input-field w-full pl-10 text-sm py-2" placeholder="4242 4242 4242 4242" maxLength="19" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold tracking-widest text-gray-400 mb-1 uppercase">Expiry</label>
          <input type="text" required value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} className="input-field w-full text-sm py-2" placeholder="MM/YY" maxLength="5" />
        </div>
        <div>
          <label className="block text-[10px] font-bold tracking-widest text-gray-400 mb-1 uppercase">CVV</label>
          <input type="text" required value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} className="input-field w-full text-sm py-2" placeholder="123" maxLength="4" />
        </div>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-gray-500">
        <Icons.Lock className="w-3 h-3" /><span>256-bit SSL encrypted</span>
      </div>
      <button type="submit" className="btn-crimson flex items-center justify-center gap-2 text-sm py-3">
        <Icons.Lock className="w-4 h-4" /> PAY ${total.toFixed(2)}
      </button>
    </form>
  );
}

export default PaymentInline;
