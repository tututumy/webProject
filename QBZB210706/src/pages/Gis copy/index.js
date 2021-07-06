// import React, { PureComponent } from 'react';
// import ReactDOM from 'react-dom';
// import { Popover, Menu, Icon, Spin, message } from 'antd';
// import Chart from './Chart';
// import Stock from './Stock';
// import styles from './index.less';
// import redMarker from './redMarker.png';
// import blueMarker from './blueMarker.png';
// import markerRed from './marker_red.png';
import language from "../../components/language/language";

import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import redMarker from './redMarker.png';
import blueMarker from './blueMarker.png';
import markerRed from './marker_red.png';
import { connect } from 'dva';
import { Popover, Menu, Icon, Spin, message } from 'antd';
import Chart from './Chart';
import Stock from './Stock';
import styles from './index.less';

const Icons = ({ type, ...rest }) => (
  <span className={`iconfont icon-${type}`} {...rest} />
);
let initMapDone = false;
let startZoom = null;
let startCenter = null;
let gDrawHelper = null;
let toolbarDraw = false;
let map = null;

@connect(({ language, ElectronicTarget }) => ({ language, ElectronicTarget }))
class Map extends PureComponent {
  id = `map-${Date.now()}`;

  popId = `pop-${Date.now()}`;

  modes = {};

  state = {
    active: null,
    reActive: null,
    roam: false,
    visible: false,
    visibleStock: false,
    chartData: null,
    iSpin: false,
    initJBFlag: false
  };
  terrainObj = '';
  lineObj = '';
  stockGroup = [];
  terrainURL = 'http://uop.ceiec.com:6410/QuadServer';// 高程服务请求固定格式

  // componentDidMount() {
  //   const { center, zoom } = this.props;
  //   const host = typeof window.getUrl == "function"
  //     ? `${window.location.hostname}`
  //     : "www.jinlutech.cn"; // 服务器地址
  //   const port = typeof window.getUrl == "function" ? "6410" : "80"; // 服务器端口
  //   const vector = typeof window.getUrl == "function" ? "Lao_A" : "vector"; // 矢量切片地图
  //   const { GMap } = window;

  //   // 通过指定参数初始化一个GMap对象
  //   // const map = GMap.map(this.id, {
  //   //   center: center || [29.557156, 3.577026],
  //   //   zoom: zoom ||4,
  //   //   minZoom: 2,
  //   //   maxZoom: 8,
  //   //   crs: GMap.CRS.Tianditu,
  //   //   maxBounds: [[-90, -180], [90, 180]],
  //   //   renderer: GMap.canvas(),
  //   //   zoomControl: false, // 不启用底图自带的zoom控件
  //   // });

  //   const map =
  //     typeof window.getUrl == "function"
  //       ? GMap.map(this.id, {
  //         // center: center || [29.557156, 3.577026],
  //         // zoom: zoom || 4,
  //         // minZoom: 1,
  //         // maxZoom: 8,
  //         // CRS: GMap.CRS.Tianditu,
  //         // maxBounds: [[-90, -180], [90, 180]],
  //         // renderer: GMap.canvas(),
  //         // zoomControl: false // 不启用底图自带的zoom控件
  //         center: center || [36.42, 3.08],
  //         zoom: zoom || 4,
  //         minZoom: 3,
  //         maxZoom: 22,
  //         contextmenu: true,
  //         contextmenuWidth: 140,
  //         CRS: GMap.CRS.Tianditu,
  //         maxBounds: [[-90, -180], [90, 180]],
  //         // renderer: GMap.canvas(),
  //         zoomControl: false, // 不启用底图自带的zoom控件
  //         trackResize: true
  //       })
  //       : GMap.map(this.id, {
  //         // center: center || [36.42, 3.08],
  //         center: center || [56, 56],
  //         zoom: zoom || 4,
  //         minZoom: 1,
  //         maxZoom: 8,
  //         contextmenu: true,
  //         contextmenuWidth: 140,
  //         CRS: GMap.CRS.Tianditu,
  //         maxBounds: [[-90, -180], [90, 180]],
  //         // renderer: GMap.canvas(),
  //         zoomControl: false, // 不启用底图自带的zoom控件
  //         trackResize: true
  //         // center: center || [29.557156, 3.577026],
  //         // zoom: zoom || 4,
  //         // minZoom: 1,
  //         // maxZoom: 8,
  //         // crs: GMap.CRS.Tianditu,
  //         // maxBounds: [[-90, -180], [90, 180]],
  //         // renderer: GMap.canvas(),
  //         // zoomControl: false // 不启用底图自带的zoom控件
  //         // center: center || [36.42, 3.08],
  //         // zoom: zoom || 4,
  //         // minZoom: 3,
  //         // maxZoom: 22,
  //         // CRS: GMap.CRS.Tianditu,
  //         // maxBounds: [[-90, -180], [90, 180]],
  //         // renderer: GMap.canvas(),
  //         // zoomControl: false // 不启用底图自带的zoom控件
  //       });

  //   map.whenReady(() => {
  //     // 加载背景图层
  //     GMap.tileLayerQSImg(host, port, vector).addTo(map);
  //     startZoom = map.getZoom();
  //     startCenter = map.getCenter();
  //   });

  //   // 如果父组件需要调用本组件的数据,可以通过传入一个函数形式的props实现,本组件通过给这个函数传参来传递数据给父组件
  //   const { init } = this.props;
  //   if (init) {
  //     init(map); // 父组件可以获取map中的图层及状态信息
  //   }

  //   // 默认禁用漫游
  //   map.dragging.disable();

  //   initMapDone = true;
  //   // 加载打印插件
  //   const loadPrintPlugin = () => {
  //     window.GMap.pluginManager().load('print', {
  //       done: () => {
  //         // 初始化打印控件对象
  //         this.printer = GMap.easyPrint({
  //           hidden: true,      // 在地图上显示打印控件
  //           exportOnly: true,   // 只通过图片下载方式获取打印内容
  //           filename: '地图打印',
  //           // 定义打印的大小：
  //           // Current 当前尺寸; A4Portrait 纵向打印； A4Landscape 横向打印
  //           sizeModes: ['Current', 'A4Portrait', 'A4Landscape']
  //         }).addTo(map);
  //       },
  //       error() { },
  //     })
  //   }
  //   loadPrintPlugin();

  //   // 加载绘图插件
  //   this.drawItems = GMap.featureGroup().addTo(map);
  //   const loadDrawPlugin = () => {
  //     GMap.pluginManager().load("draw", {
  //       done: () => {
  //         map.on(GMap.Draw.Event.CREATED, event => {
  //           const { layer } = event;
  //           layer.addTo(map);
  //           this.drawItems.addLayer(layer);

