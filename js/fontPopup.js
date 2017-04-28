var winPath = null,
    wrongPath = null,
    correctPath = null;

$(document).ready(function () {
    $('.playBtn').click(function () {
        if ($(this).hasClass('playing')) {
            pauseSound();
            $('.playBtn').removeClass('playing');
        } else {
            $('.playBtn').removeClass('playing');
            $(this).addClass('playing');
            playSound($(this).attr('id').match(/(?:correct|wrong|win)/i)[0]);
        }
    });

    $('.fontPopup input[type="file"]').on('change', function () {
        var type = $(this).attr('id').match(/(?:correct|wrong|win)/i)[0];

        $('#' + type + 'SoundPath').addClass('changed');

        if (document.getElementById(type + 'SoundPath').files[0]) {
            eval(type + 'Path = document.getElementById("' + type + 'SoundPath").files[0].path');
        } else {
            eval(type + 'Path = null');
        }
    });

    $('.fontPopup input[type="number"]').on('change', function () {
        var type = $(this).attr('id').match(/(?:correct|wrong|win)/i)[0];

        $('#' + type + 'SoundDuration').addClass('changed');
    });

    $("#fontPopupSaveBtn").click(function (event) {
        ['win', 'correct', 'wrong'].forEach(function (type) {
            if (document.getElementById(type + 'SoundPath').files[0]) {
                eval(type + ' = document.getElementById("' + type + '" + "SoundPath").files[0].path');
                if (eval(type + 'Path')) storageManager.setAudio(type, eval(type + 'Path'), parseInt($('#' + type +'SoundDuration').val()) || 1);
            }
        });
        onCloseSoundPopup();
        event.stopPropagation();
        event.preventDefault();
    });

    $("#fontPopupResetBtn").click(function (event) {
        if (confirm('Вы точно хотите сбросить все звуковые настройки ?')) {
            correctPath = null;
            wrongPath = null;
            $('.current').html('');
            $('.soundPopup input[type="file"]').val('');
            $('.soundPopup input[type="number"]').val('1');
            storageManager.resetAudio();
            onCloseSoundPopup();
        }
    });

    $("#fontPopupCloseBtn, #fontPopupCancelBtn").click(function () {
        if (
            (
                $('#winSoundPath').hasClass('changed') ||
                $('#winSoundDuration').hasClass('changed') ||
                $('#correctSoundPath').hasClass('changed') ||
                $('#correctSoundDuration').hasClass('changed') ||
                $('#wrongSoundPath').hasClass('changed') ||
                $('#wrongSoundDuration').hasClass('changed')
            ) && confirm('Сохранить изменения ?')
        ) $("#fontPopupSaveBtn").click();
        onCloseSoundPopup();
    });

    function onCloseFontPopup() {
        stopSound();
        setAudio();

        $('.testSignal').removeAttr('src');
        $('.playing').removeClass('playing');

        $('#winSoundPath, #winSoundDuration, #correctSoundPath, #correctSoundDuration, #wrongSoundPath, #wrongSoundDuration').removeClass('changed');
        $('.soundPopup input[type="number"]').val('1');
        $('.soundPopup input[type="file"]').val('');

        $(".soundPopupWrapper").fadeOut(500, function () {
            $(".inputWord").focus();
        });
    };

});
