import React, { Component } from 'react';

export default class Gunclock extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gunclocks: [],
      gunclock: ''
    };
  }

  onInput = (e) => {
    this.setState({
      gunclock: e.target.value
    });
  }
  addGunclock = () => {
    const { gunclocks, gunclock } = this.state;
    gunclocks.push(gunclock)
    this.setState({
      gunclocks: gunclocks
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
    const { gunclocks } = this.state;

    return (
     <div>
      <input type="text" onInput={this.onInput}/>
      <button onClick={this.addGunclock}>登録</button>
      <ul>
        {gunclocks.map((gunclock, index) => 
         <li key={index}>
          {gunclock}
          <button onClick={ () => { this.removeGunclock(index) }}>削除</button>
         </li>)
        }
      </ul>
     </div>
    );
  }

}
