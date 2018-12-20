var roleUpgrader = require('role.upgrader');
var roleWorker = require('role.worker');
var roleMiner = require('role.miner');
var roleHauler = require('role.hauler');
var roleExplorer = require('role.explorer');
var common = require('common');


module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    for(var currentRoom in Game.rooms) {

        // initialize room params
        if(!currentRoom.memory.numSources) {currentRoom.memory.numSources = currentRoom.find(FIND_SOURCES).length};
        var sourcesToMine = min(currentRoom.memory.numSources, currentRoom.controller.level); // no need to mine 2 sources at the start

        var miners = _.filter(Game.creeps, (creep) => creep.room == currentRoom && creep.memory.role == 'miner');

        if(miners.length < sourcesToMine) {
            common.spawnCreep('miner');
        } else {
            var haulers = _.filter(Game.creeps, (creep) => creep.room == currentRoom && creep.memory.role == 'hauler');
            var workers = _.filter(Game.creeps, (creep) => creep.room == currentRoom && creep.memory.role == 'worker');

            if((haulers.length < sourcesToMine * 3 && workers.length > 0) || haulers.length < 1) {
                common.spawnCreep('hauler');
            } else {
                if(workers.length < 3) {
                    common.spawnCreep('worker');
                } else {
                    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
                    if(upgraders.length < currentRoom.controller.level) {
                        common.spawnCreep('upgrader');
                    }
                }
            }
        }

        for (var currentSpawn in Game.spawns.filter(s => s.room == currentRoom)) {
            if(currentSpawn.spawning) {
                var spawningCreep = Game.creeps[currentSpawn.spawning.name];
                currentSpawn.room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    currentSpawn.pos.x + 1,
                    currentSpawn.pos.y,
                    {align: 'left', opacity: 0.8});
            }
        }
    }
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
        if(creep.memory.role == 'explorer') {
            roleExplorer.run(creep);
        }

}