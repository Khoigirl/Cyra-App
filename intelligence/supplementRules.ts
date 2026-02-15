
import { DailyLog } from '../context/WellnessContext';
import { Recommendation } from './types';

// ---------- helpers ----------
const norm = (s: string) => s.trim().toLowerCase();

function countSymptomDays(
  logs: DailyLog[],
  symptomName: string,
  minIntensity: number,
  windowDays = 7
) {
  const recent = logs.slice(-windowDays);
  return recent.filter((day) =>
    (day.symptomLogs ?? []).some((log) => 
      log.symptoms.some(s => norm(s) === norm(symptomName)) && log.intensity >= minIntensity
    )
  ).length;
}

function countSupplementDays(logs: DailyLog[], supplementName: string, windowDays = 7) {
  const recent = logs.slice(-windowDays);
  return recent.filter((day) =>
    // Fix: day.supplements is string[] containing names of taken supplements.
    // Existence in the array implies the supplement was taken.
    (day.supplements ?? []).some((s) => norm(s) === norm(supplementName))
  ).length;
}

function hasEnoughLogs(logs: DailyLog[], minDays = 4, windowDays = 7) {
  const recent = logs.slice(-windowDays);
  // counts days where user logged anything (symptoms or supplements)
  const loggedDays = recent.filter(
    // Fix: d.supplements is string[] - length > 0 means something was taken.
    (d) => (d.symptomLogs && d.symptomLogs.length > 0) || (d.supplements && d.supplements.length > 0)
  ).length;
  return loggedDays >= minDays;
}

// ---------- the full rule bundle ----------
export function getSupplementBasedRecommendations(recentLogs: DailyLog[]): Recommendation[] {
  // If you don't have enough recent data, don't surface these rules yet.
  if (!hasEnoughLogs(recentLogs, 4, 7)) return [];

  const recs: Recommendation[] = [];

  // RULE 1: cravings high + inositol inconsistent
  const cravingsDays = countSymptomDays(recentLogs, "cravings", 3, 7);
  const inositolDays = countSupplementDays(recentLogs, "inositol", 7);

  if (cravingsDays >= 2 && inositolDays <= 3) {
    recs.push({
      id: "supp_cravings_inositol_support",
      category: "food",
      title: "Gentle support for cravings 🌿",
      // Fixed: property 'reason' changed to 'explanation' to match interface definition.
      explanation:
        `You’ve logged cravings on ${cravingsDays} day(s) recently, and inositol hasn’t been very consistent this week (${inositolDays}/7 days).`,
      // Added: missing 'whyItMatters' property required by Recommendation interface.
      whyItMatters: "Consistent inositol supports insulin sensitivity and reduces cravings.",
      action:
        "If it feels doable, try consistent inositol for the next 7 days and notice whether cravings feel steadier.",
      priority: 2,
      triggeredBy: "RULE_SUPP_CRAVINGS_INOSITOL",
    });
  }

  // RULE 2: fatigue high + magnesium inconsistent
  const fatigueDays = countSymptomDays(recentLogs, "fatigue", 3, 7);
  const magnesiumDays = countSupplementDays(recentLogs, "magnesium", 7);

  if (fatigueDays >= 2 && magnesiumDays <= 3) {
    recs.push({
      id: "supp_fatigue_magnesium_support",
      category: "sleep",
      title: "Supporting energy gently",
      // Fixed: property 'reason' changed to 'explanation' to match interface definition.
      explanation:
        `Fatigue showed up on ${fatigueDays} day(s) this week, and magnesium has been a little inconsistent (${magnesiumDays}/7 days).`,
      // Added: missing 'whyItMatters' property required by Recommendation interface.
      whyItMatters: "Magnesium supports the nervous system and metabolic recovery.",
      action:
        "You might try magnesium more consistently in the evening for a week and see how your energy feels.",
      priority: 2,
      triggeredBy: "RULE_SUPP_FATIGUE_MAGNESIUM",
    });
  }

  // RULE 3: acne high + spearmint inconsistent
  const acneDays = countSymptomDays(recentLogs, "acne", 3, 7);
  const spearmintDays = countSupplementDays(recentLogs, "spearmint tea", 7);

  if (acneDays >= 2 && spearmintDays <= 3) {
    recs.push({
      id: "supp_acne_spearmint_support",
      category: "cycle",
      title: "Skin-supportive option",
      // Fixed: property 'reason' changed to 'explanation' to match interface definition.
      explanation:
        `You’ve noted acne on ${acneDays} day(s) recently, and spearmint tea hasn’t been consistent this week (${spearmintDays}/7 days).`,
      // Added: missing 'whyItMatters' property required by Recommendation interface.
      whyItMatters: "Spearmint tea has anti-androgenic properties that can help clear hormonal acne.",
      action:
        "If you’re open to it, try a daily cup of spearmint tea for a short period and observe any changes in your skin.",
      priority: 3,
      triggeredBy: "RULE_SUPP_ACNE_SPEARMINT",
    });
  }

  return recs;
}
