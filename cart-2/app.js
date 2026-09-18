const STORAGE_KEY = "casa-clara-cart";

const products = [
    { id: "taza", name: "Taza de cerámica", description: "Esmaltada a mano, 280 ml", price: 18.5, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=80" },
    { id: "vela", name: "Vela de cedro", description: "Cera vegetal, 40 horas", price: 24, image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=80" },
    { id: "libreta", name: "Libreta de lino", description: "Papel reciclado, 96 páginas", price: 12.75, image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=700&q=80" },
    { id: "jabon", name: "Jabón de oliva", description: "Aroma suave, 100 g", price: 8.9, image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=700&q=80" },
    { id: "jarron", name: "Jarrón de barro", description: "Pieza artesanal, 18 cm", price: 31.5, image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=700&q=80" },
    { id: "pano", name: "Paño de cocina", description: "Algodón orgánico, 2 unidades", price: 15.2, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=700&q=80" }
];

let cart = loadCart();

const productList = document.querySelector("#product-list");
const cartItems = document.querySelector("#cart-items");
const headerCount = document.querySelector("#header-count");
const cartCount = document.querySelector("#cart-count");
const cartSubtotal = document.querySelector("#cart-subtotal");
const cartTotal = document.querySelector("#cart-total");
const cartPanel = document.querySelector("#cart-panel");
const clearCartButton = document.querySelector("#clear-cart");
const checkoutButton = document.querySelector("#checkout-button");

const ICONS = {
    plus: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M8 3v10M3 8h10"/></svg>',
    check: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 8.5l3 3 6-6.5"/></svg>',
    seal: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11.2" fill="none" stroke="currentColor" stroke-width="1.2"/><circle class="seal-inner" cx="12" cy="12" r="8.6" fill="none" stroke="currentColor"/><path class="seal-leaf" d="M12 8.4c2.5 1.3 2.5 5.1 0 6.7-2.5-1.6-2.5-5.4 0-6.7z"/><path class="seal-stem" d="M12 15.1v1.6" fill="none" stroke="currentColor" stroke-linecap="round"/></svg>'
};

function formatCurrency(value) {
    return `$${value.toFixed(2)}`;
}

function findProduct(productId) {
    return products.find((product) => product.id === productId);
}

// Solo se aceptan productos conocidos con cantidades enteras y positivas.
function loadCart() {
    try {
        const savedCart = localStorage.getItem(STORAGE_KEY);
        const parsedCart = savedCart ? JSON.parse(savedCart) : [];
        if (!Array.isArray(parsedCart)) return [];

        return parsedCart.reduce((validItems, item) => {
            const quantity = Number(item?.quantity);
            if (findProduct(item?.id) && Number.isInteger(quantity) && quantity > 0) {
                const existingItem = validItems.find((validItem) => validItem.id === item.id);
                if (existingItem) existingItem.quantity += quantity;
                else validItems.push({ id: item.id, quantity });
            }
            return validItems;
        }, []);
    } catch (error) {
        console.warn("No se pudo cargar el carrito guardado.", error);
        return [];
    }
}

function saveCart() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
        console.warn("No se pudo guardar el carrito.", error);
    }
}

function calculateSubtotal() {
    return cart.reduce((subtotal, item) => {
        const product = findProduct(item.id);
        return subtotal + (product ? product.price * item.quantity : 0);
    }, 0);
}

function getTotalQuantity() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

function popBadge(element) {
    if (!element) return;
    element.classList.remove("pop");
    void element.offsetWidth;
    element.classList.add("pop");
}

function createAddButton(product) {
    const button = document.createElement("button");
    button.className = "add-button";
    button.type = "button";
    button.dataset.productId = product.id;
    button.innerHTML = `<span class="btn-icon">${ICONS.plus}</span><span>Añadir</span>`;

    const textElement = button.lastElementChild;
    const iconElement = button.querySelector(".btn-icon");

    button.addEventListener("click", () => {
        addToCart(product.id);
        button.disabled = true;
        button.classList.add("is-added");
        iconElement.innerHTML = ICONS.check;
        textElement.textContent = "Añadido";
        window.setTimeout(() => {
            button.disabled = false;
            button.classList.remove("is-added");
            iconElement.innerHTML = ICONS.plus;
            textElement.textContent = "Añadir";
        }, 1300);
    });
    return button;
}

function renderProducts() {
    productList.replaceChildren();
    products.forEach((product, index) => {
        const card = document.createElement("article");
        card.className = "product-card reveal";
        card.style.animationDelay = `${index * 55}ms`;

        const imageWrap = document.createElement("figure");
        imageWrap.className = "image-wrap";
        const image = document.createElement("img");
        image.className = "product-image";
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";
        imageWrap.append(image);
        card.append(imageWrap);

        const potterSeal = document.createElement("span");
        potterSeal.className = "potter-seal";
        potterSeal.setAttribute("aria-hidden", "true");
        potterSeal.innerHTML = ICONS.seal;
        card.append(potterSeal);

        const name = document.createElement("h3");
        name.className = "product-name";
        name.textContent = product.name;
        const description = document.createElement("p");
        description.className = "product-description";
        description.textContent = product.description;
        const bottom = document.createElement("div");
        bottom.className = "product-bottom";
        const price = document.createElement("p");
        price.className = "price";
        price.textContent = formatCurrency(product.price);

        bottom.append(price, createAddButton(product));
        card.append(name, description, bottom);
        card.addEventListener("mouseenter", () => card.classList.add("leaf-drop"));
        card.addEventListener("focusin", () => card.classList.add("leaf-drop"));
        productList.append(card);
    });
}

function createQuantityButton(label, ariaLabel, onClick, disabled) {
    const button = document.createElement("button");
    button.className = "stepper-button";
    button.type = "button";
    button.textContent = label;
    button.setAttribute("aria-label", ariaLabel);
    button.disabled = Boolean(disabled);
    button.addEventListener("click", onClick);
    return button;
}

function createCartItem(item) {
    const product = findProduct(item.id);
    if (!product) return null;

    const element = document.createElement("article");
    element.className = "cart-item";

    const thumb = document.createElement("img");
    thumb.className = "thumb";
    thumb.src = product.image;
    thumb.alt = "";
    thumb.loading = "lazy";
    thumb.setAttribute("aria-hidden", "true");

    const meta = document.createElement("div");
    meta.className = "cart-meta";
    const name = document.createElement("h3");
    name.className = "cart-item-name";
    name.textContent = product.name;
    const unit = document.createElement("p");
    unit.className = "cart-item-unit";
    unit.textContent = `${formatCurrency(product.price)} c/u`;
    meta.append(name, unit);

    const controls = document.createElement("div");
    controls.className = "item-controls";
    const stepper = document.createElement("div");
    stepper.className = "stepper";
    const quantityEl = document.createElement("span");
    quantityEl.className = "quantity";
    quantityEl.textContent = item.quantity;
    stepper.append(
        createQuantityButton("−", `Disminuir cantidad de ${product.name}`, () => changeQuantity(item.id, -1), item.quantity <= 1),
        quantityEl,
        createQuantityButton("+", `Aumentar cantidad de ${product.name}`, () => changeQuantity(item.id, 1))
    );
    controls.append(stepper);

    const lineTotal = document.createElement("p");
    lineTotal.className = "line-total";
    lineTotal.textContent = formatCurrency(product.price * item.quantity);

    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.type = "button";
    removeButton.textContent = "Quitar";
    removeButton.addEventListener("click", () => removeFromCart(item.id));

    element.append(thumb, meta, controls, lineTotal, removeButton);
    return element;
}

function renderEmptyCart() {
    const empty = document.createElement("div");
    empty.className = "empty-cart";
    const seal = document.createElement("span");
    seal.className = "empty-seal";
    seal.setAttribute("aria-hidden", "true");
    seal.innerHTML = ICONS.seal;
    const message = document.createElement("p");
    message.textContent = "Tu carrito está esperando algo bonito.";
    empty.append(seal, message);
    cartItems.append(empty);
}

function renderCart() {
    const previousQuantity = getTotalQuantity();
    cartItems.replaceChildren();
    if (cart.length === 0) {
        renderEmptyCart();
    } else {
        cart.forEach((item) => {
            const element = createCartItem(item);
            if (element) cartItems.append(element);
        });
    }

    const quantity = getTotalQuantity();
    const subtotal = calculateSubtotal();
    const badge = document.querySelector(".cart-badge");
    headerCount.textContent = quantity;
    cartCount.textContent = quantity;
    if (quantity > previousQuantity) {
        popBadge(headerCount);
        if (badge) popBadge(badge);
    }
    cartSubtotal.textContent = formatCurrency(subtotal);
    cartTotal.textContent = formatCurrency(subtotal);
    clearCartButton.disabled = cart.length === 0;
    checkoutButton.disabled = cart.length === 0;
}

function addToCart(productId) {
    if (!findProduct(productId)) return;
    const existingItem = cart.find((item) => item.id === productId);
    if (existingItem) existingItem.quantity += 1;
    else cart.push({ id: productId, quantity: 1 });
    saveCart();
    renderCart();
}

function changeQuantity(productId, amount) {
    const item = cart.find((cartItem) => cartItem.id === productId);
    if (!item) return;
    item.quantity = Math.max(0, item.quantity + amount);
    if (item.quantity === 0) removeFromCart(productId);
    else { saveCart(); renderCart(); }
}

function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId);
    saveCart();
    renderCart();
}

document.querySelector("#cart-link").addEventListener("click", () => cartPanel.scrollIntoView({ behavior: "smooth", block: "start" }));
clearCartButton.addEventListener("click", () => { cart = []; saveCart(); renderCart(); });
checkoutButton.addEventListener("click", () => {
    checkoutButton.textContent = "Pedido preparado";
    checkoutButton.disabled = true;
});

renderProducts();
renderCart();