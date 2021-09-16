import * as React from "react";
import axios from "axios";

import styles from "./ServerStatus.module.scss"
import serverOff from '../assets/pc-off.png';
import serverOn from '../assets/pc-on.gif';

import classNames from 'classnames';

class ServerStatus extends React.Component {
    timerID: number | undefined;
    constructor(props) {
      super(props);
        this.state = {
            date: new Date(),
            data: [],
            isRunning: [true,true,true,true],
        };

        this.handleClick = this.handleClick.bind(this);
    }
  
    componentDidMount() {
      this.timerID = setInterval(
        () => this.loadServers(),
        5000
      );
    this.loadServers()
    }
  
    componentWillUnmount() {
      clearInterval(this.timerID);
    }
  
    handleClick = i => {
      this.setState ( state =>{
        console.log(state.isRunning);
        const isRunning = state.isRunning.map((server,j)=>{
          if (j===i){
            return !server;
          }else{
            return server;
          }
        });
        return {isRunning};

      })
    }

    loadServers() {

        const allServersData = async () => {

            let serversStatus: Array<object>;
            serversStatus=[];
        
            let serverObject = {
                id: String,
                load: Number,
                isRunning: Boolean,
            }

            let one = "http://localhost:8000/status/1"
            let two = "http://localhost:8000/status/2"
            let three = "http://localhost:8000/status/3"
            let four = "http://localhost:8000/status/4"
            
            const requestOne = axios.get(one);
            const requestTwo = axios.get(two);
            const requestThree = axios.get(three);
            const requestFour = axios.get(four);

            const serversRun = this.state.isRunning;
        
            await axios
            .all([requestOne, requestTwo, requestThree, requestFour])
            .then(
            axios.spread((...responses) => {
                const stateResponse = responses;
                for (let i = 0; i< responses.length; i++){
                    serverObject = {
                        "id": stateResponse[i].data.id,
                        "load": stateResponse[i].data.load,
                        "isRunning": serversRun[i], 
                    }
                    serversStatus.push(serverObject);
                }
                this.setState({
                    data: serversStatus,
                });

            })
            )
            .catch(errors => {
              console.error(errors);
            });
            
        }
        allServersData();

        
    }
  
    render() {
      return (
          <div className={styles.loaderWrapper}>
            {this.state.data.map( (server, index) =>
                <div className={classNames(styles.server, 'window')} key={ index }>
                    <div className="title-bar">
                        <div className="title-bar-text">Server#{server.id}</div>
                    </div>
                    <div className="window-body">
                        <img className={styles.serverImage} src={server.isRunning ? serverOn : serverOff} />
                    </div>
                    <div className={classNames(styles.statusBar, 'status-bar')}>
                        {server.isRunning ?
                        <>
                          <p className={classNames(styles.statusOn, 'status-bar-field')}>Status: ON</p>
                          <p className={classNames(styles.button, 'status-bar-field')} onClick={()=>this.handleClick(index)}>Shut down</p>
                          <p className={classNames(styles.loadIndicator, 'status-bar-field', `${(server.load > 80) ? styles.overload : styles.normalLoad}`)}>CPU Usage: {server.load}%</p>
                        </>
                          : 
                        <>
                          <p className={classNames(styles.statusOff, 'status-bar-field')}>Status: OFF</p>
                          <p className={classNames(styles.button, 'status-bar-field')} onClick={()=>this.handleClick(index)}>Turn on</p>
                          <p className={classNames(styles.loadIndicator, 'status-bar-field')}>CPU Usage: 0%</p>
                        </>
                        }
                    </div>
                </div>
            )}
          </div>
      );
    }
  }
  
  export default ServerStatus;

