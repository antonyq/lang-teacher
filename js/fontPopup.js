$(document).ready(function () {
    $("#fontPopupSaveBtn").click(function (event) {
        storageManager.setConfig('font', 'main', {
            name: $('.fontName option:checked').val(),
            style: $('.fontStyle option:checked').val(),
            size: $('.fontSize option:checked').val() + 'px'
        });
        onCloseFontPopup();
        event.stopPropagation();
        event.preventDefault();
    });

    $("#fontPopupResetBtn").click(function (event) {
        if (confirm('Вы точно хотите сбросить настройки шрифта ?')) {
            storageManager.resetConfigItem('font');
            onCloseFontPopup();
        }
    });

    $("#fontPopupCloseBtn, #fontPopupCancelBtn").click(function () {
        if ($('.fontPath').hasClass('changed') && confirm('Сохранить изменения ?')) {
            $("#fontPopupSaveBtn").click();
        } else {
            storageManager.setConfig('font', 'main', currentFont);
        }
        onCloseFontPopup();
    });

    function onCloseFontPopup() {
        setFont();
        $('.fontPath').removeClass('changed');

        $(".fontPopupWrapper").fadeOut(500, function () {
            $(this).removeClass('open');
            $(".inputWord").focus();
        });
    };

});
