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

    $('.soundPopup input[type="file"]').on('change', function () {
        var type = $(this).attr('id').match(/(?:correct|wrong|win)/i)[0];

        $('#' + type + 'SoundPath').addClass('changed');

        if (document.getElementById(type + 'SoundPath').files[0]) {
            eval(type + 'Path = document.getElementById("' + type + 'SoundPath").files[0].path');
        } else {
            eval(type + 'Path = null');
        }
    });

    $('.soundPopup input[type="number"]').on('change', function () {
        var type = $(this).attr('id').match(/(?:correct|wrong|win)/i)[0];

        $('#' + type + 'SoundDuration').addClass('changed');
    });

    $("#soundPopupSaveBtn").click(function (event) {
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

    $("#soundPopupResetBtn").click(function (event) {
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

function playSound (type) {
    var $audio = $('.testSignal');
    $audio[0].pause();
    $audio.attr('src', eval(type.toLowerCase() + 'Path'));
    $audio[0].load();
    $audio[0].oncanplaythrough = $audio[0].play();
}

function pauseSound() {
    $('.testSignal')[0].pause();
}

function stopSound () {
    $('.testSignal')[0].pause();
    $('.testSignal')[0].currentTime = 0;
}
