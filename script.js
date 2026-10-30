const products = [
  {
    id: "type-01",
    category: "men",
    categoryLabel: "Men’s / Street",
    name: "NULL. Type 01 Mens Sneakers",
    color: "Black",
    image: "/assets/4e228.png",
    price: 350000,
    oldPrice: 700000,
    discount: 50,
    code: "NL-T01-BLK-2026",
    sizes: [39, 40, 41, 42, 43, 44, 45],
    unavailable: [39, 45],
    use: "Daily streetwear",
    material: "Textured mesh, synthetic panels",
    stock: "Limited release · 18 pairs",
    description:
      "Step up your style with the NULL Type 01 Men’s Sneakers in Black. Designed with a bold, all-black look, textured panels, and a durable outsole, these sneakers deliver the perfect balance of comfort, versatility, and streetwear attitude. The cushioned design and secure lace-up fit make them ideal for everyday wear, from casual outings to urban adventures.",
  },
  {
    id: "runner-zero",
    category: "women",
    categoryLabel: "Women’s / Running",
    name: "NULL. Runner Zero Womens Runner Shoes",
    color: "Black / White",
    image: "/assets/04f0b.png",
    price: 490000,
    oldPrice: 700000,
    discount: 30,
    code: "NL-RZ-WBW-2026",
    sizes: [36, 37, 38, 39, 40, 41, 42],
    unavailable: [36, 41],
    use: "Road running & daily training",
    material: "Breathable knit, responsive foam",
    stock: "In stock · 31 pairs",
    description:
      "Built to keep your stride light, Runner Zero combines an airy black knit upper with a high-rebound white foam platform. The flexible forefoot supports natural movement while the padded heel locks in comfort for daily runs, commutes, and long days on your feet.",
  },
  {
    id: "junior-10",
    category: "kids",
    categoryLabel: "Kid’s / Everyday",
    name: "NULL. Junior 1.0 Kid’s Sneakers",
    color: "Grey / Black",
    image: "/assets/89047.png",
    price: 350000,
    oldPrice: 500000,
    discount: 30,
    code: "NL-JR10-GRY-2026",
    sizes: [32, 33, 34, 35, 36, 37, 38, 39],
    unavailable: [33],
    use: "School & everyday play",
    material: "Easy-clean synthetic, rubber outsole",
    stock: "In stock · 24 pairs",
    description:
      "Made for active days, Junior 1.0 balances a supportive court-inspired shape with soft padding sized for growing feet. Durable overlays protect high-wear areas, while the grippy sole and secure lacing help young wearers move confidently from class to weekend play.",
  },
  {
    id: "back-to-school",
    category: "kids",
    categoryLabel: "Kid’s / Running",
    name: "NULL. Back to School Kid’s Sneakers",
    color: "White / Graphite",
    image: "/assets/ffb17.png",
    price: 420000,
    oldPrice: 600000,
    discount: 30,
    code: "NL-BTS-WHT-2026",
    sizes: [32, 33, 34, 35, 36, 37, 38, 39, 40],
    unavailable: [32, 38],
    use: "School, sports & weekend wear",
    material: "Engineered mesh, cushioned EVA",
    stock: "Low stock · 9 pairs",
    description:
      "The Back to School sneaker is a light, energetic all-rounder for fast mornings and busy afternoons. A breathable white mesh upper keeps feet comfortable, structured graphite panels improve stability, and the sculpted cushioned sole softens every step without feeling heavy.",
  },
];

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const state = {
  filter: "all",
  query: "",
  currentProduct: null,
  selectedSize: null,
  quantity: 1,
  cartCount: 0,
};

const productGrid = document.querySelector("#product-grid");
const emptyState = document.querySelector("#empty-state");
const storefront = document.querySelector("#storefront");
const detailView = document.querySelector("#product-detail");
const footer = document.querySelector(".site-footer");
const toast = document.querySelector(".toast");

