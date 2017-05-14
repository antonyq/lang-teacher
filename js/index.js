var fs = require('fs');

window.onload = function () {
    const {remote} = require('electron');
    const {BrowserWindow} = remote;
    const win = BrowserWindow.getFocusedWindow();

    remote.getCurrentWindow().toggleDevTools();

    window.storageManager = new StorageManager();
    window.player = new Player('player');

    initApp();
};

function setWordImg (word) {
    word = word || storageManager.getRandomWord();

    if (word) {
        var imgPath = (storageManager.getRecord(word).path || "").replace(/\\/g, "/");
        var imgScale = storageManager.getRecord(word).scale || 1;
        var imgRotation = storageManager.getRecord(word).rotation || 0;

        $(".imgArea").css({
            "background": "url('" + imgPath + "') center center no-repeat",
            "background-size": "contain"
        });

        setTransform('imgArea', {rotation: imgRotation, scale: imgScale});


        $(".completeWord").html(word);
        $(".inputWord").val('');
        $(".inputWord").attr('placeholder', word);
        $(".inputWord").focus();
        $(".wordList > li").each(function () {
            if ($(this).html() == word) {
                $(this).addClass("highlightedWord");
            } else {
                $(this).removeClass("highlightedWord");
            }
        });

        try {
            if ($(".wordList > li").length) $(".wordList").scrollTo(".highlightedWord");
        } catch (e) {
            return e;
        }
    }
}

function setNextWordImg () {
    var $nextWord = $(".highlightedWord").next();
    $(".word").removeClass("highlightedWord");
    stopEffects();
    setWordImg( (! $nextWord.length) ? $($(".word")[0]).html() : $nextWord.html() );
}

function setPreviousWordImg () {
    var $prevWord = $(".highlightedWord").prev();
    $(".word").removeClass("highlightedWord");
    setWordImg( (! $prevWord.length) ? $($(".word").last()).html() : $prevWord.html() );
}

function initWordList () {
    var $wordList = $(".wordList"), i = 0;
    $wordList.html("");
    console.log(storageManager.dictionary);
    for (var word in storageManager.dictionary) {
        if (storageManager.dictionary.hasOwnProperty(word)) {
            $wordList.append("<li class='word' id='word" + (i++) + "' onclick='setWordImg($(this).html())'>" + word.toString() + "</li>");
        }
    }
    setWordImg();
}

function setWordPopup (word) {
    $(".uploadImgArea").css("background", "rgba(200, 200, 200, 0.8)");
    $(".uploadImgArea > span").show();

    if (word) {
        popupData.word = word;
        popupData.img = storageManager.getRecord(word).path;
        $(".inputWordArea").val(word);
        $('.wordPopup .label').html(storageManager.getRecord(word).audio.path.split('\\')[storageManager.getRecord(word).audio.path.split('\\').length - 1]);

        var options = {
            path: (storageManager.getRecord(word).path || '').replace(/\\/g, '/'),
            rotation: storageManager.getRecord(word).rotation || 0,
            scale: storageManager.getRecord(word).scale || 1
        };

        setTransform('uploadImgArea', options);

        var scrollElem = document.getElementsByClassName('imgSizeBarWrapper')[0];
        scrollElem.scrollTop = (1 - storageManager.getRecord(word).scale || 1) * ($('.imgSizeBar').height() - $('.imgSizeBarWrapper').height());


        $(".uploadImgArea").css("background", "url('" + options.path + "') center center / contain no-repeat");

        $(".uploadImgArea").addClass('loaded');

    } else {
        popupData.word = null;
        popupData.img = null;
        $(".inputWordArea").val("");
        setTransform('uploadImgArea');
        document.getElementsByClassName('imgSizeBarWrapper')[0].scrollTop = 0;
    }

    $(".wordPopupWrapper").addClass('open');

    $(".wordPopupWrapper").show();

    $(".inputWordArea").focus();
}

function setFontPopup () {
    currentFontOptions = storageManager.getConfig('font', 'main');
    $(".fontPopupWrapper").fadeIn(500);
    $(".inputWordArea").focus();
}

function setFont () {
    try {
        $('body style').remove();
        var font = storageManager.getConfig('font', 'main');
        $('.fontBox .label').html(font.name);
        $('body').append(`
            <style>
                @font-face {
                    font-family: '${font.name}';
                    src: url('${font.path.replace(/\\/g, '/')}');
                }
                .main,
                .wordPopupWrapper,
                .soundPopupWrapper,
                .fontPopupWrapper,
                .uploadImgArea,
                .inputWordArea {
                    font-family: '${font.name}';
                }
            </style>
        `);
    } catch (e) {}
}

function setSoundPopup () {
    $(".soundPopupWrapper").fadeIn(500);
    $(".inputWordArea").focus();
}

