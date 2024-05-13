window.onload = function() {
    var canvas = document.getElementById('gameCanvas');
    var context = canvas.getContext('2d');

    var gridSpacing = 50;

    for (var x = 0; x <= canvas.width; x += gridSpacing) {
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
    }

    for (var y = 0; y <= canvas.height; y += gridSpacing) {
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
    }

    context.strokeStyle = 'black';
    context.stroke();
}