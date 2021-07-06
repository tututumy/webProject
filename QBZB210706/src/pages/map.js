import { message } from "antd";

export function loadMap(id) {
  // 定义全局变量来存放地图对象
  let _map = null;

  // 地图服务器的访问参数
  // const host = `${window.location.hostname}`; // 服务器地址
  // const port = '8080'; // 服务器端口
  // const vector = 'Lao_A'; // 矢量切片地图
  // const satellite = 'Lao_A'; // 卫星影像地图

  // const host = '192.168.1.1'; // 服务器地址
  // const port = '8080'; // 服务器端口
  // const vector = 'G_Data'; // 矢量切片地图
  // const satellite = 'G_Data'; // 卫星影像地图

  const host =
    typeof window.getUrl == "function"
      ? `${window.location.hostname}`
      : "www.jinlutech.cn"; // 服务器地址
  const port = typeof window.getUrl == "function" ? "8080" : "80"; // 服务器端口
  const vector = typeof window.getUrl == "function" ? "Lao_A" : "vector"; // 矢量切片地图
  //      const host = 'www.jinlutech.cn'; // 服务器地址
  //      const port = '80'; // 服务器端口
  //      const vector = 'vector'; // 矢量切片地图

  const GMap = window.GMap;

  // var gDrawHelper = null;

  function loadMap() {
    // 通过指定参数初始化一个GMap对象
    if (GMap === undefined || GMap === null) {
      return 0;
    }
    _map = GMap.map(id, {
      center: [29.557156, 106.577026],
      zoom: 4,
      minZoom: 4,
      // maxZoom: 11,
      maxZoom: 10,
      // crs: GMap.CRS.Tianditu,
      crs: GMap.CRS.PGIS,
      maxBounds: [[-90, -180], [90, 180]],
      renderer: GMap.canvas()
    });
    _map.whenReady(function() {
      // 加载背景图层
      GMap.tileLayerQSImg(host, port, vector).addTo(_map);
      // 在启动阶段加载矢量图元绘制模块; 也可以先不加载，在后续使用时再实时加载。
      loadDrawPlugin();
      // initJB();

      // 启动时加载moving-marker插件，也可在使用时再延迟加载。
      loadMovingMarkerPlugin();
    });
    window._map = _map;
  }

  function loadDrawPlugin() {
    GMap.pluginManager().load("draw", {
      done: function() {
        enableDrawPlugin();
      },
      error: function(f) {
        console.log("加载插件库", f, "失败");
      }
    });
  }

  function loadMovingMarkerPlugin() {
    var mgr = GMap.pluginManager();
    mgr.load("moving-marker", {
      // 指定要加载的插件名称
      done: function() {
        // 加载成功的回调函数
        console.log("moving-marker plugin loaded");
      },
      error: function(f) {
        // 加载失败的回调函数
        console.log("load script file " + f + " failed");
      }
    });
  }

  // 用于存放绘制图元的矢量图层
  var _drawnItems = null;
  // 图元绘制控件对象
  var _drawController = null;

  function enableDrawPlugin() {
    // 如果已经启用了绘制控件，直接返回
    if (_drawController != null) {
      return;
    }

    if (_drawnItems == null) {
      // 初始化存放绘制图元的矢量图层
      _drawnItems = GMap.featureGroup().addTo(_map);
    }

    // 监听图元绘制完成的消息，并将新加图元添加到地图上
    _map.on(GMap.Draw.Event.CREATED, function(event) {
      const layer = event.layer;
      _drawnItems.addLayer(layer);
      layer.on("click", onClickActive, this);
    });
  }

  function drawMarker() {
    const options = {
      icon: createCustomIcon()
    };

    const drawer = new GMap.Draw.Marker(_map, options);
    drawer.enable();
  }

  function drawPolyline() {
    const options = {
      shapeOptions: {
        color: "#ff0000",
        weight: 2
      }
    };

    const drawer = new GMap.Draw.Polyline(_map, options);
    drawer.enable();
  }

  function drawPolygon() {
    const options = {
      showArea: false,
      shapeOptions: {
        stroke: true,
        color: "#0000ff",
        weight: 1,
        opacity: 0.5,
        fill: true,
        fillColor: null, // same as color by default
        fillOpacity: 0.2,
        clickable: true
      }
    };

    const drawer = new GMap.Draw.Polygon(_map, options);
    drawer.enable();
  }

  function drawCircle() {
    const options = {
      shapeOptions: {
        stroke: true,
        color: "#444",
        weight: 1,
        opacity: 1,
        fill: true,
        fillColor: "#00ff00",
        fillOpacity: 0.2,
        clickable: true
      }
    };

    const drawer = new GMap.Draw.Circle(_map, options);
    drawer.enable();
  }

  function drawRectangle() {
    const options = {
      showArea: false,
      shapeOptions: {
        stroke: true,
        color: "#444",
        weight: 1,
        opacity: 0.8,
        fill: true,
        fillColor: "#00ffff",
        fillOpacity: 0.2,
        clickable: true
      }
    };

    const drawer = new GMap.Draw.Rectangle(_map, options);
    drawer.enable();
  }

  // 用户自定义图标
  function createCustomIcon() {
    const myIcon = GMap.icon({
      // iconUrl: '/images/soldier.png',
      // // Retina 是对高清屏显示时的设置,使用两倍大的图片
      // iconRetinaUrl: '/images/soldier.png@2x.png',
      // iconSize: [41, 100], // 图标像素大小
      // iconAnchor: [20, 100], // 图标锚点位置,20是横坐标中点,100是纵坐标最下端
      // popupAnchor: [0, -105], // 弹出窗口位置 (是相对于锚点的位置)
      iconUrl: "/images/plane_blue.png",
      // Retina 是对高清屏显示时的设置,使用两倍大的图片
      iconRetinaUrl: "/images/plane_blue",
      iconSize: [48, 48], // 图标像素大小
      iconAnchor: [24, 24], // 图标锚点位置,20是横坐标中点,100是纵坐标最下端
      popupAnchor: [0, -24], // 弹出窗口位置 (是相对于锚点的位置)
      shadowUrl: "/images/marker-shadow.png",
      shadowRetinaUrl: "/images/marker-shadow.png@2x.png",
      shadowSize: [68, 95], // 图标阴影大小
      shadowAnchor: [29, 94] // 图标阴影的锚点
    });
    // const myIcon = GMap.icon({
    //   // iconUrl: '/images/soldier.png',
    //   // // Retina 是对高清屏显示时的设置,使用两倍大的图片
    //   // iconRetinaUrl: '/images/soldier.png@2x.png',
    //   // iconSize: [41, 100], // 图标像素大小
    //   // iconAnchor: [20, 100], // 图标锚点位置,20是横坐标中点,100是纵坐标最下端
    //   // popupAnchor: [0, -105], // 弹出窗口位置 (是相对于锚点的位置)
    //   iconUrl: '/images/plane_blue.png',
    //   // Retina 是对高清屏显示时的设置,使用两倍大的图片
    //   iconRetinaUrl: '/images/plane_blue',
    //   iconSize: [48, 48], // 图标像素大小
    //   iconAnchor: [24, 24], // 图标锚点位置,20是横坐标中点,100是纵坐标最下端
    //   popupAnchor: [0, -24], // 弹出窗口位置 (是相对于锚点的位置)
    //   shadowUrl: '/images/marker-shadow.png',
    //   shadowRetinaUrl: '/images/marker-shadow.png@2x.png',
    //   shadowSize: [68, 95], // 图标阴影大小
    //   shadowAnchor: [29, 94], // 图标阴影的锚点
    // });
    return myIcon;
  }

  // --------------------------------------------------------------

  function removeAll() {
    if (_map !== null) {
      _map.eachLayer(layer => {
        if (layer instanceof GMap.Path) {
          _map.removeLayer(layer);
        }
      });
    }
  }

  // --------------------------------------------------------------
  // 编辑图元的函数

  var _editing_feature = null;

  function editMarker() {
    const myIcon = createCustomIcon();
    const marker = GMap.marker([30.661057, 104.081757], {
      icon: myIcon // 使用用户自定义的图标
    });
    marker.addTo(_map);
    marker.editing.enable();
    _editing_feature = marker;
  }

  function editPolygon() {
    const latlngs = [
      // [30.661057, 104.081757],
      // [29.558176, 106.510338],
      // [28.200825, 112.98127],
      // [28.675991, 115.899918],
      // [26.078591, 119.297813],
      // [31.106981, 121.37156],
      [29.561057, 104.081757],
      [28.458176, 106.510338],
      [27.100825, 112.98127],
      [29.467514, 114.291939],
      [30.763255, 117.275703],
      [30.006981, 121.37156]
    ];
    const polygon = GMap.polygon(latlngs, {
      color: "green",
      fillColor: "yellow",
      fillOpacity: 0.3,
      weight: 1
    }).addTo(_map);
    _map.fitBounds(polygon.getBounds());
    //可编辑
    // polygon.editing.enable();
    _editing_feature = polygon;
  }

  //画圆
  function editCircle() {
    const circle = GMap.circle([39.923615, 112.380943], {
      radius: 250000,
      fill: true,
      color: "#0000ff",
      weight: 2,
      stroke: true,
      fillOpacity: 0.2
    }).addTo(_map);
    _map.fitBounds(circle.getBounds());
    circle.editing.enable();
    _editing_feature = circle;
  }

  function editRectangle() {
    const bounds = [[21.501, 119.197], [25.713, 122.457]];
    const rect = GMap.rectangle(bounds, {
      fillColor: "#3366cc",
      color: "#ff0000",
      weight: 1
    }).addTo(_map);
    _map.flyTo(rect.getBounds().getCenter(), 6);
    rect.editing.enable();
    _editing_feature = rect;
  }

  // 结束编辑时，获取编辑状态和数据
  function saveEditing() {
    // console.log('Is changed : ' + (true == _editing_feature.edited));
    if (_editing_feature !== null) {
      _editing_feature.editing.disable();
    }
    message.success("操作成功");
  }

  var _canvasIcons = [];

  function addCanvasMarker() {
    const cities = [
      { name: "成都", latlng: [30.661057, 104.081757] },
      { name: "重庆", latlng: [29.558176, 106.510338] },
      { name: "长沙", latlng: [28.200825, 112.98127] }
    ];

    for (const i in cities) {
      const city = cities[i];
      // 必须每次都创建一个新的canvas对象
      const canvasIcon = createCanvasIcon();

      const marker = GMap.marker(city.latlng, {
        riseOnHover: true,
        icon: canvasIcon
      }).bindPopup("<h4>" + city.name + "</h4>");
      marker.addTo(_drawnItems);

      // 保存canvas对象，便于changeMarkerColor函数对canvas对象做重新绘制。非必要
      _canvasIcons.push(canvasIcon);
    }

    _map.flyTo([28.200825, 112.98127], 5);
  }

  function drawCanvasMarker() {
    const canvasIcon = createCanvasIcon();
    const drawer = new GMap.Draw.Marker(_map, {
      icon: canvasIcon,
      riseOnHover: true
    });
    drawer.enable();

    // 保存canvas对象，便于changeMarkerColor函数对canvas对象做重新绘制。非必要
    _canvasIcons.push(canvasIcon);
  }

  function createCanvasIcon() {
    // 创建一个Canvas对象，并将其作为 GMap.canvasIcon 的参数
    const cnvs = document.createElement("canvas");
    // 这里一定要指定一个size值，不然默认的canvas大小显示有问题
    cnvs.width = 10;
    cnvs.height = 10;
    const ctx = cnvs.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0, 0, 10, 10);

    const icon = GMap.canvasIcon({
      canvas: cnvs,
      iconSize: [10, 10],
      iconAnchor: [5, 5]
    });

    return icon;
  }

  // 通过重新绘制 Canvas 实现 Marker 的显示样式
  function changeMarkerColor() {
    for (let i = 0; i < _canvasIcons.length; i++) {
      const canvas = _canvasIcons[i].options.canvas;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#0000FF";
      ctx.fillRect(0, 0, 10, 10);
    }
  }

  function onClickActive(evt) {
    const layer = evt.target;
    const icon = layer.options.icon;
    const gid = icon.options.keyid;
    const obj = {};
    obj.gid = gid;
    const style = icon.options.style;
    window.showEditPage(1, obj, style);
  }

  // 根据各个经纬度的点用实线连接
  function editPolyline() {
    const latlngs = [
      [30.661057, 104.081757],
      [29.558176, 106.510338],
      [28.200825, 112.98127],
      [30.567514, 114.291939],
      [31.863255, 117.275703],
      [31.106981, 121.37156]
    ];
    const polyline = GMap.polyline(latlngs, {
      color: "red",
      weight: 4,
      opacity: 0.6
    }).addTo(_map);
    _map.fitBounds(polyline.getBounds());
    polyline.editing.enable();
    _editing_feature = polyline;
  }

  //根据各个经纬度的点用虚线连接
  function addDashedPolyline() {
    var latlngs = [
      [29.561057, 104.081757],
      [28.458176, 106.510338],
      [27.100825, 112.98127],
      [29.467514, 114.291939],
      [30.763255, 117.275703],
      [30.006981, 121.37156]
    ];
    var polyline = GMap.polyline(latlngs, {
      color: "red",
      weight: 4,
      opacity: 0.6,
      lineCap: "butt", // 可选项 butt, round, square
      lineJoin: "round", // 可选项 miter, round, bevel
      dashArray: "10,10" // 设置虚线的线型，4个像素的虚线接4个像素的空白
    }).addTo(_map);
    _map.fitBounds(polyline.getBounds());
  }

  // 给Marker添加弹出窗\可拖拽
  function popupOnMarker() {
    const latlng = [23.118912, 113.261429];
    const marker = GMap.marker(latlng, {
      title: "广州", // 鼠标停留在Marker上时显示的文字
      draggable: true // 可拖拽
    });
    marker.bindPopup('<p><div style="color:#cc0033">广州欢迎您!</div></p>');
    marker.addTo(_map);
  }

  function openJB() {
    window.showSymbolPanel(150, 750); // y , x
  }

  //让Marker运动起来
  function addMarker() {
    // -------------- 简单设置示例----------------
    // 定义移动线路
    //         var route1 = [
    //             [29.558176, 106.510338],
    //             [28.200825, 112.98127],
    //             [30.567514, 114.291939],
    //             [31.863255, 117.275703],
    //             [31.106981, 121.37156]
    //         ];
    //         // 在地图上绘制路线1
    //         GMap.polyline(route1, {color: 'red'}).addTo(_map);
    //         // 添加按指定链路移动的marker
    //         var marker1 = GMap.Marker.movingMarker(
    //             route1, // 参数1: 移动的线路
    //             15000,   // 参数2: 完成移动效果的时间，单位ms
    //             {
    //                 autostart: true // 参数3: 添加后直接开始移动效果
    //             }
    //         ).addTo(_map);

    // -------------- 详细设置示例----------------
    // 定义移动线路
    var route2 = [
      [29.561057, 104.081757],
      [28.458176, 106.510338],
      [27.100825, 112.98127],
      [29.467514, 114.291939],
      [30.763255, 117.275703],
      [30.006981, 121.37156]
    ];

    // 自定义marker样式
    var gifIcon = GMap.icon({
      iconUrl: "/images/plane_blue.png",
      iconSize: [60, 60],
      iconAnchor: [30, 60],
      popupAnchor: [0, -65]
    });

    // 在地图上绘制路线2
    // GMap.polyline(route2).addTo(_map);
    GMap.polyline(route2, {
      color: "red",
      weight: 4,
      opacity: 0.6,
      lineCap: "butt", // 可选项 butt, round, square
      lineJoin: "round", // 可选项 miter, round, bevel
      dashArray: "10,10" // 设置虚线的线型，4个像素的虚线接4个像素的空白
    }).addTo(_map);
    var marker2 = GMap.Marker.movingMarker(
      route2, // 设置移动路线
      10000, // 分别设置每一段路线移动用的时间
      {
        //icon: soldierIcon // 自定义marker样式
        icon: gifIcon // 自定义marker样式
      }
    ).addTo(_map);

    marker2.bindPopup("<b>点击开始移动</b>").openPopup();
    // 设置marker的点击事件相应函数
    marker2.once("click", function() {
      // 开始移动。其它几个常用接口包括 stop(), pause(), resume()
      marker2.start();
      marker2.closePopup(); // 关闭之前的消息窗
      marker2.unbindPopup(); // 解除之前绑定的消息窗
      marker2.on("click", function() {
        // 判断marker的状态。其它几个常用接口isPaused(), isEnded(), isStarted()
        if (marker2.isRunning()) {
          marker2.pause();
        } else {
          marker2.start();
        }
      });

      // 两秒后弹出一个提示信息
      setTimeout(function() {
        marker2.bindPopup("<b>点击暂停移动</b>").openPopup();
      }, 2000);
    });

    // 设置移动结束事件的处理函数
    marker2.on("end", function() {
      // 移动结束时，显示一个提示信息
      marker2
        .bindPopup("<b>到达终点</b>", {
          closeOnClick: false
        })
        .openPopup();
    });

    //_map.fitBounds(route1);
  }

  // function initJB() {
  //   if(gDrawHelper==null) {
  //     gDrawHelper=new DrawHelper("./plot/France_Symbol.ttf", _map);
  //     // 设置面板缺省标绘参数
  //     var defSymobj=new DrawHelper.CgsSymbol( {
  //         annoText:"ssssssx",
  //         fill:"#00ff00",
  //         color:"#ff0000",
  //         strokeWidth:1,
  //         width:100,
  //         height:100,
  //         anchor:"BOTTOM",
  //         annoVisibility:true,
  //         annoTextSize:20,
  //         annoTextOffset:{x:0,y:0},
  //       });
  //     gDrawHelper.setDefStyle(defSymobj);
  //   }
  // }

  // loadContextMenuPlugin();
  loadMap();
  return {
    drawMarker,
    drawPolyline,
    drawPolygon,
    drawCircle,
    drawRectangle,
    createCustomIcon,
    removeAll,
    editMarker,
    editPolygon,
    editPolyline,
    editCircle,
    editRectangle,
    saveEditing,
    addCanvasMarker,
    drawCanvasMarker,
    createCanvasIcon,
    changeMarkerColor,
    onClickActive,
    popupOnMarker,
    openJB,
    addDashedPolyline,
    addMarker
  };
}

// export function openJB() {
//   window.showSymbolPanel(50, 50);
// }
