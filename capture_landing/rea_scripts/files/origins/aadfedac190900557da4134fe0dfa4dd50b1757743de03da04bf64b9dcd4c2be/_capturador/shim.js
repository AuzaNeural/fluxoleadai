/* Capturador Completo v5 - shim do espelho local (gerado automaticamente) */
(function () {
  if (window.__capturadorShim) return;
  var C = {"principais":["usefluxai.com.br","usefluxai.com.br"],"externos":{"fonts.googleapis.com":"fonts.googleapis.com","unpkg.com":"unpkg.com","cdn-reach.hostinger.com":"cdn-reach.hostinger.com","fonts.gstatic.com":"fonts.gstatic.com","secure.gravatar.com":"secure.gravatar.com"}};
  var externos = {};
  window.__capturadorShim = { config: C, externos: externos };
  var NativeURL = window.URL;
  function mapear(u) {
    try {
      if (u == null) return u;
      var s = String(u);
      if (!s || /^(data|blob|javascript|about|mailto|tel):/i.test(s)) return u;
      var x = new NativeURL(s, document.baseURI);
      if (x.protocol !== 'http:' && x.protocol !== 'https:') return u;
      if (x.origin === location.origin) return u;
      var hn = x.hostname.toLowerCase().replace(/^www\./, '');
      if (C.principais.indexOf(hn) >= 0) return location.origin + x.pathname + x.search + x.hash;
      var d = C.externos[x.host.toLowerCase()] || C.externos[x.host.toLowerCase().replace(/^www\./, '')];
      if (d) return location.origin + '/_ext/' + d + x.pathname + x.search + x.hash;
      externos[x.host] = (externos[x.host] || 0) + 1;
      return u;
    } catch (e) { return u; }
  }
  function mapearSrcset(v) {
    try { return String(v).split(',').map(function (p) { var t = p.trim().split(/\s+/); t[0] = mapear(t[0]); return t.join(' '); }).join(', '); } catch (e) { return v; }
  }
  window.__capturadorShim.mapear = mapear;
  // new URL('/caminho') sem base (URL absoluta reescrita para raiz) passa a usar a origem local
  try {
    var URLx = function URL(u, b) {
      if (b === undefined && typeof u === 'string' && u.charAt(0) === '/' && u.charAt(1) !== '/') return new NativeURL(u, location.href);
      return b === undefined ? new NativeURL(u) : new NativeURL(u, b);
    };
    URLx.prototype = NativeURL.prototype;
    Object.getOwnPropertyNames(NativeURL).forEach(function (k) { if (!(k in URLx)) try { URLx[k] = NativeURL[k]; } catch (e) {} });
    ['createObjectURL', 'revokeObjectURL', 'canParse', 'parse'].forEach(function (k) { if (NativeURL[k]) URLx[k] = NativeURL[k].bind(NativeURL); });
    window.URL = URLx;
  } catch (e) {}
  try {
    var f0 = window.fetch;
    if (f0) window.fetch = function (input, init) {
      try {
        if (typeof input === 'string' || input instanceof NativeURL) input = mapear(String(input));
        else if (input && input.url) { var m = mapear(input.url); if (m !== input.url) input = new Request(m, input); }
      } catch (e) {}
      return f0.call(this, input, init);
    };
  } catch (e) {}
  try {
    var o0 = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
      var a = Array.prototype.slice.call(arguments); a[1] = mapear(url); return o0.apply(this, a);
    };
  } catch (e) {}
  function prop(proto, nome, fn) {
    try {
      var d = Object.getOwnPropertyDescriptor(proto, nome);
      if (!d || !d.set) return;
      Object.defineProperty(proto, nome, { configurable: true, enumerable: d.enumerable, get: d.get, set: function (v) { d.set.call(this, fn(v)); } });
    } catch (e) {}
  }
  prop(HTMLImageElement.prototype, 'src', mapear);
  prop(HTMLImageElement.prototype, 'srcset', mapearSrcset);
  prop(HTMLScriptElement.prototype, 'src', mapear);
  prop(HTMLLinkElement.prototype, 'href', mapear);
  prop(HTMLMediaElement.prototype, 'src', mapear);
  prop(HTMLSourceElement.prototype, 'src', mapear);
  prop(HTMLSourceElement.prototype, 'srcset', mapearSrcset);
  prop(HTMLIFrameElement.prototype, 'src', mapear);
  prop(HTMLVideoElement.prototype, 'poster', mapear);
  prop(HTMLAnchorElement.prototype, 'href', mapear);
  try {
    var sa = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (n, v) {
      var k = String(n).toLowerCase();
      if (k === 'src' || k === 'href' || k === 'poster' || k === 'xlink:href' || k === 'data') v = mapear(v);
      else if (k === 'srcset' || k === 'imagesrcset') v = mapearSrcset(v);
      return sa.call(this, n, v);
    };
  } catch (e) {}
  ['Worker', 'SharedWorker'].forEach(function (W) {
    try {
      var N = window[W];
      if (!N) return;
      var P = function (u, o) { return new N(mapear(u), o); };
      P.prototype = N.prototype;
      window[W] = P;
    } catch (e) {}
  });
  try {
    if (navigator.serviceWorker) navigator.serviceWorker.register = function () { return Promise.reject(new Error('service worker desativado no espelho local')); };
  } catch (e) {}
  try {
    var css0 = CSSStyleDeclaration.prototype.setProperty;
    CSSStyleDeclaration.prototype.setProperty = function (p, v, pr) {
      if (typeof v === 'string' && v.indexOf('url(') >= 0) v = v.replace(/url\((['"]?)([^'")]+)\1\)/g, function (m, q, u) { return 'url(' + q + mapear(u) + q + ')'; });
      return css0.call(this, p, v, pr);
    };
  } catch (e) {}
})();
