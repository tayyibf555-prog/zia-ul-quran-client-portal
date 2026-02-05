import Stripe from 'stripe';

export default async function handler(req, res) {
    // Return early for preflight CORS requests if needed, although Vercel handles this in config usually
    // Return early for preflight CORS requests if needed
    if (req.method === 'OPTIONS') {
        return res.status(200).send();
    }

    // Security Check: simple shared secret
    const authHeader = req.headers['x-portal-auth'];
    if (authHeader !== 'pass') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // 1. Check for Secret Key
    if (!process.env.STRIPE_SECRET_KEY) {
        console.error('Missing STRIPE_SECRET_KEY');
        return res.status(500).json({ error: 'Server configuration error: Stripe key missing' });
    }

    // 2. Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // 3. Get Customer ID (either from query param or env var for single-client portals)
    const customerId = req.query.customerId || process.env.STRIPE_CUSTOMER_ID;

    if (!customerId) {
        return res.status(400).json({ error: 'Missing customer ID' });
    }

    try {
        // 4. Fetch Invoices
        const invoices = await stripe.invoices.list({
            customer: customerId,
            limit: 10,
            status: 'open', // Ideally 'all' if we want paid ones too, but filtering is good
            created: { gte: 1772323200 }, // Start from March 1st, 2026 (Epoch Timestamp)
        });

        // 5. Transform Data for Frontend
        const simplifiedInvoices = invoices.data.map(invoice => ({
            id: invoice.id,
            date: new Date(invoice.created * 1000).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }),
            description: invoice.description || 'Service Payment',
            amount: (invoice.amount_due / 100).toFixed(2), // Convert cents to currency
            currency: invoice.currency.toUpperCase(),
            status: invoice.status, // 'paid', 'open', 'void', 'uncollectible'
            pdfUrl: invoice.invoice_pdf,
            hostedUrl: invoice.hosted_invoice_url,
        }));

        return res.status(200).json({ invoices: simplifiedInvoices });
    } catch (error) {
        console.error('Stripe API Error:', error);
        return res.status(500).json({ error: 'Failed to fetch payment data' });
    }
}
