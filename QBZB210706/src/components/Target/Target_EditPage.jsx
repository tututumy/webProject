import React, { Component } from "react";
import style from "./Edit.css";
import styleless from "./test.less";
import { Link } from "dva/router";
import { connect } from "dva";
import { Table, Button, Select, Input, message,Form } from "antd";
import Dialog from "../../utils/DialogMask/Dialog";
import DialogDrag from "../../utils/DialogDrag/Dialog";
import TargetTargetModel from "./Target_TargetModel";
import TargetScoutModel from "./Target_ScoutModel";
import language from "../language/language";
import axios from "axios";
import DialogConfirm from "../../utils/DialogConfirmNoMask/Dialog";
import PropTypes from "prop-types";
import GisIndex from "../../pages/Gis/GisIndex";
import DialogConfirmMask from "../../utils/DialogConfirmMask/Dialog";
import responseStatus from "../../utils/initCode"

@connect(({ fodder, language, ElectronicTarget, changeC }) => ({
  fodder,
  language,
  ElectronicTarget,
  changeC
}))
export default class SkyEditPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      count: 2,
      side: null,
      visbleTarget: false,
      visbleInformation: false,
      visbleAdd: false,
      basicvisible: false,
      selectedRowKeysMB: "",
      selectedRowKeys: "",
      basicvisibleLeft: false,
      basicvisibleRight: false,
      showMapVisible: false,
      leftMinTargetVisible: false,
      leftMinCommuVisible: false,
      rightMinTargetVisible: false,
      rightMinCommuVisible: false,
      modelMark: "first",
      selectRightModalColumns_data: null,
      ZC_GJDQ: "null",
      ZC_DWSX: "null",
      ZC_WXDJ: "null",
      MB_GJDQ: "null",
      MB_DWSX: "null",
      MB_WXDJ: "null",
      MB_NAME: "null",
      selectedInfoName: "",
      ZCAllData: null, //侦察情报库中的所有信息
      targetDatas: null, //目标库中的列内容
      selectedTargetInfoName: "", //点击目标库弹出框中的列表中的列对应的平台名称
      DBFX: true, //对比按钮为true或者false的标识
      visibleZBConfirm: false, //整编的确认弹出框1
      visibleZBTrueConfirm: false, //整编的确认弹出框1

      showMapVisibleCompare: false, //对比分析的弹出框
      ZCDataLoading: false, //侦察情报库导入表格的loading
      MBDataLoading: false, //目标库导入的表格的loading

      pageNumber_zc: "1",
      pageNumber_mb: "1",//从目标库当前点击的是哪一个
    };
    const Basicdata = [];
    for (let i = 0; i < 4; i++) {
      Basicdata.push({
        key: i,
        path: `AN/APG- ${i}loloi`,
        type: language[`basicInformation_${this.props.language.getlanguages}`]
      });
    }
  }

  UNSAFE_componentWillReceiveProps({ ElectronicTarget, changeC }) {
    this.setState({ modelMark: changeC.mark });
    // 切换侦察情报库弹出框中的查询条件，查询列表
    if (
      ElectronicTarget.selectRightModalColumns_data &&
      ElectronicTarget.selectRightModalColumns_data[0].length > 0
    ) {
      let data = ElectronicTarget.selectRightModalColumns_data[0];
      let arr = [];
      let threadName;
      let forName;
      let countryName;
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < language.threadLevel.length; j++) {
          //威胁等级
          if (
            data[i].threatName == language.threadLevel[j].name_zh ||
            data[i].threatName == language.threadLevel[j].name_fr
          ) {
            threadName =language.threadLevel[j][`name_${this.props.language.getlanguages}`];
          }
        }
        for (let j = 0; j < language.EnemyAndFoeAttributes.length; j++) {
          //敌我属性
          if (
            data[i].foeName == language.EnemyAndFoeAttributes[j].name_zh ||
            data[i].foeName == language.EnemyAndFoeAttributes[j].name_fr
          ) {
            forName =language.EnemyAndFoeAttributes[j][`name_${this.props.language.getlanguages}`];
          }
        }
        for (let j = 0; j < language.countryName.length; j++) {
          //国家地区
          if (
            data[i].countryName == language.countryName[j].name_zh ||
            data[i].countryName == language.countryName[j].name_fr
          ) {
            countryName =language.countryName[j][ `name_${this.props.language.getlanguages}`];
          }
        }
        arr.push({
          key: i + 1,
          countryName: countryName,
          equipName: data[i].equipName,
          foeName: forName,
          fuseObjectId: data[i].fuseObjectId,
          modelName: data[i].modelName,
          platfomName: data[i].platfomName,
          threatName: threadName //威胁等级
        });
      }
      this.setState({ selectRightModalColumns_data: arr });
    } else {
      this.setState({ selectRightModalColumns_data: [] });
    }
    //侦察情报库中的所有信息
    if (ElectronicTarget.ZCAllData) {
      this.setState({ ZCAllData: ElectronicTarget.ZCAllData });
    }
  }

  //  挂载的时候清空所有数据
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: "changeC/openZhonghe",
      payload: {
        mark: "first"
      }
    });
    dispatch({
      type: "ElectronicTarget/clearAllMsg",
      payload: {
        clearMsg: true
      }
    });

    dispatch({
      type: "ElectronicTarget/clearCache"
    });
  }

  handleToggleClick = e => {
    this.setState({
      side: e.target.id
    });
  };

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1
    });
  };

  // 点击从侦察情报库导入
  importInformation = () => {
    this.setState({ ZCDataLoading: true });
    this.props.dispatch({
      type: "ElectronicTarget/selectRadarColumnsMsg",
      payload: {
        countryName: "null",
        fofName: "null",
        threadName: "null",
        beginPage: this.state.pageNumber_zc,
        pageSize: "8"
      },
      callback: (res) => {
        this.setState({ ZCDataLoading: false });
        if (res && res.data && res.data[0]) {
          let data = res.data[0];
          let arr = [];
          let threatName;
          let forName;
          let countryName;
          let platfomName;
          for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < language.threadLevel.length; j++) {
              //威胁
              if (
                data[i].threatName == language.threadLevel[j].name_zh ||
                data[i].threatName == language.threadLevel[j].name_fr
              ) {
                threatName = language.threadLevel[j][`name_${this.props.language.getlanguages}`];
              }
            }
            for (let j = 0; j < language.EnemyAndFoeAttributes.length; j++) {
              //敌我属性
              if (
                data[i].foeName == language.EnemyAndFoeAttributes[j].name_zh ||
                data[i].foeName == language.EnemyAndFoeAttributes[j].name_fr
              ) {
                forName = language.EnemyAndFoeAttributes[j][`name_${this.props.language.getlanguages}`];
              }
            }
            for (let j = 0; j < language.countryName.length; j++) {
              //国家地区
              if (
                data[i].countryName == language.countryName[j].name_zh ||
                data[i].countryName == language.countryName[j].name_fr
              ) {
                countryName =
                  language.countryName[j][
                  `name_${this.props.language.getlanguages}`
                  ];
              }
            }
            for (let j = 0; j < language.PlatformTypeArr.length; j++) {
              //平台类型
              if (
                data[i].platfomName == language.PlatformTypeArr[j].name_zh ||
                data[i].platfomName == language.PlatformTypeArr[j].name_fr
              ) {
                platfomName =
                  language.PlatformTypeArr[j][
                  `name_${this.props.language.getlanguages}`
                  ];
              }
            }
            arr.push({
              key: i + 1,
              countryName: countryName,
              equipName: data[i].equipName,
              foeName: forName,
              fuseObjectId: data[i].fuseObjectId,
              modelName: data[i].modelName,
              platfomName: platfomName,
              threatName: threatName
            });
          }
          this.setState({ selectRightModalColumns_data: arr });
        }
      }
    })
    // let urll;
    // if (typeof window.getUrl == "function") {
    //   urll = window.getUrl() + "/api/LK-0313036/LK036";
    // } else {
    //   urll = "http://192.168.0.107:8087";
    // }
    // axios({
    //   method: "get",
    //   url: urll + "/SkyInformationReorganize/selectBasInvesMesAir",
    //   params: {
    //     countryName: "null",
    //     fofName: "null",
    //     threadName: "null",
    //     beginPage: this.state.pageNumber_zc,
    //     pageSize: "8"
    //   }
    // })
    //   .then(res => {
    //     this.setState({ ZCDataLoading: false });
    //     if (res.data[0]) {
    //       let data = res.data[0];
    //       let arr = [];
    //       let threatName;
    //       let forName;
    //       let countryName;
    //       let platfomName;
    //       for (let i = 0; i < data.length; i++) {
    //         for (let j = 0; j < language.threadLevel.length; j++) {
    //           //威胁
    //           if (
    //             data[i].threatName == language.threadLevel[j].name_zh ||
    //             data[i].threatName == language.threadLevel[j].name_fr
    //           ) {
    //             threatName = language.threadLevel[j][`name_${this.props.language.getlanguages}`];
    //           }
    //         }
    //         for (let j = 0; j < language.EnemyAndFoeAttributes.length; j++) {
    //           //敌我属性
    //           if (
    //             data[i].foeName == language.EnemyAndFoeAttributes[j].name_zh ||
    //             data[i].foeName == language.EnemyAndFoeAttributes[j].name_fr
    //           ) {
    //             forName = language.EnemyAndFoeAttributes[j][`name_${this.props.language.getlanguages}`];
    //           }
    //         }
    //         for (let j = 0; j < language.countryName.length; j++) {
    //           //国家地区
    //           if (
    //             data[i].countryName == language.countryName[j].name_zh ||
    //             data[i].countryName == language.countryName[j].name_fr
    //           ) {
    //             countryName =
    //               language.countryName[j][
    //               `name_${this.props.language.getlanguages}`
    //               ];
    //           }
    //         }
    //         for (let j = 0; j < language.PlatformTypeArr.length; j++) {
    //           //平台类型
    //           if (
    //             data[i].platfomName == language.PlatformTypeArr[j].name_zh ||
    //             data[i].platfomName == language.PlatformTypeArr[j].name_fr
    //           ) {
    //             platfomName =
    //               language.PlatformTypeArr[j][
    //               `name_${this.props.language.getlanguages}`
    //               ];
    //           }
    //         }
    //         arr.push({
    //           key: i + 1,
    //           countryName: countryName,
    //           equipName: data[i].equipName,
    //           foeName: forName,
    //           fuseObjectId: data[i].fuseObjectId,
    //           modelName: data[i].modelName,
    //           platfomName: platfomName,
    //           threatName: threatName
    //         });
    //       }
    //       this.setState({ selectRightModalColumns_data: arr });
    //     }
    //   })
    //   .catch(error => {
    //     error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
    //   });
    this.setState({
      visbleInformation: true
    });
  };

  // 点击从侦察情报库导入的确定按钮
  handleOkInformation = () => {
    this.setState({
      visbleInformation: false,
      pageNumber_zc: "1",
      ZC_GJDQ: "null",
      ZC_DWSX: "null",
      ZC_WXDJ: "null",
      selectedRowKeys: ""
    });
    // 查询从侦察情报库导入的内容
    let { dispatch } = this.props;
    dispatch({
      type: "ElectronicTarget/loadZCData",
      payload: {
        fuseObjectId: this.state.selectedInfoName
      }
    });

    if (this.state.modelMark === "second") {
      this.setState({
        modelMark: "second"
      });
    } else {
      dispatch({
        type: "changeC/openZhonghe",
        payload: {
          mark: "third"
        }
      });
    }
  };

  //点击从目标库导入按钮
  importTarge = () => {
    this.setState({ visibleConfirm: true });
  };

  //目标库导入的弹出框的确定
  handleOkConfirm = () => {
    this.setState({ MBDataLoading: true });
    let urll;
    if (typeof window.getUrl == "function") {
      urll = window.getUrl() + "/api/LK-0313036/LK036";
    } else {
      urll = "http://192.168.0.107:8087";
    }
    axios({
      method: "get",
      url: urll + "/SkyInformationReorganize/selectObjectMes"
    })
      .then(res => {
        this.setState({ MBDataLoading: false });
        if (res.data[0]) {
          let data = res.data[0];
          let arr = [];
          let threadName;
          let forName;
          let countryName;
          for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < language.threadLevel.length; j++) {
              //威胁等级
              if (
                data[i].threadName == language.threadLevel[j].name_zh ||
                data[i].threadName == language.threadLevel[j].name_fr
              ) {
                threadName =
                  language.threadLevel[j][
                  `name_${this.props.language.getlanguages}`
                  ];
              }
            }
            for (let j = 0; j < language.EnemyAndFoeAttributes.length; j++) {
              //敌我属性
              if (
                data[i].forName == language.EnemyAndFoeAttributes[j].name_zh ||
                data[i].forName == language.EnemyAndFoeAttributes[j].name_fr
              ) {
                forName =
                  language.EnemyAndFoeAttributes[j][
                  `name_${this.props.language.getlanguages}`
                  ];
              }
            }
            for (let j = 0; j < language.countryName.length; j++) {
              //国家地区
              if (
                data[i].countryName == language.countryName[j].name_zh ||
                data[i].countryName == language.countryName[j].name_fr
              ) {
                countryName =
                  language.countryName[j][
                  `name_${this.props.language.getlanguages}`
                  ];
              }
            }
            arr.push({
              key: i + 1,
              countryName: countryName,
              foeName: data[i].equipName,
              objectName: data[i].objectName,
              threadName: threadName,
              forName: forName
            });
          }
          this.setState({ targetDatas: arr });
        }
      })
      .catch(error => {
        error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
      });
    this.setState({
      visbleTarget: true,
      visibleConfirm: false
    });
  };

  handleCancelConfirm = () => {
    this.setState({ visibleConfirm: false });
  };

  // 点击从目标库导入的确定按钮
  handleOkTarget = () => {
    let { dispatch } = this.props;
    this.setState({
      visbleTarget: false,
      selectedRowKeysMB: ""
    });
    if (this.state.modelMark === "first") {
      this.setState({
        modelMark: "first"
      });
    } else {
      dispatch({
        type: "changeC/openZhonghe",
        payload: {
          mark: "third"
        }
      });
    }
    dispatch({
      type: "ElectronicTarget/selectTargetModelMsg",
      payload: {
        objectName: this.state.selectedTargetInfoName
      }
    });
  };

  handleCancelTarget = () => {
    this.setState({
      visbleTarget: false,
      selectedRowKeysMB: ""
    });
  };

  handleCancelInformation = () => {
    this.setState({
      visbleInformation: false,
      pageNumber_zc: "1",
      ZC_GJDQ: "null",
      ZC_DWSX: "null",
      ZC_WXDJ: "null",
      selectedRowKeys: ""
    });
  };
  showAddModal = () => {
    this.setState({
      visbleAdd: true
    });
  };
  handleOkAdd = () => {
    this.setState({
      visbleAdd: false,
      showMapVisibleCompare: false,
      leftMinTargetVisible: false,
      leftMinCommuVisible: false,
      rightMinTargetVisible: false,
      rightMinCommuVisible: false
    });
  };
  handleCancelAdd = () => {
    this.setState({
      visbleAdd: false,
      leftMinTargetVisible: false,
      leftMinCommuVisible: false,
      rightMinTargetVisible: false,
      rightMinCommuVisible: false
    });
  };

  showModalLeft = () => {
    this.setState({
      basicvisibleLeft: true
    });
  };
  showModalRight = () => {
    this.setState({
      basicvisibleRight: true
    });
  };

  // handleOk = (e) => {
  //     this.setState({
  //         basicvisible: false,
  //         basicvisibleLeft: false,
  //         basicvisibleRight: false
  //     });
  // }

  handleCancel = e => {
    this.setState({
      basicvisible: false,
      basicvisibleLeft: false,
      basicvisibleRight: false
    });
  };
  // 点击左边雷达添加按钮
  showAddModalLeftMin = e => {
    this.setState({
      leftMinTargetVisible: true
    });
  };
  // 点击左边通信添加按钮
  showAddModalLeftMinMu = e => {
    this.setState({
      leftMinCommuVisible: true
    });
  };
  showAddModalRightMin = e => {
    this.setState({
      rightMinTargetVisible: true
    });
  };
  showAddModalRightMinMu = e => {
    this.setState({
      rightMinCommuVisible: true
    });
  };
  // 显示地图
  showMap = e => {
    this.setState({ showMapVisible: true });
    let { dispatch } = this.props;
    dispatch({
      type: "fodder/LoadMap",
      payload: {
        mark: "draw"
      }
    });
  };
  handleCancelMap = () => {
    this.props.dispatch({
      type: "ElectronicTarget/handleCompare",
      payload: {
        // values: values,
        // DBFX: this.state.DBFX
        DBFX: false
      }
    });
    this.setState({ showMapVisibleCompare: false, DBFX: false });
  };
  closeDialog = e => {
    this.setState({ showMapVisible: false });
    let { dispatch } = this.props;
    dispatch({
      type: "fodder/ClearMap",
      payload: {
        mark: "clear"
      }
    });
  };

  //侦察情报库-切换国家地区
  handleChange_ZC_GJDQ = value => {
    const { dispatch } = this.props;
    let momentValue = value;
    if (value === "00") {
      momentValue = "null";
    }
    this.setState({ ZC_GJDQ: momentValue });
    dispatch({
      type: "ElectronicTarget/selectRadarColumnsMsg",
      payload: {
        countryName: momentValue,
        fofName: this.state.ZC_DWSX,
        threadName: this.state.ZC_WXDJ,
        beginPage: this.state.pageNumber_zc,
        pageSize: "8",
      }
    });
  };
  //侦察情报库切换敌我属性
  handleChange_ZC_DWSX = value => {
    const { dispatch } = this.props;
    let momentValue = value;
    if (value === "00") {
      momentValue = "null";
    }
    this.setState({ ZC_DWSX: momentValue });
    dispatch({
      type: "ElectronicTarget/selectRadarColumnsMsg",
      payload: {
        countryName: this.state.ZC_GJDQ,
        fofName: momentValue,
        threadName: this.state.ZC_WXDJ,
        beginPage: this.state.pageNumber_zc,
        pageSize: "8",
      }
    });
  };
  //侦察情报库切换威胁等级
  handleChange_ZC_WXDJ = value => {
    const { dispatch } = this.props;
    let momentValue = value;
    if (value === "00") {
      momentValue = "null";
    }
    this.setState({ ZC_WXDJ: momentValue });
    dispatch({
      type: "ElectronicTarget/selectRadarColumnsMsg",
      payload: {
        countryName: this.state.ZC_GJDQ,
        fofName: this.state.ZC_DWSX,
        threadName: momentValue,
        beginPage: this.state.pageNumber_zc,
        pageSize: "8",
      }
    });
  };

  //目标库切换国家地区
  handleChange_MB_GJDQ = value => {
    const { dispatch } = this.props;
    let momentValue = value;
    if (value === "00") {
      momentValue = "null";
    }
    this.setState({ MB_GJDQ: momentValue });
    dispatch({
      type: "ElectronicTarget/selectTargetColumnsMsg",
      payload: {
        countryName: momentValue,
        fofName: this.state.MB_DWSX,
        threadName: this.state.MB_WXDJ,
        objectName: this.state.MB_NAME
      },
      callback: res => {
        if (res.data[0]) {
          let data = res.data[0];
          let arr = [];
          for (let i = 0; i < data.length; i++) {
            arr.push({
              key: i + 1,
              countryName: data[i].countryName,
              foeName: data[i].equipName,
              objectName: data[i].objectName,
              threadName: data[i].threadName,
              forName: data[i].forName
            });
          }
          this.setState({ targetDatas: arr });
        }
      }
    });
  };
  //目标库切换敌我属性
  handleChange_MB_DWSX = value => {
    const { dispatch } = this.props;
    let momentValue = value;
    if (value === "00") {
      momentValue = "null";
    }
    this.setState({ MB_DWSX: momentValue });
    dispatch({
      type: "ElectronicTarget/selectTargetColumnsMsg",
      payload: {
        countryName: this.state.MB_GJDQ,
        fofName: momentValue,
        threadName: this.state.MB_WXDJ,
        objectName: this.state.MB_NAME
      },
      callback: res => {
        if (res.data[0]) {
          let data = res.data[0];
          let arr = [];
          for (let i = 0; i < data.length; i++) {
            arr.push({
              key: i + 1,
              countryName: data[i].countryName,
              foeName: data[i].equipName,
              objectName: data[i].objectName,
              threadName: data[i].threadName,
              forName: data[i].forName
            });
          }
          this.setState({ targetDatas: arr });
        }
      }
    });
  };

  //目标库切换威胁等级
  handleChange_MB_WXDJ = value => {
    const { dispatch } = this.props;
    let momentValue = value;
    if (value === "00") {
      momentValue = "null";
    }
    this.setState({ MB_WXDJ: momentValue });
    dispatch({
      type: "ElectronicTarget/selectTargetColumnsMsg",
      payload: {
        countryName: this.state.MB_GJDQ,
        fofName: this.state.MB_DWSX,
        threadName: momentValue,
        objectName: this.state.MB_NAME
      },
      callback: res => {
        if (res.data[0]) {
          let data = res.data[0];
          let arr = [];
          for (let i = 0; i < data.length; i++) {
            arr.push({
              key: i + 1,
              countryName: data[i].countryName,
              foeName: data[i].equipName,
              objectName: data[i].objectName,
              threadName: data[i].threadName,
              forName: data[i].forName
            });
          }
          this.setState({ targetDatas: arr });
        }
      }
    });
  };

  //点击自动整编
  autoZB = () => {
    const { dispatch } = this.props;
    //整编时先做一件事首先需要在整编库中查询该雷达（通信）辐射源是否已整编（按照辐射源名称查询）：
    if (this.props.ElectronicTarget.ZCAllData) {
      let data1 = this.props.ElectronicTarget.ZCAllData[4];
      let data2 = this.props.ElectronicTarget.ZCAllData[3];
      let nameArr = [];
      if (data1) {
        for (let i = 0; i < data1.length; i++) {
          nameArr.push(data1[i].commuCode);
        }
      }
      if (data2) {
        for (let j = 0; j < data2.length; j++) {
          nameArr.push(data2[j].radarCode);
        }
      }
      this.props.dispatch({
        type: "ElectronicTarget/selectRadarisZB",
        payload: nameArr.join(","),
        callback: res => {
          if (res.data[1] == "0") {
            message.warning(
              language[`radarNotZBTips_${this.props.language.getlanguages}`]
            );
            return false;
          } else {
            // 如果目标库导入了内容 如果雷达目标名称有数据并且和雷达情报库的不同，则弹出框确定是否确认整编
            if (document.getElementById("objectName").value) {
              if (
                document.getElementById("objectName").value !==
                document.getElementById("objectName_radar")
              ) {
                this.setState({ visibleZBConfirm: true });
              } else {
                this.setState({ visibleZBTrueConfirm: true });
              }
            } else {
              //否则不弹弹框直接自动整编
              this.setState({ visibleZBConfirm: false, ZBStart: true });
              dispatch({
                type: "ElectronicTarget/ZBStart",
                payload: {
                  realObjectName: document.getElementById("objectName").value
                    ? document.getElementById("objectName").value
                    : "null", //目标库中的名称
                  objectName: document.getElementById("objectName_radar").value
                    ? document.getElementById("objectName_radar").value
                    : "null" //侦察情报库中的名称
                }
              });
            }
            this.setState({ DBFX: false });
          }
        }
      });
    }
  };

  // 点击了确定按钮===》确定整编
  handleOkZBConfirm = () => {
    const { dispatch } = this.props;
    this.setState({ visibleZBConfirm: false, visibleZBTrueConfirm: false });
    dispatch({
      type: "ElectronicTarget/ZBStart",
      payload: {
        realObjectName: document.getElementById("objectName").value
          ? document.getElementById("objectName").value
          : "null", //目标库中的名称
        objectName: document.getElementById("objectName_radar").value
          ? document.getElementById("objectName_radar").value
          : "null" //侦察情报库中的名称
      },
      callback: res => {
        if (res && res.data && res.data[0]) {
          //整编成功
          message.success(
            language[
            `ReorganizationSuccess_${this.props.language.getlanguages}`
            ]
          );
        }
      }
    });
    dispatch({
      type: "ElectronicTarget/handleCompare",
      payload: {
        DBFX: false
      }
    });
  };

  //点击对比分析按钮
  handleCompare = e => {
    e.preventDefault();
    this.formRef.props.form.validateFields((err, values) => {
      if (err) {
        message.warning(language[`improveECMSpecialReportTips_${this.props.language.getlanguages}`])
        return false;
      }else{
        if (!document.getElementById("objectName_radar").value) {
          message.warning(language[`ZCDataNotAllTips_${this.props.language.getlanguages}`]);
          return false;
        } else {
          let values = this.formRef.props.form.getFieldsValue();
          const { dispatch } = this.props;
          dispatch({
            type: "ElectronicTarget/handleCompare",
            payload: {
              values: values,
              // DBFX: this.state.DBFX
              DBFX: true
            }
          });
          this.setState({ DBFX: true, showMapVisibleCompare: true }); //显示地图航迹对比
          this.props.dispatch({
            type: "ElectronicTarget/selectPlaneLineBtn",
            payload: 2
          });
          this.props.dispatch({
            type: "ElectronicTarget/handleCompareShowMap",
            payload: document.getElementById("objectName_radar").value,
          });
        }
      }
    });
    // if (!document.getElementById("objectName").value) {
    //   message.warning(
    //     language[`improveECMSpecialReportTips_${this.props.language.getlanguages}`]
    //   );
    //   return false;
    // } else 
    
  };
  changeIndex = () => { };
  handleCancelZBConfirm = () => {
    this.setState({ visibleZBConfirm: false, visibleZBTrueConfirm: false });
  };
  //保存
  saveAllData = e => {
    e.preventDefault();
    this.formRef.props.form.validateFields((err, values) => {
      if (err) {
        message.warning(language[`improveECMSpecialReportTips_${this.props.language.getlanguages}`])
        return false;
      }else{
        if (values.modelName == "-1") {
          message.warning(
            language[`selectTargetTypeTips_${this.props.language.getlanguages}`]
          );
          return false;
        }
        this.props.dispatch({
          type: "ElectronicTarget/save_target_allData",
          payload: {
            ...values,
            sign: this.props.ElectronicTarget.sn,
            objectName: values.objectName == undefined ? "null" : values.objectName,
            modelName: values.modelName == undefined ? "null" : values.modelName,
            plantType: values.plantType == undefined ? "null" : values.plantType,
            countryName:
              values.countryName == undefined ? "null" : values.countryName,
            forName: values.forName == undefined ? "null" : values.forName,
            threadName: values.threadName == undefined ? "null" : values.threadName,
            purpose: values.purpose == undefined ? "null" : values.purpose,
            deployInformation:
              values.deployInformation == undefined
                ? "null"
                : values.deployInformation,
            manufacturer:
              values.manufacturer == undefined ? "null" : values.manufacturer,
            activeAreaDescription:
              values.activeAreaDescription == undefined
                ? "null"
                : values.activeAreaDescription,
            loadDescription:
              values.loadDescription == undefined ? "null" : values.loadDescription,
            notes: values.notes == undefined ? "null" : values.notes
          },
          callback: res => {
            if (res.data[0] == 0) {
              //雷达名称重复
              message.warning(
                language[`UnableAutoZBRepeatTips_${this.props.language.getlanguages}`]
              );
              this.props.dispatch({
                type: "ElectronicTarget/updataRadarBasicMsg",
                payload: values
              });
              return false;
            } else if (res.data[0] == 2) {
              //保存失败
              this.props.dispatch({
                type: "ElectronicTarget/updataRadarBasicMsg",
                payload: values
              });
              message.error(
                language[`operationFailed_${this.props.language.getlanguages}`]
              );
            } else if (res.data[0] == 1) {
              //保存成功之后应该跳转到整编对象列表界面
              message.success(
                language[`saveSuccess_${this.props.language.getlanguages}`]
              );
              this.setState(
                {
                  goBackMark: !this.state.goBackMark
                },
                function () {
                  this.context.router.history.push("/target");
                }
              );
            } else if (res.data[0] == "100") {
              //请先选择挂载雷达或者通信信息
              message.warning(
                language[`mount_radar_or_communication_${this.props.language.getlanguages}`]
              );
              return false;
            } else if (res.data[0] == "5") {
              message.warning(
                language[`mount_radar_or_communication_${this.props.language.getlanguages}`]
              );
              return false;
            }
          }
        });
      } 
    });

    // let values = this.formRef.props.form.getFieldsValue();
    // if (!values.objectName) {
    //   message.warning(
    //     language[`improveECMSpecialReportTips_${this.props.language.getlanguages}`]
    //   );
    //   return false;
    // }
    
  };

  //成果发布
  ResultsReleased = e => {
    e.preventDefault();
    this.formRef.props.form.validateFields((err, values) => {
      if (err) {
        message.warning(language[`improveECMSpecialReportTips_${this.props.language.getlanguages}`])
        return false;
      }else{
        if (values.modelName == "-1") {
          message.warning(
            language[`selectTargetTypeTips_${this.props.language.getlanguages}`]
          );
          return false;
        }
        let name = [];
        if (this.props.ElectronicTarget.PTGZ_radarMsg_data) {
          let data = this.props.ElectronicTarget.PTGZ_radarMsg_data;
          for (let i = 0; i < data.length; i++) {
            name.push(data[i].objectRadarName);
          }
        }
        if (this.props.ElectronicTarget.PTGZ_commitMsg_data) {
          let data = this.props.ElectronicTarget.PTGZ_commitMsg_data;
          for (let i = 0; i < data.length; i++) {
            name.push(data[i].objectCommuName);
          }
        }
    
        if (name.length == 0) {
          message.warning(
            language[
            `mount_radar_or_communication_${this.props.language.getlanguages}`
            ]
          );
        } else {
          this.props.dispatch({
            //点击发布之前查询雷达和通信名称是否已存在adiidb库中，若都存在则可以发布，只要有一个不存在，都不允许发布
            type: "ElectronicTarget/selectIfHaveRadarOrCommAtADIBI",
            payload: name.join(","),
            callback: res => {
              if (res.data[1] == "0") {
                //存在辐射源不在目标库，无法完成电子目标成果发布
                message.warning(
                  language[`radiation_source_isNot_in_target_database_${this.props.language.getlanguages}`]
                );
                return false;
              } else if (res.data[1] == "5") {
                //请先选择挂载雷达或者通信信息！
                message.warning(
                  language[`mount_radar_or_communication_${this.props.language.getlanguages}`]
                );
                return false;
              } else {
                this.props.dispatch({
                  type: "ElectronicTarget/ResultsReleased",
                  payload: {
                    ...values,
                    sign: this.props.ElectronicTarget.sn,
                    objectName:
                      values.objectName == undefined ? "null" : values.objectName,
                    modelName:
                      values.modelName == undefined ? "null" : values.modelName,
                    plantType:
                      values.plantType == undefined ? "null" : values.plantType,
                    countryName:
                      values.countryName == undefined ? "null" : values.countryName,
                    forName: values.forName == undefined ? "null" : values.forName,
                    threadName:
                      values.threadName == undefined ? "null" : values.threadName,
                    purpose: values.purpose == undefined ? "null" : values.purpose,
                    deployInformation:
                      values.deployInformation == undefined
                        ? "null"
                        : values.deployInformation,
                    manufacturer:
                      values.manufacturer == undefined
                        ? "null"
                        : values.manufacturer,
                    activeAreaDescription:
                      values.activeAreaDescription == undefined
                        ? "null"
                        : values.activeAreaDescription,
                    loadDescription:
                      values.loadDescription == undefined
                        ? "null"
                        : values.loadDescription,
                    notes: values.notes == undefined ? "null" : values.notes
                  },
                  callback: res => {
                    if (res.data[0] == 0) {
                      message.error(
                        language[  `publishFailure_${this.props.language.getlanguages}`
                        ]
                      );
                    } else if (res.data[0] == "7") {
                      //目标已存在整编库
                      message.warning(
                        language[  `UnableAutoZBRepeatTips_${
                        this.props.language.getlanguages
                        }`
                        ]
                      );
                      return false;
                    } else {
                      message.success(
                        language[  `publishSuccess_${this.props.language.getlanguages}`
                        ]
                      );
                      this.context.router.history.push("/target");
                    }
                  }
                });
              }
            }
          });
        }
      }
    });
    // let values = this.formRef.props.form.getFieldsValue();

    // if (!values.objectName) {
    //   message.warning(
    //     language[
    //     `improveECMSpecialReportTips_${this.props.language.getlanguages}`
    //     ]
    //   );
    //   return false;
    // }
    
  };

  selectionChangeMB = (selectKey, selectRow) => {
    //目标库弹出框单击单选按钮
    const { objectName, key } = selectRow[0];
    this.setState({
      selectedRowKeysMB: [key],
      selectedTargetInfoName: objectName
    });
  };
  selectionChange = (selectKey, selectRow) => {
    //侦察情报库弹出框单击单选按钮
    const { fuseObjectId, key } = selectRow[0];
    this.setState({
      selectedRowKeys: [key],
      selectedInfoName: fuseObjectId
    });
  };

  //输入雷达名称模糊查询
  selectName = e => {
    const { dispatch } = this.props;
    let momentValue = e.target.value;
    if (!momentValue) {
      momentValue = "null";
    }
    this.setState({ MB_NAME: momentValue });
    dispatch({
      type: "ElectronicTarget/selectTargetColumnsMsg",
      payload: {
        countryName: this.state.MB_GJDQ,
        fofName: this.state.MB_DWSX,
        threadName: this.state.MB_WXDJ,
        objectName: momentValue
      },
      callback: res => {
        if (res.data[0]) {
          let data = res.data[0];
          let arr = [];
          for (let i = 0; i < data.length; i++) {
            arr.push({
              key: i + 1,
              countryName: data[i].countryName,
              foeName: data[i].equipName,
              objectName: data[i].objectName,
              threadName: data[i].threadName,
              forName: data[i].forName
            });
          }
          this.setState({ targetDatas: arr });
        }
      }
    });
  };

  minimizeDialog = flag => {
    if (!flag) {
      document.getElementById("imgBox1").style.width = "300px";
      document.getElementById("imgBox1").style.height = "300px";
    } else {
      document.getElementById("imgBox1").style.width = "1200px";
      document.getElementById("imgBox1").style.height = "500px";
    }
  };

  //侦察情报库弹出框切换页码
  changeZCNum = (pageNumber) => {
    this.props.dispatch({
      type: "ElectronicTarget/selectRadarColumnsMsg",
      payload: {
        countryName: this.state.ZC_GJDQ,
        fofName: this.state.ZC_DWSX,
        threadName: this.state.ZC_WXDJ,
        beginPage: pageNumber,
        pageSize: "8",
      }
    });

    // type:"ElectronicTarget/selectRadarColumnsMsg",
    //   payload:{
    //     countryName: "null",
    //     fofName: "null",
    //     threadName: "null",
    //     beginPage: this.state.pageNumber_zc,
    //     pageSize: "8"
    //   },
    this.setState({ pageNumber_zc: pageNumber })
  }

  render() {
    const Option = Select.Option;
    const { form } = this.props;
    const paginationProps = {
      pageSize: 8
    };

    { console.log("1111==总条数===", this.props.ElectronicTarget.ZCtotalCount,) }
    const paginationPropsnum = {
      pageSize: 8,
      onChange: this.changeZCNum,
      total: this.props.ElectronicTarget.ZCtotalCount,
      showQuickJumper: true,// 显示可以输入页数跳转框
    };
    const ZCColumn = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key",
        // width: "5%"
      },
      {
        title: language[`FusionNumber_${this.props.language.getlanguages}`],
        dataIndex: "fuseObjectId",
        ellipsis: true,
        width: "18%"
      },
      {
        title: language[`TargetName_${this.props.language.getlanguages}`],
        dataIndex: "equipName",
        ellipsis: true
      },
      {
        title: language[`PlatformType_${this.props.language.getlanguages}`],
        dataIndex: "platfomName",
        ellipsis: true
      },
      {
        title: language[`PlatformModel_${this.props.language.getlanguages}`],
        dataIndex: "modelName",
        ellipsis: true
      },
      {
        title: language[`countriesAndRegions_${this.props.language.getlanguages}`],
        dataIndex: "countryName",
        ellipsis: true
      },
      {
        title: language[`threatLevel_${this.props.language.getlanguages}`],
        dataIndex: "threatName",
        ellipsis: true
      },
      {
        title: language[`FriendOrFoeProperties_${this.props.language.getlanguages}`],
        dataIndex: "foeName",
        ellipsis: true
      }
    ];

    console.log("this.state.selectRightModalColumns_data", this.state.selectRightModalColumns_data)
    let infodata = this.state.selectRightModalColumns_data;
    let infoTableData = [];
    if (infodata) {
      for (let i = 0; i < infodata.length; i++) {
        infoTableData.push({
          key: 8 * (this.state.pageNumber_zc - 1) + i + 1,
          countryName: infodata[i].countryName,
          equipName: infodata[i].equipName,
          foeName: infodata[i].foeName,
          fuseObjectId: infodata[i].fuseObjectId,
          modelName: infodata[i].modelName,
          platfomName: infodata[i].platfomName,
          threatName: infodata[i].threatName
        })
      }
    }


    const targeteColumn = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`TargetName_${this.props.language.getlanguages}`],
        dataIndex: "objectName",
        ellipsis: true
      },
      {
        title: language[`countriesAndRegions_${this.props.language.getlanguages}`],
        dataIndex: "countryName",
        ellipsis: true
      },
      {
        title: language[`threatLevel_${this.props.language.getlanguages}`],
        dataIndex: "threadName",
        ellipsis: true
      },
      {
        title: language[`FriendOrFoeProperties_${this.props.language.getlanguages}`],
        dataIndex: "forName",
        ellipsis: true
      }
    ];

    const rowSelectionMB = {
      type: "radio",
      selectedRowKeys: this.state.selectedRowKeysMB,
      onChange: this.selectionChangeMB
    };
    const rowSelection = {
      type: "radio",
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.selectionChange
    };

    let data = this.state.targetDatas ? this.state.targetDatas : [];
    let targetArr = [];
    let threadName;
    let forName;
    let countryName;
    let lanuageChange = ["zh", "en", "fr"];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < language.threadLevel.length; j++) {
        lanuageChange.map(value => {
          if (data[i].threadName == language.threadLevel[j][`name_${value}`]) {
            threadName =language.threadLevel[j][`name_${this.props.language.getlanguages}`];
          }
        });
      }
      for (let j = 0; j < language.EnemyAndFoeAttributes.length; j++) {
        lanuageChange.map(value => {
          if (
            data[i].forName ==
            language.EnemyAndFoeAttributes[j][`name_${value}`]
          ) {
            forName =language.EnemyAndFoeAttributes[j][`name_${this.props.language.getlanguages}`];
          }
        });
      }
      for (let j = 0; j < language.countryName.length; j++) {
        lanuageChange.map(value => {
          if (data[i].countryName == language.countryName[j][`name_${value}`]) {
            countryName =language.countryName[j][ `name_${this.props.language.getlanguages}`];
          }
        });
      }

      targetArr.push({
        key: i + 1,
        countryName: countryName,
        foeName: data[i].equipName,
        objectName: data[i].objectName,
        threadName: threadName,
        forName: forName
      });
    }



    return (
      <div
        className={style.ContentZone}
        style={{ width: "1920px", overflowX: "hidden" }}
      >
        <div className={style.Content_wrap} id="map_dragger_area">
          <div className={style.ContentState}>
            <div
              className={style.clearFloat}
              style={{ float: "left", margin: "0 13px" }}
            >
              <Button
                type="primary"
                style={{ margin: "0 10px" }}
                onClick={this.importTarge}
              >
                {language[`ImportReorganizationy_${this.props.language.getlanguages}`]}
              </Button>
              {/* 从侦察情报库导入 */}
              <Button type="primary" onClick={this.importInformation}>
                {language[`ImportFromRadar_${this.props.language.getlanguages}`]}
              </Button>
            </div>
            {/* 侦察情报库的dialog */}
            {this.state.visbleInformation ? (
              <Dialog
                TitleText={language[`ImportFromRadar_${this.props.language.getlanguages}`]}
                showDialog={this.state.visbleInformation}
                onOk={this.handleOkInformation}
                Disabled={this.state.selectedRowKeys ? false : true}
                okText={language[`MakeSureImport_${this.props.language.getlanguages}`]}
                cancelText={language[`quit_${this.props.language.getlanguages}`]}
                onCancel={this.handleCancelInformation}
                className={styleless.targetpop}
                showFooter
                showMask
                BodyContent={
                  <div className={style.popFodderTypeMax}>
                    <div className={style.select_condition_targetDialog}>
                      {/* 国家地区 */}
                      <div>
                        <span>
                          {language[`countriesAndRegions_${this.props.language.getlanguages}`]}
                        </span>
                        <div>
                          <Select
                            style={{ width: "200px" }}
                            defaultValue="00"
                            onChange={this.handleChange_ZC_GJDQ}
                            dropdownClassName={styleless.HighIndex}
                            dropdownStyle={{ zIndex: "1054" }}
                          >
                            <Option value="00">
                              --
                              {language[`DropdownSelection_${this.props.language.getlanguages}`]}
                              --
                            </Option>
                            {language.countryName.map((v, k) => (
                              <Option value={v.value} key={v.value}>
                                {v[`name_${this.props.language.getlanguages}`]}
                              </Option>
                            ))}
                          </Select>
                        </div>
                      </div>
                      {/* 敌我属性 */}
                      <div>
                        <span>
                          {language[`FriendOrFoeProperties_${this.props.language.getlanguages}`]}
                        </span>
                        <div>
                          <Select
                            defaultValue="00"
                            style={{ width: "200px" }}
                            onChange={this.handleChange_ZC_DWSX}
                            dropdownStyle={{ zIndex: "1054" }}
                          >
                            <Option value="00">
                              --
                              {language[`DropdownSelection_${this.props.language.getlanguages}`]}
                              --
                            </Option>
                            <Option value="01">
                              {language[`enemy_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="02">
                              {language[`me_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="03">
                              {language[`friend_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="04">
                              {language[`neutrality_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="05">
                              {language[`EnemyAllies_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="06">
                              {language[`EnemyAndFriendship_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="07">
                              {language[`notClear_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="99">
                              {language[`other_${this.props.language.getlanguages}`]}
                            </Option>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className={style.select_condition_targetDialog}>
                      {/* 威胁等级 */}
                      <div>
                        <span>
                          {language[`threatLevel_${this.props.language.getlanguages}`]}
                        </span>
                        <div>
                          <Select
                            defaultValue="00"
                            style={{ width: "200px" }}
                            onChange={this.handleChange_ZC_WXDJ}
                            dropdownStyle={{ zIndex: "1054" }}
                          >
                            <Option value="00">
                              --
                              {language[`DropdownSelection_${this.props.language.getlanguages}`]}
                              --
                            </Option>
                            <Option value="0">
                              {language[`notClear_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="1">
                              {language[`VerySerious_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="2">
                              {language[`Serious_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="3">
                              {language[`common_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="4">
                              {language[`slight_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="5">
                              {language[`NoThreat_${this.props.language.getlanguages}`]}
                            </Option>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className={style.targettable}>
                      <Table
                        loading={this.state.ZCDataLoading}
                        onRow={(record, index) => {
                          return {
                            onClick: event => {
                              this.setState({
                                selectedRowKeys: [record.key],
                                selectedInfoName: record.fuseObjectId
                              });
                            }
                          };
                        }}
                        rowSelection={rowSelection}
                        columns={ZCColumn}
                        dataSource={infoTableData}
                        className={styleless.myTarget}
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

            {this.state.visibleConfirm ? (
              <DialogConfirmMask
                TitleText={language[`ImportReorganizationy_${this.props.language.getlanguages}`]}
                showDialog={this.state.visibleConfirm}
                onOk={this.handleOkConfirm}
                okText={language[`MakeSureImport_${this.props.language.getlanguages}`]}
                cancelText={language[`quit_${this.props.language.getlanguages}`]}
                onCancel={this.handleCancelConfirm}
                className={styleless.targetpop}
                showMask
                showFooter
                BodyContent={
                  <div>
                    <div
                      style={{
                        lineHeight: "25px",
                        marginBottom: "20px",
                        fontWeight: "bold"
                      }}
                      id="ConfirmTips"
                    >
                      {language[`discard_integration_object_${
                        this.props.language.getlanguages
                        }`]}
                    </div>
                  </div>
                }
              />
            ) : null}
            {/* 目标库的dialog */}
            {this.state.visbleTarget ? (
              <Dialog
                TitleText={language[`ImportReorganizationy_${this.props.language.getlanguages}`]}
                showDialog={this.state.visbleTarget}
                onOk={this.handleOkTarget}
                Disabled={this.state.selectedRowKeysMB ? false : true}
                onCancel={this.handleCancelTarget}
                className={styleless.mybob}
                okText={language[`MakeSureImport_${this.props.language.getlanguages}`]}
                cancelText={language[`quit_${this.props.language.getlanguages}`]}
                showFooter
                showMask
                BodyContent={
                  <div className={style.popFodderType}>
                    <div className={style.select_condition_targetDialog_Target}>
                      <div>
                        <span>
                          {language[`countriesAndRegions_${this.props.language.getlanguages}`]}
                        </span>
                        <div>
                          <Select
                            style={{ width: "200px" }}
                            defaultValue="00"
                            onChange={this.handleChange_MB_GJDQ}
                            dropdownStyle={{ zIndex: "1054" }}
                          >
                            <Option value="00">
                              --
                              {language[`DropdownSelection_${this.props.language.getlanguages}`]}
                              --
                            </Option>
                            {language.countryName.map((v, k) => (
                              <Option value={v.value} key={v.value}>
                                {v[`name_${this.props.language.getlanguages}`]}
                              </Option>
                            ))}
                          </Select>
                        </div>
                      </div>
                      <div>
                        <span>
                          {language[`FriendOrFoeProperties_${this.props.language.getlanguages}`]}
                        </span>
                        <div>
                          <Select
                            defaultValue="00"
                            id="DWSX"
                            style={{ width: "200px" }}
                            onChange={this.handleChange_MB_DWSX}
                            dropdownStyle={{ zIndex: "1054" }}
                          >
                            <Option value="00">
                              --
                              {language[`DropdownSelection_${this.props.language.getlanguages}`]}
                              --
                            </Option>
                            <Option value="01">
                              {language[`enemy_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="02">
                              {language[`me_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="03">
                              {language[`friend_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="04">
                              {language[`neutrality_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="05">
                              {language[`EnemyAllies_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="06">
                              {language[`EnemyAndFriendship_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="07">
                              {language[`notClear_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="99">
                              {language[`other_${this.props.language.getlanguages}`]}
                            </Option>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className={style.select_condition_targetDialog_Target}>
                      <div>
                        <span>
                          {language[`threatLevel_${this.props.language.getlanguages}`]}
                        </span>
                        <div>
                          <Select
                            defaultValue="00"
                            style={{ width: "200px" }}
                            onChange={this.handleChange_MB_WXDJ}
                            dropdownStyle={{ zIndex: "1054" }}
                          >
                            <Option value="00">
                              --
                              {language[`DropdownSelection_${this.props.language.getlanguages}`]}
                              --
                            </Option>
                            <Option value="0">
                              {language[`notClear_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="1">
                              {language[`VerySerious_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="2">
                              {language[`Serious_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="3">
                              {language[`common_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="4">
                              {language[`slight_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="5">
                              {language[`NoThreat_${this.props.language.getlanguages}`]}
                            </Option>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <span>
                          {language[`TargetName_${this.props.language.getlanguages}`]}
                        </span>
                        <div>
                          <Input
                            style={{ width: "200px" }}
                            onKeyUp={this.selectName}
                            ref="selectName"
                          />
                        </div>
                      </div>
                    </div>

                    {/*上传后的文件列表*/}
                    <div className={style.uploadtable}>
                      <Table
                        loading={this.state.MBDataLoading}
                        onRow={(record, index) => {
                          return {
                            onClick: event => {
                              this.setState({
                                selectedRowKeysMB: [record.key],
                                selectedTargetInfoName: record.objectName
                              });
                            }
                          };
                        }}
                        rowSelection={rowSelectionMB}
                        columns={targeteColumn}
                        dataSource={targetArr}
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

            <div style={{ float: "right" }}>
              <div style={{ float: "left", marginRight: 10 }}>
                {/* 对比分析 */}
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={this.handleCompare}
                  style={{
                    visibility:
                      this.state.modelMark === "third" ? "visible" : "hidden"
                  }}
                >
                  {language[`comparativeAnalysis_${this.props.language.getlanguages}`]}
                </Button>
                {/* <DialogDrag
                  visible={this.state.showMapVisibleCompare}
                  title={language[`TargetTrackSituationMap_${this.props.language.getlanguages}`]}
                  close={this.handleCancelMap}
                  screenHeight="3101"
                  TOP="100"
                  minimize={true}
                  minimize={this.minimizeDialog}
                >
                  <div className={style.popFodderTypeImg}>
                    <div className={style.uploadtableImg}>
                      <div
                        style={{
                          minWidth: "300px",
                          maxWidth: "1500px",
                          minHeight: "300px",
                          maxHeight: "800px",
                          overflow: "hidden",
                          position: "relative"
                        }}
                      >
                        <div id="imgBox1" style={{height:this.state.showMapVisibleCompare?"500px":0}}>
                            <GisIndex />
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogDrag>
                 */}
              </div>
              <div style={{ float: "left", marginRight: 10 }}>
                <Button
                  type="primary"
                  onClick={this.autoZB}
                  style={{
                    visibility:
                      this.state.modelMark === "third" ? "visible" : "hidden"
                  }}
                >
                  {language[`AutomaticBGF_${this.props.language.getlanguages}`]}
                </Button>
                <DialogConfirm
                  visible={this.state.visibleZBConfirm}
                  index={1011}
                  zIndex={1011}
                  changeIndex={this.changeIndex}
                  close={this.handleCancelZBConfirm}
                >
                  <div>
                    <div style={{ lineHeight: "25px", marginBottom: "20px" }}>
                      {language[`differentTargetNameTips_${
                        this.props.language.getlanguages
                        }`]}
                    </div>
                    <div>
                      <Button
                        type="primary"
                        onClick={this.handleCancelZBConfirm}
                      >
                        {language[`cancel_${this.props.language.getlanguages}`]}
                      </Button>
                      <Button
                        type="primary"
                        style={{ marginLeft: "10px" }}
                        onClick={this.handleOkZBConfirm}
                      >
                        {language[    `confirm_${this.props.language.getlanguages}`]}
                      </Button>
                    </div>
                  </div>
                </DialogConfirm>
                <DialogConfirm
                  visible={this.state.visibleZBTrueConfirm}
                  index={1011}
                  zIndex={1011}
                  changeIndex={this.changeIndex}
                  close={this.handleCancelConfirm}
                >
                  <div>
                    <div style={{ lineHeight: "25px", marginBottom: "20px" }}>
                      {language[`sureToReorganize_${this.props.language.getlanguages}`]}
                    </div>
                    <div>
                      <Button
                        type="primary"
                        onClick={this.handleCancelZBConfirm}
                      >
                        {language[`cancel_${this.props.language.getlanguages}`]}
                      </Button>
                      <Button
                        type="primary"
                        style={{ marginLeft: "10px" }}
                        onClick={this.handleOkZBConfirm}
                      >
                        {language[    `confirm_${this.props.language.getlanguages}`]}
                      </Button>
                    </div>
                  </div>
                </DialogConfirm>
              </div>
              <div style={{ float: "left", marginRight: 10 }}>
                <Link to="/target">
                  <Button type="primary" onClick={this.saveAllData}>
                    {language[`save_${this.props.language.getlanguages}`]}
                  </Button>
                </Link>
              </div>
              {/* 成果发布 */}
              <div style={{ float: "left", marginRight: 10 }}>
                <Link to="/target">
                  <Button type="primary" onClick={this.ResultsReleased}>
                    {language[`ResultsReleased_${this.props.language.getlanguages}`]}
                  </Button>
                </Link>
              </div>
              <div style={{ float: "left", marginRight: 10 }}>
                <Link to="/target">
                  <Button type="primary">
                    {language[`goBack_${this.props.language.getlanguages}`]}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div
            className={style.clearFloat}
            style={{ paddingTop: "60px", display: "flex", width: "100%" }}
          >
            {/* 左边的从目标库导入的内容 */}
            <div>
              {this.state.modelMark === "first" ||
                this.state.modelMark === "third" ? (
                  <TargetTargetModel
                    CancelMap={this.handleCancelMap}
                    visibleMap={this.state.showMapVisibleCompare}
                    data={this.props.ElectronicTarget.TargetAllData} //目标库导入的数据
                    {...this.state}
                    wrappedComponentRef={form => (this.formRef = form)} //5、使用wrappedComponentRef 拿到子组件传递过来的ref（官方写法）
                  />
                ) : (
                  ``
                )}
            </div>
            <div
              className={
                this.state.modelMark === "third"
                  ? style.FirstBoxMinColumn
                  : style.FirstBoxColumn
              }
            />
            <div>
              {this.state.modelMark === "second" ||
                this.state.modelMark === "third" ? (
                  // 右边的从侦察情报库导入的内容
                  <TargetScoutModel
                    data={this.props.ElectronicTarget.ZCAllData}
                    {...this.state}
                    DBFX={this.state.DBFX}
                  />
                ) : (
                  ``
                )}
            </div>
          </div>
        </div>
      </div>
    );
  };



}
