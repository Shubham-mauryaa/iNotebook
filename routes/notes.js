const express = require('express');
const fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');
const Notes = require('../models/Notes');
// const { findRenderedDOMComponentWithClass } = require('react-dom/test-utils');

const router = express.Router();


//Route 1 : get all notes of logged in user using : GET - api/notes/fetchnotes

router.get('/fetchnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server error occured")
    }
})

//Route 2 : adding new note for a user using : POST - api/notes/addnote

router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description should be  of atleast 5 chaaracters').isLength({ min: 5 }),
], async (req, res) => {

    try {
        const { title, description, tag } = req.body;

        // if errors are present show the error message and return bad request
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const saveNote = await note.save()
        res.json(saveNote)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server error occured")
    }
})



//Route 3 : updating note for a user using : POST - api/notes/updatenote

router.put('/updatenote/:id', fetchuser, async (req, res) => {

    try {
        const {title, description, tag} = req.body;

        //creating newnote object
        const newnote = {};
        if(title){newnote.title = title};
        if(description){newnote.description = description};
        if(tag){newnote.tag = tag};

        //find the note to be updated and update it
        let note = await Notes.findById(req.params.id)
        if(!note){
            return res.status(404).send("not found!")
        }

        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Invalid Action")
        }

        note = await Notes.findByIdAndUpdate(req.params.id, {$set:newnote}, {new:true})
        res.json(note)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server error occured")
    }
})

//Route 4 : deleting note for a existing user using : DELETE - api/notes/deletenote

router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {

        //find the note to be deleted and delete it
        let note = await Notes.findById(req.params.id)
        if(!note){
            return res.status(404).send("not found!")
        }

        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Invalid Action")
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json("Success : Note Deleted")

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server error occured")
    }
})


module.exports = router; 