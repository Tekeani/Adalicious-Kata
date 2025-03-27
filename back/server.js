// Importation d'express de la bibliothèe et appel de la méthode express dans une constante
const express = require("express")
const neonServerless = require("@neondatabase/serverless")
const app = express()
const db_url = "postgresql://kata%205_owner:npg_bgCYQvZFiA38@ep-ancient-surf-a5ku82ex-pooler.us-east-2.aws.neon.tech/kata%205?sslmode=require"
const sql = neonServerless.neon(db_url)

// Faire une route
app.get("/menu/:id", async (req, res) => {
    const id = req.params.id
    const menus = await sql `SELECT * FROM menu WHERE id = ${id};`;
    res.send(menus[0])
})

app.get("/menu", async (req, res) => {
    const menus = await sql `SELECT * FROM menu;`
    res.send(menus)
})

app.post ("/menu", async (req, res) => {
    const menus = await sql `INSERT INTO (plate, description, emoji) VALUES ('Fries', 'Bâtons de pomme de terre', 'emoji')`
    res.send(menus)
})

app.post ("/menu", async (req, res) => {
    const {plate, description, emoji} = req.body
    const menus = await sql `INSERT INTO menu (plate, description, emoji) VALUES (${plate}, ${description}, ${emoji})`
    res.send(menus)
})

app.delete ('/menu/:id', async (req, res) => {
    const id = req.params.id
    await sql `DELETE FROM menu WHERE id = ${id}`
    res.send("ok")
})

app.post ('/order', async (req, res) => {
    const { plate_id, username } = req.body
    const status ="0"
    const newOrder = await sql `INSERT INTO "order" (plate_id, username, status) VALUES (${plate_id}, ${username}, ${status})`;
    res.send(newOrder)
})

app.get('/order/:id', async (req, res) => {
    const id = req.params.id
    const order = await sql `SELECT * FROM "order" WHERE id = ${id};`
    const plate = await sql `SELECT * FROM menu WHERE id = ${parseInt(order[0].plate_id)};`
    const r = {
        id:order[0].id,
        username: order[0].username,
        plate:plate[0]
    }
    console.log(r)
    res.json(r)
})

// On dit à notre serveur (ordinateur qui "écoute"), d'écouter
app.listen(3002, () => {
    console.log("Server is running on port 3002")
})
