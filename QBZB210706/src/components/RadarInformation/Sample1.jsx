import React, { Component, Fragment } from "react";
import style from "./Edit.css";
import styleless from "./test.less";
import styleChart from "./chart.less";
import { Table, Button, Input } from "antd";
import Dialog from "../../utils/DialogMask/Dialog";
import { connect } from "dva";
import language from "../language/language";
import { Chart } from "@antv/g2";
import Fieldset from "../../utils/Fieldset/Fieldset";
// 引入 ECharts 主模块
import echarts from "echarts";
import "echarts/lib/chart/bar"; //引入柱状图
import "echarts/lib/chart/line"; //引入折线图
import "echarts/lib/component/legend"; //引入工具图表
import "echarts/lib/component/toolbox"; //引入工具栏
// 引入提示框和标题组件
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";

@connect(({ language, radarModel }) => ({ language, radarModel }))
class Sample1 extends Component {
  constructor() {
    super();
    this.state = {
      visible: false
    };
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  UNSAFE_componentWillReceiveProps({ radarModel }) {
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
    document.getElementById("chartBoxWrap1").innerHTML = html1;
    document.getElementById("chartBoxWrap2").innerHTML = html2;

    var arrChartsData = [];
    var xAxisData = [];
    var data = [];
    for (let i = 0; i < 12; i++) {
      xAxisData.push([]);
      data.push([]);
    }

    if (
      radarModel.ZCSignMsg_data &&
      radarModel.ZCSignMsg_data["波形数据_雷抗"]
    ) {
      console.log("幅度时间图", radarModel.ZCSignMsg_data);
      let data1 = radarModel.ZCSignMsg_data["波形数据_雷抗"]["幅度时间图"];
      let data2 = radarModel.ZCSignMsg_data["波形数据_雷抗"]["频率时间图"];
      let data3 = radarModel.ZCSignMsg_data["波形数据_雷抗"]["相位时间图"];
      let data4 = radarModel.ZCSignMsg_data["波形数据_雷抗"]["包络时间图"];
      let data5 = radarModel.ZCSignMsg_data["波形数据_雷抗"]["功率谱图"];
      let data6 = radarModel.ZCSignMsg_data["波形数据_雷抗"]["频谱图"];
      let data7 = radarModel.ZCSignMsg_data["波形数据_雷抗"]["STFT图"];
      let data8 = radarModel.ZCSignMsg_data["波形数据_雷抗"]["STFT叠加图"];
      let data9 = radarModel.ZCSignMsg_data["全脉冲序列"]["频率时间图"];
      let data10 = radarModel.ZCSignMsg_data["全脉冲序列"]["脉宽时间图"];
      let data11 = radarModel.ZCSignMsg_data["全脉冲序列"]["幅度时间图"];
      let data12 = radarModel.ZCSignMsg_data["全脉冲序列"]["脉冲间隔时间图"];

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
        this.getX(data1),
        this.getY(data1),
        language[`AmplitudeTimeDiagram_${this.props.language.getlanguages}`],
        "μs",
        ""
      );
      this.charting(
        chartB,
        this.getX(data2),
        this.getY(data2),
        language[`FrequencyTimeDiagram_${this.props.language.getlanguages}`],
        "μs",
        "MHz"
      );
      this.charting(
        chartC,
        this.getX(data3),
        this.getY(data3),
        language[`PhaseTimeDiagram_${this.props.language.getlanguages}`],
        "μs",
        "°"
      );
      this.charting(
        chartD,
        this.getX(data4),
        this.getY(data4),
        language[`EnvelopeTimeDiagram_${this.props.language.getlanguages}`],
        "μs",
        ""
      );
      this.charting(
        chartE,
        this.getX(data5),
        this.getY(data5),
        language[`PowerMap_${this.props.language.getlanguages}`],
        "MHz",
        "dB"
      );
      this.charting(
        chartF,
        this.getX(data6),
        this.getY(data6),
        language[`Spectrogram_${this.props.language.getlanguages}`],
        "MHz",
        "dB"
      );
      this.charting(
        chartG,
        this.getX(data7),
        this.getY(data7),
        language[`STFTChart_${this.props.language.getlanguages}`],
        "MHz",
        "dB"
      );
      this.charting(
        chartH,
        this.getX(data8),
        this.getY(data8),
        language[`STFTOverlay_${this.props.language.getlanguages}`],
        "MHz",
        "dB"
      );
      this.charting(
        chartI,
        this.getX(data9),
        this.getY(data9),
        language[`FrequencyTimeDiagram_${this.props.language.getlanguages}`],
        "μs",
        "MHz"
      );
      this.charting(
        chartJ,
        this.getX(data10),
        this.getY(data10),
        language[`PulseWidthTimeDiagram_${this.props.language.getlanguages}`],
        "μs",
        "μs"
      );
      this.charting(
        chartK,
        this.getX(data11),
        this.getY(data11),
        language[`AmplitudeTimeDiagram_${this.props.language.getlanguages}`],
        "μs",
        "dB"
      );
      this.charting(
        chartL,
        this.getX(data12),
        this.getY(data12),
        language[
          `PulseIntervalTimeDiagram_${this.props.language.getlanguages}`
        ],
        "μs",
        "μs"
      );
    }
  }

