
import { LearnPillar, LearnItem, LearnRecommendation } from './types';

export const PILLARS: LearnPillar[] = [
  { id: "hormones", title: "Hormones", subtitle: "Endocrine basics", icon: "🧬", accentKey: "lavender" },
  { id: "nutrition", title: "Nutrition", subtitle: "Fuel for balance", icon: "🥗", accentKey: "sage" },
  { id: "cycle_syncing", title: "Syncing", subtitle: "Live by rhythm", icon: "🌙", accentKey: "rose" },
  { id: "labs_supplements", title: "Labs & Supps", subtitle: "Data & Support", icon: "🧪", accentKey: "blue" },
];

export const LEARN_ITEMS: LearnItem[] = [
  // ARTICLES
  {
    id: "art_insulin_101",
    type: "article",
    pillarId: "hormones",
    title: "Understanding Insulin Resistance",
    description: "The core mechanism behind 70% of PCOS cases.",
    body: "Insulin is a hormone that allows your cells to use sugar. In PCOS, cells often stop responding to insulin, leading to high levels in the blood. This 'insulin resistance' triggers the ovaries to produce excess testosterone, leading to acne, hair growth, and skipped cycles. Management focuses on protein-rich meals and consistent movement.",
    tags: ["Insulin", "Metabolic", "Foundations"],
    readTimeMin: 6,
    accentKey: "lavender"
  },
  {
    id: "art_low_gi_diet",
    type: "article",
    pillarId: "nutrition",
    title: "Low GI Living Guide",
    description: "How to pick foods that keep your energy steady.",
    body: "The Glycemic Index (GI) measures how quickly food raises blood sugar. High-GI foods (white bread, sugar) cause spikes that worsen PCOS symptoms. Low-GI choices like berries, lentils, and oats provide slow-release energy. Pairing carbs with fiber, fat, and protein is the 'golden rule' for hormone stability.",
    tags: ["Low GI", "Nutrition", "Cravings"],
    readTimeMin: 8,
    accentKey: "sage"
  },
  {
    id: "art_luteal_rest",
    type: "article",
    pillarId: "cycle_syncing",
    title: "The Luteal Power Down",
    description: "Why your body needs 300 extra calories now.",
    body: "During your luteal phase (post-ovulation), your metabolic rate actually increases. This is why you feel hungrier! Progesterone is rising, calling for grounding foods like sweet potatoes and warm soups. Intense workouts can spike cortisol now, so consider switching to walking or restorative yoga.",
    tags: ["Syncing", "Luteal", "Stress"],
    readTimeMin: 5,
    accentKey: "rose"
  },
  {
    id: "art_inositol_science",
    type: "article",
    pillarId: "labs_supplements",
    title: "The Science of Inositol",
    description: "The most researched supplement for PCOS.",
    body: "Myo-inositol and D-chiro-inositol act as 'messengers' for insulin. Studies show that a 40:1 ratio can significantly improve ovulation rates and reduce cravings. It helps clear the cellular path so insulin can do its job without causing an androgen spike.",
    tags: ["Supplements", "Foundations", "Fertility"],
    readTimeMin: 7,
    accentKey: "blue"
  },
  {
    id: "art_cortisol_connection",
    type: "article",
    pillarId: "hormones",
    title: "The Cortisol Connection",
    description: "Why 'Adrenal PCOS' is different.",
    body: "Cortisol is your stress hormone. When it's chronically high, it can drive DHEAS (an adrenal androgen) up, leading to symptoms even if your insulin is normal. Rest, sunlight, and magnesium are your best allies here.",
    tags: ["Stress", "Cortisol", "Fatigue"],
    readTimeMin: 5,
    isPremium: true,
    accentKey: "lavender"
  },
  {
    id: "art_acne_protocol",
    type: "article",
    pillarId: "hormones",
    title: "PCOS Acne Protocol",
    description: "Treating skin issues from the inside out.",
    body: "Acne in PCOS is usually driven by high androgens. Spearmint tea, zinc, and lowering dairy intake are evidence-based ways to reduce the internal triggers for cystic acne around the jawline.",
    tags: ["Acne", "Skin", "Androgens"],
    readTimeMin: 6,
    accentKey: "lavender"
  },

  // PROGRAMS
  {
    id: "prog_cortisol_fix",
    type: "program",
    pillarId: "hormones",
    title: "The Cortisol Fix",
    description: "21 days to lower stress-driven symptoms.",
    body: "This masterclass teaches you to identify your unique stress triggers and implement micro-habits that lower systemic inflammation. Includes breathwork guides and morning sunlight protocols.",
    tags: ["Stress", "Fatigue", "Cortisol"],
    days: 21,
    lessonsCount: 14,
    isPremium: true,
    accentKey: "rose"
  },
  {
    id: "prog_metabolic_reset",
    type: "program",
    pillarId: "nutrition",
    title: "Metabolic Reset",
    description: "14 days to stabilize blood sugar.",
    body: "Master the art of the 'PCOS Plate'. Over 14 days, we rebuild your breakfast, lunch, and dinner to ensure you never feel 'hangry' again while improving your insulin response.",
    tags: ["Low GI", "Nutrition", "Cravings"],
    days: 14,
    lessonsCount: 10,
    accentKey: "sage"
  },
  {
    id: "prog_sync_mastery",
    type: "program",
    pillarId: "cycle_syncing",
    title: "Sync Your Life",
    description: "Align your work and workout with your cycle.",
    body: "Stop fighting your biology. This program shows you how to leverage the 'superpowers' of each phase—from follicular creativity to ovulatory confidence.",
    tags: ["Syncing", "Fertility", "Energy"],
    days: 28,
    lessonsCount: 8,
    isPremium: true,
    accentKey: "lavender"
  },
  {
    id: "prog_lab_decoder",
    type: "program",
    pillarId: "labs_supplements",
    title: "Lab Results Decoder",
    description: "Understand your bloodwork like a pro.",
    body: "We walk through the 'optimal' ranges for PCOS—which are often different from standard lab 'normal' ranges. Covers HbA1c, Fasting Insulin, and Androgen panels.",
    tags: ["Labs", "Supplements", "Data"],
    days: 7,
    lessonsCount: 6,
    accentKey: "blue"
  },
  {
    id: "prog_fertility_prep",
    type: "program",
    pillarId: "cycle_syncing",
    title: "Fertility Prep",
    description: "Optimizing egg quality over 90 days.",
    body: "It takes 90 days for an egg to mature. This program focuses on the specific antioxidants and lifestyle shifts needed to support healthy ovulation.",
    tags: ["Fertility", "Egg Quality", "Prenatal"],
    days: 90,
    lessonsCount: 24,
    isPremium: true,
    accentKey: "rose"
  },
  {
    id: "prog_morning_ritual",
    type: "program",
    pillarId: "nutrition",
    title: "The Savory Morning",
    description: "7 days to quit the sugar-breakfast habit.",
    body: "A high-protein, savory breakfast is the single most effective change for PCOS. We give you 7 easy recipes and the science of why it works.",
    tags: ["Nutrition", "Breakfast", "Protein"],
    days: 7,
    lessonsCount: 7,
    accentKey: "sage"
  }
];

export const DEFAULT_RECOMMENDATIONS: LearnRecommendation[] = [
  { id: "r1", title: "Manage Cravings", reason: "Based on your high intensity craving logs...", ctaLabel: "Explore", targetId: "art_low_gi_diet", accentKey: "sage" },
  { id: "r2", title: "Stress Recovery", reason: "You've noted high fatigue recently.", ctaLabel: "Join", targetId: "prog_cortisol_fix", accentKey: "rose" },
  { id: "r3", title: "Cycle Basics", reason: "New to hormone tracking?", ctaLabel: "Start", targetId: "prog_sync_mastery", accentKey: "lavender" },
];
