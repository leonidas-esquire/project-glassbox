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
    history: ["Alternate objective loaded", "Evidence weights changed", "Equity threshold overridden", "Immediate rollout ranked first"]
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
    "closeModal", "cancelReview", "saveReview", "toastRegion"
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
    hasStarted: false
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
    if (state.selectedId === alternate.id) return alternate;
    return events.find(item => item.id === state.selectedId) || null;
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
          <span>${escapeHTML(item.detail)}</span>
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
    els.itemTime.textContent = item.offset === undefined ? "Alternate trace" : `T+${item.offset.toFixed(1)}s · ${item.id.toUpperCase()}`;
    els.itemSummary.textContent = item.summary;
    els.confidenceValue.textContent = `${item.confidence}%`;
    requestAnimationFrame(() => els.confidenceBar.style.width = `${item.confidence}%`);
    els.confidenceBasis.textContent = item.basis;
    els.itemSource.textContent = state.demoState === "unavailable" && item.id === "n4" ? "Unavailable — no source was supplied" : item.source;
    els.itemVerification.textContent = item.verification;
    els.itemTransform.textContent = item.transform;
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
    renderNarration();
    renderTimeline();
    renderPlaybackState();
    renderInspector();
  }

  function selectItem(id) {
    const item = id === alternate.id ? alternate : eventById(id);
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
      source: item.source,
      verification: item.verification,
      transformation: item.transform,
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
      schema: "glassbox.observable-trace.v1",
      traceId: "GBX-042",
      generatedAt: new Date().toISOString(),
      disclosure: "Synthetic demonstration. This record contains observable events and concise reasoning summaries, not private chain-of-thought.",
      input: {
        question: els.questionInput.value.trim(),
        sourceUrl: els.sourceInput.value.trim() || null,
        attachments: state.attachments
      },
      playback: { currentStep: state.step, complete: state.step === events.length - 1 },
      items: events.filter(item => item.step <= state.step).map(item => ({
        id: item.id, step: item.step, timestampOffsetSeconds: item.offset, type: item.type,
        status: visibleStatus(item), confidence: item.confidence, summary: item.summary,
        source: item.source, verification: item.verification, transformation: item.transform,
        supportingExcerpt: item.excerpt, history: item.history, humanReviews: state.reviews[item.id] || []
      })),
      edges: edges.filter(edge => edge.step <= state.step),
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
    els.fitGraph.addEventListener("click", () => {
      els.evidenceGraph.style.transform = "scale(.97)";
      window.setTimeout(() => els.evidenceGraph.style.transform = "scale(1)", 180);
      toast("Graph view reset.");
    });
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
