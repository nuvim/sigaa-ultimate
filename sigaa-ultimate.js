// ==UserScript==
// @name         SIGAA Ultimate - Versão Unificada
// @version      3.0
// @author       Gusttavo
// @match        *://si3.ufc.br/sigaa/*
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const PALETTES = {
        ufc: { name: "UFC (Original)", primary: '#3b82f6', hover: '#2563eb', light: { bg: '#f8fafc', card: '#ffffff', sidebar: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)', text: '#1e293b', subtext: '#64748b', border: '#e2e8f0', welcome: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }, dark: { bg: '#0f172a', card: '#1e293b', sidebar: '#020617', text: '#f1f5f9', subtext: '#94a3b8', border: '#334155', welcome: 'linear-gradient(135deg, #172554 0%, #1e293b 100%)' } },
        rocket: { name: "Rocketseat", primary: '#8257e6', hover: '#996DFF', light: { bg: '#f4f4fa', card: '#ffffff', sidebar: '#121214', text: '#202024', subtext: '#4d4d57', border: '#e1e1e6', welcome: 'linear-gradient(135deg, #8257e6 0%, #202024 100%)' }, dark: { bg: '#121214', card: '#202024', sidebar: '#09090a', text: '#e1e1e6', subtext: '#a8a8b3', border: '#29292e', welcome: 'linear-gradient(135deg, #4c1d95 0%, #121214 100%)' } },
        matrix: { name: "Matrix", primary: '#00e639', hover: '#00ff41', light: { bg: '#f0fdf4', card: '#ffffff', sidebar: '#000000', text: '#064e3b', subtext: '#065f46', border: '#bbf7d0', welcome: 'linear-gradient(135deg, #052e16 0%, #166534 100%)' }, dark: { bg: '#000000', card: '#0a120a', sidebar: '#001a00', text: '#00ff41', subtext: '#008F11', border: '#003300', welcome: 'linear-gradient(135deg, #002600 0%, #004d00 100%)' } },
        orange: { name: "Laranja", primary: '#f97316', hover: '#ea580c', light: { bg: '#fff7ed', card: '#ffffff', sidebar: '#271a12', text: '#431407', subtext: '#7c2d12', border: '#fed7aa', welcome: 'linear-gradient(135deg, #9a3412 0%, #f97316 100%)' }, dark: { bg: '#1c1917', card: '#292524', sidebar: '#0c0a09', text: '#fafaf9', subtext: '#a8a29e', border: '#44403c', welcome: 'linear-gradient(135deg, #431407 0%, #292524 100%)' } }
    };

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
        gear: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M128 80a48 48 0 1 0 48 48a48 48 0 0 0-48-48m0 80a32 32 0 1 1 32-32a32 32 0 0 1-32 32m88-29.8v-4.4a15.8 15.8 0 0 0-10.9-15.2l-20.2-6.5a73 73 0 0 0-3.6-8.7l6.6-19.9a15.8 15.8 0 0 0-6.6-18.1l-3.8-2.2a15.8 15.8 0 0 0-18.1 2.2l-15.6 11.9a73.2 73.2 0 0 0-9.2-2.4V66.8a15.8 15.8 0 0 0-14.7-15.8h-4.4a15.8 15.8 0 0 0-15.8 14.7v20.2a72 72 0 0 0-9.2 2.4l-15.6-11.9a15.8 15.8 0 0 0 18.1 2.2l-3.8 2.2a15.8 15.8 0 0 0 6.6-18.1l-6.6-19.9a73 73 0 0 0-3.6 8.7l-20.2-6.5a15.8 15.8 0 0 0 10.9-15.2"/></svg>`
    };

    let currentPalette = localStorage.getItem('sigaa_palette') || 'ufc';
    let isDarkMode = localStorage.getItem('sigaa_dark_mode') === 'true';

    function applyTheme() {
        const root = document.documentElement;
        const themeBase = PALETTES[currentPalette] || PALETTES.ufc;
        const mode = isDarkMode ? themeBase.dark : themeBase.light;

        root.style.setProperty('--theme-primary', themeBase.primary);
        root.style.setProperty('--theme-hover', themeBase.hover);
        root.style.setProperty('--theme-overlay', themeBase.bg_overlay || 'rgba(14, 44, 78, 0.9)');
        root.style.setProperty('--theme-text', themeBase.text_color || themeBase.primary);
        root.style.setProperty('--theme-primary-hover', themeBase.hover);
        root.style.setProperty('--theme-primary-light', isDarkMode ? `${themeBase.primary}4D` : `${themeBase.primary}25`);
        root.style.setProperty('--bg-color', mode.bg || '#ffffff');
        root.style.setProperty('--card-bg', mode.card || '#ffffff');
        
        if (mode.sidebar && mode.sidebar.includes('gradient')) {
            root.style.setProperty('--sidebar-bg-image', mode.sidebar);
            root.style.setProperty('--sidebar-bg-color', 'transparent');
        } else {
            root.style.setProperty('--sidebar-bg-image', 'none');
            root.style.setProperty('--sidebar-bg-color', mode.sidebar || mode.bg);
        }

        root.style.setProperty('--text-primary', mode.text || '#000000');
        root.style.setProperty('--text-secondary', mode.subtext || '#666666');
        root.style.setProperty('--border-color', mode.border || '#dddddd');
        root.style.setProperty('--welcome-bg', mode.welcome || themeBase.primary);

        localStorage.setItem('sigaa_palette', currentPalette);
        localStorage.setItem('sigaa_dark_mode', isDarkMode);
    }

    function injectExternalResources() {
        const head = document.head;
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap';
        head.appendChild(fontLink);
        
        const iconScript = document.createElement('script');
        iconScript.src = 'https://unpkg.com/@phosphor-icons/web';
        head.appendChild(iconScript);
    }

    window.criarModalTemasGlobal = function() {
        const exist = document.getElementById('modal-temas'); if(exist) exist.remove();
        const modal = document.createElement('div'); modal.id = 'modal-temas';
        modal.style.cssText = `display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9999999; align-items:center; justify-content:center; backdrop-filter:blur(3px); font-family: 'Inter', sans-serif;`;
        
        let botoesHTML = '';
        for (const [key, theme] of Object.entries(PALETTES)) {
            botoesHTML += `<button class="btn-theme" data-theme="${key}" style="background:transparent; border:2px solid ${currentPalette === key ? 'var(--theme-primary)' : 'var(--border-color, #e5e7eb)'}; color:var(--text-primary, #374151); padding:15px; border-radius:12px; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:10px; width:100px; transition:all 0.2s;"><div style="width:30px; height:30px; background:${theme.primary}; border-radius:50%;"></div><span style="font-size:0.8rem; font-weight:600;">${theme.name}</span></button>`;
        }
        
        modal.innerHTML = `<div style="background:var(--card-bg, #ffffff); border-radius:16px; padding:30px; max-width:500px; width:90%; position:relative; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2);"><button id="btn-fechar-temas" style="position:absolute; top:15px; right:15px; background:none; border:none; font-size:1.5rem; cursor:pointer; color:var(--text-secondary, #9ca3af); z-index:20;">&times;</button><h2 style="margin:0 0 20px 0; color:var(--text-primary, #111827) !important; font-size:1.5rem; font-weight:700; background:transparent !important; border:none !important;">Aparência</h2><div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; background:var(--bg-color, #f9fafb); padding:10px 15px; border-radius:8px;"><span style="font-weight:600; color:var(--text-primary, #111827);">Modo Escuro</span><label class="switch"><input type="checkbox" id="theme-switch" ${isDarkMode ? 'checked' : ''}><span class="slider round"></span></label></div><div style="display:flex; flex-wrap:wrap; gap:15px; justify-content:center;">${botoesHTML}</div></div>`;
        document.body.appendChild(modal);
        
        document.getElementById('btn-fechar-temas').onclick = () => modal.style.display = 'none';
        modal.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; };
        
        const btns = modal.querySelectorAll('.btn-theme');
        btns.forEach(btn => {
            btn.onclick = () => { 
                currentPalette = btn.dataset.theme; 
                applyTheme(); 
                btns.forEach(b => b.style.borderColor = 'var(--border-color, #e5e7eb)'); 
                btn.style.borderColor = 'var(--theme-primary)'; 
            };
        });
        
        document.getElementById('theme-switch').addEventListener('change', (e) => { 
            isDarkMode = e.target.checked; 
            applyTheme(); 
        });
    };


    const carregarLogin = () => {

    };

    const carregarLanding = () => {

    };

    const carregarPortal = () => {

    };

    const url = window.location.href;

    if (document.getElementById('painel-erro') || document.body.innerText.includes("Comportamento Inesperado")) {
        localStorage.removeItem('sigaa_plus_cache');
        return;
    }

    // Inicializa o Core Visual
    applyTheme();
    injectExternalResources();

    // Roteamento
    if (url.includes("verTelaLogin.do")) {
        carregarLogin();
    } 
    else if (url.includes("paginaInicial.do")) {
        carregarLanding();
    } 
    else {
        // Detecção do Portal (Dashboard ou Interno)
        const isDashboard = document.querySelector("#agenda-docente") !== null;
        const isInternalPage = !isDashboard && (
            document.querySelector("#cabecalho") !== null || 
            document.querySelector(".ui-layout-west") !== null || 
            document.querySelector("#relatorio") !== null ||        
            document.querySelector(".tabelaRelatorio") !== null ||  
            url.includes("/ava/")                  
        );

        if (isDashboard || isInternalPage) {
            carregarPortal();
        }
    }

})();