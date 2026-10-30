import re

path = r"c:\Users\App\Cookies" # just kidding
path = r"c:\Users\Usuario\Downloads\COOKIES E\Asset-Linker\artifacts\cookies-and-cookies\src\App.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

menu_old = "function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {\n  return ("
menu_new = "function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {\n  const { data: config } = useStoreConfig();\n  return ("
content = content.replace(menu_old, menu_new)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed MobileMenu config.")
