import React, { Component } from 'react';
import './ToolbarComponent.css';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconExpediente from './exp_icon_g.png';
import IconHB from './hb_icon.png';
import Demo from './ModalExpediente2';
import Actualizar from './update.png';
import LogoBM from './logo_bm_large.png';


//import Expediente from '@material-ui/icon/Assignment';

import Mic from '@material-ui/icons/Mic';
import MicOff from '@material-ui/icons/MicOff';
import Videocam from '@material-ui/icons/Videocam';
import VideocamOff from '@material-ui/icons/VideocamOff';
import Fullscreen from '@material-ui/icons/Fullscreen';
import FullscreenExit from '@material-ui/icons/FullscreenExit';
import PictureInPicture from '@material-ui/icons/PictureInPicture';
import ScreenShare from '@material-ui/icons/ScreenShare';
import StopScreenShare from '@material-ui/icons/StopScreenShare';
import Tooltip from '@material-ui/core/Tooltip';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import QuestionAnswer from '@material-ui/icons/QuestionAnswer';

import IconButton from '@material-ui/core/IconButton';

export default class ToolbarComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { fullscreen: false, platformType:2 };
        this.camStatusChanged = this.camStatusChanged.bind(this);
        this.micStatusChanged = this.micStatusChanged.bind(this);
        this.screenShare = this.screenShare.bind(this);
        this.stopScreenShare = this.stopScreenShare.bind(this);
        this.toggleFullscreen = this.toggleFullscreen.bind(this);
        this.leaveSession = this.leaveSession.bind(this);
        this.toggleChat = this.toggleChat.bind(this);
	this.abrirHealthBox = this.abrirHealthBox.bind(this);
	this.isMovilOrWeb = this.isMovilOrWeb.bind(this);
    }


    micStatusChanged() {
        this.props.micStatusChanged();
    }

    camStatusChanged() {
        this.props.camStatusChanged();
    }

    screenShare() {
        this.props.screenShare();
    }

    stopScreenShare() {
        this.props.stopScreenShare();
    }

    toggleFullscreen() {
        this.setState({ fullscreen: !this.state.fullscreen });
        this.props.toggleFullscreen();
    }

    leaveSession() {
        this.props.leaveSession();
    }

    toggleChat() {
        this.props.toggleChat();
    }

  componentDidMount(){

let tipoEntorno = this.isMovilOrWeb()
//alert("Entorno default: "+this.state.platformType)

setTimeout(() => {

this.setState({platformType : tipoEntorno})
//this.setState({ platformType: this.isMovilOrWeb() })
//alert(this.state.platformType)

}, 1000);


//this.setState({platformType : "3"})
//this.setState({ platformType: this.isMovilOrWeb() })
//alert(this.state.platformType)

/*
	if(this.isMovilOrWeb() == 1){//Plataforma movil
	    alert("Estoy en una plataforma movil!")
	}else{
	    alert("Estoy en una plataforma web!")
	}
*/


  }





    abrirHealthBox(){
//      alert("Yo voy a abrir el app HB")
	//window.open("dispositivos://" , "_blank") //to open new page      
//	window.open("dispositivos://" , "_blank",  'location=yes')

	 window.open("intencion://email="+localStorage.getItem("correo")+"" , "_blank",  'location=yes');

    }

    abrirLinkSaul(){
//        window.open('https://www.google.com/', '_system', 'location=yes'); 
//	window.open("dispositivos://" , "_blank",  'location=yes')
 window.open("http://93.104.215.239/fire/AgendaBM_Notifications/openHB.html" , "_blank",  'location=yes');
    }

    abrirExpediente(){
      alert("Yo voy a abrir el formulario del expediente")
    }

isMovilOrWeb = () => {
  
	var device = navigator.userAgent

	if (device.match(/Iphone/i)|| device.match(/Ipod/i)|| device.match(/Android/i)|| device.match(/J2ME/i)|| device.match(/BlackBerry/i)|| device.match(/iPhone|iPad|iPod/i)|| device.match(/Opera Mini/i)|| device.match(/IEMobile/i)|| device.match(/Mobile/i)|| device.match(/Windows Phone/i)|| device.match(/windows mobile/i)|| device.match(/windows ce/i)|| device.match(/webOS/i)|| device.match(/palm/i)|| device.match(/bada/i)|| device.match(/series60/i)|| device.match(/nokia/i)|| device.match(/symbian/i)|| device.match(/HTC/i))
	{
	  //alert("Estoy dentro de un navegador en un dispositivo movil")
	  //Con esto haremos que sea visible en dispositivos moviles pero no los de endoscopio o estetoscopio
	  return 1
	}
	else{
	  //alert("Estoy dentro de un navegador web")
	  return 0//0
	}


};

