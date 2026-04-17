import { Chat } from '@ai-sdk/react'
import { DefaultChatTransport, UIMessage } from 'ai'
import {create} from 'zustand'

export interface ChatStoreState{
    chatInstance:Chat<UIMessage>;
}

function createChat(){
    return new Chat<UIMessage>({
        transport: new DefaultChatTransport({
          api: '/api/chat',
          prepareSendMessagesRequest: ({ id, messages, body }) => {
            const lastMessage = messages.at(-1)?.parts[0]
            let lastMessageText = ""
            if (lastMessage?.type == "text") {
              lastMessageText = lastMessage.text
            }
            return {
              body: {
                messageContent: lastMessageText, // Only send last 1 messages
                threadId: body?.threadId
              },
            };
          },
        }),
      })
}

export const useChatStore=create<ChatStoreState>((set)=>(
    {
    chatInstance:createChat(), 
}))