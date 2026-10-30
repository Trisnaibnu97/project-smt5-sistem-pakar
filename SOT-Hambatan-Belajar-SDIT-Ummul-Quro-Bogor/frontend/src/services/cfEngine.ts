import { IndicatorCategory, ScreeningAnswer, CategoryResult } from '../types';

export function calculateCF(
  categories: IndicatorCategory[],
  answers: Record<string, ScreeningAnswer>
): CategoryResult[] {
  return categories.map((cat) => {
    let cfCombined: number | null = null;
    const supporting: { teks: string; jawaban: string }[] = [];
    const missing: string[] = [];
    let answeredCount = 0;

    cat.indikator.forEach((ind) => {
      const a = answers[ind.id];
      if (!a || a.cfUser === null) {
        missing.push(ind.teks);
        return;
      }

      answeredCount++;
      const cfExpert = Math.max(0, ind.mb - ind.md);
      const cfEvidence = a.cfUser * cfExpert;

      if (cfCombined === null) {
        cfCombined = cfEvidence;
      } else if (cfCombined >= 0 && cfEvidence >= 0) {
        cfCombined = cfCombined + cfEvidence * (1 - cfCombined);
      } else {
        cfCombined = (cfCombined + cfEvidence) / (1 - Math.min(Math.abs(cfCombined), Math.abs(cfEvidence)));
      }

      if (a.cfUser >= 0.5) {
        const labelMap: Record<string, string> = {
          kadang: 'Kadang (3–4×/minggu)',
          sering: 'Sering (hampir setiap hari)',
          selalu: 'Selalu',
        };
        supporting.push({
          teks: ind.teks,
          jawaban: labelMap[a.answer] || a.answer,
        });
      }
    });

    const isInsufficient = answeredCount < cat.indikator.length * 0.5;
    const cf = !isInsufficient && cfCombined !== null ? Math.max(0, Math.min(1, cfCombined)) : null;

    return {
      kategori: cat.kategori,
      cf,
      isInsufficient,
      supporting,
      missing,
    };
  });
}

export interface CFLabelInfo {
  text: string;
  color: string;
  bg: string;
  bar: string;
}

export function getCFLabel(cf: number | null, isInsufficient: boolean): CFLabelInfo {
  if (isInsufficient) {
    return {
      text: 'Belum cukup data (< 50% indikator teramati)',
      color: 'text-muted',
      bg: 'bg-gray-100',
      bar: 'bg-gray-300',
    };
  }
  if (cf === null) {
    return {
      text: 'Belum cukup informasi',
      color: 'text-muted',
      bg: 'bg-gray-100',
      bar: 'bg-gray-300',
    };
  }
  if (cf < 0.25) {
    return {
      text: 'Indikasi rendah — stimulasi belajar umum',
      color: 'text-primary-dark',
      bg: 'bg-primary-light',
      bar: 'bg-primary',
    };
  }
  if (cf < 0.55) {
    return {
      text: 'Indikasi sedang — disarankan pendampingan & konsultasi BK',
      color: 'text-warning',
      bg: 'bg-accent-light',
      bar: 'bg-accent',
    };
  }
  return {
    text: 'Indikasi kuat — segera jadwalkan observasi mendalam oleh Guru BK',
    color: 'text-danger',
    bg: 'bg-red-50',
    bar: 'bg-danger',
  };
}
