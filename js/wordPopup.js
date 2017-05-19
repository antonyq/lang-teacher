var imgPath = {blob: null, real: null};
var popupData = {word: null, img: null};

function onWordSoundChange () {
    $('.wordPopup .playBtn').removeClass('playing');
    if (document.getElementById('wordSoundPath').files[0]) {
        let name = document.getElementById('wordSoundPath').files[0].name;
        $('.wordPopup .label').html(name);
    } else {
        player.reset();
        $('.wordPopup .label').html('Проигрывающийся звук');
    }
}

function updateScrollScale (scale) {
    console.log(scale);
    $('.sizeBarDescription span').remove();
    $('.sizeBarDescription').html(scale ? 'Видимый размер изображения: ' : 'Невидимо');
    if (scale) {
        $('.sizeBarDescription').append(`<span>${parseInt(scale * 100) +'%'}</span>`);
    }
}

$(document).ready(function () {
    $('.wordPopup .label').after('<input type="file" accept="audio/mp3, audio/mp4, audio/wav, audio/ogg" class="soundPath" id="wordSoundPath" onchange="onWordSoundChange()">');

    $('.imgSizeBarWrapper').scroll(function () {
        if ($('.uploadImgArea').hasClass('loaded')) {
            let scale = getScrollScale($('.imgSizeBarWrapper'), $('.imgSizeBar'));
            let rotation = getTransform('uploadImgArea').rotation;
            setTransform('uploadImgArea', {rotation: rotation, scale: scale});
            updateScrollScale(scale);
        }
    });


    $(".inputWordArea").on('input', function () {
        $(".inputWordArea").addClass('changed');
    });

    $(".uploadImgArea").on("drag dragstart dragend dragover dragenter dragleave", function(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    });

    $(".uploadImgArea").on("drop", function (event) {
        event.preventDefault();
        event.stopPropagation();

        try {
            let file = event.originalEvent.dataTransfer.files[0];
            onFileChanged(file);
        } catch(e) {
            alert('Произошла ошибка ' + e + '. Перезапустите программу.');
        }
    });

    $("#wordPopupSaveBtn").click(function (event) {
        if ($(".inputWordArea").val() != "") {
            if ($(".inputWordArea").val() != popupData.word) {
                imgPath.real = imgPath.real || storageManager.getRecord(popupData.word).path;
                storageManager.removeRecord(popupData.word);
            }

            let result = storageManager.setRecord($(".inputWordArea").val(), {
                student: $('.studentsList option:checked').val(),
                path: imgPath.real || popupData.img,
                rotation: getTransform('uploadImgArea').rotation,
                scale: getTransform('uploadImgArea').scale,
                audio: {
                    path: document.getElementById('wordSoundPath').files[0] ? document.getElementById('wordSoundPath').files[0].path : ''
                }
            });
            if (result == undefined) {
                setWordList($(".inputWordArea").val());
                onCloseWordPopup();
            } else alert("Введите слово");
        } else alert("Введите слово");
        event.stopPropagation();
        event.preventDefault();
    });

    $('#wordPopupRotateImgBtn').click(function () {
        if ($('.uploadImgArea').hasClass('loaded')) {
            $(".uploadImgArea").addClass('changed');

            let transform = getTransform('uploadImgArea');
            setTransform('uploadImgArea', {rotation: transform.rotation + 90, scale: transform.scale});
        }
    });

    $('#wordPopupDownloadImgBtn').click(function () {
        if ($('.uploadImgArea').hasClass('loaded')) {
            $(".uploadImgArea").addClass('changed');
        }

        $('.wordPopupImgInput').val('');

        $('.wordPopupImgInput').click();



        $('.wordPopupImgInput').change(function (event) {
            let file = document.getElementsByClassName('wordPopupImgInput')[0].files[0];
            onFileChanged(file);
        });
    });

    $('#wordPopupRemoveImgBtn').click(function () {
        if ($('.uploadImgArea').hasClass('loaded')) {
            $('.uploadImgArea').addClass('changed');

            imgPath = {blob: null, real: null};
            popupData.img = null;

            $(".uploadImgArea").removeAttr('style');
            setTransform('uploadImgArea');
            document.getElementsByClassName('imgSizeBarWrapper')[0].scrollLeft = 0;
            $(".uploadImgArea").removeClass('loaded');
        }
    });

    $('#removeWordSignalBtn').click(function () {
        $('.wordPopup .playBtn').removeClass('playing');
        $('.wordPopup .label').html('Проигрывающийся звук');
        $('#wordSoundPath').remove();
        $('.wordPopup .label').after('<input type="file" accept="audio/mp3, audio/mp4, audio/wav, audio/ogg" class="soundPath" id="wordSoundPath" onchange="onWordSoundChange()">');
        player.reset();
    });

    $("#wordPopupCloseBtn, #wordPopupCancelBtn").click(function () {
        if (
            ($('.uploadImgArea').hasClass('changed') || $(".inputWordArea").hasClass('changed')) &&
            confirm('Сохранить изменения ?')
        ) $("#wordPopupSaveBtn").click();
        else onCloseWordPopup();
    });

    $('.wordPopup .playBtn').click(function () {
        if ($('.playBtn').hasClass('playing')) {
            player.pause();
            $('.playBtn').removeClass('playing');
        } else if (document.getElementById('wordSoundPath').files[0]) {
            player.play(document.getElementById('wordSoundPath').files[0].path);
            $('.playBtn').addClass('playing');
        } else if ($('.wordPopup .label').html() != 'Проигрывающийся звук' && storageManager.hasRecord(popupData.word)) {
            player.play(storageManager.getRecord(popupData.word).audio.path);
            $('.playBtn').addClass('playing');
        }
    });

    function onFileChanged (file) {
        if (file.name.match(/jpg|gif|png/i)) {
            $(".uploadImgArea").css('transform', 'none');
            $(".uploadImgArea").addClass('changed');

            let URL = window.URL || window.webkitURL;
            imgPath.blob = URL.createObjectURL(file);
            imgPath.real = file.path;

            $(".uploadImgArea").css({
                "background": "url(" + imgPath.blob + ") center center no-repeat",
                "background-size": "contain"
            });

            setTransform('uploadImgArea');
            document.getElementsByClassName('imgSizeBarWrapper')[0].scrollLeft = 0;

            $(".uploadImgArea").addClass('loaded');
        } else alert("Поддерживаются только JPG, PNG или GIF");
    }

    function onCloseWordPopup() {
        $('.wordPopup .label').html('');
        $('#wordSoundPath').remove();
        $('.wordPopup .label').after('<input type="file" accept="audio/mp3, audio/mp4, audio/wav, audio/ogg" class="soundPath" id="wordSoundPath" onchange="onWordSoundChange()">');
        $(".wordPopupWrapper").removeClass('open');
        imgPath.blob = null;
        imgPath.real = null;
        imgRotation = 0;
        $(".wordPopupWrapper").hide();
        $(".uploadImgArea").removeAttr('style');
        document.getElementsByClassName('imgSizeBarWrapper')[0].scrollTop = 0;
        $(".uploadImgArea").removeClass('loaded changed');
        $(".inputWordArea").removeClass('changed');
        $(".inputWord").focus();
        player.pause();
        $('.wordPopup .playBtn').removeClass('playing');
    };

});
