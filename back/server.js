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
        const menus = await prisma.menu.findMany();
        console.log("Menus récupérés:", menus);
        res.json(menus);
    } catch (err) {
        console.error("Erreur lors de la récupération des menus:", err);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Route pour récupérer un menu spécifique
app.get("/menu/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const menu = await prisma.menu.findUnique({ where: { id } });
        if (!menu) {
            return res.status(404).json({ error: "Menu non trouvé" });
        }
        res.json(menu);
    } catch (err) {
        console.error("Erreur lors de la récupération du menu:", err);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Route pour ajouter un menu
app.post("/menu", async (req, res) => {
    const { plate, description, emoji } = req.body;
    try {
        const newMenu = await prisma.menu.create({
            data: { plate, description, emoji },
        });
        res.status(201).json(newMenu);
    } catch (err) {
        console.error("Erreur lors de l'ajout du menu:", err);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Route pour supprimer un menu
app.delete('/menu/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await prisma.menu.delete({ where: { id } });
        res.json({ message: "Menu supprimé" });
    } catch (err) {
        console.error("Erreur lors de la suppression du menu:", err);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Route pour récupérer toutes les commandes
app.get('/order', async (req, res) => {
    try {
        const orders = await prisma.order.findMany({ include: { plate: true } });
        res.json(orders);
    } catch (err) {
        console.error("Erreur lors de la récupération des commandes:", err);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Route pour créer une commande
app.post('/order', async (req, res) => {
    const { plate_id, username } = req.body;
    try {
        const newOrder = await prisma.order.create({
            data: { plate_id, username, status: "0" },
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
        const order = await prisma.order.findUnique({
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
        const updatedOrder = await prisma.order.update({
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



