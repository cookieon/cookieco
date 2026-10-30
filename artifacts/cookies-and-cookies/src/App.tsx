import { type ReactNode, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import AdminPage from '@/pages/Admin';
import LandingPage from '@/pages/Landing';
import { supabase } from '@/lib/supabase';
import {
  ArrowRight, Check, ChevronLeft, Clock3, Download, Gift, Heart,
  Instagram, MapPin, Menu as MenuIcon, Minus, Plus, ShoppingBag,
  Store, Truck, X, Settings, Trash2, CircleHelp
} from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

import redVelvetPhoto from '@assets/generated_images/red-velvet-cookie.jpg';
import alpinoBlackPhoto from '@assets/generated_images/alpino-black-cookie.jpg';
import kinderBuenoPhoto from '@assets/generated_images/kinder-bueno-cookie.jpg';
import ccLogo from '@assets/generated_images/cc-logo-no-bg.png';
import halloweenLogoAsset from '@assets/generated_images/halloween-logo-no-bg.png';
const halloweenLogo = halloweenLogoAsset || '/halloween-logo-no-bg.png';
import {
  IS_HALLOWEEN,
  SpiderWebs,
  WitchHat,
  FloatingGhost,
  FloatingBats,
  HalloweenBadge,
} from '@/components/HalloweenTheme';

import lifestyleRedVelvet from '@assets/generated_images/lifestyle_red_velvet.jpg';
import lifestyleAlpinoBlack from '@assets/generated_images/lifestyle_alpino_black.jpg';
import lifestyleKinderBueno from '@assets/generated_images/lifestyle_kinder_bueno.jpg';

const queryClient = new QueryClient();
const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

type Product = {
  id: string;
  name: string;
  descriptor: string;
  price: number;
  tag?: string;
  image: string;
};
type CartItem = Product & { quantity: number; custom?: boolean };

// ==========================================
// DATA HOOKS
// ==========================================
function useStoreConfig() {
  return useQuery({
    queryKey: ['config'],
    queryFn: async () => {
      const { data, error } = await supabase.from('store_config').select('*').single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || { 
        whatsapp_number: '5566992292676', 
        instagram_url: 'https://instagram.com/cookiesecookiesbg', 
        location_url: 'https://maps.app.goo.gl/nJj1VYYCerozeAod7', 
        location_address: 'R. Conrado Souza Lira, Qd 01 Lote 06 e 07 - Rainha de Fátima, Barra do Garças - MT, 78603-810', 
        is_open: true 
      };
    }
  });
}

function useMuralPhotos() {
  return useQuery({
    queryKey: ['mural'],
    queryFn: async () => {
      const { data, error } = await supabase.from('mural_photos').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });
}

function Logo({ className = '', light = false }: { className?: string; light?: boolean }) {
  if (IS_HALLOWEEN) {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <img
          src={halloweenLogo}
          alt="Cookies & Cookies Halloween Logo"
          className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_4px_16px_rgba(255,117,24,0.5)]"
        />
        <div className={`font-display text-xl font-bold leading-none ${light ? 'text-[hsl(35_43%_94%)]' : 'text-[hsl(346_48%_26%)]'}`}>
          Cookies<br /><span className="text-[10px] tracking-[.15em] opacity-80">& Cookies</span>
        </div>
      </div>
    );
  }
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full shadow-md">
        <img src={ccLogo} alt="Cookies & Cookies Logo" className="h-full w-full object-cover scale-[1.3] translate-y-[2px]" />
      </div>
      <div className={`font-display text-xl font-bold leading-none ${light ? 'text-[hsl(35_43%_94%)]' : 'text-[hsl(346_48%_26%)]'}`}>Cookies<br /><span className="text-[10px] tracking-[.15em] opacity-80">& Cookies</span></div>
    </div>
  );
}

function TopBanner() {
  const [visible, setVisible] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!visible) return null;
  return (
    <div className="bg-[#e9dcc9] text-[hsl(346_48%_26%)] px-4 py-2 flex items-center justify-between z-50 relative shadow-md">
      <div className="flex items-center gap-3">
        <button onClick={() => setVisible(false)} className="w-5 h-5 rounded-full bg-black/5 flex items-center justify-center text-[hsl(346_48%_26%)]/60 hover:bg-black/10"><X size={12} /></button>
        <div className="flex items-center gap-2">
          <img src={IS_HALLOWEEN ? halloweenLogo : ccLogo} className={IS_HALLOWEEN ? "w-7 h-7 object-contain" : "w-6 h-6 rounded-full object-cover bg-white shadow-sm"} alt="Logo" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider leading-tight">{IS_HALLOWEEN ? "🎃 EDIÇÃO DE HALLOWEEN" : "INSTALE NOSSO APP"}</span>
            <span className="text-[9px] font-medium opacity-80 leading-tight">{IS_HALLOWEEN ? "Fornadas temáticas por tempo limitado!" : "Experiência VIP e rápida"}</span>
          </div>
        </div>
      </div>
      {deferredPrompt ? (
        <button onClick={async () => {
          if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
              setDeferredPrompt(null);
              setVisible(false);
            }
          }
        }} className="bg-[hsl(346_48%_26%)] text-[#e9dcc9] px-4 py-1.5 rounded-full flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest shadow-md hover:scale-105 transition-transform"><Download size={12} /> BAIXAR</button>
      ) : (
        <div className="text-[9px] font-bold leading-tight opacity-70 text-right w-[110px]">Use o menu do navegador para baixar</div>
      )}
    </div>
  );
}

