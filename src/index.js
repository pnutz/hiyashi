import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';

import './index.css';
import data from './data.json';
import RecipeModel from './RecipeModel';
import Hiyashi from './App';
import registerServiceWorker from './registerServiceWorker';

WebFont.load({
    google: {
        families: ['IBM Plex Sans:100,100i,400,400i,700,700i', 'sans-serif']
    }
});

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