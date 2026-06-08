/* AI Grading Dilemmas — UI components & screens */
const { useState, useEffect, useRef } = React;

/* ---------- Red button motif ---------- */
function RedButton({ label = "Press", size = 132, onPress }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      className={"redbutton" + (pressed ? " pressed" : "")}
      style={{ "--size": size + "px" }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={onPress}
      aria-label={label}
    >
      <span className="rb-label">{label}</span>
    </button>
  );
}

/* ---------- Progress dots ---------- */
function Progress({ total, index }) {
  return (
    <div className="progress" aria-label={`Dilemma ${index + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={"dot" + (i < index ? " done" : i === index ? " active" : "")}
        />
      ))}
    </div>
  );
}

/* ---------- AI disclosure + attribution footer ---------- */
function SiteFooter() {
  return (
    <footer className="sitefoot no-print-foot">
      <div className="inner">
        <div className="ai-disclosure">
          <span className="badge">AI<br />Disclosure</span>
          <span className="dtext">
            This interactive experience was designed and built with the assistance of
            generative AI (Claude). The dilemmas are adapted from a human-authored essay.
            The words you write in reflection are entirely your own and are stored only
            in your browser — never transmitted, never graded by a machine.
          </span>
        </div>
        <div className="attribution">
          Scenarios adapted from <span className="name">“What We Give Up When We Let AI Decide”</span> by{" "}
          <span className="name">Marc Watkins</span>, Rhetorica (January 2026).{" "}
          <a href="https://marcwatkins.substack.com/p/what-we-give-up-when-we-let-ai-decide" target="_blank" rel="noopener noreferrer">
            Read the original essay
          </a>
          . Created for reflection at the University of Mississippi. Not affiliated with or endorsed by the University.
        </div>
      </div>
    </footer>
  );
}

/* ---------- Landing ---------- */
function Landing({ onBegin }) {
  return (
    <div className="landing">
      <div className="column">
        <div className="brandbar">
          <span className="crest">University of Mississippi</span>
          <span className="divider" />
          <span className="crest" style={{ color: "var(--accent-ink)" }}>Rhetorica</span>
        </div>

        <div className="eyebrow muted">An interactive reflection on assessment &amp; judgment</div>
        <h1>
          When AI Grading<br />Arrives, <span className="accentword">What Do<br />We Give Up?</span>
        </h1>
        <p className="dek">
          A red button sits on every educator’s desk. Press it, and the thinking is done
          for you. Six dilemmas ask you to decide — not what is right in the abstract,
          but what you would actually do, and what it would cost.
        </p>

        <div className="motifwrap">
          <RedButton label="Begin" size={146} onPress={onBegin} />
        </div>
        <div className="presscue">Choose your path to begin</div>

        <div className="cta-row" style={{ marginTop: 26 }}>
          <button className="btn red" onClick={onBegin}>Enter the dilemmas</button>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

/* ---------- Path select ---------- */
function PathSelect({ onPick, onBack }) {
  return (
    <div className="stage">
      <div className="scenario" style={{ width: "100%" }}>
        <div className="column" style={{ paddingTop: 70 }}>
          <div className="eyebrow">Step 01 — Choose your vantage point</div>
          <h1 style={{
            fontFamily: "Newsreader, Georgia, serif", fontWeight: 500,
            fontSize: "clamp(32px,5vw,52px)", lineHeight: 1.04, margin: "14px 0 0",
            letterSpacing: "-0.015em"
          }}>
            Whose desk are you sitting at?
          </h1>
          <p style={{
            fontFamily: "Newsreader, Georgia, serif", fontSize: 20, lineHeight: 1.55,
            color: "var(--ink-soft)", marginTop: 16, maxWidth: 580
          }}>
            The same six situations look different depending on where you stand. Pick the
            seat you want to think from. You can switch later.
          </p>

          <div className="pathgrid">
            <button className="pathcard" onClick={() => onPick("faculty")}>
              <div className="eyebrow">For those who teach</div>
              <div className="role">Faculty</div>
              <div className="roledesc">
                You hold the rubric, the time, and the judgment. Decide what you are willing
                to automate — and what you refuse to hand over.
              </div>
              <div className="enter">Enter as faculty <span className="arrow">→</span></div>
            </button>

            <button className="pathcard" onClick={() => onPick("student")}>
              <div className="eyebrow">For those who learn</div>
              <div className="role">Student</div>
              <div className="roledesc">
                You are the one being assessed. Decide what you expect from the people
                grading you — and what you would do when no one is reading.
              </div>
              <div className="enter">Enter as student <span className="arrow">→</span></div>
            </button>
          </div>

          <div style={{ marginTop: 30 }}>
            <button className="linklike" onClick={onBack}>← Back to start</button>
          </div>
        </div>
        <div className="column" style={{ marginTop: 20 }}>
          <SiteFooter />
        </div>
      </div>
    </div>
  );
}

/* ---------- Scenario screen ---------- */
function ScenarioScreen({ scenario, role, index, total, response, onStance, onReflect, onNext, onPrev, roleLabel }) {
  const f = scenario[role];
  const revealRef = useRef(null);
  const chosen = response && response.stance;

  useEffect(() => {
    if (chosen && revealRef.current) {
      // gentle nudge into view without jarring jump
      const y = revealRef.current.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    // eslint-disable-next-line
  }, [chosen]);

  const num = String(scenario.num).padStart(2, "0");
  const totalStr = String(total).padStart(2, "0");

  return (
    <div className="scenario">
      <div className="column">
        <div className="scn-head">
          <div className="scn-theme">
            <span className="scn-num">Dilemma {num}</span> / {totalStr} &nbsp;·&nbsp; {scenario.theme}
          </div>
          <h2 className="scn-title">{scenario.title}</h2>
        </div>

        <div className="scn-body">
          {f.situation.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <div className="deskline">
          <span className="rb-mini" />
          <span className="txt">{f.button}</span>
        </div>

        <div className="stance-block">
          <p className="stance-prompt">{f.stancePrompt}</p>
          <div className="stance-list">
            {f.stances.map((s) => {
              const sel = chosen === s.id;
              const dim = chosen && !sel;
              return (
                <button
                  key={s.id}
                  className={"stance" + (sel ? " sel" : "") + (dim ? " dim" : "")}
                  onClick={() => onStance(s.id)}
                >
                  <span className="pip" />
                  <span>
                    <span className="stance-label">{s.label}</span>
                    <span className="stance-blurb">{s.blurb}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {chosen && (
          <div className="reveal" ref={revealRef}>
            <div className="counter">
              <div className="clabel">{f.counter.label}</div>
              <p className="ctext">{f.counter.text}</p>
            </div>

            <div className="reflect-block">
              {f.reflect.map((q, qi) => (
                <div key={qi}>
                  <div className="reflect-q">
                    <span className="qn">{qi + 1}</span>
                    <span>{q}</span>
                  </div>
                  <textarea
                    className="reflect-input"
                    placeholder="Write as much or as little as you like — this stays on your device."
                    value={(response.reflections && response.reflections[qi]) || ""}
                    onChange={(e) => onReflect(qi, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="nav-row">
          <button className="linklike" onClick={onPrev}>
            {index === 0 ? "← Change path" : "← Previous"}
          </button>
          <button className="btn red" onClick={onNext} disabled={!chosen}>
            {index === total - 1 ? "See your reflections →" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { RedButton, Progress, SiteFooter, Landing, PathSelect, ScenarioScreen });
