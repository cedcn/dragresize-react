import React, { PropTypes, Component } from 'react';
import S_S_ from './dragresize.less';

const getRealValue = (value, max_value, min_value) => {
  if (max_value !== false && value > max_value) {
    return max_value;
  } else if (min_value !== false && value < min_value) {
    return min_value;
  }

  return value;
};

const getltValue = (v1, v2) => {
  if (v1 && v2) {
    return v1 <= v2 ? v1 : v2;
  } else if (!v1 && v2) {
    return v2;
  } else if (v1 && !v2) {
    return v1;
  }

  return false;
};


class Dragresize extends Component {
  constructor(props) {
    super(props);
    let m_x = 0; // 鼠标点击时X轴的位置
    let m_y = 0; // 鼠标点击时Y轴的位置
    let w = 0; // 鼠标点击时BOX的宽度
    let h = 0; // 鼠标点击时BOX的高度
    let x = 0; // 鼠标点击时BOX的X轴坐标
    let y = 0; // 鼠标点击时BOX的Y轴坐标
    let seat = '';  // 角标

    this.state = {
      elmX:
    }
    // 缓存拖动或缩放之前的状态
    this.cacheMoustDownAttrs = e => {
      m_x = e.pageX;
      m_y = e.pageY;
      x = this.refs.dragresize_wrapper.offsetLeft;
      y = this.refs.dragresize_wrapper.offsetTop;
      w = this.refs.dragresize_wrapper.offsetWidth;
      h = this.refs.dragresize_wrapper.offsetHeight;
    };

    // 限制拖拽范围
    this.limitDragScopeX = value => {
      const { maxLeft, minLeft, islimitScope } = this.props;
      let max_value = maxLeft - w;
      let min_value = minLeft;
      if (!islimitScope) {
        max_value = false;
        min_value = false;
      }
      return getRealValue(value, max_value, min_value);
    };

    this.limitDragScopeY = value => {
      const { maxTop, minTop, islimitScope } = this.props;
      let max_value = maxTop - h;
      let min_value = minTop;
      if (!islimitScope) {
        max_value = false;
        min_value = false;
      }
      return getRealValue(value, max_value, min_value);
    };

    // 限制缩放X的位置
    this.limitResizeScopeX = value => {
      const { minLeft, minWidth, islimitScope } = this.props;
      const max_value = (x + w) - minWidth;
      let min_value = minLeft;
      if (!islimitScope) {
        min_value = false;
      }
      return getRealValue(value, max_value, min_value);
    };

    // 限制缩放Y的位置
    this.limitResizeScopeY = value => {
      const { minHeight, minTop, islimitScope } = this.props;
      const max_value = (y + h) - minHeight;
      let min_value = minTop;
      if (!islimitScope) {
        min_value = false;
      }
      return getRealValue(value, max_value, min_value);
    };

    // 限制宽度
    this.limitResizeScopeW_r = value => {
      const { maxLeft, minWidth = 10, maxWidth, islimitScope } = this.props;
      let max_value = getltValue(maxLeft - x, maxWidth);
      const min_value = minWidth;
      if (!islimitScope) {
        max_value = maxWidth;
      }
      return getRealValue(value, max_value, min_value);
    };

    this.limitResizeScopeW_l = value => {
      const { minWidth, maxWidth } = this.props;
      const max_value = getltValue((x + w) - minWidth, maxWidth);
      const min_value = minWidth;
      return getRealValue(value, max_value, min_value);
    };
    // 限制高度
    this.limitResizeScopeH_t = value => {
      const { minHeight, maxHeight } = this.props;
      const max_value = getltValue((y + h) - minHeight, maxHeight);
      const min_value = minHeight;
      return getRealValue(value, max_value, min_value);
    };
    this.limitResizeScopeH_b = value => {
      const { maxTop, minHeight, maxHeight, islimitScope } = this.props;
      let max_value = getltValue(maxTop - y, maxHeight);
      const min_value = minHeight;
      if (!islimitScope) {
        max_value = maxHeight;
      }
      return getRealValue(value, max_value, min_value);
    };

    this.mouseDown = e => {
      if (e.button !== 0) return;
      e.stopPropagation();
      this.cacheMoustDownAttrs(e);
      document.addEventListener('mousemove', this.mouseMove);
      if (this.props.onMouseDown) this.props.onMouseDown();
    };

    this.mouseMove = e => {
      e.preventDefault();
      const tempX = x + (e.pageX - m_x);
      const tempY = y + (e.pageY - m_y);

      document.addEventListener('mouseup', this.mouseUp);
      if (this.props.onMouseMove) this.props.onMouseMove({ elmX: tempX, elmY: tempY });
    };

    this.mouseUp = () => {
      document.removeEventListener('mousemove', this.mouseMove);
      document.removeEventListener('mousemove', this.moveResize);
    };

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
      const { isRatio = false } = this.props;
      const ratio = h / w;
      let tempW = w, tempH = h, tempX = x, tempY = y;
      // set attribute of this dragbox
      switch (seat) {
        case 'br':
          tempW = this.limitResizeScopeW_r(w + (e.pageX - m_x));
          tempH = this.limitResizeScopeH_b(h + (e.pageY - m_y));
          if (isRatio) {
            tempH = this.limitResizeScopeH_b(tempW * ratio);
            tempW = this.limitResizeScopeW_r(tempH / ratio);
          }
          break;
        case 'tl':
          tempX = this.limitResizeScopeX(e.pageX - (m_x - x));
          tempY = this.limitResizeScopeY(e.pageY - (m_y - y));
          if (isRatio) {
            tempX = this.limitResizeScopeX(x - ((y - tempY) / ratio));
            tempY = this.limitResizeScopeY(y - ((x - tempX) * ratio));
          }
          tempW = (w + x) - tempX;
          tempH = (h + y) - tempY;
          break;
        case 'tr':
          tempY = this.limitResizeScopeY(e.pageY - (m_y - y));
          tempW = this.limitResizeScopeW_r(w + (e.pageX - m_x));
          tempH = (h + y) - tempY;
          if (isRatio) {
            tempH = tempW * ratio;
            tempY = this.limitResizeScopeY(y - (tempH - h));
            tempW = this.limitResizeScopeW_r(((y - tempY) + h) / ratio);
            tempH = tempW * ratio;
          }
          break;
        case 'bl':
          tempX = this.limitResizeScopeX(e.pageX - (m_x - x));
          tempW = (w + x) - tempX;
          tempH = this.limitResizeScopeH_b(h + (e.pageY - m_y));
          if (isRatio) {
            tempH = this.limitResizeScopeH_b(tempW * ratio, tempY);
            tempW = tempH / ratio;
            tempX = this.limitResizeScopeX(x - (tempW - w));
          }
          break;
      }
      if (this.props.onResizeHandle) this.props.onResizeHandle({ elmX: tempX, elmY: tempY, elmW: tempW, elmH: tempH });
    };
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.mouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.mouseUp);
  }

  render() {
    const { elmX, elmY, elmW, elmH, isChecked } = this.props;
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
        ref="dragresize_wrapper"
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
  minWidth: PropTypes.number,
  minHeight: PropTypes.number,
  maxWidth: PropTypes.number,
  maxHeight: PropTypes.number,
  minLeft: PropTypes.number,
  minTop: PropTypes.number,
  maxLeft: PropTypes.number,
  maxTop: PropTypes.number,
  isRatio: PropTypes.bool,
  isResize: PropTypes.bool,
  isChecked: PropTypes.bool,
  onMouseMove: PropTypes.func,
  onResizeHandle: PropTypes.func,
  onMouseDown: PropTypes.func,
  islimitScope: PropTypes.bool.isRequired,
};

Dragresize.defaultProps = {
  elmX: 10,
  elmY: 10,
  elmW: 150,
  elmH: 100,
  isDrag: true,
  isResize: true,
  isRatio: false,
  dragScope: {
    minLeft: null,
    minTop: null,
    maxLeft: null,
    maxTop: null,
  },
  sizeScope: {
    minWidth: null,
    minHeight: null,
    maxWidth: null,
    maxHeight: null,
  },
  onMouseMove: null,
  onResize: null,
  onMouseDown: null,
  isChecked: true,
};

export default Dragresize;
