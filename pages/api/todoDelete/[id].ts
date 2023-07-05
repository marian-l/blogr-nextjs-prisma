import prisma from "../../../lib/prisma";

// DELETE /api/deleteTodo/:id
export default async function handle(req, res) {
    const todoId = req.query.id;
    const todo = await prisma.todo.delete({
        where: { id: todoId }, 
    });
    res.json(todo);
}