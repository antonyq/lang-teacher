let fs = require('fs');

window.onload = function () {
    const {remote} = require('electron');
    const {BrowserWindow} = remote;
    const win = BrowserWindow.getFocusedWindow();

    // remote.getCurrentWindow().toggleDevTools();

    window.storageManager = new StorageManager();
    window.player = new Player('player');

    initApp();
};

function initApp () {
    setStudentsList();
    initEventListeners();
    setFont();

    if (storageManager.studentsList.length == 0) {
        alert('Создайте ученика');
        $('#addStudentBtn').addClass('blink');
        setTimeout(() => {
            $('#addStudentBtn').removeClass('blink');
        }, 500);
    }

    $(".inputWord").focus();
}

function setStudentsList (name) {
    let $studentsList = $('.studentsList'),
        currentStudent = name || $('.studentsList option:checked').val(),
        currentWord = $('.highlightedWord').html();

    $studentsList.html('');
    storageManager.studentsList.forEach((student) => {
        $studentsList.append(`<option ${(currentStudent == student) ? 'selected' : '' } data-student='${student}'>${student}</option>`);
    });

    setWordList(currentWord);
}

function setWordList (word) {
    let $wordList = $('.wordList'),
        currentStudent = $(".studentsList option:checked").val();

    if (currentStudent) {
        $wordList.show();
        $wordList.html('');
        let words = storageManager.getWords(currentStudent);
        words.forEach((word, index) => {
            $wordList.append(`<li class='word' id='word${index}' onclick='setWordImg($(this).html())'>${word}</li>`);
        });

        setWordImg((words.indexOf(word) != -1) ? word : $('.wordList li#word0').html());
    } else {
        $wordList.hide();
    }
}

function setWordImg (word) {
    stopWordSound();
    stopEffects();
    word = word || storageManager.getRandomWord($('.studentsList option:checked').val());

    let imgPath = (storageManager.getRecord(word).path || "").replace(/\\/g, "/");
    let imgScale = storageManager.getRecord(word).scale;
    imgScale = (imgScale == undefined || imgScale == null) ? 1 : imgScale;
    let imgRotation = storageManager.getRecord(word).rotation || 0;

    $(".imgArea").css({
        "background": "url('" + imgPath + "') center center no-repeat",
        "background-size": "contain"
    });

    setTransform('imgArea', {rotation: imgRotation, scale: imgScale});

    let scrollElem = document.getElementsByClassName('wordImgSizeBarWrapper')[0];
    scrollElem.scrollLeft = (imgPath != '') ? $('.wordImgSizeBar').width() * imgScale : 0;


    $(".completeWord").html(word);
    $(".inputWord").val('');
    if (! $('#placeholderBtn').hasClass('disabled')) {
        $(".inputWord").attr('placeholder', word);
    }
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
    let $nextWord = $(".highlightedWord").next();
    $(".word").removeClass("highlightedWord");
    setWordImg( (! $nextWord.length) ? $($(".word")[0]).html() : $nextWord.html() );
}

function setPreviousWordImg () {
    let $prevWord = $(".highlightedWord").prev();
    $(".word").removeClass("highlightedWord");
    setWordImg( (! $prevWord.length) ? $($(".word").last()).html() : $prevWord.html() );
}


function setWordPopup (word) {
    stopWordSound();

    $(".uploadImgArea").css("background", "rgba(200, 200, 200, 0.8)");
    $(".uploadImgArea > span").show();

    if (word) {
        popupData.word = word;
        popupData.img = storageManager.getRecord(word).path;
        $(".inputWordArea").val(word);
        $('.soundBlock .label').html(storageManager.getRecord(word).audio.path.split('\\')[storageManager.getRecord(word).audio.path.split('\\').length - 1] || 'Звук не выбран');

        let path = (storageManager.getRecord(word).path || '').replace(/\\/g, '/');

        let options = {
            path: path,
            rotation: path ? (storageManager.getRecord(word).rotation || 0) : 0,
            scale: path ? (storageManager.getRecord(word).scale || 1) : 1
        };


        if (options.path) {
            $(".uploadImgArea").css("background",  "url('" + options.path + "') center center / contain no-repeat");

            setTransform('uploadImgArea', options);

            let scale = storageManager.getRecord(word).scale;
            let scrollElem = document.getElementsByClassName('imgSizeBarWrapper')[0];
            scrollElem.scrollLeft = scale * ($('.imgSizeBar').width() - $('.imgSizeBarWrapper').width());
            $('.sizeBarDescription span').html((scale) ? storageManager.getRecord(word).scale + '%' : 'невидимо');
            $(".uploadImgArea").addClass('loaded');
        } else {
            $('.sizeBarDescription span').html('не загружено');
        }

    } else {
        popupData.word = null;
        popupData.img = null;
        $(".inputWordArea").val("");
        setTransform('uploadImgArea');
        document.getElementsByClassName('imgSizeBarWrapper')[0].scrollLeft = 0;
        $('.sizeBarDescription span').html('не загружено');
        $('.soundBlock .label').html('Звук не выбран');
    }

    $(".wordPopupWrapper").addClass('open');

    $(".wordPopupWrapper").show();

    $(".inputWordArea").focus();
}

