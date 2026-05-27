export interface SuccessProfileItem {
  key: string;
  dimension: string;
  description: string;
  goodBehaviors: string[];
  badBehaviors: string[];
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
  category: string;
  maxScore: number;
  items: {
    name: string;
    points: number;
    unmet: string; // Score 1
    met: string;   // Score 2
    good: string;  // Score 3
    excellent: string; // Score 4
  }[];
}

export interface JournalTemplate {
  id: string;
  title: string;
  description: string;
  fields: {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'select';
    placeholder: string;
    options?: string[];
  }[];
}
