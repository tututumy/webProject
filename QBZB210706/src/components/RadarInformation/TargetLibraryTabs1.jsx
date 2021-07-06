import React, { Fragment } from "react";
import style from "./Edit.css";
import styleless from "./test.less";
import { Tabs, Table, Button, Input, message } from "antd";
import Charts from "./TargetLibraryCharts";
import Dialog from "../../utils/DialogMask/Dialog";
import { connect } from "dva";
import language from "../language/language";
import DialogConfirmMask from "../../utils/DialogConfirmMask/Dialog";
import styleChart from "./chart.less";
import { Chart } from "@antv/g2";
// 增加样本并实现tab切换效果
const TabPane = Tabs.TabPane;

//页面逻辑：1.如果是新建整编对象，初始化的时候应只有一个tab，并且无图表数据
//2.如果是编辑或者从雷达情报整编库导入的数据，则根据原来有没有侦察信号数据，有的话根据个数渲染多个tab页
//（由于服务端在 不同的位置导致有的侦察信号文件只有名称，具体数据不显示）

@connect(({ language, radarModel, loading }) => ({
  language,
  radarModel,
  loading
}))
export default class TabDemo extends React.Component {
  constructor(props) {
    super(props);
    this.newTabIndex = 0;
    const panes = [
      //初始样本，只有一个标签页，显示样本1
      { title: "Tab 1", content: "Content of Tab Pane 1", key: "0" }
    ];
    this.state = {
      activeKey: "1", //当前显示的tabs的key
      panes, //tab的标签的名称和key
      visible: false,
      selectedRowKeysZC: "",
      selectedRowKeysZCName: "",
      data1: null,
      chartsData: [[]],
      mark: true,
      selectedRowMarkKey: "", //当前显示的tabs的key
      selectedRowMarkCode: "", //当前显示的tabs的code
      selectedRowMarkFileName: "", //当前显示的tabs的fileName
      selectedRowMarkElect: "",
      chartsList: null,
      name: "", //侦察信号名称
      visibleConfirm: false //确定删除的弹出框
    };
  }

