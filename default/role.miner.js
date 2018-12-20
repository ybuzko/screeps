var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(!creep.memory.currentSourceId) {
            var sources = creep.pos.find(FIND_SOURCES).filter(function(source) { // we only want sources that don't have enough miners
                var miners = Game.creeps.filter(c => c.memory.role == 'miner' && c.memory.currentSourceId == source.id);
                if(miners.length == 0) {
                    return true;
                } else { // there is already a miner, let's see if they have enough power
                    var totalParts = miners.reduce((total, miner) => total + miner.body.filter(bp => bp == WORK).length);
                    return totalParts >= 6;
                };
            });
            if(sources.length > 1) { // nothing has been started yet, let's pick the closest thing
                creep.memory.currentSourceId = creep.pos.findClosestByPath(sources).id;
            } else {
                creep.memory.currentSourceId = sources[0].id;
            }
        }
        source = Game.

        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        } else {
        var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.pos.findInRange(FIND_SOURCES, 2).length > 0
        });
        if(container) creep.moveTo(container);
        }
    }
};

module.exports = roleMiner;