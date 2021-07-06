import React, { Component } from "react";
import { connect } from "dva";
import style from "./Edit.css";
import styleless from "./test.less";
import { Table, Button, Select, Input, Form, message, Tooltip } from "antd";
import language from "../language/language";
import PropTypes from "prop-types";
import Dialog from "../../utils/DialogMask/Dialog";
import SecondModel from "./Radar_EditRadarModel";
import FirstModel from "./Radar_EditTargetModel";
import axios from "axios";
import DialogConfirmMask from "../../utils/DialogConfirmMask/Dialog";
import responseStatus from "../../utils/initCode"

// 界面逻辑
// 1.点击“从侦察情报库导入”按钮，在弹出框中可以根据四个选择项，选择条件动态加载导入列表，
// 点击选择一条，点击“确定”按钮，将该条数据相关的内容填入侦察情报库界面中。（侦察情报库中的数据只读不可修改）
// 2.点击“侦察情报库”界面中的某一条工作模式，显示相关的射频、脉宽、重复间隔、脉内特征。
// 3.点击“自动整编”按钮，将侦察情报库中和目标库中相对应的数据填入到目标库界面中，侦察情报库数据
// 仍保留在界面中。

// 点击自动整编按钮，传到model层一个标识，标记点击了整编按钮，此时ZBStart为true，目标库模块componentWillReceiveProps
// 检测到ZBStart为true,将侦察情报库中的数据对应在目标库中的显示出来，工作模式和基本、战技术不在同一个组件中
// 3个模块，firstModel,SecondModel,ThirdModel(包含firstModel和secondModel),点击关闭firstModel  显示second界面及内容，
// 点击关闭second 显示first及内容

// 4.点击侦察情报库关闭按钮，放大完整显示目标库内容
// 5.点击目标库库关闭按钮，放大完整显示侦察情报库内容

