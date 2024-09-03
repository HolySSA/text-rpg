// 맵 생성 함수
function generateMap(width, height, startX, startY, bossX, bossY) {
  // 맵, 방문여부 Array 초기화
  const map = Array.from({ length: height }, () => Array(width).fill('.'));
  const visited = Array.from({ length: height }, () =>
    Array(width).fill(false)
  );
  // 플레이어와 보스 사이의 경로
  const path = new Set();
  // 플레이어와 보스 사이를 이어주는 배열 담기
  function addPath(x, y) {
    path.add(`${x},${y}`);
    map[y][x] = '.';
  }

  // bfs 이용 경로 생성
  function bfs(startX, startY, endX, endY) {
    const queue = [[startX, startY]];
    const parent = {};
    visited[startY][startX] = true;
    addPath(startX, startY);

    // queue가 텅 빌때까지 루프
    while (queue.length) {
      // 큐에서 꺼낸 값 x, y로 저장
      const [x, y] = queue.shift();

      // 목적지에 도달하면 중단
      if (x === endX && y === endY) break;

      const directions = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0], // 아래, 오른쪽, 위, 왼쪽
      ];

      // 보스와 플레이어는 항상 이어져있어야 하므로 해당 경로 추적
      for (const [dx, dy] of directions) {
        // 방향에 따른 노드
        const newX = x + dx;
        const newY = y + dy;

        // 유효한 범위 체크
        if (
          newX >= 0 &&
          newX < width &&
          newY >= 0 &&
          newY < height &&
          !visited[newY][newX]
        ) {
          // 방문 업데이트
          visited[newY][newX] = true;
          // 방문했으니 queue에 추가
          queue.push([newX, newY]);
          // 부모 노드 업데이트
          parent[`${newX},${newY}`] = `${x},${y}`;
          // 도착 지점 도달하면
          if (newX === endX && newY === endY) {
            // 경로 재구성
            let [px, py] = [endX, endY];
            while (parent[`${px},${py}`]) {
              [px, py] = parent[`${px},${py}`].split(',').map(Number);
              addPath(px, py);
            }

            return;
          }
        }
      }
    }
  }

  bfs(startX, startY, bossX, bossY);

  // 장애물 추가 (연결된 경로를 방해하지 않도록)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // 처음(플레이어) 지점과 마지막(보스) 지점 제외
      if ((y === 0 && x === 0) || (x === bossX && y === bossY)) continue;
      // 플레이어와 보스 사이 최단 경로에 포함X
      if (map[y][x] === '.' && Math.random() > 0.7 && !path.has(`${x},${y}`)) {
        // 장애물 추가
        map[y][x] = 'X';
      }
    }
  }

  return map;
}

export { generateMap };
