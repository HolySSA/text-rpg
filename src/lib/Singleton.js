/*
 * 싱글톤 패턴을 구현한 기본 클래스.
 * 싱글톤 : 특정 클래스의 인스턴스가 애플리케이션 내에서 단 하나만 생성되도록 보장하는 디자인 패턴.
 * 이 클래스를 상속받으면 하나의 인스턴스만 생성된다.
 */

class Singleton {
  constructor() {
    // 만약 클래스의 인스턴스가 이미 존재하면 해당 인스턴스를 반환.
    if (this.constructor.instance) {
      return this.constructor.instance;
    }

    // 존재하지 않는다면 현재 인스턴스를 저장.
    this.constructor.instance = this;
  }
}

export default Singleton;
