import { END, START, StateGraph,Checkpoint } from "@langchain/langgraph";
import { MessagesState } from "./state";
import { llmCall,toolNode } from "./nodes";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { AIMessage } from "@langchain/core/messages";


const checkpointer = PostgresSaver.fromConnString(process.env.DATABASE_URL!);

// Only run first time when we are connecting the checkpointer to the postgres db
// (async()=>{
// checkpointer.setup()
// })()

function shouldContinue(state:typeof MessagesState.State){
  const lastMessage = state.messages.at(-1);
   if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
    return "__end__";
  }
   if (lastMessage.tool_calls?.length) {
    return "tools";
  }
  return END;
}

export const agent = new StateGraph(MessagesState)
  .addNode("llmCall", llmCall)
  .addNode("toolNode",toolNode)
  .addEdge(START, "llmCall")
  .addConditionalEdges("llmCall",shouldContinue,{
    __end__:END,
    tools:"toolNode",
  })
  .addEdge("toolNode","llmCall")
  .compile({checkpointer});

