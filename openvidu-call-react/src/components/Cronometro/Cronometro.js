import React, { Component } from 'react';
import VideoRoomComponent from '../VideoRoomComponent';


export default class Cronometro extends Component{



    constructor(props) {
        super(props);

        //: getInitialState() method
        this.state = {
            minutes: 0,
            seconds: 0,
            millis: 0,
            running: false
        };

        this._handleStartClick = this._handleStartClick.bind(this);
        this._handleStopClick = this._handleStopClick.bind(this);
        this._handleResetClick = this._handleResetClick.bind(this);
    }


    _handleStartClick(event) {
        var _this = this;
        if (!this.state.running) {
            this.interval = setInterval(() => {
                this.tick();
            }, 100)

            this.setState({running: true})
        }
    }

    _handleStopClick(event) {        
        if (this.state.running) {
            clearInterval(this.interval);
            this.setState({running: false})
        }
    }

    _handleResetClick(event) {
        this._handleStopClick();
        this.update(0, 0, 0);
    }
    
    tick() {
        let millis = this.state.millis + 1;
        let seconds = this.state.seconds;
        let minutes = this.state.minutes;

        if (millis === 10) {
            millis = 0;
            seconds = seconds + 1;
        }

        if (seconds === 60) {
            millis = 0;
            seconds = 0;
            minutes = minutes + 1;
        }

        this.update(millis, seconds, minutes);
    }

    zeroPad(value) {
        return value < 10 ? `0${value}` : value;
    }

    update(millis, seconds, minutes) {
        this.setState({
            millis: millis,
            seconds: seconds,
            minutes: minutes
        });
    }

    componentDidMount() {
        //TODO   
        this._handleStartClick()

    }

    componentWillUnMount() {
        //TODO
    }

    render() {
        let run = this.state.running === true;
        return (
            <div id="contenedor">                                                                                                                          
                  <div className="reloj" id="relojTexto">{this.zeroPad(this.state.minutes)}:</div> 
                  <div className="reloj" id="relojTexto">{this.zeroPad(this.state.seconds)}</div> 
                  <div className="reloj" id="relojTexto">:0{this.state.millis}</div>                               
            </div>

            );
    }


}
