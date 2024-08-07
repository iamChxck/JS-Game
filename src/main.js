import { GenerateReel } from "./game/game.js";
import { InitializeImages } from "./UI/image-loader.js";
import { InitializeUI } from "./UI/ui.js";

const config = {
    type: Phaser.AUTO,
    width: 1300,
    height: 700,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    parent: 'game-container',
    backgroundColor: '#000000',
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);

function preload() {
    console.log("Preloading assets...");
    
    InitializeImages(this);

    console.log("Assets loaded.");
}

function create() {
    InitializeUI(this);
    GenerateReel(this);
}



function update() {
    // Game update logic
}