  //           const latLngs = layer.getLatLngs();
  //           let distance = 0;
  //           latLngs.forEach((latLng, index) => {
  //             let divIcon;
  //             if (index === 0) {
  //               divIcon = GMap.divIcon({
  //                 iconAnchor: [-5, -5],
  //                 html: `<div class="${styles.marker}">起点</div>`
  //               });
  //             } else if (index === latLngs.length - 1) {
  //               distance += map.distance(latLng, latLngs[index - 1]);
  //               const id = `close-${Date.now()}`;
  //               divIcon = GMap.divIcon({
  //                 iconAnchor: [-5, -5],
  //                 html: `
  //                 <div class="${styles.endMarker}">
  //                   <span>总长:</span>
  //                   <span class="${styles.number}"> ${(distance / 1000).toFixed(
  //                   2
  //                 )} </span>km
  //                   <span class="${styles.bar}"></span>
  //                   <span id="${id}" class="${styles.close}">X</span>
  //                 </div>`
  //               });
  //               setTimeout(() => {
  //                 document.getElementById(id).addEventListener("click", () => {
  //                   this.handleClose();
  //                 });
  //               }, 0);
  //             } else {
  //               distance += map.distance(latLng, latLngs[index - 1]);
  //               divIcon = GMap.divIcon({
  //                 iconAnchor: [-5, -5],
  //                 html: `<div class="${styles.marker}">${(
  //                   distance / 1000
  //                 ).toFixed(2)}km</div>`
  //               });
  //             }
  //             const marker = GMap.marker(latLng, { icon: divIcon });
  //             const circleIcon = GMap.divIcon({
  //               iconAnchor: [6, 6],
  //               html: `<div class="${styles.circle}"></div>`
  //             });
  //             const circleMarker = GMap.marker(latLng, { icon: circleIcon });
  //             marker.addTo(map);
  //             circleMarker.addTo(map);
  //             this.drawItems.addLayer(marker);
  //             this.drawItems.addLayer(circleMarker);
  //           });
  //         });
  //       },
  //       error() { }
  //     });
  //   };
  //   loadDrawPlugin();

  //   // 加载terrain插件
  //   // const loadTerrainPlugin = () => {
  //   //   GMap.pluginManager().load('terrain'); // 指定要加载的插件名称
  //   // }
  //   // loadTerrainPlugin();
  //   this.map = map;

  //   //点击查看目标航迹态势图按钮调用的接口
  //   if (this.props.ElectronicTarget.selectPlaneLineBtnMark == 1) {
  //     this.props.dispatch({
  //       type: "ElectronicTarget/selectPlaneLine",
  //       callback: res => {
  //         this.addMarker1(res.data, map);
  //       }
  //     });
  //   } else if (this.props.ElectronicTarget.selectPlaneLineBtnMark == 2) {
  //     //点击对比分析按钮调用的接口
  //     this.props.dispatch({
  //       type: "ElectronicTarget/handleCompareShowMap",
  //       payload: document.getElementById("objectName_radar").value,
  //       callback: res => {
  //         this.addMarker2(res.data, map);
  //       }
  //     });
  //   }
  // }

  componentDidMount() {
    const { center, zoom } = this.props;

    // // 地图服务器的访问参数
    // const host = 'uop.ceiec.com'; // 服务器地址
    // const port = '6410'; // 服务器端口
    // const vector = 'Lao_A'; // 矢量切片地图
    // 站地图获取
    const host = (typeof window.getUrl == 'function') ? `${window.location.hostname}` : 'www.jinlutech.cn'; // 服务器地址
    const port = (typeof window.getUrl == 'function') ? '6410' : '80'; // 服务器端口
    const vector = (typeof window.getUrl == 'function') ? 'Lao_A' : 'vector'; // 矢量切片地图
    const { GMap } = window;

    // 通过指定参数初始化一个GMap对象
    map = GMap.map(this.id, {
      // center: center || [29.557156, 106.577026],
      center: center || [36.42, 3.08],
      zoom: zoom || 4,
      minZoom: 1,
      maxZoom: 8,
      crs: GMap.CRS.Tianditu,
      maxBounds: [[-90, -180], [90, 180]],
      renderer: GMap.canvas(),
      zoomControl: false, // 不启用底图自带的zoom控件
    });

    map.whenReady(() => {
      // 加载背景图层
      GMap.tileLayerQSImg(host, port, vector).addTo(map);
      // 加载插件
      this.loadMapPlugins();
      // 显示比例尺
      this.addScaleControl();
      // 显示指北针
      this.addNorthArrow();
    });

    // 如果父组件需要调用本组件的数据,可以通过传入一个函数形式的props实现,本组件通过给这个函数传参来传递数据给父组件
    const { init } = this.props;
    if (init) {
      init(map); // 父组件可以获取map中的图层及状态信息
    }

    // 默认禁用漫游
    map.dragging.disable();
    initMapDone = true;
    this.drawItems = GMap.featureGroup().addTo(map);
    this.map = map;

  }


  componentWillReceiveProps(nextprops) {
    this.updata()
  }

  updata = () => {
    if (map) {
      setTimeout(() => {
        this.map.invalidateSize()
      }, 100)
    }
  }



