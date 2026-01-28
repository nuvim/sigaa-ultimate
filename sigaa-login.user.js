// ==UserScript==
// @name         SIGAA Ultimate 2.0 - Tela de Login
// @namespace    http://tampermonkey.net/
// @version      2.0-stable-final
// @description  correções de Login e Centralização.
// @author       Gusttavo
// @match        *://si3.ufc.br/sigaa/verTelaLogin.do*
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. SELETORES E DADOS ---
    // Links fixos para garantir que apareçam
    const LINKS = {
        sistemas: [
            { text: "SIPAC (Administrativo)", url: "/sipac/" },
            { text: "SIGRH (Recursos Humanos)", url: "/sigrh/" },
            { text: "SIGADMIN (Administração)", url: "/admin/" },
            { text: "Biblioteca Universitária", url: "/sigrh/public/biblioteca_universitaria.jsf" }
        ],
        cadastro: [
            { text: "Aluno", url: "/sigaa/public/cadastro/discente.jsf" },
            { text: "Professor", url: "/sigaa/public/cadastro/docente.jsf" },
            { text: "Servidor", url: "/admin/auto_cadastro/form.jsf?origem=2" },
            { text: "Familiares", url: "/sigaa/public/cadastro/familiares.jsf" }
        ],
        recuperar: [
            { text: "Esqueci Login", url: "/admin/public/recuperar_login.jsf" },
            { text: "Esqueci Senha", url: "/admin/public/recuperar_senha.jsf" },
            { text: "Confirmar Cadastro", url: "/admin/public/recuperar_codigo.jsf" }
        ]
    };

    const ICONS = {
        gear: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="currentColor" d="M128 80a48 48 0 1 0 48 48a48 48 0 0 0-48-48m0 80a32 32 0 1 1 32-32a32 32 0 0 1-32 32m88-29.8v-4.4a15.8 15.8 0 0 0-10.9-15.2l-20.2-6.5a73 73 0 0 0-3.6-8.7l6.6-19.9a15.8 15.8 0 0 0-6.6-18.1l-3.8-2.2a15.8 15.8 0 0 0-18.1 2.2l-15.6 11.9a73.2 73.2 0 0 0-9.2-2.4V66.8a15.8 15.8 0 0 0-14.7-15.8h-4.4a15.8 15.8 0 0 0-15.8 14.7v20.2a72 72 0 0 0-9.2 2.4l-15.6-11.9a15.8 15.8 0 0 0-18.1-2.2l-3.8 2.2a15.8 15.8 0 0 0-6.6 18.1l6.6 19.9a73 73 0 0 0-3.6 8.7l-20.2 6.5A15.8 15.8 0 0 0 24 125.8v4.4a15.8 15.8 0 0 0 10.9 15.2l20.2 6.5a73 73 0 0 0 3.6 8.7l-6.6 19.9a15.8 15.8 0 0 0 6.6 18.1l3.8 2.2a15.8 15.8 0 0 0 18.1-2.2l15.6-11.9a73.2 73.2 0 0 0 9.2 2.4v20.1A15.8 15.8 0 0 0 121.8 225h4.4a15.8 15.8 0 0 0 15.8-14.7v-20.2a72 72 0 0 0 9.2-2.4l15.6 11.9a15.8 15.8 0 0 0 18.1 2.2l3.8-2.2a15.8 15.8 0 0 0 6.6-18.1l-6.6-19.9a73 73 0 0 0 3.6-8.7l20.2-6.5a15.8 15.8 0 0 0 10.9-15.2"/></svg>`,
        user: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M230.9 206.6c-20.9-33.8-54.3-55-91.4-58.1a55.9 55.9 0 1 0-23 0c-37.1 3.1-70.5 24.3-91.4 58.1a8 8 0 1 0 13.6 8.4C55.7 187.7 85 168 128 168s72.3 19.7 89.3 47a8 8 0 1 0 13.6-8.4"/></svg>`,
        link: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path fill="currentColor" d="M122.3 157.7a8.2 8.2 0 0 1-11.4 0l-1.9-1.9a48.2 48.2 0 0 1 0-68l17.9-18a48.2 48.2 0 0 1 68.2 68.1l-18 18a8.2 8.2 0 0 1-11.3-11.4l17.9-17.9a32.2 32.2 0 0 0-45.5-45.5l-17.9 18a32.2 32.2 0 0 0 0 45.4l1.9 1.9a8.2 8.2 0 0 1 .1 11.3Zm-5.6-21.4a8.2 8.2 0 0 0 11.3 11.3l1.9-1.9a32.2 32.2 0 0 1 45.5 45.5l-17.9 18a32.2 32.2 0 0 1-45.5-45.5l-1.9-1.9a8.2 8.2 0 0 0-11.3-11.4l1.9 1.9a48.2 48.2 0 0 0 68.1 68.1l18-17.9a48.2 48.2 0 0 0-68.2-68.1Z"/></svg>`
    };

    // --- 2. TEMAS ---
    const PALETTES = {
        ufc: { name: "UFC Azul", primary: '#3b82f6', hover: '#2563eb', light: { bg: '#f8fafc', card: '#ffffff', text: '#1e293b', subtext: '#64748b', border: '#e2e8f0', welcome: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }, dark: { bg: '#0f172a', card: '#1e293b', text: '#f1f5f9', subtext: '#94a3b8', border: '#334155', welcome: 'linear-gradient(135deg, #172554 0%, #1e293b 100%)' } },
        rocket: { name: "Rocket Roxo", primary: '#8257e6', hover: '#996DFF', light: { bg: '#f4f4fa', card: '#ffffff', text: '#202024', subtext: '#4d4d57', border: '#e1e1e6', welcome: 'linear-gradient(135deg, #8257e6 0%, #202024 100%)' }, dark: { bg: '#121214', card: '#202024', text: '#e1e1e6', subtext: '#a8a8b3', border: '#29292e', welcome: 'linear-gradient(135deg, #4c1d95 0%, #121214 100%)' } },
        matrix: { name: "Matrix Verde", primary: '#00e639', hover: '#00ff41', light: { bg: '#f0fdf4', card: '#ffffff', text: '#064e3b', subtext: '#065f46', border: '#bbf7d0', welcome: 'linear-gradient(135deg, #052e16 0%, #166534 100%)' }, dark: { bg: '#000000', card: '#0a120a', text: '#00ff41', subtext: '#008F11', border: '#003300', welcome: 'linear-gradient(135deg, #002600 0%, #004d00 100%)' } },
        orange: { name: "Laranja", primary: '#f97316', hover: '#ea580c', light: { bg: '#fff7ed', card: '#ffffff', text: '#431407', subtext: '#7c2d12', border: '#fed7aa', welcome: 'linear-gradient(135deg, #9a3412 0%, #f97316 100%)' }, dark: { bg: '#1c1917', card: '#292524', text: '#fafaf9', subtext: '#a8a29e', border: '#44403c', welcome: 'linear-gradient(135deg, #431407 0%, #292524 100%)' } }
    };

    let currentPalette = localStorage.getItem('sigaa_palette') || 'ufc';
    let isDarkMode = localStorage.getItem('sigaa_dark_mode') === 'true';

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

            localStorage.setItem('sigaa_palette', currentPalette);
            localStorage.setItem('sigaa_dark_mode', isDarkMode);
        } catch (e) { console.error(e); }
    }
    applyTheme();

    // --- 3. ESTILOS CSS (COM O FIX DE CENTRALIZACAO) ---
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        /* 1. ESCONDER TUDO DO SITE ANTIGO */
        body > table, #container, #cabecalho, #rodape, #barra-governo, center { display: none !important; }

        /* 2. CONTAINER MESTRE (OVERLAY) */
        #ultimate-login-root {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: var(--bg-color); z-index: 999999;
            display: flex; flex-direction: column;
            font-family: 'Inter', sans-serif !important;
            overflow: hidden;
        }

        /* 3. NAVBAR */
        .navbar {
            height: 60px; padding: 0 40px; background: var(--card-bg); border-bottom: 1px solid var(--border-color);
            display: flex; justify-content: space-between; align-items: center; box-sizing: border-box; flex-shrink: 0;
        }
        .nav-brand { font-size: 1.2rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 10px; }
        .btn-config { background: none; border: none; cursor: pointer; color: var(--text-secondary); display: flex; align-items: center; transition: 0.2s; }
        .btn-config:hover { color: var(--theme-primary); transform: rotate(45deg); }

        /* 4. AREA CENTRAL */
        .main-container {
            flex: 1; display: flex; align-items: center; justify-content: center; position: relative; width: 100%; height: 100%;
        }
        .bg-pattern {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0;
            background-image: radial-gradient(var(--border-color) 1px, transparent 1px); background-size: 30px 30px; opacity: 0.5;
        }

        /* 5. CARD DE LOGIN */
        .login-card {
            display: flex; width: 1000px; max-width: 90%; height: 600px; max-height: 90%;
            background: var(--card-bg); border-radius: 20px;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
            border: 1px solid var(--border-color); z-index: 10; overflow: hidden;
        }

        .login-sidebar { width: 40%; background: var(--welcome-bg); padding: 40px; display: flex; flex-direction: column; color: white; }
        .login-sidebar h2 { font-size: 1.8rem; margin: 0 0 10px 0; font-weight: 800; color: white !important; background: transparent !important; }
        .login-sidebar p { opacity: 0.9; margin-bottom: 30px; line-height: 1.5; }
        .system-list { display: flex; flex-direction: column; gap: 8px; }
        .system-link { display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px; color: white; text-decoration: none; font-size: 0.85rem; font-weight: 500; transition: 0.2s; border: 1px solid rgba(255,255,255,0.1); }
        .system-link:hover { background: rgba(255,255,255,0.2); transform: translateX(5px); }

        .login-form-area { width: 60%; padding: 50px; display: flex; flex-direction: column; justify-content: center; overflow-y: auto; }
        .login-form-area h1 { color: var(--text-primary); margin: 0 0 5px 0; font-size: 1.8rem; font-weight: 800; background: transparent !important; }
        .login-form-area .subtitle { color: var(--text-secondary); margin: 0 0 30px 0; font-size: 0.9rem; }

        .input-group { margin-bottom: 15px; }
        .input-label { display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-primary); margin-bottom: 5px; }
        input[type="text"], input[type="password"] {
            width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color);
            background: var(--bg-color); color: var(--text-primary); font-size: 0.95rem; outline: none; transition: 0.2s; box-sizing: border-box;
        }
        input:focus { border-color: var(--theme-primary); box-shadow: 0 0 0 3px var(--theme-primary-light); }

        .btn-submit { width: 100%; padding: 12px; background: var(--theme-primary); color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; transition: 0.2s; margin-top: 10px; font-size: 1rem; }
        .btn-submit:hover { background: var(--theme-primary-hover); }

        .recovery-links { display: flex; justify-content: space-between; margin-top: 15px; font-size: 0.8rem; }
        .recovery-links a { color: var(--text-secondary); text-decoration: none; }
        .recovery-links a:hover { color: var(--theme-primary); text-decoration: underline; }

        .register-area { margin-top: 30px; border-top: 1px solid var(--border-color); padding-top: 20px; }
        .register-title { font-size: 0.75rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
        .register-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .register-btn { text-align: center; font-size: 0.8rem; color: var(--text-primary); text-decoration: none; padding: 8px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); font-weight: 600; transition: 0.2s; }
        .register-btn:hover { border-color: var(--theme-primary); color: var(--theme-primary); background: var(--theme-primary-light); }

        /* MODAL */
        .modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 1000000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(3px); }
        .modal-content { background: var(--card-bg); width: 400px; border-radius: 16px; padding: 25px; box-shadow: 0 20px 25px rgba(0,0,0,0.2); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .modal-header h2 { margin: 0; font-size: 1.2rem; color: var(--text-primary); background: transparent !important; }
        #btn-fechar-temas { background: none; border: none; font-size: 1.5rem; color: var(--text-secondary); cursor: pointer; }
        .theme-row { display: flex; justify-content: space-between; align-items: center; background: var(--bg-color); padding: 10px 15px; border-radius: 8px; margin-bottom: 20px; }
        .theme-row span { font-weight: 600; color: var(--text-primary); }
        .theme-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; }
        .btn-theme { background: transparent; border: 2px solid var(--border-color); color: var(--text-primary); padding: 10px; border-radius: 8px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 5px; }
        .color-dot { width: 20px; height: 20px; border-radius: 50%; }
        .btn-theme span { font-size: 0.7rem; font-weight: 600; }
        .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: var(--theme-primary); }
        input:checked + .slider:before { transform: translateX(20px); }

        @media (max-width: 768px) {
            .login-card { flex-direction: column; height: auto; margin: 20px; }
            .login-sidebar, .login-form-area { width: 100%; padding: 30px; box-sizing: border-box; }
        }
    `);

    // --- 4. FUNCAO PRINCIPAL ---
    function init() {
        const originalForm = document.querySelector('form[name="loginForm"]') || document.querySelector('form[action*="logar.do"]');
        if (!originalForm) return;

        // Container Mestre
        const rootDiv = document.createElement('div');
        rootDiv.id = 'ultimate-login-root';

        rootDiv.innerHTML = `
            <div class="navbar">
                <div class="nav-brand">${ICONS.user} SIGAA Ultimate</div>
                <button class="btn-config" id="btn-config" title="Aparência">${ICONS.gear}</button>
            </div>
            <div class="main-container">
                <div class="bg-pattern"></div>
                <div class="login-card">
                    <div class="login-sidebar">
                        <h2>Portal do Discente</h2>
                        <p>Acesso unificado aos sistemas acadêmicos.</p>
                        <div class="system-list">
                            ${LINKS.sistemas.map(s => `<a href="${s.url}" class="system-link" target="_blank">${ICONS.link} ${s.text}</a>`).join('')}
                        </div>
                    </div>
                    <div class="login-form-area">
                        <h1>Login</h1>
                        <p class="subtitle">Entre com suas credenciais</p>

                        <div id="proxy-form">
                            <div class="input-group">
                                <label class="input-label">Usuário</label>
                                <input type="text" id="proxy-user" placeholder="Digite seu usuário">
                            </div>
                            <div class="input-group">
                                <label class="input-label">Senha</label>
                                <input type="password" id="proxy-pass" placeholder="Digite sua senha">
                            </div>
                            <button id="proxy-btn" class="btn-submit">Entrar no Sistema</button>
                        </div>

                        <div class="recovery-links">
                            ${LINKS.recuperar.map(r => `<a href="${r.url}">${r.text}</a>`).join('')}
                        </div>

                        <div class="register-area">
                            <div class="register-title">Cadastre-se</div>
                            <div class="register-grid">
                                ${LINKS.cadastro.map(c => `<a href="${c.url}" class="register-btn">${c.text}</a>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="modal-temas" class="modal-backdrop" style="display:none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Aparência</h2>
                        <button id="btn-fechar-temas">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="theme-row">
                            <span>Modo Escuro</span>
                            <label class="switch"><input type="checkbox" id="theme-switch" ${isDarkMode ? 'checked' : ''}><span class="slider round"></span></label>
                        </div>
                        <div class="theme-grid">
                            ${Object.entries(PALETTES).map(([k, t]) => `
                                <button class="btn-theme" data-theme="${k}" style="border-color:${currentPalette === k ? 'var(--theme-primary)' : 'var(--border-color)'}">
                                    <div class="color-dot" style="background:${t.primary}"></div>
                                    <span>${t.name}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(rootDiv);

        // --- 5. LOGICA DE PROXY DE LOGIN (CORREÇÃO DE FUNCIONALIDADE) ---
        const userField = originalForm.querySelector('input[name="user.login"]');
        const passField = originalForm.querySelector('input[name="user.senha"]');
        const submitBtn = originalForm.querySelector('input[type="submit"]') || originalForm.querySelector('input[name="entrar"]');

        const proxyUser = document.getElementById('proxy-user');
        const proxyPass = document.getElementById('proxy-pass');
        const proxyBtn = document.getElementById('proxy-btn');

        if(userField && passField) {
            proxyUser.addEventListener('input', (e) => { userField.value = e.target.value; });
            proxyPass.addEventListener('input', (e) => { passField.value = e.target.value; });

            const doLogin = (e) => {
                e.preventDefault();
                if (submitBtn) submitBtn.click(); else originalForm.submit();
            };

            proxyBtn.addEventListener('click', doLogin);
            proxyPass.addEventListener('keyup', (e) => { if(e.key === 'Enter') doLogin(e); });
        }

        // --- 6. LOGICA DO MODAL ---
        const modal = document.getElementById('modal-temas');
        document.getElementById('btn-config').onclick = () => modal.style.display = 'flex';
        document.getElementById('btn-fechar-temas').onclick = () => modal.style.display = 'none';
        modal.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; };

        document.getElementById('theme-switch').addEventListener('change', (e) => {
            isDarkMode = e.target.checked;
            applyTheme();
        });

        document.querySelectorAll('.btn-theme').forEach(btn => {
            btn.onclick = () => {
                currentPalette = btn.dataset.theme;
                applyTheme();
                document.querySelectorAll('.btn-theme').forEach(b => b.style.borderColor = 'var(--border-color)');
                btn.style.borderColor = 'var(--theme-primary)';
            };
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();