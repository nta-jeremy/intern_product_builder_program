export type CompetencyLevel = 1 | 2 | 3 | 4;

export type CompetencyId =
  | 'user-problem-understanding'
  | 'product-experimentation'
  | 'ai-assisted-execution'
  | 'learning-ownership'
  | 'collaboration-trust';

export interface CompetencyLevelDefinition {
  level: CompetencyLevel;
  label: string;
  description: string;
}

export interface SuccessProfileItem {
  key: CompetencyId;
  dimension: string;
  description: string;
  whyItMatters: string;
  observableBehaviors: string[];
  supportSignals: string[];
  evidenceTemplateIds: string[];
}

export interface MetricDeliverable {
  feature: string;
  output: string;
  kpi: string;
  signOff: string;
}

export interface ProductDetail {
  id: string;
  title: string;
  subtitle: string;
  priority: 'CAO' | 'TRUNG BÌNH' | 'THẤP';
  priorityStars: number;
  description: string;
  primaryUsers: string[];
  approaches?: string[];
  deliverables: MetricDeliverable[];
}

export interface CoachingPhase {
  phase: string;
  title: string;
  time: string;
  objectives: string[];
  coachingFocus: string[];
  checkpoints: string[];
}

export interface ScorecardCriterion {
  id: string;
  name: string;
  description: string;
  points: number;
  competencyIds: CompetencyId[];
  evidenceTemplateIds: string[];
  levels: Record<CompetencyLevel, string>;
}

export interface ScorecardCategory {
  id: string;
  name: string;
  description: string;
  points: number;
  criteria: ScorecardCriterion[];
}

export type ScorecardType = 'entry' | 'final';

export interface ScorecardResultBand {
  minScore: number;
  label: string;
  description: string;
}

export interface ScorecardDefinition {
  id: ScorecardType;
  title: string;
  description: string;
  audienceNote: string;
  categories: ScorecardCategory[];
  resultBands: ScorecardResultBand[];
}

export interface FinalScorecardGate {
  id: string;
  label: string;
  description: string;
}

export interface JournalTemplate {
  id: string;
  title: string;
  description: string;
  whenToUse: string;
  minimumEvidence: string[];
  competencyIds: CompetencyId[];
  fields: {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'select';
    placeholder: string;
    options?: string[];
    required?: boolean;
  }[];
}
