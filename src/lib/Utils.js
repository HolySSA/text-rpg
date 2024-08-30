/*
 * Utils : 다양한 유틸리티 함수를 제공하는 클래스
 */

/* 문서화 주석( /** - 일반 주석과 달리 문서화 사용 가능. /*는 문서화 불가 )
* `@param`은 자바스크립트의 주석 문서화 도구에서 사용되는 태그.
* `@return`은 문서화 주석에서 함수 또는 메서드의 반환값에 대한 정보를 설명하는 태그.
* Utils 클래스 사용 시 해당 함수에 마우스를 가져다대면 아래의 설명이 보인다.
*/

class Utils {
  /**
   * 주어진 밀리초(ms) 동안 지연.
   * @param {number} ms - 단위 : 밀리초
   * @returns {Promise<void>} - 지연 완료 후 반환되는 Promise
   */
  static TimeDelay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * @param {number} number - 정수
   * @param {number} decimals - 제곱수
   * @returns {number} - 주로 % 계산 시 사용
   */
  // 바로 계산할 경우 소수점자리 오류가 생기므로 해당 함수로 변환
  static toDecimal(number, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round(number * factor) / factor;
  }

  // 만약 아래에 함수가 더 존재한다면 문서화 주석을 하나 더 선언 후 문서화로 정리하고 함수 선언하는 구조.
  // 아래는 테스트용으로 기입한 함수

  /**
   * 두 숫자를 더한 값을 반환합니다.
   * @param {number} a - 첫 번째 숫자
   * @param {number} b - 두 번째 숫자
   * @returns {number} - 두 숫자의 합
   */
  static add(a, b) {
    return a + b;
  }
}

/*
// 사용 예시 : 마우스 호버 시 해당 설명 표시된다.
Utils.TimeDelay(10);
Utils.add(10);
*/

export default Utils;