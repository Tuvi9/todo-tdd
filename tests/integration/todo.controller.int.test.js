const request = require('supertest');
const app = require('../../app');
const newTodo = require('../../tests/mock-data/new-todo.json');
const endpointUrl = "/todos/";
let firstTodo;

describe(endpointUrl, () => {
    it("POST " + endpointUrl, async () => {
        const response = await request(app)
            .post(endpointUrl)
            .send(newTodo)
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(newTodo.title)
        expect(response.body.done).toBe(newTodo.done)
    })

    //* Test for missing done property
    it("should return error 500 on malformed data with POST" + endpointUrl, async () => {
        //? Send a request with a missing done property
        const response = await request(app)
            .post(endpointUrl)
            .send({ title: "Missing done property" })
        expect(response.statusCode).toBe(500);
        //? Check if the response body is equal to the expected error message
        expect(response.body).toStrictEqual({
            message: "Todo validation failed: done: Path `done` is required."
        })
    })
    it('GET ' + endpointUrl, async () => {
        const response = await request(app).get(endpointUrl);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].done).toBeDefined();
        firstTodo = response.body[0];
    })
    it("GET by Id " + endpointUrl + ":todoId", async () => {
        const response = await request(app)
            .get(endpointUrl + firstTodo._id)
        expect(response.statusCode).toBe(200)
        expect(response.body.title).toBe(firstTodo.title)
        expect(response.body.done).toBe(firstTodo.done)
    })
    it("GET todo by id doesnt exist" + endpointUrl + ":todoId", async () => {
        const response = await request(app)
            .get(endpointUrl + "663f1d61b1dc2a205fdce443")
        expect(response.statusCode).toBe(404)
    })
})