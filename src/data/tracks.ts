import type { Track, UseCase } from '../types'

// NOTE: These are placeholder (dummy) use cases for Stage 1.
// Stage 2 will replace the scenario/objectives/rubric content with the real
// exercises tied to a UiPath Cloud Labs environment. The shape stays the same,
// so swapping content will not require code changes.

// ---------------------------------------------------------------------------
// Track 1 — Agentic Automation
// ---------------------------------------------------------------------------

const invoiceAgent: UseCase = {
  id: 'aa-invoice-triage',
  trackId: 'agentic-automation',
  title: 'Autonomous Invoice Triage Agent',
  difficulty: 'Intermediate',
  estimatedMinutes: 90,
  summary:
    'Build an agent that reads incoming invoices, decides an approval path, and escalates exceptions to a human.',
  scenario: [
    'A mid-market customer receives ~400 supplier invoices a week across email and a shared drive.',
    'Finance wants an agent that classifies each invoice, validates it against a purchase order, and routes it: auto-approve, request clarification, or escalate to a manager.',
    'The agent must reason over unstructured notes on the invoice and pick the right tool for each step rather than following a fixed linear flow.',
  ],
  objectives: [
    'Design an agent with a clear goal, tools, and guardrails.',
    'Give the agent at least three tools (e.g., extract fields, look up PO, notify approver).',
    'Implement a human-in-the-loop escalation for low-confidence or high-value invoices.',
    'Add a fallback path when a required tool fails or returns no data.',
  ],
  hints: [
    'Start from the outcome: what decision must the agent make, and what evidence does it need to make it?',
    'Keep tools small and single-purpose. An agent reasons better over five focused tools than one tool that does everything.',
    'Define escalation thresholds explicitly (e.g., value > $10k OR confidence < 0.8) so the human-in-the-loop is predictable.',
    'Add a system prompt that states the agent\'s role, constraints, and when it must stop and ask a human.',
  ],
  rubric: [
    {
      id: 'goal',
      label: 'Clear agent goal & role',
      description: 'The agent has an explicit goal and a role/system prompt bounding its behavior.',
      weight: 20,
      keywords: ['goal', 'system prompt', 'role', 'objective', 'instruction'],
      passFeedback: 'Well-scoped agent goal with a bounding role definition.',
      failFeedback: 'Define an explicit goal and a role/system prompt. Agents without clear boundaries drift and hallucinate actions.',
    },
    {
      id: 'tools',
      label: 'Purposeful tool design',
      description: 'At least three small, single-purpose tools the agent can select between.',
      weight: 25,
      keywords: ['tool', 'extract', 'lookup', 'purchase order', 'po', 'notify', 'api'],
      passFeedback: 'Good tool decomposition — focused tools improve agent reasoning and reliability.',
      failFeedback: 'Break capability into several small tools. One monolithic tool prevents the agent from reasoning about which action to take.',
    },
    {
      id: 'hitl',
      label: 'Human-in-the-loop escalation',
      description: 'Explicit thresholds route uncertain or high-value cases to a human.',
      weight: 25,
      keywords: ['escalat', 'human', 'approval', 'threshold', 'confidence', 'review'],
      passFeedback: 'Clear escalation criteria keep humans in control of consequential decisions.',
      failFeedback: 'Add explicit human-in-the-loop escalation with thresholds. Fully autonomous financial approval is not production-safe.',
    },
    {
      id: 'resilience',
      label: 'Failure handling & fallback',
      description: 'A fallback path handles tool failure or missing data gracefully.',
      weight: 20,
      keywords: ['fallback', 'retry', 'error', 'exception', 'fail', 'timeout'],
      passFeedback: 'Resilient design — fallbacks prevent silent failures in production.',
      failFeedback: 'Handle the case where a tool fails or returns nothing. Without a fallback the agent stalls or invents data.',
    },
    {
      id: 'observability',
      label: 'Logging & traceability',
      description: 'Each decision and tool call is logged for audit.',
      weight: 10,
      keywords: ['log', 'audit', 'trace', 'record', 'observability'],
      passFeedback: 'Traceable decisions — essential for finance audit and debugging.',
      failFeedback: 'Log the agent\'s decisions and tool calls. Untraceable agents cannot be audited or debugged.',
    },
  ],
  metrics: [
    {
      id: 'straight-through',
      label: 'Straight-through processing rate',
      unit: '%',
      target: 70,
      floor: 20,
      weight: 10,
      hint: 'Share of invoices handled end-to-end without human touch. Industry target ~70%.',
    },
  ],
  referenceApproach: [
    'A production-grade solution defines the agent as goal + tools + guardrails, not a fixed sequence.',
    'Tools are small and idempotent; the agent selects among them based on reasoning over the invoice context.',
    'Escalation is deterministic (value/confidence thresholds), while classification is left to the model.',
    'Every action is logged with inputs, outputs, and the reasoning summary for audit.',
  ],
}

