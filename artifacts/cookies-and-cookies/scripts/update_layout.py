import re

path = r"c:\Users\Usuario\Downloads\COOKIES E\Asset-Linker\artifacts\cookies-and-cookies\src\App.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix BoxBuilder layout
box_old = """      <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="flex items-center gap-6 text-center md:text-left">
          <div className="w-16 h-16 rounded-full bg-[hsl(39_51%_71%)] flex items-center justify-center text-[hsl(346_48%_26%)] shadow-[0_0_30px_rgba(217,173,124,0.4)] shrink-0">
            <Gift size={28} strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-display text-[28px] sm:text-[36px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[hsl(39_51%_71%)] to-white leading-tight">Monte sua Caixa</h3>
            <p className="text-[13px] text-white/70 font-medium mt-1">Para dividir (ou esconder). Escolha os sabores no WhatsApp!</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
          {/* Quick selectors */}
          <div className="flex items-center gap-3 bg-black/20 p-2 rounded-full border border-white/10 backdrop-blur-md shadow-inner w-full sm:w-auto overflow-x-auto">
            {[4, 6, 10, 12].map(size => (
              <button 
                key={size}
                onClick={() => setCustomSize(size)}
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-xl transition-all duration-300 ${customSize === size ? 'bg-[hsl(39_51%_71%)] text-[hsl(346_48%_26%)] shadow-[0_0_15px_rgba(217,173,124,0.5)] scale-110' : 'text-white hover:bg-white/10'}`}
              >
                {size}
              </button>
            ))}
            
            <div className="w-px h-8 bg-white/20 mx-2" />
            
            {/* Custom counter */}
            <div className="flex items-center gap-3 px-2">
              <button onClick={() => setCustomSize(Math.max(1, customSize - 1))} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"><Minus size={14} /></button>
              <span className="font-display font-bold text-2xl text-[hsl(39_51%_71%)] w-8 text-center">{customSize}</span>
              <button onClick={() => setCustomSize(customSize + 1)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"><Plus size={14} /></button>
            </div>
          </div>"""

box_new = """      <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8">
        
        <div className="flex items-center gap-5 text-left shrink-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[hsl(39_51%_71%)] flex items-center justify-center text-[hsl(346_48%_26%)] shadow-[0_0_30px_rgba(217,173,124,0.4)] shrink-0">
            <Gift size={28} strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-display text-[28px] sm:text-[36px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[hsl(39_51%_71%)] to-white leading-tight whitespace-nowrap">Monte sua Caixa</h3>
            <p className="text-[12px] sm:text-[13px] text-white/70 font-medium mt-1">Sabores no WhatsApp!</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full lg:w-auto shrink-0">
          {/* Quick selectors */}
          <div className="flex items-center justify-center gap-2 bg-black/20 p-2 rounded-full border border-white/10 backdrop-blur-md shadow-inner w-full sm:w-auto">
            {[4, 6, 10, 12].map(size => (
              <button 
                key={size}
                onClick={() => setCustomSize(size)}
                className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-display font-bold text-lg sm:text-xl transition-all duration-300 ${customSize === size ? 'bg-[hsl(39_51%_71%)] text-[hsl(346_48%_26%)] shadow-[0_0_15px_rgba(217,173,124,0.5)] scale-110' : 'text-white hover:bg-white/10'}`}
              >
                {size}
              </button>
            ))}
            
            <div className="w-px h-8 bg-white/20 mx-1 sm:mx-2" />
            
            {/* Custom counter */}
            <div className="flex items-center gap-2 px-1 sm:px-2">
              <button onClick={() => setCustomSize(Math.max(1, customSize - 1))} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"><Minus size={14} /></button>
              <span className="font-display font-bold text-xl sm:text-2xl text-[hsl(39_51%_71%)] w-8 text-center">{customSize}</span>
              <button onClick={() => setCustomSize(customSize + 1)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"><Plus size={14} /></button>
            </div>
          </div>"""

content = content.replace(box_old, box_new)

# 2. Fix Location and Footer Links
loc_old = """          <a href="#" target="_blank" className="group relative flex flex-col items-center bg-white/5 border border-white/10 hover:border-[hsl(39_51%_71%)/0.5] hover:bg-white/10 transition-all rounded-[2rem] p-6 max-w-sm w-full backdrop-blur-md">
            <div className="absolute -top-4 w-8 h-8 rounded-full bg-[hsl(346_48%_26%)] border-2 border-[hsl(39_51%_71%)] flex items-center justify-center shadow-[0_0_15px_rgba(217,173,124,0.4)]">
               <MapPin size={14} className="text-[hsl(39_51%_71%)]" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[hsl(39_51%_71%)] mb-2 mt-2">Nossa Loja</span>
            <p className="text-[14px] text-white/90 font-medium leading-relaxed text-center group-hover:text-white transition-colors">[Aguardando o seu link de localização...]</p>
          </a>"""

loc_new = """          <a href="https://maps.app.goo.gl/nJj1VYYCerozeAod7" target="_blank" className="group relative flex flex-col items-center bg-white/5 border border-white/10 hover:border-[hsl(39_51%_71%)/0.5] hover:bg-white/10 transition-all rounded-[2rem] p-6 max-w-sm w-full backdrop-blur-md">
            <div className="absolute -top-4 w-8 h-8 rounded-full bg-[hsl(346_48%_26%)] border-2 border-[hsl(39_51%_71%)] flex items-center justify-center shadow-[0_0_15px_rgba(217,173,124,0.4)]">
               <MapPin size={14} className="text-[hsl(39_51%_71%)]" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[hsl(39_51%_71%)] mb-2 mt-2">Nossa Loja</span>
            <p className="text-[14px] text-white/90 font-medium leading-relaxed text-center group-hover:text-white transition-colors">R. Conrado Souza Lira, Qd 01 Lote 06 e 07<br/>Rainha de Fátima, Barra do Garças - MT</p>
          </a>"""

content = content.replace(loc_old, loc_new)

# Clean up any leftover "Aguardando seu endereço" placeholders in MobileMenu and header/footer
content = content.replace("[Aguardando o seu endereço atualizado...]", "R. Conrado Souza Lira, Qd 01 Lote 06 e 07")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed BoxBuilder wrapping and updated address.")
