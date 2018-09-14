var app = app || {};

(function () {
	'use strict';

	app.Utils = {
		capitalize: function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
		},
        
        deepClone: function (object) {
            return JSON.parse(JSON.stringify(object));
        }
	};
})();