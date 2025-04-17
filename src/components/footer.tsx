import Link from "next/link"

export default function Footer() {
    return (
        <footer className="w-full border-t bg-background py-6">
            <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-col items-center md:items-start">
                    <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} NewsGenius. All rights reserved.</p>
                </div>
                <div className="flex gap-6">
                    <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                        About
                    </Link>
                    <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                        Privacy
                    </Link>
                    <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                        Terms
                    </Link>
                    <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                        Contact
                    </Link>
                </div>
            </div>
        </footer>
    )
}
