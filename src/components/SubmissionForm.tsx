import { useState } from 'react'
import type { SubmissionData, UseCase } from '../types'
import { Icon } from './Icon'

export function SubmissionForm({
  useCase,
  initialName,
  submitting,
  onSubmit,
}: {
  useCase: UseCase
  initialName: string
  submitting: boolean
  onSubmit: (data: SubmissionData) => void
}) {
  const [name, setName] = useState(initialName)
  const [summary, setSummary] = useState('')
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [metrics, setMetrics] = useState<Record<string, string>>({})
  const [attachment, setAttachment] = useState('')
  const [error, setError] = useState('')

  function toggle(id: string) {
    setChecked((c) => ({ ...c, [id]: !c[id] }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter your name so your submission can be scored.')
      return
    }
    if (summary.trim().length < 40) {
      setError(
        'Describe your solution in a bit more detail (at least 40 characters) so the reviewer can assess it.',
      )
      return
    }
    setError('')
    const data: SubmissionData = {
      participantName: name.trim(),
      solutionSummary: summary.trim(),
      completedCriteria: Object.keys(checked).filter((k) => checked[k]),
      metrics: Object.fromEntries(
        Object.entries(metrics)
          .map(([k, v]) => [k, Number(v)])
          .filter(([, v]) => !Number.isNaN(v as number)),
      ),
      attachments: attachment ? [attachment] : [],
    }
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="stack">
      <div className="field">
        <label htmlFor="pname">Your name</label>
        <input
          id="pname"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Alex Partner"
        />
      </div>

      <div className="field">
        <label htmlFor="summary">Describe your solution</label>
        <p className="help">
          Explain your approach: the design decisions you made, the components
          you built, and how you handled edge cases. The reviewer reads this to
          score your work — be specific.
        </p>
        <textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="I designed the agent with an explicit goal and role prompt. I created three tools: ... For escalation I used thresholds of ... To handle failures I ..."
        />
      </div>

      <div className="field">
        <label>Which of these did you implement?</label>
        <p className="help">
          Tick what you completed. Claims are cross-checked against your
          description above, so ticking without explaining won&apos;t earn full
          marks.
        </p>
        {useCase.rubric.map((c) => (
          <label className="check" key={c.id}>
            <input
              type="checkbox"
              checked={!!checked[c.id]}
              onChange={() => toggle(c.id)}
            />
            <span>
              <span className="c-label">{c.label}</span>
              <br />
              <span className="c-desc">{c.description}</span>
            </span>
          </label>
        ))}
      </div>

      {useCase.metrics && useCase.metrics.length > 0 && (
        <div className="field">
          <label>Report your results</label>
          <p className="help">
            Enter the metrics your solution achieved. These are scored against
            industry targets.
          </p>
          {useCase.metrics.map((m) => (
            <div key={m.id}>
              <div className="metric-row">
                <span>
                  <strong>{m.label}</strong> ({m.unit})
                </span>
                <input
                  type="number"
                  step="any"
                  value={metrics[m.id] ?? ''}
                  onChange={(e) =>
                    setMetrics((s) => ({ ...s, [m.id]: e.target.value }))
                  }
                  placeholder={`${m.target}`}
                />
              </div>
              <div className="m-hint">{m.hint}</div>
            </div>
          ))}
        </div>
      )}

      <div className="field">
        <label htmlFor="attach">Artifact name (optional)</label>
        <p className="help">
          In Stage 1 you can reference your exported project by name (e.g.{' '}
          <code>InvoiceAgent_v2.zip</code>). Stage 2 will accept the file
          directly from your Cloud Labs environment.
        </p>
        <input
          id="attach"
          type="text"
          value={attachment}
          onChange={(e) => setAttachment(e.target.value)}
          placeholder="MySolution.zip"
        />
      </div>

      {error && (
        <div className="callout warn" role="alert">
          {error}
        </div>
      )}

      <div>
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Reviewing…' : 'Submit for review'}
          {!submitting && <Icon name="arrow" size={16} />}
        </button>
      </div>
    </form>
  )
}
