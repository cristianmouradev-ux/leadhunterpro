<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LeadHunter Pro</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"></script>
<style>
:root{
  --bg:#080c0a;--s1:#0d1410;--s2:#111a15;--s3:#162019;
  --border:rgba(62,207,142,0.08);--border2:rgba(62,207,142,0.15);--border3:rgba(62,207,142,0.3);
  --text:#e8f0eb;--muted:#6b8070;--faint:#2a3d32;
  --green:#3ecf8e;--green2:#2a9e6a;--green-glow:rgba(62,207,142,0.15);
  --green-bg:rgba(62,207,142,0.08);--green-border:rgba(62,207,142,0.25);
  --red:#ff5566;--red-bg:rgba(255,85,102,0.08);--red-border:rgba(255,85,102,0.2);
  --amber:#f59e0b;--blue:#00c4ff;
  --mono:'JetBrains Mono',monospace;--sans:'Space Grotesk',sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;font-family:var(--sans);background:var(--bg);color:var(--text);font-size:14px;line-height:1.5;overflow:hidden}

/* SCROLLBAR */
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--faint);border-radius:2px}
::-webkit-scrollbar-thumb:hover{background:var(--muted)}

.layout{display:grid;grid-template-columns:290px 1fr;height:100vh;overflow:hidden}

/* SIDEBAR */
.sidebar{background:linear-gradient(180deg,var(--s1) 0%,var(--bg) 100%);border-right:1px solid var(--border);display:flex;flex-direction:column;overflow-y:auto;height:100vh;position:relative}
.sidebar::before{content:'';position:absolute;top:0;left:0;right:0;height:200px;background:radial-gradient(ellipse at top left,rgba(62,207,142,0.12) 0%,transparent 70%);pointer-events:none}
.sidebar-inner{padding:20px 18px;display:flex;flex-direction:column;gap:18px;flex:1;position:relative;z-index:1}

/* BRAND */
.brand{display:flex;align-items:center;gap:10px;padding-bottom:4px}
.brand-icon{width:32px;height:32px;background:linear-gradient(135deg,var(--green),var(--green2));border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 0 20px rgba(62,207,142,0.3)}
.brand-logo{font-family:var(--sans);font-size:16px;font-weight:700;letter-spacing:-0.02em}
.brand-logo span{color:var(--green)}
.brand-badge{font-size:8px;text-transform:uppercase;letter-spacing:0.12em;color:var(--green);border:1px solid var(--green-border);border-radius:4px;padding:2px 6px;font-family:var(--mono);background:var(--green-bg)}

/* SECTIONS */
.sec{display:flex;flex-direction:column;gap:8px}
.sec-label{font-size:9px;text-transform:uppercase;letter-spacing:0.12em;color:var(--muted);font-family:var(--mono);padding-bottom:8px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:6px}
.sec-label::before{content:'';width:3px;height:3px;border-radius:50%;background:var(--green);display:inline-block}
.field{display:flex;flex-direction:column;gap:4px}
.flabel{font-size:11px;color:var(--muted);font-weight:500}