function setSoundPopup () {
    stopWordSound();
    $(".soundPopupWrapper").fadeIn(500);
    $(".inputWordArea").focus();
    $(".soundPopupWrapper").addClass('open');
}

function setFontPopup () {
    stopWordSound();
    $('.fontName, .fontSize, .fontStyle').html('');
    window.currentFont = storageManager.getConfig('font', 'main');

    let detector = new Detector();
    storageManager.data.fonts.names.forEach((font) => {
        if (detector.detect(font)) {
            $('.fontName').append(`<option ${currentFont.name == font ? 'selected' : ''} style='font-family:${font}'>${font}</option>`);
        }
    });

    storageManager.data.fonts.styles.forEach((style) => {
        $('.fontStyle').append(`<option ${currentFont.style == style ? 'selected' : ''} style='font-style:${style}'>${style}</option>`);
    });

    storageManager.data.fonts.sizes.forEach((size) => {
        $('.fontSize').append(`<option ${currentFont.size == size + 'px' ? 'selected' : ''} style='font-size:${size}px'>${size}</option>`);
    });

    $(".fontPopupWrapper").fadeIn(500);
    $(".fontPopupWrapper").addClass('open');
    $(".inputWordArea").focus();
}

function setFont () {
    try {
        $('body style').remove();
        let font = storageManager.getConfig('font', 'main');
        $('body').append(`
            <style>
                .main,
                .wordPopupWrapper,
                .soundPopupWrapper,
                .fontPopupWrapper,
                .uploadImgArea,
                .inputWordArea {
                    font-family: ${font.name};
                    font-style: ${font.style};
                    font-size: ${font.size}
                }
            </style>
        `);
    } catch (e) {}
}

