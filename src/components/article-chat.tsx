"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, RefreshCw, MessageSquare, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"
import { chatWithAi } from "@/lib/ai-service"
import type { Article } from "@/lib/types"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
}

interface ArticleChatProps {
    article: Article
}

export default function ArticleChat({ article }: ArticleChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: `Hello! I can help you understand this article about "${article.title}". What would you like to know?`,
        },
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
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
        "Can you summarize this article in simpler terms?",
        "What are the most important facts in this article?",
        "What background information should I know about this topic?",
        "Why is this news significant?",
        "Are there any biases in this article?",
        "What might happen next based on this news?",
    ]

    return (
        <Card className="overflow-hidden border-primary/20">
            <CardHeader className="bg-primary/5 pb-3">
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <span>Article Chat</span>
                    <Button variant="ghost" size="sm" className="ml-auto h-8 px-2" onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? "Minimize" : "Expand"}
                    </Button>
                </CardTitle>
                <CardDescription>Ask questions about this article to better understand it</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className={cn("flex flex-col transition-all duration-300", isExpanded ? "h-[500px]" : "h-[300px]")}>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={cn(
                                    "flex items-start gap-3 max-w-[90%]",
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
                                <div
                                    className={cn(
                                        "rounded-lg px-3 py-2",
                                        message.role === "assistant" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground",
                                    )}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                </div>
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
                            <div className="flex items-start gap-3 max-w-[90%] self-start">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        <Bot className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="bg-muted rounded-lg px-3 py-2">
                                    <div className="flex items-center gap-2">
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                        <p className="text-sm">Thinking...</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {messages.length === 1 && (
                        <div className="px-4 pb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium">Suggested questions</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                                placeholder="Ask a question about this article..."
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
            </CardContent>
        </Card>
    )
}
