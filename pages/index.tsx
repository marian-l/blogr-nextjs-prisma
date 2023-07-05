import React from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Todo, { TodoProps } from "../components/Todo"
import prisma from "../lib/prisma"
import SuperJSON from "superjson"

// GetStaticProps is called when the page is built the first time
export const getStaticProps: GetStaticProps = async () => {
    const feed = await prisma.todo.findMany({
        // include the author related to the post, but only the name
        include:{ 
            author: {
                select: { name: true }
            },
        },
    });
    
    return {
        props:  { 
            feed: JSON.parse(JSON.stringify(feed))
        },
        // time after which the regeneration-process is triggered, which if successful renders the updated page
        revalidate: 10,
    };
};

type Props =  {
    feed: TodoProps[]
}

const List: React.FC<Props> = (props) => {
    return (
        <Layout>
            <div className="page">
                <h1>My TodoList</h1>
                <main>
                    {props.feed.map((todo) => (
                        <div key={todo.id} className="todo"> 
                            <Todo todo={todo} />
                        </div>
                    ))}
                </main>
            </div>
            <style jsx>{`
                .todo { background: white; transition: box-shadow 0.1s ease-in;}
                .todo:hover { box-shadow: 1px 1px 3px #aaa; }
                .todo + .todo { margin-top: 2rem; }
                `}
            </style>
        </Layout>
    )
}

export default List;