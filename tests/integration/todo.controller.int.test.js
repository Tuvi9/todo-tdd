const request = require('supertest');
const app = require('../../app');
const newTodo = require('../../tests/mock-data/new-todo.json');
const endpointUrl = "/todos/";

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
})