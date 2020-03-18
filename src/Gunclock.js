import React, { Component } from 'react';
import {getGunClock} from './GunClock.draw';
import {myenvironment} from './myenvironments/myenvironment';

//const GUNCLOCK_API = 'https://gunclock-api-express.herokuapp.com/gunclock';
const GUNCLOCK_API = myenvironment.GUNCLOCK_API;

export default class Gunclock extends Component {

  getGunclocksREST() {
    fetch(
      GUNCLOCK_API,
      {
        mode: 'cors'
      }
    )
    .then((response) => {
      return response.json();
    })
    .then((response_json) => {
      console.log(response_json);

      this.setState({
        gunclocks: response_json.gunclocks,
        gunclock_id : '',
        gunclock_size: '',
        gunclock_color: '',
        gunclock_string : '',
      });

    });
  }

  createGunclockREST(gunclock_size, gunclock_color) {

    var inputData = {
      size: gunclock_size,
      color: gunclock_color
    }

    fetch(
      GUNCLOCK_API,
      {
        method: 'post',
        mode: 'cors',
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(inputData)
      }
    )
    .then((response) => {
      return response.json();
    })
    .then((response_json) => {
      console.log(response_json);
      this.getGunclocksREST();
    });
  }

  updateGunclockREST(id) {
    const { gunclock_size, gunclock_color } = this.state;

    console.log("updateGunclockREST(): started.");

    var inputData = {
      size: gunclock_size,
      color: gunclock_color
    }

    fetch(
      GUNCLOCK_API + "/" + id,
      {
        method: 'put',
        mode: 'cors',
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(inputData)
      }
    )
    .then((response) => {
      return response.json();
    })
    .then((response_json) => {
      console.log(response_json);
      this.getGunclocksREST();

      this.setState({
        gunclock_id : '',
        gunclock_size : '',
        gunclock_color : '',
        gunclock_string : '',
        updateFlag : false
      });

    });
  }

  showGunclockREST(id) {

    fetch(
      GUNCLOCK_API + "/" + id,
      {
        method: 'get',
        mode: 'cors',
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    )
    .then((response) => {
      return response.json();
    })
    .then((response_json) => {
      console.log(response_json);
      var gunclock_string = getGunClock(response_json.gunclock.size);
      this.setState({
        gunclock_id: response_json.gunclock._id,
        gunclock_size: response_json.gunclock.size,
        gunclock_color: response_json.gunclock.color,
        gunclock_string: gunclock_string,
        showFlag: true,
        updateFlag: false
      });
//      this.getGunclocksREST();
    });
  }

  deleteGunclockREST(id) {

    fetch(
      GUNCLOCK_API + "/" + id,
      {
        method: 'delete',
        mode: 'cors',
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    )
    .then((response) => {
      return response.json();
    })
    .then((response_json) => {
      console.log(response_json);
      this.getGunclocksREST();
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      gunclocks: [],
      gunclock_id: '',
      gunclock_size: '',
      gunclock_color: '',
      gunclock_string: '',
      updateFlag: false,
      showFlag: false
    };

    this.getGunclocksREST();

  }

  onInputSize = (e) => {
    this.setState({
      gunclock_size: e.target.value
    });
  }
  onInputColor = (e) => {
    this.setState({
      gunclock_color: e.target.value
    });
  }

  addGunclock = () => {
    const { gunclock_size, gunclock_color } = this.state;
    console.log("gunclock_size" + gunclock_size + ", gunclock_color" + gunclock_color);
    this.createGunclockREST(gunclock_size, gunclock_color);
//    gunclocks.push(gunclock)
//    this.setState({
//      gunclocks: gunclocks
//    });
  }

  updateGunclock = (id, size, color) => {
    console.log("updateGunclock(): started.");
//    const { gunclocks } = this.state;
    this.setState({
      gunclock_id : id,
      gunclock_size : size,
      gunclock_color : color,
      showFlag : false,
      updateFlag : true
    });
  }

  removeGunclock = (index) => {
    const { gunclocks } = this.state;
    delete gunclocks[index];
    this.setState({
      gunclocks: gunclocks 
    });
  }

  render() {
    console.log("render(): started.");
    const { gunclocks, gunclock_id, gunclock_size, gunclock_color, gunclock_string } = this.state;

    return (
    <div>
     <div
      className="update"
      style={{display: (this.state.updateFlag+this.state.showFlag) ? 'none': ''}}
     >

      <table border="1" cellSpacing="0" cellpading="0">
       <thead>
        <tr>
        <th align="left">id</th>
        <th align="right">size</th>
        <th align="left">color</th>
        <th></th>
        <th></th>
        <th></th>
        </tr>
       </thead>
       <tbody>
        {gunclocks.map((gunclock, index) => 
         <tr key={index}>
         <td align="left">{gunclock._id}</td>
         <td align="right">{gunclock.size}</td>
         <td align="left" bgcolor={gunclock.color}>{gunclock.color}</td>
         <td>
          <button onClick={ () => { this.showGunclockREST(gunclock._id) }}>表示</button>
         </td>
         <td>
          <button onClick={ () => { this.updateGunclock(gunclock._id, gunclock.size, gunclock.color) }}>更新</button>
         </td>
         <td>
          <button onClick={ () => { this.deleteGunclockREST(gunclock._id) }}>削除</button>
         </td>
         </tr>)
        }
       </tbody>
      </table>

      <br />

      size:
      <input type="text" onInput={this.onInputSize}/>
      color:
      <input type="text" onInput={this.onInputColor}/>
      <button onClick={this.addGunclock}>登録</button>

     </div>

     <div
      className="update"
      style={{display: this.state.updateFlag? '': 'none'}}
     >
      id:
      {gunclock_id}<br/>

      size:
      <input type="text" value={gunclock_size} onChange={this.onInputSize}/>
      color:
      <input type="text" value={gunclock_color} onChange={this.onInputColor}/>
      <button onClick={() => {this.updateGunclockREST(gunclock_id)}}>更新</button>

      <br />
      <a href="/">戻る</a>
     </div>

     <div
      className="show"
      style={{display: this.state.showFlag? '': 'none'}}
     >

      <table border="1" cellSpacing="0" cellpading="0">
       <thead>
        <tr>
        <th align="left">id</th>
        <th align="right">size</th>
        <th align="left">color</th>
        <th></th>
        <th></th>
        <th></th>
        </tr>
       </thead>
       <tbody>
        <tr>
         <td align="left">{gunclock_id}</td>
         <td align="right">{gunclock_size}</td>
         <td align="left" bgcolor={gunclock_color}>{gunclock_color}</td>
         <td>
          <button onClick={ () => { this.showGunclockREST(gunclock_id) }}>表示</button>
         </td>
         <td>
          <button onClick={ () => { this.updateGunclock(gunclock_id, gunclock_size, gunclock_color) }}>更新</button>
         </td>
         <td>
          <button onClick={ () => { this.deleteGunclockREST(gunclock_id) }}>削除</button>
         </td>
        </tr>
       </tbody>
      </table>

      <br />

      <table>
      <tbody>
      <tr><td bgcolor={gunclock_color}>
      <pre>{gunclock_string}</pre>
      </td></tr>
      </tbody>
      </table>

      <br />
      <a href="/">戻る</a>
     </div>

    </div>
    );
  }

}
