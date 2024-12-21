import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Assuming Tailwind CSS is set up

// Context for managing cart state
const CartContext = createContext();

// Provider component
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  // const apiBase = "https://cacbc738b7cbda903cbb.free.beeceptor.com/api/users/";
  // const apiBase = "https://marketplace.free.beeceptor.com/api/productos/";
 
  const apiBase = "https://caff9bf99d1aee1ab862.free.beeceptor.com/api/users/";

  // Fetch items from CRUDCRUD API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(apiBase);
        setCart(response.data);
      } catch (error) {
        setError("Error fetching cart items.");
      }
    };
    fetchItems();
  }, []);

  // Fetch mock items for the marketplace
  useEffect(() => {
    const mockItems = [
      { id: 1, name: "Women Winter Jacket", price: 100 },
      { id: 2, name: "Men Winter Jacket", price: 200 },
      { id: 3, name: "Women Winter Top", price: 300 },
    ];
    setItems(mockItems);
  }, []);

  const addItemToCart = async (item) => {
    try {
      const response = await axios.post(apiBase, item);
      setCart([...cart, response.data]);
    } catch (error) {
      setError("Error adding item to cart.");
    }
  };

  const removeItemFromCart = async (id) => {
    try {
      await axios.delete(`${apiBase}/${id}`);
      setCart(cart.filter((item) => item._id !== id));
    } catch (error) {
      setError("Error removing item from cart.");
    }
  };

  return (
    <CartContext.Provider value={{ cart, items, addItemToCart, removeItemFromCart, error }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

const Marketplace = () => {
  const { items, addItemToCart, error } = useCart();

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Marketplace</h1>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="border rounded-lg shadow-lg p-4 bg-white">
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <p className="text-lg text-gray-500">${item.price}</p>
            <button
              className="w-full bg-blue-500 text-white py-2 mt-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => addItemToCart(item)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const Cart = () => {
  const { cart, removeItemFromCart, error } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="p-6 bg-gray-50 mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Cart</h1>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <div className="bg-white p-4 rounded-lg shadow-md">
        {cart.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <ul className="space-y-4">
            {cart.map((item) => (
              <li key={item._id} className="flex justify-between items-center">
                <span>{item.name} - ${item.price}</span>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  onClick={() => removeItemFromCart(item._id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 border-t pt-4">
          <p className="font-semibold text-lg text-right">Total: ${total}</p>
          <p className="text-gray-500 text-right">Items in Cart: {cart.length}</p>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <CartProvider>
      <div className="w-full min-h-screen bg-gray-100"> {/* Full width and min height to cover screen */}
        <Marketplace />
        <Cart />
      </div>
    </CartProvider>
  );
};

export default App;
