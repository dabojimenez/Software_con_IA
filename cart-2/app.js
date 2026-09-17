const STORAGE_KEY = "casa-clara-cart";

const products = [
    { id: "taza", name: "Taza de cerámica", description: "Esmaltada a mano, 280 ml", price: 18.5, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=80" },
    { id: "vela", name: "Vela de cedro", description: "Cera vegetal, 40 horas", price: 24, image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=80" },
    { id: "libreta", name: "Libreta de lino", description: "Papel reciclado, 96 páginas", price: 12.75, image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=700&q=80" },
    { id: "jabon", name: "Jabón de oliva", description: "Aroma suave, 100 g", price: 8.9, image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=700&q=80" },
    { id: "jarron", name: "Jarrón de barro", description: "Pieza artesanal, 18 cm", price: 31.5, image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=700&q=80" },
    { id: "paño", name: "Paño de cocina", description: "Algodón orgánico, 2 unidades", price: 15.2, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=700&q=80" }
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

function renderProducts() {
    productList.replaceChildren();
    products.forEach((product) => {
        const card = document.createElement("article");
        card.className = "product-card";

        const image = document.createElement("img");
        image.className = "product-image";
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";

        const name = document.createElement("h3");
        name.className = "product-name";
        name.textContent = product.name;
        const description = document.createElement("p");
        description.className = "product-description";
        description.textContent = product.description;
        const bottom = document.createElement("div");
        bottom.className = "product-bottom";
        const price = document.createElement("span");
        price.className = "price";
        price.textContent = formatCurrency(product.price);
        const addButton = document.createElement("button");
        addButton.className = "add-button";
        addButton.type = "button";
        addButton.textContent = "Añadir";
        addButton.addEventListener("click", () => addToCart(product.id));

        bottom.append(price, addButton);
        card.append(image, name, description, bottom);
        productList.append(card);
    });
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

function createCartItem(item) {
    const product = findProduct(item.id);
    const element = document.createElement("article");
    element.className = "cart-item";

    const name = document.createElement("h3");
    name.className = "cart-item-name";
    name.textContent = product.name;
    const price = document.createElement("span");
    price.className = "cart-item-price";
    price.textContent = formatCurrency(product.price * item.quantity);
    const controls = document.createElement("div");
    controls.className = "item-controls";
    controls.append(createQuantityButton("−", `Disminuir cantidad de ${product.name}`, () => changeQuantity(item.id, -1)));
    const quantity = document.createElement("span");
    quantity.className = "quantity";
    quantity.textContent = item.quantity;
    controls.append(quantity, createQuantityButton("+", `Aumentar cantidad de ${product.name}`, () => changeQuantity(item.id, 1)));
    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.type = "button";
    removeButton.textContent = "Eliminar";
    removeButton.addEventListener("click", () => removeFromCart(item.id));

    element.append(name, controls, price, removeButton);
    return element;
}

function renderCart() {
    cartItems.replaceChildren();
    if (cart.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-cart";
        emptyMessage.textContent = "Tu carrito está esperando algo bonito.";
        cartItems.append(emptyMessage);
    } else {
        cart.forEach((item) => cartItems.append(createCartItem(item)));
    }

    const quantity = getTotalQuantity();
    const subtotal = calculateSubtotal();
    headerCount.textContent = quantity;
    cartCount.textContent = quantity;
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