import re

path = r"c:\Users\Usuario\Downloads\COOKIES E\Asset-Linker\artifacts\cookies-and-cookies\src\App.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

footer_old_start = '<footer id="contato" className="bg-gradient-to-b from-black/20 to-black/60 backdrop-blur-3xl text-[hsl(35_43%_94%)] px-8 py-16 pb-40 mt-10 rounded-t-[3rem] max-w-4xl mx-auto border-t border-white/10 relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">'
footer_old_end = '      </footer>'

# Extract the old footer block
start_idx = content.find(footer_old_start)
end_idx = content.find(footer_old_end, start_idx) + len(footer_old_end)

if start_idx != -1 and end_idx != -1:
    old_footer = content[start_idx:end_idx]
    
    new_footer = """<footer id="contato" className="bg-gradient-to-b from-black/20 to-black/60 backdrop-blur-3xl text-[hsl(35_43%_94%)] px-8 py-16 pb-40 mt-10 rounded-t-[3rem] max-w-4xl mx-auto border-t border-white/10 relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
          <Logo light />
          
          {/* ICONS SIDE-BY-SIDE */}
          <div className="flex flex-row flex-wrap items-center justify-center gap-8 sm:gap-16 w-full mt-12 mb-10">
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-[hsl(39_51%_71%)/0.05] flex items-center justify-center mb-4 border border-[hsl(39_51%_71%)/0.3] group-hover:bg-[hsl(39_51%_71%)/0.15] transition-colors shadow-[0_0_20px_rgba(217,173,124,0.1)] group-hover:shadow-[0_0_30px_rgba(217,173,124,0.4)] relative">
                <div className="absolute inset-0 bg-[hsl(39_51%_71%)] rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                <Clock3 className="text-[hsl(39_51%_71%)] relative z-10" size={24}/>
              </div>
              <span className="font-bold text-[10px] text-[hsl(39_51%_71%)] uppercase tracking-[0.2em] drop-shadow-sm">Assado no dia</span>
            </div>
            
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-[hsl(39_51%_71%)/0.05] flex items-center justify-center mb-4 border border-[hsl(39_51%_71%)/0.3] group-hover:bg-[hsl(39_51%_71%)/0.15] transition-colors shadow-[0_0_20px_rgba(217,173,124,0.1)] group-hover:shadow-[0_0_30px_rgba(217,173,124,0.4)] relative">
                <div className="absolute inset-0 bg-[hsl(39_51%_71%)] rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                <Truck className="text-[hsl(39_51%_71%)] relative z-10" size={24}/>
              </div>
              <span className="font-bold text-[10px] text-[hsl(39_51%_71%)] uppercase tracking-[0.2em] drop-shadow-sm">Delivery VIP</span>
            </div>
            
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-[hsl(39_51%_71%)/0.05] flex items-center justify-center mb-4 border border-[hsl(39_51%_71%)/0.3] group-hover:bg-[hsl(39_51%_71%)/0.15] transition-colors shadow-[0_0_20px_rgba(217,173,124,0.1)] group-hover:shadow-[0_0_30px_rgba(217,173,124,0.4)] relative">
                <div className="absolute inset-0 bg-[hsl(39_51%_71%)] rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                <Store className="text-[hsl(39_51%_71%)] relative z-10" size={24}/>
              </div>
              <span className="font-bold text-[10px] text-[hsl(39_51%_71%)] uppercase tracking-[0.2em] drop-shadow-sm">Retirada</span>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-10" />

          {/* LOCATION */}
          <a href="#" target="_blank" className="group relative flex flex-col items-center bg-white/5 border border-white/10 hover:border-[hsl(39_51%_71%)/0.5] hover:bg-white/10 transition-all rounded-[2rem] p-6 max-w-sm w-full backdrop-blur-md">
            <div className="absolute -top-4 w-8 h-8 rounded-full bg-[hsl(346_48%_26%)] border-2 border-[hsl(39_51%_71%)] flex items-center justify-center shadow-[0_0_15px_rgba(217,173,124,0.4)]">
               <MapPin size={14} className="text-[hsl(39_51%_71%)]" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[hsl(39_51%_71%)] mb-2 mt-2">Nossa Loja</span>
            <p className="text-[14px] text-white/90 font-medium leading-relaxed text-center group-hover:text-white transition-colors">[Aguardando o seu link de localização...]</p>
          </a>
          
          <p className="text-[12px] text-white/30 mt-12 font-medium">Feito com ♥ em São Paulo</p>
        </div>
      </footer>"""

    content = content[:start_idx] + new_footer + content[end_idx:]
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated Footer section.")
else:
    print("Could not find Footer section.")
