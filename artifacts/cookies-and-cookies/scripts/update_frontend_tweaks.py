import re

path = r"c:\Users\Usuario\Downloads\COOKIES E\Asset-Linker\artifacts\cookies-and-cookies\src\App.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove "Mandar um Direct" from MobileMenu
menu_old = "['https://ig.me/m/cookiesecookiesbg', 'Mandar um Direct', true]"
content = content.replace(", " + menu_old, "")
content = content.replace(menu_old, "")

# 2. Add "Acesso ADM" link in the footer of the Mobile Menu
menu_footer_old = """            <div className="mt-auto pt-10 border-t border-white/10">
              <h4 className="font-display font-bold text-[hsl(39_51%_71%)] tracking-[0.2em] uppercase text-[12px] mb-4">Cookies & Cookies</h4>
              <p className="text-[14px] text-white/50 leading-relaxed font-medium">R. Conrado Souza Lira, Qd 01 Lote 06 e 07<br/>Segunda a Sábado, 10h às 19h</p>
            </div>"""

menu_footer_new = """            <div className="mt-auto pt-10 border-t border-white/10 relative">
              <h4 className="font-display font-bold text-[hsl(39_51%_71%)] tracking-[0.2em] uppercase text-[12px] mb-4">Cookies & Cookies</h4>
              <p className="text-[14px] text-white/50 leading-relaxed font-medium">R. Conrado Souza Lira, Qd 01 Lote 06 e 07<br/>Segunda a Sábado, 10h às 19h</p>
              <a href="/admin" onClick={onClose} className="absolute right-0 bottom-0 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-[hsl(39_51%_71%)] transition-colors flex items-center gap-1"><Lock size={10} /> Acesso ADM</a>
            </div>"""
content = content.replace(menu_footer_old, menu_footer_new)

# 3. Remove "Mínimo de 2 deliciosos cookies!"
min_old = """<p className="text-[12px] text-white/70 font-medium mt-1">Mínimo de 2 deliciosos cookies!</p>"""
min_new = """"""
content = content.replace(min_old, min_new)

# 4. Remove Email from Checkout Form
email_old = """                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[hsl(346_48%_26%)/.6] mb-2 ml-4">E-mail (Opcional)</label>
                        <input type="email" placeholder="seu@email.com" className="w-full bg-white/50 border-2 border-white focus:border-[hsl(39_51%_71%)] outline-none rounded-full px-6 py-4 text-[hsl(346_48%_26%)] font-medium transition-all placeholder:text-[hsl(346_48%_26%)/.3] shadow-inner" />
                      </div>"""
content = content.replace(email_old, "")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated frontend tweaks.")
