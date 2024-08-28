import chalk from 'chalk';
import readlineSync from 'readline-sync';
import Player from './player.js';
import { Monster, BossMonster } from './monster.js';
import { generateConnectedMap } from './map.js';
import { battle } from './battle.js';
import { addRecords, listRecords } from './record.js';

// 맵 출력 함수
function displayMap(map, player, boss) {
  // 맵 생성 유효성 체크
  if (!Array.isArray(map) || !Array.isArray(map[0])) {
    throw new Error('맵 생성 오류!');
  }
  
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

// 상태 출력 함수
function displayStatus(stage, player, monster) {
  console.log(chalk.yellowBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} | Level: ${player.lv} Exp: ${player.exp} / ${player.expToNext} |\n`) +
    chalk.blueBright(
      `| Player HP: ${player.hp} |\n`,
    ) +
    chalk.redBright(
      `| ${monster.name} HP: ${monster.hp} |`,
    ),
  );
  console.log(chalk.yellowBright(`=====================\n`));
}

const adventure = async (stage, player, boss) => {
  // 콘솔 출력 배열
  let logs = [];

  // 플레이어의 시작 위치
  const playerX = 0;
  const playerY = 0;

  // 보스 위치
  let bossX, bossY;
  while (1) {
    // 맵 크기를 유동적으로 바꾸려면 10을 map[0].length / map.length로 
    bossX = Math.floor(Math.random() * 10);
    bossY = Math.floor(Math.random() * 10);
    
    // 플레이어 위치와 겹치지 않으면 반복 종료
    if (bossX !== playerX || bossY !== playerY)
      break;
  }

  // 10, 10 크기의 맵 생성
  const map = generateConnectedMap(10, 10, playerX, playerY, bossX, bossY);
  
  // 보스 위치 할당
  boss.x = bossX;
  boss.y = bossY;

  // 게임 로직
  while (player.hp > 0) {
    // 콘솔 초기화
    console.clear();
    // 상태창과 맵 출력
    displayStatus(stage, player, boss);
    displayMap(map, player, boss);
    // 콘솔 배열 출력
    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 이동하기. 2. 탈출하기. 3. 게임종료.`,
      ),
    );

    const choice = readlineSync.question('당신의 선택은? ');
    switch (choice) {
      case '1':
        // 이동하기

        // 이동 시 유효한 입력 배열
        const validChoices = ['w', 'a', 's', 'd'];
        let moveChoice;
        while(1) {
          moveChoice = readlineSync.question(
            chalk.green(
              `\n이동 방향을 선택하세요 ( W 상, S 하, A 좌, D 우 ) : `,
            )
          );
          // 유효한 입력인 경우
          if (validChoices.includes(moveChoice)) {
            switch (moveChoice) {
              case 'w':
                player.move('up', map);
                break;
              case 'a':
                player.move('left', map);
                break;
              case 's':
                player.move('down', map);
                break;
              case 'd':
                player.move('right', map);
                break;
            }
            // 루프 종료
            break;
          }
          else
            console.log(chalk.red('잘못된 입력입니다. 다시 시도해 주세요.'));
        }

        // 보스 조우
        if (player.x === boss.x && player.y === boss.y) {
          console.log(chalk.red('보스와 조우했습니다!!!'));
          // 3초 지연 후 보스 배틀
          await delayFunc(3000);
          await battle(stage, player, boss);

          // 보스 처치 시 
          if (boss.hp <= 0) {
            console.log(chalk.greenBright(`스테이지 ${stage} 클리어! 다음 스테이지로 넘어갑니다.`));
            // 플레이어 위치 초기화
            player.x = 0, player.y = 0;
            // 플레이어 체력 회복
            player.hp += 10;
            if(player.hp > player.maxHp)
              player.hp = player.maxHp;
            // 3초 딜레이
            await delayFunc(3000);
            return;
          }
          break;
        }

        // 몬스터와 조우 시도
        if (player.encounterMonster()) {
          console.log(chalk.red('몬스터와 조우했습니다!'));
          // 3초 지연
          await delayFunc(3000);
          // 일반 몬스터 생성 후 배틀
          const monster = new Monster(stage);
          await battle(stage, player, monster);
        }

        break;
        
      case "2":
        // 스테이지 탈출(자동 클리어)

        // 10% 탈출 성공
        const escapeChance = Math.random();
        if (escapeChance > 0.9) {
          console.log(chalk.greenBright(`스테이지 ${stage} 에서 탈출 성공! 다음 스테이지로 넘어갑니다.`));
          // 플레이어 위치 초기화
          player.x = 0, player.y = 0;
          // 3초 딜레이
          await delayFunc(3000);
          return;
        }
        else {
          // 90% 탈출 실패
          console.log(chalk.red('탈출에 실패했습니다! 몬스터와 조우합니다.'));
          // 3초 지연
          await delayFunc(3000);
          // 몬스터 조우
          const monster = new Monster(stage);
          await battle(stage, player, monster);
        }
        break;

      case '3':
        // 게임 종료 로직
        await endGame(player, stage);
        // 프로그램 종료
        process.exit(); 
        break;
        
      default:
        console.log(chalk.red('잘못된 선택입니다. 다시 시도해 주세요.'));
    }
  }
};

const startGame = async () => {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const boss = new BossMonster(stage);
    await adventure(stage, player, boss);

    if(player.hp <= 0)
      break;

    stage++;
  }

  if (stage > 10) {
    console.log('모든 스테이지를 클리어했습니다! 축하합니다!');
    endGame(player, 10);
    return;
  }
}

// 게임 종료 시 호출되는 함수
const endGame = (player, stage) => {
  console.log(chalk.yellowBright('게임 종료!'));

  // 사용자 입력 받기
  const nickname = readlineSync.question('플레이어 닉네임을 입력하세요: ');
  const level = player.lv; // 현재 레벨
  const exp = player.exp; // 현재 경험치
  const currentStage = stage; // 현재 스테이지

  // 업적 추가
  addRecords(nickname, level, exp, currentStage);

  // 업적 확인
  console.log(chalk.yellowBright('업적이 저장되었습니다!'));
  listRecords(); // 저장된 업적 목록 출력
}

// 대기 함수(시간 지연)
function delayFunc(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { startGame, endGame, displayStatus, delayFunc }