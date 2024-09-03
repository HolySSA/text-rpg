import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { endGame } from '../lib/Game.js';
import Utils from '../lib/Utils.js';
import UserInventory from '../lib/UserInventory.js';
import Display from '../lib/Display.js';

// 배틀 로직
const battle = async (stage, player, monster) => {
  let logs = [];

  console.log(chalk.red('몬스터와 전투 중...'));

  // 몬스터와의 전투 로직
  while (player.hp > 0 && monster.hp > 0) {
    // 콘솔창 초기화 및 정리
    console.clear();
    Display.displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(chalk.green(`\n1. 공격하기. 2. 방어하기 3. 도망가기.`));

    const choice = readlineSync.question('당신의 선택은? ');
    switch (choice) {
      case '1':
        // 공격 로직

        player.attack(monster);
        logs.push(
          chalk.blue(`몬스터에게 ${player.attackValues}의 피해를 입혔습니다!`)
        );

        // 몬스터가 살아있다면 플레이어 공격
        if (monster.hp > 0) {
          monster.attack(player);
          logs.push(
            chalk.red(`몬스터가 ${monster.attackValues}의 피해를 입혔습니다!`)
          );
        } else {
          // 콘솔 초기화
          console.clear();
          Display.displayStatus(stage, player, monster);
          // 배틀 마무리 콘솔 업데이트
          logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
          logs.push(chalk.blue('\n몬스터를 무찔렀습니다!'));
          logs.forEach((log) => console.log(log));
          // 코인 획득
          const coins = monster.getCoins(stage);
          console.log(chalk.green(`몬스터로부터 ${coins} 코인을 얻었습니다.`));
          UserInventory.updateUserCoins(coins);
          // 경험치 획득
          const exp = monster.getExp();
          console.log(
            chalk.green(`몬스터로부터 ${exp} 경험치를 얻었습니다.\n`)
          );
          player.gainExp(exp);
          // 3초 딜레이
          await Utils.TimeDelay(3000);
          return;
        }
        break;

      case '2':
        // 방어 로직

        const defenseTry = player.defense();

        if (defenseTry === 'counter') {
          player.counterattack(monster);
          logs.push(
            chalk.blue(
              `반격 성공!!! 몬스터에게 ${player.counterAtk}의 피해를 입혔습니다!`
            )
          );

          // 몬스터 사망 체크
          if (monster.hp <= 0) {
            // 콘솔 초기화
            console.clear();
            Display.displayStatus(stage, player, monster);
            // 배틀 마무리 콘솔 업데이트
            logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
            logs.push(chalk.blue('\n몬스터를 무찔렀습니다!'));
            logs.forEach((log) => console.log(log));
            // 코인 획득
            const coins = monster.getCoins(stage);
            console.log(
              chalk.green(`몬스터로부터 ${coins} 코인을 얻었습니다.`)
            );
            UserInventory.updateUserCoins(coins);
            // 경험치 획득
            const exp = monster.getExp();
            console.log(
              chalk.green(`몬스터로부터 ${exp} 경험치를 얻었습니다.\n`)
            );
            player.gainExp(exp);
            // 3초 딜레이
            await Utils.TimeDelay(3000);
            return;
          }
        } else if (defenseTry === 'defense') {
          logs.push(chalk.blue(`방어 성공! 데미지를 입지 않았습니다!`));
        } else {
          monster.attack(player);
          logs.push(
            chalk.red(`몬스터가 ${monster.attackValues}의 피해를 입혔습니다!`)
          );
        }
        break;

      case '3':
        // 30% 로 도망가기 성공
        if (Math.random() < 0.3) {
          console.log(chalk.green('몬스터에게서 달아났습니다...'));
          // 2초 딜레이
          await Utils.TimeDelay(2000);
          return;
        } else {
          // 도망가기 실패
          logs.push(
            chalk.magenta('도망에 실패하여 흥분한 몬스터가 당신을 공격합니다.')
          );
          monster.attack(player);
          logs.push(chalk.red(`${monster.attackValues}의 피해를 입었습니다!`));
        }
        break;

      default:
        logs.push(chalk.red('\n잘못된 선택입니다. 다시 시도해 주세요.'));
    }

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${choice}를 선택하셨습니다.\n`));

    // 플레이어가 사망 시
    if (player.hp <= 0) {
      // 콘솔창 초기화 및 정리
      console.clear();
      Display.displayStatus(stage, player, monster);
      logs.push(chalk.redBright('플레이어가 패배했습니다!'));
      logs.forEach((log) => console.log(log));
      // 업적 저장 후 게임 종료
      await endGame(player, stage);
      return;
    }
  }
};

export { battle };