  componentDidUpdate = prevProps => {
    console.log(
      "prevProps===111111=====",
      prevProps.radarModel.sourceOfRadiationList
    );
    console.log("prevProps===222222=====", prevProps.radarModel.ChartsJSONList);
    let sourceOfRadiationList = prevProps.radarModel.sourceOfRadiationList;
    let ChartsJSONList = prevProps.radarModel.ChartsJSONList;

    // 1.根据查询出来的有多少条数据，渲染出来多少个tabs(json数据不一定存在，list数据一定存在)
    if (sourceOfRadiationList && sourceOfRadiationList.length > 0) {
      let data = sourceOfRadiationList;
      let panes = [];
      let activeKey = this.state.activeKey;
      console.log("activeKey====", activeKey);

      //如果当前的标签页是第一个并且第一个有json数据，则名称显示第一个的
      let name;
      if (data.length > 0 && activeKey) {
        for (let i = 0; i < data.length; i++) {
          name = data[activeKey - 1] ? data[activeKey - 1].fileName : "";
        }
      }
      for (let i = 0; i < data.length; i++) {
        panes.push({
          title: data[i].fileName
            ? data[i].fileName.split(".json")[0]
            : `new Tab`, //设置title为每一个侦察信号数据的名称
          key: i + 1
        });
      }
      if (ChartsJSONList) {
        let data = ChartsJSONList;
        let dataSource = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i] != null) {
            dataSource[i + 1] = [];
            if (data[i][0]) {
              dataSource[i + 1][0] = data[i][0]["波形数据_雷抗"]["幅度时间图"];
              dataSource[i + 1][1] = data[i][0]["波形数据_雷抗"]["频率时间图"];
              dataSource[i + 1][2] = data[i][0]["波形数据_雷抗"]["相位时间图"];
              dataSource[i + 1][3] = data[i][0]["波形数据_雷抗"]["包络时间图"];
              dataSource[i + 1][4] = data[i][0]["波形数据_雷抗"]["功率谱图"];
              dataSource[i + 1][5] = data[i][0]["波形数据_雷抗"]["频谱图"];
              dataSource[i + 1][6] = data[i][0]["波形数据_雷抗"]["STFT图"];
              dataSource[i + 1][7] = data[i][0]["波形数据_雷抗"]["STFT叠加图"];
              dataSource[i + 1][8] = data[i][0]["全脉冲序列"]["频率时间图"];
              dataSource[i + 1][9] = data[i][0]["全脉冲序列"]["脉宽时间图"];
              dataSource[i + 1][10] = data[i][0]["全脉冲序列"]["幅度时间图"];
              dataSource[i + 1][11] =
                data[i][0]["全脉冲序列"]["脉冲间隔时间图"];
            }
          }
        }
        // this.setState({
        //   chartsData: dataSource,
        //   panes,
        //   name,
        //   chartsList: radarModel.sourceOfRadiationList
        // })
      }
    } else {
      // this.setState({
      //   panes: [//初始样本，只有一个标签页，显示样本1
      //     {
      //       title: "new Tab",
      //       key: '1'
      //     },
      //   ], activeKey: '1', name: '', chartsData: []
      // });
      return false;
    }
  };

  add = () => {
    //添加时的key
    // const { panes } = this.state;
    // const activeKey = `${++this.newTabIndex}`;
    // panes.push({ title: `New Tab${activeKey}`, content: `New Tab Pane${activeKey}`, key: activeKey });
    // this.setState({ panes, activeKey });
    console.log("this.newTabIndex==", this.newTabIndex);

    const panes = this.props.radarModel.panes;
    this.newTabIndex = ++this.newTabIndex > 1 ? this.newTabIndex : 2;
    const activeKey = `${this.newTabIndex}`;
    panes.push({
      title: `New Tab${activeKey}`,
      content: `New Tab Pane${activeKey}`,
      key: activeKey
    });

    this.setState({ activeKey });

    this.props.dispatch({
      type: "radarModel/updatePanes",
      payload: panes
    });
  };

  //点击切换样本
  onChange = activeKey => {
    console.log("activeKey===", activeKey);
    this.setState({ activeKey });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  //点击删除样本
  remove = targetKey => {
    let { activeKey } = this.state;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = panes[lastIndex].key;
      } else {
        activeKey = panes[0].key;
      }
    }
    this.setState({ panes, activeKey });
  };

  handleCancelConfirm = () => {
    this.setState({ visibleConfirm: false });
  };

  handleOkConfirm = () => {
    this.setState({ visibleConfirm: false });
    let targetKey = this.props.radarModel.ActiveKey;
    let data = this.props.radarModel.sourceOfRadiationList
      ? this.props.radarModel.sourceOfRadiationList
      : [];
    let code = data[targetKey - 1] ? data[targetKey - 1].code : "";
    if (code) {
      this.props.dispatch({
        type: "radarModel/deleteCharts",
        payload: code
      });
    }
    //更新model层charts数据的list减少一条
    let dataJson = this.props.radarModel.ChartsJSONList;
    dataJson ? dataJson.splice(targetKey - 1, 1) : dataJson;
    let chartsList = this.props.radarModel.sourceOfRadiationList;
    chartsList ? chartsList.splice(targetKey - 1, 1) : chartsList;
    this.props.dispatch({
      type: "radarModel/updateJsonList",
      payload: {
        dataJson: dataJson,
        chartsList: chartsList
      }
    });

    let activeKey = this.state.activeKey;
    let lastIndex;
    this.newTabIndex = this.newTabIndex - 1;
    this.state.panes.forEach((pane, i) => {
      if (pane.key == targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key + "";
    }
    this.setState(
      { panes: panes, activeKey: targetKey > 1 ? `${targetKey - 1}` : "1" },
      function() {
        this.setState({
          name:
            chartsList && chartsList[targetKey - 2]
              ? chartsList[targetKey - 2].fileName
              : ""
        });
      }
    );
  };

  //给点击的行设置一个背景色
  setRowClassName = record => {
    return record.key === this.state.selectedRowKeysZC
      ? `${style["l_table_row_active"]}`
      : "";
  };

  clickRow = record => {
    this.setState({
      selectedRowKeysZC: [record.key],
      selectedRowMarkKey: record.key,
      selectedRowMarkCode: record.code,
      selectedRowMarkFileName: record.fileName,
      selectedRowMarkElect: record.electId
    });
  };

  showModal = () => {
    this.setState({
      visible: true
    });
    this.props.dispatch({
      type: "radarModel/selectAllChartsList",
      payload: {
        fileName: "null",
        fileType: "侦察信号数据"
      }
    });
  };

  //侦察信号文件的弹出框点击确定
  handleOk = () => {
    //关闭弹出框，清空选择状态
    this.setState({
      visible: false,
      selectedRowKeysZC: "",
      selectedRowMarkKey: ""
    });
    let chartsList = this.props.radarModel.sourceOfRadiationList || []; //页面已经存在的数据列表
    console.log("chartsList====", chartsList);
    let dataSourceFileId = []; //一个空数组存放侦察信号数据的编号
    let dataSourceList = this.props.radarModel.sourceOfRadiationList || [];
    let momentCode = "";
    let momentileName = "";
    let momentelectId = "";
    //要看当前的key是什么
    if (chartsList && chartsList.length > 1) {
      //如果页面已经有数据，则将选中的一条替换之后传到后端
      for (let i = 0; i < chartsList.length; i++) {
        dataSourceFileId.push({
          code: chartsList[i].code,
          fileName: chartsList[i].fileName
        }); //将页面上已经存在的数据放到dataSourceieId数组中
        if (this.state.selectedRowMarkCode != chartsList[i].code) {
          //如果选中的一条和页面上已经存在的不重复
          momentCode = this.state.selectedRowMarkCode;
          momentileName = this.state.selectedRowMarkFileName;
          momentelectId = this.state.selectedRowMarkElect;
        } else {
          message.warning(
            language[
              `reconnaissance_already_in_other_samples_${
                this.props.language.getlanguages
              }`
            ]
          );
          return false;
        }
      }
      if (momentCode != "") {
        dataSourceFileId[this.state.activeKey - 1] = {
          code: momentCode,
          fileName: momentileName
        };
        dataSourceList[this.state.activeKey - 1] = {
          code: momentCode,
          electId: momentelectId,
          fileName: momentileName
        };
      }
    } else {
      //如果页面没有数据，则只将选中的一条加入传到后端
      momentCode = this.state.selectedRowMarkCode;
      momentileName = this.state.selectedRowMarkFileName;
      momentelectId = this.state.selectedRowMarkElect;
      if (momentCode != "") {
        dataSourceFileId[0] = { code: momentCode, fileName: momentileName };
        dataSourceList[0] = {
          code: momentCode,
          electId: momentelectId,
          fileName: momentileName
        };
      }
    }

    console.log("dataSourceFileId===", dataSourceList);
    this.props.dispatch({
      type: "radarModel/updateAndSelectChartsData",
      payload: { dataSourceFileId: dataSourceFileId },
      callback: res => {
        console.log("导入之后请求回来的数据=", res.data[0]);
        if (res.data && res.data[0] && res.data[0][0]) {
          // 调用组件进行通信
          this.handleCharting(res.data[0][0], this.state.activeKey);
        }
      }
    });
    this.props.dispatch({
      type: "radarModel/updateSourceOfRadiationList",
      payload: dataSourceList
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
      selectedRowMarkKey: ""
    });
  };

  selectionChange = (selectKey, selectRow) => {
    const { name, key, code, fileName } = selectRow[0];
    this.setState({
      selectedRowKeysZC: [key],
      selectedRowMarkKey: key,
      selectedRowMarkCode: code,
      selectedRowMarkFileName: fileName
    });
  };

  handleSelectChartsList = () => {
    let name = document.getElementById("chooseName").value;
    this.props.dispatch({
      type: "radarModel/selectAllChartsList",
      payload: {
        fileName: name ? name : "null",
        fileType: "侦察信号数据"
      }
    });
  };

  onRef = ref => {
    this.child = ref;
  };

  changeIndex = () => {};

  render() {
    const rowSelection = {
      type: "radio",
      selectedRowKeys: this.state.selectedRowKeysZC,
      onChange: this.selectionChange
    };
    const paginationPropsnum = {
      pageSize: 5
    };
    const columns = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key",
        width: "10%"
      },
      {
        title:language[`ReconnaissanceSignalNumber_${this.props.language.getlanguages}`],
        dataIndex: "code"
      },
      {
        title:language[`ReconnaissanceSignalName_${this.props.language.getlanguages}`],
        dataIndex: "fileName",
        ellipsis: true,
        render(text, record) {
          return <span title={text}>{text}</span>;
        }
      }
    ];
    const Middledata = [];
    if (this.props.radarModel.ChartsList) {
      //显示弹出框中的数据列表
      let data = this.props.radarModel.ChartsList;
      for (let i = 0; i < data.length; i++) {
        Middledata.push({
          key: i + 1,
          code: data[i].code,
          fileName: data[i].fileName
        });
      }
    }

    let panes = this.props.radarModel.panes;
    console.log("panes====", panes);

    return (
      <Fragment>
        <div style={{ margin: "10px 5px 10px" }}>
          {/* 添加样本按钮*/}
          <Button type="primary" onClick={this.add}>
            {language[`AddSample_${this.props.language.getlanguages}`]}
          </Button>
        </div>

        {/* 添加样本标签页 */}
        <Tabs
          hideAdd
          onChange={this.onChange}
          activeKey={this.state.activeKey}
          type="editable-card"
          onEdit={this.onEdit}
          tab={this.state.name}
        >
          {(panes ? panes : this.state.panes).map((pane, index) => (
            <TabPane tab={pane.title} key={pane.key}>
              {
                <div>
                  <div
                    style={{
                      marginLeft: "5px",
                      marginRight: "50px",
                      display: "inline-block"
                    }}
                  >
                    <Button type="primary" onClick={this.showModal}>
                      {/* 导入中频文件 */}
                      {language[`SelectionReconnaissanceSignalfiles_${this.props.language.getlanguages}`]}
                    </Button>
                  </div>

                  {/* 名称 */}
                  <div style={{ display: "inline-block" }}>
                    <span>
                      {language[`name_${this.props.language.getlanguages}`]}：
                    </span>
                    <Input
                      type="text"
                      style={{ width: "300px", margin: "5px 20px" }}
                      readOnly
                      value={this.state.name}
                    />
                  </div>

                  {/* <Charts onRef={this.onRef} /> */}
                  <div className={styleChart.chartBoxMax} id="chartBoxMax">
                    {console.log("index", index)}
                    <div>
                      <h3>幅度-时间图</h3>
                      <div id={"chartA" + index} />
                    </div>
                    <div>
                      <h3>频率-时间图</h3>
                      <div id={"chartB" + index} />
                    </div>
                    <div>
                      <h3>相位-时间图</h3>
                      <div id={"chartC" + index} />
                    </div>
                    <div>
                      <h3>包络-时间图</h3>
                      <div id={"chartD" + index} />
                    </div>
                    <div>
                      <h3>功率图谱</h3>
                      <div id={"chartE" + index} />
                    </div>
                    <div>
                      <h3>频谱图</h3>
                      <div id={"chartF" + index} />
                    </div>
                    <div>
                      <h3>STFT图</h3>
                      <div id={"chartG" + index} />
                    </div>
                    <div>
                      <h3>STFT叠加图</h3>
                      <div id={"chartH" + index} />
                    </div>
                    <div>
                      <h3>频率-时间图</h3>
                      <div id={"chartI" + index} />
                    </div>
                    <div>
                      <h3>脉宽-时间图</h3>
                      <div id={"chartJ" + index} />
                    </div>
                    <div>
                      <h3>幅度-时间图</h3>
                      <div id={"chartK" + index} />
                    </div>
                    <div>
                      <h3>脉冲间隔-时间图</h3>
                      <div id={"chartL" + index} />
                    </div>
                  </div>
                </div>
              }
            </TabPane>
          ))}
        </Tabs>

        {/* 选用侦察信号文件的弹出框 */}
        {this.state.visible ? (
          <Dialog
            TitleText={
              language[`ImportReconnSignalFile_${this.props.language.getlanguages}`
              ]
            }
            showDialog={this.state.visible}
            onOk={this.handleOk}
            OkText={
              language[`MakeSureImport_${this.props.language.getlanguages}`]
            }
            cancelText={language[`quit_${this.props.language.getlanguages}`]}
            onCancel={this.handleCancel}
            className={styleless.basicpop}
            Disabled={this.state.selectedRowMarkKey ? false : true}
            showFooter
            showMask
            BodyContent={
              <div className={style.popFodderType}>
                <div className={style.popselect}>
                  <div style={{ display: "inline-block", float: "left" }}>
                    <span style={{ marginRight: "10px" }}>
                      {language[`ReconnaissanceSignalName_${this.props.language.getlanguages}`]}
                      :
                    </span>
                    <Input
                      placeholder={language[`ReconnaissanceSignalName_${this.props.language.getlanguages}`]}
                      id="chooseName"
                      style={{ width: "300px" }}
                    />
                  </div>
                  <Button
                    style={{ float: "right" }}
                    type="primary"
                    onClick={this.handleSelectChartsList}
                  >
                    {language[`query_${this.props.language.getlanguages}`]}
                  </Button>
                </div>
                <div className={style.uploadtable_ZCXH}>
                  <Table
                    loading={
                      this.props.loading.effects[
                        "radarModel/selectAllChartsList"
                      ]
                    }
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={Middledata}
                    className={styleless.myClass}
                    rowClassName={(record, index) =>
                      index % 2 === 0 ? styleless.odd : styleless.even
                    } //奇偶行颜色交替变化
                    pagination={paginationPropsnum}
                    rowClassName={this.setRowClassName}
                    onRow={record => {
                      return {
                        onClick: this.clickRow.bind(this, record) // 点击行
                      };
                    }}
                  />
                </div>
              </div>
            }
          />
        ) : null}

        <DialogConfirmMask
          TitleText={
            language[
              `ImportFromRadarIntelligenceIntegrationDatabase_${
                this.props.language.getlanguages
              }`
            ]
          }
          showDialog={this.state.visibleConfirm}
          onOk={this.handleOkConfirm}
          okText={
            language[`MakeSureImport_${this.props.language.getlanguages}`]
          }
          cancelText={language[`quit_${this.props.language.getlanguages}`]}
          onCancel={this.handleCancelConfirm}
          className={styleless.targetpop}
          showMask
          BodyContent={
            <div>
              <div
                style={{
                  lineHeight: "25px",
                  marginBottom: "20px",
                  fontWeight: "bold"
                }}
              >
                {language[`ConfirmDeleteMsg_${this.props.language.getlanguages}`]}
              </div>
              <div>
                <Button type="primary" onClick={this.handleCancelConfirm}>
                  {language[`cancel_${this.props.language.getlanguages}`]}
                </Button>
                <Button
                  type="primary"
                  style={{ marginLeft: "10px" }}
                  onClick={this.handleOkConfirm}
                >
                  {language[`confirm_${this.props.language.getlanguages}`]}
                </Button>
              </div>
            </div>
          }
        />
      </Fragment>
    );
  }

  handleCharting = (data, activeKey) => {
    let data1 = data["波形数据_雷抗"]["幅度时间图"];
    let data2 = data["波形数据_雷抗"]["频率时间图"];
    let data3 = data["波形数据_雷抗"]["相位时间图"];
    let data4 = data["波形数据_雷抗"]["包络时间图"];
    let data5 = data["波形数据_雷抗"]["功率谱图"];
    let data6 = data["波形数据_雷抗"]["频谱图"];
    let data7 = data["波形数据_雷抗"]["STFT图"];
    let data8 = data["波形数据_雷抗"]["STFT叠加图"];
    let data9 = data["全脉冲序列"]["频率时间图"];
    let data10 = data["全脉冲序列"]["脉宽时间图"];
    let data11 = data["全脉冲序列"]["幅度时间图"];
    let data12 = data["全脉冲序列"]["脉冲间隔时间图"];
    data1 ? this.Charting(data1, "chartA" + activeKey, "us", "") : null;
    data2 ? this.Charting(data2, "chartB" + activeKey, "us", "MHz") : null;
    data3 ? this.Charting(data3, "chartC" + activeKey, "us", "°") : null;
    data4 ? this.Charting(data4, "chartD" + activeKey, "us", "us", "") : null;
    data5 ? this.Charting(data5, "chartE" + activeKey, "MHz", "dB") : null;
    data6 ? this.Charting(data6, "chartF" + activeKey, "Mhz", "dB") : null;
    data7
      ? this.Charting(data7, "chartG" + activeKey, "us", "Mhz", "dB")
      : null;
    data8
      ? this.Charting(data8, "chartH" + activeKey, "us", "Mhz", "dB")
      : null;
    data9 ? this.Charting(data9, "chartI" + activeKey, "us", "MHz") : null;
    data10 ? this.Charting(data10, "chartJ" + activeKey, "us", "us") : null;
    data11 ? this.Charting(data11, "chartK" + activeKey, "us", "dB") : null;
    data12 ? this.Charting(data12, "chartL" + activeKey, "us", "us") : null;
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
}
