import { SpinReels } from "../game/game.js";
import { AddCoinValue, SubtractCoinValue, GetBalance, GetCurrCoinValue, GetBet, GetCurrBetValue, AddBetLevel, SubtractBetLevel, SubtractBalance } from "../game/bettingmanager.js";

export function InitializeUI(scene) {
    const centerX = scene.cameras.main.width / 2;
    const centerY = scene.cameras.main.height / 2;

    const bottomPanelCenterY = centerY + centerY / 1.3;

    LoadAllBackgrounds(scene, centerX, bottomPanelCenterY);
    LoadAllButtons(scene, centerX, bottomPanelCenterY);
    LoadAllText(scene, centerX, bottomPanelCenterY);
    UpdateBalanceText();

}

function LoadAllBackgrounds(scene, centerX, centerY) {
    scene.background = scene.add.image(0, 0, 'background').setOrigin(0, 0).setScrollFactor(0);

    scene.background.setDisplaySize(scene.game.config.width, scene.game.config.height);

    let dividerPanel = scene.add.image(0, 0, 'divider');

    dividerPanel.setDisplaySize(1058, 538);

    dividerPanel.setPosition(centerX, centerY - centerY / 1.9);

    // TODO: For resizing the screen depending on the screen size
    // window.addEventListener('resize', () => {
    //     scene.scale.resize(window.innerWidth, window.innerHeight);
    //     scene.background.setDisplaySize(scene.game.config.width, scene.game.config.height);
    // });

    let bottomPanel = scene.add.image(0, 0, 'bottomPanel');
    let levelPanel = scene.add.image(0, 0, 'levelPanel');
    let betPanel = scene.add.image(0, 0, 'levelPanel');
    let coinPanel = scene.add.image(0, 0, 'coinPanel');
    let balancePanel = scene.add.image(0, 0, 'levelPanel');

    bottomPanel.setDisplaySize(1300, 165);
    levelPanel.setDisplaySize(64, 53);
    betPanel.setDisplaySize(150, 53);
    coinPanel.setDisplaySize(94, 53);
    balancePanel.setDisplaySize(200, 53);

    bottomPanel.setPosition(centerX, centerY - 30);
    levelPanel.setPosition(centerX - centerX / 2.4, centerY + 8);
    betPanel.setPosition(centerX - centerX / 1.48, centerY + 8);
    coinPanel.setPosition(centerX + centerX / 2.3, centerY + 8);
    balancePanel.setPosition(centerX + centerX / 1.3, centerY + 8);
}

export let spinButton,
    autoButton,
    maxButton,
    plusLevelButton,
    minusLevelButton,
    plusCoinButton,
    minusCoinButton;

