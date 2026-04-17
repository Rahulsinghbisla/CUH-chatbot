import React from 'react'
import { Conversation, ConversationContent, ConversationDownload, ConversationEmptyState, ConversationScrollButton } from './ai-elements/conversation';
import { UIMessage } from '@ai-sdk/react';
import { MessageSquare } from 'lucide-react';
import { Message, MessageContent, MessageResponse } from './ai-elements/message';
import { PromptInput, PromptInputTextarea } from './ai-elements/prompt-input';

const Rendering = ({messages}:{
  messages:UIMessage[];
}) => {

  
  return (
        <Conversation className='h-full'>
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="size-12" />}
                title="Start a conversation"
                description="Type a message below to begin chatting"
              />
            ) : (
              messages.map((message) => (
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text": // we don't use any reasoning or tool calls in this example
                          return (
                            <MessageResponse key={`${message.id}-${i}`}>
                              {part.text}
                            </MessageResponse>
                          );
                        default:
                          return null;
                      }
                    })}
                  </MessageContent>
                </Message>
              ))
            )}
          </ConversationContent>
          {/* <ConversationDownload messages={conversationMessages} /> */}
          <ConversationScrollButton />
        </Conversation>
    
  );
}

export default Rendering
