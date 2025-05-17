const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const fs = require('fs');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Gumroad API Configuration
const GUMROAD_API_KEY = process.env.GUMROAD_API_KEY;
const GUMROAD_PRODUCT_IDS = {
    'Starter': process.env.GUMROAD_STARTER_ID,
    'Standard': process.env.GUMROAD_STANDARD_ID,
    'Premium': process.env.GUMROAD_PREMIUM_ID
};

// In-memory email send count (for demo; use a real DB in production)
const emailSendCounts = {};

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Purchase schema/model
const purchaseSchema = new mongoose.Schema({
  email: String,
  package: String,
  date: { type: Date, default: Date.now },
  sendCount: { type: Number, default: 1 }
});
const Purchase = mongoose.model('Purchase', purchaseSchema);

// Payment endpoint
app.post('/api/process-payment', async (req, res) => {
    try {
        const { packageDetails, customerInfo } = req.body;
        
        const response = await axios.post('https://api.gumroad.com/v2/sales', {
            access_token: GUMROAD_API_KEY,
            product_id: GUMROAD_PRODUCT_IDS[packageDetails.name],
            email: customerInfo.email,
            name: customerInfo.name
        });

        if (response.data.success) {
            res.json({ 
                success: true, 
                purchase_url: response.data.purchase_url,
                message: 'Purchase URL generated successfully' 
            });
        } else {
            res.status(400).json({ 
                success: false, 
                message: response.data.message || 'Failed to create purchase'
            });
        }
    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Gumroad Webhook endpoint
app.post('/api/gumroad-webhook', async (req, res) => {
    console.log('Webhook geldi:', req.body);
    const { email, product_name } = req.body;
    try {
        let purchase = await Purchase.findOne({ email, package: product_name });
        if (purchase) {
            if (purchase.sendCount >= 3) {
                return res.status(429).json({ success: false, message: "Resend limit reached for this email." });
            }
            purchase.sendCount += 1;
            await purchase.save();
        } else {
            purchase = new Purchase({ email, package: product_name });
            await purchase.save();
        }
        res.json({ success: true, message: "Webhook received and processed." });
    } catch (err) {
        console.error('MongoDB purchase save error:', err);
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 