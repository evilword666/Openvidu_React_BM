import React, { Component } from 'react';
import './NoRoom.css';
import logo from './clock2.png';


export default class Finalizado extends Component{

render(){

return(
  <div>
	<div id="mensajenodisponible">

    
    <div class="image-box">
    <img id="logonodisponible" src='https://topmedic.com.mx/wp-content/uploads/2019/07/openvidu_vert_white_bg_trans_cropped.png' alt="TOP Consultorio" />
       
    </div>



<div class="message-box">
  <h2>La videasistencia no puede realizarse</h2>
  <img id="reloj" src={logo} alt="logo"/>
  <h3 class="txtreloj">Por favor, verifique su hora de cita</h3>  
  <p>Si tenía una cita asignada para este horario, por favor contacte al departamento de soporte técnico para dar solucion a su problema</p>          

  <div class="buttons-con">
    <div class="action-link-wrap">      
      <a href='http://topmedic.com.mx/' class='link-button'>Ir al inicio</a>
    </div>
  </div>
</div>


       
    </div></div>
	)

}



}
