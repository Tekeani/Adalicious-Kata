const express = require("express");
const neonServerless = require("@neondatabase/serverless");
const cors = require("cors");

const app = express();
const db_url = "postgresql://kata%205_owner:npg_bgCYQvZFiA38@ep-ancient-surf-a5ku82ex-pooler.us-east-2.aws.neon.tech/kata%205?sslmode=require";
const sql = neonServerless.neon(db_url);

app.use(cors());
app.use(express.json());

// Route pour récupérer un menu spécifique
app.get("/menu/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const menus = await sql`SELECT * FROM menu WHERE id = ${id};`;
        if (menus.length === 0) {
            return res.status(404).json({ error: "Menu not found" });
        }
        res.send(menus[0]);
    } catch (err) {
        console.error("Erreur lors de la récupération du menu:", err);
        res.status(500).send({ error: "Erreur interne du serveur" });
    }
});

// Route pour récupérer tous les menus
app.get("/menu", async (req, res) => {
    try {
        const menus = await sql`SELECT * FROM menu;`;
        res.send(menus);
    } catch (err) {
        console.error("Erreur lors de la récupération des menus:", err);
        res.status(500).send({ error: "Erreur interne du serveur" });
    }
});

app.get('/order', async (req, res) => {
    try {
        const orders = await sql`SELECT * FROM "order";`;
        res.send(orders);
    } catch (err) {
        console.error("Erreur lors de la récupération des commandes:", err);
        res.status(500).send({ error: "Erreur interne du serveur" });
    }
});


// Route pour ajouter un menu
app.post("/menu", async (req, res) => {
    const { plate, description, emoji } = req.body;
    try {
        const menus = await sql`INSERT INTO menu (plate, description, emoji) VALUES (${plate}, ${description}, ${emoji})`;
        res.status(201).send({ message: "Menu ajouté", menu: menus });
    } catch (err) {
        console.error("Erreur lors de l'ajout du menu:", err);
        res.status(500).send({ error: "Erreur interne du serveur" });
    }
});

// Route pour supprimer un menu
app.delete('/menu/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await sql`DELETE FROM menu WHERE id = ${id}`;
        res.send({ message: "Menu supprimé" });
    } catch (err) {
        console.error("Erreur lors de la suppression du menu:", err);
        res.status(500).send({ error: "Erreur interne du serveur" });
    }
});

// Route pour créer une commande
app.post('/order', async (req, res) => {
    const { plate_id, username } = req.body;
    const status = "0"; // statut de la commande
    try {
        const newOrder = await sql`INSERT INTO "order" (plate_id, username, status) VALUES (${plate_id}, ${username}, ${status})`;
        res.status(201).send({ message: "Commande créée", order: newOrder });
    } catch (err) {
        console.error("Erreur lors de la création de la commande:", err);
        res.status(500).send({ error: "Erreur interne du serveur" });
    }
});

// Route pour récupérer une commande spécifique
app.get('/order/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const order = await sql`SELECT * FROM "order" WHERE id = ${id};`;
        if (order.length === 0) {
            return res.status(404).json({ error: "Commande non trouvée" });
        }
        const plate = await sql`SELECT * FROM menu WHERE id = ${parseInt(order[0].plate_id)};`;
        const r = {
            id: order[0].id,
            username: order[0].username,
            plate: plate[0]
        };
        res.json(r);
    } catch (err) {
        console.error("Erreur lors de la récupération de la commande:", err);
        res.status(500).send({ error: "Erreur interne du serveur" });
    }
});

// Route pour mettre à jour une commande
app.put('/order/:id', async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    try {
        const updatedOrder = await sql`UPDATE "order" SET status = ${status} WHERE id = ${id} RETURNING *;`;
        if (updatedOrder.length === 0) {
            return res.status(404).json({ error: "Commande non trouvée" });
        }
        res.json(updatedOrder[0]);
    } catch (err) {
        console.error("Erreur lors de la mise à jour de la commande:", err);
        res.status(500).send({ error: "Erreur interne du serveur" });
    }
});

// Lancer le serveur
app.listen(3002, () => {
    console.log("Server is running on port 3002");
});

