const TodoController = require('../../controllers/todo.controller');
const TodoModel = require('../../models/todo.model');
const httpMocks = require('node-mocks-http');
const newTodo = require('../mock-data/new-todo.json');
const allTodos = require('../mock-data/all-todos.json');

TodoModel.create = jest.fn()
TodoModel.find = jest.fn()
TodoModel.findById = jest.fn()
TodoModel.findByIdAndUpdate = jest.fn()
TodoModel.findByIdAndDelete = jest.fn()

const todoId = '664f1d61b1dc4a201fdce543';

//! Sets up the request, response, and next objects for each test
let req, res, next
beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = jest.fn()
})

//! Create Todo
describe('TodoController.createTodo', () => {
    beforeEach(() => {
        req.body = newTodo
    })
    it('should have a createTodo function', () => {
        expect(typeof TodoController.createTodo).toBe('function')
    })

    it('should call TodoModel.create', async () => {
        await TodoController.createTodo(req, res, next)
        expect(TodoModel.create).toBeCalledWith(newTodo)
    })

    it('should return 201 response code', async () => {
        await TodoController.createTodo(req, res, next)
        expect(res.statusCode).toBe(201)
        expect(res._isEndCalled()).toBeTruthy()
    })

    it('should return json body in response', async () => {
        //! Always returns the value of newTodo when TodoModel.create is called
        await TodoModel.create.mockReturnValue(newTodo)
        //! Calls the createTodo function in the TodoController
        await TodoController.createTodo(req, res, next)
        //! Checks if the response body is equal to the newTodo object
        expect(res._getJSONData()).toStrictEqual(newTodo)
    })

    //* Test for missing done property
    it('should handle errors', async () => {
        const errorMessage = { message: "Done property missing" };
        //? Create a rejected promise with the error message
        const rejectedPromise = Promise.reject(errorMessage);
        //? Mock the TodoModel.create function to return the rejected promise
        TodoModel.create.mockReturnValue(rejectedPromise);
        //? Call the createTodo function
        await TodoController.createTodo(req, res, next);
        //? Check if the next function is called with the error message
        expect(next).toBeCalledWith(errorMessage);
    })
})

//! Get Todos
describe('TodoController.getTodos', () => {
    it('should have a getTodos function', () => {
        expect(typeof TodoController.getTodos).toBe('function')
    });
    it('should call TodoModel.find({})', async () => {
        await TodoController.getTodos(req, res, next);
        expect(TodoModel.find).toHaveBeenCalledWith({});
    });
    it('should return response with status 200 and all todos', async () => {
        TodoModel.find.mockReturnValue(allTodos);
        await TodoController.getTodos(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy;
        expect(res._getJSONData()).toStrictEqual(allTodos);
    });
    it("should handle errors in getTodos", async () => {
        // add error handling
        const errorMessage = { message: "error finding todos" }
        const rejectedPromise = Promise.reject(errorMessage)
        TodoModel.find.mockReturnValue(rejectedPromise)
        await TodoController.getTodo(req, res, next)
        expect(next).toHaveBeenCalledWith(errorMessage)
    })
})

//! Get Todo By Id
describe('TodoController.getTodoById', () => {
    it('should have a getTodoById', () => {
        expect(typeof TodoController.getTodoById).toBe('function');
    });
    it('should call TodoModel.findById with route parameters', async () => {
        req.params.todoId = '664f1d61b1dc4a201fdce543';
        await TodoController.getTodoById(req, res, next);
        expect(TodoModel.findById).toBeCalledWith('664f1d61b1dc4a201fdce543');
    });
    it("should do error handling", async () => {
        const errorMessage = { message: "error finding todoModel" }
        const rejectedPromise = Promise.reject(errorMessage)
        TodoModel.findById.mockReturnValue(rejectedPromise)
        await TodoController.getTodoById(req, res, next)
        expect(next).toHaveBeenCalledWith(errorMessage)
    });
    it("should return 404 when item doesn't exist", async () => {
        TodoModel.findById.mockResolvedValue(null);
        req.params.todoId = 'some-id';
        await TodoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
})

//! Update Todo
describe("TodoController.updateTodo", () => {
    it("should have a updateTodo function", () => {
        expect(typeof TodoController.updateTodo).toBe("function")
    })
    it("should update with TodoModel.findByIdAndUpdate", async () => {
        req.params.todoId = todoId
        req.body = newTodo
        await TodoController.updateTodo(req, res, next)
        expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, {
            new: true,
            useFindAndModify: false
        })
    })
    it("should return a response with json data and http code 200", async () => {
        req.params.todoId = todoId
        req.body = newTodo
        TodoModel.findByIdAndUpdate.mockReturnValue(newTodo)
        await TodoController.updateTodo(req, res, next)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toStrictEqual(newTodo)
    })
    it("should handle errors", async () => {
        const errorMessage = { message: "Error" }
        const rejectedPromise = Promise.reject(errorMessage)
        TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise)
        await TodoController.updateTodo(req, res, net)
        expcet(next).toHaveBeenCalledWith(errorMessage)
    })
    it("should handle 404", async () => {
        TodoModel.findByIdAndUpdate.mockReturnValue(null)
        await TodoController.updateTodo(req, res, next)
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy()
    })
})
describe("TodoController.deleteTodo", () => {
    it("should have a deleteTodo function", () => {
        expect(typeof TodoController.deleteTodo).toBe("function");
    });
    it("should delete with TodoModel.findByIdAndDelete", async () => {
        req.params.todoId = todoId;
        await TodoController.deleteTodo(req, res, next);
        expect(TodoModel.findByIdAndDelete).toHaveBeenCalledWith(todoId);
    });
    it("should return a response with json data and http code 200", async () => {
        req.params.todoId = todoId;
        TodoModel.findByIdAndDelete.mockReturnValue(todoId);
        await TodoController.deleteTodo(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(todoId);
    });
    it("should handle errors", async () => {
        const errorMessage = { message: "Error" };
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
        await TodoController.deleteTodo(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
    it("should handle 404", async () => {
        TodoModel.findByIdAndDelete.mockReturnValue(null);
        await TodoController.deleteTodo(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
});
