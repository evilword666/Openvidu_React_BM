import React, { Component } from 'react';
import './NoRoom.css';
import logo from './clock2.png';


export default class Finalizado extends Component{

render(){

return(
	<div>   

    
    <div class="image-box">
       <img src={logo} width="30%" height="30%" alt="logo"/>
    </div>



<div class="message-box">
  <h2>La videasistencia no puede realizarse</h2>
  <h3>Por favor, verifique su hora de cita</h3>  
  <p>Si esta seguro que tiene una cita asignada para este horario por favor contacte al departamento de soporte técnico para dar solucion a su problema</p>          

  <div class="buttons-con">
    <div class="action-link-wrap">      
      <a href='http://topmedic.com.mx/' class='link-button'>Ir al inicio</a>
    </div>
  </div>
</div>


       
    </div>
	)

}



}
