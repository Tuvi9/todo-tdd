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

const getTodoById = async (req, res, next) => {
    try {
        const todoModel = await TodoModel.findById(req.params.todoId)
        if (todoModel) {
            res.status(200).json(todoModel)
        } else {
            res.status(404).send()
        }
    } catch(error){
        next(error)
    }
}

const updateTodo = async (req, res, next) => {
    try {
        const updatedTodo = await TodoModel.findByIdAndUpdate(
            req.params.todoId,
            req.body,
            {
                new: true,
                useFindAndModify: false
            }
        );
        if (updatedTodo) {
            res.status(200).json(updatedTodo);
        } else {
            res.status(404).send();
        }
    } catch (error) {
        next(error);
    }
};

const deleteTodo = async (req, res, next) => {
    try {
        const deletedTodo = await TodoModel.findByIdAndDelete(req.params.todoId)
        if (deletedTodo) {
            res.status(200).json(deletedTodo)
        } else {
            res.status(404).send()
        }
    } catch(error) {
        next(error)
    }
};

module.exports = { createTodo, getTodos, getTodoById, updateTodo, deleteTodo };