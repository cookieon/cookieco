import re

path = r"c:\Users\Usuario\Downloads\COOKIES E\Asset-Linker\artifacts\cookies-and-cookies\src\App.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("['#monte-sua-caixa', 'Monte sua Caixa', false]", "['#monte-seu-pedido', 'Monte seu Pedido', false]")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated MobileMenu link.")
