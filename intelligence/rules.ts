
import { IntelligenceData, Recommendation, Alert } from './types';

export const runRules = (data: IntelligenceData) => {
  const recommendations: Recommendation[] = [];
  const alerts: Alert[] = [];
  const { todayLog, profile, cycleInfo, recentLogs } = data;

  // --- CYCLE RULES ---
  // 1. Late Period
  if (cycleInfo.daysUntilNext < -7) {
    alerts.push({
      id: 'rule_late',
      severity: 'important',
      title: 'Cycle Update',
      message: 'Your period is a bit later than predicted. This is common with PCOS; focus on lowering stress today.'
    });
  }

  // 2. Luteal Phase + Cravings
  const hasCravings = todayLog.symptomLogs.some(s => s.symptoms.includes('Cravings'));
  if (cycleInfo.phase === 'Luteal' && hasCravings) {
    recommendations.push({
      id: 'rule_luteal_cravings',
      category: 'cycle',
      title: 'Steady Energy Snacks',
      explanation: 'Progesterone levels are rising, which naturally increases your metabolic rate and appetite.',
      whyItMatters: 'Eating consistent, balanced snacks prevents the blood sugar dips that drive intense sugar cravings.',
      action: 'Try pairing an apple with almond butter for stable blood sugar.',
      priority: 1
    });
  }

  // 3. Menstrual Phase Support
  if (cycleInfo.isPeriod) {
    recommendations.push({
      id: 'rule_menstrual_iron',
      category: 'food',
      title: 'Iron-Rich Focus',
      explanation: 'Your body is losing iron through menstrual blood, which can lead to fatigue.',
      whyItMatters: 'Replenishing iron with vitamin C helps maintain your energy levels during your period.',
      action: 'Include spinach or lentils in your next meal to support energy.',
      priority: 2
    });
  }

  // 4. Ovulatory Energy
  if (cycleInfo.phase === 'Ovulatory') {
    recommendations.push({
      id: 'rule_ovulatory_strength',
      category: 'exercise',
      title: 'Gentle Strength',
      explanation: 'Testosterone peaks during ovulation, slightly increasing your strength and physical capacity.',
      whyItMatters: 'Utilizing this natural peak supports muscle tone and metabolic health.',
      action: 'Try a 15-minute bodyweight session if you have the energy.',
      priority: 2
    });
  }

  // --- NUTRITION RULES ---
  // 5. Cravings + Low Protein
  const totalProtein = todayLog.meals.reduce((sum, meal) => 
    sum + meal.items.reduce((iSum, item) => iSum + (item.protein_g || 0), 0), 0
  );
  if (hasCravings && totalProtein < 30) {
    recommendations.push({
      id: 'rule_protein_cravings',
      category: 'food',
      title: 'Protein for Balance',
      explanation: 'You logged cravings, and your protein intake is lower today.',
      whyItMatters: 'Protein is the most satiating macronutrient and helps signal "fullness" to your brain.',
      action: 'Adding a handful of walnuts can help signal fullness to your brain.',
      priority: 1
    });
  }

  // 6. Acne + Dairy
  const hasAcne = todayLog.symptomLogs.some(s => s.symptoms.includes('Acne'));
  const hasDairy = todayLog.meals.some(m => m.items.some(i => i.name.toLowerCase().includes('cheese') || i.name.toLowerCase().includes('milk')));
  if (hasAcne && hasDairy) {
    recommendations.push({
      id: 'rule_acne_dairy',
      category: 'food',
      title: 'Skin Clarity Tip',
      explanation: 'Dairy can stimulate insulin-like growth factor-1 (IGF-1), which may worsen hormonal acne.',
      whyItMatters: 'Reducing dairy during breakout-prone windows can help lower systemic inflammation.',
      action: 'Consider swapping your next dairy item for an almond or coconut alternative.',
      priority: 3
    });
  }

  // 7. High GI Plate check
  if (profile.dietStyle === 'Low GI') {
    const hasHighGI = todayLog.meals.some(m => m.items.some(i => (i.carbs_g || 0) > 40 && (i.fiber_g || 0) < 5));
    if (hasHighGI) {
      recommendations.push({
        id: 'rule_low_gi_balance',
        category: 'food',
        title: 'Balance Your Next Plate',
        explanation: 'Your last meal was higher in refined starches, which can cause a rapid insulin spike.',
        whyItMatters: 'High insulin spikes can signal the ovaries to produce more testosterone.',
        action: 'Add a serving of leafy greens to your next meal to slow glucose absorption.',
        priority: 1
      });
    }
  }

  // 10. Low Calorie support
  const totalCals = todayLog.meals.reduce((sum, meal) => 
    sum + meal.items.reduce((iSum, item) => iSum + item.calories, 0), 0
  );
  if (totalCals > 0 && totalCals < 1200) {
    recommendations.push({
      id: 'rule_under_eating',
      category: 'food',
      title: 'Nurture Your Metabolism',
      explanation: 'Consistently eating too little can stress your body and disrupt your hormonal rhythm.',
      whyItMatters: 'Your body needs adequate fuel to maintain a healthy basal metabolic rate and support regular cycles.',
      action: 'A small snack with healthy fats could be beneficial this evening.',
      priority: 1
    });
  }

  // --- LIFESTYLE & LOGGING ---
  // 11. Low Water
  if (todayLog.water > 0 && todayLog.water < 1.5) {
    recommendations.push({
      id: 'rule_water_low',
      category: 'hydration',
      title: 'Hydration Nudge',
      explanation: 'Water is essential for the liver to effectively process and excrete excess hormones.',
      whyItMatters: 'Proper hydration supports detoxification and reduces bloating.',
      action: 'Try to finish one more glass of water before the day ends.',
      priority: 2
    });
  }

  return { recommendations, alerts };
};