const onboardingAgent: UseCase = {
  id: 'aa-employee-onboarding',
  trackId: 'agentic-automation',
  title: 'Employee Onboarding Orchestrator Agent',
  difficulty: 'Advanced',
  estimatedMinutes: 120,
  summary:
    'Coordinate multiple systems and a few sub-agents to onboard a new hire end-to-end with the right approvals.',
  scenario: [
    'HR triggers onboarding for a new hire. Accounts, hardware, access badges, and training must all be provisioned.',
    'Different departments own different systems, and some steps depend on others (e.g., email must exist before software licenses).',
    'Build an orchestrator agent that plans the sequence, delegates to specialized sub-agents, and reports a consolidated status.',
  ],
  objectives: [
    'Model the onboarding as a plan with dependencies rather than a hard-coded order.',
    'Use at least two specialized sub-agents (e.g., IT provisioning, access management).',
    'Handle partial failure so one blocked step does not abort the whole onboarding.',
    'Produce a consolidated, human-readable status report.',
  ],
  hints: [
    'Separate planning from execution: let the orchestrator decide the order from declared dependencies.',
    'Give each sub-agent a narrow domain and a clear contract (inputs it needs, output it returns).',
    'Track per-step state (pending / done / blocked) so you can resume rather than restart.',
    'Report status in business terms the HR partner understands, not raw system codes.',
  ],
  rubric: [
    {
      id: 'planning',
      label: 'Dependency-aware planning',
      description: 'The orchestrator derives order from dependencies instead of hard-coding it.',
      weight: 25,
      keywords: ['plan', 'dependency', 'depend', 'order', 'sequence', 'dag'],
      passFeedback: 'Dependency-driven planning adapts when steps change — far more maintainable than a fixed order.',
      failFeedback: 'Derive the execution order from declared dependencies. Hard-coded sequences break when the process changes.',
    },
    {
      id: 'subagents',
      label: 'Specialized sub-agents',
      description: 'At least two sub-agents with narrow, well-defined responsibilities.',
      weight: 25,
      keywords: ['sub-agent', 'subagent', 'delegate', 'specialist', 'orchestrat'],
      passFeedback: 'Clean delegation — specialized sub-agents keep each domain simple and testable.',
      failFeedback: 'Delegate to specialized sub-agents. A single agent doing everything is hard to reason about and maintain.',
    },
    {
      id: 'partial-failure',
      label: 'Partial-failure resilience',
      description: 'A blocked step is isolated; the rest of onboarding continues.',
      weight: 25,
      keywords: ['partial', 'fail', 'block', 'resume', 'retry', 'isolate'],
      passFeedback: 'Resilient orchestration — isolating failures keeps onboarding moving.',
      failFeedback: 'Isolate failures so one blocked step does not abort everything. Onboarding should degrade gracefully.',
    },
    {
      id: 'reporting',
      label: 'Consolidated status reporting',
      description: 'A clear, business-readable status is produced for the HR partner.',
      weight: 15,
      keywords: ['report', 'status', 'summary', 'consolidat', 'dashboard'],
      passFeedback: 'Business-readable reporting builds trust with the HR stakeholder.',
      failFeedback: 'Produce a consolidated, business-readable status. Raw system logs are not consumable by HR.',
    },
    {
      id: 'idempotency',
      label: 'Safe re-runs (idempotency)',
      description: 'Re-running does not double-provision accounts or licenses.',
      weight: 10,
      keywords: ['idempoten', 're-run', 'duplicate', 'once', 'exactly'],
      passFeedback: 'Idempotent steps make retries safe — critical for provisioning.',
      failFeedback: 'Make steps idempotent so retries do not create duplicate accounts or licenses.',
    },
  ],
  referenceApproach: [
    'The orchestrator builds a dependency graph and executes ready steps, delegating each to a sub-agent.',
    'Sub-agents expose a simple contract and are individually testable.',
    'State is persisted per step so the run can resume after a failure instead of restarting.',
    'Provisioning actions are idempotent, keyed by employee + resource.',
  ],
}

