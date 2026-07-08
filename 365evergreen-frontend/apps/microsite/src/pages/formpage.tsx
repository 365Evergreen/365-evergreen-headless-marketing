import ThreeStepForm from "../components/ThreeStepForm/ThreeStepForm";
export default function FormPage() {
  return (
    <div style={{ padding: "40px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <h2>Start your digital workplace journey here</h2> <br />
        <p>
          Fill out the form below to get started with your digital workplace
          journey.
        </p> <br />
        <ThreeStepForm />
      </div>
    </div>
  );
}