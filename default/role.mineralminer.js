var common = require('common');

var roleMineralMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(!creep.memory.currentSourceId || Game.getObjectById(creep.memory.currentSourceId).energy == 0) { // if depleted, switch
            var sources = creep.room.find(FIND_MINERALS).filter(function(source) { // we only want sources that don't have enough miners
                if(source.energy == 0) return false;
                var miners = _.filter(Game.creeps,(c) => c.memory.role == 'miner' && c.memory.currentSourceId == source.id);
                if(miners.length == 0) {
                    return true;
                } else { // there is already a miner, let's see if they have enough power
                    var totalParts = 0;
                    _.each(miners, function(m){totalParts + m.body.filter(bp => bp.type == WORK).length});
                    //console.log(totalParts);
                    return totalParts < 5;
                };
            });
            if(sources.length > 1) { // nothing has been started yet, let's pick the closest thing
                creep.memory.currentSourceId = creep.pos.findClosestByPath(sources).id;
            } else {
                if(sources.length) {
                creep.memory.currentSourceId = sources[0].id;
                }
            }
        }
        if(creep.memory.currentSourceId){
        source = Game.getObjectById(creep.memory.currentSourceId);

        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        } else {
        var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.pos.isNearTo(source.pos)
        });
        if(container) creep.moveTo(container);
        }
        }
    }
};

module.exports = roleMineralMiner;