import React, { PureComponent } from "react";
import { Button } from "antd";

export default class Bar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isShow } = this.props;
    return (
      // drawMarker
      // drawCanvasMarker点击地图放置一个地表
      <div style={{ marginTop: 20, textAlign: "center", display: `${isShow}` }}>
        <Button>demo</Button>
      </div>
    );
  }
}
