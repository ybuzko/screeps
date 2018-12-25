var roleUpgrader = require('role.upgrader');
var roleWorker = require('role.worker');
var roleMiner = require('role.miner');
var roleMineralMiner = require('role.mineralminer');
var roleHauler = require('role.hauler');
var roleMineralHauler = require('role.mineralhauler');
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
    
    _.each(Game.rooms, function(currentRoom) {

        var creepsByRole = common.creepsByRole(currentRoom);
        console.log(JSON.stringify(creepsByRole));

        if(Game.time % 100 == 0){ // log stuff every 1000 ticks
            var creepCount = {};
            _.each(creepsByRole, c => creepCount[c] = creepsByRole[c].length);
            console.log(Game.time + " creepCount: " + JSON.stringify(creepCount));
        };
        
        var hostiles = currentRoom.find(FIND_HOSTILE_CREEPS);
        if(hostiles.length > 0) {
            var username = hostiles[0].owner.username;
            Game.notify('User ${username} spotted in room ${roomName}');
            var towers = currentRoom.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            towers.forEach(tower => tower.attack(hostiles[0]));
            }

        // initialize room params
        if(!currentRoom.memory.numSources) {currentRoom.memory.numSources = currentRoom.find(FIND_SOURCES).length};
        // currentRoom.memory.numSources = currentRoom.find(FIND_SOURCES).length
        var sourcesToMine = Math.min(currentRoom.memory.numSources, currentRoom.controller.level); // no need to mine 2 sources at the start
        //var sourcesToMine = 2;

        // find available spawns in current room
        var spawns = _.filter(Game.spawns, (spawn) => spawn.room == currentRoom && !spawn.spawning);

        if(currentRoom.energyAvailable >=300 && spawns.length > 0) {

            var minerParts = 0;
            if(creepsByRole['miner']) _.each(creepsByRole['miner'], function(m){minerParts += m.body.filter(bp => bp.type == WORK).length});
            var haulerParts = 0;
            if(creepsByRole['hauler']) _.each(creepsByRole['hauler'], function(m){haulerParts += m.body.filter(bp => bp.type == CARRY).length});

            var spawn = spawns[0];
            // console.log("Total miner parts: " + minerParts);

            if(minerParts < sourcesToMine * 4) {
                
                common.spawnCreep(spawn.name,'miner');
            } else {
                if(!creepsByRole['hauler'] || (haulerParts < 8 && creepsByRole['worker'] && creepsByRole['worker'].length > 0) || creepsByRole['hauler'].length < 1) {
                    common.spawnCreep(spawn.name,'hauler');
                } else {
                    // if there's a ton of work, bring up more workers
                    var totalConstructionToDo = 0;
                    _.each(currentRoom.find(FIND_CONSTRUCTION_SITES), function(s) {totalConstructionToDo += (s.progressTotal - s.progress)});
                    if(!creepsByRole['worker'] || creepsByRole['worker'].length < (1 + Math.floor(totalConstructionToDo/10000))) {
                        common.spawnCreep(spawn.name,'worker');
                    } else {
                        // workers can stand in as upgraders, so we get to dedicated upgraders last
                        if(!creepsByRole['upgrader'] || creepsByRole['upgrader'].length < Math.min(currentRoom.controller.level, 1)) {
                            common.spawnCreep(spawn.name,'upgrader');
                        } else {
                            var extractors = currentRoom.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTRACTOR}});
                            if(extractors.length > 0 && (!creepsByRole['mineralminer'] || creepsByRole['mineralminer'].length < extractors.length)){
                                common.spawnCreep(spawn.name,'mineralminer');
                            } else {
                                if(extractors.length > 0 && (!creepsByRole['mineralminer'] || creepsByRole['mineralhauler'].length < extractors.length)){
                                    common.spawnCreep(spawn.name,'mineralhauler');
                                } 
                            }
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
        if(creep.memory.role == 'mineralminer') {
            roleMineralMiner.run(creep);
        }
        if(creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }
        if(creep.memory.role == 'mineralhauler') {
            roleMineralHauler.run(creep);
        }
        if(creep.memory.role == 'hauler-long') {
            roleHaulerLong.run(creep);
        }
        if(creep.memory.role == 'explorer') {
            roleExplorer.run(creep);
        }
    }
}