import { NextResponse } from 'next/server';
import { createCart } from '@/lib/shopify/client';
import { getSelectedCountry } from '@/lib/localization.server';

interface CheckoutLine {
  merchandiseId?: unknown;
  quantity?: unknown;
}

export async function POST(request: Request) {
  if (!process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN && !process.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN) {
    return NextResponse.json(
      { error: 'Shopify checkout is not configured. Add a Storefront API token first.' },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as { lines?: CheckoutLine[] };
    const lines = body.lines?.map((line) => ({
      merchandiseId: typeof line.merchandiseId === 'string' ? line.merchandiseId : '',
      quantity: typeof line.quantity === 'number' ? Math.floor(line.quantity) : 0
    })).filter((line) => line.merchandiseId && line.quantity > 0);

    if (!lines?.length) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
    }

    // Create the checkout for the same country the shopper browsed in, so the
    // payment page uses the same market and currency as the prices they saw.
    const country = await getSelectedCountry();
    const cart = await createCart(lines, { country });

    if (!cart.checkoutUrl || cart.checkoutUrl === 'https://checkout.shopify.com') {
      return NextResponse.json(
        { error: 'Shopify could not create a checkout for these products. Confirm the variant IDs and Storefront API permissions.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ checkoutUrl: cart.checkoutUrl });
  } catch {
    return NextResponse.json(
      { error: 'We could not start checkout. Please try again.' },
      { status: 500 }
    );
  }
}