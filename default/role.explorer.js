var roleExplorer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(!creep.room.controller.my) {
            creep.moveTo(creep.room.controller);
        } else {
            if(Game.creeps['Explorer1'].pos.x !=0 || Game.creeps['Explorer1'].pos.y != 25) Game.creeps['Explorer1'].moveTo(0, 25);
        }
    }  
}

module.exports = roleExplorer;