
export const LevelService = {
    /**
     * Calculates level based on points.
     * Formula: Level = Math.floor(Math.sqrt(points / 100)) + 1
     * Examples:
     * 0 pts -> Lvl 1
     * 100 pts -> Lvl 2
     * 400 pts -> Lvl 3
     */
    getLevel(points: number): number {
        return Math.floor(Math.sqrt(points / 100)) + 1;
    },

    /**
     * Returns the XP required for the NEXT level.
     * Formula derived from getLevel: XP = (Level)^2 * 100
     */
    getXPForNextLevel(currentLevel: number): number {
        return Math.pow(currentLevel, 2) * 100;
    },

    /**
     * Returns the XP required for the CURRENT level (base).
     */
    getXPForCurrentLevel(currentLevel: number): number {
        return Math.pow(currentLevel - 1, 2) * 100;
    },

    /**
     * Returns progress percentage (0-100) towards next level.
     */
    getProgress(points: number): number {
        const currentLevel = this.getLevel(points);
        const nextLevelXP = this.getXPForNextLevel(currentLevel);
        const currentLevelBaseXP = this.getXPForCurrentLevel(currentLevel);

        const xpInLevel = points - currentLevelBaseXP;
        const xpNeededInLevel = nextLevelXP - currentLevelBaseXP;

        if (xpNeededInLevel === 0) return 100; // Should not happen with this formula unless level 1 base

        return Math.min(100, Math.max(0, (xpInLevel / xpNeededInLevel) * 100));
    }
};