input[type=text],select,textarea{
  width:100%;background:var(--s2);border:1px solid var(--border2);border-radius:8px;
  color:var(--text);font-family:var(--sans);font-size:13px;padding:8px 10px;
  outline:none;transition:all .2s;-webkit-appearance:none
}
input[type=text]:focus,select:focus,textarea:focus{border-color:var(--green);box-shadow:0 0 0 3px rgba(62,207,142,0.1)}
input::placeholder{color:var(--faint)}
select option{background:#111a15}
textarea{resize:vertical;line-height:1.6;font-size:12px}

/* TAGS */
.tags-box{display:flex;flex-wrap:wrap;gap:4px;min-height:36px;padding:4px 8px;background:var(--s2);border:1px solid var(--border2);border-radius:8px;cursor:text;align-items:center;transition:all .2s}
.tags-box:focus-within{border-color:var(--green);box-shadow:0 0 0 3px rgba(62,207,142,0.1)}
.tags-box input{border:none;background:transparent;outline:none;font-size:13px;color:var(--text);font-family:var(--sans);min-width:80px;flex:1;height:24px;padding:0}
.tag{display:inline-flex;align-items:center;gap:4px;background:var(--green-bg);border:1px solid var(--green-border);border-radius:6px;padding:2px 8px;font-size:11px;font-family:var(--mono);color:var(--green)}
.tag-x{background:none;border:none;cursor:pointer;color:var(--green);font-size:14px;padding:0;opacity:0.6}
.tag-x:hover{opacity:1}
.sugs{display:flex;flex-wrap:wrap;gap:3px;margin-top:4px}
.sug{font-size:11px;padding:3px 9px;border:1px solid var(--border2);border-radius:20px;background:transparent;color:var(--muted);cursor:pointer;font-family:var(--sans);transition:all .15s}
.sug:hover{color:var(--green);border-color:var(--green-border);background:var(--green-bg)}

/* SLIDERS */
.sl-wrap{display:flex;flex-direction:column;gap:6px;margin-top:2px}
.sl-header{display:flex;justify-content:space-between;align-items:center}
.sl-label{font-size:11px;color:var(--muted)}
.sl-val{font-size:13px;font-weight:600;font-family:var(--mono);color:var(--green);background:var(--green-bg);border:1px solid var(--green-border);border-radius:6px;padding:1px 8px}
.sl-track{position:relative;height:6px;background:var(--s3);border-radius:3px;margin-top:2px}
input[type=range]{
  width:100%;height:6px;background:transparent;-webkit-appearance:none;appearance:none;
  border-radius:3px;cursor:pointer;position:relative;z-index:1
}
input[type=range]::-webkit-slider-thumb{
  -webkit-appearance:none;width:18px;height:18px;border-radius:50%;
  background:var(--green);border:3px solid var(--bg);
  box-shadow:0 0 10px rgba(62,207,142,0.5);cursor:pointer;transition:transform .15s
}
input[type=range]::-webkit-slider-thumb:hover{transform:scale(1.2)}
input[type=range]::-webkit-slider-runnable-track{background:linear-gradient(to right,var(--green) var(--pct,50%),var(--s3) var(--pct,50%));height:6px;border-radius:3px}

/* QTD SLIDER especial */
.qtd-display{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:6px}
.qtd-num{font-size:28px;font-weight:700;font-family:var(--mono);color:var(--green);line-height:1;text-shadow:0 0 20px rgba(62,207,142,0.4)}
.qtd-label{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em}
.qtd-bar{position:relative;height:8px;background:var(--s3);border-radius:4px;overflow:hidden;margin-top:4px}
.qtd-fill{position:absolute;left:0;top:0;height:100%;background:linear-gradient(90deg,var(--green2),var(--green));border-radius:4px;transition:width .2s;box-shadow:0 0 8px rgba(62,207,142,0.4)}

/* PILLS */
.pills{display:flex;gap:4px}
.pill{flex:1;padding:6px 8px;border:1px solid var(--border2);border-radius:8px;font-size:11px;color:var(--muted);cursor:pointer;font-family:var(--sans);background:transparent;transition:all .15s;text-align:center;font-weight:500}
.pill:hover{color:var(--text);border-color:var(--border3)}
.pill.active{color:var(--green);border-color:var(--green-border);background:var(--green-bg);box-shadow:0 0 10px rgba(62,207,142,0.1)}

/* LANG BUTTONS */
.lang-row{display:flex;gap:4px;margin-bottom:6px}
.lbtn{font-size:10px;padding:3px 10px;border:1px solid var(--border2);border-radius:6px;background:transparent;color:var(--muted);cursor:pointer;font-family:var(--mono);transition:all .15s}
.lbtn.active{color:var(--green);background:var(--green-bg);border-color:var(--green-border)}

/* BUTTONS */
.btn-search{
  width:100%;padding:13px;
  background:linear-gradient(135deg,var(--green),var(--green2));
  color:#050a07;border:none;border-radius:10px;font-size:14px;font-weight:700;
  font-family:var(--sans);cursor:pointer;transition:all .2s;
  display:flex;align-items:center;justify-content:center;gap:8px;
  box-shadow:0 4px 20px rgba(62,207,142,0.3);letter-spacing:0.02em
}
.btn-search:hover{box-shadow:0 6px 28px rgba(62,207,142,0.45);transform:translateY(-1px)}
.btn-search:active{transform:scale(0.98)}
.btn-search:disabled{opacity:0.4;cursor:not-allowed;transform:none;box-shadow:none}
.btn-sec{width:100%;padding:8px;background:transparent;color:var(--muted);border:1px solid var(--border);border-radius:8px;font-size:12px;font-family:var(--sans);cursor:pointer;transition:all .15s}
.btn-sec:hover{border-color:var(--border2);color:var(--text)}

/* MAIN */
.main{display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.topbar{background:var(--s1);border-bottom:1px solid var(--border);padding:14px 28px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;backdrop-filter:blur(10px)}
.main-content{flex:1;overflow-y:auto;padding:28px}

.tb-title{font-size:16px;font-weight:600}
.tb-sub{font-size:11px;color:var(--muted);margin-top:2px}
.btn-pdf{display:flex;align-items:center;gap:6px;padding:8px 16px;border:1px solid var(--border2);border-radius:8px;background:transparent;color:var(--text);font-size:12px;font-family:var(--sans);cursor:pointer;transition:all .15s;font-weight:500}
.btn-pdf:hover{border-color:var(--green-border);color:var(--green);background:var(--green-bg)}
.btn-pdf:disabled{opacity:0.3;cursor:not-allowed}

/* STATS */
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
.stat{background:var(--s1);border:1px solid var(--border);border-radius:12px;padding:16px;position:relative;overflow:hidden;transition:border-color .2s}
.stat:hover{border-color:var(--border2)}
.stat::before{content:'';position:absolute;top:0;right:0;width:60px;height:60px;border-radius:50%;opacity:0.06;background:var(--green);transform:translate(20px,-20px)}
.stat-n{font-size:28px;font-weight:700;font-family:var(--mono);line-height:1}
.stat-n.g{color:var(--green);text-shadow:0 0 20px rgba(62,207,142,0.3)}
.stat-n.r{color:var(--red)}
.stat-n.a{color:var(--amber)}
.stat-l{font-size:10px;color:var(--muted);margin-top:6px;text-transform:uppercase;letter-spacing:0.06em;font-weight:500}

/* TABLE */
.tbl-ctrl{display:flex;gap:8px;align-items:center;margin-bottom:12px;flex-wrap:wrap}
.srch{flex:1;min-width:140px;height:34px;background:var(--s2);border:1px solid var(--border2);border-radius:8px;color:var(--text);font-family:var(--sans);font-size:12px;padding:0 10px;outline:none;transition:all .2s}
.srch:focus{border-color:var(--green);box-shadow:0 0 0 3px rgba(62,207,142,0.1)}
.fpill{padding:4px 12px;border:1px solid var(--border2);border-radius:20px;font-size:11px;color:var(--muted);cursor:pointer;background:transparent;font-family:var(--sans);transition:all .15s;font-weight:500}
.fpill.active{color:var(--green);border-color:var(--green-border);background:var(--green-bg)}
.row-ct{font-size:11px;color:var(--faint);font-family:var(--mono);margin-left:auto}

.tbl-wrap{overflow-x:auto;border:1px solid var(--border);border-radius:12px;margin-bottom:28px;background:var(--s1)}
table{width:100%;border-collapse:collapse}
th{font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);font-family:var(--mono);font-weight:500;padding:10px 14px;text-align:left;border-bottom:1px solid var(--border);white-space:nowrap}
td{padding:12px 14px;border-bottom:1px solid var(--border);vertical-align:middle;font-size:12px}
tr:last-child td{border-bottom:none}
tr:hover td{background:rgba(62,207,142,0.03)}

.nome-a{color:var(--text);text-decoration:none;font-weight:600;font-size:13px;display:block;transition:color .15s}
.nome-a:hover{color:var(--green)}
.maps-a{display:inline-flex;align-items:center;gap:3px;font-size:10px;color:var(--muted);text-decoration:none;font-family:var(--mono);margin-top:2px;transition:color .15s}
.maps-a:hover{color:var(--green)}
.dot-sm{width:3px;height:3px;border-radius:50%;background:currentColor;display:inline-block}

.wa-btn{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:rgba(37,211,102,0.1);border:1px solid rgba(37,211,102,0.25);border-radius:6px;color:#25d166;font-size:10px;font-family:var(--mono);text-decoration:none;white-space:nowrap;cursor:pointer;transition:all .15s;font-weight:500}
.wa-btn:hover{background:rgba(37,211,102,0.2);box-shadow:0 0 10px rgba(37,211,102,0.2)}
.wa-icon{width:11px;height:11px;fill:#25d166;flex-shrink:0}
.cp-btn{font-size:10px;padding:3px 8px;border:1px solid var(--border2);border-radius:5px;background:transparent;color:var(--muted);cursor:pointer;font-family:var(--mono);white-space:nowrap;transition:all .15s}
.cp-btn:hover{color:var(--text);border-color:var(--border3)}
.cp-btn.ok{color:var(--green);border-color:var(--green-border);background:var(--green-bg)}

.badge{display:inline-flex;align-items:center;gap:4px;font-size:10px;padding:3px 8px;border-radius:6px;font-family:var(--mono);font-weight:600;white-space:nowrap}
.b-sem{background:var(--green-bg);border:1px solid var(--green-border);color:var(--green)}
.b-tem{background:var(--red-bg);border:1px solid var(--red-border);color:var(--red)}
.stars{color:var(--amber);font-family:var(--mono);font-size:11px;font-weight:600}

/* MSG CARDS */
.msg-sec-title{font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);font-family:var(--mono);margin-bottom:12px;display:flex;align-items:center;gap:8px}
.msg-sec-title::after{content:'';flex:1;height:1px;background:var(--border)}
.msg-cards{display:flex;flex-direction:column;gap:8px;margin-bottom:24px}
.mcard{background:var(--s1);border:1px solid var(--border);border-radius:12px;padding:16px;transition:border-color .2s}
.mcard:hover{border-color:var(--border2)}
.mcard-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;gap:8px;flex-wrap:wrap}
.mcard-nome{font-size:12px;font-weight:600;font-family:var(--mono);display:flex;align-items:center;gap:8px;color:var(--green)}
.mcard-actions{display:flex;gap:6px;align-items:center}
.mcard-body{font-size:12px;color:var(--muted);line-height:1.8;white-space:pre-wrap}

/* LOADING */
.loading-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:400px;gap:24px;text-align:center}
.loading-orb{width:64px;height:64px;position:relative}
.loading-orb::before{content:'';position:absolute;inset:0;border-radius:50%;border:2px solid var(--border2);border-top-color:var(--green);animation:spin 1s linear infinite}
.loading-orb::after{content:'';position:absolute;inset:8px;border-radius:50%;border:2px solid transparent;border-top-color:rgba(62,207,142,0.4);animation:spin 0.6s linear infinite reverse}
@keyframes spin{to{transform:rotate(360deg)}}
.loading-title{font-size:18px;font-weight:600;color:var(--text)}
.loading-sub{font-size:13px;color:var(--muted);max-width:320px;line-height:1.7}
.loading-steps{display:flex;flex-direction:column;gap:8px;width:100%;max-width:340px}
.lstep{display:flex;align-items:center;gap:10px;font-size:11px;color:var(--faint);font-family:var(--mono);padding:8px 12px;border-radius:8px;transition:all .3s}
.lstep.active{color:var(--green);background:var(--green-bg);border:1px solid var(--green-border)}
.lstep-dot{width:6px;height:6px;border-radius:50%;background:currentColor;flex-shrink:0}

