import Stripe from 'stripe';

if (!process.env.STRIPE_KEY) {
    throw new Error('Stripe key not set!')
}
                                // stripe-key, option-object
export const stripe = new Stripe(process.env.STRIPE_KEY, {
    apiVersion: '2023-08-16',
});