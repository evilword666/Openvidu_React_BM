import React, { Component } from 'react';
import axios from 'axios';
import './VideoRoomComponent.css';
import { OpenVidu } from 'openvidu-browser';
import StreamComponent from './stream/StreamComponent';
import DialogExtensionComponent from './dialog-extension/DialogExtension';
import ChatComponent from './chat/ChatComponent';

import OpenViduLayout from '../layout/openvidu-layout';
import UserModel from '../models/user-model';
import ToolbarComponent from './toolbar/ToolbarComponent';
import Cronometro from './Cronometro/Cronometro';
import TemporizadorApp from './temporizador/Temporizador';




var localUser = new UserModel();

class VideoRoomComponent extends Component {
    constructor(props) {
        super(props);
        //alert(window.location.hostname)
        this.OPENVIDU_SERVER_URL = this.props.openviduServerUrl
            ? this.props.openviduServerUrl
            : 'https://' + window.location.hostname + ':4443'; //Aqui toma la direccion URL del servidor donde se encuentra alojado, en este caso topmeddr.com
        this.OPENVIDU_SERVER_SECRET = this.props.openviduSecret ? this.props.openviduSecret : 'MY_SECRET';
        this.hasBeenUpdated = false;
        this.layout = new OpenViduLayout();
        let URL_React = window.location.href; //Obtener parametros de URL
        let separado = URL_React.split("/");
        /*
        alert("room: "+separado[3])
        alert("usuario: "+separado[4])
        alert(URL_React)
        */
        let roomNameXD = separado[3];
        //let userNameXD = separado[4];


        //let sessionName = this.props.sessionName ? this.props.sessionName : 'SessionXD';
        //let userName = this.props.user ? this.props.user : 'BM_User_' + Math.floor(Math.random() * 100);
        

        //let sessionName = this.props.sessionName ? this.props.sessionName : this.props.datosVideoAsistencia.nombre_room;
        let sessionName = this.props.datosVideoAsistencia.token; //Importate pues si no se pone no se puede conectar con otras rooms por ejemplo las creadas con ionic
        let userName = "";
        if(this.props.datosVideoAsistencia.tipoUsuario == 'p'){        
            userName = this.props.user ? this.props.user : this.props.datosVideoAsistencia.nombre_paciente;
        }else if(this.props.datosVideoAsistencia.tipoUsuario == 'd'){
            userName = this.props.user ? this.props.user : this.props.datosVideoAsistencia.nombre_medico;
        }
        
	let id_paciente = this.props.datosVideoAsistencia.id_paciente;
	localStorage.setItem("correo",id_paciente)
///1539713050
//alert( localStorage.getItem("correo"))


        this.state = {
            mySessionId: sessionName,
            myUserName: userName,
            session: undefined,
            localUser: undefined,
            subscribers: [],
            chatDisplay: 'none',
            minutosRestantes: ''
        };

        this.joinSession = this.joinSession.bind(this);
        this.leaveSession = this.leaveSession.bind(this);
        this.onbeforeunload = this.onbeforeunload.bind(this);
        this.updateLayout = this.updateLayout.bind(this);
        this.camStatusChanged = this.camStatusChanged.bind(this);
        this.micStatusChanged = this.micStatusChanged.bind(this);
        this.nicknameChanged = this.nicknameChanged.bind(this);
        this.toggleFullscreen = this.toggleFullscreen.bind(this);
        this.screenShare = this.screenShare.bind(this);
        this.stopScreenShare = this.stopScreenShare.bind(this);
        this.closeDialogExtension = this.closeDialogExtension.bind(this);
        this.toggleChat = this.toggleChat.bind(this);
        this.checkNotification = this.checkNotification.bind(this);
        this.checkSize = this.checkSize.bind(this);

        //this.updateStatusDBopenViduTopMedical('finalizada')
        //this.updateStatusDBopenViduTopMedical('en_progreso')
        this.updateStatusDBopenViduTopMedical('en_espera')
    }


updateStatusDBopenViduTopMedical=(updateStatus)=>{    
/*
//Descomentar el codigo para insertar estado en la base de datos
        console.log("Entrando a updateStatusDBopenViduTopMedical")
     //var actualizacion = "https://msg.botonmedico.com/fire/AgendaBM_Notifications/updateStatusOpenViduBD.php?status="+updateStatus+"&token="+this.props.datosVideoAsistencia.token;
     var actualizacion = "https://topmedic.com.mx/accessDatabase/wp_DB/service/updateStatusOpenViduBD.php?status="+updateStatus+"&token="+this.props.datosVideoAsistencia.token;

     console.log(actualizacion)
     fetch(actualizacion)
       .then(res =>{
        //console.log(res)
        //alert(JSON.stringify(res))
            return res.json()
       })
       
       .then(datos=>{
        console.log(datos.respuesta)
        //console.log("Resultado datos: "+JSON.stringify(datos)) 
        if(datos.respuesta == '200'){
            console.log("La Actualizacion del status se ejecuto correctamente")
        }else if(datos.respuesta == '400'){
            console.log("No se pudo realizar la actualizacion del status en la BD")
        }
               
       }) 
*/            
}

obtenerMinutosRestantes=()=>{
//let horaFinal = ("08:00:00").split(":"),
//    horaInicial = ("07:40:00").split(":"),

let horaFinal = this.props.datosVideoAsistencia.hora_final.split(":"),
    horaActual = this.props.datosVideoAsistencia.hora_actual.split(":"),
    t1 = new Date(),
    t2 = new Date();


    //alert(horaFinal)
    //alert(horaActual)

	t1.setHours(horaFinal[0], horaFinal[1], horaFinal[2]);
	t2.setHours(horaActual[0], horaActual[1], horaActual[2]);
 
	//Aquí hago la resta
	t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes(), t1.getSeconds() - t2.getSeconds());
	 let restantesMin = t1.getMinutes()

//alert("Minutos restantes 1: "+restantesMin)

