import re

path = r"c:\Users\Usuario\Downloads\COOKIES E\Asset-Linker\artifacts\cookies-and-cookies\src\App.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# We need to replace the monte-sua-caixa section.
# We will create an inline component <BoxBuilder onAddToCart={...} /> and put it in place.

box_builder_component = """
function InlineBoxBuilder({ onAddToCart }: { onAddToCart: (item: any) => void }) {
  const [customSize, setCustomSize] = useState(4);
  const price = customSize * 15;

  const handleAdd = () => {
    onAddToCart({
      id: `box-${customSize}-${Date.now()}`,
      name: `Caixa Especial - ${customSize} Cookies`,
      descriptor: 'Sabores sortidos (escolha pelo WhatsApp).',
      price: price,
      image: ccLogo,
      quantity: 1,
      custom: true
    });
  };

  return (
    <div className="w-[100vw] relative left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#1a0e12] via-[hsl(346_48%_20%)] to-[#1a0e12] border-y border-[hsl(39_51%_71%)/.2] py-10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden mt-10">
      {/* Decorative tech background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,173,124,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[hsl(39_51%_71%)/.5] to-transparent opacity-50" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        
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
          </div>

          {/* Add to Cart */}
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="w-full sm:w-auto shrink-0 bg-[hsl(39_51%_71%)] text-[hsl(346_48%_26%)] px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[11px] shadow-[0_10px_25px_rgba(217,173,124,0.3)] hover:brightness-110 transition-all flex items-center justify-center gap-3"
          >
            Adicionar Caixa <span className="bg-[hsl(346_48%_26%)] text-[hsl(39_51%_71%)] px-3 py-1 rounded-full">{money(price)}</span>
          </motion.button>
        </div>
        
      </div>
    </div>
  );
}
"""

# Insert component before Home
if "function InlineBoxBuilder" not in content:
    content = content.replace("function Home(", box_builder_component + "\nfunction Home(")

# Find the old section
old_section = """        <section id="monte-sua-caixa" className="py-16 scroll-mt-24">
           <motion.div whileHover={{ scale: 1.01 }} className="caramel-bg rounded-[3rem] p-10 sm:p-16 text-center flex flex-col items-center shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden group border-4 border-white/10">
             {/* Presentinho movido pro canto superior direito e branco hiper leve para não ofuscar o texto */}
             <div className="absolute -right-10 -top-10 text-white/[0.15] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000 pointer-events-none mix-blend-overlay">
               <Gift size={280} strokeWidth={1} />
             </div>
             
             <div className="w-24 h-24 bg-[hsl(346_48%_26%)] rounded-full flex items-center justify-center mb-8 text-[hsl(39_51%_71%)] shadow-[0_15px_30px_rgba(98,34,48,0.4)] relative z-10 border-4 border-white/10"><Gift size={40} strokeWidth={1.5}/></div>
             <h3 className="font-display text-[40px] sm:text-[56px] text-[hsl(346_48%_26%)] mb-4 font-bold relative z-10 leading-[1.1] drop-shadow-sm">Para dividir<br/>(ou esconder)</h3>
             <p className="text-[15px] sm:text-[18px] text-[hsl(346_48%_26%)/.8] mb-10 max-w-[320px] sm:max-w-md leading-relaxed font-bold relative z-10">Por que escolher um se você pode levar a caixa inteira? Monte seu combo perfeito e aproveite o dobro de felicidade.</p>
             <button onClick={() => setLocation('/box')} className="bg-[hsl(346_48%_26%)] text-[hsl(39_51%_71%)] px-10 py-5 rounded-full text-[13px] font-bold uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(0,0,0,0.3)] w-full sm:w-auto hover:bg-[hsl(346_48%_20%)] hover:scale-105 transition-all relative z-10 border border-white/10">Montar Caixa Personalizada</button>
           </motion.div>
        </section>"""

new_section = """        <section id="monte-sua-caixa" className="py-8 scroll-mt-24">
           <InlineBoxBuilder onAddToCart={onAddToCart} />
        </section>"""

content = content.replace(old_section, new_section)

# We should also remove the '/box' route and BuildBoxPage from AppInner to keep it clean, but let's leave them unused in case they want it back, or just remove it from Switch
switch_old = """<Route path="/box" component={() => <BuildBoxPage onAddToCart={addToBag} products={products} />} />"""
content = content.replace(switch_old, "{/* " + switch_old + " */}")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated BoxBuilder")
