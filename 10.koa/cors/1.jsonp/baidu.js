const express = require("express");
const app = express();

app.get("/sugrec", (req, res) => {
  console.log(req.query);
  const { wd, cb } = req.query;
  res.type("text/javascript");
  res.send(
   `${cb}({
        g:[
            {q:'a1'},
            {q:'a2'}
        ]
    })`,
  );
});

app.listen(3000, () => console.log("http://localhost:3000"));
