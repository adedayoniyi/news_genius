"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, RefreshCw } from "lucide-react"
import type { Article } from "@/lib/types"
import { cn } from "@/lib/utils"
import { chatWithAi } from "@/lib/ai-service"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
}

interface ChatInterfaceProps {
    article: Article | null
}

export default function ChatInterface({ article }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: article
                ? `Hello! I'm your AI news assistant. I can help you understand the article "${article.title}". What would you like to know about it?`
                : "Hello! I'm your AI news assistant. I can help you find and understand news articles, answer questions about current events, or discuss specific topics. What would you like to talk about today?",
        },
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
        }

        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            const response = await chatWithAi(
                messages.map((m) => ({ role: m.role, content: m.content })),
                userMessage.content,
                article,
            )

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response,
            }

            setMessages((prev) => [...prev, assistantMessage])
        } catch (error) {
            console.error("Error chatting with AI:", error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I'm sorry, I encountered an error processing your request. Please try again.",
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    const suggestedQuestions = [
        article ? "Can you summarize this article for me?" : "What are the top news stories today?",
        article ? "What are the key points of this article?" : "Tell me about recent technology news",
        article ? "Is there any bias in this article?" : "What's happening in world politics?",
        article ? "What's the context behind this news?" : "Explain the latest economic trends",
    ]

    return (
        <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                            "flex items-start gap-3 max-w-[80%]",
                            message.role === "assistant" ? "self-start" : "self-end ml-auto",
                        )}
                    >
                        {message.role === "assistant" && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    <Bot className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                        )}
                        <Card className={cn(message.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground")}>
                            <CardContent className="p-3">
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </CardContent>
                        </Card>
                        {message.role === "user" && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-muted">
                                    <User className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3 max-w-[80%] self-start">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                <Bot className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                        <Card className="bg-muted">
                            <CardContent className="p-3">
                                <div className="flex items-center gap-2">
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    <p className="text-sm">Thinking...</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && (
                <div className="px-4 pb-4">
                    <div className="grid grid-cols-2 gap-2">
                        {suggestedQuestions.map((question, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                className="justify-start h-auto py-2 px-3 text-sm text-left"
                                onClick={() => {
                                    setInput(question)
                                }}
                            >
                                {question}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            <div className="p-4 border-t">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="min-h-[60px] resize-none"
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send message</span>
                    </Button>
                </form>
            </div>
        </div>
    )
}