/* ONBOARD */
.onboard{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:400px;gap:20px;text-align:center}
.onboard-icon{width:64px;height:64px;border:1px solid var(--border2);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:8px;background:var(--green-bg);box-shadow:0 0 30px rgba(62,207,142,0.1)}
.onboard h3{font-size:20px;font-weight:700;color:var(--text)}
.onboard p{font-size:13px;color:var(--muted);max-width:360px;line-height:1.8}
.steps{display:flex;flex-direction:column;gap:8px;width:100%;max-width:380px;margin-top:8px}
.step{display:flex;gap:12px;align-items:flex-start;background:var(--s1);border:1px solid var(--border);border-radius:10px;padding:12px 16px;text-align:left;transition:border-color .2s}
.step:hover{border-color:var(--border2)}
.step-n{font-family:var(--mono);font-size:11px;color:var(--green);min-width:20px;margin-top:1px;font-weight:600}
.step-txt{font-size:12px;color:var(--muted);line-height:1.6}
.step-txt strong{color:var(--text)}

.error-box{background:var(--red-bg);border:1px solid var(--red-border);border-radius:10px;padding:18px;color:var(--red);font-size:13px;margin-bottom:16px;line-height:1.7}
</style>
</head>
<body>
<div class="layout">

<aside class="sidebar">
<div class="sidebar-inner">

