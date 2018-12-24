var roleUpgrader = require('role.upgrader');
var roleWorker = require('role.worker');
var roleMiner = require('role.miner');
var roleHauler = require('role.hauler');
var roleHaulerLong = require('role.hauler-long');
var roleExplorer = require('role.explorer');
var common = require('common');


module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    if(Game.time % 100 == 0){ // log stuff every 100 ticks
        
    }

    _.each(Game.rooms, function(currentRoom) {
        
        // initialize room params
        if(!currentRoom.memory.numSources) {currentRoom.memory.numSources = currentRoom.find(FIND_SOURCES).length};
        // currentRoom.memory.numSources = currentRoom.find(FIND_SOURCES).length
        var sourcesToMine = Math.min(currentRoom.memory.numSources, currentRoom.controller.level); // no need to mine 2 sources at the start
        //var sourcesToMine = 2;

        // find available spawns in current room
        var spawns = _.filter(Game.spawns, (spawn) => spawn.room == currentRoom && !spawn.spawning);
        
        
        
        if(currentRoom.energyAvailable == currentRoom.energyCapacityAvailable && spawns.length > 0) {

            var miners = _.filter(Game.creeps, (creep) => creep.room == currentRoom && creep.memory.role == 'miner');
            var minerParts = 0;
            _.each(miners, function(m){minerParts += m.body.filter(bp => bp.type == WORK).length});
            var haulers = _.filter(Game.creeps, (creep) => creep.room == currentRoom && creep.memory.role == 'hauler');
            var workers = _.filter(Game.creeps, (creep) => creep.room == currentRoom && creep.memory.role == 'worker');
            var upgraders = _.filter(Game.creeps, (creep) => creep.room == currentRoom && creep.memory.role == 'upgrader');
            var haulersLong = _.filter(Game.creeps, (creep) => creep.room == currentRoom && creep.memory.role == 'hauler-long');
            var spawn = spawns[0];
            common.spawnCreep(spawn.name,'worker');
            // console.log("Total miner parts: " + minerParts);

            if(minerParts < sourcesToMine * 4) {
                
                common.spawnCreep(spawn.name,'miner');
            } else {
                if((haulers.length < 1 && workers.length > 0) || haulers.length < 1) {
                    common.spawnCreep(spawn.name,'hauler');
                } else {
                    // if there's a ton of work, bring up more workers
                    var totalConstructionToDo = 0;
                    _.each(currentRoom.find(FIND_CONSTRUCTION_SITES), function(s) {totalConstructionToDo += (s.progressTotal - s.progress)});
                    if(workers.length < (2 + Math.floor(totalConstructionToDo/10000))) {
                        common.spawnCreep(spawn.name,'worker');
                    } else {
                        // workers can stand in as upgraders, so we get to dedicated upgraders last
                        if(upgraders.length < Math.min(currentRoom.controller.level, 2)) {
                            common.spawnCreep(spawn.name,'upgrader');
                        } else {
                            //if(haulersLong.length < 2){
                            //    common.spawnCreep(spawn.name,'hauler-long');
                            //} 
                        }
                    }
                }
            }
        }

        for (var currentSpawn in _.filter(Game.spawns,(s) => s.room == currentRoom)) {
            if(currentSpawn.spawning) {
                var spawningCreep = Game.creeps[currentSpawn.spawning.name];
                currentSpawn.room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    currentSpawn.pos.x + 1,
                    currentSpawn.pos.y,
                    {align: 'left', opacity: 0.8});
            }
        }
    });

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'worker') {
            roleWorker.run(creep);
        }
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        if(creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }
        if(creep.memory.role == 'hauler-long') {
            roleHaulerLong.run(creep);
        }
        if(creep.memory.role == 'explorer') {
            roleExplorer.run(creep);
        }
    }
}