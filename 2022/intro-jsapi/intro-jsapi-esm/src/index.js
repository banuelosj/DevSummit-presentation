import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
// setting path to calcite components' assets
// usins assets hosted on CDN
// https://developers.arcgis.com/calcite-design-system/get-started/#custom-elements
import { setAssetPath } from "@esri/calcite-components/dist/components";
setAssetPath(`https://unpkg.com/@esri/calcite-components/dist/calcite/assets`);

ReactDOM.render(
   <App />,
   document.getElementById('root')
);