/*
 * Fluxo Lead — consentimento de cookies (LGPD) + Google Consent Mode v2 + carregamento das ferramentas.
 * Modo BASICO: nenhuma tag opcional (GA4, GTM, Google Ads, Meta, TikTok) e carregada antes da escolha;
 * o estado padrao do Consent Mode e "denied" para tudo que depende de consentimento.
 * Configuracao em window.__FL_CFG (so IDs publicos), injetada pelo servidor.
 * API: window.flConsent.open() | .get() ; window.flTrack(evento, params, { id })
 */
(function () {
  "use strict";
  if (window.flConsent) return;
  var CFG = window.__FL_CFG || {};
  var VERSAO = 1;
  var COOKIE = "fl_consent";
  var DIAS = 180;

  // ---------------------------------------------------------------- Consent Mode v2 (antes de qualquer tag Google)
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
    wait_for_update: 500,
  });
  gtag("set", "ads_data_redaction", true);

  // ---------------------------------------------------------------- estado salvo
  function ler() {
    var m = document.cookie.match(/(?:^|;\s*)fl_consent=([^;]+)/);
    if (!m) return null;
    try {
      var s = JSON.parse(decodeURIComponent(m[1]));
      return s && s.v === VERSAO ? s : null;
    } catch (e) { return null; }
  }
  function gravar(s) {
    var seguro = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = COOKIE + "=" + encodeURIComponent(JSON.stringify(s)) + "; Max-Age=" + DIAS * 86400 + "; Path=/; SameSite=Lax" + seguro;
  }
  function novoId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }
  function registrar(s, acao) {
    try {
      var corpo = JSON.stringify({ id: s.id, v: s.v, a: s.a, m: s.m, p: s.p, action: acao });
      if (navigator.sendBeacon) navigator.sendBeacon("/api/consent", new Blob([corpo], { type: "application/json" }));
      else fetch("/api/consent", { method: "POST", headers: { "Content-Type": "application/json" }, body: corpo, keepalive: true });
    } catch (e) {}
  }

  // ---------------------------------------------------------------- carregamento das ferramentas
  var carregado = {};
  function script(src, id) {
    if (carregado[id]) return;
    carregado[id] = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = src;
    s.setAttribute("data-fl", id);
    document.head.appendChild(s);
  }
  var gtagPronto = false;
  function carregarGtag(id) {
    if (!gtagPronto) {
      script("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id), "gtag");
      gtag("js", new Date());
      gtagPronto = true;
    }
  }
  function aplicar(s) {
    gtag("consent", "update", {
      analytics_storage: s.a ? "granted" : "denied",
      ad_storage: s.m ? "granted" : "denied",
      ad_user_data: s.m ? "granted" : "denied",
      ad_personalization: s.m && CFG.ads && CFG.ads.remarketing ? "granted" : "denied",
      functionality_storage: s.p ? "granted" : "denied",
      personalization_storage: s.p ? "granted" : "denied",
    });
    window.dataLayer.push({ event: "fl_consent", fl_analytics: !!s.a, fl_marketing: !!s.m, fl_preferences: !!s.p });
    // GTM organiza as tags quando configurado; nesse caso GA4/Ads NAO sao carregados direto (evita duplicar)
    if (CFG.gtm && (s.a || s.m)) {
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      script("https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(CFG.gtm), "gtm");
    } else if (!CFG.gtm) {
      if (CFG.ga4 && s.a) {
        carregarGtag(CFG.ga4);
        gtag("config", CFG.ga4, { anonymize_ip: true });
      }
      if (CFG.ads && CFG.ads.id && s.m) {
        carregarGtag(CFG.ads.id);
        gtag("config", CFG.ads.id, { allow_ad_personalization_signals: !!CFG.ads.remarketing });
      }
    }
    if (CFG.meta && s.m && !carregado.meta) {
      /* eslint-disable */
      !function (f, b, e, v, n, t, s2) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; }(window, document);
      /* eslint-enable */
      script("https://connect.facebook.net/en_US/fbevents.js", "meta");
      window.fbq("consent", "grant");
      window.fbq("init", CFG.meta);
      window.fbq("track", "PageView");
    }
    if (CFG.tiktok && s.m && !carregado.tiktok) {
      var ttq = (window.ttq = window.ttq || []);
      ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
      ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; };
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      script("https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=" + encodeURIComponent(CFG.tiktok) + "&lib=ttq", "tiktok");
      ttq.page();
    }
  }

  // cookies das ferramentas apagados ao revogar
  var PREFIXOS = ["_ga", "_gid", "_gat", "_gcl", "_fbp", "_fbc", "_ttp", "tt_", "_tt_"];
  function apagarCookiesOpcionais() {
    var dominios = ["", location.hostname, "." + location.hostname.split(".").slice(-2).join(".")];
    document.cookie.split(";").forEach(function (c) {
      var nome = c.split("=")[0].trim();
      if (!PREFIXOS.some(function (p) { return nome.indexOf(p) === 0; })) return;
      dominios.forEach(function (d) { document.cookie = nome + "=; Max-Age=0; Path=/" + (d ? "; Domain=" + d : ""); });
    });
  }

  var atual = ler();
  var temFerramenta = !!(CFG.ga4 || CFG.gtm || (CFG.ads && CFG.ads.id) || CFG.meta || CFG.tiktok);

  function decidir(a, m, p, acao) {
    var antes = atual;
    var s = { v: VERSAO, id: (antes && antes.id) || novoId(), a: !!a, m: !!m, p: !!p, t: Date.now() };
    gravar(s);
    atual = s;
    registrar(s, acao);
    fecharBanner();
    mostrarAtalho();
    var revogou = antes && ((antes.a && !s.a) || (antes.m && !s.m) || (antes.p && !s.p));
    if (revogou) {
      gtag("consent", "update", { analytics_storage: s.a ? "granted" : "denied", ad_storage: s.m ? "granted" : "denied", ad_user_data: s.m ? "granted" : "denied", ad_personalization: "denied" });
      if (window.fbq && !s.m) window.fbq("consent", "revoke");
      apagarCookiesOpcionais();
      // tags ja carregadas nao "descarregam": recarrega a pagina sem elas
      setTimeout(function () { location.reload(); }, 150);
      return;
    }
    aplicar(s);
    document.dispatchEvent(new CustomEvent("fl:consent", { detail: s }));
  }

  // ---------------------------------------------------------------- interface (banner + preferencias)
  var CSS =
    ".flc{position:fixed;z-index:2147483000;left:auto;right:16px;bottom:16px;width:min(560px,calc(100vw - 32px));margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;color:#e9e9e9;background:rgba(14,14,14,.97);border:1px solid rgba(255,255,255,.12);border-radius:20px;box-shadow:0 30px 80px -20px rgba(0,0,0,.9),0 0 0 1px rgba(250,38,0,.08);padding:20px 22px;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);font-size:14px;line-height:1.5}" +
    ".flc *{box-sizing:border-box;text-transform:none;letter-spacing:normal;text-shadow:none}.flc p,.flc h2{line-height:1.5}" +
    ".flc button,.flc-fab{text-transform:none!important;letter-spacing:normal!important;text-decoration:none;margin:0;width:auto;line-height:1.2;box-shadow:none}" +
    ".flc h2{margin:0 0 6px;font-size:16px;font-weight:600;color:#fff;font-family:'Rethink Sans',Inter,sans-serif}" +
    ".flc p{margin:0;color:#b9b9b9}.flc a{color:#ff6a3d;text-decoration:underline}" +
    ".flc__row{display:flex;flex-direction:column;align-items:stretch;gap:14px}.flc__txt{flex:1 1 auto}" +
    ".flc__btns{display:flex;flex-wrap:wrap;gap:8px}.flc__btns button{flex:1 1 0;padding:0 12px;white-space:nowrap}" +
    ".flc button{font:inherit;font-weight:600;font-size:14px;min-height:44px;padding:0 18px;border-radius:999px;cursor:pointer;border:1px solid rgba(255,255,255,.22);background:#1c1c1c;color:#fff;transition:background .2s,border-color .2s}" +
    ".flc button:hover{background:#262626;border-color:rgba(255,255,255,.4)}.flc button:focus-visible{outline:2px solid #ff6a3d;outline-offset:2px}" +
    ".flc .flc__pri{background:#f2f2f2;color:#111;border-color:#f2f2f2}.flc .flc__pri:hover{background:#fff;border-color:#fff}" +
    ".flc__cats{margin:14px 0 4px;display:grid;gap:10px}.flc__cat{display:flex;gap:12px;align-items:flex-start;padding:12px 14px;border:1px solid rgba(255,255,255,.1);border-radius:14px;background:rgba(255,255,255,.02)}" +
    ".flc__cat b{display:block;color:#fff;font-weight:600}.flc__cat small{display:block;color:#9a9a9a;font-size:12.5px}" +
    ".flc__cat input{appearance:none;-webkit-appearance:none;flex:none;margin-top:2px;width:40px;height:24px;border-radius:999px;background:#333;position:relative;cursor:pointer;transition:background .2s}" +
    ".flc__cat input:before{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .2s}" +
    ".flc__cat input:checked{background:#fa2600}.flc__cat input:checked:before{transform:translateX(16px)}.flc__cat input:disabled{opacity:.6;cursor:not-allowed}" +
    ".flc__cat input:focus-visible{outline:2px solid #ff6a3d;outline-offset:2px}" +
    ".flc-fab{position:fixed;z-index:2147482999;right:14px;bottom:14px;width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,.18);background:rgba(14,14,14,.9);color:#cfcfcf;display:grid;place-items:center;cursor:pointer;opacity:.75;transition:opacity .2s}" +
    ".flc-fab:hover,.flc-fab:focus-visible{opacity:1}.flc-fab svg{width:20px;height:20px}" +
    "@media (max-width:560px){.flc{left:8px;right:8px;bottom:8px;width:auto;padding:16px}.flc__btns{width:100%}.flc__btns button{flex:1 1 calc(50% - 4px);padding:0 10px;white-space:nowrap}.flc__btns button:last-child{flex-basis:100%}}" +
    "@media (prefers-reduced-motion:reduce){.flc *{transition:none!important}}";

  var raiz = null;
  var atalho = null;
  function estilos() {
    if (document.getElementById("flc-css")) return;
    var st = document.createElement("style");
    st.id = "flc-css";
    st.textContent = CSS;
    document.head.appendChild(st);
  }
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }
  function fecharBanner() {
    if (raiz) { raiz.remove(); raiz = null; }
  }
  function mostrarAtalho() {
    if (atalho || !document.body) return;
    estilos();
    atalho = el("button", { type: "button", class: "flc-fab", "aria-label": "Preferências de cookies", title: "Preferências de cookies" },
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M21 12.5A9 9 0 1 1 11.5 3a3 3 0 0 0 4 3.5 3 3 0 0 0 3.5 4 3 3 0 0 0 2 2Z"/><circle cx="8.5" cy="10" r="1"/><circle cx="12" cy="15.5" r="1"/><circle cx="15.5" cy="12" r="1"/></svg>');
    atalho.addEventListener("click", function () { abrir(true); });
    document.body.appendChild(atalho);
  }
  var POLITICA = (CFG.policy || "/politica-de-cookies");
  function abrir(personalizar) {
    estilos();
    fecharBanner();
    raiz = el("section", { class: "flc", role: "dialog", "aria-live": "polite", "aria-labelledby": "flc-t", "aria-describedby": "flc-d" });
    var s = atual || { a: false, m: false, p: false };
    var texto =
      '<div class="flc__txt"><h2 id="flc-t">Sua privacidade</h2><p id="flc-d">Usamos cookies necessários para o site funcionar. ' +
      (temFerramenta ? "Com a sua autorização, também usamos cookies de medição e de marketing para entender o uso do site e medir campanhas. " : "No momento não usamos cookies de medição nem de publicidade. ") +
      'Você pode mudar de ideia quando quiser. <a href="' + POLITICA + '">Política de Cookies</a></p></div>';
    if (!personalizar) {
      raiz.innerHTML = '<div class="flc__row">' + texto + '<div class="flc__btns"><button type="button" class="flc__pri" data-a="reject">Rejeitar opcionais</button><button type="button" data-a="custom">Personalizar</button><button type="button" class="flc__pri" data-a="accept">Aceitar todos</button></div></div>';
    } else {
      var cat = function (id, nome, desc, marcado, bloqueado) {
        return '<label class="flc__cat"><input type="checkbox" id="flc-' + id + '"' + (marcado ? " checked" : "") + (bloqueado ? " disabled" : "") + '><span><b>' + nome + "</b><small>" + desc + "</small></span></label>";
      };
      raiz.innerHTML = texto +
        '<div class="flc__cats">' +
        cat("n", "Necessários", "Login, segurança e a sua escolha de cookies. Sempre ativos, porque o site não funciona sem eles.", true, true) +
        cat("a", "Analíticos", "Medem visitas e uso das páginas (Google Analytics), sem identificar você diretamente.", s.a, false) +
        cat("m", "Marketing", "Medem resultados de anúncios e permitem anúncios relacionados (Google Ads, Meta, TikTok).", s.m, false) +
        cat("p", "Preferências", "Guardam escolhas de exibição. Hoje não usamos nenhum cookie desta categoria.", s.p, false) +
        '</div><div class="flc__row"><span></span><div class="flc__btns"><button type="button" class="flc__pri" data-a="reject">Rejeitar opcionais</button><button type="button" data-a="save">Salvar escolhas</button><button type="button" class="flc__pri" data-a="accept">Aceitar todos</button></div></div>';
    }
    raiz.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("button[data-a]");
      if (!b) return;
      var a = b.getAttribute("data-a");
      if (a === "accept") decidir(true, true, true, "accept_all");
      else if (a === "reject") decidir(false, false, false, atual ? "revoke_or_reject" : "reject_all");
      else if (a === "custom") abrir(true);
      else if (a === "save") decidir(raiz.querySelector("#flc-a").checked, raiz.querySelector("#flc-m").checked, raiz.querySelector("#flc-p").checked, "custom");
    });
    document.body.appendChild(raiz);
    var foco = raiz.querySelector("button");
    if (personalizar && foco) foco.focus({ preventScroll: true });
  }

  // ---------------------------------------------------------------- eventos (sem dados pessoais)
  var PERMITIDOS = { value: 1, currency: 1, method: 1, plan: 1, search_term: 1, content_name: 1, content_category: 1, transaction_id: 1, items_count: 1 };
  function limpar(p) {
    var o = {};
    for (var k in p || {}) {
      if (!PERMITIDOS[k]) continue;
      var v = p[k];
      if (typeof v === "string") {
        // nunca sai e-mail nem nada com cara de telefone/documento (8+ digitos), exceto o id da transacao
        if (v.indexOf("@") >= 0) continue;
        if (k !== "transaction_id" && v.replace(/\D/g, "").length >= 8) continue;
        v = v.slice(0, 100);
      }
      o[k] = v;
    }
    return o;
  }
  var META = { sign_up: "CompleteRegistration", generate_lead: "Lead", begin_checkout: "InitiateCheckout", purchase: "Purchase", view_pricing: "ViewContent", contact_click: "Contact", whatsapp_click: "Contact" };
  var TIKTOK = { sign_up: "CompleteRegistration", generate_lead: "SubmitForm", begin_checkout: "InitiateCheckout", purchase: "CompletePayment", view_pricing: "ViewContent", contact_click: "Contact", whatsapp_click: "Contact" };
  var enviados = {};
  try { enviados = JSON.parse(sessionStorage.getItem("fl_ev") || "{}"); } catch (e) {}

  function track(nome, params, opts) {
    var id = (opts && opts.id) || nome + "-" + novoId();
    if (enviados[id]) return false; // ja enviado nesta sessao: nada de duplicar
    enviados[id] = 1;
    try { sessionStorage.setItem("fl_ev", JSON.stringify(enviados)); } catch (e) {}
    var p = limpar(params);
    var s = atual;
    // sem consentimento nada sai do navegador (o dataLayer fica so na memoria da pagina)
    window.dataLayer.push(Object.assign({ event: nome, event_id: id }, p));
    if (!s || (!s.a && !s.m)) return false;
    if (!CFG.gtm) {
      if (CFG.ga4 && s.a && gtagPronto) gtag("event", nome, Object.assign({ event_id: id }, p));
      var rotulo = CFG.ads && CFG.ads.labels && CFG.ads.labels[nome];
      if (rotulo && s.m && gtagPronto) gtag("event", "conversion", Object.assign({ send_to: CFG.ads.id + "/" + rotulo, transaction_id: p.transaction_id || id }, p.value != null ? { value: p.value, currency: p.currency || "BRL" } : {}));
    }
    if (CFG.meta && s.m && window.fbq && META[nome]) window.fbq("track", META[nome], p.value != null ? { value: p.value, currency: p.currency || "BRL" } : {}, { eventID: id });
    if (CFG.tiktok && s.m && window.ttq && TIKTOK[nome]) window.ttq.track(TIKTOK[nome], p.value != null ? { value: p.value, currency: p.currency || "BRL" } : {}, { event_id: id });
    return true;
  }

  // cliques de contato (funciona tambem na landing estatica)
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href],[data-fl-event],[data-fl-cookie-settings]");
    if (!a) return;
    if (a.hasAttribute("data-fl-cookie-settings")) { e.preventDefault(); abrir(true); return; }
    var ev = a.getAttribute("data-fl-event");
    var href = a.getAttribute("href") || "";
    if (!ev && /^(https?:)?\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)/.test(href)) ev = "whatsapp_click";
    if (!ev && /^(mailto:|tel:)/.test(href)) ev = "contact_click";
    if (ev) track(ev, { content_name: location.pathname });
  }, true);

  // visualizacao da secao/pagina de precos (uma vez por pagina)
  function observarPrecos() {
    var alvo = document.querySelector("[data-fl-pricing],#valor");
    if (!alvo || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (ents) {
      if (ents.some(function (x) { return x.isIntersecting; })) { track("view_pricing", { content_name: location.pathname }, { id: "view_pricing-" + location.pathname + "-" + (performance.timeOrigin | 0) }); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(alvo);
  }

  window.flTrack = track;
  window.flConsent = {
    open: function () { abrir(true); },
    get: function () { return atual ? { analytics: atual.a, marketing: atual.m, preferences: atual.p } : null; },
    version: VERSAO,
  };

  function iniciar() {
    if (atual) { aplicar(atual); mostrarAtalho(); }
    else abrir(false);
    observarPrecos();
    document.dispatchEvent(new CustomEvent("fl:ready"));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
