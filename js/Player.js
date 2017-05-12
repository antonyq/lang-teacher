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

    play (path, duration, callback) {
        if (path) {
            if ($('audio').attr('scr') == path) {
                $('audio')[0].play();
            } else {
                this.pause();
                document.getElementById(this.id).src = path;
                $('audio')[0].load();
                $('audio').on('canplay canplaythrough', () => {
                    $('audio')[0].play();
                });
            }
        } else {
            $('audio')[0].play();
        }
        if (duration) {
            setTimeout(() => {
                this.pause();
                if (typeof callback == 'function') {
                    callback();
                }
            }, duration * 1000);
        }

    }

    reset () {
        document.getElementById(this.id).src = '';
    }

    isPlaying () {
        return !document.getElementById(this.id).paused;
    }

    pause () {
        $('audio')[0].pause();
    }
}
