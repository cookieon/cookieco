import re

path = r"c:\Users\Usuario\Downloads\COOKIES E\Asset-Linker\artifacts\cookies-and-cookies\src\App.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Add Acesso ADM to MobileMenu footer
menu_footer_old = """          <div className="bg-[hsl(346_48%_20%)] p-8 border-t border-white/10 pb-12 relative z-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[hsl(39_51%_71%)] mb-3">Cookies & Cookies</p>
            <p className="text-[14px] text-white/80 font-medium leading-relaxed mb-6">{config?.location_address}<br/>Segunda a Sábado, 10h às 19h</p>
            <a href="https://instagram.com/cookiesecookiesbg" target="_blank" className="inline-flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.1em] text-white bg-white/10 px-6 py-4 rounded-full hover:bg-[hsl(39_51%_71%)] hover:text-[hsl(346_48%_26%)] transition-colors"><Instagram size={20}/> @cookiesecookiesbg</a>
          </div>"""

menu_footer_new = """          <div className="bg-[hsl(346_48%_20%)] p-8 border-t border-white/10 pb-12 relative z-10 flex flex-col">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[hsl(39_51%_71%)] mb-3">Cookies & Cookies</p>
            <p className="text-[14px] text-white/80 font-medium leading-relaxed mb-6">{config?.location_address}<br/>Segunda a Sábado, 10h às 19h</p>
            
            <div className="flex items-center justify-between mt-auto">
              <a href={config?.instagram_url || 'https://instagram.com/cookiesecookiesbg'} target="_blank" className="inline-flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.1em] text-white bg-white/10 px-6 py-4 rounded-full hover:bg-[hsl(39_51%_71%)] hover:text-[hsl(346_48%_26%)] transition-colors"><Instagram size={20}/> @cookiesecookiesbg</a>
              
              <a href="/admin" onClick={onClose} className="text-[10px] font-bold uppercase tracking-widest text-[hsl(39_51%_71%)] hover:brightness-110 transition-colors flex flex-col items-center gap-1 opacity-60 hover:opacity-100">
                <Store size={14} /> Acesso ADM
              </a>
            </div>
          </div>"""

# Try to match old or partial old
if menu_footer_old in content:
    content = content.replace(menu_footer_old, menu_footer_new)
else:
    # Let's just do a regex
    content = re.sub(r'<div className="bg-\[hsl\(346_48%_20%\)\].*?</div>\s*</motion\.div>', menu_footer_new + "\n        </motion.div>", content, flags=re.DOTALL)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Added ADM button.")
