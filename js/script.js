let currentPlayer = '';
let firstDice = 0;
let secondDice = 0;
let diceRollCount = 0; 
let blueScore = 0;
let pinkScore = 0;
let selectedCell; 
let isRolling = false; // 주사위 애니메이션 동작 중 여부 추적

// 3x3 보드 생성
function createBoard() {
    const board = document.getElementById('gameBoard');
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-x', x);
            cell.setAttribute('data-y', y);
            board.appendChild(cell);
        }
    }
}

createBoard();

// 플레이어 선택 함수
function selectPlayer(player) {
    currentPlayer = player;
    const rollDiceBtn = document.getElementById('rollDiceBtn');
    rollDiceBtn.disabled = false;

    const blueCharacter = document.getElementById('blueCharacter');
    const pinkCharacter = document.getElementById('pinkCharacter');

    if (player === 'blue') {
        blueCharacter.classList.add('active');
        blueCharacter.classList.remove('inactive');
        pinkCharacter.classList.add('inactive');
        pinkCharacter.classList.remove('active');
    } else {
        pinkCharacter.classList.add('active');
        pinkCharacter.classList.remove('inactive');
        blueCharacter.classList.add('inactive');
        blueCharacter.classList.remove('active');
    }
}

// // 주사위 초기 회전 각도 설정 (측면에서 보이도록 설정)
// document.getElementById('dice').style.transform = 'rotateY(-90deg)'; // 초기 상태에서 주사위를 측면에서 보이게 설정

// 주사위 굴리기 함수
function rollDice() {
    if (isRolling) return; // 주사위가 굴러가는 중에는 무시
    isRolling = true; // 주사위 굴리는 중임을 표시
    const dice = document.getElementById('dice');
    const rollDiceBtn = document.getElementById('rollDiceBtn');
    rollDiceBtn.disabled = true; // 주사위 굴리는 동안 버튼 비활성화

    // roll 클래스를 추가하여 주사위 구르기 애니메이션 시작
    dice.classList.add('roll');

    setTimeout(() => {
        // roll 클래스를 제거하여 애니메이션 종료
        dice.classList.remove('roll');
        
        // 최종 주사위 값에 맞는 회전 각도로 고정
        const diceValue = Math.floor(Math.random() * 6) + 1;
        const rotationMap = {
            1: { rotateX: -149, rotateY: -538 },
            2: { rotateX: 18, rotateY: -100 },
            3: { rotateX: 18, rotateY: -190 },
            4: { rotateX: 170, rotateY: 280 },
            5: { rotateX: -60, rotateY: -122 },
            6: { rotateX: 120, rotateY: 40 }
        };

        const { rotateX, rotateY } = rotationMap[diceValue];
        dice.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        // 게임 로직 반영
        diceRollCount++;
        if (diceRollCount === 1) {
            firstDice = diceValue;
            document.getElementById('firstDiceValue').textContent = firstDice;
        } else if (diceRollCount === 2) {
            secondDice = diceValue;
            document.getElementById('secondDiceValue').textContent = secondDice;
            handleCellSelection(firstDice, secondDice);
        }

        setTimeout(() => {
            rollDiceBtn.disabled = false; // 주사위 애니메이션이 끝난 후 버튼 활성화
            isRolling = false; // 주사위 굴리기 상태 초기화
        }, 500);
    }, 2000); // 애니메이션 시간
}


// 셀 선택 처리 함수
function handleCellSelection(first, second) {
    let x, y;

    // firstDice 값을 y 좌표로 매핑 (가로 위치)
    if (first >= 1 && first <= 2) y = 0;
    else if (first >= 3 && first <= 4) y = 1;
    else if (first >= 5 && first <= 6) y = 2;

    // secondDice 값을 x 좌표로 매핑 (세로 위치)
    if (second >= 1 && second <= 2) x = 0;
    else if (second >= 3 && second <= 4) x = 1;
    else if (second >= 5 && second <= 6) x = 2;

    console.log(`x 좌표 (세로 위치): ${x}, y 좌표 (가로 위치): ${y}`);
    console.log(`firstDice (y값): ${first}, secondDice (x값): ${second}`);

    selectedCell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
    if (!selectedCell) {
        console.error(`Cell at position (${x}, ${y}) not found.`);
        return;
    }

    // 이미 차지한 칸일 경우
    if (selectedCell.classList.contains('active')) {
        alert('이미 차지한 칸입니다! 상대방에게 턴을 넘깁니다.');
        switchTurn();
    } else {
        showQuestionModal();
    }
}



// 문제 모달 표시 함수
function showQuestionModal() {
    document.getElementById('questionModal').style.display = 'flex';
}

// 답안 제출 함수
function submitAnswer(isCorrect) {
    document.getElementById('questionModal').style.display = 'none';
    if (isCorrect) {
        alert('정답입니다! 땅을 차지합니다.');
        colorCell();
        resetDiceAtNextRoll(); // 다음 주사위 굴리기 버튼을 눌렀을 때 초기화
    } else {
        alert('오답입니다! 턴이 넘어갑니다.');
        switchTurn(); // 턴이 넘어가고 상대방이 주사위를 굴릴 때 초기화
        resetDiceAtNextRoll();
    }
}

// 다음 주사위 굴리기 버튼을 누를 때 초기화
function resetDiceAtNextRoll() {
    diceRollCount = 0; // 주사위를 굴리기 전에 초기화, 게임 중에는 값 유지
}


// 턴 변경 함수
function switchTurn() {
    currentPlayer = currentPlayer === 'blue' ? 'pink' : 'blue';
    selectPlayer(currentPlayer); // 상대 캐릭터를 활성화
    resetDiceAtNextRoll(); // 다음 주사위를 굴릴 때만 초기화
}

// 주사위 초기화는 다음 주사위 굴리기 전에만 이루어짐
function resetDiceAtNextRoll() {
    diceRollCount = 0; // 주사위를 굴리기 전에만 초기화
}

// 셀 색칠 함수
function colorCell() {
    selectedCell.classList.add('active');

    if (currentPlayer === 'blue') {
        blueScore++;
        document.getElementById('blueScore').textContent = blueScore;
    } else {
        pinkScore++;
        document.getElementById('pinkScore').textContent = pinkScore;
    }

    // 정답을 맞혔을 때 주사위 초기화는 다음 주사위를 굴릴 때 이루어짐
    document.getElementById('rollDiceBtn').disabled = false;
}

// 주사위 값 초기화 함수
function resetDice() {
    firstDice = 0;
    secondDice = 0;
    diceRollCount = 0;
    document.getElementById('firstDiceValue').textContent = '-';
    document.getElementById('secondDiceValue').textContent = '-';
}
