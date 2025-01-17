import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X } from "lucide-react";
import { BotMessage } from "./BotMessage";
import { botQuestions, welcomeMessage, type BotQuestion } from "@/data/botQuestions";

interface Message {
  id: number;
  user: string;
  message: string;
  timestamp: Date;
  isBot?: boolean;
  questions?: BotQuestion[];
}

interface LiveChatProps {
  messages: Message[];
  onClose: () => void;
}

export const LiveChat = ({ messages: initialMessages, onClose }: LiveChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    setMessages([
      {
        ...welcomeMessage,
        questions: botQuestions,
      },
      ...initialMessages,
    ]);
  }, [initialMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const userMessage: Message = {
        id: Date.now(),
        user: "Vous",
        message: newMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      
      setTimeout(() => {
        const botResponse: Message = {
          id: Date.now() + 1,
          user: "Bot",
          message: "Je vais transmettre votre message à l'agent. En attendant, voici d'autres questions fréquentes :",
          timestamp: new Date(),
          isBot: true,
          questions: botQuestions,
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 1000);

      setNewMessage("");
    }
  };

  const handleQuestionClick = (question: BotQuestion) => {
    const userMessage: Message = {
      id: Date.now(),
      user: "Vous",
      message: question.text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        user: "Bot",
        message: "L'agent va répondre à votre question. Souhaitez-vous plus de détails ?",
        timestamp: new Date(),
        isBot: true,
        questions: question.followUpQuestions || botQuestions,
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-[100]">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold">Chat en direct</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-1">
              {message.isBot ? (
                <BotMessage
                  message={message.message}
                  questions={message.questions}
                  onQuestionClick={handleQuestionClick}
                />
              ) : (
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{message.user}</span>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{message.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};