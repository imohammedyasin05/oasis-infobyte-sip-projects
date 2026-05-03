const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const auth = require('../middleware/auth');

// Create Order
router.post('/', auth, async (req, res) => {
    const { items, totalAmount, paymentId } = req.body;
    try {
        const order = new Order({
            user: req.user.id,
            items,
            totalAmount,
            paymentId
        });
        await order.save();
        
        // Decrement inventory (simplified)
        for (let item of items) {
            await Inventory.findOneAndUpdate({ name: item.base }, { $inc: { stock: -1 } });
            await Inventory.findOneAndUpdate({ name: item.sauce }, { $inc: { stock: -1 } });
            await Inventory.findOneAndUpdate({ name: item.cheese }, { $inc: { stock: -1 } });
        }
        
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user orders
router.get('/myorders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Get all orders
router.get('/all', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    try {
        const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Update status
router.put('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
