const supertest = require("supertest");

const server = require("../api/server.js");
const db = require("../database/dbConfig.js")

describe("router.js", () => {
    beforeEach(async () => {
        await db("users");
    });

    describe("/register", () => {
        test("verifies that user was registered by comparing usernames", () => {
            const creds = {
                username: "CoolGuy9",
                password: "bazinga"
            }

            const name = creds.username;
    
            return supertest(server)
            .post("/register")
            .send(creds)
            .then(res => {
                expect(res.body.newUser.username).toBe(creds.username)
                // console.log("Creds username", creds.username)
                // console.log("body username", res.body.newUser.username)
            })
        })

        test("verifies a user's password has been hashed", () => {
            const creds = {
                username: "CoolGuy10",
                password: "bazinga"
            }
            return supertest(server)
            .post("/register")
            .send(creds)
            .then(res => {

                expect(creds.password).not.toBe(res.body.newUser.password);
                console.log(res.body.newUser.password)
            })
        })
        
    })//both tests are working

    describe("/login", () => {
        test("Verifies a user has recieved a login token", () => {
            const user = {
                "username": "CoolGuy9",
                "password": "bazinga"
            }

            return supertest(server)
            .post("/login")
            .send(user)
            .then(res => {
                console.log(res.body.token)
                expect(res.body.token)
            })
        })

        test("Verifies that the user who recieved a token is a user that exists", () => {
            const user = {
                "username": "CoolGuy9",
                "password": "bazinga"
            }

            return supertest(server)
            .post("/login")
            .send(user)
            .then(res => {
                expect(res.body.user.username).toBe(user.username)
                // console.log(res.body)
            })
        })
    })//both tests work, make sure to truncate
})