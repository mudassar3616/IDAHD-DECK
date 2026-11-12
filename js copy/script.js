/* ==========================================================================
   IDAHO DECK – script.js
   1. Mobile menu
   2. Number counters
   3. Carousels (projects + testimonials)
   4. Accordion (why choose us)
   5. Forms (contact + newsletter)
   6. Footer year
   ========================================================================== */


/* --------------------------------------------------------------------------
   1. Mobile menu
   -------------------------------------------------------------------------- */
const menuButton = document.querySelector(".header__toggle");
const nav = document.querySelector(".nav");

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", isOpen);
});

// Close the menu after a link is clicked
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    nav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  }
});


/* --------------------------------------------------------------------------
   2. Number counters
   Any <span class="counter" data-target="355"> counts up from 0
   the first time it scrolls into view.
   -------------------------------------------------------------------------- */
const counters = document.querySelectorAll(".counter");

function animateCounter(element) {
  const target = Number(element.dataset.target);
  const duration = 1600; // milliseconds
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    element.textContent = Math.round(target * progress);
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      observer.unobserve(entry.target); // only once
    }
  });
}, { threshold: 0.5 });

counters.forEach((counter) => counterObserver.observe(counter));


/* --------------------------------------------------------------------------
   3. Carousels
   HTML needs: [data-track] (the list of slides), [data-prev], [data-next]
   and data-visible="2" (how many slides are fully visible on desktop).
   -------------------------------------------------------------------------- */
function initCarousel(root) {
  const track = root.querySelector("[data-track]");
  const slides = Array.from(track.children);
  const prevButton = root.querySelector("[data-prev]");
  const nextButton = root.querySelector("[data-next]");
  let index = 0;

  // On tablets and phones only one slide is shown at a time
  function visibleCount() {
    return window.innerWidth <= 1100 ? 1 : Number(root.dataset.visible);
  }

  function lastIndex() {
    return Math.max(slides.length - visibleCount(), 0);
  }

  function update() {
    index = Math.min(index, lastIndex());

    // Distance between the start of one slide and the next
    const step = slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : 0;
    track.style.transform = `translateX(${-index * step}px)`;

    // Slides that are not fully in view get a faded look
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-faded", i >= index + visibleCount());
    });
  }

  nextButton.addEventListener("click", () => {
    index = index >= lastIndex() ? 0 : index + 1; // loop back to the start
    update();
  });

  prevButton.addEventListener("click", () => {
    index = index <= 0 ? lastIndex() : index - 1; // loop to the end
    update();
  });

  window.addEventListener("resize", update);
  update();
}

document.querySelectorAll(".carousel").forEach(initCarousel);


/* --------------------------------------------------------------------------
   4. Accordion – only one item open at a time
   -------------------------------------------------------------------------- */
const accordionItems = document.querySelectorAll(".accordion__item");

accordionItems.forEach((item) => {
  const header = item.querySelector(".accordion__header");

  header.addEventListener("click", () => {
    const wasOpen = item.classList.contains("is-open");

    // Close everything first
    accordionItems.forEach((other) => {
      other.classList.remove("is-open");
      other.querySelector(".accordion__header").setAttribute("aria-expanded", "false");
    });

    // Re-open the clicked item (unless it was already open)
    if (!wasOpen) {
      item.classList.add("is-open");
      header.setAttribute("aria-expanded", "true");
    }
  });
});


/* --------------------------------------------------------------------------
   5. Forms
   These only validate in the browser. To really send the data, replace the
   "TODO" lines with a fetch() call to your server or form service.
   -------------------------------------------------------------------------- */
const contactForm = document.getElementById("contact-form");
const formStatus = contactForm.querySelector(".contact-form__status");

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function showStatus(message, isError) {
  formStatus.textContent = message;
  formStatus.classList.toggle("is-error", isError);
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = contactForm.elements.name.value.trim();
  const email = contactForm.elements.email.value.trim();
  const message = contactForm.elements.message.value.trim();

  if (!name || !email || !message) {
    showStatus("Please fill in all fields.", true);
    return;
  }

  if (!isValidEmail(email)) {
    showStatus("Please enter a valid email address.", true);
    return;
  }

  // TODO: send { name, email, message } to your server here
  showStatus("Thank you! We will get back to you soon.", false);
  contactForm.reset();
});

const newsletterForm = document.getElementById("newsletter-form");

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const input = newsletterForm.querySelector("input");

  if (!isValidEmail(input.value.trim())) {
    input.setCustomValidity("Please enter a valid email address.");
    input.reportValidity();
    input.setCustomValidity("");
    return;
  }

  // TODO: send input.value to your newsletter service here
  input.value = "";
  input.placeholder = "Thanks for subscribing!";
});


/* --------------------------------------------------------------------------
   6. Footer year
   -------------------------------------------------------------------------- */
document.getElementById("year").textContent = new Date().getFullYear();
