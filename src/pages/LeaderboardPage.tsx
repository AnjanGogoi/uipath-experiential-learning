import { Link } from 'react-router-dom'
import { allUseCases, findUseCase, tracks } from '../data/tracks'
import { Icon } from '../components/Icon'
import {
  clearAllAttempts,
  getAttempts,
  summarize,
} from '../storage/progress'
import { useState } from 'react'

export function LeaderboardPage() {
  const [, force] = useState(0)
  const attempts = getAttempts()
  const progress = summarize(allUseCases.length)

  const ranked = [...attempts].sort(
    (a, b) => b.result.percentage - a.result.percentage,
  )

  return (
    <div className="container">
      <div className="crumb">
        <Link to="/">Home</Link>
        <span className="sep">/</span>
        <span>Leaderboard</span>
      </div>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="section-head">
          <div className="eyebrow">Your progress</div>
          <h2>
            <Icon name="trophy" size={26} /> Leaderboard &amp; scorecard
          </h2>
          <p>
            Your best attempt per use case, ranked by score. Data is stored
            locally in this browser (Stage 1). Stage 2 introduces a shared,
            cross-partner leaderboard.
          </p>
        </div>

        <div className="grid grid-3" style={{ marginBottom: 28 }}>
          <StatCard label="Use cases completed" value={`${progress.completed}/${progress.total}`} />
          <StatCard label="Average score" value={`${progress.averagePercentage}%`} />
          <StatCard label="Total points earned" value={`${progress.totalPoints}`} />
        </div>

        <div className="panel" style={{ padding: 18 }}>
          <div className="spread" style={{ marginBottom: 6 }}>
            <span className="tiny muted">
              Overall completion: {progress.completed} of {progress.total}
            </span>
          </div>
          <div className="pbar">
            <span
              style={{
                width: `${
                  progress.total
                    ? (progress.completed / progress.total) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

        {ranked.length === 0 ? (
          <div className="empty">
            <div className="big">🏁</div>
            <h3>No submissions yet</h3>
            <p>Complete a use case to appear on your leaderboard.</p>
            <Link to="/" className="btn btn-primary">
              Browse tracks <Icon name="arrow" size={16} />
            </Link>
          </div>
        ) : (
          <>
            <table className="table" style={{ marginTop: 24 }}>
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Rank</th>
                  <th>Use case</th>
                  <th>Participant</th>
                  <th>Grade</th>
                  <th style={{ textAlign: 'right' }}>Score</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((a, i) => {
                  const uc = findUseCase(a.useCaseId)
                  const track = tracks.find((t) => t.id === a.trackId)
                  return (
                    <tr key={a.id}>
                      <td className="rank">#{i + 1}</td>
                      <td>
                        <strong>{uc?.title ?? a.useCaseId}</strong>
                        <br />
                        <span
                          className="tiny"
                          style={{ color: track?.accent }}
                        >
                          {track?.name}
                        </span>
                      </td>
                      <td>{a.submission.participantName}</td>
                      <td>
                        <span className={`grade grade-${a.result.grade}`}>
                          {a.result.grade}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <strong>{a.result.percentage}%</strong>
                        <br />
                        <span className="tiny muted">
                          {a.result.totalScore}/{a.result.maxScore} pts
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link
                          to={`/usecase/${a.useCaseId}`}
                          className="btn btn-ghost"
                        >
                          Open
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div className="row" style={{ marginTop: 18 }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  if (
                    confirm(
                      'Clear all your local submissions? This cannot be undone.',
                    )
                  ) {
                    clearAllAttempts()
                    force((n) => n + 1)
                  }
                }}
              >
                <Icon name="reset" size={16} /> Reset my progress
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div
        style={{
          fontFamily: 'var(--font-head)',
          fontWeight: 800,
          fontSize: '2rem',
          color: 'var(--uip-deep-blue)',
        }}
      >
        {value}
      </div>
      <div className="muted tiny">{label}</div>
    </div>
  )
}
