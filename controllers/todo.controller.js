const TodoModel = require('../models/todo.model')

const createTodo = async (req, res, next) => {
    const createModel = await TodoModel.create(req.body)
    res.status(201).json(createModel)
}

module.exports = { createTodo }