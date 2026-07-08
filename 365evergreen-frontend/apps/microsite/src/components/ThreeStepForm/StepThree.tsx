type StepAction = { type: string; payload: unknown };

type StepProps = {
  state: Record<string, any>;
  dispatch: (action: StepAction) => void;
};

export default function StepThree({ state, dispatch }: StepProps) {
  const multi = (key: string, value: string, checked: boolean) => {
    const updated = new Set(state[key] || []);
    checked ? updated.add(value) : updated.delete(value);
    dispatch({ type: key, payload: Array.from(updated) });
  };

  return (
    <div>
      <h2>Your Ideal Digital Workplace</h2>

      <label>What would make your digital workplace feel more effortless?</label>
      <textarea
        value={state.effortless || ""}
        onChange={(e) => dispatch({ type: "effortless", payload: e.target.value })}
      />

      <label>Which improvements would make the biggest difference?</label>
      {["Clearer communication", "Easier access to information", "Better collaboration spaces", "More automation", "Stronger support and guidance", "More consistent experience across tools"].map((opt) => (
        <label key={opt}>
          <input
            type="checkbox"
            checked={state.improvements?.includes(opt)}
            onChange={(e) => multi("improvements", opt, e.target.checked)}
          />
          {opt}
        </label>
      ))}

      <label>How important is it to improve your digital workplace?</label>
      <input
        type="range"
        min="0"
        max="10"
        value={state.importance || 5}
        onChange={(e) => dispatch({ type: "importance", payload: Number(e.target.value) })}
      />
      <span>{state.importance || 5}</span>

      <label>What outcomes would you love to see?</label>
      {["Saving time", "Reducing frustration", "Improving teamwork", "Making processes simpler", "Helping people feel more connected", "Supporting growth and innovation"].map((opt) => (
        <label key={opt}>
          <input
            type="checkbox"
            checked={state.outcomes?.includes(opt)}
            onChange={(e) => multi("outcomes", opt, e.target.checked)}
          />
          {opt}
        </label>
      ))}

      <label>If everything worked perfectly, what would your ideal workday look like?</label>
      <textarea
        value={state.idealDay || ""}
        onChange={(e) => dispatch({ type: "idealDay", payload: e.target.value })}
      />
    </div>
  );
}