// ---------------------------------------------------------------------------
// Track 2 — Agentic Testing
// ---------------------------------------------------------------------------

const regressionAgent: UseCase = {
  id: 'at-self-healing-regression',
  trackId: 'agentic-testing',
  title: 'Self-Healing Regression Suite',
  difficulty: 'Intermediate',
  estimatedMinutes: 90,
  summary:
    'Create a test agent that detects when a UI changes, repairs affected selectors, and reports what it healed.',
  scenario: [
    'A web app under test ships weekly UI updates, and brittle selectors break the regression suite every release.',
    'Build an agentic testing solution that identifies broken locators at runtime, proposes a repaired locator, re-runs the step, and logs the change for a human to confirm.',
    'The goal is fewer false failures without silently masking real regressions.',
  ],
  objectives: [
    'Detect a broken locator and distinguish it from a genuine functional failure.',
    'Propose and apply a healed locator using resilient attributes.',
    'Flag every heal for human confirmation instead of applying silently.',
    'Report a heal rate and any tests that could not be healed.',
  ],
  hints: [
    'Prefer stable attributes (roles, labels, test-ids) over positional or auto-generated CSS paths.',
    'A heal should be evidence-based: match on multiple attributes, not just one guess.',
    'Distinguish "element moved/renamed" (heal) from "element gone / assertion failed" (real bug).',
    'Never auto-merge a heal into the canonical suite without a human review gate.',
  ],
  rubric: [
    {
      id: 'detection',
      label: 'Accurate break detection',
      description: 'Broken locators are distinguished from genuine functional failures.',
      weight: 25,
      keywords: ['detect', 'broken', 'locator', 'selector', 'distinguish', 'false failure'],
      passFeedback: 'Correctly separating locator breaks from real bugs prevents masking regressions.',
      failFeedback: 'Distinguish a broken locator from a real functional failure, or healing will hide genuine regressions.',
    },
    {
      id: 'healing',
      label: 'Resilient locator healing',
      description: 'Healed locators use stable attributes (role, label, test-id).',
      weight: 25,
      keywords: ['heal', 'repair', 'test-id', 'role', 'label', 'attribute', 'resilient'],
      passFeedback: 'Attribute-based healing produces durable locators that survive future changes.',
      failFeedback: 'Heal using stable attributes rather than positional paths, or the fix will break again next release.',
    },
    {
      id: 'human-gate',
      label: 'Human confirmation gate',
      description: 'Heals are flagged for review, never applied silently to the canonical suite.',
      weight: 20,
      keywords: ['confirm', 'review', 'human', 'gate', 'approve', 'flag'],
      passFeedback: 'A review gate keeps testers in control and prevents drift from silent auto-heals.',
      failFeedback: 'Add a human confirmation gate. Silent auto-healing erodes trust and can mask defects.',
    },
    {
      id: 'assertions',
      label: 'Assertions preserved',
      description: 'Functional assertions still run after healing — healing only fixes location, not outcomes.',
      weight: 20,
      keywords: ['assert', 'verify', 'validation', 'expected', 'outcome'],
      passFeedback: 'Preserving assertions ensures healing never weakens what the test actually verifies.',
      failFeedback: 'Keep functional assertions intact. Healing should fix where an element is, never what the test checks.',
    },
    {
      id: 'reporting',
      label: 'Heal reporting & metrics',
      description: 'A report shows heal rate and tests that could not be healed.',
      weight: 10,
      keywords: ['report', 'heal rate', 'metric', 'log', 'summary'],
      passFeedback: 'Clear heal metrics make the suite\'s health visible to the QA lead.',
      failFeedback: 'Report heal rate and unhealed tests so QA can see suite health at a glance.',
    },
  ],
  metrics: [
    {
      id: 'heal-rate',
      label: 'Self-heal success rate',
      unit: '%',
      target: 85,
      floor: 30,
      weight: 10,
      hint: 'Share of broken-locator failures automatically repaired. Mature suites reach ~85%.',
    },
  ],
  referenceApproach: [
    'Detection compares expected vs. actual DOM to classify break type before acting.',
    'Healing scores candidate elements on multiple stable attributes and picks the best match.',
    'Every heal is queued for human review with before/after evidence.',
    'Assertions run unchanged; healing only re-resolves the locator.',
  ],
}

