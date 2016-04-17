var attacked = [[false, false, false, false, false, false, false, false, false, false],
			   [false, false, false, false, false, false, false, false, false, false],
		  	   [false, false, false, false, false, false, false, false, false, false],
			   [false, false, false, false, false, false, false, false, false, false],
			   [false, false, false, false, false, false, false, false, false, false],
			   [false, false, false, false, false, false, false, false, false, false],
			   [false, false, false, false, false, false, false, false, false, false],
			   [false, false, false, false, false, false, false, false, false, false],
			   [false, false, false, false, false, false, false, false, false, false],
			   [false, false, false, false, false, false, false, false, false, false]];

var board = [[false, false, false, false, false, false, false, false, false, false],
			 [false, false, false, false, false, false, false, false, false, false],
			 [false, false, false, false, false, false, false, false, false, false],
			 [false, false, false, false, false, false, false, false, false, false],
			 [false, false, false, false, false, false, false, false, false, false],
			 [false, false, false, false, false, false, false, false, false, false],
			 [false, false, false, false, false, false, false, false, false, false],
			 [false, false, false, false, false, false, false, false, false, false],
			 [false, false, false, false, false, false, false, false, false, false],
			 [false, false, false, false, false, false, false, false, false, false]];

var ship_placing = true;
var ships_to_place = [4,3,2,2,1];
var currentBoat = [];
var startingNewBoat = false;
var placement = '';

var possible_placements = [];

function checkArrayInArray(arrayInception, inner) {
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

function updatePossible(r, c) {
	console.log(placement);
	console.log(currentBoat);

	if (placement === 'none') {
		possible_placements = [];
	} else if (placement === 'vert') {
		possible_placements = [[11, c], [-1, c]];
		for (var i = currentBoat.length - 1; i >= 0; i--) {
			if (currentBoat[i][0] < possible_placements[0][0]) {
				possible_placements[0][0] = currentBoat[i][0];
			}
		}
		for (var j = currentBoat.length - 1; j >= 0; j--) {
			if (currentBoat[j][0] > possible_placements[1][0]) {
				possible_placements[1][0] = currentBoat[j][0];
			}
		}
		possible_placements[0][0]--;
		possible_placements[1][0]++;
	} else {
		possible_placements = [[r, 11], [r, -1]];
		for (var i = currentBoat.length - 1; i >= 0; i--) {
			if (currentBoat[i][1] < possible_placements[0][1]) {
				possible_placements[0][1] = currentBoat[i][1];
			}
		}
		for (var j = currentBoat.length - 1; j >= 0; j--) {
			if (currentBoat[j][1] > possible_placements[1][1]) {
				possible_placements[1][1] = currentBoat[j][1];
			}
		}
		possible_placements[0][1]--;
		possible_placements[1][1]++;
	}
}

function inputCheck(r,c) {
	if (board[r][c] === true) {
		return false;
	} else if (possible_placements.length === 0) {
		return true;
	} else if (checkArrayInArray(possible_placements, [r,c])) {
		return true;
	} else {
		return false;
	}
}

function update(ship) {
	if (ship_placing) {
		
		var row = ship.charCodeAt(0) - 65;
		var column = ship.charCodeAt(1) - 49;

		can_proceed = inputCheck(row,column);

		if (column === 9) {
			var real_ship = ship.replace(':','10')
		} else {
			var real_ship = ship;
		}

		console.log(can_proceed);

		if (can_proceed) {
			console.log("Placed");
			document.getElementById(real_ship).style.background = "black";
			board[row][column] = true;
			if (ships_to_place.length === 1 && ships_to_place[0] === 0) {
				ship_placing = false;
			} else if (ships_to_place[0] === 0) {
				ships_to_place.shift();
				placement = 'none';
				currentBoat.push([row, column]);
				updatePossible(row, column);
			} else {
				if (ships_to_place[0] === 4) {
					placement = 'none';
					currentBoat = [[row, column]];
					possible_placements = [[(row + 1), column], [(row - 1), column], [row, (column + 1)], [row, (column - 1)]];
				} else {
					if (currentBoat.length === 1) {
						if (column === currentBoat[0][1]) {
							placement = 'vert';
						} else {
							placement = 'horiz';
						}
					}
					currentBoat.push([row, column]);
					updatePossible(row, column);
				}
				
				ships_to_place[0]--;
				
			}
		} else {
			console.log("Can't go there");
		}
		
		console.log("Possible Placements:");
		console.log(possible_placements);
		console.log("Current Boat:");
		console.log(currentBoat);
		console.log(ships_to_place);

		
	} else {
		console.log("Done.");
	}
}