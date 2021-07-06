import React, { PureComponent } from 'react';
import Map from "./Map";

/**
 * admin:chenkr
 * data:2019.06
 */
export default class GisIndex extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // 可以通过修改Map组件的代码来扩展更多props
    const props = {
      // style: { height: 601, zIndex: 10 },
      style: { width:1200,height: 500, zIndex: 10},
      intl: map => { this.map = map },
      center: [24, 34],
      zoom: 3,
      extendMenus: [],
      ke: '0313036'
    }
    return (
      <Map key='0313036' {...props} />
    )
  }
}
