import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import { Popover, Menu } from "antd";
import Chart from "./Chart";
import styles from "./Map.less";
import { connect } from "dva";

const Icon = ({ type, ...rest }) => (
  <span className={`iconfont icon-${type}`} {...rest} /> // 依赖于public/iconfont
);
const { GMap } = window;
let map = null;
let gDrawHelper = null;
let _drawnItems = null;
let _drawController = null;

@connect(({ language, ElectronicTarget }) => ({ language, ElectronicTarget }))
export default class Map extends PureComponent {
  id = `map-${Date.now()}`;

  popId = `pop-${Date.now()}`;

  modes = {};

  state = {
    active: null,
    roam: false,
    visible: false,
    visibleStock: false,
    chartData: null,
    iSpin: false
  };

  componentDidMount() {
    this.initGisMap();
    //点击查看目标航迹态势图按钮调用的接口
    if (this.props.ElectronicTarget.selectPlaneLineBtnMark == 1) {
      this.props.dispatch({
        type: "ElectronicTarget/selectPlaneLine",
        callback: res => {
          this.addMarker(res.data);
        }
      });
    } else if (this.props.ElectronicTarget.selectPlaneLineBtnMark == 2) {
      //点击对比分析按钮调用的接口
      this.props.dispatch({
        type: "ElectronicTarget/handleCompareShowMap",
        payload: document.getElementById("objectName_radar").value,
        callback: res => {
          this.addMarker2(res.data);
        }
      });
    }
  }

  addMarker = data => {
    //查询航迹点信息，动态渲染地图
    let data1 = data;
    if (data1 && data1.length > 0 && data1[0].length > 0) {
      let arr = [];
      for (let i = 0; i < data1.length; i++) {
        arr[i] = [];
        for (let j = 0; j < data1[i].length; j++) {
          if (data1[i] && data1[i].length > 0) {
            arr[i].push([data1[i][j].latitude, data1[i][j].longitute]);
          }
        }
      }
      if (arr && arr.length > 0) {
        var polyline = GMap.polyline(arr, {
          //航迹点数据放到数组里可以同时绘制多条线
          color: "red",
          weight: 4,
          opacity: 0.6
        }).addTo(map);
        map.fitBounds(polyline.getBounds());
      }
    } else {
      return false;
    }
  };

  addMarker2 = data => {
    //查询航迹点信息，动态渲染地图
    let data2 = data;
    if (data2 && data2.length > 0 && data2[0].length > 0) {
      let data = data2;
      let arr1 = [];
      let zcdata = data[0];
      for (let i = 0; i < zcdata.length; i++) {
        arr1.push([zcdata[i].latitude, zcdata[i].longitute]);
      }
      let arr2 = [];
      data.splice(0, 1);
      let data1 = data2;
      for (let i = 0; i < data1.length; i++) {
        arr2[i] = [];
        for (let j = 0; j < data1[i].length; j++) {
          if (data1[i] && data1[i].length > 0) {
            arr2[i].push([data1[i][j].latitude, data1[i][j].longitute]);
          }
        }
      }
      if (arr1 && arr1.length > 0) {
        var polyline = GMap.polyline(arr1, {
          //航迹点数据放到数组里可以同时绘制多条线
          color: "blue",
          weight: 4,
          opacity: 0.6
        }).addTo(map);
        map.fitBounds(polyline.getBounds());
      }
      if (arr2 && arr2.length > 0) {
        var polyline = GMap.polyline(arr2, {
          //航迹点数据放到数组里可以同时绘制多条线
          color: "red",
          weight: 4,
          opacity: 0.6
        }).addTo(map);
        map.fitBounds(polyline.getBounds());
      }
    } else {
      return false;
    }
  };

