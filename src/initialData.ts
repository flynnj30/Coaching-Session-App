import { CoachingSession } from './types';

export const INITIAL_SESSIONS: CoachingSession[] = [
  {
    id: 'session-victor-1',
    coachName: 'Flynn James Pontino',
    traineeName: 'Victor',
    date: '2026-07-08',
    sessionType: 'Mock Calls & Conversational Delivery',
    summary: "Victor has shown good effort in following the script and staying consistent during our mock calls. During today's coaching session, we focused on improving his introduction, refining his tonality, and delivering the script in a more natural and conversational way instead of sounding too sales-focused.",
    positiveFeedback: "Victor consistently follows the call flow and shows confidence when delivering his introduction. He was receptive to coaching, actively participated in the role-play activities, and showed a positive attitude toward applying the feedback discussed.",
    actionPlan: "We will continue practicing the introduction using a slower pace and a more curious tone to create better conversations with prospects. We also agreed to make the script sound more natural while keeping the key message clear. We'll reinforce these improvements through regular role-plays, apply them during live calls, and review call recordings to monitor progress and identify opportunities for continuous improvement.",
    coachRemarks: "Great job on the effort you showed during today's coaching session. Have a good foundation, and with consistent practice on tonality and conversational delivery will continue to build stronger connections with business owners. Let's stay consistent, apply what we've practiced, and keep improving one call at a time. Small improvements every day will lead to stronger conversations and better results.",
    metrics: {
      scriptAdherence: 88,
      tonality: 72,
      conversationalFlow: 75,
      confidence: 85,
      pacing: 68
    },
    status: 'Completed'
  },
  {
    id: 'session-kean-1',
    coachName: 'Flynn James Pontino',
    traineeName: 'Kean',
    date: '2026-07-07',
    sessionType: 'Objection Handling & Discovery',
    summary: "Kean participated in our coaching session focused on handling standard brush-offs (e.g., 'not interested' or 'send an email'). We reviewed his tendency to rush into defensive responses and practiced a softer, more inquisitive strategy using active listening to uncover the business owner's actual bottlenecks.",
    positiveFeedback: "Kean has an excellent, energetic voice and high enthusiasm. He has a great greeting and handles initial gatekeepers smoothly. He was very proactive during our role-plays and demonstrated a strong desire to improve his conversion rate.",
    actionPlan: "We will practice the 'agree and redirect' technique when encountering early objections. Kean needs to wait 2 seconds before responding to objections to ensure he doesn't interrupt the prospect. We will conduct daily 15-minute mock role-plays focusing on the top 3 objections and review recordings on Friday.",
    coachRemarks: "Kean, your high energy is a major asset! By adding active listening and breathing room into your conversations, you'll turn brush-offs into genuine discovery opportunities. Keep up the enthusiasm, slow down during objections, and you'll see your appointment rates climb!",
    metrics: {
      scriptAdherence: 92,
      tonality: 80,
      conversationalFlow: 70,
      confidence: 95,
      pacing: 60
    },
    status: 'Completed'
  }
];
