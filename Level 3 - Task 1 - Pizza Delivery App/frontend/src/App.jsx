import React, { useState, useContext, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Package, ShieldCheck, Zap, Check } from 'lucide-react';
import './App.css';

// Context
const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('pizza_user')));
  const [orders, setOrders] = useState(JSON.parse(localStorage.getItem('pizza_orders') || '[]'));

  const bases = ['Thin Crust', 'Thick Crust', 'Stuffed Crust', 'Whole Wheat', 'Gluten Free'];
  const sauces = ['Marinara', 'BBQ', 'White Garlic', 'Pesto', 'Hot Chili'];
  const cheeses = ['Mozzarella', 'Cheddar', 'Parmesan', 'Gouda', 'Vegan Cheese'];
  const veggies = ['Bell Peppers', 'Mushrooms', 'Olives', 'Onions', 'Jalapeños', 'Sweet Corn', 'Spinach', 'Tomatoes'];

  const addToCart = (item) => setCart(prev => [...prev, item]);
  const removeFromCart = (i) => setCart(prev => prev.filter((_, idx) => idx !== i));
  const clearCart = () => setCart([]);

  const placeOrder = (paymentId) => {
    const order = {
      id: 'ORD-' + Date.now(),
      items: [...cart],
      total: cart.reduce((s, i) => s + i.price, 0),
      status: 'Received',
      paymentId,
      date: new Date().toISOString(),
    };
    const updated = [order, ...orders];
    setOrders(updated);
    localStorage.setItem('pizza_orders', JSON.stringify(updated));
    clearCart();
    return order;
  };

  const updateOrderStatus = (id, status) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    localStorage.setItem('pizza_orders', JSON.stringify(updated));
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('pizza_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pizza_user');
  };

  return (
    <AppContext.Provider value={{ cart, user, orders, bases, sauces, cheeses, veggies, addToCart, removeFromCart, clearCart, placeOrder, updateOrderStatus, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};

// Navbar
const Navbar = () => {
  const { cart, user, logout } = useApp();
  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="logo">Pizza<span>Fresh</span></Link>
        <div className="nav-links">
          <Link to="/">Menu</Link>
          {user ? (
            <>
              {user.role === 'admin' && <Link to="/admin"><ShieldCheck size={16}/> Admin</Link>}
              <Link to="/orders"><Package size={16}/> Orders</Link>
              <Link to="/cart" className="cart-link">
                <ShoppingCart size={16}/>
                {cart.length > 0 && <span className="badge">{cart.length}</span>}
              </Link>
              <button onClick={logout} className="nav-logout"><LogOut size={16}/></button>
            </>
          ) : (
            <Link to="/login" className="login-link">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

// Menu Page
const pizzaMenu = [
  { id: 1, name: 'Ultimate Margherita', desc: 'Fresh basil, bocconcini, and house marinara.', price: 14.99, img: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Pepperoni Feast', desc: 'Double pepperoni with a blend of cheeses.', price: 16.99, img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Garden Delight', desc: 'Capsicum, olives, mushrooms, and sweet corn.', price: 15.99, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400' },
  { id: 4, name: 'BBQ Chicken', desc: 'Smoky BBQ sauce, grilled chicken, red onions.', price: 17.99, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400' },
  { id: 5, name: 'Hawaiian Bliss', desc: 'Ham, pineapple, and mozzarella cheese.', price: 15.49, img: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&q=80&w=400' },
  { id: 6, name: 'Veggie Supreme', desc: 'Loaded with seasonal vegetables and herbs.', price: 14.49, img: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&q=80&w=400' },
];

const Home = () => {
  const { addToCart } = useApp();
  const nav = useNavigate();
  return (
    <div className="page container">
      <section className="hero-banner">
        <h1>Crafted with <span>Passion</span>, Delivered with <span>Speed</span></h1>
        <p>Premium ingredients. Hand-tossed dough. Infinite customizations.</p>
        <div className="hero-badges"><span><Zap size={16}/> 30 Min Delivery</span><span><Check size={16}/> Fresh Ingredients</span></div>
      </section>
      <div className="menu-grid">
        {pizzaMenu.map(p => (
          <div key={p.id} className="pizza-card">
            <div className="pizza-img-wrap"><img src={p.img} alt={p.name}/><span className="price-tag">${p.price}</span></div>
            <div className="pizza-info">
              <h3>{p.name}</h3><p>{p.desc}</p>
              <div className="card-actions">
                <button className="btn-secondary" onClick={() => nav('/customize')}>Customize</button>
                <button className="btn-primary" onClick={() => addToCart({ name: p.name, price: p.price, base: 'Thin Crust', sauce: 'Marinara', cheese: 'Mozzarella', veggies: [] })}>Quick Add</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Customize Page
const Customize = () => {
  const { bases, sauces, cheeses, veggies, addToCart } = useApp();
  const nav = useNavigate();
  const [sel, setSel] = useState({ base: bases[0], sauce: sauces[0], cheese: cheeses[0], veggies: [] });
  const [added, setAdded] = useState(false);
  const price = 12.99 + sel.veggies.length * 1.5;

  const toggleVeg = (v) => setSel(p => ({ ...p, veggies: p.veggies.includes(v) ? p.veggies.filter(x => x !== v) : [...p.veggies, v] }));

  const handleAdd = () => {
    addToCart({ name: 'Custom Pizza', ...sel, price: +price.toFixed(2) });
    setAdded(true);
    setTimeout(() => nav('/cart'), 800);
  };

  return (
    <div className="page container">
      <h2 className="page-title">Build Your Pizza</h2>
      <div className="customize-grid">
        <div className="custom-section">
          <h3>1. Choose Base</h3>
          <div className="option-grid">{bases.map(b => <button key={b} className={`option-btn ${sel.base === b ? 'active' : ''}`} onClick={() => setSel(p => ({...p, base: b}))}>{b}</button>)}</div>
        </div>
        <div className="custom-section">
          <h3>2. Choose Sauce</h3>
          <div className="option-grid">{sauces.map(s => <button key={s} className={`option-btn ${sel.sauce === s ? 'active' : ''}`} onClick={() => setSel(p => ({...p, sauce: s}))}>{s}</button>)}</div>
        </div>
        <div className="custom-section">
          <h3>3. Choose Cheese</h3>
          <div className="option-grid">{cheeses.map(c => <button key={c} className={`option-btn ${sel.cheese === c ? 'active' : ''}`} onClick={() => setSel(p => ({...p, cheese: c}))}>{c}</button>)}</div>
        </div>
        <div className="custom-section">
          <h3>4. Add Veggies <span className="muted">(+$1.50 each)</span></h3>
          <div className="option-grid">{veggies.map(v => <button key={v} className={`option-btn ${sel.veggies.includes(v) ? 'active' : ''}`} onClick={() => toggleVeg(v)}>{v}</button>)}</div>
        </div>
      </div>
      <div className="custom-summary">
        <p className="custom-price">Total: <strong>${price.toFixed(2)}</strong></p>
        <button className={`btn-primary btn-lg ${added ? 'btn-success' : ''}`} onClick={handleAdd}>{added ? '✓ Added!' : 'Add to Cart'}</button>
      </div>
    </div>
  );
};

// Cart Page
const Cart = () => {
  const { cart, removeFromCart, user } = useApp();
  const nav = useNavigate();
  const total = cart.reduce((s, i) => s + i.price, 0);

  if (cart.length === 0) return <div className="page container empty-page"><h2>Your Cart is Empty</h2><p>Add some delicious pizzas from our menu!</p><button className="btn-primary" onClick={() => nav('/')}>Browse Menu</button></div>;

  return (
    <div className="page container">
      <h2 className="page-title">Your Cart</h2>
      <div className="cart-list">
        {cart.map((item, i) => (
          <div key={i} className="cart-item">
            <div className="cart-item-info">
              <h4>{item.name}</h4>
              <p className="muted">{item.base} • {item.sauce} • {item.cheese}{item.veggies?.length > 0 ? ` • ${item.veggies.join(', ')}` : ''}</p>
            </div>
            <span className="cart-price">${item.price.toFixed(2)}</span>
            <button className="btn-remove" onClick={() => removeFromCart(i)}>×</button>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <div className="cart-total">Total: <strong>${total.toFixed(2)}</strong></div>
        <button className="btn-primary btn-lg" onClick={() => user ? nav('/checkout') : nav('/login')}>
          {user ? 'Proceed to Checkout' : 'Login to Checkout'}
        </button>
      </div>
    </div>
  );
};

// Checkout Page (Razorpay Test Mode Simulation)
const Checkout = () => {
  const { cart, placeOrder } = useApp();
  const nav = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const total = cart.reduce((s, i) => s + i.price, 0);

  const handlePay = () => {
    setProcessing(true);
    // Simulated Razorpay test mode payment
    setTimeout(() => {
      const paymentId = 'pay_' + Math.random().toString(36).substr(2, 14);
      placeOrder(paymentId);
      setProcessing(false);
      setDone(true);
      setTimeout(() => nav('/orders'), 2000);
    }, 2000);
  };

  if (done) return <div className="page container empty-page"><h2 style={{color:'#10b981'}}>✓ Order Placed!</h2><p>Your delicious pizza is on its way. Redirecting to orders...</p></div>;

  return (
    <div className="page container">
      <h2 className="page-title">Checkout</h2>
      <div className="checkout-card">
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cart.map((item, i) => <div key={i} className="checkout-line"><span>{item.name}</span><span>${item.price.toFixed(2)}</span></div>)}
          <div className="checkout-line total"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>
        <div className="checkout-pay">
          <h3>Payment (Razorpay Test Mode)</h3>
          <div className="test-badge">🧪 Test Mode — No real money charged</div>
          <button className="btn-primary btn-lg" onClick={handlePay} disabled={processing}>
            {processing ? 'Processing Payment...' : `Pay $${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

// Orders Page
const Orders = () => {
  const { orders } = useApp();
  const statusColors = { 'Received': '#f59e0b', 'In Kitchen': '#6366f1', 'Out for Delivery': '#3b82f6', 'Delivered': '#10b981' };

  if (orders.length === 0) return <div className="page container empty-page"><h2>No Orders Yet</h2><p>Place your first order from our menu!</p></div>;

  return (
    <div className="page container">
      <h2 className="page-title">Your Orders</h2>
      <div className="orders-list">
        {orders.map(o => (
          <div key={o.id} className="order-card">
            <div className="order-header">
              <span className="order-id">{o.id}</span>
              <span className="order-status" style={{ background: statusColors[o.status] + '20', color: statusColors[o.status] }}>{o.status}</span>
            </div>
            <div className="order-items">{o.items.map((it, i) => <span key={i} className="order-item-tag">{it.name}</span>)}</div>
            <div className="order-footer">
              <span className="muted">{new Date(o.date).toLocaleDateString()}</span>
              <span className="order-total">${o.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Login Page
const Login = () => {
  const { login } = useApp();
  const nav = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) return setError('All fields are required.');
    if (isRegister && !form.name) return setError('Name is required.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');

    const users = JSON.parse(localStorage.getItem('pizza_users') || '[]');

    if (isRegister) {
      if (users.find(u => u.email === form.email)) return setError('Email already exists.');
      const newUser = { name: form.name, email: form.email, password: form.password, role: form.email.includes('admin') ? 'admin' : 'user' };
      users.push(newUser);
      localStorage.setItem('pizza_users', JSON.stringify(users));
      login({ name: newUser.name, email: newUser.email, role: newUser.role });
    } else {
      const found = users.find(u => u.email === form.email && u.password === form.password);
      if (!found) return setError('Invalid email or password.');
      login({ name: found.name, email: found.email, role: found.role });
    }
    nav('/');
  };

  return (
    <div className="page container auth-page">
      <div className="auth-card">
        <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
        <p className="muted">{isRegister ? 'Join PizzaFresh today' : 'Sign in to your account'}</p>
        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && <input placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>}
          <input type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}/>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn-primary btn-lg">{isRegister ? 'Register' : 'Sign In'}</button>
        </form>
        <p className="auth-toggle">{isRegister ? 'Already have an account?' : "Don't have an account?"} <button onClick={() => { setIsRegister(!isRegister); setError(''); }}>{isRegister ? 'Sign In' : 'Register'}</button></p>
        <p className="muted" style={{fontSize:'0.75rem',marginTop:'0.5rem'}}>Tip: Use an email containing "admin" to get admin access.</p>
      </div>
    </div>
  );
};

// Admin Dashboard
const Admin = () => {
  const { orders, updateOrderStatus } = useApp();
  const statuses = ['Received', 'In Kitchen', 'Out for Delivery', 'Delivered'];
  const statusColors = { 'Received': '#f59e0b', 'In Kitchen': '#6366f1', 'Out for Delivery': '#3b82f6', 'Delivered': '#10b981' };

  const inventory = [
    { name: 'Thin Crust', category: 'Base', stock: 48 }, { name: 'Thick Crust', category: 'Base', stock: 35 },
    { name: 'Marinara', category: 'Sauce', stock: 40 }, { name: 'BBQ', category: 'Sauce', stock: 22 },
    { name: 'Mozzarella', category: 'Cheese', stock: 30 }, { name: 'Cheddar', category: 'Cheese', stock: 18 },
    { name: 'Bell Peppers', category: 'Veggie', stock: 5 }, { name: 'Mushrooms', category: 'Veggie', stock: 60 },
  ];

  return (
    <div className="page container">
      <h2 className="page-title">Admin Dashboard</h2>
      <div className="admin-grid">
        <section className="admin-section">
          <h3>📦 Order Management</h3>
          {orders.length === 0 ? <p className="muted">No orders yet.</p> : orders.map(o => (
            <div key={o.id} className="admin-order">
              <div className="order-header"><span className="order-id">{o.id}</span><span>${o.total.toFixed(2)}</span></div>
              <div className="order-items">{o.items.map((it, i) => <span key={i} className="order-item-tag">{it.name}</span>)}</div>
              <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)} style={{ borderColor: statusColors[o.status] }}>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </section>
        <section className="admin-section">
          <h3>📊 Inventory</h3>
          <div className="inv-table">
            <div className="inv-header"><span>Item</span><span>Category</span><span>Stock</span><span>Status</span></div>
            {inventory.map(item => (
              <div key={item.name} className="inv-row">
                <span>{item.name}</span><span className="muted">{item.category}</span><span>{item.stock}</span>
                <span className={`stock-tag ${item.stock < 10 ? 'low' : 'ok'}`}>{item.stock < 10 ? '⚠ Low' : '✓ OK'}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// App
export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main><Routes>
            <Route path="/" element={<Home />} />
            <Route path="/customize" element={<Customize />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
          </Routes></main>
          <footer className="footer"><div className="container"><p>© 2026 PizzaFresh — Premium Pizza Delivery</p></div></footer>
        </div>
      </Router>
    </AppProvider>
  );
}
