import re

path = r"c:\Users\Usuario\Downloads\COOKIES E\Asset-Linker\artifacts\cookies-and-cookies\src\App.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace all occurrences of "@cookiesandcookies" with "@cookiesecookiesbg"
content = content.replace("@cookiesandcookies", "@cookiesecookiesbg")

# Replace "https://instagram.com" with "https://instagram.com/cookiesecookiesbg" where appropriate
# Let's just be explicit:
content = content.replace('href="https://instagram.com"', 'href="https://instagram.com/cookiesecookiesbg" target="_blank"')

# Update Direct Link
content = content.replace("https://instagram.com/direct/t/", "https://ig.me/m/cookiesecookiesbg")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Instagram handle and links.")
