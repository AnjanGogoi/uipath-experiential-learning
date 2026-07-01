// Core domain types for the Experiential Learning Platform.

export type TrackId = 'agentic-automation' | 'agentic-testing' | 'du-ixp'

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

/** A single evaluable criterion within a use case rubric. */
export interface RubricCriterion {
  id: string
  /** Human-readable label shown in the review report. */
  label: string
  /** What "good" looks like — shown as a checklist item to the participant. */
  description: string
  /** Weight toward the total score. Weights across a use case need not sum to 100. */
  weight: number
  /**
   * Keywords/concepts the rule-based reviewer looks for in the participant's
   * written solution summary. Presence contributes to partial credit even when
   * the checkbox is not ticked, discouraging blind self-attestation.
   */
  keywords: string[]
  /** Feedback shown when the criterion is fully met. */
  passFeedback: string
  /** Pointed, actionable feedback shown when the criterion is missed. */
  failFeedback: string
}

/** An optional numeric metric the participant reports (e.g., accuracy, pass rate). */
export interface MetricSpec {
  id: string
  label: string
  unit: string
  /** Value at or above which full marks are given for this metric. */
  target: number
  /** Value below which zero marks are given; linear between floor and target. */
  floor: number
  weight: number
  hint: string
}

export interface UseCase {
  id: string
  trackId: TrackId
  title: string
  difficulty: Difficulty
  estimatedMinutes: number
  /** Short tagline shown on cards. */
  summary: string
  /** The business scenario the participant must solve. */
  scenario: string[]
  /** Explicit deliverables the participant is expected to produce. */
  objectives: string[]
  /** Progressive hints, revealed one at a time. */
  hints: string[]
  /** Rubric used by the review engine. */
  rubric: RubricCriterion[]
  /** Optional reported metrics contributing to the score. */
  metrics?: MetricSpec[]
  /** Reference / "industry standard" notes shown after submission. */
  referenceApproach: string[]
}

export interface Track {
  id: TrackId
  name: string
  tagline: string
  description: string
  /** Brand accent color for the track. */
  accent: string
  icon: string
  useCases: UseCase[]
}

// ---- Submission & review types ----

export interface SubmissionData {
  participantName: string
  /** Free-text description of the solution the participant built. */
  solutionSummary: string
  /** IDs of rubric criteria the participant claims to have completed. */
  completedCriteria: string[]
  /** Reported metric values keyed by MetricSpec.id. */
  metrics: Record<string, number>
  /** Names of any files the participant attached (client-side only in Stage 1). */
  attachments: string[]
}

export interface CriterionResult {
  id: string
  label: string
  maxScore: number
  awarded: number
  status: 'met' | 'partial' | 'missed'
  feedback: string
}

export type Grade = 'Exemplary' | 'Proficient' | 'Developing' | 'Foundational'

export interface ReviewResult {
  useCaseId: string
  reviewer: 'rule-based' | 'ai'
  totalScore: number
  maxScore: number
  percentage: number
  grade: Grade
  /** One-line placement against industry standard. */
  benchmark: string
  criteria: CriterionResult[]
  strengths: string[]
  improvements: string[]
  reviewedAt: string
}

/** Persisted record of an attempt. */
export interface AttemptRecord {
  id: string
  useCaseId: string
  trackId: TrackId
  submission: SubmissionData
  result: ReviewResult
  createdAt: string
}
