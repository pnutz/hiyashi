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
                                key={addOn}
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