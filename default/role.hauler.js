var common = require('common');

var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(((creep.memory.collecting && creep.carry.energy < creep.carryCapacity) || (creep.carry.energy < 50))) {
            // creep.say('🔄 collect');

            // 1) Prioritize dropped stuff
            var source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                    filter: (d) => d.resourceType == RESOURCE_ENERGY && d.amount >= creep.carryCapacity/4});

            // 2) Nothing is dropped, let's transfer stuff from the fullest static mining container
            if(!source) {
                var sources = creep.room.find(FIND_STRUCTURES, {
                        filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.pos.findInRange(FIND_SOURCES, 1).length > 0
                });
                if(sources.length > 1) {
                    sources.sort((a,b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY] );
                }
                source = sources[0];
                 // only consider drops that are worth half our tank or more
            }

            creep.memory.collecting = true;
            common.getEnergy(creep, source);
        } else {
            creep.memory.collecting = false;
            // creep.say('deliver');

            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
                });
            if(!target) {
                 target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                            _.sum(structure.store) < structure.storeCapacity && structure.pos.findInRange(FIND_SOURCES, 1).length === 0;
                    }
                });
            }

            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
    }
};

module.exports = roleHauler;