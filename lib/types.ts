export type Tone = "mint" | "iris" | "irisDeep" | "rose" | "brand" | "gold";

export interface LadderLevel {
  lv: string;
  role: string;
  desc: string;
  grad?: boolean;
}

export type CompGroup = "mindset" | "eng";

export interface Competency {
  code: string;
  group: CompGroup;
  name: string;
  en: string;
  lock: boolean;
  points: string[];
}

export interface Deliverable {
  feature: string;
  output: string;
  kpi: string;
  sign: string[];
}

export interface Product {
  roman: string;
  name: string;
  en: string;
  prio: string;
  stars: number;
  desc: string;
  stakeholders: string[];
  deliverables: Deliverable[];
}

export interface ScoreEntry {
  id: number;
  max: number;
  name: string;
  kpi: string;
}

export interface ScoreFinal extends ScoreEntry {
  seg: number;
  nl?: string;
}

export type SegmentId = 0 | 1 | 2;

export interface Gate {
  index: number;
  text: string;
  passed: boolean;
}

export interface RoadmapItem {
  code: string;
  meta: string;
  title: string;
  sessions: string[];
  gateLabel: string;
  gate: string;
  tone: Tone;
  grad?: boolean;
}

export type AnchorMap = Record<string, string[]>;

export interface Badge {
  code: string;
  label: string;
  title: string;
  en: string;
  tone: Tone;
  criteria: string;
}

export type BlockKind = "p" | "h" | "ul" | "quote" | "code";

export interface BlockP {
  t: "p";
  x: string;
}
export interface BlockH {
  t: "h";
  x: string;
}
export interface BlockU {
  t: "ul";
  items: string[];
}
export interface BlockQuote {
  t: "quote";
  x: string;
}
export interface BlockCode {
  t: "code";
  x: string;
}

export type Block = BlockP | BlockH | BlockU | BlockQuote | BlockCode;

export interface QuizQuestion {
  q: string;
  opts: string[];
  a: number;
}

export interface Lesson {
  id: string;
  lv: string;
  title: string;
  sub: string;
  read: string;
  blocks: Block[];
  tldr: string[];
  quiz: QuizQuestion[];
}