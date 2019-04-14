
(function(SeaBattle,$){
    
    let CellBank = SeaBattle.CellBank,
    ShipMatrix = SeaBattle.ShipMatrix,
    Cell=SeaBattle.Cell;

    /**
     * Field is provides response for player attacks and manages cells and ships
     * @constructor
     * @param {<Object>} config 
     */
    SeaBattle.Field=function (config) {            
        /**
         * Cells container
         * @type {Array.<Cell>}
         */    
        this.cellBank = new CellBank(this, config.cellType);
        
        /**
         * Array of ships
         * @type {Array.<Ship>}
         */
        this.ships = [];
        /**
         * Array of ship cells state 
         * @type {Array.<Number>}
         */
        this.shipMatrix = new ShipMatrix();
        let defaultConfig={
            'width':300,
            'height':300,
        };
        config=$.extend(defaultConfig,config);
            /** 
        * jQuery container object renders field
        */
            
        this.$field = $('<div class="field"></div>')
        .css({'height': config.height+'px', 'width': config.width+'px', 'margin': '0', 'padding': '0'});
                
    }
    
    let Field = SeaBattle.Field;

    Field.prototype={
    
        /** 
        * Checks is all cells of ship was attacked  
        * @param {Ship} ship Ship to check.  
        * @return {boolean}  
        */ 
        isShipDead : function (ship) {
            for (let [x,y] of ship.coords) {
                if (this.cellBank.getCell(x, y).getState() == Cell.STATE_IS_TAKEN_BY_SHIP) {
                    return false;
                }
            }
            return true;
        },
    
        /** 
        * Returns Ship object by passed coords  
        * @param {Number} x X-coordinate.  
        * @param {Number} y Y-coordinate.  
        * @return {Ship}  
        */
        getShipLocatedOn: function (x, y) {
            for (let i in this.ships) {
                for (let [shipX, shipY] of this.ships[i].coords) {
                    if (shipX == x && shipY == y) {
                        return this.ships[i];
                    }
                }
            }
            return null;
        },
    
    
    
        /**
        * Found and place ship to arena
        * @param {Array.<Number, Number>} coords  array (X,Y) coordinates
        * @returns {String} Status of attack
        */
        processAttack : function (coords) {
            let [x, y] = coords;
    
            attackSuccess = !this
                .shipMatrix
                .isElementClean(x, y);
            let state;
                if (attackSuccess) {            
                this.cellBank.getCell(x, y)
                    .setState(Cell.STATE_IS_TAKEN_BY_SHIP_AND_ATTACKED);
                    var ship = this.getShipLocatedOn(x, y);
                    state=Field.ATTACK_RESULTS_SHIP_DAMAGED;
                if (this.isShipDead(ship)) {
                    for(let [shipX,shipY] of ship.coords){
                        this.cellBank.getCell(shipX, shipY).setState(Cell.DEAD_SHIP);
                    }
                    
                    state= Field.ATTACK_RESULTS_SHIP_DEAD;
                } 
                
            } else {
                this
                    .cellBank
                    .getCell(x, y)
                    .setState(Cell.STATE_EMPTY_AND_ATTACKED);
                state= Field.ATTACK_RESULTS_FAIL;
            }
            
            return {success:attackSuccess,state:state};
        },
    
        /**
        * Get width of field container
        * @returns {Number} width	
        */
        getWidth : function () {
            return this.$field.width();
        },
    
        /**
        * Get width of field container
        * @returns {Number} heigth	
        */
        getHeight : function () {
            return this.$field.height();
        },
    
        /**
         * Renders field container
         */
        render: function () {
            let _this = this;
    
            for (let i in this.cellBank.cells) {
                let cell = this.cellBank.cells[i];
                this.$field.append(cell.render());
            }
            return this.$field;
        },
    
        /**
         * Find if not passed available coordinates on field and apply it to ship(set new state)
         * @param {Ship} ship
         * @param {Array.<Number, Number>} coords for ship
         */
        addShip : function (ship, coords) {
            let size = ship.size;
            let shipCoords = (typeof coords == 'undefined')
                ? this.generateRandomShipCoords(size)
                : coords;
    
            ship.coords = shipCoords;
            this
                .shipMatrix
                .addShip(ship);
            this
                .ships
                .push(ship);
            for (let i in ship.coords) {
                this
                    .cellBank
                    .getCell(ship.coords[i][0], ship.coords[i][1])
                    .setState(Cell.STATE_IS_TAKEN_BY_SHIP);
            }
            this.renderShip(ship);
        },
    
        /**
         * Renders ship in renered container
         * @param {Ship} ship     
         */
        renderShip : function (ship) {
            if (!ship.coords.length) {
                return;
            }
            for (let i in ship.coords) {
                let cell = this
                    .cellBank
                    .getCell(ship.coords[i][0], ship.coords[i][1])
                    .setState(Cell.STATE_IS_TAKEN_BY_SHIP);
            }
        },

        /**
         * Finds coords for new ship
         * @param {Number} shipSize     
         */
        generateRandomShipCoords : function (shipSize) {
            
            let matrix = this.shipMatrix,
                direction,
                shipCoords;
            do
            {
                shipCoords = [];
                direction = getRandomInt(0, 2);
                if (direction == 0) {
                    shipCoords.push([
                        getRandomInt(0, 10 - shipSize),
                        getRandomInt(0, 10)
                    ]);
                } else {
                    shipCoords.push([
                        getRandomInt(0, 10),
                        getRandomInt(0, 10 - shipSize)
                    ]);
                }
    
                for (let i = shipCoords.length; i < shipSize; i++) {
                    if (direction == 0) {
                        let nextX = shipCoords[i - 1][0] + 1;
                        shipCoords.push([nextX, shipCoords[0][1]
                        ]);
                    } else {
                        let L = shipCoords[i - 1][1] + 1;
                        shipCoords.push([shipCoords[0][0], L]);
                    }
                }
            }
            while (!matrix.isCoordsAvailableForShip(shipCoords)) 
            ;
            return shipCoords;
        }
    }

    /**
    * Set read-only properties
    */
    
    let attackResults = {
        'ATTACK_RESULTS_FAIL': 1,
        'ATTACK_RESULTS_SHIP_DAMAGED': 2,
        'ATTACK_RESULTS_SHIP_DEAD': 3
    };
    for (let i in attackResults) {
        Object.defineProperty(Field, i, {
            value: attackResults[i],
            writable: false,
            enumerable: true,
            configurable: true
        });
    }
     
    /**
     * Using for debug display comp attack matrix
     * @constructor
     * @param {<Array>} config  
     */
    function DebugAttackMatrixField($config) {
        Field.apply(this, arguments);
        this.cellBank = new CellBank(this, AttackMatrixDebugCell);
        this.setCellState = function (x, y, state) {
    
            this
                .cellBank
                .getCell(x, y)
                .setState(state);
        }
        this.getCellState = function (x, y) {
            return;
        }
    }
    extend(DebugAttackMatrixField,Field);

})(SeaBattle=SeaBattle|| {},jQuery);




 




