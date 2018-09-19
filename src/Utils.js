export default {
    capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    
    deepClone(object) {
        return JSON.parse(JSON.stringify(object));
    }
};