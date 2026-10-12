const contact = {
  name: "Erik Jourdan Macadangdang",
  title: "Group Retail Manager",
  phone: "0956-443-9474",
  email: "macadangdangerik@gmail.com",
  url: "https://www.facebook.com/search/top?q=Hyundai%20Santiago%20City%20by%20Erik%20Jourdan%20Macadangdang",
  location: "Hyundai Santiago City",
  bio: "Ready to get behind the wheel of your dream vehicle? Explore an incredible range of choices across Hyundai, Nissan, Mitsubishi, Suzuki, Chevrolet, VinFast, Foton, and Fuso, backed by exclusive promos and flexible financing plans!\n\nConnect with Erik Jourdan Macadangdang, Group Retail Manager, to find the ideal car or commercial vehicle to suit your budget and drive. Message today and let’s get you on the road!",
  socials: [
    { name: "Personal Account", icon: "icons/fb.png", url: "https://www.facebook.com/search/top?q=Erik%20Jourdan%20Macadangdang" },
    { name: "Facebook Page", icon: "icons/fb.png", url: "https://www.facebook.com/search/top?q=Hyundai%20Santiago%20City%20by%20Erik%20Jourdan%20Macadangdang" },
  ],
};

const toast = document.querySelector("#toast");
let toastTimeout;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

document.querySelector("#save-contact").addEventListener("click", () => {
  showToast("Contact file downloading. Open it from Downloads, then choose Add to Contacts.");
});

function renderContact() {
  const pageTitle = `${contact.name} — Digital Business Card`;

  document.title = pageTitle;
  document.querySelector("#page-description").content =
    `${contact.name}, ${contact.title}. Contact details and links.`;
  document.querySelector("#avatar").setAttribute("aria-label", contact.name);
  document.querySelector("#profile-photo").alt = `Portrait of ${contact.name}`;
  document.querySelector("#profile-eyebrow").textContent = contact.location;
  document.querySelector("#profile-name").textContent = contact.name;
  document.querySelector("#profile-title").textContent = contact.title;

  const bio = document.querySelector("#profile-bio");
  bio.textContent = contact.bio;
  bio.hidden = !contact.bio.trim();

  const phoneUrl = `tel:${contact.phone.replace(/[^\d+]/g, "")}`;
  const emailUrl = `mailto:${contact.email}`;
  document.querySelector("#call-action").href = phoneUrl;
  document.querySelector("#message-action").href = `sms:${contact.phone.replace(/[^\d+]/g, "")}`;
  document.querySelector("#viber-action").href = `viber://chat?number=${encodeURIComponent(`+63${contact.phone.replace(/\D/g, "").replace(/^0/, "")}`)}`;
  document.querySelector("#email-action").href = emailUrl;
  document.querySelector("#location-action").href =
    "https://www.google.com/maps/search/?api=1&query=Hyundai%20Santiago%20City";
  document.querySelector("#email-detail").href = emailUrl;
  document.querySelector("#email-text").textContent = contact.email;
  document.querySelector("#phone-detail").href = phoneUrl;
  document.querySelector("#phone-text").textContent = contact.phone;
  const socialSection = document.querySelector("#social-section");
  const socialLinks = document.querySelector("#social-links");
  socialLinks.replaceChildren();
  for (const social of contact.socials) {
    const link = document.createElement("a");
    link.href = social.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.setAttribute("aria-label", social.name);
    let icon;
    if (/\.(svg|png|jpe?g|webp|gif)$/i.test(social.icon)) {
      icon = document.createElement("img");
      icon.className = "social-image";
      icon.src = social.icon;
      icon.alt = "";
    } else {
      icon = document.createElement("span");
      icon.className = "social-mark";
      icon.textContent = social.icon;
    }
    icon.setAttribute("aria-hidden", "true");
    const label = document.createElement("span");
    label.textContent = social.name;
    link.append(icon, label);
    socialLinks.append(link);
  }
  socialSection.hidden = contact.socials.length === 0;
}

