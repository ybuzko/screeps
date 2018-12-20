var roleBuilder = require('role.builder');

var roleHauler = {

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
                        _.sum(structure.store) < structure.storeCapacity && structure.pos.findInRange(FIND_SOURCES, 1).length === 0;
                }
            });
        }
        
        //console.log("Creep " + creep.name +", targets2:" + targets);

        if(target) {
            var dropped = creep.room.find(FIND_DROPPED_RESOURCES);
            //console.log(dropped.length);
            var sources = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.pos.findInRange(FIND_SOURCES, 2).length > 0
            });
            
            if((creep.memory.harvesting && creep.carry.energy < creep.carryCapacity) || (creep.carry.energy < 50)) {
                creep.say('🔄 collect');
				creep.memory.harvesting = true;
				if(dropped.length) {
                    if(creep.pickup(dropped[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(dropped[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
				} else {
                    if(creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
				    
				}
            } else {
				creep.memory.harvesting = false;
				creep.say('deliver');
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

module.exports = roleHauler;