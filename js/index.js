var fs = require('fs');

window.onload = function () {
    const {remote} = require('electron');
    const {BrowserWindow} = remote;
    const win = BrowserWindow.getFocusedWindow();

    // remote.getCurrentWindow().toggleDevTools();

    window.storageManager = new StorageManager();

    initWordList();
    initEventListeners();
    setAudio();

    $(".inputWord").focus();
};

function setWordImg (word) {
    word = word || storageManager.getRandomRecord();

    var imgPath = (storageManager.getRecord(word).imgPath || "").replace(/\\/g, "/");
    var imgRotation = storageManager.getRecord(word).imgRotation || null;

    $(".imgArea").css({
        "background": "url('" + imgPath + "') center center no-repeat",
        "background-size": "contain"
    });

    $('.imgArea').removeClass('rotated90 rotated180 rotated270');
    if (imgRotation) {
        $('.imgArea').addClass('rotated' + imgRotation);
    }


    $(".completeWord").html(word);
    $(".inputWord").val("");
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
    for (var word in storageManager.wordImgPairs) {
        $wordList.append("<li class='word' id='word" + (i++) + "' onclick='setWordImg($(this).html())'>" + word.toString() + "</li>");
    }
    setWordImg(storageManager.getRandomRecord().word);
}

function setWordPopup (word) {
    $(".uploadImgArea").css("background", "rgba(200, 200, 200, 0.8)");
    $(".uploadImgArea > span").show();

    if (word) {
        popupData.word = word;
        popupData.img = storageManager.getRecord(word).imgPath;
        $(".inputWordArea").val(word);
        var imgPath = (storageManager.getRecord(word).imgPath || "").replace(/\\/g, "/");
        var imgRotation = storageManager.getRecord(word).imgRotation || null;
        if (imgPath) {
            $(".uploadImgArea").css("background", "url('" + imgPath + "') center center / contain no-repeat");
            $(".uploadImgArea").addClass('loaded');
        }
        if (imgRotation) {
            $(".uploadImgArea").addClass('rotated' + imgRotation);
        }
    } else {
        popupData.word = null;
        popupData.img = null;
        $(".inputWordArea").val("");
    }

    $(".wordPopupWrapper").animate({
        top: 0,
        opacity: 1,
        display: 'block'
    }, 500);
    $(".wordPopupWrapper").show();

    $(".inputWordArea").focus();
}

function setSoundPopup () {
    $(".soundPopupWrapper").fadeIn(500);
    $(".inputWordArea").focus();
}

function setAudio () {
    ['win', 'correct', 'wrong'].forEach(function (type) {
        document.getElementsByClassName(type + 'Signal')[0].src = storageManager.getAudio(type).path;
    });
}

function stopAudio ($audioJQUERYObj) {
    $audioJQUERYObj[0].pause();
    $audioJQUERYObj[0].currentTime = 0;
}

function startEffect (type) {
    var duration = storageManager.getAudio(type).duration;
    $(".main").addClass("main" + type.capitalizeFirstLetter() + "Input");

    var $audio = $('.' + type + 'Signal'),
        audio = document.getElementsByClassName(type + 'Signal')[0];
    $audio[0].play();

    setTimeout(function () {
        stopEffect(type);
    }, duration * 1000);
}

function stopEffect (type) {
    $(".main").removeClass("main" + type.capitalizeFirstLetter() + "Input");
    stopAudio($("." + type + "Signal"));
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
            }
        } else if ([27].indexOf(event.keyCode) != -1) { // escape
            event.stopPropagation();
            event.preventDefault();
            if ($(".soundPopupWrapper").css('display') != 'none') {
                $("#soundPopupCloseBtn").click();
            } else if ($(".wordPopupWrapper").css('display') != 'none') {
                $("#wordPopupCloseBtn").click();
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
                if (!$(".main").hasClass("mainCorrectInput")) onInput('correct');
                if (highlightedWord == potentialWord) {
                    onInput('win');
                    setTimeout(function () {
                        setNextWordImg();
                    }, storageManager.getAudio('win').duration * 1000);
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

    $("#newBtn").click(function () {
        setWordPopup();
    });

    $("#editBtn").click(function () {
        setWordPopup($(".highlightedWord").text());
    });

    $("#deleteBtn").click(function () {
        storageManager.removeRecord($(".highlightedWord").html());
        initWordList();
        $(".inputWord").focus();
    });

    $("#soundBtn").click(function () {
        setSoundPopup();
        $(".inputWord").focus();
    });
}
