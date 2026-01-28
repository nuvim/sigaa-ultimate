// ==UserScript==
// @name         SIGAA Ultimate 2.0 - Portal do Discente
// @namespace    http://tampermonkey.net/
// @version      2.0-beta1
// @description  v2.0 Beta: Grade Estável (07h-22h), Alto Contraste e PDF Nativo.
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

    // trava de seguranca: se for login ou pagina publica, nao roda
    if (window.location.href.includes("verTelaLogin") || window.location.href.includes("paginaInicial") || document.querySelector("#loginFormMask")) return;
    if (window.self !== window.top) return;

    // verifica se estamos no painel principal ou pagina interna
    const isDashboard = document.querySelector("#agenda-docente") !== null;
    const isInternalPage = document.querySelector("#cabecalho") !== null || document.querySelector("#info-usuario") !== null;
    const isErrorPage = document.getElementById('painel-erro') !== null || document.body.innerText.includes("Comportamento Inesperado");

    // se deu erro no sigaa, limpa o cache pra nao travar
    if (isErrorPage) { localStorage.removeItem('sigaa_plus_cache'); return; }
    if (!isDashboard && !isInternalPage) return;

    // icones svg (figurinhas)
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
        printer: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M216 40H40a16 16 0 0 0-16 16v104a16 16 0 0 0 16 16h16v32a16 16 0 0 0 16 16h112a16 16 0 0 0 16-16v-32h16a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16m-48 176H88v-32h80Zm24-48H64V56h152Zm-32-88a12 12 0 1 1-12 12a12 12 0 0 1 12-12"/></svg>`
    };

    // funcoes pra deixar o nome bonito e encurtar
    function capitalizeName(name) { return name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); }
    function getShortName(fullName) { const parts = fullName.split(' '); return parts.length <= 1 ? fullName : parts[0] + ' ' + parts[1]; }

    // data de hoje
    const today = new Date();
    const dateString = today.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const capitalizedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);

    // pega dados salvos no navegador
    let aluno = JSON.parse(localStorage.getItem('sigaa_plus_cache') || '{}');
    let carteirinha = { matricula: "---", curso: "---", nivel: "---", status: "---", email: "---", entrada: "---" };

    // se tiver no painel, raspa os dados da tabela feia
    if (isDashboard) {
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
        } catch(e) {}
    } else { carteirinha = aluno.dados || carteirinha; }

    function cleanText(text) {
        return text.replace(/\(\d{2}\/\d{2}\/\d{4}.*?\)/g, "").trim();
    }

    // cria os badges bonitinhos de horario nos cards
    function formatHorarios(rawText) {
        let text = cleanText(rawText);
        const dias = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
        let parts = [];
        dias.forEach(dia => {
            const regex = new RegExp(`${dia}\\s\\d{2}:\\d{2}-\\d{2}:\\d{2}`, "g");
            const matches = text.match(regex);
            if (matches) parts.push(...matches);
        });
        return parts.length === 0 ? `<div class="horario-badge">Horário não definido</div>` : parts.map(h => `<div class="horario-badge">${icons.clock} <span>${h}</span></div>`).join("");
    }

    // --- LOGICA DA GRADE VISUAL ---
    const turmasData = [];
    const diasSemana = ["SEG", "TER", "QUA", "QUI", "SEX"];
    
    // transforma texto tipo "SEG 14:00-16:00" em dados pra grade
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

    // desenha o modal da grade
    function criarModalGrade() {
        const modal = document.createElement('div');
        modal.id = 'modal-grade';
        modal.style.cssText = `display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:99999; align-items:center; justify-content:center; backdrop-filter:blur(3px);`;
        
        // configuracoes de tamanho (fixo das 07 as 22h)
        const startHour = 7;
        const endHour = 22; 
        
        const totalMinutes = (endHour - startHour) * 60;
        const containerHeightPx = (endHour - startHour) * 50; 

        // cores pra ficar legivel
        const borderColor = '#cbd5e1'; 
        const textColor = '#334155'; 

        // desenha as linhas do fundo
        let gridLinesHTML = '';
        for(let h = startHour; h < endHour; h++) {
            gridLinesHTML += `<div style="flex:1; border-bottom:1px solid ${borderColor}; box-sizing:border-box; width:100%; min-height:50px;"></div>`;
        }

        // desenha a coluna dos horarios na esquerda
        let timeLabelsHTML = '';
        for(let h = startHour; h < endHour; h++) {
            timeLabelsHTML += `<div style="flex:1; border-bottom:1px solid ${borderColor}; box-sizing:border-box; color:${textColor}; font-weight:600; font-size:0.75rem; padding:5px; text-align:right; display:flex; align-items:flex-end; justify-content:flex-end; padding-bottom:0; min-height:50px;">${h+1}:00</div>`;
        }

        // monta as colunas dos dias (seg a sex)
        let daysColsHTML = diasSemana.map(dia => {
            const aulasDia = turmasData.filter(t => t.dia === dia);
            
            // desenha os quadradinhos das aulas usando %
            let blocosHTML = aulasDia.map(aula => {
                const startMinutes = (aula.h_inicio * 60) + aula.m_inicio;
                const endMinutes = (aula.h_fim * 60) + aula.m_fim;
                const gridStartMinutes = startHour * 60;
                
                const topPercent = ((startMinutes - gridStartMinutes) / totalMinutes) * 100;
                const heightPercent = ((endMinutes - startMinutes) / totalMinutes) * 100;

                const labelInicio = `${String(aula.h_inicio).padStart(2,'0')}:${String(aula.m_inicio).padStart(2,'0')}`;
                const labelFim = `${String(aula.h_fim).padStart(2,'0')}:${String(aula.m_fim).padStart(2,'0')}`;

                return `<div style="
                    position: absolute;
                    top: ${topPercent}%;
                    left: 2%;
                    width: 96%;
                    height: ${heightPercent}%;
                    background: ${aula.cor};
                    border-radius: 6px;
                    color: white;
                    font-size: 0.7rem;
                    padding: 4px 6px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    overflow: hidden;
                    z-index: 10;
                    border-left: 3px solid rgba(0,0,0,0.2);
                    display:flex; flex-direction:column; justify-content:center;
                    box-sizing: border-box;
                ">
                    <div style="font-weight:700; line-height:1.2; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">${aula.nome}</div>
                    <div style="opacity:0.9; font-size:0.65rem; margin-top:2px;">${labelInicio} - ${labelFim}</div>
                </div>`;
            }).join('');

            return `<div style="position:relative; background:white; border-left:1px solid ${borderColor}; min-width:100px; height:100%;">
                <div style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; flex-direction:column; z-index:0;">${gridLinesHTML}</div>
                ${blocosHTML}
            </div>`;
        }).join('');

        // monta o html final da janela (modal)
        let gridHTML = `<div style="background:white; width:95%; max-width:1600px; height:90vh; border-radius:16px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 20px 50px rgba(0,0,0,0.3);">
            <div style="padding:15px 25px; border-bottom:1px solid ${borderColor}; display:flex; justify-content:space-between; align-items:center; background:#f8fafc;">
                <h2 style="margin:0; font-size:1.3rem; color:#1e293b; display:flex; align-items:center; gap:10px;">${icons.table} Grade Curricular</h2>
                <div style="display:flex; gap:10px;">
                    <button id="btn-imprimir-grade" style="background:white; border:1px solid #cbd5e1; border-radius:8px; padding:8px 12px; cursor:pointer; color:#475569; display:flex; align-items:center; gap:6px; font-weight:600; font-size:0.85rem; transition:0.2s;">${icons.printer} Salvar PDF</button>
                    <button id="btn-fechar-modal" style="background:none; border:none; font-size:2rem; cursor:pointer; color:#64748b; line-height:1;">&times;</button>
                </div>
            </div>
            
            <div style="display:grid; grid-template-columns: 50px repeat(5, 1fr); background:white; border-bottom:2px solid ${borderColor};">
                <div style="padding:10px;"></div>
                ${diasSemana.map(d => `<div style="padding:12px; text-align:center; font-weight:800; color:${textColor}; font-size:0.9rem;">${d}</div>`).join('')}
            </div>

            <div style="flex:1; overflow-y:auto; position:relative;">
                <div style="display:grid; grid-template-columns: 50px repeat(5, 1fr); height:${containerHeightPx}px;">
                    <div style="background:#f8fafc; border-right:1px solid ${borderColor}; display:flex; flex-direction:column;">
                        ${timeLabelsHTML}
                    </div>
                    ${daysColsHTML}
                </div>
            </div>
        </div>`;
        
        modal.innerHTML = gridHTML;
        document.body.appendChild(modal);
        
        // botoes fechar e imprimir
        document.getElementById('btn-fechar-modal').onclick = () => modal.style.display = 'none';
        modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
        
        document.getElementById('btn-imprimir-grade').addEventListener('click', () => {
            window.print();
        });
    }

    const triggerMeusDados = () => { const links = document.querySelectorAll('a'); for (const a of links) { if (a.innerText.includes("Meus Dados Pessoais")) { a.click(); return; } } alert("Opção indisponível."); };
    const triggerEditarPerfil = () => { const link = document.querySelector('a.perfil'); if (link) link.click(); else alert("Opção indisponível."); };

    // estilos CSS (menu escuro, badges, grade e impressao)
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif !important; background-color: #f8fafc !important; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 10px; }
        
        #menu-dropdown { background-color: #0f172a !important; border: 1px solid #334155 !important; }
        #menu-dropdown * { background-color: #0f172a !important; color: #cbd5e1 !important; border-color: #334155 !important; }
        #menu-dropdown .ThemeOfficeMenuItemHover, #menu-dropdown .ThemeOfficeMenuItemHover * { background-color: #3b82f6 !important; color: white !important; }

        .horario-badge { display: flex; align-items: center; gap: 6px; background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; margin-bottom: 5px; border: 1px solid #e2e8f0; width: fit-content; }
        .horario-badge svg { color: #3b82f6; }
        
        .btn-grade { background:white; color:#3b82f6; border:1px solid #bfdbfe; padding:6px 12px; border-radius:8px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:6px; transition:0.2s; font-size:0.85rem; }
        .btn-grade:hover { background:#eff6ff; border-color:#3b82f6; }
        #btn-imprimir-grade:hover { background:#f1f5f9; color:#1e293b; border-color:#94a3b8; }

        @media print {
            body > :not(#modal-grade) { display: none !important; }
            #modal-grade {
                display: flex !important;
                position: static !important;
                background: white !important;
                height: 100vh !important;
                width: 100vw !important;
                z-index: 999999 !important;
                box-shadow: none !important;
                backdrop-filter: none !important;
            }
            #modal-grade > div {
                width: 100% !important;
                max-width: 100% !important;
                height: auto !important;
                box-shadow: none !important;
                border-radius: 0 !important;
            }
            #modal-grade > div > div:last-child {
                overflow: visible !important;
                height: auto !important;
            }
            #btn-fechar-modal, #btn-imprimir-grade { display: none !important; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
    `);

    // se tiver no painel, desenha sidebar e cards
    if (isDashboard) {
        GM_addStyle(`
            #container, #cabecalho, #rodape, #barra-governo { display: none !important; }
            body { overflow: hidden; padding-left: 0 !important; margin: 0 !important; } 

            .sidebar { position: fixed; top: 0; left: 0; bottom: 0; width: 280px; background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%); border-right: 1px solid #334155; z-index: 100; display: flex; flex-direction: column; box-shadow: 4px 0 25px rgba(0,0,0,0.15); overflow-y: auto; color: #f8fafc; text-align: left; } 
            .sidebar-header { min-height: 80px; display: flex; align-items: center; padding: 0 24px; border-bottom: 1px solid rgba(255,255,255,0.05); } 
            .logo-text { font-size: 1.2rem; font-weight: 800; margin-left: 10px; color: #f8fafc; letter-spacing: -0.5px; } 
            .logo-text span { color: #38bdf8; font-weight: 400; } 
            
            .profile-section { padding: 30px 20px 20px; display: flex; flex-direction: column; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
            .avatar-ring { padding: 4px; border: 3px solid #334155; border-radius: 50%; margin-bottom: 12px; transition: 0.3s; cursor: pointer; display: inline-block; }
            .avatar-ring:hover { border-color: #38bdf8; box-shadow: 0 0 20px rgba(56, 189, 248, 0.3); }
            .avatar-container { width: 85px; height: 85px; border-radius: 50%; overflow: hidden; background: #1e293b; } 
            .avatar-container img { width: 100%; height: 100%; object-fit: cover; } 
            .user-name { font-weight: 700; font-size: 1.1rem; color: #f1f5f9; margin-bottom: 20px; text-align: center; width: 100%; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }
            .user-name:hover { color: #38bdf8; }

            .mini-id { width: 100%; box-sizing: border-box; background: rgba(0,0,0,0.2); border-radius: 12px; padding: 15px; border: 1px solid rgba(255,255,255,0.05); text-align: left; }
            .mini-row { display: flex; flex-direction: column; margin-bottom: 8px; text-align: left; }
            .mini-row:last-child { margin-bottom: 0; }
            .mini-label { color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 0.6rem; letter-spacing: 0.5px; margin-bottom: 2px; }
            .mini-val { color: #e2e8f0; font-weight: 500; font-size: 0.8rem; line-height: 1.3; word-break: break-word; }
            .val-curso { font-size: 0.7rem !important; color: #38bdf8; font-weight: 600; white-space: normal; }
            .status-badge { color: #34d399; font-weight: 800; font-size: 0.75rem; }

            .user-dropdown { background: #0f172a; overflow: hidden; max-height: 0; margin: 0 20px; transition: max-height 0.3s ease; border-radius: 0 0 12px 12px; }
            .user-dropdown.open { max-height: 150px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.1); border-top: none; }
            .sub-item { display: flex; align-items: center; gap: 10px; padding: 10px 15px; color: #94a3b8; font-size: 0.8rem; text-decoration: none; transition: 0.2s; font-family: 'Inter', sans-serif !important; }
            .sub-item:hover { background: rgba(255,255,255,0.05); color: #38bdf8; }

            .nav-menu { flex: 1; padding: 15px 0; } 
            .menu-item { display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #cbd5e1; font-size: 0.95rem; text-decoration: none; transition: 0.2s; cursor: pointer; font-weight: 500; border-left: 4px solid transparent; font-family: 'Inter', sans-serif !important; } 
            .menu-item:hover { background: rgba(255,255,255,0.05); color: white; padding-left: 28px; } 
            .menu-item.active { background: linear-gradient(90deg, rgba(56, 189, 248, 0.1) 0%, transparent 100%); border-left-color: #38bdf8; color: #38bdf8; font-weight: 600; } 
            
            .btn-biblioteca { background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.2); margin: 10px 15px; border-radius: 10px; color: #f8fafc !important; }
            .btn-biblioteca:hover { background: rgba(56, 189, 248, 0.15); border-color: #38bdf8; transform: translateY(-1px); }
            .btn-biblioteca svg { color: #38bdf8 !important; }
            
            #btn-sair { color: #f87171 !important; margin-top: auto; border-top: 1px solid rgba(255,255,255,0.05); padding: 20px 24px; }
            
            .welcome-card { 
                background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); 
                color: white; border-radius: 20px; padding: 35px; margin-bottom: 40px; 
                display: flex; justify-content: space-between; align-items: center;
                box-shadow: 0 10px 30px -10px rgba(30, 58, 138, 0.5); position: relative; overflow: hidden;
            }
            .welcome-card::after { content: ''; position: absolute; right: -20px; top: -50px; width: 300px; height: 300px; background: rgba(255,255,255,0.1); border-radius: 50%; pointer-events: none; }
            .welcome-text h1 { margin: 0 0 10px; font-size: 2rem; font-weight: 800; letter-spacing: -1px; }
            .welcome-text p { margin: 0; font-size: 1rem; opacity: 0.9; font-weight: 500; display: flex; align-items: center; gap: 8px; }
            .date-badge { background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 12px; font-weight: 700; font-size: 0.9rem; backdrop-filter: blur(10px); display: flex; align-items: center; gap: 8px; }

            .main-content { margin-left: 280px; height: 100vh; overflow-y: auto; display: flex; flex-direction: column; } 
            .topbar { height: 80px; background: white; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; position: sticky; top: 0; z-index: 50; } 
            .menu-toggle { z-index: 1000; position: relative; background: white; border: 1px solid #e2e8f0; cursor: pointer; color: #334155; width: 40px; height: 40px; border-radius: 8px; transition: 0.2s; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        `);
        
        // monta a estrutura HTML da sidebar e conteudo
        const dashHTML=`
        <aside class="sidebar">
            <div class="sidebar-header">${icons.student} <div class="logo-text">SIGAA <span>Ultimate</span></div></div>
            <div class="profile-section">
                <div class="avatar-ring" id="userAreaBtn"><div class="avatar-container"><img src="${aluno.avatar || ''}" onerror="this.src='/sigaa/img/usuarios/sem_foto.png'"></div></div>
                <div class="user-name" onclick="document.getElementById('userAreaBtn').click()">${getShortName(aluno.nome)} ${icons.chevronDown}</div>
                <div class="mini-id">
                    <div class="mini-row"><span class="mini-label">Matrícula</span><span class="mini-val">${carteirinha.matricula}</span></div>
                    <div class="mini-row"><span class="mini-label">Curso</span><span class="mini-val val-curso">${carteirinha.curso}</span></div>
                    <div class="mini-row"><span class="mini-label">Nível</span><span class="mini-val">${carteirinha.nivel}</span></div>
                    <div class="mini-row"><span class="mini-label">Status</span><span class="status-badge">${carteirinha.status}</span></div>
                    <div class="mini-row"><span class="mini-label">E-Mail</span><span class="mini-val" style="font-size:0.65rem; opacity:0.8">${carteirinha.email}</span></div>
                    <div class="mini-row"><span class="mini-label">Entrada</span><span class="mini-val">${carteirinha.entrada}</span></div>
                </div>
            </div>
            <div class="user-dropdown" id="userDropdown">
                <a href="#" id="btn-meus-dados" class="sub-item">${icons.user} Meus Dados</a>
                <a href="#" id="btn-editar-perfil" class="sub-item">${icons.edit} Editar Perfil</a>
            </div>
            <nav class="nav-menu">
                <div class="menu-item active">${icons.class} Minhas Turmas</div>
                <a href="https://minhabiblioteca.com.br" target="_blank" class="menu-item btn-biblioteca">${icons.books} Biblioteca Digital</a>
                <a href="/sigaa/verPortalDiscente.do" class="menu-item">↻ Recarregar Painel</a>
            </nav>
            <a href="/sigaa/logar.do?dispatch=logOff" class="menu-item" id="btn-sair">${icons.logout} Sair</a>
        </aside>
        
        <div class="main-content">
            <header class="topbar">
                <button class="menu-toggle" id="dashMenuBtn">${icons.menu}</button>
                <div style="text-align:right;">
                    <div style="font-weight:700; color:#1e293b; font-size: 1.1rem;">Semestre ${aluno.semestre}</div>
                </div>
            </header>
            <div style="padding: 40px;">
                <div style="max-width: 1100px; margin: 0 auto;">
                    
                    <div class="welcome-card">
                        <div class="welcome-text">
                            <h1>Olá, ${getShortName(aluno.nome)}! 👋</h1>
                            <p>Bem-vindo ao seu Portal do Discente.</p>
                        </div>
                        <div class="date-badge">
                            ${icons.clock} ${capitalizedDate}
                        </div>
                    </div>

                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:30px;">
                        <h2 style="font-size:1.5rem; font-weight:700; color:#1e293b; margin:0; display:flex; align-items:center; gap:12px;">${icons.class} Turmas do Semestre</h2>
                        <button class="btn-grade" id="btn-ver-grade">${icons.table} Ver Grade</button>
                    </div>
                    
                    <div id="dash-cards" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:25px;"></div>
                </div>
            </div>
        </div>`;
        
        const div = document.createElement('div'); div.innerHTML = dashHTML; document.body.appendChild(div);
        
        // eventos de clique do perfil e grade
        const userBtn = document.getElementById('userAreaBtn');
        const userDrop = document.getElementById('userDropdown');
        if(userBtn) { userBtn.addEventListener('click', () => { userDrop.classList.toggle('open'); }); }

        document.getElementById('btn-meus-dados')?.addEventListener('click', (e) => { e.preventDefault(); triggerMeusDados(); });
        document.getElementById('btn-editar-perfil')?.addEventListener('click', (e) => { e.preventDefault(); triggerEditarPerfil(); });
        document.getElementById('btn-ver-grade')?.addEventListener('click', () => { 
            document.getElementById('modal-grade').style.display = 'flex'; 
        });

        // cria os cards das materias
        const cardArea = document.getElementById('dash-cards');
        const colors = ['#3b82f6','#8b5cf6','#10b981','#f59e0b', '#ef4444'];
        
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
                    
                    let nomeMateria = nome;
                    if (nome.includes(' - ')) {
                        const parts = nome.split(' - ');
                        nomeMateria = parts.slice(1).join(' - ').trim();
                    }
                    
                    // joga dados pra grade
                    parseToGrid(horarioStr, nomeMateria, bg);

                    const card = document.createElement('div');
                    card.style.cssText = `background:white; border-radius:16px; padding:25px; border:1px solid #e2e8f0; cursor:pointer; position:relative; overflow:hidden; box-shadow:0 10px 15px -3px rgba(0,0,0,0.03); transition:0.3s;`;
                    card.innerHTML = `<div style="position:absolute; top:0; left:0; right:0; height:4px; background:${bg}"></div><h3 style="margin:5px 0 15px 0; color:#1e293b; font-weight:700; font-size:1rem; line-height:1.4; min-height:2.8em;">${nome}</h3><div style="color:#64748b; font-size:0.85rem; display:flex; gap:8px; align-items:center; margin-bottom:15px;">${icons.map} ${local}</div><div style="display:flex; flex-wrap:wrap; gap:5px;">${horarioHTML}</div>`;
                    card.onclick = () => document.getElementById(uid).click();
                    card.onmouseover = () => { card.style.transform = 'translateY(-5px)'; card.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)'; };
                    card.onmouseout = () => { card.style.transform = 'translateY(0)'; card.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.03)'; };
                    cardArea.appendChild(card);
                }
            });
            if (!hasTurma) cardArea.innerHTML = "<p>Nenhuma turma encontrada.</p>";
            
            // depois de ler tudo, cria a grade visual
            criarModalGrade();

        } catch(e) {}

        // gambiarra pra arrumar o menu dropdown nativo que buga
        const initMenu = setInterval(() => {
            const menu = document.getElementById('menu-dropdown');
            if (menu) { 
                clearInterval(initMenu); 
                document.body.appendChild(menu); 
            }
        }, 200); 

        // logica do botao de menu (toggle)
        const menuBtn = document.getElementById('dashMenuBtn');
        if (menuBtn) {
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                let menu = document.getElementById('menu-dropdown');
                if (!menu) { 
                    menu = document.querySelector('[id*="menu_form_menu_discente"] div') || document.querySelector('.ThemeOfficeSubMenu');
                }
                if (!menu) return;
                
                const isVisible = menu.style.display === 'block';
                menu.style.display = isVisible ? 'none' : 'block';
                
                if (!isVisible) {
                    const rect = menuBtn.getBoundingClientRect();
                    menu.style.position = 'fixed'; 
                    menu.style.top = (rect.bottom + 10) + 'px';
                    menu.style.left = rect.left + 'px';
                    menu.style.zIndex = '999999';
                }
            });

            document.addEventListener('click', (e) => {
                const menu = document.getElementById('menu-dropdown');
                if (menu && menu.style.display === 'block' && !menu.contains(e.target)) {
                    menu.style.display = 'none';
                }
            });
        }
    } else {
        // se tiver em pagina interna (notas, frequencia...), injeta o menu flutuante
        GM_addStyle(`
            #internal-navbar { position: fixed; top: 0; left: 0; right: 0; height: 55px; background-color: #0f172a; color: white; z-index: 9999; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; } 
            .nav-link { background: rgba(255,255,255,0.1); color: white; text-decoration: none; padding: 6px 12px; border-radius: 6px; font-size: 0.85rem; display: flex; align-items: center; gap: 6px; cursor: pointer; border: none; font-family: 'Inter', sans-serif !important; } 
            body { padding-top: 75px !important; background-color: #f1f5f9 !important; font-family: 'Inter', sans-serif !important; } 
            #cabecalho, #rodape, #barra-governo { display: none !important; } 
            #container { width: 96% !important; max-width: 1200px !important; margin: 0 auto !important; background: white !important; border-radius: 12px !important; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1) !important; padding: 30px !important; border: 1px solid #e2e8f0 !important; } 
            table.listagem, table.visualizacao { width: 100%; border-collapse: collapse; margin-bottom: 20px; } 
            table.listagem th { background: #f8fafc !important; color: #475569 !important; padding: 12px !important; text-transform: uppercase; font-size: 0.7rem; border-bottom: 2px solid #e2e8f0; font-family: 'Inter', sans-serif !important; } 
            table.listagem td { padding: 12px !important; border-bottom: 1px solid #f1f5f9 !important; color: #1e293b !important; font-family: 'Inter', sans-serif !important; } 
            .titulo { font-size: 1.25rem !important; color: #0f172a !important; border-bottom: 2px solid #3b82f6 !important; padding-bottom: 8px; margin-bottom: 20px; font-family: 'Inter', sans-serif !important; }
        `);
        const nav = document.createElement('div'); nav.id = "internal-navbar";
        nav.innerHTML = `<div style="display:flex; align-items:center; gap:12px; font-weight:700;"><span>SIGAA Ultimate</span></div><div style="display:flex; gap:10px;"><a href="/sigaa/portais/discente/discente.jsf" class="nav-link">${icons.home} Home</a><button class="nav-link" id="internalMenuBtn">${icons.menu} Menu</button></div>`;
        document.body.prepend(nav);
        const menuBtn = document.getElementById('internalMenuBtn');
        const initMenu = setInterval(() => { const menu = document.getElementById('menu-dropdown'); if (menu) { clearInterval(initMenu); document.body.appendChild(menu); } }, 1000);
        if (menuBtn) {
            let open = false;
            menuBtn.addEventListener('click', (e) => { e.stopPropagation(); const menu = document.getElementById('menu-dropdown'); if (!menu) return; open = !open; menu.style.display = open ? 'block' : 'none'; menu.style.top = '60px'; menu.style.right = '20px'; menu.style.left = 'auto'; });
            document.addEventListener('click', () => { const menu = document.getElementById('menu-dropdown'); if (menu) { open = false; menu.style.display = 'none'; } });
        }
    }
})();