import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

function UserView({ addOrder }) {
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3002/menu')
      .then((response) => response.json())
      .then((data) => {
        console.log("Données reçues:", data);
        if (Array.isArray(data)) {
          setMenu(data);
        } else {
          setError("Erreur: Données incorrectes");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du menu:", error);
        setError("Impossible de récupérer les menus.");
      });
  }, []);

  const handleOrder = (plateId) => {
    const username = prompt("Entrez votre nom pour la commande:");
    if (username) {
      fetch('http://localhost:3002/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plateId, username })
      })
        .then((response) => response.json())
        .then((order) => {
          console.log("Commande créée:", order);
          addOrder(order);
        })
        .catch((error) => console.error("Erreur lors de la création de la commande:", error));
    }
  };

  return (
    <div>
      <h1>Bienvenue sur Adalicious</h1>
      {error ? <p style={{ color: "red" }}>{error}</p> : null}
      <div>
        {menu.length > 0 ? (
          menu.map((item) => (
            <div key={item.id}>
              <span>{item.emoji}</span>
              <h2>{item.plate}</h2>
              <p>{item.description}</p>
              <button onClick={() => handleOrder(item.id)}>Commander</button>
            </div>
          ))
        ) : (
          <p>Aucun plat disponible.</p>
        )}
      </div>
    </div>
  );
}

function KitchenView({ orders, updateOrderStatus }) {
  return (
    <div>
      <h1>Vue Cuisine</h1>
      {orders.length === 0 ? (
        <p>Aucune commande en attente.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id}>
            <h2>Commande de {order.username}</h2>
            <p>{order.plate ? `${order.plate.plate} - ${order.plate.description}` : "Plat inconnu"}</p>
            <button onClick={() => updateOrderStatus(order.id, "prête")}>Prête !</button>
            <button onClick={() => updateOrderStatus(order.id, "annulée")}>Annuler</button>
          </div>
        ))
      )}
    </div>
  );
}

function App() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3002/order')
      .then((response) => response.json())
      .then((data) => {
        console.log("Commandes reçues:", data);
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setError("Erreur: Données incorrectes");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des commandes:", error);
        setError("Impossible de récupérer les commandes.");
      });
  }, []);

  const addOrder = (order) => {
    setOrders((prevOrders) => [...prevOrders, order]);
  };

  const updateOrderStatus = (orderId, status) => {
    fetch(`http://localhost:3002/order/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status })
    })
      .then((response) => response.json())
      .then((updatedOrder) => {
        console.log("Commande mise à jour:", updatedOrder);
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== updatedOrder.id));
      })
      .catch((error) => console.error("Erreur lors de la mise à jour du statut de la commande:", error));
  };

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <Link to="/">Accueil</Link>
          <Link to="/kitchen">Cuisine</Link>
        </nav>
        {error ? <p style={{ color: "red" }}>{error}</p> : null}
        <Routes>
          <Route path="/" element={<UserView addOrder={addOrder} />} />
          <Route path="/kitchen" element={<KitchenView orders={orders} updateOrderStatus={updateOrderStatus} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
