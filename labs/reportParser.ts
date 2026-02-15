
import { LabMarkerId, LabCategory, Unit } from './types';
import { DEFAULT_MARKERS } from './defaultMarkers';

export interface ParsedCandidate {
  markerId: LabMarkerId | "unknown";
  markerName: string;
  value?: number;
  unit?: Unit;
  category: LabCategory;
  confidence: number;
  rawLine?: string;
  needsReview: boolean;
}

// Synonyms map for matching OCR text to our internal IDs
const SYNONYMS: Record<string, LabMarkerId[]> = {
  "fasting_glucose": ["glucose", "fasting glucose", "glucose, fasting", "serum glucose"],
  "fasting_insulin": ["insulin", "fasting insulin", "serum insulin", "insulin, fasting"],
  "hba1c": ["hba1c", "a1c", "glycated hemoglobin", "hemoglobin a1c"],
  "total_testosterone": ["total testosterone", "testosterone", "testosterone, total", "tst"],
  "vitamin_d": ["vitamin d", "vit d", "25-oh vitamin d", "25-hydroxyvitamin d"],
  "crp": ["crp", "c-reactive protein", "hs-crp"],
};

/**
 * Parses raw extracted text line by line to find lab values.
 */
export const parseReportText = (text: string): ParsedCandidate[] => {
  const lines = text.split('\n');
  const candidates: ParsedCandidate[] = [];

  lines.forEach(line => {
    const cleanLine = line.toLowerCase().trim();
    if (!cleanLine) return;

    // Look for numbers in the line
    const numericMatch = line.match(/(\d+(\.\d+)?)/);
    if (!numericMatch) return;

    const value = parseFloat(numericMatch[0]);

    // Check against synonyms
    let matchedMarker = DEFAULT_MARKERS.find(m => {
      const syns = SYNONYMS[m.id] || [m.name.toLowerCase()];
      return syns.some(s => cleanLine.includes(s));
    });

    if (matchedMarker) {
      // Determine unit if present in line
      const unitMatch = line.match(/(mg\/dl|mmol\/l|µiu\/ml|miu\/l|ng\/dl|pg\/ml|nmol\/l|pmol\/l|iu\/l|ng\/ml|µg\/dl|%)/i);
      const unit = (unitMatch ? unitMatch[0] : matchedMarker.defaultUnit) as Unit;

      candidates.push({
        markerId: matchedMarker.id,
        markerName: matchedMarker.name,
        value,
        unit,
        category: matchedMarker.category,
        confidence: 0.9,
        rawLine: line.trim(),
        needsReview: false
      });
    }
  });

  return candidates;
};
