(function(SeaBattle,$){
/**
 * Cell bank provides the store for cell and its provides 
 * interface for access to cells by X,Y coordinates
 * @constructor
 * @param {SeaBattle.Field} field 
 * @param {String} cellType 
 */
SeaBattle.CellBank = function(field,cellType){
    this.cells = [];
    const SIZE=10; 

    for(let i=0;i<SIZE;i++){
        for(let j=0;j<SIZE;j++){
            let cell = new cellType(j,i,field);
            this.cells.push(cell);          
        }
    }         
    /**
     * Get cell by XY coords
     * @param {Number} x 
     * @param {Number} y 
     * @returns {SeaBattle.Cell}
     */
    this.getCell=function(x,y){
        return this.cells[y*SIZE+x];
    }
    /**
     * Set state to cell by X,Y coordinates
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} state 
     */
    this.setCellState=function(x,y,state){
        this.getCell(x,y).setState(state);        
    }
}
})(SeaBattle=SeaBattle|| {},jQuery)