const testGenAgent: UseCase = {
  id: 'at-requirement-test-generation',
  trackId: 'agentic-testing',
  title: 'Requirement-to-Test Generation Agent',
  difficulty: 'Advanced',
  estimatedMinutes: 110,
  summary:
    'Turn a plain-language requirement into a prioritized set of test cases including edge and negative paths.',
  scenario: [
    'Product writes requirements in prose; QA manually derives test cases, missing edge cases under time pressure.',
    'Build an agent that reads a requirement, generates positive, negative, and boundary test cases, and prioritizes them by risk.',
    'The output must be reviewable and traceable back to specific requirement statements.',
  ],
  objectives: [
    'Parse a requirement into discrete, testable statements.',
    'Generate positive, negative, and boundary/edge test cases.',
    'Prioritize cases by risk or business impact.',
    'Maintain traceability from each test back to the requirement it covers.',
  ],
  hints: [
    'Decompose the requirement first — you cannot test what you have not isolated into atomic statements.',
    'For every positive case, ask "what is the opposite?" to derive the negative case.',
    'Boundaries live at limits: min, max, empty, zero, and just-over-the-edge values.',
    'Traceability is a link, not a comment — tie each test to a requirement ID.',
  ],
  rubric: [
    {
      id: 'decomposition',
      label: 'Requirement decomposition',
      description: 'The requirement is broken into atomic, testable statements.',
      weight: 20,
      keywords: ['decompos', 'atomic', 'parse', 'statement', 'break down'],
      passFeedback: 'Atomic decomposition is the foundation of complete coverage.',
      failFeedback: 'Decompose the requirement into atomic statements first — coverage gaps start with vague requirements.',
    },
    {
      id: 'coverage',
      label: 'Positive / negative / boundary coverage',
      description: 'All three case types are generated, not just happy-path.',
      weight: 30,
      keywords: ['positive', 'negative', 'boundary', 'edge', 'happy path', 'invalid'],
      passFeedback: 'Balanced coverage across positive, negative, and boundary cases catches the defects that matter.',
      failFeedback: 'Generate negative and boundary cases, not only happy-path. Most production defects hide at the edges.',
    },
    {
      id: 'prioritization',
      label: 'Risk-based prioritization',
      description: 'Cases are ordered by risk or business impact.',
      weight: 20,
      keywords: ['priorit', 'risk', 'impact', 'severity', 'critical'],
      passFeedback: 'Risk-based ordering ensures the most important tests run first when time is short.',
      failFeedback: 'Prioritize by risk or impact. An unordered pile of tests gives no guidance under time pressure.',
    },
    {
      id: 'traceability',
      label: 'Requirement traceability',
      description: 'Each test links back to the requirement statement it verifies.',
      weight: 20,
      keywords: ['trace', 'link', 'requirement id', 'coverage matrix', 'map'],
      passFeedback: 'Traceability lets you prove coverage and update tests when requirements change.',
      failFeedback: 'Link each test to its requirement. Without traceability you cannot prove or maintain coverage.',
    },
    {
      id: 'reviewability',
      label: 'Human-reviewable output',
      description: 'Generated tests are clear enough for a QA lead to review and approve.',
      weight: 10,
      keywords: ['review', 'clear', 'readable', 'approve', 'format'],
      passFeedback: 'Reviewable output keeps a human in control of what enters the suite.',
      failFeedback: 'Format tests for human review. Generated tests must be approved before they are trusted.',
    },
  ],
  metrics: [
    {
      id: 'edge-ratio',
      label: 'Edge/negative case ratio',
      unit: '%',
      target: 50,
      floor: 10,
      weight: 10,
      hint: 'Share of generated cases that are negative or boundary. Strong suites are ~40-50%.',
    },
  ],
  referenceApproach: [
    'The agent decomposes the requirement into atomic acceptance criteria first.',
    'For each criterion it derives positive, negative, and boundary cases systematically.',
    'A risk score (impact × likelihood) orders the cases.',
    'A coverage matrix maps every test to its source requirement statement.',
  ],
}

