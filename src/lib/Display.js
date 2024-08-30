import chalk from 'chalk';
//import Player from '../../player';
//import { Monster } from '../../monster';
import UserInventory from './UserInventory.js';

class Display {
  // 맵 출력
  static displayMap(map, player, boss) {
    // 맵 생성 유효성 체크
    if (!Array.isArray(map) || !Array.isArray(map[0]))
      throw new Error('맵 생성 오류!');
    
    console.log(chalk.yellowBright('맵 ( P : 플레이어, X : 장애물, B : 보스 )'));
    map.forEach((row, y) => {
      console.log(row.map((cell, x) => {
        if (player.x === x && player.y === y) {
          // 플레이어의 위치
          return chalk.blue('P');
        }
        if (boss && boss.x === x && boss.y === y) {
          // 보스 몬스터의 위치
          return chalk.magenta('B');
        }

        // 장애물이라면 X 표시 아님 . 표시
        return cell === 'X' ? chalk.red('X') : chalk.green('.');
      }).join(' '));
    });
  }

  /** 
   * 스테이지 및 플레이어 정보
   * @param {Player} player - 플레이어
   * @param {Monster} monster - 몬스터
  */
  static displayStatus(stage, player, monster) {
    console.log(chalk.yellowBright(`\n=== Current Status ===`));
    console.log(
      chalk.cyanBright(`| Stage: ${stage} | Level: ${player.lv} Exp: ${player.exp}/${player.expToNext} Coins: ${UserInventory.coins} |\n`) +
      chalk.blueBright(
        `| Player HP: ${player.hp} ATK: ${player.atk} ATK Time: ${player.atkTimes} DEF: ${player.defChance*100}% COUNTER: ${player.counterChance*100}% |\n`,
      ) +
      chalk.redBright(
        `| ${monster.name} HP: ${monster.hp} |`,
      ),
    );
    console.log(chalk.yellowBright(`=====================\n`));
  }
}

export default Display;