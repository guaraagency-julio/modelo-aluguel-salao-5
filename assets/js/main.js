(function () {
  var d = document;
  var reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); }

  /* entrada da capa */
  function entra() { requestAnimationFrame(function () { d.body.classList.add("pronto"); }); }
  if (d.fonts && d.fonts.ready) {
    var feito = false;
    d.fonts.ready.then(function () { if (!feito) { feito = true; entra(); } });
    setTimeout(function () { if (!feito) { feito = true; entra(); } }, 1400);
  } else { entra(); }

  /* topo e botão flutuante */
  var topo = $("#topo"), flut = $(".wa-flutua");
  function rola() {
    var y = window.scrollY;
    topo.classList.toggle("rolou", y > 10);
    flut.classList.toggle("ver", y > window.innerHeight * 0.7);
    dia();
  }

  /* menu próprio (celular) */
  var bm = $(".topo__menu"), menu = $("#menu");
  function fechaMenu() { bm.setAttribute("aria-expanded", "false"); bm.setAttribute("aria-label", "Abrir menu"); menu.hidden = true; }
  bm.addEventListener("click", function () {
    var abre = bm.getAttribute("aria-expanded") !== "true";
    bm.setAttribute("aria-expanded", String(abre));
    bm.setAttribute("aria-label", abre ? "Fechar menu" : "Abrir menu");
    menu.hidden = !abre;
  });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) fechaMenu(); });
  d.addEventListener("click", function (e) { if (!menu.hidden && !e.target.closest(".topo") && !e.target.closest(".menu")) fechaMenu(); });
  d.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { fechaMenu(); bm.focus(); } });

  /* tira da capa: destaque que gira */
  var tira = $$("#tira li"), ti = 0;
  if (!reduz && tira.length) {
    setInterval(function () {
      tira[ti].classList.remove("on"); ti = (ti + 1) % tira.length; tira[ti].classList.add("on");
    }, 3200);
  }

  /* revelar ao entrar na tela */
  var alvos = $$(".rv");
  if ("IntersectionObserver" in window && !reduz) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    alvos.forEach(function (a) { io.observe(a); });
  } else { alvos.forEach(function (a) { a.classList.add("on"); }); }

  /* filtro das casas */
  var chips = $$(".chip"), cards = $$("#cards .card");
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      var f = c.getAttribute("data-f");
      chips.forEach(function (o) { var on = o === c; o.classList.toggle("on", on); o.setAttribute("aria-pressed", String(on)); });
      cards.forEach(function (k) { k.hidden = !(f === "todos" || k.getAttribute("data-t") === f); });
    });
  });

  /* um dia aqui: item em foco, sol no arco, número grande */
  var itens = $$("#dia-lista .it"), sol = $("#sol"), diaN = $("#dia-n"), diaL = $("#dia-l"), atual = -1;
  function pos(i) {
    var t = itens.length > 1 ? i / (itens.length - 1) : 0;
    var a = Math.PI * (0.04 + 0.92 * t);
    return { x: 200 - 180 * Math.cos(a), y: 180 - 180 * Math.sin(a) };
  }
  function foco(i) {
    if (i === atual) return; atual = i;
    itens.forEach(function (it, k) { it.classList.toggle("on", k === i); });
    var p = pos(i); sol.setAttribute("cx", p.x.toFixed(1)); sol.setAttribute("cy", p.y.toFixed(1));
    diaN.textContent = "0" + (i + 1); diaL.textContent = itens[i].getAttribute("data-l");
  }
  function dia() {
    if (!itens.length) return;
    var mid = window.innerHeight * 0.5, best = 0, bd = 1e9;
    var lista = $("#dia-lista").getBoundingClientRect();
    if (lista.top > window.innerHeight * 0.75) { foco(0); return; }
    itens.forEach(function (it, k) {
      var r = it.getBoundingClientRect(), dist = Math.abs(r.top + r.height / 2 - mid);
      if (dist < bd) { bd = dist; best = k; }
    });
    foco(best);
  }
  itens.forEach(function (it, k) { it.addEventListener("mouseenter", function () { foco(k); }); });
  window.addEventListener("scroll", rola, { passive: true });
  window.addEventListener("resize", rola);
  foco(0); rola();

  /* depoimentos */
  var dps = $$(".dp"), di = 0, dn = $("#dep-n");
  function mostra(i) {
    di = (i + dps.length) % dps.length;
    dps.forEach(function (p, k) { p.classList.toggle("on", k === di); });
    dn.textContent = "0" + (di + 1) + " / 0" + dps.length;
  }
  $("#dep-p").addEventListener("click", function () { mostra(di - 1); });
  $("#dep-s").addEventListener("click", function () { mostra(di + 1); });

  /* perguntas */
  $$(".faq__p").forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.parentNode, abre = !f.classList.contains("on");
      $$(".faq").forEach(function (o) { o.classList.remove("on"); $(".faq__p", o).setAttribute("aria-expanded", "false"); });
      if (abre) { f.classList.add("on"); b.setAttribute("aria-expanded", "true"); }
    });
  });

  /* Os contatos são simulados no modelo. */
  var dlg = $("#contato-demo"), fechar = $("#demo-close");
  $$('[data-demo-contact]').forEach(function (link) { link.addEventListener('click', function (e) { e.preventDefault(); dlg.showModal(); }); });
  fechar.addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  $("#rod-form").addEventListener("submit", function(e) { e.preventDefault(); dlg.showModal(); });
})();
