function onSoundPopupFileChaged () {
    $('.soundPopup .playBtn').removeClass('playing');
}

$(document).ready(function () {
    $('.soundPopup .playBtn').click(function () {
        if ($(this).hasClass('playing')) {
            player.pause();
            $(this).removeClass('playing');
        } else {
            let type = $(this).attr('id').match(/(?:correct|wrong|win)/i)[0].toLowerCase();
                if (document.getElementById(type + "SoundPath").files[0]  && document.getElementById(`${type}SoundDuration`).value) {
                    let path = document.getElementById(type + "SoundPath").files[0].path,
                        duration = document.getElementById(`${type}SoundDuration`).value;
                    player.play(path, duration, function () {
                        $('.soundPopup .playBtn').removeClass('playing');
                    });
                    $('.soundPopup .playBtn').removeClass('playing');
                    $(this).addClass('playing');
                }
        }
    });

    $("#soundPopupSaveBtn").click(function (event) {
        $('.soundPopup input[type="file"]').each((index, fileInput) => {
            let id = $(fileInput).attr('id'),
                type = id.match(/(?:correct|wrong|win)/i)[0].toLowerCase();

            storageManager.setConfig('audio', type, {
                path: document.getElementById(id).files[0] ? document.getElementById(id).files[0].path : storageManager.getConfig('audio', type).path,
                duration: document.getElementById(`${type}SoundDuration`).value ? parseInt(document.getElementById(`${type}SoundDuration`).value) : storageManager.getConfig('audio', type).duration
            });
        });

        onCloseSoundPopup();
        event.stopPropagation();
        event.preventDefault();
    });

    $("#soundPopupResetBtn").click(function (event) {
        if (confirm('Вы точно хотите сбросить все звуковые настройки ?')) {
            $('.current').html('');
            $('.soundPopup input[type="file"]').val('');
            $('.soundPopup input[type="number"]').val('1');
            storageManager.resetConfigItem('audio');
            onCloseSoundPopup();
        }
    });

    $("#soundPopupCloseBtn, #soundPopupCancelBtn").click(function () {
        if (
            (
                $('#winSoundPath').hasClass('changed') ||
                $('#winSoundDuration').hasClass('changed') ||
                $('#correctSoundPath').hasClass('changed') ||
                $('#correctSoundDuration').hasClass('changed') ||
                $('#wrongSoundPath').hasClass('changed') ||
                $('#wrongSoundDuration').hasClass('changed')
            ) && confirm('Сохранить изменения ?')
        ) $("#soundPopupSaveBtn").click();
        onCloseSoundPopup();
    });

    function onCloseSoundPopup() {
        player.pause();

        $(".soundPopupWrapper").fadeOut(500, function () {
            $(this).removeClass('open');
            $('.soundPopup .playBtn').removeClass('playing');
            $('#winSoundPath, #winSoundDuration, #correctSoundPath, #correctSoundDuration, #wrongSoundPath, #wrongSoundDuration').removeClass('changed');
            $('.soundPopup input[type="number"]').val('1');
            $('.soundPopup input[type="file"]').val('');

            $(".inputWord").focus();
        });
    };

});
