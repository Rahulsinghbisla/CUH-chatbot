import { headers } from "next/headers"
import { auth } from "./auth"
import { db } from "@/db"
import { thread } from "@/db/schema/thread-schema"
import { and, eq } from "drizzle-orm"
import { BaseMessage, mapChatMessagesToStoredMessages } from "@langchain/core/messages"

export async function getMessageHistory({ graph, threadId, userId }: {
    graph: any,
    threadId: string,
    userId: string
}) {
    const session = await auth.api.getSession({ headers: await headers() })
    try {
        const existingThreads = await db.select()
            .from(thread)
            .where(
                and(
                    eq(thread.id, threadId),
                    eq(thread.userId, userId)
                ),
            ).limit(1)

        if (!existingThreads) {
            return []
        }
        const config = { configurable: { thread_id: threadId } };

        const state = await graph.getState(config);
        // console.log("state is : ",state)
        const messages =
            (state?.values?.messages as BaseMessage[]) ?? [];

        // here we get the message of langgraph then we have to convert them 
        const serializedMessages =
            mapChatMessagesToStoredMessages(messages);

        return serializedMessages;
    } catch (error) {
        console.error("some error occurred : ",error)
    }

}