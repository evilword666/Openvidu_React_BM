import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './components/main_pages/Main';
import Cronometro from './components/Cronometro/Cronometro';

import VideoRoomComponent from './components/VideoRoomComponent';
import registerServiceWorker from './registerServiceWorker';

//ReactDOM.render(<VideoRoomComponent />, document.getElementById('root'));
ReactDOM.render(<Main />, document.getElementById('root'));
//ReactDOM.render(<Cronometro ver="0.1.0"/>, document.querySelector('#app'));
registerServiceWorker();

