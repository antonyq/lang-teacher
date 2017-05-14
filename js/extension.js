String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

Object.defineProperty(Object.prototype, 'merge', {
    value: function(defaultObj) {
        for (var prop in defaultObj) {
            this.prop = ((!this.hasOwnProperty(prop) || !this.prop) && defaultObj.hasOwnProperty(prop)) ? defaultObj.prop : this.prop;
        }

        return this;
    },
    enumerable: false
});

function setTransform (className, options={rotation: 0, scale: 1}) {
    document.getElementsByClassName(className)[0].style.transform = `rotate(${options.rotation}deg) scale(${options.scale})`;
}

function getTransform (className) {
    var transform = document.getElementsByClassName(className)[0].style.transform;
    return {rotation, scale} = {
        rotation: parseInt(transform.match(/rotate/) ? transform.match(/rotate\((.+?)deg\)/)[1] : 0),
        scale: parseFloat(transform.match(/scale/) ? transform.match(/scale\((.+?)\)/)[1] : 1)
    };
}
