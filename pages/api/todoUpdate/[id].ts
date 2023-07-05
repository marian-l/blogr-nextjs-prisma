import prisma from "../../../lib/prisma";
import winston from "winston";
import { createLogger } from "winston";
import fs from "fs";


const logger = createLogger({
    transports: [
      new winston.transports.File({ 
        filename: "error.log",  
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
      ), }),
    ],
  });

// /api/todoUpdate:id
export default async function handle(req, res) {
    try {
        const todoId = req.query.id;
        if (todoId == typeof String) {
            return res.status(501).json({error: "todoId is not of type string"})
        }


        const todo = await prisma.todo.findUnique({
            where: {
                id: todoId
            }
        });
        
        if (!todo) {
            return res.status(404).json({error: "Todo not found"})
        }
        
        const updatedTodo = await prisma.todo.update({
            where: {
                id: todoId
            },
            data: {
                finished: !todo.finished
            }
        })
        res.json(updatedTodo);
        
    } catch (e) { 
        const errorMessage = e.message;
        const stackTrace = e.stack;
        const logMessage = `Error: ${errorMessage}\nStack Trace: ${stackTrace}`;

        logger.error(logMessage)
        res.status(500).json({error: "Internal server error"})
    }
}