function formatPrice(price) {
  return currency.format(price).replace("Rp", "Rp. ");
}

function productCard(product) {
  return `
    <article class="product-card" tabindex="0" role="button" data-product="${product.id}" aria-label="View ${product.name}">
      <span class="discount-badge">${product.discount}% OFF</span>
      <img class="product-image" src="${product.image}" alt="${product.name} in ${product.color}" />
      <div class="product-copy">
        <p class="product-category">${product.categoryLabel}</p>
        <h3>${product.name}<br />${product.color}</h3>
        <div class="prices">
          <span>${formatPrice(product.price)}</span>
          <s>${formatPrice(product.oldPrice)}</s>
        </div>
      </div>
    </article>
  `;
}

function renderProducts() {
  const query = state.query.trim().toLowerCase();
  const visible = products.filter((product) => {
    const categoryMatch = state.filter === "all" || product.category === state.filter;
    const searchMatch = !query || `${product.name} ${product.color} ${product.categoryLabel}`.toLowerCase().includes(query);
    return categoryMatch && searchMatch;
  });

  productGrid.innerHTML = visible.map(productCard).join("");
  emptyState.hidden = visible.length > 0;
}

function setFilter(filter) {
  state.filter = filter;
  document.querySelectorAll(".filter").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === filter);
  });
  renderProducts();
  document.querySelector("#collection").scrollIntoView({ behavior: "smooth" });
}

function renderSizes(product) {
  const sizeGrid = document.querySelector("#size-grid");
  sizeGrid.innerHTML = product.sizes
    .map((size) => {
      const unavailable = product.unavailable.includes(size);
      return `<button class="size-option" type="button" data-size="${size}" ${unavailable ? "disabled" : ""}>${size}</button>`;
    })
    .join("");
}

function openProduct(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  state.currentProduct = product;
  state.selectedSize = null;
  state.quantity = 1;

  document.querySelector("#detail-category").textContent = product.categoryLabel;
  document.querySelector("#detail-name").textContent = product.name;
  document.querySelector("#detail-color").textContent = product.color;
  document.querySelector("#detail-price").textContent = formatPrice(product.price);
  document.querySelector("#detail-old-price").textContent = formatPrice(product.oldPrice);
  document.querySelector("#detail-discount").textContent = `${product.discount}% OFF`;
  document.querySelector("#detail-image").src = product.image;
  document.querySelector("#detail-image").alt = `${product.name} in ${product.color}`;
  document.querySelector("#detail-code").textContent = `Style ${product.code}`;
  document.querySelector("#detail-description").textContent = product.description;
  document.querySelector("#detail-use").textContent = product.use;
  document.querySelector("#detail-material").textContent = product.material;
  document.querySelector("#detail-stock").textContent = product.stock;
  document.querySelector("#quantity").textContent = "1";
  document.querySelector("#selection-note").textContent = "Choose a size to continue.";
  document.querySelector(".favorite-button").setAttribute("aria-pressed", "false");
  renderSizes(product);

  storefront.hidden = true;
  footer.hidden = true;
  detailView.hidden = false;
  window.scrollTo({ top: 0, behavior: "instant" });
  history.replaceState({ productId }, "", `#product=${productId}`);
}

