import React from 'react';
import ReactDOM from 'react-dom';

import Game from './containers/game';
import './index.css';


// ========================================
const val = {rows:12,columns:12}
ReactDOM.render(<Game 
    value={val}
/>, document.getElementById("root"));
  

  