
import { LabMarkerDefinition } from './types';

export const DEFAULT_MARKERS: LabMarkerDefinition[] = [
  {
    id: "fasting_glucose",
    name: "Fasting Glucose",
    category: "Metabolic",
    defaultUnit: "mg/dL",
    description: "Measure of your blood sugar levels after an overnight fast.",
    whyItMatters: "Helps identify insulin resistance, which is common in PCOS and affects energy and cycle regularity.",
    tips: ["Eat a balanced dinner", "Maintain consistent sleep patterns"],
  },
  {
    id: "fasting_insulin",
    name: "Fasting Insulin",
    category: "Metabolic",
    defaultUnit: "µIU/mL",
    description: "Amount of insulin in your blood after fasting.",
    whyItMatters: "High levels can indicate insulin resistance even if glucose is normal, driving androgens up.",
  },
  {
    id: "hba1c",
    name: "HbA1c",
    category: "Metabolic",
    defaultUnit: "%",
    description: "Average blood sugar levels over the past 2–3 months.",
    whyItMatters: "Provides a long-term view of blood sugar management.",
  },
  {
    id: "total_testosterone",
    name: "Total Testosterone",
    category: "Hormones",
    defaultUnit: "ng/dL",
    description: "The total amount of testosterone in your blood.",
    whyItMatters: "Elevated levels can lead to symptoms like acne, hair growth, or thinning hair.",
  },
  {
    id: "lh",
    name: "LH (Luteinizing Hormone)",
    category: "Hormones",
    defaultUnit: "mIU/L",
    description: "Hormone that triggers ovulation.",
    whyItMatters: "In PCOS, LH is often higher than FSH, which can interfere with regular ovulation.",
  },
  {
    id: "fsh",
    name: "FSH (Follicle Stimulating Hormone)",
    category: "Hormones",
    defaultUnit: "mIU/L",
    description: "Hormone that helps control the menstrual cycle and the production of eggs.",
    whyItMatters: "The ratio between LH and FSH is a key indicator for PCOS assessment.",
  },
  {
    id: "tsh",
    name: "TSH",
    category: "Thyroid",
    defaultUnit: "mIU/L",
    description: "Thyroid-stimulating hormone.",
    whyItMatters: "Thyroid issues can mimic or worsen PCOS symptoms like fatigue and irregular periods.",
  },
  {
    id: "vitamin_d",
    name: "Vitamin D",
    category: "Vitamins",
    defaultUnit: "ng/mL",
    description: "Essential nutrient for bone health and immune function.",
    whyItMatters: "Low Vitamin D is very common in PCOS and is linked to insulin resistance and mood shifts.",
  },
  {
    id: "crp",
    name: "CRP (C-Reactive Protein)",
    category: "Inflammation",
    defaultUnit: "mg/dL",
    description: "A marker of systemic inflammation.",
    whyItMatters: "Chronic low-grade inflammation is often present in PCOS and can affect metabolic health.",
  }
];
