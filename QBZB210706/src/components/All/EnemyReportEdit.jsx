import React, { Component } from "react";
import {
  Table,
  Select,
  Tree,
  Form,
  Input,
  DatePicker,
  message,
  Button, InputNumber
} from "antd";
import style from "./EnemyReportEdit.css";
import styleless from "./test.less";
import { Link } from "dva/router";
import { connect } from "dva";
import language from "../language/language";
import axios from "axios";
import PropTypes from "prop-types";
import moment from "moment";
import { Menu, Item, MenuProvider } from "react-contexify";
import "react-contexify/dist/ReactContexify.min.css";
import DialogConfirm from "../../utils/DialogConfirmNoMask/Dialog";
import responseStatus from "../../utils/initCode"

const { TreeNode } = Tree;
//敌情报
@connect(({ language, All }) => ({ language, All }))
class EnemyReportEdit extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      visbleTarget: false,
      visible: false,
      currentpage: "1",
      targetDialogData: null,
      targetNameDiaList: null, //弹出框中选中的电子目标
      targetData: [], //目标库列表数据
      objectName: [], //电子目标列表中的目标名称
      hidePopup: "none", // 控制右击弹窗显隐
      treeData: [{ title: "01_OperationalForce", key: "01", children: [] }],
      rightClickKey: null, //右击的是树节点中的对应的key值
      ZBdata: [],
      node: null, //当前右键点击的树节点
      targetDialogData: null,
      targetNameDiaList: null, //弹出框中选中的电子目标
      targetData: [],
      objectName: [], //电子目标列表中的目标名称
      targetDataLength: 0, //电子目标列表的数据长度
      activeIndex: -1, //当前单击选中的行
      visbleTargetZB: false, //树添加部队弹出的电子目标列表
      activeName: null, //树电子目标单击选中的一行中的电子目标名称

      addToops: false, //右键菜单添加部队
      addEquipment: false,
      editToops: false,
      editEquipment: false,
      deleteToops: false,
      deleteEquipment: false,
      ZBNumber: null,
      saveMark: false,
      TroopsNameValue: null,
      addTroopsMark: null, //添加部队和编辑部队的标志
      addEquipmentMark: null, //添加装备和编辑装备的标记
      EquipType: "00",
      OneButtonImportData: null, //一键导入的列表数据
      targetAllType: null,
      delectData: null, //删除部队或者装备的标识

      DeploymentHellValue: null, //装备中部署地域的值
      ZBNameValue: null, //装备名称的值
      CombatMissionValue: null, //作战任务的值
      visibleConfirm: false,
      targetDialogDataLoading: false //导入目标的弹出框的loading
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: "ElectronicTarget/selectTargetType",
      callback: res => {
        if (res.data[0]) {
          let data = res.data[0];
          this.setState({ targetAllType: data });
        }
      }
    });
  }

  UNSAFE_componentWillReceiveProps({ All }) {
    if (All.sendTreeMsg_data) {
      if (All.sendTreeMsg_data === "addTroops") {
        document.getElementById("TroopsPage").style.display = "block";
        document.getElementById("ZBPage").style.display = "none";
      } else if (All.sendTreeMsg_data === "addZB") {
        document.getElementById("TroopsPage").style.display = "none";
        document.getElementById("ZBPage").style.display = "block";
      }
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: "All/clearSpecialMsg"
    });
    this.props.dispatch({
      type: "All/deleteCacheEnemy"
    });
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
  //导入电子目标
  importTarge = () => {
    this.setState({
      visbleTarget: true,
      targetDialogDataLoading: true
    });
    let urll;
    if (typeof window.getUrl == "function") {
      urll = window.getUrl() + "/api/LK-0313036/LK036";
    } else {
      urll = "http://192.168.0.107:8087";
    }
    axios({
      method: "get",
      url: urll + "/SynthInformationReorganize/selectElectObj"
    })
      .then(res => {
        this.setState({ targetDialogDataLoading: false });
        var nowData = [];
        var data = res.data[0];
        for (let i = 0; i < data.length; i++) {
          nowData.push({
            key: i,
            objectName: data[i].objectName,
            modelName: data[i].modelName,
            plantType: language[`aircraft_${this.props.language.getlanguages}`],
            countryName: data[i].countryName,
            forName: data[i].forName,
            threadName: data[i].threadName
          });
        }
        this.setState({ targetDialogData: nowData });
      })
      .catch(error => {
        error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
      });
  };

  //表单的提交时间
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
      }
    });
  };

  FormData = () => {
    this.props.form.validateFields((err, values) => {
      this.props.dispatch({
        type: "All/saveSpecialormMsg",
        payload: values
      });
    });
  };

  handleCancelTarget = () => {
    this.setState({
      visbleTarget: false,
      visbleTargetZB: false
    });
  };
  //电子目标列表中的删除
  handleDelete = (record, key) => {
    const dataSource = [...this.props.All.ElectronicTargetColumn_Special];
    let objectName = this.state.objectName; //目标列表中的目标名称
    let delObjectName = record.objectName; //当前删除的目标名称
    let number = objectName.indexOf(delObjectName);
    objectName.splice(number, 1); //将目标名称数组中当前删除的目标名称清理掉
    this.setState({ objectName: objectName });
    let data = dataSource.filter(item => item.objectName !== record.objectName);
    this.props.dispatch({
      type: "All/deleteElectronicTargetColumn_Special",
      payload: data
    });
  };

  //点击"保存"按钮
  handleResultsReleased = e => {
    e.preventDefault();
    let { dispatch } = this.props;
    let Values;
    let Context = this.context;
    this.props.form.validateFields((err, fieldsValue) => {
      if (!fieldsValue.reportName) {
        message.warning(language[`improveECMSpecialReportTips_${this.props.language.getlanguages}`]);
      } else {
        if (!err) {
          // if (String(fieldsValue.enemySignId).length != 4) {
          //   message.warning(language[`TheIdentificationOfEnemyInformationReportMustBe4_${this.props.language.getlanguages}`]);
          //   return false;
          // }
          Values = {
            ...fieldsValue,
            pubishTime: fieldsValue["pubishTime"]
              ? fieldsValue["pubishTime"].format("YYYY-MM-DD HH:mm:ss")
              : null
          };
          let arr1 = [];
          let arr2 = [];
          let arr3 = [];
          let arr4 = [];
          if (this.props.All.imgData_Special) {
            let data = this.props.All.imgData_Special;
            for (let i = 0; i < data.length; i++) {
              arr1.push(data[i].fileId);
            }
          }
          if (this.props.All.videoData_Special) {
            let data = this.props.All.videoData_Special;
            for (let i = 0; i < data.length; i++) {
              arr2.push(data[i].fileId);
            }
          }
          if (this.props.All.htmlData_Special) {
            let data = this.props.All.htmlData_Special;
            for (let i = 0; i < data.length; i++) {
              arr3.push(data[i].fileId);
            }
          }
          if (this.props.All.docData_Special) {
            let data = this.props.All.docData_Special;
            for (let i = 0; i < data.length; i++) {
              arr4.push(data[i].fileId);
            }
          }
          let fileName = arr1
            .concat(arr2)
            .concat(arr3)
            .concat(arr4);
          let enemyAYList = this.props.All.TroopsDataList;
          let enemyReportEntityAtEquipList = this.props.All.EquipmentDataList;
          let treeData = this.props.All.treeData;
          function a() {
            return new Promise(function (open, err) {
              dispatch({
                type: "All/ClickSaveBtnEnemy",
                payload: {
                  ...Values, //基本信息
                  reportType: "敌情报告",
                  enemyReportEntityAtArmyList: [
                    {
                      enemyAYList: enemyAYList,
                      enemyReportEntityAtEquipList: enemyReportEntityAtEquipList,
                      enemyReportEntityAtArmyList: JSON.stringify(treeData)
                    }
                  ],
                  fileName: fileName,
                  picList: [],
                  videoList: [],
                  htmlList: [],
                  docList: []
                },
                callback: res => {
                  if (res.data[0] == 1) {
                    open();
                  }
                }
              });
            });
          }
          function b() {
            return new Promise(function (open, err) {
              dispatch({
                type: "All/selectZBList",
                callback: res => {
                  if (res.data) {
                    open();
                  }
                }
              });
            });
          }
          function c() {
            return new Promise(function (open, err) {
              Context.router.history.push("/all?id=object");
            });
          }
          a()
            .then(b)
            .then(c);
        }
      }
    });
  };

  // 点击“成果发布成pdf”按钮
  handleResultsPublish = e => {
    e.preventDefault();
    //获取cookie是中文还是法文
    let getLanguage = getCookie("uop.locale") === "fr_FR" ? "fr" : "zh";
    let { dispatch } = this.props;
    let Values;
    let Context = this.context;
    this.props.form.validateFields((err, fieldsValue) => {
      if (!fieldsValue.reportName) {
        message.warning(language[`improveECMSpecialReportTips_${this.props.language.getlanguages}`
          ]
        );
      } else {
        if (!err) {
          // if (String(fieldsValue.enemySignId).length != 4) {
          //   message.warning(language[`TheIdentificationOfEnemyInformationReportMustBe4_${this.props.language.getlanguages}`]);
          //   return false;
          // }
          Values = {
            ...fieldsValue,
            pubishTime: moment().format("YYYY-MM-DD HH:mm:ss")
          };
          let arr1 = [];
          let arr2 = [];
          let arr3 = [];
          let arr4 = [];
          if (this.props.All.imgData_Special) {
            let data = this.props.All.imgData_Special;
            for (let i = 0; i < data.length; i++) {
              arr1.push(data[i].fileId);
            }
          }
          if (this.props.All.videoData_Special) {
            let data = this.props.All.videoData_Special;
            for (let i = 0; i < data.length; i++) {
              arr2.push(data[i].fileId);
            }
          }
          if (this.props.All.htmlData_Special) {
            let data = this.props.All.htmlData_Special;
            for (let i = 0; i < data.length; i++) {
              arr3.push(data[i].fileId);
            }
          }
          if (this.props.All.docData_Special) {
            let data = this.props.All.docData_Special;
            for (let i = 0; i < data.length; i++) {
              arr4.push(data[i].fileId);
            }
          }
          let fileName = arr1
            .concat(arr2)
            .concat(arr3)
            .concat(arr4);
          let enemyAYList = this.props.All.TroopsDataList;
          let enemyReportEntityAtEquipList = this.props.All.EquipmentDataList;
          let treeData = this.props.All.treeData;
          function a() {
            return new Promise(function (open, err) {
              //根据cookie获取出来的中法文标识调用不同的后端接口====后端生成的pdf是中文版还是法文版
              if (getLanguage === "zh") {
                dispatch({
                  type: "All/ClickPublishBtnEnemy",
                  payload: {
                    ...Values, //基本信息
                    reportType: "敌情报告",
                    enemyReportEntityAtArmyList: [
                      {
                        enemyAYList: enemyAYList,
                        enemyReportEntityAtEquipList: enemyReportEntityAtEquipList,
                        enemyReportEntityAtArmyList: JSON.stringify(treeData)
                      }
                    ],
                    fileName: fileName,
                    picList: [],
                    videoList: [],
                    htmlList: [],
                    docList: []
                  },
                  callback: res => {
                    if (res.data[0] == 0) {
                      message.warning(language[`please_save_atFirst_${this.props.language.getlanguages}`]);
                    } else {
                      let routerMsg;
                      if (typeof window.getUrl == "function") {
                        routerMsg = window.getUrl() + "/api";
                      } else {
                        routerMsg = "http://192.168.0.107:8087";
                      }
                      window.open(routerMsg + res.data[0], "_blank");
                      open();
                    }
                  }
                });
              } else {
                dispatch({
                  type: "All/ClickPublishBtnEnemy_fr",
                  payload: {
                    ...Values, //基本信息
                    reportType: "敌情报告",
                    enemyReportEntityAtArmyList: [
                      {
                        enemyAYList: enemyAYList,
                        enemyReportEntityAtEquipList: enemyReportEntityAtEquipList,
                        enemyReportEntityAtArmyList: JSON.stringify(treeData)
                      }
                    ],
                    fileName: fileName,
                    picList: [],
                    videoList: [],
                    htmlList: [],
                    docList: []
                  },
                  callback: res => {
                    if (res.data[0] == 0) {
                      message.warning(
                        language[`please_save_atFirst_${
                        this.props.language.getlanguages
                        }`
                        ]
                      );
                    } else {
                      let routerMsg;
                      if (typeof window.getUrl == "function") {
                        routerMsg = window.getUrl() + "/api";
                      } else {
                        routerMsg = "http://192.168.0.107:8087";
                      }
                      window.open(routerMsg + res.data[0], "_blank");
                      open();
                    }
                  }
                });
              }
            });
          }
          function b() {
            return new Promise(function (open, err) {
              dispatch({
                type: "All/selectZBList",
                callback: res => {
                  if (res.data) {
                    open();
                  }
                }
              });
            });
          }
          function c() {
            return new Promise(function (open, err) {
              Context.router.history.push("/all?id=object");
            });
          }
          a()
            .then(b)
            .then(c);
        }
      }
    });
  };

  // 点击“成果发布成json”按钮
  handleResultsPublishJSON = e => {
    e.preventDefault();
    //获取cookie是中文还是法文
    let getLanguage = getCookie("uop.locale") === "fr_FR" ? "fr" : "zh";
    let { dispatch } = this.props;
    let Values;
    let Context = this.context;
    this.props.form.validateFields((err, fieldsValue) => {
      if (!fieldsValue.reportName) {
        message.warning(language[`improveECMSpecialReportTips_${this.props.language.getlanguages}`
          ]
        );
      } else {
        if (!err) {
          // if (String(fieldsValue.enemySignId).length != 4) {
          //   message.warning(language[`TheIdentificationOfEnemyInformationReportMustBe4_${this.props.language.getlanguages}`]);
          //   return false;
          // }
          Values = {
            ...fieldsValue,
            pubishTime: moment().format("YYYY-MM-DD HH:mm:ss")
          };
          let arr1 = [];
          let arr2 = [];
          let arr3 = [];
          let arr4 = [];
          if (this.props.All.imgData_Special) {
            let data = this.props.All.imgData_Special;
            for (let i = 0; i < data.length; i++) {
              arr1.push(data[i].fileId);
            }
          }
          if (this.props.All.videoData_Special) {
            let data = this.props.All.videoData_Special;
            for (let i = 0; i < data.length; i++) {
              arr2.push(data[i].fileId);
            }
          }
          if (this.props.All.htmlData_Special) {
            let data = this.props.All.htmlData_Special;
            for (let i = 0; i < data.length; i++) {
              arr3.push(data[i].fileId);
            }
          }
          if (this.props.All.docData_Special) {
            let data = this.props.All.docData_Special;
            for (let i = 0; i < data.length; i++) {
              arr4.push(data[i].fileId);
            }
          }
          let fileName = arr1
            .concat(arr2)
            .concat(arr3)
            .concat(arr4);
          let enemyAYList = this.props.All.TroopsDataList;
          let enemyReportEntityAtEquipList = this.props.All.EquipmentDataList;
          let treeData = this.props.All.treeData;
          function a() {
            return new Promise(function (open, err) {
              let urll;
              if (typeof window.getUrl == "function") {
                //根据主站遥控本控模式设置（全局函数）
                urll = window.getUrl() + "/api/LK-0313036/LK036";
              } else {
                urll = "http://192.168.0.107:8087";
              }
              axios({
                method: "POST",
                url: urll + "/SynthInformationReorganize/enemyPublishJson",
                data: {
                  ...Values, //基本信息
                  reportType: "敌情报告",
                  enemyReportEntityAtArmyList: [
                    {
                      enemyAYList: enemyAYList,
                      enemyReportEntityAtEquipList: enemyReportEntityAtEquipList,
                      enemyReportEntityAtArmyList: JSON.stringify(treeData)
                    }
                  ],
                  fileName: fileName,
                  picList: [],
                  videoList: [],
                  htmlList: [],
                  docList: []
                }
              })
                .then(response => {
                  console.log("response", response);
                  if (response && response.data) {
                    //下载为json文件
                    var Link = document.createElement("a");
                    Link.download = response.data[1];
                    Link.style.display = "none";
                    let jsonContent =
                      response.data[0] && response.data[0][0]
                        ? response.data[0][0]
                        : "";
                    let jsonContentNew = JSON.stringify(
                      jsonContent,
                      null,
                      "\t"
                    );
                    // 字符内容转变成blob地址
                    var blob = new Blob([jsonContentNew]);
                    Link.href = URL.createObjectURL(blob);
                    // 触发点击
                    document.body.appendChild(Link);
                    Link.click();
                    // 然后移除
                    document.body.removeChild(Link);
                    open();
                  }
                })
                .catch(error => {
                  error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
                });
            });
          }
          function b() {
            return new Promise(function (open, err) {
              dispatch({
                type: "All/selectZBList",
                callback: res => {
                  if (res.data) {
                    open();
                  }
                }
              });
            });
          }
          function c() {
            return new Promise(function (open, err) {
              Context.router.history.push("/all?id=object");
            });
          }
          a().then(b).then(c);
        }
      }
    });
  };

  //报告名称失去焦点的时候
  handleReportName_blur = e => {
    e.preventDefault();
    this.FormData();
    let name = e.target.value;
    if (e.target.value && !this.props.All.selectEditData_dataMark) {
      //当新建整编对象的时候，报告名称输入框失去焦点查询数据库是否有相同名称内容
      let urll;
      if (typeof window.getUrl == "function") {
        urll = window.getUrl() + "/api/LK-0313036/LK036";
      } else {
        urll = "http://192.168.0.107:8087";
      }
      axios({
        method: "get",
        url: urll + "/SynthInformationReorganize/selectEnemyHaveReportName",
        params: { reportName: name }
      }).then(res => {
        if (res.data[0] == 1) {
          document.getElementById("reportName").style.border = "1px solid red";
          message.warning(
            language[`nameRepeatMsg_${this.props.language.getlanguages}`]
          );
          return false;
        } else {
          document.getElementById("reportName").style.border = "none";
        }
      }).catch(error => {
        error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
      });
    }
  };

  onSelect = (selectedKeys, info) => { };

  mouseDown = (e, record) => {
    this.setState({
      hidePopup: "none"
    });
  };

  //遍历树的数据渲染树
  renderTreeNodes = data =>
    data
      ? data.map(item => {
        if (item.children) {
          return (
            <TreeNode
              loadData={this.onLoadData}
              title={item.title}
              key={item.key}
              dataRef={item}
            >
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} {...item} dataRef={item} />;
      })
      : null;

  rightClick = ({ event, node }) => {
    //树右键点击
    this.setState({ node: node });
    if (node.props.eventKey == "01") {
      this.setState({ addToops: false });
      this.setState({ addEquipment: true });
      this.setState({ editToops: true });
      this.setState({ editEquipment: true });
      this.setState({ deleteToops: true });
      this.setState({ deleteEquipment: true });
    } else if (node.props.title.indexOf("Troops") != -1) {
      this.setState({ addToops: false });
      this.setState({ addEquipment: false });
      this.setState({ editToops: false });
      this.setState({ editEquipment: true });
      this.setState({ deleteToops: false });
      this.setState({ deleteEquipment: true });
    } else if (node.props.title.indexOf("Equipment") != -1) {
      this.setState({ addToops: true });
      this.setState({ addEquipment: true });
      this.setState({ editToops: true });
      this.setState({ editEquipment: false });
      this.setState({ deleteToops: true });
      this.setState({ deleteEquipment: false });
    }
  };

  //右键菜单的点击事件
  onClick01 = type => {
    this.FormData();
    if (type == "添加部队") {
      this.props.form.resetFields(); //给form表单清空值
      document.getElementById("TroopsPage").style.display = "block";
      document.getElementById("ZBPage").style.display = "none";
      this.setState({
        visbleTarget: false,
        TroopsNameValue: null,
        addTroopsMark: "1"
      });
    } else if (type == "添加装备") {
      document.getElementById("ZBPage").style.display = "block";
      document.getElementById("TroopsPage").style.display = "none";
      this.setState({
        addEquipmentMark: "1",
        EquipType: "00",
        ZBNumber: "",
        DeploymentHellValue: null,
        ZBNameValue: null,
        CombatMissionValue: null
      });
    } else if (type == "编辑部队") {
      document.getElementById("TroopsPage").style.display = "block";
      document.getElementById("ZBPage").style.display = "none";

      //编辑部队时给部队名称赋值
      let oldName = this.state.node.props.dataRef.title.split("Troops-")[1];
      document.getElementById("TroopsName").value = oldName;
      this.setState({
        visbleTarget: false,
        TroopsNameValue: null,
        addTroopsMark: "2"
      });
    } else if (type == "删除部队") {
      this.setState({ visibleConfirm: true, delectData: "1" });
    } else if (type == "编辑装备") {
      document.getElementById("TroopsPage").style.display = "none";
      document.getElementById("ZBPage").style.display = "block";
      this.setState({ addEquipmentMark: "2" });
      let key = this.state.node.props.dataRef.key;
      let data = this.props.All.EquipmentDataList
        ? this.props.All.EquipmentDataList
        : [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].equipId == key) {
          document.getElementById("CombatMission").value =
            data[i].equipMission == "null" ? "" : data[i].equipMission;
          this.setState({
            EquipType: data[i].equipType,
            ZBNumber:
              data[i].equipNum && data[i].equipNum != "null"
                ? data[i].equipNum
                : "",
            ZBNameValue:
              data[i].equipName && data[i].equipName != "null"
                ? data[i].equipName
                : "",
            DeploymentHellValue:
              data[i].equipDeployArea && data[i].equipDeployArea != "null"
                ? data[i].equipDeployArea
                : "",
            CombatMissionValue:
              data[i].equipMission && data[i].equipMission != "null"
                ? data[i].equipMission
                : ""
          });
        }
      }
    } else if (type == "删除装备") {
      this.setState({ visibleConfirm: true, delectData: "2" });
    }
  };

  //关闭删除弹出框
  handleCancelConfirm = () => {
    this.setState({ visibleConfirm: false, delectData: null });
  };

  //删除树节点的确认框点击确定
  handleOkConfirm = () => {
    //删除部队，部队下面有可能有部队和装备，检查出来都删除
    if (this.state.delectData == "1") {
      let treeNode = this.state.node; //右键的树节点
      let key = this.state.node.props.dataRef.key; //当前单击的树的节点的key值
      let data =
        this.props.All.TroopsDataList == null
          ? []
          : this.props.All.TroopsDataList;
      for (let i = 0; i < data.length;) {
        //删除当前选择的部队和下面包含的部队
        if (key == data[i].forceId || key == data[i].upperForceID) {
          data.splice(i, 1);
        } else {
          i++;
        }
      }
      let equipData =
        this.props.All.EquipmentDataList == null
          ? []
          : this.props.All.EquipmentDataList;
      //删除当前部队下面挂载的装备
      for (let i = 0; i < equipData.length; i++) {
        if (key == equipData[i].forceId) {
          equipData.splice(i, 1);
        }
      }
      //更新树的数据
      let arr = this.props.All.treeData;
      this.searchOption(treeNode.props.dataRef, arr);
      this.props.dispatch({
        type: "All/saveTreeData",
        payload: this.props.All.treeData
      });
      //更新部队的数据
      this.props.dispatch({
        type: "All/saveTroopsData",
        payload: data
      });
      //更新装备的数据
      this.props.dispatch({
        type: "All/saveEquipmentData",
        payload: equipData
      });
      this.setState({ visibleConfirm: false, delectData: null });
      message.success(
        language[`deleteSuccess_${this.props.language.getlanguages}`]
      );
    } else if (this.state.delectData == "2") {
      //删除装备，装备下面不会有部队和装备，只删除自己
      let treeNode = this.state.node; //右键的树节点
      let arr = this.props.All.treeData;
      this.searchOption(treeNode.props.dataRef, arr);
      this.props.dispatch({
        type: "All/saveTreeData",
        payload: this.props.All.treeData
      });
      let key = this.state.node.props.dataRef.key;
      let data =
        this.props.All.EquipmentDataList == null
          ? []
          : this.props.All.EquipmentDataList;
      for (let i = 0; i < data.length; i++) {
        if (key == data[i].equipId) {
          data.splice(i, 1);
        }
      }
      this.props.dispatch({
        type: "All/saveEquipmentData",
        payload: data
      });
      this.setState({ visibleConfirm: false, delectData: null });
      message.success(
        language[`deleteSuccess_${this.props.language.getlanguages}`]
      );
    }
  };

  searchOption = (option, arr, type = "delect") => {
    //option为当前右键的节点,arr为树的数据
    for (let s = 0; s < arr.length; s++) {
      if (arr[s].key === option.key) {
        //如果右键的树节点的key和树上的某一个key相同则删除这个节点
        arr.splice(s, 1);
        break;
      } else if (arr[s].children && arr[s].children.length > 0) {
        // 递归条件，递归查找树节点中的children中有无相同的key
        this.searchOption(option, arr[s].children);
      } else {
        continue;
      }
    }
    this.props.dispatch({
      //处理结束，将树的数据保存更新
      type: "All/saveTreeData",
      payload: arr
    });
  };

  //新增部队点击保存的时候
  handleBlurTroops = () => {
    if (this.state.addTroopsMark == "1") {
      var key;
      //如果基本信息和素材发送给后端保存成功了，则将新节点挂载到树上
      let value = this.props.form.getFieldValue("TroopsName"); //部队名称输入框
      if (!value) {
        message.warning(
          language[`enter_force_name_${this.props.language.getlanguages}`]
        );
      } else {
        //新增一个部队的时候查询部队名称是否重复
        let TroopsDataList = this.props.All.TroopsDataList
          ? this.props.All.TroopsDataList
          : [];
        for (let i = 0; i < TroopsDataList.length; i++) {
          if (value == TroopsDataList[i].forceName) {
            //部队名称重复，请更改
            message.warning(
              language[`DuplicateUnitName_${this.props.language.getlanguages}`]
            );
            return false;
          }
        }

        let treeNode = this.state.node; //右键的树节点
        new Promise(resolve => {
          if (treeNode.props.children) {
            //如果当前右键的树节点有children
            let arr = treeNode.props.dataRef.children;
            arr.push({
              title: "Troops-" + value,
              key: `${treeNode.props.eventKey}-${
                treeNode.props.children.length
                }`
            });
            key = `${treeNode.props.eventKey}-${
              treeNode.props.children.length
              }`;
            treeNode.props.dataRef.children = arr;
            resolve();
          } else {
            //如果当前右键的树节点没有children
            treeNode.props.dataRef.children = [
              { title: "Troops-" + value, key: `${treeNode.props.eventKey}-0` }
            ];
            key = `${treeNode.props.eventKey}-0`;
            resolve();
          }
        });
        this.props.dispatch({
          type: "All/saveTreeData",
          payload: this.props.All.treeData
        });
        let data =
          this.props.All.TroopsDataList == null
            ? []
            : this.props.All.TroopsDataList;
        data.push({
          forceId: key, //当前节点的key
          forceName: value, //当前部队的名称
          forceGrade: key.length / 2 - 1, //当前部队的等级
          reportId: "null",
          upperForceID: this.state.node.props.dataRef.key //当前节点的父节点
        });
        this.props.dispatch({
          type: "All/saveTroopsData",
          payload: data
        });
        this.setState({ addTroopsMark: null });
      }
    } else if (this.state.addTroopsMark == "2") {
      //修改部队名称
      //如果基本信息和素材发送给后端保存成功了，则将新节点挂载到树上
      let value = this.props.form.getFieldValue("TroopsName"); //部队名称输入框
      let treeNode = this.state.node; //右键的树节点
      let key = treeNode.props.eventKey;
      if (!value) {
        message.warning(
          language[`enter_force_name_${this.props.language.getlanguages}`]
        );
        return false;
      }
      //修改一个部队的时候查询部队名称是否重复
      let TroopsDataList = this.props.All.TroopsDataList
        ? this.props.All.TroopsDataList
        : [];
      for (let i = 0; i < TroopsDataList.length; i++) {
        if (value == TroopsDataList[i].forceName) {
          //部队名称重复，请更改！
          message.warning(
            language[`DuplicateUnitName_${this.props.language.getlanguages}`]
          );
          return false;
        }
      }

      new Promise(resolve => {
        treeNode.props.dataRef.title = "Troops-" + value;
        resolve();
      });
      this.props.dispatch({
        type: "All/saveTreeData",
        payload: this.props.All.treeData
      });
      let data =
        this.props.All.TroopsDataList == null
          ? []
          : this.props.All.TroopsDataList;

      for (let i = 0; i < data.length; i++) {
        if (key == data[i].forceId) {
          data[i].forceName = value;
        }
      }
      this.props.dispatch({
        type: "All/saveTroopsData",
        payload: data
      });
      this.setState({ addTroopsMark: null });
    }
  };

  onLoadData = treeNode => {
    new Promise(resolve => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      setTimeout(() => {
        treeNode.props.dataRef.children = [
          { title: "Child Node", key: `${treeNode.props.eventKey}-0` },
          { title: "Child Node", key: `${treeNode.props.eventKey}-1` }
        ];
        this.setState({
          treeData: [...this.state.treeData]
        });
        resolve();
      }, 1000);
    });
  };

  //保存装备信息
  saveZBMsg = () => {
    let key;
    //如果基本信息和素材发送给后端保存成功了，则将新节点挂载到树上
    let ZBName = document.getElementById("ZBName").value; //装备名称输入框
    let ZBType = this.state.EquipType; //装备型号选择框
    let DeploymentHell = document.getElementById("DeploymentHell").value; //装备型号选择框
    let ZBNumber = document.getElementById("ZBNumber").value; //装备数量
    let CombatMission = document.getElementById("CombatMission").value; //装备型号选择框
    let value = this.state.ZBNameValue;
    let treeNode = this.state.node; //右键的树节点

    if (
      value.trim() == "" ||
      value.trim() == null ||
      value.trim() == undefined
    ) {
      message.warning(
        language[
        `EquipmentNameCannotBeEmpty_${this.props.language.getlanguages}`
        ]
      );
      return false;
    }
    if (ZBType == "00") {
      message.warning("装备型号不能为空！");
      return false;
    }
    if (this.state.addEquipmentMark == "1") {
      //新增一个装备的时候查询装备名称是否重复
      let EquipmentDataList = this.props.All.EquipmentDataList
        ? this.props.All.EquipmentDataList
        : [];
      for (let i = 0; i < EquipmentDataList.length; i++) {
        if (value == EquipmentDataList[i].equipName) {
          message.warning(
            language[
            `DuplicateEquipmentName_${this.props.language.getlanguages}`
            ]
          );
          return false;
        }
      }

      new Promise(resolve => {
        if (treeNode.props.children) {
          //如果当前右键的树节点有children
          let arr = treeNode.props.dataRef.children;
          arr.push({
            title: "Equipment-" + value,
            key: `${treeNode.props.eventKey}-${treeNode.props.children.length}`
          });
          key = `${treeNode.props.eventKey}-${treeNode.props.children.length}`;
          treeNode.props.dataRef.children = arr;
          resolve();
        } else {
          //如果当前右键的树节点没有children
          treeNode.props.dataRef.children = [
            { title: "Equipment-" + value, key: `${treeNode.props.eventKey}-0` }
          ];
          key = `${treeNode.props.eventKey}-0`;
          resolve();
        }
      });
      this.props.dispatch({
        type: "All/saveTreeData",
        payload: this.props.All.treeData
      });
      let data =
        this.props.All.EquipmentDataList == null
          ? []
          : this.props.All.EquipmentDataList;
      data.push({
        equipDeployArea: DeploymentHell ? DeploymentHell : "null",
        equipId: key,
        equipMission: CombatMission ? CombatMission : "null",
        equipName: ZBName,
        forceId: this.state.node.props.dataRef.key, //当前节点的父节点
        equipType: this.state.EquipType,
        equipNum: ZBNumber ? ZBNumber : "0",
        reportId: "null"
      });
      this.props.dispatch({
        type: "All/saveEquipmentData",
        payload: data
      });
      this.setState({ addEquipmentMark: null }); //将新增装备的状态置空
    } else if (this.state.addEquipmentMark == "2") {
      let treeNode = this.state.node; //当前右键点击的节点
      let oldName = treeNode.props.dataRef.title.split("Equipment-")[1];
      //修改一个装备的时候查询装备名称是否重复
      let EquipmentDataList = this.props.All.EquipmentDataList
        ? this.props.All.EquipmentDataList
        : [];
      for (let i = 0; i < EquipmentDataList.length; i++) {
        if (value != oldName && value == EquipmentDataList[i].equipName) {
          //装备名称重复，请更改
          message.warning(
            language[
            `DuplicateEquipmentName_${this.props.language.getlanguages}`
            ]
          );
          return false;
        }
      }
      new Promise(resolve => {
        treeNode.props.dataRef.title = "Equipment-" + value;
        resolve();
      });
      this.props.dispatch({
        type: "All/saveTreeData",
        payload: this.props.All.treeData
      });
      let data =
        this.props.All.EquipmentDataList == null
          ? []
          : this.props.All.EquipmentDataList;
      let arr = null;
      for (let i = 0; i < data.length; i++) {
        if (treeNode.props.dataRef.key == data[i].equipId) {
          arr = {
            equipDeployArea: DeploymentHell ? DeploymentHell : "null",
            equipId: treeNode.props.dataRef.key,
            equipMission: CombatMission ? CombatMission : "null",
            equipName: ZBName,
            forceId: data[i].forceId,
            equipType: this.state.EquipType,
            equipNum: ZBNumber ? ZBNumber : "0",
            reportId: "null"
          };
          data.splice(i, 1, arr);
        }
      }
      this.props.dispatch({
        type: "All/saveEquipmentData",
        payload: data
      });
      this.setState({ addEquipmentMark: null }); //将新增装备的状态置空
    }
  };

  handleChangeDeploymentHell = e => {
    this.setState({ DeploymentHellValue: e.target.value });
  };

  //单击树节点
  selectTree = (selectedKeys, info) => {
    //如果单击的是装备节点，则显示装备模块的信息，否则显示部队的信息
    if (
      info.node.props.title &&
      info.node.props.title.indexOf("Equipment") == 0
    ) {
      document.getElementById("TroopsPage").style.display = "none";
      document.getElementById("ZBPage").style.display = "block";

      //遍历装备的list,查询到名称相同的赋值给装备的详细信息
      let EquipmentDataList = this.props.All.EquipmentDataList
        ? this.props.All.EquipmentDataList
        : [];
      let oldName = info.node.props.title.split("Equipment-")[1];
      for (let i = 0; i < EquipmentDataList.length; i++) {
        if (oldName == EquipmentDataList[i].equipName) {
          console.log("EquipmentDataList",EquipmentDataList[i])
          document.getElementById("ZBName").value =
            EquipmentDataList[i].equipName; //装备名称输入框
          document.getElementById("CombatMission").value =
            EquipmentDataList[i].equipMission == "null"
              ? ""
              : EquipmentDataList[i].equipMission;
          this.setState({
            EquipType: EquipmentDataList[i].equipType,
            ZBNumber: EquipmentDataList[i].equipNum,
            DeploymentHellValue:
              EquipmentDataList[i].equipDeployArea &&
                EquipmentDataList[i].equipDeployArea != "null"
                ? EquipmentDataList[i].equipDeployArea
                : "",
            ZBNameValue:
              EquipmentDataList[i].equipName &&
                EquipmentDataList[i].equipName != "null"
                ? EquipmentDataList[i].equipName
                : "",
            CombatMissionValue:
              EquipmentDataList[i].equipMission &&
                EquipmentDataList[i].equipMission != "null"
                ? EquipmentDataList[i].equipMission
                : ""
          });
        }
      }
    } else if (
      info.node.props.title &&
      info.node.props.title.indexOf("Troops") == 0
    ) {
      document.getElementById("TroopsPage").style.display = "block";
      document.getElementById("ZBPage").style.display = "none";

      //编辑部队时给部队名称赋值
      let oldName = info.node.props.title.split("Troops-")[1];
      document.getElementById("TroopsName").value = oldName;
    }
  };

  //给点击的行设置一个背景色
  setClassName = (record, index) => {
    return index === this.state.activeIndex
      ? `${style["l-table-row-active"]}`
      : "";
  };

  //点击一条目标航迹信息显示对应的目标航迹点信息
  clickRow = record => {
    this.setState({
      activeIndex: record.key - 1,
      activeName: record.objectName
    });
  };

  //切换装备的类型
  handleChangeEquipType = value => {
    this.setState({ EquipType: value });
    this.props.dispatch({
      type: "All/selectEquipNum",
      payload: value,
      callback: res => {
        if (res) {
          this.setState({ ZBNumber: res.data[0] });
        }
      }
    });
  };

  handleChangeTroopsName = e => {
    this.setState({ TroopsNameValue: e.target.value });
  };

  handleChangeZBNameValue = e => {
    this.setState({ ZBNameValue: e.target.value });
  };

  handleChangeCombatMissionValue = e => {
    this.setState({ CombatMissionValue: e.target.value });
  };

  //一键导入
  OneButtonImport = () => {
    let data = this.props.All.EquipmentDataList
      ? this.props.All.EquipmentDataList
      : [];
    if (data.length == 0) {
      message.warning(language[`noZBData_${this.props.language.getlanguages}`]);
    } else {
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        if (arr.indexOf(data[i].equipType) == -1) {
          arr.push(data[i].equipType);
        }
      }
      this.props.dispatch({
        type: "All/OneButtonImport",
        payload: arr.join(","),
        callback: res => {
          if (res.data && res.data[0]) {
            let data = res.data[0];
            let arr = [];
            for (let i = 0; i < data.length; i++) {
              let forName;
              let threadName;
              let countryName;
              for (let j = 0; j < language.EnemyAndFoeAttributes.length; j++) {
                //敌我属性
                if (
                  data[i] &&
                  data[i].forName == language.EnemyAndFoeAttributes[j].value
                ) {
                  forName = language.EnemyAndFoeAttributes[j][
                    `name_${this.props.language.getlanguages}`];
                }
              }
              for (let j = 0; j < language.threadLevel.length; j++) {
                //威胁等级
                if (
                  data[i] &&
                  data[i].threadName == language.threadLevel[j].value
                ) {
                  threadName = language.threadLevel[j][
                    `name_${this.props.language.getlanguages}`];
                }
              }
              for (let j = 0; j < language.countryName.length; j++) {
                //国家地区
                if (
                  data[i] &&
                  data[i].countryName == language.countryName[j].value
                ) {
                  countryName = language.countryName[j][
                    `name_${this.props.language.getlanguages}`];
                }
              }
              arr.push({
                key: i + 1,
                objectName: data[i].objectName,
                modelName: data[i].modelName,
                forName: forName,
                threadName: threadName,
                countryName: countryName
              });
            }
            this.setState({ OneButtonImportData: arr });
          }
        }
      });
    }
  };
  changeIndex = () => { };

  render() {
    const { TextArea } = Input;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const FormItem = Form.Item;
    const Option = Select.Option;
    const dateFormat = "YYYY-MM-DD HH:mm:ss";
    const paginationProps = {
      pageSize: 10
    };
    const Basicdata = [];
    const Middledata = [];
    for (let i = 0; i < 4; i++) {
      Basicdata.push({
        key: i,
        path: `AN/APG- ${i}dede`,
        type: language[`basicInformation_${this.props.language.getlanguages}`]
      });
      Middledata.push({
        key: i,
        path: `AN/APG- ${i}cdv`,
        type: language[`basicInformation_${this.props.language.getlanguages}`]
      });
    }

    const targeteColumn = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`PlatformName_${this.props.language.getlanguages}`],
        dataIndex: "objectName"
      },
      {
        title: language[`PlatformModel_${this.props.language.getlanguages}`],
        dataIndex: "modelName"
      },
      {
        title: language[`countriesAndRegions_${this.props.language.getlanguages}`],
        dataIndex: "countryName"
      },
      {
        title: language[`FriendOrFoeProperties_${this.props.language.getlanguages}`],
        dataIndex: "forName"
      },
      {
        title: language[`threatLevel_${this.props.language.getlanguages}`],
        dataIndex: "threadName"
      }
    ];
    const targetDatas = [];

    //弹出框中的电子目标列表
    const targetColumnList = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`TargetName_${this.props.language.getlanguages}`],
        dataIndex: "objectName"
      },
      {
        title: language[`TargetModel_${this.props.language.getlanguages}`],
        dataIndex: "modelName"
      },
      {
        title: language[`PlatformType_${this.props.language.getlanguages}`],
        dataIndex: "plantType",
        render: (text, record, index) => {
          return (
            <span>
              {language[`aircraft_${this.props.language.getlanguages}`]}
            </span>
          );
        }
      },
      {
        title: language[`countriesAndRegions_${this.props.language.getlanguages}`],
        dataIndex: "countryName"
      },
      {
        title: language[`FriendOrFoeProperties_${this.props.language.getlanguages}`],
        dataIndex: "forName"
      },
      {
        title: language[`threatLevel_${this.props.language.getlanguages}`],
        dataIndex: "threadName"
      }
    ];
    return (
      <div className={style.content_box}>
        <Form
          className={styleless.myBandForm}
          id="myForm"
          onSubmit={this.handleSubmit}
        >
          <div className={style.subject}>
            <div className={style.head}>
              <Link to="/all?id=object">
                <Button
                  type="primary"
                  style={{ float: "right", margin: "0 5px" }}
                >
                  {language[`goBack_${this.props.language.getlanguages}`]}
                </Button>
              </Link>
              {/* &nbsp;&nbsp; */}
              {/* 成果发布成json */}
              {/* <FormItem style={{ float: 'right', margin: '0 5px' }}>
                <Button type="primary" htmlType="submit" onClick={this.handleResultsPublishJSON} >{language[`ResultsReleasedAsJSON_${this.props.language.getlanguages}`]}</Button>
              </FormItem> */}
              {/* 成果发布成pdf */}
              &nbsp;&nbsp;
              <FormItem style={{ float: "right", margin: "0 5px" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={this.handleResultsPublish}
                >
                  {language[`ResultsPublishedAsPDF_${this.props.language.getlanguages}`]}
                </Button>
              </FormItem>
              &nbsp;&nbsp;
              {/* 保存 */}
              <FormItem style={{ float: "right", margin: "0 5px" }}>
                <Button type="primary" onClick={this.handleResultsReleased}>
                  {language[`save_${this.props.language.getlanguages}`]}
                </Button>
              </FormItem>
            </div>
            <div className={style.ContentSpecial}>
              <div className={style.FodderRadar}>
                {language[`EnemyIntelligenceReport_${this.props.language.getlanguages}`]}
              </div>
            </div>
            <div className={style.ContentBasic}>
              <div className={style.subhead}>
                {language[`basicAttribute_${this.props.language.getlanguages}`]}
              </div>

              <div className={style.Basic_Content_Wrap}>
                {/* 报告名称 */}
                <div>
                  <span style={{ color: "red" }}>*</span>
                  {language[`ReportName_${this.props.language.getlanguages}`]}
                </div>
                <div>
                  <FormItem>
                    {getFieldDecorator("reportName", {
                      rules: [{ required: true }],
                      getValueFromEvent: event => {
                        return event.target.value
                          .slice(0, 200);
                      }
                    })(
                      <Input
                        className={styleless.input}
                        type="text"
                        id="reportName"
                        autoComplete="off"
                        onBlur={this.handleReportName_blur}
                        disabled={
                          this.props.All.selectEditData_dataMark == true
                            ? true
                            : false
                        }
                      />
                    )}
                  </FormItem>
                </div>
                {/* 报告类型 */}
                <div>
                  {language[`ReportType_${this.props.language.getlanguages}`]}
                </div>
                <div>
                  <FormItem>
                    {getFieldDecorator("reportType", {
                      initialValue: "1"
                    })(
                      <Select disabled>
                        <Option value="1">
                          {language[`EnemyIntelligenceReport_${this.props.language.getlanguages}`]}
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </div>

                {/* 发布状态 */}
                <div>
                  {language[`publishStatus_${this.props.language.getlanguages}`]}
                </div>
                <div>
                  <FormItem>
                    {getFieldDecorator("pubishStatus", {
                      rules: [{ required: true }],
                      initialValue: "否"
                    })(
                      <Select onBlur={this.FormData} disabled>
                        <Option value="是">
                          {language[`yes_${this.props.language.getlanguages}`]}
                        </Option>
                        <Option value="否">
                          {language[`no_${this.props.language.getlanguages}`]}
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </div>
                {/* 发布时间 */}
                <div>
                  {language[`ReleaseTime_${this.props.language.getlanguages}`]}
                </div>
                <div>
                  <FormItem>
                    {getFieldDecorator("pubishTime", {
                      // rules: [{ required: true }],
                      initialValue:
                        this.props.data != null &&
                          this.props.data.pubishTime !== undefined &&
                          this.props.data.pubishTime !== null
                          ? moment(this.props.data.pubishTime)
                          : null
                    })(
                      <DatePicker
                        disabled
                        onBlur={this.FormData}
                        className={styleless.datePicker}
                        showTime={{ format: "HH:mm:ss" }}
                        format={dateFormat}
                        style={{ width: "320px" }}
                      />
                    )}
                  </FormItem>
                </div>
                {/* 国家地区 */}
                <div>
                  {language[`countriesAndRegions_${this.props.language.getlanguages}`]}
                </div>
                <div>
                  <FormItem>
                    {getFieldDecorator("countryId", {
                      rules: [{ required: true }],
                      initialValue: "004"
                    })(
                      <Select onBlur={this.FormData}>
                        {language.countryName.map((v, k) => (
                          <Option value={v.value} key={v.value}>
                            {v[`name_${this.props.language.getlanguages}`]}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </div>
                {/* 敌我属性 */}
                <div>
                  {language[`FriendOrFoeProperties_${this.props.language.getlanguages}`]}
                </div>
                <div>
                  <FormItem>
                    {getFieldDecorator("foe", {
                      initialValue: "01"
                    })(
                      <Select>
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
                    )}
                  </FormItem>
                </div>

                 <div style={{display:"none"}}>
                  <span style={{ color: "red", marginRight: "3px", verticalAlign: "middle" }}>*</span>
                  {language[`IdentificationOfEnemyInformationReport_${this.props.language.getlanguages}`]}
                </div>
                <div style={{display:"none"}}>
                  <FormItem>
                    {getFieldDecorator("enemySignId", {
                      rules: [{ required: true }],
                      initialValue:"1000"
                    })(
                      <InputNumber
                        className={styleless.input}
                        maxLength={4}
                        autoComplete="off"
                      />
                    )}
                  </FormItem>
                </div>
              </div>

              <div className={style.objective}>
                <div className={style.activityObjective}>
                  <span style={{ color: "red", marginRight: "3px", verticalAlign: "middle" }}>*</span>
                  {language[`CombatMission_${this.props.language.getlanguages}`]}
                </div>
                <div className={style.BasicSituation}>
                  <span style={{ color: "red", marginRight: "3px", verticalAlign: "middle" }}>*</span>
                  {language[`OperationalPurpose_${this.props.language.getlanguages}`]}
                </div>
                <div className={style.introduce}>
                  <FormItem>
                    {getFieldDecorator("actionTask", {
                      rules: [{ required: true }],
                      getValueFromEvent: event => {
                        return event.target.value.slice(0, 500);
                      }
                    })(
                      <TextArea
                        style={{ height: "270px", resize: "none" }}
                        autoComplete="off"
                      />
                    )}
                  </FormItem>
                </div>
                <div className={style.introduceTwo}>
                  <FormItem>
                    {getFieldDecorator("actionPurpose", {
                      rules: [{ required: true }],
                      getValueFromEvent: event => {
                        return event.target.value.slice(0, 500);
                      }
                    })(
                      <TextArea
                        style={{ height: "270px", resize: "none" }}
                        autoComplete="off"
                      />
                    )}
                  </FormItem>
                </div>
              </div>

            </div>




            {/* 电子战斗序列 */}
            <div className={styleless.ContentBasicSequence}>
              {/* 电子战斗序列 */}
              <div className={style.subhead}>
                {language[`EOB_${this.props.language.getlanguages}`]}
              </div>
              <div className={style.troopsLeft}>
                <MenuProvider
                  id="menu_id"
                  style={{ display: "inline-block" }}
                  className={styleless.menu_id}
                >
                  <Tree
                    showLine={
                      this.props.All.treeData &&
                        this.props.All.treeData[0].children &&
                        this.props.All.treeData[0].children.length > 0
                        ? true
                        : false
                    }
                    className="hide-file-icon"
                    onRightClick={this.rightClick}
                    onSelect={this.selectTree}
                    id="menu_id"
                    defaultExpandAll
                  >
                    {this.renderTreeNodes(this.props.All.treeData)}
                  </Tree>
                </MenuProvider>
                <Menu id="menu_id">
                  <Item
                    style={{ display: this.state.addToops ? "none" : "block" }}
                    onClick={() => this.onClick01("添加部队")}
                  >
                    {language[`AdditionalTroops_${this.props.language.getlanguages}`]}
                  </Item>
                  <Item
                    style={{
                      display: this.state.addEquipment ? "none" : "block"
                    }}
                    onClick={() => this.onClick01("添加装备")}
                  >
                    {language[`AddingEquipment_${this.props.language.getlanguages}`]}
                  </Item>
                  <Item
                    style={{ display: this.state.editToops ? "none" : "block" }}
                    onClick={() => this.onClick01("编辑部队")}
                  >
                    {language[`EditorialForce_${this.props.language.getlanguages}`]}
                  </Item>
                  <Item
                    style={{
                      display: this.state.editEquipment ? "none" : "block"
                    }}
                    onClick={() => this.onClick01("编辑装备")}
                  >
                    {language[`EditorialEquipment_${this.props.language.getlanguages}`]}
                  </Item>
                  <Item
                    style={{
                      display: this.state.deleteToops ? "none" : "block"
                    }}
                    onClick={() => this.onClick01("删除部队")}
                  >
                    {language[`DeleteTroops_${this.props.language.getlanguages}`]}
                  </Item>
                  <Item
                    style={{
                      display: this.state.deleteEquipment ? "none" : "block"
                    }}
                    onClick={() => this.onClick01("删除装备")}
                  >
                    {language[`DeleteEquipment_${this.props.language.getlanguages}`]}
                  </Item>
                </Menu>
              </div>
              <div className={style.troopsRigth}>
                {/* 添加部队页面 */}
                <div id="TroopsPage" style={{ display: "none" }}>
                  <div className={style.spanInput}>
                    {/* 部队名称 */}
                    <div className={style.spanName}>
                      {language[`UnitName_${this.props.language.getlanguages}`]}
                    </div>
                    <div className={style.inputText}>
                      {/* <Input id="TroopsName" autoComplete="off"
                                                onChange={this.handleChangeTroopsName} value={this.state.TroopsNameValue}></Input> */}
                      <FormItem>
                        {getFieldDecorator("TroopsName", {
                          getValueFromEvent: event => {
                            return event.target.value;
                          }
                        })(<Input autoComplete="off" />)}
                      </FormItem>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "100px",
                      height: "30px",
                      display: "inline-block"
                    }}
                  >
                    {/* 保存/修改按钮 */}
                    <FormItem>
                      <Button
                        type="primary"
                        className={style.Electronics_order_update}
                        disabled={this.state.addTroopsMark ? false : true}
                        onClick={this.handleBlurTroops}
                      >
                        {language[`save_${this.props.language.getlanguages}`]}
                      </Button>
                    </FormItem>
                  </div>
                </div>
                {/* 添加装备页面 */}
                <div id="ZBPage" style={{ display: "none" }}>
                  {/* 左边的内容 */}
                  <div>
                    <div>
                      <div className={style.spanInput}>
                        {/* 装备名称 */}
                        <div className={style.spanName}>
                          <span
                            style={{
                              color: "red",
                              marginRight: "3px",
                              verticalAlign: "middle"
                            }}
                          >
                            *
                          </span>
                          {language[`PlatformName_${this.props.language.getlanguages}`]}
                        </div>
                        <div className={style.inputText}>
                          <Input
                            id="ZBName"
                            autoComplete="off"
                            value={this.state.ZBNameValue}
                            onChange={this.handleChangeZBNameValue}
                          />

                          {/* <FormItem>
                                                        {getFieldDecorator('ZBName', {
                                                            getValueFromEvent: (event) => {
                                                                return event.target.value.replace(/\s+/g, "")
                                                            },
                                                        })(
                                                            <Input autoComplete="off"></Input>
                                                        )}
                                                    </FormItem> */}
                        </div>
                      </div>
                      <div className={style.spanInputRight}>
                        {/* 装备型号 */}
                        <div className={style.spanName}>
                          <span
                            style={{
                              color: "red",
                              marginRight: "3px",
                              verticalAlign: "middle"
                            }}
                          >
                            *
                          </span>
                          {language[`PlatformModel_${this.props.language.getlanguages}`]}
                        </div>
                        <div className={style.inputText}>
                          <Select
                            id="forName_radar"
                            defaultValue="00"
                            value={this.state.EquipType}
                            onChange={this.handleChangeEquipType}
                          >
                            <Option value="00">
                              --
                              {language[`DropdownSelection_${this.props.language.getlanguages}`]}
                              --
                            </Option>
                            {this.state.targetAllType
                              ? this.state.targetAllType.map(it => (
                                <Option key={it} value={it}>
                                  {it}
                                </Option>
                              ))
                              : ""}
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className={style.spanInput}>
                        {/* 部署地域 */}
                        <div className={style.spanName}>
                          {language[`DeploymentArea_${this.props.language.getlanguages}`]}
                        </div>
                        <div className={style.inputText}>
                          <Input
                            autoComplete="off"
                            id="DeploymentHell"
                            value={this.state.DeploymentHellValue}
                            onChange={this.handleChangeDeploymentHell}
                          />
                        </div>
                      </div>
                      <div className={style.spanInputRight}>
                        {/* 数量 */}
                        <div className={style.spanName}>
                          {language[`amount_${this.props.language.getlanguages}`]}
                        </div>
                        <div className={style.inputText}>
                          <Input
                            autoComplete="off"
                            disabled
                            id="ZBNumber"
                            readOnly
                            value={this.state.ZBNumber}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className={style.spanInput}>
                        {/* 作战任务 */}
                        <div className={style.spanName}>
                          {language[`OperationalTasks_${this.props.language.getlanguages}`]}
                        </div>
                        <div className={style.textArea}>
                          <TextArea
                            id="CombatMission"
                            onChange={this.handleChangeCombatMissionValue}
                            value={this.state.CombatMissionValue}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 右边的修改按钮 */}
                  <div>
                    {/* 修改 */}
                    {/* <Button type="primary" className={style.Electronics_order_update}>{language[`modification_${this.props.language.getlanguages}`]}</Button> */}
                    <Button
                      type="primary"
                      disabled={this.state.addEquipmentMark ? false : true}
                      className={style.Electronics_order_update}
                      onClick={this.saveZBMsg}
                    >
                      {language[`save_${this.props.language.getlanguages}`]}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* 电子目标列表 */}
            <div className={style.ContentParams}>
              <div className={style.subhead}>
                <div style={{ float: "left" }}>
                  {language[`ElectronicTargetList_${this.props.language.getlanguages}`]}
                </div>
                <div style={{ float: "right", marginRight: "50px" }}>
                  {/* 一键导入 */}
                  <Button type="primary" onClick={this.OneButtonImport}>
                    {language[`OneButtonImport_${this.props.language.getlanguages}`]}
                  </Button>
                </div>
              </div>
              <div className={style.listContent}>
                <Table
                  loading={this.state.targetDialogDataLoading}
                  rowKey={record => record.objectName}
                  className={styleless.myClass}
                  rowClassName={(record, index) =>
                    index % 2 === 0 ? styleless.odd : styleless.even
                  } //奇偶行颜色交替变化
                  columns={targeteColumn}
                  dataSource={this.state.OneButtonImportData}
                  pagination={paginationProps}
                />
              </div>
            </div>
            {/* 相关资料 */}
            {/* <div className={style.ContentBasic}>
                            <div className={style.subhead} style={{ marginBottom: "20px" }}>
                                <div style={{ margin: "5px 10px", float: 'left' }}>{language[`relatedData_${this.props.language.getlanguages}`]}</div>
                            </div>
                            <AllRelateMsg objectName={this.state.objectName} FormData={this.FormData} />
                        </div> */}
          </div>
        </Form>
        {
          this.state.visibleConfirm ?
            <DialogConfirm
              visible={this.state.visibleConfirm}
              index={1011}
              zIndex={1011}
              changeIndex={this.changeIndex}
              close={this.handleCancelConfirm}
            >
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
            </DialogConfirm>

            : ""
        }
      </div>
    );
  }
}

EnemyReportEdit = Form.create({
  mapPropsToFields(props) {
    if (props.data != null) {
      let data = props.data;
      return {
        reportName: Form.createFormField({
          ...props,
          value: data.reportName
        }),
        pubishStatus: Form.createFormField({
          ...props,
          value: data.pubishStatus
        }),
        countryId: Form.createFormField({
          ...props,
          value: data.countryId
        }),
        foe: Form.createFormField({
          ...props,
          value: data.foe
        }),
        enemySignId: Form.createFormField({
          ...props,
          value: data.enemySignId
        }),
        actionTask: Form.createFormField({
          ...props,
          value: data.actionTask
        }),
        actionPurpose: Form.createFormField({
          ...props,
          value: data.actionPurpose
        }),
      };
    }
  }
})(EnemyReportEdit);
export default EnemyReportEdit;