// ==========================================
// CART & CHECKOUT
// ==========================================
function Quantity({ quantity, onIncrease, onDecrease }: { quantity: number; onIncrease: () => void; onDecrease: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-full bg-black/10 px-2 py-1">
      <button onClick={onDecrease} className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[hsl(346_48%_26%)] shadow-sm transition-transform hover:scale-110"><Minus size={12} /></button>
      <span className="w-4 text-center text-sm font-bold text-white">{quantity}</span>
      <button onClick={onIncrease} className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e9dcc9] text-[hsl(346_48%_26%)] shadow-sm transition-transform hover:scale-110"><Plus size={12} strokeWidth={3} /></button>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-wider text-[hsl(346_48%_26%)]">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 h-12 w-full rounded-sm border border-[hsl(346_48%_26%)/.2] bg-white px-4 text-sm text-[hsl(346_48%_26%)] placeholder:text-[hsl(346_48%_26%)/.4] focus:border-[hsl(346_48%_26%)] focus:outline-none" />
    </label>
  );
}

function CartDrawer({ items, open, onClose, onUpdate, onCheckout }: { items: CartItem[]; open: boolean; onClose: () => void; onUpdate: (id: string, delta: number) => void; onCheckout: () => void }) {
  const { data: config } = useStoreConfig();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-y-0 right-0 z-[110] flex w-full max-w-md flex-col bg-[hsl(346_48%_26%)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 className="font-display text-2xl text-[#e9dcc9]">Sua Sacola</h2>
              <button onClick={onClose} className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center opacity-50">
                  <ShoppingBag size={48} className="mb-4 text-[#e9dcc9]" />
                  <p className="text-sm text-white">Sua sacola está vazia.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <img src={item.image} className="h-[80px] w-[80px] rounded-[1.5rem] object-cover shadow-md border border-white/10" alt="" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <h3 className="font-display text-lg text-white leading-tight">{item.name}</h3>
                          <button onClick={() => onUpdate(item.id, -item.quantity)} className="text-[10px] uppercase text-white/50 hover:text-white"><Trash2 size={14}/></button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                           <Quantity quantity={item.quantity} onDecrease={() => onUpdate(item.id, -1)} onIncrease={() => onUpdate(item.id, 1)} />
                           <span className="font-bold text-[#e9dcc9]">{money(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="bg-black/20 p-6 border-t border-white/10">
                <div className="flex justify-between text-lg mb-4 text-white">
                  <span>Total</span>
                  <span className="font-bold text-[#e9dcc9]">{money(total)}</span>
                </div>
                <p className="text-center text-xs text-[#e9dcc9]/80 mb-4 font-medium tracking-wide">Aberto a partir das 13:00</p>
                <button disabled={!config?.is_open} onClick={onCheckout} className="w-full py-4 rounded-full bg-[#e9dcc9] text-[hsl(346_48%_26%)] font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_10px_25px_rgba(233,220,201,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
                  {config?.is_open ? <>Continuar pedido <ArrowRight size={16} /></> : 'Loja Fechada no Momento'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


// ==========================================
// GEOLOCATION & DISTANCE
// ==========================================
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function calculateDeliveryFee(distanceKm: number) {
  if (distanceKm <= 1.2) return 7.00;
  if (distanceKm <= 2.9) return 8.00;
  if (distanceKm <= 4.9) return 9.00;
  if (distanceKm <= 6.9) return 11.00;
  if (distanceKm <= 8.9) return 13.00;
  if (distanceKm <= 11.9) return 15.00;
  if (distanceKm <= 14.9) return 18.00;
  return 25.00; // Acima de 15 KM
}

function Checkout({ items, onClose, onDone }: { items: CartItem[]; onClose: () => void; onDone: () => void }) {
  const [mode, setMode] = useState<'delivery' | 'pickup'>('delivery');
  const [form, setForm] = useState({ name: '', phone: '', complement: '', address: '', number: '', isGift: false, giftTo: '', giftMessage: '' });
  
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{name: string, discount: number} | null>(null);

  const { data: dbCoupons = [] } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const { data, error } = await supabase.from('store_coupons').select('*');
      if (error && error.code !== '42P01') throw error;
      return data || [];
    }
  });

  const { data: config } = useStoreConfig();
  
  const change = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));
  
  // Delivery address logic
  const STORE_LAT = -15.867931;
  const STORE_LNG = -52.276574;
  
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);

  useEffect(() => {
    if (userLocation) {
      setIsCalculatingDistance(true);
      fetch(`https://router.project-osrm.org/route/v1/driving/${STORE_LNG},${STORE_LAT};${userLocation.lng},${userLocation.lat}?overview=false`)
        .then(r => r.json())
        .then(data => {
          if (data.routes && data.routes.length > 0) {
            setDistanceKm(data.routes[0].distance / 1000);
          } else {
            setDistanceKm(getDistanceFromLatLonInKm(STORE_LAT, STORE_LNG, userLocation.lat, userLocation.lng));
          }
        })
        .catch(() => {
          setDistanceKm(getDistanceFromLatLonInKm(STORE_LAT, STORE_LNG, userLocation.lat, userLocation.lng));
        })
        .finally(() => setIsCalculatingDistance(false));
    } else {
      setDistanceKm(null);
    }
  }, [userLocation]);
  
  const handleApplyCoupon = () => {
    if (dbCoupons && dbCoupons.length > 0) {
      const found = dbCoupons.find((c) => c.name === couponCode.toUpperCase());
      if (found) {
        setAppliedCoupon(found);
      } else {
        alert("Cupom inválido ou não encontrado.");
        setAppliedCoupon(null);
      }
    } else {
       alert("Nenhum cupom disponível no momento.");
    }
  };

  let distance = distanceKm || 0;
  let deliveryFee = distanceKm !== null ? calculateDeliveryFee(distanceKm) : 0;

  const valid = form.name && form.phone && (mode === 'pickup' || (mode === 'delivery' && userLocation && distanceKm !== null && !isCalculatingDistance));
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discount / 100) : 0;
  const total = subtotal - discountAmount + (mode === 'delivery' ? deliveryFee : 0);

  const requestLocation = () => {
    setIsLocating(true);
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocalização não suportada pelo seu navegador.');
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        if (err.code === 1) setLocationError('Permissão negada. Por favor, libere o acesso à localização.');
        else setLocationError('Não foi possível obter sua localização. Tente novamente.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleConfirm = () => {
    if (!valid || !config) return;
    
    let orderText = `*NOVO PEDIDO* %0A%0A`;
    orderText += `*Cliente:* ${form.name}%0A`;
    orderText += `*WhatsApp:* ${form.phone}%0A`;
    orderText += `*Tipo:* ${mode === 'delivery' ? 'Delivery' : 'Retirada'}%0A`;
    
    if (mode === 'delivery') {
      orderText += `*Distância:* ${distance.toFixed(1)} km%0A`;
      if (form.address || form.number) {
         orderText += `*Endereço:* ${form.address}, ${form.number}%0A`;
      }
      if (form.complement) {
         orderText += `*Complemento:* ${form.complement}%0A`;
      }
      orderText += `*Localização GPS:* https://maps.google.com/?q=${userLocation?.lat},${userLocation?.lng}%0A%0A`;
    } else {
      orderText += `%0A`;
    }
    
    orderText += `*Itens:*%0A`;
    items.forEach(item => {
      orderText += `${item.quantity}x ${item.name} (R$ ${(item.price * item.quantity).toFixed(2)})%0A`;
    });
    
    orderText += `%0A*Subtotal:* R$ ${subtotal.toFixed(2)}%0A`;
    if (appliedCoupon) {
      orderText += `*Desconto (${appliedCoupon.name}):* -R$ ${discountAmount.toFixed(2)}%0A`;
    }
    if (mode === 'delivery') {
      orderText += `*Taxa de entrega:* R$ ${deliveryFee.toFixed(2)}%0A`;
    }
    orderText += `*TOTAL:* R$ ${total.toFixed(2)}%0A`;
    
    if (form.isGift) {
      orderText += `%0A*🎁 É UM PRESENTE!*%0A`;
      orderText += `*De:* ${form.name}%0A`;
      orderText += `*Para:* ${form.giftTo}%0A`;
      if (form.giftMessage) orderText += `*Mensagem:* ${form.giftMessage}%0A`;
    }
    
    orderText += `%0A%0A`;
    orderText += `Gostaria de finalizar meu pedido!`;
    
    window.open(`https://wa.me/${config.whatsapp_number}?text=${orderText}`, '_blank');
    onDone();
  };

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto bg-[#e9dcc9]">
      <div className="mx-auto min-h-full max-w-5xl px-5 py-6 sm:px-8 sm:py-10">
        <div className="flex items-center justify-between border-b border-[hsl(346_48%_26%)/.2] pb-6">
          <Logo />
          <button onClick={onClose} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.14em] text-[hsl(346_48%_26%)] hover:opacity-70"><ChevronLeft size={16} /> Voltar à sacola</button>
        </div>
        
        <div className="grid gap-10 py-9 lg:grid-cols-[1fr_360px]">
          <main>
            <h2 className="text-2xl font-display font-bold text-[hsl(346_48%_26%)] mb-6">Como você quer receber?</h2>
            <div className="grid gap-4 sm:grid-cols-2 mb-10">
               <button onClick={() => { setMode('delivery'); setUserLocation(null); }} className={`flex items-start gap-4 rounded-xl border-2 p-5 text-left transition-colors ${mode === 'delivery' ? 'border-[hsl(346_48%_26%)] bg-[hsl(346_48%_26%)/.05]' : 'border-[hsl(346_48%_26%)/.1] bg-white'}`}>
                  <Truck size={24} className="mt-1 text-[hsl(346_48%_26%)] shrink-0" />
                  <div>
                    <strong className="block text-sm text-[hsl(346_48%_26%)] font-bold">Delivery</strong>
                    <small className="mt-1 block text-xs text-[hsl(346_48%_26%)]/70">Receba em casa, quentinho.</small>
                  </div>
               </button>
               <button onClick={() => setMode('pickup')} className={`flex items-start gap-4 rounded-xl border-2 p-5 text-left transition-colors ${mode === 'pickup' ? 'border-[hsl(346_48%_26%)] bg-[hsl(346_48%_26%)/.05]' : 'border-[hsl(346_48%_26%)/.1] bg-white'}`}>
                  <Store size={24} className="mt-1 text-[hsl(346_48%_26%)] shrink-0" />
                  <div>
                    <strong className="block text-sm text-[hsl(346_48%_26%)] font-bold">Retirada no local</strong>
                    <small className="mt-1 block text-xs text-[hsl(346_48%_26%)]/70">Rua Conrado Souza Lira, BG.</small>
                  </div>
               </button>
            </div>

            <h2 className="text-2xl font-display font-bold text-[hsl(346_48%_26%)] mb-6">Seus dados</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Seu nome" value={form.name} onChange={(v) => change('name', v)} placeholder="Como podemos te chamar?" />
              <Field label="WhatsApp" value={form.phone} onChange={(v) => change('phone', v)} placeholder="(66) 99999-0000" />
              
              {mode === 'delivery' && (
                <div className="sm:col-span-2 mt-4 bg-white p-6 rounded-xl border-2 border-[hsl(346_48%_26%)/.2]">
                   <h3 className="font-bold text-sm text-[hsl(346_48%_26%)] uppercase tracking-wider mb-2">Local de Entrega</h3>
                   <p className="text-xs text-[hsl(346_48%_26%)]/70 mb-6">Para calcularmos a taxa exata da sua entrega, precisamos que você nos envie sua localização atual.</p>
                   
                   {!userLocation ? (
                     <div className="flex flex-col gap-2">
                       <button onClick={requestLocation} disabled={isLocating} className="w-full py-4 rounded-full bg-[hsl(346_48%_26%)] text-[#e9dcc9] font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow-md transition-all disabled:opacity-50">
                         {isLocating ? 'Obtendo localização...' : <><MapPin size={16} /> Compartilhar minha localização</>}
                       </button>
                       {locationError && <span className="text-red-500 text-xs font-bold text-center mt-2">{locationError}</span>}
                     </div>
                   ) : (
                     <div className="flex flex-col gap-4">
                       <div className="flex items-center gap-3 bg-[hsl(346_48%_26%)/.05] p-3 rounded-lg border border-[hsl(346_48%_26%)/.2]">
                         {isCalculatingDistance ? (
                           <span className="text-sm font-bold text-[hsl(346_48%_26%)]">Calculando rota...</span>
                         ) : (
                           <>
                             <Check size={20} className="text-green-600 shrink-0" />
                             <span className="text-sm font-bold text-[hsl(346_48%_26%)]">Localização recebida! Distância: {distance.toFixed(1)} km</span>
                           </>
                         )}
                       </div>
                       <button onClick={requestLocation} className="text-xs font-bold underline text-[hsl(346_48%_26%)]/70 hover:text-[hsl(346_48%_26%)] self-start">Atualizar localização</button>
                       <div className="grid grid-cols-2 gap-4 mt-2">
                         <div className="col-span-2"><Field label="Rua / Bairro (Opcional)" value={form.address} onChange={(v) => change('address', v)} placeholder="Digite para ajudar o entregador" /></div>
                         <Field label="Número" value={form.number} onChange={(v) => change('number', v)} placeholder="000" />
                         <Field label="Complemento" value={form.complement} onChange={(v) => change('complement', v)} placeholder="Casa, Apto" />
                       </div>
                     </div>
                   )}
                </div>
              )}
            </div>
            
            <div className="mt-6 bg-[hsl(346_48%_26%)/.05] p-6 rounded-xl border-2 border-[hsl(346_48%_26%)/.1]">
                 <label className="flex items-center gap-3 cursor-pointer">
                   <input type="checkbox" checked={form.isGift} onChange={(e) => change('isGift', e.target.checked)} className="w-5 h-5 rounded border-2 border-[hsl(346_48%_26%)] text-[hsl(346_48%_26%)] focus:ring-[hsl(346_48%_26%)] bg-transparent" />
                   <span className="font-bold text-[hsl(346_48%_26%)] flex items-center gap-2"><Gift size={18} /> É para presente?</span>
                 </label>
                 
                 {form.isGift && (
                   <div className="grid gap-4 mt-6">
                      <Field label="Para quem é?" value={form.giftTo} onChange={(v) => change('giftTo', v)} placeholder="Nome do sortudo(a)" />
                      <Field label="Mensagem (Opcional)" value={form.giftMessage} onChange={(v) => change('giftMessage', v)} placeholder="Escreva um recadinho fofo..." />
                   </div>
                 )}
              </div>
            
            <button disabled={!valid || !config?.is_open} onClick={handleConfirm} className="mt-10 w-full py-5 rounded-full bg-[hsl(346_48%_26%)] text-[#e9dcc9] font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
              {config?.is_open ? <>Encaminhar Pedido <ArrowRight size={16} /></> : 'Fechado no momento'}
            </button>
          </main>
          
          <aside className="h-fit rounded-[2rem] bg-[hsl(346_48%_26%)] p-8 text-[#e9dcc9] lg:sticky lg:top-6 shadow-2xl">
             <p className="text-[10px] font-bold uppercase tracking-[.18em] text-white/50 mb-6">Resumo da sacola</p>
             <div className="space-y-4">
               {items.map(item => (
                 <div key={item.id} className="flex justify-between gap-4 text-sm font-medium">
                   <span>{item.quantity}x {item.name}</span>
                   <span className="whitespace-nowrap">{money(item.price * item.quantity)}</span>
                 </div>
               ))}
             </div>
             
             <div className="my-6 border-t border-white/10 pt-6">
               <label className="block text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Cupom de Desconto</label>
               <div className="flex gap-2">
                 <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Ex: COOKIES10" className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#e9dcc9] uppercase" />
                 <button onClick={handleApplyCoupon} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">Aplicar</button>
               </div>
               {appliedCoupon && (
                 <div className="mt-2 text-xs text-green-400 font-bold flex items-center gap-1">
                   <Check size={12} /> Cupom {appliedCoupon.name} aplicado! ({appliedCoupon.discount}% OFF)
                 </div>
               )}
             </div>

             <div className="my-6 border-t border-white/10" />
             <div className="flex justify-between text-base font-bold mb-3">
               <span className="text-white/80">Subtotal</span>
               <span className="text-white/80">{money(subtotal)}</span>
             </div>
             {appliedCoupon && (
               <div className="flex justify-between text-base font-bold mb-3">
                 <span className="text-white/80">Desconto</span>
                 <span className="text-green-400">-{money(discountAmount)}</span>
               </div>
             )}
             {mode === 'delivery' && (
               <div className="flex justify-between text-base font-bold mb-6">
                 <span className="text-white/80">Entrega</span>
                 <span className="text-white/80">{userLocation ? money(deliveryFee) : '--'}</span>
               </div>
             )}
             <div className="my-6 border-t border-white/10" />
             <div className="flex justify-between text-2xl font-bold">
               <span>Total</span>
               <span className="text-[#e9dcc9]">{money(total)}</span>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// HOME COMPONENTS
// ==========================================
function InlineOrderBuilder({ products, onAddToCart }: { products: Product[]; onAddToCart: (id: string, qty: number) => void }) {
  const [selections, setSelections] = useState<Record<string, number>>({});
  
  const totalItems = Object.values(selections).reduce((a, b) => a + b, 0);
  const isValid = totalItems >= 1; 
  const totalPrice = products.reduce((sum, p) => sum + (selections[p.id] || 0) * p.price, 0);

  const handleAdd = (id: string, delta: number) => {
    setSelections(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleConfirm = () => {
    if (!isValid) return;
    products.forEach(p => {
      const qty = selections[p.id] || 0;
      if (qty > 0) onAddToCart(p.id, qty);
    });
    setSelections({});
  };

  return (
    <div className="w-[100vw] relative left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#1a0e12] via-[hsl(346_48%_20%)] to-[#1a0e12] border-y border-[hsl(39_51%_71%)/.2] py-4 shadow-[0_30px_60px_rgba(0,0,0,0.5)] mt-10">
      <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-wrap items-center justify-center gap-6">
        
        <div className="flex items-center gap-4 shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#e9dcc9] flex items-center justify-center text-[hsl(346_48%_26%)] shadow-[0_0_20px_rgba(233,220,201,0.3)]">
            <Gift size={20} />
          </div>
          <h3 className="font-display text-[22px] font-bold text-[#e9dcc9] whitespace-nowrap">Monte seu desejo</h3>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 bg-black/20 p-2 rounded-[2rem] border border-white/10 backdrop-blur-md shadow-inner w-full sm:w-auto">
          {products.map(p => {
            const qty = selections[p.id] || 0;
            return (
              <div key={p.id} className="flex items-center gap-3 bg-white/5 pr-3 pl-1 py-1 rounded-full hover:bg-white/10 transition-colors">
                <img src={p.image} className="w-8 h-8 rounded-full object-cover shadow-sm border border-white/20" alt="" />
                <span className="font-bold text-[10px] uppercase tracking-wider text-white whitespace-nowrap">{p.name}</span>
                <div className="flex items-center gap-2 ml-2">
                  <button onClick={() => handleAdd(p.id, -1)} className="w-5 h-5 rounded-full bg-black/40 flex items-center justify-center text-white/70 hover:text-white transition-colors"><Minus size={10} /></button>
                  <span className="font-display font-bold text-sm text-[#e9dcc9] w-3 text-center">{qty}</span>
                  <button onClick={() => handleAdd(p.id, 1)} className="w-5 h-5 rounded-full bg-[#e9dcc9] flex items-center justify-center text-[hsl(346_48%_26%)] hover:brightness-110 transition-colors"><Plus size={10} strokeWidth={3} /></button>
                </div>
              </div>
            );
          })}
        </div>

        <motion.button 
          whileTap={isValid ? { scale: 0.95 } : {}}
          onClick={handleConfirm}
          disabled={!isValid}
          className={`shrink-0 px-6 py-3 rounded-full font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 transition-all w-full sm:w-auto ${isValid ? 'bg-[#e9dcc9] text-[hsl(346_48%_26%)] shadow-[0_10px_25px_rgba(233,220,201,0.3)] hover:brightness-110' : 'bg-white/10 text-white/40 cursor-not-allowed'}`}
        >
          Adicionar à Sacola {isValid && <span className="bg-[hsl(346_48%_26%)] text-[#e9dcc9] px-2 py-0.5 rounded-full ml-1">{money(totalPrice)}</span>}
        </motion.button>
        
      </div>
    </div>
  );
}

function Home({ products = [] }: { products: Product[] }) {
  const { data: config } = useStoreConfig();
  const { data: rawMuralPhotos = [] } = useMuralPhotos();
  const showMural = !rawMuralPhotos.some((p: any) => p.image_url === '__CONFIG_SHOW_MURAL:false__');
  const muralPhotos = rawMuralPhotos.filter((p: any) => !p.image_url?.startsWith('__CONFIG_'));

  const [items, setItems] = useState<CartItem[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toast, setToast] = useState('');

  const bagCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const onAddToCart = (id: string, quantity: number = 1) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    setItems(current => {
      const existing = current.find(item => item.id === id);
      if (existing) return current.map(item => item.id === id ? { ...item, quantity: item.quantity + quantity } : item);
      return [...current, { ...product, quantity }];
    });
    
    setToast(`${product.name} foi para a sacola!`);
    window.setTimeout(() => setToast(''), 2400);
  };

  const updateItem = (id: string, amount: number) => {
    setItems(current => current.map(item => item.id === id ? { ...item, quantity: item.quantity + amount } : item).filter(item => item.quantity > 0));
  };

  return (
    <div className="flex-1 pb-32 pt-20">
      
      {toast && (
        <div className="fixed bottom-10 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-[#e9dcc9] px-6 py-4 shadow-2xl animate-in slide-in-from-bottom-5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(346_48%_26%)] text-[#e9dcc9]"><Check size={14} /></span>
          <span className="text-sm font-bold text-[hsl(346_48%_26%)]">{toast}</span>
          <button onClick={() => setBagOpen(true)} className="ml-2 text-sm font-bold underline text-[hsl(346_48%_26%)]/70 hover:text-[hsl(346_48%_26%)]">Ver sacola</button>
        </div>
      )}

      {/* FLOATING CART BUTTON IF NOT IN HEADER */}
      {bagCount > 0 && !bagOpen && !checkoutOpen && (
        <button onClick={() => setBagOpen(true)} className="fixed bottom-6 right-6 z-[80] w-16 h-16 rounded-full bg-[#e9dcc9] shadow-2xl flex items-center justify-center hover:scale-105 transition-transform border-4 border-[hsl(346_48%_26%)]">
          <ShoppingBag size={24} className="text-[hsl(346_48%_26%)]" />
          <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white text-[hsl(346_48%_26%)] text-xs font-bold flex items-center justify-center shadow-md">{bagCount}</span>
        </button>
      )}

      <SpiderWebs />
      <FloatingGhost />
      <main>
        {/* HERO */}
        <section className="px-4 pt-6 max-w-4xl mx-auto">
          <div className="bg-[#e9dcc9] rounded-[2.5rem] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden h-[450px] shadow-2xl">
            <div className="z-10 mt-4">
              
              <h1 className="font-display text-[56px] sm:text-[72px] font-semibold leading-[0.85] text-[hsl(346_48%_26%)] tracking-tight mb-6">Cookies<br/>& Cookies</h1>
              <p className="font-display italic text-[hsl(346_48%_26%)] text-xl sm:text-2xl">O dobro de sabor,<br/>quentinho para você.</p>
            </div>
            <div className="absolute -bottom-16 -right-16 sm:-bottom-24 sm:-right-24 w-[320px] h-[320px] sm:w-[450px] sm:h-[450px] bg-white/30 rounded-full flex items-center justify-center p-4 sm:p-8 backdrop-blur-sm">
              <img src={alpinoBlackPhoto} className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white/20" alt="Cookie" />
            </div>
          </div>
        </section>

        {/* CARDAPIO */}
        <section id="colecao" className="py-16 px-4 max-w-4xl mx-auto flex flex-col gap-8">
          <h2 className="font-display text-3xl sm:text-5xl text-[#e9dcc9] text-center mb-8 flex items-center justify-center gap-3">
            {IS_HALLOWEEN ? (
              <span className="flex items-center justify-center gap-2">
                <span>Cardápio dos Mortos de Fome</span>
                <span className="relative inline-flex items-center select-none -translate-y-1">
                  <span className="text-3xl sm:text-4xl leading-none">🧟</span>
                  <span className="absolute -bottom-1 -right-2 text-xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-pulse">🍪</span>
                </span>
              </span>
            ) : (
              "Cardápio"
            )}
          </h2>
          {products.map(p => (
            <div key={p.id} className="relative bg-white/5 border border-white/10 rounded-[2.5rem] p-8 pr-28 sm:pr-40 flex flex-col gap-3 shadow-xl backdrop-blur-md">
               <div className="flex items-center gap-3 flex-wrap">
                 <h3 className="font-display text-2xl sm:text-3xl text-[#e9dcc9] font-semibold">{p.name}</h3>
                 <span className="bg-[#e9dcc9] text-[hsl(346_48%_26%)] font-bold text-sm sm:text-base px-3 py-1 rounded-full shadow-md tracking-wider">{money(p.price)}</span>
               </div>
               <p className="text-white/80 text-xs sm:text-sm mb-4 max-w-[200px] sm:max-w-sm leading-relaxed">{p.descriptor}</p>
               <div className="absolute right-[-20px] sm:right-[-30px] top-1/2 -translate-y-1/2 w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] rounded-full border-4 sm:border-8 border-[hsl(346_48%_26%)] overflow-hidden shadow-2xl">
                 <img src={p.image} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt={p.name} />
               </div>
            </div>
          ))}
        </section>

        {/* INLINE ORDER */}
        <section id="monte-seu-pedido" className="py-8">
           <InlineOrderBuilder products={products} onAddToCart={onAddToCart} />
        </section>

        {/* MURAL DA FAMA */}
        {showMural && (
        <section className="py-20 px-4 mt-12 flex flex-col items-center text-center bg-black/20 rounded-t-[4rem] border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
           <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[3px] mb-8 shadow-2xl hover:scale-105 transition-transform">
             <div className="w-full h-full bg-[#e9dcc9] rounded-[1.3rem] flex items-center justify-center text-[hsl(346_48%_26%)]">
               <Instagram size={36} strokeWidth={1.5} />
             </div>
           </div>
           <h2 className="font-display text-4xl sm:text-5xl text-white mb-10 leading-tight">Apareça no nosso<br/><span className="text-[#e9dcc9] font-bold">Mural da Fama</span></h2>
           
           <div className="w-[100vw] overflow-hidden pb-10 relative">
             <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
               {[...Array(2)].map((_, i) => (
                 <div key={i} className="flex gap-4 pr-4">
                   {muralPhotos.length > 0 ? muralPhotos.map((photo: any) => (
                     <img key={`${photo.id}-${i}`} src={photo.image_url || photo.url} className="w-[160px] h-[220px] sm:w-[200px] sm:h-[280px] object-cover rounded-3xl shrink-0 shadow-xl border-2 border-white/10 pointer-events-none" alt="Mural" />
                   )) : (
                     <>
                       <img src={lifestyleRedVelvet} className="w-[160px] h-[220px] sm:w-[200px] sm:h-[280px] object-cover rounded-3xl shrink-0 shadow-xl border-2 border-white/10 pointer-events-none" alt="Mural" />
                       <img src={lifestyleAlpinoBlack} className="w-[160px] h-[220px] sm:w-[200px] sm:h-[280px] object-cover rounded-3xl shrink-0 shadow-xl border-2 border-white/10 pointer-events-none" alt="Mural" />
                       <img src={lifestyleKinderBueno} className="w-[160px] h-[220px] sm:w-[200px] sm:h-[280px] object-cover rounded-3xl shrink-0 shadow-xl border-2 border-white/10 pointer-events-none" alt="Mural" />
                     </>
                   )}
                 </div>
               ))}
             </div>
             <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[hsl(346_48%_26%)] to-transparent" />
             <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[hsl(346_48%_26%)] to-transparent" />
           </div>
           
           <p className="text-white/80 text-sm sm:text-base px-6 max-w-md mt-4 mb-8 leading-relaxed font-medium">Tire uma foto bem linda do seu momento com nossos cookies, poste nos stories e marque a gente! Sua foto pode vir parar aqui no aplicativo!</p>
           
           <a href={config?.instagram_url} target="_blank" className="inline-flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.1em] text-white bg-white/10 border border-white/20 px-8 py-4 rounded-full hover:bg-white/20 hover:text-white transition-all shadow-md">
             <Instagram size={20}/> @cookiesecookiesbg
           </a>
        </section>
        )}

      </main>
      
      <CartDrawer items={items} open={bagOpen} onClose={() => setBagOpen(false)} onUpdate={updateItem} onCheckout={() => { setBagOpen(false); setCheckoutOpen(true); }} />
      {checkoutOpen && <Checkout items={items} onClose={() => setCheckoutOpen(false)} onDone={() => { setItems([]); setCheckoutOpen(false); }} />}

      {/* FOOTER */}
      <footer id="contato" className="relative overflow-hidden bg-[#1a0e12] text-[hsl(35_43%_94%)] px-8 py-16 pb-32">
        {IS_HALLOWEEN && <FloatingBats mode="footer" />}
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <Logo light />
          
          <div className="flex flex-row flex-wrap items-center justify-center gap-8 sm:gap-16 w-full mt-12 mb-12">
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-[#e9dcc9]/30 group-hover:bg-[#e9dcc9]/20 transition-colors shadow-lg">
                <Clock3 className="text-[#e9dcc9]" size={24}/>
              </div>
              <span className="font-bold text-[10px] text-[#e9dcc9] uppercase tracking-[0.2em]">Assado no dia</span>
            </div>
            
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-[#e9dcc9]/30 group-hover:bg-[#e9dcc9]/20 transition-colors shadow-lg">
                <Truck className="text-[#e9dcc9]" size={24}/>
              </div>
              <span className="font-bold text-[10px] text-[#e9dcc9] uppercase tracking-[0.2em]">Delivery</span>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-[#e9dcc9]/30 group-hover:bg-[#e9dcc9]/20 transition-colors shadow-lg">
                <Store className="text-[#e9dcc9]" size={24}/>
              </div>
              <span className="font-bold text-[10px] text-[#e9dcc9] uppercase tracking-[0.2em]">Retirada</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 mb-10 w-full max-w-md">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-white/90 text-center leading-relaxed font-medium px-4">
              <MapPin size={24} className="text-[#e9dcc9] shrink-0 hidden sm:block" />
              <span>{config?.location_address}</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-white/90 text-center leading-relaxed font-medium px-4">
              <Clock3 size={24} className="text-[#e9dcc9] shrink-0 hidden sm:block" />
              <span>Horário de funcionamento: a partir das 13:00</span>
            </div>
            <a href="https://maps.google.com/?q=R.+Conrado+Souza+Lira,+Qd+01+Lote+06+e+07+-+Rainha+de+F%C3%A1tima,+Barra+do+Gar%C3%A7as+-+MT,+78603-810" target="_blank" className="inline-flex items-center justify-center gap-3 w-full sm:w-auto bg-[#e9dcc9] text-[hsl(346_48%_26%)] px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[11px] shadow-lg hover:scale-105 transition-transform pointer-events-auto">
              <MapPin size={16} /> Abrir no Google Maps
            </a>
          </div>

          <div className="flex flex-col items-center gap-2 border-t border-white/10 w-full pt-10">
             <p className="text-[11px] text-white/50 flex items-center justify-center gap-1">Feito com <Heart size={10} className="text-[#e9dcc9] mx-1 fill-[#e9dcc9]"/> em BG</p>
             <p className="text-[10px] text-white/30">© 2026 Cookies & Cookies</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [, setLocation] = useLocation();
  const { data: config } = useStoreConfig();
  
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 z-[110] flex h-full w-[280px] flex-col bg-[#1a0e12] border-l border-white/10 p-8 shadow-2xl">
            <button onClick={onClose} className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"><X size={20} /></button>
            <div className="mt-12 flex flex-col gap-6">
              <a href="#colecao" onClick={onClose} className="font-display text-2xl text-white hover:text-[#e9dcc9] transition-colors border-b border-white/10 pb-4">Cardápio</a>
              <a href="#monte-seu-pedido" onClick={onClose} className="font-display text-2xl text-white hover:text-[#e9dcc9] transition-colors border-b border-white/10 pb-4">Monte seu desejo</a>
              <a href="#contato" onClick={onClose} className="font-display text-2xl text-white hover:text-[#e9dcc9] transition-colors border-b border-white/10 pb-4">Contato</a>
              <a href="/admin" onClick={() => { onClose(); setLocation('/admin'); }} className="font-display text-2xl text-[#e9dcc9] flex items-center gap-3 mt-4"><Settings size={20} /> Acesso ADM</a>
            </div>
            <div className="mt-auto">
              <a href={config?.instagram_url} target="_blank" className="flex items-center gap-3 text-white/70 hover:text-[#e9dcc9] transition-colors"><Instagram size={20} /> Instagram</a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MouseGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
      style={{
        background: `radial-gradient(circle 600px at ${pos.x}px ${pos.y}px, rgba(233,220,201,${clicked ? '0.15' : '0.06'}), transparent 60%)`
      }}
    />
  );
}

function AppInner() {
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      return data && data.length > 0 ? data : [
        { id: 'red-velvet', name: 'Red Velvet', descriptor: 'Massa red velvet, chocolate branco e centro macio derretendo na boca.', price: 15, tag: 'Assinatura', image: redVelvetPhoto },
        { id: 'alpino-black', name: 'Alpino Black', descriptor: 'Chocolate intenso, pedaços rústicos e um recheio cremoso e profundo.', price: 15, tag: 'Bestseller', image: alpinoBlackPhoto },
        { id: 'kinder-bueno', name: 'Kinder Bueno', descriptor: 'Pedaços de avelã, chocolate ao leite belga e uma surpresa no meio.', price: 15, tag: 'Exclusivo', image: kinderBuenoPhoto },
      ];
    }
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const isLanding = location === '/';

  return (
    <div className="flex min-h-screen flex-col bg-[hsl(346_48%_26%)] font-sans selection:bg-[hsl(39_51%_71%)/.3] selection:text-[hsl(35_43%_94%)] relative overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat' }}></div>
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-0"></div>
      
      <MouseGlow />
      <TopBanner />

      {!isLanding && (
        <header className="absolute left-0 right-0 top-10 z-[90] flex items-center justify-between px-5 py-4 sm:px-8 mix-blend-normal pointer-events-none">
          <button onClick={() => setMenuOpen(true)} className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md shadow-lg border border-white/20 hover:bg-white/20 transition-all hover:scale-105 pointer-events-auto" aria-label="Menu" data-testid="button-menu"><MenuIcon size={20} strokeWidth={2.5}/></button>
          <div className="absolute left-1/2 -translate-x-1/2 drop-shadow-2xl pointer-events-auto">
            {IS_HALLOWEEN ? (
              <img
                src={halloweenLogo}
                alt="Cookies & Cookies Halloween"
                className="w-14 h-14 object-contain drop-shadow-[0_8px_20px_rgba(255,117,24,0.5)]"
              />
            ) : (
              <div className="w-14 h-14 bg-[#e9dcc9] rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-4 border-[hsl(346_48%_26%)] relative">
                <img src={ccLogo} className="w-10 h-10 object-cover" alt="Logo" />
              </div>
            )}
          </div>
          <div className="w-12 h-12" />
        </header>
      )}

      <Switch>
        <Route path="/admin" component={AdminPage} />
        <Route path="/cardapio" component={() => <Home products={products} />} />
        <Route path="/" component={LandingPage} />
        <Route component={NotFound} />
      </Switch>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter>
            <AppInner />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
