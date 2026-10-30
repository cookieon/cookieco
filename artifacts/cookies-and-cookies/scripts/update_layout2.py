import re

path = r"c:\Users\Usuario\Downloads\COOKIES E\Asset-Linker\artifacts\cookies-and-cookies\src\App.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Force horizontal layout for BoxBuilder
box_old = """      <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8">
        
        <div className="flex items-center gap-5 text-left shrink-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[hsl(39_51%_71%)] flex items-center justify-center text-[hsl(346_48%_26%)] shadow-[0_0_30px_rgba(217,173,124,0.4)] shrink-0">
            <Gift size={28} strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-display text-[28px] sm:text-[36px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[hsl(39_51%_71%)] to-white leading-tight whitespace-nowrap">Monte sua Caixa</h3>
            <p className="text-[12px] sm:text-[13px] text-white/70 font-medium mt-1">Sabores no WhatsApp!</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full lg:w-auto shrink-0">"""

box_new = """      <div className="max-w-[1200px] mx-auto px-2 sm:px-6 relative z-10 flex flex-row flex-wrap items-center justify-center lg:justify-between gap-4 sm:gap-8">
        
        <div className="flex items-center gap-3 sm:gap-5 text-left shrink-0">
          <div className="hidden sm:flex w-14 h-14 rounded-full bg-[hsl(39_51%_71%)] items-center justify-center text-[hsl(346_48%_26%)] shadow-[0_0_30px_rgba(217,173,124,0.4)] shrink-0">
            <Gift size={24} strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-display text-[24px] sm:text-[32px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[hsl(39_51%_71%)] to-white leading-tight whitespace-nowrap">Monte sua Caixa</h3>
            <p className="text-[10px] sm:text-[12px] text-white/70 font-medium mt-0.5">Sabores no WhatsApp!</p>
          </div>
        </div>

        <div className="flex flex-row flex-wrap items-center justify-center gap-4 w-full sm:w-auto shrink-0">"""

content = content.replace(box_old, box_new)

# 2. Fix Location and Footer Links (running this manually since update_layout didn't run yet)
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

# Fix button taking w-full on small screens
btn_old = """          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="w-full sm:w-auto shrink-0 bg-[hsl(39_51%_71%)] text-[hsl(346_48%_26%)] px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[11px] shadow-[0_10px_25px_rgba(217,173,124,0.3)] hover:brightness-110 transition-all flex items-center justify-center gap-3"
          >"""
btn_new = """          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="shrink-0 bg-[hsl(39_51%_71%)] text-[hsl(346_48%_26%)] px-6 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] sm:text-[11px] shadow-[0_10px_25px_rgba(217,173,124,0.3)] hover:brightness-110 transition-all flex items-center justify-center gap-2 sm:gap-3"
          >"""
content = content.replace(btn_old, btn_new)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed BoxBuilder wrapping and updated address.")
