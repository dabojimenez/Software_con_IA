const STORAGE_KEY = "mercado-norte-cart";

const products = [
    { id: "pan", name: "Pan de masa madre", description: "Horneado esta mañana", price: 4.5, art: "🥖" },
    { id: "cafe", name: "Café de altura", description: "Tueste medio, 250 g", price: 8.9, art: "☕" },
    { id: "miel", name: "Miel de flores", description: "Tarro de 350 g", price: 6.75, art: "🍯" },
    { id: "aceite", name: "Aceite de oliva", description: "Extra virgen, 500 ml", price: 11.5, art: "🫒" },
    { id: "pasta", name: "Pasta artesanal", description: "Trigo duro, 400 g", price: 3.2, art: "🍝" },
    { id: "te", name: "Té de jazmín", description: "Hojas sueltas, 80 g", price: 7.25, art: "🍵" }
];

const productGrid = document.querySelector("#product-grid");
const cartItems = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const cartCount = document.querySelector("#cart-count");
const cartBadge = document.querySelector("#cart-badge");
const checkoutButton = document.querySelector("#checkout-button");
const clearCartButton = document.querySelector("#clear-cart");
const cartPanel = document.querySelector("#cart-panel");

let cart = loadCart();

function loadCart() {
    try {
        const savedCart = localStorage.getItem(STORAGE_KEY);
        const parsedCart = savedCart ? JSON.parse(savedCart) : [];
        return Array.isArray(parsedCart) ? parsedCart.filter((item) => products.some((product) => product.id === item.id && item.quantity > 0)) : [];
    } catch {
        return [];
    }
}

function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function formatPrice(price) {
    return `${price.toFixed(2).replace(".", ",")} EUR`;
}

function getProduct(productId) {
    return products.find((product) => product.id === productId);
}

function renderProducts() {
    productGrid.replaceChildren();
    products.forEach((product) => {
        const card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML = `<div class="product-art" aria-hidden="true">${product.art}</div><h3 class="product-name">${product.name}</h3><p class="product-description">${product.description}</p><div class="product-bottom"><span class="price">${formatPrice(product.price)}</span><button class="add-button" type="button" data-product-id="${product.id}">Añadir</button></div>`;
        card.querySelector(".add-button").addEventListener("click", () => addToCart(product.id));
        productGrid.append(card);
    });
}

function renderCart() {
    cartItems.replaceChildren();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + getProduct(item.id).price * item.quantity, 0);

    if (cart.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-cart";
        emptyMessage.textContent = "Tu carrito está esperando algo bueno.";
        cartItems.append(emptyMessage);
    } else {
        cart.forEach((item) => cartItems.append(createCartItem(item)));
    }

    cartCount.textContent = totalItems;
    cartBadge.textContent = totalItems;
    cartTotal.textContent = formatPrice(totalPrice);
    checkoutButton.disabled = cart.length === 0;
    clearCartButton.disabled = cart.length === 0;
}

function createCartItem(item) {
    const product = getProduct(item.id);
    const element = document.createElement("article");
    element.className = "cart-item";

    const name = document.createElement("h3");
    name.className = "cart-item-name";
    name.textContent = product.name;
    const price = document.createElement("span");
    price.className = "cart-item-price";
    price.textContent = formatPrice(product.price * item.quantity);
    const controls = document.createElement("div");
    controls.className = "item-controls";
    controls.append(createQuantityButton("-", "Disminuir cantidad", () => changeQuantity(item.id, -1)));
    const quantity = document.createElement("span");
    quantity.className = "quantity";
    quantity.textContent = item.quantity;
    controls.append(quantity, createQuantityButton("+", "Aumentar cantidad", () => changeQuantity(item.id, 1)));
    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.type = "button";
    removeButton.textContent = "Eliminar";
    removeButton.addEventListener("click", () => removeFromCart(item.id));
    element.append(name, controls, price, removeButton);
    return element;
}

function createQuantityButton(label, ariaLabel, onClick) {
    const button = document.createElement("button");
    button.className = "quantity-button";
    button.type = "button";
    button.textContent = label;
    button.setAttribute("aria-label", ariaLabel);
    button.addEventListener("click", onClick);
    return button;
}

function addToCart(productId) {
    const item = cart.find((cartItem) => cartItem.id === productId);
    if (item) item.quantity += 1;
    else cart.push({ id: productId, quantity: 1 });
    saveCart();
    renderCart();
}

function changeQuantity(productId, amount) {
    const item = cart.find((cartItem) => cartItem.id === productId);
    if (!item) return;
    item.quantity += amount;
    if (item.quantity <= 0) removeFromCart(productId);
    else { saveCart(); renderCart(); }
}

function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId);
    saveCart();
    renderCart();
}

document.querySelector("#cart-jump").addEventListener("click", () => cartPanel.scrollIntoView({ behavior: "smooth", block: "start" }));
clearCartButton.addEventListener("click", () => { cart = []; saveCart(); renderCart(); });
checkoutButton.addEventListener("click", () => { checkoutButton.textContent = "Pedido preparado"; checkoutButton.disabled = true; });

renderProducts();
renderCart();