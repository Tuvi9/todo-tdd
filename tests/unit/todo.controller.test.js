const TodoController = require('../../controllers/todo.controller')
const TodoModel = require('../../models/todo.model')
const httpMocks = require('node-mocks-http')
const newTodo = require('../mock-data/new-todo.json')

TodoModel.create = jest.fn()

//! Sets up the request, response, and next objects for each test
let req, res, next
beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = null
})
describe('TodoController.createTodo', () => {
    beforeEach(() => {
        req.body = newTodo
    })
    it('should have a createTodo function', () => {
        expect(typeof TodoController.createTodo).toBe('function')
    })

    it('should call TodoModel.create', () => { 
        TodoController.createTodo(req, res, next)
        expect(TodoModel.create).toBeCalledWith(newTodo)
    })

    it('should return 201 response code', () => {
        TodoController.createTodo(req, res, next)
        expect(res.statusCode).toBe(201)
        expect(res._isEndCalled()).toBeTruthy()
    })

    it('should return json body in response', () => {
        //! Always returns the value of newTodo when TodoModel.create is called
        TodoModel.create.mockReturnValue(newTodo)
        //! Calls the createTodo function in the TodoController
        TodoController.createTodo(req, res, next)
        //! Checks if the response body is equal to the newTodo object
        expect(res._getJSONData()).toStrictEqual(newTodo)
    })
})