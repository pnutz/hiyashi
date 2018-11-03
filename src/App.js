import React, { Component } from 'react'
import './App.css'

import AddOnCategory from './AddOnCategory'
import AddOn from './AddOn'
import Servings from './Servings'
import IngredientList from './IngredientList'
import Ingredient from './Ingredient'
import Recipe from './Recipe'
import RecipeStep from './RecipeStep'

class Hiyashi extends Component {
    render() {
        const model = this.props.model

        return (
            <div className="hiyashi">
                <h1 className="title">Hiyashi Chuka!</h1>
                <hr />
                <p>For the love of cold ramen :)</p>
                <p>Hiyashi chuka, or cold ramen, is a delicious Japanese dish served in the summer. Why wait for the summer when you can make it at home?</p>
                <p>Every cold ramen recipe contains different ingredients, so you can be flexible to create a cold ramen custom to your tastes and dietary restrictions! Here are some ingredient suggestions for your hiyashi chuka.</p>
                <p>Get started by selecting the contents of your hiyashi chuka!</p>
                {this.getCategories(model)}
                {this.getServings(model)}
                {this.getIngredients(model)}
                {this.getRecipe(model)}
            </div>
        )
    }
    
    getCategories(model) {
        const categories = []
        const categoryModel = model.getCategories()
        for (const category in categoryModel) {
            const categoryData = categoryModel[category]
            const addOns = []
            for (const addOn in categoryData) {
                const addOnData = categoryData[addOn]
                const selection = model.getAddOnSelection(category, addOn)
                addOns.push(
                    <AddOn
                        key={category + '_' + addOn}
                        category={category}
                        addon={addOn}
                        label={addOnData.label}
                        required={addOnData.required}
                        constant={addOnData.constant}
                        icon={addOnData.icon}
                        onAddOnChange={this.handleAddOnChange}
                        value={selection} />
                )
            }
            
            if (addOns.length > 0) {
                categories.push(
                    <AddOnCategory
                        key={category}
                        category={model.getAddOnCategoryLabel(category)}>
                        {addOns}
                    </AddOnCategory>
                )
            }
        }
        
        return <div className="category-container">{categories}</div>
    }
    
    getServings(model) {
        const servings = model.getServings()
        return <div className="servings-container">
                    <Servings
                        onServingsChange={this.handleServingsChange}
                        value={servings} />
                </div>
    }
    
    handleAddOnChange = (category, addon, value) => {
        this.props.model.applyAddOn(category, addon, value)
    }
    
    handleServingsChange = (servings) => {
        this.props.model.applyServings(servings)
    }
    
    getIngredients(model) {
        const ingredients = []
        const ingredientModel = model.getIngredients();
        for (const ingredientCategory in ingredientModel) {
            const categoryData = ingredientModel[ingredientCategory]
            const ingredientList = []
            for (const ingredient in categoryData) {
                const ingredientData = categoryData[ingredient]
                ingredientList.push(
                    <Ingredient
                        key={ingredient}
                        category={ingredientCategory}
                        ingredient={ingredient}
                        label={ingredientData.label}
                        quantity={(ingredientData.serving) ? ingredientData.serving.formattedQuantity : null}
                        unit={(ingredientData.serving) ? ingredientData.serving.unit : null} />
                )
            }
            
            if (ingredientList.length > 0) {
                ingredients.push(
                    <IngredientList
                        key={ingredientCategory}
                        category={model.getIngredientCategoryLabel(ingredientCategory)}>
                        {ingredientList}
                    </IngredientList>
                )
            }
        }
        
        return <div className="ingredients-container">{ingredients}</div>
    }
    
    getRecipe(model) {
        const recipeSteps = []
        for (const recipeStep of model.getRecipeSteps()) {
            recipeSteps.push(
                <RecipeStep
                    key={recipeStep}
                    content={recipeStep} />
            )
        }
        return <div className="recipe-container"><Recipe>{recipeSteps}</Recipe></div>
    }
}

export default Hiyashi
