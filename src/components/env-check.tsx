"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function EnvCheck() {
    const [missingKeys, setMissingKeys] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function checkEnv() {
            try {
                const response = await fetch("/api/env-check")
                const data = await response.json()

                if (data.status === "error" && data.missingKeys) {
                    setMissingKeys(data.missingKeys)
                }
            } catch (error) {
                console.error("Error checking environment variables:", error)
            } finally {
                setIsLoading(false)
            }
        }

        checkEnv()
    }, [])

    if (isLoading || missingKeys.length === 0) {
        return null
    }

    return (
        <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Missing API Keys</AlertTitle>
            <AlertDescription>
                The following environment variables are missing: {missingKeys.join(", ")}
                <div className="mt-2 text-sm">
                    Please add these to your .env.local file or environment variables to enable full functionality.
                </div>
            </AlertDescription>
        </Alert>
    )
}
