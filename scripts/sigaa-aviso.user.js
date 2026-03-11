// ==UserScript==
// @name         SIGAA Ultimate - Aviso
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Clean Code
// @author       Gusttavo
// @match        *://si3.ufc.br/sigaa/telaAvisoLogon.jsf*
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        themeKey: 'sigaa_palette',
        darkModeKey: 'sigaa_dark_mode'
    };

    const PALETTES = {
        ufc: { name: "UFC (Original)", primary: '#3b82f6', hover: '#2563eb', light: { bg: '#f8fafc', card: '#ffffff', text: '#1e293b', subtext: '#64748b', border: '#e2e8f0', welcome: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }, dark: { bg: '#0f172a', card: '#1e293b', text: '#f1f5f9', subtext: '#94a3b8', border: '#334155', welcome: 'linear-gradient(135deg, #172554 0%, #1e293b 100%)' } },
        rocket: { name: "Rocketseat", primary: '#8257e6', hover: '#996DFF', light: { bg: '#f4f4fa', card: '#ffffff', text: '#202024', subtext: '#4d4d57', border: '#e1e1e6', welcome: 'linear-gradient(135deg, #8257e6 0%, #202024 100%)' }, dark: { bg: '#121214', card: '#202024', text: '#e1e1e6', subtext: '#a8a8b3', border: '#29292e', welcome: 'linear-gradient(135deg, #4c1d95 0%, #121214 100%)' } },
        matrix: { name: "Matrix", primary: '#00e639', hover: '#00ff41', light: { bg: '#f0fdf4', card: '#ffffff', text: '#064e3b', subtext: '#065f46', border: '#bbf7d0', welcome: 'linear-gradient(135deg, #052e16 0%, #166534 100%)' }, dark: { bg: '#000000', card: '#0a120a', text: '#00ff41', subtext: '#008F11', border: '#003300', welcome: 'linear-gradient(135deg, #002600 0%, #004d00 100%)' } },
        orange: { name: "Laranja", primary: '#f97316', hover: '#ea580c', light: { bg: '#fff7ed', card: '#ffffff', text: '#431407', subtext: '#7c2d12', border: '#fed7aa', welcome: 'linear-gradient(135deg, #9a3412 0%, #f97316 100%)' }, dark: { bg: '#1c1917', card: '#292524', text: '#fafaf9', subtext: '#a8a29e', border: '#44403c', welcome: 'linear-gradient(135deg, #431407 0%, #292524 100%)' } }
    };

    let currentPalette = localStorage.getItem(CONFIG.themeKey) || 'ufc';
    let isDarkMode = localStorage.getItem(CONFIG.darkModeKey) === 'true';

    function applyTheme() {
        try {
            const root = document.documentElement;
            const themeBase = PALETTES[currentPalette] || PALETTES.ufc;
            const mode = isDarkMode ? themeBase.dark : themeBase.light;

            root.style.setProperty('--theme-primary', themeBase.primary);
            root.style.setProperty('--theme-primary-hover', themeBase.hover);
            root.style.setProperty('--bg-color', mode.bg);
            root.style.setProperty('--card-bg', mode.card);
            root.style.setProperty('--text-primary', mode.text);
            root.style.setProperty('--text-secondary', mode.subtext);
            root.style.setProperty('--border-color', mode.border);
        } catch (e) {
            console.error("Theme Error", e);
        }
    }

    function injectCSS() {
        GM_addStyle(`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
            
            body, html { 
                margin: 0; padding: 0; min-height: 100%; 
                font-family: 'Inter', sans-serif !important; 
                background-color: var(--bg-color) !important; 
                color: var(--text-primary) !important; 
            }
            
            body > table, #cabecalho, #rodape, #barra-governo, #menu-acessibilidade, .painel-usuario, #painel-usuario, .sf-hidden { 
                display: none !important; 
            }
            
            #container, #conteudo {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                width: 100%;
                background: var(--bg-color);
            }
            
            form { 
                background: var(--card-bg); 
                padding: 50px 40px; 
                border-radius: 24px; 
                box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); 
                max-width: 800px; 
                width: 90%; 
                text-align: center;
                animation: fadeIn 0.6s ease-out forwards;
                border: 1px solid var(--border-color);
                box-sizing: border-box;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            form h1, form h2, form h3, form p, form span {
                background: transparent !important;
                background-color: transparent !important;
            }

            form h2 { 
                color: var(--theme-primary) !important; 
                margin-top: 0; 
                font-size: 1.6rem;
                font-weight: 800;
                margin-bottom: 25px;
                letter-spacing: -0.025em;
                line-height: 1.3;
            }
            
            form p {
                color: var(--text-secondary);
                font-size: 1.05rem;
                line-height: 1.6;
            }
            
            form img { 
                max-width: 100%; 
                max-height: 500px;
                object-fit: contain;
                height: auto; 
                border-radius: 16px; 
                margin-top: 10px;
                box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
                transition: transform 0.3s ease;
            }
            
            form img:hover {
                transform: scale(1.02);
            }
            
            form input[type="submit"] { 
                background: var(--theme-primary) !important; 
                color: white !important; 
                border: none !important; 
                padding: 16px 32px !important; 
                border-radius: 12px !important; 
                font-weight: 700 !important; 
                cursor: pointer; 
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); 
                font-size: 1.1rem; 
                width: auto; 
                min-width: 250px;
                margin-top: 35px;
                font-family: inherit;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            }
            
            form input[type="submit"]:hover { 
                background: var(--theme-primary-hover) !important; 
                transform: translateY(-2px);
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            }
            
            form input[type="submit"]:active {
                transform: translateY(0);
                box-shadow: 0 0 0 transparent;
            }
            
            body > div[style*="text-align:center"] {
                display: none !important;
            }
        `);
    }

    function init() {
        applyTheme();
        injectCSS();
        
        const internalNavbar = document.getElementById('internal-navbar');
        if (internalNavbar) internalNavbar.remove();
        
        const btn = document.querySelector('form input[type="submit"]');
        if (btn && btn.value.includes('Continuar')) {
            btn.value = 'Continuar para o SIGAA';
        }
    }

    init();
})();
