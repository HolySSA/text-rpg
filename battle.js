import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { displayStatus, waitFunc, endGame } from './game.js';

// 배틀 로직
const battle = async (stage, player, monster) => {
  let logs = [];

  console.log(chalk.red('몬스터와 전투 중...'));
  // 몬스터와의 전투 로직
  while(player.hp > 0 && monster.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격하기. 2. 도망가기.`,
      ),
    );

    const choice = readlineSync.question('당신의 선택은? ');
    switch (choice) {
      case '1':
        player.attack(monster);
        logs.push(chalk.blue(`몬스터에게 ${player.attackValues}의 피해를 입혔습니다!`));

         // 몬스터의 살아있다면 플레이어 공격
        if (monster.hp > 0) {
          monster.attack(player);
          logs.push(chalk.red(`몬스터가 ${monster.attackValues}의 피해를 입혔습니다!`));
        }
        else {
          // 콘솔 초기화
          console.clear();
          displayStatus(stage, player, monster);
          // 배틀 마무리 콘솔 업데이트
          logs.push(chalk.blue('\n몬스터를 무찔렀습니다!'));
          logs.forEach((log) => console.log(log));
          // 경험치 획득
          const exp = monster.getExp();
          console.log(chalk.green(`몬스터로부터 ${exp} 경험치를 얻었습니다.`));
          player.gainExp(exp);
          // 2초 딜레이
          await waitFunc(2000);
          return;
        }
        break;
        
      case '2':
        // 30% 로 도망가기 성공
        if (Math.random() < 0.3) {
          console.log(chalk.green('몬스터에게서 달아났습니다.'));
          // 2초 딜레이
          await waitFunc(2000);
          return;
        }
        else {
          // 도망가기 실패
          logs.push(chalk.magenta('도망에 실패하여 흥분한 몬스터가 당신을 공격합니다.'));
          monster.attack(player);
          logs.push(chalk.red(`${monster.attackValues}의 피해를 입었습니다!`));
        }
        break;

      default:
        logs.push(chalk.red('\n잘못된 선택입니다. 다시 시도해 주세요.'));
    }

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${choice}를 선택하셨습니다.\n`));

    // 플레이어가 패배했을 때
    if (player.hp <= 0) {
      console.log(chalk.redBright('플레이어가 패배했습니다!'));
      endGame(player, stage);
      return; // 배틀 종료
    }
  }
}

export { battle };