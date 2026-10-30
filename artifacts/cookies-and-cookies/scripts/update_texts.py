import re

path = r"c:\Users\Usuario\Downloads\COOKIES E\Asset-Linker\artifacts\cookies-and-cookies\src\App.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("Nossa Loja", "Ponto de Retirada")
content = content.replace("Feito com ♥ em São Paulo", "Feito com ♥ em BG")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated texts.")
