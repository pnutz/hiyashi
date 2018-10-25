import React, { Component } from 'react';
import './App.css';

import AddOnCategory from './AddOnCategory';
import AddOn from './AddOn';
import IngredientList from './IngredientList';
import Ingredient from './Ingredient';
import Recipe from './Recipe';
import RecipeStep from './RecipeStep';

class Hiyashi extends Component {
    constructor(props) {
        super(props);
        
        this.handleAddOnChange = this.handleAddOnChange.bind(this);
    }
    
    render() {
        let model = this.props.model;
        console.log(model);
        
        let categories = [];
        Object.keys(model.getCategories()).forEach(function (category) {
            let categoryData = model.getCategory(category);
            let categoryAddOns = Object.keys(categoryData);
            if (categoryAddOns.length > 0) {
                let addOns = [];
                categoryAddOns.forEach(function (addOn) {
                    let addOnData = categoryData[addOn];
                    let selection = model.getAddOnSelection(category, addOn);
                    addOns.push(
                        <AddOn
                            key={category + '_' + addOn}
                            category={category}
                            addon={addOn}
                            label={addOnData.label}
                            required={addOnData.required}
                            icon={addOnData.icon}
                            onAddOnChange={this.handleAddOnChange}
                            value={selection} />
                    );
                }, this);
                
                categories.push(
                    <AddOnCategory
                        key={category}
                        category={category}>
                        { addOns }
                    </AddOnCategory>
                );
            }
        }, this);
        
        let ingredients = [];
        Object.keys(model.getIngredients()).forEach(function (ingredientCategory) {
            let categoryData = model.getIngredientCategory(ingredientCategory);
            let categoryIngredients = Object.keys(categoryData);
            if (categoryIngredients.length > 0) {
                let ingredientList = [];
                categoryIngredients.forEach(function (ingredient) {
                    let ingredientData = categoryData[ingredient];
                    ingredientList.push(
                        <Ingredient
                            key={ingredient}
                            category={ingredientCategory}
                            ingredient={ingredient}
                            label={ingredientData.label}
                            quantity={ingredientData.serving.quantity}
                            unit={ingredientData.serving.unit} />
                    );
                }, this);
                
                ingredients.push(
                    <IngredientList
                        key={ingredientCategory}
                        category={model.getIngredientCategoryLabel(ingredientCategory)}>
                        { ingredientList }
                    </IngredientList>
                );
            }
        }, this);
        
        let recipeSteps = [];
        model.getRecipeSteps().forEach(function (recipeStep) {
            recipeSteps.push(
                <RecipeStep
                    key={recipeStep}
                    content={recipeStep} />
            );
        }, this);
        let recipe = <Recipe>{ recipeSteps }</Recipe>;
        
        /**
            TODO:
            - servings modification
            - recipe time
            - nice to have: recipe presets from recipe compilation
        */

        return (
            <div className="hiyashi">
                <h1>Hiyashi Chuka!</h1>
                <p>For the love of cold ramen :)</p>
                <p>Get started by selecting the contents of your hiyashi chuka!</p>
                { categories }
                { ingredients }
                { recipe }
            </div>
        );
    }
    
    handleAddOnChange(category, addon, value) {
        let model = this.props.model;
        model.applyAddOn(category, addon, value);
    }
}

export default Hiyashi;
