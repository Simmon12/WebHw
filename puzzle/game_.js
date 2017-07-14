(function($) {
    var puzzle = {
        level: 4,
        space: new Coordinate(3, 3),
        randomTime: 100,
        gameOver: true,
        firstEnter: true,
        timeIntervalId: null,
        costTime: 0,
        costStep: 0
    };

    $(document).ready(function () {
        // dynamically create panel
        var panels = [];
        _.times(puzzle.level*puzzle.level-1, function(i) {
            panels[i] = "<div id='panel" + i + "' class='panels'></div>";
        });

        $('#puzzle').html(panels.join('\n'));
        $('#restart').click(newGame);
        $('.panels').click(move);

    });

    function Coordinate(x, y) {
        this.row = x;
        this.col = y;
        this.toIndex = function () {
            return this.row * puzzle.level + this.col;
        }
    }

    function ticktock () {
        ++puzzle.costTime;
        showGameInfo('game-time', puzzle.costTime + 's');
    }

    function showGameInfo(info, status) {
        document.getElementById(info).value = status;
    }

    function newGame() {
        if (!isWrongClick()) {
          initGame();
          // randomly generate a valid puzzle
          _.times(puzzle.randomTime, function () {
            swapSpacePanel(_.sample(adjacentPanels()));
          })
        }
    }

    function isWrongClick () {
      if(puzzle.firstEnter) {
        $('#restart').text = "重新开始";
        $('.game-container:first').addClass('playing');
        $('#puzzle').removeClass('puzzle-invisible');
        puzzle.firstEnter = false;
      }
      else if (!confirm('重新开始会清除当前的状态，重新生成拼图‚\n是否继续？ (误操作请按取消)')) {
            return true; // check if wrong click
      }
      return false;
    }

    function initGame() {
      if(puzzle.timeIntervalId)
        clearInterval(puzzle.timeIntervalId);
        puzzle.timeIntervalId = setInterval(ticktock, 1000); // count for playing time
        puzzle.gameOver = false;
        puzzle.costStep = 0;
        puzzle.costTime = 0;
        $('#game-step').val(0);
        $('#game-time').val(0);
    }

    function move() {
        if(!puzzle.gameOver) {
            var currentIndex = parseInt(this.id.replace(/[^0-9]/ig,"")),
                validSteps = validPanels();
            for(var i = 0; i < validSteps.length; i++) {
                if(currentIndex == validSteps[i].toIndex()) {
                    break;
                }
            }
            if ( i != validSteps.length) {
                // count for step
                ++puzzle.costStep;
                showGameInfo('game-step', puzzle.costStep + '步');
                swapSpacePanel(validSteps[i]);
            }

            checkWin();
        }
    }

    function checkWin() {
        var panels = document.getElementsByClassName('panels');
        for(var i = 0; i < panels.length; i++) {
            var currentIndex = parseInt(panels[i].id.replace(/[^0-9]/ig, ""));
            if(currentIndex != i )
                return;
        }
        //has win
        puzzle.gameOver = true;
        clearInterval(puzzle.timeIntervalId);
        alert('恭喜！你完成了拼图\n' + '共用去' + puzzle.costTime + '秒，' + puzzle.costStep + '步');
    }

    function swapSpacePanel(nextStep) {
        // swap two panels
        // var panel = document.getElementById('panel' + nextStep.toIndex());
        // panel.id = 'panel' + puzzle.space.toIndex();
        // puzzle.space = nextStep;
                // check if valid
        if (_.inRange(nextStep.row, puzzle.level) &&
            _.inRange(nextStep.col, puzzle.level)) {
            $('#panel' + nextStep.toIndex()).attr('id', 'panel' + puzzle.space.toIndex());
            puzzle.space = nextStep;
        }
    }

    // compute valid panels around space
    // compute panels around space
    function adjacentPanels() {
        var step = [[-1, 0], [1, 0], [0, 1], [0, -1]],
            result = [];
        _.times(4, function (i) {
            var row = puzzle.space.row + step[i][0],
                col = puzzle.space.col + step[i][1];
            result[i] = new Coordinate(row, col);
        });
        return result;
    }
})();