<div class="brand">
  <div class="brand-icon">◎</div>
  <div>
    <div class="brand-logo">Lead<span>Hunter</span></div>
  </div>
  <div class="brand-badge">PRO</div>
</div>

<div class="sec">
  <div class="sec-label">Localização</div>
  <div class="field">
    <div class="flabel">País</div>
    <select id="pais">
      <option>Brasil</option><option>Estados Unidos</option><option>Portugal</option>
      <option>Argentina</option><option>Colômbia</option><option>México</option>
      <option>Espanha</option><option>Reino Unido</option><option>Alemanha</option>
      <option>França</option><option>Itália</option><option>Austrália</option><option>Canadá</option>
    </select>
  </div>
  <div class="field">
    <div class="flabel">Estado / Região</div>
    <input type="text" id="estado" placeholder="Ex: Rio Grande do Sul...">
  </div>
  <div class="field">
    <div class="flabel">Cidade(s)</div>
    <input type="text" id="cidade" placeholder="Ex: Porto Alegre, Caxias...">
  </div>
</div>

<div class="sec">
  <div class="sec-label">Nicho</div>
  <div class="field">
    <div class="flabel">Segmento — Enter para adicionar</div>
    <div class="tags-box" id="nicho-wrap" onclick="focusN()">
      <input type="text" id="ni" placeholder="Ex: pet shop, dentista..." onkeydown="nKey(event)" oninput="nSug(this.value)">
    </div>
    <div class="sugs" id="sugs"></div>
  </div>
</div>

<div class="sec">
  <div class="sec-label">Filtros</div>

  <!-- QUANTIDADE DE LEADS -->
  <div class="field">
    <div class="sl-wrap">
      <div class="sl-header">
        <span class="sl-label">Quantidade de leads</span>
      </div>
      <div class="qtd-display">
        <div>
          <div class="qtd-num" id="qtdNum">20</div>
          <div class="qtd-label">leads</div>
        </div>
      </div>
      <input type="range" min="5" max="100" step="5" value="20" id="qtd"
        oninput="updateQtd(this.value)" style="margin-top:4px">
      <div class="qtd-bar"><div class="qtd-fill" id="qtdFill" style="width:15%"></div></div>
      <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--faint);font-family:var(--mono);margin-top:2px">
        <span>5</span><span>econômico</span><span>100</span>
      </div>
    </div>
  </div>

  <!-- AVALIAÇÃO -->
  <div class="field">
    <div class="sl-wrap">
      <div class="sl-header">
        <span class="sl-label">Avaliação mínima</span>
        <span class="sl-val" id="sV">3.5 ★</span>
      </div>
      <input type="range" min="0" max="5" step="0.5" value="3.5" id="stars"
        oninput="sV.textContent=parseFloat(this.value).toFixed(1)+' ★';updateTrack(this)">
    </div>
  </div>

  <!-- REVIEWS -->
  <div class="field">
    <div class="sl-wrap">
      <div class="sl-header">
        <span class="sl-label">Mínimo de reviews</span>
        <span class="sl-val" id="rV">5</span>
      </div>
      <input type="range" min="0" max="500" step="5" value="5" id="revs"
        oninput="rV.textContent=this.value;updateTrack(this)">
    </div>
  </div>

  <!-- STATUS SITE -->
  <div class="field">
    <div class="flabel">Status de site</div>
    <div class="pills">
      <button class="pill active" data-f="sem" onclick="setF(this)">Sem site</button>
      <button class="pill" data-f="todos" onclick="setF(this)">Todos</button>
      <button class="pill" data-f="com" onclick="setF(this)">Com site</button>
    </div>
  </div>
</div>

<div class="sec">
  <div class="sec-label">Mensagem</div>
  <div class="lang-row">
    <button class="lbtn active" onclick="setLang('pt',this)">PT</button>
    <button class="lbtn" onclick="setLang('en',this)">EN</button>
    <button class="lbtn" onclick="setLang('es',this)">ES</button>
  </div>
  <textarea id="msg-txt" rows="4">Olá, [Nome]! Tudo bem?

Vi que vocês têm ótimas avaliações no Google e quis entrar em contato.

Percebi que ainda não têm um site próprio — isso pode estar custando clientes todo dia. Crio sites para negócios como o de vocês. Posso mostrar exemplos?

[Seu nome]</textarea>
</div>

