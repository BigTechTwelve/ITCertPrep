/**
 * SuperMemo-2 (SM-2) Algorithm Implementation
 * 
 * Quality Ratings:
 * 0: Complete blackout (no recall)
 * 1: Incorrect answer; the correct one remembered
 * 2: Incorrect answer; where the correct one seemed easy to recall
 * 3: Correct answer recalled with serious difficulty
 * 4: Correct answer after some hesitation
 * 5: Perfect recall
 */

export interface SRSItem {
    interval: number; // Days until next review
    repetition: number; // Number of consecutive successful reviews
    ef_factor: number; // Easiness Factor (starts at 2.5)
}

export class SRSAlgorithm {
    static calculate(
        quality: number,
        previousItem: SRSItem = { interval: 0, repetition: 0, ef_factor: 2.5 }
    ): SRSItem {
        let { interval, repetition, ef_factor } = previousItem;

        if (quality >= 3) {
            // Correct response
            if (repetition === 0) {
                interval = 1;
            } else if (repetition === 1) {
                interval = 6;
            } else {
                interval = Math.round(interval * ef_factor);
            }
            repetition += 1;
        } else {
            // Incorrect response
            repetition = 0;
            interval = 1;
        }

        // Update E-Factor
        ef_factor = ef_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

        // EF Factor cannot go below 1.3
        if (ef_factor < 1.3) {
            ef_factor = 1.3;
        }

        return {
            interval,
            repetition,
            ef_factor
        };
    }

    static getNextReviewDate(interval: number): Date {
        const date = new Date();
        date.setDate(date.getDate() + interval);
        return date;
    }
}
