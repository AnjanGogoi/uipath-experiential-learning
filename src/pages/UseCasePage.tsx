import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { findTrack, findUseCase } from '../data/tracks'
import { Icon } from '../components/Icon'
import { SubmissionForm } from '../components/SubmissionForm'
import { FeedbackReport } from '../components/FeedbackReport'
import { getReviewService } from '../review/ReviewService'
import {
  getAttemptForUseCase,
  getParticipantName,
  saveAttempt,
  setParticipantName,
} from '../storage/progress'
import type { AttemptRecord, ReviewResult, SubmissionData } from '../types'
import { NotFoundPage } from './NotFoundPage'

export function UseCasePage() {
  const { useCaseId } = useParams()
  const useCase = findUseCase(useCaseId ?? '')
  const track = useCase ? findTrack(useCase.trackId) : undefined

  const existing = useMemo(
    () => (useCase ? getAttemptForUseCase(useCase.id) : undefined),
    [useCase],
  )

  const [revealed, setRevealed] = useState(0)
  const [result, setResult] = useState<ReviewResult | null>(
    existing?.result ?? null,
  )
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(!existing)

  if (!useCase || !track) return <NotFoundPage />

  async function handleSubmit(data: SubmissionData) {
    if (!useCase || !track) return
    setSubmitting(true)
    setParticipantName(data.participantName)
    const service = getReviewService()
    // Small delay to convey "reviewing"; the engine itself is synchronous.
    const reviewResult = await service.review(useCase, data)
    const record: AttemptRecord = {
      id: `${useCase.id}-${reviewResult.reviewedAt}`,
      useCaseId: useCase.id,
      trackId: track.id,
      submission: data,
      result: reviewResult,
      createdAt: reviewResult.reviewedAt,
    }
    saveAttempt(record)
    setResult(reviewResult)
    setShowForm(false)
    setSubmitting(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container">
      <div className="crumb">
        <Link to="/">Home</Link>
        <span className="sep">/</span>
        <Link to={`/track/${track.id}`}>{track.name}</Link>
        <span className="sep">/</span>
        <span>{useCase.title}</span>
      </div>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="tag-strip">
          <span className={`badge badge-${useCase.difficulty.toLowerCase()}`}>
            {useCase.difficulty}
          </span>
          <span className="badge badge-muted">
            <Icon name="clock" size={12} /> {useCase.estimatedMinutes} min
          </span>
          <span
            className="badge"
            style={{ background: track.accent, color: '#fff' }}
          >
            {track.name}
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', marginTop: 12 }}>
          {useCase.title}
        </h1>
        <p style={{ fontSize: '1.05rem', maxWidth: '70ch' }} className="muted">
          {useCase.summary}
        </p>

        <div className="uc-layout" style={{ marginTop: 24 }}>
          {/* Left: brief + submission / review */}
          <div>
            <div className="panel">
              <h2>The scenario</h2>
              {useCase.scenario.map((s, i) => (
                <p key={i} className={i === useCase.scenario.length - 1 ? 'mt0' : ''}>
                  {s}
                </p>
              ))}
              <h3 style={{ marginTop: 18 }}>Your objectives</h3>
              <ul className="list-clean">
                {useCase.objectives.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </div>

            {result && !showForm ? (
              <>
                <FeedbackReport
                  result={result}
                  onRetry={() => {
                    setShowForm(true)
                    setResult(result)
                  }}
                />
                <div className="panel" style={{ marginTop: 22 }}>
                  <h3>
                    <Icon name="spark" size={18} /> Reference approach (industry
                    standard)
                  </h3>
                  <p className="muted tiny">
                    Compare your solution to how a production-grade solution
                    typically handles this:
                  </p>
                  <ul className="list-clean">
                    {useCase.referenceApproach.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="panel">
                <h2>Submit your solution</h2>
                <p className="muted tiny">
                  Build your solution in the lab, then describe it here for
                  automated review.
                </p>
                <SubmissionForm
                  useCase={useCase}
                  initialName={getParticipantName()}
                  submitting={submitting}
                  onSubmit={handleSubmit}
                />
              </div>
            )}
          </div>

          {/* Right: lab + hints */}
          <aside>
            <div className="sticky">
              <div className="panel">
                <h3>Lab environment</h3>
                <div className="callout">
                  <strong>Stage 1 — dummy lab.</strong> Use your local UiPath
                  Studio or any sandbox to build a solution for this scenario. In
                  Stage 2 this panel will launch a dedicated UiPath Cloud Labs
                  environment.
                </div>
                <button
                  className="btn btn-secondary"
                  style={{ marginTop: 14, width: '100%' }}
                  disabled
                  title="Available in Stage 2"
                >
                  <Icon name="lock" size={16} /> Launch Cloud Lab (Stage 2)
                </button>
              </div>

              <div className="panel" style={{ marginBottom: 0 }}>
                <div className="spread">
                  <h3 className="mt0" style={{ marginBottom: 0 }}>
                    Hints
                  </h3>
                  <span className="tiny muted">
                    {revealed}/{useCase.hints.length} revealed
                  </span>
                </div>
                <p className="tiny muted">
                  Stuck? Reveal hints one at a time — using them does not affect
                  your score.
                </p>
                {useCase.hints.map((h, i) =>
                  i < revealed ? (
                    <div className="hint" key={i}>
                      <span className="hint-num">Hint {i + 1}</span>
                      {h}
                    </div>
                  ) : i === revealed ? (
                    <div className="hint hint-locked" key={i}>
                      <span>Hint {i + 1} hidden</span>
                      <button
                        className="btn btn-ghost"
                        onClick={() => setRevealed(revealed + 1)}
                      >
                        Reveal <Icon name="arrow" size={14} />
                      </button>
                    </div>
                  ) : null,
                )}
                {revealed >= useCase.hints.length && (
                  <p className="tiny muted mt0">All hints revealed.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
