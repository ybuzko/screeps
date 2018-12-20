var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var source = creep.pos.findClosestByPath(FIND_SOURCES);
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