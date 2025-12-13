 
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // هنجيب المفتاح من .env

module.exports = stripe;