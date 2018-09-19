import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import data from './data.json';
import RecipeModel from './RecipeModel';
import Hiyashi from './App';
import registerServiceWorker from './registerServiceWorker';

let model = new RecipeModel(data);
    
function render() {
    ReactDOM.render(
        <Hiyashi model={ model } />,
        document.getElementById('root')
    );
}
    
model.subscribe(render);
render();
registerServiceWorker();