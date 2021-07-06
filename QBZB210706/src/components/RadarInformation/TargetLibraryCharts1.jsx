import React, { Component, Fragment } from "react";
import style from "./Edit.css";
import styleChart from "./chart.less";
//引入 ECharts 主模块
import echarts from "echarts";
import "echarts/lib/chart/bar"; //引入柱状图
import "echarts/lib/chart/line"; //引入折线图
import "echarts/lib/component/legend"; //引入工具图表
import "echarts/lib/component/toolbox"; //引入工具栏
// 引入提示框和标题组件
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import { connect } from "dva";
import language from "../language/language";
import { Chart } from "@antv/g2";

@connect(({ language }) => ({ language }))
export default class Charts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectedRowKeysZC: "",
      selectedRowKeysZCName: "",
      data1: null,
      activeKey: ""
    };
  }
  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
      selectedRowKeysZC: ""
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  // shouldComponentUpdate(nextProps, nextState) {
  //     console.log("nextProps===", nextProps)
  //     console.log("this.props.chartsData[[this.props.activeKey]]===", this.props.chartsData[[this.props.activeKey]])
  //     let target = nextProps.chartsData ? nextProps.chartsData[1] : null;
  //     let origin = this.props.chartsData[[this.props.activeKey]];
  //     compare(origin, target);
  //     function compare(origin, target) {
  //         if (typeof target !== "object") {
  //             //target不是对象/数组
  //             return true; //直接返回全等的比较结果
  //         }

  //         if (typeof origin !== "object") {
  //             //origin不是对象/数组
  //             return true; //直接返回false
  //         }
  //         for (let key of Object.keys(target)) {
  //             //遍历target的所有自身属性的key
  //             if (!compare(origin[key], target[key])) {
  //                 //递归比较key对应的value，
  //                 //value不等，则两对象不等，结束循环，退出函数，返回false
  //                 return true;
  //             }
  //         }
  //         //遍历结束，所有value都深度比较相等，则两对象相等
  //         return false;
  //     }
  // }

  // componentDidUpdate() {
  //     console.log("this.props.chartsData", this.props.chartsData)
  //     console.log("this.props.activeKey", this.props.activeKey)

  //     //因为图表需要使用id创建，不同的tab页的图表id不能相同，所以根据tab的当前页的key动态创建页面元素
  //     let html = ``;
  //     html = `<div className=${styleChart.chartBoxMax}>
  //                      <div>
  //                          <h3>幅度-时间图</h3>
  //                          <div id="chartA${this.props.activeKey}"></div>
  //                      </div>
  //                      <div>
  //                          <h3>频率-时间图</h3>
  //                          <div id="chartB${this.props.activeKey}"></div>
  //                      </div>
  //                      <div>
  //                          <h3>相位-时间图</h3>
  //                          <div id="chartC${this.props.activeKey}"></div>
  //                      </div>
  //                      <div>
  //                          <h3>包络-时间图</h3>
  //                          <div id="chartD${this.props.activeKey}"></div>
  //                      </div>
  //                      <div>
  //                          <h3>功率图谱</h3>
  //                          <div id="chartE${this.props.activeKey}"></div>
  //                      </div>
  //                      <div>
  //                          <h3>频谱图</h3>
  //                          <div id="chartF${this.props.activeKey}"></div>
  //                      </div>
  //                      <div>
  //                          <h3>STFT图</h3>
  //                          <div id="chartG${this.props.activeKey}"></div>
  //                      </div>
  //                      <div>
  //                          <h3>STFT叠加图</h3>
  //                          <div id="chartH${this.props.activeKey}"></div>
  //                      </div>
  //                      <div>
  //                          <h3>频率-时间图</h3>
  //                          <div id="chartI${this.props.activeKey}"></div>
  //                      </div>
  //                      <div>
  //                          <h3>脉宽-时间图</h3>
  //                          <div id="chartJ${this.props.activeKey}"></div>
  //                      </div>
  //                      <div>
  //                          <h3>幅度-时间图</h3>
  //                          <div id="chartK${this.props.activeKey}"></div>
  //                      </div>
  //                      <div>
  //                          <h3>脉冲间隔-时间图</h3>
  //                          <div id="chartL${this.props.activeKey}"></div>
  //                      </div>
  //                  </>
  //             `
  //     document.getElementById("chartBoxWrap").innerHTML = html;

  //     if (this.props.chartsData && this.props.chartsData[[this.props.activeKey]]) {
  //         let data1 = this.props.chartsData[[this.props.activeKey]][0];
  //         let data2 = this.props.chartsData[[this.props.activeKey]][1];
  //         let data3 = this.props.chartsData[[this.props.activeKey]][2];
  //         let data4 = this.props.chartsData[[this.props.activeKey]][3];
  //         let data5 = this.props.chartsData[[this.props.activeKey]][4];
  //         let data6 = this.props.chartsData[[this.props.activeKey]][5];
  //         let data7 = this.props.chartsData[[this.props.activeKey]][6];
  //         let data8 = this.props.chartsData[[this.props.activeKey]][7];
  //         let data9 = this.props.chartsData[[this.props.activeKey]][8];
  //         let data10 = this.props.chartsData[[this.props.activeKey]][9];
  //         let data11 = this.props.chartsData[[this.props.activeKey]][10];
  //         let data12 = this.props.chartsData[[this.props.activeKey]][11];
  //         data1 ? this.Charting(data1, `chartA${this.props.activeKey}`, "us", "") : null;
  //         data2 ? this.Charting(data2, `chartB${this.props.activeKey}`, "us", "MHz") : null;
  //         data3 ? this.Charting(data3, `chartC${this.props.activeKey}`, "us", "°") : null;
  //         data4 ? this.Charting(data4, `chartD${this.props.activeKey}`, "us", "") : null;
  //         data5 ? this.Charting(data5, `chartE${this.props.activeKey}`, "MHz", "dB") : null;
  //         data6 ? this.Charting(data6, `chartF${this.props.activeKey}`, "Mhz", "dB") : null;
  //         data7 ? this.Charting(data7, `chartG${this.props.activeKey}`,  "Mhz", "dB") : null;
  //         data8 ? this.Charting(data8, `chartH${this.props.activeKey}`, "Mhz", "dB") : null;
  //         data9 ? this.Charting(data9, `chartI${this.props.activeKey}`, "us", "MHz") : null;
  //         data10 ? this.Charting(data10, `chartJ${this.props.activeKey}`, "us", "us") : null;
  //         data11 ? this.Charting(data11, `chartK${this.props.activeKey}`, "us", "dB") : null;
  //         data12 ? this.Charting(data12, `chartL${this.props.activeKey}`, "us", "us") : null;
  //     }
  //     //     console.log("this.props.activeKey",this.props.activeKey)

  //     // let html = ``;
  //     // html = `<div id="chartBox${this.props.activeKey}" >
  //     //                 <div id="freq${this.props.activeKey}"></div>
  //     //                 <div id="time${this.props.activeKey}"></div>
  //     //             </div>
  //     //            `
  //     // document.getElementById("chartBoxWrap").innerHTML = html;
  //     // var freq = echarts.init(document.getElementById(`freq${this.props.activeKey}`));
  //     // var xAxisData1 = [];
  //     // var xAxisData2 = [];
  //     // var data1 = [];
  //     // var data2 = [];
  //     // let arr = []; let arr2 = [];
  //     // if (this.props.chartsData[[this.props.activeKey]]) {
  //     //     arr = this.props.chartsData[[this.props.activeKey]][0]
  //     // }
  //     // if (this.props.chartsData[[this.props.activeKey]]) {
  //     //     arr2 = this.props.chartsData[[this.props.activeKey]][1]
  //     // }
  //     // if (arr && arr.length > 0) {
  //     //     for (let i = 0; i < arr.length; i++) {
  //     //         xAxisData1.push(arr[i].X);//频谱图
  //     //         data1.push(arr[i].Y)
  //     //     }

  //     //     for (let i = 0; i < arr2.length; i++) {
  //     //         xAxisData2.push(arr2[i].X);//波形图
  //     //         data2.push(arr2[i].Y)
  //     //     }
  //     //     var freqoption = {
  //     //         title: {
  //     //             x: 'right',
  //     //             y: 'top',
  //     //             text: language[`Spectrogram_${this.props.language.getlanguages}`],
  //     //             top: '100px',
  //     //             left: '93%',
  //     //             textStyle: {
  //     //                 fontSize: 18,
  //     //                 fontWeight: 'bold',
  //     //                 color: '#333'
  //     //             }
  //     //         },
  //     //         toolbox: {
  //     //             right: '90%',
  //     //             feature: {
  //     //                 saveAsImage: {
  //     //                     pixelRatio: 2
  //     //                 }
  //     //             }
  //     //         },
  //     //         tooltip: {},
  //     //         xAxis: {
  //     //             data: xAxisData1,
  //     //             silent: false,
  //     //             splitLine: {
  //     //                 show: false
  //     //             }
  //     //         },
  //     //         yAxis: {
  //     //         },
  //     //         series: [{//系列列表。每个系列通过 type 决定自己的图表类型,这里为柱形图
  //     //             name: 'bar',
  //     //             type: 'bar',
  //     //             barWidth: '1px',
  //     //             data: data1,
  //     //         }],
  //     //     };
  //     //     freq.setOption(freqoption);
  //     //     // 基于准备好的dom，初始化echarts实例渲染时域波形图
  //     //     var time = echarts.init(document.getElementById(`time${this.props.activeKey}`));
  //     //     // 绘制图表

  //     //     // for (let i = 0; i < 100; i++) {
  //     //     //     xAxisData2.push('type' + i);
  //     //     //     data12.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
  //     //     // }
  //     //     var timeoption = {
  //     //         // 图表标题
  //     //         title: {
  //     //             //时域波形图
  //     //             text: language[`TimeDomainWaveform_${this.props.language.getlanguages}`],
  //     //             x: 'right',
  //     //             y: 'top',
  //     //             top: '100px',
  //     //             left: '93%',
  //     //             textStyle: {
  //     //                 fontSize: 18,
  //     //                 fontWeight: 'bold',
  //     //                 color: '#333'
  //     //             }
  //     //         },
  //     //         toolbox: {
  //     //             right: '90%',
  //     //             feature: {
  //     //                 saveAsImage: {//保存为图片。
  //     //                     pixelRatio: 2//保存图片的分辨率，值大于1则表示提高了保存图片的分辨率
  //     //                 }
  //     //             }
  //     //         },
  //     //         tooltip: {},
  //     //         xAxis: {
  //     //             type: 'category',
  //     //             data: xAxisData2,
  //     //         },
  //     //         yAxis: {
  //     //             type: 'value'
  //     //         },
  //     //         series: [{
  //     //             type: 'line',
  //     //             smooth: true,
  //     //             data: data2,
  //     //         }],
  //     //     };
  //     //     time.setOption(timeoption);    //使用刚指定的配置项和数据显示图表
  //     // }

  // }

  componentDidMount() {
    this.props.onRef(this);
  }

  handleCharting = (data, activeKey) => {
    console.log("aaaaaaaaaaadata", data);
    console.log("aaaaaaaaaaaactiveKey", activeKey);
    //因为图表需要使用id创建，不同的tab页的图表id不能相同，所以根据tab的当前页的key动态创建页面元素
    let html = `
            <div>
                <h3>幅度-时间图</h3>
                <div id="chartA${activeKey}"></div>
            </div>
            <div>
                <h3>频率-时间图</h3>
                <div id="chartB${activeKey}"></div>
            </div>
            <div>
                <h3>相位-时间图</h3>
                <div id="chartC${activeKey}"></div>
            </div>
            <div>
                <h3>包络-时间图</h3>
                <div id="chartD${activeKey}"></div>
            </div>
            <div>
                <h3>功率图谱</h3>
                <div id="chartE${activeKey}"></div>
            </div>
            <div>
                <h3>频谱图</h3>
                <div id="chartF${activeKey}"></div>
            </div>
            <div>
                <h3>STFT图</h3>
                <div id="chartG${activeKey}"></div>
            </div>
            <div>
                <h3>STFT叠加图</h3>
                <div id="chartH${activeKey}"></div>
            </div>
            <div>
                <h3>频率-时间图</h3>
                <div id="chartI${activeKey}"></div>
            </div>
            <div>
                <h3>脉宽-时间图</h3>
                <div id="chartJ${activeKey}"></div>
            </div>
            <div>
                <h3>幅度-时间图</h3>
                <div id="chartK${activeKey}"></div>
            </div>
            <div>
                <h3>脉冲间隔-时间图</h3>
                <div id="chartL${activeKey}"></div>
            </div>
            `;
    document.getElementById("chartBoxMax").innerHTML = html;

    console.log("rrrrrrrrrr", document.getElementById("chartA1"));

    let data1 = data["波形数据_雷抗"]["幅度时间图"];
    // let data2 = this.props.chartsData[[this.props.activeKey]][1];
    // let data3 = this.props.chartsData[[this.props.activeKey]][2];
    // let data4 = this.props.chartsData[[this.props.activeKey]][3];
    // let data5 = this.props.chartsData[[this.props.activeKey]][4];
    // let data6 = this.props.chartsData[[this.props.activeKey]][5];
    // let data7 = this.props.chartsData[[this.props.activeKey]][6];
    // let data8 = this.props.chartsData[[this.props.activeKey]][7];
    // let data9 = this.props.chartsData[[this.props.activeKey]][8];
    // let data10 = this.props.chartsData[[this.props.activeKey]][9];
    // let data11 = this.props.chartsData[[this.props.activeKey]][10];
    // let data12 = this.props.chartsData[[this.props.activeKey]][11];

    data1 ? this.Charting(data1, "chartA" + activeKey, "us", "") : "";
    // data2 ? this.Charting(data2, `chartB${ this.props.activeKey } `, "us", "MHz") : null;
    // data3 ? this.Charting(data3, `chartC${ this.props.activeKey } `, "us", "°") : null;
    // data4 ? this.Charting(data4, `chartD${ this.props.activeKey } `, "us", "us", "") : null;
    // data5 ? this.Charting(data5, `chartE${ this.props.activeKey } `, "MHz", "dB") : null;
    // data6 ? this.Charting(data6, `chartF${ this.props.activeKey } `, "Mhz", "dB") : null;
    // data7 ? this.Charting(data7, `chartG${ this.props.activeKey } `, "us", "Mhz", "dB") : null;
    // data8 ? this.Charting(data8, `chartH${ this.props.activeKey } `, "us", "Mhz", "dB") : null;
    // data9 ? this.Charting(data9, `chartI${ this.props.activeKey } `, "us", "MHz") : null;
    // data10 ? this.Charting(data10, `chartJ${ this.props.activeKey } `, "us", "us") : null;
    // data11 ? this.Charting(data11, `chartK${ this.props.activeKey } `, "us", "dB") : null;
    // data12 ? this.Charting(data12, `chartL${ this.props.activeKey } `, "us", "us") : null;
  };

  //封装一个绘制图表的函数
  Charting = (data, chartId, XUnit, YUnit) => {
    console.log("chartId====", chartId);
    // Step 1: 创建 Chart 对象
    const chart = new Chart({
      container: chartId, // 指定图表容器 ID
      width: 450, // 指定图表宽度
      height: 200, // 指定图表高度
      // theme: 'dark'
      theme: {
        defaultColor: "red"
      } // 修改内置主题的某些配置
    });

    // Step 2: 载入数据源
    chart.data(data);

    // 配置 title 样式
    chart.axis("x", {
      title: {
        style: {
          fill: "red",
          fontSize: "20px"
        }
      }
    });

    //设置标题
    chart.scale("X", {
      alias: XUnit ? XUnit : null
    });
    chart.scale("Y", {
      alias: YUnit ? YUnit : null
    });
    chart.axis("X", {
      title: {
        style: {
          fill: "#fff"
        }
      }
    });
    chart.axis("Y", {
      title: {
        style: {
          fill: "#fff"
        }
      }
    });

    chart.clear();

    // Step 3: 创建图形语法，绘制柱状图
    chart
      .line()
      .position("X*Y")
      .color("#00ff00");

    // Step 4: 渲染图表
    chart.render();
  };

  render() {
    return (
      <Fragment>
        <div className={styleChart.chartBoxWrap}>
          {/* 创建图表容器 */}
          <div className={styleChart.chartBoxMax} id="chartBoxMax">
            {/* <div>
                            <h3>幅度-时间图</h3>
                            <div id="chart1"></div>
                        </div>
                        <div>
                            <h3>频率-时间图</h3>
                            <div id="chart2"></div>
                        </div>
                        <div>
                            <h3>相位-时间图</h3>
                            <div id="chart3"></div>
                        </div>
                        <div>
                            <h3>包络-时间图</h3>
                            <div id="chart4"></div>
                        </div>
                        <div>
                            <h3>功率图谱</h3>
                            <div id="chart5"></div>
                        </div>
                        <div>
                            <h3>频谱图</h3>
                            <div id="chart6"></div>
                        </div>
                        <div>
                            <h3>STFT图</h3>
                            <div id="chart7"></div>
                        </div>
                        <div>
                            <h3>STFT叠加图</h3>
                            <div id="chart8"></div>
                        </div>
                        <div>
                            <h3>频率-时间图</h3>
                            <div id="chart9"></div>
                        </div>
                        <div>
                            <h3>脉宽-时间图</h3>
                            <div id="chart10"></div>
                        </div>
                        <div>
                            <h3>幅度-时间图</h3>
                            <div id="chart11"></div>
                        </div>
                        <div>
                            <h3>脉冲间隔-时间图</h3>
                            <div id="chart12"></div>
                        </div> */}
          </div>
        </div>
      </Fragment>
    );
  }
}
