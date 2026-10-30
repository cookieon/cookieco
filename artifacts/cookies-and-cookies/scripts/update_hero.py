import re

path = r"c:\Users\Usuario\Downloads\COOKIES E\Asset-Linker\artifacts\cookies-and-cookies\src\App.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

hero_old = """            <div className="relative z-10 backdrop-blur-xl bg-white/20 p-8 rounded-[2.5rem] border border-white/40 inline-block self-start shadow-2xl">
              <span className="inline-block bg-[hsl(346_48%_26%)] text-[hsl(39_51%_71%)] px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-5 shadow-lg border border-white/10">Sabor sem limites</span>
              <h1 className="font-display text-[52px] sm:text-[72px] leading-[1.05] mb-3 font-bold drop-shadow-md text-[hsl(346_48%_26%)] tracking-tight">Cookies<br/>& Cookies</h1>
              <p className="text-[16px] sm:text-[18px] font-display italic text-[hsl(346_48%_26%)/.9] leading-snug font-bold mt-2 drop-shadow-sm">O dobro de sabor,<br/>quentinho para você.</p>
            </div>"""

hero_new = """            <div className="relative z-10 inline-block self-start pb-8 pl-4">
              <h1 className="font-display text-[64px] sm:text-[84px] leading-[1] mb-2 font-bold drop-shadow-xl text-[hsl(346_48%_26%)] tracking-tight">Cookies<br/>& Cookies</h1>
              <p className="text-[18px] sm:text-[22px] font-display italic text-[hsl(346_48%_26%)] leading-snug font-bold mt-2 drop-shadow-md">O dobro de sabor,<br/>quentinho para você.</p>
            </div>"""

content = content.replace(hero_old, hero_new)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Hero section.")
