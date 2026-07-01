import type { ReviewResult, SubmissionData, UseCase } from '../types'
import { RuleBasedReviewer } from './RuleBasedReviewer'

/**
 * The contract every reviewer implements. Stage 1 ships the rule-based
 * reviewer; Stage 2 can drop in an AI reviewer (calling a UiPath Cloud Labs
 * backend or Claude) behind this same interface without touching the UI.
 */
export interface ReviewService {
  review(useCase: UseCase, submission: SubmissionData): Promise<ReviewResult>
}

export type ReviewerKind = 'rule-based' | 'ai'

/**
 * Returns the active reviewer. Controlled by the VITE_REVIEWER env var so the
 * platform can switch to the AI reviewer in Stage 2 via a build flag, with a
 * safe fallback to the rule-based reviewer.
 */
export function getReviewService(kind?: ReviewerKind): ReviewService {
  const selected = kind ?? (import.meta.env.VITE_REVIEWER as ReviewerKind | undefined)
  switch (selected) {
    case 'ai':
      // Stage 2: return new AiReviewer(). Falls back until implemented.
      return new RuleBasedReviewer()
    case 'rule-based':
    default:
      return new RuleBasedReviewer()
  }
}
