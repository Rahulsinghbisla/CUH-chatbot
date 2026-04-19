"use server"

import { db } from "@/db"
import { thread } from "@/db/schema/thread-schema"
import { desc, eq } from "drizzle-orm"
import { auth } from "./auth"
import { headers } from "next/headers"

export async function fetchThreads() {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) {
        return []
    }
    try {
        const threads = await db.select({ id: thread.id, title: thread.title, createdAt: thread.createdAt })
            .from(thread)
            .where(eq(thread.userId, session.session.userId))
            .orderBy(desc(thread.createdAt))
        return threads

    } catch (error) {
        console.error("Error in connecting in fetching thread from db : ",error)
        // toast("something went wrong to connecting")
        return []
    }
}