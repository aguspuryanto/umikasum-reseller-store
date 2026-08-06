'use client';

import { useCallback, useSyncExternalStore } from 'react';

export type CartItem = {
    id: string;
    name: string;
    price: number;
    image: string | null;
    stock: number;
    quantity: number;
};

type AddableProduct = {
    id: string;
    name: string;
    sellPrice: number;
    image: string | null;
    stock: number;
};

const STORAGE_KEY = 'umikasum-cart';
const EMPTY_CART: CartItem[] = [];

let cartState: CartItem[] | null = null;
const listeners = new Set<() => void>();

function readFromStorage(): CartItem[] {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function getSnapshot() {
    if (cartState === null) {
        cartState = readFromStorage();
    }
    return cartState;
}

function getServerSnapshot() {
    return EMPTY_CART;
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function setCart(next: CartItem[]) {
    cartState = next;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    listeners.forEach(listener => listener());
}

function addItemToStore(product: AddableProduct, quantity: number) {
    const current = getSnapshot();
    const existing = current.find(item => item.id === product.id);
    if (existing) {
        setCart(
            current.map(item =>
                item.id === product.id
                    ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
                    : item
            )
        );
        return;
    }
    setCart([
        ...current,
        {
            id: product.id,
            name: product.name,
            price: product.sellPrice,
            image: product.image,
            stock: product.stock,
            quantity: Math.min(quantity, product.stock),
        },
    ]);
}

function removeItemFromStore(id: string) {
    setCart(getSnapshot().filter(item => item.id !== id));
}

function updateQuantityInStore(id: string, quantity: number) {
    if (quantity <= 0) {
        removeItemFromStore(id);
        return;
    }
    setCart(
        getSnapshot().map(item =>
            item.id === id ? { ...item, quantity: Math.min(quantity, item.stock) } : item
        )
    );
}

function clearCartStore() {
    setCart([]);
}

export function useCart() {
    const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const addItem = useCallback((product: AddableProduct, quantity = 1) => {
        addItemToStore(product, quantity);
    }, []);
    const removeItem = useCallback((id: string) => removeItemFromStore(id), []);
    const updateQuantity = useCallback((id: string, quantity: number) => updateQuantityInStore(id, quantity), []);
    const clearCart = useCallback(() => clearCartStore(), []);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    return { items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice };
}
