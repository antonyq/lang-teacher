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
                            duration: 3
                        },
                        wrong: {
                            path: __dirname + '\\audio\\wrong.wav',
                            duration: 0.5
                        },
                        correct: {
                            path: __dirname + '\\audio\\correct.wav',
                            duration: 0.5
                        }
                    },
                    font: {
                        main: {
                            name: '"Comic Sans MS", cursive, sans-serif'
                        }
                    }
                }
            }
        }

        if (localStorage.getItem('config') == null) {
            localStorage.setItem('config', JSON.stringify(this.schema.default.config));
        }

        this.dictionary = JSON.parse(localStorage.getItem('dictionary'));
        this.config = JSON.parse(localStorage.getItem('config'));

    }




    // DICTIONARY //
    getRecord(word) {
        try {
            this.dictionary = JSON.parse(localStorage.getItem('dictionary'));
            return this.dictionary[word].merge(this.dictionary.word);
        } catch (error) {
            return error;
        }
    };

    getRecordsCount() {
        try {
            this.dictionary = JSON.parse(localStorage.getItem('dictionary'));
            return Object.keys(this.dictionary).length;
        } catch (error) {
            return error;
        }
    };

    getRandomWord() {
        this.dictionary = JSON.parse(localStorage.getItem('dictionary'));
        if (this.dictionary) {
            var words = Object.keys(this.dictionary);
            return words[Math.floor(Math.random() * words.length)];
        } else return null;
    };

    setRecord(word, options={}) {
        try {
            this.dictionary = JSON.parse(localStorage.getItem('dictionary')) || {};
            this.dictionary[word] = options;
            localStorage.setItem('dictionary', JSON.stringify(this.dictionary));
        } catch(error) {
            return error;
        }
    };

    hasRecord (word) {
        try {
            this.dictionary = JSON.parse(localStorage.getItem('dictionary'));
            if (this.dictionary[word]) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return error;
        }
    }

    removeRecord(word) {
        try {
            this.dictionary = JSON.parse(localStorage.getItem('dictionary'));
            delete this.dictionary[word];
            localStorage.setItem('dictionary', JSON.stringify(this.dictionary));
        } catch (error) {
            return error;
        }
    };




    // CONFIG //
    getConfig(type, name) {
        try {
            this.config = JSON.parse(localStorage.getItem('config'));
            return this.config[type][name].merge(this.schema.default.config[type][name]);
        } catch (error) {
            return error;
        }
    }

    setConfig(type, name, options={}) {
        try {
            this.config = JSON.parse(localStorage.getItem('config'));
            this.config[type][name] = options;
            localStorage.setItem('config', JSON.stringify(this.config));
        } catch (error) {
            return error;
        }
    }

    resetConfigItem(type) {
        try {
            this.config = JSON.parse(localStorage.getItem('config'));
            this.config[type] = this.schema.default.config[type];
            localStorage.setItem('config', JSON.stringify(this.config));
        } catch (error) {
            return error;
        }
    }

    resetConfig(type) {
        try {
            localStorage.setItem('config', JSON.stringify(this.schema.default.config));
        } catch (error) {
            return error;
        }
    }

}
