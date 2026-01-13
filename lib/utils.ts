import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function calculateCurrentDay(startDate: Date, cycleDays: number): { dayInCycle: number; currentCycle: number } {
  const today = new Date()
  const start = new Date(startDate)
  const diffTime = today.getTime() - start.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  const currentCycle = Math.floor(diffDays / cycleDays)
  const dayInCycle = (diffDays % cycleDays) + 1 // +1 car les jours commencent à 1
  
  return { dayInCycle, currentCycle }
}
