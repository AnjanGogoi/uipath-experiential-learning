import { NavLink, Link, Outlet } from 'react-router-dom'
import { Logo } from './Logo'

export function Layout() {
  return (
    <>
      <header className="site-header">
        <div className="container">
          <Link to="/" className="brand">
            <Logo height={26} />
            <span className="brand-divider" aria-hidden="true" />
            <span className="brand-text">Experiential Learning Platform</span>
          </Link>
          <nav className="nav">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/leaderboard">Leaderboard</NavLink>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container spread">
          <div>
            <strong>UiPath Partner Experiential Learning Platform</strong> — Stage 1
            preview
          </div>
          <div className="tiny">
            Dummy lab environment · Automated review &amp; scoring
          </div>
        </div>
      </footer>
    </>
  )
}
