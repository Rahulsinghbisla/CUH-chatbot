import { HumanMessage } from "@langchain/core/messages";
import { agent } from "./graph";
import { db } from "@/db";
import { thread } from "@/db/schema/thread-schema";
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createUIMessageStreamResponse } from 'ai';
import { toUIMessageStream } from '@ai-sdk/langchain';

export async function POST(request: Request) {
  const { threadId, messageContent } = await request.json()

  const session = await auth.api.getSession({headers:await headers()})

  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const threadFromdb = await db.select().from(thread)
    .where(eq(thread.id, threadId))
    .limit(1)
  const existingThread = threadFromdb[0]
  if (!existingThread) {
    await db.insert(thread).values({
      id: threadId,
      title: messageContent.trim().slice(0, 10),
      userId: session.user.id
    });
  }
  if(existingThread && existingThread?.userId != session?.user?.id){
    return Response.json({ error: "You don't have access to this thread"}, { status: 401 })
  }


  const stream = await agent.streamEvents({
    messages: [new HumanMessage(messageContent)],
  },{
    version:"v2"
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream(stream),
  });

}