// ---------------------------------------------------------------------------
// Track 3 — Document Understanding & IXP
// ---------------------------------------------------------------------------

const duExtraction: UseCase = {
  id: 'du-mixed-document-extraction',
  trackId: 'du-ixp',
  title: 'Mixed-Format Document Extraction',
  difficulty: 'Intermediate',
  estimatedMinutes: 90,
  summary:
    'Classify and extract fields from a mixed batch of invoices, receipts, and purchase orders with validation.',
  scenario: [
    'An operations team receives a daily batch of mixed documents: invoices, receipts, and purchase orders, some scanned, some digital.',
    'Build a Document Understanding pipeline that classifies each document, extracts the right fields per type, and validates the results before export.',
    'Low-confidence extractions must go to a human for validation, not be exported blindly.',
  ],
  objectives: [
    'Classify each incoming document by type before extraction.',
    'Extract type-specific fields (e.g., totals, dates, line items).',
    'Add validation rules (e.g., line items sum to total).',
    'Route low-confidence results to human validation.',
  ],
  hints: [
    'Classify first — extracting invoice fields from a receipt guarantees garbage output.',
    'Use validation rules to catch extraction errors the model is confident but wrong about.',
    'Confidence thresholds should be per-field, not one global number.',
    'Design the human validation step as part of the pipeline, not a manual afterthought.',
  ],
  rubric: [
    {
      id: 'classification',
      label: 'Document classification',
      description: 'Documents are classified by type before field extraction.',
      weight: 20,
      keywords: ['classif', 'document type', 'category', 'sort', 'route'],
      passFeedback: 'Classifying before extracting is the key to accuracy on mixed batches.',
      failFeedback: 'Classify documents before extracting. Type-agnostic extraction produces unreliable fields.',
    },
    {
      id: 'extraction',
      label: 'Type-specific extraction',
      description: 'Correct fields are extracted per document type.',
      weight: 25,
      keywords: ['extract', 'field', 'line item', 'total', 'date', 'amount'],
      passFeedback: 'Type-aware extraction captures the right fields for each document.',
      failFeedback: 'Extract the fields appropriate to each type. A single field set does not fit invoices and receipts alike.',
    },
    {
      id: 'validation',
      label: 'Business-rule validation',
      description: 'Validation rules catch inconsistent extractions (e.g., totals mismatch).',
      weight: 25,
      keywords: ['validat', 'rule', 'sum', 'check', 'consistency', 'cross-field'],
      passFeedback: 'Validation catches confident-but-wrong extractions before they reach downstream systems.',
      failFeedback: 'Add cross-field validation (e.g., line items sum to total). Confidence alone does not guarantee correctness.',
    },
    {
      id: 'confidence-routing',
      label: 'Confidence-based human routing',
      description: 'Low-confidence extractions go to human validation, not straight to export.',
      weight: 20,
      keywords: ['confidence', 'threshold', 'human', 'validation station', 'review'],
      passFeedback: 'Per-field confidence routing keeps humans focused only where they add value.',
      failFeedback: 'Route low-confidence fields to a human. Blind export of uncertain data corrupts downstream systems.',
    },
    {
      id: 'throughput',
      label: 'Scalable batch handling',
      description: 'The pipeline handles the full daily batch without manual per-document steps.',
      weight: 10,
      keywords: ['batch', 'scale', 'throughput', 'queue', 'volume'],
      passFeedback: 'Batch-first design scales to real daily volumes.',
      failFeedback: 'Handle the batch end-to-end. A per-document manual step will not scale to daily volume.',
    },
  ],
  metrics: [
    {
      id: 'extraction-accuracy',
      label: 'Field extraction accuracy',
      unit: '%',
      target: 95,
      floor: 60,
      weight: 10,
      hint: 'Correctly extracted fields vs. total. Production DU targets ~95%+ on key fields.',
    },
  ],
  referenceApproach: [
    'A classifier routes each document to the correct extraction model.',
    'Extraction is type-specific; fields are validated with cross-field business rules.',
    'Per-field confidence thresholds decide what a human validates in a Validation Station.',
    'Only validated, rule-passing data is exported downstream.',
  ],
}

