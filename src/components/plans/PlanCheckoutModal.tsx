import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Smartphone, QrCode, AlertTriangle, Sparkles } from 'lucide-react';
import type { SubscriptionPlan } from '../../types';

import { useAuth } from '../../context/AuthContext';

interface PlanCheckoutModalProps {
  plan: SubscriptionPlan | null;
  billingCycle: 'monthly' | 'yearly';
  isOpen: boolean;
  onClose: () => void;
}

export const PlanCheckoutModal: React.FC<PlanCheckoutModalProps> = ({
  plan,
  billingCycle,
  isOpen,
  onClose,
}) => {
  const { updatePlan } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !plan) return null;

  const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      updatePlan(plan.name as 'Mobile' | 'Standard' | 'Max', billingCycle);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-[170] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Demo Plan Checkout"
    >
      <div
        className="relative w-full max-w-lg bg-[#091526] rounded-3xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-6 sm:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          aria-label="Cancel Checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Demo Warning Banner */}
        <div className="mb-6 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Simulated Sandbox Checkout: </span>
            <span>No real charges will occur. This is a demonstration of the HotstarX plan subscription workflow.</span>
          </div>
        </div>

        {/* Order Summary Header */}
        <div className="flex items-start justify-between pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs uppercase font-black tracking-wider text-cyan-400">
                HotstarX {plan.name}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">
              {billingCycle === 'yearly' ? 'Annual Subscription' : 'Monthly Subscription'}
            </h3>
            <span className="text-xs text-slate-400">
              {plan.resolution} • {plan.simultaneousScreens} Screen{plan.simultaneousScreens > 1 ? 's' : ''}
            </span>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-white font-mono">₹{price}</span>
            <span className="text-xs text-slate-400 block">
              /{billingCycle === 'yearly' ? 'year' : 'month'}
            </span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="my-5 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Select Demo Payment Method
          </label>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setPaymentMethod('upi')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                paymentMethod === 'upi'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-[#06101c] border-white/10 text-slate-300 hover:bg-white/5'
              }`}
            >
              <QrCode className="w-5 h-5" />
              <span>UPI / QR</span>
            </button>

            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                paymentMethod === 'card'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-[#06101c] border-white/10 text-slate-300 hover:bg-white/5'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span>Cards</span>
            </button>

            <button
              onClick={() => setPaymentMethod('netbanking')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                paymentMethod === 'netbanking'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-[#06101c] border-white/10 text-slate-300 hover:bg-white/5'
              }`}
            >
              <Smartphone className="w-5 h-5" />
              <span>NetBanking</span>
            </button>
          </div>

          {/* Simulated Input */}
          {paymentMethod === 'upi' && (
            <div className="pt-2">
              <label className="text-xs text-slate-400 block mb-1">Demo UPI Virtual ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full bg-[#06101c] text-white text-sm px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-400"
              />
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="pt-2 space-y-2">
              <input
                type="text"
                disabled
                value="•••• •••• •••• 4242 (Demo Test Card)"
                className="w-full bg-[#06101c] text-slate-400 text-sm px-4 py-2.5 rounded-xl border border-white/10 cursor-not-allowed font-mono"
              />
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleSimulatePayment}
          disabled={isProcessing}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-cyan-500/25 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              <span>Processing Simulated Payment...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Simulate Pay ₹{price} & Activate Plan</span>
            </>
          )}
        </button>

        {/* Security Footnote */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-500 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-bit encrypted simulated environment • Ready for Stripe/Razorpay backend</span>
        </div>
      </div>
    </div>
  );
};
