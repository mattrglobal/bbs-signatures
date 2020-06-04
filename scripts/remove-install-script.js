"use strict";

const fs = require("fs");
let packageJson = require("../package.json");

// Remove the post install script
delete packageJson.scripts.install;

fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
