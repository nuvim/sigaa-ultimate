// ==UserScript==
// @name         SIGAA Ultimate 2.0 - Portal do Discente
// @namespace    http://tampermonkey.net/
// @version      2.0-stable-fixed
// @description  Código Organizado e Correções Gerais no Portal do Discente.
// @author       Gusttavo
// @match        *://si3.ufc.br/sigaa/*
// @exclude      *://si3.ufc.br/sigaa/verTelaLogin.do*
// @exclude      *://si3.ufc.br/sigaa/paginaInicial.do*
// @exclude      *://si3.ufc.br/sigaa/public/*
// @exclude      *://si3.ufc.br/sigaa/logar.do*
// @exclude      *://si3.ufc.br/sigaa/*popup*
// @exclude      *://si3.ufc.br/sigaa/*print*
// @exclude      *://si3.ufc.br/sigaa/*relatorio*
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    console.log("SIGAA Ultimate: Iniciando...");

    // =========================================================================
    // 1. CONSTANTES E CONFIGURAÇÕES VISUAIS
    // =========================================================================
    
    // Icones SVG para reutilização
    const ICONS = {
        student: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="currentColor" d="M231.9 113.4L135.9 56.7a15.8 15.8 0 0 0-15.8 0L24.1 113.4a7.9 7.9 0 0 0 0 13.6l44.3 26.1v49.3a16 16 0 0 0 8.2 14l46.2 24.3a15.6 15.6 0 0 0 10.4 0l46.2-24.3a16 16 0 0 0 8.2-14v-49.3l24.4-14.4v39.7a8 8 0 0 0 16 0v-48a8 8 0 0 0-4.1-7m-103.9 98l-46.2-24.3a.6.6 0 0 1-.3-.3v-42l46.5 27.4Zm54.7-24.6l-46.2 24.3l-.5-8.4l46.6-27.4Zm-54.7-41.2l-86.5-51l86.5-51.1l86.5 51.1Z"/></svg>`,
        class: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="currentColor" d="M245.2 65.6l-20-13.3a15.9 15.9 0 0 0-17.7 0l-72 48a15.9 15.9 0 0 0-7.1 13.3v42.1l-68.4-45.6V68a8 8 0 0 0-16 0v48a8 8 0 0 0 3.6 6.7l72 48a16.1 16.1 0 0 0 17.8 0l72-48a16.1 16.1 0 0 0 7.1-13.4v-38.4l20 13.3a8 8 0 0 0 8.8-13.3m-108.9 93.4l-64-42.7l64-42.7l64 42.7Z"/></svg>`,
        menu: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="currentColor" d="M224 128a8 8 0 0 1-8 8H40a8 8 0 0 1 0-16h176a8 8 0 0 1 8 8M40 72h176a8 8 0 0 0 0-16H40a8 8 0 0 0 0 16m176 112H40a8 8 0 0 0 0 16h176a8 8 0 0 0 0-16h176a8 8 0 0 0 0-16"/></svg>`,
        logout: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M112 216a8 8 0 0 1-8 8H48a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h56a8 8 0 0 1 0 16H48v160h56a8 8 0 0 1 8 8m109.7-93.7l-56-56a8 8 0 0 0-11.4 11.4l42.3 42.3H88a8 8 0 0 0 0 16h108.7l-42.3 42.3a8 8 0 0 0 11.4 11.4l56-56a8 8 0 0 0 0-11.4"/></svg>`,
        home: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M218.8 103.7L130.1 24a8 8 0 0 0-4.2-4.2a7.9 7.9 0 0 0-7.8 0l-88.7 79.7a8 8 0 0 0 2.4 13.5l3.2 1.4v81.6a16 16 0 0 0 16 16h32a8 8 0 0 0 8-8v-48h48v48a8 8 0 0 0 8 8h32a16 16 0 0 0 16-16v-81.6l3.2-1.4a8.1 8.1 0 0 0 4.5-7.3a8 8 0 0 0-2.1-5.6"/></svg>`,
        clock: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 256 256"><path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.1 104.1 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m64-88a8 8 0 0 1-8 8h-56a8 8 0 0 1-8-8V72a8 8 0 0 1 16 0v48h48a8 8 0 0 1 8 8"/></svg>`,
        map: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path fill="currentColor" d="M128 64a40 40 0 1 0 40 40a40 40 0 0 0-40-40m0 64a24 24 0 1 1 24-24a24 24 0 0 1-24 24m0-112a88.1 88.1 0 0 0-88 88c0 31.4 18.6 68.6 54.9 106.3a104.4 104.4 0 0 0 66.2 32.8a104.4 104.4 0 0 0 66.2-32.8c36.3-37.7 54.9-74.9 54.9-106.3a88.1 88.1 0 0 0-88-88m0 206c-16.5-1.4-60.3-17-88.6-101.5A72 72 0 1 1 216.6 112c-28.3 84.5-72.1 100.1-88.6 101.5"/></svg>`,
        user: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M230.9 206.6c-20.9-33.8-54.3-55-91.4-58.1a55.9 55.9 0 1 0-23 0c-37.1 3.1-70.5 24.3-91.4 58.1a8 8 0 1 0 13.6 8.4C55.7 187.7 85 168 128 168s72.3 19.7 89.3 47a8 8 0 1 0 13.6-8.4"/></svg>`,
        edit: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M227.3 73.4L182.6 28.7a16 16 0 0 0-22.6 0L36.7 152.1a15.9 15.9 0 0 0-4.7 11.3v44.6a8 8 0 0 0 8 8h44.6a15.9 15.9 0 0 0 11.3-4.7l123.4-123.4a16 16 0 0 0 0-22.6"/></svg>`,
        chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path fill="currentColor" d="M213.7 101.7l-80 80a8.2 8.2 0 0 1-11.4 0l-80-80a8.1 8.1 0 0 1 11.4-11.4L128 164.7l74.3-74.4a8.1 8.1 0 0 1 11.4 11.4Z"/></svg>`,
        books: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M224 48v136a16 16 0 0 1-16 16H88a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h120a16 16 0 0 1 16 16M88 48v136h120V48ZM40 64a8 8 0 0 0-8 8v136a32.1 32.1 0 0 0 32 32h120a8 8 0 0 0 0-16H64a16 16 0 0 1-16-16V72a8 8 0 0 0-8-8"/></svg>`,
        table: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256"><path fill="currentColor" d="M224 48H32a16 16 0 0 0-16 16v128a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16Zm0 144H32V64h192v128Zm-32-80v48a8 8 0 0 1-16 0v-48a8 8 0 0 1 16 0Zm-64 0v48a8 8 0 0 1-16 0v-48a8 8 0 0 1 16 0Zm-64 0v48a8 8 0 0 1-16 0v-48a8 8 0 0 1 16 0Z"/></svg>`,
        printer: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M216 40H40a16 16 0 0 0-16 16v104a16 16 0 0 0 16 16h16v32a16 16 0 0 0 16 16h112a16 16 0 0 0 16-16v-32h16a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16m-48 176H88v-32h80Zm24-48H64V56h152Zm-32-88a12 12 0 1 1-12 12a12 12 0 0 1 12-12"/></svg>`,
        warning: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M236.8 188.1L149 36a24 24 0 0 0-42 0L19.2 188.1a23.9 23.9 0 0 0 21 35.9h175.6a23.9 23.9 0 0 0 21-35.9M120 104a8 8 0 0 1 16 0v40a8 8 0 0 1-16 0Zm8 88a12 12 0 1 1 12-12a12 12 0 0 1-12 12"/></svg>`,
        gear: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M128 80a48 48 0 1 0 48 48a48 48 0 0 0-48-48m0 80a32 32 0 1 1 32-32a32 32 0 0 1-32 32m88-29.8v-4.4a15.8 15.8 0 0 0-10.9-15.2l-20.2-6.5a73 73 0 0 0-3.6-8.7l6.6-19.9a15.8 15.8 0 0 0-6.6-18.1l-3.8-2.2a15.8 15.8 0 0 0-18.1 2.2l-15.6 11.9a73.2 73.2 0 0 0-9.2-2.4V66.8a15.8 15.8 0 0 0-14.7-15.8h-4.4a15.8 15.8 0 0 0-15.8 14.7v20.2a72 72 0 0 0-9.2 2.4l-15.6-11.9a15.8 15.8 0 0 0-18.1-2.2l-3.8 2.2a15.8 15.8 0 0 0-6.6 18.1l6.6 19.9a73 73 0 0 0-3.6 8.7l-20.2 6.5A15.8 15.8 0 0 0 24 125.8v4.4a15.8 15.8 0 0 0 10.9 15.2l20.2 6.5a73 73 0 0 0 3.6 8.7l-6.6 19.9a15.8 15.8 0 0 0 6.6 18.1l3.8 2.2a15.8 15.8 0 0 0 18.1-2.2l15.6-11.9a73.2 73.2 0 0 0 9.2 2.4v20.1A15.8 15.8 0 0 0 121.8 225h4.4a15.8 15.8 0 0 0 15.8-14.7v-20.2a72 72 0 0 0 9.2-2.4l15.6 11.9a15.8 15.8 0 0 0 18.1 2.2l3.8-2.2a15.8 15.8 0 0 0 6.6-18.1l-6.6-19.9a73 73 0 0 0 3.6-8.7l20.2-6.5a15.8 15.8 0 0 0 10.9-15.2"/></svg>`
    };

    // Paletas de Cores Definidas
    const PALETTES = {
        ufc: { 
            name: "UFC Azul", 
            primary: '#3b82f6', 
            hover: '#2563eb',
            light: { bg: '#f8fafc', card: '#ffffff', sidebar: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)', text: '#1e293b', subtext: '#64748b', border: '#e2e8f0', welcome: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' },
            dark: { bg: '#0f172a', card: '#1e293b', sidebar: '#020617', text: '#f1f5f9', subtext: '#94a3b8', border: '#334155', welcome: 'linear-gradient(135deg, #172554 0%, #1e293b 100%)' }
        },
        rocket: { 
            name: "Rocket Roxo", 
            primary: '#8257e6', 
            hover: '#6f42c1',
            light: { bg: '#f4f4fa', card: '#ffffff', sidebar: '#121214', text: '#202024', subtext: '#4d4d57', border: '#e1e1e6', welcome: 'linear-gradient(135deg, #8257e6 0%, #202024 100%)' },
            dark: { bg: '#121214', card: '#202024', sidebar: '#09090a', text: '#e1e1e6', subtext: '#a8a8b3', border: '#29292e', welcome: 'linear-gradient(135deg, #4c1d95 0%, #121214 100%)' }
        },
        matrix: { 
            name: "Matrix Verde", 
            primary: '#00e639', 
            hover: '#00ff41',
            light: { bg: '#f0fdf4', card: '#ffffff', sidebar: '#000000', text: '#064e3b', subtext: '#065f46', border: '#bbf7d0', welcome: 'linear-gradient(135deg, #052e16 0%, #166534 100%)' },
            dark: { bg: '#000000', card: '#0a120a', sidebar: '#001a00', text: '#00ff41', subtext: '#008F11', border: '#003300', welcome: 'linear-gradient(135deg, #002600 0%, #004d00 100%)' }
        },
        orange: { 
            name: "Laranja", 
            primary: '#f97316', 
            hover: '#ea580c',
            light: { bg: '#fff7ed', card: '#ffffff', sidebar: '#271a12', text: '#431407', subtext: '#7c2d12', border: '#fed7aa', welcome: 'linear-gradient(135deg, #9a3412 0%, #f97316 100%)' },
            dark: { bg: '#1c1917', card: '#292524', sidebar: '#0c0a09', text: '#fafaf9', subtext: '#a8a29e', border: '#44403c', welcome: 'linear-gradient(135deg, #431407 0%, #292524 100%)' }
        }
    };

    // --- 2. VERIFICACOES DE AMBIENTE ---
    if (window.location.href.includes("verTelaLogin") || window.location.href.includes("paginaInicial") || document.querySelector("#loginFormMask")) return;
    if (window.self !== window.top) return;

    const isDashboard = document.querySelector("#agenda-docente") !== null;
    const isInternalPage = document.querySelector("#cabecalho") !== null || document.querySelector("#info-usuario") !== null;
    const isErrorPage = document.getElementById('painel-erro') !== null || document.body.innerText.includes("Comportamento Inesperado");

    if (isErrorPage) { localStorage.removeItem('sigaa_plus_cache'); return; }
    if (!isDashboard && !isInternalPage) return;

    // --- 3. APPLY THEME (EXECUCAO IMEDIATA) ---
    // Garante que o CSS esteja pronto antes de qualquer HTML
    let currentPalette = localStorage.getItem('sigaa_palette') || 'ufc';
    let isDarkMode = localStorage.getItem('sigaa_dark_mode') === 'true';

    function applyTheme() {
        try {
            const root = document.documentElement;
            // Fallback se a paleta salva nao existir mais
            const themeBase = PALETTES[currentPalette] || PALETTES.ufc;
            const mode = isDarkMode ? themeBase.dark : themeBase.light;

            root.style.setProperty('--theme-primary', themeBase.primary);
            root.style.setProperty('--theme-primary-hover', themeBase.hover);
            root.style.setProperty('--theme-primary-light', `${themeBase.primary}25`);
            
            root.style.setProperty('--bg-color', mode.bg);
            root.style.setProperty('--card-bg', mode.card);
            
            if (mode.sidebar.includes('gradient')) {
                root.style.setProperty('--sidebar-bg-image', mode.sidebar);
                root.style.setProperty('--sidebar-bg-color', 'transparent');
            } else {
                root.style.setProperty('--sidebar-bg-image', 'none');
                root.style.setProperty('--sidebar-bg-color', mode.sidebar);
            }

            root.style.setProperty('--text-primary', mode.text);
            root.style.setProperty('--text-secondary', mode.subtext);
            root.style.setProperty('--border-color', mode.border);
            root.style.setProperty('--welcome-bg', mode.welcome);

            localStorage.setItem('sigaa_palette', currentPalette);
            localStorage.setItem('sigaa_dark_mode', isDarkMode);
        } catch (e) {
            console.error("Erro ao aplicar tema. Resetando para UFC Padrão.");
            currentPalette = 'ufc';
            isDarkMode = false;
            localStorage.removeItem('sigaa_palette');
        }
    }
    applyTheme();

    // --- 4. HELPER FUNCTIONS ---
    function capitalizeName(name) { return name ? name.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "Discente"; }
    function getShortName(fullName) { if(!fullName) return "Discente"; const p = fullName.split(' '); return p.length <= 1 ? fullName : p[0] + ' ' + p[1]; }
    function cleanText(text) { return text ? text.replace(/\(\d{2}\/\d{2}\/\d{4}.*?\)/g, "").trim() : ""; }
    
    function formatHorarios(rawText) {
        let text = cleanText(rawText);
        const dias = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
        let parts = [];
        dias.forEach(dia => {
            const regex = new RegExp(`${dia}\\s\\d{2}:\\d{2}-\\d{2}:\\d{2}`, "g");
            const matches = text.match(regex);
            if (matches) parts.push(...matches);
        });
        return parts.length === 0 ? `<div class="horario-badge">Horário não definido</div>` : parts.map(h => `<div class="horario-badge">${ICONS.clock} <span>${h}</span></div>`).join("");
    }

    const today = new Date();
    const dateString = today.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const capitalizedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);

    // --- 5. INJECAO DE CSS ---
    // Fazemos isso antes de mexer no DOM
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        /* Reset basico */
        body { font-family: 'Inter', sans-serif !important; background-color: var(--bg-color) !important; color: var(--text-primary) !important; margin: 0; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 10px; }
        
        /* Menu Dropdown Nativo Fix */
        #menu-dropdown { background: var(--sidebar-bg) !important; border: 1px solid var(--sidebar-border) !important; background-image: var(--sidebar-bg-image) !important; background-color: var(--sidebar-bg-color) !important; }
        #menu-dropdown * { background: transparent !important; color: #cbd5e1 !important; border-color: var(--sidebar-border) !important; }
        #menu-dropdown .ThemeOfficeMenuItemHover, #menu-dropdown .ThemeOfficeMenuItemHover * { background-color: var(--theme-primary) !important; color: white !important; }

        /* Componentes UI */
        .horario-badge { display: flex; align-items: center; gap: 6px; background: var(--bg-color); color: var(--text-secondary); padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; margin-bottom: 5px; border: 1px solid var(--border-color); width: fit-content; }
        .horario-badge svg { color: var(--theme-primary); }
        .btn-grade { background:var(--card-bg); color:var(--theme-primary); border:1px solid var(--theme-primary); padding:6px 12px; border-radius:8px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:6px; transition:0.2s; font-size:0.85rem; }
        .btn-grade:hover { background:var(--theme-primary-light); }
        
        /* Sidebar */
        .sidebar { position: fixed; top: 0; left: 0; bottom: 0; width: 280px; background: var(--sidebar-bg); background-image: var(--sidebar-bg-image); background-color: var(--sidebar-bg-color); border-right: 1px solid var(--sidebar-border); z-index: 100; display: flex; flex-direction: column; box-shadow: 4px 0 25px rgba(0,0,0,0.15); overflow-y: auto; color: #f8fafc; text-align: left; } 
        .sidebar-header { min-height: 80px; display: flex; align-items: center; padding: 0 24px; border-bottom: 1px solid rgba(255,255,255,0.05); } 
        .logo-text { font-size: 1.2rem; font-weight: 800; margin-left: 10px; color: #f8fafc; letter-spacing: -0.5px; } 
        .logo-text span { color: var(--theme-primary); font-weight: 400; } 
        .profile-section { padding: 30px 20px 20px; display: flex; flex-direction: column; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); position: relative; }
        .avatar-ring { padding: 4px; border: 3px solid var(--sidebar-border); border-radius: 50%; margin-bottom: 12px; transition: 0.3s; cursor: pointer; display: inline-block; }
        .avatar-ring:hover { border-color: var(--theme-primary); box-shadow: 0 0 20px var(--theme-primary-light); }
        .avatar-container { width: 85px; height: 85px; border-radius: 50%; overflow: hidden; background: #1e293b; } 
        .avatar-container img { width: 100%; height: 100%; object-fit: cover; } 
        .user-name { font-weight: 700; font-size: 1.1rem; color: #f1f5f9; margin-bottom: 20px; text-align: center; width: 100%; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }
        
        .user-dropdown { position: absolute; top: 130px; left: 20px; right: 20px; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(10px); border: 1px solid var(--sidebar-border); border-radius: 12px; overflow: hidden; max-height: 0; opacity: 0; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 100; box-shadow: 0 10px 25px rgba(0,0,0,0.5); transform: translateY(-10px); pointer-events: none; }
        .user-dropdown.open { max-height: 200px; opacity: 1; transform: translateY(0); pointer-events: all; }
        .sub-item { display: flex; align-items: center; gap: 10px; padding: 10px 15px; color: #94a3b8; font-size: 0.8rem; text-decoration: none; transition: 0.2s; font-family: 'Inter', sans-serif !important; }
        .sub-item:hover { background: rgba(255,255,255,0.05); color: var(--theme-primary); }

        .mini-id { width: 100%; box-sizing: border-box; background: rgba(0,0,0,0.2); border-radius: 12px; padding: 15px; border: 1px solid rgba(255,255,255,0.05); text-align: left; }
        .mini-row { display: flex; flex-direction: column; margin-bottom: 8px; text-align: left; }
        .mini-label { color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 0.6rem; letter-spacing: 0.5px; margin-bottom: 2px; }
        .mini-val { color: #e2e8f0; font-weight: 500; font-size: 0.8rem; line-height: 1.3; word-break: break-word; }
        .val-curso { font-size: 0.7rem !important; color: var(--theme-primary); font-weight: 600; white-space: normal; }
        .status-badge { color: #34d399; font-weight: 800; font-size: 0.75rem; }

        .nav-menu { flex: 1; padding: 15px 0; } 
        .menu-item { display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #cbd5e1; font-size: 0.95rem; text-decoration: none; transition: 0.2s; cursor: pointer; font-weight: 500; border-left: 4px solid transparent; font-family: 'Inter', sans-serif !important; } 
        .menu-item:hover { background: rgba(255,255,255,0.05); color: white; padding-left: 28px; } 
        .menu-item.active { background: linear-gradient(90deg, var(--theme-primary-light) 0%, transparent 100%); border-left-color: var(--theme-primary); color: var(--theme-primary); font-weight: 600; } 
        
        #btn-config { color: #cbd5e1 !important; padding: 15px 24px; cursor: pointer; display: flex; align-items: center; gap: 12px; font-weight: 500; font-size: 0.9rem; transition: 0.2s; }
        #btn-config:hover { color: var(--theme-primary) !important; }
        #btn-sair { color: #f87171 !important; margin-top: auto; border-top: 1px solid rgba(255,255,255,0.05); padding: 20px 24px; }

        .main-content { margin-left: 280px; height: 100vh; overflow-y: auto; display: flex; flex-direction: column; } 
        .topbar { height: 80px; background: var(--card-bg); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; padding: 0 40px; position: sticky; top: 0; z-index: 50; } 
        .menu-toggle { z-index: 1000; position: relative; background: white; border: 1px solid #e2e8f0; cursor: pointer; color: #334155; width: 40px; height: 40px; border-radius: 8px; transition: 0.2s; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }

        .welcome-card { background: var(--welcome-bg); color: white; border-radius: 20px; padding: 35px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.2); position: relative; overflow: hidden; }
        .welcome-card::after { content: ''; position: absolute; right: -20px; top: -50px; width: 300px; height: 300px; background: rgba(255,255,255,0.1); border-radius: 50%; pointer-events: none; }
        .welcome-text h1 { margin: 0 0 10px; font-size: 2rem; font-weight: 800; letter-spacing: -1px; }
        .welcome-text p { margin: 0; font-size: 1rem; opacity: 0.9; font-weight: 500; display: flex; align-items: center; gap: 8px; }
        .date-badge { background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 12px; font-weight: 700; font-size: 0.9rem; backdrop-filter: blur(10px); display: flex; align-items: center; gap: 8px; }

        /* Fix TITULOS */
        h2 { background: transparent !important; background-color: transparent !important; border: none !important; }

        .activity-card { background: var(--card-bg); border-left: 4px solid var(--theme-primary); border-right: 1px solid var(--border-color); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); padding: 15px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 15px; }
        .activity-date { background: var(--bg-color); color: var(--theme-primary); padding: 8px 12px; border-radius: 8px; font-weight: 700; text-align: center; min-width: 60px; }
        .activity-info { flex: 1; }
        .activity-title { font-weight: 700; color: var(--text-primary); font-size: 1rem; }

        /* Switch */
        .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: var(--theme-primary); }
        input:checked + .slider:before { transform: translateX(20px); }

        @media print {
            body > :not(#modal-grade) { display: none !important; }
            #modal-grade { display: flex !important; position: static !important; background: white !important; height: 100vh !important; width: 100vw !important; z-index: 999999 !important; }
            #modal-grade > div { width: 100% !important; max-width: 100% !important; height: auto !important; box-shadow: none !important; }
            #btn-fechar-modal, #btn-imprimir-grade { display: none !important; }
        }
    `);

    // --- 6. LOGICA DO DASHBOARD ---
    if (isDashboard) {
        // Variaveis de escopo
        let aluno = JSON.parse(localStorage.getItem('sigaa_plus_cache') || '{}');
        let carteirinha = { matricula: "---", curso: "---", nivel: "---", status: "---", email: "---", entrada: "---" };
        const atividades = [];
        const turmasData = [];
        const diasSemana = ["SEG", "TER", "QUA", "QUI", "SEX"];

        // Funcao parse grid
        function parseToGrid(horarioStr, nomeMateria, cor) {
            const text = cleanText(horarioStr);
            const regex = /(SEG|TER|QUA|QUI|SEX|SAB|DOM)[\s\.]*(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/gi;
            let match;
            while ((match = regex.exec(text)) !== null) {
                turmasData.push({
                    dia: match[1].toUpperCase(),
                    h_inicio: parseInt(match[2]),
                    m_inicio: parseInt(match[3]),
                    h_fim: parseInt(match[4]),
                    m_fim: parseInt(match[5]),
                    nome: nomeMateria,
                    cor: cor
                });
            }
        }

        // Modal Grade
        function criarModalGrade() {
            // Remove se ja existir
            const exist = document.getElementById('modal-grade');
            if(exist) exist.remove();

            const modal = document.createElement('div');
            modal.id = 'modal-grade';
            modal.style.cssText = `display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:99999; align-items:center; justify-content:center; backdrop-filter:blur(3px);`;
            
            const startHour = 7;
            const endHour = 22; 
            const containerHeightPx = (endHour - startHour) * 50; 
            const totalMinutes = (endHour - startHour) * 60;

            let gridLinesHTML = '';
            let timeLabelsHTML = '';
            for(let h = startHour; h < endHour; h++) {
                gridLinesHTML += `<div style="flex:1; border-bottom:1px solid var(--border-color); box-sizing:border-box; width:100%; min-height:50px;"></div>`;
                timeLabelsHTML += `<div style="flex:1; border-bottom:1px solid var(--border-color); box-sizing:border-box; color:var(--text-secondary); font-weight:600; font-size:0.75rem; padding:5px; text-align:right; display:flex; align-items:flex-end; justify-content:flex-end; padding-bottom:0; min-height:50px;">${h+1}:00</div>`;
            }

            let daysColsHTML = diasSemana.map(dia => {
                const aulasDia = turmasData.filter(t => t.dia === dia);
                let blocosHTML = aulasDia.map(aula => {
                    const startMinutes = (aula.h_inicio * 60) + aula.m_inicio;
                    const endMinutes = (aula.h_fim * 60) + aula.m_fim;
                    const gridStartMinutes = startHour * 60;
                    
                    const topPercent = ((startMinutes - gridStartMinutes) / totalMinutes) * 100;
                    const heightPercent = ((endMinutes - startMinutes) / totalMinutes) * 100;
                    const labelInicio = `${String(aula.h_inicio).padStart(2,'0')}:${String(aula.m_inicio).padStart(2,'0')}`;
                    const labelFim = `${String(aula.h_fim).padStart(2,'0')}:${String(aula.m_fim).padStart(2,'0')}`;

                    return `<div style="position: absolute; top: ${topPercent}%; left: 2%; width: 96%; height: ${heightPercent}%; background: ${aula.cor}; border-radius: 6px; color: white; font-size: 0.7rem; padding: 4px 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); overflow: hidden; z-index: 10; border-left: 3px solid rgba(0,0,0,0.2); display:flex; flex-direction:column; justify-content:center; box-sizing: border-box;">
                        <div style="font-weight:700; line-height:1.2; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">${aula.nome}</div>
                        <div style="opacity:0.9; font-size:0.65rem; margin-top:2px;">${labelInicio} - ${labelFim}</div>
                    </div>`;
                }).join('');

                return `<div style="position:relative; background:var(--card-bg); border-left:1px solid var(--border-color); min-width:100px; height:100%;">
                    <div style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; flex-direction:column; z-index:0;">${gridLinesHTML}</div>
                    ${blocosHTML}
                </div>`;
            }).join('');

            modal.innerHTML = `<div style="background:var(--card-bg); width:95%; max-width:1600px; height:90vh; border-radius:16px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 20px 50px rgba(0,0,0,0.3);">
                <div style="padding:15px 25px; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; background:var(--card-bg);">
                    <h2 style="margin:0; font-size:1.3rem; color:var(--text-primary); display:flex; align-items:center; gap:10px;">${ICONS.table} Grade Curricular</h2>
                    <div style="display:flex; gap:10px;">
                        <button id="btn-imprimir-grade" style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:8px; padding:8px 12px; cursor:pointer; color:var(--text-primary); display:flex; align-items:center; gap:6px; font-weight:600; font-size:0.85rem; transition:0.2s;">${ICONS.printer} Salvar PDF</button>
                        <button id="btn-fechar-grade" style="background:none; border:none; font-size:2rem; cursor:pointer; color:var(--text-secondary); line-height:1; z-index:10; pointer-events:all;">&times;</button>
                    </div>
                </div>
                <div style="display:grid; grid-template-columns: 50px repeat(5, 1fr); background:var(--card-bg); border-bottom:2px solid var(--border-color);">
                    <div style="padding:10px;"></div>
                    ${diasSemana.map(d => `<div style="padding:12px; text-align:center; font-weight:800; color:var(--text-primary); font-size:0.9rem;">${d}</div>`).join('')}
                </div>
                <div style="flex:1; overflow-y:auto; position:relative;">
                    <div style="display:grid; grid-template-columns: 50px repeat(5, 1fr); height:${containerHeightPx}px;">
                        <div style="background:var(--bg-color); border-right:1px solid var(--border-color); display:flex; flex-direction:column;">
                            ${timeLabelsHTML}
                        </div>
                        ${daysColsHTML}
                    </div>
                </div>
            </div>`;
            
            document.body.appendChild(modal);
            
            document.getElementById('btn-fechar-grade').onclick = () => modal.style.display = 'none';
            modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
            document.getElementById('btn-imprimir-grade').addEventListener('click', () => window.print());
        }

        // Modal Temas
        function criarModalTemas() {
            const exist = document.getElementById('modal-temas');
            if(exist) exist.remove();

            const modal = document.createElement('div');
            modal.id = 'modal-temas';
            modal.style.cssText = `display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:99999; align-items:center; justify-content:center; backdrop-filter:blur(3px);`;

            let botoesHTML = '';
            for (const [key, theme] of Object.entries(PALETTES)) {
                botoesHTML += `
                    <button class="btn-theme" data-theme="${key}" style="
                        background: transparent; border: 2px solid var(--border-color); color: var(--text-primary);
                        padding: 15px; border-radius: 12px; cursor: pointer; display: flex; flex-direction: column;
                        align-items: center; gap: 10px; width: 100px; transition: all 0.2s;
                    ">
                        <div style="width: 30px; height: 30px; background: ${theme.primary}; border-radius: 50%;"></div>
                        <span style="font-size: 0.8rem; font-weight: 600; text-align: center;">${theme.name}</span>
                    </button>
                `;
            }

            modal.innerHTML = `
                <div style="background:var(--card-bg); border-radius:16px; padding:30px; max-width:500px; width:90%; position:relative; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2);">
                    <button id="btn-fechar-temas" style="position:absolute; top:15px; right:15px; background:none; border:none; font-size:1.5rem; cursor:pointer; color:var(--text-secondary); z-index:20; pointer-events:all; padding: 5px;">&times;</button>
                    <h2 style="margin:0 0 20px 0; color:var(--text-primary); font-size:1.5rem; font-weight:700;">Aparência</h2>
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; background:var(--bg-color); padding:10px 15px; border-radius:8px;">
                        <span style="font-weight:600; color:var(--text-primary);">Modo Escuro</span>
                        <label class="switch">
                            <input type="checkbox" id="theme-switch" ${isDarkMode ? 'checked' : ''}>
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div style="display:flex; flex-wrap:wrap; gap:15px; justify-content:center;">${botoesHTML}</div>
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById('btn-fechar-temas').onclick = () => modal.style.display = 'none';
            modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

            const btns = modal.querySelectorAll('.btn-theme');
            btns.forEach(btn => {
                if(btn.dataset.theme === currentPalette) btn.style.borderColor = 'var(--theme-primary)';
                btn.onclick = () => {
                    currentPalette = btn.dataset.theme;
                    applyTheme();
                    btns.forEach(b => b.style.borderColor = 'var(--border-color)');
                    btn.style.borderColor = 'var(--theme-primary)';
                };
            });

            document.getElementById('theme-switch').addEventListener('change', (e) => {
                isDarkMode = e.target.checked;
                applyTheme();
            });
        }

        try {
            console.log("SIGAA Ultimate: Raspando dados...");
            // Raspagem
            const tds = document.querySelectorAll("#agenda-docente td");
            for (let i = 0; i < tds.length; i++) {
                const label = tds[i].innerText.trim().replace(":", "");
                const value = tds[i+1]?.innerText.trim();
                if (label === "Matrícula") carteirinha.matricula = value;
                if (label === "Curso") carteirinha.curso = value;
                if (label === "Nível") carteirinha.nivel = value;
                if (label === "Status") carteirinha.status = value;
                if (label === "E-Mail") carteirinha.email = value;
                if (label === "Entrada") carteirinha.entrada = value;
            }
            const elNome = document.querySelector(".nome_usuario p") || document.querySelector(".nome small b");
            const elFoto = document.querySelector(".foto img");
            const elSemestre = document.querySelector(".periodo .negrito");
            
            if(elNome) aluno.nome = capitalizeName(elNome.innerText.trim());
            if(elFoto) aluno.avatar = elFoto.src;
            if(elSemestre) aluno.semestre = elSemestre.innerText.trim();
            aluno.dados = carteirinha;
            localStorage.setItem('sigaa_plus_cache', JSON.stringify(aluno));

            // Atividades
            const divAtividades = document.getElementById('avaliacao-portal');
            if (divAtividades) {
                const linhas = divAtividades.querySelectorAll('tbody tr');
                linhas.forEach(tr => {
                    const cols = tr.querySelectorAll('td');
                    if (cols.length >= 3) {
                        const rawDate = cols[1].textContent.replace(/\s+/g, ' ').trim(); 
                        let rawDesc = cols[2].textContent.replace(/\s+/g, ' ').trim(); 
                        rawDesc = rawDesc.replace(/Tarefa:\s*|Avaliação:\s*/gi, ""); 
                        const matchData = rawDate.match(/(\d{1,2})[\/\-\.](\d{1,2})/);
                        let diaFinal = "--", mesFinal = "---";
                        if (matchData) {
                            diaFinal = matchData[1].padStart(2, '0');
                            const meses = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
                            mesFinal = meses[parseInt(matchData[2]) - 1] || "---";
                        } else {
                            diaFinal = rawDate.substring(0, 2);
                            mesFinal = "???";
                        }
                        if (diaFinal !== "--") atividades.push({ dia: diaFinal, mes: mesFinal, desc: rawDesc });
                    }
                });
            }

            // Cards de Turma
            const trs = document.querySelectorAll("#turmas-portal tbody tr");
            const colors = ['#3b82f6','#8b5cf6','#10b981','#f59e0b', '#ef4444'];
            const cardData = [];
            trs.forEach((tr, i) => {
                if (tr.classList.contains("detalhes") || tr.style.display === "none") return;
                const cols = tr.querySelectorAll("td");
                if (cols.length < 4) return;
                const link = cols[0].querySelector("a");
                if (link) {
                    const uid = "dash-" + i; link.id = uid;
                    const nome = link.innerText.trim();
                    const local = cols[2].innerText.replace("Acessar:", "").trim();
                    const horarioStr = cols[3].innerText;
                    const horarioHTML = formatHorarios(horarioStr);
                    const bg = colors[i % colors.length];
                    let nomeMateria = nome;
                    if (nome.includes(' - ')) {
                        const parts = nome.split(' - ');
                        nomeMateria = parts.slice(1).join(' - ').trim();
                    }
                    parseToGrid(horarioStr, nomeMateria, bg);
                    cardData.push({uid, nome, local, horarioHTML, bg});
                }
            });

            // HTML Builder
            let activitiesHTML = '';
            if (atividades.length > 0) {
                activitiesHTML = `
                <div style="margin-bottom: 30px;">
                    <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-primary); margin:0 0 15px 0; display:flex; align-items:center; gap:8px;">${ICONS.warning} Próximas Atividades</h3>
                    <div>${atividades.map(ativ => `
                        <div class="activity-card">
                            <div class="activity-date"><div style="font-size:1.1rem; font-weight:800; line-height:1;">${ativ.dia}</div><div style="font-size:0.75rem; text-transform:uppercase; opacity:0.8;">${ativ.mes}</div></div>
                            <div class="activity-info"><div class="activity-title">${ativ.desc}</div></div>
                        </div>`).join('')}
                    </div>
                </div>`;
            }

            const dashHTML=`
            <aside class="sidebar">
                <div class="sidebar-header">${ICONS.student} <div class="logo-text">SIGAA <span>Ultimate</span></div></div>
                <div class="profile-section">
                    <div class="avatar-ring" id="userAreaBtn"><div class="avatar-container"><img src="${aluno.avatar || ''}" onerror="this.src='/sigaa/img/usuarios/sem_foto.png'"></div></div>
                    <div class="user-name" onclick="document.getElementById('userAreaBtn').click()">${getShortName(aluno.nome)} ${ICONS.chevronDown}</div>
                    <div class="user-dropdown" id="userDropdown">
                        <a href="#" id="btn-meus-dados" class="sub-item">${ICONS.user} Meus Dados</a>
                        <a href="#" id="btn-editar-perfil" class="sub-item">${ICONS.edit} Editar Perfil</a>
                    </div>
                    <div class="mini-id">
                        <div class="mini-row"><span class="mini-label">Matrícula</span><span class="mini-val">${carteirinha.matricula}</span></div>
                        <div class="mini-row"><span class="mini-label">Curso</span><span class="mini-val val-curso">${carteirinha.curso}</span></div>
                        <div class="mini-row"><span class="mini-label">Status</span><span class="status-badge">${carteirinha.status}</span></div>
                    </div>
                </div>
                <nav class="nav-menu">
                    <div class="menu-item active">${ICONS.class} Minhas Turmas</div>
                    <a href="https://minhabiblioteca.com.br" target="_blank" class="menu-item btn-biblioteca">${ICONS.books} Biblioteca Digital</a>
                    <a href="/sigaa/verPortalDiscente.do" class="menu-item">↻ Recarregar Painel</a>
                </nav>
                <div id="btn-config">${ICONS.gear} Aparência</div>
                <a href="/sigaa/logar.do?dispatch=logOff" class="menu-item" id="btn-sair">${ICONS.logout} Sair</a>
            </aside>
            <div class="main-content">
                <header class="topbar">
                    <button class="menu-toggle" id="dashMenuBtn">${ICONS.menu}</button>
                    <div style="text-align:right;"><div style="font-weight:700; color:var(--text-primary); font-size: 1.1rem;">Semestre ${aluno.semestre}</div></div>
                </header>
                <div style="padding: 40px;">
                    <div style="max-width: 1100px; margin: 0 auto;">
                        <div class="welcome-card">
                            <div class="welcome-text"><h1>Olá, ${getShortName(aluno.nome)}! 👋</h1><p>Bem-vindo ao seu Portal do Discente.</p></div>
                            <div class="date-badge">${ICONS.clock} ${capitalizedDate}</div>
                        </div>
                        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:30px;">
                            <h2 style="font-size:1.5rem; font-weight:700; color:var(--text-primary); margin:0; display:flex; align-items:center; gap:12px;">${ICONS.class} Turmas do Semestre</h2>
                            <button class="btn-grade" id="btn-ver-grade">${ICONS.table} Ver Grade</button>
                        </div>
                        <div id="dash-cards" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:25px;"></div>
                        <div style="margin-top: 40px;">${activitiesHTML}</div>
                    </div>
                </div>
            </div>`;

            // INJETA HTML E ESCONDE O VELHO
            const oldElements = document.querySelectorAll("#container, #cabecalho, #rodape, #barra-governo, body > table");
            oldElements.forEach(el => el.style.display = 'none');
            
            const div = document.createElement('div'); div.innerHTML = dashHTML; document.body.appendChild(div);

            // CARDS
            const cardArea = document.getElementById('dash-cards');
            if(cardData.length > 0) {
                cardData.forEach(card => {
                    const cardEl = document.createElement('div');
                    cardEl.style.cssText = `background:var(--card-bg); border-radius:16px; padding:25px; border:1px solid var(--border-color); cursor:pointer; position:relative; overflow:hidden; box-shadow:0 10px 15px -3px rgba(0,0,0,0.03); transition:0.3s;`;
                    cardEl.innerHTML = `<div style="position:absolute; top:0; left:0; right:0; height:4px; background:${card.bg}"></div><h3 style="margin:5px 0 15px 0; color:var(--text-primary); font-weight:700; font-size:1rem; line-height:1.4; min-height:2.8em; background:transparent !important;">${card.nome}</h3><div style="color:var(--text-secondary); font-size:0.85rem; display:flex; gap:8px; align-items:center; margin-bottom:15px;">${ICONS.map} ${card.local}</div><div style="display:flex; flex-wrap:wrap; gap:5px;">${card.horarioHTML}</div>`;
                    cardEl.onclick = () => document.getElementById(card.uid).click();
                    cardEl.onmouseover = () => { cardEl.style.transform = 'translateY(-5px)'; cardEl.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)'; };
                    cardEl.onmouseout = () => { cardEl.style.transform = 'translateY(0)'; cardEl.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.03)'; };
                    cardArea.appendChild(cardEl);
                });
            } else { cardArea.innerHTML = "<p>Nenhuma turma encontrada.</p>"; }

            // Listeners
            const userBtn = document.getElementById('userAreaBtn');
            const userDrop = document.getElementById('userDropdown');
            if(userBtn) userBtn.addEventListener('click', () => userDrop.classList.toggle('open'));

            document.getElementById('btn-meus-dados')?.addEventListener('click', (e) => { e.preventDefault(); triggerMeusDados(); });
            document.getElementById('btn-editar-perfil')?.addEventListener('click', (e) => { e.preventDefault(); triggerEditarPerfil(); });
            document.getElementById('btn-ver-grade')?.addEventListener('click', () => { criarModalGrade(); document.getElementById('modal-grade').style.display = 'flex'; });
            document.getElementById('btn-config')?.addEventListener('click', () => { criarModalTemas(); document.getElementById('modal-temas').style.display = 'flex'; });

            // HOTFIX MENU MOBILE (Recuperação agressiva)
            const initMenu = setInterval(() => {
                let menu = document.getElementById('menu-dropdown');
                if (!menu) menu = document.querySelector('[id*="menu_form_menu_discente"] > div');
                if (menu) { 
                    clearInterval(initMenu); 
                    document.body.appendChild(menu);
                    menu.style.display = 'none';
                    menu.style.zIndex = '999999';
                    menu.style.position = 'fixed';
                } 
            }, 500);

            const menuBtn = document.getElementById('dashMenuBtn');
            if (menuBtn) {
                menuBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    let menu = document.getElementById('menu-dropdown') || document.querySelector('[id*="menu_form_menu_discente"] > div');
                    if (!menu) return;
                    const isVisible = menu.style.display === 'block';
                    menu.style.display = isVisible ? 'none' : 'block';
                    if (!isVisible) {
                        const rect = menuBtn.getBoundingClientRect();
                        menu.style.top = (rect.bottom + 10) + 'px';
                        menu.style.left = (rect.left - 100) + 'px';
                        menu.querySelectorAll('*').forEach(el => {
                            el.style.backgroundColor = 'var(--sidebar-bg)';
                            el.style.color = '#cbd5e1';
                        });
                    }
                });
                document.addEventListener('click', () => {
                    const menu = document.getElementById('menu-dropdown') || document.querySelector('[id*="menu_form_menu_discente"] > div');
                    if (menu && menu.style.display === 'block') menu.style.display = 'none';
                });
            }

        } catch (e) {
            console.error("SIGAA Ultimate CRASH:", e);
            document.querySelectorAll("#container, #cabecalho, #rodape, #barra-governo, body > table").forEach(el => el.style.display = '');
            alert("Erro no SIGAA Ultimate. Restaurando original.");
        }
    } else {
        // PAGINAS INTERNAS (PROTEGIDAS)
        GM_addStyle(`
            #internal-navbar { position: fixed; top: 0; left: 0; right: 0; height: 55px; background-color: var(--sidebar-bg); background-image: var(--sidebar-bg-image); background-color: var(--sidebar-bg-color); border-bottom: 1px solid var(--sidebar-border); color: white; z-index: 9999; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; font-family: 'Inter', sans-serif !important; } 
            .nav-link { background: rgba(255,255,255,0.1); color: white; text-decoration: none; padding: 6px 12px; border-radius: 6px; font-size: 0.85rem; display: flex; align-items: center; gap: 6px; cursor: pointer; border: none; font-family: 'Inter', sans-serif !important; } 
            body { padding-top: 75px !important; background-color: var(--bg-color) !important; font-family: 'Inter', sans-serif !important; } 
            #cabecalho, #rodape, #barra-governo { display: none !important; } 
            #container { width: 96% !important; max-width: 1200px !important; margin: 0 auto !important; background: white !important; border-radius: 12px !important; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1) !important; padding: 30px !important; border: 1px solid #e2e8f0 !important; color: #1e293b !important; } 
            table.listagem, table.visualizacao { width: 100%; border-collapse: collapse; margin-bottom: 20px; } 
            table.listagem th { background: #f1f5f9 !important; color: #475569 !important; padding: 12px !important; text-transform: uppercase; font-size: 0.7rem; border-bottom: 2px solid #e2e8f0; font-family: 'Inter', sans-serif !important; } 
            table.listagem td { padding: 12px !important; border-bottom: 1px solid #f1f5f9 !important; color: #1e293b !important; font-family: 'Inter', sans-serif !important; } 
            .titulo { font-size: 1.25rem !important; color: #0f172a !important; border-bottom: 2px solid #3b82f6 !important; padding-bottom: 8px; margin-bottom: 20px; font-family: 'Inter', sans-serif !important; }
        `);
        const nav = document.createElement('div'); nav.id = "internal-navbar";
        nav.innerHTML = `<div style="display:flex; align-items:center; gap:12px; font-weight:700;"><span>SIGAA Ultimate</span></div><div style="display:flex; gap:10px;"><a href="/sigaa/portais/discente/discente.jsf" class="nav-link">${ICONS.home} Home</a><button class="nav-link" id="internalMenuBtn">${ICONS.menu} Menu</button></div>`;
        document.body.prepend(nav);
        
        // Menu Interno
        const menuBtn = document.getElementById('internalMenuBtn');
        const initMenu = setInterval(() => { 
            let menu = document.getElementById('menu-dropdown');
            if (!menu) menu = document.querySelector('[id*="menu_form_menu_discente"] > div');
            if (menu) { 
                clearInterval(initMenu); 
                document.body.appendChild(menu);
                menu.style.display = 'none';
                menu.style.zIndex = '999999';
                menu.style.position = 'fixed';
            } 
        }, 500);

        if (menuBtn) {
            menuBtn.addEventListener('click', (e) => { 
                e.stopPropagation(); 
                let menu = document.getElementById('menu-dropdown') || document.querySelector('[id*="menu_form_menu_discente"] > div');
                if (!menu) return; 
                let open = menu.style.display === 'block'; 
                menu.style.display = open ? 'none' : 'block'; 
                menu.style.top = '60px'; 
                menu.style.right = '20px'; 
                menu.style.left = 'auto'; 
                menu.querySelectorAll('*').forEach(el => {
                    el.style.backgroundColor = 'var(--sidebar-bg)';
                    el.style.color = '#cbd5e1';
                });
            });
            document.addEventListener('click', () => { 
                const menu = document.getElementById('menu-dropdown') || document.querySelector('[id*="menu_form_menu_discente"] > div'); 
                if (menu) menu.style.display = 'none'; 
            });
        }
    }
})();