document.querySelector("#share-button").addEventListener("click", async () => {
  const shareData = {
    title: `${contact.name} — Digital Business Card`,
    text: `Connect with ${contact.name}, ${contact.title}.`,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard.writeText(shareData.url);
    showToast("Card link copied to clipboard.");
  } catch (error) {
    if (error.name === "AbortError") return;

    showToast("Unable to share this card. Please copy the page link.");
  }
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
renderContact();

const releasedToggle = document.querySelector("#released-toggle");
const releasedUnits = document.querySelector("#released-units");
const recentToggle = document.querySelector("#recent-toggle");
const recentUnits = document.querySelector("#recent-units");
const recentDeck = document.querySelector("#recent-deck");
const recentCards = [...document.querySelectorAll(".recent-card")];
const recentCounter = document.querySelector("#recent-counter");
const recentPrevious = document.querySelector("#recent-previous");
const recentNext = document.querySelector("#recent-next");
const releasedAction = document.querySelector("#released-action");
const recentAction = document.querySelector("#recent-action");
const releasedSection = document.querySelector("#released-section");
const recentSection = document.querySelector("#recent-section");
const releasedTrack = document.querySelector("#released-track");

let activeRecentIndex = 0;
let isRecentTransitioning = false;

function updateRecentDeckOrientation() {
  const activeCard = recentCards[activeRecentIndex];
  const image = activeCard?.querySelector("img");
  if (!image) return;

  const setOrientation = () => {
    if (recentCards[activeRecentIndex] !== activeCard || !image.naturalWidth) return;
    recentDeck.dataset.orientation = image.naturalWidth > image.naturalHeight ? "landscape" : "portrait";
  };

  if (image.complete) {
    setOrientation();
  } else {
    image.addEventListener("load", setOrientation, { once: true });
  }
}

updateRecentDeckOrientation();

function updateRecentCards(leavingCard = null) {
  recentCards.forEach((card, index) => {
    if (card === leavingCard) return;

    const distance = (index - activeRecentIndex + recentCards.length) % recentCards.length;
    card.classList.remove("is-active", "is-next", "is-next-two", "is-hidden", "is-leaving-up", "is-leaving-down");
    card.classList.add(distance === 0 ? "is-active" : distance === 1 ? "is-next" : distance === 2 ? "is-next-two" : "is-hidden");
    card.setAttribute("aria-hidden", String(distance !== 0));
    card.tabIndex = distance === 0 ? 0 : -1;
    card.setAttribute("aria-label", `Show next delivery photo, ${index + 1} of ${recentCards.length}`);
  });

  recentCounter.textContent = `${String(activeRecentIndex + 1).padStart(2, "0")} / ${String(recentCards.length).padStart(2, "0")}`;
}

function changeRecentCard(direction) {
  if (isRecentTransitioning || recentCards.length < 2) return;

  isRecentTransitioning = true;
  const leavingCard = recentCards[activeRecentIndex];
  const nextIndex = (activeRecentIndex + direction + recentCards.length) % recentCards.length;
  leavingCard.classList.remove("is-active");
  leavingCard.classList.add(direction > 0 ? "is-leaving-up" : "is-leaving-down");
  leavingCard.setAttribute("aria-hidden", "true");
  leavingCard.tabIndex = -1;
  activeRecentIndex = nextIndex;
  updateRecentDeckOrientation();
  updateRecentCards(leavingCard);

  const nextCard = recentCards[activeRecentIndex];
  if (document.activeElement === leavingCard) nextCard.focus({ preventScroll: true });

  let transitionTimeout;
  const finishTransition = () => {
    clearTimeout(transitionTimeout);
    leavingCard.removeEventListener("transitionend", onTransitionEnd);
    leavingCard.classList.remove("is-leaving-up", "is-leaving-down");
    leavingCard.classList.add("is-hidden");
    updateRecentCards();
    isRecentTransitioning = false;
  };
  const onTransitionEnd = (event) => {
    if (event.target === leavingCard && event.propertyName === "transform") finishTransition();
  };

  leavingCard.addEventListener("transitionend", onTransitionEnd);
  transitionTimeout = window.setTimeout(finishTransition, 500);
}

for (const card of recentCards) {
  card.addEventListener("click", () => changeRecentCard(1));
}

recentPrevious.addEventListener("click", () => changeRecentCard(-1));
recentNext.addEventListener("click", () => changeRecentCard(1));

const coffeeToggle = document.querySelector("#coffee-toggle");
const coffeeDetails = document.querySelector("#coffee-details");
coffeeToggle.addEventListener("click", () => {
  const isExpanded = coffeeToggle.getAttribute("aria-expanded") === "true";
  coffeeToggle.setAttribute("aria-expanded", String(!isExpanded));
  coffeeDetails.hidden = isExpanded;
});

releasedToggle.addEventListener("click", () => {
  const isExpanded = releasedToggle.getAttribute("aria-expanded") === "true";
  releasedToggle.setAttribute("aria-expanded", String(!isExpanded));
  releasedUnits.hidden = isExpanded;
});

recentToggle.addEventListener("click", () => {
  const isExpanded = recentToggle.getAttribute("aria-expanded") === "true";
  recentToggle.setAttribute("aria-expanded", String(!isExpanded));
  recentUnits.hidden = isExpanded;
});

releasedAction.addEventListener("click", (event) => {
  event.preventDefault();
  releasedToggle.setAttribute("aria-expanded", "true");
  releasedUnits.hidden = false;
  releasedSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

recentAction.addEventListener("click", (event) => {
  event.preventDefault();
  recentToggle.setAttribute("aria-expanded", "true");
  recentUnits.hidden = false;
  recentSection.scrollIntoView({ behavior: "smooth", block: "start" });
});
