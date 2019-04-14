(function(SeaBattle,$){
    /**
     * Player is function to make attacks on ships and processing attacks results
     * 
     * @constructor
     * @param {String} name 
     * @param {SeaBattle.Field} targetField 
     */
    SeaBattle.Player= function (name,targetField){

        this.name=name;
    
        this.targetField=targetField;
        this.processAttackResult=function(coords,result){
            console.log('player process attack result');
        }
        this.attack=function(){
            console.log('player attack');
        }
    }

    let Player=SeaBattle.Player,AttackMatrix=SeaBattle.AttackMatrix;
    
    /**
     * Computer
     * @param {String} name 
     * @param {SeaBattle.Field} targetField 
     */
    SeaBattle.CompPlayer = function(name,targetField){
    
        Player.apply(this,arguments);
        let attackMatrix = new AttackMatrix();
        /**
         * @type {<Array.<Array <Number,Number>>}
         */
        let currentAttackedShipCoords = [];
        
        /**
         * Funtion attack returns coords for next attack.Coords can be random 
         * if there is no damaged ships o field.
         * @returns {Promise}
         */
        this.attack=function(){
            let _this = this;
            return new Promise(function(resolveCallback,rejectCallback){
                setTimeout(function(){
                    let attackCoords=_this.getNextAttackCoords();                       
                    console.log('comp attack',attackCoords);
                    resolveCallback(attackCoords);
                },1000);
            });
        }
    
        function shipIsFound(){
            return currentAttackedShipCoords.length;
        }
        
        /**
         * Funtion attack returns coords for next attack.Coords can be random 
         * if there is no damaged ships o field.
         * @returns  {<Array.<Array <Number,Number>>}
         */
        this.getNextAttackCoords=function(){
            if(shipIsFound()){
                let lastAttackedCoord = currentAttackedShipCoords[currentAttackedShipCoords.length-1],
                rectRelatedCoords = attackMatrix.getRectRelatedCoords(lastAttackedCoord[0],lastAttackedCoord[1])
                ;
                for(let nextAttackCoord of rectRelatedCoords){
    
                    if(attackMatrix.getElementState(nextAttackCoord[0],nextAttackCoord[1])==AttackMatrix.STATE_UNKNOWN){
                        return nextAttackCoord;
                    }
                }
                currentAttackedShipCoords.reverse();
                return this.getNextAttackCoords();
            } else {
                return attackMatrix.randomNextAttackCoords();
            } 
        }
        
        /**
         * Funtion takes status of last attack and update attackMatrix
         * @param  {<Array.<Array <Number,Number>>} lastAttackCoords
         * @param {Number} result
         */
        this.processAttackResult = function(lastAttackCoords,result){
            let Field=SeaBattle.Field,AttackMatrix=SeaBattle.AttackMatrix;
            let [lastAttackX,lastAttackY] = lastAttackCoords;
            switch(result) {
                case Field.ATTACK_RESULTS_FAIL:   
    
                    attackMatrix.setElementState(lastAttackX,lastAttackY,AttackMatrix.STATE_EMPTY);               
                    break;
              
                case Field.ATTACK_RESULTS_SHIP_DAMAGED:   
                    
                    attackMatrix.setElementState(lastAttackX,lastAttackY,AttackMatrix.STATE_SHIP_DAMAGED);
                    let diagonalRelated = attackMatrix.getDiagonalRelatedCoords(lastAttackX,lastAttackY);
    
                    for(let coord of diagonalRelated){
                        if(attackMatrix.getElementState(coord[0],coord[1])==AttackMatrix.STATE_UNKNOWN){
                            attackMatrix.setElementState(coord[0],coord[1],AttackMatrix.STATE_EMPTY);                         
                        }
                    }
                    currentAttackedShipCoords.push(lastAttackCoords);
                    break;
              
                case Field.ATTACK_RESULTS_SHIP_DEAD:     
    
                    attackMatrix.setElementState(lastAttackX,lastAttackY,AttackMatrix.STATE_SHIP_DEAD); 
                    
                    currentAttackedShipCoords.push(lastAttackCoords);
                    for(let [x,y] of attackMatrix.getRelatedCoords(currentAttackedShipCoords)){
                        if(attackMatrix.getElementState(x,y)==AttackMatrix.STATE_UNKNOWN){
                            attackMatrix.setElementState(x,y,AttackMatrix.STATE_EMPTY);
                        }
                    }
                    currentAttackedShipCoords=[]; 
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * Human player
     * @constructor
     * @param {String} name 
     * @param {SeaBattle.Field} targetField 
     */
    SeaBattle.HumanPlayer = function(name,targetField){
        Player.apply(this,arguments);
        
        /**
         * Creates handler for click on cell of enemy field  
         * @returns {Promise}
         */
        this.attack = function(){
            return new Promise(function(resolveCallback,rejectCallback){
                $('#comp-field-container .cell').click(function(){
                    let $this = $(this);
                    let coords = [$this.data('x'),$this.data('y')];
                    console.log('human attack')
                    resolveCallback(coords);
                });
            });
        }    
    }


})(SeaBattle=SeaBattle|| {},jQuery)





