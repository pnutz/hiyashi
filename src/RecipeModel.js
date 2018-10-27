import {deepClone} from './Utils'

class RecipeModel {
    constructor(data) {
        this.units = data.units
        this.ingredientCategories = data.ingredient_categories
        this.categories = data.categories
        this.selection = {
            addOns: {},
            ingredients: {},
            recipe: {},
            servings: 4
        }
        
        this.callbacks = []
        
        this.initializeSelection()
    }
    
    // RecipeModel runs subscribed callback methods on any model changes
    subscribe(callback) {
        this.callbacks.push(callback)
    }
    
    callback() {
        this.callbacks.forEach(function (callback) {
            callback()
        })
    }
    
    getUnitAbbr(unit) {
        return this.units[unit]
    }
    
    getCategories() {
        return this.categories
    }
    
    getIngredients() {
        return this.selection.ingredients
    }
    
    // expects ingredient object as stored in recipe addOn selection
    getIngredientString(ingredient) {
        return ingredient.formattedQuantity + ' ' + ingredient.unit + ' of ' + ingredient.label
    }
    
    getAddOn(category, addOn) {
        category = this.categories[category]
        return (category) ? category[addOn] : null
    }
    
    getIngredientCategoryLabel(category) {
        return this.ingredientCategories[category]
    }
    
    getAddOnSelection(category, addOn) {
        return (this.selection.addOns[category]) ? (this.selection.addOns[category][addOn] || 0) : 0
    }
    
    getServings() {
        return this.selection.servings
    }
    
    // initialize selection of required addOns
    initializeSelection() {
        const categories = this.getCategories();
        for (const category in categories) {
            for (const addOn in categories[category]) {
                const defaultSelection = (this.getAddOn(category, addOn).required) ? 1 : 0
                if (defaultSelection > 0) {
                    this.applyAddOn(category, addOn, defaultSelection)
                }
            }
        }
    }
    
    applyAddOn(category, addOn, value) {
        const hasCategory = this.selection.addOns.hasOwnProperty(category)
        const oldValue = this.getAddOnSelection(category, addOn)
        
        // apply change in ingredients
        const netValue = value - oldValue
        if (netValue > 0) {
            this.addIngredients(category, addOn, netValue)
        } else {
            this.removeIngredients(category, addOn, netValue * -1)
        }
        
        // change addOns
        if (value === 0 && hasCategory) {
            delete this.selection.addOns[category][addOn]
        } else {
            if (!hasCategory) {
                this.selection.addOns[category] = {}
            }
            
            this.selection.addOns[category][addOn] = value
        }
        
        // apply change in recipe
        this.adjustRecipeSteps(category, addOn, value)
        
        /**
        - nice to have: metric
        - time
        */
        
        //this.categories[category][addOn].time (prep / cook)

        this.callback()
    }
    
    applyServings(servings) {
        servings = servings.replace(/[^0-9.]+/g, '');
        
        // remove extra decimals and 5 characters max
        servings = servings.split('.')
        if (servings.length > 1) {
            servings[0] = servings[0] + '.'
        }
        servings = servings.join('').slice(0, 5)
        
        let servingsNumber = Number(servings)
        
        let oldServings = this.getServings()
        this.selection.servings = (servingsNumber !== 0 && !isNaN(servingsNumber)) ? servings : 4

        if (Number(this.getServings()) !== Number(oldServings)) {
            // apply change in ingredients
            this.adjustIngredientsByServings(this.getServings(), oldServings)
            
            // apply change in recipe ingredients
            this.refreshRecipeIngredients()
        }
        
        this.callback()
    }
    
    adjustIngredientsByServings(newServings, oldServings) {
        // divide by old servings and multiply by new servings
        const ingredients = this.getIngredients()
        for (const ingredientCategory in ingredients) {
            for (const ingredientKey in ingredients[ingredientCategory]) {
                let quantity = ingredients[ingredientCategory][ingredientKey].serving.quantity
                this.applyIngredientServings(ingredientCategory, ingredientKey, (quantity * newServings / oldServings))
            }
        }
    }
    
    formatQuantity(quantity) {
        return Math.round(quantity * 10000) / 10000
    }
    
    applyIngredientServings(ingredientCategory, ingredient, quantity, unit) {
        const ingredients = this.getIngredients()
        if (quantity) {
            ingredients[ingredientCategory][ingredient].serving.quantity = quantity
            ingredients[ingredientCategory][ingredient].serving.formattedQuantity = this.formatQuantity(quantity)
        }
        
        if (unit) {
            ingredients[ingredientCategory][ingredient].serving.unit = unit
        }
    }
    
