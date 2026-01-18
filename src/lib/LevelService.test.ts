import { describe, it, expect } from 'vitest';
import { LevelService } from './LevelService';

describe('LevelService', () => {
    it('should calculate initial progress correctly', () => {
        expect(LevelService.getLevel(0)).toBe(1);
        expect(LevelService.getProgress(0)).toBe(0);
    });

    it('should calculate level up thresholds', () => {
        expect(LevelService.getLevel(99)).toBe(1);
        expect(LevelService.getLevel(100)).toBe(2);
        expect(LevelService.getLevel(400)).toBe(3);
    });

    it('should return correct XP for next level', () => {
        const xp = LevelService.getXPForNextLevel(1);
        expect(xp).toBeGreaterThan(0);
    });
});