<div style="display:flex;flex-direction:column;gap:8px;margin-top:auto;padding-top:8px">
  <button class="btn-search" id="btn-buscar" onclick="buscar()">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    Buscar Leads
  </button>
  <button class="btn-sec" onclick="limpar()">Limpar tudo</button>
</div>

</div>
</aside>

<div class="main">
  <div class="topbar">
    <div>
      <div class="tb-title" id="tb-title">LeadHunter Pro</div>
      <div class="tb-sub" id="tb-sub">Prospecção B2B automatizada com IA</div>
    </div>
    <button class="btn-pdf" id="btn-pdf" onclick="gerarPDF()" disabled>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      Baixar PDF
    </button>
  </div>

  <div class="main-content">

    <div id="view-onboard">
      <div class="onboard">
        <div class="onboard-icon">◎</div>
        <h3>Pronto para caçar leads</h3>
        <p>Configure nicho, cidade e filtros na barra lateral, escolha quantos leads quer e clique em <strong style="color:var(--green)">Buscar Leads</strong>.</p>
        <div class="steps">
          <div class="step"><div class="step-n">01</div><div class="step-txt">Preencha <strong>localização e nicho</strong></div></div>
          <div class="step"><div class="step-n">02</div><div class="step-txt">Ajuste os <strong>filtros e quantidade</strong> de leads</div></div>
          <div class="step"><div class="step-n">03</div><div class="step-txt">Clique em <strong>Buscar Leads</strong> e aguarde ~30s</div></div>
          <div class="step"><div class="step-n">04</div><div class="step-txt"><strong>Tabela, WhatsApp, mensagens e PDF</strong> prontos</div></div>
        </div>
      </div>
    </div>

    <div id="view-loading" style="display:none">
      <div class="loading-wrap">
        <div class="loading-orb"></div>
        <div class="loading-title">Caçando leads...</div>
        <div class="loading-sub">A IA está vasculhando o Google Maps e verificando sites. Aguarde até 45 segundos.</div>
        <div class="loading-steps">
          <div class="lstep active"><div class="lstep-dot"></div>Buscando negócios no Google Maps</div>
          <div class="lstep" id="ls2"><div class="lstep-dot"></div>Verificando sites de cada negócio</div>
          <div class="lstep" id="ls3"><div class="lstep-dot"></div>Filtrando por avaliação e reviews</div>
          <div class="lstep" id="ls4"><div class="lstep-dot"></div>Montando tabela de leads</div>
        </div>
      </div>
    </div>

    <div id="view-error" style="display:none">
      <div class="error-box" id="error-msg"></div>
      <button class="btn-sec" style="max-width:200px" onclick="showView('onboard')">Tentar novamente</button>
    </div>

    <div id="view-results" style="display:none">
      <div class="stats">
        <div class="stat"><div class="stat-n" id="st-total">0</div><div class="stat-l">Total encontrado</div></div>
        <div class="stat"><div class="stat-n g" id="st-sem">0</div><div class="stat-l">Sem site</div></div>
        <div class="stat"><div class="stat-n r" id="st-com">0</div><div class="stat-l">Com site</div></div>
        <div class="stat"><div class="stat-n a" id="st-taxa">0%</div><div class="stat-l">Taxa de leads</div></div>
      </div>

      <div class="tbl-ctrl">
        <input class="srch" type="text" id="tbl-srch" placeholder="Filtrar por nome, bairro..." oninput="filtrar()">
        <button class="fpill active" data-tf="todos" onclick="setTF(this)">Todos</button>
        <button class="fpill" data-tf="sem" onclick="setTF(this)">Sem site</button>
        <button class="fpill" data-tf="com" onclick="setTF(this)">Com site</button>
        <span class="row-ct" id="row-ct"></span>
      </div>

      <div class="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th><th>Negócio</th><th>Endereço</th>
              <th>WhatsApp / Tel</th><th>Aval.</th><th>Reviews</th><th>Site</th>
            </tr>
          </thead>
          <tbody id="tbl-body"></tbody>
        </table>
      </div>

      <div id="msg-area"></div>
      <div style="margin-top:16px">
        <button class="btn-sec" style="max-width:200px" onclick="limpar()">Nova busca</button>
      </div>
    </div>

  </div>
</div>
</div>

<script>
const NICHOS=['Pet shop','Clínica dental','Clínica médica','Academia','Hotel','Restaurante','Padaria','Salão de beleza','Ótica','Farmácia','Imobiliária','Mecânica','Escola particular','Contabilidade','Advocacia','Psicologia','Fisioterapia','Estética','Barbearia','Pizzaria','Hamburgueria','Dentist','Law firm','Coffee shop','Gym'];
const MSGS={
  pt:`Olá, [Nome]! Tudo bem?\n\nVi que vocês têm ótimas avaliações no Google e quis entrar em contato.\n\nPercebi que ainda não têm um site próprio — isso pode estar custando clientes todo dia. Crio sites para negócios como o de vocês, focados em atrair clientes locais. Posso mostrar exemplos?\n\n[Seu nome]`,
  en:`Hi [Name],\n\nI found your business on Google — great reviews!\n\nI noticed you don't have a website yet, which could be costing you customers daily. I build websites for local businesses like yours. Want to see examples?\n\nBest, [Your name]`,
  es:`Hola [Nombre],\n\nVi tu negocio en Google y me llamaron la atención las buenas reseñas.\n\nNoté que aún no tienen sitio web — eso podría estar costándoles clientes. Creo sitios para negocios locales. ¿Les muestro ejemplos?\n\nSaludos, [Tu nombre]`
};

