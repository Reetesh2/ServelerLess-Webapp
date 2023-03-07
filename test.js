const supertest = require('supertest');
const app = require('./demo_db_connection');

//const should = require('should');
const assert = require('assert');

describe("Unit Test", () => {
    //console.log(typeof app);
    it("should return response code 200", (done) => {
        supertest(app).get("/healthz").expect(200).end((err, res) => {
            if (err) return done(err);
            return done();
        });
    });
});
