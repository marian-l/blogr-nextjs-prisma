import React from "react";
import { GetServerSideProps } from "next";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
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
        props: todo,
    };
};