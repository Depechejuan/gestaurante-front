const ONLINE_CART_KEY = "GST_ONLINE_CART";

function readCart() {
    try {
        return JSON.parse(localStorage.getItem(ONLINE_CART_KEY) ?? "[]");
    } catch {
        return [];
    }
}

function writeCart(items) {
    localStorage.setItem(ONLINE_CART_KEY, JSON.stringify(items));
}

export function getOnlineCart() {
    return readCart();
}

export function addOnlineCartItem(item) {
    const cart = readCart();
    const index = cart.findIndex((entry) => entry.id === item.id);
    if (index >= 0) {
        cart[index] = { ...cart[index], quantity: cart[index].quantity + item.quantity };
    } else {
        cart.push(item);
    }

    writeCart(cart);
    return cart;
}

export function updateOnlineCartItem(itemId, quantity) {
    const next = readCart()
        .map((item) => (item.id === itemId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0);
    writeCart(next);
    return next;
}

export function removeOnlineCartItem(itemId) {
    const next = readCart().filter((item) => item.id !== itemId);
    writeCart(next);
    return next;
}

export function clearOnlineCart() {
    writeCart([]);
    return [];
}
