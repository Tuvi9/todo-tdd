const TodoModel = require('../models/todo.model')


//* Create a new todo
const createTodo = async (req, res, next) => {

    //* Create a new todo using the request body
    try {
        //* Wait for the new todo to be created
        const createModel = await TodoModel.create(req.body)
        //* Send a response with the new todo
        res.status(201).json(createModel)
    } catch(err) {
        next(err)
    }
}

const getTodos = async (req, res, next) => {
    const allTodos = await TodoModel.find({})
    res.status(200).json(allTodos)
}

module.exports = { createTodo, getTodos };