refreshPage=()=>{ 
    window.location.reload(); 
}

    render() {
        const mySessionId = this.props.sessionId;
        const localUser = this.props.user;
        return (
            <AppBar className="toolbar" id="header">
                <Toolbar className="toolbar">
                    <div id="navSessionInfo">
                        <img
                            id="header_img"
                            alt="Topmedical Logo"
                            //src="https://raw.githubusercontent.com/OpenVidu/openvidu-call/master/front/openvidu-call/src/assets/images/openvidu_logo.png"
//                            src="http://www.botonmedico.com/wp-content/uploads/2018/04/BOTONMEDICO.png"
                            //src="http://medicos.botonmedico.com/wp-content/uploads/2019/03/logo.png"
                            //src="https://topmedic.com.mx/wp-content/uploads/2019/04/logo-blanco.png"
			    src={LogoBM}
                        />

                        {this.props.sessionId && <div id="titleContent">
                            <span id="session-title" Style="Display:none;">{mySessionId}</span>
                        </div>}


                    </div>

                    <div className="buttonsContent">
{/*
recordar que para quitar los comentario hay que tambien quitar  las llaves
                        <IconButton color="inherit" className="navButton" id="navIconExpediente" onClick={this.abrirExpediente}>
                           <img id="exp" src={IconExpediente} alt="icono_expediente"/>
                        </IconButton>

                        <IconButton color="inherit" className="navButton" id="navIconHB" onClick={this.abrirHealthBox}>
                           <img id="exp" src={IconHB} alt="icono_HB"/>
                        </IconButton>


                        <IconButton color="inherit" className="navButton" id="navIconHB">
			   <a href="dispositivos://" id="linkDispositivos"><img id="exp" src={IconHB} alt="icono_HB"/></a>
                        </IconButton>


			<a href="#" onclick="window.open('dispositivos://', '_system', 'location=yes');" >Google</a>
*/}
                        <IconButton  className="" id="navIconHB" onClick={ this.refreshPage }>
                           <img id="exp" src={Actualizar} alt="icono_HB"/>
                        </IconButton>


                        <IconButton  className="navButton" id="navIconHB"  onClick={ this.abrirHealthBox } hidden={this.state.platformType == 0 ?  true : false}>
                           <img id="exp" src={IconHB} alt="icono_HB"/>
                        </IconButton>



{/*
                        <IconButton color="inherit" className="navButton" id="navIconHB" onClick={this.abrirLinkSaul}>
                           <img id="exp" src={IconHB} alt="icono_HB"/>
                        </IconButton>

                        <IconButton color="inherit" className="navButton" id="navIconHB" onClick={this.abrirHealthBox}>
                           <img id="exp" src={IconHB} alt="icono_HB"/>
                        </IconButton>

*/}
                        <IconButton color="inherit" className="navButton" id="navMicButton" onClick={this.micStatusChanged}>
                            {localUser !== undefined && localUser.isAudioActive() ? <Mic /> : <MicOff color="secondary" />}
                        </IconButton>

                        <IconButton color="inherit" className="navButton" id="navCamButton" onClick={this.camStatusChanged}>
                            {localUser !== undefined && localUser.isVideoActive() ? (
                                <Videocam />
                            ) : (
                                <VideocamOff color="secondary" />
                            )}
                        </IconButton>

                        {localUser !== undefined &&
                            localUser.isScreenShareActive()/* && (
                                <IconButton onClick={this.stopScreenShare} id="navScreenButton">
                                    <StopScreenShare color="secondary" />
                                </IconButton>
                            )
                         */
                        }

                        <IconButton color="inherit" className="navButton" onClick={this.toggleFullscreen}>
                            {localUser !== undefined && this.state.fullscreen ? <FullscreenExit /> : <Fullscreen />}
                        </IconButton>
                        <IconButton color="secondary" className="navButton" onClick={this.leaveSession} id="navLeaveButton">
                            <PowerSettingsNew />
                        </IconButton>
                         

                    </div>
                </Toolbar>
            </AppBar>
        );
    }
}
