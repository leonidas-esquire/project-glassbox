(() => {
  "use strict";

  const svgNS = "http://www.w3.org/2000/svg";
  const nodeColors = {
    goal: "#58c9ff",
    evidence: "#58c9ff",
    tool: "#79f2d0",
    assumption: "#ffca6b",
    inference: "#8c7cff",
    contradiction: "#ff8e62",
    uncertainty: "#ffca6b",
    decision: "#79f2d0"
  };

  const events = [
    {
      id: "n0", step: 0, offset: 0, type: "goal", status: "verified", confidence: 100,
      x: 34, y: 256, width: 185, height: 78,
      title: "Deployment question", action: "Structuring the user’s request",
      summary: "The city must decide whether to deploy AI-assisted pothole triage across all districts.",
      detail: "The request was normalized into a decision goal, affected population, intervention, and scope.",
      source: "User-provided question",
      verification: "Captured verbatim from the input panel",
      transform: "Parsed into decision, intervention, population, and geographic-scope fields",
      excerpt: "Should the city deploy AI-assisted pothole triage across all districts?",
      basis: "Confidence reflects direct capture of the user’s input, not confidence in an answer.",
      history: ["Input captured without modification", "Decision variables identified", "Original wording retained for comparison"]
    },
    {
      id: "n1", step: 1, offset: 1.2, type: "tool", status: "verified", confidence: 98,
      x: 273, y: 47, width: 188, height: 78,
      title: "Request-log query", action: "Querying the synthetic request log",
      summary: "The demonstration queried 17,842 synthetic public-works service records.",
      detail: "The tool call was recorded with its parameters, row count, duration, and integrity digest.",
      source: "Synthetic dataset · public_works_requests.csv · 17,842 rows",
      verification: "Demo digest matched: sha256:7b4c…a91e",
      transform: "Filtered closed pothole requests; grouped by district and urgency classification",
      excerpt: "tool.query(dataset='public_works_requests', issue='pothole', status='closed') → 17,842 rows",
      basis: "High confidence because the tool returned a complete synthetic result and passed the demo integrity check.",
      history: ["Query parameters recorded", "Synthetic source opened", "Row count validated", "Demo digest confirmed"]
    },
    {
      id: "n2", step: 2, offset: 2.8, type: "evidence", status: "verified", confidence: 91,
      x: 273, y: 184, width: 188, height: 78,
      title: "Pilot response time", action: "Measuring pilot response-time change",
      summary: "The synthetic pilot shows a 22% median reduction in triage time.",
      detail: "The calculation compares matched eight-week periods and reports the median to reduce outlier sensitivity.",
      source: "Synthetic pilot operations table · periods P1 and P2",
      verification: "Formula reproduced from 16 weekly aggregates",
      transform: "Median(before) − median(after), divided by median(before)",
      excerpt: "median_before=31.8h; median_after=24.8h; relative_change=−22.0%",
      basis: "Confidence is reduced for the small time window and because this is synthetic demonstration evidence.",
      history: ["Matched comparison window selected", "Outliers flagged", "Median calculated", "Result reproduced independently"]
    },
    {
      id: "n3", step: 3, offset: 4.4, type: "evidence", status: "disputed", confidence: 64,
      x: 273, y: 321, width: 188, height: 78,
      title: "District disparity", action: "Checking performance across districts",
      summary: "Two synthetic districts show lower recall for low-light street images.",
      detail: "Aggregate accuracy looked stable, but district-level evaluation revealed a potentially consequential disparity.",
      source: "Synthetic validation set · image quality × district cross-tab",
      verification: "Calculation verified; representativeness disputed",
      transform: "Stratified predictions by district and low-light image flag; compared recall",
      excerpt: "recall_all=.86; recall_low_light_D3=.68; recall_low_light_D6=.65",
      basis: "Moderate confidence: the difference is measurable, but the low-light sample is small and synthetic.",
      history: ["Aggregate metrics calculated", "District stratification applied", "Low-light subgroup isolated", "Representativeness concern opened"]
    },
    {
      id: "n4", step: 4, offset: 6.1, type: "assumption", status: "unverified", confidence: 43,
      x: 273, y: 477, width: 188, height: 78,
      title: "Staff capacity", action: "Making an explicit operational assumption",
      summary: "The trace assumes staff can review every high-impact automated recommendation.",
      detail: "No staffing schedule was supplied, so the system exposes this dependency instead of silently treating it as fact.",
      source: "No source supplied",
      verification: "Not verified · requires operations manager confirmation",
      transform: "Derived as a necessary implementation dependency; not inferred from data",
      excerpt: "UNKNOWN: reviewer coverage, queue size, escalation response time",
      basis: "Low confidence because the necessary operational evidence is unavailable.",
      history: ["Review requirement identified", "Source search returned no staffing plan", "Assumption made explicit", "Human confirmation requested"]
    },
    {
      id: "n5", step: 5, offset: 7.9, type: "inference", status: "verified", confidence: 82,
      x: 515, y: 137, width: 177, height: 78,
      title: "Likely efficiency gain", action: "Linking measured evidence to a bounded inference",
      summary: "AI-assisted triage is likely to improve routing speed under pilot conditions.",
      detail: "This is an inference from the time comparison, not a fact about citywide deployment.",
      source: "Derived from nodes: Request-log query + Pilot response time",
      verification: "Logic link inspected; scope limited to pilot conditions",
      transform: "Evidence synthesis with scope constraint and alternative-cause check",
      excerpt: "IF matched pilot reduction persists AND workflow conditions remain similar → likely routing-speed improvement",
      basis: "Strong but bounded support from the synthetic pilot; citywide generalization remains uncertain.",
      history: ["Evidence links assembled", "Correlation-versus-causation check added", "Claim narrowed to pilot conditions", "Inference marked supported"]
    },
    {
      id: "n6", step: 6, offset: 9.6, type: "contradiction", status: "disputed", confidence: 76,
      x: 515, y: 317, width: 177, height: 78,
      title: "Equity conflict", action: "Reconciling speed gains with unequal recall",
      summary: "Overall speed improves while two districts may receive less reliable classifications.",
      detail: "The positive operational signal conflicts with the district-level reliability signal.",
      source: "Derived from nodes: Pilot response time + District disparity",
      verification: "Conflict reproduced; policy significance awaits human judgment",
      transform: "Compared outcome direction across efficiency and equity criteria",
      excerpt: "EFFICIENCY: +22% faster | EQUITY: −18 to −21 pts low-light recall in D3/D6",
      basis: "The numerical conflict is clear in the demo; its acceptability is a governance decision, not an AI fact.",
      history: ["Decision criteria separated", "Outcome directions compared", "Conflict detected", "Human-policy judgment requested"]
    },
    {
      id: "n7", step: 7, offset: 11.3, type: "uncertainty", status: "unverified", confidence: 37,
      x: 515, y: 477, width: 177, height: 78,
      title: "Citywide unknowns", action: "Quantifying what remains unknown",
      summary: "Citywide workload, seasonal image quality, and review capacity remain unverified.",
      detail: "These unknowns could materially change cost, equity, and service-level outcomes.",
      source: "Evidence-gap register · three open requirements",
      verification: "Not verified · data collection required",
      transform: "Compared required decision inputs with supplied and synthetic evidence",
      excerpt: "MISSING: seasonal sample; peak queue forecast; reviewer coverage model",
      basis: "Low confidence is intentional and reflects missing evidence rather than model indecision.",
      history: ["Required inputs enumerated", "Available sources mapped", "Three material gaps found", "Uncertainty preserved in decision"]
    },
    {
      id: "n8", step: 8, offset: 13.1, type: "decision", status: "verified", confidence: 78,
      x: 735, y: 254, width: 166, height: 82,
      title: "Bounded pilot", action: "Producing a reviewable recommendation",
      summary: "Recommend a controlled two-district pilot—not immediate citywide deployment.",
      detail: "The recommendation preserves the potential benefit while collecting the evidence needed to resolve the equity and capacity risks.",
      source: "Synthesis of 7 linked trace items",
      verification: "Trace complete · final recommendation awaits human approval",
      transform: "Weighted efficiency, equity, operational feasibility, and reversibility; selected the least irreversible supported action",
      excerpt: "RECOMMEND: 90-day pilot + low-light validation + staffed human review + stop criteria",
      basis: "Confidence reflects evidence quality, unresolved gaps, and the reversibility of the proposed next action.",
      history: ["Alternatives compared", "Irreversibility penalty applied", "Safeguards attached", "Recommendation emitted for human review"]
    }
  ];

  const eventMetadata = {
    n0: { agent: "Orchestrator", recordKind: "Observed input", context: "User request + permitted task instructions", relationship: "Opens the trace and scopes every downstream task", unavailable: "Protected system instructions remain restricted" },
    n1: { agent: "Evidence Scout", recordKind: "Observed tool call", context: "Normalized request + synthetic request-log schema", relationship: "Supplies n2 and supports n5", unavailable: "Raw records beyond the displayed aggregate are summarized" },
    n2: { agent: "Evidence Scout", recordKind: "Verified calculation", context: "Matched pilot periods + request-log result", relationship: "Supports n5 and conflicts with n3 through n6", unavailable: "Long-term seasonal performance is unavailable" },
    n3: { agent: "Equity Critic", recordKind: "Observed subgroup result", context: "Validation set + district and low-light attributes", relationship: "Challenges aggregate performance and produces n6", unavailable: "Precise locations are privacy-redacted" },
    n4: { agent: "Orchestrator", recordKind: "Explicit assumption", context: "Implementation requirements + evidence-gap search", relationship: "Constrains n5 and increases n7 uncertainty", unavailable: "Staffing plan was not supplied" },
    n5: { agent: "Evidence Scout", recordKind: "Human-readable interpretation", context: "n1 request-log query + n2 response-time result + n4 constraint", relationship: "Supports the bounded recommendation n8", unavailable: "Private chain-of-thought is restricted" },
    n6: { agent: "Equity Critic", recordKind: "Generated contradiction", context: "n2 efficiency signal + n3 subgroup reliability signal", relationship: "Blocks an unqualified citywide rollout", unavailable: "Policy acceptability requires human judgment" },
    n7: { agent: "Synthesis Judge", recordKind: "Generated uncertainty summary", context: "Evidence-gap register + outputs from all agents", relationship: "Reduces confidence and defines pilot conditions", unavailable: "Seasonal sample, peak forecast, and reviewer capacity" },
    n8: { agent: "Synthesis Judge", recordKind: "Reviewable recommendation", context: "All visible evidence, conflicts, assumptions, and uncertainties", relationship: "Final output of the observable synthesis path", unavailable: "No private reasoning trace or literal neural thoughts" }
  };
  events.forEach(item => Object.assign(item, eventMetadata[item.id]));

  const contextItems = [
    {
      id: "ctx-request", step: 0, category: "received", type: "received", status: "verified", confidence: 100,
      title: "User decision request", summary: "The exact user question was received by the Orchestrator.", detail: "The original wording is retained and linked to the normalized goal.",
      agent: "Orchestrator → all agents", recordKind: "Observed input", context: "Direct user input", source: "Input panel",
      verification: "Byte-for-byte capture in this demonstration", transform: "No transformation before capture", relationship: "Parent context for n0 and every delegated task",
      excerpt: "Should the city deploy AI-assisted pothole triage across all districts?", unavailable: "None", basis: "Directly observed input.", history: ["Received", "Integrity-stamped", "Shared under least-context rules"]
    },
    {
      id: "ctx-instructions", step: 0, category: "received", type: "instruction", status: "verified", confidence: 100,
      title: "Permitted task instructions", summary: "Agents were instructed to evaluate benefit, equity, feasibility, and reversibility.", detail: "Only task-relevant, displayable instructions appear here.",
      agent: "Orchestrator", recordKind: "Observed instruction", context: "Authorized evaluation contract", source: "Demonstration run configuration",
      verification: "Configuration snapshot recorded", transform: "Reduced to four evaluation criteria", relationship: "Controls delegation and synthesis weights",
      excerpt: "criteria=[efficiency,equity,feasibility,reversibility]", unavailable: "Protected platform instructions remain restricted", basis: "Directly recorded configuration.", history: ["Configuration loaded", "Permissions checked", "Criteria distributed"]
    },
    {
      id: "ctx-memory", step: 0, category: "received", type: "memory", status: "verified", confidence: 100,
      title: "Session memory boundary", summary: "No durable personal memory was accessed for this demonstration.", detail: "The absence of memory is shown rather than leaving humans to guess whether it influenced the answer.",
      agent: "Orchestrator", recordKind: "Observed context declaration", context: "Current session only", source: "Synthetic session manifest",
      verification: "memory_access_events=0", transform: "None", relationship: "Confirms the scope of ctx-request",
      excerpt: "durable_memory=false; prior_turns=0", unavailable: "No prior personal history supplied", basis: "Direct session telemetry.", history: ["Memory permission checked", "No retrieval requested", "Boundary recorded"]
    },
    {
      id: "ctx-service-log", step: 1, category: "retrieved", type: "retrieved", status: "verified", confidence: 98,
      title: "Service-request records", summary: "A synthetic public-works request log was retrieved for the Evidence Scout.", detail: "Only the fields needed for the evaluation entered the model context.",
      agent: "Evidence Scout", recordKind: "Observed retrieval", context: "Issue type, district, timestamps, urgency, closure status", source: "Synthetic public_works_requests.csv",
      verification: "17,842 rows + demo digest verified", transform: "Filtered then summarized into 16 aggregates", relationship: "Produces n1 and n2",
      excerpt: "17,842 matching rows; 16 weekly aggregates supplied to model", unavailable: "16,700+ raw rows compacted out of active context", basis: "Retrieval and digest are instrumented.", history: ["Retrieved", "Filtered", "Integrity checked", "Compacted"]
    },
    {
      id: "ctx-validation", step: 3, category: "retrieved", type: "retrieved", status: "disputed", confidence: 64,
      title: "Low-light validation slice", summary: "A synthetic subgroup slice was retrieved for district-level reliability testing.", detail: "The slice is measurable but may not represent future citywide conditions.",
      agent: "Equity Critic", recordKind: "Observed retrieval", context: "District code + image-quality flag + predicted and observed class", source: "Synthetic validation_set.parquet",
      verification: "Values reproduced; representativeness disputed", transform: "Stratified by district and low-light flag", relationship: "Produces n3 and contributes to n6",
      excerpt: "D3 n=142; D6 n=119; precise locations [REDACTED]", unavailable: "Exact coordinates redacted", basis: "Measured signal with limited sample.", history: ["Retrieved", "Privacy filter applied", "Subgroups calculated"]
    },
    {
      id: "ctx-tool-result", step: 2, category: "generated", type: "tool result", status: "verified", confidence: 91,
      title: "Response-time aggregate", summary: "The tool produced a reproducible 22% median triage-time reduction.", detail: "This value is a calculation, not a model belief.",
      agent: "Evidence Scout", recordKind: "Observed tool output", context: "16 synthetic weekly aggregates", source: "calculate_relative_change tool",
      verification: "Formula independently reproduced", transform: "31.8h to 24.8h median comparison", relationship: "Supports n2 and n5",
      excerpt: "relative_change=(31.8−24.8)/31.8=.220", unavailable: "Causal attribution is not established", basis: "Deterministic calculation from demo data.", history: ["Tool invoked", "Output returned", "Formula replayed"]
    },
    {
      id: "ctx-summary", step: 5, category: "generated", type: "summarized", status: "verified", confidence: 82,
      title: "Efficiency interpretation", summary: "A concise interpretation links the measured change to likely pilot-condition benefit.", detail: "The summary is labeled as interpretation, not raw hidden reasoning.",
      agent: "Evidence Scout", recordKind: "Human-readable interpretation", context: "n1 + n2 + explicit scope constraint", source: "Observable synthesis event",
      verification: "Source links and scope are inspectable", transform: "Tool outputs → bounded natural-language summary", relationship: "Produces n5",
      excerpt: "Likely to improve routing speed under pilot conditions", unavailable: "Private chain-of-thought remains restricted", basis: "Evidence-backed but inferential.", history: ["Sources linked", "Scope applied", "Summary emitted"]
    },
    {
      id: "ctx-excluded", step: 2, category: "limited", type: "excluded", status: "verified", confidence: 100,
      title: "Unrelated maintenance records", summary: "Parks, graffiti, and tree-service records were excluded as irrelevant.", detail: "The exclusion is visible so humans can challenge the relevance decision.",
      agent: "Evidence Scout", recordKind: "Observed exclusion", context: "Dataset field inventory", source: "Synthetic request-log query plan",
      verification: "Filter expression recorded", transform: "issue_type != pothole → excluded", relationship: "Narrows ctx-service-log",
      excerpt: "excluded_types=[parks,graffiti,tree_service]", unavailable: "Excluded rows were not provided to the model", basis: "Deterministic query filter.", history: ["Schema inspected", "Relevance rule applied", "Exclusion logged"]
    },
    {
      id: "ctx-compacted", step: 5, category: "limited", type: "truncated", status: "verified", confidence: 96,
      title: "Raw rows compacted", summary: "Raw records were replaced by aggregates to fit the active context window.", detail: "The system records what was removed and what representation replaced it.",
      agent: "Evidence Scout", recordKind: "Observed context compaction", context: "17,842 raw rows", source: "Context-window manager",
      verification: "Before/after token counts recorded", transform: "~286k estimated tokens → 1.4k aggregate tokens", relationship: "Changes the representation used by n5",
      excerpt: "removed=17,826 row-level records; retained=16 aggregates + digest", unavailable: "Removed row text is outside active model context", basis: "Instrumented context-management event.", history: ["Budget threshold reached", "Aggregate selected", "Digest retained"]
    },
    {
      id: "ctx-redacted", step: 3, category: "limited", type: "redacted", status: "verified", confidence: 100,
      title: "Location identifiers", summary: "Potentially identifying street-level fields were redacted before model access.", detail: "The model received district codes, not precise addresses.",
      agent: "Privacy Filter", recordKind: "Observed redaction", context: "Raw validation record", source: "Data-minimization policy",
      verification: "Redaction rule and field count recorded", transform: "street_address → [REDACTED]", relationship: "Protects ctx-validation",
      excerpt: "redacted_fields=[street_address,gps_lat,gps_lon]", unavailable: "Original values restricted from every model", basis: "Policy-enforced transformation.", history: ["Sensitive fields detected", "Values removed", "District retained"]
    },
    {
      id: "ctx-restricted", step: 0, category: "limited", type: "restricted", status: "verified", confidence: 100,
      title: "Protected internal instructions", summary: "Protected platform and security instructions are acknowledged but not displayed.", detail: "Visibility of the boundary is itself auditable; its protected contents are not exposed.",
      agent: "Platform boundary", recordKind: "Access-control event", context: "Restricted instruction channel", source: "System access policy",
      verification: "Restriction state instrumented", transform: "Content withheld; purpose label exposed", relationship: "Constrains all participating models",
      excerpt: "[RESTRICTED — protected instruction content]", unavailable: "Exact protected instructions", basis: "Access-control status is observable.", history: ["Access evaluated", "Display denied", "Boundary event recorded"]
    },
    {
      id: "ctx-unavailable", step: 4, category: "limited", type: "unavailable", status: "unverified", confidence: 0,
      title: "Reviewer staffing plan", summary: "No reviewer schedule or queue-capacity model was available.", detail: "The absence becomes an explicit assumption and uncertainty rather than fabricated evidence.",
      agent: "Orchestrator", recordKind: "Evidence gap", context: "Required implementation inputs", source: "No source supplied",
      verification: "Unavailable", transform: "Missing input → explicit gap", relationship: "Produces n4 and contributes to n7",
      excerpt: "UNAVAILABLE: shifts, queue forecast, escalation SLA", unavailable: "All staffing evidence", basis: "Zero evidence confidence by design.", history: ["Requirement identified", "Sources searched", "No evidence found", "Gap opened"]
    }
  ];

  const agents = [
    { id: "agent-orchestrator", name: "Orchestrator", initials: "OR", model: "demo-router-v1", role: "Scopes the goal and delegates bounded tasks", color: "#79f2d0", start: 0, finish: 8, tokens: 31, latency: 410, contextIds: ["ctx-request", "ctx-instructions", "ctx-memory", "ctx-restricted"], contributionIds: ["n0", "n4"] },
    { id: "agent-evidence", name: "Evidence Scout", initials: "ES", model: "demo-evidence-v2", role: "Retrieves and calculates operational evidence", color: "#58c9ff", start: 1, finish: 5, tokens: 58, latency: 1280, contextIds: ["ctx-service-log", "ctx-tool-result", "ctx-compacted"], contributionIds: ["n1", "n2", "n5"] },
    { id: "agent-equity", name: "Equity Critic", initials: "EQ", model: "demo-critic-v1", role: "Tests subgroup reliability and challenges scope", color: "#ff8e62", start: 3, finish: 6, tokens: 44, latency: 930, contextIds: ["n2", "ctx-validation", "ctx-redacted"], contributionIds: ["n3", "n6"] },
    { id: "agent-synthesis", name: "Synthesis Judge", initials: "SJ", model: "demo-synthesis-v3", role: "Reconciles evidence, uncertainty, and reversibility", color: "#8c7cff", start: 5, finish: 8, tokens: 67, latency: 1640, contextIds: ["ctx-summary", "n6", "ctx-unavailable", "ctx-restricted"], contributionIds: ["n7", "n8"] }
  ].map(agent => ({
    ...agent, type: "model", status: "verified", confidence: 99, title: agent.name,
    summary: agent.role, detail: `${agent.model} participates in the synthetic multi-model trace.`, agent: agent.name,
    recordKind: "Instrumented model lane", context: `${agent.contextIds.length} visible context records`, source: "Synthetic orchestration telemetry",
    verification: "Dispatch and completion events recorded", transform: "Inputs → bounded assigned task → inspectable contribution",
    relationship: `Contributes ${agent.contributionIds.join(", ")}`, excerpt: `model=${agent.model}; context_used=${agent.tokens}%`,
    unavailable: "Private chain-of-thought and literal neural thoughts", basis: "Lane activity is instrumented; semantic summary is labeled.",
    history: ["Agent registered", "Context permissions applied", "Task dispatched", "Contribution linked"]
  }));

  const telemetryItems = [
    { id: "tel-context", type: "telemetry", title: "Context-window utilization", summary: "Context allocation is measured separately for each model.", detail: "Displayed percentages come from the synthetic event stream.", agent: "All models", recordKind: "Observed technical telemetry", context: "Token counters by model", source: "Synthetic runtime counters", verification: "Counter events recorded", transform: "Tokens used ÷ configured context budget", relationship: "Explains compaction and model-lane load", excerpt: "OR=31%; ES=58%; EQ=44%; SJ=67%", unavailable: "Token semantics do not reveal private reasoning", basis: "Direct counter telemetry in this demo.", status: "verified", confidence: 100, history: ["Counters initialized", "Usage sampled", "Percentages calculated"] },
    { id: "tel-latency", type: "telemetry", title: "Model and tool latency", summary: "Per-agent latency and retrieval timing are available for replay.", detail: "Latency indicates system activity, not the quality of reasoning.", agent: "All models", recordKind: "Observed technical telemetry", context: "Dispatch, tool, and completion timestamps", source: "Synthetic event clock", verification: "Monotonic timestamps checked", transform: "completion_time − dispatch_time", relationship: "Aligns model work with the trace timeline", excerpt: "OR=410ms; ES=1280ms; EQ=930ms; SJ=1640ms", unavailable: "Network-level detail is not instrumented", basis: "Timestamp-derived metric.", status: "verified", confidence: 100, history: ["Dispatch stamped", "Completion stamped", "Latency derived"] },
    { id: "tel-activation", type: "not instrumented", title: "Aggregate neural activations", summary: "Neural activation telemetry is not available in this demonstration.", detail: "The interface refuses to manufacture an activation map or call it a thought.", agent: "Underlying model provider", recordKind: "Instrumentation boundary", context: "No activation tensors supplied", source: "Not instrumented", verification: "Absence explicitly recorded", transform: "None", relationship: "Boundary applies to every model lane", excerpt: "NOT INSTRUMENTED", unavailable: "Layer activations, neuron states, attention tensors", basis: "No data exists to support a visualization.", status: "unverified", confidence: 0, history: ["Telemetry capability checked", "No activation interface found", "Boundary displayed"] },
    { id: "tel-thought", type: "restricted", title: "Private chain-of-thought", summary: "Private chain-of-thought is restricted and is not presented as observable data.", detail: "Concise, source-linked reasoning summaries are provided instead.", agent: "All models", recordKind: "Protected boundary", context: "Private internal reasoning", source: "Restricted", verification: "Restriction state confirmed", transform: "Private reasoning → no disclosure; observable summary emitted separately", relationship: "Separates n5–n8 summaries from private reasoning", excerpt: "[RESTRICTED — private internal reasoning]", unavailable: "Private chain-of-thought", basis: "The boundary is factual; the protected content is not exposed.", status: "verified", confidence: 100, history: ["Disclosure boundary applied", "Private content withheld", "Summary channel retained"] }
  ];

  const synthesisItems = [
    { id: "syn-agree", type: "agreement", title: "Shared efficiency signal", summary: "Three participating models agree that the pilot shows an operational speed signal.", detail: "Agreement is limited to pilot conditions, not citywide deployment.", agent: "Evidence Scout + Equity Critic + Synthesis Judge", recordKind: "Cross-model comparison", context: "n2, n3, n5", source: "Agent contribution matrix", verification: "Three aligned outputs linked", transform: "Compared claim direction and scope", relationship: "Supports n8 with a scope constraint", excerpt: "agreement=pilot_speed_signal; votes=3/4", unavailable: "Causal certainty", basis: "Agreement is directly calculated from labeled outputs.", status: "verified", confidence: 88, history: ["Claims normalized", "Scopes compared", "Agreement cluster formed"] },
    { id: "syn-disagree", type: "disagreement", title: "Deployment-scope dispute", summary: "Agents disagree on whether current evidence justifies citywide deployment.", detail: "The disagreement comes from different treatment of equity risk and missing staffing evidence.", agent: "Evidence Scout ↔ Equity Critic", recordKind: "Cross-model disagreement", context: "n5, n6, n7", source: "Agent contribution matrix", verification: "Opposing recommendations linked", transform: "Compared recommended scope and risk thresholds", relationship: "Produces the bounded-pilot compromise n8", excerpt: "scope: pilot_only ≠ citywide_ready", unavailable: "Human policy threshold", basis: "The disagreement is explicit in the outputs.", status: "disputed", confidence: 91, history: ["Recommendations normalized", "Scope mismatch found", "Conflict escalated"] },
    { id: "syn-duplicate", type: "duplication", title: "No material duplication", summary: "The orchestration map shows no repeated retrieval or duplicate calculation.", detail: "Related agents reused linked evidence instead of rerunning tools.", agent: "Orchestrator", recordKind: "Cross-agent efficiency check", context: "All tool and retrieval events", source: "Trace dependency graph", verification: "Unique operation IDs checked", transform: "Grouped events by source, parameters, and digest", relationship: "Reduces unnecessary work", excerpt: "duplicate_operations=0", unavailable: "None", basis: "Deterministic event-ID comparison.", status: "verified", confidence: 100, history: ["Operation IDs collected", "Digests compared", "No duplicates found"] },
    { id: "syn-dependency", type: "dependency", title: "Critical evidence chain", summary: "The recommendation depends on verified speed evidence, an equity conflict, and three unresolved gaps.", detail: "Removing any critical input visibly changes the recommendation confidence.", agent: "Synthesis Judge", recordKind: "Dependency analysis", context: "n2, n3, n4, n6, n7", source: "Trace dependency graph", verification: "Incoming edges and sensitivity replayed", transform: "Removed each dependency and recalculated support", relationship: "Direct parent structure for n8", excerpt: "critical=[n2,n3,n6,n7]; sensitivity=−19 confidence points", unavailable: "Real-world validation", basis: "Dependency links are explicit in the trace.", status: "verified", confidence: 86, history: ["Parents traversed", "Ablation replayed", "Critical chain marked"] }
  ];

  const alternate = {
    id: "alt1", type: "decision", status: "unverified", confidence: 52,
    title: "Immediate rollout",
    summary: "An alternative speed-weighted trace recommends immediate citywide deployment.",
    detail: "This path assigns more weight to aggregate efficiency and less weight to subgroup uncertainty.",
    source: "Alternate weighting profile · speed 70%, equity 15%, feasibility 15%",
    verification: "Reproducible weighting; policy choice not approved",
    transform: "Reweighted the same synthetic evidence toward deployment speed",
    excerpt: "ALT SCORE: rollout=.72; bounded_pilot=.66; equity threshold overridden",
    basis: "Lower confidence because the path accepts unresolved subgroup and staffing evidence.",
    history: ["Alternate objective loaded", "Evidence weights changed", "Equity threshold overridden", "Immediate rollout ranked first"],
    agent: "Synthesis Judge", recordKind: "Alternate recommendation", context: "Same evidence with speed-weighted policy profile",
    relationship: "Competes with n8 in comparison mode", unavailable: "Human approval and resolved equity evidence"
  };

  const edges = [
    { from: "n0", to: "n1", step: 1 },
    { from: "n0", to: "n2", step: 2 },
    { from: "n0", to: "n3", step: 3 },
    { from: "n0", to: "n4", step: 4 },
    { from: "n1", to: "n5", step: 5 },
    { from: "n2", to: "n5", step: 5 },
    { from: "n4", to: "n5", step: 5 },
    { from: "n2", to: "n6", step: 6 },
    { from: "n3", to: "n6", step: 6 },
    { from: "n5", to: "n7", step: 7 },
    { from: "n6", to: "n7", step: 7 },
    { from: "n5", to: "n8", step: 8 },
    { from: "n6", to: "n8", step: 8 },
    { from: "n7", to: "n8", step: 8 }
  ];

  const els = Object.fromEntries([
    "questionInput", "sourceInput", "fileInput", "attachButton", "attachmentList", "runButton",
    "narrationTitle", "narrationList", "streamBadge", "sessionState", "edgeLayer", "nodeLayer",
    "evidenceGraph", "graphStage", "graphLoading", "graphError", "retryButton", "compareButton",
    "comparisonStrip", "exportButton", "fitGraph", "alertRail", "integrityChip", "stateSelector",
    "inspectorTitle", "selectedStatus", "inspectorEmpty", "inspectorContent", "itemType", "itemTime",
    "itemSummary", "confidenceValue", "confidenceBar", "confidenceBasis", "itemSource", "itemVerification",
    "itemTransform", "itemExcerpt", "copyEvidence", "evidenceTab", "historyTab", "reviewTab", "reviewCount",
    "evidencePane", "historyPane", "reviewPane", "historyList", "reviewLog", "stepBack", "stepForward",
    "playPause", "timelineClock", "timelineRange", "timelineTicks", "currentAction", "dismissBanner",
    "reviewModal", "reviewModalTitle", "reviewPrompt", "reviewNote", "correctionField", "correctionInput",
    "closeModal", "cancelReview", "saveReview", "toastRegion", "canvasTransform", "systemView",
    "agentLanesView", "contextMapView", "telemetryView", "synthesisView", "granularityRange",
    "granularityTitle", "granularityDescription", "microscopeMode", "synthesisMode", "zoomOut",
    "zoomIn", "zoomValue", "itemAgent", "itemRecordKind", "itemContext", "itemRelationship", "itemUnavailable"
  ].map(id => [id, document.getElementById(id)]));

  const state = {
    step: -1,
    selectedId: null,
    playing: false,
    timer: null,
    attachments: [],
    reviews: {},
    compare: false,
    demoState: "live",
    pendingReview: null,
    hasStarted: false,
    granularity: 2,
    canvasMode: "microscope",
    zoom: 1
  };

  function escapeHTML(value) {
    return String(value).replace(/[&<>'"]/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    })[character]);
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${remainder.toFixed(1).padStart(4, "0")}`;
  }

  function activeItem() {
    return findItemById(state.selectedId);
  }

  function findItemById(id) {
    if (!id) return null;
    if (id === alternate.id) return alternate;
    return [...events, ...contextItems, ...agents, ...telemetryItems, ...synthesisItems]
      .find(item => item.id === id) || null;
  }

  function eventById(id) {
    return events.find(item => item.id === id);
  }

  function visibleStatus(item) {
    const reviews = state.reviews[item.id] || [];
    if (!reviews.length) return item.status;
    const latest = reviews[reviews.length - 1].action;
    if (latest === "challenged") return "disputed";
    if (latest === "corrected") return "approved";
    return latest;
  }

  function splitTitle(label, max = 22) {
    const words = label.split(" ");
    const lines = [""];
    words.forEach(word => {
      const current = lines[lines.length - 1];
      if (current && `${current} ${word}`.length > max && lines.length < 2) lines.push(word);
      else lines[lines.length - 1] = current ? `${current} ${word}` : word;
    });
    return lines;
  }

  function pathBetween(source, target) {
    const startX = source.x + source.width;
    const startY = source.y + source.height / 2;
    const endX = target.x;
    const endY = target.y + target.height / 2;
    const bend = Math.max(44, (endX - startX) * .48);
    return `M${startX},${startY} C${startX + bend},${startY} ${endX - bend},${endY} ${endX},${endY}`;
  }

  function drawGraph() {
    els.edgeLayer.replaceChildren();
    els.nodeLayer.replaceChildren();

    edges.forEach((edge, index) => {
      const source = eventById(edge.from);
      const target = eventById(edge.to);
      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", pathBetween(source, target));
      path.setAttribute("class", `graph-edge${state.step >= edge.step ? " revealed" : ""}${state.step === edge.step ? " active" : ""}`);
      path.setAttribute("data-edge", String(index));
      els.edgeLayer.appendChild(path);
    });

    events.forEach(item => {
      const group = document.createElementNS(svgNS, "g");
      const status = visibleStatus(item);
      group.setAttribute("class", `graph-node status-${status}${state.step >= item.step ? " revealed" : ""}${state.selectedId === item.id ? " selected" : ""}`);
      group.setAttribute("transform", `translate(${item.x} ${item.y})`);
      group.setAttribute("data-id", item.id);
      group.setAttribute("role", "button");
      group.setAttribute("tabindex", state.step >= item.step ? "0" : "-1");
      group.setAttribute("aria-label", `${item.type}: ${item.title}. ${status}. Select to inspect.`);

      const rect = document.createElementNS(svgNS, "rect");
      rect.setAttribute("width", item.width);
      rect.setAttribute("height", item.height);
      rect.setAttribute("rx", "12");
      group.appendChild(rect);

      const accent = document.createElementNS(svgNS, "rect");
      accent.setAttribute("class", "node-accent");
      accent.setAttribute("x", "11");
      accent.setAttribute("y", "12");
      accent.setAttribute("width", "5");
      accent.setAttribute("height", "5");
      accent.setAttribute("rx", "2.5");
      accent.setAttribute("fill", nodeColors[item.type] || "#8f9db5");
      group.appendChild(accent);

      const kicker = document.createElementNS(svgNS, "text");
      kicker.setAttribute("class", "node-kicker");
      kicker.setAttribute("x", "24");
      kicker.setAttribute("y", "18");
      kicker.textContent = item.type.toUpperCase();
      group.appendChild(kicker);

      const title = document.createElementNS(svgNS, "text");
      title.setAttribute("class", "node-title");
      title.setAttribute("x", "13");
      title.setAttribute("y", "39");
      splitTitle(item.title).forEach((line, lineIndex) => {
        const span = document.createElementNS(svgNS, "tspan");
        span.setAttribute("x", "13");
        span.setAttribute("dy", lineIndex ? "15" : "0");
        span.textContent = line;
        title.appendChild(span);
      });
      group.appendChild(title);

      const meta = document.createElementNS(svgNS, "text");
      meta.setAttribute("class", "node-meta");
      meta.setAttribute("x", item.width - 12);
      meta.setAttribute("y", item.height - 10);
      meta.setAttribute("text-anchor", "end");
      meta.textContent = `${item.confidence}% · ${status}`;
      group.appendChild(meta);

      group.addEventListener("click", () => selectItem(item.id));
      group.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectItem(item.id);
        }
      });
      els.nodeLayer.appendChild(group);
    });
  }

  const granularityConfig = {
    1: { title: "System overview", description: "The active objective, participating models, current stage, and emerging direction.", hint: "SELECT A SYSTEM ELEMENT TO INSPECT" },
    2: { title: "Model level", description: "Who is working, what each model received, and what it contributed.", hint: "SELECT A MODEL OR CONTEXT CHIP TO INSPECT" },
    3: { title: "Reasoning summary", description: "Source-linked assumptions, interpretations, conflicts, uncertainties, and decisions.", hint: "SELECT A REASONING NODE TO INSPECT" },
    4: { title: "Evidence level", description: "Received, retrieved, generated, summarized, excluded, redacted, and unavailable context.", hint: "SELECT A CONTEXT RECORD TO INSPECT" },
    5: { title: "Technical telemetry", description: "Context budgets, latency, model versions, retrieval events, and instrumentation boundaries.", hint: "SELECT A TELEMETRY RECORD TO INSPECT" }
  };

  function isAvailableAtStep(item) {
    return item.step === undefined || item.step <= state.step;
  }

  function contextColor(item) {
    if (["limited", "restricted", "unavailable", "redacted", "excluded"].includes(item.category || item.type)) return "#ffca6b";
    if (item.category === "generated" || ["summarized", "inference"].includes(item.type)) return "#8c7cff";
    if (item.category === "retrieved" || item.type === "tool result") return "#79f2d0";
    return "#58c9ff";
  }

  function wireInspectable(container) {
    container.querySelectorAll("[data-inspect]").forEach(element => {
      element.addEventListener("click", () => selectItem(element.dataset.inspect));
    });
  }

  function renderSystemView() {
    const current = state.step >= 0 ? events[state.step] : events[0];
    const activeAgents = agents.filter(agent => state.step >= agent.start && state.step <= agent.finish);
    const completedAgents = agents.filter(agent => state.step > agent.finish);
    const direction = state.step >= 8 ? events[8] : state.step >= 6 ? events[6] : current;
    els.systemView.innerHTML = `
      <div class="system-orbit">
        <button class="system-card" type="button" data-inspect="n0">
          <span class="system-label">Active objective</span>
          <strong>Decide whether deployment evidence is sufficient</strong>
          <small>Scope · equity · feasibility · reversibility</small>
        </button>
        <button class="system-card" type="button" data-inspect="agent-orchestrator">
          <span class="system-label">Participating models</span>
          <strong>${agents.length} bounded model roles</strong>
          <small>${activeAgents.length} active · ${completedAgents.length} completed</small>
        </button>
        <button class="system-core" type="button" data-inspect="${current.id}">
          <span><strong>${Math.max(0, state.step + 1)} / ${events.length}</strong><span>events visible</span></span>
        </button>
        <button class="system-card" type="button" data-inspect="${current.id}">
          <span class="system-label">Current stage</span>
          <strong>${escapeHTML(current.action)}</strong>
          <small>${state.playing ? "Observable event streaming" : "Trace paused for inspection"}</small>
        </button>
        <button class="system-card" type="button" data-inspect="${direction.id}">
          <span class="system-label">Emerging direction</span>
          <strong>${escapeHTML(direction.title)}</strong>
          <small>${state.step >= 8 ? "Recommendation formed · human approval pending" : "Still provisional · evidence arriving"}</small>
        </button>
      </div>`;
    wireInspectable(els.systemView);
  }

  function agentRunState(agent) {
    if (state.step < agent.start) return { label: "Queued", className: "dormant" };
    if (state.step > agent.finish) return { label: "Complete", className: "complete" };
    if (state.playing) return { label: "Processing", className: "active" };
    return { label: "Paused", className: "active" };
  }

  function renderAgentLanes() {
    const lanes = agents.map(agent => {
      const runState = agentRunState(agent);
      const inputs = agent.contextIds.map(findItemById).filter(item => item && isAvailableAtStep(item));
      const outputs = agent.contributionIds.map(eventById).filter(item => item && isAvailableAtStep(item));
      const flow = [
        ...inputs.map(item => `<button class="lane-context-chip" type="button" data-inspect="${item.id}" style="--state-color:${contextColor(item)}"><span class="context-state"></span>${escapeHTML(item.title)}</button>`),
        ...(inputs.length && outputs.length ? ["<span class=\"lane-arrow\">→</span>"] : []),
        ...outputs.map(item => `<button class="lane-context-chip" type="button" data-inspect="${item.id}" style="--state-color:${nodeColors[item.type] || "#8f9db5"}"><span class="context-state"></span>${escapeHTML(item.title)}</button>`)
      ].join("");
      return `
        <article class="agent-lane ${runState.className}" style="--agent-color:${agent.color}">
          <button class="agent-button" type="button" data-inspect="${agent.id}">
            <span class="agent-avatar">${agent.initials}</span>
            <span class="agent-name"><strong>${agent.name}</strong><span>${agent.model} · ${runState.label}</span></span>
          </button>
          <div class="lane-flow">${flow || "<span class=\"lane-context-chip\">Awaiting authorized context</span>"}</div>
          <button class="lane-metrics" type="button" data-inspect="tel-context" aria-label="Inspect context utilization">
            <div><span>Context</span><strong>${agent.tokens}%</strong></div>
            <div class="mini-track"><span style="width:${agent.tokens}%"></span></div>
            <small>${agent.latency} ms · ${agent.contributionIds.length} contributions</small>
          </button>
        </article>`;
    }).join("");
    els.agentLanesView.innerHTML = `
      <div class="agent-lanes">${lanes}</div>
      <div class="lanes-footer"><span>Shared context is copied only when task-relevant.</span><span><strong>Restricted:</strong> private chain-of-thought · protected instructions</span></div>`;
    wireInspectable(els.agentLanesView);
  }

  function renderContextMap() {
    const categories = [
      { id: "received", label: "Received", description: "Direct inputs" },
      { id: "retrieved", label: "Retrieved", description: "Sources and records" },
      { id: "generated", label: "Generated", description: "Outputs and summaries" },
      { id: "limited", label: "Limited", description: "Excluded or protected" }
    ];
    const available = contextItems.filter(isAvailableAtStep);
    const columns = categories.map(category => {
      const items = available.filter(item => item.category === category.id);
      return `<section class="context-column">
        <h3>${category.label}<span>${items.length}</span></h3>
        <div class="context-stack">${items.length ? items.map(item => `
          <button class="context-card" type="button" data-inspect="${item.id}" style="--state-color:${contextColor(item)}">
            <span class="context-kind">${escapeHTML(item.type)}</span>
            <strong>${escapeHTML(item.title)}</strong>
            <small>${escapeHTML(item.agent)} · ${escapeHTML(item.recordKind)}</small>
          </button>`).join("") : `<div class="context-card"><span class="context-kind">Awaiting</span><strong>No visible records yet</strong><small>${category.description}</small></div>`}</div>
      </section>`;
    }).join("");
    const compacted = available.filter(item => ["summarized", "truncated", "excluded", "redacted", "restricted", "unavailable"].includes(item.type)).length;
    els.contextMapView.innerHTML = `
      <div class="context-summary"><strong>${available.length} visible context records</strong><span>·</span><span>${compacted} transformed, limited, or unavailable</span><span>·</span><span>Every record is inspectable</span></div>
      <div class="context-columns">${columns}</div>`;
    wireInspectable(els.contextMapView);
  }

  function renderTelemetry() {
    const activationCells = Array.from({ length: 56 }, (_, index) => `<i style="opacity:${.28 + (index % 5) * .06}"></i>`).join("");
    const tokenRows = agents.map(agent => `<div class="metric-row"><span>${agent.initials} · ${agent.name.split(" ")[0]}</span><span class="metric-track"><i style="width:${agent.tokens}%"></i></span><span>${agent.tokens}%</span></div>`).join("");
    const latencyRows = agents.map(agent => `<div class="metric-row"><span>${agent.initials} · ${agent.name.split(" ")[0]}</span><span class="metric-track"><i style="width:${Math.min(100, agent.latency / 18)}%"></i></span><span>${agent.latency}ms</span></div>`).join("");
    els.telemetryView.innerHTML = `
      <div class="telemetry-boundaries">
        <button class="boundary-card" type="button" data-inspect="tel-thought"><span>R</span><span><strong>Private chain-of-thought</strong><small>RESTRICTED · concise observable summaries substituted</small></span></button>
        <button class="boundary-card" type="button" data-inspect="tel-activation"><span>N/A</span><span><strong>Aggregate neural telemetry</strong><small>NOT INSTRUMENTED · no literal-thought visualization</small></span></button>
      </div>
      <div class="telemetry-grid">
        <button class="telemetry-card" type="button" data-inspect="tel-context">
          <div class="telemetry-card-header"><strong>Context allocation</strong><span>SYNTHETIC COUNTERS</span></div>${tokenRows}
        </button>
        <button class="telemetry-card" type="button" data-inspect="tel-latency">
          <div class="telemetry-card-header"><strong>Agent latency</strong><span>TIMELINE ALIGNED</span></div>${latencyRows}
        </button>
        <button class="telemetry-card" type="button" data-inspect="ctx-compacted">
          <div class="telemetry-card-header"><strong>Context-window events</strong><span>${state.step >= 5 ? "1 COMPACTION" : "PENDING"}</span></div>
          <div class="metric-row"><span>Raw rows</span><span class="metric-track"><i style="width:${state.step >= 1 ? 92 : 0}%"></i></span><span>286k est.</span></div>
          <div class="metric-row"><span>Active</span><span class="metric-track"><i style="width:${state.step >= 5 ? 18 : 4}%"></i></span><span>${state.step >= 5 ? "1.4k" : "0.3k"}</span></div>
          <div class="metric-row"><span>Retrieved</span><span class="metric-track"><i style="width:${Math.min(100, Math.max(0, state.step) * 11)}%"></i></span><span>${Math.max(0, state.step - 1)}</span></div>
        </button>
        <button class="telemetry-card" type="button" data-inspect="tel-activation">
          <div class="telemetry-card-header"><strong>Activation interface</strong><span class="not-instrumented">NOT INSTRUMENTED</span></div>
          <div class="activation-grid" aria-hidden="true">${activationCells}</div>
          <span class="not-instrumented">No tensor data supplied · visualization intentionally disabled</span>
        </button>
      </div>`;
    wireInspectable(els.telemetryView);
  }

  function renderSynthesis() {
    const synthesisSteps = { "syn-agree": 5, "syn-disagree": 6, "syn-duplicate": 2, "syn-dependency": 8 };
    const statusCards = synthesisItems.map(item => {
      const ready = state.step >= synthesisSteps[item.id];
      return `<button class="synthesis-card ${ready ? "" : "dormant"}" type="button" data-inspect="${item.id}" ${ready ? "" : "disabled"}>
        <span>${escapeHTML(item.type)}</span><strong>${ready ? escapeHTML(item.title) : "Awaiting trace evidence"}</strong><small>${ready ? escapeHTML(item.summary) : `Available after event ${synthesisSteps[item.id] + 1}`}</small>
      </button>`;
    }).join("");
    const rows = agents.map(agent => {
      const runState = agentRunState(agent);
      const efficiency = agent.id === "agent-equity" ? "Qualified" : agent.id === "agent-orchestrator" ? "Delegated" : "Supports";
      const equity = agent.id === "agent-equity" ? "Challenges" : agent.id === "agent-synthesis" ? "Constrains" : "Observed";
      const scope = agent.id === "agent-evidence" ? "Pilot" : agent.id === "agent-equity" ? "Not citywide" : agent.id === "agent-synthesis" ? "Bounded pilot" : "Undecided";
      return `<tr><td><button class="matrix-agent-button" type="button" data-inspect="${agent.id}">${agent.name}</button></td><td><span class="signal" style="--signal:${agent.color}"><i></i>${efficiency}</span></td><td>${equity}</td><td>${scope}</td><td>${runState.label}</td></tr>`;
    }).join("");
    const flow = [
      ["n2", "Verified gain"], ["n6", "Equity conflict"], ["n7", "Open gaps"], ["n8", "Bounded decision"]
    ].map(([id, label], index) => {
      const item = eventById(id);
      const button = `<button type="button" data-inspect="${id}" ${item.step <= state.step ? "" : "disabled"}>${item.step <= state.step ? label : "Awaiting"}</button>`;
      return index ? `<span>→</span>${button}` : button;
    }).join("");
    els.synthesisView.innerHTML = `
      <div class="synthesis-status-grid">${statusCards}</div>
      <div class="synthesis-matrix-wrap"><table class="synthesis-matrix"><thead><tr><th>Model lane</th><th>Efficiency</th><th>Equity</th><th>Preferred scope</th><th>State</th></tr></thead><tbody>${rows}</tbody></table></div>
      <div class="synthesis-flow">${flow}</div>`;
    wireInspectable(els.synthesisView);
  }

  function applyZoom() {
    els.canvasTransform.style.transform = `scale(${state.zoom})`;
    els.zoomValue.textContent = `${Math.round(state.zoom * 100)}%`;
    els.zoomOut.disabled = state.zoom <= .7;
    els.zoomIn.disabled = state.zoom >= 1.4;
  }

  function renderMicroscope() {
    const config = granularityConfig[state.granularity];
    els.granularityTitle.textContent = state.canvasMode === "synthesis" ? "Cross-model synthesis" : config.title;
    els.granularityDescription.textContent = state.canvasMode === "synthesis"
      ? "Agreement, disagreement, duplication, dependencies, and their effect on the answer."
      : config.description;
    els.granularityRange.value = String(state.granularity);
    els.granularityRange.style.setProperty("--granularity-progress", `${(state.granularity - 1) * 25}%`);
    els.microscopeMode.classList.toggle("active", state.canvasMode === "microscope");
    els.synthesisMode.classList.toggle("active", state.canvasMode === "synthesis");
    els.microscopeMode.setAttribute("aria-pressed", String(state.canvasMode === "microscope"));
    els.synthesisMode.setAttribute("aria-pressed", String(state.canvasMode === "synthesis"));

    [els.systemView, els.agentLanesView, els.evidenceGraph, els.contextMapView, els.telemetryView, els.synthesisView]
      .forEach(view => view.hidden = true);

    if (state.canvasMode === "synthesis") {
      els.synthesisView.hidden = false;
      els.graphTitle.textContent = "Cross-model synthesis";
      els.graphStage.dataset.hint = "SELECT A SYNTHESIS SIGNAL TO INSPECT";
      renderSynthesis();
    } else {
      const viewMap = { 1: els.systemView, 2: els.agentLanesView, 3: els.evidenceGraph, 4: els.contextMapView, 5: els.telemetryView };
      viewMap[state.granularity].hidden = false;
      els.graphTitle.textContent = config.title;
      els.graphStage.dataset.hint = config.hint;
      if (state.granularity === 1) renderSystemView();
      if (state.granularity === 2) renderAgentLanes();
      if (state.granularity === 4) renderContextMap();
      if (state.granularity === 5) renderTelemetry();
    }
    applyZoom();
  }

  function renderNarration() {
    if (state.step < 0) {
      els.narrationList.innerHTML = `<div class="empty-state"><span class="empty-orbit" aria-hidden="true"></span><p>Run the demonstration to watch observable evidence become an inspectable answer.</p></div>`;
      return;
    }
    const visible = events.filter(item => item.step <= state.step);
    els.narrationList.innerHTML = visible.map((item, index) => `
      <button class="narration-card ${state.selectedId === item.id ? "active" : ""}" type="button" data-id="${item.id}" style="animation-delay:${index * 20}ms">
        <span class="event-index">${String(item.step + 1).padStart(2, "0")}</span>
        <span class="narration-copy">
          <strong>${escapeHTML(item.summary)}</strong>
          <span>${escapeHTML(item.detail)} · ${escapeHTML(item.agent)}</span>
        </span>
        <span class="event-type">${escapeHTML(item.type)}</span>
      </button>
    `).join("");
    els.narrationList.querySelectorAll("[data-id]").forEach(button => {
      button.addEventListener("click", () => selectItem(button.dataset.id));
    });
    const active = els.narrationList.querySelector(".narration-card.active");
    if (active && state.playing) active.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function renderTimeline() {
    const safeStep = Math.max(0, state.step);
    const progress = safeStep / (events.length - 1) * 100;
    els.timelineRange.value = String(safeStep);
    els.timelineRange.style.setProperty("--progress", `${progress}%`);
    const current = state.step >= 0 ? events[state.step] : null;
    els.timelineClock.textContent = formatTime(current ? current.offset : 0);
    els.currentAction.textContent = current ? current.action : "No active event";
    els.stepBack.disabled = state.step <= 0;
    els.stepForward.disabled = state.step >= events.length - 1;
  }

  function renderPlaybackState() {
    const playIcon = els.playPause.querySelector(".play-icon");
    const pauseIcon = els.playPause.querySelector(".pause-icon");
    playIcon.hidden = state.playing;
    pauseIcon.hidden = !state.playing;
    els.playPause.setAttribute("aria-label", state.playing ? "Pause trace" : "Play trace");

    els.streamBadge.className = "stream-badge";
    if (state.playing) {
      els.streamBadge.classList.add("live");
      els.streamBadge.innerHTML = "<span></span> STREAMING";
      els.narrationTitle.textContent = "Observable events arriving";
      els.sessionState.textContent = "Processing observable event";
    } else if (state.step === events.length - 1) {
      els.streamBadge.classList.add("complete");
      els.streamBadge.innerHTML = "<span></span> COMPLETE";
      els.narrationTitle.textContent = "Trace complete";
      els.sessionState.textContent = "Trace complete · awaiting review";
    } else if (state.step >= 0) {
      els.streamBadge.classList.add("idle");
      els.streamBadge.innerHTML = "<span></span> PAUSED";
      els.narrationTitle.textContent = "Observable trace paused";
      els.sessionState.textContent = "Trace paused";
    } else {
      els.streamBadge.classList.add("idle");
      els.streamBadge.innerHTML = "<span></span> IDLE";
      els.narrationTitle.textContent = "Waiting for a trace";
      els.sessionState.textContent = "Ready to observe";
    }
    els.integrityChip.classList.toggle("verified", state.step >= events.length - 1);
    els.integrityChip.innerHTML = state.step >= events.length - 1
      ? "<span></span> Demo integrity checks passed"
      : "<span></span> Integrity checks pending";
  }

  function renderInspector() {
    const item = activeItem();
    const buttons = document.querySelectorAll("[data-review]");
    buttons.forEach(button => button.disabled = !item);
    if (!item) {
      els.inspectorTitle.textContent = "Select an item";
      els.selectedStatus.className = "status-pill unknown";
      els.selectedStatus.textContent = "UNKNOWN";
      els.inspectorEmpty.hidden = false;
      els.inspectorContent.hidden = true;
      els.historyList.innerHTML = "";
      els.reviewLog.innerHTML = "<p>No human review recorded for this item.</p>";
      els.reviewCount.textContent = "0";
      return;
    }

    const status = visibleStatus(item);
    const reviews = state.reviews[item.id] || [];
    els.inspectorTitle.textContent = item.title;
    els.selectedStatus.className = `status-pill ${status}`;
    els.selectedStatus.textContent = status.toUpperCase();
    els.inspectorEmpty.hidden = true;
    els.inspectorContent.hidden = false;
    els.itemType.textContent = item.type.toUpperCase();
    els.itemTime.textContent = item.offset !== undefined
      ? `T+${item.offset.toFixed(1)}s · ${item.id.toUpperCase()}`
      : item.step !== undefined ? `EVENT ${item.step + 1} · ${item.id.toUpperCase()}` : `SYSTEM RECORD · ${item.id.toUpperCase()}`;
    els.itemSummary.textContent = item.summary;
    els.itemAgent.textContent = item.agent || "Unknown";
    els.itemRecordKind.textContent = item.recordKind || "Human-readable interpretation";
    els.confidenceValue.textContent = `${item.confidence}%`;
    requestAnimationFrame(() => els.confidenceBar.style.width = `${item.confidence}%`);
    els.confidenceBasis.textContent = item.basis;
    els.itemContext.textContent = item.context || "Not recorded";
    els.itemSource.textContent = state.demoState === "unavailable" && item.id === "n4" ? "Unavailable — no source was supplied" : item.source;
    els.itemVerification.textContent = item.verification;
    els.itemTransform.textContent = item.transform;
    els.itemRelationship.textContent = item.relationship || "No linked relationship recorded";
    els.itemUnavailable.textContent = item.unavailable || "None recorded";
    els.itemExcerpt.textContent = state.demoState === "redacted" && item.id === "n3"
      ? "[REDACTED — potentially identifying location information] recall_low_light=.65"
      : item.excerpt;

    const fullHistory = [...item.history];
    reviews.forEach(review => fullHistory.push(`Human review: ${review.action}${review.note ? ` — ${review.note}` : ""}`));
    els.historyList.innerHTML = fullHistory.map((entry, index) => `
      <li>${escapeHTML(entry)}<time>T+${Math.max(0, (item.offset || 13.1) - (fullHistory.length - index - 1) * .4).toFixed(1)}s</time></li>
    `).join("");
    els.reviewCount.textContent = String(reviews.length);
    els.reviewLog.innerHTML = reviews.length ? reviews.slice().reverse().map(review => `
      <article class="review-entry">
        <strong>${escapeHTML(review.action)}</strong>
        <p>${escapeHTML(review.note || "Approved without an additional note.")}</p>
        ${review.correction ? `<p><strong>Correction:</strong> ${escapeHTML(review.correction)}</p>` : ""}
        <time>${escapeHTML(review.timestamp)}</time>
      </article>
    `).join("") : "<p>No human review recorded for this item.</p>";
  }

  function renderAll() {
    drawGraph();
    renderMicroscope();
    renderNarration();
    renderTimeline();
    renderPlaybackState();
    renderInspector();
  }

  function selectItem(id) {
    const item = findItemById(id);
    if (!item || (item.step !== undefined && item.step > state.step)) return;
    state.selectedId = id;
    renderAll();
  }

  function setStep(nextStep, autoSelect = false) {
    state.step = Math.min(events.length - 1, Math.max(0, Number(nextStep)));
    if (autoSelect || !state.selectedId || (activeItem()?.step ?? 0) > state.step) state.selectedId = events[state.step].id;
    renderAll();
    if (state.step === events.length - 1 && state.playing) stopPlayback(true);
  }

  function stopPlayback(completed = false) {
    clearInterval(state.timer);
    state.timer = null;
    state.playing = false;
    renderPlaybackState();
    if (completed) toast("Trace complete. The recommendation is ready for human review.");
  }

  function startPlayback() {
    if (state.demoState === "error") return;
    if (state.step >= events.length - 1) state.step = 0;
    if (state.step < 0) state.step = 0;
    clearInterval(state.timer);
    state.playing = true;
    state.selectedId = events[state.step].id;
    renderAll();
    state.timer = window.setInterval(() => {
      if (state.step < events.length - 1) setStep(state.step + 1, true);
      else stopPlayback(true);
    }, 1250);
  }

  function runTrace() {
    clearInterval(state.timer);
    state.playing = false;
    state.hasStarted = true;
    state.demoState = "loading";
    els.stateSelector.value = "loading";
    state.step = -1;
    state.selectedId = null;

    const question = els.questionInput.value.trim() || "No question supplied";
    events[0].summary = `The system must evaluate: ${question}`;
    events[0].excerpt = question;
    contextItems[0].summary = `The exact request “${question}” was received by the Orchestrator.`;
    contextItems[0].excerpt = question;
    const source = els.sourceInput.value.trim();
    if (source) {
      events[1].source = `User-provided URL (not fetched by this offline demo): ${source}`;
      events[1].verification = "Not verified in this offline demonstration";
      events[1].status = "unverified";
      events[1].confidence = 48;
      events[1].basis = "The URL was captured, but the static demonstration cannot fetch or authenticate it.";
    } else {
      events[1].source = "Synthetic dataset · public_works_requests.csv · 17,842 rows";
      events[1].verification = "Demo digest matched: sha256:7b4c…a91e";
      events[1].status = "verified";
      events[1].confidence = 98;
      events[1].basis = "High confidence because the tool returned a complete synthetic result and passed the demo integrity check.";
    }
    applyDemoState("loading");
    renderAll();
    window.setTimeout(() => {
      state.demoState = "live";
      els.stateSelector.value = "live";
      applyDemoState("live");
      setStep(0, true);
      startPlayback();
    }, 850);
  }

  function togglePlayback() {
    if (!state.hasStarted || state.step < 0) runTrace();
    else if (state.playing) stopPlayback();
    else startPlayback();
  }

  function applyDemoState(value) {
    state.demoState = value;
    els.graphLoading.hidden = value !== "loading";
    els.graphError.hidden = value !== "error";

    if (value === "error") {
      stopPlayback();
      els.sessionState.textContent = "Tool error · no retry attempted";
      toast("Tool error shown. No evidence was fabricated and no automatic retry occurred.");
    } else if (value === "unavailable") {
      if (state.step < 4) setStep(4, false);
      selectItem("n4");
      toast("Unavailable-evidence state: the missing source remains explicit.");
    } else if (value === "conflict") {
      if (state.step < 6) setStep(6, false);
      selectItem("n6");
      toast("Conflicting-evidence state: both signals remain visible.");
    } else if (value === "redacted") {
      if (state.step < 3) setStep(3, false);
      selectItem("n3");
      toast("Privacy state: sensitive source detail is redacted but the transformation is retained.");
    } else if (value === "loading") {
      stopPlayback();
      els.sessionState.textContent = "Initializing observable trace";
    } else {
      renderAll();
    }
    renderInspector();
  }

  function switchTab(tabName) {
    const tabs = ["evidence", "history", "review"];
    tabs.forEach(name => {
      const tab = els[`${name}Tab`];
      const pane = els[`${name}Pane`];
      const selected = name === tabName;
      tab.setAttribute("aria-selected", String(selected));
      pane.hidden = !selected;
    });
  }

  function openReview(action) {
    const item = activeItem();
    if (!item) return;
    state.pendingReview = action;
    els.reviewModalTitle.textContent = `${action[0].toUpperCase()}${action.slice(1)} this ${item.type}`;
    els.reviewPrompt.textContent = `“${item.summary}”`;
    els.reviewNote.value = "";
    els.correctionInput.value = "";
    els.correctionField.hidden = action !== "corrected";
    els.reviewModal.hidden = false;
    window.setTimeout(() => els.reviewNote.focus(), 0);
  }

  function closeReview() {
    els.reviewModal.hidden = true;
    state.pendingReview = null;
  }

  function saveReview() {
    const item = activeItem();
    const action = state.pendingReview;
    if (!item || !action) return;
    const note = els.reviewNote.value.trim();
    const correction = els.correctionInput.value.trim();
    if (action !== "approved" && !note) {
      toast("Add a short note so the review decision is auditable.");
      els.reviewNote.focus();
      return;
    }
    if (action === "corrected" && !correction) {
      toast("Enter the corrected wording before recording this review.");
      els.correctionInput.focus();
      return;
    }
    state.reviews[item.id] ||= [];
    state.reviews[item.id].push({ action, note, correction, timestamp: new Date().toISOString() });
    closeReview();
    switchTab("review");
    renderAll();
    toast(`Human review recorded: ${action}.`);
  }

  function renderAttachments() {
    els.attachmentList.innerHTML = state.attachments.map((file, index) => `
      <span class="attachment-chip"><span title="${escapeHTML(file.name)}">${escapeHTML(file.name)} · ${Math.max(1, Math.round(file.size / 1024))} KB</span><button type="button" data-remove-file="${index}" aria-label="Remove ${escapeHTML(file.name)}">×</button></span>
    `).join("");
    els.attachmentList.querySelectorAll("[data-remove-file]").forEach(button => {
      button.addEventListener("click", () => {
        state.attachments.splice(Number(button.dataset.removeFile), 1);
        renderAttachments();
      });
    });
  }

  function copyEvidenceRecord() {
    const item = activeItem();
    if (!item) return;
    const record = JSON.stringify({
      id: item.id,
      type: item.type,
      status: visibleStatus(item),
      confidence: item.confidence,
      summary: item.summary,
      producedBy: item.agent,
      recordKind: item.recordKind,
      contextUsed: item.context,
      source: item.source,
      verification: item.verification,
      transformation: item.transform,
      relationships: item.relationship,
      unavailableOrRestricted: item.unavailable,
      excerpt: item.excerpt,
      reviews: state.reviews[item.id] || []
    }, null, 2);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(record).then(() => toast("Evidence record copied."), () => fallbackCopy(record));
    } else fallbackCopy(record);
  }

  function fallbackCopy(text) {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    toast("Evidence record copied.");
  }

  function exportAudit() {
    const audit = {
      schema: "glassbox.context-microscope.v2",
      traceId: "GBX-042",
      generatedAt: new Date().toISOString(),
      disclosure: "Synthetic demonstration. This record contains observable events and concise reasoning summaries, not private chain-of-thought.",
      input: {
        question: els.questionInput.value.trim(),
        sourceUrl: els.sourceInput.value.trim() || null,
        attachments: state.attachments
      },
      playback: { currentStep: state.step, complete: state.step === events.length - 1 },
      microscope: { granularity: state.granularity, granularityName: granularityConfig[state.granularity].title, canvasMode: state.canvasMode, zoom: state.zoom },
      modelLanes: agents.map(agent => ({ id: agent.id, name: agent.name, model: agent.model, role: agent.role, contextUtilizationPercent: agent.tokens, latencyMs: agent.latency, contextIds: agent.contextIds, contributionIds: agent.contributionIds })),
      visibleContext: contextItems.filter(isAvailableAtStep).map(item => ({ id: item.id, category: item.category, type: item.type, status: visibleStatus(item), title: item.title, producedBy: item.agent, recordKind: item.recordKind, source: item.source, transformation: item.transform, unavailableOrRestricted: item.unavailable })),
      items: events.filter(item => item.step <= state.step).map(item => ({
        id: item.id, step: item.step, timestampOffsetSeconds: item.offset, type: item.type,
        status: visibleStatus(item), confidence: item.confidence, summary: item.summary,
        producedBy: item.agent, recordKind: item.recordKind, contextUsed: item.context,
        source: item.source, verification: item.verification, transformation: item.transform,
        relationships: item.relationship, unavailableOrRestricted: item.unavailable,
        supportingExcerpt: item.excerpt, history: item.history, humanReviews: state.reviews[item.id] || []
      })),
      edges: edges.filter(edge => edge.step <= state.step),
      synthesis: synthesisItems,
      instrumentationBoundaries: telemetryItems.filter(item => ["restricted", "not instrumented"].includes(item.type)),
      humanReviewLedger: state.reviews,
      unresolved: state.step >= 7 ? ["Seasonal sample", "Peak queue forecast", "Reviewer coverage model"] : [],
      comparison: state.compare ? { alternateTrace: alternate } : null
    };
    const blob = new Blob([JSON.stringify(audit, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `glassbox-audit-GBX-042-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    toast("Verifiable audit record exported as JSON.");
  }

  function toast(message) {
    const item = document.createElement("div");
    item.className = "toast";
    item.textContent = message;
    els.toastRegion.appendChild(item);
    window.setTimeout(() => item.remove(), 3400);
  }

  function wireEvents() {
    els.runButton.addEventListener("click", runTrace);
    els.retryButton.addEventListener("click", runTrace);
    els.playPause.addEventListener("click", togglePlayback);
    els.stepBack.addEventListener("click", () => { stopPlayback(); setStep(state.step - 1, true); });
    els.stepForward.addEventListener("click", () => { stopPlayback(); setStep(state.step + 1, true); });
    els.timelineRange.addEventListener("input", event => { stopPlayback(); setStep(event.target.value, true); });
    els.attachButton.addEventListener("click", () => els.fileInput.click());
    els.fileInput.addEventListener("change", event => {
      const files = Array.from(event.target.files || []);
      files.forEach(file => state.attachments.push({ name: file.name, size: file.size, type: file.type || "unknown" }));
      renderAttachments();
      if (files.length) toast(`${files.length} attachment${files.length === 1 ? "" : "s"} staged for the trace.`);
      event.target.value = "";
    });
    els.compareButton.addEventListener("click", () => {
      state.compare = !state.compare;
      els.compareButton.setAttribute("aria-pressed", String(state.compare));
      els.compareButton.classList.toggle("active", state.compare);
      els.comparisonStrip.hidden = !state.compare;
      if (state.compare && state.step < events.length - 1) setStep(events.length - 1, false);
      toast(state.compare ? "Comparison mode shows how a different value weighting changes the recommendation." : "Comparison mode closed.");
    });
    els.comparisonStrip.querySelectorAll("[data-select]").forEach(button => button.addEventListener("click", () => selectItem(button.dataset.select)));
    els.alertRail.querySelectorAll("[data-select]").forEach(button => button.addEventListener("click", () => {
      const item = eventById(button.dataset.select);
      if (item.step > state.step) setStep(item.step, false);
      selectItem(item.id);
    }));
    els.exportButton.addEventListener("click", exportAudit);
    els.copyEvidence.addEventListener("click", copyEvidenceRecord);
    els.granularityRange.addEventListener("input", event => {
      state.granularity = Number(event.target.value);
      state.canvasMode = "microscope";
      state.zoom = 1;
      renderAll();
    });
    els.microscopeMode.addEventListener("click", () => {
      state.canvasMode = "microscope";
      state.zoom = 1;
      renderAll();
    });
    els.synthesisMode.addEventListener("click", () => {
      state.canvasMode = "synthesis";
      state.zoom = 1;
      renderAll();
    });
    els.zoomOut.addEventListener("click", () => {
      state.zoom = Math.max(.7, Math.round((state.zoom - .1) * 10) / 10);
      applyZoom();
    });
    els.zoomIn.addEventListener("click", () => {
      state.zoom = Math.min(1.4, Math.round((state.zoom + .1) * 10) / 10);
      applyZoom();
    });
    els.fitGraph.addEventListener("click", () => {
      state.zoom = 1;
      applyZoom();
      els.canvasTransform.animate([{ opacity: .72 }, { opacity: 1 }], { duration: 220, easing: "ease-out" });
      toast("Canvas view reset.");
    });
    els.graphStage.addEventListener("wheel", event => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      state.zoom = Math.min(1.4, Math.max(.7, state.zoom + (event.deltaY < 0 ? .1 : -.1)));
      state.zoom = Math.round(state.zoom * 10) / 10;
      applyZoom();
    }, { passive: false });
    els.dismissBanner.addEventListener("click", () => els.dismissBanner.closest(".truth-banner").remove());
    els.stateSelector.addEventListener("change", event => applyDemoState(event.target.value));

    ["evidence", "history", "review"].forEach(name => els[`${name}Tab`].addEventListener("click", () => switchTab(name)));
    document.querySelectorAll("[data-review]").forEach(button => button.addEventListener("click", () => openReview(button.dataset.review)));
    els.closeModal.addEventListener("click", closeReview);
    els.cancelReview.addEventListener("click", closeReview);
    els.saveReview.addEventListener("click", saveReview);
    els.reviewModal.addEventListener("click", event => { if (event.target === els.reviewModal) closeReview(); });

    document.addEventListener("keydown", event => {
      const tag = document.activeElement?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if (event.key === "Escape" && !els.reviewModal.hidden) closeReview();
      if (!typing && event.key === " ") { event.preventDefault(); togglePlayback(); }
      if (!typing && event.key === "ArrowLeft" && state.step > 0) { stopPlayback(); setStep(state.step - 1, true); }
      if (!typing && event.key === "ArrowRight" && state.step < events.length - 1) { stopPlayback(); setStep(state.step + 1, true); }
    });
  }

  function initialize() {
    els.timelineTicks.innerHTML = events.map(() => "<span></span>").join("");
    els.timelineRange.max = String(events.length - 1);
    wireEvents();
    renderAttachments();
    renderAll();
    window.setTimeout(runTrace, 650);
  }

  initialize();
})();
