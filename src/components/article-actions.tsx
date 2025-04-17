"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Bookmark, ThumbsUp, Copy, Twitter, Facebook, Linkedin } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { Article } from "@/lib/types"

interface ArticleActionsProps {
    article: Article
}

export default function ArticleActions({ article }: ArticleActionsProps) {
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 5)

    const { toast } = useToast()


    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked)
        toast({
            description: isBookmarked ? "Article removed from bookmarks" : "Article saved to bookmarks",
        })
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href)
        toast({
            description: "Link copied to clipboard",
        })
    }

    const handleShare = async (platform: string) => {
        const shareUrl = window.location.href
        const shareText = `Check out this article: ${article.title}`

        let shareLink = ""

        switch (platform) {
            case "twitter":
                shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
                break
            case "facebook":
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
                break
            case "linkedin":
                shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
                break
            default:
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: article.title,
                            text: article.description,
                            url: window.location.href,
                        })
                        return
                    } catch (error) {
                        console.error("Error sharing:", error)
                    }
                }
                handleCopyLink()
                return
        }

        window.open(shareLink, "_blank", "noopener,noreferrer")
    }

    return (
        <div className="flex items-center gap-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => setLikeCount(likeCount + 1)}
                        >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <span>{likeCount}</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Like this article</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "text-muted-foreground hover:text-foreground",
                                isBookmarked && "text-primary hover:text-primary",
                            )}
                            onClick={handleBookmark}
                        >
                            <Bookmark className={`h-4 w-4 mr-1 ${isBookmarked ? "fill-current" : ""}`} />
                            <span>Save</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{isBookmarked ? "Remove bookmark" : "Bookmark this article"}</p>
                    </TooltipContent>
                </Tooltip>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <Share2 className="h-4 w-4 mr-1" />
                            <span>Share</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleCopyLink}>
                            <Copy className="h-4 w-4 mr-2" />
                            <span>Copy link</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare("twitter")}>
                            <Twitter className="h-4 w-4 mr-2" />
                            <span>Twitter</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare("facebook")}>
                            <Facebook className="h-4 w-4 mr-2" />
                            <span>Facebook</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare("linkedin")}>
                            <Linkedin className="h-4 w-4 mr-2" />
                            <span>LinkedIn</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TooltipProvider>
        </div>
    )
}
