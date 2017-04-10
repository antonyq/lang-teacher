var imgRotation = 0;
var imgPath = {blob: null, real: null};
var popupData = {word: null, img: null};

$(document).ready(function () {

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
            var file = event.originalEvent.dataTransfer.files[0];

            if (file.name.match(/jpg|gif|png/i)) {
                $(".uploadImgArea").removeClass('rotated90 rotated180 rotated270');
                $(".uploadImgArea").addClass('changed');

                var URL = window.URL || window.webkitURL;
                imgPath.blob = URL.createObjectURL(file);
                imgPath.real = event.originalEvent.dataTransfer.files[0].path;

                $(".uploadImgArea").css({
                    "background": "url(" + imgPath.blob + ") center center no-repeat",
                    "background-size": "contain"
                });

                $(".uploadImgArea").addClass('loaded');
            } else alert("Поддерживаются только JPG, PNG или GIF");
        } catch(e) {
            alert('Произошла ошибка ' + e + '. Перезапустите программу.');
        }
    });

    $("#wordPopupSaveBtn").click(function (event) {
        if ($(".inputWordArea").val() != "") {
            if ($(".inputWordArea").val() != popupData.word) {
                imgPath.real = imgPath.real || storageManager.getRecord(popupData.word).imgPath;
                storageManager.removeRecord(popupData.word);
            }

            var result = storageManager.setRecord($(".inputWordArea").val(), imgPath.real || popupData.img, imgRotation);
            if (result == undefined) {
                initWordList();
                onCloseWordPopup();
            } else alert("Введите слово");
        } else alert("Введите слово");
        event.stopPropagation();
        event.preventDefault();
    });

    $('#wordPopupRotateImgBtn').click(function () {
        if ($('.uploadImgArea').hasClass('loaded')) {
            $(".uploadImgArea").addClass('changed');

            var matchCollection = $('.uploadImgArea').attr('class').match(/rotated([0-9]+)/);
            imgRotation = matchCollection ? matchCollection[1] : 0;
            $('.uploadImgArea').removeClass('rotated90 rotated180 rotated270');
            if (imgRotation != 270) {
                imgRotation = parseInt(imgRotation) + 90;
                $('.uploadImgArea').addClass('rotated' + imgRotation);
            } else {
                imgRotation = 0;
            }
        }
    });

    $('#wordPopupRemoveImgBtn').click(function () {
        if ($('.uploadImgArea').hasClass('loaded')) {
            $('.uploadImgArea').addClass('changed');

            imgPath = {blob: null, real: null};
            popupData.img = null;

            $(".uploadImgArea").removeAttr('style');
            $(".uploadImgArea").removeClass('loaded rotated90 rotated180 rotated270');
        }
    });

    $("#wordPopupCloseBtn, #wordPopupCancelBtn").click(function () {
        if (
            ($('.uploadImgArea').hasClass('changed') || $(".inputWordArea").hasClass('changed')) &&
            confirm('Сохранить изменения ?')
        ) $("#wordPopupSaveBtn").click();
        else onCloseWordPopup();
    });

    function onCloseWordPopup() {
        $(".wordPopupWrapper").animate({
            top: '-630px',
            opacity: 0
        }, 500 , function () {
            imgPath.blob = null;
            imgPath.real = null;
            imgRotation = 0;
            $(".wordPopupWrapper").hide();
            $(".uploadImgArea").removeClass('loaded changed rotated90 rotated180 rotated270');
            $(".inputWordArea").removeClass('changed');
            $(".inputWord").focus();
        });
    };

});
