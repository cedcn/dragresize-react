export const getScopeValue = (value, max, min) => {
  if (max !== null && value >= max) {
    return max;
  } else if (min !== null && value <= min) {
    return min;
  }
  return value;
};

export const getLtValue = (...args) => {
  return args.reduce((pre, cur) => {
    if (cur === null) return pre;
    return Math.min(pre, cur);
  }, 10000000);
};

export const computeAttr = ({ ax, ay, bx, cy }) => {
  return {
    elmX: ax,
    elmY: ay,
    elmW: bx - ax,
    elmH: cy - ay,
  };
};
