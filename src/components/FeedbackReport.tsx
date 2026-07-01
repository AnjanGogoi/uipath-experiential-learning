import type { ReviewResult } from '../types'
import { Icon } from './Icon'

export function FeedbackReport({
  result,
  onRetry,
}: {
  result: ReviewResult
  onRetry: () => void
}) {
  return (
    <div className="stack">
      <div className="panel">
        <div className="eyebrow">Automated review</div>
        <div className="score-hero">
          <div
            className="score-ring"
            style={{ ['--pct' as string]: result.percentage }}
          >
            <div className="inner">
              <div>
                <div className="pct">{result.percentage}%</div>
                <div className="of">
                  {result.totalScore}/{result.maxScore} pts
                </div>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <span className={`grade grade-${result.grade}`}>{result.grade}</span>
            <p style={{ marginTop: 12, marginBottom: 8 }}>{result.benchmark}</p>
            <p className="tiny muted mt0">
              Reviewed by the {result.reviewer === 'ai' ? 'AI' : 'rule-based'}{' '}
              engine ·{' '}
              {new Date(result.reviewedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Scorecard against industry standard</h3>
        <div>
          {result.criteria.map((c) => (
            <div className="crit" key={c.id}>
              <span className={`dot dot-${c.status}`} />
              <div style={{ flex: 1 }}>
                <div className="c-top">
                  <span className="c-name">{c.label}</span>
                  <span className="c-pts">
                    {c.awarded}/{c.maxScore}
                  </span>
                </div>
                <div className="c-fb">{c.feedback}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-2">
        <div className="panel" style={{ marginBottom: 0 }}>
          <h3>
            <Icon name="check" size={18} /> What you did well
          </h3>
          {result.strengths.length ? (
            <ul className="list-clean">
              {result.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          ) : (
            <p className="muted tiny">
              No criteria fully met yet — use the feedback below to improve.
            </p>
          )}
        </div>
        <div className="panel" style={{ marginBottom: 0 }}>
          <h3>
            <Icon name="spark" size={18} /> Focus areas to improve
          </h3>
          {result.improvements.length ? (
            <ul className="list-clean">
              {result.improvements.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          ) : (
            <p className="muted tiny">
              Excellent — every criterion was met. Try raising your reported
              metrics next.
            </p>
          )}
        </div>
      </div>

      <div className="row">
        <button className="btn btn-secondary" onClick={onRetry}>
          <Icon name="reset" size={16} /> Revise &amp; resubmit
        </button>
        <span className="tiny muted">
          Your best attempt is saved automatically and appears on the
          leaderboard.
        </span>
      </div>
    </div>
  )
}
