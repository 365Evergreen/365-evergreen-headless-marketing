type StepAction = { type: string; payload: unknown };

type StepProps = {
  state: Record<string, any>;
  dispatch: (action: StepAction) => void;
};

export default function StepTwo({ state, dispatch }: StepProps) {
  const multi = (key: string, value: string, checked: boolean) => {
    const updated = new Set(state[key] || []);
    checked ? updated.add(value) : updated.delete(value);
    dispatch({ type: key, payload: Array.from(updated) });
  };

  return (
    <div>
      <h2>What’s Working and What’s Not</h2>

      <label>Which areas feel the most helpful?</label>
      {["Communication", "Team collaboration", "Document management", "Processes and workflows", "Reporting and insights", "Support and training"].map((opt) => (
        <label key={opt}>
          <input
            type="checkbox"
            checked={state.helpful?.includes(opt)}
            onChange={(e) => multi("helpful", opt, e.target.checked)}
          />
          {opt}
        </label>
      ))}

      <label>Which areas feel the most challenging?</label>
      {["Communication", "Team collaboration", "Document management", "Processes and workflows", "Reporting and insights", "Support and training"].map((opt) => (
        <label key={opt}>
          <input
            type="checkbox"
            checked={state.challenging?.includes(opt)}
            onChange={(e) => multi("challenging", opt, e.target.checked)}
          />
          {opt}
        </label>
      ))}

      <label>How confident do you feel using your current tools?</label>
      {["Very confident", "Mostly confident", "Sometimes unsure", "Often unsure"].map((opt) => (
        <label key={opt}>
          <input
            type="radio"
            name="confidence"
            value={opt}
            checked={state.confidence === opt}
            onChange={() => dispatch({ type: "confidence", payload: opt })}
          />
          {opt}
        </label>
      ))}

      <label>What slows you down the most?</label>
      <select
        value={state.slowdown || ""}
        onChange={(e) => dispatch({ type: "slowdown", payload: e.target.value })}
      >
        <option value="">Select…</option>
        <option>Hard to find information</option>
        <option>Too many steps to complete tasks</option>
        <option>Tools don’t work well together</option>
        <option>Lack of guidance or training</option>
        <option>Other</option>
      </select>

      <label>Tell us about a recent moment where your tools helped you succeed.</label>
      <textarea
        value={state.successMoment || ""}
        onChange={(e) => dispatch({ type: "successMoment", payload: e.target.value })}
      />
    </div>
  );
}