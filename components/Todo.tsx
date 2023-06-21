import React from "react";
import Router from "next/router";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export type TodoProps = {
    id: string;
    title: string;
    content: string;
    duedate: string;
    creationdate: string;
    finished: boolean;
    author: {
        name: string;
        email: string;
      } | null;
}

const Todo: React.FC<{ todo: TodoProps }> = ({ todo }) => {
    const authorName = todo.author ? todo.author.name : 'Unknown author';
    return (
        <div onClick={() => Router.push("/t/[id]", `/t/${todo.id}`)}> 
            <h2>{todo.title}</h2>
            <small>By {authorName}</small>
            <ReactMarkdown children={todo.content} />
            <style jsx>{`
            div { 
                color: inherit;
                padding: 2rem;
            }
            `}
            </style>
        </div>
    );
};

export default Todo;