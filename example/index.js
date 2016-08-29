import React, { Component } from 'react';
import { render } from 'react-dom';
import Dragresize from '../src/Dragresize';

class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elmX: 150,
      elmY: 10,
      elmW: 150,
      elmH: 100,
      isChecked: false,
    };

    this.change = (e) => {
      this.setState({ elmX: Number(e.target.value) });
    };
  }

  render() {
    return (
      <div className="example">
        <input type="text" onChange={this.change} value={this.state.elmX} />
        <div>X: { this.state.elmX }</div>
        <div>Y: { this.state.elmY }</div>
        <div>W: { this.state.elmW }</div>
        <div>H: { this.state.elmH }</div>
        <a href="javascript:;" onClick={() => this.setState({ isChecked: !this.state.isChecked })}>
          {!this.state.isChecked ? '选中' : '取消'}
        </a>
        <Dragresize
          elmX={this.state.elmX}
          elmY={this.state.elmY}
          elmW={this.state.elmW}
          elmH={this.state.elmH}
          isChecked={this.state.isChecked}
          isRatio={false}
          minLeft={150}
          onMouseMove={({ elmX, elmY }) => { this.setState({ elmX, elmY }); }}
          onResize={({ elmX, elmY, elmW, elmH }) => { this.setState({ elmX, elmY, elmW, elmH }); }}
        />
      </div>
    );
  }
}

render(
  <Example />,
  document.getElementById('dragresize')
);
