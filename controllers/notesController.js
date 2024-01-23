const Notes = require("../models/noteModel")
const Favourite = require("../models/favouriteModels");
const ErrorHandler = require("../utils/errorHandler")
const redis = require("../config/redis")

const createNotes = async (req, res, next) => {
    try {
        const { title, body } = req.body;
        if (!title || !body) {
            return next(new ErrorHandler("Invalid credentials", 400))
        }
        const _id = req.user.userId
        const keyName = `${_id}:notes`
        await redis.del(keyName)
        await Notes.create({ userId: _id, body: body, title: title })
        return res.status(201).send({
            success: true,
            message: "Notes created Successfully"
        })


    } catch (error) {
        return next(new ErrorHandler(error, 404))
    }
}

const findNotes = async (req, res, next) => {
    try {
        const _id = req.user.userId;
        const keyName = `${_id}:notes`
        let cacheData = await redis.get(keyName);
        if (cacheData) {
            cacheData = JSON.parse(cacheData);
            res.status(200).send({
                notes: cacheData
            })
        } else {

            if (!_id) return next(new ErrorHandler("unauthorized user", 404))
            const userNotes = await Notes.find({ userId: _id });
            redis.set(keyName, JSON.stringify(userNotes))
            res.status(200).send({
                notes: userNotes
            })
        }
    } catch (error) {
        return next(new ErrorHandler(error, 404))
    }
}
const deleteNotes = async (req, res, next) => {
    try {
        const { _id } = req.params;
        await Notes.deleteOne({ userId: req.user.userId, _id: _id })
        const keyName = `${_id}:notes`
        await redis.del(keyName)
        return next(new ErrorHandler("Deleted successfully", 200))

    } catch (error) {
        return next(new ErrorHandler(error, 404))
    }
}
const updateNotes = async (req, res, next) => {
    try {
        const { _id } = req.params
        const { title, body } = req.body;
        if (!title || !body) {
            return next(new ErrorHandler("Invalid credentials", 400))
        }
        await Notes.updateOne({ _id: _id }, { $set: { title: title, body: body } })
        const keyName = `${_id}:notes`
        await redis.del(keyName)
        return next(new ErrorHandler("updated successfully", 200))
    } catch (error) {
        return next(new ErrorHandler(error, 404))
    }
}



//Favourite Controllers///

const addFavourite = async (req, res, next) => {
    try {
        const { noteId } = req.params;
        if (!noteId) return next(new ErrorHandler("Invalid credentials", 404))
        else {
            const _id = req.user.userId;
            const keyName = `${_id}:fav:notes`
            await Favourite.create({ userId: req.user.userId, noteId: noteId })
            await redis.del(keyName)
            return next(new ErrorHandler("Added successfully", 200))
        }
    } catch (error) {
        return next(new ErrorHandler(error, 404))
    }
}

const removeFavourite = async (req, res, next) => {
    try {
        const { noteId } = req.params;
        if (!noteId) return next(new ErrorHandler("Invalid credentials", 404))
        else {
            const _id = req.user.userId;
            const keyName = `${_id}:fav:notes`
            await Favourite.deleteOne({ userId: req.user.userId, noteId: noteId })
            await redis.del(keyName)
            return next(new ErrorHandler("removed successfully", 200))
        }
    } catch (error) {
        return next(new ErrorHandler(error, 404))
    }
}
const findFavourite = async (req, res, next) => {
    try {
        const _id = req.user.userId;
        const keyName = `${_id}:fav:notes`
        var cacheData = await redis.get(keyName).then((data) => data)
        if (cacheData) {
            cacheData = JSON.parse(cacheData)
            res.status(200).send({
                success: true,
                result: cacheData
            })
        } else {

            const favourite = await Favourite.find({ userId: _id })
            const x = favourite.map((item) => item.noteId)
            const notes = await Notes.find({ _id: { $in: x } })
            await redis.set(keyName, JSON.stringify(notes))
            res.status(200).send({
                success: true,
                result: notes
            })
        }
    } catch (error) {
        return next(new ErrorHandler(error, 404))
    }
}
module.exports = { createNotes, findNotes, deleteNotes, updateNotes, addFavourite, findFavourite, removeFavourite }