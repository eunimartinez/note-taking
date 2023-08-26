const express = require("express");
const path = require("path");

const fs = require("fs");

const app = express();

var PORT = 3001;

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf-8", (err, notes) => {
    if (err) {
      return console.log(err);
    }

    res.json(JSON.parse(notes));
  });
});

app.delete("/api/notes/:id", (req, res) => {
  let selectedId = JSON.parse(req.params.id);

  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error, notes) => {
    if (error) {
      return console.log(error);
    }
    let array = JSON.parse(notes);

    array.forEach((note, index) => {
      if (selectedId === note.id) {
        array.splice(index, 1);

        fs.writeFile(
          path.join(__dirname, "./db/db.json"),
          JSON.stringify(array),
          (error, data) => {
            if (error) {
              return error;
            }
            console.log(array);

            res.json(array);
          }
        );
      }
    });
  });
});

app.post("/api/notes", (req, res) => {
  const noteWritten = req.body;

  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error, notes) => {
    if (error) {
      return console.log(error);
    }
    notes = JSON.parse(notes);

    if (notes.length > 0) {
      let lastId = notes[notes.length - 1].id;
      var id = parseInt(lastId) + 1;
    } else {
      var id = 1;
    }

    let newNote = {
      title: noteWritten.title,
      text: noteWritten.text,
      id: id,
    };

    let newArray = notes.concat(newNote);

    fs.writeFile(
      path.join(__dirname, "./db/db.json"),
      JSON.stringify(newArray),
      (error, data) => {
        if (error) {
          return error;
        }
        console.log(newArray);

        res.json(newArray);
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
