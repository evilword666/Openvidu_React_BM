import React, { Component } from 'react';
import './NoRoom.css';
import Logo from './logo404.svg';
import LogoBM from './logo_bm_large.png';

export default class NoRoom extends Component{

render(){




return(
    <div>        
        


        

<div id="mensajenodisponible" class="message-box">
{/* <img id="logonodisponible" src='https://topmedic.com.mx/wp-content/uploads/2019/07/openvidu_vert_white_bg_trans_cropped.png' alt="TOP Consultorio" /> */}
<img id="logonodisponible" src={LogoBM} alt="TOP Consultorio" />
  <h1>La videoasistencia no puede realizarse</h1>
  <p>La cita solicitada no existe</p>
  <div class="buttons-con">
    <div class="action-link-wrap">      
      <a href='http://botonmedico.com' class='link-button'>Regresar al inicio</a>
    </div>
  </div>
</div>






    </div>
	)

}



}