  initGisMap = () => {
    const { center, zoom } = this.props;
    // 地图服务器的访问参数
    // const host = 'www.jinlutech.cn'; // 服务器地址
    // const port = '80'; // 服务器端口
    // const vector = 'vector'; // 矢量切片地图
    const host =
      typeof window.getUrl == "function"
        ? `${window.location.hostname}`
        : "www.jinlutech.cn"; // 服务器地址
    const port = typeof window.getUrl == "function" ? "6410" : "80"; // 服务器端口
    const vector = typeof window.getUrl == "function" ? "Lao_A" : "vector"; // 矢量切片地图
    if (GMap === undefined || GMap === null) {
      return 0;
    }
    map =
      typeof window.getUrl == "function"
        ? GMap.map(this.id, {
            center: center || [29.557156, 3.577026],
            zoom: zoom || 4,
            minZoom: 4,
            maxZoom: 13,
            crs: GMap.CRS.PGIS,
            maxBounds: [[-90, -180], [90, 180]],
            renderer: GMap.canvas(),
            zoomControl: false // 不启用底图自带的zoom控件
          })
        : GMap.map(this.id, {
            center: center || [29.557156, 3.577026],
            zoom: zoom || 4,
            minZoom: 1,
            maxZoom: 8,
            crs: GMap.CRS.Tianditu,
            maxBounds: [[-90, -180], [90, 180]],
            renderer: GMap.canvas(),
            zoomControl: false // 不启用底图自带的zoom控件
          });
    map.whenReady(() => {
      // 加载背景图层
      GMap.tileLayerQSImg(host, port, vector).addTo(map);
      this.loadPlugins();
      this.initJB();
    });

    const { init } = this.props;
    if (init) {
      init(map);
    }
    // 默认禁用漫游
    map.dragging.disable();
    this.drawItems = GMap.featureGroup().addTo(map);
  };

  loadPlugins = () => {
    GMap.pluginManager().load("draw", {
      done: () => {
        this.loadDrawPlugin();
      }
    });
    GMap.pluginManager().load("print", {
      done: () => {
        this.loadPrintPlugin();
      }
    });
    GMap.pluginManager().load("terrain", {
      done: () => {}
    });
  };

  loadPrintPlugin = () => {
    // 初始化打印控件对象
    this.printer = GMap.easyPrint({
      hidden: true, // 在地图上显示打印控件
      exportOnly: true, // 只通过图片下载方式获取打印内容
      filename: "地图打印",
      // 定义打印的大小：
      // Current 当前尺寸; A4Portrait 纵向打印； A4Landscape 横向打印
      sizeModes: ["Current", "A4Portrait", "A4Landscape"]
    }).addTo(map);
  };

  loadDrawPlugin = () => {
    if (_drawController != null) {
      return;
    }
    if (_drawnItems == null) {
      _drawnItems = GMap.featureGroup().addTo(map);
    }
    map.on(GMap.Draw.Event.CREATED, event => {
      const { layer } = event;
      const icon2 = layer.options.icon;
      if (icon2 != null) {
        gDrawHelper.addSymbolLayer(layer);
        gDrawHelper.addSymbolTextWithLine(
          layer,
          layer.options.icon.options.style
        );
        gDrawHelper.enableLabelClick(layer, true);
      }

      layer.on("click", e => {
        const { icon } = layer.options;
        if (icon == null) {
          // var keyid=layer.keyid;
          // alert(keyid+":线标");
        } else if (icon != null && icon.options != null) {
          const keyid1 = icon.options.keyid;
          gDrawHelper.showEditPage(0, keyid1, layer);
        }
      });
      // _drawnItems.addLayer(layer);
      layer.addTo(map);
      if (icon2 != null) {
        return;
      }
      this.drawItems.addLayer(layer);
      this.drawLineGetLength(layer);
    });
  };

  drawLineGetLength(layer) {
    const latLngs = layer.getLatLngs() || [];
    let distance = 0;
    if (latLngs.length === 0) {
      return;
    }
    latLngs.forEach((latLng, index) => {
      let divIcon;
      if (index === 0) {
        divIcon = GMap.divIcon({
          iconAnchor: [-5, -5],
          html: `<div class="${styles.marker}">起点</div>`
        });
      } else if (index === latLngs.length - 1) {
        distance += map.distance(latLng, latLngs[index - 1]);
        const id = `close-${Date.now()}`;
        divIcon = GMap.divIcon({
          iconAnchor: [-5, -5],
          html: `
                  <div class="${styles.endMarker}">
                    <span>总长:</span>
                    <span class="${styles.number}"> ${(distance / 1000).toFixed(
            2
          )} </span>km
                    <span class="${styles.bar}"></span>
                    <span id="${id}" class="${styles.close}">X</span>
                  </div>`
        });
        setTimeout(() => {
          document.getElementById(id).addEventListener("click", () => {
            this.handleClose();
          });
        }, 0);
      } else {
        distance += map.distance(latLng, latLngs[index - 1]);
        divIcon = GMap.divIcon({
          iconAnchor: [-5, -5],
          html: `<div class="${styles.marker}">${(distance / 1000).toFixed(
            2
          )}km</div>`
        });
      }
      const marker = GMap.marker(latLng, { icon: divIcon });
      const circleIcon = GMap.divIcon({
        iconAnchor: [6, 6],
        html: `<div class="${styles.circle}"></div>`
      });
      const circleMarker = GMap.marker(latLng, { icon: circleIcon });
      marker.addTo(map);
      circleMarker.addTo(map);
      this.drawItems.addLayer(marker);
      this.drawItems.addLayer(circleMarker);
    });
  }

