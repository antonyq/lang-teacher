class StorageManager {
    constructor() {
        if (localStorage.getItem("wordImgPairs") == null) {
            localStorage.setItem("wordImgPairs", JSON.stringify({}));
        }

        ['win', 'wrong', 'correct'].forEach(function (type) {
            if (localStorage.getItem(type + 'Audio') == null) {
                localStorage.setItem(type + 'Audio', JSON.stringify({
                    path: __dirname + '\\audio\\' + type + '.wav',
                    duration: type == 'win' ? 2 : 1
                }));
            }
        });

        this.wordImgPairs = JSON.parse(localStorage.getItem("wordImgPairs"));
    }

    isWordSetted (word) {
        return Boolean(this.getRecord(word).word);
    }

    setRecord (word, imgPath, imgRotation) {
        try {
            this.wordImgPairs = JSON.parse(localStorage.getItem("wordImgPairs"));
            this.wordImgPairs[word] = {};
            this.wordImgPairs[word].imgPath = (imgPath != undefined) ? imgPath : "";
            this.wordImgPairs[word].imgRotation = (imgRotation != undefined && imgPath != undefined) ? imgRotation : "";
            localStorage.setItem("wordImgPairs", JSON.stringify(this.wordImgPairs));
        } catch(error) {
            return error;
        }
    };

    getRecord (word) {
        this.wordImgPairs = JSON.parse(localStorage.getItem("wordImgPairs"));

        return (this.wordImgPairs.hasOwnProperty(word)) ? {
                word: word,
                imgPath: this.wordImgPairs[word].imgPath,
                imgRotation: this.wordImgPairs[word].imgRotation
            } : new Error("RecordNotFoundException") ;
    };

    getRandomRecord () {
        this.wordImgPairs = JSON.parse(localStorage.getItem("wordImgPairs"));

        var words = Object.keys(this.wordImgPairs);
        var randomWord = words[Math.floor(Math.random() * words.length)];
        var imgPath, imgRotation;
        if (words[randomWord]) {
            imgPath = words[randomWord].imgPath;
            imgRotatoin = words[randomWord].imgRotation;
        }
        return {
            word: randomWord,
            imgPath: imgPath,
            imgRotation: imgRotation
        }
    };

    removeRecord (word) {
        this.wordImgPairs = JSON.parse(localStorage.getItem("wordImgPairs"));
        delete this.wordImgPairs[word];
        localStorage.setItem("wordImgPairs", JSON.stringify(this.wordImgPairs));
    };

    removeAllRecords () {
        localStorage.clear();
        localStorage.setItem("wordImgPairs", JSON.stringify({}));
    };

    refreshLocalStorage () {
        localStorage.clear();
        for (var key in localStorage) {
            if (key != "wordImgPairs") {
                localStorage.removeItem(key);
            }
        }
    };

    setAudio (name, path, duration) {
        var audioObj = {
            path: path,
            duration: duration
        };
        localStorage.setItem(name + "Audio", JSON.stringify(audioObj));
    }

    resetAudio () {
        ['win', 'wrong', 'correct'].forEach(function (type) {
            localStorage.setItem(type + 'Audio', JSON.stringify({
                path: __dirname + '\\audio\\' + type + '.wav',
                duration: type == 'win' ? 2 : 1
            }));
        });
    }

    getAudio (name) {
        return JSON.parse(
            localStorage.getItem(name + "Audio") ||
            JSON.stringify({
                path: null,
                duration: null
            })
        );
    }

}
