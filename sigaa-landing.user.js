// ==UserScript==
// @name         SIGAA Ultimate 1 - Landing Page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Transforma a página inicial pública em uma Landing Page moderna e funcional.
// @author       Gusttavo
// @match        *://si3.ufc.br/sigaa/paginaInicial.do*
// @exclude      *://si3.ufc.br/sigaa/verTelaLogin.do*
// @exclude      *://si3.ufc.br/sigaa/portais/*
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const head = document.head;
    
    // importa fonte bonita e icones
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap';
    head.appendChild(fontLink);

    const iconScript = document.createElement('script');
    iconScript.src = 'https://unpkg.com/@phosphor-icons/web';
    head.appendChild(iconScript);

    // pega os links e menus da pagina original
    function scrapeItems() {
        const groups = {
            portais: [],
            modulos: []
        };

        // dicionario pra escolher icone baseado no nome
        const iconMap = {
            'graduacao': 'ph-student',
            'pos_graduacao': 'ph-graduation-cap',
            'tecnico': 'ph-wrench',
            'medio': 'ph-backpack',
            'infantil': 'ph-baby',
            'pesquisa': 'ph-microscope',
            'extensao': 'ph-globe',
            'monitoria': 'ph-users-three',
            'biblioteca': 'ph-books',
            'ambientes': 'ph-desktop',
            'saude': 'ph-first-aid',
            'diploma': 'ph-certificate',
            'bolsas': 'ph-currency-dollar',
            'infra': 'ph-bricks',
            'admin': 'ph-gear',
            'sipac': 'ph-buildings',
            'sigrh': 'ph-users-four',
            'docente': 'ph-chalkboard-teacher',
            'discente': 'ph-student',
            'avalia': 'ph-star',
            'relatorio': 'ph-chart-bar'
        };

        function getIcon(className, text) {
            for (let key in iconMap) {
                if (className.includes(key)) return iconMap[key];
            }
            const t = text.toLowerCase();
            if (t.includes('biblioteca')) return 'ph-books';
            if (t.includes('rh') || t.includes('pessoal')) return 'ph-users';
            if (t.includes('docente')) return 'ph-chalkboard-teacher';
            if (t.includes('aluno') || t.includes('discente')) return 'ph-student';
            
            return 'ph-squares-four';
        }

        // varre a lista de portais
        document.querySelectorAll('#portais ul li').forEach(li => {
            const link = li.querySelector('a');
            const span = li.querySelector('.texto');
            if (!span) return;

            const text = span.innerText.trim();
            const url = link ? link.getAttribute('href') : '#';
            const isActive = !li.classList.contains('off');

            groups.portais.push({
                text: text,
                url: url,
                active: isActive,
                icon: getIcon(li.className, text)
            });
        });

        // varre a lista de modulos
        document.querySelectorAll('#modulos ul li').forEach(li => {
            const link = li.querySelector('a');
            const span = li.querySelector('.texto');
            if (!span) return;

            const text = span.innerText.trim();
            const url = link ? link.getAttribute('href') : '#';
            const isActive = !li.classList.contains('off');

            groups.modulos.push({
                text: text,
                url: url,
                active: isActive,
                icon: getIcon(li.className, text)
            });
        });

        return groups;
    }

    const data = scrapeItems();

    // estilos css da landing page
    const css = `
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            font-family: 'Inter', sans-serif;
            background-color: #f8fafc;
        }
        
        // esconde tudo da pagina original
        body > table, #container, #cabecalho, #rodape, #barra-governo, .tabela {
            display: none !important;
        }

        .navbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 40px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(5px);
            border-bottom: 1px solid #e2e8f0;
        }
        
        .nav-brand {
            font-size: 1.2rem;
            font-weight: 800;
            color: #0f172a;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .nav-btn {
            background: #0f172a;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 600;
            transition: background 0.2s;
        }
        .nav-btn:hover {
            background: #1e293b;
        }

        .hero {
            height: 450px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            text-align: center;
            background: linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), 
                        url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2572&auto=format&fit=crop');
            background-size: cover;
            color: white;
            padding-top: 100px;
        }
        
        .highlight-card {
            background: #ffffff;
            padding: 30px 60px;
            border-radius: 20px;
            margin-top: 30px;
            text-decoration: none;
            color: #1e293b;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            border: 4px solid rgba(255,255,255,0.2);
            transform: scale(1);
            position: relative;
            z-index: 10;
        }
        .highlight-card:hover {
            transform: scale(1.05) translateY(-5px);
            box-shadow: 0 30px 60px rgba(59, 130, 246, 0.3);
            border-color: #3b82f6;
        }
        
        .highlight-icon {
            font-size: 3.5rem;
            color: #2563eb;
            margin-bottom: 10px;
        }
        .highlight-title {
            font-size: 1.8rem;
            font-weight: 800;
            margin: 5px 0;
            color: #0f172a;
        }
        .highlight-sub {
            font-size: 0.95rem;
            color: #64748b;
            font-weight: 500;
        }
        
        .highlight-btn {
            background: #2563eb;
            color: white;
            padding: 10px 30px;
            border-radius: 50px;
            font-weight: 700;
            margin-top: 20px;
            font-size: 1rem;
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
            transition: background 0.2s;
        }
        .highlight-card:hover .highlight-btn {
            background: #1d4ed8;
        }

        .content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
            margin-top: -60px;
            position: relative;
            z-index: 5;
        }
        
        .section-header {
            font-size: 0.9rem;
            text-transform: uppercase;
            color: #64748b;
            font-weight: 700;
            letter-spacing: 1px;
            margin: 40px 0 20px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .section-header::after {
            content: '';
            flex: 1;
            height: 1px;
            background: #e2e8f0;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 15px;
        }

        .card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            text-decoration: none;
            color: #1e293b;
            transition: 0.2s;
            position: relative;
            overflow: hidden;
            box-shadow: 0 2px 5px rgba(0,0,0,0.02);
        }
        
        .card.active:hover {
            border-color: #3b82f6;
            box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.15);
            transform: translateY(-3px);
        }
        .card.active .icon {
            color: #3b82f6;
            background: #eff6ff;
        }
        
        .card.inactive {
            opacity: 0.5;
            background: #f1f5f9;
            cursor: not-allowed;
            border-style: dashed;
        }
        .card.inactive .icon {
            color: #94a3b8;
            background: #e2e8f0;
        }
        .card.inactive::after {
            content: '\\ece0';
            font-family: "Phosphor";
            position: absolute;
            top: 10px;
            right: 10px;
            color: #cbd5e1;
            font-size: 1.2rem;
        }

        .icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            transition: 0.2s;
        }
        
        .name {
            font-weight: 600;
            font-size: 0.9rem;
            line-height: 1.3;
        }

        .footer {
            text-align: center;
            color: #94a3b8;
            margin-top: 60px;
            font-size: 0.8rem;
            padding-bottom: 20px;
        }
    `;
    GM_addStyle(css);

    const portaisFiltrados = data.portais.filter(p => !p.text.toLowerCase().includes('discente'));

    // constroi o html da nova pagina inicial
    const page = document.createElement('div');
    page.innerHTML = `
        <nav class="navbar">
            <div class="nav-brand">
                <i class="ph ph-student"></i> SIGAA Público
            </div>
            <a href="/sigaa/verTelaLogin.do" class="nav-btn">Fazer Login</a>
        </nav>

        <div class="hero">
            <div style="margin-bottom:10px; text-transform:uppercase; letter-spacing:2px; font-size:0.8rem; opacity:0.8;">
                Universidade Federal do Ceará
            </div>
            <h1 style="margin:0; font-size:2.5rem; font-weight:800;">
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

})();