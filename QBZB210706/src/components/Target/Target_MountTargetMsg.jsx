import React, { Component } from "react";
import style from "./Edit.css";
import styleless from "./test.less";
import { connect } from "dva";
import { Table, Button, Popconfirm, message } from "antd";
import Dialog from "../../utils/DialogMask/Dialog";
import OnlyLook from "../RadarInformation/Radar_OnlyLook";
import CommitLook from "../RadarInformation/CommitLook";
import language from "../language/language";

@connect(
  ({ fodder, language, ElectronicTarget, changeC, radarModel, loading }) => ({
    fodder,
    language,
    ElectronicTarget,
    changeC,
    radarModel,
    loading
  })
)
// 平台挂载雷达信息
class ImportTargetTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visbleRadar: false,
      PTGZ_radarCommuCodeList: null, //平台挂载雷达信息的选择的雷达目标内码
      selectedRowKeysPTGZ_radar: [], //平台挂载雷达信息的选择的雷达目标内码
      selectedRowsPTGZ_radar: "",
      PTGZRadarData: null, //平台挂载雷达信息
      selectedRowKeys: []
    };
  }
  // 平台挂载雷达信息点击“添加”按钮
  showAddModal = () => {
    this.props.FormData();
    this.props.dispatch({
      type: "ElectronicTarget/add_PTGZ_radarMsg",
      callback: res => {
        if (res && res.data && res.data[0] && res.data[0].length == 0) {
          message.warning(`${language[`noRadarInformation_${this.props.language.getlanguages}`]}`);
        }
      }
    });
    this.setState({
      visbleAdd: true
    });
  };
  //点击查看按钮
  handleLookRadar = objectName => {
    this.setState({ visbleRadar: true });
    this.props.dispatch({
      type: "radarModel/selectOnlyLookData",
      payload: objectName,
      callback: res => {
        if (res.data && res.data[0]) {
          this.setState({ PTGZRadarData: res.data[0] });
        }
        if (res.data[0] && res.data[0].sourceOfRadiationList) {
          this.props.dispatch({
            //将从目标库
            type: "radarModel/selectInsertFromTargetChartsMsg",
            payload: res.data[0].sourceOfRadiationList
          });
        }
      }
    });
  };
  handleRadar = () => {
    this.setState({ visbleRadar: false });
  };
  handleCancelAdd = () => {
    this.setState({
      visbleAdd: false,
      selectedRowKeys: [],
      selectedRowsPTGZ_radar: ""
    });
  };
  //弹出框，点击确定按钮
  handleOkInsert = () => {
    this.props.FormData();
    this.setState({
      selectedRowKeys: [],
      selectedRowsPTGZ_radar: ""
    });
    let TargetAllData = this.props.ElectronicTarget.TargetAllData;
    this.setState({
      visbleAdd: false
    });
    let data = this.state.selectedRowsPTGZ_radar; //多选勾选的每一列中的雷达目标内码
    if (data.length > 0) {
      let arr = [];
      let dataSource = [];
      if (this.props.ElectronicTarget.PTGZ_radarMsg_data) {
        //model层查询出来的平台挂载雷达信息
        let data_model = this.props.ElectronicTarget.PTGZ_radarMsg_data;
        for (let i = 0; i < data_model.length; i++) {
          arr.push(data_model[i].radarCode); //变量arr存放的是所有点击的选中的雷达信息
        }
        dataSource = this.props.ElectronicTarget.PTGZ_radarMsg_data;
      }
      for (let i = 0; i < data.length; i++) {
        if (arr.length === 0 || arr.indexOf(data[i].radarCode) === -1) {
          dataSource.push({
            key: data.length + i,
            radarCode: data[i].radarCode,
            objectRadarName: data[i].objectRadarName,
            modelRadarName: data[i].modelRadarName,
            forRadarName: data[i].forRadarName,
            threadRadarName: data[i].threadRadarName,
            countryRadarName: data[i].countryRadarName
          });
        } else {
          message.warning(`${data[i].objectRadarName}${language[`Existing_${this.props.language.getlanguages}`]}`);
        }
        arr.push(data[i].radarCode);
      }

      //平台挂载雷达信息弹出框点击确定按钮
      this.props.dispatch({
        type: "ElectronicTarget/send_selectedRowsPTGZ_radar",
        payload: {
          ...TargetAllData,
          radarBasicMesElectObjList: dataSource
        },
        callback: res => {
          if (res.data[0] == 1) {
            this.props.dispatch({
              type: "ElectronicTarget/insertPTGZ_radarData",
              payload: {
                dataSource: dataSource
              }
            });
          } else {
            message.error("平台挂载雷达信息添加失败！");
          }
        }
      });
    }
  };
  handleDelete = (record, radarCode) => {
    const dataSource = [...this.props.ElectronicTarget.PTGZ_radarMsg_data];
    let data = dataSource.filter(item => item.radarCode !== radarCode);
    this.props.dispatch({
      //调用后端接口删除缓存中的平台挂载雷达信息
      type: "ElectronicTarget/deleteGZPTRadarColumndata_cache",
      payload: radarCode,
      callback: res => {
        if (res.data[0] == 1) {
          this.props.dispatch({
            type: "ElectronicTarget/deleteGZPTRadarColumndata",
            payload: data
          });
        } else {
          message.error("删除平台挂载雷达信息失败！");
        }
      }
    });
  };

  showRedBg = (record, index) => {
    console.log("record===",record.objectRadarName)
    console.log("publishRealise_noZBRadarOrCommu===",this.props.ElectronicTarget.publishRealise_noZBRadarOrCommu)
    let radarOrCommuMsg = null;
    if (this.props.ElectronicTarget.publishRealise_noZBRadarOrCommu) {
      radarOrCommuMsg = this.props.ElectronicTarget.publishRealise_noZBRadarOrCommu;
      for (let i = 0; i < radarOrCommuMsg.length; i++) {
        if (radarOrCommuMsg[i] == record.objectRadarName) {
          return `${styleless.bgRed}`;
        }
      }
    }
  };
  changeIndex = () => {};
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };
  render() {
    const paginationProps = {
      pageSize: 5
    };
    // 平台挂载雷达信息==添加弹出框中的
    const column_PDGZ_radarMsg = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`radarTargetCode_${this.props.language.getlanguages}`],
        dataIndex: "radarCode",
        width:"18%",
        ellipsis:true
      },
      {
        title: language[`radarTargetName_${this.props.language.getlanguages}`],
        dataIndex: "objectRadarName",
        ellipsis:true
      },
      {
        title: language[`radarType_${this.props.language.getlanguages}`],
        dataIndex: "modelRadarName",
        ellipsis:true
      },
      {
        title: language[`FriendOrFoeProperties_${this.props.language.getlanguages}`],
        dataIndex: "forRadarName",
        ellipsis:true
      },
      {
        title: language[`threatLevel_${this.props.language.getlanguages}`],
        dataIndex: "threadRadarName",
        ellipsis:true
      },
      {
        title: language[`countryOrRegion_${this.props.language.getlanguages}`],
        dataIndex: "countryRadarName",
        ellipsis:true
      }
    ];
    // 平台挂载雷达信息==页面中的
    const column_PDGZ_radarMsg_pageTable = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`radarTargetCode_${this.props.language.getlanguages}`],
        dataIndex: "radarCode",
        ellipsis:true
      },
      {
        title: language[`radarTargetName_${this.props.language.getlanguages}`],
        dataIndex: "objectRadarName",
        ellipsis:true
      },
      {
        title: language[`radarType_${this.props.language.getlanguages}`],
        dataIndex: "modelRadarName",
        ellipsis:true
      },
      {
        title: language[`FriendOrFoeProperties_${this.props.language.getlanguages}`],
        dataIndex: "forRadarName",
        ellipsis:true
      },
      {
        title: language[`threatLevel_${this.props.language.getlanguages}`],
        dataIndex: "threadRadarName",
        ellipsis:true
      },
      {
        title: language[`countryOrRegion_${this.props.language.getlanguages}`],
        dataIndex: "countryRadarName",
        ellipsis:true
      },
      {
        title: language[`detailedInformation_${this.props.language.getlanguages}`],
        dataIndex: "operate",
        render: (text, record) => (
          <div>
            <a onClick={() => this.handleLookRadar(record.objectRadarName)}>
              {language[`lookOver_${this.props.language.getlanguages}`]}
            </a>
            &nbsp;&nbsp;
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => this.handleDelete(record, record.radarCode)}
            >
              <a>{language[`delete_${this.props.language.getlanguages}`]}</a>
            </Popconfirm>
          </div>
        )
      }
    ];
    //页面上的平台挂载雷达信息
    const PTGZ_radarMsg_data = [];
    if (this.props.ElectronicTarget.PTGZ_radarMsg_data) {
      //获取平台挂载雷达信息，由于返回的select数据是数字所以转换中文
      for (
        let i = 0;
        i < this.props.ElectronicTarget.PTGZ_radarMsg_data.length;
        i++
      ) {
        let data = this.props.ElectronicTarget.PTGZ_radarMsg_data;
        // 目标型号
        let forRadarName;
        let threadRadarName;
        let countryRadarName;
        for (let j = 0; j < language.EnemyAndFoeAttributes.length; j++) {
          //敌我属性
          if (
            data[i] &&data[i].forRadarName == language.EnemyAndFoeAttributes[j].value
          ) {
            forRadarName =language.EnemyAndFoeAttributes[j][
                `name_${this.props.language.getlanguages}`
              ];
          }
        }
        for (let j = 0; j < language.threadLevel.length; j++) {
          //威胁等级
          if (
            data[i] &&data[i].threadRadarName == language.threadLevel[j].value
          ) {
            threadRadarName =language.threadLevel[j][
                `name_${this.props.language.getlanguages}`
              ];
          }
        }
        for (let j = 0; j < language.countryName.length; j++) {
          //国家地区
          if (
            data[i] &&data[i].countryRadarName == language.countryName[j].value
          ) {
            countryRadarName =language.countryName[j][
                `name_${this.props.language.getlanguages}`
              ];
          }
        }
        PTGZ_radarMsg_data.push({
          id: i + 1,
          key: i + 1,
          radarCode: data[i].radarCode,
          objectRadarName: data[i].objectRadarName,
          modelRadarName: data[i].modelRadarName,
          forRadarName: forRadarName || data[i].forRadarName,
          threadRadarName: threadRadarName || data[i].threadRadarName,
          countryRadarName: countryRadarName || data[i].countryRadarName
        });
      }
    }

    //弹出框中的平台挂载雷达信息
    const dataSource_Dialog = [];
    if (this.props.ElectronicTarget.PTGZ_radarMsg_dialog_data) {
      let data = this.props.ElectronicTarget.PTGZ_radarMsg_dialog_data;
      let threadName;
      let forName;
      let countryName;
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < language.threadLevel.length; j++) {
          //威胁等级
          if (
            data[i].threadRadarName == language.threadLevel[j].name_zh ||
            data[i].threadRadarName == language.threadLevel[j].name_fr
          ) {
            threadName =language.threadLevel[j][
                `name_${this.props.language.getlanguages}`
              ];
          }
        }
        for (let j = 0; j < language.EnemyAndFoeAttributes.length; j++) {
          //敌我属性
          if (
            data[i].forRadarName == language.EnemyAndFoeAttributes[j].name_zh ||
            data[i].forRadarName == language.EnemyAndFoeAttributes[j].name_fr
          ) {
            forName =language.EnemyAndFoeAttributes[j][
                `name_${this.props.language.getlanguages}`
              ];
          }
        }
        for (let j = 0; j < language.countryName.length; j++) {
          //国家地区
          if (
            data[i].countryRadarName == language.countryName[j].name_zh ||
            data[i].countryRadarName == language.countryName[j].name_fr
          ) {
            countryName =language.countryName[j][
                `name_${this.props.language.getlanguages}`
              ];
          }
        }
        dataSource_Dialog.push({
          key: i + 1,
          radarCode: data[i].radarCode,
          objectRadarName: data[i].objectRadarName,
          modelRadarName: data[i].modelRadarName,
          forRadarName: forName,
          threadRadarName: threadName,
          countryRadarName: countryName
        });
      }
    }

    //平台挂载雷达信息的多选
    const { selectedRowKeys, selectedRowKeysPTGZ_radar } = this.state;
    const rowSelectionPTGZ_radar = {
      selectedRowKeys,
      onSelect: (record, selected, selectedRowsPTGZ_radar) => {
        let arr = [];
        let data = selectedRowsPTGZ_radar;
        for (var i = 0; i < selectedRowsPTGZ_radar.length; i++) {
          let forRadarName;
          let threadRadarName;
          let countryRadarName;
          for (let j = 0; j < language.EnemyAndFoeAttributes.length; j++) {
            //敌我属性
            if (
              data[i] &&
              data[i].forRadarName ==
                language.EnemyAndFoeAttributes[j][
                  `name_${this.props.language.getlanguages}`
                ]
            ) {
              forRadarName = language.EnemyAndFoeAttributes[j].value;
            }
          }
          for (let j = 0; j < language.threadLevel.length; j++) {
            //威胁等级
            if (
              data[i] &&
              data[i].threadRadarName ==
                language.threadLevel[j][
                  `name_${this.props.language.getlanguages}`
                ]
            ) {
              threadRadarName = language.threadLevel[j].value;
            }
          }
          for (let j = 0; j < language.countryName.length; j++) {
            //国家地区
            if (
              data[i] &&
              data[i].countryRadarName ==
                language.countryName[j][
                  `name_${this.props.language.getlanguages}`
                ]
            ) {
              countryRadarName = language.countryName[j].value;
            }
          }
          arr.push({
            radarCode: selectedRowsPTGZ_radar[i].radarCode,
            objectRadarName: selectedRowsPTGZ_radar[i].objectRadarName,
            modelRadarName: selectedRowsPTGZ_radar[i].modelRadarName,
            forRadarName: forRadarName,
            threadRadarName: threadRadarName,
            countryRadarName: countryRadarName
          });
        }
        this.setState({ selectedRowsPTGZ_radar: arr });
      },
      onSelectAll: (selected, selectedRowsPTGZ_radar, changeRows) => {
        if (selected == true) {
          let arr = [];
          let data = dataSource_Dialog;
          for (var i = 0; i < dataSource_Dialog.length; i++) {
            let forRadarName;
            let threadRadarName;
            let countryRadarName;
            for (let j = 0; j < language.EnemyAndFoeAttributes.length; j++) {
              //敌我属性
              if (
                data[i] &&
                data[i].forRadarName ==
                  language.EnemyAndFoeAttributes[j][
                    `name_${this.props.language.getlanguages}`
                  ]
              ) {
                forRadarName = language.EnemyAndFoeAttributes[j].value;
              }
            }
            for (let j = 0; j < language.threadLevel.length; j++) {
              //威胁等级
              if (
                data[i] &&
                data[i].threadRadarName ==
                  language.threadLevel[j][
                    `name_${this.props.language.getlanguages}`
                  ]
              ) {
                threadRadarName = language.threadLevel[j].value;
              }
            }
            for (let j = 0; j < language.countryName.length; j++) {
              //国家地区
              if (
                data[i] &&
                data[i].countryRadarName ==
                  language.countryName[j][
                    `name_${this.props.language.getlanguages}`
                  ]
              ) {
                countryRadarName = language.countryName[j].value;
              }
            }
            arr.push({
              radarCode: dataSource_Dialog[i].radarCode,
              objectRadarName: dataSource_Dialog[i].objectRadarName,
              modelRadarName: dataSource_Dialog[i].modelRadarName,
              forRadarName: forRadarName || dataSource_Dialog[i].forRadarName,
              threadRadarName:
                threadRadarName || dataSource_Dialog[i].threadRadarName,
              countryRadarName:
                countryRadarName || dataSource_Dialog[i].countryRadarName
            });
          }
          let dataLength = dataSource_Dialog.length;
          this.setState({
            selectedRowKeys: [...Array(dataLength + 1).keys()],
            selectedRowsPTGZ_radar: arr
          });
        } else {
          this.setState({
            selectedRowKeys: [],
            selectedRowsPTGZ_radar: ""
          });
        }
      },
      onChange: this.onSelectChange
    };
    return (
      <div>
        <div className={style.subhead}>
          {/* 平台挂载雷达信息 */}
          <div style={{ margin: "5px 10px", float: "left" }}>
            {
              language[`platformMountRadarInfo_${this.props.language.getlanguages}`
              ]
            }
          </div>
          <div style={{ float: "right", marginRight: "50px" }}>
            <Button type="primary" onClick={this.showAddModal}>
              {language[`add_${this.props.language.getlanguages}`]}
            </Button>
          </div>
          {this.state.visbleAdd ? (
            <Dialog
              TitleText={language[`platformMountRadarInfo_${this.props.language.getlanguages}`
                ]
              }
              showDialog={this.state.visbleAdd}
              onOk={this.handleOkInsert}
              onCancel={this.handleCancelAdd}
              className={styleless.mybob}
              okText={language[`SureToAdd_${this.props.language.getlanguages}`]}
              cancelText={language[`quit_${this.props.language.getlanguages}`]}
              showFooter
              showMask
              BodyContent={
                <div className={style.popFodderType}>
                  {/*上传后的文件列表*/}
                  <div className={style.uploadtable}>
                    <Table
                      loading={
                        this.props.loading.effects[
                          "ElectronicTarget/add_PTGZ_radarMsg"
                        ]}
                      rowSelection={rowSelectionPTGZ_radar}
                      rowKey={record => record.key}
                      columns={column_PDGZ_radarMsg}
                      dataSource={dataSource_Dialog}
                      className={styleless.myClass}
                      rowClassName={(record, index) =>
                        index % 2 === 0 ? styleless.odd : styleless.even
                      } //奇偶行颜色交替变化
                      pagination={paginationProps}
                    />
                  </div>
                </div>
              }
            />
          ) : null}
        </div>
        <div>
          <div className={style.PTGZ}>
            <Table
              rowKey={record => record.id}
              columns={column_PDGZ_radarMsg_pageTable}
              dataSource={PTGZ_radarMsg_data}
              pagination={paginationProps}
              className={
                this.props.changeC.mark === "third"
                  ? styleless.myClassLDMin
                  : styleless.myClass
              }
              rowClassName={(record, index) => this.showRedBg(record, index)}
            />
          </div>
          <div>
            {this.state.visbleRadar ? (
              <Dialog
                TitleText={language[`platformMountRadarInfo_${this.props.language.getlanguages}`]}
                showDialog={this.state.visbleRadar}
                onOk={this.handleOkAdd}
                onCancel={this.handleRadar}
                className={styleless.mybob}
                OkText={language[`SureToAdd_${this.props.language.getlanguages}`]}
                cancelText={language[`quit_${this.props.language.getlanguages}`]}
                closeDialog={this.handleRadar}
                showMask
                BodyContent={
                  <div style={{ height: "600px", overflowY: "scroll" }}>
                    <OnlyLook data={this.state.PTGZRadarData} />
                  </div>
                }
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

@connect(({ language, ElectronicTarget, changeC, loading }) => ({
  language,
  ElectronicTarget,
  changeC,
  loading
}))
// 平台挂载通信装备信息
class ImportTargetTableZB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visbleCommit: false, //平台挂载通信装备信息
      visbleAdd_commit: false, //平台挂载通信装备信息弹出框的显示隐藏
      selectedRowsPTGZ_commit: null, //平台挂载雷达信息的选择的通信目标内码
      PTGZCommitData: null,
      selectedRowKeys: []
    };
  }

  //点击查看按钮
  handleLookCommit = commuCode => {
    this.setState({ visbleCommit: true });
    this.props.dispatch({
      type: "ElectronicTarget/selectOnlyLookCommitData",
      payload: commuCode,
      callback: res => {
        if (res.data) {
          this.setState({ PTGZCommitData: res.data });
        }
      }
    });
  };

  handleCommit = () => {
    this.setState({ visbleCommit: false });
  };

  //点击添加按钮
  showAdd_PTGZ_commit_Modal = () => {
    this.props.dispatch({
      type: "ElectronicTarget/add_PTGZ_commitMsg",
      callback: res => {
        if (res && res.data && res.data[0] && res.data[0].length == 0) {
          message.warning(
            `${
              language[`noCommitInformation_${this.props.language.getlanguages}`
              ]
            }`
          );
        }
      }
    });
    this.setState({
      visbleAdd_commit: true
    });
  };
  handleCancelAdd = () => {
    this.setState({
      visbleAdd_commit: false,
      selectedRowKeys: [],
      selectedRowsPTGZ_commit: ""
    });
  };
  //弹出框，点击确定按钮
  handleOkInsert = () => {
    this.props.FormData();
    let TargetAllData = this.props.ElectronicTarget.TargetAllData;
    this.setState({
      visbleAdd_commit: false,
      selectedRowKeys: [],
      selectedRowsPTGZ_commit: ""
    });
    let data = this.state.selectedRowsPTGZ_commit; //多选勾选的每一列中的雷达目标内码
    if (data.length > 0) {
      let arr = [];
      let dataSource = [];
      if (this.props.ElectronicTarget.PTGZ_commitMsg_data) {
        //model层查询出来的平台挂载雷达信息
        let data_model = this.props.ElectronicTarget.PTGZ_commitMsg_data;
        for (let i = 0; i < data_model.length; i++) {
          arr.push(data_model[i].commuCode); //变量arr存放的是所有点击的选中的雷达信息
        }
        dataSource = this.props.ElectronicTarget.PTGZ_commitMsg_data;
      }
      for (let i = 0; i < data.length; i++) {
        if (arr.length === 0 || arr.indexOf(data[i].commuCode) === -1) {
          dataSource.push({
            key: data.length + i,
            commuCode: data[i].commuCode,
            objectCommuName: data[i].objectCommuName,
            modelCommuName: data[i].modelCommuName,
            forCommuName: data[i].forCommuName,
            threadCommuName: data[i].threadCommuName,
            countryCommuName: data[i].countryCommuName
          });
        } else {
          message.warning(
            `${data[i].objectCommuName}${
              language[`Existing_${this.props.language.getlanguages}`]
            }`
          );
        }
        arr.push(data[i].commuCode);
      }
      this.props.dispatch({
        type: "ElectronicTarget/send_insertPTGZ_commitData",
        payload: {
          ...TargetAllData,
          commuBasicMesElectObjList: dataSource
        },
        callback: res => {
          this.props.dispatch({
            type: "ElectronicTarget/insertPTGZ_commitData",
            payload: {
              dataSource: dataSource
            }
          });
        }
      });
    }
  };

  handleDelete = (record, commuCode) => {
    const dataSource = [...this.props.ElectronicTarget.PTGZ_commitMsg_data];
    let data = dataSource.filter(item => item.commuCode !== commuCode);
    this.props.dispatch({
      //调用后端接口删除缓存中的平台挂载雷达信息
      type: "ElectronicTarget/deleteGZPTCommitColumndata_cache",
      payload: commuCode,
      callback: res => {
        if (res.data[0] == 1) {
          this.props.dispatch({
            type: "ElectronicTarget/deleteGZPTCommitColumndata",
            payload: data
          });
        } else {
          message.error("删除失败！");
        }
      }
    });
  };

  showRedBgCommu = (record, index) => {
    let radarOrCommuMsg = null;
    if (this.props.ElectronicTarget.publishRealise_noZBRadarOrCommu) {
      radarOrCommuMsg = this.props.ElectronicTarget
        .publishRealise_noZBRadarOrCommu;
      for (let i = 0; i < radarOrCommuMsg.length; i++) {
        if (radarOrCommuMsg[i] == record.objectCommuName) {
          return `${styleless.bgRed}`;
        }
      }
    }
  };
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };
  render() {
    const paginationProps = {
      pageSize: 5
    };

    //平台挂在通信装备信息
    const column_PDGZ_commitMsg = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`CommitCode_${this.props.language.getlanguages}`],
        dataIndex: "commuCode",
        width:"18%",
        ellipsis:true
      },
      {
        title: language[`CommitTargetName_${this.props.language.getlanguages}`],
        dataIndex: "objectCommuName",
        ellipsis:true
      },
      {
        title: language[`CommunicationModel_${this.props.language.getlanguages}`],
        dataIndex: "modelCommuName",
        ellipsis:true
      },
      {
        title: language[`FriendOrFoeProperties_${this.props.language.getlanguages}`],
        dataIndex: "forCommuName",
        ellipsis:true
      },
      // {
      //   title: language[`threatLevel_${this.props.language.getlanguages}`],
      //   dataIndex: "threadCommuName"
      // },
      {
        title: language[`countryOrRegion_${this.props.language.getlanguages}`],
        dataIndex: "countryCommuName",
        ellipsis:true
      }
    ];
    const column_PDGZ_commitMsg_pageTable = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`CommitCode_${this.props.language.getlanguages}`],
        dataIndex: "commuCode",
        ellipsis:true
      },
      {
        title: language[`CommitTargetName_${this.props.language.getlanguages}`],
        dataIndex: "objectCommuName",
        ellipsis:true
      },
      {
        title: language[`CommunicationModel_${this.props.language.getlanguages}`],
        dataIndex: "modelCommuName",
        ellipsis:true
      },
      {
        title: language[`FriendOrFoeProperties_${this.props.language.getlanguages}`],
        dataIndex: "forCommuName",
        ellipsis:true
      },
      // {
      //   title: language[`threatLevel_${this.props.language.getlanguages}`],
      //   dataIndex: "threadCommuName"
      // },
      {
        title: language[`countryOrRegion_${this.props.language.getlanguages}`],
        dataIndex: "countryCommuName",
        ellipsis:true
      },
      {
        title: language[`detailedInformation_${this.props.language.getlanguages}`],
        dataIndex: "operate",
        render: (text, record) => (
          <div>
            <a onClick={() => this.handleLookCommit(record.commuCode)}>
              {language[`lookOver_${this.props.language.getlanguages}`]}
            </a>
            &nbsp;&nbsp;
            {/* {this.state.targetData.length >= 1 ? ( */}
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => this.handleDelete(record, record.commuCode)}
            >
              <a>{language[`delete_${this.props.language.getlanguages}`]}</a>
            </Popconfirm>
            {/* ) : null} */}
          </div>
        )
      }
    ];
    //目标库中航迹信息数据
    const dataSource = [];
    if (
      this.props.ElectronicTarget.TargetAllData &&
      this.props.ElectronicTarget.TargetAllData[2]
    ) {
      let data = this.props.ElectronicTarget.TargetAllData[2];
      for (let i = 0; i < data.length; i++) {
        dataSource.push({
          key: i,
          index: i,
          trackId: data[i].trackId,
          appearTime: data[i].appearTime.slice(0, 19),
          disappearTime: data[i].disappearTime.slice(0, 19),
          durationMin: data[i].durationMin,
          trackDescription: data[i].trackDescription
        });
      }
    }
    const dataSource_Dialog = [];
    if (this.props.ElectronicTarget.PTGZ_commitMsg_dialog_data) {
      let data = this.props.ElectronicTarget.PTGZ_commitMsg_dialog_data;
      let threadName;
      let forName;
      let countryName;
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < language.threadLevel.length; j++) {
          //威胁等级
          if (
            data[i].threadCommuName == language.threadLevel[j].name_zh ||
            data[i].threadCommuName == language.threadLevel[j].name_fr
          ) {
            threadName =language.threadLevel[j][
                `name_${this.props.language.getlanguages}`
              ];
          }
        }
        for (let j = 0; j < language.EnemyAndFoeAttributes.length; j++) {
          //敌我属性
          if (
            data[i].forCommuName == language.EnemyAndFoeAttributes[j].name_zh ||
            data[i].forCommuName == language.EnemyAndFoeAttributes[j].name_fr
          ) {
            forName =language.EnemyAndFoeAttributes[j][
                `name_${this.props.language.getlanguages}`
              ];
          }
        }
        for (let j = 0; j < language.countryName.length; j++) {
          //国家地区
          if (
            data[i].countryCommuName == language.countryName[j].name_zh ||
            data[i].countryCommuName == language.countryName[j].name_fr
          ) {
            countryName =language.countryName[j][
                `name_${this.props.language.getlanguages}`
              ];
          }
        }
        dataSource_Dialog.push({
          key: i + 1,
          index: i + 1,
          commuCode: data[i].commuCode,
          objectCommuName: data[i].objectCommuName,
          modelCommuName: data[i].modelCommuName,
          forCommuName: forName,
          threadCommuName: threadName,
          countryCommuName: countryName
        });
      }
    }

    //平台挂载通信装备信息的多选
    const { selectedRowKeys, selectedRowKeysPTGZ_commit } = this.state;
    const rowSelectionPTGZ_commit = {
      selectedRowKeys,
      onSelect: (record, selected, selectedRowsPTGZ_commit) => {
        var arr = [];
        let data = selectedRowsPTGZ_commit;
        for (var i = 0; i < selectedRowsPTGZ_commit.length; i++) {
          let modelCommuName;
          let forCommuName;
          let threadCommuName;
          let countryCommuName;
          for (let j = 0; j < language.targetType.length; j++) {
            //目标型号
            if (
              data[i] &&
              data[i].modelCommuName ==
                language.targetType[j][
                  `name_${this.props.language.getlanguages}`
                ]
            ) {
              modelCommuName = language.targetType[j].value;
            }
          }
          for (let j = 0; j < language.EnemyAndFoeAttributes.length; j++) {
            //敌我属性
            if (
              data[i] &&
              data[i].forCommuName ==
                language.EnemyAndFoeAttributes[j][
                  `name_${this.props.language.getlanguages}`
                ]
            ) {
              forCommuName = language.EnemyAndFoeAttributes[j].value;
            }
          }
          for (let j = 0; j < language.threadLevel.length; j++) {
            //威胁等级
            if (
              data[i] &&
              data[i].threadCommuName ==
                language.threadLevel[j][
                  `name_${this.props.language.getlanguages}`
                ]
            ) {
              threadCommuName = language.threadLevel[j].value;
            }
          }
          for (let j = 0; j < language.countryName.length; j++) {
            //国家地区
            if (
              data[i] &&
              data[i].countryCommuName ==
                language.countryName[j][
                  `name_${this.props.language.getlanguages}`
                ]
            ) {
              countryCommuName = language.countryName[j].value;
            }
          }
          arr.push({
            commuCode: selectedRowsPTGZ_commit[i].commuCode,
            objectCommuName: selectedRowsPTGZ_commit[i].objectCommuName,
            modelCommuName:
              modelCommuName || selectedRowsPTGZ_commit[i].modelCommuName,
            forCommuName:
              forCommuName || selectedRowsPTGZ_commit[i].forCommuName,
            threadCommuName:
              threadCommuName || selectedRowsPTGZ_commit[i].threadCommuName,
            countryCommuName:
              countryCommuName || selectedRowsPTGZ_commit[i].countryCommuName
          });
        }
        this.setState({ selectedRowsPTGZ_commit: arr });
      },
      onSelectAll: (selected, selectedRowsPTGZ_commit, changeRows) => {
        if (selected == true) {
          var arr = [];
          let data = dataSource_Dialog;
          let dataLength = dataSource_Dialog.length;
          for (var i = 0; i < dataSource_Dialog.length; i++) {
            let modelCommuName;
            let forCommuName;
            let threadCommuName;
            let countryCommuName;
            for (let j = 0; j < language.targetType.length; j++) {
              //目标型号
              if (
                data[i] &&
                data[i].modelCommuName ==
                  language.targetType[j][
                    `name_${this.props.language.getlanguages}`
                  ]
              ) {
                modelCommuName = language.targetType[j].value;
              }
            }
            for (let j = 0; j < language.EnemyAndFoeAttributes.length; j++) {
              //敌我属性
              if (
                data[i] &&
                data[i].forCommuName ==
                  language.EnemyAndFoeAttributes[j][
                    `name_${this.props.language.getlanguages}`
                  ]
              ) {
                forCommuName = language.EnemyAndFoeAttributes[j].value;
              }
            }
            for (let j = 0; j < language.threadLevel.length; j++) {
              //威胁等级
              if (
                data[i] &&
                data[i].threadCommuName ==
                  language.threadLevel[j][
                    `name_${this.props.language.getlanguages}`
                  ]
              ) {
                threadCommuName = language.threadLevel[j].value;
              }
            }
            for (let j = 0; j < language.countryName.length; j++) {
              //国家地区
              if (
                data[i] &&
                data[i].countryCommuName ==
                  language.countryName[j][
                    `name_${this.props.language.getlanguages}`
                  ]
              ) {
                countryCommuName = language.countryName[j].value;
              }
            }
            arr.push({
              commuCode: dataSource_Dialog[i].commuCode,
              objectCommuName: dataSource_Dialog[i].objectCommuName,
              modelCommuName:
                modelCommuName || dataSource_Dialog[i].modelCommuName,
              forCommuName: forCommuName || dataSource_Dialog[i].forCommuName,
              threadCommuName:
                threadCommuName || dataSource_Dialog[i].threadCommuName,
              countryCommuName:
                countryCommuName || dataSource_Dialog[i].countryCommuName
            });
          }
          this.setState({
            selectedRowsPTGZ_commit: arr,
            selectedRowKeys: [...Array(dataLength + 1).keys()]
          });
        } else {
          this.setState({
            selectedRowKeys: [],
            selectedRowsPTGZ_commit: ""
          });
        }
      },
      onChange: this.onSelectChange
    };

    const PTGZ_commitMsg_data = [];
    if (this.props.ElectronicTarget.PTGZ_commitMsg_data) {
      //获取平台挂载雷达信息，由于返回的select数据是数字所以转换中文
      for (
        let i = 0;
        i < this.props.ElectronicTarget.PTGZ_commitMsg_data.length;
        i++
      ) {
        let data = this.props.ElectronicTarget.PTGZ_commitMsg_data;
        // 目标型号
        let forCommuName;
        let threadCommuName;
        let countryCommuName;
        // for (let j = 0; j < language.targetType.length; j++) {//目标型号
        //     if (data[i] && data[i].modelCommuName == language.targetType[j].value) {
        //         modelCommuName = language.targetType[j][`name_${this.props.language.getlanguages}`]
        //     }
        // }
        for (let j = 0; j < language.EnemyAndFoeAttributes.length; j++) {
          //敌我属性
          if (
            data[i] &&data[i].forCommuName == language.EnemyAndFoeAttributes[j].value
          ) {
            forCommuName =language.EnemyAndFoeAttributes[j][
                `name_${this.props.language.getlanguages}`
              ];
          }
        }
        for (let j = 0; j < language.threadLevel.length; j++) {
          //威胁等级
          if (
            data[i] &&data[i].threadCommuName == language.threadLevel[j].value
          ) {
            threadCommuName =language.threadLevel[j][
                `name_${this.props.language.getlanguages}`
              ];
          }
        }
        for (let j = 0; j < language.countryName.length; j++) {
          //国家地区
          if (
            data[i] &&data[i].countryCommuName == language.countryName[j].value
          ) {
            countryCommuName =language.countryName[j][
                `name_${this.props.language.getlanguages}`
              ];
          }
        }

        PTGZ_commitMsg_data.push({
          id: i + 1,
          key: i + 1,
          commuCode: data[i].commuCode,
          objectCommuName: data[i].objectCommuName,
          modelCommuName: data[i].modelCommuName,
          forCommuName: forCommuName,
          threadCommuName: threadCommuName,
          countryCommuName: countryCommuName
        });
      }
    }

    return (
      <div>
        <div className={style.subhead}>
          <div style={{ margin: "5px 10px", float: "left" }}>
            {
              language[`platformMountCommitInfo_${this.props.language.getlanguages}`
              ]
            }
          </div>
          <div style={{ float: "right", marginRight: "50px" }}>
            <Button type="primary" onClick={this.showAdd_PTGZ_commit_Modal}>
              {language[`add_${this.props.language.getlanguages}`]}
            </Button>
          </div>
          {this.state.visbleAdd_commit ? (
            <Dialog
              TitleText={language[`platformMountCommitInfo_${this.props.language.getlanguages}`
                ]
              }
              showDialog={this.state.visbleAdd_commit}
              onOk={this.handleOkInsert}
              onCancel={this.handleCancelAdd}
              className={
                this.props.language.getlanguages == "zh"
                  ? styleless.mybob
                  : styleless.mybob_fr
              }
              okText={language[`SureToAdd_${this.props.language.getlanguages}`]}
              cancelText={language[`quit_${this.props.language.getlanguages}`]}
              showFooter
              showMask
              BodyContent={
                <div className={style.popFodderType}>
                  {/*上传后的文件列表*/}
                  <div className={style.uploadtable}>
                    <Table
                      loading={
                        this.props.loading.effects[
                          "ElectronicTarget/send_insertPTGZ_commitData"
                        ]}
                      rowKey={record => record.key}
                      rowSelection={rowSelectionPTGZ_commit}
                      columns={column_PDGZ_commitMsg}
                      dataSource={dataSource_Dialog}
                      rowClassName={(record, index) =>
                        index % 2 === 0 ? styleless.odd : styleless.even
                      } //奇偶行颜色交替变化
                      pagination={paginationProps}
                      className={styleless.myClass}
                    />
                  </div>
                </div>
              }
            />
          ) : null}
        </div>
        <div className={style.radarZB}>
          <div className={style.PTGZ}>
            <Table
              columns={column_PDGZ_commitMsg_pageTable}
              dataSource={PTGZ_commitMsg_data}
              pagination={paginationProps}
              className={
                this.props.changeC.mark === "third"
                  ? styleless.myClassLDMin
                  : styleless.myClass
              }
              rowClassName={(record, index) =>
                this.showRedBgCommu(record, index)
              }
            />
          </div>
          {this.state.visbleCommit ? (
            <Dialog
              TitleText={language[`platformMountCommitInfo_${this.props.language.getlanguages}`]}
              showDialog={this.state.visbleCommit}
              onOk={this.handleOkAdd}
              onCancel={this.handleCommit}
              className={styleless.mybob}
              OkText={language[`SureToAdd_${this.props.language.getlanguages}`]}
              cancelText={language[`quit_${this.props.language.getlanguages}`]}
              closeDialog={this.handleCommit}
              showMask
              BodyContent={
                <div style={{ height: "600px", overflowY: "scroll" }}>
                  <CommitLook
                    data={this.state.PTGZCommitData}
                    showDialog={this.state.visbleCommit}
                  />
                </div>
              }
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export { ImportTargetTable, ImportTargetTableZB };