let nichos=[],filtroSite='sem',tableFiltro='todos',allLeads=[],currentConfig={};

// SLIDER QUANTIDADE
function updateQtd(v){
  document.getElementById('qtdNum').textContent=v;
  const pct=((v-5)/(100-5))*100;
  document.getElementById('qtdFill').style.width=pct+'%';
  updateTrack(document.getElementById('qtd'));
}
function updateTrack(el){
  const min=parseFloat(el.min)||0,max=parseFloat(el.max)||100,val=parseFloat(el.value)||0;
  const pct=((val-min)/(max-min))*100;
  el.style.setProperty('--pct',pct+'%');
}

// Init sliders
document.addEventListener('DOMContentLoaded',()=>{
  ['stars','revs','qtd'].forEach(id=>{
    const el=document.getElementById(id);
    if(el)updateTrack(el);
  });
  updateQtd(20);
});

function focusN(){document.getElementById('ni').focus()}
function nKey(e){
  if((e.key==='Enter'||e.key===',')&&e.target.value.trim()){
    e.preventDefault();addN(e.target.value.replace(',','').trim());e.target.value='';document.getElementById('sugs').innerHTML='';
  }
  if(e.key==='Backspace'&&e.target.value===''&&nichos.length){nichos.pop();renderTags()}
}
function addN(v){if(v&&!nichos.includes(v)){nichos.push(v);renderTags()}}
function removeN(i){nichos.splice(i,1);renderTags()}
function renderTags(){
  const w=document.getElementById('nicho-wrap'),inp=document.getElementById('ni');
  w.querySelectorAll('.tag').forEach(t=>t.remove());
  nichos.forEach((n,i)=>{const t=document.createElement('div');t.className='tag';t.innerHTML=n+`<button class="tag-x" onclick="removeN(${i})">×</button>`;w.insertBefore(t,inp);});
}
function nSug(q){
  const b=document.getElementById('sugs');
  if(!q){b.innerHTML='';return}
  b.innerHTML=NICHOS.filter(s=>s.toLowerCase().includes(q.toLowerCase())).slice(0,6).map(s=>`<button class="sug" onclick="addNS('${s}')">${s}</button>`).join('');
}
function addNS(v){addN(v);document.getElementById('ni').value='';document.getElementById('sugs').innerHTML=''}
function setF(el){filtroSite=el.dataset.f;document.querySelectorAll('.pill').forEach(p=>p.classList.remove('active'));el.classList.add('active')}
function setTF(el){tableFiltro=el.dataset.tf;document.querySelectorAll('.fpill').forEach(p=>p.classList.remove('active'));el.classList.add('active');filtrar()}
function setLang(l,btn){document.getElementById('msg-txt').value=MSGS[l];document.querySelectorAll('.lbtn').forEach(b=>b.classList.remove('active'));btn.classList.add('active')}
function showView(v){['onboard','loading','error','results'].forEach(id=>document.getElementById('view-'+id).style.display=v===id?'block':'none')}
function mapsUrl(nome,cidade,estado,pais){return`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([nome,cidade,estado,pais].filter(Boolean).join(' '))}`}
function waUrl(tel,msg){const d=tel.replace(/\D/g,'');return`https://api.whatsapp.com/send/?phone=${d}&text=${msg?encodeURIComponent(msg):''}`}

let loadingInterval=null;
function startLoadingAnim(){
  const steps=['ls2','ls3','ls4'];let i=0;
  loadingInterval=setInterval(()=>{if(i<steps.length){document.getElementById(steps[i]).classList.add('active');i++;}else clearInterval(loadingInterval);},10000);
}
function stopLoadingAnim(){
  if(loadingInterval)clearInterval(loadingInterval);
  ['ls2','ls3','ls4'].forEach(id=>document.getElementById(id).classList.remove('active'));
}

async function buscar(){
  const niInput=document.getElementById('ni').value.trim();
  if(niInput)addN(niInput);
  const nichoFinal=nichos.length?nichos.join(', '):niInput;
  const pais=document.getElementById('pais').value;
  const estado=document.getElementById('estado').value.trim();
  const cidade=document.getElementById('cidade').value.trim();
  if(!nichoFinal){alert('Adicione ao menos um nicho.');return}
  if(!cidade&&!estado){alert('Informe ao menos uma cidade ou estado.');return}
  const stars=parseFloat(document.getElementById('stars').value).toFixed(1);
  const revs=document.getElementById('rV').textContent;
  const qtd=document.getElementById('qtd').value;
  const msg=document.getElementById('msg-txt').value;
  const loc=[cidade,estado,pais].filter(Boolean).join(', ');
  currentConfig={nichoFinal,pais,estado,cidade,loc,stars,revs,filtroSite,msg,qtd};
  const btn=document.getElementById('btn-buscar');
  btn.disabled=true;
  showView('loading');
  startLoadingAnim();
  try{
    const res=await fetch('/api/search',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({nicho:nichoFinal,loc,cidade,estado,pais,stars,revs,filtroSite,msg,qtd})
    });
    const data=await res.json();
    if(!res.ok||data.error){
      showView('error');
      document.getElementById('error-msg').innerHTML=`<strong>Erro na busca</strong><br>${data.error||'Tente novamente.'}${data.debug?`<br><small style="opacity:.6">${data.debug}</small>`:''}`;
      return;
    }
    if(!data.leads||!data.leads.length){
      showView('error');
      document.getElementById('error-msg').innerHTML=`<strong>Nenhum lead encontrado</strong><br>Tente outro nicho, cidade diferente ou reduza os filtros.`;
      return;
    }
    allLeads=data.leads;
    renderResults(data.leads);
    showView('results');
    document.getElementById('btn-pdf').disabled=false;
  }catch(err){
    showView('error');
    document.getElementById('error-msg').innerHTML=`<strong>Erro de conexão</strong><br>${err.message}`;
  }finally{
    btn.disabled=false;
    stopLoadingAnim();
  }
}

