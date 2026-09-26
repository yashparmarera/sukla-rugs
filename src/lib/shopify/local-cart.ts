import { Cart, CartItem, Product } from '@/types';

const EMPTY_CART: Cart = {
  id: 'cart-empty',
  checkoutUrl: 'https://checkout.shopify.com',
  totalQuantity: 0,
  lines: [],
  cost: {
    subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
    totalAmount: { amount: '0.00', currencyCode: 'USD' }
  }
};

function notifyCartUpdate(cart: Cart): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('shukla:cart-updated', { detail: cart }));
}

export function getLocalCart(): Cart {
  if (typeof window === 'undefined') return { ...EMPTY_CART, lines: [], cost: { ...EMPTY_CART.cost } };

  try {
    const raw = localStorage.getItem('shukla_cart_v1');
    if (raw) return JSON.parse(raw);

    const emptyCart: Cart = {
      ...EMPTY_CART,
      id: 'cart-' + Math.random().toString(36).substring(2, 9),
      lines: [],
      cost: {
        subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
        totalAmount: { amount: '0.00', currencyCode: 'USD' }
      }
    };
    localStorage.setItem('shukla_cart_v1', JSON.stringify(emptyCart));
    return emptyCart;
  } catch {
    return { ...EMPTY_CART, lines: [], cost: { ...EMPTY_CART.cost } };
  }
}

function persistCart(cart: Cart): Cart {
  if (typeof window !== 'undefined') {
    localStorage.setItem('shukla_cart_v1', JSON.stringify(cart));
    notifyCartUpdate(cart);
  }
  return cart;
}

function recalculateCart(cart: Cart): Cart {
  let totalQuantity = 0;
  let subtotal = 0;

  cart.lines.forEach((line) => {
    totalQuantity += line.quantity;
    subtotal += parseFloat(line.merchandise.price.amount) * line.quantity;
  });

  cart.totalQuantity = totalQuantity;
  cart.cost = {
    subtotalAmount: { amount: subtotal.toFixed(2), currencyCode: 'USD' },
    totalAmount: { amount: subtotal.toFixed(2), currencyCode: 'USD' }
  };
  return persistCart(cart);
}

export function addToLocalCart(product: Product, variantId?: string, quantity = 1): Cart {
  const currentCart = getLocalCart();
  const variant = product.variants.find((item) => item.id === variantId) || product.variants[0];
  const existingLineIndex = currentCart.lines.findIndex((line) => line.merchandise.id === variant.id);

  if (existingLineIndex > -1) {
    const line = currentCart.lines[existingLineIndex];
    line.quantity += quantity;
    line.cost.totalAmount.amount = (line.quantity * parseFloat(variant.price.amount)).toFixed(2);
  } else {
    const newLine: CartItem = {
      id: 'line-' + Math.random().toString(36).substring(2, 9),
      quantity,
      cost: {
        totalAmount: {
          amount: (parseFloat(variant.price.amount) * quantity).toFixed(2),
          currencyCode: variant.price.currencyCode
        }
      },
      merchandise: {
        id: variant.id,
        title: variant.title,
        product: {
          id: product.id,
          handle: product.handle,
          title: product.title,
          featuredImage: product.featuredImage,
          collection: { title: product.collection.title }
        },
        price: variant.price,
        selectedOptions: variant.selectedOptions
      }
    };
    currentCart.lines.push(newLine);
  }

  return recalculateCart(currentCart);
}

export function updateLocalCartLine(lineId: string, quantity: number): Cart {
  const currentCart = getLocalCart();
  if (quantity <= 0) {
    currentCart.lines = currentCart.lines.filter((line) => line.id !== lineId);
  } else {
    const line = currentCart.lines.find((item) => item.id === lineId);
    if (line) {
      line.quantity = quantity;
      line.cost.totalAmount.amount = (quantity * parseFloat(line.merchandise.price.amount)).toFixed(2);
    }
  }
  return recalculateCart(currentCart);
}

export function removeFromLocalCartLine(lineId: string): Cart {
  return updateLocalCartLine(lineId, 0);
}
