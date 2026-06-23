export interface StepDefinition {
  id: string;
  label: string;
  shortLabel?: string;
  state?: "completed" | "current" | "pending" | "attention";
}

interface StepperProps {
  steps: StepDefinition[];
  activeStepId: string;
  onStepChange: (stepId: string) => void;
}

export function Stepper({ activeStepId, onStepChange, steps }: StepperProps) {
  return (
    <nav className="stepper" aria-label="Proposal steps">
      <ol>
        {steps.map((step, index) => {
          const state = activeStepId === step.id ? "current" : step.state ?? "pending";
          return (
            <li key={step.id}>
              <button
                aria-current={activeStepId === step.id ? "step" : undefined}
                className={`stepper-button stepper-${state}`}
                onClick={() => onStepChange(step.id)}
                type="button"
              >
                <span aria-hidden="true" className="step-marker">
                  {state === "completed" ? "✓" : state === "attention" ? "!" : index + 1}
                </span>
                <span>{step.shortLabel ?? step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
