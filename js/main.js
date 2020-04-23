let arr = [
    [1, 1, 0, 0, 1, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0],
    [1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0],
    [1, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [1, 0, 1, 1, 1, 1, 1, 0, 0],
    [1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 1, 0, 0],
    [1, 0, 0, 0, 0, 1, 0, 0],
    [1, 0, 1]
];
/*
    определение максимальной ширины масива для прямоугольной матрицы
 */
function getSizeMaxLength(arr) {
    let sizeX = 0;
    arr.forEach( (e) => sizeX = Math.max(e.length,sizeX));
    return sizeX;
}
/*
    объект ячейка лаберинта
 */
function newCell(x, y, wall) {
    this.x = x;
    this.y = y;
    this.isVisible = false;
    this.isWall = wall !== 0;
}

const CELL_SIZE = 20;       //размер в пикселях ячеки лабиринта

const MAZE = new function () {
    let $ = (id) => {return document.getElementById(id)};
    let MAZE = this, cnv, ctx;
    let sizeY, sizeX, curX = -1, curY = -1;
    let arrMaze = [];

    let rect = (x,y,clr) => {
        ctx.fillStyle = clr;
        ctx.fillRect(x*CELL_SIZE+1,y*CELL_SIZE+1, CELL_SIZE, CELL_SIZE);
    };
    /*
     перерисовка всего игрового поля
     */
    MAZE.update = () => {
         ctx.clearRect(0, 0, width, height);
         for (let y=0; y<sizeY; y++ ){
             for (let x=0; x<sizeX; x++) {
                  if ( arrMaze[y][x].isVisible ) {
                     if ( arrMaze[y][x].isWall == true ) {
                         rect(x, y, "Brown");
                     } else {
                         rect(x, y, "Blue");
                     }

                 }
              }
         }
        //текущая позиция
        rect(curX, curY, 'White');
    };
    /*
    Проверка возможности пермещения по лабиринту
     */
    MAZE.checkMove = (deltaX, deltaY) => {
        let nextX = curX + deltaX;
        let nextY = curY + deltaY;

        if ( nextX>=0 && nextX<sizeX && nextX!==curX ) {
            arrMaze[curY][nextX].isVisible = true;
            if ( !arrMaze[curY][nextX].isWall ) {
                curX = nextX;
            }
        } else
        if ( nextY>=0 && nextY<sizeY && nextY!==curY ) {
            arrMaze[nextY][curX].isVisible = true;
            if (!arrMaze[nextY][curX].isWall) {
                curY = nextY;
            }
        }
    };
    /*
    установка размера игрового поля
     */
    MAZE.setFieldMaze = (y, x) => {
        sizeY = y;
        sizeX = x;
        width = sizeX * CELL_SIZE+2;
        height = sizeY * CELL_SIZE+2;
        cnv.width = width;
        cnv.height = height;
    };

    MAZE.start = (arr) => {
        cnv = $('cnv');
        ctx = cnv.getContext('2d');
        MAZE.setFieldMaze(arr.length, getSizeMaxLength(arr));

        //создание прямоугольной матрицы объектов из исходной матрицы
        for (let y=0; y<sizeY; y++){
            arrMaze[y]=[];
            for (let x=0; x<sizeX; x++)
                arrMaze[y][x] = new newCell(x, y, arr[y][x]);
        }

        //определение первой свободной ячейки в лабиринте, чтобы туда поместитеть указатель
        let x=0, y=0;
        do {
            if ( arrMaze[y][x].isWall === false ) {
                curX = arrMaze[y][x].x;
                curY = arrMaze[y][x].y;
                arrMaze[y][x].isVisible = true;
            }
            x++;
            if (x >= sizeX ) {
                x = 0;
                y++;
            }
        }
        while ((curX<0 || curY<0) && y<sizeY);

        MAZE.update();

        if ( curX<0 || curY<0 ) {
            return false;
        }

        window.addEventListener('keydown', (e) => {
            switch ( e.code ) {
                case 'ArrowLeft':
                    MAZE.checkMove(-1,0);
                    break;
                case 'ArrowRight':
                    MAZE.checkMove(1,0);
                    break;
                case 'ArrowUp':
                    MAZE.checkMove(0,-1);
                    break;
                case 'ArrowDown':
                    MAZE.checkMove(0,1);
                    break;
            }
            MAZE.update();
        });

        return true;
    };

    MAZE.key = (key) => {
        return down_keys[key];
    };


    MAZE.error = (msg) => {
        MAZE.update();
        MAZE.setFieldMaze(3,20);
        MAZE.update();

        ctx.textBaseline = "top";
        ctx.font= "16px";
        ctx.fillStyle = "Red";
        ctx.fillText(msg,60,5);
    }
};

