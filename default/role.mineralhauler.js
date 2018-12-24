var common = require('common');

var roleMineralHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(((creep.memory.collecting && _.sum(creep.carry) < creep.carryCapacity) || (_.sum(creep.carry) < 50))) {
            //console.log(creep.name + " collecting")
            // creep.say('🔄 collect');

            // 1) Prioritize dropped stuff
            var source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                    filter: (d) => d.resourceType == RESOURCE_HYDROGEN && d.amount >= creep.carryCapacity/4});

            // 2) Nothing is dropped, let's transfer stuff from the fullest static mining container
            if(!source) {
                //console.log(creep.name + " looking for hydro")
                var sources = creep.room.find(FIND_STRUCTURES, {
                        filter: (s) => (s.structureType == STRUCTURE_CONTAINER && ((s.pos.findInRange(FIND_MINERALS, 1).length > 0)))
                });
                if(sources.length > 1) {
                    sources.sort((a,b) => b.store[RESOURCE_HYDROGEN] - a.store[RESOURCE_HYDROGEN] );
                }
                source = sources[0];
                //console.log(JSON.stringify(source));
                 // only consider drops that are worth half our tank or more
            }

            creep.memory.collecting = true;
            common.getEnergy(creep, source, RESOURCE_HYDROGEN);
        } else {
            creep.memory.collecting = false;
            // creep.say('deliver');

            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) &&
                            _.sum(structure.store) < structure.storeCapacity && structure.pos.findInRange(FIND_SOURCES, 1).length === 0 && structure.pos.findInRange(FIND_MINERALS, 1).length === 0;
                    }
                });
            

            if(!target) {
                 target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE) &&
                            _.sum(structure.store) < structure.storeCapacity && structure.pos.findInRange(FIND_SOURCES, 1).length === 0;
                    }
                });
            }

            if(creep.transfer(target, RESOURCE_HYDROGEN) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
    }
};

module.exports = roleMineralHauler;