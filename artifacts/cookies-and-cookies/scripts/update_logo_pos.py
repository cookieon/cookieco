import re

path = r"c:\Users\Usuario\Downloads\COOKIES E\Asset-Linker\artifacts\cookies-and-cookies\src\App.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove the logo from the top of the footer
footer_top_old = """      <footer id="contato" className="bg-gradient-to-b from-black/20 to-black/60 backdrop-blur-3xl text-[hsl(35_43%_94%)] px-8 py-16 pb-40 mt-10 rounded-t-[3rem] max-w-4xl mx-auto border-t border-white/10 relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
          <Logo light />
          
          {/* ICONS SIDE-BY-SIDE */}"""

footer_top_new = """      <footer id="contato" className="bg-gradient-to-b from-black/20 to-black/60 backdrop-blur-3xl text-[hsl(35_43%_94%)] px-8 py-16 pb-40 mt-10 rounded-t-[3rem] max-w-4xl mx-auto border-t border-white/10 relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
          
          {/* ICONS SIDE-BY-SIDE */}"""

content = content.replace(footer_top_old, footer_top_new)

# Add the logo below the "Feito com..." text
footer_bot_old = """          <p className="text-[12px] text-white/30 mt-12 font-medium">Feito com ♥ em BG</p>
        </div>
      </footer>"""

footer_bot_new = """          <p className="text-[12px] text-white/30 mt-12 mb-6 font-medium">Feito com ♥ em BG</p>
          <Logo light />
        </div>
      </footer>"""

content = content.replace(footer_bot_old, footer_bot_new)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated logo position.")
