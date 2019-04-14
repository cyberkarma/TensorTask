(function($){
    
    SeaBattle =  {};
   
    /**
     * The main function
     * @constructor
     * @param {Array} config 
     */
    SeaBattle.App=function(config){
        let  
            Field   = SeaBattle.Field,
            DebugAttackMatrixField  = SeaBattle.DebugAttackMatrixField,
            Ship    = SeaBattle.Ship,
          
            OpenedCell  = SeaBattle.OpenedCell,
            ClosedCell  = SeaBattle.ClosedCell;

        let _this=this;
        /**
         * @type {SeaBattle.Field}
         */
        let playerField = new  Field({cellType:SeaBattle.OpenedCell});
        /**
         * @type {SeaBattle.Field}
         */
        let compField = new  Field({cellType:SeaBattle.ClosedCell});
        this.debug=config.debug;
        /**
         * @type {Number}
         */
        let activePlayerIndex = 0;
        /**
         * jQuery objects
         */
        let $statusBarContainer = config.statusBar,
        $dialogContainer=config.dialog,
        $playerFieldContainer=config.playerFieldContainer,        
        $compFieldContainer=config.compFieldContainer,        
        $computerNameContainer=config.computerName,
        $runButton=config.runButton,
        $playerNameContainer=config.playerName;
        
        this.getHumanField = function(){
            return playerField;
        }
    
        let players = [];
        
        $playerFieldContainer.append(playerField.render());
        $compFieldContainer.append(compField.render());
        
        if(this.debug){
             
            this.debugAttackMatrixField = new DebugAttackMatrixField();
            $('#debug-container').append(this.debugAttackMatrixField.render());    
        }
        /**
         * Populate fields
         * @param {SeaBattle.Field}
         */
        addShipsToField=function(field){
            for(let i=4;i>0;i--){
                for(let j=4-i+1;j>0;j--){                   
                    field.addShip(new Ship(i));
                }
            }
        }
    
        
        /**
         * Get the next acive player
         * 
         * @returns {SeaBattle.Player}
         */
        let getNextPlayer=function(){
            
            if(activePlayerIndex>=players.length-1){
                activePlayerIndex=0;
            } else {
                activePlayerIndex++;
            }
            let activePlayer =  players[activePlayerIndex];
            return activePlayer;
        }
    
        /**
         * Check if there is one live ship at least on fields
         * 
         * @returns {Boolean}
         */
        this.gameOver = function(){
            for(let player of players){
                let allShipsisDead=true;
                for(let ship of player.targetField.ships){
                    if(!player.targetField.isShipDead(ship)){
                            allShipsisDead= false;
                    }
                }
                if(allShipsisDead){
                    return true;
                }
            }
            return false;
        }
        
        /**
         * Set current active player and player.attack() method run
         * 
         * @param {Boolean} isLastAttackSuccess 
         */
        function runNextPlayerAttack(isLastAttackSuccess){
            let activePlayer;
            if(!isLastAttackSuccess){
                activePlayer = getNextPlayer();
                $statusBarContainer.text(activePlayer.name+' turn...'); 
            } else {
                activePlayer = players[activePlayerIndex];
            }
           
            activePlayer.attack().then(function(attackCoords){ 
           
                let attackResults = activePlayer.targetField.processAttack(attackCoords);
                activePlayer.processAttackResult(attackCoords,attackResults.state);
                if(attackResults.success){
                    $statusBarContainer.text(activePlayer.name+' attack success'); 
                } else {
                    $statusBarContainer.text(activePlayer.name+' attack fail');                 
                }
                if(_this.gameOver()){
                    alert('Game Over');
                    return;
                }
                runNextPlayerAttack(attackResults.success);
            });
        }

        /**
         * Handler for "Run" button click
         * 
         * @param {jQuery.Event} e 
         */
        let runGameButtonHandler = function(e){
            addShipsToField(playerField);
            addShipsToField(compField);
            runNextPlayerAttack(false);
            $(this).off( "click" );
        };

        /**
         * Shows modal form for type names
         * @returns {Promise}
         */
        let showModal=function(){
            return new Promise(function(ResolveCallback,RejectCallback){
                dialog = $dialogContainer.dialog({
                    dialogClass: "no-close",   
                    buttons: {
                        "Next": function(){
                            if ($('#computer-name').val() && $('#player-name').val()){
                                dialog.dialog('close');
                                return true;
                            }
                            return false;
                        }
                      },
                      close: function() {
                        ResolveCallback({computerName:$('#computer-name').val(), playerName:$('#player-name').val()});
                      },             
                    autoOpen: false,
                    height: 400,
                    width: 350,
                    modal: true,});
                    dialog.dialog( "open" );
            });

        }
        /**
         * Run game
         */
        this.run=function(){           
            showModal().then(function(result){
                let CompPlayer=SeaBattle.CompPlayer,HumanPlayer=SeaBattle.HumanPlayer;
                players.push(   new CompPlayer(result.computerName,playerField));
                players.push(   new HumanPlayer(result.playerName, compField));
                $computerNameContainer.text(result.computerName);
                $playerNameContainer.text(result.playerName);
                $runButton.click(runGameButtonHandler);
            },function(error){

            });
              
           
        }
    }
})(jQuery)