@connect(({ fodder, changeComp, language, radarModel, loading }) => ({
  fodder,
  changeComp,
  language,
  radarModel,
  loading
}))
export default class RadarEditPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      targetvisible: false,
      infovisible: false,
      modelMark: "first",
      component: null,
      selectedRowKeys: "",
      selectedRowKeysMB: "",
      selectedRowKeysMBName: "",
      sign: "",
      infodata: [],
      selectedInfoName: "",
      selectedIdentifyRadarId: "",
      ZC_GJDQ: "null", //侦察情报库弹出框中的国家地区
      ZC_DWSX: "null", //侦察情报库弹出框中的敌我属性
      ZC_WXDJ: "null", //侦察情报库弹出框中的威胁等级
      ZC_startTime: "null", //侦察情报库弹出框中的开始时间
      ZC_endTime: "null", //侦察情报库弹出框中的开始时间
      ZC_NAME: "null", //侦察情报库弹出框中的名称
      ZC_identifyId: "null",//侦察情报库弹出框中的批号
      MB_GJDQ: "null",
      MB_DWSX: "null",
      MB_WXDJ: "null",
      MB_LDMC: "null",
      ZBStart: false,
      targetdata: [],
      MBImportMark: false,
      click_savaSubmit: false,
      comparativeAnalysis: false,
      EditMark: false,
      bigContent: true,
      DBFX: false,
      radarData_basic: [],
      radarData_tec: [],
      targetFormMsg: null,
      visibleZBConfirm: false,
      visibleZBTrueConfirm: false,
      clearMsg: false,
      targetWorkModel_fromTar: null,
      WorkModelMsg_Target: null,
      ModelMsg: null,

      radarName: "",
      goBackMark: false, //返回按钮是否被点击
      visibleConfirm: false, //点击从目标库导入按钮的弹出框
      ZBDataLoading: false, //从侦察情报库导入的表格的loading显示

      pageNumber: "1",//从目标库当前点击的是哪一个
      total: "",//从目标库总条数

      pageNumber_zc: "1",//从侦察情报库当前点击的是哪一个
      total_zc: "",//从目标库总条数
    };
  }

  //这里接受模块切换的信息
  UNSAFE_componentWillReceiveProps(nextprops) {
    this.setState({
      clearMsg: nextprops.radarModel.clearMsg,
      targetWorkModel_fromTar: nextprops.radarModel.targetWorkModel_fromTar, //从目标库导入的内容
      WorkModelMsg_Target: nextprops.radarModel.WorkModelMsg_Target, //整编导入的内容
      ModelMsg: nextprops.radarModel.ModelMsg
    });
    if (nextprops.changeComp.mark === "third") {
      this.setState({ bigContent: false });
    } else {
      this.setState({ bigContent: true });
    }
    this.setState({
      modelMark: nextprops.changeComp.mark,
      MBImportMark: nextprops.radarModel.MBImportMark,
      ZBStart: nextprops.radarModel.ZBMark,
      EditMark: nextprops.radarModel.EditMark,
      comparativeAnalysisMark:
        nextprops.radarModel.comparativeAnalysisMark &&
        nextprops.changeComp.comparativeAnalysisMark,
      targetDetailMsg: nextprops.radarModel.targetDetailMsg,
      targetWorkModel_fromTar: nextprops.radarModel.targetWorkModel_fromTar
    });
    if (nextprops.radarModel.ModelMsg) {
      this.setState({
        radarData_basic: nextprops.radarModel.ModelMsg[0][0],
        radarData_tec: nextprops.radarModel.ModelMsg[1][0]
      });
    }
    //雷达情报库列的数据
    var arr = [];
    if (nextprops.radarModel.RadarColumnsMsg) {
      let data = nextprops.radarModel.RadarColumnsMsg[0];
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let threatName;
          let typeName;
          let platfomName;
          let forId;
          let countryId;
          for (let j = 0; j < language.threadLevel.length; j++) {
            //威胁等级
            if (
              data[i] &&
              data[i].threatName == language.threadLevel[j].value
            ) {
              threatName =
                language.threadLevel[j][
                `name_${this.props.language.getlanguages}`];
            }
          }
          for (let j = 0; j < language.ElectronicTargetCategory.length; j++) {
            //类别
            if (
              data[i] &&
              data[i].typeName == language.ElectronicTargetCategory[j].value
            ) {
              typeName =
                language.ElectronicTargetCategory[j][
                `name_${this.props.language.getlanguages}`];
            }
          }
          for (let j = 0; j < language.PlatformTypeArr.length; j++) {
            //平台类型
            if (
              data[i] &&
              data[i].platfomName == language.PlatformTypeArr[j].value
            ) {
              platfomName =
                language.PlatformTypeArr[j][
                `name_${this.props.language.getlanguages}`];
            }
          }
          for (let j = 0; j < language.EnemyAndFoeAttributes.length; j++) {
            //敌我属性
            if (
              data[i] &&
              data[i].forId == language.EnemyAndFoeAttributes[j].value
            ) {
              forId =
                language.EnemyAndFoeAttributes[j][
                `name_${this.props.language.getlanguages}`];
            }
          }
          for (let j = 0; j < language.countryName.length; j++) {
            //国家地区
            if (data[i] && data[i].countryId == language.countryName[j].value) {
              countryId =
                language.countryName[j][
                `name_${this.props.language.getlanguages}`];
            }
          }

          arr.push({
            key: i + 1,
            identifyRadarId: data[i].identifyRadarId,
            objectName: data[i].objectName,
            typeName: typeName, //类别
            platfomName: platfomName,
            // level: data[i].modelName,
            threatName: threatName, //威胁等级
            remark: data[i].remark,
            forId: forId,
            countryId: countryId
          });
          this.setState({ infodata: arr });
        }
      } else {
        this.setState({ infodata: [] });
      }
    }
    //目标库的列数据
    var arr1 = [];
    if (nextprops.radarModel.TargetColumns) {
      let data = nextprops.radarModel.TargetColumns[0];
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let threatName;
          let forId;
          let countryId;
          for (let j = 0; j < language.threadLevel.length; j++) {
            if (
              data[i] &&
              data[i].threatName == language.threadLevel[j].value
            ) {
              threatName =
                language.threadLevel[j][
                `name_${this.props.language.getlanguages}`];
            }
          }
          for (let j = 0; j < language.EnemyAndFoeAttributes.length; j++) {
            //敌我属性
            if (
              data[i] &&
              data[i].forId == language.EnemyAndFoeAttributes[j].value
            ) {
              forId =
                language.EnemyAndFoeAttributes[j][
                `name_${this.props.language.getlanguages}`];
            }
          }
          for (let j = 0; j < language.countryName.length; j++) {
            //国家地区
            if (data[i] && data[i].countryId == language.countryName[j].value) {
              countryId =
                language.countryName[j][
                `name_${this.props.language.getlanguages}`];
            }
          }
          arr1.push({
            id: i + 1,
            key: data[i].electronicObjectId,
            name: data[i].objectName,
            type: data[i].model,
            level: threatName, //威胁等级
            yt: data[i].purpose,
            info: data[i].deployInformation,
            forId: forId,
            countryId: countryId
          });
          this.setState({ targetdata: arr1 });
        }
      } else {
        this.setState({ targetdata: [] });
      }
    }
  }

  //  卸载的时候清空所有数据
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: "changeComp/openZhonghe",
      payload: {
        mark: "first"
      }
    });
    dispatch({
      type: "radarModel/clearAllMsg"
    });
    dispatch({
      type: "radarModel/deleteCache"
    });
  }

  //点击从目标库导入
  targetShowModalMin = () => {
    this.setState({ visibleConfirm: true });
  };
  //点击从目标库取消
  handleCancelConfirm = () => {
    this.setState({ visibleConfirm: false, pageNumber_zc: "1", visibleZBTrueConfirm: false });
  };

  //点击从目标库导入确认框的确定
  handleOkConfirm = () => {
    this.setState({
      targetvisible: true,
      pageNumber: "1",
      EditMark: false,
      visibleConfirm: false,
      pageNumber_zc: "1",
    });
    const { dispatch } = this.props;
    dispatch({
      type: "radarModel/selectTargetColumnsMsg",
      payload: {
        countryName: "null",
        foeName: "null",
        threadName: "null",
        objectType: "null",
        objectName: "null",
        beginPage: "1",
        pageSize: "8"
      }
    });
  };

  changeTargetNum = (pageNumber) => {
    const { dispatch } = this.props;
    dispatch({
      type: "radarModel/selectTargetColumnsMsg",
      payload: {
        countryName: this.state.MB_GJDQ,
        foeName: this.state.MB_DWSX,
        threadName: this.state.MB_WXDJ,
        objectType: "02",
        objectName: this.state.MB_LDMC,
        beginPage: pageNumber,
        pageSize: "8"
      }
    });
    this.setState({ pageNumber })
  }

  changeZCNum = (pageNumber) => {
    const { dispatch } = this.props;
    dispatch({
      type: "radarModel/selectRadarColumnsMsg",
      payload: {
        countryName: this.state.ZC_GJDQ,
        foeName: this.state.ZC_DWSX,
        threadName: this.state.ZC_WXDJ,
        objectType: "02",
        startTime: "null",
        endTime: "null",
        objectName: this.state.ZC_NAME,
        identifyId: "null",
        beginPage: pageNumber,
        pageSize: "8",
      }
    });
    this.setState({ pageNumber_zc: pageNumber })

  }

  //点击从侦察情报库导入按钮，生成从侦察情报库导入的数据列表
  infoShowModal = () => {
    this.setState({ infovisible: true, ZBDataLoading: true });
    this.props.dispatch({
      type: "radarModel/selectRadarColumnsMsg",
      payload: {
        countryName: "null",
        foeName: "null",
        threadName: "null",
        startTime: "null",
        endTime: "null",
        objectName: "null",
        identifyId: "null",
        beginPage: "1",
        pageSize: "8"
      },
      callback: (res) => {
        this.setState({ ZBDataLoading: false });
        var arr = [];
        if (res && res.data && res.data[0]) {
          for (let i = 0; i < res.data[0].length; i++) {
            var data = res.data[0];
            let threatName;
            let typeName;
            let platfomName;
            let countryId;
            let forId;
            for (let j = 0; j < language.threadLevel.length; j++) {
              //威胁等级
              if (
                data[i] &&
                data[i].threatName == language.threadLevel[j].value
              ) {
                threatName =
                  language.threadLevel[j][
                  `name_${this.props.language.getlanguages}`
                  ];
              }
            }
            for (let j = 0; j < language.ElectronicTargetCategory.length; j++) {
              //类别
              if (
                data[i] &&
                data[i].typeName == language.ElectronicTargetCategory[j].value
              ) {
                typeName =
                  language.ElectronicTargetCategory[j][
                  `name_${this.props.language.getlanguages}`
                  ];
              }
            }
            for (let j = 0; j < language.PlatformTypeArr.length; j++) {
              //平台类型
              if (
                data[i] &&
                data[i].platfomName == language.PlatformTypeArr[j].value
              ) {
                platfomName =
                  language.PlatformTypeArr[j][
                  `name_${this.props.language.getlanguages}`
                  ];
              }
            }
            for (let j = 0; j < language.EnemyAndFoeAttributes.length; j++) {
              //敌我属性
              if (
                data[i] &&
                data[i].forId == language.EnemyAndFoeAttributes[j].value
              ) {
                forId =
                  language.EnemyAndFoeAttributes[j][
                  `name_${this.props.language.getlanguages}`
                  ];
              }
            }
            for (let j = 0; j < language.countryName.length; j++) {
              //国家地区
              if (data[i] && data[i].countryId == language.countryName[j].value) {
                countryId =
                  language.countryName[j][
                  `name_${this.props.language.getlanguages}`
                  ];
              }
            }
            arr.push({
              key: i + 1,
              identifyRadarId: data[i].identifyRadarId,
              objectName: data[i].objectName,
              typeName: typeName,
              platfomName: platfomName,
              // modelName: data[i].modelName,
              threatName: threatName,
              remark: data[i].remark,
              countryId: countryId,
              forId: forId
            });
          }
        }

        this.setState({ infodata: arr });
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
    //   url: urll + "/RadarInformationReorganize/allDetailsBasicInvesMesssage",
    //   params: {
    //     countryName: "null",
    //     foeName: "null",
    //     threadName: "null",
    //     startTime: "null",
    //     endTime: "null",
    //     objectName: "null",
    //     identifyId: "null",
    //     beginPage: "1",
    //     pageSize: "8"
    //   }
    // })
    //   .then(res => {
    //     this.setState({ ZBDataLoading: false });
    //     var arr = [];
    //     for (let i = 0; i < res.data[0].length; i++) {
    //       var data = res.data[0];
    //       let threatName;
    //       let typeName;
    //       let platfomName;
    //       let countryId;
    //       let forId;
    //       for (let j = 0; j < language.threadLevel.length; j++) {
    //         //威胁等级
    //         if (
    //           data[i] &&
    //           data[i].threatName == language.threadLevel[j].value
    //         ) {
    //           threatName =
    //             language.threadLevel[j][
    //             `name_${this.props.language.getlanguages}`
    //             ];
    //         }
    //       }
    //       for (let j = 0; j < language.ElectronicTargetCategory.length; j++) {
    //         //类别
    //         if (
    //           data[i] &&
    //           data[i].typeName == language.ElectronicTargetCategory[j].value
    //         ) {
    //           typeName =
    //             language.ElectronicTargetCategory[j][
    //             `name_${this.props.language.getlanguages}`
    //             ];
    //         }
    //       }
    //       for (let j = 0; j < language.PlatformTypeArr.length; j++) {
    //         //平台类型
    //         if (
    //           data[i] &&
    //           data[i].platfomName == language.PlatformTypeArr[j].value
    //         ) {
    //           platfomName =
    //             language.PlatformTypeArr[j][
    //             `name_${this.props.language.getlanguages}`
    //             ];
    //         }
    //       }
    //       for (let j = 0; j < language.EnemyAndFoeAttributes.length; j++) {
    //         //敌我属性
    //         if (
    //           data[i] &&
    //           data[i].forId == language.EnemyAndFoeAttributes[j].value
    //         ) {
    //           forId =
    //             language.EnemyAndFoeAttributes[j][
    //             `name_${this.props.language.getlanguages}`
    //             ];
    //         }
    //       }
    //       for (let j = 0; j < language.countryName.length; j++) {
    //         //国家地区
    //         if (data[i] && data[i].countryId == language.countryName[j].value) {
    //           countryId =
    //             language.countryName[j][
    //             `name_${this.props.language.getlanguages}`
    //             ];
    //         }
    //       }
    //       arr.push({
    //         key: i + 1,
    //         identifyRadarId: data[i].identifyRadarId,
    //         objectName: data[i].objectName,
    //         typeName: typeName,
    //         platfomName: platfomName,
    //         // modelName: data[i].modelName,
    //         threatName: threatName,
    //         remark: data[i].remark,
    //         countryId: countryId,
    //         forId: forId
    //       });
    //     }
    //     this.setState({ infodata: arr });
    //   })
    //   .catch(error => {
    //     error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
    //   });
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  //点击目标库导入弹出的模态框中的确定
  // 点击之后  1.填充目标库数据  2.清除目标库数据  3.关闭清空雷达整编数据 4.点击了工作模式中的行状态关闭
  handleOkMB = e => {
    const { dispatch } = this.props;
    this.setState({
      visible: false,
      targetvisible: false,
      pageNumber: "1",
      infovisible: false,
      pageNumber_zc: "1",
      selectedRowKeysMB: ""
    });

    if (this.state.modelMark === "first") {
      this.setState({
        modelMark: "first"
      });
    } else {
      dispatch({
        type: "changeComp/openZhonghe",
        payload: {
          mark: "third"
        }
      });
    }

    //selectedRowKeysMB
    //1.填充目标库数据
    dispatch({
      type: "radarModel/selectTargetModelMsg", //查询目标库中的数据
      payload: this.state.selectedRowKeysMBName,
      callback: res => {
        if (res.data[0] && res.data[0].sourceOfRadiationList) {
          this.props.dispatch({
            //将从目标库
            type: "radarModel/selectInsertFromTargetChartsMsg",
            payload: res.data[0].sourceOfRadiationList
          });
        }
      }
    });

    //3.关闭清空雷达整编数据
    // dispatch({
    //   type: 'radarModel/clearAllMsg',
    //   payload: {
    //     clearMsg: false
    //   }
    // })
  };

  // 从侦察情报库导入按钮弹出的模态框中确定按钮
  // 点击之后  1.填充侦察情报库数据  2.清除目标库数据  3.关闭清空雷达整编数据 4.点击了工作模式中的行状态关闭
  handleOk = e => {
    const { dispatch } = this.props;
    this.setState({
      visible: false,
      targetvisible: false,
      pageNumber: "1",
      infovisible: false,
      pageNumber_zc: "1",
      selectedRowKeys: ""
    });
    if (this.state.modelMark === "second") {
      this.setState({
        modelMark: "second"
      });
    } else {
      dispatch({
        type: "changeComp/openZhonghe",
        payload: {
          mark: "third"
        }
      });
    }
    //1.填充侦察情报库数据 //3.关闭清空雷达整编数据
    dispatch({
      type: "radarModel/selectRadarModelMsg",
      payload: {
        clearMsg: false,
        selectedInfoName: this.state.selectedInfoName,
        selectedIdentifyRadarId: this.state.selectedIdentifyRadarId
      }
    });
    // 2.清除目标库数据 === 关闭整编状态
    // this.setState({ ZBStart: false })
    // dispatch({
    //   type: 'radarModel/ZBStart',
    //   payload: {
    //     mark: false
    //   }
    // })
  };
  okButtonProps = e => {
    return {
      disabled: true
    };
  };

  handleCancel = e => {
    this.setState({
      visible: false,
      targetvisible: false,
      pageNumber: "1",
      infovisible: false,
      pageNumber_zc: "1",
      selectedRowKeysMB: "",
      selectedRowKeys: ""
    });
  };
  //目标库-切换国家地区
  handleChange_MB_GJDQ = value => {
    const { dispatch } = this.props;
    let momentValue = value;
    if (value === "00") {
      momentValue = "null";
    }
    this.setState({ MB_GJDQ: momentValue });
    dispatch({
      type: "radarModel/selectTargetColumnsMsg",
      payload: {
        countryName: momentValue,
        foeName: this.state.MB_DWSX,
        threadName: this.state.MB_WXDJ,
        objectType: "02",
        objectName: this.state.MB_LDMC,
        beginPage: this.state.pageNumber,
        pageSize: "8"

      }
    });
  };
  //目标库-切换敌我属性
  handleChange_MB_DWSX = value => {
    const { dispatch } = this.props;
    let momentValue = value;
    if (value === "00") {
      momentValue = "null";
    }
    this.setState({ MB_DWSX: momentValue });
    dispatch({
      type: "radarModel/selectTargetColumnsMsg",
      payload: {
        countryName: this.state.MB_GJDQ,
        foeName: momentValue,
        threadName: this.state.MB_WXDJ,
        objectType: "02",
        objectName: this.state.MB_LDMC,
        beginPage: this.state.pageNumber,
        pageSize: "8"
      }
    });
  };
  //目标库-切换威胁等级
  handleChange_MB_WXDJ = value => {
    const { dispatch } = this.props;
    let momentValue = value;
    if (value === "00") {
      momentValue = "null";
    }
    this.setState({ MB_WXDJ: momentValue });
    dispatch({
      type: "radarModel/selectTargetColumnsMsg",
      payload: {
        countryName: this.state.MB_GJDQ,
        foeName: this.state.MB_DWSX,
        threadName: momentValue,
        objectType: "02",
        objectName: this.state.MB_LDMC,
        beginPage: this.state.pageNumber,
        pageSize: "8"
      }
    });
  };

  //输入雷达名称模糊查询
  selectName = e => {
    const { dispatch } = this.props;
    let momentValue = e.target.value;
    if (e.target.value == "") {
      momentValue = "null";
    }
    this.setState({ MB_LDMC: momentValue });
    dispatch({
      type: "radarModel/selectTargetColumnsMsg",
      payload: {
        countryName: this.state.MB_GJDQ,
        foeName: this.state.MB_DWSX,
        threadName: this.state.MB_WXDJ,
        objectType: "02",
        objectName: momentValue,
        beginPage: this.state.pageNumber,
        pageSize: "8"
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
      type: "radarModel/selectRadarColumnsMsg",
      payload: {
        countryName: momentValue,
        foeName: this.state.ZC_DWSX,
        threadName: this.state.ZC_WXDJ,
        startTime: this.state.ZC_startTime,
        endTime: this.state.ZC_endTime,
        objectName: this.state.ZC_NAME,
        identifyId: this.state.ZC_identifyId,
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
      type: "radarModel/selectRadarColumnsMsg",
      payload: {
        countryName: this.state.ZC_GJDQ,
        foeName: momentValue,
        threadName: this.state.ZC_WXDJ,
        startTime: this.state.ZC_startTime,
        endTime: this.state.ZC_endTime,
        objectName: this.state.ZC_NAME,
        identifyId: this.state.ZC_identifyId,
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
      type: "radarModel/selectRadarColumnsMsg",
      payload: {
        countryName: this.state.ZC_GJDQ,
        foeName: this.state.ZC_DWSX,
        threadName: momentValue,
        startTime: this.state.ZC_startTime,
        endTime: this.state.ZC_endTime,
        objectName: this.state.ZC_NAME,
        identifyId: this.state.ZC_identifyId,
        beginPage: this.state.pageNumber_zc,
        pageSize: "8",
      }
    });
  };
  //侦察情报库切换名称
  handleChange_ZC_NAME = e => {
    const { dispatch } = this.props;
    let momentValue = e.target.value;
    if (!momentValue) {
      momentValue = "null";
    }
    this.setState({ ZC_NAME: momentValue });
    dispatch({
      type: "radarModel/selectRadarColumnsMsg",
      payload: {
        countryName: this.state.ZC_GJDQ,
        foeName: this.state.ZC_DWSX,
        threadName: this.state.ZC_WXDJ,
        startTime: this.state.ZC_startTime,
        endTime: this.state.ZC_endTime,
        objectName: momentValue,
        identifyId: this.state.ZC_identifyId,
        beginPage: this.state.pageNumber_zc,
        pageSize: "8",
      }
    });
  };
  //侦察情报库切换批号
  handleChange_ZC_identifyId = e => {
    const { dispatch } = this.props;
    let momentValue = e.target.value;
    if (!momentValue) {
      momentValue = "null";
    }
    this.setState({ ZC_identifyId: momentValue });
    dispatch({
      type: "radarModel/selectRadarColumnsMsg",
      payload: {
        countryName: this.state.ZC_GJDQ,
        foeName: this.state.ZC_DWSX,
        threadName: this.state.ZC_WXDJ,
        startTime: this.state.ZC_startTime,
        endTime: this.state.ZC_endTime,
        objectName: this.state.ZC_NAME,
        identifyId: momentValue,
        beginPage: this.state.pageNumber_zc,
        pageSize: "8",
      }
    });
  };


  //切换日期时间
  zc_time_change = (dates, dateStrings) => {
    const { dispatch } = this.props;
    this.setState({ ZC_startTime: dateStrings[0], ZC_endTime: dateStrings[1] });
    dispatch({
      type: "radarModel/selectRadarColumnsMsg",
      payload: {
        countryName: this.state.ZC_GJDQ,
        foeName: this.state.ZC_DWSX,
        threadName: this.state.ZC_WXDJ,
        startTime: !dateStrings[0] ? "null" : dateStrings[0],
        endTime: !dateStrings[1] ? "null" : dateStrings[1]
      }
    });
  };

  //点击自动整编
  ZB = () => {
    this.setState({ DBFX: false });
    const { dispatch } = this.props;

    console.log("selectedIdentifyRadarId", this.state.selectedIdentifyRadarId)

    this.props.dispatch({
      type: 'radarModel/selectIsOrNotZB',
      payload: this.state.selectedIdentifyRadarId,
      callback: (res) => {
        console.log("res============", res)
        if (res[0] === "10") {
          message.warning(language[
            `TheRadarEmitterHasBeenReorganized_${this.props.language.getlanguages}`
          ])
        } else {
          // 如果目标库导入了内容 如果雷达目标名称有数据并且和雷达情报库的不同，则弹出框确定是否确认整编
          if (document.getElementById("objectName").value) {
            if (
              this.state.radarData_basic.objectName !== document.getElementById("objectName").value
            ) {
              this.setState({ visibleZBConfirm: true });
            } else {
              this.setState({ visibleZBTrueConfirm: true });
            }
          } else {
            //否则不弹弹框直接自动整编
            this.setState({ visibleZBConfirm: false, ZBStart: true });
            dispatch({
              type: "radarModel/ZBStart",
              payload: {
                mark: true,
                // name: this.props.form.getFieldValue("objectName"),
                name: this.props.radarModel.RadarName,
                data: this.props.radarModel.ModelMsg
              }
            });
            this.props.dispatch({
              type: "radarModel/ZBStart_send",
              payload: {
                realObjectName: this.props.radarModel.RadarName
                  ? this.props.radarModel.RadarName
                  : "null",
                objectName: this.props.radarModel.ModelMsg[0][0].objectName,
                identifyObjectId: this.props.radarModel.ModelMsg[0][0].objectId
              },
              callback: res => {
                if (res && res.data && res.data[0]) {
                  //整编成功
                  message.success(
                    language[`ReorganizationSuccess_${this.props.language.getlanguages}`
                    ]
                  );
                }
              }
            });
            dispatch({
              type: "radarModel/handleCompare",
              payload: {
                DBFX: false
              }
            });
          }
        }
      }
    })


  };

  handleCancelZBConfirm = () => {
    this.setState({ visibleZBConfirm: false, visibleZBTrueConfirm: false });
  };

  // 点击了确定按钮===》确定整编
  handleOkZBConfirm = () => {
    const { dispatch } = this.props;
    this.setState({
      visibleZBConfirm: false,
      ZBStart: true,
      DBFX: false,
      visibleZBTrueConfirm: false
    });
    dispatch({
      type: "radarModel/ZBStart",
      payload: {
        mark: true,
        name: this.props.radarModel.objectName,
        data: this.props.radarModel.ModelMsg
      }
    });
    this.props.dispatch({
      type: "radarModel/ZBStart_send",
      payload: {
        realObjectName: this.props.radarModel.RadarName
          ? this.props.radarModel.RadarName
          : "null",
        objectName: this.props.radarModel.ModelMsg[0][0].objectName,
        identifyObjectId: this.props.radarModel.ModelMsg[0][0].objectId
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
      type: "radarModel/handleCompare",
      payload: {
        DBFX: false
      }
    });
  };
  //点击保存按钮
  save_submit = e => {
    e.preventDefault();
    this.formRef.props.form.validateFields((err, values) => {
      if (err) {
        message.warning(language[`improveECMSpecialReportTips_${this.props.language.getlanguages}`])
        return false;
      } else {
        // let values = this.formRef.props.form.getFieldsValue();
        let target_workModelMsg_Main = this.props.radarModel.target_workModelMsg_Main;
        //判断雷达名称是否存在
        // if (!values.objectName) {
        //   message.warning(language[`improveECMSpecialReportTips_${this.props.language.getlanguages}`]);
        //   return false;
        // }
        //判断雷达目标型号有没有勾选
        if (values.model == "-1") {
          message.warning(language[`select_radar_target_model_${this.props.language.getlanguages}`]);
          return false;
        }

        if (!target_workModelMsg_Main || (target_workModelMsg_Main && target_workModelMsg_Main.length == 0)) {
          message.warning(language[`Please_fill_working_mode_${this.props.language.getlanguages}`]);
          return false;
        }

        //判断技术体制是否为连续波或者非连续波   工作模式下方对应的频率、脉宽和重复间隔是否填写正确
        if (values.technologyName === "15") {
          this.props.dispatch({
            type: "radarModel/select_ContinWave",
            payload: "CW",
            callback: res => {
              if (res.data[0] && res.data[0].split(",")[0] === "5") {
                //如果返回的值，前面是5
                let data = res.data[0].split(",");
                let name = "";
                for (let i = 0; i < data.length - 1; i++) {
                  name += data[i + 1] + ",";
                }
                //模式内码
                message.warning(
                  language[`ModelCode_${this.props.language.getlanguages}`] +
                  name.slice(0, name.length - 1) + language[`IsNotAvailableWorkingMode_${this.props.language.getlanguages}`]);
                return false;
              } else if (res.data[0] === "6") {
                //存在工作模式缺少射频值！
                message.warning(language[`AtLeastOneFrequencyInWorkingMode_${this.props.language.getlanguages}`]);
                return false;
              } else {
                //调用保存接口
                this.props.dispatch({
                  type: "radarModel/save_target_allData",
                  payload: {
                    sign: this.props.radarModel.sn,
                    electronicObjectId: "null",
                    objectName: values.objectName,
                    model: values.model,
                    countryName: values.countryName,
                    forName: values.forName,
                    threadName: values.threadName,
                    purpose: values.purpose,
                    deployInformation: values.deployInformation,
                    activeAreaDescription: values.activeAreaDescription,
                    manufacturer: values.manufacturer
                  },
                  callback: res => {
                    if (res.data[0] == 0) {
                      //雷达名称重复
                      message.warning(
                        language[`RadarTargetNameRepeat_${this.props.language.getlanguages
                        }`
                        ]
                      );
                      this.props.dispatch({
                        type: "radarModel/updataRadarBasicMsg",
                        payload: values
                      });
                      return false;
                    } else if (res.data[0] == 2) {
                      //保存失败
                      this.props.dispatch({
                        type: "radarModel/updataRadarBasicMsg",
                        payload: values
                      });
                      message.error(
                        language[`operationFailed_${this.props.language.getlanguages}`
                        ]
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
                          this.context.router.history.push("/radarinformation");
                        }
                      );
                    } else if (res.data[0] == "创建失败，需要填写工作模式") {
                      message.warning(
                        language[`Please_fill_working_mode_${this.props.language.getlanguages
                        }`
                        ]
                      );
                    } else {
                      message.error(
                        language[`operationFailed_${this.props.language.getlanguages}`
                        ]
                      );
                    }
                  }
                });
              }
            }
          });
        } else {
          this.props.dispatch({
            type: "radarModel/select_ContinWave",
            payload: "NotContinWave",
            callback: res => {
              //提示工作模式不对。需要删除此条工作模式
              if (res.data[0] && res.data[0].split(",")[0] === "1") {
                let data = res.data[0].split(",");
                let name = "";
                for (let i = 0; i < data.length - 1; i++) {
                  name += data[i + 1] + ",";
                }
                message.warning(
                  language[`ModelCode_${this.props.language.getlanguages}`] +
                  name.slice(0, name.length - 1) +
                  language[
                  `IsNotAvailableWorkingMode_${this.props.language.getlanguages
                  }`
                  ]
                );
                return false;
              } else if (res.data[0] === "2") {
                //每条工作模式都需要至少一个射频值！
                message.warning(
                  language[
                  `AtLeastOneFrequencyInWorkingMode_${this.props.language.getlanguages
                  }`
                  ]
                );
                return false;
              } else if (res.data[0] === "4") {
                //每条工作模式都需要至少一个脉宽值！
                message.warning(
                  language[
                  `AtLeastOneFwInWorkingMode_${this.props.language.getlanguages}`
                  ]
                );
                return false;
              } else if (res.data[0] === "3") {
                //每条工作模式都需要至少一个重复间隔值！
                message.warning(
                  language[
                  `AtLeastOneFriInWorkingMode_${this.props.language.getlanguages}`
                  ]
                );
                return false;
              } else {
                //调用保存接口
                this.props.dispatch({
                  type: "radarModel/save_target_allData",
                  payload: {
                    sign: this.props.radarModel.sn,
                    electronicObjectId: "null",
                    objectName: values.objectName,
                    model: values.model,
                    countryName: values.countryName,
                    forName: values.forName,
                    threadName: values.threadName,
                    purpose: values.purpose,
                    deployInformation: values.deployInformation,
                    activeAreaDescription: values.activeAreaDescription,
                    manufacturer: values.manufacturer
                  },
                  callback: res => {
                    if (res.data[0] == 0) {
                      //雷达名称重复
                      message.warning(
                        language[`RadarTargetNameRepeat_${this.props.language.getlanguages
                        }`
                        ]
                      );
                      this.props.dispatch({
                        type: "radarModel/updataRadarBasicMsg",
                        payload: values
                      });
                      return false;
                    } else if (res.data[0] == 2) {
                      //保存失败
                      this.props.dispatch({
                        type: "radarModel/updataRadarBasicMsg",
                        payload: values
                      });
                      message.error(
                        language[`operationFailed_${this.props.language.getlanguages}`
                        ]
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
                          this.context.router.history.push("/radarinformation");
                        }
                      );
                    } else if (res.data[0] == "创建失败，需要填写工作模式") {
                      message.warning(
                        language[`Please_fill_working_mode_${this.props.language.getlanguages
                        }`
                        ]
                      );
                    } else {
                      message.error(
                        language[`operationFailed_${this.props.language.getlanguages}`
                        ]
                      );
                    }
                  }
                });
              }
            }
          });
        }
      }
    })

  };

  //点击成果发布按钮
  handlePublish = e => {
    e.preventDefault();
    // let values = this.formRef.props.form.getFieldsValue();
    let target_workModelMsg_Main = this.props.radarModel.target_workModelMsg_Main;
    this.formRef.props.form.validateFields((err, values) => {
      if (err) {
        message.warning(language[`improveECMSpecialReportTips_${this.props.language.getlanguages}`])
        return false;
      } else {
        if (values.model == "-1") {
          message.warning(
            language[`select_radar_target_model_${this.props.language.getlanguages}`]
          );
          return false;
        }
        if (!target_workModelMsg_Main || (target_workModelMsg_Main && target_workModelMsg_Main.length == 0)) {
          message.warning(language[`Please_fill_working_mode_${this.props.language.getlanguages}`]);
          return false;
        }
        let workModelData = this.props.radarModel.target_workModelMsg_Main;
        if (!workModelData) {
          message.warning(
            language[`Please_fill_working_mode_${this.props.language.getlanguages}`]
          );
          return false;
        }

        //判断技术体制是否为连续波或者非连续波   工作模式下方对应的频率、脉宽和重复间隔是否填写正确
        if (values.technologyName === "15") {
          this.props.dispatch({
            type: "radarModel/select_ContinWave",
            payload: "CW",
            callback: res => {
              if (res.data[0] === "2") {
                //每条工作模式下至少存在一个频率值！
                message.warning(
                  language[
                  `AtLeastOneFrequencyInWorkingMode_${this.props.language.getlanguages
                  }`
                  ]
                );
                return false;
              } else if (res.data[0] === "3") {
                this.props.dispatch({
                  type: "radarModel/publish_target_allData",
                  payload: {
                    sign: this.props.radarModel.sn,
                    electronicObjectId: "null",
                    objectName: values.objectName,
                    model: values.model,
                    countryName: values.countryName,
                    forName: values.forName,
                    threadName: values.threadName,
                    purpose: values.purpose,
                    deployInformation: values.deployInformation,
                    activeAreaDescription: values.activeAreaDescription,
                    manufacturer: values.manufacturer
                  },
                  callback: res => {
                    if (res.data[0] == 0) {
                      //雷达名称重复
                      message.warning(
                        language[`RadarTargetNameRepeat_${this.props.language.getlanguages
                        }`
                        ]
                      );
                      this.props.dispatch({
                        type: "radarModel/updataRadarBasicMsg",
                        payload: values
                      });
                      return false;
                    } else if (res.data[0] == 2) {
                      //保存失败
                      this.props.dispatch({
                        type: "radarModel/updataRadarBasicMsg",
                        payload: values
                      });
                      message.error(
                        language[`operationFailed_${this.props.language.getlanguages}`
                        ]
                      );
                    } else if (res.data[0] == 1) {
                      message.success(
                        language[`publishSuccess_${this.props.language.getlanguages}`
                        ]
                      );
                      this.setState(
                        {
                          goBackMark: !this.state.goBackMark
                        },
                        function () {
                          this.context.router.history.push("/radarinformation");
                        }
                      );
                    }
                  }
                });
              }
            }
          });
        } else {
          this.props.dispatch({
            type: "radarModel/select_ContinWave",
            payload: "NotContinWave",
            callback: res => {
              //提示工作模式不对。需要删除此条工作模式
              if (res.data[0] && res.data[0].split(",")[0] === "1") {
                let data = res.data[0].split(",");
                let name = "";
                for (let i = 0; i < data.length - 1; i++) {
                  name += data[i + 1] + ",";
                }
                message.warning(
                  language[`ModelCode_${this.props.language.getlanguages}`] +
                  name.slice(0, name.length - 1) +
                  language[
                  `IsNotAvailableWorkingMode_${this.props.language.getlanguages
                  }`
                  ]
                );
                return false;
              } else if (res.data[0] === "2") {
                //每条工作模式都需要至少一个射频值！
                message.warning(
                  language[
                  `AtLeastOneFrequencyInWorkingMode_${this.props.language.getlanguages
                  }`
                  ]
                );
                return false;
              } else if (res.data[0] === "4") {
                //每条工作模式都需要至少一个脉宽值！
                message.warning(
                  language[
                  `AtLeastOneFwInWorkingMode_${this.props.language.getlanguages}`
                  ]
                );
                return false;
              } else if (res.data[0] === "3") {
                //每条工作模式都需要至少一个重复间隔值！
                message.warning(
                  language[
                  `AtLeastOneFriInWorkingMode_${this.props.language.getlanguages}`
                  ]
                );
                return false;
              } else if (res.data[0] === "0") {
                this.props.dispatch({
                  type: "radarModel/publish_target_allData",
                  payload: {
                    sign: this.props.radarModel.sn,
                    electronicObjectId: "null",
                    objectName: values.objectName,
                    model: values.model,
                    countryName: values.countryName,
                    forName: values.forName,
                    threadName: values.threadName,
                    purpose: values.purpose,
                    deployInformation: values.deployInformation,
                    activeAreaDescription: values.activeAreaDescription,
                    manufacturer: values.manufacturer
                  },
                  callback: res => {
                    if (res.data[0] == 0) {
                      //雷达名称重复
                      message.warning(
                        language[`RadarTargetNameRepeat_${this.props.language.getlanguages
                        }`
                        ]
                      );
                      this.props.dispatch({
                        type: "radarModel/updataRadarBasicMsg",
                        payload: values
                      });
                      return false;
                    } else if (res.data[0] == 2) {
                      //保存失败
                      this.props.dispatch({
                        type: "radarModel/updataRadarBasicMsg",
                        payload: values
                      });
                      message.error(
                        language[`operationFailed_${this.props.language.getlanguages}`
                        ]
                      );
                    } else if (res.data[0] == 1) {
                      message.success(
                        language[`publishSuccess_${this.props.language.getlanguages}`
                        ]
                      );
                      this.setState(
                        {
                          goBackMark: !this.state.goBackMark
                        },
                        function () {
                          this.context.router.history.push("/radarinformation");
                        }
                      );
                      // this.context.router.history.push('/radarinformation')
                    }
                  }
                });
              }
            }
          });
        }
      }
    })

    // if (!values.objectName) {
    //   message.warning(
    //     language[
    //     `improveECMSpecialReportTips_${this.props.language.getlanguages}`
    //     ]
    //   );
    //   return false;
    // }

  };

  //当目标库的名称失去焦点的时候判断是否和数据库中的名称有重复
  selectRepeate = () => {
    let name = this.props.form.getFieldValue("objectName");
    this.props.dispatch({
      type: "radarModel/saveRadarName",
      payload: {
        name: name
      }
    });
    let urll;
    if (typeof window.getUrl == "function") {
      urll = window.getUrl() + "/api/LK-0313036/LK036";
    } else {
      urll = "http://192.168.0.107:8087";
    }
    axios({
      method: "get",
      url: urll + "/RadarInformationReorganize/selectObjectName",
      params: {
        objectName: name
      }
    })
      .then(res => {
        if (res.data[0] === 1) {
          document.getElementById("objectName").style.border = "1px solid #f00";
          document.getElementById("objectName").value = "";
          message.warning(
            language[
            `RadarTargetNameRepeat_${this.props.language.getlanguages}`
            ]
          );
        } else {
          document.getElementById("objectName").style.border = "none";
          this.setState({
            radarName: document.getElementById("objectName").value
          });
        }
      })
      .catch(error => {
        error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
      });
  };

  //点击对比分析按钮
  handleContrast = e => {
    e.preventDefault();
    if (!document.getElementById("objectName").value) {
      message.warning(
        language[`InputZBData_${this.props.language.getlanguages}`]
      );
    } else if (
      (this.props.radarModel.ModelMsg[0] &&
        !this.props.radarModel.ModelMsg[0][0]) ||
      (this.props.radarModel.ModelMsg[0][0] &&
        !this.props.radarModel.ModelMsg[0][0].objectName)
    ) {
      message.warning(
        language[`InputZBDataNotAll_${this.props.language.getlanguages}`]
      );
    } else {
      let values = this.formRef.props.form.getFieldsValue();
      const { dispatch } = this.props;
      this.setState({ DBFX: !this.state.DBFX }, function () {
        dispatch({
          type: "radarModel/handleCompare",
          payload: {
            values: values,
            DBFX: this.state.DBFX
          }
        });
      });
    }
  };

  //点击切换到雷达情报库大模块
  handleClickClose = () => {
    let { dispatch } = this.props;
    dispatch({
      type: "changeComp/ClickCloseL",
      payload: {
        mark: "second"
      }
    });
    this.setState({ closeTarget: true });
  };

  //点击返回按钮
  handleGoBack = e => {
    e.preventDefault();
    this.setState(
      {
        goBackMark: !this.state.goBackMark
      },
      function () {
        this.context.router.history.push("/radarinformation");
      }
    );
  };

  //雷达目标名称发生变化的时候将值保存起来
  handleSaveObjectName = e => { };

  selectionChangeMB = (selectKey, selectRow) => {
    //目标库弹出框单击单选按钮
    const { name, key } = selectRow[0];
    this.setState({
      selectedRowKeysMB: key,
      selectedRowKeysMBName: name
    });
  };
  selectionChange = (selectKey, selectRow) => {
    //侦察情报库弹出框单击单选按钮
    const { objectName, key, identifyRadarId } = selectRow[0];
    this.setState({
      selectedRowKeys: key,
      selectedInfoName: objectName,
      selectedIdentifyRadarId: identifyRadarId
    });
  };

  changeIndex = () => { };
  render() {
    const Option = Select.Option;

    console.log("dddddddddddd", this.props.radarModel.ZCtotalCount)
    const paginationPropsnum = {
      pageSize: 8,
      onChange: this.changeZCNum,
      total: this.props.radarModel.ZCtotalCount,
      showQuickJumper: true,// 显示可以输入页数跳转框
    };

    const paginationPropsnumTarget = {
      pageSize: 8,
      onChange: this.changeTargetNum,
      total: this.props.radarModel.totalCount,
      showQuickJumper: true,// 显示可以输入页数跳转框
    };

    const { TextArea } = Input;
    let { targetvisible, infovisible } = this.state;
    const rowSelection = {
      type: "radio",
      selectedRowKeys: [this.state.selectedRowKeys],
      onChange: this.selectionChange
    };

    const rowSelectionMB = {
      type: "radio",
      selectedRowKeys: this.state.selectedRowKeysMB,
      onChange: this.selectionChangeMB
    };
    // 从目标库导入
    const targetcolumns = [
      {
        //序号
        title:
          <Tooltip placement='top' title={language[`SerialNumber_${this.props.language.getlanguages}`]}>
            {language[`SerialNumber_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "id",
      },
      {
        //内码
        title:
          <Tooltip placement='top' title={language[`InternalCode_${this.props.language.getlanguages}`]}>
            {language[`InternalCode_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "key",
        ellipsis: true,
        width: "13%"
      },
      {
        title:
          <Tooltip placement='top' title={language[`ObjectName_${this.props.language.getlanguages}`]}>
            {language[`ObjectName_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "name",
        ellipsis: true,
        width: "15%"
      },
      {
        //装备型号
        title:
          <Tooltip placement='top' title={language[`PartsType_${this.props.language.getlanguages}`]}>
            {language[`PartsType_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "type",
        ellipsis: true
      },
      {
        //国家地区
        title:
          <Tooltip placement='top' title={language[`countriesAndRegions_${this.props.language.getlanguages}`]}>
            {language[`countriesAndRegions_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "countryId",
        ellipsis: true
      },
      {
        //敌我属性
        title:
          <Tooltip placement='top' title={language[`FriendOrFoeProperties_${this.props.language.getlanguages}`]}>
            {language[`FriendOrFoeProperties_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "forId",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`threatLevel_${this.props.language.getlanguages}`]}>
            {language[`threatLevel_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "level",
        ellipsis: true
      },
      {
        //设备用途
        title:
          <Tooltip placement='top' title={language[`useOfEquipment_${this.props.language.getlanguages}`]}>
            {language[`useOfEquipment_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "yt",
        ellipsis: true
      },
      {
        //部署信息
        title:
          <Tooltip placement='top' title={language[`DeploymentInformation_${this.props.language.getlanguages}`]}>
            {language[`DeploymentInformation_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "info",
        ellipsis: true
      }
    ];

    let targetData = this.state.targetdata;
    let targetTableData = [];
    if (targetData) {
      for (let i = 0; i < targetData.length; i++) {
        targetTableData.push({
          id: 8 * (this.state.pageNumber - 1) + i + 1,
          key: targetData[i].key,
          name: targetData[i].name,
          type: targetData[i].type,
          level: targetData[i].level, //威胁等级
          yt: targetData[i].yt,
          info: targetData[i].info,
          forId: targetData[i].forId,
          countryId: targetData[i].countryId
        })
      }
    }

    //从侦察情报库导入
    let infodata = this.state.infodata;
    let infoTableData = [];
    if (infodata) {
      for (let i = 0; i < infodata.length; i++) {
        infoTableData.push({
          key: 8 * (this.state.pageNumber_zc - 1) + i + 1,
          identifyRadarId: infodata[i].identifyRadarId,
          objectName: infodata[i].objectName,
          typeName: infodata[i].typeName,
          platfomName: infodata[i].platfomName,
          // modelName: data[i].modelName,
          threatName: infodata[i].threatName,
          remark: infodata[i].remark,
          countryId: infodata[i].countryId,
          forId: infodata[i].forId
        })
      }
    }

    // 从侦察情报库导入
    const infocolumns = [
      {
        title: language[`number_${this.props.language.getlanguages}`],
        dataIndex: "key",
      },
      {
        title:
          <Tooltip placement='top' title={language[`IdentifyRadarInternalCode_${this.props.language.getlanguages}`]}>
            {language[`IdentifyRadarInternalCode_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "identifyRadarId",
        ellipsis: true,
        width: "10%"
      },
      // 辐射源型号
      {
        title:
          <Tooltip placement='top' title={language[`name_${this.props.language.getlanguages}`]}>
            {language[`RadiationSourceModel_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "objectName",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`category_${this.props.language.getlanguages}`]}>
            {language[`category_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "typeName",
        ellipsis: true
      },
      {
        //国家地区
        title:
          <Tooltip placement='top' title={language[`countriesAndRegions_${this.props.language.getlanguages}`]}>
            {language[`countriesAndRegions_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "countryId",
        ellipsis: true
      },
      {
        //敌我属性
        title:
          <Tooltip placement='top' title={language[`FriendOrFoeProperties_${this.props.language.getlanguages}`]}>
            {language[`FriendOrFoeProperties_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "forId",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`PlatformType_${this.props.language.getlanguages}`]}>
            {language[`PlatformType_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "platfomName",
        ellipsis: true
      },
      // {
      //   title: language[`PlatformModel_${this.props.language.getlanguages}`],
      //   dataIndex: 'modelName',
      // },
      {
        title:
          <Tooltip placement='top' title={language[`threatLevel_${this.props.language.getlanguages}`]}>
            {language[`threatLevel_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "threatName",
        ellipsis: true
      }
    ];

    return (
      <div className={style.clearFloat} style={{ width: "1920px" }}>
        <div className={style.ContentZone}>
          {/* 第一个模块，默认显示大的第一个模块，当切换到模块3的时候，第一个模块和第二个模块变960宽度，当切换到2的时候，第一个模块隐藏，第二个模块大图显示 */}
          <div className={style.Content_wrap}>
            {/* 按钮一直显示 */}
            <div className={style.BtnBox_wrap}>
              {/* 左边的按钮 */}
              <div style={{ margin: "0 13px", float: "left" }}>
                {/* 从目标库导入按钮 */}
                <Button
                  type="primary"
                  style={{ margin: "0 10px" }}
                  onClick={this.targetShowModalMin}
                >
                  {language[`ImportFromRadarIntelligenceIntegrationDatabase_${this.props.language.getlanguages}`]}
                </Button>
                {/* 从侦察情报库导入按钮 */}
                <Button type="primary" onClick={this.infoShowModal}>
                  {language[`ImportFromRadar_${this.props.language.getlanguages}`]}
                </Button>

                {/* 是否放弃此次创建的整编对象弹出框的确定按钮 */}
                {this.state.visibleConfirm ? (
                  <DialogConfirmMask
                    TitleText={language[`ImportFromRadarIntelligenceIntegrationDatabase_${this.props.language.getlanguages}`]}
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
                          style={{ lineHeight: "25px", marginBottom: "20px", fontWeight: "bold" }}
                          id="ConfirmTips"
                        >
                          {
                            language[`discard_integration_object_${this.props.language.getlanguages}`]
                          }
                        </div>
                      </div>
                    }
                  />
                ) : null}

                {targetvisible ? (
                  <Dialog
                    TitleText={language[`ImportFromRadarIntelligenceIntegrationDatabase_${this.props.language.getlanguages}`]}
                    showDialog={targetvisible}
                    onOk={this.handleOkMB}
                    Disabled={this.state.selectedRowKeysMB ? false : true}
                    okText={language[`MakeSureImport_${this.props.language.getlanguages}`]}
                    cancelText={
                      language[`quit_${this.props.language.getlanguages}`]
                    }
                    onCancel={this.handleCancel}
                    className={styleless.targetpop}
                    showFooter
                    showMask
                    BodyContent={
                      <div className={style.popFodderTypeMax}>
                        <div
                          className={style.select_condition_targetDialog_Target}
                        >
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
                                <Option value="00">--{language[`DropdownSelection_${this.props.language.getlanguages}`]}--
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
                                <Option value="00">--{language[`DropdownSelection_${this.props.language.getlanguages}`]}--</Option>
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
                        <div
                          className={style.select_condition_targetDialog_Target}
                        >
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
                                <Option value="00">--{language[`DropdownSelection_${this.props.language.getlanguages}`]}--
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
                              {language[`ObjectName_${this.props.language.getlanguages}`]}
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
                        <div className={style.targettable}>
                          <Table
                            loading={
                              this.props.loading.effects[
                              "radarModel/importFromTarget"
                              ]
                            }
                            rowKey={record => record.key}
                            onRow={(record, index) => {
                              return {
                                onClick: event => {
                                  this.setState({
                                    selectedRowKeysMB: record.key,
                                    selectedRowKeysMBName: record.name
                                  });
                                }
                              };
                            }}
                            rowSelection={rowSelectionMB}
                            columns={targetcolumns}
                            dataSource={targetTableData}
                            className={styleless.myTarget}
                            rowClassName={(record, index) =>
                              index % 2 === 0 ? styleless.odd : styleless.even
                            } //奇偶行颜色交替变化
                            pagination={paginationPropsnumTarget}
                          />
                        </div>
                      </div>
                    }
                  />
                ) : null}

                {infovisible ? (
                  <Dialog
                    TitleText={language[`ImportFromRadar_${this.props.language.getlanguages}`]}
                    showDialog={infovisible}
                    onOk={this.handleOk}
                    Disabled={this.state.selectedRowKeys ? false : true}
                    okText={language[`MakeSureImport_${this.props.language.getlanguages}`]}
                    cancelText={
                      language[`quit_${this.props.language.getlanguages}`]
                    }
                    onCancel={this.handleCancel}
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
                                dropdownStyle={{ zIndex: "1054" }}
                              >
                                <Option value="00">--{language[`DropdownSelection_${this.props.language.getlanguages}`]}--
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
                                <Option value="00">--{language[`DropdownSelection_${this.props.language.getlanguages}`]}--
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
                                <Option value="00">--{language[`DropdownSelection_${this.props.language.getlanguages}`]}--
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
                          {/* 辐射源型号 */}
                          <div>
                            <span>
                              {language[`RadiationSourceModel_${this.props.language.getlanguages}`]}
                            </span>
                            <div>
                              <Input
                                style={{ width: "200px" }}
                                onKeyUp={this.handleChange_ZC_NAME}
                              />
                            </div>
                          </div>
                        </div>
                        <div className={style.select_condition_targetDialog}>
                          {/* 批号 */}
                          <div>
                            <span>{language[`IdentifyRadarInternalCode_${this.props.language.getlanguages}`]}</span>
                            <div>
                              <Input
                                style={{ width: "200px" }}
                                onKeyUp={this.handleChange_ZC_identifyId}
                              />
                            </div>
                          </div>

                        </div>
                        <div className={style.targettable}>
                          <Table
                            loading={this.state.ZBDataLoading}
                            rowKey={record => record.key}
                            onRow={(record, index) => {
                              return {
                                onClick: event => {
                                  this.setState({
                                    selectedRowKeys: record.key,
                                    selectedInfoName: record.objectName,
                                    selectedIdentifyRadarId:
                                      record.identifyRadarId
                                  });
                                }
                              };
                            }}
                            rowSelection={rowSelection}
                            columns={infocolumns}
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
              </div>
              {/* 右边的按钮 */}
              <div
                style={{ margin: "0 13px", float: "right" }}
                className={style.BtnBox}
              >
                <div
                  style={
                    this.state.modelMark === "third"
                      ? { display: "block" }
                      : { display: "none" }
                  }
                >
                  {/* 对比分析按钮 */}
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={this.handleContrast}
                  >
                    {language[`comparativeAnalysis_${this.props.language.getlanguages}`]}
                  </Button>
                </div>
                <div
                  style={
                    this.state.modelMark === "third"
                      ? { display: "block" }
                      : { display: "none" }
                  }
                >
                  {/* 自动整编按钮 */}
                  <Button type="primary" htmlType="submit" onClick={this.ZB}>
                    {language[`AutomaticBGF_${this.props.language.getlanguages}`]}
                  </Button>
                  {this.state.visibleZBConfirm ? (
                    <DialogConfirmMask
                      TitleText={language[`ImportFromRadarIntelligenceIntegrationDatabase_${this.props.language.getlanguages
                        }`]}
                      showDialog={this.state.visibleZBConfirm}
                      onOk={this.handleOkZBConfirm}
                      okText={language[`MakeSureImport_${this.props.language.getlanguages}`]}
                      cancelText={language[`quit_${this.props.language.getlanguages}`]}
                      onCancel={this.handleCancelZBConfirm}
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
                            {language[`differentRadarNameTips_${this.props.language.getlanguages}`]}
                          </div>
                        </div>
                      }
                    />
                  ) : null}
                  {this.state.visibleZBTrueConfirm ? (
                    <DialogConfirmMask
                      TitleText={language[`ImportFromRadarIntelligenceIntegrationDatabase_${this.props.language.getlanguages}`]}
                      showDialog={this.state.visibleZBTrueConfirm}
                      onOk={this.handleOkZBConfirm}
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
                            {language[`differentRadarNameTips_${this.props.language.getlanguages}`]}
                          </div>
                        </div>
                      }
                    />
                  ) : null}
                </div>
                {/* 保存按钮 */}
                <div>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={this.save_submit}
                  >
                    {language[`save_${this.props.language.getlanguages}`]}
                  </Button>
                </div>
                {/* 成果发布按钮 */}
                <div>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={this.handlePublish}
                  >
                    {language[`ResultsReleased_${this.props.language.getlanguages}`]}
                  </Button>
                </div>
                {/* 返回按钮 */}
                <div>
                  {/* <Link to="/radarinformation"> */}
                  <Button type="primary" onClick={this.handleGoBack}>
                    {language[`goBack_${this.props.language.getlanguages}`]}
                  </Button>
                  {/* </Link> */}
                </div>
              </div>
            </div>
            <div
              style={{ paddingTop: "60px", display: "flex", width: "100%" }}
              className={style.clearFloat}
            >
              <div>
                {this.state.modelMark === "first" ||
                  this.state.modelMark === "third" ? (
                  <FirstModel
                    data={this.props.radarModel.targetDetailMsg} //目标库中点击编辑的数据
                    objectName={this.props.radarModel.objectName}
                    wrappedComponentRef={form => (this.formRef = form)} //5、使用wrappedComponentRef 拿到子组件传递过来的ref（官方写法）
                    goBackMark={this.state.goBackMark}
                  />
                ) : (
                  ""
                )}
              </div>
              <div
                className={
                  this.state.bigContent
                    ? style.FirstBoxColumn
                    : style.FirstBoxMinColumn
                }
              />
              <div>
                {this.state.modelMark === "second" ||
                  this.state.modelMark === "third" ? (
                  <SecondModel
                    data={this.props.radarModel.ModelMsg}
                    {...this.state}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
