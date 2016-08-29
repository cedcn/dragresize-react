import React, { PropTypes, Component } from 'react';
import S_S_ from './dragresize.less';

import { getScopeValue, getltValue, computeAttr } from './util';
let m_x; // 鼠标点击时X轴的位置
let m_y; // 鼠标点击时Y轴的位置
let w; // 鼠标点击时BOX的宽度
let h; // 鼠标点击时BOX的高度
let x; // 鼠标点击时BOX的X轴坐标
let y; // 鼠标点击时BOX的Y轴坐标
let seat = '';  // 角标

class Dragresize extends Component {
  constructor(props) {
    super(props);
    const { elmX, elmY, elmW, elmH } = this.props;
    this.state = { elmX, elmY, elmW, elmH };

    this.mouseDown = e => {
      if (e.button !== 0 || !this.props.isDrag) return;
      e.stopPropagation();
      this.cacheMoustDownAttrs(e);
      document.addEventListener('mousemove', this.mouseMove);
      if (this.props.onMouseDown) this.props.onMouseDown();
    };

    this.mouseMove = e => {
      e.preventDefault();
      const tempX = this.limitDragScopeX(x + (e.pageX - m_x));
      const tempY = this.limitDragScopeY(y + (e.pageY - m_y));
      this.setState({ elmX: tempX, elmY: tempY });

      document.addEventListener('mouseup', this.mouseUp);
      if (this.props.onMouseMove) this.props.onMouseMove({ elmX: tempX, elmY: tempY });
    };

    this.mouseUp = () => {
      document.removeEventListener('mousemove', this.mouseMove);
      document.removeEventListener('mousemove', this.moveResize);
    };

    //
    this.resizeHandle = s => {
      if (!this.props.isResize) return;
      return e => {
        e.stopPropagation();
        seat = s;
        this.cacheMoustDownAttrs(e);
        document.addEventListener('mousemove', this.moveResize);
      };
    };

    this.moveResize = e => {
      e.preventDefault();
      const { isRatio } = this.props;
      const ratio = h / w;

      let ax = x;
      let ay = y;
      let bx = x + w;
      let cy = y + h;
      let diffX = 0;
      let diffY = 0;
      // set attribute of this dragbox
      switch (seat) {
        case 'br':
          diffX = m_x - (x + w);
          diffY = m_y - (y + h);
          if (e.pageX - diffX >= x) {
            bx = e.pageX - diffX;
          } else {
            bx = x;
            // ax = e.pageX;
          }

          if (e.pageY - diffY >= y) {
            cy = e.pageY - diffY;
          } else {
            cy = y;
            // ay = e.pageY;
          }

          if (isRatio) {
            const bxmm = this.limitScope({ ax, ay, bx, cy }).bx;
            cy = ay + (bxmm - ax) * ratio;
            const cymm = this.limitScope({ ax, ay, bx, cy }).cy;
            bx = (cymm - ay) / ratio + ax;
          }
          break;
        case 'tl':
          diffX = m_x - x;
          diffY = m_y - y;
          if (e.pageX - diffX <= x + w) {
            ax = e.pageX - diffX;
          } else {
            ax = x + w;
            // bx = e.pageX;
          }

          if (e.pageY - diffY <= y + h) {
            ay = e.pageY - diffY;
          } else {
            ay = y + h;
            // cy = e.pageY;
          }

          if (isRatio) {
            const axmm = this.limitScope({ ax, ay, bx, cy }).ax;
            ay = cy - (bx - axmm) * ratio;
            const aymm = this.limitScope({ ax, ay, bx, cy }).ay;
            ax = bx - (cy - aymm) / ratio;
          }
          break;
        case 'tr':
          diffX = m_x - (x + w);
          diffY = m_y - y;
          if (e.pageX - diffX >= x) {
            bx = e.pageX - diffX;
          } else {
            bx = x;
            // ax = e.pageX;
          }

          if (e.pageY - diffY <= y + h) {
            ay = e.pageY - diffY;
          } else {
            ay = y + h;
            // cy = e.pageY;
          }

          if (isRatio) {
            const bxmm = this.limitScope({ ax, ay, bx, cy }).bx;
            ay = cy - (bxmm - ax) * ratio;
            const aymm = this.limitScope({ ax, ay, bx, cy }).ay;
            bx = (cy - aymm) / ratio + ax;
          }
          break;
        case 'bl':
          diffX = m_x - x;
          diffY = m_y - (y + h);
          if (e.pageX - diffX <= x + w) {
            ax = e.pageX - diffX;
          } else {
            ax = x + w;
            // bx = e.pageX;
          }

          if (e.pageY - diffY >= y) {
            cy = e.pageY - diffY;
          } else {
            cy = y;
            // ay = e.pageY;
          }
          if (isRatio) {
            const axmm = this.limitScope({ ax, ay, bx, cy }).ax;
            cy = ay + (bx - axmm) * ratio;
            const cymm = this.limitScope({ ax, ay, bx, cy }).cy;
            ax = bx - (cymm - ay) / ratio;
          }
          break;
      }
      const attr = computeAttr(this.limitScope({ ax, ay, bx, cy }));
      this.setState(attr);
      if (this.props.onResize) this.props.onResize(attr);
    };
  }


