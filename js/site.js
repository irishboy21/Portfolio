// Sidebar toggle, dark mode, active section in the sidebar, figure lightbox, fade-ins.
(function () {
  var root = document.documentElement;
  var body = document.body;
  root.classList.remove("no-js");
  var mobile = window.matchMedia("(max-width: 960px)");

  // ---- Dark mode ----
  var themeBtn = document.querySelector(".theme-btn");
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var cur = root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = cur === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // ---- Sidebar: collapses on desktop, slides over on mobile ----
  var sideBtn = document.querySelector(".side-btn");
  var scrim = document.querySelector(".scrim");
  function closeMobile() { body.classList.remove("side-open"); }
  if (sideBtn) sideBtn.addEventListener("click", function () {
    if (mobile.matches) body.classList.toggle("side-open");
    else body.classList.toggle("side-closed");
  });
  if (scrim) scrim.addEventListener("click", closeMobile);
  document.querySelectorAll(".side-nav a").forEach(function (a) {
    a.addEventListener("click", function () { if (mobile.matches) closeMobile(); });
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMobile(); });

  // ---- Highlight the section in view ----
  var links = document.querySelectorAll(".side-nav a[href^='#']");
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("active"); });
        if (byId[en.target.id]) byId[en.target.id].classList.add("active");
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll(".fade").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".fade").forEach(function (el) { el.classList.add("in"); });
  }

  // ---- Lightbox ----
  var buttons = document.querySelectorAll(".figs button, .explainer button");
  if (buttons.length) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Enlarged figure");
    box.innerHTML = '<button type="button" aria-label="Close">&times;</button><div><img alt=""><p></p></div>';
    body.appendChild(box);
    var img = box.querySelector("img"), cap = box.querySelector("p"), x = box.querySelector("button"), last = null;
    function close() { box.classList.remove("open"); if (last) last.focus(); }
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        var i = b.querySelector("img");
        img.src = i.currentSrc || i.src;
        img.alt = i.alt;
        cap.textContent = i.alt;
        last = b;
        box.classList.add("open");
        x.focus();
      });
    });
    box.addEventListener("click", function (e) { if (e.target === box || e.target === x) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && box.classList.contains("open")) close(); });
  }

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
