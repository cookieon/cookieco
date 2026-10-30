import { useLocation } from 'wouter';
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Edit2, Check, X, Image as ImageIcon, Store, Settings, Star, Loader2, UploadCloud, LogOut, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
type Product = {
  id: string;
  name: string;
  descriptor: string;
  price: number;
  image: string;
  tag?: string;
  created_at?: string;
};

type MuralPhoto = {
  id: number;
  image_url: string;
};

type StoreConfig = {
  id: number;
  whatsapp_number: string;
  instagram_url: string;
  location_url: string;
  location_address: string;
  is_open: boolean;
  show_mural?: boolean;
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'cardapio' | 'mural' | 'config'>('cardapio');
  
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();

  // ----- AUTH -----
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'cookie123') setIsAuthenticated(true);
    else alert('Senha incorreta!');
  };

  // Se não autenticado, mostra o login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1a0e12] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-[hsl(346_48%_26%)] p-8 rounded-[2rem] shadow-2xl max-w-sm w-full border border-white/10 flex flex-col items-center">
          <div className="w-16 h-16 bg-[hsl(39_51%_71%)] rounded-full flex items-center justify-center text-[#1a0e12] mb-6 shadow-lg"><Store size={32} /></div>
          <h2 className="text-2xl font-display font-bold text-white mb-6">Acesso ADM</h2>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha secreta..." className="w-full bg-white/10 border-2 border-white/20 focus:border-[hsl(39_51%_71%)] outline-none rounded-full px-6 py-4 text-white font-medium transition-all text-center mb-6" />
          <button type="submit" className="w-full bg-[hsl(39_51%_71%)] text-[#1a0e12] px-6 py-4 rounded-full font-bold uppercase tracking-widest text-[12px] shadow-lg hover:brightness-110 transition-all">Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a0e12] text-white">
      {/* HEADER */}
      <header className="bg-[hsl(346_48%_26%)] border-b border-[hsl(39_51%_71%)]/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[hsl(39_51%_71%)] rounded-full flex items-center justify-center text-[#1a0e12]"><Store size={20} /></div>
            <h1 className="font-display font-bold text-xl text-[hsl(39_51%_71%)]">Painel ADM</h1>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => alert("As alterações são salvas automaticamente no sistema!")} className="text-[hsl(39_51%_71%)]/80 hover:text-[hsl(39_51%_71%)] flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors bg-[hsl(39_51%_71%)]/10 px-4 py-2 rounded-full"><Check size={16} /> Salvar Atualização</button>
            <button onClick={() => setLocation('/')} className="text-[hsl(39_51%_71%)]/80 hover:text-[hsl(39_51%_71%)] flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors"><Store size={16} /> Voltar para a Vitrine</button>
          </div>
        </div>
        
        {/* TABS */}
        <div className="max-w-6xl mx-auto px-4 flex gap-8 overflow-x-auto hide-scrollbar">
          {(['cardapio', 'mural', 'config'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 px-2 uppercase tracking-widest text-[11px] font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-[hsl(39_51%_71%)] text-[hsl(39_51%_71%)]' : 'border-transparent text-white/50 hover:text-white/80'}`}>
              {tab === 'cardapio' && <><Store size={14} className="inline mr-2 -mt-0.5" /> Cardápio</>}
              {tab === 'mural' && <><Star size={14} className="inline mr-2 -mt-0.5" /> Mural da Fama</>}
              {tab === 'config' && <><Settings size={14} className="inline mr-2 -mt-0.5" /> Configurações</>}
            </button>
          ))}
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'cardapio' && <ProductsManager />}
        {activeTab === 'mural' && <MuralManager />}
        {activeTab === 'config' && <ConfigManager />}
      </main>
    </div>
  );
}

// ==========================================
// UPLOAD HELPER
// ==========================================
async function uploadImage(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  
  const { error } = await supabase.storage.from('images').upload(fileName, file);
  if (error) throw error;
  
  const { data } = supabase.storage.from('images').getPublicUrl(fileName);
  return data.publicUrl;
}