     this.setState({
        minutosRestantes:restantesMin
     })


     

}

componentWillMount(){  
    this.obtenerMinutosRestantes()
}

    componentDidMount() {

        const openViduLayoutOptions = {
            maxRatio: 3 / 2, // The narrowest ratio that will be used (default 2x3)
            minRatio: 9 / 16, // The widest ratio that will be used (default 16x9)
            fixedRatio: false, // If this is true then the aspect ratio of the video is maintained and minRatio and maxRatio are ignored (default false)
            bigClass: 'OV_big', // The class to add to elements that should be sized bigger
            bigPercentage: 0.8, // The maximum percentage of space the big ones should take up
            bigFixedRatio: false, // fixedRatio for the big ones
            bigMaxRatio: 3 / 2, // The narrowest ratio to use for the big elements (default 2x3)
            bigMinRatio: 9 / 16, // The widest ratio to use for the big elements (default 16x9)
            bigFirst: true, // Whether to place the big one in the top left (true) or bottom right
            animate: true, // Whether you want to animate the transitions

            //history.replaceState(null,null,'hello')
        };

        this.layout.initLayoutContainer(document.getElementById('layout'), openViduLayoutOptions);
        window.addEventListener('beforeunload', this.onbeforeunload);
        window.addEventListener('resize', this.updateLayout);
        window.addEventListener('resize', this.checkSize);
        this.joinSession();
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.onbeforeunload);
        window.removeEventListener('resize', this.updateLayout);
        window.removeEventListener('resize', this.checkSize);
        this.leaveSession();
    }

    onbeforeunload(event) {
        this.leaveSession();
    }

    joinSession() {
        this.OV = new OpenVidu();

        this.setState(
            {
                session: this.OV.initSession(),
            },
            () => {
                this.subscribeToStreamCreated();

                this.connectToSession();
            },
        );
    }

    connectToSession() {
        if (this.props.token !== undefined) {
            console.log('token received: ', this.props.token);
            this.connect(this.props.token);
        } else {
            this.getToken().then((token) => {
                console.log(token);
                this.connect(token);
            }).catch((error) => {
                if(this.props.error){
                    this.props.error({ error: error.error, messgae: error.message, code: error.code, status: error.status });
                }
                console.log('There was an error getting the token:', error.code, error.message);
                alert('There was an error getting the token:', error.message);
              });
        }
    }

    connect(token) {
        this.state.session
            .connect(
                token,
                { clientData: this.state.myUserName },
            )
            .then(() => {
                this.connectWebCam();
            })
            .catch((error) => {
                if(this.props.error){
                    this.props.error({ error: error.error, messgae: error.message, code: error.code, status: error.status });
                }
                alert('There was an error connecting to the session:', error.message);
                console.log('There was an error connecting to the session:', error.code, error.message);
            });
    }

    connectWebCam() {
        let publisher = this.OV.initPublisher(undefined, {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: localUser.isAudioActive(),
            publishVideo: localUser.isVideoActive(),
            resolution: '640x480',
            frameRate: 30,
            insertMode: 'APPEND',
        });

        if (this.state.session.capabilities.publish) {
            this.state.session.publish(publisher).then(() => {
                if (this.props.joinSession) {
                    this.props.joinSession();
                }
            });
        }
        localUser.setNickname(this.state.myUserName);
        localUser.setConnectionId(this.state.session.connection.connectionId);
        localUser.setScreenShareActive(false);
        localUser.setStreamManager(publisher);
        this.subscribeToUserChanged();
        this.subscribeToStreamDestroyed();
        this.sendSignalUserChanged({ isScreenShareActive: localUser.isScreenShareActive() });

        this.setState({ localUser: localUser }, () => {
            this.state.localUser.getStreamManager().on('streamPlaying', (e) => {
                this.updateLayout();
                publisher.videos[0].video.parentElement.classList.remove('custom-class');
            });
        });
    }

    leaveSession() {
        const mySession = this.state.session;

        if (mySession) {
            mySession.disconnect();
        }

        // Empty all properties...
        this.OV = null;
        this.setState({
            session: undefined,
            subscribers: [],
            mySessionId: ' ',
            myUserName: ' ',
            localUser: undefined,
        });
        if (this.props.leaveSession) {
            this.props.leaveSession();
        }
    }
    camStatusChanged() {
        localUser.setVideoActive(!localUser.isVideoActive());
        localUser.getStreamManager().publishVideo(localUser.isVideoActive());
        this.sendSignalUserChanged({ isVideoActive: localUser.isVideoActive() });
        this.setState({ localUser: localUser });
    }

    micStatusChanged() {
        localUser.setAudioActive(!localUser.isAudioActive());
        localUser.getStreamManager().publishAudio(localUser.isAudioActive());
        this.sendSignalUserChanged({ isAudioActive: localUser.isAudioActive() });
        this.setState({ localUser: localUser });
    }

    nicknameChanged(nickname) {
        let localUser = this.state.localUser;
        localUser.setNickname(nickname);
        this.setState({ localUser: localUser });
        this.sendSignalUserChanged({ nickname: this.state.localUser.getNickname() });
    }

    deleteSubscriber(stream) {
        const remoteUsers = this.state.subscribers;
        console.log(remoteUsers)
        const userStream = remoteUsers.filter((user) => user.getStreamManager().stream === stream)[0];
        let index = remoteUsers.indexOf(userStream, 0);
        if (index > -1) {
            remoteUsers.splice(index, 1);
            this.setState({
                subscribers: remoteUsers,
            });
        }
        console.log("Se han salido todos los usuarios")
        this.updateStatusDBopenViduTopMedical('en_espera')
    }

    subscribeToStreamCreated() {
        this.state.session.on('streamCreated', (event) => {
            const subscriber = this.state.session.subscribe(event.stream, undefined);
            var subscribers = this.state.subscribers;
            subscriber.on('streamPlaying', (e) => {
                this.checkSomeoneShareScreen();
                subscriber.videos[0].video.parentElement.classList.remove('custom-class');
            });
            const newUser = new UserModel();
            newUser.setStreamManager(subscriber);
            newUser.setConnectionId(event.stream.connection.connectionId);
            newUser.setType('remote');
            const nickname = event.stream.connection.data.split('%')[0];
            newUser.setNickname(JSON.parse(nickname).clientData);
            subscribers.push(newUser);
            this.setState(
                {
                    subscribers: subscribers,
                },
                () => {
                    if (this.state.localUser) {
                        this.sendSignalUserChanged({
                            isAudioActive: this.state.localUser.isAudioActive(),
                            isVideoActive: this.state.localUser.isVideoActive(),
                            nickname: this.state.localUser.getNickname(),
                            isScreenShareActive: this.state.localUser.isScreenShareActive(),
                        });
                    }
                    this.updateLayout();
                },
            );
        });
    }

    subscribeToStreamDestroyed() {
        // On every Stream destroyed...
        this.state.session.on('streamDestroyed', (event) => {
            // Remove the stream from 'subscribers' array
            this.deleteSubscriber(event.stream);
            setTimeout(() => {
                this.checkSomeoneShareScreen();
            }, 20);
            event.preventDefault();
            this.updateLayout();
        });
    }

    subscribeToUserChanged() {
        this.state.session.on('signal:userChanged', (event) => {
            let remoteUsers = this.state.subscribers;
            remoteUsers.forEach((user) => {
                if (user.getConnectionId() === event.from.connectionId) {
                    const data = JSON.parse(event.data);
                    console.log('EVENTO REMOTE: ', event.data);
                    if (data.isAudioActive !== undefined) {
                        user.setAudioActive(data.isAudioActive);
                    }
                    if (data.isVideoActive !== undefined) {
                        user.setVideoActive(data.isVideoActive);
                    }
                    if (data.nickname !== undefined) {
                        user.setNickname(data.nickname);
                    }
                    if (data.isScreenShareActive !== undefined) {
                        user.setScreenShareActive(data.isScreenShareActive);
                    }
                    console.log("Conectando un usuario remoto")
                    //this.updateStatusDBopenViduTopMedical('en_progreso')
                }
            });
            this.setState(
                {
                    subscribers: remoteUsers,
                },
                () => this.checkSomeoneShareScreen(),
            );
        });
    }

    updateLayout() {
        setTimeout(() => {
            this.layout.updateLayout();
        }, 20);
    }

    sendSignalUserChanged(data) {
        const signalOptions = {
            data: JSON.stringify(data),
            type: 'userChanged',
        };
        this.state.session.signal(signalOptions);
    }

    toggleFullscreen() {
        const document = window.document;
        const fs = document.getElementById('container');
        if (
            !document.fullscreenElement &&
            !document.mozFullScreenElement &&
            !document.webkitFullscreenElement &&
            !document.msFullscreenElement
        ) {
            if (fs.requestFullscreen) {
                fs.requestFullscreen();
            } else if (fs.msRequestFullscreen) {
                fs.msRequestFullscreen();
            } else if (fs.mozRequestFullScreen) {
                fs.mozRequestFullScreen();
            } else if (fs.webkitRequestFullscreen) {
                fs.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }

    screenShare() {
        const videoSource = navigator.userAgent.indexOf('Firefox') !== -1 ? 'window' : 'screen';
        const publisher = this.OV.initPublisher(
            undefined,
            {
                videoSource: videoSource,
                publishAudio: localUser.isAudioActive(),
                publishVideo: localUser.isVideoActive(),
                mirror: false,
            },
            (error) => {
                if (error && error.name === 'SCREEN_EXTENSION_NOT_INSTALLED') {
                    this.setState({ showExtensionDialog: true });
                } else if (error && error.name === 'SCREEN_SHARING_NOT_SUPPORTED') {
                    alert('Your browser does not support screen sharing');
                } else if (error && error.name === 'SCREEN_EXTENSION_DISABLED') {
                    alert('You need to enable screen sharing extension');
                } else if (error && error.name === 'SCREEN_CAPTURE_DENIED') {
                    alert('You need to choose a window or application to share');
                }
            },
        );

        publisher.once('accessAllowed', () => {
            this.state.session.unpublish(localUser.getStreamManager());
            localUser.setStreamManager(publisher);
            this.state.session.publish(localUser.getStreamManager()).then(() => {
                localUser.setScreenShareActive(true);
                this.setState({ localUser: localUser }, () => {
                    this.sendSignalUserChanged({ isScreenShareActive: localUser.isScreenShareActive() });
                });
            });
        });
        publisher.on('streamPlaying', () => {
            this.updateLayout();
            publisher.videos[0].video.parentElement.classList.remove('custom-class');
        });
    }

    closeDialogExtension() {
        this.setState({ showExtensionDialog: false });
    }

    stopScreenShare() {
        this.state.session.unpublish(localUser.getStreamManager());
        this.connectWebCam();
    }

    checkSomeoneShareScreen() {
        let isScreenShared;
        // return true if at least one passes the test
        isScreenShared = this.state.subscribers.some((user) => user.isScreenShareActive()) || localUser.isScreenShareActive();
        const openviduLayoutOptions = {
            maxRatio: 3 / 2,
            minRatio: 9 / 16,
            fixedRatio: isScreenShared,
            bigClass: 'OV_big',
            bigPercentage: 0.8,
            bigFixedRatio: false,
            bigMaxRatio: 3 / 2,
            bigMinRatio: 9 / 16,
            bigFirst: true,
            animate: true,
        };
        this.layout.setLayoutOptions(openviduLayoutOptions);
        this.updateLayout();
    }

    toggleChat(property) {
        let display = property;

        if (display === undefined) {
            display = this.state.chatDisplay === 'none' ? 'block' : 'none';
        }
        if (display === 'block') {
            this.setState({ chatDisplay: display, messageReceived: false });
        } else {
            console.log('chat', display);
            this.setState({ chatDisplay: display });
        }
        this.updateLayout();
    }

    checkNotification(event) {
        this.setState({
            messageReceived: this.state.chatDisplay === 'none',
        });
    }
    checkSize() {
        if (document.getElementById('layout').offsetWidth <= 700 && !this.hasBeenUpdated) {
            this.toggleChat('none');
            this.hasBeenUpdated = true;
        }
        if (document.getElementById('layout').offsetWidth > 700 && this.hasBeenUpdated) {
            this.hasBeenUpdated = false;
        }
    }



    render() {
        const mySessionId = this.state.mySessionId;
        const localUser = this.state.localUser;
        var chatDisplay = { display: this.state.chatDisplay };

        //leaveSession()
        let min = localStorage.getItem("minutosTemporizador") 
        let seg = localStorage.getItem("segundosTemporizador")         
        console.log(min+":"+seg)

        return (
            <div className="container" id="container">
                <ToolbarComponent
                    sessionId={mySessionId}
                    user={localUser}
                    showNotification={this.state.messageReceived}
                    camStatusChanged={this.camStatusChanged}
                    micStatusChanged={this.micStatusChanged}
                    screenShare={this.screenShare}
                    stopScreenShare={this.stopScreenShare}
                    toggleFullscreen={this.toggleFullscreen}
                    leaveSession={this.leaveSession}
                    toggleChat={this.toggleChat}
                />

                <DialogExtensionComponent showDialog={this.state.showExtensionDialog} cancelClicked={this.closeDialogExtension} />

                <div id="layout" className="bounds">
                    {localUser !== undefined && localUser.getStreamManager() !== undefined && (
                        <div className="OT_root OT_publisher custom-class" id="localUser">
                            <StreamComponent user={localUser} handleNickname={this.nicknameChanged} />
                        </div>
                    )}
                    {this.state.subscribers.map((sub, i) => (
                        

                        <div key={i} className="OT_root OT_publisher custom-class" id="remoteUsers">
                        
                 
                                         <TemporizadorApp
                         minutosRestantes = {this.state.minutosRestantes}
                         leaveSession={this.leaveSession}

                     />
                 
                     

                            <StreamComponent user={sub} streamId={sub.streamManager.stream.streamId} />
                        </div>
                        
                    ))}
                    {localUser !== undefined && localUser.getStreamManager() !== undefined && (
                        <div className="OT_root OT_publisher custom-class" style={chatDisplay}>
                            <ChatComponent
                                user={localUser}
                                chatDisplay={this.state.chatDisplay}
                                close={this.toggleChat}
                                messageReceived={this.checkNotification}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    /**
     * --------------------------
     * SERVER-SIDE RESPONSIBILITY
     * --------------------------
     * These methods retrieve the mandatory user token from OpenVidu Server.
     * This behaviour MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
     * the API REST, openvidu-java-client or openvidu-node-client):
     *   1) Initialize a session in OpenVidu Server	(POST /api/sessions)
     *   2) Generate a token in OpenVidu Server		(POST /api/tokens)
     *   3) The token must be consumed in Session.connect() method
     */

    getToken() {
        return this.createSession(this.state.mySessionId).then((sessionId) => this.createToken(sessionId));
    }

    createSession(sessionId) {
        return new Promise((resolve, reject) => {
            var data = JSON.stringify({ customSessionId: sessionId });
            axios
                .post(this.OPENVIDU_SERVER_URL + '/api/sessions', data, {
                    headers: {
                        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + this.OPENVIDU_SERVER_SECRET),
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    console.log('CREATE SESION', response);
                    resolve(response.data.id);
                })
                .catch((response) => {
                    var error = Object.assign({}, response);
                    if (error.response && error.response.status === 409) {
                        resolve(sessionId);
                    } else {
                        console.log(error);
                        console.warn(
                            'No connection to OpenVidu Server. This may be a certificate error at ' + this.OPENVIDU_SERVER_URL,
                        );
                        if (
                            window.confirm(
                                'No connection to OpenVidu Server. This may be a certificate error at "' +
                                    this.OPENVIDU_SERVER_URL +
                                    '"\n\nClick OK to navigate and accept it. ' +
                                    'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                                    this.OPENVIDU_SERVER_URL +
                                    '"',
                            )
                        ) {
                            window.location.assign(this.OPENVIDU_SERVER_URL + '/accept-certificate');
                        }
                    }
                });
        });
    }

    createToken(sessionId) {
        return new Promise((resolve, reject) => {
            var data = JSON.stringify({ session: sessionId });
            axios
                .post(this.OPENVIDU_SERVER_URL + '/api/tokens', data, {
                    headers: {
                        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + this.OPENVIDU_SERVER_SECRET),
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    console.log('TOKEN', response);
                    resolve(response.data.token);
                })
                .catch((error) => reject(error));
        });
    }
}
export default VideoRoomComponent;
