"use client"

import * as React from "react"
import { ToastProvider, ToastViewport } from "@radix-ui/react-toast"

import { cn } from "@/lib/utils"

const ToastContext = React.createContext<{
  toast: (props: ToastProps) => void
}>({
  toast: () => {},
})

export interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<(ToastProps & { id: number })[]>([])

  const toast = React.useCallback((props: ToastProps) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { ...props, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastProvider>
        <ToastViewport className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={cn(
                "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border p-6 pr-8 shadow-lg transition-all mb-2",
                t.variant === "destructive"
                  ? "border-destructive bg-destructive text-destructive-foreground"
                  : "border bg-background text-foreground"
              )}
            >
              <div className="grid gap-1">
                {t.title && <div className="text-sm font-semibold">{t.title}</div>}
                {t.description && (
                  <div className="text-sm opacity-90">{t.description}</div>
                )}
              </div>
            </div>
          ))}
        </ToastViewport>
      </ToastProvider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a Toaster")
  }
  return context
}