// ==========================================
// CARDÁPIO MANAGER
// ==========================================
function ProductsManager() {
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [isUploading, setIsUploading] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      return data as Product[];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (prod: Partial<Product>) => {
      if (prod.id && products.find(p => p.id === prod.id)) {
        const { error } = await supabase.from('products').update(prod).eq('id', prod.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([prod]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditingId(null);
      setFormData({});
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      setIsUploading(true);
      const url = await uploadImage(e.target.files[0]);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (err) {
      alert("Erro ao enviar imagem. Verifique se o Bucket 'images' é público.");
    } finally {
      setIsUploading(false);
    }
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setFormData(p);
  };

  const startNew = () => {
    setEditingId('new');
    setFormData({ id: `cookie-${Date.now()}`, name: '', descriptor: '', price: 15, tag: '', image: '' });
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[hsl(39_51%_71%)]" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-display font-bold text-white">Gerenciar Cardápio</h2>
        <button onClick={startNew} className="bg-[hsl(39_51%_71%)] text-[#1a0e12] px-4 py-2 rounded-full font-bold uppercase tracking-widest text-[11px] flex items-center gap-2 hover:brightness-110 transition-all"><Plus size={14} /> Novo Produto</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Editor Modal/Card */}
        <AnimatePresence>
          {editingId && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-[#1a0e12] border border-[hsl(39_51%_71%)]/30 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
                <button onClick={() => setEditingId(null)} className="absolute top-4 right-4 text-white/50 hover:text-white"><X size={20} /></button>
                <h3 className="font-display text-xl font-bold text-[hsl(39_51%_71%)] mb-6">{editingId === 'new' ? 'Novo Cookie' : 'Editar Cookie'}</h3>
                
                <div className="space-y-4">
                  {/* Image Upload */}
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-white/5 border-2 border-dashed border-[hsl(39_51%_71%)]/50 flex items-center justify-center overflow-hidden mb-2 relative group">
                      {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <ImageIcon size={32} className="text-white/20" />}
                      <label className="absolute inset-0 bg-black/50 opacity-100 md:opacity-0 md:group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity">
                        {isUploading ? <Loader2 className="animate-spin text-white" /> : <><UploadCloud className="text-white mb-1" size={20} /><span className="text-[10px] text-white uppercase font-bold">Enviar</span></>}
                        <input type="file" accept="image/png, image/jpeg, image/jpg" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                      </label>
                    </div>
                  </div>

                  <div><label className="text-[10px] uppercase tracking-widest text-white/50 ml-2 font-bold">Nome</label><input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[hsl(39_51%_71%)]" /></div>
                  <div><label className="text-[10px] uppercase tracking-widest text-white/50 ml-2 font-bold">Descrição</label><textarea value={formData.descriptor || ''} onChange={e => setFormData({...formData, descriptor: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[hsl(39_51%_71%)] h-24" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-[10px] uppercase tracking-widest text-white/50 ml-2 font-bold">Preço (R$)</label><input type="number" value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[hsl(39_51%_71%)]" /></div>
                    <div><label className="text-[10px] uppercase tracking-widest text-white/50 ml-2 font-bold">Tag</label><input type="text" value={formData.tag || ''} onChange={e => setFormData({...formData, tag: e.target.value})} placeholder="Ex: Bestseller" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[hsl(39_51%_71%)]" /></div>
                  </div>

                  <button onClick={() => saveMutation.mutate(formData)} disabled={isUploading || saveMutation.isPending} className="w-full mt-4 bg-[hsl(39_51%_71%)] text-[#1a0e12] px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-[12px] shadow-lg flex items-center justify-center gap-2">
                    {saveMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />} Salvar Produto
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Cards */}
        {products.map(p => (
          <div key={p.id} className="bg-white/5 border border-[hsl(39_51%_71%)]/20 rounded-3xl p-4 flex flex-col relative group">
            <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
              <button onClick={() => startEdit(p)} className="w-8 h-8 rounded-full bg-[hsl(39_51%_71%)] text-[#1a0e12] flex items-center justify-center shadow-lg"><Edit2 size={14} /></button>
              <button onClick={() => { if(confirm('Excluir?')) deleteMutation.mutate(p.id) }} className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg"><Trash2 size={14} /></button>
            </div>
            
            <div className="h-48 rounded-2xl overflow-hidden mb-4 relative">
              <img src={p.image} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0e12] to-transparent opacity-80" />
              <span className="absolute bottom-4 left-4 font-display font-bold text-2xl text-[hsl(39_51%_71%)] drop-shadow-md">R$ {p.price}</span>
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">{p.name}</h3>
            <p className="text-white/60 text-sm line-clamp-2">{p.descriptor}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// MURAL MANAGER
// ==========================================
function MuralManager() {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const { data: rawPhotos = [], isLoading } = useQuery({
    queryKey: ['mural'],
    queryFn: async () => {
      const { data, error } = await supabase.from('mural_photos').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as MuralPhoto[];
    }
  });

  // Oculta/Mostra via registro especial no Supabase mural_photos
  const isMuralHidden = rawPhotos.some(p => p.image_url === '__CONFIG_SHOW_MURAL:false__');
  const showMural = !isMuralHidden;

  // Filtra as fotos visíveis retirando qualquer registro de configuração
  const photos = rawPhotos.filter(p => !p.image_url.startsWith('__CONFIG_'));

  const toggleMuralMutation = useMutation({
    mutationFn: async (visible: boolean) => {
      if (!visible) {
        // Ocultar mural -> salva flag no Supabase
        const alreadyHidden = rawPhotos.some(p => p.image_url === '__CONFIG_SHOW_MURAL:false__');
        if (!alreadyHidden) {
          const { error } = await supabase.from('mural_photos').insert([{ image_url: '__CONFIG_SHOW_MURAL:false__' }]);
          if (error) throw error;
        }
      } else {
        // Mostrar mural -> deleta flag
        const { error } = await supabase.from('mural_photos').delete().eq('image_url', '__CONFIG_SHOW_MURAL:false__');
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mural'] });
    },
    onError: (err: any) => {
      alert("Erro ao alterar visibilidade: " + (err?.message || "Tente novamente."));
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('mural_photos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mural'] })
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      setIsUploading(true);
      const file = e.target.files[0];
      const url = await uploadImage(file);
      
      const { error } = await supabase.from('mural_photos').insert([{ image_url: url }]);
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['mural'] });
    } catch (err) {
      alert("Erro ao enviar imagem. Verifique se o Bucket 'images' é público.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[hsl(39_51%_71%)]" size={40} /></div>;

  return (
    <div>
      {/* Botão de Controle de Visibilidade */}
      <div className={`mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border transition-all ${showMural ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${showMural ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {showMural ? <Eye size={20} /> : <EyeOff size={20} />}
          </div>
          <div>
            <h4 className="font-bold text-white text-base">
              {showMural ? 'Mural da Fama Visível no Cardápio' : 'Mural da Fama Oculto no Cardápio'}
            </h4>
            <p className="text-white/60 text-xs">
              {showMural
                ? 'Os clientes estão vendo a seção do Mural com as fotos.'
                : 'A seção do Mural da Fama está temporariamente escondida para os clientes.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => toggleMuralMutation.mutate(!showMural)}
          disabled={toggleMuralMutation.isPending}
          className={`px-6 py-3 rounded-full font-bold uppercase tracking-widest text-[11px] shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105 ${
            showMural
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {toggleMuralMutation.isPending ? (
            <Loader2 className="animate-spin" size={14} />
          ) : showMural ? (
            <>
              <EyeOff size={14} /> Esconder Mural
            </>
          ) : (
            <>
              <Eye size={14} /> Mostrar Mural
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Fotos do Mural</h2>
          <p className="text-white/50 text-xs">Gerencie as fotos que aparecem na esteira do mural</p>
        </div>
        
        <label className="bg-[hsl(39_51%_71%)] text-[#1a0e12] px-6 py-3 rounded-full font-bold uppercase tracking-widest text-[11px] flex items-center gap-2 hover:brightness-110 transition-all cursor-pointer shadow-lg">
          {isUploading ? <Loader2 className="animate-spin" size={14} /> : <UploadCloud size={14} />} Adicionar Foto
          <input type="file" accept="image/png, image/jpeg, image/jpg" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {photos.map(photo => (
          <div key={photo.id} className="aspect-square rounded-2xl overflow-hidden relative group border border-white/10">
            <img src={photo.image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Mural" />
            <div className="absolute inset-0 bg-black/50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={() => { if(confirm('Remover foto do mural?')) deleteMutation.mutate(photo.id) }} className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {photos.length === 0 && <div className="col-span-full text-center py-20 text-white/50">Nenhuma foto no mural.</div>}
      </div>
    </div>
  );
}


// ==========================================
// THEME TOGGLE
// ==========================================
function ThemeToggle() {
  const [isHalloween, setIsHalloween] = React.useState<boolean>(
    localStorage.getItem('cc_halloween') !== 'false'
  );

  const handleToggle = (val: boolean) => {
    if (val) {
      localStorage.removeItem('cc_halloween');
    } else {
      localStorage.setItem('cc_halloween', 'false');
    }
    setIsHalloween(val);
    setTimeout(() => window.location.reload(), 400);
  };

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border transition-all ${isHalloween ? 'bg-orange-500/10 border-orange-500/30' : 'bg-white/5 border-white/10'}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isHalloween ? 'bg-orange-500/20' : 'bg-white/10'}`}>
          {isHalloween ? '🎃' : '🍪'}
        </div>
        <div>
          <h4 className="font-bold text-white text-base">
            Tema de Halloween {isHalloween ? '— Ativo' : '— Desativado'}
          </h4>
          <p className="text-white/50 text-xs mt-0.5">
            {isHalloween
              ? 'Aboboras, morcegos e fantasma ativados. Desative para o visual padrao.'
              : 'Tema padrao ativo. Ative para ligar os elementos de Halloween.'}
          </p>
        </div>
      </div>
      <button
        onClick={() => handleToggle(!isHalloween)}
        className={`px-6 py-3 rounded-full font-bold uppercase tracking-widest text-[11px] shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105 whitespace-nowrap ${
          isHalloween
            ? 'bg-white/10 text-white/70 hover:bg-white/20'
            : 'bg-orange-500 text-white hover:bg-orange-600'
        }`}
      >
        {isHalloween ? 'Desativar Halloween' : 'Ativar Halloween'}
      </button>
    </div>
  );
}
// ==========================================
// CONFIG MANAGER
// ==========================================
function ConfigManager() {
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const [formData, setFormData] = useState<StoreConfig | null>(null);

  // Supabase coupons
  const { data: coupons = [], isLoading: isLoadingCoupons } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const { data, error } = await supabase.from('store_coupons').select('*').order('created_at', { ascending: false });
      if (error && error.code !== '42P01') throw error;
      return data || [];
    }
  });

  const [newCouponName, setNewCouponName] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');

  const addCouponMutation = useMutation({
    mutationFn: async (coupon: { name: string, discount: number }) => {
      const { error } = await supabase.from('store_coupons').insert([coupon]);
      if (error && error.code !== '42P01') throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coupons'] })
  });

  const removeCouponMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('store_coupons').delete().eq('id', id);
      if (error && error.code !== '42P01') throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coupons'] })
  });

  const handleAddCoupon = () => {
    if (!newCouponName || !newCouponDiscount) return;
    const discount = Number(newCouponDiscount);
    if (isNaN(discount) || discount <= 0 || discount > 100) {
      alert("Desconto inválido. Use um valor entre 1 e 100.");
      return;
    }
    addCouponMutation.mutate({ name: newCouponName.toUpperCase(), discount });
    setNewCouponName('');
    setNewCouponDiscount('');
  };

  const handleRemoveCoupon = (id: number) => {
    if (id !== undefined) {
      removeCouponMutation.mutate(id);
    }
  };

  const { data: config, isLoading } = useQuery({
    queryKey: ['config'],
    queryFn: async () => {
      const { data, error } = await supabase.from('store_config').select('*').single();
      if (error && error.code !== 'PGRST116') throw error; // ignore no rows
      return (data as StoreConfig) || { id: 1, whatsapp_number: '', instagram_url: '', location_url: '', location_address: '', is_open: true };
    }
  });

  useEffect(() => {
    if (config) setFormData(config);
  }, [config]);

  const saveMutation = useMutation({
    mutationFn: async (conf: StoreConfig) => {
      const { error } = await supabase.from('store_config').upsert(conf);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] });
      alert("Configurações salvas com sucesso!");
    }
  });

  if (isLoading || !formData) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[hsl(39_51%_71%)]" size={40} /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* TEMAS */}
      <div>
        <h2 className="text-2xl font-display font-bold text-white mb-6">Temas</h2>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <ThemeToggle />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-display font-bold text-white mb-6">Configurações da Loja</h2>
        
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[hsl(39_51%_71%)] font-bold mb-2">Status da Loja</label>
            <button onClick={() => setFormData({...formData, is_open: !formData.is_open})} className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-[12px] transition-colors border-2 ${formData.is_open ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'}`}>
              {formData.is_open ? '🟢 Loja Aberta (Recebendo Pedidos)' : '🔴 Loja Fechada'}
            </button>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[hsl(39_51%_71%)] font-bold mb-2">WhatsApp (com DDD, apenas números)</label>
            <input type="text" value={formData.whatsapp_number} onChange={e => setFormData({...formData, whatsapp_number: e.target.value})} placeholder="Ex: 5511999999999" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[hsl(39_51%_71%)]" />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[hsl(39_51%_71%)] font-bold mb-2">Link do Instagram</label>
            <input type="text" value={formData.instagram_url} onChange={e => setFormData({...formData, instagram_url: e.target.value})} placeholder="https://instagram.com/seu_perfil" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[hsl(39_51%_71%)]" />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[hsl(39_51%_71%)] font-bold mb-2">Endereço (Texto exibido no site)</label>
            <textarea value={formData.location_address} onChange={e => setFormData({...formData, location_address: e.target.value})} placeholder="Rua XYZ, 123 - Cidade" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[hsl(39_51%_71%)] h-20" />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[hsl(39_51%_71%)] font-bold mb-2">Link do Google Maps</label>
            <input type="text" value={formData.location_url} onChange={e => setFormData({...formData, location_url: e.target.value})} placeholder="https://maps.app.goo.gl/..." className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[hsl(39_51%_71%)]" />
          </div>

          <div className="pt-4 border-t border-white/10">
            <button onClick={() => saveMutation.mutate(formData)} disabled={saveMutation.isPending} className="w-full bg-[hsl(39_51%_71%)] text-[#1a0e12] px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-[12px] shadow-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all">
              {saveMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />} Salvar Alterações
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-display font-bold text-white mb-6">Cupons de Desconto</h2>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            <div className="flex-1">
              <label className="block text-[10px] uppercase tracking-widest text-[hsl(39_51%_71%)] font-bold mb-2">Nome do Cupom</label>
              <input type="text" value={newCouponName} onChange={e => setNewCouponName(e.target.value)} placeholder="Ex: COOKIES10" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[hsl(39_51%_71%)]" />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] uppercase tracking-widest text-[hsl(39_51%_71%)] font-bold mb-2">Desconto (%)</label>
              <input type="number" value={newCouponDiscount} onChange={e => setNewCouponDiscount(e.target.value)} placeholder="Ex: 10" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[hsl(39_51%_71%)]" />
            </div>
            <button onClick={handleAddCoupon} className="w-full md:w-auto bg-[hsl(39_51%_71%)] text-[#1a0e12] px-6 py-3 md:h-[46px] rounded-xl font-bold uppercase tracking-widest text-[12px] hover:brightness-110 transition-all">
              Adicionar
            </button>
          </div>

          <div className="space-y-3 mt-6">
            {coupons.length === 0 && <p className="text-white/50 text-sm">Nenhum cupom ativo no momento.</p>}
            {coupons.map((coupon, idx) => (
              <div key={idx} className="flex items-center justify-between bg-black/20 border border-white/10 rounded-xl px-4 py-3">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-white text-lg">{coupon.name}</span>
                  <span className="text-[hsl(39_51%_71%)] font-bold text-sm bg-[hsl(39_51%_71%)]/10 px-2 py-1 rounded-md">{coupon.discount}% OFF</span>
                </div>
                <button onClick={() => handleRemoveCoupon(coupon.id)} className="text-red-400 hover:text-red-300 transition-colors p-2">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