const ixpProcessing: UseCase = {
  id: 'ixp-intelligent-claims',
  trackId: 'du-ixp',
  title: 'Intelligent Claims Processing (IXP)',
  difficulty: 'Advanced',
  estimatedMinutes: 120,
  summary:
    'Use IXP to process insurance claims end-to-end: split packets, extract, reason over context, and decide next action.',
  scenario: [
    'An insurer receives multi-document claim packets (claim form, photos, police report, invoices) as a single PDF.',
    'Build an IXP solution that splits the packet, understands each part in context, cross-references data across documents, and recommends a decision: approve, request info, or investigate.',
    'The reasoning must be explainable so an adjuster can trust and audit it.',
  ],
  objectives: [
    'Split multi-document packets into their constituent documents.',
    'Extract and understand each document in the context of the whole claim.',
    'Cross-reference data across documents to spot inconsistencies.',
    'Produce an explainable recommendation with supporting evidence.',
  ],
  hints: [
    'Splitting is step zero — a packet processed as one blob loses per-document structure.',
    'Context matters: the same amount means different things on an invoice vs. a claim form.',
    'Inconsistencies across documents (dates, amounts, names) are the strongest fraud/error signal.',
    'An explainable recommendation cites its evidence; a black-box score does not build adjuster trust.',
  ],
  rubric: [
    {
      id: 'splitting',
      label: 'Packet splitting',
      description: 'Multi-document packets are split into constituent documents.',
      weight: 20,
      keywords: ['split', 'packet', 'separate', 'boundary', 'classif'],
      passFeedback: 'Correct splitting preserves per-document structure for accurate understanding.',
      failFeedback: 'Split the packet into individual documents first. Processing it as one blob loses structure and accuracy.',
    },
    {
      id: 'contextual-understanding',
      label: 'Contextual understanding',
      description: 'Each document is interpreted in the context of the whole claim.',
      weight: 25,
      keywords: ['context', 'understand', 'reason', 'interpret', 'semantic'],
      passFeedback: 'Contextual understanding lets the solution reason like an adjuster, not just read fields.',
      failFeedback: 'Interpret documents in context. Isolated field extraction misses what the claim actually means.',
    },
    {
      id: 'cross-reference',
      label: 'Cross-document reconciliation',
      description: 'Data is cross-referenced across documents to find inconsistencies.',
      weight: 25,
      keywords: ['cross-reference', 'reconcil', 'inconsistency', 'compare', 'match', 'discrepan'],
      passFeedback: 'Cross-referencing surfaces the inconsistencies that drive fraud and error detection.',
      failFeedback: 'Cross-reference data across documents. Inconsistencies (dates, amounts, names) are the key signal.',
    },
    {
      id: 'explainability',
      label: 'Explainable recommendation',
      description: 'The recommendation cites supporting evidence an adjuster can audit.',
      weight: 20,
      keywords: ['explain', 'evidence', 'reason', 'justif', 'audit', 'transparent'],
      passFeedback: 'Evidence-backed recommendations earn adjuster trust and pass audit.',
      failFeedback: 'Make the recommendation explainable with cited evidence. A black-box decision will not be trusted or auditable.',
    },
    {
      id: 'decision-routing',
      label: 'Actionable decision routing',
      description: 'Output routes to approve / request info / investigate.',
      weight: 10,
      keywords: ['decision', 'route', 'approve', 'investigate', 'action', 'next step'],
      passFeedback: 'Clear decision routing turns understanding into action.',
      failFeedback: 'Route to a concrete next action. Understanding without a decision leaves work for the adjuster.',
    },
  ],
  metrics: [
    {
      id: 'straight-through-claims',
      label: 'Straight-through decision rate',
      unit: '%',
      target: 60,
      floor: 15,
      weight: 10,
      hint: 'Claims decided without adjuster intervention. Leading IXP deployments reach ~60%.',
    },
  ],
  referenceApproach: [
    'IXP splits the packet and classifies each part before extraction.',
    'Extraction feeds a reasoning step that interprets documents together, not in isolation.',
    'A reconciliation step compares key fields across documents to flag inconsistencies.',
    'The recommendation is generated with cited evidence and a confidence, then routed to the right queue.',
  ],
}

