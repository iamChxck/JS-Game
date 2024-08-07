export function InitializeImages(scene) {
    //#region Reel Symbols
    scene.load.image('blue', 'assets/symbols/blue.png');
    scene.load.image('red', 'assets/symbols/red.png');
    scene.load.image('green', 'assets/symbols/green.png');
    scene.load.image('yellow', 'assets/symbols/yellow.png');
    scene.load.image('seven', 'assets/symbols/seven.png');
    scene.load.image('bar', 'assets/symbols/bar.png');
    scene.load.image('wild', 'assets/symbols/wild.png');

    scene.load.image('blueBlurred', 'assets/symbols/blue_blurred.png');
    scene.load.image('redBlurred', 'assets/symbols/red_blurred.png');
    scene.load.image('greenBlurred', 'assets/symbols/green_blurred.png');
    scene.load.image('yellowBlurred', 'assets/symbols/yellow_blurred.png');
    scene.load.image('sevenBlurred', 'assets/symbols/seven_blurred.png');
    scene.load.image('barBlurred', 'assets/symbols/bar_blurred.png');
    scene.load.image('wildBlurred', 'assets/symbols/wild_blurred.png');
    //#endregion

    //#region UI
    // UI spin button
    scene.load.image('spinButtonNormal', 'assets/ui/buttons/spin/spin_up.png');
    scene.load.image('spinButtonHover', 'assets/ui/buttons/spin/spin_over.png');
    scene.load.image('spinButtonClicked', 'assets/ui/buttons/spin/spin_down.png');
    scene.load.image('spinButtonDisabled', 'assets/ui/buttons/spin/spin_disabled.png');

    // UI auto button
    scene.load.image('autoButtonNormal', 'assets/ui/buttons/auto/auto_up.png');
    scene.load.image('autoButtonHover', 'assets/ui/buttons/auto/auto_over.png');
    scene.load.image('autoButtonClicked', 'assets/ui/buttons/auto/auto_down.png');
    scene.load.image('autoButtonDisabled', 'assets/ui/buttons/auto/auto_disabled.png');

    // UI max button
    scene.load.image('maxButtonNormal', 'assets/ui/buttons/max/max_up.png');
    scene.load.image('maxButtonHover', 'assets/ui/buttons/max/max_over.png');
    scene.load.image('maxButtonClicked', 'assets/ui/buttons/max/max_down.png');
    scene.load.image('maxButtonDisabled', 'assets/ui/buttons/max/max_disabled.png');

    // UI plus button
    scene.load.image('plusButtonNormal', 'assets/ui/buttons/plus/plus_up.png');
    scene.load.image('plusButtonHover', 'assets/ui/buttons/plus/plus_over.png');
    scene.load.image('plusButtonClicked', 'assets/ui/buttons/plus/plus_down.png');
    scene.load.image('plusButtonDisabled', 'assets/ui/buttons/plus/plus_disabled.png');

    // UI minus button
    scene.load.image('minusButtonNormal', 'assets/ui/buttons/minus/minus_up.png');
    scene.load.image('minusButtonHover', 'assets/ui/buttons/minus/minus_over.png');
    scene.load.image('minusButtonClicked', 'assets/ui/buttons/minus/minus_down.png');
    scene.load.image('minusButtonDisabled', 'assets/ui/buttons/minus/minus_disabled.png');

    // UI background
    scene.load.image('background', 'assets/ui/background.jpg');
    scene.load.image('bottomPanel', 'assets/ui/bottom_panel.png');
    scene.load.image('levelPanel', 'assets/ui/level_panel.png');
    scene.load.image('coinPanel', 'assets/ui/coin_panel.png');
    scene.load.image('divider', 'assets/ui/dividers.png');

    //#endregion
}