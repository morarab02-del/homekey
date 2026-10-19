(function () {
  "use strict";

  /* ---------- helpers ------------------------------------------------- */

  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };

  var LISTINGS = window.ZILLOW_LISTINGS || [];
  var ROOT = window.ROOT || "./";
  var FAV_KEY = "zillow-clone:favorites";

  function byId(id) {
    for (var i = 0; i < LISTINGS.length; i++) if (LISTINGS[i].id === id) return LISTINGS[i];
    return null;
  }

  function money(n) {
    return "$" + n.toLocaleString("en-US");
  }

  function getFavs() {
    try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch (e) { return []; }
  }
  function isFav(id) { return getFavs().indexOf(id) !== -1; }

  function toggleFav(id) {
    var favs = getFavs();
    var i = favs.indexOf(id);
    if (i === -1) { favs.push(id); toast("Saved to favorites"); }
    else { favs.splice(i, 1); toast("Removed from favorites"); }
    try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch (e) {}
    syncFavButtons(id);
    return i === -1;
  }

  function syncFavButtons(id) {
    $$("[data-fav='" + id + "']").forEach(function (btn) {
      var on = isFav(id);
      btn.classList.toggle("is-fav", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.setAttribute("aria-label", on ? "Remove from favorites" : "Save to favorites");
      var svg = btn.querySelector("svg");
      if (svg) svg.setAttribute("fill", on ? "currentColor" : "none");
      var label = btn.querySelector(".fav-label");
      if (label) label.textContent = on ? "Saved" : "Save";
    });
  }

  /* one delegated handler so re-rendered cards never double-bind */
  document.addEventListener("click", function (e) {
    var el = e.target && e.target.closest ? e.target.closest("[data-fav]") : null;
    if (!el || !el.getAttribute) return;
    e.preventDefault();
    e.stopPropagation();
    toggleFav(el.getAttribute("data-fav"));
  });

  var toastTimer;
  function toast(msg) {
    var el = $(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("is-visible"); }, 2200);
  }

  function params() {
    return new URLSearchParams(window.location.search);
  }

  /* ---------- art sprite --------------------------------------------- */

  function injectSprite() {
    if (window.ZILLOW_SPRITE && !document.getElementById("zillow-sprite")) {
      var div = document.createElement("div");
      div.id = "zillow-sprite";
      div.innerHTML = window.ZILLOW_SPRITE;
      document.body.appendChild(div);
    }
  }

  function artStyle(listing) {
    if (!listing || !listing.accent) return "";
    return Object.keys(listing.accent)
      .map(function (k) { return "--art-" + k + ":" + listing.accent[k]; })
      .join(";");
  }

  /* ---------- card template ------------------------------------------ */

  function badgeClass(badge) {
    return { "New": "new", "Price cut": "cut", "Open house": "open" }[badge] || "";
  }

  function cardHTML(l) {
    var badge = l.badge ? '<span class="badge badge--' + badgeClass(l.badge) + '">' + l.badge + "</span>" : "";
    var rentBadge = l.mode === "rent" && !l.badge ? '<span class="badge badge--rent">For rent</span>' : "";
    var price = l.mode === "rent" ? money(l.price) + "/mo" : money(l.price);
    var was = l.priceWas ? "<del>" + money(l.priceWas) + "</del>" : "";
    var specs = l.beds + " bd | " + l.baths + " ba | " + l.sqft.toLocaleString("en-US") + " sqft";
    var meta = [];
    if (l.mode === "sale") meta.push(money(Math.round(l.price / l.sqft)) + "/sqft");
    if (l.openHouse) meta.push("Open " + l.openHouse);
    meta.push(l.daysOn + " day" + (l.daysOn === 1 ? "" : "s") + " on Zillow");

    return (
      '<a class="listing-card" href="' + ROOT + 'property.html?id=' + encodeURIComponent(l.id) + '" data-listing="' + l.id + '">' +
        '<div class="listing-card__media">' +
          '<svg class="listing-card__art art" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style="' + artStyle(l) + '" role="img" aria-label="' + l.address + '">' +
            '<use href="#art-' + l.art + '"></use>' +
          "</svg>" +
          '<div class="listing-card__badges">' + badge + rentBadge + "</div>" +
          '<span class="fav-btn" role="button" tabindex="0" data-fav="' + l.id + '" aria-label="Save to favorites" aria-pressed="' + (isFav(l.id) ? "true" : "false") + '">' +
            '<svg viewBox="0 0 24 24" fill="' + (isFav(l.id) ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21.2l7.7-7.8 1-1a5.5 5.5 0 0 0 .1-7.8z"/></svg>' +
          "</span>" +
          '<span class="listing-card__photo-count">' +
            '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5h4l2-3h6l2 3h4v16H3z"/><circle cx="12" cy="13" r="4"/></svg>' +
            l.photos +
          "</span>" +
        "</div>" +
        '<div class="listing-card__body">' +
          '<div class="listing-card__price">' + price + was + "</div>" +
          '<div class="listing-card__specs">' + specs.split("|").map(function (s, i) { return i === 0 ? "<b>" + s.trim() + "</b>" : '<span class="sep">|</span>' + s.trim(); }).join("") + "</div>" +
          '<div class="listing-card__address">' + l.address + "</div>" +
          '<div class="listing-card__address">' + l.city + ", " + l.state + " " + l.zip + "</div>" +
          '<div class="listing-card__meta">' + meta.map(function (m) { return "<span>" + m + "</span>"; }).join('<span class="dot">&middot;</span>') + "</div>" +
          '<div class="listing-card__broker">' + l.broker + "</div>" +
        "</div>" +
      "</a>"
    );
  }

  function renderCards(target, items) {
    var el = typeof target === "string" ? $(target) : target;
    if (!el) return;
    el.innerHTML = items.map(cardHTML).join("");
  }

  /* ---------- header nav ---------------------------------------------- */

  function initNav() {
    $$(".primary-nav__item").forEach(function (item) {
      var btn = $(".primary-nav__link", item);
      if (!btn) return;
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var open = item.classList.contains("is-open");
        $$(".primary-nav__item").forEach(function (i) { i.classList.remove("is-open"); });
        if (!open) item.classList.add("is-open");
      });
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest || !e.target.closest(".primary-nav__item")) {
        $$(".primary-nav__item").forEach(function (i) { i.classList.remove("is-open"); });
      }
      if (!e.target.closest || !e.target.closest(".filter")) {
        $$(".filter").forEach(function (f) { f.classList.remove("is-open"); });
      }
      if (!e.target.closest || !e.target.closest(".searchbox")) {
        hideSuggestions();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      $$(".primary-nav__item, .filter").forEach(function (el) { el.classList.remove("is-open"); });
      hideSuggestions();
    });

    var toggle = $(".nav-toggle");
    var drawer = $(".mobile-nav");
    if (toggle && drawer) {
      toggle.addEventListener("click", function () {
        drawer.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", drawer.classList.contains("is-open") ? "true" : "false");
      });
    }
  }

  /* ---------- search box ---------------------------------------------- */

  function hideSuggestions() {
    var box = $(".searchbox__suggestions");
    if (box) box.classList.remove("is-visible");
  }

  function initSearchBoxes() {
    $$(".searchbox").forEach(function (box) {
      var input = $("input", box);
      var sug = $(".searchbox__suggestions", box);
      var form = $("form", box) || box;
      if (!input || !sug) return;

      var render = function (q) {
        var list = (window.ZILLOW_SUGGESTIONS || []).filter(function (s) {
          return !q || s.label.toLowerCase().indexOf(q.toLowerCase()) !== -1;
        }).slice(0, 6);
        if (!list.length) { hideSuggestions(); return; }
        sug.innerHTML = list.map(function (s) {
          return (
            '<button type="button" class="suggestion" data-q="' + s.label + '">' +
              '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
              "<span><strong>" + s.label + "</strong><span>" + s.hint + "</span></span>" +
            "</button>"
          );
        }).join("");
        sug.classList.add("is-visible");
      };

      input.addEventListener("focus", function () { render(input.value); });
      input.addEventListener("input", function () { render(input.value); });

      sug.addEventListener("click", function (e) {
        var btn = e.target.closest ? e.target.closest(".suggestion") : null;
        if (!btn) return;
        input.value = btn.getAttribute("data-q");
        hideSuggestions();
        goSearch(input.value, box.getAttribute("data-mode") || "sale");
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        hideSuggestions();
        goSearch(input.value, box.getAttribute("data-mode") || "sale");
      });
    });
  }

  function goSearch(q, mode) {
    var url = ROOT + "homes/for_" + (mode === "rent" ? "rent" : "sale") + "/?q=" + encodeURIComponent(q || "");
    window.location.href = url;
  }

  /* ---------- search results ------------------------------------------ */

  function matchQuery(l, q) {
    if (!q) return true;
    var norm = function (s) { return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim(); };
    var needle = norm(q);
    if (!needle) return true;
    var hay = norm([l.id.replace("zpid-", ""), l.address, l.city, l.state, l.zip, l.neighborhood, l.type].join(" "));
    return needle.split(" ").every(function (word) { return hay.indexOf(word) !== -1; });
  }

  function initResultsPage() {
    var grid = $("#results-grid");
    if (!grid) return;

    var p = params();
    var state = {
      q: p.get("q") || "",
      mode: p.get("mode") || (document.body.getAttribute("data-mode") || "sale"),
      min: p.get("min") ? Number(p.get("min")) : null,
      max: p.get("max") ? Number(p.get("max")) : null,
      beds: p.get("beds") ? Number(p.get("beds")) : null,
      type: p.get("type") || null,
      sort: p.get("sort") || "featured"
    };

    document.title = (state.mode === "rent" ? "Rentals" : "Real Estate & Homes For Sale") + " - Zillow";

    function filtered() {
      var items = LISTINGS.filter(function (l) {
        if (l.mode !== state.mode) return false;
        if (!matchQuery(l, state.q)) return false;
        if (state.min !== null && l.price < state.min) return false;
        if (state.max !== null && l.price > state.max) return false;
        if (state.beds !== null && l.beds < state.beds) return false;
        if (state.type && l.type !== state.type) return false;
        return true;
      });
      var sorters = {
        "price-asc": function (a, b) { return a.price - b.price; },
        "price-desc": function (a, b) { return b.price - a.price; },
        "newest": function (a, b) { return a.daysOn - b.daysOn; },
        "beds": function (a, b) { return b.beds - a.beds; },
        "sqft": function (a, b) { return b.sqft - a.sqft; }
      };
      return items.sort(sorters[state.sort] || function () { return 0; });
    }

    function render() {
      var items = filtered();
      var count = $("#results-count");
      var isRent = state.mode === "rent";
      if (count) count.textContent = items.length + (items.length === 1 ? (isRent ? " rental" : " home") : isRent ? " rentals" : " homes");
      var title = $("#results-title");
      if (title) {
        if (isRent) {
          title.textContent = state.q ? "Rentals in " + state.q : "Rentals & Apartments For Rent";
        } else {
          title.textContent = state.q ? state.q + " Real Estate & Homes For Sale" : "Real Estate & Homes For Sale";
        }
      }
      var sub = $("#results-subtitle");
      if (sub) {
        sub.textContent = state.q
          ? "Homes near " + state.q
          : "Browse homes, rentals and more across the United States";
      }
      if (!items.length) {
        grid.innerHTML =
          '<div class="empty-state">' +
          "<h3>We couldn't find any matching results</h3>" +
          "<p>Try changing or removing some of your filters. Search a wider area, or clear the search to see everything.</p>" +
          '<button type="button" class="btn btn--outline" id="reset-all">Clear all filters</button>' +
          "</div>";
      } else {
        renderCards(grid, items);
      }
      renderPins(items);
      updateFilterLabels();
      var reset = $("#reset-all");
      if (reset) {
        reset.addEventListener("click", function () {
          state.min = state.max = state.beds = state.type = null;
          state.sort = "featured";
          state.q = "";
          if (window.history && history.replaceState) {
            history.replaceState({}, "", window.location.pathname);
          }
          $$(".chip[data-filter]").forEach(function (c) { c.classList.remove("is-active"); });
          var sortSel = $("#sort-select");
          if (sortSel) sortSel.value = "featured";
          render();
        });
      }
    }

    function updateFilterLabels() {
      var bits = [];
      if (state.min !== null || state.max !== null) {
        bits.push(state.min !== null && state.max !== null
          ? money(state.min) + " - " + money(state.max)
          : state.min !== null ? money(state.min) + "+" : "Under " + money(state.max));
      }
      if (state.beds !== null) bits.push(state.beds + "+ bd");
      if (state.type) bits.push(state.type);
      var priceBtn = $("#filter-price-btn");
      if (priceBtn) {
        priceBtn.textContent = bits.length ? bits[0] : "Price";
        priceBtn.classList.toggle("is-active", state.min !== null || state.max !== null);
      }
      var bedsBtn = $("#filter-beds-btn");
      if (bedsBtn) {
        bedsBtn.textContent = state.beds !== null ? state.beds + "+ bd" : "Beds & baths";
        bedsBtn.classList.toggle("is-active", state.beds !== null);
      }
      var typeBtn = $("#filter-type-btn");
      if (typeBtn) {
        typeBtn.textContent = state.type || "Property type";
        typeBtn.classList.toggle("is-active", !!state.type);
      }
    }

    /* filter dropdowns */
    $$(".filter").forEach(function (filter) {
      var btn = $(".filter__btn", filter);
      if (!btn) return;
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = filter.classList.contains("is-open");
        $$(".filter").forEach(function (f) { f.classList.remove("is-open"); });
        if (!open) filter.classList.add("is-open");
      });
    });

    $$(".chip[data-filter]").forEach(function (chip) {
      chip.addEventListener("click", function (e) {
        e.stopPropagation();
        var kind = chip.getAttribute("data-filter");
        var val = chip.getAttribute("data-value");
        if (kind === "type") {
          state.type = state.type === val ? null : val;
          $$('.chip[data-filter="type"]').forEach(function (c) {
            c.classList.toggle("is-active", c.getAttribute("data-value") === state.type);
          });
        } else if (kind === "beds") {
          state.beds = state.beds === Number(val) ? null : Number(val);
          $$('.chip[data-filter="beds"]').forEach(function (c) {
            c.classList.toggle("is-active", Number(c.getAttribute("data-value")) === state.beds);
          });
        } else if (kind === "price") {
          if (val === "any") { state.min = state.max = null; }
          else {
            var range = val.split("-").map(Number);
            state.min = range[0];
            state.max = range[1] ? range[1] : null;
          }
          $$('.chip[data-filter="price"]').forEach(function (c) {
            c.classList.toggle("is-active", c.getAttribute("data-value") === val);
          });
        }
        render();
      });
    });

    var sortSel = $("#sort-select");
    if (sortSel) {
      sortSel.value = state.sort;
      sortSel.addEventListener("change", function () { state.sort = sortSel.value; render(); });
    }

    render();
  }
  /* ---------- map ----------------------------------------------------- */

  var mapZoom = 1;

  function renderPins(items) {
    var layer = $("#map-pins");
    if (!layer) return;
    layer.innerHTML = items.map(function (l) {
      var label = l.mode === "rent" ? money(l.price) : (l.price >= 1000000 ? "$" + (l.price / 1000000).toFixed(1) + "M" : Math.round(l.price / 1000) + "K");
      var active = l.id === state_activeId ? " is-active" : "";
      return (
        '<g class="map-pin' + active + '" data-pin="' + l.id + '" transform="translate(' + (l.pin.x * 10) + "," + (l.pin.y * 8) + ')">' +
          '<rect class="map-pin__body" x="-27" y="-15" width="54" height="30" rx="15"/>' +
          '<text class="map-pin__text" y="5">' + label + "</text>" +
        "</g>"
      );
    }).join("");

    $$("#map-pins .map-pin").forEach(function (pin) {
      pin.addEventListener("click", function () {
        var id = pin.getAttribute("data-pin");
        var card = $('[data-listing="' + id + '"]');
        if (card) {
          card.scrollIntoView({ behavior: "smooth", block: "center" });
          card.style.transition = "box-shadow .2s";
          card.style.boxShadow = "0 0 0 3px var(--z-blue)";
          setTimeout(function () { card.style.boxShadow = ""; }, 1400);
        }
      });
    });
  }

  var state_activeId = null;

  function initMapControls() {
    var world = $("#map-world");
    var inBtn = $("#map-zoom-in");
    var outBtn = $("#map-zoom-out");
    function apply() {
      if (!world) return;
      world.setAttribute("transform", "scale(" + mapZoom + ")");
    }
    if (inBtn) inBtn.addEventListener("click", function () { mapZoom = Math.min(2.2, mapZoom + 0.3); apply(); });
    if (outBtn) outBtn.addEventListener("click", function () { mapZoom = Math.max(0.8, mapZoom - 0.3); apply(); });
  }

  /* ---------- recommended strip (homepage) ---------------------------- */

  function initRecommended() {
    var grid = $("#recommended-grid");
    if (!grid) return;
    var items = (window.ZILLOW_RECOMMENDED || []).map(byId).filter(Boolean);
    renderCards(grid, items);
  }

  /* ---------- property detail page ------------------------------------ */

  var PALETTES = [
    { label: "Front exterior", viewBox: "0 0 400 300", vars: {} },
    { label: "Golden hour", viewBox: "0 0 400 300", vars: { "--art-sky": "#ffe3c2", "--art-lawn": "#e2dfae", "--art-tree": "#8a8a4e" } },
    { label: "Rear garden", viewBox: "196 96 204 204", vars: { "--art-sky": "#e3f0dc" } },
    { label: "Street view", viewBox: "0 70 220 230", vars: { "--art-sky": "#e8eef7" } },
    { label: "Twilight", viewBox: "0 0 400 300", vars: { "--art-sky": "#d5ddf2", "--art-window": "#ffd98a", "--art-lawn": "#b9c9b4", "--art-tree": "#3f6b52" } }
  ];

  function initPropertyPage() {
    var root = $("#pdp");
    if (!root) return;
    var l = byId(params().get("id")) || LISTINGS[0];
    document.title = l.address + ", " + l.city + ", " + l.state + " " + l.zip + " | Zillow";

    var hero = $("#pdp-hero");
    if (hero) {
      var badge = l.badge ? '<span class="badge badge--' + badgeClass(l.badge) + '">' + l.badge + "</span>" : "";
      hero.innerHTML =
        '<div class="pdp__head">' +
          "<div>" +
            badge +
            '<div class="pdp__price">' + (l.mode === "rent" ? money(l.price) + "/mo" : money(l.price)) + (l.priceWas ? " <del style='font-size:20px;color:var(--z-text-3);font-weight:500'>" + money(l.priceWas) + "</del>" : "") + "</div>" +
            '<div class="pdp__specs"><b>' + l.beds + "</b> bds <span class='sep'>|</span> <b>" + l.baths + "</b> ba <span class='sep'>|</span> <b>" + l.sqft.toLocaleString("en-US") + "</b> sqft</div>" +
            '<div class="pdp__address">' + l.address + ", " + l.city + ", " + l.state + " " + l.zip + " &middot; " + l.neighborhood + "</div>" +
          "</div>" +
          '<div class="pdp__actions">' +
            '<button type="button" class="btn btn--ghost" data-fav="' + l.id + '" aria-pressed="' + (isFav(l.id) ? "true" : "false") + '">' +
              '<svg viewBox="0 0 24 24" width="17" height="17" fill="' + (isFav(l.id) ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21.2l7.7-7.8 1-1a5.5 5.5 0 0 0 .1-7.8z"/></svg>' +
              '<span class="fav-label">' + (isFav(l.id) ? "Saved" : "Save") + "</span>" +
            "</button>" +
            '<button type="button" class="btn btn--outline">Share</button>' +
          "</div>" +
        "</div>";
    }

    var gal = $("#pdp-gallery");
    if (gal) {
      gal.innerHTML =
        '<div class="gallery">' +
          '<div class="gallery__stage">' +
            '<svg class="art" viewBox="' + PALETTES[0].viewBox + '" preserveAspectRatio="xMidYMid slice" style="' + artStyle(l) + '" role="img" aria-label="' + l.address + '">' +
              '<use href="#art-' + l.art + '"></use>' +
            "</svg>" +
            '<button type="button" class="gallery__nav gallery__nav--prev" aria-label="Previous photo">&#8249;</button>' +
            '<button type="button" class="gallery__nav gallery__nav--next" aria-label="Next photo">&#8250;</button>' +
            '<span class="gallery__count" id="gallery-count">1 / ' + PALETTES.length + "</span>" +
          "</div>" +
          '<div class="gallery__thumbs" id="gallery-thumbs">' +
            PALETTES.map(function (p, i) {
              var vars = Object.keys(l.accent || {}).map(function (k) {
                return "--art-" + k + ":" + (p.vars["--art-" + k] || l.accent[k]);
              }).join(";");
              return (
                '<button type="button" class="gallery__thumb' + (i === 0 ? " is-active" : "") + '" data-frame="' + i + '" aria-label="' + p.label + '">' +
                  '<svg class="art" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style="' + vars + '" aria-hidden="true"><use href="#art-' + l.art + '"></use></svg>' +
                "</button>"
              );
            }).join("") +
          "</div>" +
        "</div>";
    }

    var facts = $("#pdp-facts");
    if (facts) {
      var rows = [
        ["Type", l.type],
        ["Year built", String(l.yearBuilt)],
        ["Lot size", l.lotSqft ? l.lotSqft.toLocaleString("en-US") + " sqft" : "--"],
        ["Price / sqft", l.mode === "sale" ? money(Math.round(l.price / l.sqft)) : "--"],
        ["HOA", l.hoa ? money(l.hoa) + "/mo" : "None"],
        ["Status", l.badge || l.statusLabel],
        ["Days on Zillow", String(l.daysOn)],
        ["MLS ID", "#" + l.id.replace("zpid-", "")]
      ];
      facts.innerHTML = rows.map(function (r) {
        return '<div class="fact"><div class="fact__label">' + r[0] + '</div><div class="fact__value">' + r[1] + "</div></div>";
      }).join("");
    }

    var desc = $("#pdp-description");
    if (desc) desc.textContent = l.description;

    var feats = $("#pdp-features");
    if (feats) {
      feats.innerHTML = l.features.map(function (f) {
        return "<li><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><path d='M4 12l6 6L20 6'/></svg>" + f + "</li>";
      }).join("");
    }

    var hist = $("#pdp-history");
    if (hist) {
      hist.innerHTML = l.history.map(function (h) {
        return '<div class="timeline__row"><span>' + h.date + " &middot; " + h.event + '</span><span>' + (l.mode === "rent" && h.price < 1000 ? money(h.price) + "/mo" : money(h.price)) + "</span></div>";
      }).join("");
    }

    var agent = $("#pdp-agent");
    if (agent) {
      agent.innerHTML =
        '<div class="agent-card__head">' +
          '<div class="agent-avatar">' + l.agent.initials + "</div>" +
          "<div><div class='agent-card__name'>" + l.agent.name + '</div><div class="agent-card__firm">' + l.agent.firm + "</div></div>" +
        "</div>" +
        '<button type="button" class="btn btn--block btn--lg">Contact agent</button>' +
        '<button type="button" class="btn btn--block" style="margin-top:8px;background:#fff;color:var(--z-text);border:1px solid var(--z-border-strong)">Request a tour</button>' +
        '<p class="agent-card__note">' + l.agent.rating + " agent rating &middot; " + l.agent.sales + " recent sales</p>" +
        (l.zestimate
          ? '<div class="zestimate-box"><div class="zestimate-box__label">Zestimate&reg;</div><div class="zestimate-box__value">' + money(l.zestimate) + '</div><div class="agent-card__note">Not an appraisal</div></div>'
          : "");
    }

    /* gallery interactions */
    var frame = 0;
    var crumb = $("#crumb-city");
    if (crumb) crumb.textContent = l.city + ", " + l.state;
    var stageSvg = $(".gallery__stage .art");
    var countEl = $("#gallery-count");
    function showFrame(i) {
      frame = (i + PALETTES.length) % PALETTES.length;
      var p = PALETTES[frame];
      if (stageSvg) {
        stageSvg.setAttribute("viewBox", p.viewBox);
        var vars = Object.keys(l.accent || {}).map(function (k) {
          return "--art-" + k + ":" + (p.vars["--art-" + k] || l.accent[k]);
        });
        stageSvg.setAttribute("style", vars.join(";"));
      }
      if (countEl) countEl.textContent = (frame + 1) + " / " + PALETTES.length;
      $$("#gallery-thumbs .gallery__thumb").forEach(function (t) {
        t.classList.toggle("is-active", Number(t.getAttribute("data-frame")) === frame);
      });
    }
    var prev = $(".gallery__nav--prev");
    var next = $(".gallery__nav--next");
    if (prev) prev.addEventListener("click", function () { showFrame(frame - 1); });
    if (next) next.addEventListener("click", function () { showFrame(frame + 1); });
    $$("#gallery-thumbs .gallery__thumb").forEach(function (t) {
      t.addEventListener("click", function () { showFrame(Number(t.getAttribute("data-frame"))); });
    });
  }

  /* ---------- boot ---------------------------------------------------- */

  injectSprite();
  initNav();
  initSearchBoxes();
  initRecommended();
  initResultsPage();
  initMapControls();

  if (window.location.pathname.indexOf("property.html") !== -1) {
    initPropertyPage();
  }
})();

