import React, { Component, Fragment } from "react";
import { Button } from "antd";
import styles from "./Map.css";
import { loadMap } from "../../pages/map";
import Bar from "../../pages/Bar";
import { connect } from "dva";
import language from "../language/language";

@connect(({ fodder, language }) => ({ fodder, language }))
export default class Map extends Component {
  constructor() {
    super();
    this.state = {
      isShow: "none"
    };
  }

  componentDidMount() {
    //loadMap(盛放地图的容器的id)
    this.map = loadMap("map");
    // 渲染地图的时候传入一个经纬度在地图上标示一个点
    // this.map.editPolyline();
    //editPolyline 渲染地图的时候根据多个经纬度的标识，绘制地标并且连成轨迹
  }

  //简单的刷新机制，写一个点击事件让render再执行一次
  setMap = () => {
    // this.setState({
    //   isShow:'block',
    // })
  };

  UNSAFE_componentWillReceiveProps(nextprops) {
    if (nextprops.fodder.loadMap === "clear") {
      this.map.removeAll();
    } else {
      this.map.editPolygon();
      this.map.addDashedPolyline();
    }
  }

  render() {
    //由于componentDidMount在render之后执行，所以在render里面会获取不到map对象
    let { fodder } = this.props;

    const map = this.map || {};
    const { isShow } = this.state;
    const ii = isShow === "none" ? "block" : "none";
    return (
      <div>
        <div id="map" style={{ height: "650px" }} />
        {/* <div>
          <Button onClick={map.addCanvasMarker}>画点</Button>
          <Button onClick={map.editPolyline}>画线</Button>
          <Button onClick={map.editPolygon}>画多边形</Button>
          <Button onClick={map.drawMarker}>画飞机</Button>
          <Button onClick={map.removeAll}>清除全部</Button>
          <Button onClick={map.addDashedPolyline}>画虚线</Button>
          <Button onClick={map.addMarker}>移动的对象</Button>
        </div> */}
      </div>
    );
  }
}
