var app = app || {};

(function () {
	'use strict';
    
    let Utils = app.Utils;

	app.RecipeModel = function (data) {
        this.units = data.units;
        this.ingredientCategories = data.ingredient_categories;
        this.categories = data.categories;
        this.selection = {
            addOns: {},
            ingredients: {},
            recipe: {},
            servings: 1
        };
        
        this.callbacks = [];
        
        this.initializeSelection();
	};
    
    // RecipeModel runs subscribed callback methods on any model changes
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
    
    app.RecipeModel.prototype.getIngredients = function () {
        return this.selection.ingredients;
    };
    
    app.RecipeModel.prototype.getIngredientCategory = function (category) {
        return this.selection.ingredients[category];
    };
    
    app.RecipeModel.prototype.getAddOn = function (category, addOn) {
        category = this.getCategory(category);
        return (category) ? category[addOn] : null;
    };
    
    app.RecipeModel.prototype.getIngredientCategoryLabel = function (category) {
        return this.ingredientCategories[category];
    };
    
    app.RecipeModel.prototype.getAddOnSelection = function (category, addOn) {
        return (this.selection.addOns[category]) ? (this.selection.addOns[category][addOn] || 0) : 0;
    };
    
    // initialize selection of required addOns
    app.RecipeModel.prototype.initializeSelection = function () {
        Object.keys(this.getCategories()).forEach(function (category) {
            let categoryData = this.getCategory(category);
            let categoryAddOns = Object.keys(categoryData);
            if (categoryAddOns.length > 0) {
                let addOns = [];
                categoryAddOns.forEach(function (addOn) {
                    let defaultSelection = (this.getAddOn(category, addOn).required) ? 1 : 0;
                    if (defaultSelection > 0) {
                        this.applyAddOn(category, addOn, defaultSelection);
                    }
                }, this);
            }
        }, this);
    };
    
    app.RecipeModel.prototype.applyAddOn = function (category, addOn, value) {
        let hasCategory = this.selection.addOns.hasOwnProperty(category);
        let oldValue = this.getAddOnSelection(category, addOn);
        
        // apply change in ingredients
        let netValue = value - oldValue;
        if (netValue > 0) {
            this.addIngredients(category, addOn, netValue);
        } else {
            this.removeIngredients(category, addOn, netValue * -1);
        }
        
        // change addOns
        if (value === 0 && hasCategory) {
            delete this.selection.addOns[category][addOn];
        } else {
            if (!hasCategory) {
                this.selection.addOns[category] = {};
            }
            
            this.selection.addOns[category][addOn] = value;
        }
        
        // apply change in recipe
        this.adjustRecipeSteps(category, addOn, value);
        
        /**
        - nice to have: metric
        - servings
        - time
        */
        
        //this.categories[category][addOn].time (prep / cook)
                
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
            
            let ingredients = this.selection.ingredients;
            let ingredientCategory = (addOn.hasOwnProperty('ingredient_category')) ? addOn.ingredient_category : 'default';
            Object.keys(addOn.ingredients).forEach(function (ingredient) {
                let addedQuantity = value * addOn.ingredients[ingredient].serving.quantity;

                if (!ingredients.hasOwnProperty(ingredientCategory)) {
                    ingredients[ingredientCategory] = {};
                }
                
                let newQuantity = addedQuantity;
                if (!ingredients[ingredientCategory].hasOwnProperty(ingredient)) {
                    ingredients[ingredientCategory][ingredient] = app.Utils.deepClone(addOn.ingredients[ingredient]);
                    ingredients[ingredientCategory][ingredient].serving.unit = this.getUnitAbbr(ingredients[ingredientCategory][ingredient].serving.unit);
                } else {
                    newQuantity += ingredients[ingredientCategory][ingredient].serving.quantity;
                }
                ingredients[ingredientCategory][ingredient].serving.quantity = newQuantity;
            }, this);
        }
    };
    
    app.RecipeModel.prototype.removeIngredients = function (category, addOn, value) {
        addOn = this.getAddOn(category, addOn);
        
        if (addOn) {
            value *= this.getServings();
            
            let ingredients = this.selection.ingredients;
            let ingredientCategory = (addOn.hasOwnProperty('ingredient_category')) ? addOn.ingredient_category : 'default';
            Object.keys(addOn.ingredients).forEach(function (ingredient) {
                let removedQuantity = value * addOn.ingredients[ingredient].serving.quantity;
                
                if (!ingredients.hasOwnProperty(ingredientCategory) ||
                        !ingredients[ingredientCategory].hasOwnProperty(ingredient)) {
                    return;
                }
                
                let currentQuantity = ingredients[ingredientCategory][ingredient].serving.quantity;
                let newQuantity = currentQuantity - removedQuantity;
                if (newQuantity <= 0) {
                    delete ingredients[ingredientCategory][ingredient];
                } else {
                    ingredients[ingredientCategory][ingredient].serving.quantity = newQuantity;
                }
                
                if (Object.keys(ingredients[ingredientCategory]).length === 0) {
                    delete ingredients[ingredientCategory];
                }
            }, this);
        }
    };
    
    app.RecipeModel.prototype.getAddOnIngredients = function (category, addOn, value) {
        addOn = this.getAddOn(category, addOn);
        value *= this.getServings();
        
        let ingredients = {};
        Object.keys(addOn.ingredients).forEach(function (ingredient) {
            ingredients[ingredient] = {
                label: addOn.ingredients[ingredient].label,
                quantity: value * addOn.ingredients[ingredient].serving.quantity,
                unit: addOn.ingredients[ingredient].serving.unit
            };
        }, this);
        
        return ingredients;
    };

    app.RecipeModel.prototype.adjustRecipeSteps = function (category, addOn, value) {
        let recipe = this.selection.recipe;
        if (value === 0) {
            // remove recipe steps
            if (recipe.hasOwnProperty(category)) {
                if (recipe[category].hasOwnProperty(addOn)) {
                    delete recipe[category][addOn];
                }
                
                if (Object.keys(recipe[category]).length === 0) {
                    delete recipe[category];
                }
            }
        } else {
            // add/edit recipe steps (possibly just ingredients)
            if (!recipe.hasOwnProperty(category)) {
                recipe[category] = {};
            }
            
            let ingredients = this.getAddOnIngredients(category, addOn, value);
            let addOnData = this.getAddOn(category, addOn);
            
            recipe[category][addOn] = {
                steps: app.Utils.deepClone(addOnData.recipe),
                ingredients: ingredients
            };
        }
    };
    
    app.RecipeModel.prototype.getRecipeSteps = function () {
        let recipeSteps = [];
        
        let recipe = this.selection.recipe;
        Object.keys(recipe).forEach(function (category) {
            Object.keys(recipe[category]).forEach(function (addOn) {
                addOn = recipe[category][addOn];
                addOn.steps.forEach(function (step) {
                    // replace all ingredient keys enclosed in {{ }} with ingredient values
                    let ingredientMatch = step.match(/{{.*?}}/g);
                    if (ingredientMatch) {
                        ingredientMatch.forEach(function (ingredientMatch) {
                            let stringLength = ingredientMatch.length;
                            let ingredientKey = ingredientMatch.substring(2, stringLength - 2);
                            let ingredientContents = this.getIngredientString(addOn.ingredients[ingredientKey]);
                            step = step.replace(ingredientMatch, ingredientContents);
                        }, this);
                    }
                    recipeSteps.push(step);
                }, this);
            }, this);
        }, this);
        
        return recipeSteps;
    };
    
    // expects ingredient object as stored in recipe addOn selection
    app.RecipeModel.prototype.getIngredientString = function(ingredient) {
        return ingredient.quantity + ' ' + ingredient.unit + ' of ' + ingredient.label;
    };
})();