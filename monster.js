class Monster {
  // 몬스터 이름 배열
  static stageMonsters = {
    1: ['새끼늑대', '토끼', '뱀'], // 스테이지 1
    2: ['박쥐', '거미'], // 스테이지 2
    3: ['고블린', '고블린창병', '고블린주술사'], // 스테이지 3
    4: ['오우거', '오우거마법사'], // 스테이지 4
    5: ['오크', '트롤', '소거인'], // 스테이지 5
    6: ['그리핀', '유니콘', '미로수문장'], // 스테이지 6
    7: ['좀비', '고스트', '스켈레톤', '스펙터'], // 스테이지 7
    8: ['메두사', '용암도마뱀', '이무기'], // 스테이지 8
    9: ['늑대인간', '키메라', '거인족'], // 스테이지 9
    10: ['드래곤추종자', '거인족', '대마법사'] // 스테이지 10
  };

  static DEFAULT_HP = 7;
  static DEFAULT_ATK = 3;

  constructor(stage) {
    this.hp = Math.floor(Math.random() * (10 - Monster.DEFAULT_HP + 1)) + Monster.DEFAULT_HP;
    this.hp *= stage;
    this.atk = Monster.DEFAULT_ATK;
    this.atk *= stage;
    // 스테이지에 따른 이름 할당
    this.name = this.getNameForStage(stage); 
  }

  // 스테이지 별 몬스터 이름 적용
  getNameForStage(stage) {
    const names = Monster.stageMonsters[stage] || [];
    return names[Math.floor(Math.random() * names.length)] || 'Unknown Monster';
  }

  attack(player) {
    // 1부터 공격력 사이의 랜덤 피해량
    const damage = Math.floor(Math.random() * this.atk) + 1;

    // randomAtk 값을 저장할 배열
    this.attackValues = [];
    // randomAtk 값 저장
    this.attackValues.push(damage);
    player.takeDamage(damage);
  }

  // 데미지 적용
  takeDamage(amount) {
    this.hp -= amount;

    if(this.hp < 0)
      this.hp = 0;
  }

  // 경험치 생성
  getExp() {
    // 1~5 디폴트
    return Math.floor(Math.random() * 5) + 1;
  }

  // 코인 생성
  getCoins(stage) {
    // 스테이지 별 코인 범위
    const minCoin = 1 * stage;
    const maxCoin = 2 * stage;
    
    // 랜덤 코인
    return Math.floor(Math.random() * (maxCoin - minCoin + 1)) + minCoin;
  }
}

// 보스몹 클래스
class BossMonster extends Monster {
  // 보스 이름 배열
  static bossNames = [
    '회색갈기늑대', // 스테이지 1
    '여왕거미', // 스테이지 2
    '고블린로드',   // 스테이지 3
    '쌍두오우거',    // 스테이지 4
    '미노타우르스', // 스테이지 5
    '켄타우로스', // 스테이지 6
    '리치',     // 스테이지 7
    '바실리스크', // 스테이지 8
    '라이칸스로프',  // 스테이지 9
    '드래곤',   // 스테이지 10
  ];

  constructor(stage) {
    super(stage);
    // 보스 이름 할당
    this.name = BossMonster.bossNames[stage - 1] || 'Unknown Boss';
    // 해당 스테이지 몬스터의 10배(해당 hp 랜덤적용)
    this.hp *= 10;
    // 해당 스테이지 몬스터의 2배(해당 hp 랜덤적용)
    this.atk *= 2;
    // 최소공격력
    this.minAtk = Math.ceil(this.atk / 2);
  }

  attack(player) {
    // 최소 데미지와 최대 데미지 사이의 랜덤 피해량
    const damage = Math.floor(Math.random() * (this.atk - this.minAtk + 1)) + this.minAtk;
    // randomAtk 값을 저장할 배열
    this.attackValues = [];
    // randomAtk 값 저장
    this.attackValues.push(damage);
    player.takeDamage(damage);
  }

  // 경험치 생성
  getExp() {
    // 일반 몬스터 경험치의 3배
    return (Math.floor(Math.random() * 5) + 1) * 3;
  }

  // 코인 생성
  getCoins(stage) {
    // 스테이지 별 코인 범위
    const minCoin = 1 * stage;
    const maxCoin = 2 * stage;
    
    // 일반 몬스터의 3배
    return (Math.floor(Math.random() * (maxCoin - minCoin + 1)) + minCoin) * 3;
  }
}

export { Monster, BossMonster };