function LoadAllButtons(scene, centerX, centerY) {
    // Create the button image and set its initial state
    spinButton = scene.add.image(0, 0, 'spinButtonNormal').setInteractive();
    autoButton = scene.add.image(0, 0, 'autoButtonNormal').setInteractive();
    maxButton = scene.add.image(0, 0, 'maxButtonNormal').setInteractive();

    plusLevelButton = scene.add.image(0, 0, 'plusButtonNormal').setInteractive();
    minusLevelButton = scene.add.image(0, 0, 'minusButtonNormal').setInteractive();
    plusCoinButton = scene.add.image(0, 0, 'plusButtonNormal').setInteractive();
    minusCoinButton = scene.add.image(0, 0, 'minusButtonNormal').setInteractive();

    // Enable input for the button
    spinButton.setInteractive();
    autoButton.setInteractive();
    maxButton.setInteractive();
    plusLevelButton.setInteractive();
    minusLevelButton.setInteractive();
    plusCoinButton.setInteractive();
    minusCoinButton.setInteractive();

    //#region EventListener for Pointer
    // Event listener for pointer over (hover)
    spinButton.on('pointerover', function () {
        if (!this.disabled) {
            this.setTexture('spinButtonHover');
        }
    });
    autoButton.on('pointerover', function () {
        if (!this.disabled) {
            this.setTexture('autoButtonHover');
        }
    });
    maxButton.on('pointerover', function () {
        if (!this.disabled) {
            this.setTexture('maxButtonHover');
        }
    });

    plusLevelButton.on('pointerover', function () {
        if (!this.disabled) {
            this.setTexture('plusButtonHover');
        }
    });
    minusLevelButton.on('pointerover', function () {
        if (!this.disabled) {
            this.setTexture('minusButtonHover');
        }
    });
    plusCoinButton.on('pointerover', function () {
        if (!this.disabled) {
            this.setTexture('plusButtonHover');
        }
    });
    minusCoinButton.on('pointerover', function () {
        if (!this.disabled) {
            this.setTexture('minusButtonHover');
        }
    });
    //#endregion

    //#region Button position
    spinButton.setPosition(centerX, centerY);
    autoButton.setPosition(centerX - spinButton.width - 13, centerY);
    maxButton.setPosition(centerX + spinButton.width + 13, centerY);

    plusLevelButton.setPosition(centerX - centerX / 3, centerY + 8.3);
    minusLevelButton.setPosition(centerX - centerX / 2, centerY + 8.3);
    plusCoinButton.setPosition(centerX + centerX / 1.85, centerY + 8.3);
    minusCoinButton.setPosition(centerX + centerX / 3.05, centerY + 8.3);
    //#endregion

    // Event listener for pointer out (normal)
    //#region spinButton
    spinButton.on('pointerout', function () {
        if (!this.disabled) {
            this.setTexture('spinButtonNormal');
        }
    });

    // Event listener for pointer down (clicked)
    spinButton.on('pointerdown', function () {
        if (!this.disabled) {
            this.setTexture('spinButtonClicked');
            SpinReels(scene);
            spinButton.disable();
            dialogText.setText(" ");
            SubtractBalance();
            UpdateBalanceText();
        }
    });

    // Event listener for pointer up (return to hover state if still hovered)
    spinButton.on('pointerup', function () {
        if (!this.disabled) {
            if (this.input.pointerOver()) {
                this.setTexture('spinButtonHover');
            } else {
                this.setTexture('spinButtonNormal');
            }
        }
    });

    spinButton.disable = function () {
        this.disabled = true;
        this.setTexture('spinButtonDisabled');
        this.setInteractive();
    }

    spinButton.enable = function () {
        this.disabled = false;
        this.setTexture('spinButtonNormal');
        this.setInteractive();
    }
    //#endregion

    //#region autoButton
    autoButton.on('pointerout', function () {
        if (!this.disabled) {
            this.setTexture('autoButtonNormal');
        }
    });

    // Event listener for pointer down (clicked)
    autoButton.on('pointerdown', function () {
        if (!this.disabled) {
            this.setTexture('autoButtonClicked');
        }
    });

    // Event listener for pointer up (return to hover state if still hovered)
    autoButton.on('pointerup', function () {
        if (!this.disabled) {
            if (this.input.pointerOver()) {
                this.setTexture('autoButtonHover');
            } else {
                this.setTexture('autoButtonNormal');
            }
        }
    });

    autoButton.disable = function () {
        this.disabled = true;
        this.setTexture('autoButtonDisabled');
        this.setInteractive();
    }

    autoButton.enable = function () {
        this.disabled = false;
        this.setTexture('autoButtonNormal');
        this.setInteractive();
    }
    //#endregion

    //#region maxButton
    maxButton.on('pointerout', function () {
        if (!this.disabled) {
            this.setTexture('maxButtonNormal');
        }
    });

    // Event listener for pointer down (clicked)
    maxButton.on('pointerdown', function () {
        if (!this.disabled) {
            this.setTexture('maxButtonClicked');
        }
    });

    // Event listener for pointer up (return to hover state if still hovered)
    maxButton.on('pointerup', function () {
        if (!this.disabled) {
            if (this.input.pointerOver()) {
                this.setTexture('maxButtonHover');
            } else {
                this.setTexture('maxButtonNormal');
            }
        }
    });

    maxButton.disable = function () {
        this.disabled = true;
        this.setTexture('maxButtonDisabled');
        this.setInteractive();
    }

    maxButton.enable = function () {
        this.disabled = false;
        this.setTexture('maxButtonNormal');
        this.setInteractive();
    }
    //#endregion

    //#region plusLevelButton
    plusLevelButton.on('pointerout', function () {
        if (!this.disabled) {
            this.setTexture('plusButtonNormal');
        }
    });

    // Event listener for pointer down (clicked)
    plusLevelButton.on('pointerdown', function () {
        if (!this.disabled) {
            this.setTexture('plusButtonClicked');
            AddBetLevel();
            UpdateBetLevelText();
            UpdateBetText();
        }
    });

    // Event listener for pointer up (return to hover state if still hovered)
    plusLevelButton.on('pointerup', function () {
        if (!this.disabled) {
            if (this.input.pointerOver()) {
                this.setTexture('plusButtonHover');
            } else {
                this.setTexture('plusButtonNormal');
            }
        }
    });

    plusLevelButton.disable = function () {
        this.disabled = true;
        this.setTexture('plusButtonDisabled');
        this.setInteractive();
    }

    plusLevelButton.enable = function () {
        this.disabled = false;
        this.setTexture('plusButtonNormal');
        this.setInteractive();
    }
    //#endregion

    //#region minusLevelButton
    minusLevelButton.on('pointerout', function () {
        if (!this.disabled) {
            this.setTexture('minusButtonNormal');
        }
    });

    // Event listener for pointer down (clicked)
    minusLevelButton.on('pointerdown', function () {
        if (!this.disabled) {
            this.setTexture('minusButtonClicked');
            SubtractBetLevel();
            UpdateBetLevelText();
            UpdateBetText();
        }
    });

    // Event listener for pointer up (return to hover state if still hovered)
    minusLevelButton.on('pointerup', function () {
        if (!this.disabled) {
            if (this.input.pointerOver()) {
                this.setTexture('minusButtonHover');
            } else {
                this.setTexture('minusButtonNormal');
            }
        }
    });

    minusLevelButton.disable = function () {
        this.disabled = true;
        this.setTexture('minusButtonDisabled');
        this.setInteractive();
    }

    minusLevelButton.enable = function () {
        this.disabled = false;
        this.setTexture('minusButtonNormal');
        this.setInteractive();
    }
    //#endregion

    //#region plusCoinButton
    plusCoinButton.on('pointerout', function () {
        if (!this.disabled) {
            this.setTexture('plusButtonNormal');
        }
    });

    // Event listener for pointer down (clicked)
    plusCoinButton.on('pointerdown', function () {
        if (!this.disabled) {
            this.setTexture('plusButtonClicked');
            AddCoinValue();
            if (GetCurrCoinValue() === 1.00) {
                plusCoinButton.disable();
            }
            UpdateCoinValueText();
            UpdateBalanceText();
        }
    });

    // Event listener for pointer up (return to hover state if still hovered)
    plusCoinButton.on('pointerup', function () {
        if (!this.disabled) {
            if (this.input.pointerOver()) {
                this.setTexture('plusButtonHover');
            } else {
                this.setTexture('plusButtonNormal');
            }
        }
    });

    plusCoinButton.disable = function () {
        this.disabled = true;
        this.setTexture('plusButtonDisabled');
        this.setInteractive();
    }

    plusCoinButton.enable = function () {
        this.disabled = false;
        this.setTexture('plusButtonNormal');
        this.setInteractive();
    }
    //#endregion

    //#region minusCoinButton
    minusCoinButton.on('pointerout', function () {
        if (!this.disabled) {
            this.setTexture('minusButtonNormal');
        }
    });

    // Event listener for pointer down (clicked)
    minusCoinButton.on('pointerdown', function () {
        if (!this.disabled) {
            this.setTexture('minusButtonNormal');
            SubtractCoinValue();
            UpdateCoinValueText();
            UpdateBalanceText();
        }
    });

    // Event listener for pointer up (return to hover state if still hovered)
    minusCoinButton.on('pointerup', function () {
        if (!this.disabled) {
            if (this.input.pointerOver()) {
                this.setTexture('minusButtonNormal');
            } else {
                this.setTexture('minusButtonNormal');
            }
        }
    });

    minusCoinButton.disable = function () {
        this.disabled = true;
        this.setTexture('minusButtonNormal');
        this.setInteractive();
    }

    minusCoinButton.enable = function () {
        this.disabled = false;
        this.setTexture('minusButtonNormal');
        this.setInteractive();
    }
    //#endregion
}

