import re

path = r"c:\Users\Usuario\Downloads\COOKIES E\Asset-Linker\artifacts\cookies-and-cookies\src\App.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

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

if "function useStoreConfig" in content:
    # Remove it from wherever it is currently
    content = content.replace(hooks_str, "")
    
# Add it right after imports
import_end = "import NotFound from '@/pages/not-found';"
if import_end in content:
    content = content.replace(import_end, import_end + "\n" + hooks_str)

# Double check if AppInner has config:
if "const { data: config } = useStoreConfig();" not in content:
    print("WARNING: useStoreConfig missing from somewhere.")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Moved hooks to top.")
