const request = require("supertest");
const app = require("../index");

async function importChai() {
    const chai = await import('chai');
    return chai;
}

describe("register + login, and create notes", () => {
    let user = {
        "name": "Preeti",
        "email": "preeti@gmail.com",
        "password": "xyz@123"
    };

    it("check  times require to register, login, and create notes", async () => {
        const chai = await importChai();
        const { expect } = chai;

        // Register
        const registerResponse = await request(app)
            .post('/api/jio/register')
            .send(user);

        expect(registerResponse.status).to.equal(201);
        expect(registerResponse.body).to.be.an('object');
        expect(registerResponse.body.message).to.equal("Registration successfull");

        // Login
        const loginResponse = await request(app)
            .post('/api/jio/login')
            .send({
                "email": user.email,
                "password": user.password
            });

        expect(loginResponse.status).to.equal(200);
        expect(loginResponse.body.message).to.equal("Login successfull");

        //CREATE NOTES///

        const token = loginResponse.body.token;
        const createNotesResponse = await request(app)
            .post('/api/jio/notes')
            .set({ "Authorization": `Bearer ${token}` })
            .send({
                "title": "Interview",
                "body": "You have an interview scheduled at 3pm"
            });

        expect(createNotesResponse.status).to.equal(201);
        expect(createNotesResponse.body.message).to.be.equal("Notes created Successfully")
    });
});
