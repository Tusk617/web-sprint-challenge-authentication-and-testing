const db = require("../database/dbConfig.js");

module.exports = {
    add,
    findBy
}

function add(creds) {
    return db("users").insert(creds)
    .then(() => {
        return creds;
    })
}

function findBy(filter) {
    return db("users").where(filter).orderBy("id");
}