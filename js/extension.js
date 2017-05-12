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

function setScale ($block, scale) {
    var style = $block.attr('style');
    var transform = style.match(/transform/) ? style.match(/transform: ([^;]*);/)[1] : '';
    var oldScale = transform.match(/rotate/) ? transform.match(/scale\((.+?)\)/)[1] : '';

    $block.css('transform', transform.replace('scale(' + oldScale + 'deg)', 'scale(' + scale + 'deg)'));
}

function setRotation ($block, rotation) {
    var style = $block.attr('style');
    var transform = style.match(/transform/) ? style.match(/transform: ([^;]*);/)[1] : '';
    var oldRotation = transform.match(/rotate/) ? transform.match(/rotate\((.+?)deg\)/)[1] : '';

    $block.css('transform', transform.replace('rotate(' + oldRotation + 'deg)', 'rotate(' + rotation + 'deg)'));
}
