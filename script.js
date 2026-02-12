const dot = document.querySelector(".cursor-dot");
const ring = document.querySelector(".cursor-ring");
const hoverables = document.querySelectorAll("a, button, .price-card, .feature-card");
const reveals = document.querySelectorAll(".reveal");
const cards = document.querySelectorAll(".price-card");
const magneticItems = document.querySelectorAll("a.magnetic, button.magnetic");
const tiltItems = document.querySelectorAll(".price-card, .feature-card");
const topbar = document.querySelector(".topbar");

let x = window.innerWidth / 2;
let y = window.innerHeight / 2;
let ringX = x;
let ringY = y;

const useFinePointer = window.matchMedia("(pointer:fine)").matches;

if (useFinePointer) {
  window.addEventListener("pointermove", (event) => {
    x = event.clientX;
    y = event.clientY;
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
  });

  const tick = () => {
    ringX += (x - ringX) * 0.14;
    ringY += (y - ringY) * 0.14;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(tick);
  };

  tick();

  hoverables.forEach((el) => {
    el.addEventListener("pointerenter", () => ring.classList.add("active"));
    el.addEventListener("pointerleave", () => ring.classList.remove("active"));
  });
}

// Spring-like magnetic motion for key CTA elements.
magneticItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    if (!useFinePointer) return;
    const rect = item.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    const tx = px * 18;
    const ty = py * 14;
    item.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(1.03)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "translate3d(0, 0, 0) scale(1)";
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

reveals.forEach((item) => observer.observe(item));

cards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (!useFinePointer) return;
    const rect = card.getBoundingClientRect();
    const mx = ((event.clientX - rect.left) / rect.width) * 100;
    card.style.setProperty("--mx", `${mx}%`);
  });
});

tiltItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    if (!useFinePointer) return;
    const rect = item.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    const rx = py * -8;
    const ry = px * 10;
    item.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)";
  });
});

const updateTopbar = () => {
  if (!topbar) return;
  if (window.scrollY > 20) {
    topbar.classList.add("scrolled");
  } else {
    topbar.classList.remove("scrolled");
  }
};

updateTopbar();
window.addEventListener("scroll", updateTopbar, { passive: true });
