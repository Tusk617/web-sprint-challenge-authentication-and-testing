const db = require("../database/dbConfig.js");

module.exports = {
    add
}

function add(creds) {
    return db("users").insert(creds)
    .then(() => {
        return creds;
    })
}