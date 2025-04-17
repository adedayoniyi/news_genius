/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"
import { useTheme as useNextTheme } from "next-themes"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    enableSystem?: boolean
    storageKey?: string
    attribute?: string
    disableTransitionOnChange?: boolean
}

export function ThemeProvider({
    children,
    defaultTheme = "system",
    enableSystem = true,
    storageKey = "theme",
    attribute = "class",
    disableTransitionOnChange = false,
}: ThemeProviderProps) {
    const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme({
        defaultTheme,
        enableSystem,
        storageKey,
        attribute,
        disableTransitionOnChange,
    })

    return children
}