    addIngredients(category, addOn, value) {
        addOn = this.getAddOn(category, addOn)
        
        if (addOn) {
            value *= this.getServings()
            
            const ingredients = this.getIngredients()
            const ingredientCategory = (addOn.hasOwnProperty('ingredient_category')) ? addOn.ingredient_category : 'default'
            for (const ingredient in addOn.ingredients) {
                const addedQuantity = value * addOn.ingredients[ingredient].serving.quantity

                if (!ingredients.hasOwnProperty(ingredientCategory)) {
                    ingredients[ingredientCategory] = {}
                }
                
                let newQuantity = addedQuantity
                let unit = null
                if (!ingredients[ingredientCategory].hasOwnProperty(ingredient)) {
                    ingredients[ingredientCategory][ingredient] = deepClone(addOn.ingredients[ingredient])
                    unit = this.getUnitAbbr(ingredients[ingredientCategory][ingredient].serving.unit)
                } else {
                    newQuantity += ingredients[ingredientCategory][ingredient].serving.quantity
                }
                
                this.applyIngredientServings(ingredientCategory, ingredient, newQuantity, unit)
            }
        }
    }
    
    removeIngredients(category, addOn, value) {
        addOn = this.getAddOn(category, addOn)
        
        if (addOn) {
            value *= this.getServings()
            
            const ingredients = this.getIngredients()
            const ingredientCategory = (addOn.hasOwnProperty('ingredient_category')) ? addOn.ingredient_category : 'default'
            for (const ingredient in addOn.ingredients) {
                const removedQuantity = value * addOn.ingredients[ingredient].serving.quantity
                
                if (!ingredients.hasOwnProperty(ingredientCategory) ||
                        !ingredients[ingredientCategory].hasOwnProperty(ingredient)) {
                    return
                }
                
                const currentQuantity = ingredients[ingredientCategory][ingredient].serving.quantity
                const newQuantity = currentQuantity - removedQuantity
                if (newQuantity <= 0) {
                    delete ingredients[ingredientCategory][ingredient]
                } else {
                    this.applyIngredientServings(ingredientCategory, ingredient, newQuantity)
                }
                
                if (Object.keys(ingredients[ingredientCategory]).length === 0) {
                    delete ingredients[ingredientCategory]
                }
            }
        }
    }
    
    getAddOnIngredients(category, addOn, value) {
        addOn = this.getAddOn(category, addOn)
        value *= this.getServings()
        
        const ingredients = {}
        for (const ingredient in addOn.ingredients) {
            let quantity = value * addOn.ingredients[ingredient].serving.quantity
            ingredients[ingredient] = {
                label: addOn.ingredients[ingredient].label,
                quantity: quantity,
                formattedQuantity: this.formatQuantity(quantity),
                unit: addOn.ingredients[ingredient].serving.unit
            }
        }
        
        return ingredients
    }
    
    refreshRecipeIngredients() {
        const recipe = this.selection.recipe
        for (const category in recipe) {
            for (const addOn in recipe[category]) {
                const value = this.getAddOnSelection(category, addOn)
                recipe[category][addOn].ingredients = this.getAddOnIngredients(category, addOn, value)
            }
        }
    }
    
    adjustRecipeSteps(category, addOn, value) {
        const recipe = this.selection.recipe
        if (value === 0) {
            // remove recipe steps
            if (recipe.hasOwnProperty(category)) {
                if (recipe[category].hasOwnProperty(addOn)) {
                    delete recipe[category][addOn]
                }
                
                if (Object.keys(recipe[category]).length === 0) {
                    delete recipe[category]
                }
            }
        } else {
            // add/edit recipe steps (possibly just ingredients)
            if (!recipe.hasOwnProperty(category)) {
                recipe[category] = {}
            }
            
            const ingredients = this.getAddOnIngredients(category, addOn, value)
            const addOnData = this.getAddOn(category, addOn)
            
            recipe[category][addOn] = {
                steps: deepClone(addOnData.recipe),
                ingredients: ingredients
            }
        }
    }
    
    getRecipeSteps() {
        const recipeSteps = []
        
        const recipe = this.selection.recipe
        for (const category in recipe) {
            for (let addOn in recipe[category]) {
                addOn = recipe[category][addOn]
                for (let step of addOn.steps) {
                    // replace all ingredient keys enclosed in {{ }} with ingredient values
                    const ingredientMatches = step.match(/{{.*?}}/g)
                    if (ingredientMatches) {
                        for (const ingredientMatch in ingredientMatches) {
                            const stringLength = ingredientMatch.length
                            const ingredientKey = ingredientMatch.substring(2, stringLength - 2)
                            const ingredientContents = this.getIngredientString(addOn.ingredients[ingredientKey])
                            step = step.replace(ingredientMatch, ingredientContents)
                        }
                    }
                    recipeSteps.push(step)
                }
            }
        }
        
        return recipeSteps
    }
}

export default RecipeModel