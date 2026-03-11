// ==UserScript==
// @name         SIGAA Ultimate - turma
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Clean Code
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

    if (window.location.href.includes("verTelaLogin") || window.location.href.includes("paginaInicial") || document.querySelector("#loginFormMask")) return;
    if (window.self !== window.top) return;

    const isDashboard = document.querySelector("#agenda-docente") !== null;

    const isInternalPage = !isDashboard && (
        document.querySelector("#cabecalho") !== null ||
        document.querySelector(".ui-layout-west") !== null ||
        document.querySelector("#relatorio") !== null ||
        document.querySelector(".tabelaRelatorio") !== null ||
        window.location.href.includes("/ava/")
    );

    if (document.getElementById('painel-erro') || document.body.innerText.includes("Comportamento Inesperado")) {
        localStorage.removeItem('sigaa_plus_cache');
        return;
    }

    if (!isInternalPage) return;

    const PALETTES = {
        ufc: {
            name: "UFC (Original)", primary: '#3b82f6', hover: '#2563eb',
            light: { bg: '#f8fafc', card: '#ffffff', sidebar: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)', text: '#1e293b', subtext: '#64748b', border: '#e2e8f0', welcome: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' },
            dark: { bg: '#0f172a', card: '#1e293b', sidebar: '#020617', text: '#f1f5f9', subtext: '#94a3b8', border: '#334155', welcome: 'linear-gradient(135deg, #172554 0%, #1e293b 100%)' }
        },
        rocket: {
            name: "Rocketseat", primary: '#8257e6', hover: '#996DFF',
            light: { bg: '#f4f4fa', card: '#ffffff', sidebar: '#121214', text: '#202024', subtext: '#4d4d57', border: '#e1e1e6', welcome: 'linear-gradient(135deg, #8257e6 0%, #202024 100%)' },
            dark: { bg: '#121214', card: '#202024', sidebar: '#09090a', text: '#e1e1e6', subtext: '#a8a8b3', border: '#29292e', welcome: 'linear-gradient(135deg, #4c1d95 0%, #121214 100%)' }
        },
        matrix: {
            name: "Matrix", primary: '#00e639', hover: '#00ff41',
            light: { bg: '#f0fdf4', card: '#ffffff', sidebar: '#000000', text: '#064e3b', subtext: '#065f46', border: '#bbf7d0', welcome: 'linear-gradient(135deg, #052e16 0%, #166534 100%)' },
            dark: { bg: '#000000', card: '#0a120a', sidebar: '#001a00', text: '#00ff41', subtext: '#008F11', border: '#003300', welcome: 'linear-gradient(135deg, #002600 0%, #004d00 100%)' }
        },
        orange: {
            name: "Laranja", primary: '#f97316', hover: '#ea580c',
            light: { bg: '#fff7ed', card: '#ffffff', sidebar: '#271a12', text: '#431407', subtext: '#7c2d12', border: '#fed7aa', welcome: 'linear-gradient(135deg, #9a3412 0%, #f97316 100%)' },
            dark: { bg: '#1c1917', card: '#292524', sidebar: '#1a1816', text: '#fafaf9', subtext: '#a8a29e', border: '#44403c', welcome: 'linear-gradient(135deg, #431407 0%, #292524 100%)' }
        }
    };

    let currentPalette = localStorage.getItem('sigaa_palette') || 'ufc';
    let isDarkMode = localStorage.getItem('sigaa_dark_mode') === 'true';

    function applyTheme() {
        const root = document.documentElement;
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
    }
    applyTheme();

    const icons = {
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

    let aluno = JSON.parse(localStorage.getItem('sigaa_plus_cache') || '{}');
    let carteirinha = { matricula: "---", curso: "---", nivel: "---", status: "---", email: "---", entrada: "---" };
    const turmasData = [];
    const diasSemana = ["SEG", "TER", "QUA", "QUI", "SEX"];
    const today = new Date();
    const dateString = today.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const capitalizedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);

    function capitalizeName(name) { return name ? name.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "Discente"; }
    function getShortName(fullName) { if(!fullName) return "Discente"; const p = fullName.split(' '); return p.length <= 1 ? fullName : p[0] + ' ' + p[1]; }
    function cleanText(text) { return text ? text.replace(/\(\d{2}\/\d{2}\/\d{4}.*?\)/g, "").trim() : ""; }
    function formatHorarios(rawText) {
        let text = cleanText(rawText);
        let parts = [];
        ["SEG", "TER", "QUA", "QUI", "SEX", "SAB"].forEach(dia => {
            const regex = new RegExp(`${dia}\\s\\d{2}:\\d{2}-\\d{2}:\\d{2}`, "g");
            const matches = text.match(regex);
            if (matches) parts.push(...matches);
        });
        return parts.length === 0 ? `<div class="horario-badge">Horário não definido</div>` : parts.map(h => `<div class="horario-badge">${icons.clock} <span>${h}</span></div>`).join("");
    }

    const initInternalPage = () => {
             GM_addStyle(`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                #internal-navbar {
                    position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); height: auto;
                    background-color: var(--card-bg); border: 1px solid var(--border-color);
                    border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    z-index: 999999; display: flex; flex-direction: row; gap: 6px;
                    padding: 10px; font-family: 'Inter', sans-serif !important;
                }
                .nav-link {
                    background: var(--bg-color); color: var(--text-primary); text-decoration: none;
                    padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; display: flex;
                    align-items: center; gap: 8px; cursor: pointer; border: 1px solid var(--border-color); 
                    font-family: 'Inter', sans-serif !important; transition: 0.2s; font-weight: 600;
                }
                .nav-link:hover { background: var(--theme-primary-light); color: var(--theme-primary); border-color: var(--theme-primary); transform: translateY(-2px); }
                #internal-navbar > div:first-child { display: none !important; }
                
                /* ========================================= */
                /* REDESIGN: Estilizando Layout Nativo       */
                /* ========================================= */
                #painel-usuario, #menu-acessibilidade { 
                    display: none !important; 
                }

                #cabecalho, #rodape, .ui-layout-pane, .ui-layout-center, .rich-panelbar-interior, #info-sistema, .colunaEsquerda, .colunaDireita, form[name="formMenu"] {
                    background-color: var(--bg-color) !important;
                    background-image: none !important;
                    border-color: var(--border-color) !important;
                }
                #info-sistema { border-bottom: 1px solid var(--border-color) !important; padding: 10px 20px !important; }
                .ui-layout-resizer { background: var(--border-color) !important; }
                .geral { color: var(--text-primary) !important; background: transparent !important; }
                
                /* Força sobrescrita de estilos inline nos TDs dos menus laterais */
                #barraEsquerda table td, #barraDireita table td {
                    background-image: none !important;
                    background-color: var(--card-bg) !important;
                    color: var(--theme-primary) !important;
                    border-bottom: 1px solid var(--border-color) !important;
                }
                
                #toggleDireita { background-image: none !important; background-color: var(--card-bg) !important; }

                /* Headers dos menus sanfona da esquerda */
                [class^="itemMenuHeader"] {
                    background-image: none !important;
                    background-color: var(--bg-color) !important;
                    color: var(--theme-primary) !important;
                    border-top: none !important;
                    border-bottom: 1px solid var(--border-color) !important;
                    height: auto !important; padding: 8px 15px !important;
                }

                .rich-panelbar-header, .rich-panelbar-header-act, .headerBloco {
                    background: var(--card-bg) !important;
                    background-image: none !important;
                    color: var(--theme-primary) !important;
                    border-bottom: 1px solid var(--border-color) !important;
                }
                
                .itemMenu {
                    background: var(--bg-color) !important;
                    color: var(--text-primary) !important;
                    border-bottom: 1px solid var(--border-color) !important;
                    height: auto !important; padding: 8px 15px !important;
                }
                .itemMenu:hover { 
                    background: var(--theme-primary-light) !important; 
                    color: var(--theme-primary) !important;
                }
                
                .rich-panelbar-content, .rich-stglpanel-body, .rich-stglpanel, .rich-panelbar-content-exterior {
                    background: var(--bg-color) !important;
                    background-color: var(--bg-color) !important;
                    color: var(--text-primary) !important;
                    border-color: var(--border-color) !important;
                    background-image: none !important;
                }
                
                /* ========================================= */
                /* REDESIGN: Barras de Rolagem (Scrollbars)  */
                /* ========================================= */
                ::-webkit-scrollbar { width: 10px; height: 10px; }
                ::-webkit-scrollbar-track { background: var(--bg-color) !important; border-radius: 4px; }
                ::-webkit-scrollbar-thumb { background: var(--border-color) !important; border-radius: 4px; border: 2px solid var(--bg-color); }
                ::-webkit-scrollbar-thumb:hover { background: var(--theme-primary) !important; }
                ::-webkit-scrollbar-corner { background: var(--bg-color); }
                * { scrollbar-width: thin; scrollbar-color: var(--border-color) var(--bg-color); }
                
                /* ========================================= */
                /* REDESIGN: Tabelas Limpas e Subpáginas     */
                /* ========================================= */
                table.subSistema, table.tabelaRelatorio, table.listagem, .form, .formulario {
                    background-color: transparent !important;
                    background: transparent !important;
                    color: var(--text-primary) !important;
                    border: none !important;
                }
                table th, .tabelaRelatorio th, .listagem th, .subSistema th, caption, thead td, thead th {
                    background-color: var(--card-bg) !important;
                    background-image: none !important;
                    color: var(--theme-primary) !important;
                    border: 1px solid var(--border-color) !important;
                    font-family: 'Inter', sans-serif !important;
                    font-weight: 700 !important;
                }
                table td, .tabelaRelatorio td, .listagem td, .listagem tr, .subSistema td {
                    background-color: var(--bg-color) !important;
                    background: var(--bg-color) !important;
                    color: var(--text-primary) !important;
                    border: 1px solid var(--border-color) !important;
                }
                .listagem tr:hover td, .tabelaRelatorio tr:hover td {
                    background-color: var(--theme-primary-light) !important;
                }
                
                /* Forçar painéis e legendas a usarem o theme */
                fieldset, legend { border-color: var(--border-color) !important; color: var(--theme-primary) !important; background: transparent !important; }
                
                /* Textos soltos nas subpaginas */
                .subSistema span, .subSistema p, .subSistema label, .subSistema h1, .subSistema h2, .subSistema h3 {
                    color: var(--text-primary) !important;
                }
                
                /* Cor dos links originais */
                .itemMenu a, .rich-panelbar-content a, #info-sistema a, .geral a, table a {
                    color: var(--theme-primary) !important;
                }
                /* ========================================= */

                .calc-row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px; }
                .calc-label { font-size: 0.85rem; color: #94a3b8; }
                .calc-val { font-weight: 700; font-size: 1rem; color: #f8fafc; }
                .calc-res { font-weight: 800; font-size: 1.1rem; color: var(--theme-primary); }
                body, html, #conteudo, #meio, #formAva, .conteudo, .conteudo-interno { 
                    background-color: var(--bg-color) !important; 
                    color: var(--text-primary) !important;
                }

                /* Melhoria visual para Turma Virtual Topicos */
                .topico-aula {
                    background: var(--card-bg) !important;
                    border: 1px solid var(--border-color) !important;
                    border-left: 4px solid var(--theme-primary) !important;
                    border-radius: 12px;
                    padding: 24px !important;
                    margin-bottom: 24px !important;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
                    transition: all 0.3s ease;
                    color: var(--text-primary) !important;
                }
                .topico-aula * { color: inherit; }
                .topico-aula:hover { box-shadow: 0 8px 25px rgba(0,0,0,0.08); transform: translateY(-2px); }
                .topico-aula .titulo {
                    font-size: 1.25rem !important; padding-bottom: 12px !important;
                    border-bottom: 1px dashed var(--border-color) !important; margin-bottom: 15px !important;
                    color: var(--theme-primary) !important; font-weight: 800 !important; letter-spacing: -0.02em;
                }
                .topico-aula .item { margin-bottom: 12px; }
                .topico-aula .item a {
                    display: inline-flex; align-items: center; gap: 8px; background: var(--bg-color);
                    border: 1px solid var(--border-color); padding: 8px 14px; border-radius: 8px;
                    color: var(--text-primary) !important; font-weight: 600; font-size: 0.9rem;
                    text-decoration: none !important; margin-top: 5px; transition: all 0.2s;
                }
                .topico-aula .desc { color: var(--text-secondary) !important; font-size: 0.9rem; line-height: 1.5; margin-top: 4px; display: block; }
                .topico-aula .item a:hover { color: var(--theme-hover) !important; border-color: var(--theme-hover); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                .topico-aula .item a img { filter: grayscale(100%); opacity: 0.7; transition: all 0.2s; }
                .topico-aula .item a:hover img { filter: grayscale(0%) brightness(100%); opacity: 1; }
                
                /* Limpeza de tags legado */
                center { text-align: left !important; display: block; margin: 15px 0; color: var(--text-secondary); font-size: 0.95rem; }
                
                #nomeTurma {
                    background: transparent !important;
                    padding: 0 0 10px 0 !important; border-radius: 0; margin: 10px 0 20px 0 !important; color: var(--text-primary);
                    text-align: left; font-weight: 800 !important; font-size: 1.4rem !important;
                    border-bottom: 1px solid var(--border-color) !important; display: block;
                }
                #nomeTurma a { color: var(--text-primary) !important; text-decoration: none !important; }
            `);

            const nav = document.createElement('div'); nav.id = "internal-navbar";
            nav.innerHTML = `
                <div style="display:flex; align-items:center; gap:12px; font-weight:700;"><span>SIGAA Ultimate</span></div>
                <div style="display:flex; gap:10px;">
                    <button class="nav-link" id="btn-calc-freq">${icons.clock} Frequência</button>
                    <button class="nav-link" id="btn-calc-notas">${icons.class} Notas</button>
                    <button class="nav-link" id="btn-config-internal">${icons.gear} Tema</button>
                    <a href="/sigaa/verPortalDiscente.do" class="nav-link">${icons.home} Home</a>
                </div>`;
            if(!document.getElementById('internal-navbar')) document.body.prepend(nav);

            document.getElementById('btn-calc-freq').addEventListener('click', checkFrequency);
            document.getElementById('btn-calc-notas').addEventListener('click', checkGrades);
            document.getElementById('btn-config-internal').addEventListener('click', () => {
                criarModalTemas();
                document.getElementById('modal-temas').style.display = 'flex';
            });
        };


        function extractTotalFaltas(bodyText) {
            const match = bodyText.match(/Total de Faltas:?\s*(\d+)/i);
            return match ? parseInt(match[1]) : null;
        }

        function extractMaxFaltas(bodyText) {
            const maxMatch = bodyText.match(/M.ximo de Faltas Permitido:?\s*(\d+)/i);
            if (maxMatch) return parseInt(maxMatch[1]);
            
            const headers = document.querySelectorAll('div.titulo, h4');
            for (const header of headers) {
                const match = header.innerText.match(/\(\s*(\d+)\s*h\s*\)/i);
                if (match) return Math.floor(parseInt(match[1]) * 0.25);
            }
            return 16;
        }

        function getFrequencyStatus(totalFaltas, maxFaltas) {
            if (totalFaltas > maxFaltas) return { text: "Reprovado por Falta", color: "#ef4444" };
            if (totalFaltas >= (maxFaltas * 0.8)) return { text: "Cuidado", color: "#f97316" };
            return { text: "Seguro", color: "#22c55e" };
        }

        function checkFrequency() {
            const bodyText = document.body.innerText;
            const totalFaltas = extractTotalFaltas(bodyText);

            if (totalFaltas === null) {
                alert("⚠️ Página não reconhecida ou sem dados de frequência.\n\nNavegue até a página de Frequência da disciplina.");
                return;
            }

            const maxFaltas = extractMaxFaltas(bodyText);
            const restantes = maxFaltas - totalFaltas;
            const status = getFrequencyStatus(totalFaltas, maxFaltas);

            showModal("Monitor de Frequência", `
                <div style="display:flex; justify-content:space-around; margin-bottom:20px;">
                    <div><div style="font-size:0.8rem; color:#94a3b8; font-weight:700;">FALTAS</div><div style="font-size:2rem; font-weight:800; color:white;">${totalFaltas}</div></div>
                    <div><div style="font-size:0.8rem; color:#94a3b8; font-weight:700;">LIMITE</div><div style="font-size:2rem; font-weight:800; color:white;">${maxFaltas}</div></div>
                </div>
                <div style="background:${status.color}20; color:${status.color}; padding:15px; border-radius:8px; font-weight:700; margin-bottom:10px; border:1px solid ${status.color};">
                    ${status.text}: Restam ${restantes} faltas
                </div>
            `);
        }

        function extractUserGrades(table, matricula) {
            let n1 = null, n2 = null;
            let userFound = false;
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length > 2) {
                    const matCell = cells[0].innerText.trim();
                    if ((matricula && matCell === matricula) || rows.length === 1) {
                        userFound = true;
                        const clean = (txt) => parseFloat(txt.replace(',','.').trim());
                        if (cells[2] && cells[2].innerText.match(/[\d,]/)) n1 = clean(cells[2].innerText);
                        if (cells[3] && cells[3].innerText.match(/[\d,]/)) n2 = clean(cells[3].innerText);
                    }
                }
            });
            return { userFound, n1, n2 };
        }

        function generateGradeHtml(n1, n2) {
            if (n1 === null && n2 === null) {
                return "<p>Nenhuma nota lançada ainda.</p>";
            } 
            
            if (n1 !== null && n2 === null) {
                const precisaPara7 = Math.max(0, 14 - n1).toFixed(1);
                const precisaPara4 = Math.max(0, 8 - n1).toFixed(1);
                return `
                    <div class="calc-row"><span class="calc-label">Nota Unidade 1</span> <span class="calc-val">${n1}</span></div>
                    <hr style="border-color:rgba(255,255,255,0.1); margin:15px 0;">
                    <div style="margin-bottom:15px;"><div class="calc-label">Para APROVAR DIRETO (Média 7):</div><div style="color:#4ade80; font-size:1.2rem; font-weight:800;">Precisa de ${precisaPara7} na N2</div></div>
                    <div><div class="calc-label">Para ir para FINAL (Mínimo):</div><div style="color:#facc15; font-size:1.2rem; font-weight:800;">Precisa de ${precisaPara4} na N2</div><small style="color:#94a3b8;">Menor que isso reprova direto.</small></div>
                `;
            }
            
            const media = (n1 + n2) / 2;
            let situacao = "", cor = "", extraInfo = "";
            
            if (media >= 7) { 
                situacao = "APROVADO POR MÉDIA"; 
                cor = "#22c55e"; 
                extraInfo = "Parabéns! Você já passou."; 
            } else if (media < 4) { 
                situacao = "REPROVADO"; 
                cor = "#ef4444"; 
                extraInfo = "Média inferior a 4.0."; 
            } else { 
                situacao = "AVALIAÇÃO FINAL"; 
                cor = "#f97316"; 
                const precisaAF = (10 - media).toFixed(1); 
                extraInfo = `<div style="margin-top:10px; font-size:1.1rem;">Precisa tirar <span style="color:white; font-weight:800; font-size:1.4rem;">${precisaAF}</span> na Final.</div>`; 
            }

            return `
                <div class="calc-row"><span class="calc-label">Nota Unidade 1</span> <span class="calc-val">${n1}</span></div>
                <div class="calc-row"><span class="calc-label">Nota Unidade 2</span> <span class="calc-val">${n2}</span></div>
                <div class="calc-row" style="border:none; margin-top:15px;"><span class="calc-label">MÉDIA PARCIAL</span> <span class="calc-res" style="color:${cor}">${media.toFixed(1)}</span></div>
                <div style="background:${cor}20; border:1px solid ${cor}; color:${cor}; padding:15px; border-radius:8px; text-align:center; font-weight:700; margin-top:10px;">${situacao}${extraInfo}</div>
            `;
        }

        function checkGrades() {
            let matricula = aluno.dados ? aluno.dados.matricula : null;
            const table = document.querySelector('table.tabelaRelatorio');
            
            if (!table) {
                alert("⚠️ Tabela de notas não encontrada.\n\nEntre na disciplina e clique em 'Ver Notas' ou 'Participantes'.");
                return;
            }

            const { userFound, n1, n2 } = extractUserGrades(table, matricula);

            if (!userFound) { 
                alert("⚠️ Sua matrícula (" + (matricula || 'N/A') + ") não foi encontrada nesta tabela."); 
                return; 
            }

            const htmlContent = generateGradeHtml(n1, n2);
            showModal("Calculadora de Notas", htmlContent);
        }

        function showModal(title, content) {
            const id = 'modal-generic-ultimate';
            const existingModal = document.getElementById(id);
            if (existingModal) {
                existingModal.remove();
            }

            const modal = document.createElement('div');
            modal.id = id;
            modal.style.cssText = `
                display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.6); z-index: 9999999; align-items: center;
                justify-content: center; backdrop-filter: blur(3px); font-family: 'Inter', sans-serif;
            `;

            modal.innerHTML = `
                <div style="background: #1e293b; color: white; width: 90%; max-width: 400px; border-radius: 16px; padding: 30px; box-shadow: 0 20px 50px rgba(0,0,0,0.4); text-align: center; border: 1px solid #334155; position: relative;">
                    <button id="close-${id}" style="position: absolute; top: 15px; right: 15px; background: none; border: none; color: #64748b; font-size: 1.5rem; cursor: pointer;">&times;</button>
                    <h2 style="margin: 0 0 20px 0; color: white !important; font-size: 1.3rem; font-weight: 700; background: transparent !important; border: none !important;">${title}</h2>
                    ${content}
                </div>
            `;

            document.body.appendChild(modal);

            document.getElementById(`close-${id}`).addEventListener('click', () => modal.remove());
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.remove();
            });
        }

    initInternalPage();

    function criarModalTemas() {
        const id = 'modal-temas';
        const existingModal = document.getElementById(id);
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = id;
        modal.style.cssText = `
            display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.6); z-index: 99999; align-items: center;
            justify-content: center; backdrop-filter: blur(3px);
        `;

        const themeButtonsHtml = Object.entries(PALETTES).map(([key, theme]) => {
            return `
                <button class="btn-theme" data-theme="${key}" style="background:transparent; border:2px solid var(--border-color); color:var(--text-primary); padding:15px; border-radius:12px; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:10px; width:100px; transition:all 0.2s;">
                    <div style="width:30px; height:30px; background:${theme.primary}; border-radius:50%;"></div>
                    <span style="font-size:0.8rem; font-weight:600;">${theme.name}</span>
                </button>
            `;
        }).join('');

        modal.innerHTML = `
            <div style="background:var(--card-bg); border-radius:16px; padding:30px; max-width:500px; width:90%; position:relative; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2);">
                <button id="btn-fechar-temas" style="position:absolute; top:15px; right:15px; background:none; border:none; font-size:1.5rem; cursor:pointer; color:var(--text-secondary);">&times;</button>
                <h2 style="margin:0 0 20px 0; color:var(--text-primary) !important; font-size:1.5rem; font-weight:700; background:transparent !important; border:none !important;">Aparência</h2>
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; background:var(--bg-color); padding:10px 15px; border-radius:8px;">
                    <span style="font-weight:600; color:var(--text-primary);">Modo Escuro</span>
                    <label class="switch">
                        <input type="checkbox" id="theme-switch" ${isDarkMode ? 'checked' : ''}>
                        <span class="slider round"></span>
                    </label>
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:15px; justify-content:center;">
                    ${themeButtonsHtml}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeBtn = document.getElementById('btn-fechar-temas');
        closeBtn.addEventListener('click', () => modal.style.display = 'none');
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

        const themeButtons = modal.querySelectorAll('.btn-theme');
        themeButtons.forEach(btn => {
            if (btn.dataset.theme === currentPalette) btn.style.borderColor = 'var(--theme-primary)';
            btn.addEventListener('click', () => {
                currentPalette = btn.dataset.theme;
                applyTheme();
                themeButtons.forEach(b => b.style.borderColor = 'var(--border-color)');
                btn.style.borderColor = 'var(--theme-primary)';
            });
        });

        const themeSwitch = document.getElementById('theme-switch');
        themeSwitch.addEventListener('change', (e) => {
            isDarkMode = e.target.checked;
            applyTheme();
        });
    }

})();