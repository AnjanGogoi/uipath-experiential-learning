import type { AttemptRecord } from '../types'

// Simple localStorage-backed persistence for Stage 1 (no backend, no login).
// Stage 2 can replace these functions with API calls behind the same signatures.

const ATTEMPTS_KEY = 'elp.attempts.v1'
const NAME_KEY = 'elp.participantName.v1'

function readAll(): AttemptRecord[] {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY)
    return raw ? (JSON.parse(raw) as AttemptRecord[]) : []
  } catch {
    return []
  }
}

function writeAll(records: AttemptRecord[]): void {
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(records))
}

export function getParticipantName(): string {
  return localStorage.getItem(NAME_KEY) ?? ''
}

export function setParticipantName(name: string): void {
  localStorage.setItem(NAME_KEY, name)
}

/** Save an attempt, keeping only the best-scoring attempt per use case. */
export function saveAttempt(record: AttemptRecord): void {
  const all = readAll()
  const existingIdx = all.findIndex((a) => a.useCaseId === record.useCaseId)
  if (existingIdx === -1) {
    all.push(record)
  } else if (record.result.percentage >= all[existingIdx].result.percentage) {
    all[existingIdx] = record
  }
  writeAll(all)
}

export function getAttempts(): AttemptRecord[] {
  return readAll()
}

export function getAttemptForUseCase(useCaseId: string): AttemptRecord | undefined {
  return readAll().find((a) => a.useCaseId === useCaseId)
}

export function clearAllAttempts(): void {
  localStorage.removeItem(ATTEMPTS_KEY)
}

/** Aggregate stats for the dashboard / leaderboard. */
export interface ProgressSummary {
  completed: number
  total: number
  averagePercentage: number
  totalPoints: number
}

export function summarize(total: number): ProgressSummary {
  const attempts = readAll()
  const completed = attempts.length
  const avg =
    completed === 0
      ? 0
      : Math.round(
          attempts.reduce((s, a) => s + a.result.percentage, 0) / completed,
        )
  const points = Math.round(
    attempts.reduce((s, a) => s + a.result.totalScore, 0),
  )
  return { completed, total, averagePercentage: avg, totalPoints: points }
}
