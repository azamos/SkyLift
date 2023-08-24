
const prepareCanvas = function () {
    let x = 0;
    let y = 0;
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    const img = document.getElementById("spaceship");
    ctx.drawImage(img, x+15, y+15, 50, 50);
    canvas.addEventListener('keydown', e =>{
        if (e.key == 'ArrowDown') {
            y += 5;
            e.preventDefault();
        }
        if (e.key == 'ArrowUp') {
            y -= 5;
            e.preventDefault();
        }
        if (e.key == 'ArrowRight') {
            x += 5;
            e.preventDefault();
        }
        if (e.key == 'ArrowLeft') {
            x -= 5;
            e.preventDefault();
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, 100, 100);
    });
}
