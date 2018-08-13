var app = app || {};

(function () {
	'use strict';
    
    let Utils = app.Utils;

	app.RecipeModel = function (data) {
        this.units = data.units;
        this.categories = data.categories;
        this.selection = {};
        this.callbacks = [];
	};
    
    app.RecipeModel.prototype.subscribe = function (callback) {
        this.callbacks.push(callback);
    };
    
    app.RecipeModel.prototype.callback = function() {
        this.callbacks.forEach(function (callback) {
            callback();
        });
    };
    
    app.RecipeModel.prototype.getUnitAbbr = function (unit) {
        return this.units[unit];
    };
    
    app.RecipeModel.prototype.getCategories = function () {
        return this.categories;
    };
    
    app.RecipeModel.prototype.getCategory = function (category) {
        return this.categories[category];
    };
    
    app.RecipeModel.prototype.getAddOnSelection = function (category, addOn) {
        return (this.selection[category]) ? (this.selection[category][addOn] || 0) : 0;
    };
    
    app.RecipeModel.prototype.applyAddOn = function (category, addOn, quantity) {
        this.selection[category][addOn] = quantity;
        // add add-on to selection with quantity
        // add ingredients
        // add recipe steps
        
        this.callback();
    };
    
    app.RecipeModel.prototype.addIngredient = function () {
    };
    
    app.RecipeModel.prototype.addRecipeStep = function () {
    };
})();