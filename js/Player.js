class Player {
    constructor (id) {
        this.id = id;
        $('body').append(`<audio id='${id}'></audio>`);
    }

    load (path) {
        if (path) {
            this.stop();
            document.getElementById(this.id).src = path;
            $('audio')[0].load();
        }
    }

    play (options, callback) {
        if (options.path) {
            if ($('audio').attr('scr') == options.path) {
                $('audio')[0].play();
            } else {
                this.pause();
                document.getElementById(this.id).src = options.path;
                $('audio')[0].load();
                $('audio').on('canplay canplaythrough', () => {
                    $('audio')[0].play();
                });
                $('audio').on('ended', () => {
                    $(options.element).removeClass('playing');
                });
            }
        } else {
            $('audio')[0].play();
        }
        if (options.duration) {
            setTimeout(() => {
                this.pause();
                if (typeof callback == 'function') {
                    callback();
                }
            }, options.duration * 1000);
        }

    }

    isPlaying () {
        return !document.getElementById(this.id).paused;
    }

    reset () {
        document.getElementById(this.id).src = '';
    }

    pause () {
        $('audio')[0].pause();
    }
}
