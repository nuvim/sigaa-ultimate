// ==UserScript==
// @name         SIGAA Ultimate 3 - Portal do Discente
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  O Painel Principal. Transforma a experiência interna, com Sidebar, Cards e correções de erros.
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

    if (window.location.href.includes("verTelaLogin") ||
        window.location.href.includes("paginaInicial") ||
        document.querySelector("#loginFormMask")) return;

    if (window.self !== window.top) return;

    const isDashboard = document.querySelector("#agenda-docente") !== null;
    const isInternalPage = document.querySelector("#cabecalho") !== null || document.querySelector("#info-usuario") !== null;
    const isErrorPage = document.getElementById('painel-erro') !== null || document.body.innerText.includes("Comportamento Inesperado");

    if (isErrorPage) {
        localStorage.removeItem('sigaa_plus_cache');
        return;
    }

    if (!isDashboard && !isInternalPage) return;

    function capitalizeName(name) {
        return name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    let aluno = JSON.parse(localStorage.getItem('sigaa_plus_cache') || '{}');

    if (!aluno.nome) {
        aluno = { nome: "Discente", avatar: "", matricula: "---", curso: "---", semestre: "---" };
    }

    if (isDashboard) {
        try {
            let novaMatricula = "";
            const celulas = document.querySelectorAll("#agenda-docente td");
            for (let i = 0; i < celulas.length; i++) {
                if (celulas[i].innerText.includes("Matrícula:")) {
                    novaMatricula = celulas[i+1]?.innerText.trim();
                }
            }

            if (novaMatricula && novaMatricula !== aluno.matricula) {
                const elNome = document.querySelector(".nome_usuario p") || document.querySelector(".nome small b");
                if(elNome) aluno.nome = capitalizeName(elNome.innerText.trim());

                const elFoto = document.querySelector(".foto img");
                if(elFoto) aluno.avatar = elFoto.src;

                const elSemestre = document.querySelector(".periodo .negrito");
                if(elSemestre) aluno.semestre = elSemestre.innerText.trim();

                aluno.matricula = novaMatricula;

                localStorage.setItem('sigaa_plus_cache', JSON.stringify(aluno));
            }
        } catch(e) {}
    }

    const logoutAction = () => { localStorage.removeItem('sigaa_plus_cache'); };

    const icons = {
        student: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="currentColor" d="M231.9 113.4L135.9 56.7a15.8 15.8 0 0 0-15.8 0L24.1 113.4a7.9 7.9 0 0 0 0 13.6l44.3 26.1v49.3a16 16 0 0 0 8.2 14l46.2 24.3a15.6 15.6 0 0 0 10.4 0l46.2-24.3a16 16 0 0 0 8.2-14v-49.3l24.4-14.4v39.7a8 8 0 0 0 16 0v-48a8 8 0 0 0-4.1-7m-103.9 98l-46.2-24.3a.6.6 0 0 1-.3-.3v-42l46.5 27.4Zm54.7-24.6l-46.2 24.3l-.5-8.4l46.6-27.4Zm-54.7-41.2l-86.5-51l86.5-51.1l86.5 51.1Z"/></svg>`,
        class: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="currentColor" d="M245.2 65.6l-20-13.3a15.9 15.9 0 0 0-17.7 0l-72 48a15.9 15.9 0 0 0-7.1 13.3v42.1l-68.4-45.6V68a8 8 0 0 0-16 0v48a8 8 0 0 0 3.6 6.7l72 48a16.1 16.1 0 0 0 17.8 0l72-48a16.1 16.1 0 0 0 7.1-13.4v-38.4l20 13.3a8 8 0 0 0 8.8-13.3m-108.9 93.4l-64-42.7l64-42.7l64 42.7Z"/></svg>`,
        menu: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="currentColor" d="M224 128a8 8 0 0 1-8 8H40a8 8 0 0 1 0-16h176a8 8 0 0 1 8 8M40 72h176a8 8 0 0 0 0-16H40a8 8 0 0 0 0 16m176 112H40a8 8 0 0 0 0 16h176a8 8 0 0 0 0-16h176a8 8 0 0 0 0-16"/></svg>`,
        logout: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M112 216a8 8 0 0 1-8 8H48a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h56a8 8 0 0 1 0 16H48v160h56a8 8 0 0 1 8 8m109.7-93.7l-56-56a8 8 0 0 0-11.4 11.4l42.3 42.3H88a8 8 0 0 0 0 16h108.7l-42.3 42.3a8 8 0 0 0 11.4 11.4l56-56a8 8 0 0 0 0-11.4"/></svg>`,
        home: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M218.8 103.7L130.1 24a8 8 0 0 0-4.2-4.2a7.9 7.9 0 0 0-7.8 0l-88.7 79.7a8 8 0 0 0 2.4 13.5l3.2 1.4v81.6a16 16 0 0 0 16 16h32a8 8 0 0 0 8-8v-48h48v48a8 8 0 0 0 8 8h32a16 16 0 0 0 16-16v-81.6l3.2-1.4a8.1 8.1 0 0 0 4.5-7.3a8 8 0 0 0-2.1-5.6"/></svg>`,
        clock: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.1 104.1 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m64-88a8 8 0 0 1-8 8h-56a8 8 0 0 1-8-8V72a8 8 0 0 1 16 0v48h48a8 8 0 0 1 8 8"/></svg>`,
        map: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path fill="currentColor" d="M128 64a40 40 0 1 0 40 40a40 40 0 0 0-40-40m0 64a24 24 0 1 1 24-24a24 24 0 0 1-24 24m0-112a88.1 88.1 0 0 0-88 88c0 31.4 18.6 68.6 54.9 106.3a104.4 104.4 0 0 0 66.2 32.8a104.4 104.4 0 0 0 66.2-32.8c36.3-37.7 54.9-74.9 54.9-106.3a88.1 88.1 0 0 0-88-88m0 206c-16.5-1.4-60.3-17-88.6-101.5A72 72 0 1 1 216.6 112c-28.3 84.5-72.1 100.1-88.6 101.5"/></svg>`
    };

    const globalCSS = `
        body { font-family: 'Segoe UI', Roboto, sans-serif !important; background-color: #f3f4f6 !important; }
        
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #e2e8f0; }
        ::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 4px; }
        
        #menu-dropdown { 
            position: fixed !important; z-index: 999999 !important; display: none; 
            background-color: #0f172a !important; box-shadow: 0 10px 25px rgba(0,0,0,0.5) !important; 
            border-radius: 8px !important; border: 1px solid #334155 !important; min-width: 220px; 
        }
        .ThemeOfficeMenuItem, .ThemeOfficeMainItem { 
            background: transparent !important; color: #cbd5e1 !important; border: none !important; 
            font-family: 'Segoe UI' !important; padding: 10px !important; 
        }
        .ThemeOfficeMenuItemHover, .ThemeOfficeMainItemHover { 
            background: #3b82f6 !important; color: white !important; border-radius: 4px !important; 
        }
        .ThemeOfficeSubMenu { 
            background: #0f172a !important; border: 1px solid #334155 !important; 
        }
    `;
    GM_addStyle(globalCSS);

    if (isDashboard) {
        
        const dashboardCSS = `
            #container, #cabecalho, #rodape, #barra-governo { display: none !important; }
            body { overflow: hidden; } 
            
            .sidebar { 
                position: fixed; top: 0; left: 0; bottom: 0; width: 260px; 
                background-color: #0e2c4e; color: white; z-index: 100; 
                display: flex; flex-direction: column; box-shadow: 2px 0 15px rgba(0,0,0,0.15); 
            } 
            .sidebar-header { 
                height: 64px; display: flex; align-items: center; padding: 0 24px; background-color: #0a223d; 
            } 
            .logo-text { font-size: 1.1rem; font-weight: 700; margin-left: 10px; } 
            .logo-text span { color: #60a5fa; font-weight: 300; } 
            
            .user-area { 
                padding: 25px; border-bottom: 1px solid rgba(255,255,255,0.1); 
                display: flex; flex-direction: column; align-items: center; 
            } 
            .avatar-container { 
                width: 90px; height: 90px; border-radius: 50%; border: 3px solid #60a5fa; 
                overflow: hidden; margin-bottom: 15px; background: #fff; 
            } 
            .avatar-container img { width: 100%; height: 100%; object-fit: cover; } 
            .user-name { font-weight: 600; font-size: 1rem; text-align: center; } 
            
            .nav-menu { flex: 1; padding: 20px 0; overflow-y: auto; } 
            .menu-item { 
                display: flex; align-items: center; gap: 12px; padding: 12px 24px; 
                color: #d1d5db; font-size: 0.95rem; text-decoration: none; transition: 0.2s; cursor: pointer; 
            } 
            .menu-item:hover { background: rgba(255,255,255,0.05); color: white; } 
            .menu-item.active { background: rgba(255,255,255,0.1); border-left: 4px solid #60a5fa; color: white; } 
            
            .main-content { 
                margin-left: 260px; height: 100vh; overflow-y: auto; display: flex; flex-direction: column; 
            } 
            .topbar { 
                height: 64px; background: white; border-bottom: 1px solid #e5e7eb; 
                display: flex; align-items: center; justify-content: space-between; 
                padding: 0 30px; position: sticky; top: 0; z-index: 50; 
            } 
            .system-menu-btn { 
                background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; 
                padding: 8px 16px; border-radius: 6px; font-weight: 600; font-size: 0.9rem; 
                cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; 
            } 
            .system-menu-btn:hover { background: #dbeafe; }
        `;
        GM_addStyle(dashboardCSS);
        
        const dashHTML=`
        <aside class="sidebar">
            <div class="sidebar-header">${icons.student} <div class="logo-text">SIGAA <span>Ultimate</span></div></div>
            <div class="user-area">
                <div class="avatar-container">${aluno.avatar ? `<img src="${aluno.avatar}">` : icons.student}</div>
                <div class="user-name">${aluno.nome.split(' ')[0]}</div>
            </div>
            <nav class="nav-menu">
                <div class="menu-item active">${icons.class} Minhas Turmas</div>
                <a href="https://minhabiblioteca.com.br" target="_blank" class="menu-item">📚 Biblioteca</a>
                <a href="/sigaa/verPortalDiscente.do" class="menu-item">↻ Recarregar</a>
            </nav>
            <a href="/sigaa/logar.do?dispatch=logOff" class="menu-item" id="btn-sair" style="color:#f87171; border-top:1px solid #ffffff1a; margin-top:auto;">${icons.logout} Sair</a>
        </aside>
        
        <div class="main-content">
            <header class="topbar">
                <button class="system-menu-btn" id="dashMenuBtn">${icons.menu} Menus do Sistema</button>
                <div style="font-weight:700; color:#1f2937">${aluno.semestre}</div>
            </header>
            
            <div style="padding: 40px;">
                <div style="max-width: 1000px; margin: 0 auto;">
                    <div style="margin-bottom: 40px;">
                        <h1 style="font-size: 2.2rem; font-weight: 700; color: #1e293b; margin: 0;">Olá, ${aluno.nome.split(' ')[0]}! 👋</h1>
                        <p style="color: #64748b; font-size: 1.1rem; margin-top: 5px;">Painel do Semestre ${aluno.semestre}.</p>
                    </div>
                    <h2 style="font-size:1.3rem; font-weight:700; color:#334155; margin-bottom:20px; display:flex; align-items:center; gap:10px;">${icons.class} Minhas Turmas</h2>
                    <div id="dash-cards" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:25px;"></div>
                </div>
            </div>
        </div>`;
        
        const div = document.createElement('div');
        div.innerHTML = dashHTML;
        document.body.appendChild(div);
        
        const cardArea = document.getElementById('dash-cards');
        const colors = ['#3b82f6','#a855f7','#22c55e','#f97316'];
        
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
                    const uid = "dash-" + i;
                    link.id = uid;
                    
                    const nome = link.innerText.trim();
                    const local = cols[2].innerText.replace("Acessar:", "").trim();
                    const horario = cols[3].innerText.split("(")[0].trim();
                    const bg = colors[i % 4];
                    
                    const card = document.createElement('div');
                    card.style.cssText = `background:white; border-radius:16px; padding:25px; border:1px solid #e2e8f0; cursor:pointer; position:relative; overflow:hidden; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05); transition:all 0.2s;`;
                    card.innerHTML = `
                        <div style="position:absolute; left:0; top:0; bottom:0; width:6px; background:${bg}"></div>
                        <h3 style="margin:0 0 15px 0; color:#1e293b; font-weight:700; font-size:1.1rem; line-height:1.4;">${nome}</h3>
                        <div style="color:#64748b; font-size:0.85rem; display:flex; gap:8px; align-items:center; margin-bottom:8px">${icons.map} ${local}</div>
                        <div style="color:#64748b; font-size:0.85rem; display:flex; gap:8px; align-items:center">${icons.clock} ${horario}</div>
                    `;
                    
                    card.onclick = () => document.getElementById(uid).click();
                    card.onmouseover = () => { card.style.transform = 'translateY(-5px)'; card.style.boxShadow = '0 15px 30px -5px rgba(0,0,0,0.1)'; };
                    card.onmouseout = () => { card.style.transform = 'translateY(0)'; card.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'; };
                    
                    cardArea.appendChild(card);
                }
            });
            if (!hasTurma) cardArea.innerHTML = "<p style='color:#666'>Nenhuma turma encontrada.</p>";
        } catch(e) {}

        const menuBtn = document.getElementById('dashMenuBtn');
        const initMenu = setInterval(() => {
            const menu = document.getElementById('menu-dropdown');
            if (menu) {
                clearInterval(initMenu);
                document.body.appendChild(menu);
            }
        }, 1000);

        if (menuBtn) {
            let open = false;
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const menu = document.getElementById('menu-dropdown');
                if (!menu) return;
                open = !open;
                menu.style.display = open ? 'block' : 'none';
                menu.style.top = '64px';
                menu.style.left = '260px';
            });
            document.addEventListener('click', () => {
                const menu = document.getElementById('menu-dropdown');
                if (menu) { open = false; menu.style.display = 'none'; }
            });
        }
        
        const btnSair = document.getElementById('btn-sair');
        if (btnSair) btnSair.addEventListener('click', logoutAction);

    } else {
        const internalCSS = `
            #internal-navbar { 
                position: fixed; top: 0; left: 0; right: 0; height: 50px; 
                background-color: #0e2c4e; color: white; z-index: 9999; 
                display: flex; align-items: center; justify-content: space-between; 
                padding: 0 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); 
            } 
            .nav-link { 
                background: rgba(255,255,255,0.1); color: white; text-decoration: none; 
                padding: 6px 12px; border-radius: 4px; font-size: 0.9rem; 
                display: flex; align-items: center; gap: 6px; cursor: pointer; border: none; 
            } 
            .nav-link:hover { background: rgba(255,255,255,0.2); } 
            
            body { padding-top: 70px !important; background-color: #f3f4f6 !important; } 
            #cabecalho, #rodape, #barra-governo { display: none !important; } 
            
            #container { 
                width: 96% !important; max-width: 1200px !important; margin: 0 auto !important; 
                background: white !important; border-radius: 8px !important; 
                box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1) !important; 
                padding: 25px !important; border: 1px solid #e5e7eb !important; 
            } 
            
            table.listagem, table.visualizacao, table.form { 
                width: 100%; border-collapse: collapse; margin-bottom: 20px; 
                border: 1px solid #e2e8f0; border-radius: 8px; background: white !important; 
            } 
            table.listagem th, table.visualizacao th, .tituloTabela { 
                background: #f8fafc !important; color: #334155 !important; padding: 10px !important; 
                text-transform: uppercase; font-size: 0.75rem; border-bottom: 2px solid #e2e8f0; 
                background-image: none !important; 
            } 
            table.listagem td, table.visualizacao td { 
                padding: 10px !important; border-bottom: 1px solid #f1f5f9 !important; color: #333 !important; 
            } 
            
            .titulo { 
                font-size: 1.4rem !important; color: #1e293b !important; 
                border-bottom: 2px solid #3b82f6 !important; padding-bottom: 5px; 
                margin-bottom: 20px; background: none !important; 
            } 
            a { color: #2563eb !important; text-decoration: none !important; } 
            input[type="submit"], button { 
                background: #2563eb !important; color: white !important; 
                border:none; padding:8px 16px; border-radius:4px; cursor:pointer; 
            }
        `;
        GM_addStyle(internalCSS);
        
        const nav = document.createElement('div');
        nav.id = "internal-navbar";
        nav.innerHTML = `
            <div style="display:flex; align-items:center; gap:15px; font-weight:700;">
                <span>SIGAA Ultimate</span>
                <span style="font-weight:400; font-size:0.9rem; opacity:0.8">| ${aluno.nome.split(' ')[0]}</span>
            </div>
            <div style="display:flex; gap:10px;">
                <a href="/sigaa/portais/discente/discente.jsf" class="nav-link">${icons.home} Home</a>
                <button class="nav-link" id="internalMenuBtn">${icons.menu} Menu</button>
            </div>
        `;
        document.body.prepend(nav);
        
        const menuBtn = document.getElementById('internalMenuBtn');
        const initMenu = setInterval(() => {
            const menu = document.getElementById('menu-dropdown');
            if (menu) {
                clearInterval(initMenu);
                document.body.appendChild(menu);
            }
        }, 1000);

        if (menuBtn) {
            let open = false;
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const menu = document.getElementById('menu-dropdown');
                if (!menu) return;
                open = !open;
                menu.style.display = open ? 'block' : 'none';
                menu.style.top = '60px';
                menu.style.right = '20px';
                menu.style.left = 'auto';
            });
            document.addEventListener('click', () => {
                const menu = document.getElementById('menu-dropdown');
                if (menu) { open = false; menu.style.display = 'none'; }
            });
        }
    }
})();