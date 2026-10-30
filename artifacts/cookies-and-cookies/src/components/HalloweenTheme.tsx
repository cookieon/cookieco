import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ====================================================================
 * 🎃 CONFIGURAÇÃO DO TEMA DE HALLOWEEN
 * ====================================================================
 * Para ativar:  export const IS_HALLOWEEN =
  typeof localStorage !== 'undefined'
    ? localStorage.getItem('cc_halloween') !== 'false'
    : true;
 * Para desativar: export const IS_HALLOWEEN = false;
 * 
 * Quando for 'false', todos os elementos de Halloween somem instantaneamente!
 * ====================================================================
 */
export const IS_HALLOWEEN =
  typeof localStorage !== 'undefined'
    ? localStorage.getItem('cc_halloween') !== 'false'
    : true;

/**
 * Teias de aranha elegantes nos cantos superiores
 */
export function SpiderWebs() {
  if (!IS_HALLOWEEN) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[80] overflow-hidden">
      {/* Teia Canto Superior Esquerdo */}
      <svg
        className="absolute top-0 left-0 w-36 h-36 sm:w-56 sm:h-56 opacity-40 text-[#f6e0b5]"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M0,0 L100,0 M0,0 L85,45 M0,0 L55,85 M0,0 L0,100" />
        <path d="M25,0 Q22,12 0,25" />
        <path d="M50,0 Q43,24 0,50" />
        <path d="M75,0 Q64,36 0,75" />
        <path d="M100,0 Q85,48 0,100" />
      </svg>

      {/* Teia Canto Superior Direito com Aranha Balançando */}
      <svg
        className="absolute top-0 right-0 w-36 h-36 sm:w-56 sm:h-56 opacity-40 text-[#f6e0b5] scale-x-[-1]"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M0,0 L100,0 M0,0 L85,45 M0,0 L55,85 M0,0 L0,100" />
        <path d="M25,0 Q22,12 0,25" />
        <path d="M50,0 Q43,24 0,50" />
        <path d="M75,0 Q64,36 0,75" />
        <path d="M100,0 Q85,48 0,100" />
      </svg>

      {/* Pequena aranha pendurada balançando à direita */}
      <motion.div
        animate={{ y: [0, 14, 0], rotate: [-4, 6, -4] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-0 right-14 sm:right-28 flex flex-col items-center"
      >
        <div className="w-[1px] h-14 sm:h-20 bg-[#f6e0b5]/50" />
        <div className="w-4 h-3 bg-[#1a0e12] border border-[#f6e0b5]/60 rounded-full relative shadow-md">
          {/* Pernas da aranha */}
          <span className="absolute -left-2 top-0 text-[10px] text-[#f6e0b5]/80 select-none">╱╲</span>
          <span className="absolute -right-2 top-0 text-[10px] text-[#f6e0b5]/80 select-none">╱╲</span>
          {/* Olhinhos vermelhos */}
          <span className="absolute left-1 top-1 w-0.5 h-0.5 bg-red-400 rounded-full" />
          <span className="absolute right-1 top-1 w-0.5 h-0.5 bg-red-400 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Chapeuzinho de bruxa vetorial para encaixar sobre o cookie do logo
 */
export function WitchHat({ size = 'large' }: { size?: 'large' | 'small' }) {
  if (!IS_HALLOWEEN) return null;

  const isLarge = size === 'large';

  return (
    <motion.div
      initial={{ y: -20, opacity: 0, rotate: -25 }}
      animate={{ y: 0, opacity: 1, rotate: -18 }}
      transition={{ duration: 0.6, ease: "backOut" }}
      className={`absolute z-30 pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] ${
        isLarge
          ? '-top-10 -left-6 sm:-top-14 sm:-left-8 w-28 h-28 sm:w-36 sm:h-36'
          : '-top-4 -left-3 w-10 h-10'
      }`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Aba do chapéu */}
        <ellipse cx="50" cy="80" rx="46" ry="14" fill="#1b1219" stroke="#ff7518" strokeWidth="1.5" />
        
        {/* Cone do chapéu com curva mágica */}
        <path
          d="M20,78 Q42,50 48,12 Q62,20 62,35 Q68,60 80,78 Z"
          fill="#2a1622"
          stroke="#ff7518"
          strokeWidth="1.2"
        />
        
        {/* Faixa decorativa laranja de abóbora */}
        <path
          d="M26,76 C36,70 64,70 74,76 L76,82 C64,76 36,76 24,82 Z"
          fill="#ff7518"
        />

        {/* Fivela dourada */}
        <rect
          x="44"
          y="71"
          width="12"
          height="10"
          rx="2"
          fill="none"
          stroke="#f6e0b5"
          strokeWidth="2.5"
        />
        
        {/* Brilho mágico */}
        <circle cx="56" cy="30" r="1.5" fill="#f6e0b5" className="animate-ping" />
      </svg>
    </motion.div>
  );
}

/**
 * Fantasminha simpático flutuando segurando um cookie
 */
export function FloatingGhost() {
  const [message, setMessage] = useState(false);

  if (!IS_HALLOWEEN) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[95] flex flex-col items-start">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="mb-3 bg-[#2a1622] text-[#f6e0b5] border-2 border-[#ff7518]/70 px-5 py-3 rounded-2xl shadow-2xl text-sm font-display tracking-wide max-w-[240px] text-center"
          >
            🎃 <strong className="text-[#ff7518] text-base">Gostosuras ou Cookies?</strong><br />
            Nossos cookies são de arrepiar! 👻
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setMessage((prev) => !prev)}
        animate={{
          y: [0, -10, 0],
          rotate: [-2, 3, -2],
        }}
        transition={{
          repeat: Infinity,
          duration: 3.5,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Fantasminha de Halloween"
        className="relative group cursor-pointer focus:outline-none"
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-[0_12px_28px_rgba(255,117,24,0.4)]">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Corpo do fantasma */}
            <path
              d="M50 15 C30 15 25 35 25 60 C25 78 30 85 36 82 C42 79 45 85 50 82 C55 79 60 85 64 82 C70 85 75 78 75 60 C75 35 70 15 50 15 Z"
              fill="#fbf7ee"
              filter="drop-shadow(0 0 6px rgba(255, 255, 255, 0.4))"
            />
            {/* Olhinhos e boca meiga */}
            <ellipse cx="43" cy="40" rx="3.5" ry="5" fill="#2a1622" />
            <ellipse cx="57" cy="40" rx="3.5" ry="5" fill="#2a1622" />
            <ellipse cx="50" cy="52" rx="4" ry="5.5" fill="#2a1622" />
            {/* Bochechinhas rosadas */}
            <circle cx="37" cy="46" r="3" fill="#ff7518" opacity="0.4" />
            <circle cx="63" cy="46" r="3" fill="#ff7518" opacity="0.4" />

            {/* Cookie temático que o fantasma segura */}
            <g transform="translate(56, 56) scale(0.32)">
              <circle cx="35" cy="35" r="30" fill="#d29963" stroke="#87471d" strokeWidth="3" />
              {/* Gotas de chocolate no cookie */}
              <circle cx="25" cy="25" r="5" fill="#4a240c" />
              <circle cx="45" cy="27" r="4.5" fill="#4a240c" />
              <circle cx="30" cy="45" r="5.5" fill="#4a240c" />
              <circle cx="48" cy="44" r="4" fill="#4a240c" />
            </g>
          </svg>
        </div>
        
        {/* Pill pulsando "Boo!" */}
        <span className="absolute -top-1 -left-1 bg-[#ff7518] text-[#1a0e12] text-xs font-black px-2.5 py-1 rounded-full shadow-md animate-bounce">
          BOO!
        </span>
      </motion.button>
    </div>
  );
}

/**
 * SVG de um morceguinho vetorial elegante
 */
function BatSvg({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 40" className={className} fill="currentColor">
      {/* Corpo central */}
      <ellipse cx="40" cy="24" rx="7" ry="8" />
      {/* Cabeça */}
      <ellipse cx="40" cy="15" rx="5" ry="5" />
      {/* Orelhinhas */}
      <polygon points="36,11 33,4 38,10" />
      <polygon points="44,11 47,4 42,10" />
      {/* Asa esquerda */}
      <path d="M33,20 C24,14 8,18 2,10 C10,22 20,24 33,26 Z" />
      {/* Membrana asa esquerda */}
      <path d="M33,20 C28,28 16,30 8,26 C16,30 26,28 33,26 Z" opacity="0.6" />
      {/* Asa direita */}
      <path d="M47,20 C56,14 72,18 78,10 C70,22 60,24 47,26 Z" />
      {/* Membrana asa direita */}
      <path d="M47,20 C52,28 64,30 72,26 C64,30 54,28 47,26 Z" opacity="0.6" />
      {/* Olhinhos */}
      <circle cx="38" cy="15" r="1.2" fill="white" />
      <circle cx="42" cy="15" r="1.2" fill="white" />
    </svg>
  );
}

/**
 * Morceguinhos decorativos flutuando — versão premium com SVGs vetoriais
 * 
 * 'mode="landing"' → posição fixed (cobre a tela toda na página inicial)
 * 'mode="cardapio"' → posição absolute (dentro do fluxo do cardápio)
 * 'mode="footer"'   → posição absolute, morcegos mais visíveis no fundo escuro
 */
export function FloatingBats({ mode = 'landing' }: { mode?: 'landing' | 'cardapio' | 'footer' }) {
  if (!IS_HALLOWEEN) return null;

  const isFixed = mode === 'landing';

  // Morceguinhos do footer — mais opacos pois o fundo é bem escuro (#1a0e12)
  const footerBats = [
    { top: '10%', left: '5%',   w: 'w-14',  dur: 9,   delay: 0,   opacity: 'opacity-50', xRange: [-30, 50],  yRange: [0, -15] },
    { top: '25%', left: '80%',  w: 'w-12',  dur: 10,  delay: 1,   opacity: 'opacity-45', xRange: [25, -40],  yRange: [0, 20]  },
    { top: '50%', left: '15%',  w: 'w-10',  dur: 8,   delay: 2,   opacity: 'opacity-40', xRange: [-20, 35],  yRange: [0, -10] },
    { top: '15%', left: '45%',  w: 'w-16',  dur: 12,  delay: 0.5, opacity: 'opacity-50', xRange: [40, -25],  yRange: [0, 18]  },
    { top: '60%', left: '70%',  w: 'w-9',   dur: 7,   delay: 1.8, opacity: 'opacity-35', xRange: [-25, 20],  yRange: [0, -12] },
    { top: '35%', left: '60%',  w: 'w-11',  dur: 11,  delay: 3,   opacity: 'opacity-40', xRange: [20, -30],  yRange: [0, 15]  },
    { top: '75%', left: '30%',  w: 'w-8',   dur: 9,   delay: 2.5, opacity: 'opacity-35', xRange: [-18, 28],  yRange: [0, -8]  },
    { top: '40%', left: '3%',   w: 'w-13',  dur: 13,  delay: 0.8, opacity: 'opacity-45', xRange: [30, -20],  yRange: [0, 12]  },
    { top: '70%', left: '88%',  w: 'w-10',  dur: 8,   delay: 4,   opacity: 'opacity-40', xRange: [-22, 18],  yRange: [0, -15] },
    { top: '5%',  left: '65%',  w: 'w-7',   dur: 6,   delay: 1.5, opacity: 'opacity-35', xRange: [15, -25],  yRange: [0, 10]  },
    { top: '85%', left: '55%',  w: 'w-12',  dur: 10,  delay: 3.2, opacity: 'opacity-40', xRange: [-30, 22],  yRange: [0, -18] },
    { top: '55%', left: '40%',  w: 'w-6',   dur: 7,   delay: 2.2, opacity: 'opacity-30', xRange: [12, -18],  yRange: [0, 8]   },
    { top: '20%', left: '22%',  w: 'w-15',  dur: 14,  delay: 0.3, opacity: 'opacity-50', xRange: [-35, 45],  yRange: [0, -20] },
    { top: '90%', left: '10%',  w: 'w-8',   dur: 8,   delay: 5,   opacity: 'opacity-35', xRange: [20, -15],  yRange: [0, -10] },
    { top: '45%', left: '92%',  w: 'w-11',  dur: 11,  delay: 1.2, opacity: 'opacity-40', xRange: [-28, 15],  yRange: [0, 14]  },
  ];

  // Configurações de cada morceguinho: posição, tamanho, velocidade, delay, opacidade
  const bats = mode === 'footer' ? footerBats : [
    // === LANDING / tela toda ===
    { top: '8%',  left: '6%',   w: 'w-12',  dur: 9,  delay: 0,   opacity: 'opacity-20', xRange: [-25, 40],  yRange: [0, -20] },
    { top: '15%', left: '75%',  w: 'w-16',  dur: 11, delay: 0.8, opacity: 'opacity-15', xRange: [20, -35],  yRange: [0, 18]  },
    { top: '30%', left: '18%',  w: 'w-8',   dur: 7,  delay: 1.5, opacity: 'opacity-25', xRange: [-18, 28],  yRange: [0, -12] },
    { top: '22%', left: '55%',  w: 'w-10',  dur: 8,  delay: 2.2, opacity: 'opacity-15', xRange: [30, -20],  yRange: [0, 14]  },
    { top: '50%', left: '85%',  w: 'w-14',  dur: 12, delay: 0.5, opacity: 'opacity-20', xRange: [-30, 15],  yRange: [0, -16] },
    { top: '45%', left: '3%',   w: 'w-9',   dur: 10, delay: 3,   opacity: 'opacity-20', xRange: [20, -15],  yRange: [0, 10]  },
    { top: '65%', left: '40%',  w: 'w-11',  dur: 9,  delay: 1,   opacity: 'opacity-15', xRange: [-22, 30],  yRange: [0, -8]  },
    { top: '70%', left: '12%',  w: 'w-7',   dur: 6,  delay: 4,   opacity: 'opacity-20', xRange: [15, -25],  yRange: [0, 12]  },
    { top: '75%', left: '70%',  w: 'w-13',  dur: 13, delay: 2,   opacity: 'opacity-15', xRange: [-20, 35],  yRange: [0, -18] },
    { top: '85%', left: '30%',  w: 'w-8',   dur: 8,  delay: 3.5, opacity: 'opacity-20', xRange: [25, -18],  yRange: [0, 10]  },
    { top: '12%', left: '42%',  w: 'w-6',   dur: 7,  delay: 2.8, opacity: 'opacity-10', xRange: [-12, 18],  yRange: [0, -8]  },
    { top: '58%', left: '60%',  w: 'w-10',  dur: 10, delay: 1.2, opacity: 'opacity-15', xRange: [18, -28],  yRange: [0, 14]  },
  ];

  return (
    <div className={`${isFixed ? 'fixed' : 'absolute'} inset-0 pointer-events-none overflow-hidden z-[5]`}>
      {bats.map((bat, i) => (
        <motion.div
          key={i}
          className={`absolute ${bat.w} ${bat.opacity} text-[#f6e0b5]`}
          style={{ top: bat.top, left: bat.left }}
          animate={{
            x: bat.xRange,
            y: bat.yRange,
            // Bate as asas suavemente
            scaleY: [1, 0.75, 1, 0.8, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: bat.dur,
            ease: 'easeInOut',
            delay: bat.delay,
          }}
        >
          <BatSvg />
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Badge de Edição Limitada de Halloween
 */
export function HalloweenBadge({ text = "Edição Especial de Halloween" }: { text?: string }) {
  return null;
}
