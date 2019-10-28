import React, { Component } from "react";
import "./App.css";
import Dragresize from "dragresize";

class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elmX: 450,
      elmY: 50,
      elmW: 150,
      elmH: 100,
      isChecked: true,
      isRatio: false,
      isDrag: true,
      isResize: true
    };

    this.change = e => {
      this.setState({ elmX: Number(e.target.value) });
    };
  }

  render() {
    return (
      <div className="example">
        <label htmlFor="x">修改X坐标:</label>
        <input
          id="x"
          type="text"
          onChange={this.change}
          value={this.state.elmX}
        />
        <div>X轴: {this.state.elmX}</div>
        <div>Y轴: {this.state.elmY}</div>
        <div>宽: {this.state.elmW}</div>
        <div>高: {this.state.elmH}</div>
        <a
          href="javascript:;"
          onClick={() => this.setState({ isChecked: !this.state.isChecked })}
        >
          {!this.state.isChecked ? "Checked" : "No Checked"}
        </a>
        |
        <a
          href="javascript:;"
          onClick={() => this.setState({ isRatio: !this.state.isRatio })}
        >
          {!this.state.isRatio ? "按比例缩放" : "取消比例缩放"}
        </a>
        |
        <a
          href="javascript:;"
          onClick={() => this.setState({ isDrag: !this.state.isDrag })}
        >
          {!this.state.isDrag ? "可拖拽" : "禁止拖拽"}
        </a>
        |
        <a
          href="javascript:;"
          onClick={() => this.setState({ isResize: !this.state.isResize })}
        >
          {!this.state.isResize ? "可缩放" : "禁止缩放"}
        </a>
        <Dragresize
          elmX={this.state.elmX}
          elmY={this.state.elmY}
          elmW={this.state.elmW}
          elmH={this.state.elmH}
          isChecked={this.state.isChecked}
          isRatio={this.state.isRatio}
          isDrag={this.state.isDrag}
          isResize={this.state.isResize}
          minLeft={150}
          minTop={50}
          onMouseMove={({ elmX, elmY }) => {
            this.setState({ elmX, elmY });
          }}
          onResize={({ elmX, elmY, elmW, elmH }) => {
            this.setState({ elmX, elmY, elmW, elmH });
          }}
        />
      </div>
    );
  }
}

export default Example;