  initJB = () => {
    if (gDrawHelper === null) {
      gDrawHelper = new DrawHelper("/plot/France_Symbol.ttf", map);
      var defSymobj = new DrawHelper.CgsSymbol({
        annoText: "C:106095754",
        annoDetailText: "C:106095754<br>TS:未知<br>GJDQ:未知<br>DOT:22.00",
        annoTextColor: "#ff0000",
        fill: "#ff0000",
        color: "#ff0000",
        strokeWidth: 1,
        width: 60,
        height: 60,
        anchor: "BOTTOM",
        anchorOffset: { x: 15, y: -16 },
        annoVisibility: true,
        annoTextSize: 3,
        annoTextOffset: { x: 60, y: -60 }
      });
      gDrawHelper.setDefStyle(defSymobj);
    }
  };

  openJB = () => {
    gDrawHelper.showSymbolPanel(50, 50);
  }; // y , x

  get menus() {
    const { extendMenus } = this.props;
    const menu = (
      <Menu selectedKeys={null}>
        <Menu.Item onClick={() => map.setZoom(2)}>1cm: 2000km</Menu.Item>
        <Menu.Item onClick={() => map.setZoom(5)}>1cm: 250km</Menu.Item>
        <Menu.Item onClick={() => map.setZoom(8)}>1cm: 16km</Menu.Item>
      </Menu>
    );
    return [
      { key: "zoom", icon: "zoom", title: menu },
      {
        key: "zoomIn",
        icon: "zoomIn",
        title: "放大",
        handleClick: this.handleZoomIn
      },
      {
        key: "zoomOut",
        icon: "zoomOut",
        title: "缩小",
        handleClick: this.handleZoomOut
      },
      {
        key: "roam",
        icon: "roam",
        title: "漫游",
        handleClick: this.handleRoam
      },
      {
        key: "home",
        icon: "home",
        title: "居中",
        handleClick: this.handleHome
      },
      // { key: 'distance', icon: 'distance', title: '测距', handleClick: this.handleDistance },
      // { key: 'visibility', icon: 'visibility', title: '通视', handleClick: this.handleVisibility },
      // { key: 'trim', icon: 'trim', title: '截图', handleClick: this.handleTrim },
      // { key: 'jb', icon: 'trim', title: '军标面板', handleClick: this.openJB },
      ...(extendMenus || [])
    ];
  }

  handleZoomOut = () => {
    const zoom = map.getZoom();
    map.setZoom(Math.max(zoom - 1, 1));
  };

  handleZoomIn = () => {
    const zoom = map.getZoom();
    map.setZoom(Math.min(zoom + 1, 20));
  };

  handleRoam = () => {
    this.modes.roam = this.modes.roam || {
      start: () => {
        map.dragging.enable();
      },
      stop: () => {
        map.dragging.disable();
      }
    };

    const { roam } = this.state;
    if (roam) {
      this.setState({ roam: false });
      this.modes.roam.stop();
    } else {
      this.setState({ roam: true });
      this.modes.roam.start();
      // if(active) this.modes[active].stop();
    }
  };

  handleHome = () => {
    const { center, zoom } = this.props;
    const CENTER = center || [29.557156, 106.577026];
    map.setView(window.GMap.latLng(...CENTER), zoom || 4);
  };

