import { useState } from 'react';
import { useApp } from '../context/AppContext';

function ShoppingCart() {
  const { cart, removeFromCart, clearCart, cartTotal, showCart, setShowCart, paymentState, startCartPayment, closePayment, Icons } = useApp();

  if (!showCart) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4" onClick={() => setShowCart(false)}>
      <div className="glass-card p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} style={{ animation: 'fadeIn 0.3s ease-out' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-bold flex items-center gap-2"><Icons.ShoppingCart className="w-5 h-5 text-whistle-crimson" /> YOUR CART</h3>
          <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-whistle-white"><Icons.X className="w-5 h-5" /></button>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Icons.ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-sm">Your cart is empty</p>
            <p className="text-xs mt-1">Browse the shop to add items</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {cart.map(item => (
                <div key={item.cartId} className="flex items-center justify-between py-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-whistle-grey/50 rounded flex items-center justify-center"><Icons.Gift className="w-5 h-5 text-gray-500" /></div>
                    <div><p className="text-sm font-medium">{item.name}</p><p className="text-xs text-gray-500">{item.desc}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">${item.price.toFixed(2)}</span>
                    <button onClick={() => removeFromCart(item.cartId)} className="text-gray-500 hover:text-whistle-crimson"><Icons.Trash className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between py-3 border-t border-white/10 mb-4">
              <span className="font-bold">TOTAL</span>
              <span className="font-bold text-xl text-whistle-crimson">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex gap-3">
              <button onClick={clearCart} className="flex-1 bg-whistle-grey py-3 rounded font-medium hover:bg-whistle-charcoal transition-colors text-sm">CLEAR</button>
              <button onClick={startCartPayment} className="flex-1 bg-whistle-crimson py-3 rounded font-bold hover:bg-whistle-red transition-colors text-sm">CHECKOUT</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PaymentModal() {
  const { paymentState, closePayment, completePayment, Icons } = useApp();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [processing, setProcessing] = useState(false);

  if (paymentState.step !== 'payment') return null;

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
      setProcessing(false);
    }, 2000);
  };

  if (paymentState.step === 'receipt' && paymentState.receipt) {
    const r = paymentState.receipt;
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4" onClick={closePayment}>
        <div className="glass-card p-8 max-w-md w-full text-center" onClick={(e) => e.stopPropagation()} style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"><Icons.Check className="w-8 h-8 text-white" /></div>
          <h3 className="font-display text-2xl font-bold mb-2">PAYMENT CONFIRMED</h3>
          <p className="text-sm text-gray-400 mb-6">Your transaction has been processed successfully.</p>
          <div className="bg-whistle-grey/30 rounded-lg p-4 text-left mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Transaction ID</span><span className="font-mono text-xs">{r.id}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Date</span><span>{r.date}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Method</span><span>{r.method} •••• {r.last4}</span></div>
              <div className="border-t border-white/10 pt-2">
                {r.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-1"><span>{item.name || item}</span><span>${(item.price || 0).toFixed(2)}</span></div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-whistle-crimson pt-2 border-t border-white/10">
                <span>TOTAL</span><span>${r.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <button onClick={closePayment} className="btn-crimson">DONE</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4" onClick={closePayment}>
      <div className="glass-card p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()} style={{ animation: 'fadeIn 0.3s ease-out' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-bold flex items-center gap-2"><Icons.Lock className="w-5 h-5 text-whistle-crimson" /> SECURE PAYMENT</h3>
          <button onClick={closePayment} className="text-gray-400 hover:text-whistle-white"><Icons.X className="w-5 h-5" /></button>
        </div>

        <div className="bg-whistle-grey/30 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center"><span className="text-sm text-gray-400">Amount Due</span><span className="text-2xl font-bold text-whistle-crimson">${paymentState.orderTotal.toFixed(2)}</span></div>
        </div>

        {processing ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-whistle-grey border-t-whistle-crimson rounded-full animate-spin mx-auto mb-4" />
            <p className="font-medium">Processing Payment...</p>
            <p className="text-xs text-gray-500 mt-1">Please do not close this window</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-400 mb-2 uppercase">Cardholder Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="input-field w-full" placeholder="JOHN DOE" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-400 mb-2 uppercase">Card Number</label>
              <div className="relative">
                <Icons.CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" required value={cardNumber} onChange={(e) => setCardNumber(formatCard(e.target.value))} className="input-field w-full pl-10" placeholder="4242 4242 4242 4242" maxLength="19" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-400 mb-2 uppercase">Expiry</label>
                <input type="text" required value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} className="input-field w-full" placeholder="MM/YY" maxLength="5" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-400 mb-2 uppercase">CVV</label>
                <input type="text" required value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} className="input-field w-full" placeholder="123" maxLength="4" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
              <Icons.Lock className="w-3 h-3" /><span>256-bit SSL encrypted payment</span>
            </div>
            <button type="submit" className="btn-crimson flex items-center justify-center gap-2">
              <Icons.Lock className="w-4 h-4" /> PAY ${paymentState.orderTotal.toFixed(2)}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export { ShoppingCart, PaymentModal };
