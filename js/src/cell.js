
(function(SeaBattle,$){
    /**
     * Cell is function to render cells in fields
     * @constructor
     * @interface
     * @param {Number} x 
     * @param {Number} y 
     * @param {<SeaBattle.Field>} field 
     */
     SeaBattle.Cell = function(x,y,field){
    
        /**
         * Set read-only props
         */
        let props = {
            'STATE_EMPTY':0,
            'STATE_IS_TAKEN_BY_SHIP':1,
            'STATE_EMPTY_AND_ATTACKED':2,
            'STATE_IS_TAKEN_BY_SHIP_AND_ATTACKED':3,
            'DEAD_SHIP':4,
        };
        for(let i in props){
            Object.defineProperty(Cell,i,{
                value:props[i],
                writable:false
            });
        }

        /**
         * @type {Number}
         */
        this.x=x;
        
        /**
         * @type {Number}
         */
        this.y=y;
        
        /**
         * @type {SeaBattle.Field}
         */
        this.field=field;
        
        /**
         * @type {Number}
         */
        this.state=Cell.STATE_EMPTY;
        
        /**
         * jQuery container
         */
        this.$cell;    
    }
    let Cell = SeaBattle.Cell;

    Cell.prototype={
    
        /**
         * Rerender cell, update jQuery container
         */
         rerender:function(){
     
            if(this.$cell.length){
                this.$cell.replaceWith(this.render());
            }
        }    ,
       
        /**
         * Set cell state
         * @param {Number} state
         */
         setState:function(state){
       
            this.state=state;
            this.rerender();
        },
       
        /**
         * Get cell state
         * @returns {Number} state
         */
         getState : function(state){
            return this.state;
        }
    }

    /**
     * ClosedCell renders cells with no rendered ships(for computer field)
     * 
     * @constructor
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {SeaBattle.Field} field 
     */
    SeaBattle.ClosedCell = function (x,y,field){
        Cell.apply(this,arguments);
        this.render=function(){
            let _this = this;
            let stateClasses = {
                 0:'state-empty',
                2:'attacked',        
                //  1:'is-taken-by-ship',        
                 1:'state-empty',        
                3:'is-taken-by-ship-and-attacked',
                4:'dead-ship'        
            } ;
    
            let width= (this.field.getWidth()/10),height=(this.field.getHeight()/10);
    
             this.$cell = $('<div class="cell "></div>').css({
                'width':(this.field.getWidth()/10)+"px",
                'height':(this.field.getHeight()/10)+"px",
    
                'display':'block',
                'float':'left',
                
                'margin':'0',
                'padding':'0',
                'box-sizing': 'border-box'
            }).attr('data-x',this.x)
            .attr('data-y',this.y)
    
            .addClass(stateClasses[this.state]);
            let content ='';
            if(this.state==Cell.STATE_EMPTY_AND_ATTACKED || this.state==Cell.STATE_IS_TAKEN_BY_SHIP_AND_ATTACKED){
                content = '<svg height="'+height+'" width="'+width+'" style="margin:auto">'+
                '<circle cx="'+Math.floor(width/2)+'" cy="'+Math.floor(height/2)+'" r="'+Math.floor(width/4)+'" stroke="black" stroke-width="1" fill="black" />'+
            '</svg>';    
            }
            if(this.state==Cell.DEAD_SHIP){
                content='<svg height="'+height+'" width="'+width+'">'+
                '<line x1="0" y1="0" x2="'+width+'" y2="'+height+'" style="stroke:rgb(255,0,0);stroke-width:2" />'+
                '<line x1="0" y1="'+height+'"  x2="'+width+'" y2="0"  style="stroke:rgb(255,0,0);stroke-width:2" />'+            
                '</svg>';
            }
      
            // this.$cell.html('<sub>'+this.x+','+this.y+'</sub>'+content);                                
            this.$cell.html(content);                                
    
            return this.$cell;
        }
    }
    

    extend(SeaBattle.ClosedCell,Cell); 
    
    let ClosedCell = SeaBattle.ClosedCell;

    /**
     * Opened Cell is renders cells with rendered ships
     * 
     * @constructor
     * @param {Number} x 
     * @param {Number} y 
     * @param {SeaBattle.Field} field 
     */
    SeaBattle.OpenedCell = function (x,y,field){
        Cell.apply(this,arguments);
    
    }
    
    extend( SeaBattle.OpenedCell,Cell); 
    let OpenedCell = SeaBattle.OpenedCell;

    OpenedCell.prototype.render=function(){
        let _this = this;
        let stateClasses = {
             0:'state-empty',
            2:'attacked',        
             1:'is-taken-by-ship',        
            3:'is-taken-by-ship-and-attacked',
            4:'dead-ship'        
        } ;

        let width= (this.field.getWidth()/10),height=(this.field.getHeight()/10);

         this.$cell = $('<div class="cell "></div>').css({
            'width':(this.field.getWidth()/10)+"px",
            'height':(this.field.getHeight()/10)+"px",

            'display':'block',
            'float':'left',
            
            'margin':'0',
            'padding':'0',
            'box-sizing': 'border-box'
        }).attr('data-x',this.x)
        .attr('data-y',this.y)
        .attr('data-state',this.state)
        .addClass(stateClasses[this.state]);
        let content ='';
        if(this.state==Cell.STATE_EMPTY_AND_ATTACKED || this.state==Cell.STATE_IS_TAKEN_BY_SHIP_AND_ATTACKED){
            content = '<svg height="'+height+'" width="'+width+'" style="margin:auto">'+
            '<circle cx="'+Math.floor(width/2)+'" cy="'+Math.floor(height/2)+'" r="'+Math.floor(width/4)+'" stroke="black" stroke-width="1" fill="black" />'+
        '</svg>';    
        }
        if(this.state==Cell.DEAD_SHIP){
            content='<svg height="'+height+'" width="'+width+'">'+
            '<line x1="0" y1="0" x2="'+width+'" y2="'+height+'" style="stroke:rgb(255,0,0);stroke-width:2" />'+
            '<line x1="0" y1="'+height+'"  x2="'+width+'" y2="0"  style="stroke:rgb(255,0,0);stroke-width:2" />'+            
            '</svg>';
        }
  
        // this.$cell.html('<sub>'+this.x+','+this.y+'</sub>'+content);                                
        this.$cell.html(content);                                

        return this.$cell;
    }

    SeaBattle.AttackMatrixDebugCell= function(x,y,field){
        let _render=OpenedCell.prototype.render;
        OpenedCell.apply(this,arguments);
        this.render = function(){
            _render.call(this);
            this.$cell.html(this.state);
            return this.$cell;
        }
    
    }
    extend(SeaBattle.AttackMatrixDebugCell,OpenedCell);

})(SeaBattle=SeaBattle|| {},jQuery)









  


 



 