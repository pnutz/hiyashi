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
                        addOns.push(<AddOn addon={ addOn } label={addOnData.label} state={selection} />);
                    }, this);
                    
                    categories.push(
                        <AddOnCategory category={ category }>
                            { addOns }
                        </AddOnCategory>
                    );
                }
            }, this);

            return (
                <div>
                    <h1>Hiyashi Chuka!</h1>
                    <p>For the love of cold ramen :)</p>
                    { categories }
                </div>
            );
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