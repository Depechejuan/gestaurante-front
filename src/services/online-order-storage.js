import { mergeCartItems, readStoredJson, removeCartItemById, updateCartItemsQuantity, writeStoredJson } from "./storage-utils";

const ONLINE_CART_KEY = "GST_ONLINE_CART";

function readCart() {
    return readStoredJson(ONLINE_CART_KEY, []);
}

function writeCart(items) {
    writeStoredJson(ONLINE_CART_KEY, items);
}

export function getOnlineCart() {
    return readCart();
}

export function addOnlineCartItem(item) {
    const cart = mergeCartItems(readCart(), item);
    writeCart(cart);
    return cart;
}

export function addManyOnlineCartItems(items) {
    const next = (items ?? []).reduce((cart, item) => mergeCartItems(cart, item), readCart());
    writeCart(next);
    return next;
}

export function updateOnlineCartItem(itemId, quantity) {
    const next = updateCartItemsQuantity(readCart(), itemId, quantity);
    writeCart(next);
    return next;
}

export function removeOnlineCartItem(itemId) {
    const next = removeCartItemById(readCart(), itemId);
    writeCart(next);
    return next;
}

export function clearOnlineCart() {
    writeCart([]);
    return [];
}
