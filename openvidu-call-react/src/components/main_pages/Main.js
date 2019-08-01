import React, { Component } from 'react';
import VideoRoomComponent from '../VideoRoomComponent';
import Finalizado from './Finalizado';
import NoRoom from './NoRoom';
import EnCurso from './EnCurso';
import FueraDeTiempo from './FueraDeTiempo';


export default class Main extends Component{



    state = {
    	isLoading:true,
    	resultado:{}
    }

    addZero=(i)=>{
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    }

    obtenerHora=()=>{
      var d = new Date();
      //var x = document.getElementById("demo");
      var h = this.addZero(d.getHours());
      var m = this.addZero(d.getMinutes());
      var s = this.addZero(d.getSeconds());
      var hora = h + ":" + m + ":" + s;
      //x.innerHTML = h + ":" + m + ":" + s;
      //console.log(hora)

/*
        this.setState({
          horaActual:hora
        })  
        */

      return hora;


    }



    obtenerFecha=()=>{

	    var today = new Date();
        var dd = today.getDate();

        var mm = today.getMonth()+1; 
        var yyyy = today.getFullYear();
        if(dd<10) 
        {
            dd='0'+dd;
        } 
 
        if(mm<10) 
        {
            mm='0'+mm;
        } 


        let fecha = yyyy+'-'+mm+'-'+dd;
        console.log(fecha);

        let  horaString = this.obtenerHora()
        console.log(horaString)

        let fullDate = fecha+" "+horaString

        //this.consultarFechaActual(fullDate,fecha, horaString)  
        this.getTokenFromURL(fecha, horaString)      
    }


getTokenFromURL=(fechaS,horaS)=>{
	let URL_React = window.location.href; //Obtener parametros de URL
	let separado = URL_React.split("/");
	let tipoUsuario = separado[4]

	console.log("room: "+separado[3])
	
	//alert(URL_React)
//	 fetch("https://msg.botonmedico.com/fire/AgendaBM_Notifications/verificarTokenOpenVidu.php?token="+separado[3]+"&fecha_consulta_link="+fechaS+"&hora_consulta_link="+horaS)
fetch("https://topmedic.com.mx/accessDatabase/wp_DB/service/verificarTokenOpenVidu.php?token="+separado[3]+"&fecha_consulta_link="+fechaS+"&hora_consulta_link="+horaS)
   
	 //fetch("https://msg.botonmedico.com/fire/AgendaBM_Notifications/homenoti.php")
	 //fetch("https://jsonplaceholder.typicode.com/posts")
	   .then(res =>{
	   	//console.log(res)
	   	//alert(JSON.stringify(res))
        	return res.json()
	   })
	   
	   .then(datos=>{
	   	//console.log(datos.respuesta)
	   	datos.tipoUsuario=tipoUsuario;
	   	console.log(datos)

        this.setState({
        	resultado:datos
        })	   	
	   	
	   })       
}


componentWillMount(){   

    this.obtenerFecha()
    //this.getTokenFromURL()


}


render(){



        let res = this.state.resultado;
        let resultado;

	   	if(res.respuesta==200){
          console.log("Esta dentro del horario permitido");  
          resultado = <VideoRoomComponent
                          datosVideoAsistencia={res}
                      />;

	   	}else if(res.respuesta==300){
          console.log("Ya existe una videoasistencia en curso");
          resultado = <EnCurso/>

	   	}else if(res.respuesta==400){
          console.log("La videoasistencia ha terminado");       
          resultado = <Finalizado/>

	   	}else if(res.respuesta==404){
          console.log("Error, No hay un room valido");       
          resultado = <NoRoom/>

	   	}else if(res.respuesta==500){
          console.log("Error, Session fuera de tiempo");       
          resultado = <FueraDeTiempo/>

	   	}


return(
    
        <div>
           {resultado}
        </div>

	)

}



}
