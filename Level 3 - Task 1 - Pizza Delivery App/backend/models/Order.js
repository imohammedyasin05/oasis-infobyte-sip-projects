const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        base: String,
        sauce: String,
        cheese: String,
        veggies: [String],
        quantity: { type: Number, default: 1 }
    }],
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Received', 'In Kitchen', 'Out for Delivery', 'Delivered'], 
        default: 'Received' 
    },
    paymentId: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
