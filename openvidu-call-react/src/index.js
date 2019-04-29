import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './components/main_pages/Main';
import VideoRoomComponent from './components/VideoRoomComponent';
import registerServiceWorker from './registerServiceWorker';

//ReactDOM.render(<VideoRoomComponent />, document.getElementById('root'));
ReactDOM.render(<Main />, document.getElementById('root'));
registerServiceWorker();
