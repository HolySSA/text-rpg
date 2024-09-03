import chalk from 'chalk';
import UserInventory from '../lib/UserInventory.js';
import Utils from '../lib/Utils.js';
import DotenvConfig from '../lib/dotenv_config.js';

class Player {
  constructor() {
    // 체력 관련
    this.hp = 100;
    this.maxHp = 100;

    // 공격력 관련
    this.atk = 10;
    this.atkTimes = 1;

    // 방어력 관련
    this.counterChance = 0.1;
    this.defChance = 0.2;

    // 레벨 관련
    this.lv = 1;
    this.exp = 0;
    this.expToNext = 10;

    // 위치 관련
    this.x = 0;
    this.y = 0;

    // 보유 무기 효과
    this.applyItemEffects();
  }

  move(direction, map) {
    // 상하좌우 업데이트 (위치 표시)
    const newX =
      this.x + (direction === 'right' ? 1 : direction === 'left' ? -1 : 0);
    const newY =
      this.y + (direction === 'down' ? 1 : direction === 'up' ? -1 : 0);

    // 경계 + 장애물 체크하고 이동
    if (
      newX >= 0 &&
      newX < map[0].length &&
      newY >= 0 &&
      newY < map.length &&
      map[newY][newX] !== 'X'
    ) {
      this.x = newX;
      this.y = newY;
    }
  }

  // 몬스터 조우 함수
  encounterMonster() {
    // 30% 확률
    if (Math.random() < DotenvConfig.encounterMonsterChanceThreshold)
      return true;

    return false;
  }

  // 공격
  attack(monster) {
    const minAtk = Math.ceil(this.atk * 0.5); // 대략 50%
    const maxAtk = Math.floor(this.atk * 1.5); // 대략 150%

    // randomAtk 값을 저장할 배열
    this.attackValues = [];

    // 공격 횟수 설정 (디폴트는 1회, 레벨업 시 연속 공격에 의해 변경 가능성)
    const atkTimes = this.atkTimes || 1;

    for (let i = 0; i < atkTimes; i++) {
      // 공격시 최소~최대 사이의 데미지 / 공격력의 경우 정수가 가독성이 좋으므로 floor로 버리기
      const randomAtk =
        Math.floor(Math.random() * (maxAtk - minAtk + 1)) + minAtk;
      // randomAtk 값 할당
      this.attackValues.push(randomAtk);
      // 몬스터 데미지
      monster.takeDamage(randomAtk);
    }
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      console.log('플레이어 사망...');
      this.hp = 0;
    }
  }

  // 방어
  defense() {
    const randNum = Math.random();
    // 반격 확률, 방어 확률에 따른 반격/방어 성공/실패
    if (randNum < this.counterChance) return 'counter';
    else if (randNum < this.counterChance + this.defChance) return 'defense';
    else return 'failure';
  }

  // 반격
  counterattack(monster) {
    // 카운터 어택 시 공격력의 2배 적용
    this.counterAtk = Math.floor(this.atk * 2);
    // 몬스터 데미지
    monster.takeDamage(this.counterAtk);
  }

  // 경험치 획득
  gainExp(exp) {
    this.exp += exp;
    this.checkLevelUp();
  }

  // 레벨업 체크
  checkLevelUp() {
    // 요구 exp 량보다 많을 경우
    while (this.exp >= this.expToNext) {
      // 경험치 환산 후 레벨업
      this.exp -= this.expToNext;
      this.lv++;
      // 요구 경험치 증가
      this.expToNext = Math.floor(this.expToNext * 1.2);
      console.log(`플레이어 레벨업! Player Level : ${this.lv}`);

      this.levelUpReward();
    }
  }

  // 레벨업 보상 선택
  levelUpReward() {
    const rewards = [
      { type: 'heal', chance: 0.4 }, // 체력 회복 40%
      { type: 'atkIncrease', chance: 0.2 }, // 공격력 증가 20%
      { type: 'defIncrease', chance: 0.2 }, // 방어확률 증가 20%
      { type: 'counterIncrease', chance: 0.1 }, // 반격확률 증가 10%
      { type: 'atkTimes', chance: 0.1 }, // 연속 공격 10%
    ];

    const randNum = Math.random();
    let accumulate = 0;

    // 랜덤값과 확률 누적값을 비교하며 어떤 보상이 선택되었는지 체크
    for (const reward of rewards) {
      accumulate += reward.chance;
      // 랜덤값이 해당 누적값 범위에 들어설 경우
      if (randNum < accumulate) {
        this.applyReward(reward.type);
        break;
      }
    }
  }

  // 랜덤 선택된 보상을 적용
  applyReward(type) {
    switch (type) {
      case 'heal':
        // 최대 체력으로 회복
        this.hp = this.maxHp;
        console.log(chalk.blue('체력이 최대치로 회복되었습니다.'));
        break;
      case 'atkIncrease':
        // 공격력 증가
        this.atk = Math.round(this.atk * 1.5);
        console.log(chalk.blue(`공격력이 ${this.atk}로 증가했습니다.`));
        break;
      case 'defIncrease':
        // 방어 확률 증가
        this.defChance = Utils.toDecimal(this.defChance + 0.1, 2);
        console.log(
          chalk.blue(`방어 확률이 ${this.defChance * 100}%로 증가했습니다.`)
        );
        break;
      case 'counterIncrease':
        // 반격 확률 증가
        this.counterChance = Utils.toDecimal(this.counterChance + 0.1, 2);
        console.log(
          chalk.blue(`반격 확률이 ${this.counterChance * 100}%로 증가했습니다.`)
        );
        break;
      case 'atkTimes':
        // 연속 공격
        if (this.atkTimes < 3) {
          console.log(
            chalk.blue(
              `연속 공격(${this.atkTimes} -> ${this.atkTimes + 1}) 획득!`
            )
          );
          this.atkTimes++;
        } else console.log('기본 공격 횟수는 최대 3회까지 증가할 수 있습니다.');
        break;
      default:
        console.log('잘못된 보상 유형입니다.');
        break;
    }
  }

  // 스타팅 무기 장착했을 경우 해당 효과 적용
  applyItemEffects() {
    // 보유 아이템 체크
    for (const itemId of Object.keys(UserInventory.items)) {
      const effect = UserInventory.getItemEffect(itemId);
      const itemName = UserInventory.getItemNameById(itemId);
      // 아이템(효과) 존재 시 적용
      if (effect) {
        this.applyEffect(itemName, effect);
      }
    }
  }

  // 아이템 효과 적용
  applyEffect(itemName, effect) {
    switch (effect) {
      case 'atkIncrease10':
        // 녹슨검
        this.atk = Math.round(this.atk * 1.1);
        console.log(
          chalk.blue(`${itemName}에 의해 공격력이 ${this.atk}로 증가했습니다.`)
        );
        break;
      case 'defIncrease10':
        // 나무방패
        this.defChance = Utils.toDecimal(this.defChance + 0.1, 2);
        console.log(
          chalk.blue(
            `${itemName}에 의해 방어 확률이 ${this.defChance * 100}%로 증가했습니다.`
          )
        );
        break;
      default:
        console.log(chalk.red('알 수 없는 효과입니다.'));
    }
  }

  /* 체력 무한
  cheat() {
    this.hp = this.maxHp;
  }
  */
}

export default Player;
