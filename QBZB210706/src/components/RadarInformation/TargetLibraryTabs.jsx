import React, { Fragment } from "react";
import style from "./Edit.css";
import styleless from "./test.less";
import { Tabs, Table, Button, Input, message } from "antd";
import Charts from "./TargetLibraryCharts";
import Dialog from "../../utils/DialogMask/Dialog";
import { connect } from "dva";
import language from "../language/language";
import DialogConfirmMask from "../../utils/DialogConfirmMask/Dialog";
// 增加样本并实现tab切换效果
const TabPane = Tabs.TabPane;

@connect(({ language, radarModel, loading }) => ({
  language,
  radarModel,
  loading
}))
export default class TabDemo extends React.Component {
  constructor(props) {
    super(props);
    this.newTabIndex = 1;
    let panes = [
      //初始样本，只有一个标签页，显示样本1
      {
        title: "new Tab",
        key: "1"
      }
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

  UNSAFE_componentWillReceiveProps({ radarModel }) {
    // 1.根据查询出来的有多少条数据，渲染出来多少个tabs(json数据不一定存在，list数据一定存在)
    if (
      radarModel.sourceOfRadiationList &&
      radarModel.sourceOfRadiationList.length > 0
    ) {
      let data = radarModel.sourceOfRadiationList;
      let panes = [];
      let activeKey = this.state.activeKey;
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
      if (radarModel.ChartsJSONList) {
        let data = radarModel.ChartsJSONList;
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
        this.setState({
          chartsData: dataSource,
          panes,
          name,
          chartsList: radarModel.sourceOfRadiationList
        });
      }
    } else {
      this.setState({
        panes: [
          //初始样本，只有一个标签页，显示样本1
          {
            title: "new Tab",
            key: "1"
          }
        ],
        activeKey: "1",
        name: "",
        chartsData: []
      });
      return false;
    }
  }

  onChange = activeKey => {
    //切换Tab时的key
    let name = "";
    if (this.props.radarModel.sourceOfRadiationList) {
      let data = this.props.radarModel.sourceOfRadiationList;
      if (data[activeKey - 1]) {
        name = data[activeKey - 1].fileName;
        this.setState({ activeKey: activeKey, name: name });
      }
    }
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = () => {
    //添加时的key
    const panes = this.state.panes;
    let activeKey = "";
    if (panes.length > 0) {
      activeKey = `${parseInt(panes[panes.length - 1].key) + 1}`; //设置activeKey为panes数据数组中最后一个key+1
      panes.push({
        title: "new Tab", //设置title为panes数据数组中最后一个key+1
        key: Number(activeKey)
      });
    } else {
      activeKey = "1"; //设置activeKey为panes数据数组中最后一个key+1
      panes.push({
        title: "new Tab", //设置title为panes数据数组中最后一个key+1
        key: activeKey
      });
    }

    let arr = this.state.chartsData;
    arr[activeKey] = [];
    arr[activeKey][0] = [];
    arr[activeKey][1] = [];
    arr[activeKey][2] = [];
    arr[activeKey][3] = [];
    arr[activeKey][4] = [];
    arr[activeKey][5] = [];
    arr[activeKey][6] = [];
    arr[activeKey][7] = [];
    arr[activeKey][8] = [];
    arr[activeKey][9] = [];
    arr[activeKey][10] = [];
    arr[activeKey][11] = [];
    arr[activeKey][12] = [];
    this.setState({ chartsData: arr });
    this.setState(
      {
        name: "",
        panes: panes,
        activeKey: activeKey,
        chartsData: arr
      },
      function() {
        this.setState({ name: "" });
      }
    );

    let data = this.props.radarModel.ChartsJSONList || []; // 如果ChartsJSONList为null,则赋值data为[]
    data[data.length] = [];
    if (this.props.radarModel.ChartsJSONList) {
      data[data.length] = [];
    } else {
      data[0] = [];
      data[data.length] = [];
    }
    let data2 = this.props.radarModel.sourceOfRadiationList || []; //页面上已经存在的sourceOfRadiationList
    if (this.props.radarModel.sourceOfRadiationList) {
      data2.push({});
    } else {
      data2.push({}, {});
    }

    this.props.dispatch({
      type: "radarModel/updateAndSelectChartsData_Add",
      payload: {
        data: data,
        data2: data2
      }
    });
  };

  remove = targetKey => {
    let list=this.props.radarModel.sourceOfRadiationList;
    if(targetKey==1 && (!list || (list&&list.length==0))){
      message.warning(language[`SampleTemplateCannotBeDeleted_${this.props.language.getlanguages}`])
      return false;
    }else{
      this.setState({ visibleConfirm: true });
      this.props.dispatch({
        type: "radarModel/saveActiveKey",
        payload: targetKey
      });
      return false;
    }
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
  //点击工作模式中的行  显示对应的工作模式详细内容
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
  handleOk = e => {
    this.setState({
      visible: false,
      selectedRowKeysZC: "",
      selectedRowMarkKey: ""
    });
    let chartsList = this.props.radarModel.sourceOfRadiationList || []; //页面已经存在的数据列表
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
    this.props.dispatch({
      type: "radarModel/updateAndSelectChartsData",
      payload: { dataSourceFileId: dataSourceFileId }
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

    return (
      <Fragment>
        <div style={{ margin: "10px 5px 10px" }}>
          {/* 添加样本 */}
          <Button type="primary" onClick={this.add}>
            {language[`AddSample_${this.props.language.getlanguages}`]}
          </Button>
        </div>
        <Tabs
          hideAdd
          onChange={this.onChange}
          activeKey={this.state.activeKey}
          type="editable-card"
          onEdit={this.onEdit}
          tab={this.state.name}
        >
          {this.state.panes.map((pane, index) => (
            <TabPane tab={pane.title} key={pane.key} />
          ))}
        </Tabs>
        <div style={{ height: "42px" }}>
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

          {/* <Button>导入中频文件</Button> */}
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

          {this.state.visible ? (
            <Dialog
              TitleText={language[`ImportReconnSignalFile_${this.props.language.getlanguages}`]}
              showDialog={this.state.visible}
              onOk={this.handleOk}
              OkText={language[`MakeSureImport_${this.props.language.getlanguages}`]}
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
                        ]}
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
        </div>
        <Charts
          chartsData={this.state.chartsData}
          chartsList={this.state.chartsList}
          activeKey={this.state.activeKey}
          mark={this.state.mark}
        />
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
}
