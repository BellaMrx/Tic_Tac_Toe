var tableBoard;
const humanPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();


function startGame() {
	
	document.querySelector(".endgame").style.display = "none";
	tableBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}


function turnClick(square) {
	
	if (typeof tableBoard[square.target.id] == 'number') {
		turn(square.target.id, humanPlayer)
		setTimeout (() => {
		if (!checkWin(tableBoard, humanPlayer) && !checkDraw()) turn(bestSpot(), aiPlayer);
		}, 500);
	}
}


function turn(squareID, player) {
	
	tableBoard[squareID] = player;
	document.getElementById(squareID).innerText = player;
	let gameWon = checkWin(tableBoard, player)
	if (gameWon) gameOver(gameWon)
}


function checkWin(board, player) {

	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	
	return gameWon;
}


function gameOver(gameWon) {
	
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == humanPlayer ? "#0088ff" : "#f70000";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	resultDisplay(gameWon.player == humanPlayer ? "You win!" : "You lose.");
}


function resultDisplay(who) {
	
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}


function emptySquares() {
	
	return tableBoard.filter(s => typeof s == 'number');
	
}


function bestSpot() {

	return minimax(tableBoard, aiPlayer).index;
}


function checkDraw() {
	
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "#06ff00";
			cells[i].removeEventListener('click', turnClick, false);
		}
		resultDisplay("Tie Game!")
		return true;
	}
	return false;
}


function minimax(newBoard, player) {
	
	var availSpots = emptySquares();

	if (checkWin(newBoard, humanPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, humanPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	
	return moves[bestMove];
}