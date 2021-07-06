import React, { PureComponent } from "react";
import { Button } from "antd";
import Map from "./index";

/**
 * admin:chenkr
 * data:2019.06
 *
 */
export default class GisIndex extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // 可以通过修改Map组件的代码来扩展更多props
    const props = {
      style: {width:1200, height: 500, position: "relative" },
      init: map => {
        this.map = map;
      },
      center: [24, 34],
      zoom: 3,
      extendMenus: []
    };
    return <Map {...props} />;
  }
}
