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
                while(remainingCapacity >0) {
                    try {addPart(CARRY)} catch(err) {};
                    try {addPart(CARRY)} catch(err) {};
                    try {addPart(MOVE)} catch(err) {};
                };
                break;
        };
        console.log('Spawning new ' + role + ' "' + newName + '" at spawn "' + spawn + '", capacity=' + maxCapacity + ', config=[' + config.join(',') + ']');
        var res = Game.spawns[spawn].spawnCreep(config, newName, {memory: {role: role}});
        console.log(res);
    };
};

module.exports = common;
