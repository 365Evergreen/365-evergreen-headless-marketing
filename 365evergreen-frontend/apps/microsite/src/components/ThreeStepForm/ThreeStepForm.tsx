import { useReducer, useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import styles from "./ThreeStepForm.module.css";

type FormState = {
  [key: string]: any;
};

function reducer(state: FormState, action: { type: string; payload: any }) {
  return { ...state, [action.type]: action.payload };
}

const SUBMIT_URL =
  "https://9e393617e3e8e41fa3686bde5b1121.c3.environment.api.powerplatform.com/powerautomate/automations/direct/cu/15/workflows/cce3a60d396f48ada80866045b3900da/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=H4cOsL30D1J-D4cH0kLa2bT6BsTzFsXU44p-wmKV544";

function normalizeValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (value === undefined || value === null) {
    return "";
  }

  return String(value);
}

export default function ThreeStepForm() {
  const [step, setStep] = useState(1);
  const [formState, dispatch] = useReducer(reducer, {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const submit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const requestUrl = new URL(SUBMIT_URL);

      Object.entries(formState).forEach(([key, value]) => {
        requestUrl.searchParams.set(key, normalizeValue(value));
      });

      const response = await fetch(requestUrl.toString(), {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error(`Submission failed with status ${response.status}`);
      }

      alert("Thank you — your responses have been submitted.");
    } catch (error) {
      console.error("Form submission failed:", error);
      setSubmitError("We could not send your responses right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.progress}>Step {step} of 3</div>

      {step === 1 && <StepOne state={formState} dispatch={dispatch} />}
      {step === 2 && <StepTwo state={formState} dispatch={dispatch} />}
      {step === 3 && <StepThree state={formState} dispatch={dispatch} />}

      {submitError && <div className={styles.error}>{submitError}</div>}

      <div className={styles.buttons}>
        <button onClick={back} disabled={step === 1 || isSubmitting}>Back</button>
        {step < 3 && (
          <button onClick={next} disabled={isSubmitting}>
            Next
          </button>
        )}
        {step === 3 && (
          <button onClick={submit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
}