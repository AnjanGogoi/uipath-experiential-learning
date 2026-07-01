import { Link } from 'react-router-dom'
import { tracks, allUseCases } from '../data/tracks'
import { Icon } from '../components/Icon'
import { getAttempts, summarize } from '../storage/progress'

export function HomePage() {
  const attempts = getAttempts()
  const done = new Set(attempts.map((a) => a.useCaseId))
  const progress = summarize(allUseCases.length)

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="eyebrow" style={{ color: 'var(--uip-teal)' }}>
            UiPath Partner Enablement
          </div>
          <h1>
            Learn by building<span className="dot">.</span> Get scored like it&apos;s
            production<span className="dot">.</span>
          </h1>
          <p className="lead">
            Hands-on labs across UiPath&apos;s most in-demand capabilities. Pick a
            use case, build your solution in the lab, submit it, and get pointed,
            automated feedback benchmarked against industry standard.
          </p>
          <div className="hero-actions">
            <a href="#tracks" className="btn btn-primary">
              Explore learning tracks <Icon name="arrow" size={16} />
            </a>
            <Link to="/leaderboard" className="btn btn-secondary" style={{ color: '#fff', borderColor: '#fff' }}>
              <Icon name="trophy" size={16} /> View leaderboard
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="num">3</div>
              <div className="lbl">Learning tracks</div>
            </div>
            <div className="hero-stat">
              <div className="num">{allUseCases.length}</div>
              <div className="lbl">Hands-on use cases</div>
            </div>
            <div className="hero-stat">
              <div className="num">
                {progress.completed}/{progress.total}
              </div>
              <div className="lbl">Completed by you</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="tracks">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Choose your path</div>
            <h2>Three experiential learning tracks</h2>
            <p>
              Each track has two use cases. Build in the lab, submit, and the
              platform reviews your work and scores it against industry
              standard.
            </p>
          </div>

          <div className="grid grid-3">
            {tracks.map((t) => {
              const completed = t.useCases.filter((u) => done.has(u.id)).length
              return (
                <Link
                  to={`/track/${t.id}`}
                  key={t.id}
                  className="card track-card"
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className="accent-bar"
                    style={{ background: t.accent }}
                  />
                  <div className="body">
                    <div
                      className="track-icon"
                      style={{ background: t.accent }}
                    >
                      <Icon name={t.icon as 'robot'} size={24} />
                    </div>
                    <h3>{t.name}</h3>
                    <div className="tagline">{t.tagline}</div>
                    <div className="desc">{t.description}</div>
                    <div className="track-meta">
                      <span className="badge badge-muted">
                        {t.useCases.length} use cases
                      </span>
                      {completed > 0 && (
                        <span className="badge badge-done">
                          <Icon name="check" size={12} /> {completed} done
                        </span>
                      )}
                      <span style={{ marginLeft: 'auto', color: t.accent }}>
                        <Icon name="arrow" size={18} />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid grid-3">
            <HowStep
              n="1"
              title="Pick a use case"
              text="Read the business scenario, objectives, and reveal hints as you need them."
            />
            <HowStep
              n="2"
              title="Build in the lab"
              text="Develop your solution in the lab environment (dummy in Stage 1, UiPath Cloud Labs in Stage 2)."
            />
            <HowStep
              n="3"
              title="Submit & get scored"
              text="The platform reviews your submission and returns a pointed scorecard vs. industry standard."
            />
          </div>
        </div>
      </section>
    </>
  )
}

function HowStep({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div
        className="track-icon"
        style={{ background: 'var(--uip-deep-blue)' }}
      >
        <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800 }}>
          {n}
        </span>
      </div>
      <h3 style={{ fontSize: '1.1rem' }}>{title}</h3>
      <p className="muted mt0" style={{ fontSize: '0.9rem' }}>
        {text}
      </p>
    </div>
  )
}
