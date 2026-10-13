(function () {
  function inject() {
    if (document.getElementById("gym-showcase")) return;
    var proj = document.getElementById("projects") || document.querySelector("section");
    if (!proj) return;
    var sec = document.createElement("section");
    sec.id = "gym-showcase";
    sec.className = "rv";
    sec.style.cssText = "margin:2.5rem 0;padding:0 1rem;";
    sec.innerHTML = '<div class="st">Featured App</div><div class="ss">├❭ SIDHI GYM TRACKER</div><div style="display:flex;flex-direction:column;align-items:center;gap:1.2rem;"><div style="width:min(360px,100%);background:linear-gradient(180deg,#111827,#0f172a);border:1px solid rgba(99,226,179,.3);border-radius:36px;padding:14px;box-shadow:0 24px 60px #000a;"><div style="background:#02040c;border-radius:28px;overflow:hidden;height:620px;position:relative;"><iframe src="https://sidhi-gym-tracker.vercel.app" style="width:100%;height:100%;border:0;" loading="lazy" title="Sidhi Gym live"></iframe></div></div><div style="text-align:center;max-width:480px;"><p style="color:var(--mt,#9aa7b8);line-height:1.7;margin:0 0 1rem;font-size:.92rem;">Daily gym + GPS run tracker, weight progress, offline drafts, backup/restore, and PWA.</p><a href="https://sidhi-gym-tracker.vercel.app" target="_blank" class="cta-btn cta-primary" style="margin:.25rem .4rem;">Open App</a><a href="https://github.com/SIDHIMUSIC/sidhi-gym-tracker" target="_blank" class="cta-btn cta-secondary" style="margin:.25rem .4rem;">Source</a></div></div>';
    proj.parentNode.insertBefore(sec, proj.nextSibling);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", inject);
  else inject();
  setTimeout(inject, 800);
})();