export let dialogText;
export let balanceText;
export let betText;
export let levelText;
export let coinText;

function LoadAllText(scene, centerX, centerY) {
    dialogText = scene.add.text(centerX - (centerX / 200), centerY - (centerY / 8.5), " ",
        { fontFamily: 'Arial', fontSize: 33, color: "#ffffff", padding: { x: 32, y: 16 } })
        .setOrigin(0.5, 0.5);

    balanceText = scene.add.text(centerX + (centerX / 1.3), centerY + 10, GetBalance(),
        { fontFamily: 'Arial', fontSize: 33, color: "#ffffff", padding: { x: 32, y: 16 } })
        .setOrigin(0.5, 0.5);

    betText = scene.add.text(centerX - (centerX / 1.48), centerY + 10, GetBet(),
        { fontFamily: 'Arial', fontSize: 33, color: "#ffffff", padding: { x: 32, y: 16 } })
        .setOrigin(0.5, 0.5);

    levelText = scene.add.text(centerX - (centerX / 2.4), centerY + 10, GetCurrBetValue(),
        { fontFamily: 'Arial', fontSize: 33, color: "#ffffff", padding: { x: 32, y: 16 } })
        .setOrigin(0.5, 0.5);

    coinText = scene.add.text(centerX + (centerX / 2.3), centerY + 10, GetCurrCoinValue(),
        { fontFamily: 'Arial', fontSize: 33, color: "#ffffff", padding: { x: 32, y: 16 } })
        .setOrigin(0.5, 0.5);
}

export function UpdateBalanceText() {
    balanceText.setText(GetBalance());
}

function UpdateCoinValueText() {
    coinText.setText(GetCurrCoinValue());
}

function UpdateBetText() {
    betText.setText(GetBet());
}

function UpdateBetLevelText() {
    levelText.setText(GetCurrBetValue());
}