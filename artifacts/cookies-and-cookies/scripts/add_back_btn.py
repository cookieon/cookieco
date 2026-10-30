import re

path = r"c:\Users\Usuario\Downloads\COOKIES E\Asset-Linker\artifacts\cookies-and-cookies\src\pages\Admin.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Make sure useLocation is imported
if "useLocation" not in content:
    content = content.replace("import React,", "import { useLocation } from 'wouter';\nimport React,")

# Add useLocation to AdminPage
if "const [location, setLocation] = useLocation();" not in content:
    content = content.replace("const queryClient = useQueryClient();", "const queryClient = useQueryClient();\n  const [location, setLocation] = useLocation();")

# Add the "Voltar" button
header_old = """          <button onClick={() => setIsAuthenticated(false)} className="text-white/50 hover:text-white flex items-center gap-2 text-sm font-medium"><LogOut size={16} /> Sair</button>"""
header_new = """          <div className="flex items-center gap-6">
            <button onClick={() => setLocation('/')} className="text-[hsl(39_51%_71%)]/80 hover:text-[hsl(39_51%_71%)] flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors"><Store size={16} /> Voltar para a Vitrine</button>
            <div className="w-px h-6 bg-white/10" />
            <button onClick={() => setIsAuthenticated(false)} className="text-white/50 hover:text-white flex items-center gap-2 text-sm font-medium"><LogOut size={16} /> Sair</button>
          </div>"""
content = content.replace(header_old, header_new)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Added back button to Admin.")
