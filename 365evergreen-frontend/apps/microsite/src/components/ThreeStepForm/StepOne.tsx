type StepAction = { type: string; payload: unknown };

type StepProps = {
  state: Record<string, any>;
  dispatch: (action: StepAction) => void;
};

export default function StepOne({ state, dispatch }: StepProps) {
  return (
    <div>
      <h2>Your Current Experience</h2>

      <label>How would you describe your day‑to‑day digital experience?</label>
      <textarea
        value={state.experience || ""}
        onChange={(e) => dispatch({ type: "experience", payload: e.target.value })}
      />

      <label>How well do your current tools support your work?</label>
      <div>
        {[
          "They help me get things done smoothly",
          "They work, but could be better",
          "They often slow me down",
          "I’m not sure"
        ].map((opt) => (
          <label key={opt}>
            <input
              type="radio"
              name="support"
              value={opt}
              checked={state.support === opt}
              onChange={() => dispatch({ type: "support", payload: opt })}
            />
            {opt}
          </label>
        ))}
      </div>

      <label>What parts of your digital workplace do you enjoy?</label>
      <div>
        {[
          "Communication tools",
          "File sharing",
          "Collaboration spaces",
          "Mobile access",
          "Automation or shortcuts",
          "Other"
        ].map((opt) => (
          <label key={opt}>
            <input
              type="checkbox"
              checked={state.enjoy?.includes(opt)}
              onChange={(e) => {
                const updated = new Set(state.enjoy || []);
                e.target.checked ? updated.add(opt) : updated.delete(opt);
                dispatch({ type: "enjoy", payload: Array.from(updated) });
              }}
            />
            {opt}
          </label>
        ))}
      </div>

      <label>How easy is it to find the information you need?</label>
      <input
        type="range"
        min="0"
        max="10"
        value={state.findInfo || 5}
        onChange={(e) => dispatch({ type: "findInfo", payload: Number(e.target.value) })}
      />
      <span>{state.findInfo || 5}</span>

      <label>If you could change one thing today, what would it be?</label>
      <input
        type="text"
        value={state.changeOne || ""}
        onChange={(e) => dispatch({ type: "changeOne", payload: e.target.value })}
      />
    </div>
  );
}