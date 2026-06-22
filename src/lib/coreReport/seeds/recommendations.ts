import { ProfileDimensions } from '@/types';
import { bucket3 } from '../bucket';

/**
 * Short recommendation snippets keyed by dimension bucket. "Where to Go From
 * Here" picks one snippet from each of five dimensions and assembles them into
 * a personalized 5-item list — genuine data-tied recommendations without
 * authoring a full section variant per combination.
 */
const REC: Record<string, Record<string, string>> = {
  attachment: {
    secure:
      'Your attachment security is an asset most people underestimate in themselves. Use it deliberately: you are well-positioned to be the stabilizing presence in relationships and teams that run hot. Put yourself in rooms where steadiness is scarce, because that is where your wiring compounds.',
    anxious:
      'Your attachment system runs hot toward fear of abandonment, which means your instinct under relational stress is to pursue, clarify, and seek reassurance. Practice the pause: when you feel the urge to chase certainty, wait long enough to ask whether the threat is real or remembered. The reassurance you seek externally is more durable when you can also generate it internally.',
    avoidant:
      'Your attachment leans toward self-protection through distance, which reads to others as independence but can quietly starve your closest relationships of the contact they need. The growth edge is counterintuitive for you: deliberately move toward people in the moments you most want to withdraw. Small, repeated acts of staying are how the pattern loosens.',
    disorganized:
      'Your attachment carries a push-pull tension — wanting closeness and fearing it at once — which can make relationships feel confusing to navigate from the inside. Predictability is your medicine. Build relationships with people who are steady and consistent, and practice naming the contradiction out loud rather than acting it out.',
  },
  distortion: {
    catastrophizing:
      'Your mind reaches for the worst-case scenario faster than the evidence warrants. Build the habit of asking, in the moment, "what is the most likely outcome, not the most frightening one?" Writing the realistic case next to the catastrophic one shrinks its grip surprisingly fast.',
    'mind reading':
      'You tend to assume you know what others are thinking — usually that it is worse than it is. Treat those assumptions as hypotheses, not facts. The single most useful move is to check directly: ask rather than infer, because your inferences skew negative and your direct questions almost never confirm the story.',
    'all-or-nothing thinking':
      'You think in extremes — success or failure, all in or out — which erases the middle ground where most of real life actually happens. Practice deliberately naming the partial wins and the "good enough" outcomes. Progress for you means getting comfortable with the gray.',
    personalization:
      'You take responsibility for things outside your control and read neutral events as being about you. Before absorbing blame, ask what portion of this was actually yours versus circumstance, other people, or chance. You will usually find your real share is smaller than it feels.',
    'over-responsibility':
      'You carry weight that was never yours to carry, stepping in to fix and manage what other people could handle themselves. Practice letting others sit with their own discomfort. Your help, given too readily, can quietly rob people of the chance to grow.',
    'discounting positives':
      'You let the good slide off and let the negative stick. Build a deliberate counterweight: keep a record of what went well and what you did right, because your memory will not do it for you. The goal is not false positivity — it is an accurate ledger.',
  },
  motivation: {
    'fear of failure':
      'Much of your drive runs on the fear of falling short, which is effective fuel but expensive over time. Begin shifting some of your energy toward what you are moving toward rather than what you are running from. Set at least one goal that would be worth pursuing even if failure carried no cost.',
    'status and approval':
      'You are motivated by recognition and the regard of others, which can sharpen your performance but also tether your sense of worth to applause. Practice doing meaningful work that no one will see or praise. It rebuilds the internal source of esteem that external validation cannot reliably supply.',
    'intrinsic curiosity':
      'Your engine is genuine curiosity, which is rare and worth protecting. The risk is dispersion — chasing every interesting thing and finishing few. Channel the curiosity toward one or two pursuits deep enough to compound, and let the rest stay hobbies.',
    'meaning and purpose':
      'You are driven by significance — the sense that what you do matters. Guard against the version of this that makes everything feel like it must be world-changing to be worth doing. Anchor purpose in the concrete and nearby, where most real meaning is actually found.',
  },
  emotionRegulation: {
    suppression:
      'Your default with difficult emotion is to push it down and carry on. That keeps you functional in the moment but the cost accrues — suppressed feeling does not disappear, it leaks. Build one reliable outlet (movement, writing, a trusted person) where the pressure gets released on purpose.',
    acceptance:
      'You already tolerate difficult emotion well — you can sit with discomfort without needing to immediately fix or flee it. Lean into this as a quiet strength, and offer it to others: your capacity to stay present with hard feelings makes you the person people can bring their hard things to.',
    rumination:
      'You tend to turn difficult feelings over and over, mistaking the loop for processing. Set a container around it: give yourself a bounded window to feel and analyze, then deliberately shift to action or distraction. Movement, in particular, interrupts the loop more effectively than more thinking.',
  },
  selfConcept: {
    low:
      'Your sense of who you are still shifts with context and company, which makes you adaptable but can leave you unsure what is actually yours. Invest in the slow work of self-definition: notice which choices feel like yours versus borrowed, and let that distinction guide more of your decisions over time.',
    medium:
      'You have a reasonably clear sense of self that still wobbles under pressure or in unfamiliar territory. Strengthen it by acting from your stated values in low-stakes moments, so the muscle is built before the high-stakes ones arrive.',
    high:
      'You have an unusually clear and stable sense of who you are, which is a genuine advantage — but pair it with deliberate openness. The risk at your end of the spectrum is that certainty quietly closes you to feedback. Keep a few people in your life who are allowed to tell you hard things.',
  },
};

export function buildRecommendations(p: ProfileDimensions): string {
  const sccBucket = bucket3(p.selfConceptClarity, 0.33, 0.66);
  const picks = [
    REC.attachment[p.attachment.style],
    REC.distortion[p.cognitiveDistortions.top3[0]],
    REC.motivation[p.motivation.primaryDriver],
    REC.emotionRegulation[p.emotionRegulation.style],
    REC.selfConcept[sccBucket],
  ].filter(Boolean);

  const intro =
    'You have read a lot about yourself in these pages. The point of all of it is not insight for its own sake — it is leverage. Here are the few changes that, given your specific profile, would move the most.';

  const body = picks.map((rec, i) => `${i + 1}. ${rec}`).join('\n\n');

  const outro =
    'None of these require you to become someone else. They are small, repeatable moves that work with your wiring rather than against it. Pick one. Start this week.';

  return `${intro}\n\n${body}\n\n${outro}`;
}
