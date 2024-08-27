// 맵 생성 함수
function generateConnectedMap(width, height, startX, startY, bossX, bossY) {
  const map = Array.from({ length: height }, () => Array(width).fill('.'));
  const visited = Array.from({ length: height }, () => Array(width).fill(false));
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
    
    while (queue.length) {
      const [x, y] = queue.shift();

      // 목적지에 도달하면 중단
      if (x === endX && y === endY)
        break;

      const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0] // 아래, 오른쪽, 위, 왼쪽
      ];

      for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;

        if (newX >= 0 && newX < width && newY >= 0 && newY < height && !visited[newY][newX]) {
          visited[newY][newX] = true;
          queue.push([newX, newY]);
          parent[`${newX},${newY}`] = `${x},${y}`;
          if (newX === endX && newY === endY) {
            // 도착 지점에 도달했으면 경로 재구성
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
      // 첫번째 배열 제외
      if((y === 0 && x === 0) || (x === bossX && y === bossY))
        continue;
      // 현재 위치가 경로에 없는 경우에만 장애물을 추가
      if (map[y][x] === '.' && Math.random() > 0.7 && !path.has(`${x},${y}`)) {
        map[y][x] = 'X'; // 장애물
      }
    }
  }

  return map;
}

export { generateConnectedMap };