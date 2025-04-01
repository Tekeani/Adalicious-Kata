import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

function UserView({ addOrder }) {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3002/menu')
      .then((response) => response.json())
      .then((data) => {
        console.log("Données reçues:", data);
        setMenu(data);
      })
      .catch((error) => console.error("Erreur lors de la récupération du menu:", error));
  }, []);

  const handleOrder = (plate_id) => {
    const username = prompt("Entrez votre nom pour la commande:");
    if (username) {
      fetch('http://localhost:3002/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plate_id, username })
      })
        .then((response) => response.json())
        .then((order) => {
          console.log(order);
          addOrder(order);
        })
        .catch((error) => console.error("Erreur lors de la création de la commande:", error));
    }
  };

  return (
    <div>
      <h1>Bienvenue sur Adalicious</h1>
      <div>
        {menu.map((item) => (
          <div key={item.id}>
            <span>{item.emoji}</span>
            <h2>{item.plate}</h2>
            <p>{item.description}</p>
            <button onClick={() => handleOrder(item.id)}>Commander</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function KitchenView({ orders, updateOrderStatus }) {
  let content = null;

  if (orders.length === 0) {
    content = <p>Aucune commande en attente.</p>;
  } else {
    content = orders.map((order) => (
      <div key={order.id}>
        <h2>Commande de {order.username}</h2>
        <p>{order.plate ? order.plate.plate : "Plat inconnu"} - {order.plate ? order.plate.description : "Description non disponible"}</p>
        <button onClick={() => updateOrderStatus(order.id, "prête")}>Prête !</button>
        <button onClick={() => updateOrderStatus(order.id, "annulée")}>Annuler</button>
      </div>
    ));
  }

  return (
    <div>
      <h1>Vue Cuisine</h1>
      {content}
    </div>
  );
}

function App() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Récupérer les commandes depuis l'API
    fetch('http://localhost:3002/order')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setOrders(data);
      })
      .catch((error) => console.error("Erreur lors de la récupération des commandes:", error));
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
        if (updatedOrder.status === "prête") {
          // Retirer la commande de la liste une fois qu'elle est prête
          setOrders((prevOrders) => prevOrders.filter((order) => order.id !== updatedOrder.id));
        } else {
          // Si la commande est annulée, on peut la retirer également
          setOrders((prevOrders) => prevOrders.filter((order) => order.id !== updatedOrder.id));
        }
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
        <Routes>
          <Route path="/" element={<UserView addOrder={addOrder} />} />
          <Route path="/kitchen" element={<KitchenView orders={orders} updateOrderStatus={updateOrderStatus} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

