// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================
const fs = require('fs');
const notesList = require('../db/db.json');


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
    // API GET Requests
    // Below code handles when users "visit" a page.
    // In each of the below cases when a user visits a link
    // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
    // ---------------------------------------------------------------------------

    app.get("/api/notes", function (req, res) {

        // We are reading the db.json file so we can display the notes written within.
        fs.readFile("./db/db.json", 'utf8', (err, data) => {
            if (err) throw err;
            // Parsing the data allows our web browser to read the object.
            let notes = JSON.parse(data);
            // This is what returns the parsed data to the browser to be displayed.
            res.json(notes);
        });
    });

    app.post("/api/notes", function (req, res) {
        // Here we are declaring our new note as an object with all the required parameters
        const newNote = {
            id: Date.now(),
            title: req.body.title,
            text: req.body.text
        }

        // The first thing we need to do is read the file that we will be adding to.
        fs.readFile("./db/db.json", "utf8", (err, data) => {
            if (err) throw err;
            let notes = JSON.parse(data);
            // Here we push the information recorded in newNote to our existing json file.
            notes.push(newNote);
            // Stringifying it converts back into object notation format to be written properly
            let updateNotes = JSON.stringify(notes, null, 2);

            // Here we finalize the our latest update and record it into our db.json
            fs.writeFile("./db/db.json", updateNotes, function (err) {
                if (err) throw err;
                res.json(notes);
            });
        });
    });

    app.delete("/api/notes/:id", function (req, res) {
        // We are just setting the id variable to the id of the note we are targeting
        let id = req.params.id;

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) throw err;
            const notes = JSON.parse(data);
            // This part is very important, it filters out the note with the target id, effectively "deleting" it and only displaying all other notes
            const filteredNotes = notes.filter(note => {return note.id != id});
            // Here we finalize the filtered note list which is what makes the deletion permanent
            const finalNotes = JSON.stringify(filteredNotes, null, 2);
            
            fs.writeFile('./db/db.json', finalNotes, function (err) {
                if (err) throw err;
                res.json(notes);
            })
        });
    });


};
