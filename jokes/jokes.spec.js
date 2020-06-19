const supertest = require("supertest");

const server = require("../api/server");
const { expectCt } = require("helmet");

describe("/", () => {
    test("Verifies that the restricted function is working", () => {

        return supertest(server)
        .get("/")
        .then(res => {
            console.log(res.body)
        })
    })

    test("Gets a login token, and gathers list of jokes", () => {
        const creds = {
            username: "CoolGuy9",
            password: "bazinga"
        }

        return supertest(server)
        .get("/")
        .then(res => {
            expect(res.status).toBe(401)
        })
    })
})