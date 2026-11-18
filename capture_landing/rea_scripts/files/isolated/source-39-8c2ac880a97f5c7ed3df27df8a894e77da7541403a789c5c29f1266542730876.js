
(function () {
  var reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* faixas do portfolio: duplica o conteudo e move em loop; o scroll acelera um pouco */
  var faixas = [].slice.call(document.querySelectorAll(".fxx-fx"));
  function duplicar() { faixas.forEach(function (f) { f.innerHTML += f.innerHTML; f.querySelectorAll("img").forEach(function (i, k) { if (k >= f.querySelectorAll("figure").length / 2) i.alt = ""; }); }); }
  /* projetos marcados como destaque no painel (Admin > Portfolio) substituem a faixa padrao */
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  fetch("/api/public/portfolio").then(function (r) { return r.ok ? r.json() : { items: [] }; }).catch(function () { return { items: [] }; }).then(function (d) {
    var itens = (d && d.items) || [];
    if (itens.length >= 3) {
      var meio = Math.ceil(itens.length / 2);
      [itens.slice(0, meio), itens.slice(meio).length ? itens.slice(meio) : itens.slice(0, meio)].forEach(function (lista, k) {
        if (!faixas[k]) return;
        faixas[k].innerHTML = lista.map(function (p) {
          return '<figure class="fxx-site"><a href="/portfolio/' + encodeURIComponent(p.slug) + '" aria-label="' + esc(p.name) + '"><div class="fxx-site__bar"><i></i><i></i><i></i><span></span></div><img src="' + esc(p.cover) + '" alt="Site ' + esc(p.name) + '" loading="lazy" width="1200" height="681"></a></figure>';
        }).join("");
      });
    }
    duplicar();
  });
  var off = 0, extra = 0, ultimoY = scrollY, visivel = false;
  var sec = document.getElementById("portfolio");
  if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { visivel = e[0].isIntersecting; }).observe(sec);
  addEventListener("scroll", function () { extra += Math.abs(scrollY - ultimoY) * 0.15; ultimoY = scrollY; }, { passive: true });
  function passo() {
    requestAnimationFrame(passo);
    if (!visivel || reduz) return;
    extra *= 0.92; off += 0.6 + extra;
    faixas.forEach(function (f) {
      var meia = f.scrollWidth / 2, d = +f.dataset.fxxDir, x = off % meia;
      f.style.transform = "translate3d(" + (d < 0 ? -x : x - meia) + "px,0,0)";
    });
  }
  requestAnimationFrame(passo);

  /* depoimentos: leque de celulares sincronizado com a lista */
  var cels = [].slice.call(document.querySelectorAll("#fxx-leque .fxx-cel"));
  var qs = [].slice.call(document.querySelectorAll("#fxx-lista .fxx-q"));
  var atual = 0, timer = null, T = 5000;
  document.getElementById("fxx-lista").style.setProperty("--fxx-t", T / 1000 + "s");
  function mostra(k) {
    atual = (k + cels.length) % cels.length;
    cels.forEach(function (c, i) {
      var r = (i - atual + cels.length) % cels.length; if (r > 2) r -= cels.length;
      var x = r * (innerWidth < 900 ? 70 : 92), rot = r * 8, z = -Math.abs(r) * 140, esc = 1 - Math.abs(r) * 0.08;
      c.style.transform = "translateX(" + x + "px) translateZ(" + z + "px) rotate(" + rot + "deg) scale(" + esc + ")";
      c.style.zIndex = 10 - Math.abs(r);
      c.style.filter = r === 0 ? "none" : "brightness(.45) blur(" + Math.abs(r) + "px)";
      c.style.opacity = Math.abs(r) > 2 ? 0 : 1;
      c.classList.toggle("on", r === 0);
    });
    qs.forEach(function (q, i) { q.classList.remove("on"); void q.offsetWidth; q.classList.toggle("on", i === atual); });
    clearTimeout(timer); if (!reduz) timer = setTimeout(function () { mostra(atual + 1); }, T);
  }
  cels.forEach(function (c, i) { c.addEventListener("click", function () { mostra(i); }); });
  qs.forEach(function (q, i) { q.addEventListener("click", function () { mostra(i); }); });
  mostra(0);
})();
