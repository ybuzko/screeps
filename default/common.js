var common = {

    spawnCreep: function(spawn, role) {

        var newName = role + Game.time;
        var config = [];
        var maxCapacity = Game.spawns[spawn].room.energyCapacityAvailable;
        var remainingCapacity = maxCapacity;
        var addPart = function(part) {config.push(part); remainingCapacity-=BODYPART_COST[part];};
        switch(role) {
            case "miner":
                addPart(MOVE);
                while(remainingCapacity >= BODYPART_COST[WORK]) addPart(WORK);
                if(remainingCapacity >= BODYPART_COST(CARRY) addPart(CARRY);
                break;
            case "upgrader":
            case "worker:
                addPart(MOVE);
                if(maxCapacity > 400) addPart(MOVE);
                while(remainingCapacity >= BODYPART_COST[WORK]) {
                    addPart(WORK);
                    try {
                        addPart(CARRY)
                    } catch(err) {};
                };
                break;
            case "hauler":
                while(remainingCapacity > 0) {
                    try {addPart(CARRY)} catch(err) {};
                    try {addPart(CARRY)} catch(err) {};
                    try {addPart(MOVE)} catch(err) {};
                };
                break;
        };
        console.log('Spawning new ' + role + ' "' + newName + '" at spawn "' + spawn + '", capacity=' + maxCapacity + ', config=[' + config.join(',') + ']');
        var res = Game.spawns[spawn].spawnCreep(config, newName, {memory: {role: role}});
        console.log(res);
    },

    findClosestEnergySource: function(creep) {
        // 1) Container is preferable
        var source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_CONTAINER &&  _.sum(s.store) >= creep.carryCapacity
        });
        // 2) If there's no container, let's look for dropped energy
        if(!source) {
            creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, {
            filter: (d) => d.resourceType == RESOURCE_ENERGY && d.amount >= creep.carryCapacity/2}); // only consider drops that are worth half our tank or more
        }
        // 3) There's no container and nothing dropped, resort to mining
        if(!source) {
            source = creep.pos.findClosestByPath(FIND_SOURCES);
        }
        return source;
    },

    getEnergy: function(creep, source){
        var res;
        if(source instanceof Resource) res = creep.pickup(source);
        if(source instanceof StructureContainer) res = creep.withdraw(source,RESOURCE_ENERGY);
        if(source instanceof Source) res = creep.harvest(source);

        if(res == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {reusePath: 10, visualizePathStyle: {stroke: '#ffaa00'}});
        }
    },

    doWork: function(creep, target){
        var res;
        if(target instanceof ConstructionSite) res = creep.build(target);
        if(target instanceof StructureController) {
            res = creep.upgradeController(target);}
        } else {
            if(target instanceof Structure) res = creep.repair(target);
        }
        if(res == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {reusePath: 10, visualizePathStyle: {stroke: '#ff00ff'}});
        }
    }

};

module.exports = common;
