const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const port = 3000;
const items = ["Milk"];

app.get('/', (req, res) => {

    const today = new Date();
    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };
    
    const day = today.toLocaleDateString("en-US", options);

    res.render("list", {
        kindOfDay: day,
        newListItem: items
    })
});

app.post("/", (req, res) => {
    const item = req.body.newItem;

    items.push(item);
    res.redirect("/");
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});