function renderResults(leads){
  const sem=leads.filter(d=>!d.tem_site).length;
  const com=leads.length-sem;
  const taxa=leads.length?Math.round(sem/leads.length*100):0;
  document.getElementById('st-total').textContent=leads.length;
  document.getElementById('st-sem').textContent=sem;
  document.getElementById('st-com').textContent=com;
  document.getElementById('st-taxa').textContent=taxa+'%';
  document.getElementById('tb-title').textContent=(currentConfig.nichoFinal||'Leads')+' — '+(currentConfig.loc||'');
  document.getElementById('tb-sub').textContent=leads.length+' negócios · '+sem+' leads sem site · mín. '+(currentConfig.stars||'')+'⭐';
  const body=document.getElementById('tbl-body');
  body.innerHTML='';
  leads.forEach((d,i)=>{
    const url=mapsUrl(d.nome,currentConfig.cidade,currentConfig.estado,currentConfig.pais);
    const tel=d.telefone||'';
    const msgBase=document.getElementById('msg-txt').value;
    const mfRow=(msgBase||'').replace(/\[Nome\]/g,d.nome);
    const wa=tel?waUrl(tel,mfRow):null;
    const tr=document.createElement('tr');
    tr.dataset.site=d.tem_site?'com':'sem';
    tr.dataset.text=(d.nome+' '+(d.endereco||'')).toLowerCase();
    tr.innerHTML=`
      <td style="color:var(--faint);font-family:var(--mono);font-size:11px">${i+1}</td>
      <td><a class="nome-a" href="${url}" target="_blank">${d.nome}</a><a class="maps-a" href="${url}" target="_blank"><span class="dot-sm"></span>ver no Maps</a></td>
      <td style="color:var(--muted);font-size:11px">${d.endereco||'—'}</td>
      <td>${tel?`<div style="display:flex;flex-direction:column;gap:4px">${wa?`<a class="wa-btn" href="${wa}" target="_blank"><svg class="wa-icon" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>WhatsApp</a>`:''}
      <div style="display:flex;align-items:center;gap:4px"><span style="font-family:var(--mono);font-size:10px;color:var(--muted)">${tel}</span><button class="cp-btn" onclick="cpTxt('${tel.replace(/'/g,"\\'")}',this)">copiar</button></div></div>`:'<span style="color:var(--faint)">—</span>'}</td>
      <td><span class="stars">${d.avaliacao?'★ '+parseFloat(d.avaliacao).toFixed(1):'—'}</span></td>
      <td style="font-family:var(--mono);font-size:11px">${d.reviews?Number(d.reviews).toLocaleString('pt-BR'):'—'}</td>
      <td>${d.tem_site?'<span class="badge b-tem">tem site</span>':'<span class="badge b-sem">sem site</span>'}</td>`;
    body.appendChild(tr);
  });
  document.getElementById('row-ct').textContent=leads.length+' resultados';
  const semLeads=leads.filter(d=>!d.tem_site);
  const msgArea=document.getElementById('msg-area');
  if(semLeads.length){
    const msgBase=document.getElementById('msg-txt').value;
    msgArea.innerHTML=`<div class="msg-sec-title">${semLeads.length} mensagens prontas</div><div class="msg-cards" id="msg-cards-list"></div>`;
    const cardsList=document.getElementById('msg-cards-list');
    semLeads.forEach(d=>{
      const url=mapsUrl(d.nome,currentConfig.cidade,currentConfig.estado,currentConfig.pais);
      const tel=d.telefone||'';
      const mf=(msgBase||'').replace(/\[Nome\]/g,d.nome);
      const wa=tel?waUrl(tel,mf):null;
      const enc=btoa(unescape(encodeURIComponent(mf)));
      const card=document.createElement('div');card.className='mcard';
      card.innerHTML=`
        <div class="mcard-top">
          <div class="mcard-nome">${d.nome}<a class="maps-a" href="${url}" target="_blank"><span class="dot-sm"></span>maps</a></div>
          <div class="mcard-actions">
            ${wa?`<a class="wa-btn" href="${wa}" target="_blank"><svg class="wa-icon" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>WhatsApp</a>`:''}
            <button class="cp-btn" onclick="cpMsg('${enc}',this)">copiar msg</button>
          </div>
        </div>
        <div class="mcard-body">${mf}</div>`;
      cardsList.appendChild(card);
    });
  }else{msgArea.innerHTML=''}
}

function filtrar(){
  const q=document.getElementById('tbl-srch').value.toLowerCase();
  const rows=document.querySelectorAll('#tbl-body tr');
  let vis=0;
  rows.forEach(r=>{
    const mS=tableFiltro==='todos'||(tableFiltro==='sem'&&r.dataset.site==='sem')||(tableFiltro==='com'&&r.dataset.site==='com');
    const mQ=!q||r.dataset.text.includes(q);
    r.style.display=(mS&&mQ)?'':'none';
    if(mS&&mQ)vis++;
  });
  document.getElementById('row-ct').textContent=vis+' exibindo';
}

function cpTxt(txt,btn){navigator.clipboard.writeText(txt).then(()=>{btn.textContent='✓';btn.classList.add('ok');setTimeout(()=>{btn.textContent='copiar';btn.classList.remove('ok')},2000)})}
function cpMsg(b64,btn){const t=decodeURIComponent(escape(atob(b64)));navigator.clipboard.writeText(t).then(()=>{btn.textContent='✓ copiado';btn.classList.add('ok');setTimeout(()=>{btn.textContent='copiar msg';btn.classList.remove('ok')},2000)})}

function limpar(){
  nichos=[];renderTags();
  ['ni','estado','cidade'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('stars').value=3.5;document.getElementById('sV').textContent='3.5 ★';
  document.getElementById('revs').value=5;document.getElementById('rV').textContent='5';
  document.getElementById('qtd').value=20;updateQtd(20);
  allLeads=[];document.getElementById('btn-pdf').disabled=true;
  showView('onboard');
}

function gerarPDF(){
  if(!allLeads.length)return;
  const{jsPDF}=window.jspdf;
  const doc=new jsPDF({orientation:'landscape',unit:'mm',format:'a4'});
  const W=doc.internal.pageSize.getWidth(),H=doc.internal.pageSize.getHeight();
  const sem=allLeads.filter(d=>!d.tem_site).length,com=allLeads.length-sem;
  doc.setFillColor(8,12,10);doc.rect(0,0,W,22,'F');
  doc.setTextColor(62,207,142);doc.setFontSize(13);doc.setFont('helvetica','bold');doc.text('LeadHunter Pro',10,13);
  doc.setFontSize(8);doc.setFont('helvetica','normal');doc.setTextColor(100,120,110);doc.text('Relatório de Prospecção B2B',10,19);
  doc.setTextColor(180,200,190);doc.setFontSize(8);
  doc.text(new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'}),W-10,13,{align:'right'});
  if(currentConfig.nichoFinal)doc.text(`${currentConfig.nichoFinal} · ${currentConfig.loc}`,W-10,19,{align:'right'});
  const sy=28,bw=62,bh=14,bg=5;
  [{l:'Total',v:allLeads.length,c:[20,30,25],t:[200,220,210]},{l:'Sem site',v:sem,c:[10,35,20],t:[62,207,142]},{l:'Com site',v:com,c:[35,12,12],t:[255,85,102]},{l:'Taxa leads',v:Math.round(sem/allLeads.length*100)+'%',c:[25,25,10],t:[245,158,11]}]
  .forEach((s,i)=>{const x=10+i*(bw+bg);doc.setFillColor(...s.c);doc.roundedRect(x,sy,bw,bh,1.5,1.5,'F');doc.setTextColor(...s.t);doc.setFontSize(12);doc.setFont('helvetica','bold');doc.text(String(s.v),x+bw/2,sy+8,{align:'center'});doc.setTextColor(100,120,110);doc.setFontSize(6.5);doc.setFont('helvetica','normal');doc.text(s.l,x+bw/2,sy+13,{align:'center'});});
  doc.autoTable({
    startY:sy+bh+6,
    head:[['#','Negócio','Endereço','Telefone','Aval.','Reviews','Site']],
    body:allLeads.map((d,i)=>[i+1,d.nome||'—',d.endereco||'—',d.telefone||'—',d.avaliacao?parseFloat(d.avaliacao).toFixed(1)+'★':'—',d.reviews?Number(d.reviews).toLocaleString('pt-BR'):'—',d.tem_site?'Tem site':'Sem site']),
    theme:'plain',
    styles:{fontSize:8,cellPadding:2.5,textColor:[190,210,200],lineColor:[30,45,35],lineWidth:0.2},
    headStyles:{fillColor:[13,20,16],textColor:[80,110,90],fontSize:6.5,fontStyle:'normal'},
    alternateRowStyles:{fillColor:[10,16,12]},
    rowStyles:{fillColor:[8,12,10]},
    columnStyles:{0:{cellWidth:7,halign:'center'},1:{cellWidth:52,fontStyle:'bold',textColor:[220,240,230]},2:{cellWidth:55},3:{cellWidth:36},4:{cellWidth:12,halign:'center'},5:{cellWidth:14,halign:'center'},6:{cellWidth:18,halign:'center'}},
    didParseCell:d=>{if(d.column.index===6&&d.section==='body')d.cell.styles.textColor=d.cell.raw==='Sem site'?[62,207,142]:[255,85,102]},
    margin:{left:10,right:10}
  });
  const np=doc.internal.getNumberOfPages();
  for(let p=1;p<=np;p++){doc.setPage(p);doc.setFillColor(8,12,10);doc.rect(0,H-7,W,7,'F');doc.setTextColor(50,70,60);doc.setFontSize(6.5);doc.setFont('helvetica','normal');doc.text('LeadHunter Pro',10,H-2.5);doc.text(`${p} / ${np}`,W-10,H-2.5,{align:'right'});}
  const fname=`leads_${(currentConfig.nichoFinal||'busca').replace(/[\s,]+/g,'_')}_${new Date().toISOString().slice(0,10)}.pdf`;
  doc.save(fname);
}
</script>
</body>
</html>
