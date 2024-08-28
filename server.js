import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import { startGame } from "./game.js";
import { listRecords } from './record.js';
import { openStore } from './store.js';
import { getUserInventory, getItemNameById } from './items.js';

// 로비 화면을 출력하는 함수
function displayLobby() {
    console.clear();

    // 타이틀 텍스트
    console.log(
        chalk.cyan(
            figlet.textSync('RL- Javascript', {
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        )
    );

    // 상단 경계선
    const line = chalk.magentaBright('='.repeat(50));
    console.log(line);

    // 게임 이름
    console.log(chalk.yellowBright.bold('textRPG 게임에 오신 것을 환영합니다!'));

    // 사용자 인벤토리
    let userInventory = getUserInventory();
    // 아이템 정보를 포맷하여 출력
    function formatItems(items) {
        return Object.keys(items).map(id => {
            const itemName = getItemNameById(id);
            return itemName;
        }).join(', ');
    }

    // 설명 텍스트
    console.log(chalk.green('옵션을 선택해주세요.'));
    console.log();

    // 옵션들
    console.log(chalk.blue('1.') + chalk.white(` 새로운 게임 시작 (보유아이템: [${formatItems(userInventory.items)}] 보유코인: ${userInventory.coins})`));
    console.log(chalk.blue('2.') + chalk.white(' 전용 상점'));
    console.log(chalk.blue('3.') + chalk.white(' 업적 확인하기'));
    console.log(chalk.blue('4.') + chalk.white(' 종료'));

    // 하단 경계선
    console.log(line);

    // 하단 설명
    console.log(chalk.gray('1-4 사이의 수를 입력한 뒤 엔터를 누르세요.'));
}

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
            listRecords();
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
    displayLobby();
    handleUserInput();
}

// 게임 실행
start();

export { start }