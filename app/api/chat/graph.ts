import { HumanMessage } from "@langchain/core/messages";
import { END, START, StateGraph,Checkpoint } from "@langchain/langgraph";
import { MessagesState } from "./state";
import { llmCall } from "./nodes";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

const checkpointer = PostgresSaver.fromConnString(process.env.DATABASE_URL!);

// Only run first time when we are connecting the checkpointer to the postgres db
// (async()=>{
// checkpointer.setup()
// })()

export const agent = new StateGraph(MessagesState)
  .addNode("llmCall", llmCall)
  .addEdge(START, "llmCall")
  .addEdge( "llmCall",END)
  .compile({checkpointer});

