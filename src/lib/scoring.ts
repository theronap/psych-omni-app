import { Answers, ProfileDimensions } from '@/types';
import { sections } from './questions';

export function buildProfile(answers: Answers): ProfileDimensions {
  const questions = sections.flatMap(s => s.questions);

  // OCEAN scoring
  const ocean = { O: [] as number[], C: [] as number[], E: [] as number[], A: [] as number[], N: [] as number[] };
  for (const q of questions) {
    if (!['O', 'C', 'E', 'A', 'N'].includes(q.dimension)) continue;
    const raw = answers[q.id];
    if (raw === undefined) continue;
    let val = Number(raw);
    if (q.reverse) val = 8 - val;
    ocean[q.dimension as keyof typeof ocean].push(val);
  }
  const oceanScores = {
    O: toPercent(ocean.O),
    C: toPercent(ocean.C),
    E: toPercent(ocean.E),
    A: toPercent(ocean.A),
    N: toPercent(ocean.N),
  };

  // Attachment
  const attScores: Record<string, number> = { secure: 0, anxious: 0, avoidant: 0, disorganized: 0 };
  for (const q of questions.filter(q => q.dimension === 'attachment')) {
    const val = answers[q.id] as string;
    if (!val || !q.options) continue;
    const opt = q.options.find(o => o.value === val);
    if (opt) for (const [k, v] of Object.entries(opt.scores)) attScores[k] = (attScores[k] || 0) + (v ?? 0);
  }
  const attachmentStyle = Object.entries(attScores).sort((a, b) => b[1] - a[1])[0][0];

  // Enneagram
  const ennScores: Record<number, number> = {};
  for (let i = 1; i <= 9; i++) {
    const q = questions.find(q => q.dimension === `enneagram_${i}`);
    ennScores[i] = q ? Number(answers[q.id] || 4) : 4;
  }
  const primaryEnn = Number(Object.entries(ennScores).sort((a, b) => b[1] - a[1])[0][0]);

  // Jungian
  const NF = Number(answers['jung1'] || 4);
  const N = Number(answers['jung2'] || 4);
  const F = Number(answers['jung3'] || 4);
  const Ej = Number(answers['jung4'] || 4);
  const dominant = Ej > 4 ? (F > 4 ? 'Fe' : 'Te') : (NF > 4 ? 'Ni' : 'Si');
  const auxiliary = dominant.startsWith('F') ? (N > 4 ? 'Ni' : 'Si') : (F > 4 ? 'Fi' : 'Ti');

  // Values
  const valuesAnswer = answers['values1'] as string[] | undefined;
  const values = valuesAnswer
    ? valuesAnswer.slice(0, 5)
    : ['Freedom & Autonomy', 'Knowledge & Learning', 'Achievement & Success', 'Deep Connection & Love', 'Impact & Contribution'];

  // IFS
  const ifsMap: Record<number, string> = { 1: 'manager', 2: 'caretaker', 3: 'achiever', 4: 'exile', 5: 'observer', 6: 'sentinel', 7: 'hedonist', 8: 'protector', 9: 'mediator' };
  const primaryProtector = ifsMap[primaryEnn] || 'manager';
  const exileThemes = attachmentStyle === 'anxious'
    ? ['abandonment', 'inadequacy']
    : attachmentStyle === 'avoidant'
    ? ['engulfment', 'dependence']
    : attachmentStyle === 'disorganized'
    ? ['safety', 'trust']
    : ['isolation', 'unworthiness'];

  // Cognitive distortions
  const distortionDims = ['distortion_catastrophizing', 'distortion_mindreading', 'distortion_allornone', 'distortion_personalization', 'distortion_responsibility', 'distortion_discounting'];
  const distortionNames = ['catastrophizing', 'mind reading', 'all-or-nothing thinking', 'personalization', 'over-responsibility', 'discounting positives'];
  const distortionScores = distortionDims.map((dim, i) => {
    const q = questions.find(q => q.dimension === dim);
    return { name: distortionNames[i], score: q ? Number(answers[q.id] || 1) : 1 };
  });
  const top3Distortions = [...distortionScores].sort((a, b) => b.score - a.score).slice(0, 3).map(d => d.name);
  const avgDistortion = distortionScores.reduce((s, d) => s + d.score, 0) / distortionScores.length;
  const severity = avgDistortion > 5 ? 'high' : avgDistortion > 3 ? 'moderate' : 'low';

  // Emotion regulation
  const erSuppression = Number(answers['er1'] || 4);
  const erTolerance = Number(answers['er2'] || 4);
  const erAwareness = Number(answers['er4'] || 4);
  const erStyle = erSuppression > 4 ? 'suppression' : erTolerance > 4 ? 'acceptance' : 'rumination';

  // Decision style
  const decIntuitive = Number(answers['dec1'] || 4);
  const decLossAversion = Number(answers['dec3'] || 4);
  const decisionPrimary = decIntuitive > 4 ? 'intuitive' : 'deliberate';

  // Conflict style
  const conflictScores: Record<string, number> = { assertive: 0, avoidant: 0, accommodating: 0, reactive: 0 };
  for (const q of questions.filter(q => q.dimension === 'conflictStyle')) {
    const val = answers[q.id] as string;
    if (!val || !q.options) continue;
    const opt = q.options.find(o => o.value === val);
    if (opt) for (const [k, v] of Object.entries(opt.scores)) conflictScores[k] = (conflictScores[k] || 0) + (v ?? 0);
  }
  const conflictStyle = Object.entries(conflictScores).sort((a, b) => b[1] - a[1])[0][0];

  // Strengths
  const strengthsAnswer = answers['str1'] as string[] | undefined;
  const strengths = strengthsAnswer
    ? strengthsAnswer.slice(0, 5).map(s => s.split(' — ')[0])
    : ['Curiosity', 'Perspective', 'Judgment', 'Honesty', 'Creativity'];

  // Risk
  const riskAverse = Number(answers['risk1'] || 4);
  const riskSocial = Number(answers['risk2'] || 4);
  const riskIntellectual = Number(answers['risk3'] || 4);

  // Self-concept clarity
  const scc1 = Number(answers['scc1'] || 4);
  const scc2 = Number(answers['scc2'] || 4);
  const scc3 = Number(answers['scc3'] || 4);
  const scc4 = Number(answers['scc4'] || 4);
  const sccHigh = (scc2 + scc4) / 2;
  const sccLow = (scc1 + scc3) / 2;
  const selfConceptClarity = Math.round(((sccHigh - sccLow + 7) / 14) * 100) / 100;

  // Locus of control
  const locInternal = Number(answers['loc1'] || 4);
  const locExternal = Number(answers['loc2'] || 4);

  // Motivation
  const motFear = Number(answers['mot1'] || 4);
  const motExternal = Number(answers['mot2'] || 4);
  const motIntrinsic = Number(answers['mot3'] || 4);
  const motPurpose = Number(answers['mot4'] || 4);
  const motScores = [
    { name: 'fear of failure', score: motFear },
    { name: 'status and approval', score: motExternal },
    { name: 'intrinsic curiosity', score: motIntrinsic },
    { name: 'meaning and purpose', score: motPurpose },
  ];
  const primaryDriver = [...motScores].sort((a, b) => b.score - a.score)[0].name;
  const fearDriver = motFear > 4 ? 'failure' : 'irrelevance';
  const aspirationDriver = motPurpose > motIntrinsic ? 'purpose' : 'mastery';

  return {
    ocean: oceanScores,
    attachment: { style: attachmentStyle, scores: attScores },
    enneagram: { primary: primaryEnn, scores: ennScores },
    jungian: { dominant, auxiliary },
    values,
    ifs: { primaryProtector, themes: exileThemes },
    cognitiveDistortions: { top3: top3Distortions, severity },
    emotionRegulation: { style: erStyle, awareness: erAwareness },
    decisionStyle: { primary: decisionPrimary, lossAversion: decLossAversion },
    conflictStyle,
    strengths,
    riskTolerance: { financial: 8 - riskAverse, social: riskSocial, intellectual: riskIntellectual },
    selfConceptClarity,
    locusOfControl: { internal: locInternal, external: locExternal },
    motivation: { primaryDriver, fearDriver, aspirationDriver },
  };
}

function toPercent(arr: number[]): number {
  if (arr.length === 0) return 50;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  return Math.round((mean / 7) * 100);
}
