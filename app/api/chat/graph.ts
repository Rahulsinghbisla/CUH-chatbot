import { HumanMessage } from "@langchain/core/messages";
import { END, START, StateGraph } from "@langchain/langgraph";
import { MessagesState } from "./state";
import { llmCall } from "./nodes";


export const agent = new StateGraph(MessagesState)
  .addNode("llmCall", llmCall)
  .addEdge(START, "llmCall")
  .addEdge( "llmCall",END)
  .compile();

