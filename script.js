const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const revealItems = document.querySelectorAll(".reveal");
const beforeAfterSliders = document.querySelectorAll("[data-before-after]");

function setHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 18);
}

function closeNav() {
  nav.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
}

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNav);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("is-open")) {
    closeNav();
    navToggle.focus();
  }
});

document.addEventListener("click", (e) => {
  if (
    nav.classList.contains("is-open") &&
    !nav.contains(e.target) &&
    !navToggle.contains(e.target)
  ) {
    closeNav();
  }
});

beforeAfterSliders.forEach((slider) => {
  const range = slider.querySelector("[data-before-range]");
  const beforeWrap = slider.querySelector("[data-before-wrap]");
  const handle = slider.querySelector("[data-before-handle]");

  if (!range || !beforeWrap || !handle) return;

  function setPosition(value) {
    const position = Number(value);
    beforeWrap.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
    handle.style.left = `${position}%`;
  }

  setPosition(range.value);
  range.addEventListener("input", () => setPosition(range.value));
});

// Virtual Consultation Form
const consultForm = document.getElementById("consultation-form");
const formSuccess = document.getElementById("form-success");

if (consultForm) {
  consultForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = consultForm.querySelector(".btn-submit");
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      const res = await fetch("https://formsubmit.co/ajax/support@albertventuredesign.com", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(consultForm),
      });
      if (!res.ok) throw new Error("Network error");
      consultForm.style.display = "none";
      formSuccess.style.display = "flex";
    } catch {
      // Fallback: save locally and still show success
      try {
        const data = Object.fromEntries(new FormData(consultForm));
        localStorage.setItem("consult_" + Date.now(), JSON.stringify(data));
      } catch {}
      consultForm.style.display = "none";
      formSuccess.style.display = "flex";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
