/* AI Grading Dilemmas — export helpers (plain JS attached to window)
   Builds a self-contained, shareable visual HTML "card" of the user's
   stances and reflections. No italics anywhere. */

(function () {
  const ROLE_LABEL = { faculty: "Faculty", student: "Student" };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function stanceLabel(scenario, role, response) {
    if (!response || !response.stance) return null;
    const s = (scenario[role].stances || []).find((x) => x.id === response.stance);
    return s ? s : null;
  }

  function buildVisualCardHTML(role, scenarios, responses) {
    const dateStr = new Date().toLocaleDateString(undefined, {
      year: "numeric", month: "long", day: "numeric"
    });

    const items = scenarios.map((sc) => {
      const r = responses[sc.id] || {};
      const st = stanceLabel(sc, role, r);
      const reflections = (sc[role].reflect || []).map((q, i) => {
        const a = r.reflections && r.reflections[i];
        if (!a || !a.trim()) return "";
        return `<div class="ref"><div class="refq">${esc(q)}</div><div class="refa">${esc(a)}</div></div>`;
      }).join("");
      return `
        <article class="item">
          <div class="inum">Dilemma ${String(sc.num).padStart(2, "0")} &middot; ${esc(sc.theme)}</div>
          <h3>${esc(sc.title)}</h3>
          ${st ? `<div class="stance"><span class="tag">${esc(st.label)}</span><span class="sb">${esc(st.blurb)}</span></div>` : `<div class="nostance">No stance recorded</div>`}
          ${reflections}
        </article>`;
    }).join("");

    return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>My AI Grading Dilemmas \u2014 Reflection</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;font-style:normal !important;margin:0;padding:0}
  :root{--red:#CE1126;--oxford:#14213D;--bg:#EFE8D8;--surface:#FBF7EE;--edge:#DDD2B8;--ink:#14213D;--soft:#475068;--faint:#8A8470}
  body{background:radial-gradient(120% 80% at 50% -10%,#E7DEC9,#EFE8D8 60%);color:var(--ink);font-family:"Newsreader",Georgia,serif;padding:48px 20px;min-height:100vh}
  .card{max-width:720px;margin:0 auto;background:var(--surface);border:1px solid var(--edge);border-radius:8px;overflow:hidden;box-shadow:0 30px 70px -34px rgba(20,33,61,.55)}
  .hd{background:var(--oxford);color:#F4EFE3;padding:34px 38px 30px;position:relative}
  .hd .crest{font-family:"Archivo",sans-serif;font-weight:800;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#ff8089}
  .hd h1{font-family:"Newsreader",serif;font-weight:500;font-size:34px;line-height:1.06;margin-top:12px;letter-spacing:-.01em}
  .hd .meta{font-family:"Archivo",sans-serif;font-size:12px;letter-spacing:.04em;color:#B7C0D6;margin-top:14px}
  .hd .rolepill{display:inline-block;font-family:"Archivo",sans-serif;font-weight:700;font-size:11px;letter-spacing:.14em;text-transform:uppercase;border:1px solid #ff8089;color:#ff8089;border-radius:100px;padding:5px 12px;margin-bottom:4px}
  .body{padding:14px 38px 30px}
  .item{padding:24px 0;border-bottom:1px solid var(--edge)}
  .item:last-child{border-bottom:0}
  .inum{font-family:"Archivo",sans-serif;font-weight:700;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint)}
  .item h3{font-family:"Newsreader",serif;font-weight:500;font-size:25px;margin-top:6px}
  .stance{margin-top:12px;display:flex;gap:12px;align-items:baseline;flex-wrap:wrap}
  .tag{font-family:"Archivo",sans-serif;font-weight:700;font-size:13px;white-space:nowrap;background:rgba(206,17,38,.1);color:var(--red);border:1px solid rgba(206,17,38,.35);padding:5px 12px;border-radius:100px}
  .sb{font-size:17px;color:var(--soft);line-height:1.4}
  .nostance{font-family:"Archivo",sans-serif;font-size:12px;color:var(--faint);margin-top:10px;letter-spacing:.04em}
  .ref{margin-top:14px;padding-left:16px;border-left:2px solid rgba(20,33,61,.25)}
  .refq{font-family:"Archivo",sans-serif;font-size:12px;letter-spacing:.02em;color:var(--faint);line-height:1.4}
  .refa{font-size:18px;line-height:1.5;color:var(--ink);margin-top:5px}
  .quote{background:var(--bg);padding:28px 38px;border-top:1px solid var(--edge)}
  .quote .q{font-family:"Newsreader",serif;font-size:21px;line-height:1.45;color:var(--ink)}
  .quote .q .lead{color:var(--red)}
  .quote .a{font-family:"Archivo",sans-serif;font-weight:600;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint);margin-top:14px}
  .ft{padding:20px 38px 30px;font-family:"Archivo",sans-serif;font-size:11.5px;line-height:1.6;color:var(--faint)}
  .ft .badge{display:inline-block;font-weight:800;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#fff;background:var(--oxford);border-radius:3px;padding:4px 7px;margin-right:8px}
  .ft a{color:var(--red)}
</style></head>
<body>
  <div class="card">
    <div class="hd">
      <div class="crest">University of Mississippi \u00B7 Rhetorica</div>
      <h1>What I Would Give Up<br>\u2014 and What I Won\u2019t</h1>
      <div class="meta"><span class="rolepill">${esc(ROLE_LABEL[role] || role)} path</span> &nbsp;\u00B7&nbsp; Reflection completed ${esc(dateStr)}</div>
    </div>
    <div class="body">${items}</div>
    <div class="quote">
      <div class="q"><span class="lead">\u201C</span>The hardest part of teaching in this moment onwards might simply be choosing, every single day, not to press it.\u201D</div>
      <div class="a">\u2014 Marc Watkins</div>
    </div>
    <div class="ft">
      <span class="badge">AI Disclosure</span>This reflection card was generated by an interactive experience built with AI assistance; the responses above are the participant\u2019s own. Scenarios adapted from \u201CWhat We Give Up When We Let AI Decide\u201D by Marc Watkins, Rhetorica (2026). <a href="https://marcwatkins.substack.com/p/what-we-give-up-when-we-let-ai-decide">Read the essay</a>.
    </div>
  </div>
</body></html>`;
  }

  function downloadVisualCard(role, scenarios, responses) {
    const html = buildVisualCardHTML(role, scenarios, responses);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-ai-grading-dilemmas.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  window.GradingExport = { buildVisualCardHTML, downloadVisualCard };
})();
