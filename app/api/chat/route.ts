import { HumanMessage } from "@langchain/core/messages";
import { agent } from "./graph";

export async function POST(request:Request){
    const data = await request.json()
    const content = data.messageContent
    console.log("Message content is ",content)

    const result = await agent.invoke({
      messages: [new HumanMessage(content)],
    });
    
    for (const message of result.messages) {
      console.log(`[${message.type}]: ${message.text}`);
    }

    return Response.json({message:"OK"})
    
}
