class StorageManager {
    constructor() {

        this.schema = {
            custom: {},
            default: {
                dictionary: {
                    word: {
                        image: {
                            path: '',
                            rotation: 0,
                            scale: 1
                        },
                        audio: {
                            path: ''
                        }
                    }
                },
                config: {
                    audio: {
                        win: {
                            path: __dirname + '\\audio\\win.wav',
                            duration: 2
                        },
                        wrong: {
                            path: __dirname + '\\audio\\wrong.wav',
                            duration: 1
                        },
                        correct: {
                            path: __dirname + '\\audio\\correct.wav',
                            duration: 1
                        }
                    },
                    font: {
                        family: '"Comic Sans MS", cursive, sans-serif'
                    }
                }
            }
        }

        if (localStorage.getItem('data') == null) localStorage.data = this.schema;

        this.dictionary = localStorage.getItem('dictionary');
        this.config = localStorage.getItem('config');

    }




    // DICTIONARY //

    getRecord(word) {
        try {
            this.dictionary = localStorage.getItem('dictionary');
            return this.dictionary[word].merge(this.dictionary.word);
        } catch (error) {
            return error;
        }
    };

    getRandomWord() {
        var words = Object.keys(localStorage.getItem('dictionary'));
        return words[Math.floor(Math.random() * words.length)];
    };

    setRecord(word, options={}) {
        try {
            this.dictionary = localStorage.getItem('dictionary');
            this.dictionary[word] = options;
            localStorage.setItem('dictionary', this.dictionary);
        } catch(error) {
            return error;
        }
    };

    removeRecord(word) {
        try {
            this.dictionary = localStorage.getItem('dictionary');
            delete this.dictionary[word];
            localStorage.setItem('dictionary', this.dictionary);
        } catch (error) {
            return error;
        }
    };




    // CONFIG //

    getConfig(mode, type, name) {
        try {
            this.config = localStorage.getItem('config');
            return this.config[mode][type][name].merge(this.config.default[type][name]);
        } catch (error) {
            return error;
        }
    }

    setConfig(type, name, options={}) {
        try {
            this.config = localStorage.getItem('config');
            this.config[mode][type][name] = options;
            localStorage.setItem('config', this.config);
        } catch (error) {
            return error;
        }
    }

    resetConfigItem(type) {
        try {
            this.config = localStorage.getItem('config');
            delete this.config.custom[type];
            localStorage.setItem('config', this.config);
        } catch (error) {
            return error;
        }
    }

    resetConfig(type) {
        try {
            localStorage.setItem('config', this.schema.default.config);
        } catch (error) {
            return error;
        }
    }

}
