import React from "react";
import ReactDOM from "react-dom";


class TimerInput extends React.Component {




    //Esta linea va en lugar del cronometro en el archivo VideoRoomComponent.js
    /*
                     <TemporizadorApp
                         minutosRestantes = {this.state.minutosRestantes}
                     />
*/
//Esta linea es para el cronometro
/*
                              <Cronometro/>
*/




  render() {

//setTimeout(this.leaveSession(),5000)


    return (
      <div style={{marginLeft:100}}>
        <h3>Input your desired time</h3>
        <input type="number" value={this.props.value} onChange={this.props.handleChange} required />
      </div>
    );
  }
}

class Timer extends React.Component {


  constructor(props) {
    super(props);

    this.leaveSession = this.leaveSession.bind(this);


}

    leaveSession() {
      console.log("Saliendo...")
        this.props.leaveSession();
        alert("Entrando a la funcion leaveSession()")
    }

    


  render() {

let minutos=this.props.value;
let segundos=this.props.seconds;

console.log("Tiempo restante: "+minutos+":"+segundos)
//alert("Tiempo restante: "+minutos+":"+segundos)
//document.getElementById('textoReloj').style.color = '#FFFFFF';


//localStorage.setItem("minutosTemporizador",minutos)                
//localStorage.setItem("segundosTemporizador",segundos)                
let valorMinutos = 15;
let statusTemporizador;

if(minutos >= 10){  
    console.log("Es mayor que "+valorMinutos);
    statusTemporizador = <div>                             
                             <div className="reloj" style={{color:'green'}}>{this.props.value}:</div> 
                             <div className="reloj" style={{color:'green'}}>{this.props.seconds}</div>   
                         </div>


}else if(minutos >= 7){
        statusTemporizador = <div>                             
                             <div className="reloj" style={{color:'yellow'}}>{this.props.value}:</div> 
                             <div className="reloj" style={{color:'yellow'}}>{this.props.seconds}</div>   
                         </div>
}else if(minutos >= 1){
        statusTemporizador = <div>                             
                             <div className="reloj" style={{color:'red'}}>{this.props.value}:</div> 
                             <div className="reloj" style={{color:'red'}}>{this.props.seconds}</div>   
                         </div>
}else if( minutos === 0 && segundos === 0){
  alert("La videoconsulta ha terminado")

        statusTemporizador = <div>                             
                             <div className="reloj" style={{color:'red'}}>{this.props.value}:</div> 
                             <div className="reloj" style={{color:'red'}}>{this.props.seconds}</div>   
                             <button className="btn btn-lg btn-success" onClick={this.leaveSession}>Dejar sesión</button>                                          
                         </div>
}

    return (      


            <div id="contenedor">                                  
                  {statusTemporizador}
                  
            </div>

            
            
            


    );
  }
}

class StartButton extends React.Component {
  render() {
    console.log(this.props.startCountDown)
    return (
      <div style={{ marginLeft: 130 }}>
        <button className="btn btn-lg btn-success" disabled={!this.props.value} onClick={this.props.startCountDown}>Start</button>
      </div>

    );
  }
}

export default class TemporizadorApp extends React.Component {


  constructor(props) {
    super(props);

    this.leaveSession = this.leaveSession.bind(this);

    console.log("AllProps:"+props.minutosRestantes)
    this.state = {
      seconds: '00',
      value: '',
      isClicked : false
    }
    this.secondsRemaining;
    this.intervalHandle;
    this.handleChange = this.handleChange.bind(this);
    this.startCountDown = this.startCountDown.bind(this);
    this.tick = this.tick.bind(this);
  }

    leaveSession() {
      console.log("Saliendo...")
        this.props.leaveSession();
        alert("Entrando a la funcion leaveSession()")
    }


  handleChange(event) {
    this.setState({
      value: event.target.value
    })
  }

  componentWillMount(){  
       this.startCountDown()
  }

  tick() {
    var min = Math.floor(this.secondsRemaining / 60);
    var sec = this.secondsRemaining - (min * 60);

    this.setState({
      value: min,
      seconds: sec,
    })

    if (sec < 10) {
      this.setState({
        seconds: "0" + this.state.seconds,
      })

    }

    if (min < 10) {
      this.setState({
        value: "0" + min,
      })

    }

    if (min === 0 & sec === 0) {
      clearInterval(this.intervalHandle);
    }


    this.secondsRemaining--
  }

  startCountDown() {
    this.intervalHandle = setInterval(this.tick, 1000);
    let time = this.props.minutosRestantes;//this.state.value

    

    this.secondsRemaining = time * 60;
    this.setState({
      isClicked : true
    })


    //setTimeout(this.props.leaveSession,10000)
  }

  render() {
    const clicked = this.state.isClicked;
    if(clicked){
    return (
      <div>
        <div className="row">
          <div className="col-md-4"></div>
          <div className="col-md-4">
            <Timer value={this.state.value} seconds={this.state.seconds} leaveSession={this.leaveSession}/>
          </div>
        </div>
      </div>
    );
    }else{
      return (
        <div>
          <div className="row">
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <TimerInput value={this.props.minutosRestantes} handleChange={this.handleChange} />
              <Timer value={this.props.minutosRestantes} seconds={this.state.seconds} leaveSession={this.leaveSession}/>
              <StartButton startCountDown={this.startCountDown} value={this.props.minutosRestantes} />
              <button className="btn btn-lg btn-success" onClick={this.leaveSession}>sALIR sesión</button>                                                        
            </div>
          </div>
        </div>
      );
    }
  }
}

