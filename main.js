//----------------------------
// Auxiliary
//----------------------------

function checkArrayInArray(arrayInception, inner) {
	if (arrayInception.length === 0) {
		return false;
	} else {
		for (var i = arrayInception.length - 1; i >= 0; i--) {
			var in_array = [];
			for (var j = arrayInception[i].length - 1; j >= 0; j--) {
				if (inner[j] === arrayInception[i][j]) {
					in_array.push(true);
				} else {
					in_array.push(false);
				}
			}
			if (in_array.indexOf(false) === -1) {
				return true;
			}
		}
		return false;
	}
}

//----------------------------
// Initialization
//----------------------------

document.getElementsByTagName('body')[0].addEventListener("load", init());

function init(){
	frboard = [];
	frattacked = [];
	enattacked = [];

	boardSize = 10;
	boardDivs = "";
	horiz_string = "ABCDEFGHIJKLMNOP";
	vert_string = "123456789:";
	shipIcons = "";

	for (var i = 4; i >= 0; i--) {
		shipIcons = shipIcons.concat('<td class="shipPiece"></td>');
	};

	for (var i = 0; i <= boardSize; i++) {
		if (!i) {
			boardDivs = boardDivs.concat('<div id="topRow">\n');
		} else {
			frboard.push([]);
			frattacked.push([]);
			enattacked.push([]);
			curr_col = horiz_string.charAt(i-1);
			boardDivs = boardDivs.concat('<div id="', curr_col, '" class="rowContainer">\n');
		};

		for (var j = 0; j <= boardSize; j++) {
			if (!i) {
				if (!j) {
					boardDivs = boardDivs.concat('\t<div id="corner"></div>\n');
				} else {
					boardDivs = boardDivs.concat('\t<div class="topInfoContainer">', j.toString(), '</div>\n');
				};
			} else {
				if (!j) {
					boardDivs = boardDivs.concat('\t<div class="sideInfoContainer">', curr_col, '</div>\n');
				} else {
					frboard[i-1].push(false);
					frattacked[i-1].push(false);
					enattacked[i-1].push(false);
					if (j === 10) {
						curr_entry = curr_col.concat(':');
					} else {
						curr_entry = curr_col.concat((j).toString());
					}
					boardDivs = boardDivs.concat('\t<div id="', curr_entry, '" class="square" onclick="update(\'', curr_entry, '\')"></div>\n');
				};
			};
		};

		boardDivs = boardDivs.concat('</div>\n');
	};

	ship_placing = true;
	ships_to_place = [5,5,4,4,3]; // Ship size is increased by one (except for first) because...... reasons.
	currentBoat = [];
	startingNewBoat = false;
	placement = 'first';
	possible_placements = [];
	ship_pieces = 0;

	for (var i = ships_to_place.length - 1; i >= 0; i--) {
		ship_pieces += ships_to_place[i];
	};

	ship_pieces -= 1;
};

document.getElementById("boardContainer").innerHTML = boardDivs;
document.getElementById("shipPieceRow").innerHTML = shipIcons;

//----------------------------
// Ship placement
//----------------------------

function updatePossible(r, c) {
	// DEBUG
	// console.log("Before updating possible:")
	// console.log("\tPlacement: ", placement);
	// console.log("\tCurrent Boat: ", currentBoat);

	if (placement === 'any') {
		possible_placements = [];
	} else if (placement === 'first') {
		possible_placements = [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]];
	} else if (placement === 'vert') {
		possible_placements = [[currentBoat[0][0] - 1, c], [currentBoat.slice(-1)[0][0] + 1, c]];
	} else {
		possible_placements = [[r, currentBoat[0][1] - 1], [r, currentBoat.slice(-1)[0][1] + 1]];
	}
}

function boatSort(b1, b2) {
	if (placement === 'any' || placement === 'first') {
		return 0;
	} else if (placement === 'vert') {
		return b1[0] - b2[0];
	} else {
		return b1[1] - b2[1];
	}
}

