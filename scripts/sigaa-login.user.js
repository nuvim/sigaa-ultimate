// ==UserScript==
// @name         SIGAA Ultimate 2.2 - Login Classic (Fix)
// @namespace    http://tampermonkey.net/
// @version      2.2-classic-fix
// @description  O visual clássico da v1.0 com correções de fundo no título.
// @author       Gusttavo
// @match        *://si3.ufc.br/sigaa/verTelaLogin.do*
// @exclude      *://si3.ufc.br/sigaa/paginaInicial.do*
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

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