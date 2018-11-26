import React, { Component } from 'react'
import { Provider } from 'react-redux'

import AddOnCategory from './components/AddOnCategory'
import AddOn from './components/AddOn'
import Servings from './components/Servings'
import IngredientList from './components/IngredientList'
import Ingredient from './components/Ingredient'
import Recipe from './components/Recipe'
import RecipeStep from './components/RecipeStep'

import store from './store'

import styles from './App.module.css'

class Hiyashi extends Component {
    render() {
        const model = this.props.model

        return (
            <Provider store={store}>
                <div className={styles.hiyashi}>
                    <h1 className={styles.title}>Hiyashi Chuka!</h1>
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
            </Provider>
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
        
        return <div className={styles.container}>{categories}</div>
    }
    
    getServings(model) {
        const servings = model.getServings()
        return <div className={styles.container}>
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
        
        return <div className={styles.container}>{ingredients}</div>
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
        return <div className={styles.container}><Recipe>{recipeSteps}</Recipe></div>
    }
}

export default Hiyashi
