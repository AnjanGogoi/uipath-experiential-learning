import type {
  CriterionResult,
  Grade,
  ReviewResult,
  SubmissionData,
  UseCase,
} from '../types'
import type { ReviewService } from './ReviewService'

/**
 * Deterministic, offline reviewer for Stage 1.
 *
 * Scoring blends three signals so participants cannot game the score by simply
 * ticking every box:
 *   1. Self-attested completion (the checkbox) — necessary but not sufficient.
 *   2. Evidence in the written solution summary (keyword/concept coverage).
 *   3. Reported metrics vs. industry targets (linear between floor and target).
 *
 * A criterion only earns full marks when it is both attested AND supported by
 * evidence in the write-up. Attested-but-unexplained earns partial credit;
 * explained-but-not-attested still earns most of the credit (evidence wins).
 */
export class RuleBasedReviewer implements ReviewService {
  async review(useCase: UseCase, submission: SubmissionData): Promise<ReviewResult> {
    const summary = submission.solutionSummary.toLowerCase()
    const criteria: CriterionResult[] = []

    let earned = 0
    let max = 0

    for (const c of useCase.rubric) {
      max += c.weight

      const attested = submission.completedCriteria.includes(c.id)
      const evidence = keywordCoverage(summary, c.keywords)

      // Combine attestation and evidence into a 0..1 completion fraction.
      // Evidence is weighted higher than a bare checkbox.
      const fraction = clamp01(0.35 * (attested ? 1 : 0) + 0.65 * evidence)
      const awarded = round1(c.weight * fraction)
      earned += awarded

      const status: CriterionResult['status'] =
        fraction >= 0.85 ? 'met' : fraction >= 0.4 ? 'partial' : 'missed'

      const feedback =
        status === 'met'
          ? c.passFeedback
          : status === 'partial'
            ? `${c.failFeedback} (You addressed part of this — make it explicit and complete.)`
            : c.failFeedback

      criteria.push({
        id: c.id,
        label: c.label,
        maxScore: c.weight,
        awarded,
        status,
        feedback,
      })
    }

    // Metric-based criteria.
    for (const m of useCase.metrics ?? []) {
      max += m.weight
      const reported = submission.metrics[m.id]
      const fraction =
        reported == null || Number.isNaN(reported)
          ? 0
          : clamp01((reported - m.floor) / (m.target - m.floor))
      const awarded = round1(m.weight * fraction)
      earned += awarded

      const status: CriterionResult['status'] =
        fraction >= 0.85 ? 'met' : fraction >= 0.4 ? 'partial' : 'missed'

      const feedback =
        reported == null || Number.isNaN(reported)
          ? `No value reported for ${m.label}. ${m.hint}`
          : status === 'met'
            ? `${m.label} of ${reported}${m.unit} meets the industry target of ${m.target}${m.unit}.`
            : `${m.label} of ${reported}${m.unit} is below the ${m.target}${m.unit} industry target. ${m.hint}`

      criteria.push({
        id: `metric-${m.id}`,
        label: m.label,
        maxScore: m.weight,
        awarded,
        status,
        feedback,
      })
    }

    const percentage = max === 0 ? 0 : Math.round((earned / max) * 100)
    const grade = toGrade(percentage)

    const strengths = criteria
      .filter((c) => c.status === 'met')
      .map((c) => c.label)
    const improvements = criteria
      .filter((c) => c.status !== 'met')
      .map((c) => c.feedback)

    return {
      useCaseId: useCase.id,
      reviewer: 'rule-based',
      totalScore: round1(earned),
      maxScore: max,
      percentage,
      grade,
      benchmark: benchmarkLine(percentage, grade),
      criteria,
      strengths,
      improvements,
      reviewedAt: new Date().toISOString(),
    }
  }
}

/** Fraction of the criterion's keywords present in the text (0..1). */
function keywordCoverage(text: string, keywords: string[]): number {
  if (keywords.length === 0) return 0
  const hits = keywords.filter((k) => text.includes(k.toLowerCase())).length
  // Reward the first couple of concept matches strongly; full coverage caps at 1.
  return clamp01(hits / Math.max(2, keywords.length * 0.6))
}

function toGrade(pct: number): Grade {
  if (pct >= 85) return 'Exemplary'
  if (pct >= 70) return 'Proficient'
  if (pct >= 50) return 'Developing'
  return 'Foundational'
}

function benchmarkLine(pct: number, grade: Grade): string {
  switch (grade) {
    case 'Exemplary':
      return `Top-tier — ${pct}%. This meets or exceeds production/industry standard and would pass a partner solution review.`
    case 'Proficient':
      return `Solid — ${pct}%. A production-viable solution with a few refinements needed before a customer engagement.`
    case 'Developing':
      return `Developing — ${pct}%. The core idea is there; several industry-standard practices are missing.`
    case 'Foundational':
      return `Foundational — ${pct}%. Revisit the hints and reference approach, then resubmit to reach production standard.`
  }
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n))
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}
