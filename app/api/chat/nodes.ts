import { SystemMessage } from "@langchain/core/messages";
import { GraphNode } from "@langchain/langgraph";
import { MessagesState } from "./state";
import { getDynamicModel } from "./model";
import {getSearchYoutube} from "./tools"
import { ToolNode } from "@langchain/langgraph/prebuilt";

export const llmCall: GraphNode<typeof MessagesState> = async (state) => {
  const model = getDynamicModel("gpt-5-mini")
  const modelWithTools = model.bindTools([getSearchYoutube])
  const response = await modelWithTools.invoke([
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

// Create the ToolNode with your tools
export const toolNode = new ToolNode([getSearchYoutube]);