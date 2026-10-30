import re

path = r"c:\Users\Usuario\Downloads\COOKIES E\Asset-Linker\artifacts\cookies-and-cookies\src\App.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update MobileMenu to add Direct link
menu_links_old = """{[['#cardapio', 'Nosso Cardápio'], ['#monte-sua-caixa', 'Monte sua Caixa'], ['#sobre', 'Sua Foto Aqui']].map(([href, label]) => <a key={href} href={href} onClick={onClose} className="font-display text-[40px] leading-none font-bold text-white hover:text-[hsl(39_51%_71%)] transition-colors flex items-center justify-between group">{label} <ArrowRight size={32} className="text-[hsl(39_51%_71%)] opacity-0 group-hover:opacity-100 transform -translate-x-10 group-hover:translate-x-0 transition-all duration-500" /></a>)}"""
menu_links_new = """{[['#cardapio', 'Nosso Cardápio', false], ['#monte-sua-caixa', 'Monte sua Caixa', false], ['#sobre', 'Mural da Fama', false], ['https://instagram.com/direct/t/', 'Mandar um Direct', true]].map(([href, label, isExternal]) => <a key={href as string} href={href as string} target={isExternal ? '_blank' : '_self'} onClick={onClose} className="font-display text-[36px] sm:text-[40px] leading-none font-bold text-white hover:text-[hsl(39_51%_71%)] transition-colors flex items-center justify-between group">{label as string} <ArrowRight size={32} className="text-[hsl(39_51%_71%)] opacity-0 group-hover:opacity-100 transform -translate-x-10 group-hover:translate-x-0 transition-all duration-500" /></a>)}"""

content = content.replace(menu_links_old, menu_links_new)

# 2. Add Marquee animation to Tailwind CSS (in index.css)
index_css_path = r"c:\Users\Usuario\Downloads\COOKIES E\Asset-Linker\artifacts\cookies-and-cookies\src\index.css"
with open(index_css_path, "r", encoding="utf-8") as f:
    css_content = f.read()

marquee_css = """
@theme {
  --animate-marquee: marquee 25s linear infinite;
  
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(-50% - 1rem)); }
  }
}
"""
if "marquee" not in css_content:
    with open(index_css_path, "w", encoding="utf-8") as f:
        f.write(css_content + marquee_css)

# 3. Update the "#sobre" section (Mural da Fama)
# We will use the generated images in a scrolling marquee
mural_old = """             <h3 className="font-display text-[36px] sm:text-[48px] text-white mb-6 font-bold relative z-10 leading-[1.1] drop-shadow-lg">Apareça no nosso<br/><span className="text-[hsl(39_51%_71%)]">Mural da Fama</span></h3>
             
             <p className="text-[14px] sm:text-[16px] text-white/80 mb-10 max-w-[300px] sm:max-w-md leading-relaxed font-medium relative z-10">Tire uma foto bem linda do seu momento com nossos cookies, poste nos stories e marque a gente! Sua foto pode vir parar aqui no aplicativo!</p>"""

mural_new = """             <h3 className="font-display text-[36px] sm:text-[48px] text-white mb-8 font-bold relative z-10 leading-[1.1] drop-shadow-lg">Apareça no nosso<br/><span className="text-[hsl(39_51%_71%)]">Mural da Fama</span></h3>
             
             {/* Carousel Marquee */}
             <div className="w-full overflow-hidden relative z-10 mb-10 -mx-8 sm:-mx-16 px-4">
                {/* Fading edges */}
                <div className="absolute inset-y-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-[#1a0e12] to-transparent z-20" />
                <div className="absolute inset-y-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-[#1a0e12] to-transparent z-20" />
                
                <div className="flex gap-4 sm:gap-6 w-max animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
                  {/* We duplicate the images to make the infinite loop smooth */}
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex gap-4 sm:gap-6">
                      {['/images/lifestyle_bite.jpg', '/images/lifestyle_split.jpg', '/images/lifestyle_hold.jpg', '/images/lifestyle_box.jpg', redVelvetPhoto, alpinoBlackPhoto, kinderBuenoPhoto].map((src, idx) => (
                        <div key={idx} className="w-[140px] h-[140px] sm:w-[200px] sm:h-[200px] shrink-0 rounded-2xl overflow-hidden border-2 border-white/10 shadow-lg group-hover/carousel:opacity-100 transition-opacity">
                           <img src={src} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
             </div>

             <p className="text-[14px] sm:text-[16px] text-white/80 mb-10 max-w-[300px] sm:max-w-md leading-relaxed font-medium relative z-10">Tire uma foto bem linda do seu momento com nossos cookies, poste nos stories e marque a gente! Sua foto pode vir parar aqui no aplicativo!</p>"""

content = content.replace(mural_old, mural_new)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
