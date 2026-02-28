// ==UserScript==
// @name         SIGAA Ultimate 2.0 - Landing
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Clean Code
// @author       Gusttavo
// @match        *://si3.ufc.br/sigaa/paginaInicial.do*
// @exclude      *://si3.ufc.br/sigaa/verTelaLogin.do*
// @exclude      *://si3.ufc.br/sigaa/portais/*
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 1. CONFIGURAÇÕES E ESTADO
    const CONFIG = {
        themeKey: 'sigaa_palette',
        darkModeKey: 'sigaa_dark_mode'
    };

    const ICONS = {
        gear: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="currentColor" d="M128 80a48 48 0 1 0 48 48a48 48 0 0 0-48-48m0 80a32 32 0 1 1 32-32a32 32 0 0 1-32 32m88-29.8v-4.4a15.8 15.8 0 0 0-10.9-15.2l-20.2-6.5a73 73 0 0 0-3.6-8.7l6.6-19.9a15.8 15.8 0 0 0-6.6-18.1l-3.8-2.2a15.8 15.8 0 0 0-18.1 2.2l-15.6 11.9a73.2 73.2 0 0 0-9.2-2.4V66.8a15.8 15.8 0 0 0-14.7-15.8h-4.4a15.8 15.8 0 0 0-15.8 14.7v20.2a72 72 0 0 0-9.2 2.4l-15.6-11.9a15.8 15.8 0 0 0-18.1-2.2l-3.8 2.2a15.8 15.8 0 0 0-6.6 18.1l6.6 19.9a73 73 0 0 0-3.6 8.7l-20.2 6.5A15.8 15.8 0 0 0 24 125.8v4.4a15.8 15.8 0 0 0 10.9 15.2l20.2 6.5a73 73 0 0 0 3.6 8.7l-6.6 19.9a15.8 15.8 0 0 0 6.6 18.1l3.8 2.2a15.8 15.8 0 0 0 18.1-2.2l15.6-11.9a73.2 73.2 0 0 0 9.2 2.4v20.1A15.8 15.8 0 0 0 121.8 225h4.4a15.8 15.8 0 0 0 15.8-14.7v-20.2a72 72 0 0 0 9.2-2.4l15.6 11.9a15.8 15.8 0 0 0 18.1 2.2l3.8-2.2a15.8 15.8 0 0 0 6.6-18.1l-6.6-19.9a73 73 0 0 0 3.6-8.7l20.2-6.5a15.8 15.8 0 0 0 10.9-15.2"/></svg>`
    };

    const BACKUP_DATA = {
        portais: [
            { text: "Graduação", url: "/sigaa/portais/discente/discente.jsf", icon: "ph-student", active: true },
            { text: "Pós-Graduação", url: "/sigaa/verPortalDiscente.do", icon: "ph-graduation-cap", active: true },
            { text: "Técnico", url: "#", icon: "ph-wrench", active: true },
            { text: "Biblioteca", url: "http://www.si3.ufc.br/sigaa/biblioteca/", icon: "ph-books", active: true },
            { text: "Extensão", url: "#", icon: "ph-globe", active: true },
            { text: "Pesquisa", url: "#", icon: "ph-microscope", active: true }
        ],
        modulos: [
            { text: "SIPAC", url: "/sipac", icon: "ph-buildings", active: true },
            { text: "SIGRH", url: "/sigrh", icon: "ph-users-four", active: true },
            { text: "Admin", url: "#", icon: "ph-gear", active: true }
        ]
    };

    const PALETTES = {
        ufc: {
            name: "UFC (Original)", primary: '#3b82f6', hover: '#2563eb',
            light: { bg: '#f8fafc', card: '#ffffff', text: '#1e293b', subtext: '#64748b', border: '#e2e8f0', welcome: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' },
            dark: { bg: '#0f172a', card: '#1e293b', text: '#f1f5f9', subtext: '#94a3b8', border: '#334155', welcome: 'linear-gradient(135deg, #172554 0%, #1e293b 100%)' }
        },
        rocket: {
            name: "Rocketseat", primary: '#8257e6', hover: '#996DFF',
            light: { bg: '#f4f4fa', card: '#ffffff', text: '#202024', subtext: '#4d4d57', border: '#e1e1e6', welcome: 'linear-gradient(135deg, #8257e6 0%, #202024 100%)' },
            dark: { bg: '#121214', card: '#202024', text: '#e1e1e6', subtext: '#a8a8b3', border: '#29292e', welcome: 'linear-gradient(135deg, #4c1d95 0%, #121214 100%)' }
        },
        matrix: {
            name: "Matrix", primary: '#00e639', hover: '#00ff41',
            light: { bg: '#f0fdf4', card: '#ffffff', text: '#064e3b', subtext: '#065f46', border: '#bbf7d0', welcome: 'linear-gradient(135deg, #052e16 0%, #166534 100%)' },
            dark: { bg: '#000000', card: '#0a120a', text: '#00ff41', subtext: '#008F11', border: '#003300', welcome: 'linear-gradient(135deg, #002600 0%, #004d00 100%)' }
        },
        orange: {
            name: "Laranja", primary: '#f97316', hover: '#ea580c',
            light: { bg: '#fff7ed', card: '#ffffff', text: '#431407', subtext: '#7c2d12', border: '#fed7aa', welcome: 'linear-gradient(135deg, #9a3412 0%, #f97316 100%)' },
            dark: { bg: '#1c1917', card: '#292524', text: '#fafaf9', subtext: '#a8a29e', border: '#44403c', welcome: 'linear-gradient(135deg, #431407 0%, #292524 100%)' }
        }
    };

    let currentPalette = localStorage.getItem(CONFIG.themeKey) || 'ufc';
    let isDarkMode = localStorage.getItem(CONFIG.darkModeKey) === 'true';

    // 2. SERVIÇOS E UTILITÁRIOS
    function applyTheme() {
        try {
            const root = document.documentElement;
            const themeBase = PALETTES[currentPalette] || PALETTES.ufc;
            const mode = isDarkMode ? themeBase.dark : themeBase.light;

            root.style.setProperty('--theme-primary', themeBase.primary);
            root.style.setProperty('--theme-primary-hover', themeBase.hover);
            root.style.setProperty('--theme-primary-light', isDarkMode ? `${themeBase.primary}4D` : `${themeBase.primary}25`);
            root.style.setProperty('--bg-color', mode.bg);
            root.style.setProperty('--card-bg', mode.card);
            root.style.setProperty('--text-primary', mode.text);
            root.style.setProperty('--text-secondary', mode.subtext);
            root.style.setProperty('--border-color', mode.border);
            root.style.setProperty('--welcome-bg', mode.welcome);

            localStorage.setItem(CONFIG.themeKey, currentPalette);
            localStorage.setItem(CONFIG.darkModeKey, isDarkMode);
        } catch (e) { console.error("Theme Error", e); }
    }

    function injectExternalResources() {
        const head = document.head;
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap';
        head.appendChild(fontLink);

        const iconScript = document.createElement('script');
        iconScript.src = 'https://unpkg.com/@phosphor-icons/web';
        head.appendChild(iconScript);
    }

    function injectCSS() {
        GM_addStyle(`
            body, html { margin: 0; padding: 0; width: 100%; font-family: 'Inter', sans-serif; background-color: var(--bg-color); color: var(--text-primary); }
            body > table, #container, #cabecalho, #rodape, #barra-governo, .tabela { display: none !important; }

            .navbar { position: fixed; top: 0; left: 0; right: 0; height: 60px; z-index: 1000; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; background: var(--card-bg); border-bottom: 1px solid var(--border-color); }
            .nav-brand { font-size: 1.2rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 10px; }
            .nav-actions { display: flex; align-items: center; gap: 15px; }

            .btn-config { background: none; border: none; cursor: pointer; color: var(--text-secondary); transition: 0.2s; display: flex; align-items: center; justify-content: center; }
            .btn-config:hover { color: var(--theme-primary); transform: rotate(45deg); }
            .btn-config svg { width: 24px; height: 24px; }

            .nav-btn { background: var(--theme-primary); color: white !important; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 0.85rem; font-weight: 600; transition: opacity 0.2s; }
            .nav-btn:hover { opacity: 0.9; }

            .hero { height: 450px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; text-align: center; background: var(--welcome-bg); color: white; padding-top: 100px; position: relative; overflow: hidden; }
            .hero::before { content: ''; position: absolute; top:0; left:0; width:100%; height:100%; background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 30px 30px; opacity: 0.5; }

            .highlight-card { background: var(--card-bg); padding: 30px 60px; border-radius: 20px; margin-top: 30px; text-decoration: none; color: var(--text-primary) !important; transition: all 0.3s ease; display: flex; flex-direction: column; align-items: center; box-shadow: 0 20px 50px rgba(0,0,0,0.3); border: 4px solid rgba(255,255,255,0.1); transform: scale(1); position: relative; z-index: 10; }
            .highlight-card:hover { transform: scale(1.05) translateY(-5px); box-shadow: 0 30px 60px rgba(0,0,0,0.4); border-color: var(--theme-primary); }

            .highlight-icon { font-size: 3.5rem; color: var(--theme-primary); margin-bottom: 10px; }
            .highlight-title { font-size: 1.8rem; font-weight: 800; margin: 5px 0; color: var(--text-primary) !important; }
            .highlight-sub { font-size: 0.95rem; color: var(--text-secondary) !important; font-weight: 500; }
            .highlight-btn { background: var(--theme-primary); color: white !important; padding: 10px 30px; border-radius: 50px; font-weight: 700; margin-top: 20px; font-size: 1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: background 0.2s; }
            .highlight-card:hover .highlight-btn { background: var(--theme-primary-hover); }

            .content { max-width: 1200px; margin: 0 auto; padding: 40px 20px; margin-top: -60px; position: relative; z-index: 5; }
            .section-header { font-size: 0.9rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700; letter-spacing: 1px; margin: 40px 0 20px 0; display: flex; align-items: center; gap: 10px; }
            .section-header::after { content: ''; flex: 1; height: 1px; background: var(--border-color); }

            .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 15px; }

            .card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 10px; padding: 20px; display: flex; flex-direction: column; align-items: flex-start; gap: 10px; text-decoration: none !important; color: var(--text-primary) !important; transition: 0.2s; position: relative; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
            .card:visited { color: var(--text-primary) !important; }
            .card.active:hover { border-color: var(--theme-primary); box-shadow: 0 10px 20px -5px rgba(0,0,0,0.1); transform: translateY(-3px); }
            .card.active .icon { color: var(--theme-primary); background: var(--theme-primary-light); }

            .card.inactive { opacity: 0.6; background: var(--card-bg); cursor: not-allowed; border: 1px dashed var(--border-color); }
            .card.inactive .icon { color: var(--text-secondary); background: transparent; }
            .card.inactive::after { content: '\\ece0'; font-family: "Phosphor"; position: absolute; top: 10px; right: 10px; color: var(--text-secondary); font-size: 1.2rem; }

            .icon { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; transition: 0.2s; }
            .name { font-weight: 600; font-size: 0.9rem; line-height: 1.3; }
            .footer { text-align: center; color: var(--text-secondary); margin-top: 60px; font-size: 0.8rem; padding-bottom: 20px; }

            .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
            .switch input { opacity: 0; width: 0; height: 0; }
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px; }
            .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
            input:checked + .slider { background-color: var(--theme-primary); }
            input:checked + .slider:before { transform: translateX(20px); }
            h2 { background: transparent !important; background-color: transparent !important; border: none !important; }
        `);
    }

    function scrapeItems() {
        const groups = { portais: [], modulos: [] };
        const iconMap = {
            'graduacao': 'ph-student', 'pos_graduacao': 'ph-graduation-cap', 'tecnico': 'ph-wrench',
            'medio': 'ph-backpack', 'infantil': 'ph-baby', 'pesquisa': 'ph-microscope',
            'extensao': 'ph-globe', 'monitoria': 'ph-users-three', 'biblioteca': 'ph-books',
            'ambientes': 'ph-desktop', 'saude': 'ph-first-aid', 'diploma': 'ph-certificate',
            'bolsas': 'ph-currency-dollar', 'infra': 'ph-bricks', 'admin': 'ph-gear',
            'sipac': 'ph-buildings', 'sigrh': 'ph-users-four', 'docente': 'ph-chalkboard-teacher',
            'discente': 'ph-student', 'avalia': 'ph-star', 'relatorio': 'ph-chart-bar'
        };

        function getIcon(className, text) {
            for (let key in iconMap) { if (className.includes(key)) return iconMap[key]; }
            const t = text.toLowerCase();
            if (t.includes('biblioteca')) return 'ph-books';
            if (t.includes('rh') || t.includes('pessoal')) return 'ph-users';
            if (t.includes('docente')) return 'ph-chalkboard-teacher';
            if (t.includes('aluno') || t.includes('discente')) return 'ph-student';
            return 'ph-squares-four';
        }

        try {
            document.querySelectorAll('#portais ul li').forEach(li => {
                const link = li.querySelector('a');
                const span = li.querySelector('.texto');
                if (!span) return;
                groups.portais.push({
                    text: span.textContent.trim(),
                    url: link ? link.getAttribute('href') : '#',
                    active: !li.classList.contains('off'),
                    icon: getIcon(li.className, span.textContent.trim())
                });
            });

            document.querySelectorAll('#modulos ul li').forEach(li => {
                const link = li.querySelector('a');
                const span = li.querySelector('.texto');
                if (!span) return;
                groups.modulos.push({
                    text: span.textContent.trim(),
                    url: link ? link.getAttribute('href') : '#',
                    active: !li.classList.contains('off'),
                    icon: getIcon(li.className, span.textContent.trim())
                });
            });
        } catch(e) { console.log("Erro raspagem landing", e); }

        if (groups.portais.length === 0) groups.portais = BACKUP_DATA.portais;
        if (groups.modulos.length === 0) groups.modulos = BACKUP_DATA.modulos;

        return groups;
    }

    // 3. COMPONENTES VISUAIS
    function getLandingHTML(data) {
        const portaisFiltrados = data.portais.filter(p => !p.text.toLowerCase().includes('discente'));

        return `
            <nav class="navbar">
                <div class="nav-brand">
                    <i class="ph ph-student"></i> SIGAA Público
                </div>
                <div class="nav-actions">
                    <button class="btn-config" id="btn-config" title="Alterar Tema">${ICONS.gear}</button>
                    <a href="/sigaa/verTelaLogin.do" class="nav-btn">Fazer Login</a>
                </div>
            </nav>

            <div class="hero">
                <div style="margin-bottom:10px; text-transform:uppercase; letter-spacing:2px; font-size:0.8rem; opacity:0.8; z-index:2;">
                    Universidade Federal do Ceará
                </div>
                <h1 style="margin:0; font-size:2.5rem; font-weight:800; z-index:2;">
                    Sistema Integrado de Gestão
                </h1>

                <a href="/sigaa/verPortalDiscente.do" class="highlight-card">
                    <i class="ph ph-graduation-cap highlight-icon"></i>
                    <div class="highlight-title">Portal do Discente</div>
                    <div class="highlight-sub">Acesse notas, histórico e matrículas</div>
                    <div class="highlight-btn">Acessar Área do Aluno</div>
                </a>
            </div>

            <div class="content">
                <div class="section-header">
                    <i class="ph ph-door-open"></i> Outros Portais
                </div>
                <div class="grid">
                    ${portaisFiltrados.map(item => `
                        <a href="${item.active ? item.url : 'javascript:void(0)'}" class="card ${item.active ? 'active' : 'inactive'}" ${!item.active ? 'title="Acesso Restrito"' : ''}>
                            <div class="icon"><i class="ph ${item.icon}"></i></div>
                            <span class="name">${item.text}</span>
                        </a>
                    `).join('')}
                </div>

                <div class="section-header">
                    <i class="ph ph-squares-four"></i> Módulos do Sistema
                </div>
                <div class="grid">
                    ${data.modulos.map(item => `
                        <a href="${item.active ? item.url : 'javascript:void(0)'}" class="card ${item.active ? 'active' : 'inactive'}" ${!item.active ? 'title="Acesso Restrito"' : ''}>
                            <div class="icon"><i class="ph ${item.icon}"></i></div>
                            <span class="name">${item.text}</span>
                        </a>
                    `).join('')}
                </div>
            </div>

            <div class="footer">
                SIGAA Ultimate &copy; 2026
            </div>
        `;
    }

    function getThemeModalHTML() {
        return `
            <div id="modal-temas" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:99999; align-items:center; justify-content:center; backdrop-filter:blur(3px);">
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
                    <div style="display:flex; flex-wrap:wrap; gap:15px; justify-content:center;">
                        ${Object.entries(PALETTES).map(([key, theme]) => `
                            <button class="btn-theme" data-theme="${key}" style="background: transparent; border: 2px solid ${currentPalette === key ? 'var(--theme-primary)' : 'var(--border-color)'}; color: var(--text-primary); padding: 15px; border-radius: 12px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 10px; width: 100px; transition: all 0.2s;">
                                <div style="width: 30px; height: 30px; background: ${theme.primary}; border-radius: 50%;"></div>
                                <span style="font-size: 0.8rem; font-weight: 600; text-align: center;">${theme.name}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // 4. LÓGICA DE INTERAÇÃO
    function setupInteractions() {
        const modal = document.getElementById('modal-temas');
        const btnClose = document.getElementById('btn-fechar-temas');
        
        document.getElementById('btn-config').addEventListener('click', () => { modal.style.display = 'flex'; });
        
        const closeFunc = () => modal.style.display = 'none';
        btnClose.onclick = (e) => { e.stopPropagation(); closeFunc(); };
        modal.onclick = (e) => { if (e.target === modal) closeFunc(); };

        const btns = modal.querySelectorAll('.btn-theme');
        btns.forEach(btn => {
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

    // 5. INICIALIZAÇÃO
    function init() {
        applyTheme();
        injectExternalResources();
        injectCSS();
        
        const data = scrapeItems();

        const landingContainer = document.createElement('div');
        landingContainer.id = "sigaa-new-landing";
        landingContainer.innerHTML = getLandingHTML(data) + getThemeModalHTML();
        document.body.appendChild(landingContainer);

        setupInteractions();
    }

    init();
})();