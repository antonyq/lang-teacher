class StorageManager {
    constructor() {

        this.schema = {
            studentsList: [
                ''
            ],
            dictionary: {
                word: {
                    image: {
                        path: '',
                        rotation: 0,
                        scale: 1
                    },
                    audio: {
                        path: ''
                    },
                    student: {
                        name: ''
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
                        name: 'Comic Sans MS',
                        style: 'normal',
                        size: '14px'
                    }
                }
            }
        };

        this.data = {
            fonts: {
                names: [
                    'Comic Sans MS',
                    'cursive',
                    'monospace',
                    'serif',
                    'sans-serif',
                    'fantasy',
                    'Arial',
                    'Arial Narrow',
                    'Arial Rounded MT Bold',
                    'Bookman Old Style',
                    'Bradley Hand ITC',
                    'Century',
                    'Century Gothic',
                    'Courier',
                    'Courier New',
                    'Georgia',
                    'Gentium',
                    'Impact',
                    'King',
                    'Lucida Console',
                    'Lalit',
                    'Modena',
                    'Monotype Corsiva',
                    'Papyrus',
                    'Tahoma',
                    'TeX',
                    'Times',
                    'Times New Roman',
                    'Trebuchet MS',
                    'Verdana',
                    'Verona'
                ],
                styles: [
                    'normal',
                    'italic',
                    'oblique'
                ],
                sizes: [10,11,12,13,14]
            }
        };

        // init collections
        if (localStorage.getItem('studentsList') == null) {
            this.studentsList = [];
            localStorage.setItem('studentsList', JSON.stringify(this.studentsList));
        }
        if (localStorage.getItem('dictionary') == null) {
            this.dictionary = {};
            localStorage.setItem('dictionary', JSON.stringify(this.dictionary));
        }
        if (localStorage.getItem('config') == null) {
            this.config = this.schema.config;
            localStorage.setItem('config', JSON.stringify(this.config));
        }

        // update collections
        this.studentsList = JSON.parse(localStorage.getItem('studentsList'));
        this.dictionary = JSON.parse(localStorage.getItem('dictionary'));
        this.config = JSON.parse(localStorage.getItem('config'));
    }

    // STUDENTS_LIST //
    addStudent (name) {
        try {
            this.studentsList = JSON.parse(localStorage.getItem('studentsList'));
            this.studentsList.push(name);
            localStorage.setItem('studentsList', JSON.stringify(this.studentsList));
        } catch (error) {
            return error;
        }
    }

    editStudent (name, newName) {
        try {
            this.studentsList = JSON.parse(localStorage.getItem('studentsList'));
            this.dictionary = JSON.parse(localStorage.getItem('dictionary'));
            let index = this.studentsList.indexOf(name);
            if (index != -1) {
                this.studentsList.splice(index, 1, newName);
                Object.keys(this.dictionary).forEach((word) => {
                    this.dictionary[word].student = (this.dictionary[word].student == name) ? newName : this.dictionary[word].student;
                });
            }
            localStorage.setItem('studentsList', JSON.stringify(this.studentsList));
            localStorage.setItem('dictionary', JSON.stringify(this.dictionary));
        } catch (error) {
            return error;
        }
    }

    removeStudent (name) {
        try {
            this.studentsList = JSON.parse(localStorage.getItem('studentsList'));
            let index = this.studentsList.indexOf(name);
            if (index != -1) {
                this.studentsList.splice(index, 1);
                Object.keys(this.dictionary).forEach((word) => {
                    if (this.dictionary[word].student == name) {
                        delete this.dictionary[word];
                    }
                });
            }
            localStorage.setItem('studentsList', JSON.stringify(this.studentsList));
        } catch (error) {
            return error;
        }
    }


    // DICTIONARY //
    getWords(student) {
        try {
            this.dictionary = JSON.parse(localStorage.getItem('dictionary'));
            return Object.keys(this.dictionary).filter(word => this.dictionary[word].student == student);
        } catch (error) {
            return error;
        }
    }

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

    getRandomWord(studentName) {
        try {
            this.dictionary = JSON.parse(localStorage.getItem('dictionary'));
            if (this.dictionary) {
                let words = (studentName) ? Object.keys(this.dictionary).filter(word => {word.student == studentName}) : Object.keys(this.dictionary);
                return words[Math.floor(Math.random() * words.length)];
            } else return null;
        } catch (error) {
            return error;
        }
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
            return this.config[type][name].merge(this.schema.config[type][name]);
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
            this.config[type] = this.schema.config[type];
            localStorage.setItem('config', JSON.stringify(this.config));
        } catch (error) {
            return error;
        }
    }

    resetConfig(type) {
        try {
            localStorage.setItem('config', JSON.stringify(this.default.config));
        } catch (error) {
            return error;
        }
    }

}
