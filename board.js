const DIRECTIONS = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];

class Board {
    constructor(id) {
        this.id = id;
        this.element = document.getElementById(this.id);
        
        this.player = "black";
        this.opp = "white";

        this.populateBoard();
        this.updateMovePreviews();

        this.handleClick = this.handleClick.bind(this)
        this.element.addEventListener("click", this.handleClick);
    }

    populateBoard() {
        for (let y = 0; y < 8; y++) {
            const row = document.createElement("tr");

            for (let y = 0; y < 8; y++) {
                const cell = document.createElement("th");
                const disc = document.createElement("div");
                disc.className = "disc empty";
                cell.appendChild(disc);
                row.appendChild(cell);
            }

            this.element.appendChild(row);
        }

        this.colorCell(3, 3, "white");
        this.colorCell(4, 4, "white");
        this.colorCell(3, 4, "black");
        this.colorCell(4, 3, "black");
    }

    getCell(x, y) {
        return this.element.rows[y].cells[x].children[0];
    }

    isInBounds(x, y) {
        return (!(x < 0 || y < 0 || x > 7 || y > 7))
    }

    isCellColor(x, y, color) {
        return this.getCell(x, y).className.indexOf(color) > -1;
    }

    colorCell(x, y, color) {
        this.getCell(x, y).className = `disc ${color}`;
    }

    updateMovePreviews() {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (this.isCellColor(x, y, "empty")) {
                    if (this.checkCell(x, y).length > 0) {
                        this.getCell(x, y).className += " valid";
                    } else {
                        this.colorCell(x, y, "empty");
                    }
                }
            }
        }
    }

    handleClick(e) {
        if (e.target.className.indexOf("disc") === -1) return;

        const x = e.target.parentElement.cellIndex;
        const y = e.target.parentElement.closest("tr").rowIndex;

        const validDirections = this.checkCell(x, y);

        if (validDirections.length > 0) {
            this.flipDirections(validDirections, x, y);
            this.colorCell(x, y, this.player);

            let temp = this.player;
            this.player = this.opp;
            this.opp = temp;
            
            this.updateMovePreviews();
            this.logBoard();
        }
    }

    checkCell(x, y) {
        if (!this.isCellColor(x, y, "empty")) {
            return [];
        }

        let validDirections = [];

        DIRECTIONS.forEach(direction => {
            const dx = direction[0];
            const dy = direction[1];
            if (this.checkDirection(x + dx, y + dy, dx, dy)) {
                validDirections.push(direction);
            }
        });

        return validDirections;
    }

    checkDirection(x, y, dx, dy) {
        if (!this.isInBounds(x, y)) return false;
        if (!this.isCellColor(x, y, this.opp)) return false;

        x += dx;
        y += dy;

        while (this.isInBounds(x, y)) {
            if (this.isCellColor(x, y, this.player)) return true;
            if (!this.isCellColor(x, y, this.opp)) return false;

            x += dx;
            y += dy;
        }
    }

    flipDirections(directions, x, y) {
        console.log(directions);
        directions.forEach(direction => {
            const dx = direction[0];
            const dy = direction[1];
            this.flipDirection(x + dx, y + dy, dx, dy);
        });
    }

    flipDirection(x, y, dx, dy) {
        while (this.isInBounds(x, y,) && !this.isCellColor(x, y, this.player)) {
            this.colorCell(x, y, this.player);
            x += dx;
            y += dy;
        }
    }
    
    logBoard() {
        for (let y = 0; y < 8; y++) {
            let row = `${y} `;
            for (let x = 0; x < 8; x++) {
                if (this.isCellColor(x, y, "white")) {
                    row += "O ";
                } else if (this.isCellColor(x, y, "black")) {
                    row += "X ";
                } else {
                    row += "- ";
                }
            }
            console.log(row);
        }
        console.log("new line");
    }
}

const board = new Board("board");