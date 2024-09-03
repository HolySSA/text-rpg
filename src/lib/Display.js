import chalk from 'chalk';
import figlet from 'figlet';
//import Player from '../../player';
//import { Monster } from '../../monster';
import UserInventory from './UserInventory.js';

class Display {
  // 로비 화면 출력
  static displayLobby() {
    console.clear();

    // 타이틀 텍스트
    console.log(
      chalk.cyan(
        figlet.textSync('RL- Javascript', {
          font: 'Standard',
          horizontalLayout: 'default',
          verticalLayout: 'default',
        })
      )
    );

    // 상단 경계선
    const line = chalk.magentaBright('='.repeat(50));
    console.log(line);

    // 게임 이름
    console.log(
      chalk.yellowBright.bold('textRPG 게임에 오신 것을 환영합니다!')
    );

    // 설명 텍스트
    console.log(chalk.green('옵션을 선택해주세요.'));
    console.log();

    // 옵션들
    console.log(
      chalk.blue('1.') +
        chalk.white(
          ` 새로운 게임 시작 (보유아이템: [${UserInventory.formatItemsName()}] 보유코인: ${UserInventory.coins})`
        )
    );
    console.log(chalk.blue('2.') + chalk.white(' 전용 상점'));
    console.log(chalk.blue('3.') + chalk.white(' 업적 확인하기'));
    console.log(chalk.blue('4.') + chalk.white(' 종료'));

    // 하단 경계선
    console.log(line);

    // 하단 설명
    console.log(chalk.gray('1-4 사이의 수를 입력한 뒤 엔터를 누르세요.'));
  }

  /**
   * 맵 출력
   * @param {map} map - 생성된 맵
   * @param {Player} player - 플레이어
   * @param {BossMonster} boss - 보스몬스터
   */
  static displayMap(map, player, boss) {
    // 맵 생성 유효성 체크
    if (!Array.isArray(map) || !Array.isArray(map[0]))
      throw new Error('맵 생성 오류!');

    console.log(
      chalk.yellowBright('맵 ( P : 플레이어, X : 장애물, B : 보스 )')
    );
    map.forEach((row, y) => {
      console.log(
        row
          .map((cell, x) => {
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
          })
          .join(' ')
      );
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
      chalk.cyanBright(
        `| Stage: ${stage} | Level: ${player.lv} Exp: ${player.exp}/${player.expToNext} Coins: ${UserInventory.coins} |\n`
      ) +
        chalk.blueBright(
          `| Player HP: ${player.hp} ATK: ${player.atk} ATK Time: ${player.atkTimes} DEF: ${player.defChance * 100}% COUNTER: ${player.counterChance * 100}% |\n`
        ) +
        chalk.redBright(`| ${monster.name} HP: ${monster.hp} |`)
    );
    console.log(chalk.yellowBright(`=====================\n`));
  }
}

export default Display;
