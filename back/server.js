const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Route pour récupérer tous les menus
app.get("/menu", async (req, res) => {
    try {
        const menus = await prisma.Menu.findMany();
        console.log("Menus récupérés:", menus);
        res.json(menus);
    } catch (err) {
        console.error("Erreur lors de la récupération des menus:", err);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Route pour récupérer toutes les commandes
app.get('/order', async (req, res) => {
    try {
        const orders = await prisma.Order.findMany({ include: { plate: true } });
        res.json(orders);
    } catch (err) {
        console.error("Erreur lors de la récupération des commandes:", err);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Route pour créer une commande (correction appliquée ici)
app.post('/order', async (req, res) => {
    const { plateId, username } = req.body;
    try {
        const newOrder = await prisma.Order.create({
            data: {
                username,
                status: "en attente", // Correction du statut
                plate: {
                    connect: { id: plateId } // Correction de la relation avec le menu
                }
            },
            include: {
                plate: true // Inclut les détails du plat dans la réponse
            }
        });
        res.status(201).json(newOrder);
    } catch (err) {
        console.error("Erreur lors de la création de la commande:", err);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Route pour récupérer une commande spécifique
app.get('/order/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const order = await prisma.Order.findUnique({
            where: { id },
            include: { plate: true },
        });
        if (!order) {
            return res.status(404).json({ error: "Commande non trouvée" });
        }
        res.json(order);
    } catch (err) {
        console.error("Erreur lors de la récupération de la commande:", err);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Route pour mettre à jour une commande
app.put('/order/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    try {
        const updatedOrder = await prisma.Order.update({
            where: { id },
            data: { status },
        });
        res.json(updatedOrder);
    } catch (err) {
        console.error("Erreur lors de la mise à jour de la commande:", err);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Lancer le serveur
app.listen(3002, () => {
    console.log("Server is running on port 3002");
});



