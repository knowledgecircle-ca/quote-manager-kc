import type { DemoTrainingPhase } from "@/ui/demo/prototypeData";

interface TrainingPhaseCardProps {
  phase: DemoTrainingPhase;
  onDuplicate: () => void;
  onRemove: () => void;
}

export function TrainingPhaseCard({ onDuplicate, onRemove, phase }: TrainingPhaseCardProps) {
  return (
    <details className="phase-card" open>
      <summary>{phase.title}</summary>
      <div className="phase-grid">
        <label>
          Selected learners
          <input readOnly value={phase.selectedLearners} />
        </label>
        <label>
          Service type
          <select defaultValue={phase.serviceType}>
            <option>Second language training</option>
            <option>Assessment / placement</option>
            <option>Custom training</option>
          </select>
        </label>
        <label>
          Language
          <select defaultValue={phase.language}>
            <option>English</option>
            <option>French</option>
          </select>
        </label>
        <label>
          Class type
          <select defaultValue={phase.classType}>
            <option>Individual</option>
            <option>Group</option>
            <option>Custom</option>
          </select>
        </label>
        <label>
          Rhythm
          <select defaultValue={phase.rhythm}>
            <option>6 hours/day</option>
            <option>7 hours/day</option>
            <option>7.5 hours/day</option>
            <option>Custom</option>
          </select>
        </label>
        <label>
          Start date
          <input type="date" defaultValue={phase.startDate} />
        </label>
        <label>
          End date
          <input type="date" defaultValue={phase.endDate} />
        </label>
        <label>
          Hours per day
          <input inputMode="decimal" defaultValue={phase.hoursPerDay} />
        </label>
        <label>
          Days per week
          <input inputMode="decimal" defaultValue={phase.daysPerWeek} />
        </label>
        <label>
          Hours per week
          <input inputMode="decimal" defaultValue={phase.hoursPerWeek} />
        </label>
        <label>
          Total program hours
          <input inputMode="decimal" defaultValue={phase.totalProgramHours} />
        </label>
        <label>
          Objective
          <textarea rows={3} defaultValue={phase.objective} />
        </label>
        <label className="full-width">
          Schedule notes
          <textarea rows={3} defaultValue={phase.scheduleNotes} />
        </label>
      </div>
      <div className="button-row">
        <button className="button-secondary" onClick={onDuplicate} type="button">
          Duplicate phase
        </button>
        <button className="button-danger" onClick={onRemove} type="button">
          Remove phase
        </button>
      </div>
    </details>
  );
}