// ---------------------------------------------------------------------------

export const tracks: Track[] = [
  {
    id: 'agentic-automation',
    name: 'Agentic Automation',
    tagline: 'Build agents that reason, act, and know when to ask.',
    description:
      'Design goal-driven agents that select tools, keep humans in the loop, and orchestrate work across systems.',
    accent: '#FA4616', // Robotic Orange
    icon: 'robot',
    useCases: [invoiceAgent, onboardingAgent],
  },
  {
    id: 'agentic-testing',
    name: 'Agentic Testing',
    tagline: 'Tests that adapt, heal, and think about risk.',
    description:
      'Apply agentic techniques to testing — self-healing suites and requirement-driven test generation.',
    accent: '#8B288A', // Testing Purple (reserved for testing content)
    icon: 'flask',
    useCases: [regressionAgent, testGenAgent],
  },
  {
    id: 'du-ixp',
    name: 'Document Understanding & IXP',
    tagline: 'Turn messy documents into trusted, structured decisions.',
    description:
      'Classify, extract, validate, and reason over documents with Document Understanding and Intelligent Xtraction & Processing.',
    accent: '#0BA2B3', // Agentic Teal
    icon: 'document',
    useCases: [duExtraction, ixpProcessing],
  },
]

export const allUseCases: UseCase[] = tracks.flatMap((t) => t.useCases)

export function findTrack(trackId: string): Track | undefined {
  return tracks.find((t) => t.id === trackId)
}

export function findUseCase(useCaseId: string): UseCase | undefined {
  return allUseCases.find((u) => u.id === useCaseId)
}
