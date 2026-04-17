import { SystemMessage } from "@langchain/core/messages";
import { GraphNode } from "@langchain/langgraph";
import { MessagesState } from "./state";
import { getDynamicModel } from "./model";

export const llmCall: GraphNode<typeof MessagesState> = async (state) => {
  const model = getDynamicModel("gpt-5-mini")
  const response = await model.invoke([
    new SystemMessage(
      "You are a helpful assistant"
    ),
    ...state.messages,
  ]);
  return {
    messages: [response],
    llmCalls: 1,
  };
};