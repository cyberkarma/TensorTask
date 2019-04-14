 
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function ArraySum(){
    var arrays= arguments, results= [], 
    count= arrays[0].length, L= arrays.length, 
    sum, next= 0, i;
    while(next<count){
        sum= 0, i= 0;
        while(i<L){
            sum+= Number(arrays[i++][next]);
        }
        results[next++]= sum;
    }
    return results;
}

function extend(Child, Parent) {
	var F = function() { }
	F.prototype = Parent.prototype
	Child.prototype = new F()
	Child.prototype.constructor = Child
	Child.superclass = Parent.prototype
}