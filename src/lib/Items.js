class Item {
  #name;
  #description;
  #effect;
  #price;
  #buyPossible;

  constructor(name, description, effect, price, buyPossible) {
    this.#name = name;
    this.#description = description;
    this.#effect = effect;
    this.#price = price;
    this.#buyPossible = buyPossible;
  }

  // 이름 getter
  get name() {
    return this.#name;
  }

  // 설명 getter
  get description() {
    return this.#description;
  }

  // 효과 getter
  get effect() {
    return this.#effect;
  }

  // 가격 getter
  get price() {
    return this.#price;
  }

  // 구매가능여부 getter
  get buyPossible() {
    return this.#buyPossible;
  }

  // 구매가능여부 setter
  set buyPossible(value) {
    if(typeof(value) !== 'boolean')
      throw new Error('구매가능여부는 boolean 타입이어야 합니다.');

    this.#buyPossible = value;
  }
}

// 아이템 인스턴스 생성
const items = {
  '1': new Item('녹슨검', '공격력 10% 증가', 'atkIncrease10', 100, true),
  '2': new Item('나무방패', '방어 확률 0.1 증가', 'defIncrease10', 150, true)
};

export default items;