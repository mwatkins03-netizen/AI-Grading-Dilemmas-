/* AI Grading Dilemmas — Summary screen + App state machine */
const { useState: useStateA, useEffect: useEffectA } = React;

const ROLE_LABEL = { faculty: "Faculty", student: "Student" };

/* ---------- Summary ---------- */
function Summary({ role, scenarios, responses, onRestart, onChangePath, onReview }) {
  const closing = window.GRADING.closing;
  const answered = scenarios.filter((s) => responses[s.id] && responses[s.id].stance).length;
  const dateStr = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  function stanceFor(sc) {
    const r = responses[sc.id];
    if (!r || !r.stance) return null;
    return sc[role].stances.find((x) => x.id === r.stance) || null;
  }

  return (
    <div className="summary">
      <div className="column">
        {/* print-only header */}
        <div className="printonly" style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#CE1126" }}>
            University of Mississippi · Rhetorica
          </div>
          <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#555", marginTop: 4 }}>
            {ROLE_LABEL[role]} path · Reflection completed {dateStr}
          </div>
        </div>

        <div className="summary-head">
          <div className="eyebrow">Your reflection · {ROLE_LABEL[role]} path · {answered} of {scenarios.length} considered</div>
          <h2>Where you stood, and what it costs</h2>
          <p className="sub">
            There are no scores here — that is the point. Below is the record of what you
            chose and what you were willing to say about it. Keep it, print it, or bring it
            to a conversation with someone who sits at a different desk.
          </p>
        </div>

        <div className="recap">
          {scenarios.map((sc) => {
            const st = stanceFor(sc);
            const r = responses[sc.id] || {};
            const refs = (sc[role].reflect || [])
              .map((q, i) => ({ q, a: r.reflections && r.reflections[i] }))
              .filter((x) => x.a && x.a.trim());
            return (
              <div className="recap-item" key={sc.id}>
                <div className="ri-num">Dilemma {String(sc.num).padStart(2, "0")} · {sc.theme}</div>
                <div className="ri-title">{sc.title}</div>
                {st ? (
                  <div className="ri-stance">
                    <span className="lbl">Your stance</span>
                    <span className="tag">{st.label}</span>
                  </div>
                ) : (
                  <div className="ri-empty">No stance recorded for this dilemma.</div>
                )}
                {refs.map((x, i) => (
                  <div className="ri-reflection" key={i}>{x.a}</div>
                ))}
              </div>
            );
          })}
        </div>

        <div className="closing-quote">
          <div className="cq"><span className="lead">“</span>{closing.quote}”</div>
          <div className="cattr">— {closing.attribution}</div>
        </div>

        <div className="export-bar no-print">
          <div className="et">Take your reflection with you</div>
          <div className="er">
            <button className="btn red" onClick={() => window.GradingExport.downloadVisualCard(role, scenarios, responses)}>
              Download visual card (HTML)
            </button>
            <button className="btn" onClick={() => window.print()}>Save as PDF</button>
            <button className="btn ghost" onClick={() => window.print()}>Print</button>
          </div>
          <div className="utility-row" style={{ marginTop: 18 }}>
            <button className="linklike" onClick={onReview}>Review the dilemmas again</button>
            <button className="linklike" onClick={onChangePath}>Switch path</button>
            <button className="linklike" onClick={onRestart}>Start over</button>
          </div>
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}

/* ---------- Tweaks defaults ---------- */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "tone": "editorial",
  "motif": "subtle",
  "motion": "full"
}/*EDITMODE-END*/;

/* ---------- App ---------- */
const STORAGE_KEY = "aigd_state_v2";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}

function App() {
  const scenarios = window.GRADING.scenarios;
  const total = scenarios.length;

  const saved = loadState();
  const [stage, setStage] = useStateA(saved ? saved.stage : "landing"); // landing | path | scenario | summary
  const [role, setRole] = useStateA(saved ? saved.role : null);
  const [index, setIndex] = useStateA(saved ? saved.index || 0 : 0);
  const [responses, setResponses] = useStateA(saved ? saved.responses || {} : {});

  // Tweaks
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useEffectA(() => {
    document.documentElement.dataset.theme = t.tone;
    document.body.classList.toggle("motif-bold", t.motif === "bold");
    document.body.classList.toggle("reduce-motion", t.motion === "calm");
  }, [t.tone, t.motif, t.motion]);

  // persist
  useEffectA(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ stage, role, index, responses }));
    } catch (e) {}
  }, [stage, role, index, responses]);

  // scroll to top on stage / scenario change
  useEffectA(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [stage]);
  useEffectA(() => { if (stage === "scenario") window.scrollTo({ top: 0, behavior: "smooth" }); }, [index]);

  function pickRole(r) { setRole(r); setIndex(0); setStage("scenario"); }

  function setStance(sid) {
    const sc = scenarios[index];
    setResponses((prev) => ({
      ...prev,
      [sc.id]: { ...(prev[sc.id] || { reflections: {} }), stance: sid }
    }));
  }
  function setReflection(qi, val) {
    const sc = scenarios[index];
    setResponses((prev) => {
      const cur = prev[sc.id] || { reflections: {} };
      return { ...prev, [sc.id]: { ...cur, reflections: { ...(cur.reflections || {}), [qi]: val } } };
    });
  }
  function next() {
    if (index < total - 1) setIndex(index + 1);
    else setStage("summary");
  }
  function prev() {
    if (index > 0) setIndex(index - 1);
    else setStage("path");
  }
  function restart() {
    setResponses({}); setRole(null); setIndex(0); setStage("landing");
  }

  const sc = scenarios[index];

  return (
    <React.Fragment>
      {stage === "scenario" && (
        <div className="topbar no-print">
          <div className="inner">
            <span className="crest">When AI Grading Arrives</span>
            <Progress total={total} index={index} />
            <span className="rolepill">{ROLE_LABEL[role]}</span>
          </div>
        </div>
      )}

      {stage === "landing" && <Landing onBegin={() => setStage("path")} />}

      {stage === "path" && (
        <PathSelect onPick={pickRole} onBack={() => setStage("landing")} />
      )}

      {stage === "scenario" && (
        <div className="stage">
          <ScenarioScreen
            scenario={sc}
            role={role}
            index={index}
            total={total}
            roleLabel={ROLE_LABEL[role]}
            response={responses[sc.id]}
            onStance={setStance}
            onReflect={setReflection}
            onNext={next}
            onPrev={prev}
          />
          <div className="column"><SiteFooter /></div>
        </div>
      )}

      {stage === "summary" && (
        <Summary
          role={role}
          scenarios={scenarios}
          responses={responses}
          onRestart={restart}
          onChangePath={() => { setStage("path"); }}
          onReview={() => { setIndex(0); setStage("scenario"); }}
        />
      )}

      {/* Tweaks panel */}
      <TweaksPanel>
        <TweakSection label="Tone" />
        <TweakRadio
          label="Mood"
          value={t.tone}
          options={["editorial", "stark", "warm"]}
          onChange={(v) => setTweak("tone", v)}
        />
        <TweakSection label="The red button" />
        <TweakRadio
          label="Emphasis"
          value={t.motif}
          options={["subtle", "bold"]}
          onChange={(v) => setTweak("motif", v)}
        />
        <TweakSection label="Motion" />
        <TweakRadio
          label="Animation"
          value={t.motion}
          options={["full", "calm"]}
          onChange={(v) => setTweak("motion", v)}
        />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
