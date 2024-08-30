import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { start } from '../../server.js';
import UserInventory from '../lib/UserInventory.js';

function openStore() {
  console.clear();
  // 상단 경계선
  const line = chalk.blueBright('='.repeat(50));
  console.log(line);
  console.log(chalk.yellowBright('\ntextRPG 상점에 오신 것을 환영합니다!\n'));
  console.log(line);

  console.log(chalk.green(`\n1. 구매. 2. 상점 나가기.`));

  while(1){
    const choice = readlineSync.question('입력: ');
    switch (choice) {
      case '1':
        // 콘솔 정리 후 생성
        console.clear();
        console.log(line);
        console.log(chalk.yellowBright('\ntextRPG 상점에 오신 것을 환영합니다!\n'));
        console.log(line);
        handleUserInput();
        return;
      case '2':
        start();
        return;
      default:
        console.log(chalk.red('올바른 선택을 하세요.'));
    }
  }
}

// 유저 입력을 받아 처리하는 함수
function handleUserInput() {
  console.log(chalk.yellow('\n0. 상점 나가기'));
  // 아이템 목록 출력
  UserInventory.displayItems();

  while(1){
    const buyChoice = readlineSync.question('\n구매할 물품: ');
    switch (buyChoice){
      case "0":
        start();
        break;
      case "1":
      case "2":
        // 구매 후 아이템 목록 갱신
        UserInventory.buyItem(buyChoice);
        UserInventory.displayItems();
        break;
      default:
        console.log(chalk.red('올바른 선택을 하세요.'));
    }

    if (buyChoice === "0")
      break;
  }
}

export { openStore }