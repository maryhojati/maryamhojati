(() => {
  const html = document.documentElement;
  const langBtn = document.getElementById("language-switch");
  const title = document.querySelector("title");
  const description = document.querySelector('meta[name="description"]');
  const coffeeToggle = document.getElementById("coffee-toggle");
  const heroCoffee = document.getElementById("hero-coffee");
  const contactPopup = document.getElementById("contact-popup");
  const contactClose = document.getElementById("close-contact-popup");
  const lightbox = document.getElementById("lightbox");

  function setLanguage(lang) {
    const rtl = lang === "fa";
    html.lang = rtl ? "fa" : "en";
    html.dir = rtl ? "rtl" : "ltr";
    document.querySelectorAll("[data-en][data-fa]").forEach((el) => {
      if (el.children.length) return;
      const next = rtl ? el.getAttribute("data-fa") : el.getAttribute("data-en");
      if (next != null) el.textContent = next;
    });
    if (langBtn) {
      const glyph = langBtn.querySelector(".lang-glyph");
      if (glyph) {
        glyph.textContent = rtl ? "EN" : "فا";
        glyph.classList.toggle("lang-fa-glyph", !rtl);
      }
      langBtn.setAttribute("aria-label", rtl ? "Switch to English" : "تغییر زبان به فارسی");
    }
    if (title) {
      title.textContent = rtl ? "مریم حجتی — رشد، تحلیل و کنجکاوی" : "Maryam Hojati — Growth, Analytics & Curiosity";
    }
    if (description) {
      description.setAttribute(
        "content",
        rtl
          ? "مریم حجتی؛ رشد، تحلیل، مسئله‌های کسب‌وکار و چیزهایی که ارزش نگاه کردن دارند."
          : "Maryam Hojati — growth, analytics, business problems, and things worth exploring."
      );
    }
  }

  if (langBtn) {
    langBtn.addEventListener("click", () => setLanguage(html.lang === "fa" ? "en" : "fa"));
  }

  if (contactPopup) {
    const openers = [coffeeToggle, heroCoffee].filter(Boolean);
    let activeOpener = null;

    function placeContact(anchor) {
      const gap = 14;
      const pad = 12;
      const rtl = html.dir === "rtl";
      const w = contactPopup.offsetWidth;
      const h = contactPopup.offsetHeight;
      const r = anchor.getBoundingClientRect();
      const roomRight = window.innerWidth - pad - (r.right + gap);
      const roomLeft = r.left - gap - pad;
      let left;
      let top;
      let side;
      if (!rtl && roomRight >= w) {
        left = r.right + gap;
        top = r.top + (r.height - h) / 2;
        side = "right";
      } else if (rtl && roomLeft >= w) {
        left = r.left - w - gap;
        top = r.top + (r.height - h) / 2;
        side = "left";
      } else if (rtl && roomRight >= w) {
        left = r.right + gap;
        top = r.top + (r.height - h) / 2;
        side = "right";
      } else if (!rtl && roomLeft >= w) {
        left = r.left - w - gap;
        top = r.top + (r.height - h) / 2;
        side = "left";
      } else {
        left = Math.min(Math.max(r.left, pad), window.innerWidth - pad - w);
        top = r.bottom + gap;
        side = "below";
        if (top + h > window.innerHeight - pad) {
          top = r.top - h - gap;
          side = "above";
        }
      }
      if (top + h > window.innerHeight - pad) top = window.innerHeight - pad - h;
      if (top < pad) top = pad;
      if (left < pad) left = pad;
      contactPopup.classList.remove("side-right", "side-left", "side-below", "side-above");
      contactPopup.classList.add(`side-${side}`);
      contactPopup.style.left = `${Math.round(left)}px`;
      contactPopup.style.top = `${Math.round(top)}px`;
    }

    function openContact(open, anchor) {
      if (open && anchor) activeOpener = anchor;
      if (!open) activeOpener = null;
      contactPopup.classList.toggle("is-open", open);
      contactPopup.setAttribute("aria-hidden", open ? "false" : "true");
      openers.forEach((btn) => btn.setAttribute("aria-expanded", open && btn === activeOpener ? "true" : "false"));
      if (open && activeOpener) {
        contactPopup.style.left = "0px";
        contactPopup.style.top = "0px";
        requestAnimationFrame(() => placeContact(activeOpener));
      }
    }

    const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    let leaveTimer;

    function scheduleClose() {
      clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => openContact(false), 160);
    }

    openers.forEach((btn) => {
      btn.addEventListener("mouseenter", () => {
        clearTimeout(leaveTimer);
        openContact(true, btn);
      });
      btn.addEventListener("mouseleave", scheduleClose);
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (fineHover.matches) return;
        if (contactPopup.classList.contains("is-open") && activeOpener === btn) {
          openContact(false);
          return;
        }
        openContact(true, btn);
      });
    });
    contactPopup.addEventListener("mouseenter", () => clearTimeout(leaveTimer));
    contactPopup.addEventListener("mouseleave", scheduleClose);
    if (contactClose) contactClose.addEventListener("click", () => openContact(false));
    document.addEventListener("click", (e) => {
      if (!contactPopup.classList.contains("is-open")) return;
      if (e.target.closest("#contact-popup") || e.target.closest("#coffee-toggle") || e.target.closest("#hero-coffee")) return;
      openContact(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && contactPopup.classList.contains("is-open")) openContact(false);
    });
    window.addEventListener("resize", () => {
      if (contactPopup.classList.contains("is-open") && activeOpener) placeContact(activeOpener);
    });
    window.addEventListener("scroll", () => {
      if (contactPopup.classList.contains("is-open") && activeOpener) placeContact(activeOpener);
    }, true);

    function copyText(text, btn) {
      const done = () => {
        const label = btn;
        const prev = label.textContent;
        label.textContent = html.lang === "fa" ? "کپی شد" : "copied";
        setTimeout(() => { label.textContent = prev; }, 1400);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
      } else {
        fallbackCopy(text, done);
      }
    }
    function fallbackCopy(text, done) {
      const input = document.createElement("textarea");
      input.value = text;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.top = "0";
      input.style.insetInlineStart = "0";
      input.style.opacity = "0";
      input.style.pointerEvents = "none";
      document.body.appendChild(input);
      input.select();
      try { document.execCommand("copy"); done(); } catch (e) {}
      document.body.removeChild(input);
    }
    document.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        copyText(btn.getAttribute("data-copy"), btn);
      });
    });
  }

  if (lightbox) {
    const lightboxImg = lightbox.querySelector("img");
    const lightboxCap = lightbox.querySelector(".lightbox-cap");
    const lightboxClose = lightbox.querySelector(".lightbox-close");
    document.querySelectorAll(".photo").forEach((btn) => {
      btn.addEventListener("click", () => {
        const img = btn.querySelector("img");
        const cap = btn.querySelector(".cap span");
        if (lightboxImg) {
          lightboxImg.src = btn.getAttribute("data-full") || img.src;
          lightboxImg.alt = img.alt;
        }
        if (lightboxCap) lightboxCap.textContent = cap ? cap.textContent : "";
        if (typeof lightbox.showModal === "function") lightbox.showModal();
      });
    });
    if (lightboxClose) lightboxClose.addEventListener("click", () => lightbox.close());
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox && typeof lightbox.close === "function") lightbox.close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.open) lightbox.close();
    });
  }

})();
