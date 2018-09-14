var app = app || {};

(function () {
	'use strict';
    
    let Utils = app.Utils;

	app.RecipeModel = function (data) {
        this.units = data.units;
        this.categories = data.categories;
        this.selection = {
            addOns: {},
            ingredients: {},
            recipe: {},
            servings: 1
        };
        
        // apply ingredients, etc. based on defaultSelection
        
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
    
    app.RecipeModel.prototype.getAddOn = function (category, addOn) {
        category = this.getCategory(category);
        return (category) ? category[addOn] : null;
    };
    
    app.RecipeModel.prototype.getAddOnSelection = function (category, addOn) {
        let defaultSelection = (this.getAddOn(category, addOn).required) ? 1 : 0;
        return (this.selection.addOns[category]) ? (this.selection.addOns[category][addOn] || defaultSelection) : defaultSelection;
    };
    
    app.RecipeModel.prototype.applyAddOn = function (category, addOn, value) {
        let hasCategory = this.selection.addOns.hasOwnProperty(category);
        let oldValue = this.getAddOnSelection(category, addOn);
        
        // change ingredients
        let netValue = value - oldValue;
        if (netValue > 0) {
            this.addIngredients(category, addOn, netValue);
        } else {
            this.removeIngredients(category, addOn, netValue * -1);
        }
        
        // change addOns
        if (value === 0 && hasCategory) {
            delete this.selection.addOns[category][addOn];
            
            // remove recipe
        } else {
            if (!hasCategory) {
                this.selection.addOns[category] = {};
            }
            
            this.selection.addOns[category][addOn] = value;
            
            // add recipe
        }
        
        /**
        - nice to have: metric
        - servings
        - addon
        - ingredient
        - recipe
        - time
        */
        
        // selection holds quantities
        // method to get ingredients, can either get ingredients every time or store (will call render every time regardless)
        // this.ingredients.default
        // this.ingredients['soy_sauce']
        // array - label is stored where?

        //this.categories[category][addOn].ingredients && ingredient_category
        //this.categories[category][addOn].time (prep / cook)
        //this.categories[category][addOn].recipe
        
        // add/remove recipe steps
        
        // TODO: render ingredients by alphabetical
        
        this.callback();
    };
    
    app.RecipeModel.prototype.applyServings = function(servings) {
        this.selection.servings = servings;
        // TODO: add or remove ingredients
        
        this.callback();
    };
    
    app.RecipeModel.prototype.getServings = function() {
        return this.selection.servings;
    };
    
    app.RecipeModel.prototype.addIngredients = function (category, addOn, value) {
        addOn = this.getAddOn(category, addOn);
        
        if (addOn) {
            value *= this.getServings();
            
            let ingredientCategory = (addOn.hasOwnProperty('ingredient_category')) ? addOn.ingredient_category : null;
            let categoryValue = (ingredientCategory) ? ingredientCategory.category : 'default';
            Object.keys(addOn.ingredients).forEach(function (ingredient) {
                let addedQuantity = value * addOn.ingredients[ingredient].serving.quantity;

                if (!this.selection.ingredients.hasOwnProperty(categoryValue)) {
                    this.selection.ingredients[categoryValue] = {};
                }
                
                let newQuantity = addedQuantity;
                if (!this.selection.ingredients[categoryValue].hasOwnProperty(ingredient)) {
                    this.selection.ingredients[categoryValue][ingredient] = app.Utils.deepClone(addOn.ingredients[ingredient]);
                } else {
                    newQuantity += this.selection.ingredients[categoryValue][ingredient].serving.quantity;
                }
                this.selection.ingredients[categoryValue][ingredient].serving.quantity = newQuantity;
            }, this);
        }
    };
    
    app.RecipeModel.prototype.removeIngredients = function (category, addOn, value) {
        addOn = this.getAddOn(category, addOn);
        
        if (addOn) {
            value *= this.getServings();
            
            let ingredientCategory = (addOn.hasOwnProperty('ingredient_category')) ? addOn.ingredient_category : null;
            let categoryValue = (ingredientCategory) ? ingredientCategory.category : 'default';
            Object.keys(addOn.ingredients).forEach(function (ingredient) {
                let removedQuantity = value * addOn.ingredients[ingredient].serving.quantity;
                
                if (!this.selection.ingredients.hasOwnProperty(categoryValue) ||
                        !this.selection.ingredients[categoryValue].hasOwnProperty(ingredient)) {
                    return;
                }
                
                let currentQuantity = this.selection.ingredients[categoryValue][ingredient].serving.quantity;
                let newQuantity = currentQuantity - removedQuantity;
                if (newQuantity <= 0) {
                    delete this.selection.ingredients[categoryValue][ingredient];
                } else {
                    this.selection.ingredients[categoryValue][ingredient].serving.quantity = newQuantity;
                }
                
                if (Object.keys(this.selection.ingredients[categoryValue]).length === 0) {
                    delete this.selection.ingredients[categoryValue];
                }
            }, this);
        }
    };
    
    app.RecipeModel.prototype.getIngredients = function () {
        // compile all like ingredients by ingredient_category and key
    };
    
    // NOTE: some recipe items will refer to value of ingredient since summation of ingredients will mess up count
    app.RecipeModel.prototype.addRecipeStep = function () {
    };
})();