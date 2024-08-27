import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor() {
    // 체력 관련
    this.hp = 100;
    this.maxHp = 100;

    // 공격력 관련
    this.atk = 10;
    this.atkTimes = 1;

    // 방어력 관련
    this.counterChance = 0.2;
    this.defChance = 0.3;

    // 레벨 관련
    this.lv = 1;
    this.exp = 0;
    this.expToNext = 10;

    // 위치 관련
    this.x = 0;
    this.y = 0;
  }

  // 방어 확률 set
  setDefChances(counterChance, defChance) {
    this.counterChance = counterChance; // 반격 확률
    this.defChance = defChance; // 방어 확률
  }

  move(direction, map) {
    // 상하좌우 업데이트 (위치 표시)
    const newX = this.x + (direction === 'right' ? 1 : direction === 'left' ? -1 : 0);
    const newY = this.y + (direction === 'down' ? 1 : direction === 'up' ? -1 : 0);

    // 경계 + 장애물 체크하고 이동
    if (newX >= 0 && newX < map[0].length && newY >= 0 && newY < map.length && map[newY][newX] !== 'X') {
      this.x = newX;
      this.y = newY;
    }
  }

  // 몬스터 조우 함수
  encounterMonster() {
    // 30% 확률
    if (Math.random() < 0.7)
      return true;

    return false;
  }

  // 일반 공격 디폴트
  attack(monster) {
    const minAtk = Math.ceil(this.atk * 0.5); // 50%
    const maxAtk = Math.floor(this.atk * 1.5); // 150%

    // randomAtk 값을 저장할 배열
    this.attackValues = [];

    // 공격 횟수 설정 (기본값은 1회, 레벨업 시 변경될 수 있음)
    const atkTimes = this.atkTimes || 1;

    for (let i = 0; i < atkTimes; i++) {
      // 공격시 최소~최대 사이의 데미지 / 공격력의 경우 정수가 가독성이 좋으므로 floor로 버리기
      const randomAtk = Math.floor(Math.random() * (maxAtk - minAtk + 1)) + minAtk;
      // randomAtk 값 저장
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

  // 방어 메소드
  defense() {
    const randNum = Math.random();
    if (randNum < this.counterChance)
      return 'counter';
    else if (randNum < this.counterChance + this.defChance)
      return 'defense';
    else
      return 'failure';
  }

  counterattack(monster) {
    // 카운터 어택 시 2배 데미지
    this.counterAtk = Math.floor(this.atk * 2); 
    // 몬스터 데미지
    monster.takeDamage(this.counterAtk);
  }

  // 경험치 획득
  gainExp(exp) {
    this.exp += exp;
    this.checkLevelUp();
  }

  checkLevelUp() {
    while (this.exp >= this.expToNext) {
      this.exp -= this.expToNext;
      this.lv++;
      // 요구 경험치 증가
      this.expToNext = Math.floor(this.expToNext * 1.2);
      console.log(`플레이어 레벨업! Player Level : ${this.lv}`);

      // 선택 유효 체크
      let choiceCheck = false;
      while (!choiceCheck) {
        // 레벨업 보상 선택
        console.log(
          chalk.blueBright(
            `\n1. 체력회복. 2. 강타(공격력 1.5배 증가). 3. 연속 공격(공격 횟수 증가)`,
          ),
        );
        const choice = readlineSync.question('레벨업 보상을 선택하세요. ');

        switch (choice) {
          case "1": // 체력 회복
            this.hp = this.maxHp; // 최대 체력으로 회복
            console.log(chalk.blue('체력이 최대치로 회복되었습니다.'));
            choiceCheck = true;
            break;
          case "2": // 공격력 증가
            this.atk = Math.round(this.atk * 1.5);
            console.log(chalk.blue(`공격력이 ${this.atk}로 증가했습니다.`));
            choiceCheck = true;
            break;
          case "3":
            if (this.atkTimes < 3) {
              console.log(chalk.blue(`연속 공격(${this.atkTimes} -> ${this.atkTimes+1}) 획득!`));
              this.atkTimes++;
              choiceCheck = true;
            }
            else {
              console.log('기본 공격 횟수는 최대 3회까지 증가할 수 있습니다.');
            }
            break;
          default:
            console.log('잘못된 선택입니다.');
            break;
        }
      }
    }
  }
}

export default Player;