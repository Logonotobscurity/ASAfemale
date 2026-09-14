import { useState } from "react";
import { useShop } from "@/lib/shop-store";

export function ActivityCenter() {
  const [open, setOpen] = useState(false);
  const activities = useShop((s) => s.activities);
  const offline = useShop((s) => s.offline);
  const clearActivities = useShop((s) => s.clearActivities);
  const resetDemo = useShop((s) => s.resetDemo);

  return (
    <section className="activity-center" aria-label="Demo activity center">
      <button type="button" className="activity-toggle m" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        {offline ? "OFFLINE DEMO" : "DEMO ACTIVITY"} · {activities.length}
      </button>
      {open ? (
        <div className="activity-panel">
          <div className="activity-head">
            <strong className="m">RECENT ACTIONS</strong>
            <button type="button" className="m" onClick={clearActivities}>CLEAR</button>
          </div>
          {activities.length === 0 ? <p className="activity-empty">Your demo actions will appear here.</p> : (
            <ul>
              {activities.slice(0, 6).map((activity) => <li key={activity.id}>{activity.label}</li>)}
            </ul>
          )}
          <button type="button" className="activity-reset m" onClick={resetDemo}>RESET ALL DEMO DATA</button>
        </div>
      ) : null}
    </section>
  );
}
