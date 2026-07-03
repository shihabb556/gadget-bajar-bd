import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    _id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
    quantity: number;
    selectedColor?: string;
}

interface CartStore {
    items: CartItem[];
    addToCart: (product: any, selectedColor?: string, colorImage?: string) => void;
    removeFromCart: (productId: string, selectedColor?: string) => void;
    updateQuantity: (productId: string, quantity: number, selectedColor?: string) => void;
    clearCart: () => void;
    total: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addToCart: (product, selectedColor, colorImage) => {
                const items = get().items;
                const existingItem = items.find(
                    (item) => item._id === product._id && item.selectedColor === selectedColor
                );

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item._id === product._id && item.selectedColor === selectedColor
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({
                        items: [...items, {
                            _id: product._id,
                            name: product.name,
                            price: (product.discountPrice && product.discountPrice > 0) ? product.discountPrice : product.price,
                            image: colorImage || product.images?.[0] || '',
                            slug: product.slug,
                            quantity: 1,
                            selectedColor: typeof selectedColor === 'object' ? selectedColor?.name || '' : selectedColor || ''
                        }],
                    });
                }
            },
            removeFromCart: (productId, selectedColor) => {
                set({
                    items: get().items.filter(
                        (item) => !(item._id === productId && item.selectedColor === selectedColor)
                    )
                });
            },
            updateQuantity: (productId, quantity, selectedColor) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId, selectedColor);
                    return;
                }
                set({
                    items: get().items.map((item) =>
                        item._id === productId && item.selectedColor === selectedColor
                            ? { ...item, quantity }
                            : item
                    ),
                });
            },
            clearCart: () => set({ items: [] }),
            total: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'shopping-cart',
            merge: (persisted, current) => {
                const data = { ...current, ...(persisted as Partial<CartStore>) };
                if (data.items) {
                    data.items = data.items.map((item: CartItem) => ({
                        ...item,
                        selectedColor: typeof item.selectedColor === 'object' ? '' : item.selectedColor
                    }));
                }
                return data;
            }
        }
    )
);