  addMarker1 = (data, map) => {
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

  addMarker2 = (data, map) => {
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

  getLatLngPosition = () => {
    if (initMapDone) {
      this.map.on("mousemove", e => {
        const Lat = e.latlng.lat;
        const Lng = e.latlng.lng;
        const msgBox = document.getElementById("latLng");
        msgBox.innerHTML =
          "&#8194;" +
          this.doubleToDMS(Lat, false) +
          "&#8195;" +
          this.doubleToDMS(Lng, true) +
          "&#8194;";
      });
    }
  };

  // 菜单栏
  get menus() {
    // 可在此处定义及扩展工具栏的功能
    const { extendMenus } = this.props;
    const menu = (
      <Menu selectedKeys={null} style={{ background: 'rgba(255,255,255,0.4)' }}>
        <Menu.Item onClick={() => this.map.setZoom(4)}>
          1cm: 1000km
        </Menu.Item>
        <Menu.Item onClick={() => this.map.setZoom(5)}>
          1cm: 500km
        </Menu.Item>
        <Menu.Item onClick={() => this.map.setZoom(7)}>
          1cm: 200km
        </Menu.Item>
      </Menu>
    );
    return [
      { key: 'zoom', icon: 'zoom', title: menu, handleClick: this.handleZoomLayer },
      { key: 'zoomIn', icon: 'zoomIn', title: language[`toolbarZoomIn_${this.props.language.getlanguages}`], handleClick: this.handleZoomIn },
      { key: 'zoomOut', icon: 'zoomOut', title: language[`toolbarZoomOut_${this.props.language.getlanguages}`], handleClick: this.handleZoomOut },
      { key: 'roam', icon: 'roam', title: language[`toolbarRoam_${this.props.language.getlanguages}`], handleClick: this.handleRoam },
      { key: 'home', icon: 'home', title: language[`toolbarHome_${this.props.language.getlanguages}`], handleClick: this.handleHome },
      { key: 'distance', icon: 'distance', title: language[`toolbarDistance_${this.props.language.getlanguages}`], handleClick: this.handleDistance },
      { key: 'visibility', icon: 'visibility', title: language[`toolbarVisibility_${this.props.language.getlanguages}`], handleClick: this.handleVisibility },
      { key: 'trim', icon: 'trim', title: language[`toolbarTrim_${this.props.language.getlanguages}`], handleClick: this.handleTrim },
      // { key: 'rise', type: 'ant', icon: 'rise', title: '坡度', handleClick: this.handleRise },
      // { key: 'stock', type: 'ant', icon: 'stock', title: '剖面', handleClick: this.handleStock },
      ...extendMenus || [],
    ];
  }
  handleClose = () => {
    this.modes.distance.start();
    this.drawItems.eachLayer(layer => {
      this.map.removeLayer(layer)
    });
  };

  loadMapPlugins = () => {
    const { GMap } = window;
    GMap.pluginManager().load('draw', {
      // 加载draw插件
      done: () => { this.initJB(); this.loadDrawPlugin(); },
      error: (f) => { console.log('加载draw插件', f, '失败'); },
    });
    GMap.pluginManager().load('moving-marker', {
      // 加载moving-marker插件
      done: () => { },
      error: (f) => { console.log('加载moving-marker插件', f, '失败'); },
    });
    GMap.pluginManager().load('terrain', {
      // 加载terrain插件
      done: () => { this.loadTerrainPlugin() },
      error: (f) => { console.log('加载terrain插件', f, '失败'); },
    });
    GMap.pluginManager().load('print', {
      // 加载打印插件
      done: () => { this.loadPrintPlugin(); },
      error: (f) => { console.log('加载moving-marker插件', f, '失败'); },
    });
    GMap.pluginManager().load('animated-sector', {
      // 加载扇形插件 leading-line
      done: () => { },
      error: (f) => { console.log('加载animated-sector插件', f, '失败'); },
    });
    GMap.pluginManager().load('leading-line', {
      // 航线
      done: () => { },
      error: (f) => { console.log('加载leading-line插件', f, '失败'); },
    });
    GMap.pluginManager().load('gts', {// GTS 是 GMap Topology Suite 的缩写
      done: () => { },
      error: (f) => { console.log('加载GTS模块失败'); },
    })
  };

  // 加载打印插件
  loadPrintPlugin = () => {
    window.GMap.pluginManager().load('print', {
      done: () => {
        // 初始化打印控件对象
        this.printer = GMap.easyPrint({
          hidden: true,      // 在地图上显示打印控件
          exportOnly: true,   // 只通过图片下载方式获取打印内容
          filename: '地图打印',
          // 定义打印的大小：
          // Current 当前尺寸; A4Portrait 纵向打印； A4Landscape 横向打印
          sizeModes: ['Current', 'A4Portrait', 'A4Landscape']
        }).addTo(map);
      },
      error() { },
    })
  };

  // 加载绘图插件
  loadDrawPlugin = () => {
    const { GMap } = window;
    GMap.pluginManager().load('draw', {
      done: () => {
        map.on(GMap.Draw.Event.CREATED, (event) => {
          const { layer } = event;
          layer.addTo(map);
          this.drawItems.addLayer(layer);

          const latLngs = layer.getLatLngs();
          let distance = 0;
          latLngs.forEach((latLng, index) => {
            let divIcon;
            if (index === 0) {
              divIcon = GMap.divIcon({
                iconAnchor: [-5, -5],
                html: `<div class="${styles.marker}">起点</div>`,
              })
            } else if (index === latLngs.length - 1) {
              distance += map.distance(latLng, latLngs[index - 1])
              const id = `close-${Date.now()}`;
              divIcon = GMap.divIcon({
                iconAnchor: [-5, -5],
                html: `
              <div class="${styles.endMarker}">
                <span>总长:</span>
                <span class="${styles.number}"> ${(distance / 1000).toFixed(2)} </span>km
                <span class="${styles.bar}"></span>
                <span id="${id}" class="${styles.close}">×</span>
              </div>`,
              })
              setTimeout(() => {
                document.getElementById(id).addEventListener('click', () => {
                  this.handleClose();
                })
              }, 0)

            } else {
              distance += map.distance(latLng, latLngs[index - 1])
              divIcon = GMap.divIcon({
                iconAnchor: [-5, -5],
                html: `<div class="${styles.marker}">${(distance / 1000).toFixed(2)}km</div>`
              })
            }
            const marker = GMap.marker(latLng, { icon: divIcon });
            const circleIcon = GMap.divIcon({
              iconAnchor: [6, 6],
              html: `<div class="${styles.circle}"></div>`,
            })
            const circleMarker = GMap.marker(latLng, { icon: circleIcon });
            marker.addTo(map);
            circleMarker.addTo(map);
            this.drawItems.addLayer(marker);
            this.drawItems.addLayer(circleMarker);
          });
        });
      },
      error() { },
    });
  };

  // 加载terrain插件
  loadTerrainPlugin = () => {
    const { GMap } = window;
    // GMap.pluginManager().load('terrain'); // 指定要加载的插件名称
    GMap.pluginManager().load('terrain', {
      done: () => { },
      error: () => { }
    });
  };

  getLatLngPosition = () => {
    if (initMapDone) {
      this.map.on('mousemove', (e) => {
        const Lat = e.latlng.lat;
        const Lng = e.latlng.lng;
        const msgBox = document.getElementById("latLng");
        msgBox.innerHTML = '&#8194;' + this.doubleToDMS(Lat, false) + '&#8195;' + this.doubleToDMS(Lng, true) + '&#8194;';
      });
    }
  };
  doubleToDMS = (inputDegree, isLon) => {
    let outDegree = Math.floor(inputDegree);
    const tempDecimal = (inputDegree - outDegree) * 60;
    let outMinute = Math.floor(tempDecimal);
    let outSecond = (tempDecimal - outMinute) * 60;
    if (outSecond > 59.5) {
      outSecond = 0;
      outMinute++;
    }
    if (outSecond < -59.5) {
      outSecond = 0;
      outMinute--;
    }
    if (outMinute > 59.5) {
      outMinute = 0;
      outDegree++;
    }
    if (outMinute < -59.5) {
      outMinute = 0;
      outDegree--;
    }
    let dms = '';
    if (isLon) {// 经度
      if (inputDegree >= 0) {// 0-东经E（+）
        dms = "E  ";
        outSecond = Math.round(outSecond);
      } else { // 1-西经W（-）
        dms = "W  ";
        if (outDegree < 0)
          outDegree = 0 - outDegree;
        if (outMinute < 0)
          outMinute = 0 - outMinute;
        if (outSecond < 0) {
          outSecond = Math.round(0 - outSecond);
        } else {
          outSecond = Math.round(outSecond);
        }
      }
    } else {// 纬度
      if (inputDegree >= 0) {// 0-北纬N（+）
        dms = "N  ";
        outSecond = Math.round(outSecond);
      } else { // 1-南纬S（-）
        dms = "S  ";
        if (outDegree < 0)
          outDegree = 0 - outDegree;
        if (outMinute < 0)
          outMinute = 0 - outMinute;
        if (outSecond < 0) {
          outSecond = Math.round(0 - outSecond);
        } else {
          outSecond = Math.round(outSecond);
        }
      }
    }
    dms = dms + outDegree + "°" + outMinute + "′" + outSecond + "″";
    return dms;
  };
  addNorthArrow = () => {
    // 指北针
    let northArrow = GMap.control({ position: "topleft" });
    northArrow.onAdd = function (map1) {
      const div = GMap.DomUtil.create("div");
      div.innerHTML = "<img src='./images/northArrow.png' style='width:80px'>";
      return div;
    };
    northArrow.addTo(map);
  };
  //显示比例尺
  addScaleControl = () => {
    let scalBar = null;
    //比例尺
    scalBar = GMap.control.scale({
      position: 'bottomleft',
      'metric': true,
      'imperial': false,
    }).addTo(map);
  }
  initJB = () => {
    if (gDrawHelper === null) {

      let baseUrl = "";
      if (typeof window.getUrl === 'function') {
        baseUrl = `${window.getUrl()}/LK-0510102`   // 根据主站遥控本控模式设置（全局函数）
      }
      gDrawHelper = new DrawHelper(`${baseUrl}/plot/France_Symbol.ttf`, this.map, `${baseUrl}/config-zh`);

      // gDrawHelper = new DrawHelper(`/plot/France_Symbol.ttf`, this.map, '/config-zh');
      const defSymobj = new DrawHelper.CgsSymbol({
        annoText: `
        <span style="color:black;display:block;font-size:10px;text-align:left;">
          <strong>  20000 </strong>
        </span>`,
        annoDetailText: `
        <span style="color:black;display:block;font-size:10px;text-align:left;">
          <strong> C:106095754<br>P:F16<br>01/01/2020~<br>00:00:01 </strong>
        </span>`,
        annoTextColor: "#FF0000",
        fill: "#FF0000",
        color: "#FF0000",
        strokeWidth: 1,
        width: 60,
        height: 60,
        anchor: "BOTTOM",
        anchorOffset: { x: 15, y: -16 },
        annoVisibility: true,
        annoTextSize: 3,
        annoTextOffset: { x: 100, y: 100 },
      });
      gDrawHelper.setDefStyle(defSymobj);
      gDrawHelper.bind(DrawHelper.EVENT_SYM_INITED, () => {
        // 军标初始化完成
        gDrawHelper.setGMap(this.map);
        console.log("军标初始化完成")
        console.log("名称", this.props.windowModal.stationInfo)
        this.setState({ initJBFlag: true })

        if (!this.props.windowModal.locationDetails) {
          return false;
        }
        let data = this.props.windowModal.locationDetails;
        let ts = {
          longitude: data.longitude ? parseInt(data.longitude) : null,
          latitude: data.latitude ? parseInt(data.latitude) : null,
          name: this.props.windowModal.stationInfo ? this.props.windowModal.stationInfo.stationName : null,
          keyid: 127
        };

        console.log(ts, "地图经纬度标绘")
        if (ts.longitude != null && ts.latitude != null) {
          this.addGroupTS(ts);
        }
      });
    }
  };
  // 地图显示装备
  addGroupTS = (ts) => {
    console.log(ts);
    const keyName = `${Math.ceil(Math.random() * 10000000)}`;
    const group1 = new DrawHelper.CgsSymbolGroup({ name: "thisStation" });
    const blueEquiment = new DrawHelper.CgsSymbol({
      keyid: ts.keyid,// 站军标id
      pos: { x: ts.longitude, y: ts.latitude },// 经度、纬度
      name: keyName,// 军标key值（唯一性）
      annoText: `
        <span style="color:blue;font-size:10px">
          <strong>--</strong>
        </span>`,// 目标批号（简标）
      annoTextColor: "#000000",
      fill: "#000000",
      color: "#000000",
      strokeWidth: 1,
      width: 60,
      height: 60,
      anchor: "BOTTOM",
      anchorOffset: { x: 15, y: -16 },
      annoVisibility: true,
      annoTextSize: 3,
      annoTextOffset: { x: 100, y: 100 },
      direction: "right",
      label: ts.name,// 军标名称
      labelDirection: "top",
      labelOffset: { x: 0, y: ts.keyid > 17 ? -33 : 10 },// 军标keyid大于17时标签位置需调整
      fillType: "fillByNone",

      showDetailLabel: false,
      annoDetailText: `
        <span style="color:blue;display:block;font-size:10px;text-align:left;">
          <strong> ${ts.name} </strong>
        </span>`,
      showLineLabel: false,
    });
    const symbol1 = gDrawHelper.addSymbol(blueEquiment);
    group1.add(symbol1);
    gDrawHelper.addSymbolGroup(group1);
    gDrawHelper.editSymbols(false);
  };

  // 放大
  handleZoomOut = () => {
    const zoom = this.map.getZoom();
    this.map.setZoom(Math.max(zoom - 1, 1));
    this.setState({ active: null });
  };

  // 缩小
  handleZoomIn = () => {
    const zoom = this.map.getZoom();
    this.map.setZoom(Math.min(zoom + 1, 20));
    this.setState({ active: null });
  };

  // 漫游
  handleRoam = () => {
    // this.handleSectionCharsNone();
    this.modes.roam = this.modes.roam || {
      start: () => {
        this.map.dragging.enable();
      },
      stop: () => {
        this.map.dragging.disable();
      },
    }

    const { roam, active, reActive } = this.state;
    if (roam) {
      this.setState({ roam: false })
      this.modes.roam.stop();
    } else {
      // if(active) this.modes[active].stop();
      if (reActive) { this.modes[reActive].stsb(); }
      this.setState({ roam: true, active: null });
      this.modes.roam.start();

    }
  };

  // 居中
  handleHome = () => {
    const { center, zoom } = this.props;
    const CENTER = center || [29.557156, 106.577026];// 以本站站点位置为居中点(center)，如缺本站站点位置，则以阿尔及利亚首都为默认站点位置
    this.map.setView(window.GMap.latLng(...CENTER), zoom || 4);
    this.setState({ active: null });
  };

  // 测距
  handleDistance = () => {
    if (this.modes.initStock) this.modes.initStock.init();
    if (this.modes.distance) this.modes.distance.stop();
    const { GMap } = window;
    const { drawItems, map } = this;
    this.modes.distance = this.modes.distance || {
      drawer: new GMap.Draw.Polyline(this.map, {
        shapeOptions: {
          color: '#1788F3',
          opacity: 1,
          weight: 3,
        }
      }),
      start() {
        this.drawer.enable();
      },
      stop() {
        drawItems.eachLayer(layer => {
          map.removeLayer(layer)
        });
        this.drawer.disable();
      },
      stsb() {
        this.drawer.disable();
      }
    }

    const { active, roam, reActive } = this.state;
    if (active === 'distance') {
      this.setState({ active: null });
      this.modes.distance.stop();
    } else {
      if (roam) this.modes.roam.stop();
      this.setState({ active: 'distance', reActive: 'distance', roam: false });
      this.modes.distance.start();
      if (active) {
        this.modes[active].stop();
      } else if (reActive && reActive !== 'distance') {
        this.modes[reActive].stop();
      }
    }
  };

  // 坡度
  handleRise = () => {
    this.handleSectionCharsNone();
    const { GMap, GTerrain } = window;
    const { map } = this;
    let gDegreeLine = '';
    let terrainObj = '';
    const _this = this; // eslint-disable-line
    if (this.terrainObj && this.lineObj) {
      map.removeLayer(this.lineObj);
      this.terrainObj.removeLegend(map);
      this.terrainObj = '';
      this.lineObj = '';
    }
    this.drawItemsRise = GMap.featureGroup().addTo(map);
    const TERRAIN_SERVICE_URL_URL = this.terrainURL;// 获取高程服务数据
    const options = {
      maxPoints: 2,
      shapeOptions: {
        color: '#ff0000',
        weight: 2,
        clickable: true,
        label: 'my label',
        popup: 'show messages'
      },
      callback(positions) {
        terrainObj = new GTerrain(TERRAIN_SERVICE_URL_URL, 7);
        const grades = [50, 30, 10, -10, -30]; // 自定义坡度
        const colors = ['#800026', '#E31A1C', '#FC4E2A', '#FD8D3C', '#FEB24C', '#FED976']; // 自定义颜色
        terrainObj.setGradesAndColors(grades, colors);
        terrainObj.getAngleForTerrain(positions, 1e-4, function (_objResPoints, _objAngles) {
          gDegreeLine = terrainObj.drawAngleLines(_objResPoints, _objAngles, map);
          _this.lineObj = gDegreeLine;
        });
        _this.terrainObj = terrainObj;
      }
    }
    /* const drawer = new GMap.Draw.GSectionLine(map, options);
    drawer.enable(); */

    this.modes.rise = this.modes.rise || {
      drawer: new GMap.Draw.GSectionLine(map, options),
      start() {
        this.drawer.enable();
      },
      stop() {
        map.removeLayer(gDegreeLine);
        terrainObj.removeLegend(map);
        this.terrainObj = '';
        this.lineObj = '';
      },
      stsb() {
        this.drawer.disable();
      }
    }

    const { active, roam, reActive } = this.state;
    if (active === 'rise') {
      this.setState({ active: null })
      this.modes.rise.stop();
    } else {
      if (roam) this.modes.roam.stop();
      this.setState({ active: 'rise', reActive: 'rise', roam: false });
      this.modes.rise.start();
      if (active) {
        this.modes[active].stop();
      } else if (reActive) {
        this.modes[reActive].stop();
      }
    }
  };

  handleClose = () => {
    this.modes.distance.start();
    this.drawItems.eachLayer(layer => {
      this.map.removeLayer(layer)
    });
  };

  // 剖面
  handleStock = () => {
    const { GMap, GTerrain } = window;
    const { map } = this;
    const TERRAIN_SERVICE_URL_URL = this.terrainURL;// 获取高程服务数据

    const _this = this; // eslint-disable-line
    this.modes.initStock = {
      init() {
        if (_this.stockGroup && _this.stockGroup.length && _this.stockGroup.length > 0) {
          _this.handleSectionCharsNone();
          _this.stockGroup.forEach(item => {
            map.removeLayer(item);
          });
          _this.stockGroup = [];
        }
      }
    };
    this.modes.initStock.init();
    this.drawItemsStock = GMap.featureGroup().addTo(map);
    let group1 = [];
    const options = {
      shapeOptions: {
        color: '#ff0000',
        weight: 2,
        clickable: true,
        label: 'my label',
        popup: 'show messages'
      },
      callback(positions, layer) {
        const terrainObj = new GTerrain(TERRAIN_SERVICE_URL_URL, map.getZoom());
        layer.addTo(map);
        group1.push(layer);
        group1 = terrainObj.addLayerMarks(layer, markerRed, map);
        group1.push(layer);
        terrainObj.updateSectionForTerrain(positions, 1e-3, "#sectionChars", "echartsView1");
        document.getElementById('sectionChars').style.display = "block";
        _this.stockGroup = group1;
      }
    }

    this.modes.stock = this.modes.stock || {
      drawer: new GMap.Draw.GSectionLine(map, options),
      start() {
        this.drawer.enable();
      },
      stop() {
        for (let i = 0; i < group1.length; i++)
          map.removeLayer(group1[i]);
      },
      stsb() {
        this.drawer.disable();
      }
    }

    const { active, roam, reActive } = this.state;
    if (active === 'stock') {
      this.setState({ active: null, visibleStock: false });
      this.handleSectionCharsNone();
      this.modes.stock.stop();
    } else {
      if (roam) this.modes.roam.stop();
      this.setState({ active: 'stock', reActive: 'stock', visibleStock: true, roam: false });
      this.modes.stock.start();
      if (active) {
        this.modes[active].stop();
      } else if (reActive) {
        this.modes[reActive].stop();
      }
    }
    setTimeout(() => {
      document.getElementById('stockstop').addEventListener('click', (e) => {
        e.stopPropagation();
        if (_this.modes.initStock) {
          _this.modes.initStock.init();
          _this.setState({ visibleStock: false });
          _this.modes.stock.start();
        }
      })
    }, 0)
  };


  // 通视
  handleVisibility = () => {
    this.handleSectionCharsNone();
    const { GMap } = window;
    const { map, popId, handleHeight } = this;
    const _this = this; // eslint-disable-line
    if (this.modes.visibility) this.modes.visibility.stop();
    this.modes.visibility = this.modes.visibility || {
      tempGroup: GMap.featureGroup().addTo(map),
      count: 0,
      createMarker(e) {
        if (this.count === 0) {
          const { latlng } = e;
          const icon = GMap.divIcon({
            iconAnchor: [-5, -5],
            html: `<div class="${styles.marker}">起点</div>`,
          })
          this.tempGroup.addLayer(GMap.marker(latlng, { icon }).addTo(map));
        }
        if (this.count <= 1) {
          const { latlng } = e;
          const icon = GMap.divIcon({
            iconAnchor: [6, 6],
            html: `<div style="border-color: #FA8C16;" class="${styles.circle}"></div>`,
          })
          this.tempGroup.addLayer(GMap.marker(latlng, { icon }).addTo(map));
        }
        if (this.count === 1) {
          const latLngs = [];
          this.tempGroup.eachLayer(layer => {
            latLngs.push(layer.getLatLng());
          })
          this.tempGroup.addLayer(GMap.polyline(latLngs, {
            color: '#FA8C16',
            weight: 3,
          }).addTo(map));

          const popIcon = GMap.divIcon({
            iconAnchor: [0, -45],
            html: `<div id="${popId}"></div>`,
          })
          this.tempGroup.addLayer(GMap.marker(e.latlng, { icon: popIcon }).addTo(map));
          handleHeight([latLngs[1], latLngs[2]]);
          _this.setState({ iSpin: true })
        }
        this.count += 1;
      },
      start() {
        this.listenr = this.createMarker.bind(this);
        map.on('click', this.listenr);
      },
      restart() {
        this.tempGroup.eachLayer(layer => {
          map.removeLayer(layer)
          this.tempGroup.removeLayer(layer)
        });
        this.count = 0;
        _this.setState({ visible: false });
      },
      stop() {
        this.tempGroup.eachLayer(layer => {
          map.removeLayer(layer)
          this.tempGroup.removeLayer(layer)
        });
        this.count = 0;
        map.off('click', this.listenr);
        _this.setState({ visible: false });
      },
      stsb() {
        map.off('click', this.listenr);
      }
    }

    const { active, roam, reActive } = this.state;
    if (active === 'visibility') {
      this.setState({ active: null })
      this.modes.visibility.stop();
    } else {
      this.count = 0;
      if (roam) this.modes.roam.stop();
      if (this.modes.visibility) this.modes.visibility.stop();
      this.setState({ active: 'visibility', reActive: 'visibility', roam: false });
      this.modes.visibility.start();
      if (active) {
        this.modes[active].stop();
      } else if (reActive && reActive !== 'visibility') {
        this.modes[reActive].stop();
      }
    }
  }

  handleHeight = (latLngs) => {
    const TERRAIN_SERVICE_URL = this.terrainURL;// 获取高程服务数据
    const { GTerrain, GMap } = window;
    const { map } = this;
    const terrainObj = new GTerrain(TERRAIN_SERVICE_URL, 7);
    const pos3darray = terrainObj.convertToP3dArray([
      [latLngs[0].lat, latLngs[0].lng],
      [latLngs[1].lat, latLngs[1].lng],
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
      <span class="${styles.number}"> ${(distance / 1000).toFixed(2)} </span>km
      <span class="${styles.bar}"></span>
      <span id="${id}" class="${styles.close}">×</span>
    </div>`,
      })
      this.modes.visibility.tempGroup.addLayer(GMap.marker(latLngs[1], { icon: endIcon }).addTo(map));
      setTimeout(() => {
        document.getElementById(id).addEventListener('click', (e) => {
          e.stopPropagation();
          this.handleRestart();
        })
      }, 0)
      if (distance > 10000) {
        terrainObj.getLineVisible(
          latLngs[0].lng, latLngs[0].lat, startHeight,
          latLngs[1].lng, latLngs[1].lat, endHeight,
          10000,
          (posArray, visArray) => {
            const xData = [0];
            const yData = [startHeight];
            posArray.forEach((p, i) => {
              if (i !== 0 && i !== posArray.length - 1) { // 舍去第一个点和最后一个点
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
            const maxPoint = posArray[maxIndex]
            const maxCoords = [maxPoint.x * 180 / Math.PI, maxPoint.y * 180 / Math.PI];
            this.addMarker('A', maxCoords);
            // 最低点B
            const min = Math.min(...yData);
            const minIndex = yData.findIndex(y => y === min);
            // const minGeojson = gts.destination(from, xData[minIndex], degrees, { units: 'kilometers' });
            const minPoint = posArray[minIndex]
            const minCoords = [minPoint.x * 180 / Math.PI, minPoint.y * 180 / Math.PI];
            this.addMarker('B', minCoords);

            const chartData = { xData, yData, max, maxIndex, min, minIndex, maxCoords, minCoords };
            // 第一个不可通视点C
            if (visArray.length > 0) {
              const cIndex = visArray[0] - 1;
              const cValue = yData[cIndex];
              chartData.cIndex = cIndex;
              chartData.cValue = cValue;
              // const cGeojson = gts.destination(from, xData[cIndex], degrees, { units: 'kilometers' });
              const cPoint = posArray[cIndex];
              const cCoords = [cPoint.x * 180 / Math.PI, cPoint.y * 180 / Math.PI];
              this.addMarker('C', cCoords);
              chartData.cCoords = cCoords;
            }
            this.setState({ chartData, visible: true, iSpin: false });
          }
        )
      } else {
        this.setState({ chartData: { xData: [0, Number((distance / 1000).toFixed(2))], yData: [startHeight, endHeight] }, visible: true, iSpin: false })
      }
    });
  }

  addMarker = (type, coordinates) => {
    const { map, modes: { visibility: { tempGroup } } } = this;
    const { GMap } = window;
    const circleIcon = GMap.divIcon({
      iconAnchor: [3, 3],
      html: `<div class="${type === 'C' ? styles.smallRedCircle : styles.smallCircle}"></div>`,
    })
    const markerIcon = GMap.icon({
      iconUrl: type === 'C' ? redMarker : blueMarker,
      iconSize: [21, 33],    // 图标像素大小
      iconAnchor: [10.5, 33],  // 图标锚点位置,20是横坐标中点,100是纵坐标最下端
    })
    const textIcon = GMap.divIcon({
      iconAnchor: [6, 32],
      html: `<div class="${styles.text}">${type}</div>`
    })

    const circle = GMap.marker([coordinates[1], coordinates[0]], { icon: circleIcon }).addTo(map);
    tempGroup.addLayer(circle);
    const marker = GMap.marker([coordinates[1], coordinates[0]], { icon: markerIcon }).addTo(map);
    tempGroup.addLayer(marker);
    const text = GMap.marker([coordinates[1], coordinates[0]], { icon: textIcon }).addTo(map);
    tempGroup.addLayer(text);
  }

  handleRestart = () => {
    this.modes.visibility.restart();
  }

  handleSectionCharsNone = () => {
    const isNone = document.getElementById('sectionChars').style;
    if (isNone.display === 'block') {
      isNone.display = "none";
    }
  }

  handleRestartRise = () => {
    this.modes.rise.restart();
  }

  handleRestartStock = () => {
    this.modes.stock.restart();
  }

  // 截图
  handleTrim = () => {
    const { active, roam, reActive } = this.state;
    if (roam) this.modes.roam.stop();
    this.setState({ active: null, roam: false });
    const pop = document.getElementsByClassName("ant-popover");
    for (let i = 0; i < pop.length; i++) {
      pop[i].classList.add("ant-popover-hidden");
    }
    // 浏览器会下载生成的png文件,若需要弹出操作系统自带的对话框来修改文件名称及保存位置,可通过修改浏览器设置实现
    // 以chrome浏览器为例:浏览器右上角--->设置--->高级--->下载内容--->下载前询问每个文件的保存位置(勾选)
    if (active) {
      this.modes[active].stop();
    } else if (reActive) {
      this.modes[reActive].stop();
    }
    setTimeout(() => {
      this.printer.printMap('CurrentSize', '态势截图');// 态势截图
    }, 0)
  };

  handleZoomLayer = () => {
    const { active, roam, reActive } = this.state;
    if (roam) this.modes.roam.stop();
    this.setState({ active: null, roam: false });
    if (active) this.modes[active].stop();
    if (reActive) { this.modes[reActive].stop(); }
    if (this.modes.initStock) this.modes.initStock.init();
  };

  // // 菜单栏
  // get menus() {
  //   // 可在此处定义及扩展工具栏的功能
  //   const { extendMenus } = this.props;
  //   const menu = (
  //     <Menu selectedKeys={null} style={{ background: 'rgba(255,255,255,0.4)' }}>
  //       <Menu.Item onClick={() => this.map.setZoom(4)}>
  //         1cm: 1000km
  //   </Menu.Item>
  //       <Menu.Item onClick={() => this.map.setZoom(5)}>
  //         1cm: 500km
  //   </Menu.Item>
  //       <Menu.Item onClick={() => this.map.setZoom(7)}>
  //         1cm: 200km
  //   </Menu.Item>
  //     </Menu>
  //   );
  //   return [
  //     { key: 'zoom', icon: 'zoom', title: menu },
  //     { key: 'zoomIn', icon: 'zoomIn', title: language[`toolbar_zoomIn${this.props.windowModal.getlanguages}`], handleClick: this.handleZoomIn },
  //     { key: 'zoomOut', icon: 'zoomOut', title: language[`toolbar_zoomOut${this.props.windowModal.getlanguages}`], handleClick: this.handleZoomOut },
  //     { key: 'roam', icon: 'roam', title: language[`toolbar_roam${this.props.windowModal.getlanguages}`], handleClick: this.handleRoam },
  //     { key: 'distance', icon: 'distance', title: language[`toolbar_distance${this.props.windowModal.getlanguages}`], handleClick: this.handleDistance },
  //     { key: 'trim', icon: 'trim', title: language[`toolbarTrim${this.props.windowModal.getlanguages}`], handleClick: this.handleTrim },
  //     { key: 'home', icon: 'home', title: language[`toolbarHome${this.props.windowModal.getlanguages}`], handleClick: this.handleHome },

  //     ...extendMenus || [],
  //   ];
  // }


  handleHeight = (latLngs) => {
    const TERRAIN_SERVICE_URL = this.terrainURL;// 获取高程服务数据
    const { GTerrain, GMap } = window;
    const { map } = this;
    const terrainObj = new GTerrain(TERRAIN_SERVICE_URL, 7);
    const pos3darray = terrainObj.convertToP3dArray([
      [latLngs[0].lat, latLngs[0].lng],
      [latLngs[1].lat, latLngs[1].lng],
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
        <span class="${styles.number}"> ${(distance / 1000).toFixed(2)} </span>km
        <span class="${styles.bar}"></span>
        <span id="${id}" class="${styles.close}">×</span>
      </div>`,
      })
      this.modes.visibility.tempGroup.addLayer(GMap.marker(latLngs[1], { icon: endIcon }).addTo(map));
      setTimeout(() => {
        document.getElementById(id).addEventListener('click', (e) => {
          e.stopPropagation();
          this.handleRestart();
        })
      }, 0)
      if (distance > 10000) {
        terrainObj.getLineVisible(
          latLngs[0].lng, latLngs[0].lat, startHeight,
          latLngs[1].lng, latLngs[1].lat, endHeight,
          10000,
          (posArray, visArray) => {
            const xData = [0];
            const yData = [startHeight];
            posArray.forEach((p, i) => {
              if (i !== 0 && i !== posArray.length - 1) { // 舍去第一个点和最后一个点
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
            const maxPoint = posArray[maxIndex]
            const maxCoords = [maxPoint.x * 180 / Math.PI, maxPoint.y * 180 / Math.PI];
            this.addMarker('A', maxCoords);
            // 最低点B
            const min = Math.min(...yData);
            const minIndex = yData.findIndex(y => y === min);
            // const minGeojson = gts.destination(from, xData[minIndex], degrees, { units: 'kilometers' });
            const minPoint = posArray[minIndex]
            const minCoords = [minPoint.x * 180 / Math.PI, minPoint.y * 180 / Math.PI];
            this.addMarker('B', minCoords);

            const chartData = { xData, yData, max, maxIndex, min, minIndex, maxCoords, minCoords };
            // 第一个不可通视点C
            if (visArray.length > 0) {
              const cIndex = visArray[0] - 1;
              const cValue = yData[cIndex];
              chartData.cIndex = cIndex;
              chartData.cValue = cValue;
              // const cGeojson = gts.destination(from, xData[cIndex], degrees, { units: 'kilometers' });
              const cPoint = posArray[cIndex];
              const cCoords = [cPoint.x * 180 / Math.PI, cPoint.y * 180 / Math.PI];
              this.addMarker('C', cCoords);
              chartData.cCoords = cCoords;
            }
            this.setState({ chartData, visible: true, iSpin: false });
          }
        )
      } else {
        this.setState({ chartData: { xData: [0, Number((distance / 1000).toFixed(2))], yData: [startHeight, endHeight] }, visible: true, iSpin: false })
      }
    });
  }

  addMarker = (type, coordinates) => {
    const { map, modes: { visibility: { tempGroup } } } = this;
    const { GMap } = window;
    const circleIcon = GMap.divIcon({
      iconAnchor: [3, 3],
      html: `<div class="${type === 'C' ? styles.smallRedCircle : styles.smallCircle}"></div>`,
    })
    const markerIcon = GMap.icon({
      iconUrl: type === 'C' ? redMarker : blueMarker,
      iconSize: [21, 33],    // 图标像素大小
      iconAnchor: [10.5, 33],  // 图标锚点位置,20是横坐标中点,100是纵坐标最下端
    })
    const textIcon = GMap.divIcon({
      iconAnchor: [6, 32],
      html: `<div class="${styles.text}">${type}</div>`
    })

    const circle = GMap.marker([coordinates[1], coordinates[0]], { icon: circleIcon }).addTo(map);
    tempGroup.addLayer(circle);
    const marker = GMap.marker([coordinates[1], coordinates[0]], { icon: markerIcon }).addTo(map);
    tempGroup.addLayer(marker);
    const text = GMap.marker([coordinates[1], coordinates[0]], { icon: textIcon }).addTo(map);
    tempGroup.addLayer(text);
  }

  handleRestart = () => {
    this.modes.visibility.restart();
  }

  handleSectionCharsNone = () => {
    const isNone = document.getElementById('sectionChars').style;
    if (isNone.display === 'block') {
      isNone.display = "none";
    }
  }

  handleRestartRise = () => {
    this.modes.rise.restart();
  }

  handleRestartStock = () => {
    this.modes.stock.restart();
  }

  // 截图
  handleTrim = () => {
    const { active, roam, reActive } = this.state;
    if (roam) this.modes.roam.stop();
    this.setState({ active: null, roam: false });
    const pop = document.getElementsByClassName("ant-popover");
    for (let i = 0; i < pop.length; i++) {
      pop[i].classList.add("ant-popover-hidden");
    }
    // 浏览器会下载生成的png文件,若需要弹出操作系统自带的对话框来修改文件名称及保存位置,可通过修改浏览器设置实现
    // 以chrome浏览器为例:浏览器右上角--->设置--->高级--->下载内容--->下载前询问每个文件的保存位置(勾选)
    if (active) {
      this.modes[active].stop();
    } else if (reActive) {
      this.modes[reActive].stop();
    }
    setTimeout(() => {
      this.printer.printMap('CurrentSize', '态势截图');// 态势截图
    }, 0)
  };

  handleZoomLayer = () => {
    const { active, roam, reActive } = this.state;
    if (roam) this.modes.roam.stop();
    this.setState({ active: null, roam: false });
    if (active) this.modes[active].stop();
    if (reActive) { this.modes[reActive].stop(); }
    if (this.modes.initStock) this.modes.initStock.init();
  };


  render() {
    const { active, roam, visible, visibleStock, chartData, iSpin } = this.state;
    const { style } = this.props;
    const container = document.getElementById(this.popId);
    return (
      <div id={this.id} onMouseMove={this.getLatLngPosition} className={styles.map} style={{

        width: '100%', height: '100%', ...style
      }}>
        <div id='latLng' style={{ color: "red" }} className={styles.textArera} />
        <div
          className={styles.toolbar}
          ref={dom => {
            if (dom) {
              dom.addEventListener('dblclick', e => e.stopPropagation());
            }
          }}
        >
          {
            this.menus.map(menu => (
              <Popover getPopupContainer={() => document.getElementById(this.id)} content={menu.title} title={null} placement="left">
                <div onClick={menu.handleClick} className={`${styles.block} ${active === menu.key || (menu.key === 'roam' && roam) ? styles.active : ''}`}>
                  {menu.type === 'ant' ? <Icon type={menu.icon} /> : <Icons type={menu.icon} />}
                </div>
              </Popover>
            ))
          }
          {
            visible && container &&
            ReactDOM.createPortal(
              <Chart
                chartData={chartData}
                handleClose={this.handleRestart}
              />,
              container
            )
          }
        </div>
        <Stock />
        {iSpin && <Spin size="large" className='classSpin' />}
      </div>
    )
  }
  // render() {
  //   const { active, roam, visible,visibleStock, chartData,iSpin } = this.state;
  //   const { style } = this.props;
  //   const container = document.getElementById(this.popId);
  //   return (
  //     <div className={styles.map} style={{ width: 1200, height: 800, ...style }}>
  //       <div id={this.id} style={{ width: 1200, height: 800, ...style }} />
  //       <div className={styles.toolbar} ref={dom => {
  //         if (dom) {
  //           dom.addEventListener('dblclick', e => e.stopPropagation());
  //         }
  //       }} >
  //         {
  //           this.menus.map(menu => (
  //             <Popover trigger={menu.icon==='zoom'?'click':'hover'} getPopupContainer={() => document.getElementById(this.id)} content={menu.title} title={null} placement="left">
  //               <div onClick={menu.handleClick} className={`${styles.block} ${active === menu.key || (menu.key === 'roam' && roam) ? styles.active : ''}`}>
  //                 {menu.type === 'ant' ? <Icon type={menu.icon} /> : <Icons type={menu.icon} />}
  //               </div>
  //             </Popover>
  //           ))
  //         }
  //       </div>
  //       { visible && <Chart chartData={chartData} handleClose={this.handleRestart} /> }
  //       <Stock />
  //       {iSpin && <Spin size="large" className='classSpin' />}
  //     </div>
  //   );
  // }
}

export default Map;
