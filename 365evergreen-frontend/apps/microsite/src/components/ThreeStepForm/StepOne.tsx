type StepAction = { type: string; payload: unknown };

type StepProps = {
  state: Record<string, any>;
  dispatch: (action: StepAction) => void;
};

import styles from "./ThreeStepForm.module.css";

export default function StepOne({ state, dispatch }: StepProps) {
  return (
    <div>
      <h2>About you and your organisation</h2>

      <div className={styles.firstSectionGrid}>
        <div className={styles.field}>
          <label>Your first name</label>
          <input
            type="text"
            value={state.firstName || ""}
            onChange={(e) => dispatch({ type: "firstName", payload: e.target.value })}
          />
        </div>

        <div className={styles.field}>
          <label>Your last name</label>
          <input
            type="text"
            value={state.lastName || ""}
            onChange={(e) => dispatch({ type: "lastName", payload: e.target.value })}
          />
        </div>

        <div className={styles.field}>
          <label>Your email address</label>
          <input
            type="text"
            value={state.email || ""}
            onChange={(e) => dispatch({ type: "email", payload: e.target.value })}
          />
        </div>

        <div className={styles.field}>
          <label>Your phone number</label>
          <input
            type="text"
            value={state.phone || ""}
            onChange={(e) => dispatch({ type: "phone", payload: e.target.value })}
          />
        </div>

        <div className={`${styles.field} ${styles.firstSectionFullWidth}`}>
          <label>Your organisation name</label>
          <input
            type="text"
            value={state.organisation || ""}
            onChange={(e) => dispatch({ type: "organisation", payload: e.target.value })}
          />
        </div>

        <div className={styles.field}>
          <label>Your organisation size</label>
          <select
            value={state.orgSize || ""}
            onChange={(e) => dispatch({ type: "orgSize", payload: e.target.value })}
          >
            <option value="">Select size</option>
            <option value="1-10">1-10</option>
            <option value="11-50">11-50</option>
            <option value="51-200">51-200</option>
            <option value="201-500">201-500</option>
            <option value="501-1000">501-1000</option>
            <option value="1001+">1001+</option>
          </select>
        </div>

        <div className={styles.field}>
          <label>Your industry</label>
          <input
            type="text"
            value={state.industry || ""}
            onChange={(e) => dispatch({ type: "industry", payload: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label>Your workforce type</label>
          <select
            value={state.workforceType || ""}
            onChange={(e) => dispatch({ type: "workforceType", payload: e.target.value })}
          >
            <option value="">Select workforce type</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div className={styles.field}>
          <label>Your state</label>
          <select
            value={state.stateTerritory || ""}
            onChange={(e) => dispatch({ type: "stateTerritory", payload: e.target.value })}
          >
            <option value="">ACT</option>
            <option value="NSW">NSW</option>
            <option value="NT">NT</option>
            <option value="QLD">QLD</option>
            <option value="SA">SA</option>
            <option value="TAS">TAS</option>
            <option value="VIC">VIC</option>
            <option value="WA">WA</option>
          </select>
        </div>

        <div className={`${styles.field} ${styles.firstSectionFullWidth}`}>
          <label>Your role in the organisation</label>
          <input
            type="text"
            value={state.role || ""}
            onChange={(e) => dispatch({ type: "role", payload: e.target.value })}
          />
        </div>
      </div>

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
      <select
        value={state.findInfo || 3}
        onChange={(e) => dispatch({ type: "findInfo", payload: Number(e.target.value) })}
      >
        <option value="5">Very easy</option>
        <option value="4">Somewhat easy</option>
        <option value="3">Neutral</option>
        <option value="2">Somewhat difficult</option>
        <option value="1">Very difficult</option>
      </select>

      <label>If you could change one thing today, what would it be?</label>
      <input
        type="text"
        value={state.changeOne || ""}
        onChange={(e) => dispatch({ type: "changeOne", payload: e.target.value })}
      />
    </div>
  );
}