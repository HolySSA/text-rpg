import chalk from 'chalk';
import fs from 'fs';
const path = './items.json';

// 아이템 데이터
const items = {
  '1': { name: '녹슨검', description: '공격력 10% 증가', effect: 'atkIncrease10', price: 100, buyPossible: true },
  '2': { name: '나무방패', description: '방어 확률 0.1 증가', effect: 'defIncrease10', price: 150, buyPossible: true }
};

// 기본 인벤토리
let defaultInventory = {
  coins: 150, // 사용자의 시작 금액
  items: {}   // 구매한 아이템을 저장
};

// JSON 파일에서 사용자 데이터 불러오기
function loadUserData() {
  if (fs.existsSync(path)) {
    const data = fs.readFileSync(path, 'utf8');
    return JSON.parse(data);
  }
  else {
    // 파일이 존재하지 않으면 기본값으로 초기화하고 저장
    saveUserData(defaultInventory);
    return defaultInventory;
  }
}

// 사용자 데이터를 JSON 파일에 저장
function saveUserData(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
}

// 사용자 데이터 로드
let userInventory = loadUserData();

// 코인 업데이트
function updateUserCoins(amount) {
  userInventory.coins += amount;
  saveUserData(userInventory);
}

// 아이템 목록 출력
function displayItems() {
  console.log(chalk.green('\n구매 가능한 아이템 목록:'));
  for (const [id, item] of Object.entries(items)) {
    if (userInventory.items[id])
      console.log(chalk.white(`${id}. ${item.name} - ${item.description}`) + chalk.blue(` (보유한 무기)`));
    else if (item.buyPossible)
      console.log(chalk.white(`${id}. ${item.name} - ${item.description}`) + chalk.white(` (${item.price} 코인)`));
    else
      console.log(chalk.white(`${id}. ${item.name} - ${item.description}`) + chalk.red(` (구매 불가)`));
  }
}

// 아이템 구매 로직
function buyItem(itemId) {
  const item = items[itemId];
  if (!item) {
    console.log(chalk.red('잘못된 무기 ID입니다.'));
    return;
  }

  if (userInventory.items[itemId]) {
    console.log(chalk.red('해당 무기는 이미 보유중입니다.'));
    return;
  }

  if (userInventory.coins < item.price) {
    console.log(chalk.red('코인이 부족합니다.'));
    return;
  }

  // 무기 구매 처리
  userInventory.items[itemId] = true; // 아이템을 구매한 것으로 설정
  updateUserCoins(-item.price); // 코인 업데이트
  // 무기 구매 후 구매 불가로 변경
  items[itemId].buyPossible = false;

  console.log(chalk.green(`${item.name}을(를) 구매했습니다. 남은 코인: ${userInventory.coins}`));
}

// 유저 인벤토리 불러오기
function getUserInventory() {
  return userInventory;
}

// 아이템 Id 불러오기
function getItemNameById(itemId) {
  return items[itemId] ? items[itemId].name : '알 수 없는 아이템';
}

// 아이템 효과 불러오기
function getItemEffect(itemId) {
  return items[itemId] ? items[itemId].effect : null;
}

export {
  displayItems,
  buyItem,
  updateUserCoins,
  getUserInventory,
  getItemNameById,
  getItemEffect
};
