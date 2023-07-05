import React from "react";
import { GetServerSideProps } from "next";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from 'remark-gfm'
import Router from "next/router";
import Layout from "../../components/Layout";
import { TodoProps } from "../../components/Todo";
import { useSession } from "next-auth/react";
import prisma from "../../lib/prisma";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const todo = await prisma.todo.findUnique({
        where: {
            id: String(params?.id),
        },
        include: {
            author: {
                select: { name: true, email: true },
            },
        },
    });
    return {
        props: JSON.parse(JSON.stringify(todo)),
    };
};

async function deleteTodo(id: string): Promise<void> {
    await fetch(`/api/todoDelete/${id}`, {
        method: 'DELETE',  
    });
    await Router.push('/')
}

async function finishTodo(id: string): Promise<void> {
    await fetch(`/api/todoUpdate/${id}`, {
        method: "PUT",
    });
    await Router.push('/')
}

function createDate(date: string) {
    const dateObjectParts = date.split('.');
    const dateObject = new Date(
    parseInt(dateObjectParts[2]), // Year
    parseInt(dateObjectParts[1]) - 1, // Month (subtract 1 since months are zero-based)
    parseInt(dateObjectParts[0]) // Day
    );
    return dateObject;
}

const Todo: React.FC<TodoProps> = (props) => {
    const { data: session, status } = useSession();
    if ( status === "loading") {
        return <div>Authenticating ...</div>;
    }
    const userHasValidSession = Boolean(session);
    const todoBelongsToUser = session?.user?.email === props.author?.email;
    let title = props.title;

    const dateObject = createDate(props.dueDate);
    if(dateObject < new Date()) {
        title = "!! " + title + " !!"
    }

    const markdownTodo = `
    | Autor | Erstellt am | Deadline | Fertig? | Erstelldatum-DB | Inhalt |
    | - | - | - | - | - | - |
    | ${props?.author?.name || "Unknown author"} | ${props.creationdate} | ${props.dueDate} | ${props.finished ? '[x]' : '[ ]'} | ${props.publicationDate} | ${props.content} |
    `;

    return (
        <Layout>
            <div>
                <h2>{title}</h2>
                <ReactMarkdown children={markdownTodo} remarkPlugins={[remarkGfm]}/>
                
                {userHasValidSession && todoBelongsToUser && (
                    <div className="actions">
                        <button onClick={() => deleteTodo(props.id)}>Delete Todo</button>
                        <button onClick={() => finishTodo(props.id)}>Finish Todo</button>
                    </div>
                )}
            </div>
            <style jsx>{`
            .page {
              background: var(--geist-background);
              padding: 2rem;
            }

            .actions {
              margin-top: 2rem;
            }

            button {
              background: #ececec;
              border: 0;
              border-radius: 0.125rem;
              padding: 1rem 2rem;
            }

            button + button {
              margin-left: 1rem;
            }
          `}</style>
        </Layout>
    )
}

export default Todo;
