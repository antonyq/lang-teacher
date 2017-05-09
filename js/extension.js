String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

Object.defineProperty(Object.prototype, 'merge', {
    value: function(defaultObj) {
        for (var prop in defaultObj) {
            this.prop = ((!this.hasOwnProperty(prop) || !this.prop) && defaultObj.prop) ? defaultObj.prop : this.prop;
        }

        return this;
    },
    enumerable: false
});
