const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ['base', 'sauce', 'cheese', 'veggies'], required: true },
    stock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 }
});

module.exports = mongoose.model('Inventory', InventorySchema);
