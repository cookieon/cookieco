@echo off
chcp 65001 >nul
title Cookies & Cookies - Cardápio
echo ========================================================
echo   🍪 COOKIES & COOKIES - CARDÁPIO DIGITAL ATUAL
echo ========================================================
echo.
echo Iniciando o servidor do cardápio...
echo Acesse no seu navegador:
echo http://localhost:3333
echo.
echo Para fechar o servidor, basta fechar esta janela.
echo ========================================================
echo.

start http://localhost:3333

python -m http.server 3333 --directory "%~dp0artifacts\cookies-and-cookies\dist\public"
pause
