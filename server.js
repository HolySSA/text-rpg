import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { startGame } from "./src/lib/Game.js";
import { openStore } from './src/scenes/store.js';
import Records from "./src/lib/Records.js";
import Display from './src/lib/Display.js';

// 유저 입력을 받아 처리
function handleUserInput() {
    const choice = readlineSync.question('입력: ');

    switch (choice) {
        case '1':
            console.log(chalk.green('게임을 시작합니다.'));
            // 여기에서 새로운 게임 시작 로직을 구현
            startGame();
            break;
        case '2':
            // 전용 상점 로직을 구현
            openStore();
            break;
        case '3':
            console.log(chalk.yellow('업적을 확인합니다...'));
            // 업적 확인하기 로직을 구현
            Records.listRecords();
            handleUserInput();
            break;
        case '4':
            console.log(chalk.red('게임을 종료합니다.'));
            // 게임 종료 로직을 구현
            process.exit(0); // 게임 종료
            break;
        default:
            console.log(chalk.red('올바른 선택을 하세요.'));
            handleUserInput(); // 유효하지 않은 입력일 경우 다시 입력 받음
    }
}

// 게임 시작 함수
function start() {
    Display.displayLobby();
    handleUserInput();
}

// 게임 실행
start();

export { start }