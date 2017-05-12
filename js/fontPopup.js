var currentFontOptions,
    currentSoundPath;

$(document).ready(function () {
    $('.fontPath').change(function (event) {
        var file = document.getElementsByClassName('fontPath')[0].files[0];
        onFileChanged(file);
    });

    $("#fontPopupSaveBtn").click(function (event) {
        onCloseFontPopup();
        event.stopPropagation();
        event.preventDefault();
    });

    $("#fontPopupResetBtn").click(function (event) {
        if (confirm('Вы точно хотите сбросить настройки шрифта ?')) {
            storageManager.resetConfigItem('font');
            $('.fontBox .label').html(storageManager.getConfig('font', 'main').name);
            setFont();
            onCloseFontPopup();
        }
    });

    $("#fontPopupCloseBtn, #fontPopupCancelBtn").click(function () {
        if ($('.fontPath').hasClass('changed') && confirm('Сохранить изменения ?')) {
            $("#fontPopupSaveBtn").click();
        } else {
            storageManager.setConfig('font', 'main', currentFontOptions);
        }
        onCloseFontPopup();
    });

    function onFileChanged (file) {
        storageManager.setConfig('font', 'main', {
            name: file.name,
            path: file.path
        });
        setFont();
        $('.fontPath').addClass('changed');
    }

    function onCloseFontPopup() {
        setFont();
        $('.fontPath').removeClass('changed');

        $(".fontPopupWrapper").fadeOut(500, function () {
            $(".inputWord").focus();
        });
    };

});
