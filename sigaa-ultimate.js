// ==UserScript==
// @name         SIGAA Ultimate - Versão Unificada
// @version      2.5
// @author       Gusttavo
// @match        *://si3.ufc.br/sigaa/*
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const url = window.location.href;

    // 1. MÓDULO DE LOGIN
//////////////////////////////////////////////////////////////////////////////////
    const carregarLogin = () => {
        
        (function() {
    'use strict';

    localStorage.removeItem('sigaa_plus_cache');

    // --- 1. CONFIGURAÇÃO DE TEMAS ---
    const PALETTES = {
        ufc: { 
            name: "UFC Clássico", 
            primary: '#0e2c4e', 
            hover: '#1a416e', 
            bg_overlay: 'rgba(14, 44, 78, 0.9)', 
            text_color: '#0e2c4e'
        },
        rocket: { 
            name: "Rocketseat", 
            primary: '#8257e6', 
            hover: '#996DFF', 
            bg_overlay: 'rgba(130, 87, 230, 0.9)', 
            text_color: '#8257e6'
        },
        matrix: { 
            name: "Matrix", 
            primary: '#059669', 
            hover: '#10b981', 
            bg_overlay: 'rgba(6, 78, 59, 0.9)', 
            text_color: '#064e3b'
        },
        orange: { 
            name: "Sunset", 
            primary: '#ea580c', 
            hover: '#f97316', 
            bg_overlay: 'rgba(154, 52, 18, 0.9)', 
            text_color: '#c2410c'
        }
    };

    let currentPalette = localStorage.getItem('sigaa_palette') || 'ufc';
    
    function applyTheme() {
        const theme = PALETTES[currentPalette] || PALETTES.ufc;
        const root = document.documentElement;
        root.style.setProperty('--theme-primary', theme.primary);
        root.style.setProperty('--theme-hover', theme.hover);
        root.style.setProperty('--theme-overlay', theme.bg_overlay);
        root.style.setProperty('--theme-text', theme.text_color);
    }
    applyTheme();

    // --- 2. RECURSOS EXTERNOS ---
    const head = document.head;
    const fontLink = document.createElement('link'); 
    fontLink.rel = 'stylesheet'; 
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'; 
    head.appendChild(fontLink); 
    
    const iconScript = document.createElement('script'); 
    iconScript.src = 'https://unpkg.com/@phosphor-icons/web'; 
    head.appendChild(iconScript);
    
    // --- 3. CSS (BASEADO NA V1.0) ---
    const css = `
        body, html { margin: 0; padding: 0; height: 100%; font-family: 'Inter', sans-serif; overflow: hidden; }
        
        /* Esconder original */
        body > table, #container, #conteudo, .tabela, center, #logar-no-sistema { display: none !important; }

        body {
            background: linear-gradient(var(--theme-overlay), var(--theme-overlay)), 
                        url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop');
            background-size: cover; background-position: center;
            display: flex; align-items: center; justify-content: center;
        }

        .login-card {
            width: 100%; max-width: 1000px; background: white; border-radius: 16px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); overflow: hidden;
            display: flex; flex-direction: column; opacity: 0; transform: translateY(20px);
            animation: fadeIn 0.6s ease-out forwards; margin: 20px; min-height: 600px;
            position: relative;
        }

        @media (min-width: 768px) { .login-card { flex-direction: row; } }

        /* Coluna Esquerda */
        .col-left {
            width: 100%; padding: 48px; display: flex; flex-direction: column;
            justify-content: center; background: white; z-index: 10; position: relative;
        }
        @media (min-width: 768px) { .col-left { width: 50%; } }

        .logo-area { margin-bottom: 32px; }
        .logo-flex { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .logo-text { font-size: 1.8rem; font-weight: 800; color: var(--theme-text); letter-spacing: -0.025em; line-height: 1; }
        
        /* FIX DE FUNDO ESTRANHO NO TÍTULO */
        h2.welcome-title { 
            font-size: 1.25rem !important; 
            font-weight: 600 !important; 
            color: #374151 !important; 
            background: transparent !important; 
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
            margin: 0 0 4px 0 !important;
            padding: 0 !important;
            text-align: left !important;
            text-transform: none !important;
        }

        .welcome-sub { font-size: 0.875rem; color: #6b7280; margin-top: 4px; }

        .input-group { margin-bottom: 20px; }
        .input-label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 6px; }
        .input-wrapper { position: relative; }
        
        .input-icon {
            position: absolute; top: 0; bottom: 0; left: 0; padding-left: 12px;
            display: flex; align-items: center; color: #9ca3af; pointer-events: none;
        }
        
        .form-input {
            width: 100%; padding: 12px 16px 12px 40px; border: 1px solid #d1d5db; border-radius: 8px;
            font-size: 1rem; outline: none; transition: all 0.2s; background-color: #f9fafb; box-sizing: border-box;
        }
        .form-input:focus {
            border-color: var(--theme-primary); background-color: white;
            box-shadow: 0 0 0 3px rgba(14, 44, 78, 0.1);
        }

        .eye-btn {
            position: absolute; top: 0; bottom: 0; right: 0; padding-right: 12px;
            display: flex; align-items: center; color: #9ca3af; background: none; border: none; cursor: pointer;
        }
        .eye-btn:hover { color: #4b5563; }

        .forgot-link {
            display: block; text-align: right; font-size: 0.75rem; font-weight: 500;
            color: var(--theme-primary); text-decoration: none; margin-top: 4px;
        }
        .forgot-link:hover { text-decoration: underline; }

        .submit-btn {
            width: 100%; background-color: var(--theme-primary); color: white; font-weight: 700;
            padding: 12px; border-radius: 8px; border: none; cursor: pointer; transition: 0.2s;
            display: flex; justify-content: center; align-items: center; gap: 8px; font-size: 1rem;
        }
        .submit-btn:hover { background-color: var(--theme-hover); transform: translateY(-1px); }
        .submit-btn:active { transform: translateY(0); }

        .recovery-area { margin-top: 24px; padding-top: 24px; border-top: 1px solid #f3f4f6; text-align: center; }
        .recovery-title { font-size: 0.7rem; color: #9ca3af; font-weight: 700; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
        .recovery-links { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
        .badge-link {
            font-size: 0.75rem; color: #4b5563; background: #f9fafb; border: 1px solid #e5e7eb;
            padding: 6px 10px; border-radius: 6px; text-decoration: none; display: flex; align-items: center; gap: 5px; transition: 0.2s;
        }
        .badge-link:hover { border-color: var(--theme-primary); color: var(--theme-primary); background: white; }

        /* Coluna Direita */
        .col-right {
            width: 100%; background-color: #f8fafc; border-left: 1px solid #e5e7eb;
            padding: 48px; display: flex; flex-direction: column; justify-content: center;
        }
        @media (min-width: 768px) { .col-right { width: 50%; } }

        .section-title { font-size: 0.75rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }

        .card-link {
            display: flex; align-items: center; padding: 12px; background: white; border: 1px solid #e5e7eb;
            border-radius: 12px; text-decoration: none; transition: all 0.2s; margin-bottom: 12px;
        }
        .card-link:hover { border-color: var(--theme-primary); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); transform: translateX(2px); }

        .icon-box { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; margin-right: 12px; flex-shrink: 0; }

        .bg-blue { background: #eff6ff; color: #2563eb; }
        .card-link:hover .bg-blue { background: #2563eb; color: white; }
        
        .bg-green { background: #f0fdf4; color: #16a34a; }
        .card-link:hover .bg-green { background: #16a34a; color: white; }
        
        .bg-purple { background: #f3e8ff; color: #9333ea; }
        .card-link:hover .bg-purple { background: #9333ea; color: white; }

        .link-text { display: flex; flex-direction: column; }
        .link-title { font-size: 0.9rem; font-weight: 700; color: #1f2937; }
        .link-sub { font-size: 0.75rem; color: #6b7280; }
        
        .caret { margin-left: auto; color: #d1d5db; }
        .card-link:hover .caret { color: var(--theme-primary); }

        .systems-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;}
        .chip {
            font-size: 0.75rem; padding: 6px 12px; background: white; border: 1px solid #e5e7eb;
            border-radius: 6px; color: #4b5563; text-decoration: none; transition: 0.2s;
        }
        .chip:hover { border-color: var(--theme-primary); color: var(--theme-primary); }

        /* Botão Config (Discreto) */
        #btn-config {
            position: absolute; top: 15px; right: 15px;
            background: none; border: none; color: #9ca3af; cursor: pointer;
            z-index: 20; transition: 0.2s;
        }
        #btn-config:hover { color: var(--theme-text); transform: rotate(90deg); }

        /* Modal Temas */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 9999999; display: none; align-items: center; justify-content: center; }
        .modal-box { background: white; padding: 30px; border-radius: 20px; width: 100%; max-width: 400px; box-shadow: 0 25px 50px rgba(0,0,0,0.2); position: relative; }
        .close-modal { position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 1.5rem; color: #9ca3af; cursor: pointer; }
        .theme-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 20px; }
        .theme-btn { background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 12px; padding: 15px 5px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; transition: 0.2s; }
        .theme-btn:hover { border-color: var(--theme-primary); }
        .dot { width: 20px; height: 20px; border-radius: 50%; }
        .theme-name { font-size: 0.7rem; font-weight: 600; color: #374151; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    `;
    GM_addStyle(css);

    const loginScreen = document.createElement('div'); 
    loginScreen.id = "sigaa-new-login";
    
    loginScreen.innerHTML = `
    <div class="login-card">
        <button id="btn-config" title="Mudar Tema"><i class="ph ph-gear" style="font-size: 1.2rem;"></i></button>
        <div class="col-left">
            <div class="logo-area">
                <div class="logo-flex">
                    <i class="ph ph-student" style="font-size: 2.2rem; color: var(--theme-text);"></i>
                    <span class="logo-text">SIGAA</span>
                </div>
                <h2 class="welcome-title">Acesse sua conta</h2>
                <p class="welcome-sub">Bem-vindo(a) ao sistema integrado.</p>
            </div>
            
            <form id="loginFormMask">
                <div class="input-group">
                    <label class="input-label">Usuário</label>
                    <div class="input-wrapper">
                        <span class="input-icon"><i class="ph ph-user"></i></span>
                        <input id="mask_login" type="text" class="form-input" placeholder="Login ou Matrícula" autocomplete="username">
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Senha</label>
                    <div class="input-wrapper">
                        <span class="input-icon"><i class="ph ph-lock-key"></i></span>
                        <input id="mask_senha" type="password" class="form-input" placeholder="Sua senha" autocomplete="current-password">
                        <button type="button" id="togglePassBtn" class="eye-btn">
                            <i id="eyeIcon" class="ph ph-eye" style="font-size: 1.2rem;"></i>
                        </button>
                    </div>
                    <a href="https://si3.ufc.br/admin/public/recuperar_senha.jsf" class="forgot-link">Esqueceu a senha?</a>
                </div>
                
                <button type="submit" class="submit-btn" id="btn-entrar">
                    Entrar <i class="ph ph-arrow-right"></i>
                </button>
            </form>
            
            <div class="recovery-area">
                <p class="recovery-title">PROBLEMAS COM ACESSO?</p>
                <div class="recovery-links">
                    <a href="https://si3.ufc.br/admin/public/recuperar_login.jsf" class="badge-link"><i class="ph ph-user-focus"></i> Recuperar Login</a>
                    <a href="https://si3.ufc.br/admin/public/recuperar_codigo.jsf" class="badge-link"><i class="ph ph-envelope"></i> Reenviar E-mail</a>
                </div>
            </div>
        </div>
        
        <div class="col-right">
            <div>
                <h3 class="section-title">Primeiro Acesso? Cadastre-se</h3>
                
                <a href="https://si3.ufc.br/sigaa/public/cadastro/discente.jsf" class="card-link group">
                    <div class="icon-box bg-blue"><i class="ph ph-graduation-cap"></i></div>
                    <div class="link-text">
                        <span class="link-title">Sou Aluno</span>
                        <span class="link-sub">Cadastro de discentes</span>
                    </div>
                    <i class="ph ph-caret-right caret"></i>
                </a>
                
                <a href="http://www.si3.ufc.br/admin/auto_cadastro/form.jsf?origem=2" class="card-link group">
                    <div class="icon-box bg-green"><i class="ph ph-briefcase"></i></div>
                    <div class="link-text">
                        <span class="link-title">Sou Servidor</span>
                        <span class="link-sub">Cadastro técnico/docente</span>
                    </div>
                    <i class="ph ph-caret-right caret"></i>
                </a>
                
                <a href="https://si3.ufc.br/sigaa/public/cadastro/familiares.jsf" class="card-link group">
                    <div class="icon-box bg-purple"><i class="ph ph-users"></i></div>
                    <div class="link-text">
                        <span class="link-title">Familiares</span>
                        <span class="link-sub">Pais e responsáveis</span>
                    </div>
                    <i class="ph ph-caret-right caret"></i>
                </a>
            </div>
            
            <div style="margin-top: 30px;">
                <h3 class="section-title">Outros Sistemas</h3>
                <div class="systems-grid">
                    <a href="http://www.si3.ufc.br/sipac/" class="chip">SIPAC</a>
                    <a href="http://www.si3.ufc.br/sigrh/" class="chip">SIGRH</a>
                    <a href="http://www.si3.ufc.br/sigrh/public/biblioteca_universitaria.jsf" class="chip"><i class="ph ph-books"></i> Biblioteca</a>
                </div>
            </div>
        </div>
    </div>

    <div class="modal-overlay" id="modal-temas">
        <div class="modal-box">
            <button class="close-modal" id="btn-close-modal">&times;</button>
            <h2 style="margin:0 0 20px 0; color:#374151; font-size:1.5rem; font-weight:700;">Aparência</h2>
            <div class="theme-grid">
                ${Object.entries(PALETTES).map(([k, t]) => `
                    <div class="theme-btn" data-theme="${k}" style="${currentPalette === k ? 'border-color:var(--theme-primary); background:#eff6ff;' : ''}">
                        <div class="dot" style="background:${t.primary}"></div>
                        <span class="theme-name">${t.name}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>
    `;
    
    document.body.appendChild(loginScreen);

    // --- LÓGICA DE SENHA ---
    const toggleBtn = document.getElementById('togglePassBtn');
    const passInput = document.getElementById('mask_senha');
    const eyeIcon = document.getElementById('eyeIcon');
    
    toggleBtn.addEventListener('click', () => {
        const isPass = passInput.type === "password";
        passInput.type = isPass ? "text" : "password";
        eyeIcon.classList.replace(isPass ? 'ph-eye' : 'ph-eye-slash', isPass ? 'ph-eye-slash' : 'ph-eye');
    });
    
    // --- LÓGICA DE PROXY DE LOGIN ---
    const maskForm = document.getElementById('loginFormMask');
    const originalLogin = document.querySelector('input[name="user.login"]');
    const originalPass = document.querySelector('input[name="user.senha"]');
    const originalBtn = document.querySelector('input[type="submit"][value="Entrar"]');
    const maskLogin = document.getElementById('mask_login');
    
    setTimeout(() => {
        if(originalLogin && originalLogin.value && !maskLogin.value) {
            maskLogin.value = originalLogin.value;
        }
    }, 500);
    
    maskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (originalLogin && originalPass && originalBtn) {
            originalLogin.value = document.getElementById('mask_login').value;
            originalPass.value = document.getElementById('mask_senha').value;
            
            const btn = document.getElementById('btn-entrar');
            btn.innerHTML = '<i class="ph ph-spinner-gap" style="animation: spin 1s linear infinite"></i> Entrando...';
            btn.style.opacity = '0.8';
            btn.disabled = true;
            
            const style = document.createElement('style');
            style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
            document.head.appendChild(style);
            
            originalBtn.click();
        } else {
            alert("Erro crítico: Formulário original do SIGAA não encontrado.");
        }
    });

    // --- LÓGICA DE TEMAS ---
    const modal = document.getElementById('modal-temas');
    document.getElementById('btn-config').onclick = () => { modal.style.display = 'flex'; };
    document.getElementById('btn-close-modal').onclick = () => { modal.style.display = 'none'; };
    modal.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; };

    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.onclick = () => {
            currentPalette = btn.dataset.theme;
            applyTheme();
            localStorage.setItem('sigaa_palette', currentPalette);
            
            document.querySelectorAll('.theme-btn').forEach(b => {
                b.style.borderColor = '#e5e7eb';
                b.style.background = '#f9fafb';
            });
            btn.style.borderColor = 'var(--theme-primary)';
            btn.style.background = '#eff6ff';
        };
    });
})();

        console.log("SIGAA Ultimate: Carregando interface de Login");
    };
//////////////////////////////////////////////////////////////////////////////////


// 2. MÓDULO DE LANDING PAGE
//////////////////////////////////////////////////////////////////////////////////
    const carregarLanding = () => {
        
        (function() {
    'use strict';

    // =========================================================================
    // 1. CONFIGURAÇÕES E CONSTANTES
    // =========================================================================
    const CONFIG = {
        themeKey: 'sigaa_palette',
        darkModeKey: 'sigaa_dark_mode'
    };

    const ICONS = {
        gear: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="currentColor" d="M128 80a48 48 0 1 0 48 48a48 48 0 0 0-48-48m0 80a32 32 0 1 1 32-32a32 32 0 0 1-32 32m88-29.8v-4.4a15.8 15.8 0 0 0-10.9-15.2l-20.2-6.5a73 73 0 0 0-3.6-8.7l6.6-19.9a15.8 15.8 0 0 0-6.6-18.1l-3.8-2.2a15.8 15.8 0 0 0-18.1 2.2l-15.6 11.9a73.2 73.2 0 0 0-9.2-2.4V66.8a15.8 15.8 0 0 0-14.7-15.8h-4.4a15.8 15.8 0 0 0-15.8 14.7v20.2a72 72 0 0 0-9.2 2.4l-15.6-11.9a15.8 15.8 0 0 0-18.1-2.2l-3.8 2.2a15.8 15.8 0 0 0-6.6 18.1l6.6 19.9a73 73 0 0 0-3.6 8.7l-20.2 6.5A15.8 15.8 0 0 0 24 125.8v4.4a15.8 15.8 0 0 0 10.9 15.2l20.2 6.5a73 73 0 0 0 3.6 8.7l-6.6 19.9a15.8 15.8 0 0 0 6.6 18.1l3.8 2.2a15.8 15.8 0 0 0 18.1-2.2l15.6-11.9a73.2 73.2 0 0 0 9.2 2.4v20.1A15.8 15.8 0 0 0 121.8 225h4.4a15.8 15.8 0 0 0 15.8-14.7v-20.2a72 72 0 0 0 9.2-2.4l15.6 11.9a15.8 15.8 0 0 0 18.1 2.2l3.8-2.2a15.8 15.8 0 0 0 6.6-18.1l-6.6-19.9a73 73 0 0 0 3.6-8.7l20.2-6.5a15.8 15.8 0 0 0 10.9-15.2"/></svg>`
    };

    const BACKUP_DATA = {
        portais: [
            { text: "Graduação", url: "/sigaa/portais/discente/discente.jsf", icon: "ph-student" },
            { text: "Pós-Graduação", url: "/sigaa/verPortalDiscente.do", icon: "ph-graduation-cap" },
            { text: "Técnico", url: "#", icon: "ph-wrench" },
            { text: "Biblioteca", url: "http://www.si3.ufc.br/sigaa/biblioteca/", icon: "ph-books" },
            { text: "Extensão", url: "#", icon: "ph-globe" },
            { text: "Pesquisa", url: "#", icon: "ph-microscope" }
        ],
        modulos: [
            { text: "SIPAC", url: "/sipac", icon: "ph-buildings" },
            { text: "SIGRH", url: "/sigrh", icon: "ph-users-four" },
            { text: "Admin", url: "#", icon: "ph-gear" }
        ]
    };

    const PALETTES = {
        ufc: {
            name: "UFC (Original)",
            primary: '#3b82f6',
            hover: '#2563eb',
            light: { bg: '#f8fafc', card: '#ffffff', text: '#1e293b', subtext: '#64748b', border: '#e2e8f0', welcome: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' },
            dark: { bg: '#0f172a', card: '#1e293b', text: '#f1f5f9', subtext: '#94a3b8', border: '#334155', welcome: 'linear-gradient(135deg, #172554 0%, #1e293b 100%)' }
        },
        rocket: {
            name: "Rocketseat",
            primary: '#8257e6',
            hover: '#996DFF',
            light: { bg: '#f4f4fa', card: '#ffffff', text: '#202024', subtext: '#4d4d57', border: '#e1e1e6', welcome: 'linear-gradient(135deg, #8257e6 0%, #202024 100%)' },
            dark: { bg: '#121214', card: '#202024', text: '#e1e1e6', subtext: '#a8a8b3', border: '#29292e', welcome: 'linear-gradient(135deg, #4c1d95 0%, #121214 100%)' }
        },
        matrix: {
            name: "Matrix",
            primary: '#00e639',
            hover: '#00ff41',
            light: { bg: '#f0fdf4', card: '#ffffff', text: '#064e3b', subtext: '#065f46', border: '#bbf7d0', welcome: 'linear-gradient(135deg, #052e16 0%, #166534 100%)' },
            dark: { bg: '#000000', card: '#0a120a', text: '#00ff41', subtext: '#008F11', border: '#003300', welcome: 'linear-gradient(135deg, #002600 0%, #004d00 100%)' }
        },
        orange: {
            name: "Laranja",
            primary: '#f97316',
            hover: '#ea580c',
            light: { bg: '#fff7ed', card: '#ffffff', text: '#431407', subtext: '#7c2d12', border: '#fed7aa', welcome: 'linear-gradient(135deg, #9a3412 0%, #f97316 100%)' },
            dark: { bg: '#1c1917', card: '#292524', text: '#fafaf9', subtext: '#a8a29e', border: '#44403c', welcome: 'linear-gradient(135deg, #431407 0%, #292524 100%)' }
        }
    };

    // --- 2. GERENCIADOR DE TEMAS ---
    let currentPalette = localStorage.getItem(CONFIG.themeKey) || 'ufc';
    let isDarkMode = localStorage.getItem(CONFIG.darkModeKey) === 'true';

    function applyTheme() {
        try {
            const root = document.documentElement;
            const themeBase = PALETTES[currentPalette] || PALETTES.ufc;
            const mode = isDarkMode ? themeBase.dark : themeBase.light;

            root.style.setProperty('--theme-primary', themeBase.primary);
            root.style.setProperty('--theme-primary-hover', themeBase.hover);
            // Cor de fundo do icone: mais forte no escuro para contraste
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
    applyTheme();

    // --- 3. INJEÇÃO DE DEPENDENCIAS ---
    const head = document.head;
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap';
    head.appendChild(fontLink);

    const iconScript = document.createElement('script');
    iconScript.src = 'https://unpkg.com/@phosphor-icons/web';
    head.appendChild(iconScript);

    // --- 4. RASPAGEM DE DADOS ---
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

        if (groups.portais.length === 0) groups.portais = BACKUP_DATA.portais.map(p => ({...p, active: true}));
        if (groups.modulos.length === 0) groups.modulos = BACKUP_DATA.modulos.map(m => ({...m, active: true}));

        return groups;
    }

    const data = scrapeItems();

    // --- 5. ESTILOS CSS ---
    const css = `
        body, html { margin: 0; padding: 0; width: 100%; font-family: 'Inter', sans-serif; background-color: var(--bg-color); color: var(--text-primary); }
        body > table, #container, #cabecalho, #rodape, #barra-governo, .tabela { display: none !important; }

        .navbar {
            position: fixed; top: 0; left: 0; right: 0; height: 60px; z-index: 1000;
            display: flex; align-items: center; justify-content: space-between; padding: 0 40px;
            background: var(--card-bg); border-bottom: 1px solid var(--border-color);
        }

        .nav-brand { font-size: 1.2rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 10px; }
        .nav-actions { display: flex; align-items: center; gap: 15px; }

        .btn-config { background: none; border: none; cursor: pointer; color: var(--text-secondary); transition: 0.2s; display: flex; align-items: center; justify-content: center; }
        .btn-config:hover { color: var(--theme-primary); transform: rotate(45deg); }
        .btn-config svg { width: 24px; height: 24px; }

        .nav-btn {
            background: var(--theme-primary); color: white !important; padding: 8px 16px; border-radius: 6px;
            text-decoration: none; font-size: 0.85rem; font-weight: 600; transition: opacity 0.2s;
        }
        .nav-btn:hover { opacity: 0.9; }

        .hero {
            height: 450px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
            text-align: center; background: var(--welcome-bg); color: white; padding-top: 100px;
            position: relative; overflow: hidden;
        }
        .hero::before {
            content: ''; position: absolute; top:0; left:0; width:100%; height:100%;
            background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 30px 30px; opacity: 0.5;
        }

        .highlight-card {
            background: var(--card-bg); padding: 30px 60px; border-radius: 20px; margin-top: 30px;
            text-decoration: none; color: var(--text-primary) !important; transition: all 0.3s ease;
            display: flex; flex-direction: column; align-items: center;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3); border: 4px solid rgba(255,255,255,0.1);
            transform: scale(1); position: relative; z-index: 10;
        }
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

        /* ESTILO DOS CARDS DO GRID */
        .card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 10px; padding: 20px;
            display: flex; flex-direction: column; align-items: flex-start; gap: 10px;
            text-decoration: none !important; /* Remove sublinhado padrao */
            color: var(--text-primary) !important; /* FORÇA COR DO TEMA (CRITICO PARA DARK MODE) */
            transition: 0.2s; position: relative; overflow: hidden;
            box-shadow: 0 2px 5px rgba(0,0,0,0.02);
        }

        .card:visited { color: var(--text-primary) !important; }

        .card.active:hover {
            border-color: var(--theme-primary);
            box-shadow: 0 10px 20px -5px rgba(0,0,0,0.1);
            transform: translateY(-3px);
        }

        .card.active .icon {
            color: var(--theme-primary);
            background: var(--theme-primary-light);
        }

        /* CARD INATIVO: VISIVEL MAS APAGADO */
        .card.inactive {
            opacity: 0.6;
            background: var(--card-bg); /* Fundo igual ao ativo */
            cursor: not-allowed;
            border: 1px dashed var(--border-color); /* Borda explicita */
        }
        .card.inactive .icon { color: var(--text-secondary); background: transparent; }
        .card.inactive::after { content: '\\ece0'; font-family: "Phosphor"; position: absolute; top: 10px; right: 10px; color: var(--text-secondary); font-size: 1.2rem; }

        .icon { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; transition: 0.2s; }
        .name { font-weight: 600; font-size: 0.9rem; line-height: 1.3; }
        .footer { text-align: center; color: var(--text-secondary); margin-top: 60px; font-size: 0.8rem; padding-bottom: 20px; }

        /* MODAL */
        .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: var(--theme-primary); }
        input:checked + .slider:before { transform: translateX(20px); }
        h2 { background: transparent !important; background-color: transparent !important; border: none !important; }
    `;
    GM_addStyle(css);

    // --- 6. FUNCAO CRIAR MODAL ---
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

        const btnClose = modal.querySelector('#btn-fechar-temas');
        const closeFunc = () => modal.style.display = 'none';
        btnClose.onclick = (e) => { e.stopPropagation(); closeFunc(); };
        modal.onclick = (e) => { if (e.target === modal) closeFunc(); };

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

    // --- 7. RENDERIZACAO DA PAGINA ---
    const portaisFiltrados = data.portais.filter(p => !p.text.toLowerCase().includes('discente'));

    const page = document.createElement('div');
    page.innerHTML = `
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
                    <a href="${item.active ? item.url : 'javascript:void(0)'}"
                       class="card ${item.active ? 'active' : 'inactive'}"
                       ${!item.active ? 'title="Acesso Restrito"' : ''}>
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
                    <a href="${item.active ? item.url : 'javascript:void(0)'}"
                       class="card ${item.active ? 'active' : 'inactive'}"
                       ${!item.active ? 'title="Acesso Restrito"' : ''}>
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

    document.body.appendChild(page);

    // Binds
    document.getElementById('btn-config').addEventListener('click', () => {
        criarModalTemas();
        document.getElementById('modal-temas').style.display = 'flex';
    });

})();

        console.log("SIGAA Ultimate: Carregando Landing Page");
    };
//////////////////////////////////////////////////////////////////////////////////


// 3. MÓDULO DO PORTAL (DASHBOARD)
//////////////////////////////////////////////////////////////////////////////////
    const carregarPortal = () => {
        
        (function() {
    'use strict';

    // 1. SEGURANÇA E CONTEXTO
    if (window.location.href.includes("verTelaLogin") || window.location.href.includes("paginaInicial") || document.querySelector("#loginFormMask")) return;
    if (window.self !== window.top) return;

    const isDashboard = document.querySelector("#agenda-docente") !== null;
    
    // Detecção expandida para incluir páginas do AVA (Turma Virtual) como internas
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
    
    if (!isDashboard && !isInternalPage) return;

    // 2. PALETAS (Estilo Premium)
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
            dark: { bg: '#1c1917', card: '#292524', sidebar: '#0c0a09', text: '#fafaf9', subtext: '#a8a29e', border: '#44403c', welcome: 'linear-gradient(135deg, #431407 0%, #292524 100%)' }
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

    // --- LÓGICA DO DASHBOARD ---
    if (isDashboard) {
        
        GM_addStyle(`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            
            /* RESET */
            body { font-family: 'Inter', sans-serif !important; background-color: var(--bg-color) !important; color: var(--text-primary) !important; margin: 0; overflow: hidden; }
            #container, #cabecalho, #rodape, #barra-governo, body > table { display: none !important; }

            /* SIDEBAR */
            .sidebar { 
                position: fixed; top: 0; left: 0; bottom: 0; width: 280px; 
                background: var(--sidebar-bg); background-image: var(--sidebar-bg-image); background-color: var(--sidebar-bg-color);
                border-right: 1px solid var(--border-color); z-index: 100; 
                display: flex; flex-direction: column; box-shadow: 4px 0 25px rgba(0,0,0,0.15); 
                overflow-y: auto; color: #f8fafc; text-align: left; 
            }
            .sidebar-header { min-height: 80px; display: flex; align-items: center; padding: 0 24px; border-bottom: 1px solid rgba(255,255,255,0.05); }
            .logo-text { font-size: 1.2rem; font-weight: 800; margin-left: 10px; color: #f8fafc; letter-spacing: -0.5px; }
            .logo-text span { color: var(--theme-primary); font-weight: 400; }
            
            .profile-section { padding: 30px 20px 20px; display: flex; flex-direction: column; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); position: relative; }
            .avatar-ring { padding: 4px; border: 3px solid var(--sidebar-border); border-radius: 50%; margin-bottom: 12px; transition: 0.3s; cursor: pointer; display: inline-block; }
            .avatar-ring:hover { border-color: var(--theme-primary); box-shadow: 0 0 20px var(--theme-primary-light); }
            .avatar-container { width: 85px; height: 85px; border-radius: 50%; overflow: hidden; background: #1e293b; }
            .avatar-container img { width: 100%; height: 100%; object-fit: cover; }
            .user-name { font-weight: 700; font-size: 1.1rem; color: #f1f5f9; margin-bottom: 20px; text-align: center; width: 100%; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }
            
            .nav-menu { flex: 1; padding: 15px 0; }
            .menu-item { display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #cbd5e1; font-size: 0.95rem; text-decoration: none; transition: 0.2s; cursor: pointer; font-weight: 500; border-left: 4px solid transparent; }
            .menu-item:hover { background: rgba(255,255,255,0.05); color: white; padding-left: 28px; }
            .menu-item.active { background: linear-gradient(90deg, var(--theme-primary-light) 0%, transparent 100%); border-left-color: var(--theme-primary); color: var(--theme-primary); font-weight: 600; }
            
            .btn-biblioteca { background: var(--theme-primary-light); border: 1px solid var(--theme-primary-light); margin: 10px 15px; border-radius: 10px; color: #f8fafc !important; }
            .btn-biblioteca:hover { background: rgba(255,255,255,0.1); border-color: var(--theme-primary); transform: translateY(-1px); }
            .btn-biblioteca svg { color: var(--theme-primary) !important; }
            
            #btn-config { color: #cbd5e1 !important; padding: 15px 24px; cursor: pointer; display: flex; align-items: center; gap: 12px; font-weight: 500; font-size: 0.9rem; transition: 0.2s; }
            #btn-config:hover { color: var(--theme-primary) !important; }
            #btn-sair { color: #f87171 !important; margin-top: auto; border-top: 1px solid rgba(255,255,255,0.05); padding: 20px 24px; }

            /* MAIN CONTENT */
            .main-content { margin-left: 280px; height: 100vh; overflow-y: auto; display: flex; flex-direction: column; }
            .topbar { height: 80px; background: var(--card-bg); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; padding: 0 40px; position: sticky; top: 0; z-index: 50; }
            
            .welcome-card { 
                background: var(--welcome-bg);
                color: white; border-radius: 20px; padding: 35px; margin-bottom: 40px; 
                display: flex; justify-content: space-between; align-items: center; 
                box-shadow: 0 10px 30px -10px rgba(0,0,0,0.2); position: relative; overflow: hidden; 
            }
            .welcome-card::after { content: ''; position: absolute; right: -20px; top: -50px; width: 300px; height: 300px; background: rgba(255,255,255,0.1); border-radius: 50%; pointer-events: none; }
            .welcome-text h1 { margin: 0 0 10px; font-size: 2rem; font-weight: 800; letter-spacing: -1px; }
            .welcome-text p { margin: 0; font-size: 1rem; opacity: 0.9; font-weight: 500; display: flex; align-items: center; gap: 8px; }
            .date-badge { background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 12px; font-weight: 700; font-size: 0.9rem; backdrop-filter: blur(10px); display: flex; align-items: center; gap: 8px; }

            .btn-grade { background:var(--card-bg); color:var(--theme-primary); border:1px solid var(--theme-primary); padding:6px 12px; border-radius:8px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:6px; transition:0.2s; font-size:0.85rem; }
            .btn-grade:hover { background:var(--theme-primary-light); }
            
            .horario-badge { display: flex; align-items: center; gap: 6px; background: var(--bg-color); color: var(--text-secondary); padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; margin-bottom: 5px; border: 1px solid var(--border-color); width: fit-content; }
            .horario-badge svg { color: var(--theme-primary); }

            /* Mini ID */
            .mini-id { width: 100%; box-sizing: border-box; background: rgba(0,0,0,0.2); border-radius: 12px; padding: 15px; border: 1px solid rgba(255,255,255,0.05); text-align: left; }
            .mini-row { display: flex; flex-direction: column; margin-bottom: 8px; text-align: left; }
            .mini-label { color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 0.6rem; letter-spacing: 0.5px; margin-bottom: 2px; }
            .mini-val { color: #e2e8f0; font-weight: 500; font-size: 0.8rem; line-height: 1.3; word-break: break-word; }
            .val-curso { font-size: 0.7rem !important; color: var(--theme-primary); font-weight: 600; white-space: normal; }
            .status-badge { color: #34d399; font-weight: 800; font-size: 0.75rem; }

            /* Dropdown User */
            .user-dropdown { position: absolute; top: 130px; left: 20px; right: 20px; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(10px); border: 1px solid var(--sidebar-border); border-radius: 12px; overflow: hidden; max-height: 0; opacity: 0; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 100; box-shadow: 0 10px 25px rgba(0,0,0,0.5); transform: translateY(-10px); pointer-events: none; }
            .user-dropdown.open { max-height: 200px; opacity: 1; transform: translateY(0); pointer-events: all; }
            .sub-item { display: flex; align-items: center; gap: 10px; padding: 10px 15px; color: #94a3b8; font-size: 0.8rem; text-decoration: none; transition: 0.2s; font-family: 'Inter', sans-serif !important; }
            .sub-item:hover { background: rgba(255,255,255,0.05); color: var(--theme-primary); }

            /* Fixes do menu original flutuante */
            #menu-dropdown { 
                background-image: var(--sidebar-bg-image) !important; 
                background-color: var(--sidebar-bg-color) !important; 
                border: 1px solid var(--sidebar-border) !important;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important; /* Sombra para destacar do fundo */
            }
            
            /* Reset geral: deixa texto e células transparentes para herdar do pai */
            #menu-dropdown * { 
                background: transparent !important; 
                color: #cbd5e1 !important; 
                border-color: var(--sidebar-border) !important; 
            }

            /* CORREÇÃO CRÍTICA: Reaplica o fundo especificamente nos containers dos submenus */
            #menu-dropdown table, 
            #menu-dropdown .ThemeOfficeMenu,
            #menu-dropdown div[id^="cmSubMenuID"] {
                background-image: var(--sidebar-bg-image) !important; 
                background-color: var(--sidebar-bg-color) !important; 
            }

            /* Estilo do Hover (Item selecionado) */
            #menu-dropdown .ThemeOfficeMenuItemHover, 
            #menu-dropdown .ThemeOfficeMenuItemHover * { 
                background-color: var(--theme-primary) !important; 
                color: white !important; 
            }

            /* Fix para Titulo H2 Feio */
            h2 { background: transparent !important; border: none !important; box-shadow: none !important; }
            
            /* Modal Switch */
            .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
            .switch input { opacity: 0; width: 0; height: 0; }
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px; }
            .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
            input:checked + .slider { background-color: var(--theme-primary); }
            input:checked + .slider:before { transform: translateX(20px); }
            
            /* FIX PDF COLORIDO / IMPRESSÃO */
            @media print {
                * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                body > :not(#modal-grade) { display: none !important; } 
                #modal-grade { display: flex !important; position: absolute !important; top: 0 !important; left: 0 !important; background: white !important; height: 100% !important; width: 100% !important; z-index: 999999 !important; box-shadow: none !important; backdrop-filter: none !important; } 
                #modal-grade > div { width: 100% !important; max-width: 100% !important; height: auto !important; box-shadow: none !important; border: none !important; border-radius: 0 !important; } 
                #modal-grade > div > div:last-child { overflow: visible !important; height: auto !important; } 
                #btn-fechar-modal, #btn-imprimir-grade { display: none !important; }
            }
        `);

        // RASPAGEM DE DADOS
        try {
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
            
            aluno.nome = elNome ? capitalizeName(elNome.innerText.trim()) : (aluno.nome || "Discente");
            aluno.avatar = elFoto ? elFoto.src : aluno.avatar;
            aluno.semestre = elSemestre ? elSemestre.innerText.trim() : aluno.semestre;
            aluno.dados = carteirinha;
            localStorage.setItem('sigaa_plus_cache', JSON.stringify(aluno));
            // Oculta site original apenas se sucesso
            const oldElements = document.querySelectorAll("#container, #cabecalho, #rodape, #barra-governo, body > table");
            oldElements.forEach(el => el.style.display = 'none');
        } catch(e) {}

        const dashHTML=`
        <aside class="sidebar">
            <div class="sidebar-header">${icons.student} <div class="logo-text">SIGAA <span>Ultimate</span></div></div>
            <div class="profile-section">
                <div class="avatar-ring" id="userAreaBtn"><div class="avatar-container"><img src="${aluno.avatar || ''}" onerror="this.src='/sigaa/img/usuarios/sem_foto.png'"></div></div>
                <div class="user-name" onclick="document.getElementById('userAreaBtn').click()">${getShortName(aluno.nome)} ${icons.chevronDown}</div>
                <div class="user-dropdown" id="userDropdown">
                    <a href="#" id="btn-meus-dados" class="sub-item">${icons.user} Meus Dados</a>
                    <a href="#" id="btn-editar-perfil" class="sub-item">${icons.edit} Editar Perfil</a>
                </div>
                <div class="mini-id">
                    <div class="mini-row"><span class="mini-label">Matrícula</span><span class="mini-val">${carteirinha.matricula}</span></div>
                    <div class="mini-row"><span class="mini-label">Curso</span><span class="mini-val val-curso">${carteirinha.curso}</span></div>
                    <div class="mini-row"><span class="mini-label">Status</span><span class="status-badge">${carteirinha.status}</span></div>
                </div>
            </div>
            <nav class="nav-menu">
                <div class="menu-item active">${icons.class} Minhas Turmas</div>
                <a href="https://minhabiblioteca.com.br" target="_blank" class="menu-item btn-biblioteca">${icons.books} Biblioteca Digital</a>
                <a href="/sigaa/verPortalDiscente.do" class="menu-item">↻ Recarregar Painel</a>
            </nav>
            <div id="btn-config">${icons.gear} Aparência</div>
            <a href="/sigaa/logar.do?dispatch=logOff" class="menu-item" id="btn-sair">${icons.logout} Sair</a>
        </aside>
        
        <div class="main-content">
            <header class="topbar">
                <button class="menu-toggle" id="dashMenuBtn">${icons.menu}</button>
                <div style="text-align:right;">
                    <div style="font-weight:700; color:var(--text-primary); font-size: 1.1rem;">Semestre ${aluno.semestre}</div>
                </div>
            </header>
            <div style="padding: 40px;">
                <div style="max-width: 1100px; margin: 0 auto;">
                    <div class="welcome-card">
                        <div class="welcome-text">
                            <h1>Olá, ${getShortName(aluno.nome)}! 👋</h1>
                            <p>Bem-vindo ao seu Portal do Discente.</p>
                        </div>
                        <div class="date-badge">${icons.clock} ${capitalizedDate}</div>
                    </div>
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:30px;">
                        <h2 style="font-size:1.5rem; font-weight:700; color:var(--text-primary); margin:0; display:flex; align-items:center; gap:12px; background:transparent !important; border:none !important;">${icons.class} Turmas do Semestre</h2>
                        <button class="btn-grade" id="btn-ver-grade">${icons.table} Ver Grade</button>
                    </div>
                    <div id="dash-cards" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:25px;"></div>
                </div>
            </div>
        </div>`;
        
        const div = document.createElement('div'); div.innerHTML = dashHTML; document.body.appendChild(div);

        // --- GERAÇÃO DE CARDS ---
        const cardArea = document.getElementById('dash-cards');
        const colors = ['#3b82f6','#8b5cf6','#10b981','#f59e0b', '#ef4444'];
        
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

        try {
            const trs = document.querySelectorAll("#turmas-portal tbody tr");
            let hasTurma = false;
            trs.forEach((tr, i) => {
                if (tr.classList.contains("detalhes") || tr.style.display === "none") return;
                const cols = tr.querySelectorAll("td");
                if (cols.length < 4) return;
                const link = cols[0].querySelector("a");
                if (link) {
                    hasTurma = true;
                    const uid = "dash-" + i; link.id = uid;
                    const nome = link.innerText.trim();
                    const local = cols[2].innerText.replace("Acessar:", "").trim();
                    const horarioStr = cols[3].innerText;
                    const horarioHTML = formatHorarios(horarioStr);
                    const bg = colors[i % colors.length];
                    let nomeMateria = nome.includes(' - ') ? nome.split(' - ').slice(1).join(' - ').trim() : nome;
                    
                    parseToGrid(horarioStr, nomeMateria, bg);

                    const card = document.createElement('div');
                    card.style.cssText = `background:var(--card-bg); border-radius:16px; padding:25px; border:1px solid var(--border-color); cursor:pointer; position:relative; overflow:hidden; box-shadow:0 10px 15px -3px rgba(0,0,0,0.03); transition:0.3s;`;
                    card.innerHTML = `<div style="position:absolute; top:0; left:0; right:0; height:4px; background:${bg}"></div><h3 style="margin:5px 0 15px 0; color:var(--text-primary); font-weight:700; font-size:1rem; line-height:1.4; min-height:2.8em; background:transparent !important; border:none !important;">${nome}</h3><div style="color:var(--text-secondary); font-size:0.85rem; display:flex; gap:8px; align-items:center; margin-bottom:15px;">${icons.map} ${local}</div><div style="display:flex; flex-wrap:wrap; gap:5px;">${horarioHTML}</div>`;
                    card.onclick = () => document.getElementById(uid).click();
                    card.onmouseover = () => { card.style.transform = 'translateY(-5px)'; card.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)'; };
                    card.onmouseout = () => { card.style.transform = 'translateY(0)'; card.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.03)'; };
                    cardArea.appendChild(card);
                }
            });
            if (!hasTurma) cardArea.innerHTML = "<p>Nenhuma turma encontrada.</p>";
        } catch(e) {}

        const userBtn = document.getElementById('userAreaBtn');
        const userDrop = document.getElementById('userDropdown');
        if(userBtn) { userBtn.addEventListener('click', () => { userDrop.classList.toggle('open'); }); }
        document.getElementById('btn-meus-dados')?.addEventListener('click', (e) => { e.preventDefault(); const l = document.querySelectorAll('a'); for (const a of l) { if (a.innerText.includes("Meus Dados Pessoais")) { a.click(); return; } } alert("Opção indisponível."); });
        document.getElementById('btn-editar-perfil')?.addEventListener('click', (e) => { e.preventDefault(); const l = document.querySelector('a.perfil'); if (l) l.click(); else alert("Opção indisponível."); });
        document.getElementById('btn-config').addEventListener('click', () => { criarModalTemas(); document.getElementById('modal-temas').style.display = 'flex'; });
        document.getElementById('btn-ver-grade').addEventListener('click', () => { criarModalGrade(); document.getElementById('modal-grade').style.display = 'flex'; });
        
        // FIX DO MENU FLUTUANTE
        const initMenu = setInterval(() => { 
            let menu = document.getElementById('menu-dropdown'); 
            if (!menu) menu = document.querySelector('[id*="menu_form_menu_discente"] > div'); 
            if (menu) { 
                clearInterval(initMenu); 
                menu.id = 'menu-dropdown'; // Força o ID para pegar o CSS
                document.body.appendChild(menu); 
                menu.style.display = 'none'; 
                menu.style.zIndex = '999999'; 
                menu.style.position = 'fixed'; 
            } 
        }, 500);

        const menuBtn = document.getElementById('dashMenuBtn');
        if (menuBtn) { menuBtn.addEventListener('click', (e) => { e.stopPropagation(); let menu = document.getElementById('menu-dropdown') || document.querySelector('[id*="menu_form_menu_discente"] > div'); if (!menu) return; const isVisible = menu.style.display === 'block'; menu.style.display = isVisible ? 'none' : 'block'; if (!isVisible) { const rect = menuBtn.getBoundingClientRect(); menu.style.top = (rect.bottom + 10) + 'px'; menu.style.left = rect.left + 'px'; } }); document.addEventListener('click', (e) => { const menu = document.getElementById('menu-dropdown') || document.querySelector('[id*="menu_form_menu_discente"] > div'); if (menu && menu.style.display === 'block' && !menu.contains(e.target)) { menu.style.display = 'none'; } }); }

        // --- FUNÇÃO PARA GRADE HORÁRIA VISUAL ---
        function criarModalGrade() {
            const exist = document.getElementById('modal-grade'); if(exist) exist.remove();
            const modal = document.createElement('div'); modal.id = 'modal-grade';
            modal.style.cssText = `display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:99999; align-items:center; justify-content:center; backdrop-filter:blur(3px);`;
            const startHour = 7; const endHour = 22; let gridLinesHTML = '', timeLabelsHTML = '';
            for(let h = startHour; h < endHour; h++) { gridLinesHTML += `<div style="flex:1; border-bottom:1px solid var(--border-color); box-sizing:border-box; width:100%; min-height:50px;"></div>`; timeLabelsHTML += `<div style="flex:1; border-bottom:1px solid var(--border-color); box-sizing:border-box; color:var(--text-secondary); font-weight:600; font-size:0.75rem; padding:5px; text-align:right; display:flex; align-items:flex-end; justify-content:flex-end; padding-bottom:0; min-height:50px;">${h+1}:00</div>`; }
            let daysColsHTML = ["SEG","TER","QUA","QUI","SEX"].map(dia => {
                const aulasDia = turmasData.filter(t => t.dia === dia);
                let blocosHTML = aulasDia.map(aula => {
                    const startMinutes = (aula.h_inicio * 60) + aula.m_inicio;
                    const endMinutes = (aula.h_fim * 60) + aula.m_fim;
                    const topPercent = ((startMinutes - (startHour * 60)) / ((endHour - startHour) * 60)) * 100;
                    const heightPercent = ((endMinutes - startMinutes) / ((endHour - startHour) * 60)) * 100;
                    return `<div style="position:absolute; top:${topPercent}%; left:2%; width:96%; height:${heightPercent}%; background:${aula.cor}; border-radius:6px; color:white; font-size:0.7rem; padding:4px 6px; box-shadow:0 2px 5px rgba(0,0,0,0.2); overflow:hidden; z-index:10; border-left:3px solid rgba(0,0,0,0.2); display:flex; flex-direction:column; justify-content:center; box-sizing:border-box;"><div style="font-weight:700; line-height:1.2; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">${aula.nome}</div><div style="opacity:0.9; font-size:0.65rem; margin-top:2px;">${String(aula.h_inicio).padStart(2,'0')}:${String(aula.m_inicio).padStart(2,'0')} - ${String(aula.h_fim).padStart(2,'0')}:${String(aula.m_fim).padStart(2,'0')}</div></div>`;
                }).join('');
                return `<div style="position:relative; background:var(--card-bg); border-left:1px solid var(--border-color); min-width:100px; height:100%;"><div style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; flex-direction:column; z-index:0;">${gridLinesHTML}</div>${blocosHTML}</div>`;
            }).join('');
            modal.innerHTML = `
                <div style="background:var(--card-bg); width:95%; max-width:1600px; height:90vh; border-radius:16px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 20px 50px rgba(0,0,0,0.3); border: 1px solid var(--border-color);">
                    <div style="padding:15px 25px; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; background:var(--card-bg);">
                        <h2 style="margin:0; font-size:1.3rem; color:var(--text-primary); display:flex; align-items:center; gap:10px; background:transparent !important; border:none !important;">${icons.table} Grade Curricular</h2>
                        <div style="display:flex; gap:10px;">
                            <button id="btn-imprimir-grade" style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:8px; padding:8px 12px; cursor:pointer; color:var(--text-primary); display:flex; align-items:center; gap:6px; font-weight:600; font-size:0.85rem; transition:0.2s;">
                                ${icons.printer} Salvar PDF
                            </button>
                            <button id="btn-fechar-modal" style="background:none; border:none; font-size:2rem; cursor:pointer; color:var(--text-secondary);">&times;</button>
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns: 50px repeat(5, 1fr); background:var(--card-bg); border-bottom:2px solid var(--border-color);">
                        <div style="padding:10px;"></div>
                        ${["SEG","TER","QUA","QUI","SEX"].map(d => `<div style="padding:12px; text-align:center; font-weight:800; color:var(--text-primary); font-size:0.9rem;">${d}</div>`).join('')}
                    </div>
                    <div style="flex:1; overflow-y:auto; position:relative;">
                        <div style="display:grid; grid-template-columns: 50px repeat(5, 1fr); height:${(endHour - startHour) * 50}px;">
                            <div style="background:var(--bg-color); border-right:1px solid var(--border-color); display:flex; flex-direction:column;">${timeLabelsHTML}</div>
                            ${daysColsHTML}
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(modal);
            document.getElementById('btn-fechar-modal').onclick = () => modal.style.display = 'none';
            modal.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; };
            document.getElementById('btn-imprimir-grade').addEventListener('click', () => window.print());
        }

    // --- 3. RESTRUTURAÇÃO DE PÁGINAS INTERNAS (Barra Fixa + Ferramentas) ---
    } else {

        // Função ÚNICA que inicializa a barra interna e calculadoras
        // Isso evita duplicar código entre AVA e páginas genéricas
        const initInternalPage = () => {
             GM_addStyle(`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                
                #internal-navbar { 
                    position: fixed; top: 0; left: 0; right: 0; height: 50px; 
                    background-color: #0f172a; border-bottom: 1px solid #334155; 
                    color: white; z-index: 999999; display: flex; align-items: center; 
                    justify-content: space-between; padding: 0 20px; font-family: 'Inter', sans-serif !important; 
                } 
                .nav-link { 
                    background: rgba(255,255,255,0.1); color: white; text-decoration: none; 
                    padding: 6px 12px; border-radius: 6px; font-size: 0.85rem; display: flex; 
                    align-items: center; gap: 6px; cursor: pointer; border: none; font-family: 'Inter', sans-serif !important; transition: 0.2s;
                }
                .nav-link:hover { background: rgba(255,255,255,0.2); }
                body { padding-top: 50px !important; }
                #painel-usuario { display: none !important; }
                
                .calc-row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px; }
                .calc-label { font-size: 0.85rem; color: #94a3b8; }
                .calc-val { font-weight: 700; font-size: 1rem; color: #f8fafc; }
                .calc-res { font-weight: 800; font-size: 1.1rem; color: var(--theme-primary); }
            `);

            const nav = document.createElement('div'); nav.id = "internal-navbar";
            nav.innerHTML = `
                <div style="display:flex; align-items:center; gap:12px; font-weight:700;"><span>SIGAA Ultimate</span></div>
                <div style="display:flex; gap:10px;">
                    <button class="nav-link" id="btn-calc-freq">${icons.clock} Frequência</button>
                    <button class="nav-link" id="btn-calc-notas">${icons.class} Notas</button>
                    <a href="/sigaa/verPortalDiscente.do" class="nav-link">${icons.home} Home</a>
                </div>`;
            if(!document.getElementById('internal-navbar')) document.body.prepend(nav);

            document.getElementById('btn-calc-freq').addEventListener('click', checkFrequency);
            document.getElementById('btn-calc-notas').addEventListener('click', checkGrades);
        };

        // --- CALCULADORAS ---
        function checkFrequency() {
            const bodyText = document.body.innerText;
            const faultsMatch = bodyText.match(/Total de Faltas:?\s*(\d+)/i);
            
            if (!faultsMatch) { 
                alert("⚠️ Página não reconhecida ou sem dados de frequência.\n\nNavegue até a página de Frequência da disciplina."); 
                return; 
            }

            let totalFaltas = parseInt(faultsMatch[1]);
            let maxFaltas = 16; 
            const maxMatch = bodyText.match(/M.ximo de Faltas Permitido:?\s*(\d+)/i);
            if (maxMatch) { maxFaltas = parseInt(maxMatch[1]); } 
            else { 
                const headers = document.querySelectorAll('div.titulo, h4'); 
                for(let h of headers) { 
                    const match = h.innerText.match(/\(\s*(\d+)\s*h\s*\)/i); 
                    if (match) { maxFaltas = Math.floor(parseInt(match[1]) * 0.25); break; } 
                } 
            }
            const restantes = maxFaltas - totalFaltas;
            let statusText = "Seguro", statusColor = "#22c55e"; 
            if (totalFaltas >= (maxFaltas * 0.8)) { statusText = "Cuidado"; statusColor = "#f97316"; }
            if (totalFaltas > maxFaltas) { statusText = "Reprovado por Falta"; statusColor = "#ef4444"; }
            
            showModal("Monitor de Frequência", `
                <div style="display:flex; justify-content:space-around; margin-bottom:20px;">
                    <div><div style="font-size:0.8rem; color:#94a3b8; font-weight:700;">FALTAS</div><div style="font-size:2rem; font-weight:800; color:white;">${totalFaltas}</div></div>
                    <div><div style="font-size:0.8rem; color:#94a3b8; font-weight:700;">LIMITE</div><div style="font-size:2rem; font-weight:800; color:white;">${maxFaltas}</div></div>
                </div>
                <div style="background:${statusColor}20; color:${statusColor}; padding:15px; border-radius:8px; font-weight:700; margin-bottom:10px; border:1px solid ${statusColor};">
                    ${statusText}: Restam ${restantes} faltas
                </div>
            `);
        }

        function checkGrades() {
            let matricula = aluno.dados ? aluno.dados.matricula : null;
            const table = document.querySelector('table.tabelaRelatorio');
            if (!table) {
                alert("⚠️ Tabela de notas não encontrada.\n\nEntre na disciplina e clique em 'Ver Notas' ou 'Participantes'.");
                return;
            }

            let n1 = null, n2 = null, userFound = false;
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

            if (!userFound) { alert("⚠️ Sua matrícula (" + (matricula || 'N/A') + ") não foi encontrada nesta tabela."); return; }

            let htmlContent = "";
            if (n1 === null && n2 === null) {
                htmlContent = "<p>Nenhuma nota lançada ainda.</p>";
            } else if (n1 !== null && n2 === null) {
                const precisaPara7 = Math.max(0, 14 - n1).toFixed(1); 
                const precisaPara4 = Math.max(0, 8 - n1).toFixed(1);  
                htmlContent = `
                    <div class="calc-row"><span class="calc-label">Nota Unidade 1</span> <span class="calc-val">${n1}</span></div>
                    <hr style="border-color:rgba(255,255,255,0.1); margin:15px 0;">
                    <div style="margin-bottom:15px;"><div class="calc-label">Para APROVAR DIRETO (Média 7):</div><div style="color:#4ade80; font-size:1.2rem; font-weight:800;">Precisa de ${precisaPara7} na N2</div></div>
                    <div><div class="calc-label">Para ir para FINAL (Mínimo):</div><div style="color:#facc15; font-size:1.2rem; font-weight:800;">Precisa de ${precisaPara4} na N2</div><small style="color:#94a3b8;">Menor que isso reprova direto.</small></div>
                `;
            } else if (n1 !== null && n2 !== null) {
                const media = (n1 + n2) / 2;
                let situacao = "", cor = "", extraInfo = "";
                if (media >= 7) { situacao = "APROVADO POR MÉDIA"; cor = "#22c55e"; extraInfo = "Parabéns! Você já passou."; } 
                else if (media < 4) { situacao = "REPROVADO"; cor = "#ef4444"; extraInfo = "Média inferior a 4.0."; } 
                else { situacao = "AVALIAÇÃO FINAL"; cor = "#f97316"; const precisaAF = (10 - media).toFixed(1); extraInfo = `<div style="margin-top:10px; font-size:1.1rem;">Precisa tirar <span style="color:white; font-weight:800; font-size:1.4rem;">${precisaAF}</span> na Final.</div>`; }

                htmlContent = `
                    <div class="calc-row"><span class="calc-label">Nota Unidade 1</span> <span class="calc-val">${n1}</span></div>
                    <div class="calc-row"><span class="calc-label">Nota Unidade 2</span> <span class="calc-val">${n2}</span></div>
                    <div class="calc-row" style="border:none; margin-top:15px;"><span class="calc-label">MÉDIA PARCIAL</span> <span class="calc-res" style="color:${cor}">${media.toFixed(1)}</span></div>
                    <div style="background:${cor}20; border:1px solid ${cor}; color:${cor}; padding:15px; border-radius:8px; text-align:center; font-weight:700; margin-top:10px;">${situacao}${extraInfo}</div>
                `;
            }
            showModal("Calculadora de Notas", htmlContent);
        }

        function showModal(title, content) {
            const id = 'modal-generic-ultimate'; let modal = document.getElementById(id); if(modal) modal.remove();
            modal = document.createElement('div'); modal.id = id;
            modal.style.cssText = `display:flex; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9999999; align-items:center; justify-content:center; backdrop-filter:blur(3px); font-family: 'Inter', sans-serif;`;
            modal.innerHTML = `<div style="background:#1e293b; color:white; width:90%; max-width:400px; border-radius:16px; padding:30px; box-shadow:0 20px 50px rgba(0,0,0,0.4); text-align:center; border:1px solid #334155; position:relative;"><button onclick="document.getElementById('${id}').remove()" style="position:absolute; top:15px; right:15px; background:none; border:none; color:#64748b; font-size:1.5rem; cursor:pointer;">&times;</button><h2 style="margin:0 0 20px 0; color:white !important; font-size:1.3rem; font-weight:700; background:transparent !important; border:none !important;">${title}</h2>${content}</div>`;
            document.body.appendChild(modal);
            modal.onclick = (e) => { if(e.target === modal) modal.remove(); };
        }

        // =========================================================
        // AQUI ESTÁ A ESTRUTURA ORGANIZADA PARA O FUTURO:
        // =========================================================
        
        if (window.location.href.includes("/ava/")) {
            // === TURMA VIRTUAL (AVA) ===
            // Inicializa a barra padrão
            initInternalPage();
            
            // --> AQUI VAI ENTRAR O CÓDIGO ESPECÍFICO PRA TURMA VIRTUAL <--
            // Exemplo: Botão de baixar tudo, ícones melhores, etc.
            
            console.log("SIGAA Ultimate: Modo Turma Virtual Ativado");

        } else {
            // === PÁGINAS GENÉRICAS ===
            // Apenas inicializa a barra padrão
            initInternalPage();
        }
    }

    // --- FUNÇÃO COMPARTILHADA DE TEMAS ---
    function criarModalTemas() {
        const exist = document.getElementById('modal-temas'); if(exist) exist.remove();
        const modal = document.createElement('div'); modal.id = 'modal-temas';
        modal.style.cssText = `display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:99999; align-items:center; justify-content:center; backdrop-filter:blur(3px);`;
        let botoesHTML = '';
        for (const [key, theme] of Object.entries(PALETTES)) {
            botoesHTML += `<button class="btn-theme" data-theme="${key}" style="background:transparent; border:2px solid var(--border-color); color:var(--text-primary); padding:15px; border-radius:12px; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:10px; width:100px; transition:all 0.2s;"><div style="width:30px; height:30px; background:${theme.primary}; border-radius:50%;"></div><span style="font-size:0.8rem; font-weight:600;">${theme.name}</span></button>`;
        }
        modal.innerHTML = `<div style="background:var(--card-bg); border-radius:16px; padding:30px; max-width:500px; width:90%; position:relative; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2);"><button id="btn-fechar-temas" style="position:absolute; top:15px; right:15px; background:none; border:none; font-size:1.5rem; cursor:pointer; color:var(--text-secondary);">&times;</button><h2 style="margin:0 0 20px 0; color:var(--text-primary) !important; font-size:1.5rem; font-weight:700; background:transparent !important; border:none !important;">Aparência</h2><div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; background:var(--bg-color); padding:10px 15px; border-radius:8px;"><span style="font-weight:600; color:var(--text-primary);">Modo Escuro</span><label class="switch"><input type="checkbox" id="theme-switch" ${isDarkMode ? 'checked' : ''}><span class="slider round"></span></label></div><div style="display:flex; flex-wrap:wrap; gap:15px; justify-content:center;">${botoesHTML}</div></div>`;
        document.body.appendChild(modal);
        document.getElementById('btn-fechar-temas').onclick = () => modal.style.display = 'none';
        modal.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; };
        const btns = modal.querySelectorAll('.btn-theme');
        btns.forEach(btn => {
            if(btn.dataset.theme === currentPalette) btn.style.borderColor = 'var(--theme-primary)';
            btn.onclick = () => { currentPalette = btn.dataset.theme; applyTheme(); btns.forEach(b => b.style.borderColor = 'var(--border-color)'); btn.style.borderColor = 'var(--theme-primary)'; };
        });
        document.getElementById('theme-switch').addEventListener('change', (e) => { isDarkMode = e.target.checked; applyTheme(); });
    }

})();

        console.log("SIGAA Ultimate: Carregando Painel do Discente");
    };
//////////////////////////////////////////////////////////////////////////////////


// --- ROTEADOR ---
    
    if (url.includes("verTelaLogin.do")) {
        carregarLogin();
    } 
    else if (url.includes("paginaInicial.do")) {
        carregarLanding();
    } 
    else if (url.includes("portais/discente") || url.includes("verPortalDiscente.do")) {
        carregarPortal();
    }

})();