function startEffect (type) {
    var options = storageManager.getConfig('audio', type);
    $(".main").addClass("main" + type.capitalizeFirstLetter() + "Input");

    player.play(options.path, options.duration, function () {
        stopEffect(type);
        if (type == 'win') {
            setNextWordImg();
        }
    });
}

function stopEffect (type) {
    $(".main").removeClass("main" + type.capitalizeFirstLetter() + "Input");
}

function stopEffects () {
    stopEffect('correct');
    stopEffect('wrong');
    stopEffect('win');
}

function onInput (type) {
    stopEffects();
    startEffect(type);
}

function initEventListeners () {
    var timer = setInterval(() => {
        if ($(".highlightedWord").html()) {
            var highlightedWord = $(".highlightedWord").html().toLowerCase(),
                potentialWord = $(".inputWord").val();
        }
    }, 50);

    $(document).keydown(function(event) {
        if ([39, 40].indexOf(event.keyCode) != -1) setNextWordImg(); // right down
        else if ([37, 38].indexOf(event.keyCode) != -1) setPreviousWordImg(); // left up
        else if ([46].indexOf(event.keyCode) != -1) $("#deleteBtn").click(); // delete
        else if ([13].indexOf(event.keyCode) != -1) { // enter
            event.stopPropagation();
            event.preventDefault();
            if ($(".soundPopupWrapper").css('display') != 'none') {
                $("#soundPopupSaveBtn").click();
            } else if ($(".wordPopupWrapper").css('display') != 'none') {
                $("#wordPopupSaveBtn").click();
            } else if ($(".fontPopupWrapper").css('display') != 'none') {
                $("#fontPopupSaveBtn").click();
            }
        } else if ([27].indexOf(event.keyCode) != -1) { // escape
            event.stopPropagation();
            event.preventDefault();
            if ($(".soundPopupWrapper").css('display') != 'none') {
                $("#soundPopupCloseBtn").click();
            } else if ($(".wordPopupWrapper").css('display') != 'none') {
                $("#wordPopupCloseBtn").click();
            } else if ($(".fontPopupWrapper").css('display') != 'none') {
                $("#fontPopupCloseBtn").click();
            }
        }
    });

    $(".inputWord").keypress(function (event) {
        if (! $(".highlightedWord").html()) {
            alert("Your word list is empty");
            event.preventDefault();
            event.stopPropagation();
        } else {

            var highlightedWord = $(".highlightedWord").html().toLowerCase(),
                potentialWord = ($(".inputWord").val() + String.fromCharCode(event.keyCode)).toString().toLowerCase();

            if (highlightedWord.indexOf(potentialWord) == 0) {
                if (highlightedWord == potentialWord) {
                    onInput('win');
                } else if (!$(".main").hasClass("mainCorrectInput")) {
                    onInput('correct');
                }
            } else {
                if (String.fromCharCode(event.keyCode).toString().match(/^[a-zA-Z]+$/) && !highlightedWord[0].match(/^[a-zA-Z]+$/)) {
                    alert("Maybe you should change language");
                }
                if (!$(".main").hasClass("mainWrongInput")) onInput('wrong');
                event.preventDefault();
            }
        }
    });

    $(".main, .wordPopupWrapper").on("drag drop dragstart dragend dragover dragenter dragleave", function (event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    });

    $(".word").click(function () {
        setWordImg($(this).html());
        $(".inputWord").focus();
    });

    $(".word").dblclick(function (event) {
        event.stopPropagation();
        event.preventDefault();
        setWordPopup($(this).html());
    });

    $('#listenBtn').click(() => {
        if (player.isPlaying()) {
            player.pause();
        } else if ($(".highlightedWord").html()) {
            var path = storageManager.getRecord($(".highlightedWord").html()).audio.path;
            if (path) {
                player.play(path);
            }
        }
    });

    $("#newBtn").click(function () {
        setWordPopup();
    });

    $("#editBtn").click(function () {
        setWordPopup($(".highlightedWord").text());
    });

    $("#deleteBtn").click(function () {
        storageManager.removeRecord($(".highlightedWord").html());
        $('.imgArea').css('background', 'none');
        $('.completeWord').html('');
        player.reset();
        $(".inputWord").attr('placeholder', '');
        initWordList();
        $(".inputWord").focus();
    });

    $("#soundBtn").click(function () {
        setSoundPopup();
        $(".inputWord").focus();
    });

    $("#fontBtn").click(function () {
        setFontPopup();
        $(".inputWord").focus();
    });
}

function initApp () {
    initWordList();
    initEventListeners();
    setFont();

    // $(".uploadImgArea").mCustomScrollbar({
    //     theme: 'dark',
    //     axis: 'y',
    //     scrollbarPosition: 'inside',
    //     alwaysShowScrollbar: 2,
    //     snapAmount: 10,
    //     snapOffset: 5,
    //     mouseWheel: {
    //         enable: true
    //     },
    //     advanced: {
    //         updateOnContentResize: true
    //     }
    // });

    $(".inputWord").focus();
}
