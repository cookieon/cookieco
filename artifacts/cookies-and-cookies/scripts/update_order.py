import re

path = r"c:\Users\Usuario\Downloads\COOKIES E\Asset-Linker\artifacts\cookies-and-cookies\src\App.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# We need to replace function InlineBoxBuilder with function InlineOrderBuilder

order_builder_code = """
function InlineOrderBuilder({ onAddToCart, products }: { onAddToCart: (item: any) => void; products: any[] }) {
  const [selections, setSelections] = useState<Record<string, number>>({});
  
  const totalItems = Object.values(selections).reduce((a, b) => a + b, 0);
  const isValid = totalItems >= 2;
  
  // Calculate total price based on selections
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
    
    // Add all selected products to the cart individually
    products.forEach(p => {
      const qty = selections[p.id] || 0;
      if (qty > 0) {
        onAddToCart(p, qty, false);
      }
    });
    
    // Reset selections after adding
    setSelections({});
  };

  return (
    <div className="w-[100vw] relative left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#1a0e12] via-[hsl(346_48%_20%)] to-[#1a0e12] border-y border-[hsl(39_51%_71%)/.2] py-10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden mt-10">
      {/* Decorative tech background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,173,124,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[hsl(39_51%_71%)/.5] to-transparent opacity-50" />
      
      <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-10">
        
        <div className="flex items-center gap-4 sm:gap-5 text-left shrink-0">
          <div className="hidden sm:flex w-14 h-14 rounded-full bg-[hsl(39_51%_71%)] items-center justify-center text-[hsl(346_48%_26%)] shadow-[0_0_30px_rgba(217,173,124,0.4)] shrink-0">
            <Gift size={24} strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-display text-[26px] sm:text-[32px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[hsl(39_51%_71%)] to-white leading-tight whitespace-nowrap">Monte seu Pedido</h3>
            <p className="text-[12px] text-white/70 font-medium mt-1">Mínimo de 2 deliciosos cookies!</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 w-full lg:w-auto shrink-0">
          {/* Flavor Counters */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-black/20 p-3 sm:p-4 rounded-3xl sm:rounded-full border border-white/10 backdrop-blur-md shadow-inner w-full sm:w-auto">
            {products.map(p => {
              const qty = selections[p.id] || 0;
              return (
                <div key={p.id} className="flex items-center gap-3 bg-white/5 pr-3 rounded-full hover:bg-white/10 transition-colors w-full sm:w-auto">
                  <img src={p.image} className="w-10 h-10 rounded-full object-cover shadow-sm border border-white/20" alt="" />
                  <span className="font-bold text-[11px] uppercase tracking-wider text-white truncate w-24 sm:w-auto">{p.name}</span>
                  <div className="flex items-center gap-2 ml-auto sm:ml-2">
                    <button onClick={() => handleAdd(p.id, -1)} className="w-6 h-6 rounded-full bg-black/40 flex items-center justify-center text-white/70 hover:text-white transition-colors"><Minus size={12} /></button>
                    <span className="font-display font-bold text-lg text-[hsl(39_51%_71%)] w-4 text-center">{qty}</span>
                    <button onClick={() => handleAdd(p.id, 1)} className="w-6 h-6 rounded-full bg-[hsl(39_51%_71%)] flex items-center justify-center text-[hsl(346_48%_26%)] hover:brightness-110 transition-colors"><Plus size={12} strokeWidth={3} /></button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add to Cart */}
          <motion.button 
            whileTap={isValid ? { scale: 0.95 } : {}}
            onClick={handleConfirm}
            disabled={!isValid}
            className={`shrink-0 px-6 py-4 rounded-full font-bold uppercase tracking-widest text-[11px] sm:text-[12px] flex items-center justify-center gap-2 sm:gap-3 transition-all ${isValid ? 'bg-[hsl(39_51%_71%)] text-[hsl(346_48%_26%)] shadow-[0_10px_25px_rgba(217,173,124,0.3)] hover:brightness-110' : 'bg-white/10 text-white/40 cursor-not-allowed'}`}
          >
            Adicionar Pedido {isValid && <span className="bg-[hsl(346_48%_26%)] text-[hsl(39_51%_71%)] px-3 py-1 rounded-full ml-1">{money(totalPrice)}</span>}
          </motion.button>
        </div>
        
      </div>
    </div>
  );
}
"""

# Extract old InlineBoxBuilder
start_str = "function InlineBoxBuilder("
end_str = "  );\n}\n"
start_idx = content.find(start_str)
end_idx = content.find(end_str, start_idx) + len(end_str)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + order_builder_code + content[end_idx:]

# Update usage in Home component
content = content.replace("<InlineBoxBuilder onAddToCart={onAddToCart} />", "<InlineOrderBuilder onAddToCart={onAddToCart} products={products} />")
content = content.replace('id="monte-sua-caixa"', 'id="monte-seu-pedido"')

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Replaced InlineBoxBuilder with InlineOrderBuilder")
