const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const { createNotes, findNotes, deleteNotes, updateNotes, addFavourite, findFavourite, removeFavourite } = require("../controllers/notesController")

const route = express.Router()


route.post("/notes", authMiddleware, createNotes)
route.get("/notes", authMiddleware, findNotes)
route.delete("/notes/:_id", authMiddleware, deleteNotes)
route.put("/notes/:_id", authMiddleware, updateNotes)



///Favourite///
route.post("/fav/:noteId", authMiddleware, addFavourite)
route.get("/fav", authMiddleware, findFavourite)
route.delete("/fav/:noteId", authMiddleware, removeFavourite)


module.exports = route