import { config } from 'dotenv';

// dotenv를 초기화
config();

class DotenvConfig {
  constructor() {
    this.escapeChanceThreshold = parseFloat(process.env.ESCAPE_CHANCE) || 0.9;
    this.runawayChanceThreshold = parseFloat(process.env.RUNAWAY_CHANCE) || 0.3;
    this.encounterMonsterChanceThreshold = parseFloat(process.env.ENCOUNTER_MONSTER_CHANCE) || 0.3;
  }
}

const dotenvConfig = new DotenvConfig();
export default dotenvConfig;