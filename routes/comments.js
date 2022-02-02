const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Joi = require("joi");

const commentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        minlength: 3,
        maxlength: 15
    },
    body: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 255
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    id: {
        type: Number,
        unique: true
    }
})
const Comment = mongoose.model("Comment", commentSchema);

//GET Methodes
router.get("/", async(req, res) => {
    const comments = await Comment.find().select({ name: 1, email: 1, _id: 0 });
    res.send(comments);
});

router.get("/:id", async(req, res) => {
    const comment = await (await Comment.find({ id: req.params.id }).select({ id: 1, name: 1, body: 1, email: 1, _id: 0 }));
    if (!comment) return res.status(404).send("The comment with given ID is not valid");
    return res.send(comment);
});
//POST Methodes
router.post('/', async(req, res) => {
    const { error } = validateComment(req.body);
    if (error) {
        res.status(400).send(error.details[0].message)
        return;
    }
    const comments = await Comment.find().select({ name: 1, email: 1 });
    let comment = new Comment({
        name: req.body.name,
        body: req.body.body,
        email: req.body.email,
        id: comments.length + 1
    });
    comment = await comment.save();
    res.send(comment);
});
//PUT Methode
router.put("/:id", async(req, res) => {
    const { error } = validateComment(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const comment = await comment.findByIdAndUpdate(
        req.params.id, { name: req.body.name, body: req.body.body, email: req.body.email }, { new: true }
    );

    if (!comment) return res.status(404).send("The comment with given ID is not valid");

    res.send(comment);

});
//DELETE Methodes
router.delete("/:id", async(req, res) => {
    const comment = await comment.findByIdAndRemove(req.params.id);
    if (!comment) return res.status(404).send("The comment with given ID is not valid");
    res.send(comment);

});
//Necessary functions
function validateComment(comment) {
    const schema = Joi.object({
        name: Joi.string().alphanum().min(3).max(30).required(),
        body: Joi.string().min(5).max(250).required(),
        email: Joi.string().email().required()
    });
    return schema.validate(comment);

}

function commentFinder(req, res) {


    const comment = comments.find(c => c.id === parseInt(req.params.id));
    if (!comment) {
        res.status(404).send("sick");
        return;
    }
    return comment;
}

module.exports = router;