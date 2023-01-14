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
		if (!checkDraw()) turn(bestSpot(), aiPlayer);
		}, 500);
	}
}


function turn(squareID, player) {
	
	tableBoard[squareID] = player;
	document.getElementById(squareID).innerText = player;
 	document.getElementById(squareID).style.color = "white";
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
			gameWon.player == humanPlayer ? "#0088ffc2" : "#f70000ba";
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
	
	return emptySquares()[0];
}


function checkDraw() {
	
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "#9d9997";
			cells[i].removeEventListener('click', turnClick, false);
		}
		resultDisplay("Tie Game!")

		return true;
	}
	return false;
}