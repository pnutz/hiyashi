module.exports = {
    capitalize: function(string) {
        const words = string.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        return words.join(' ')
    },
    
    deepClone: function(object) {
        return JSON.parse(JSON.stringify(object))
    }
}