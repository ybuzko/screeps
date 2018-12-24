var roleExplorer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(!creep.room.controller.my) {
            if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            if(Game.creeps['Explorer1'].pos.x !=49 || Game.creeps['Explorer1'].pos.y != 14) Game.creeps['Explorer1'].moveTo(49, 14);
        }
    }  
}

module.exports = roleExplorer;