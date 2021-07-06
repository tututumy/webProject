import React, { Component, Fragment } from "react";
import styleChart from "./chart.less";
// 引入 ECharts 主模块
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
import { Spin } from "antd";
import Fieldset from "../../utils/Fieldset/Fieldset";

@connect(({ language, loading, radarModel }) => ({
  language,
  loading,
  radarModel
}))
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

  componentDidUpdate() {
    let html1 = ``;
    let html2 = ``;
    html1 = `
        <div id="chartBox${this.props.activeKey}" className=${
      styleChart.chartBoxMax
    }>
            <div id="chartA${this.props.activeKey}"></div>
            <div id="chartB${this.props.activeKey}"></div>
            <div id="chartC${this.props.activeKey}"></div>
            <div id="chartD${this.props.activeKey}"></div>
            <div id="chartE${this.props.activeKey}"></div>
            <div id="chartF${this.props.activeKey}"></div>
            <div id="chartG${this.props.activeKey}"></div>
            <div id="chartH${this.props.activeKey}"></div>
        </div>
        `;
    html2 = `
        <div id="chartBox${this.props.activeKey}" className=${
      styleChart.chartBoxMax
    }>
            <div id="chartI${this.props.activeKey}"></div>
            <div id="chartJ${this.props.activeKey}"></div>
            <div id="chartK${this.props.activeKey}"></div>
            <div id="chartL${this.props.activeKey}"></div>
        </div>
        `;
    document.getElementById("chartBoxWrap1").innerHTML = html1; //将前8个图表放到脉内分析框中
    document.getElementById("chartBoxWrap2").innerHTML = html2; //将后4个图表放到脉间分析框中

    var arrChartsData = []; //所有的图表的数据 eg:有3个图表，数组中就有3组数据
    var xAxisData = []; //每一组数据的横坐标
    var data = []; //每一组数据的纵坐标
    for (let i = 0; i < 12; i++) {
      xAxisData.push([]);
      data.push([]);
    }

    if (this.props.chartsData[[this.props.activeKey]]) {
      for (let i = 0; i < 12; i++) {
        //数组存放12个数据源
        arrChartsData.push(
          this.props.chartsData[[this.props.activeKey]][i]
            ? this.props.chartsData[[this.props.activeKey]][i]
            : []
        );
      }
    }
    if (arrChartsData && arrChartsData.length > 0) {
      //遍历12个数据源，存放12个数据源中的横坐标和纵坐标的值
      for (let i = 0; i < arrChartsData.length; i++) {
        for (let j = 0; j < arrChartsData[i].length; j++) {
          xAxisData[i].push(arrChartsData[i][j].X);
          data[i].push(arrChartsData[i][j].Y);
        }
      }

      // 基于准备好的dom，初始化echarts实例渲染时域波形图
      var chartA = echarts.init(
        document.getElementById(`chartA${this.props.activeKey}`),
        "dark"
      );
      var chartB = echarts.init(
        document.getElementById(`chartB${this.props.activeKey}`),
        "dark"
      );
      var chartC = echarts.init(
        document.getElementById(`chartC${this.props.activeKey}`),
        "dark"
      );
      var chartD = echarts.init(
        document.getElementById(`chartD${this.props.activeKey}`),
        "dark"
      );
      var chartE = echarts.init(
        document.getElementById(`chartE${this.props.activeKey}`),
        "dark"
      );
      var chartF = echarts.init(
        document.getElementById(`chartF${this.props.activeKey}`),
        "dark"
      );
      var chartG = echarts.init(
        document.getElementById(`chartG${this.props.activeKey}`),
        "dark"
      );
      var chartH = echarts.init(
        document.getElementById(`chartH${this.props.activeKey}`),
        "dark"
      );
      var chartI = echarts.init(
        document.getElementById(`chartI${this.props.activeKey}`),
        "dark"
      );
      var chartJ = echarts.init(
        document.getElementById(`chartJ${this.props.activeKey}`),
        "dark"
      );
      var chartK = echarts.init(
        document.getElementById(`chartK${this.props.activeKey}`),
        "dark"
      );
      var chartL = echarts.init(
        document.getElementById(`chartL${this.props.activeKey}`),
        "dark"
      );

      this.charting(
        chartA,
        xAxisData[0],
        data[0],
        language[`AmplitudeTimeDiagram_${this.props.language.getlanguages}`],
        "μs",
        ""
      );
      this.charting(
        chartB,
        xAxisData[1],
        data[1],
        language[`FrequencyTimeDiagram_${this.props.language.getlanguages}`],
        "μs",
        "MHz"
      );
      this.charting(
        chartC,
        xAxisData[2],
        data[2],
        language[`PhaseTimeDiagram_${this.props.language.getlanguages}`],
        "μs",
        "°"
      );
      this.charting(
        chartD,
        xAxisData[3],
        data[3],
        language[`EnvelopeTimeDiagram_${this.props.language.getlanguages}`],
        "μs",
        ""
      );
      this.charting(
        chartE,
        xAxisData[4],
        data[4],
        language[`PowerMap_${this.props.language.getlanguages}`],
        "MHz",
        "dB"
      );
      this.charting(
        chartF,
        xAxisData[5],
        data[5],
        language[`Spectrogram_${this.props.language.getlanguages}`],
        "MHz",
        "dB"
      );
      this.charting(
        chartG,
        xAxisData[6],
        data[6],
        language[`STFTChart_${this.props.language.getlanguages}`],
        "MHz",
        "dB"
      );
      this.charting(
        chartH,
        xAxisData[7],
        data[7],
        language[`STFTOverlay_${this.props.language.getlanguages}`],
        "MHz",
        "dB"
      );
      this.charting(
        chartI,
        xAxisData[8],
        data[8],
        language[`FrequencyTimeDiagram_${this.props.language.getlanguages}`],
        "μs",
        "MHz"
      );
      this.charting(
        chartJ,
        xAxisData[9],
        data[9],
        language[`PulseWidthTimeDiagram_${this.props.language.getlanguages}`],
        "μs",
        "μs"
      );
      this.charting(
        chartK,
        xAxisData[10],
        data[10],
        language[`AmplitudeTimeDiagram_${this.props.language.getlanguages}`],
        "μs",
        "dB"
      );
      this.charting(
        chartL,
        xAxisData[11],
        data[11],
        language[
          `PulseIntervalTimeDiagram_${this.props.language.getlanguages}`
        ],
        "μs",
        "μs"
      );
    }
  }

  //封装一个绘制图表的方法，绘制图形时调用它
  charting = (chartElement, xAxisData, data, title, xUnit, yUnit) => {
    var timeoption = {
      // 图表标题
      title: {
        left: "center",
        text: title
      },
      toolbox: {
        right: "90%"
      },
      tooltip: {
        trigger: "axis"
      },
      grid: {
        left: "80",
        right: "60",
        buttom: "10"
      },
      xAxis: {
        name: xUnit,
        nameLocation: "end",
        nameTextStyle: {
          fontSize: 16
        },
        type: "category",
        data: xAxisData
      },
      yAxis: {
        name: yUnit,
        nameLocation: "end",
        nameTextStyle: {
          fontSize: 16
        },
        type: "value",
        scale: true
      },
      series: [
        {
          type: "line",
          smooth: true,
          data: data,
          itemStyle: {
            normal: {
              color: "rgba(0, 255, 0, 0.8)",
              lineStyle: {
                color: "rgba(0, 255, 0, 0.8)"
              }
            }
          }
        }
      ]
    };
    chartElement.setOption(timeoption); //使用刚指定的配置项和数据显示图表
  };

  render() {
    return (
      <Fragment>
        <Spin
          spinning={
            this.props.loading.effects[
              "radarModel/selectInsertFromTargetChartsMsg"
            ] ||
            (this.props.loading.effects["radarModel/updateAndSelectChartsData"]
              ? true
              : false)
          }
          // size="large"
        >
          {/* <div id="chartBoxWrap" className={styleChart.chartBoxWrap_box}> */}
          <div style={{ margin: "10px" }}>
            <Fieldset
              legend={language[`IntrapulseAnalysis_${this.props.language.getlanguages}`]}
              content={
                <div
                  id="chartBoxWrap1"
                  className={styleChart.chartBoxWrap_box}
                />
              }
            />
            <div />
            <Fieldset
              legend={language[`InterveinalAnalysis_${this.props.language.getlanguages}`]}
              content={
                <div
                  id="chartBoxWrap2"
                  className={styleChart.chartBoxWrap_box}
                />
              }
            />
          </div>
        </Spin>
      </Fragment>
    );
  }
}