function update(ship) {
	if (ship_placing) {
		// Assign row/column values to the ship
		if (ship.length === 2) {
			var row = ship.charCodeAt(0) - 65;
			var col = ship.charCodeAt(1) - 49;

			// Double check that we can actually go in the place we want to
			var can_proceed = (!frboard[row][col]) && (possible_placements.length === 0 || checkArrayInArray(possible_placements, [row, col]));

			if (can_proceed) {
				// Update the board color and our board array

				document.getElementById(ship).style.background = "#5C5C5C";
				frboard[row][col] = true;

				// If it's the first piece in a new ship
				if (ships_to_place[0] === 1) {
					// Quick check that it wasn't the last last piece
					if (currentBoat.length === 1) {
						ship_placing = false;
						transition();
					
					// If not, set it up so we have a new boat next time
					} else {
						currentBoat = [];
						ships_to_place.shift();
						placement = 'any';
						updatePossible(row, col);
					}

					// Move to next ship piece
					ships_to_place[0]--;
					for (var i = ships_to_place[0]; i >= 0; i--) {
						shipIcons = shipIcons.concat('<td class="shipPiece"></td>');
					}
					document.getElementById('shipPieceRow').innerHtml = shipIcons;

				// If it's any other piece in a ship
				} else {
					/* If this is the second piece in the ship, then the current boat is one long,
					so we can decide if this is a horizontal or vertical boat */
					if (currentBoat.length === 1) {
						if (col === currentBoat[0][1]) {
							placement = 'vert';
						} else {
							placement = 'horiz';
						}
					}

					// Update the ships left and make sure that we didn't just finish a ship
					ships_to_place[0]--;
					for (var i = ships_to_place[0]; i >= 0; i--) {
						shipIcons = shipIcons.concat('<td class="shipPiece"></td>\n');
					}
					// DEBUG
					//console.log(shipIcons);
					document.getElementById('shipPieceRow').innerHtml = shipIcons;

					if (currentBoat.length === 0) {
						placement = 'first'
					}

					// Update the current boat, and the places we can go next time
					currentBoat.push([row, col]);
					currentBoat.sort(boatSort);
					updatePossible(row, col);
				}
			} else {
				console.log("Can't go there.");
			}
		} else {
			console.log("Erasing.");
			init();
			document.getElementById("boardContainer").innerHTML = boardDivs;
			document.getElementById("shipPieceRow").innerHTML = shipIcons;
		}
	} else {
		console.log("Done.");
	}
}

//----------------------------
// Transition
//----------------------------

function transition(){
	console.log("Arrived!");

	var rows = document.getElementsByClassName("rowContainer");
	for (var i = rows.length - 1; i >= 0; i--) {
		rows[i].style.width = 20;
		rows[i].style.height = 1;
	}

	document.getElementById("topRow").style.width = 20;
	document.getElementById("topRow").style.height = 1.9;

	aiBoardGen();
}

function aiBoardGen(){
	boardDivs = "";
	enboard = [];
	en_horiz_string = "abcdefghijklmnop";

	for (var i = 0; i <= boardSize; i++) {
		if (!i) {
			boardDivs = boardDivs.concat('<div id="eTopRow">\n');
		} else {
			enboard.push([]);
			curr_col = en_horiz_string.charAt(i-1);
			boardDivs = boardDivs.concat('<div id="', curr_col, '" class="eRowContainer">\n');
		};

		for (var j = 0; j <= boardSize; j++) {
			if (!i) {
				if (!j) {
					boardDivs = boardDivs.concat('\t<div id="corner"></div>\n');
				} else {
					boardDivs = boardDivs.concat('\t<div class="topInfoContainer">', j.toString(), '</div>\n');
				};
			} else {
				if (!j) {
					boardDivs = boardDivs.concat('\t<div class="sideInfoContainer">', curr_col, '</div>\n');
				} else {
					enboard[i-1].push(false);
					if (j === 10) {
						curr_entry = curr_col.concat(':');
					} else {
						curr_entry = curr_col.concat((j).toString());
					}
					boardDivs = boardDivs.concat('\t<div id="', curr_entry, '" class="eSquare" onclick="game(\'', curr_entry, '\')"></div>\n');
				};
			};
		};

		boardDivs = boardDivs.concat('</div>\n');
	};

	var enemyBoardContainer = document.getElementById("enemyBoard");
	enemyBoard.style.width = "75%";
	enemyBoard.style.height = "75%";

	var boardContainer = document.getElementById("boardContainer");
	boardContainer.style.width = "20%";
	boardContainer.style.height = "20%";

	document.getElementById("enemyBoard").innerHTML = boardDivs;
};

//----------------------------
// Game
//----------------------------

en_pieces_hit = 0;

function game(ship) {
	console.log(enboard);
	console.log(enattacked);
	var row = ship.charCodeAt(0) - 97;
	var col = ship.charCodeAt(1) - 49;

	if (en_pieces_hit === ship_pieces) {
		console.log("Game finished. You won.");
	} else if (fr_pieces_hit === ship_pieces) {
		console.log("Game finished. You lost.");
	} else {
		if (!enattacked[row][col]) {
			if (enboard[row][col]) {
				document.getElementById(ship).style.background = "#8C0000";
				en_pieces_hit += 1;
			} else {
				document.getElementById(ship).style.background = "#002E91";
			}
			enattacked[row][col] = true;
		}
	}
	
};