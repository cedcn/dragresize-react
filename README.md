#dragresize
A ReactJS component to render a dragresize layer.
##Installation
Install dragresize with [npm](https://www.npmjs.com/):

```
$ npm install dragresize --save
```

For [CommonJS](http://wiki.commonjs.org/wiki/CommonJS) users:

```javascript
import Dragresize from 'dragresize';
```

##Example
Run:
```console
$ npm install; npm start
```
##Props

| Name | Type | default | Description |
| --- | --- | --- | --- |
| `elmX` | `Number` | `10` | **Required.** The layer X axis. |
| `elmY` | `Number` | `10` | **Required.** The layer Y axis. |
| `elmW` | `Number` | `100` | **Required.** The layer width. |
| `elmH` | `Number ` | `150` | **Required.** The layer height. |
| `isDrag` | `Boolean` | `true` | 是否可拖拽. |
| `isResize` | `Boolean ` | `true` | 是否可缩放. |
| `isRatio` | `Boolean ` | `false` | 是否按比例缩放. |
| `isChecked` | `Boolean ` | `true` | 是否选择. |
| `minLeft` | `Number` | `null` | Drag Scope |
| `minTop` | `Number` | `null` | Drag Scope |
| `maxLeft` | `Number ` | `null` | Drag Scope |
| `maxTop` | `Number ` | `null` | Drag Scope |
| `minWidth` | `Number ` | `10` | Resize Scope |
| `minHeight` | `Number ` | `10` | Resize Scope |
| `maxWidth` | `Number ` | `null` | Resize Scope |
| `maxHeight` | `Number ` | `null` | Resize Scope |
| `onMouseDown ` | `Function` | `null` | MouseDown Callback |
| `onMouseMove` | `Function ` | `null` | MouseMove Callback |
| `onResize` | `Function ` | `null` | Resize Callback |
