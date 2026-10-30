import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
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

function useStoreConfig() {
  return useQuery({
    queryKey: ['config'],
    queryFn: async () => {
      const { data, error } = await supabase.from('store_config').select('*').single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || { 
        whatsapp_number: '5566992292676'
      };
    }
  });
}

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const { data: config } = useStoreConfig();
  
  const handleWhatsApp = () => {
    const number = config?.whatsapp_number || '5566992292676';
    window.open(`https://wa.me/${number}`, '_blank');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full min-h-screen overflow-hidden">
      {/* Elementos de Halloween (ligados/desligados em HalloweenTheme.tsx) */}
      <SpiderWebs />
      <FloatingGhost />
      <FloatingBats />

      <div className="flex flex-col items-center text-center max-w-md w-full gap-8 mt-6 relative z-10">
        
        {/* Container do Cookie com o Chapéu de Bruxa */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 0.8, ease: "easeOut" }} 
          className={IS_HALLOWEEN
            ? "relative drop-shadow-[0_20px_60px_rgba(255,117,24,0.5)]"
            : "w-48 h-48 sm:w-64 sm:h-64 rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex items-center justify-center bg-[#e9dcc9] border-8 border-[hsl(346_48%_26%)] p-2 relative"}
        >
          {IS_HALLOWEEN ? (
            <img
              src={halloweenLogo}
              alt="Cookies & Cookies Halloween"
              className="w-56 h-56 sm:w-72 sm:h-72 object-contain drop-shadow-[0_15px_40px_rgba(255,117,24,0.45)]"
            />
          ) : (
            <>
              {/* Chapéu de Bruxa sobre o cookie */}
              <img src={ccLogo} alt="Cookies & Cookies" className="w-full h-full object-cover scale-[1.3] translate-y-1" />
            </>
          )}
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
          {/* Badge temático de Halloween */}

          <h1 className="font-display text-5xl sm:text-6xl font-bold text-[#e9dcc9] mb-4 drop-shadow-lg">Cookies & Cookies</h1>
          <p className="text-white/90 text-xl sm:text-2xl leading-relaxed font-display italic max-w-sm mx-auto drop-shadow-md">
            {IS_HALLOWEEN ? (
              <>O dobro de sabor,<br/>de arrepiar você.</>
            ) : (
              <>O dobro de sabor,<br/>quentinho para você.</>
            )}
          </p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="flex flex-col gap-4 w-full mt-4">
          <button 
            onClick={handleWhatsApp} 
            className="w-full bg-[#25D366] text-white px-8 py-5 sm:py-6 rounded-full font-bold uppercase tracking-widest text-[14px] shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:brightness-110 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
          >
            Ir diretamente para o WhatsApp
          </button>
          
          <button 
            onClick={() => setLocation('/cardapio')} 
            className={`w-full bg-[#e9dcc9] text-[hsl(346_48%_26%)] px-8 py-5 sm:py-6 rounded-full font-bold uppercase tracking-widest text-[14px] hover:brightness-110 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 ${
              IS_HALLOWEEN 
                ? 'shadow-[0_10px_35px_rgba(255,117,24,0.35)] ring-2 ring-[#ff7518]/50' 
                : 'shadow-[0_10px_30px_rgba(233,220,201,0.3)]'
            }`}
          >
            {IS_HALLOWEEN ? '🕷️ Ver Cardápio dos Mortos de Fome 🧟‍♂️' : 'Ver cardápio completo'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
