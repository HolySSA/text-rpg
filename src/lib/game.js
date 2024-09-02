import chalk from 'chalk';
import readlineSync from 'readline-sync';
import Player from '../characters/player.js';
import { BossMonster } from '../characters/monster.js';
import Records from './Records.js';
import { adventure } from '../scenes/Adventure.js';

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
const endGame = async (player, stage) => {
  console.log(chalk.yellowBright('게임 종료!'));

  // 사용자 입력 받기
  const nickname = readlineSync.question('플레이어 닉네임을 입력하세요: ');
  const level = player.lv; // 현재 레벨
  const exp = player.exp; // 현재 경험치
  const currentStage = stage; // 현재 스테이지

  // 업적 추가
  Records.addRecords(nickname, level, exp, currentStage);

  // 업적 확인
  console.log(chalk.yellowBright('업적이 저장되었습니다!'));
  // 저장된 업적 목록 출력
  Records.listRecords();
}

export { startGame, endGame }