import re

path = r"c:\Users\Usuario\Downloads\COOKIES E\Asset-Linker\artifacts\cookies-and-cookies\src\App.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's remove any remaining WhatsApp instruction texts
content = content.replace("Sabores no WhatsApp!", "")
content = content.replace("Para dividir (ou esconder). Escolha os sabores no WhatsApp!", "")
content = content.replace("Mínimo de 2 deliciosos cookies!", "")

# Let's check for any portuguese typos.
# "Ponto de Retirada" -> correct
# "Acesso ADM" -> correct
# "Mandar um Direct" -> removed

# Fix checkout button alignment or bug if any
# Ensure no empty <p></p>
content = content.replace('<p className="text-[12px] sm:text-[13px] text-white/70 font-medium mt-1"></p>', '')
content = content.replace('<p className="text-[12px] text-white/70 font-medium mt-1"></p>', '')

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Removed lingering WhatsApp text.")