function closeProduct() {
  detailView.hidden = true;
  storefront.hidden = false;
  footer.hidden = false;
  history.replaceState({}, "", "#collection");
  requestAnimationFrame(() => document.querySelector("#collection").scrollIntoView());
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

document.addEventListener("click", (event) => {
  const productCardElement = event.target.closest("[data-product]");
  const filterButton = event.target.closest("[data-filter]");
  const filterLink = event.target.closest("[data-filter-link]");
  const sizeButton = event.target.closest("[data-size]");
  const quantityButton = event.target.closest("[data-quantity]");

  if (productCardElement) openProduct(productCardElement.dataset.product);
  if (filterButton) setFilter(filterButton.dataset.filter);
  if (filterLink) {
    document.querySelector(".mobile-nav").classList.remove("open");
    setFilter(filterLink.dataset.filterLink);
  }
  if (sizeButton && !sizeButton.disabled) {
    state.selectedSize = Number(sizeButton.dataset.size);
    document.querySelectorAll(".size-option").forEach((button) => {
      button.classList.toggle("selected", button === sizeButton);
    });
    document.querySelector("#selection-note").textContent = `EU ${state.selectedSize} selected.`;
  }
  if (quantityButton) {
    state.quantity = quantityButton.dataset.quantity === "plus"
      ? Math.min(state.quantity + 1, 8)
      : Math.max(state.quantity - 1, 1);
    document.querySelector("#quantity").textContent = state.quantity;
  }
});

document.addEventListener("keydown", (event) => {
  const card = event.target.closest("[data-product]");
  if (card && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    openProduct(card.dataset.product);
  }
  if (event.key === "Escape" && searchPanel.classList.contains("open")) {
    setSearchOpen(false);
    return;
  }
  if (event.key === "Escape" && !detailView.hidden) closeProduct();
});

document.querySelector(".back-button").addEventListener("click", closeProduct);

document.querySelector(".favorite-button").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const nextState = button.getAttribute("aria-pressed") !== "true";
  button.setAttribute("aria-pressed", String(nextState));
  showToast(nextState ? "Saved to your favorites." : "Removed from your favorites.");
});

document.querySelector(".add-to-cart").addEventListener("click", () => {
  if (!state.selectedSize) {
    document.querySelector("#selection-note").textContent = "Select an available size before adding to cart.";
    showToast("Please select a size.");
    return;
  }
  state.cartCount += state.quantity;
  const cartCount = document.querySelector(".cart-count");
  cartCount.textContent = state.cartCount;
  cartCount.setAttribute("aria-label", `${state.cartCount} items in cart`);
  showToast(`${state.currentProduct.name}, EU ${state.selectedSize}, added to cart.`);
});

const searchPanel = document.querySelector(".search-panel");
const searchInput = document.querySelector("#product-search");
const searchButton = document.querySelector(".search-button");

function setSearchOpen(isOpen) {
  searchPanel.classList.toggle("open", isOpen);
  searchButton.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) {
    searchInput.focus();
  } else {
    searchButton.focus();
  }
}

searchButton.addEventListener("click", () => {
  setSearchOpen(!searchPanel.classList.contains("open"));
});

document.querySelector(".search-close").addEventListener("click", () => {
  setSearchOpen(false);
});

searchPanel.addEventListener("submit", (event) => event.preventDefault());

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderProducts();
  if (storefront.hidden) closeProduct();
  document.querySelector("#collection").scrollIntoView({ behavior: "smooth" });
});

document.addEventListener("click", (event) => {
  if (
    searchPanel.classList.contains("open") &&
    !event.target.closest(".search-panel") &&
    !event.target.closest(".search-button")
  ) {
    setSearchOpen(false);
  }
});

document.querySelector(".menu-button").addEventListener("click", (event) => {
  const mobileNav = document.querySelector(".mobile-nav");
  const isOpen = mobileNav.classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(isOpen));
});

document.querySelector(".profile-button").addEventListener("click", () => {
  showToast("Account sign-in is coming soon.");
});

document.querySelector(".cart-button").addEventListener("click", () => {
  showToast(state.cartCount ? `${state.cartCount} item(s) in your cart.` : "Your cart is empty.");
});

const sizeDialog = document.querySelector(".size-dialog");
document.querySelector(".size-guide-button").addEventListener("click", () => sizeDialog.showModal());
document.querySelector(".dialog-close").addEventListener("click", () => sizeDialog.close());
sizeDialog.addEventListener("click", (event) => {
  if (event.target === sizeDialog) sizeDialog.close();
});

renderProducts();

const initialProduct = window.location.hash.match(/^#product=(.+)$/)?.[1];
if (initialProduct) openProduct(initialProduct);