  handleDistance = () => {
    const { drawItems } = this;
    this.modes.distance = this.modes.distance || {
      drawer: new GMap.Draw.Polyline(map, {
        shapeOptions: {
          color: "#1788F3",
          opacity: 1,
          weight: 3
        }
      }),
      start() {
        this.drawer.enable();
      },
      stop() {
        drawItems.eachLayer(layer => {
          map.removeLayer(layer);
        });
        this.drawer.disable();
      }
    };

    const { active } = this.state;
    if (active === "distance") {
      this.setState({ active: null });
      this.modes.distance.stop();
    } else {
      this.setState({ active: "distance" });
      this.modes.distance.start();
      if (active) this.modes[active].stop();
    }
  };

  handleClose = () => {
    this.modes.distance.start();
    this.drawItems.eachLayer(layer => {
      map.removeLayer(layer);
    });
  };

  handleVisibility = () => {
    const { popId, handleHeight } = this;
    const _this = this; // eslint-disable-line
    this.modes.visibility = this.modes.visibility || {
      tempGroup: GMap.featureGroup().addTo(map),
      count: 0,
      createMarker(e) {
        if (this.count === 0) {
          const { latlng } = e;
          const icon = GMap.divIcon({
            iconAnchor: [-5, -5],
            html: `<div class="${styles.marker}">起点</div>`
          });
          this.tempGroup.addLayer(GMap.marker(latlng, { icon }).addTo(map));
        }
        if (this.count <= 1) {
          const { latlng } = e;
          const icon = GMap.divIcon({
            iconAnchor: [6, 6],
            html: `<div style="border-color: #FA8C16;" class="${
              styles.circle
            }"></div>`
          });
          this.tempGroup.addLayer(GMap.marker(latlng, { icon }).addTo(map));
        }
        if (this.count === 1) {
          const latLngs = [];
          this.tempGroup.eachLayer(layer => {
            latLngs.push(layer.getLatLng());
          });
          this.tempGroup.addLayer(
            GMap.polyline(latLngs, {
              color: "#FA8C16",
              weight: 3
            }).addTo(map)
          );

          const popIcon = GMap.divIcon({
            iconAnchor: [0, -45],
            html: `<div id="${popId}"></div>`
          });
          this.tempGroup.addLayer(
            GMap.marker(e.latlng, { icon: popIcon }).addTo(map)
          );
          handleHeight([latLngs[1], latLngs[2]]);
        }
        this.count += 1;
      },
      start() {
        this.listenr = this.createMarker.bind(this);
        map.on("click", this.listenr);
      },
      restart() {
        this.tempGroup.eachLayer(layer => {
          map.removeLayer(layer);
          this.tempGroup.removeLayer(layer);
        });
        this.count = 0;
        _this.setState({ visible: false });
      },
      stop() {
        this.tempGroup.eachLayer(layer => {
          map.removeLayer(layer);
          this.tempGroup.removeLayer(layer);
        });
        this.count = 0;
        map.off("click", this.listenr);
        _this.setState({ visible: false });
      }
    };

    const { active } = this.state;
    if (active === "visibility") {
      this.setState({ active: null });
      this.modes.visibility.stop();
    } else {
      this.setState({ active: "visibility" });
      this.modes.visibility.start();
      if (active) this.modes[active].stop();
    }
  };

