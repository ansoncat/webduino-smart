+(function(factory) {
    factory(window);
}(function(scope) {
    'use strict';

    var self;
    var proto;
    var _textSize = 2;
    var _cursorX = 0;
    var _cursorY = 0;
    var sendLength = 32;

    function SSD1306(board) {
        this._board = board;
        self = this;
        board.send([0xF0, 0x04, 0x01, 0x0, 0xF7]);
        board.send([0xF0, 0x04, 0x01, 0x02, _cursorX, _cursorY, 0xF7]);
        board.send([0xF0, 0x04, 0x01, 0x03, _textSize, 0xF7]);
        board.send([0xF0, 0x04, 0x01, 0x01, 0xF7]);
    }

    SSD1306.prototype = proto = Object.create(Object.prototype, {
        constructor: {
            value: SSD1306
        },
        textSize: {
            get: function() {
                return _textSize;
            },
            set: function(val) {
                board.send([0xF0, 0x04, 0x01, 0x03, val, 0xF7]);
                _textSize = val;
            }
        }
    });

    proto.clear = function() {
        board.send([0xF0, 0x04, 0x01, 0x01, 0xF7]);
    }

    proto.drawImage = function(num) {
        board.send([0xF0, 0x04, 0x01, 0x05, num, 0xF7]);
    }

    proto.render = function() {
        board.send([0xF0, 0x04, 0x01, 0x06, 0xF7]);
    }

    proto.save = function(data) {
        for (var i = 0; i < data.length; i = i + sendLength) {
            var chunk = data.substring(i, i + sendLength);
            saveChunk(i / 2, chunk);
        }
    }

    function saveChunk(startPos, data) {
        var CMD = [0xf0, 0x04, 0x01, 0x0A];
        var raw = [];
        raw = raw.concat(CMD);
        var n = '0000' + startPos.toString(16);
        n = n.substring(n.length - 4);
        for (var i = 0; i < 4; i++) {
            raw.push(n.charCodeAt(i));
        }
        raw.push(0xf7);
        // send Data //  
        CMD = [0xf0, 0x04, 0x01, 0x0B];
        raw = raw.concat(CMD);
        for (i = 0; i < data.length; i++) {
            raw.push(data.charCodeAt(i));
        }
        raw.push(0xf7);
        board.send(raw);
    }

    proto.print = function(cursorX, cursorY, str) {
        var len = arguments.length;
        if (len == 3) {
            _cursorX = cursorX;
            _cursorY = cursorY;
            board.send([0xF0, 0x04, 0x01, 0x02, cursorX, cursorY, 0xF7]);
        } else {
            str = cursorX;
            board.send([0xF0, 0x04, 0x01, 0x02, _cursorX, _cursorY, 0xF7]);
        }
        var strCMD = [0xF0, 0x04, 0x01, 0x04];
        for (var i = 0; i < str.length; i++) {
            strCMD.push(str.charCodeAt(i));
        }
        strCMD.push(0xF7);
        board.send(strCMD);
    }
    scope.SSD1306 = SSD1306;
}));