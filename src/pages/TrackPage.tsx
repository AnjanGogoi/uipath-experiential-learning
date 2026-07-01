import { Link, useParams } from 'react-router-dom'
import { findTrack } from '../data/tracks'
import { Icon } from '../components/Icon'
import { getAttemptForUseCase } from '../storage/progress'
import { NotFoundPage } from './NotFoundPage'

export function TrackPage() {
  const { trackId } = useParams()
  const track = findTrack(trackId ?? '')
  if (!track) return <NotFoundPage />

  return (
    <div className="container">
      <div className="crumb">
        <Link to="/">Home</Link>
        <span className="sep">/</span>
        <span>{track.name}</span>
      </div>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="section-head">
          <div
            className="track-icon"
            style={{ background: track.accent, marginBottom: 16 }}
          >
            <Icon name={track.icon as 'robot'} size={24} />
          </div>
          <h2 style={{ marginBottom: 6 }}>{track.name}</h2>
          <p style={{ fontSize: '1.05rem' }}>{track.description}</p>
        </div>

        <div className="grid grid-2">
          {track.useCases.map((u) => {
            const attempt = getAttemptForUseCase(u.id)
            return (
              <Link
                to={`/usecase/${u.id}`}
                key={u.id}
                className="card usecase-card"
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="accent-bar"
                  style={{ height: 5, background: track.accent }}
                />
                <div className="body">
                  <div className="tag-strip">
                    <span
                      className={`badge badge-${u.difficulty.toLowerCase()}`}
                    >
                      {u.difficulty}
                    </span>
                    <span className="badge badge-muted">
                      <Icon name="clock" size={12} /> {u.estimatedMinutes} min
                    </span>
                    {attempt && (
                      <span className="badge badge-done">
                        <Icon name="check" size={12} /> {attempt.result.percentage}%
                      </span>
                    )}
                  </div>
                  <h3>{u.title}</h3>
                  <div className="summary">{u.summary}</div>
                  <div className="uc-foot">
                    <span
                      className="btn btn-ghost"
                      style={{ paddingLeft: 0, color: track.accent }}
                    >
                      {attempt ? 'Review & improve' : 'Start use case'}{' '}
                      <Icon name="arrow" size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
