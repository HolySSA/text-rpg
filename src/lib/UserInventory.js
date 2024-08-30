import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import Singleton from "./Singleton.js";
import Items from './Items.js';

class UserInventory extends Singleton {
  #coins;
  #items;
  #jsonPath = '';

  constructor(coins = 150, items = {}) {
    super();

    this.#jsonPath = path.join(process.cwd(), './resources/Inventory.json');

    this.#coins = coins;
    this.#items = {};

    this.#loadUserData();
  }

  // 코인 getter
  get coins() {
    return this.#coins;
  }

  // 아이템 getter
  get items() {
    return this.#items;
  }

  // 아이템 Id 불러오기
  getItemNameById(itemId) {
    return this.#items[itemId] ? this.#items[itemId].name : '알 수 없는 아이템';
  }

  // 아이템 효과 불러오기
  getItemEffect(itemId) {
    return this.#items[itemId] ? this.#items[itemId].effect : null;
  }

  // 인벤토리 로드
  #loadUserData() {
    if (fs.existsSync(this.#jsonPath)) {
      const data = fs.readFileSync(this.#jsonPath, 'utf8');
      const parsedData = JSON.parse(data);
      this.#coins = parsedData.coins;
      // 구매한 아이템만 #items에 저장
      this.#items = {};
      for (const [id] of Object.entries(parsedData.items)) {
        if (Items[id]) {
          this.#items[id] = Items[id];  // Items에서 인스턴스를 가져와서 사용
        }
      }
    }
    else {
      // 기본값으로 json파일 생성.
      this.saveUserData();
    }
  }

  // 인벤토리 저장
  saveUserData() {
    const data = {
      coins: this.#coins,
      items: {}
    };

    // 구매한 아이템 ID만 저장
    for (const id of Object.keys(this.#items)) {
      data.items[id] = true;
    }

    fs.writeFileSync(this.#jsonPath, JSON.stringify(data, null, 2), 'utf8');
  }

  // 코인 업데이트
  updateUserCoins(amount) {
    this.#coins += amount;
    // 데이터 저장
    this.saveUserData();
  }

  // 보유 아이템 이름만 포맷하여 출력
  formatItemsName() {
    return Object.keys(this.#items).map((id) => {
      const item = this.#items[id];
      return item ? item.name : '알 수 없는 아이템';
    }).join(', ');
  }

  // 아이템 목록 출력
  displayItems() {
    console.log(chalk.green('\n구매 가능한 아이템 목록:'));
    // Item 전체 탐색
    for (const [id, item] of Object.entries(Items)) {
      if (this.#items[id])
        console.log(chalk.white(`${id}. ${item.name} - ${item.description}`) + chalk.blue(` (보유한 무기)`));
      else if (item.buyPossible)
        console.log(chalk.white(`${id}. ${item.name} - ${item.description}`) + chalk.white(` (${item.price} 코인)`));
      else
        console.log(chalk.white(`${id}. ${item.name} - ${item.description}`) + chalk.red(` (구매 불가)`));
    }
  }

  // 아이템 구매
  buyItem(itemId) {
    // 아이템 데이터에서 해당 Id 탐색
    const item = Items[itemId];

    if (!item) {
      console.log(chalk.red('잘못된 무기 ID입니다.'));
      return;
    }

    if (this.#items[itemId]) {
      console.log(chalk.red('해당 무기는 이미 보유중입니다.'));
      return;
    }

    if (this.#coins < item.price) {
      console.log(chalk.red('코인이 부족합니다.'));
      return;
    }

    // 무기 구매 처리
    this.#items[itemId] = item;  // 기존 인스턴스를 사용
    this.updateUserCoins(-item.price);

    // 무기 구매 후 구매 불가로 변경
    item.buyPossible = false;

    console.log(chalk.green(`${item.name}을(를) 구매했습니다. 남은 코인: ${this.#coins}`));
    this.saveUserData(); // 데이터 저장
  }
}

const userInventory = new UserInventory();
export default userInventory;