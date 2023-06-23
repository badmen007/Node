const fs = require("fs/promises");
const path = require("path");

// co + generator = async + await(就是 co + generator 的语法糖)

async function readResult() {
  let filename = await fs.readFile(path.resolve(__dirname, "name.txt"), "utf8");
  let age = await fs.readFile(
    path.resolve(__dirname, filename.replace("\n", "")),
    "utf8"
  );
  return age;
}

readResult().then(data => {
  console.log(data)
})
