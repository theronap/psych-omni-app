export type QuestionType = 'likert' | 'choice' | 'ranking' | 'text';

export interface ChoiceOption {
  value: string;
  label: string;
  scores: Partial<Record<string, number>>;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  subtext?: string;
  dimension: string;
  reverse?: boolean;
  options?: ChoiceOption[];
  items?: string[];
  minLabel?: string;
  maxLabel?: string;
}

export interface Section {
  id: string;
  title: string;
  subtitle: string;
  questions: Question[];
}

export type Answers = Record<string, string | number | string[]>;

export interface ProfileDimensions {
  ocean: { O: number; C: number; E: number; A: number; N: number };
  attachment: { style: string; scores: Record<string, number> };
  enneagram: { primary: number; scores: Record<number, number> };
  jungian: { dominant: string; auxiliary: string };
  values: string[];
  ifs: { primaryProtector: string; themes: string[] };
  cognitiveDistortions: { top3: string[]; severity: string };
  emotionRegulation: { style: string; awareness: number };
  decisionStyle: { primary: string; lossAversion: number };
  conflictStyle: string;
  strengths: string[];
  riskTolerance: { financial: number; social: number; intellectual: number };
  selfConceptClarity: number;
  locusOfControl: { internal: number; external: number };
  motivation: { primaryDriver: string; fearDriver: string; aspirationDriver: string };
}

export interface PsychProfile {
  id: string;
  createdAt: string;
  dimensions: ProfileDimensions;
  openEndedResponses: {
    formativeChapter?: string;
    othersPerception?: string;
    growthGap?: string;
    regrettedDecision?: string;
  };
}
