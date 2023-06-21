// pages/api/post/index.ts

import { getSession, useSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const { session, title, content } = req.body;
 
  const result = await prisma.post.create({
    data: {
      title: title,
      content: content,
      author: { connect: { email: session?.user?.email } }, 
      // the author was not transported properly
    },
  });
  res.json(result);
}