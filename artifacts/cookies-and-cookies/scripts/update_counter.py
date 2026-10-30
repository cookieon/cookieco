import re

path = r"c:\Users\Usuario\Downloads\COOKIES E\Asset-Linker\artifacts\cookies-and-cookies\src\App.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Change useState(4) to useState(2)
content = content.replace("const [customSize, setCustomSize] = useState(4);", "const [customSize, setCustomSize] = useState(2);")

# Remove the quick selectors and just leave the counter
box_selectors_old = """          {/* Quick selectors */}
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

box_selectors_new = """          {/* Custom counter só */}
          <div className="flex items-center justify-between gap-4 bg-black/20 p-2 sm:p-3 rounded-full border border-white/10 backdrop-blur-md shadow-inner w-full sm:w-auto">
            <span className="text-[12px] font-bold uppercase tracking-widest text-white/50 pl-4 hidden sm:block">Quantidade</span>
            <div className="flex items-center gap-4 px-2">
              <button onClick={() => setCustomSize(Math.max(2, customSize - 1))} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors shadow-[0_0_15px_rgba(0,0,0,0.2)]"><Minus size={18} /></button>
              <span className="font-display font-bold text-2xl sm:text-3xl text-[hsl(39_51%_71%)] w-12 text-center drop-shadow-md">{customSize}</span>
              <button onClick={() => setCustomSize(customSize + 1)} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[hsl(39_51%_71%)] flex items-center justify-center text-[hsl(346_48%_26%)] hover:brightness-110 transition-colors shadow-[0_0_20px_rgba(217,173,124,0.4)]"><Plus size={18} strokeWidth={3} /></button>
            </div>
          </div>"""

content = content.replace(box_selectors_old, box_selectors_new)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated BoxBuilder counter.")
