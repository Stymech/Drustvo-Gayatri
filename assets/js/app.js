async function includePartials() {
  const nodes = document.querySelectorAll("[data-include]");
  await Promise.all([...nodes].map(async (node) => {
    const url = node.getAttribute("data-include");
    const res = await fetch(url, { cache: "no-store" });
    node.outerHTML = await res.text();
  }));
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("primary-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    menu.classList.toggle("open", !expanded);
  });

  // Close mobile menu on link click
  menu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("open");
    });
  });
}

async function loadPeople() {
  const res = await fetch("data/people.json", { cache: "no-store" });
  return res.json();
}

/* PEOPLE PAGE */
async function initPeoplePage() {
  const grid = document.getElementById("people-grid");
  if (!grid) return;
  const people = await loadPeople();

  const render = (items) => {
    grid.innerHTML = items.map(p => `
      <article class="person-card">
        <a class="card-link" href="person.html?slug=${encodeURIComponent(p.slug)}" aria-label="Open ${p.name}">
          <img src="assets/${p.photo}" alt="Portret: ${p.name}" loading="lazy" />
          <div class="card-body">
            <h3>${p.name}</h3>
            ${p.teaser ? `<p class="muted small">${p.teaser}</p>` : ""}
          </div>
        </a>
      </article>
    `).join("");
  };

  render(people);
}

/* PERSON PAGE */
function getParam(name) {
  return new URLSearchParams(location.search).get(name);
}

async function initPersonPage() {
  const root = document.getElementById("person-root");
  if (!root) return;

  const slug = getParam("slug");
  const people = await loadPeople();
  const p = people.find(x => x.slug === slug);

  if (!p) {
    document.title = "Not found â€” Društvo Gayatri";
    root.innerHTML = `<p class="muted">Oseba ni najdena. <a href="people.html">Nazaj na Ljudje</a></p>`;
    const band = document.getElementById("contact");
    if (band) band.hidden = true;
    return;
  }

  document.title = `${p.name} â€” Društvo Gayatri`;

  root.innerHTML = `
    <div class="person-text">
      <h1 class="person-title">${p.name}</h1>
      ${p.bio?.map(par => `<p>${par}</p>`).join("") ?? ""}
      ${p.specialties?.length ? `<p><strong>Specialties:</strong> ${p.specialties.join(", ")}</p>` : ""}
    </div>
    <div class="person-photo">
      <img src="assets/${p.photo}" alt="Portret: ${p.name}" />
    </div>
  `;

  // CONTACT CARD
  const card = document.getElementById("contact-card");
  if (!card) return;

  const hasPhone = !!p.phone;
  const hasEmail = !!p.email;

  if (hasPhone || hasEmail) {
    card.innerHTML = `
      <h2>Kontakt</h2>
      <h3>${p.name}</h3>
      <p>
        ${hasPhone ? `Telefon: <a href="tel:${p.phone.replace(/\s+/g,"")}">${p.phone}</a><br>` : ""}
        ${hasEmail ? `E-pošta: <a href="mailto:${p.email}">${p.email}</a>` : ""}
      </p>
    `;
  } else {
    card.innerHTML = `
      <h2>Kontakt</h2>
      <p class="muted">Direct contact for this person is not available.</p>
      <p>Write to the association: <a href="mailto:shantaya.rose10@gmail.com">shantaya.rose10@gmail.com</a></p>
      <p>FB group:
        <a href="https://www.facebook.com/groups/438004130708274/" target="_blank" rel="noopener noreferrer">
          Zdravilno meditativni večeri, začinjeni z iskrico čarovnije.
        </a>
      </p>
    `;
  }
}

/* Footer year */
function setYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

/* Carousel (variable width images, fixed height) */
function initCarousel() {
  const carousel = document.querySelector(".carousel");
  if (!carousel) return;
  const track = carousel.querySelector(".carousel-track");
  const slides = [...carousel.querySelectorAll(".slide")];
  const prev = carousel.querySelector(".carousel-prev");
  const next = carousel.querySelector(".carousel-next");

  let i = 0;
  function go(n) {
    i = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${i * 100}%)`;
  }
  prev.addEventListener("click", () => go(i - 1));
  next.addEventListener("click", () => go(i + 1));

  // swipe
  let sx = 0;
  track.addEventListener("touchstart", (e) => sx = e.touches[0].clientX, {passive:true});
  track.addEventListener("touchend",   (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
  });
}

/* Map (Leaflet) */
function initMap() {
  const el = document.getElementById("mapWrap");
  // Leaflet script only exists on index.html; guard everywhere else
  if (!el || typeof L === "undefined") return;

  const lat = parseFloat(el.dataset.lat);
  const lng = parseFloat(el.dataset.lng);
  const label = el.dataset.label || "Lokacija";

  // Basic sanity
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

  const map = L.map(el, { scrollWheelZoom: false }).setView([lat, lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "Â© OpenStreetMap contributors"
  }).addTo(map);

  L.marker([lat, lng]).addTo(map).bindPopup(label);

  // Fix initial sizing when inside a grid/card
  setTimeout(() => map.invalidateSize(), 0);
}

(async function boot(){
  await includePartials();
  initNav();
  initCarousel();
  initPeoplePage();
  initPersonPage();
  initMap();
  setYear();

  // Smooth same-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = document.querySelector(id);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth" }); }
    });
  });
})();