  getX = arr => {
    let xArr = [];
    if(arr){
      for (let i = 0; i < arr.length; i++) {
        xArr.push(arr[i].X);
      }
    }
    return xArr;
  };

  getY = arr => {
    let getY = [];
    if(arr){
      for (let i = 0; i < arr.length; i++) {
        getY.push(arr[i].Y);
      }
    }
    return getY;
  };

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
    const paginationPropsnum = {
      pageSize: 3
    };
    // const Option = Select.Option;
    const columns = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key",
        render: (text, record, index) => {
          return <span>{index + 1}</span>;
        }
      },
      {
        title: "侦察信号编号",
        dataIndex: "num"
      },
      {
        title: "侦察信号名称",
        dataIndex: "name"
      }
    ];

    const fodderdata = [];
    const Basicdata = [];
    const Middledata = [];
    for (let i = 0; i < 4; i++) {
      Basicdata.push({
        key: i,
        num: i + 1,
        name: `AN/APG- ${i}基本情况`
      });
      fodderdata.push({
        key: i,
        num: i + 1,
        name: `AN/APG- ${i}基本情况`
      });
      Middledata.push({
        key: i,
        num: i + 1,
        name: `AN/APG- ${i}基本情况`
      });
    }
    return (
      <Fragment>
        <div>
          {this.state.visible ? (
            <Dialog
              TitleText={language[`ImportReconnSignalFile_${this.props.language.getlanguages}`]}
              showDialog={this.state.visible}
              onOk={this.handleOk}
              OkText={language[`MakeSureImport_${this.props.language.getlanguages}`]}
              cancelText={language[`quit_${this.props.language.getlanguages}`]}
              onCancel={this.handleCancel}
              className={styleless.basicpop}
              showFooter
              showMask
              BodyContent={
                <div className={style.popFodderType}>
                  {/* 提供单位 */}
                  <div className={style.popselect}>
                    <div
                      style={{
                        displsy: "inline-block",
                        float: "left",
                        width: "500px"
                      }}
                    >
                      <span style={{ marginRight: "10px" }}>侦察信号名称:</span>
                      <Input
                        placeholder="请输入侦察信号名称"
                        style={{ width: "200px" }}
                      />
                    </div>
                    <Button style={{ float: "right" }} type="primary">
                      查询
                    </Button>
                  </div>
                  <div className={style.uploadtable_ZCXH}>
                    <Table
                      columns={columns}
                      dataSource={Middledata}
                      className={styleless.basicpop}
                      rowClassName={(record, index) =>
                        index % 2 === 0 ? styleless.odd : styleless.even
                      } //奇偶行颜色交替变化
                      pagination={paginationPropsnum}
                    />
                  </div>
                </div>
              }
            />
          ) : null}
        </div>

        <div id="chartBoxWrap" className={styleChart.chartBoxWrap}>
          <div style={{ margin: "10px" }}>
            {/* 脉内分析 */}
            <Fieldset
              legend={language[`IntrapulseAnalysis_${this.props.language.getlanguages}`]}
              content={
                <div id="chartBoxWrap1" className={styleChart.chartBoxWrap_box_lookMaterial}/>
              }
            />
            <div />
            {/* 脉间分析 */}
            <Fieldset
              legend={language[`InterveinalAnalysis_${this.props.language.getlanguages}`]}
              content={
                <div
                  id="chartBoxWrap2"
                  className={styleChart.chartBoxWrap_box_lookMaterial}
                />
              }
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export { Sample1 };
