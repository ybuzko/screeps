var roleUpgrader = require('role.upgrader');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var targets = creep.room.find(FIND_CONSTRUCTION_SITES).filter(s => s.structureType != STRUCTURE_ROAD); // deprioritize roads
        if(!targets.length) targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        //if(!targets.length) targets = creep.room.find(FIND_MY_STRUCTURES,{filter:(s) => s.hits < s.hitsMax*0.8});
        //if(!targets.length) targets = creep.room.find(FIND_STRUCTURES,{filter:(s) => s.structureType === STRUCTURE_ROAD && s.hits < s.hitsMax*0.6});
        
            if(targets.length) {
        if(targets.length > 1) targets.sort(function(a,b){return a.progress > b.progress ? -1 : 1});

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            
        }
        else {
            //var sources = creep.room.find(FIND_SOURCES);
            var source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_CONTAINER &&  _.sum(s.store) >= creep.carryCapacity
            });
            if(source){
            if(creep.withdraw(source,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }} else {
                sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
            } else roleUpgrader.run(creep)
    }
};

module.exports = roleBuilder;