function startEffect (type) {
    stopWordSound();
    let options = storageManager.getConfig('audio', type);
    $(".main").addClass("main" + type.capitalizeFirstLetter() + "Input");

    player.play({path: options.path, duration: options.duration}, function () {
        if (type == 'win' && $('.main').hasClass("main" + type.capitalizeFirstLetter() + "Input")) {
            setNextWordImg();
        }
        stopEffect(type);
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

function stopWordSound () {
    $('#listenBtn').removeClass('playing');
    player.reset();
}

function onInput (type) {
    stopWordSound();
    stopEffects();
    startEffect(type);
}

function initEventListeners () {
    let timer = setInterval(() => {
        if ($(".highlightedWord").html()) {
            let highlightedWord = $(".highlightedWord").html().toLowerCase(),
                potentialWord = $(".inputWord").val();
        }
    }, 50);

    $(document).keydown(function(event) {
        if ([46].indexOf(event.keyCode) != -1) $("#deleteBtn").click(); // delete
        else if ([13].indexOf(event.keyCode) != -1) { // enter
            event.stopPropagation();
            event.preventDefault();
            if ($(".soundPopupWrapper").hasClass('open')) {
                $("#soundPopupSaveBtn").click();
            } else if ($(".wordPopupWrapper").hasClass('open')) {
                $("#wordPopupSaveBtn").click();
            } else if ($(".fontPopupWrapper").hasClass('open')) {
                $("#fontPopupSaveBtn").click();
            }
        } else if ([27].indexOf(event.keyCode) != -1) { // escape
            event.stopPropagation();
            event.preventDefault();
            if ($(".soundPopupWrapper").hasClass('open')) {
                $("#soundPopupCloseBtn").click();
            } else if ($(".wordPopupWrapper").hasClass('open')) {
                $("#wordPopupCloseBtn").click();
            } else if ($(".fontPopupWrapper").hasClass('open')) {
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

            let highlightedWord = $(".highlightedWord").html().toLowerCase(),
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

    $('#addStudentBtn').click(() => {
        vex.dialog.open({
            message: 'Имя нового ученика:',
            input: [
                '<input name="studentName" type="text" placeholder="Имя" required />'
            ].join(''),
            buttons: [
                $.extend({}, vex.dialog.buttons.YES, { text: 'Сохранить' }),
                $.extend({}, vex.dialog.buttons.NO, { text: 'Отмена' })
            ],
            callback: function (data) {
                if (data) {
                    storageManager.addStudent(data.studentName);
                    setStudentsList();
                    $(`.studentsList option[data-student='${data.studentName}']`).prop('selected', true);
                    setStudentsList();
                }
            }
        });
    });
    $('#editStudentBtn').click(() => {
        let currentName = $('.studentsList option:checked').val();
        if (currentName) {
            vex.dialog.open({
                message: `Новое имя ученика ${currentName}:`,
                input: [
                    '<input name="studentName" type="text" placeholder="Имя" required />'
                ].join(''),
                buttons: [
                    $.extend({}, vex.dialog.buttons.YES, { text: 'Сохранить' }),
                    $.extend({}, vex.dialog.buttons.NO, { text: 'Отмена' })
                ],
                callback: function (data) {
                    if (data) {
                        storageManager.editStudent(currentName, data.studentName);
                        setStudentsList(data.studentName);
                    }
                }
            });
        }

    });
    $('#removeStudentBtn').click(() => {
        let currentName = $('.studentsList option:checked').val();
        if (currentName) {
            vex.dialog.open({
                message: `Вы уверены что хотите удалить ученика '${currentName}' ? (Будут стерты также все его слова)`,
                buttons: [
                    $.extend({}, vex.dialog.buttons.YES, { text: 'Удалить' }),
                    $.extend({}, vex.dialog.buttons.NO, { text: 'Отмена' })
                ],
                callback: function (data) {
                    if (data) {
                        storageManager.removeStudent(currentName);
                        setStudentsList();
                        setWordList();
                    } else {

                    }
                }
            });
        }

        storageManager.removeStudent($('.studentsList option:checked'));
        setStudentsList();
    });

    $('.studentsList').change(() => {
        stopEffects();
        $('.completeWord').html('');
        $('.inputWord').attr('placeholder', '');
        setWordList();
    });

    $(".word").click(function () {
        setWordImg($(this).html());
        $(".inputWord").focus();
    });

    $(".word").dblclick(function (event) {
        if ($('.studentsList option:checked').val()) {
            event.stopPropagation();
            event.preventDefault();
            setWordPopup($(this).html());
        }
    });

    $('.wordImgSizeBarWrapper').scroll(function () {
        let scale = getScrollScale($('.wordImgSizeBarWrapper'), $('.wordImgSizeBar'));
        let rotation = getTransform('imgArea').rotation;
        setTransform('imgArea', {rotation: rotation, scale: scale});
        let fontSize = Math.max(Math.max(parseFloat($('.completeWord').css('font-size')), 100) * (1 - scale), 30);
        $('.completeWord').css('font-size', fontSize + 'px');
        $('.imgAreaWrapper').css('height', `calc(70% - ${(fontSize - 30)*3}px)`);
    });


    $('#listenBtn').click(function () {
        if ($(this).hasClass('playing')) {
            player.pause();
            $(this).removeClass('playing');
        } else if ($(".highlightedWord").html()) {
            let path = storageManager.getRecord($(".highlightedWord").html()).audio.path;
            if (path) {
                player.play({path: path, element: '#listenBtn'});
                $(this).addClass('playing');
            }
        }
    });

    $('#placeholderBtn').click(function () {
        if ($(this).hasClass('disabled')) {
            $('.inputWord').attr('placeholder', $('.highlightedWord').html());
            $('#placeholderBtn').removeClass('disabled');
        } else {
            $('.inputWord').removeAttr('placeholder');
            $('#placeholderBtn').addClass('disabled');
        }
    });

    $("#newBtn").click(function () {
        if ($('.studentsList option:checked').val()) {
            setWordPopup();
        }
    });

    $("#editBtn").click(function () {
        if ($('.studentsList option:checked').val()) {
            setWordPopup($(".highlightedWord").text());
        }
    });

    $("#deleteBtn").click(function () {
        if ($('.studentsList option:checked').val()) {
            stopWordSound();
            storageManager.removeRecord($(".highlightedWord").html());
            $('.imgArea').css('background', 'none');
            $('.completeWord').html('');
            player.reset();
            $(".inputWord").attr('placeholder', '');
            setWordList();
            $(".inputWord").focus();
        }
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