  componentDidMount() {
    document.addEventListener('mouseup', this.mouseUp);
  }

  componentWillReceiveProps(nextProps) {
    const { elmX, elmY, elmW, elmH } = nextProps;
    this.setState({ elmX, elmY, elmW, elmH });
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.mouseUp);
  }

  // 缓存拖动或缩放之前的状态
  cacheMoustDownAttrs(e) {
    m_x = e.pageX;
    m_y = e.pageY;
    x = this.state.elmX;
    y = this.state.elmY;
    w = this.state.elmW;
    h = this.state.elmH;
  }

  // 限制拖拽范围
  limitDragScopeX(value) {
    const { maxLeft, minLeft } = this.props;
    const max = maxLeft !== null ? maxLeft - w : null;
    const min = minLeft;
    return getScopeValue(value, max, min);
  }

  limitDragScopeY(value) {
    const { maxTop, minTop } = this.props;
    const max = maxTop !== null ? maxTop - h : null;
    const min = minTop;
    return getScopeValue(value, max, min);
  }

  // 限制缩放范围
  limitScope({ ax, ay, bx, cy }) {
    const { maxLeft, minLeft, maxTop, minTop } = this.props;
    const { minWidth, minHeight, maxWidth, maxHeight } = this.props;

    const ax_max = minWidth !== null ? (x + w) - minWidth : x + w;
    const ax_min = maxWidth !== null ? (x + w) - maxWidth : minLeft;

    const ay_max = minHeight !== null ? (y + h) - minHeight : y + h;
    const ay_min = maxHeight !== null ? (y + h) - maxHeight : minTop;

    const bx_max = maxWidth !== null ? getltValue(maxLeft, x + maxWidth) : maxLeft;
    const bx_min = minWidth !== null ? x + minWidth : x;

    const cy_max = maxHeight !== null ? getltValue(maxTop, y + maxHeight) : maxTop;
    const cy_min = minHeight !== null ? y + minHeight : y;

    return {
      ax: getScopeValue(ax, ax_max, ax_min),
      ay: getScopeValue(ay, ay_max, ay_min),
      bx: getScopeValue(bx, bx_max, bx_min),
      cy: getScopeValue(cy, cy_max, cy_min),
    };
  }

  render() {
    const { isChecked } = this.props;
    const { elmX, elmY, elmW, elmH } = this.state;
    const isResize = (this.props.isResize && isChecked) || false;
    const style = {
      left: elmX,
      top: elmY,
      width: elmW,
      height: elmH,
    };

    const handleList = isResize ? (
      <div className={S_S_.handle_list}>
        <div className={`${S_S_.handle_btn} ${S_S_.handle_tl}`} onMouseDown={this.resizeHandle('tl')} />
        <div className={`${S_S_.handle_btn} ${S_S_.handle_tr}`} onMouseDown={this.resizeHandle('tr')} />
        <div className={`${S_S_.handle_btn} ${S_S_.handle_bl}`} onMouseDown={this.resizeHandle('bl')} />
        <div className={`${S_S_.handle_btn} ${S_S_.handle_br}`} onMouseDown={this.resizeHandle('br')} />
      </div>
    ) : null;

    const borderList = isChecked ? (
      <div>
        <div className={`${S_S_.border_line} ${S_S_.border_top}`} />
        <div className={`${S_S_.border_line} ${S_S_.border_left}`} />
        <div className={`${S_S_.border_line} ${S_S_.border_right}`} />
        <div className={`${S_S_.border_line} ${S_S_.border_bottom}`} />
      </div>
    ) : null;

    return (
      <div
        className={S_S_.dragresize_wrapper}
        style={style}
        onMouseDown={this.mouseDown}
      >
        <div className={S_S_.content}>
          {this.props.children}
        </div>
        {handleList}
        {borderList}
      </div>
    );
  }
}

Dragresize.propTypes = {
  children: PropTypes.element,
  elmX: PropTypes.number.isRequired,
  elmY: PropTypes.number.isRequired,
  elmW: PropTypes.number.isRequired,
  elmH: PropTypes.number.isRequired,
  isDrag: PropTypes.bool,
  isRatio: PropTypes.bool,
  isResize: PropTypes.bool,
  isChecked: PropTypes.bool,
  minLeft: React.PropTypes.number,
  minTop: React.PropTypes.number,
  maxLeft: React.PropTypes.number,
  maxTop: React.PropTypes.number,
  minWidth: React.PropTypes.number,
  minHeight: React.PropTypes.number,
  maxWidth: React.PropTypes.number,
  maxHeight: React.PropTypes.number,
  onMouseMove: PropTypes.func,
  onResize: PropTypes.func,
  onMouseDown: PropTypes.func,
};

Dragresize.defaultProps = {
  elmX: 10,
  elmY: 10,
  elmW: 100,
  elmH: 150,
  isDrag: true,
  isResize: true,
  isRatio: true,
  isChecked: true,
  minLeft: null,
  minTop: null,
  maxLeft: 1000,
  maxTop: 600,
  minWidth: 10,
  minHeight: 10,
  maxWidth: null,
  maxHeight: null,
  onMouseMove: null,
  onResize: null,
  onMouseDown: null,
};

export default Dragresize;
