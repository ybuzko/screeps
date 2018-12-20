var roleExplorer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(!creep.room.controller.my) {
            creep.moveTo(creep.room.controller);
        } else {
            if(Game.creeps['Explorer1'].pos.x !=49 || Game.creeps['Explorer1'].pos.y != 25) Game.creeps['Explorer1'].moveTo(49, 14);
        }
    }  
}

module.exports = roleExplorer;