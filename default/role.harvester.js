var roleBuilder = require('role.builder');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });
        //console.log("Creep " + creep.name +", targets1:" + targets);
        if(!target) {
             target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                        _.sum(structure.store) < structure.storeCapacity;
                }
            });
        }
        
        //console.log("Creep " + creep.name +", targets2:" + targets);

        if(target) {
            if((creep.memory.harvesting && creep.carry.energy < creep.carryCapacity) || (creep.carry.energy < 50)) {
                creep.say('🔄 harvest');
				creep.memory.harvesting = true;
				//console.log('Creep ' + creep.name + ', IF, E:' + creep.carry.energy + " h:" + creep.memory.harvesting);
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
				creep.memory.harvesting = false;
				creep.say('fill up ');
				//console.log('Creep ' + creep.name + ', ELSE, E:' + creep.carry.energy + " h:" + creep.memory.harvesting);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }  else {
            roleBuilder.run(creep);
        }
    }
};

module.exports = roleHarvester;