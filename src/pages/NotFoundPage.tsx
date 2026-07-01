import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="container">
      <div className="empty">
        <div className="big">🤖</div>
        <h2>Page not found</h2>
        <p>This lab doesn&apos;t exist — it may have moved.</p>
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
      </div>
    </div>
  )
}
