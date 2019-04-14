(function(SeaBattle,$){

    /**
     * Represent matrix based on two dimensional array
     * @constructor
     */
    SeaBattle.Matrix = function (){
        this.matrix=[];
        for(let i=0;i<this.SIZE;i++){
            this.matrix[i]=[];
            for(let j=0;j<this.SIZE;j++){
                this.matrix[i][j]=0;
            }
        }
    }

    let Matrix=SeaBattle.Matrix;

    Matrix.prototype={
    
        SIZE:10,
        /**
         * Get coords related to passed coords
         * @param {Array.<Array<Number>>} coords
         * @returns {Array.<Array<Number>>} coords
         */
        getRelatedCoords:function(coords){
            let minX=coords[0][0],
            maxX=0,
            minY=coords[0][1],
            maxY=0,
            fromX,
            toX,
            fromY,
            toY,
            relatedCells=[];
    
            for(let coord of coords){            
                minX = (coord[0]<minX)?coord[0]:minX;
                maxX = (coord[0]>maxX)?coord[0]:maxX;
                minY = (coord[1]<minY)?coord[1]:minY;
                maxY = (coord[1]>maxY)?coord[1]:maxY;            
            }
            fromX=(minX>0)?minX-1:minX;
            toX=(maxX<9)?maxX+1:maxX;
            fromY=(minY>0)?minY-1:minY;
            toY=(maxY<9)?maxY+1:maxY;
    
            for(let i=fromX;i<=toX;i++){
                for(let j=fromY;j<=toY;j++){
                    if(i>=minX && i<=maxX && j>=minY && j<=maxY){
                        continue;
                    }
                    relatedCells.push([i,j]);
                }   
            }
            return relatedCells;
        },
    
        /**
         * Set state to matrix elment
         * @param {Number} x x-coord
         * @param {Number} y y-coord
         * @param {Number} state state
         */
        setElementState : function(x,y,state){
            this.matrix[x][y]=state;
        },
    
        /**
         * Get state to matrix elment
         * @param {Number} x x-coord
         * @param {Number} y y-coord
         * @returns {Number} state state
         */
        getElementState : function(x,y){
            return this.matrix[x][y];
        }
    }
    /**
     * Matrix with info about ships locations on field
     * @constructor
     */
    SeaBattle.ShipMatrix = function (){

        Matrix.apply(this);
        let props = {
            'STATE_EMPTY':0,
            'STATE_TAKEN_BY_SHIP':1,
            'SHIP_DIRECTION_HORIZONTAL':0,
            'SHIP_DIRECTION_VERTICAL':1,        
        };
        for(let i in props){
            Object.defineProperty(ShipMatrix,i,{
                value:props[i],
                writable:false
            });
        }
    
        this.isElementClean=function(x,y){
            if(this.matrix[x][y]!=ShipMatrix.STATE_EMPTY){
                return false;
            }
            return true;    
        }
    
        this.isCoordsClean=function(coords){
            for(let i in coords){
                if(!this.isElementClean(coords[i][0],coords[i][1])){
                    return false;
                }
            }
            return true;
        }
    
        this.isCoordsAvailableForShip=function(coords){
            relatedCoords = this.getRelatedCoords(coords);
            return (this.isCoordsClean(coords)&& this.isCoordsClean(relatedCoords));
        }
    
        this.addShip=function(ship){
            if(!this.isCoordsAvailableForShip(ship.coords)){
                throw "Invalid coordinates";
                // return false;
            }
            for(i in ship.coords){
                this.setElementState(ship.coords[i][0],ship.coords[i][1],ShipMatrix.STATE_TAKEN_BY_SHIP);
            }
        }
    }

    let ShipMatrix=SeaBattle.ShipMatrix;
    extend(ShipMatrix, Matrix);

    /**
     * Matrix with info about cpu attacks
     * 
     * @constructor
     */
    SeaBattle.AttackMatrix = function(){
        
        Matrix.apply(this);    

       function getCoordsSumWithDirection(coords,direction){
            let sumCoords=ArraySum(coords,direction);
            for(i in sumCoords){
                if(sumCoords[i]<0 ||sumCoords[i]>9){
                    return false;
                }
            }
            return sumCoords;
        }

        this.randomNextAttackCoords = function(){
            coords = [getRandomInt(0,10),getRandomInt(0,10)];
            if(this.getElementState(coords[0],coords[1])==AttackMatrix.STATE_UNKNOWN){
                return coords;
            }
            return this.randomNextAttackCoords();
        }

        this.getRectRelatedCoords = function(x,y){
            let coords = [];
            for(let direction of AttackMatrix.RECT_DIRECTION_MATRIX){
                sum=getCoordsSumWithDirection([x,y],direction);
                if(sum){
                    coords.push(sum);
                }
                
            }
            return coords;
        }

        this.getDiagonalRelatedCoords=function(x,y){
            let coords = [];
            for(let i in AttackMatrix.DIAGONAL_DIRECTION_MATRIX){
                sum=getCoordsSumWithDirection([x,y],AttackMatrix.DIAGONAL_DIRECTION_MATRIX[i]);
                if(sum){
                    coords.push(sum);
                }
                
            }
            return coords;
        }
    }

    let AttackMatrix=SeaBattle.AttackMatrix;

    extend(AttackMatrix, Matrix);

    (function(){
        let attackMatrixStates={
            'STATE_UNKNOWN': 0,
            'STATE_EMPTY' : 1,
            'STATE_SHIP_DAMAGED':2,
            'STATE_SHIP_DEAD':3
        }
        for(let i in attackMatrixStates){
            Object.defineProperty(AttackMatrix, i, {
                value: attackMatrixStates[i],
                writable: false,
                enumerable: true,
                configurable: true
              });    
        }
        
        Object.defineProperty(AttackMatrix, "RECT_DIRECTION_MATRIX", {
            value: [[-1,0],[0,-1],[0,1],[1,0]],
            writable: false,
            enumerable: true,
            configurable: true
          });
        Object.defineProperty(AttackMatrix, "DIAGONAL_DIRECTION_MATRIX", {
            value: [[-1,-1],[-1,1],[1,-1],[1,1]],
            writable: false,
            enumerable: true,
            configurable: true
          });
        
    })();
    
})(SeaBattle=SeaBattle|| {},jQuery)



