  handleHeight = latLngs => {
    const TERRAIN_SERVICE_URL = "/terrain"; // eslint-disable-line
    const { GTerrain } = window;
    const terrainObj = new GTerrain(TERRAIN_SERVICE_URL, 7);
    const pos3darray = terrainObj.convertToP3dArray([
      [latLngs[0].lat, latLngs[0].lng],
      [latLngs[1].lat, latLngs[1].lng]
    ]);
    terrainObj.getHeights(pos3darray, height => {
      const startHeight = height[0].z;
      const endHeight = height[1].z;
      const distance = map.distance(latLngs[0], latLngs[1]);
      const id = `restart-${Date.now()}`;
      const endIcon = GMap.divIcon({
        iconAnchor: [-5, -5],
        html: `
        <div class="${styles.endMarker}">
          <span>总长:</span>
          <span class="${styles.number}"> ${(distance / 1000).toFixed(
          2
        )} </span>km
          <span class="${styles.bar}"></span>
          <span id="${id}" class="${styles.close}">X</span>
        </div>`
      });
      this.modes.visibility.tempGroup.addLayer(
        GMap.marker(latLngs[1], { icon: endIcon }).addTo(map)
      );
      setTimeout(() => {
        document.getElementById(id).addEventListener("click", e => {
          e.stopPropagation();
          this.handleRestart();
        });
      }, 0);
      if (distance > 10000) {
        terrainObj.getLineVisible(
          latLngs[0].lng,
          latLngs[0].lat,
          startHeight,
          latLngs[1].lng,
          latLngs[1].lat,
          endHeight,
          10000,
          (posArray, visArray) => {
            const xData = [0];
            const yData = [startHeight];
            posArray.forEach((p, i) => {
              if (i !== 0 && i !== posArray.length - 1) {
                // 舍去第一个点和最后一个点
                xData.push(10 * i);
                yData.push(p.z);
              }
            });
            xData.push(Number((distance / 1000).toFixed(2)));
            yData.push(endHeight);

            // 方位角
            // const from = gts.point([latLngs[0].lng, latLngs[0].lat]);
            // const to   = gts.point([latLngs[1].lng, latLngs[1].lat]);
            // const degrees = gts.bearing(from, to, { units: 'degrees' });

            // 最高点A
            const max = Math.max(...yData);
            const maxIndex = yData.findIndex(y => y === max);
            // const maxGeojson = gts.destination(from, xData[maxIndex], degrees, { units: 'kilometers' });
            const maxPoint = posArray[maxIndex];
            const maxCoords = [
              (maxPoint.x * 180) / Math.PI,
              (maxPoint.y * 180) / Math.PI
            ];
            this.addMarker("A", maxCoords);
            // 最低点B
            const min = Math.min(...yData);
            const minIndex = yData.findIndex(y => y === min);
            // const minGeojson = gts.destination(from, xData[minIndex], degrees, { units: 'kilometers' });
            const minPoint = posArray[minIndex];
            const minCoords = [
              (minPoint.x * 180) / Math.PI,
              (minPoint.y * 180) / Math.PI
            ];
            this.addMarker("B", minCoords);

            const chartData = {
              xData,
              yData,
              max,
              maxIndex,
              min,
              minIndex,
              maxCoords,
              minCoords
            };
            // 第一个不可通视点C
            if (visArray.length > 0) {
              const cIndex = visArray[0] - 1;
              const cValue = yData[cIndex];
              chartData.cIndex = cIndex;
              chartData.cValue = cValue;
              // const cGeojson = gts.destination(from, xData[cIndex], degrees, { units: 'kilometers' });
              const cPoint = posArray[cIndex];
              const cCoords = [
                (cPoint.x * 180) / Math.PI,
                (cPoint.y * 180) / Math.PI
              ];
              this.addMarker("C", cCoords);
              chartData.cCoords = cCoords;
            }
            this.setState({ chartData, visible: true });
          }
        );
      } else {
        this.setState({
          chartData: {
            xData: [0, Number((distance / 1000).toFixed(2))],
            yData: [startHeight, endHeight]
          },
          visible: true
        });
      }
    });
  };

  handleRestart = () => {
    this.modes.visibility.restart();
  };

  handleTrim = () => {
    // 浏览器会下载生成的png文件,若需要弹出操作系统自带的对话框来修改文件名称及保存位置,可通过修改浏览器设置实现
    // 以chrome浏览器为例:浏览器右上角--->设置--->高级--->下载内容--->下载前询问每个文件的保存位置(勾选)
    this.printer.printMap("Current", "态势截图");
  };

  render() {
    const { active, roam, visible, chartData } = this.state;
    const { style } = this.props;
    const container = document.getElementById(this.popId);
    return (
      <div
        id={this.id}
        className={styles.map}
        style={{ width: 1259, height: 800, ...style }}
      >
        <div
          className={styles.toolbar}
          ref={dom => {
            if (dom) {
              dom.addEventListener("dblclick", e => e.stopPropagation());
            }
          }}
        >
          {this.menus.map(menu => (
            <Popover
              getPopupContainer={() => document.getElementById(this.id)}
              content={menu.title}
              title={null}
              placement="left"
            >
              <div
                onClick={menu.handleClick}
                className={`${styles.block} ${
                  active === menu.key || (menu.key === "roam" && roam)
                    ? styles.active
                    : ""
                }`}
              >
                <Icon type={menu.icon} />
              </div>
            </Popover>
          ))}
          {visible &&
            container &&
            ReactDOM.createPortal(
              <Chart chartData={chartData} handleClose={this.handleRestart} />,
              container
            )}
        </div>
      </div>
    );
  }
}
