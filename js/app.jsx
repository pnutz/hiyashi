let app = app || {};

(function() {
    'use strict';
    
    // load json recipe data
    let data = (function($) {
        let json = null;
        $.getJSON({
            'async': false,
            'global': false,
            'url': './data.json',
            'mimeType': 'application/json',
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })($);
        
    let AddOnCategory = app.AddOnCategory;
    let AddOn = app.AddOn;
    let IngredientList = app.IngredientList;
    let Ingredient = app.Ingredient;
    
    class Hiyashi extends React.Component {
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
                                category={category}
                                addon={addOn}
                                label={addOnData.label}
                                required={addOnData.required}
                                onAddOnChange={this.handleAddOnChange}
                                value={selection} />
                        );
                    }, this);
                    
                    categories.push(
                        <AddOnCategory category={ category }>
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
                                unit={ingredientData.serving.unit}
                            />
                        );
                    }, this);
                    
                    ingredients.push(
                        <IngredientList category={ model.getIngredientCategoryLabel(ingredientCategory) }>
                            { ingredientList }
                        </IngredientList>
                    );
                }
            }, this);
            
            /**
                TODO:
                - servings modification
                - ingredients list, separated by ingredient_category (no category first) -- ul/li, click to strikethrough
                - recipe time
                - recipe steps
            */

            return (
                <div>
                    <h1>Hiyashi Chuka!</h1>
                    <p>For the love of cold ramen :)</p>
                    { categories }
                    { ingredients }
                </div>
            );
        }
        
        handleAddOnChange(category, addon, value) {
            let model = this.props.model;
            model.applyAddOn(category, addon, value);
        }
    }
    
    var model = new app.RecipeModel(data);
    
    function render() {
        ReactDOM.render(
            <Hiyashi model={ model } />,
            document.getElementById('hiyashi')
        );
    }
    
    model.subscribe(render);
    render();
})();