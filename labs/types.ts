
export type LabCategory =
  | "Metabolic"
  | "Hormones"
  | "Lipids"
  | "Thyroid"
  | "Vitamins"
  | "Inflammation"
  | "Other";

export type LabMarkerId =
  | "fasting_glucose"
  | "fasting_insulin"
  | "hba1c"
  | "ogtt_2hr_glucose"
  | "total_testosterone"
  | "free_testosterone"
  | "dheas"
  | "lh"
  | "fsh"
  | "lh_fsh_ratio"
  | "progesterone"
  | "estradiol"
  | "prolactin"
  | "tsh"
  | "free_t4"
  | "vitamin_d"
  | "b12"
  | "lipid_total"
  | "ldl"
  | "hdl"
  | "triglycerides"
  | "crp"
  | string; // Allow custom strings for custom markers

export type Unit =
  | "mg/dL"
  | "mmol/L"
  | "µIU/mL"
  | "mIU/L"
  | "ng/dL"
  | "pg/mL"
  | "nmol/L"
  | "pmol/L"
  | "IU/L"
  | "ng/mL"
  | "µg/dL"
  | "%";

export interface LabMarkerDefinition {
  id: LabMarkerId;
  name: string;
  category: LabCategory;
  defaultUnit: Unit;
  altUnits?: Unit[];
  description: string;
  whyItMatters: string;
  tips?: string[];
  referenceRangeText?: string;
  isCustom?: boolean;
}

export interface LabResult {
  id: string;
  markerId: LabMarkerId;
  markerName: string;
  category: LabCategory;
  value: number;
  unit: Unit;
  date: string; // YYYY-MM-DD
  cycleDay?: number;
  phase?: "menstrual" | "follicular" | "ovulatory" | "luteal";
  fasting?: boolean;
  labName?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}
