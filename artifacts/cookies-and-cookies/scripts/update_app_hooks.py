import re

path = r"c:\Users\Usuario\Downloads\COOKIES E\Asset-Linker\artifacts\cookies-and-cookies\src\App.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Add hooks at the top
hooks_str = """
// ==========================================
// DATA HOOKS
// ==========================================
function useStoreConfig() {
  return useQuery({
    queryKey: ['config'],
    queryFn: async () => {
      const { data, error } = await supabase.from('store_config').select('*').single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || { whatsapp_number: '5511999999999', instagram_url: 'https://instagram.com/cookiesecookiesbg', location_url: 'https://maps.app.goo.gl/nJj1VYYCerozeAod7', location_address: 'R. Conrado Souza Lira, Qd 01 Lote 06 e 07, Rainha de Fátima, Barra do Garças - MT', is_open: true };
    }
  });
}

function useMuralPhotos() {
  return useQuery({
    queryKey: ['mural'],
    queryFn: async () => {
      const { data, error } = await supabase.from('mural_photos').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });
}
"""

if "function useStoreConfig" not in content:
    content = content.replace("function BackgroundParticles() {", hooks_str + "\nfunction BackgroundParticles() {")


# 1. Update Home to use Mural Photos
# Find the Mural da Fama carousel part
mural_old = """                <div className="flex gap-4 sm:gap-6 w-max animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
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
                </div>"""

mural_new = """                <div className="flex gap-4 sm:gap-6 w-max animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
                  <MuralCarouselContent />
                </div>"""

mural_comp = """
function MuralCarouselContent() {
  const { data: photos = [] } = useMuralPhotos();
  const displayPhotos = photos.length > 0 ? photos.map(p => p.image_url) : ['/images/lifestyle_bite.jpg', '/images/lifestyle_split.jpg', '/images/lifestyle_hold.jpg', '/images/lifestyle_box.jpg'];
  
  return (
    <>
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex gap-4 sm:gap-6">
          {displayPhotos.map((src, idx) => (
            <div key={idx} className="w-[140px] h-[140px] sm:w-[200px] sm:h-[200px] shrink-0 rounded-2xl overflow-hidden border-2 border-white/10 shadow-lg group-hover/carousel:opacity-100 transition-opacity">
               <img src={src} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
"""

if "MuralCarouselContent" not in content:
    content = content.replace("function Home", mural_comp + "\nfunction Home")
    content = content.replace(mural_old, mural_new)

# 2. Update Footer Links
# Footer currently has hardcoded links and text
footer_old = """          <a href="https://maps.app.goo.gl/nJj1VYYCerozeAod7" target="_blank" className="group relative flex flex-col items-center bg-white/5 border border-white/10 hover:border-[hsl(39_51%_71%)/0.5] hover:bg-white/10 transition-all rounded-[2rem] p-6 max-w-sm w-full backdrop-blur-md">
            <div className="absolute -top-4 w-8 h-8 rounded-full bg-[hsl(346_48%_26%)] border-2 border-[hsl(39_51%_71%)] flex items-center justify-center shadow-[0_0_15px_rgba(217,173,124,0.4)]">
               <MapPin size={14} className="text-[hsl(39_51%_71%)]" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[hsl(39_51%_71%)] mb-2 mt-2">Ponto de Retirada</span>
            <p className="text-[14px] text-white/90 font-medium leading-relaxed text-center group-hover:text-white transition-colors">R. Conrado Souza Lira, Qd 01 Lote 06 e 07<br/>Rainha de Fátima, Barra do Garças - MT</p>
          </a>"""

footer_new = """          <FooterLocationBlock />"""

footer_comp = """
function FooterLocationBlock() {
  const { data: config } = useStoreConfig();
  if (!config) return null;
  return (
    <a href={config.location_url} target="_blank" className="group relative flex flex-col items-center bg-white/5 border border-white/10 hover:border-[hsl(39_51%_71%)/0.5] hover:bg-white/10 transition-all rounded-[2rem] p-6 max-w-sm w-full backdrop-blur-md">
      <div className="absolute -top-4 w-8 h-8 rounded-full bg-[hsl(346_48%_26%)] border-2 border-[hsl(39_51%_71%)] flex items-center justify-center shadow-[0_0_15px_rgba(217,173,124,0.4)]">
         <MapPin size={14} className="text-[hsl(39_51%_71%)]" />
      </div>
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[hsl(39_51%_71%)] mb-2 mt-2">Ponto de Retirada</span>
      <p className="text-[14px] text-white/90 font-medium leading-relaxed text-center group-hover:text-white transition-colors">{config.location_address}</p>
    </a>
  );
}
"""

if "FooterLocationBlock" not in content:
    content = content.replace("function AppInner() {", footer_comp + "\nfunction AppInner() {")
    content = content.replace(footer_old, footer_new)

# Update Mobile Menu address string
content = content.replace("R. Conrado Souza Lira, Qd 01 Lote 06 e 07<br/>Segunda a Sábado, 10h às 19h", "{config?.location_address}<br/>Segunda a Sábado, 10h às 19h")
# But MobileMenu doesn't have useStoreConfig!
menu_old = "function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {"
menu_new = """function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { data: config } = useStoreConfig();"""
content = content.replace(menu_old, menu_new)

# 3. Update Instagram CTA
cta_old = """<a href="https://instagram.com/cookiesecookiesbg" target="_blank" className="..."""
cta_new = """<InstagramCTA />"""

cta_comp = """
function InstagramCTA() {
  const { data: config } = useStoreConfig();
  return (
    <a href={config?.instagram_url || 'https://instagram.com/cookiesecookiesbg'} target="_blank" className="inline-block mt-4 border-2 border-[hsl(39_51%_71%)] text-[hsl(39_51%_71%)] px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[hsl(39_51%_71%)] hover:text-[#1a0e12] transition-colors relative z-10 backdrop-blur-md">
      Marcar @cookiesecookiesbg
    </a>
  );
}
"""
# Wait, I won't overcomplicate CTA, just replace it inline
# Let's just fix the Checkout to use Whatsapp
checkout_whatsapp_old = """// Aqui no futuro será a integração de checkout
    const orderDetails = cart.map(item => `${item.quantity}x ${item.name}`).join('%0A');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const message = `Olá! Gostaria de fazer um pedido:%0A%0A${orderDetails}%0A%0ATotal: R$ ${total.toFixed(2)}%0A%0ANome: ${customerData.name}`;
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');"""

checkout_whatsapp_new = """
    // Integração de checkout via WhatsApp dinâmico
    const adminPhone = config?.whatsapp_number || '5511999999999';
    const orderDetails = cart.map(item => `${item.quantity}x ${item.name}`).join('%0A');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const message = `Olá! Gostaria de fazer um pedido:%0A%0A${orderDetails}%0A%0ATotal: R$ ${total.toFixed(2)}%0A%0ANome: ${customerData.name}`;
    window.open(`https://wa.me/${adminPhone}?text=${message}`, '_blank');"""

content = content.replace(checkout_whatsapp_old, checkout_whatsapp_new)

# We need to add const { data: config } = useStoreConfig(); to AppInner to pass to checkout
appinner_old = """function AppInner() {
  const [location, setLocation] = useLocation();"""
appinner_new = """function AppInner() {
  const [location, setLocation] = useLocation();
  const { data: config } = useStoreConfig();"""
content = content.replace(appinner_old, appinner_new)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated App.tsx to use dynamic config and mural.")
