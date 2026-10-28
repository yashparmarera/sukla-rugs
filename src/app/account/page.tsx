import { redirect } from 'next/navigation';

// Customer accounts are owned by Shopify (login, order history, addresses).
// This route sends visitors to Shopify's hosted account page instead of
// rendering a local sign-in form that cannot authenticate anyone.
export const dynamic = 'force-dynamic';

export default function AccountPage() {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN || 'vt0dch-hg.myshopify.com';
  redirect(`https://${storeDomain}/account`);
}
