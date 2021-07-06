import React, { Component } from "react";
import {
  Select,
  Table,
  Form,
  Input,
  DatePicker,
  Popconfirm,
  message,
  InputNumber,
  Button
} from "antd";
import style from "./ElectronicCo.css";
import styleless from "./test.less";
import { Link } from "dva/router";
import Dialog from "../../utils/DialogMask/Dialog";
import { connect } from "dva";
import language from "../language/language";
import axios from "axios";
import PropTypes from "prop-types";
import moment from "moment";
import TargetOnlyLook from "../Target/Target_OnlyLook";
import ReactDOM from "react-dom";
import responseStatus from "../../utils/initCode"

//电子对抗综合报
@connect(({ language, All, ElectronicTarget }) => ({
  language,
  All,
  ElectronicTarget
}))
class ElectronicCo extends Component {
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
      startTime: "null",
      endTime: "null",
      visbleTargetDetail: false, //查看电子目标具体信息的弹出框
      selectedRowKeys: [], //勾选电子目标的列表

      startValue: null, //活动开始时间
      endValue: null, //活动结束时间
      endOpen: false,
      targetDialogDataLoading: false //导入目标的弹出框的loading
    };
  }

  

  UNSAFE_componentWillReceiveProps({ All }) {
    if (All.ElectronicTargetColumn_Dialog_Special) {
      //电子目标弹出框内容根据时间筛选
      var nowData = [];
      let threadName;
      let forName;
      let countryName;
      var data = All.ElectronicTargetColumn_Dialog_Special;
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < language.threadLevel.length; j++) {
          //威胁
          if (
            data[i].threadName == language.threadLevel[j].name_zh ||
            data[i].threadName == language.threadLevel[j].name_fr
          ) {
            threadName =language.threadLevel[j][`name_${this.props.language.getlanguages}`];
          }
        }
        for (let j = 0; j < language.EnemyAndFoeAttributes.length; j++) {
          //敌我属性
          if (
            data[i].forName == language.EnemyAndFoeAttributes[j].name_zh ||
            data[i].forName == language.EnemyAndFoeAttributes[j].name_fr
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
        nowData.push({
          key: i + 1,
          objectName: data[i].objectName,
          modelName: data[i].modelName,
          plantType: data[i].plantType,
          countryName: countryName,
          forName: forName,
          threadName: threadName,
          appearTime: data[i].appearTime ? data[i].appearTime.slice(0, -2) : "",
          disappearTime: data[i].disappearTime
            ? data[i].disappearTime.slice(0, -2)
            : ""
        });
      }
      this.setState({ targetDialogData: nowData });
    }

    if (All.ElectronicTargetColumn_Special) {
      var data = All.ElectronicTargetColumn_Special;
      let objectName = []; //把目标列表中已经有的列表的目标名称赋值给objectName
      let nowData = [];
      for (let i = 0; i < data.length; i++) {
        // 当数组为空或者数组中没有当前这个目标名称的时候才把该条数据导入进来
        nowData.push({
          key: i + 1,
          objectName: data[i].objectName,
          modelName: data[i].modelName,
          plantType: data[i].plantType,
          countryName: data[i].countryName,
          forName: data[i].forName,
          threadName: data[i].threadName
        });
        objectName.push(data[i].objectName);
      }
      this.setState({ targetData: nowData, objectName: objectName }); //把目标列表数据源复制上去，把目标名称记录下来
    }
  }

  componentWillUnmount() {
    let { dispatch } = this.props;
    dispatch({
      type: "All/clearSpecialMsg"
    });
    dispatch({
      type: "ElectronicTarget/clearCache"
    });
    dispatch({
      type: "ElectronicTarget/clearAllMsg",
      payload: {
        clearMsg: true
      }
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
      selectedRowKeys: [],
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
            key: i + 1,
            objectName: data[i].objectName,
            modelName: data[i].modelName,
            plantType: data[i].plantType,
            countryName: data[i].countryName,
            forName: data[i].forName,
            threadName: data[i].threadName,
            appearTime: data[i].appearTime
              ? data[i].appearTime.slice(0, -2)
              : "",
            disappearTime: data[i].disappearTime
              ? data[i].disappearTime.slice(0, -2)
              : ""
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

  //导入电子目标弹窗框中的确定
  handleOkTarget = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props.dispatch({
        type: "All/saveSpecialormMsg",
        payload: values
      });
    });

    this.setState({
      visbleTarget: false,
      selectedRowKeys: [],
      targetNameDiaList: null
    });
    let urll;
    if (typeof window.getUrl == "function") {
      urll = window.getUrl() + "/api/LK-0313036/LK036";
    } else {
      urll = "http://192.168.0.107:8087";
    }
    axios({
      method: "get",
      url: urll + "/SynthInformationReorganize/selectElectObjects", //查询选中的电子目标的详细信息
      params: { objectNames: this.state.targetNameDiaList.join(",") }
    }).then(res => {
      var data = res.data[0];
      let objectName = [];
      if (this.props.All.ElectronicTargetColumn_Special) {
        let data = this.props.All.ElectronicTargetColumn_Special;
        let arr = [];
        for (let i = 0; i < data.length; i++) {
          arr.push(data[i].objectName);
        }
        objectName = arr;
        this.setState({ objectName: objectName }); //把目标列表中已经有的列表的目标名称赋值给objectName
      }
      let nowData = this.props.All.ElectronicTargetColumn_Special
        ? this.props.All.ElectronicTargetColumn_Special
        : [];
      for (let i = 0; i < data.length; i++) {
        //遍历弹出框中勾选的电子目标的详细信息
        // 当页面列表数组为空或者数组中没有当前这个目标名称的时候才把该条数据导入进来
        if (
          objectName.length === 0 ||
          objectName.indexOf(data[i].objectName) === -1
        ) {
          nowData.push({
            key: nowData.length,
            objectName: data[i].objectName,
            modelName: data[i].modelName,
            plantType: data[i].plantType,
            countryName: data[i].countryName,
            forName: data[i].forName,
            threadName: data[i].threadName
          });
          objectName.push(data[i].objectName);
          this.props.dispatch({
            type: "All/insetElectronicTargetColumn_Special",
            payload: {
              dataSource: nowData
            }
          });
        } else {
          message.warning(
            `${data[i].objectName}${language[`Existing_${this.props.language.getlanguages}`]}`
          );
        }
      }
      this.setState({ targetData: nowData, objectName: objectName }); //把目标列表数据源复制上去，把目标名称记录下来
    }).catch(error => {
      error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
    });
  };

  handleCancelTarget = () => {
    this.setState({
      visbleTarget: false,
      selectedRowKeys: [] //勾选电子目标的列表
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
    let data = this.props.data;
    let EditMark = this.props.All.selectEditData_dataMark;
    let Context = this.context;
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        let objectName = this.state.objectName;
        if (objectName.length == 0) {
          message.warning(
            language[
            `importElectronicTarget_${this.props.language.getlanguages}`
            ]
          );
          return false;
        }
        // if(String(fieldsValue.actionId).length!=4){
        //   message.warning(language[`TheComprehensiveReportIDMustBeANumberOf4_${this.props.language.getlanguages}`]);
        //   return false;
        // }
        if (
          fieldsValue["startTime"].valueOf() > fieldsValue["endTime"].valueOf()
        ) {
          message.warning(
            language[`Start_time_less_than_end_time_${this.props.language.getlanguages}`]
          );
          document.getElementById("startTime").style.border = "1px solid #f00";
          document.getElementById("endTime").style.border = "1px solid #f00";
          return false;
        } else {
          document.getElementById("startTime").style.border =
            "1px solid #d9d9d9";
          document.getElementById("endTime").style.border = "1px solid #d9d9d9";
        }
        Values = {
          ...fieldsValue,
          pubishTime: fieldsValue["pubishTime"]
            ? fieldsValue["pubishTime"].format("YYYY-MM-DD HH:mm:ss")
            : null,
          startTime: fieldsValue["startTime"].format("YYYY-MM-DD HH:mm:ss"),
          endTime: fieldsValue["endTime"].format("YYYY-MM-DD HH:mm:ss")
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

        function a() {
          return new Promise(function (open, err) {
            if (EditMark == false) {
              dispatch({
                type: "All/ClickResultsReleasedZH",
                payload: {
                  ...Values,
                  reportType: "电子对抗综合报",
                  objectName: objectName,
                  fileName: fileName
                },
                callback: res => {
                  if (res.data[0] == 1) {
                    open();
                  }
                }
              });
            } else {
              dispatch({
                type: "All/SaveResultsReleasedZH",
                payload: {
                  ...Values,
                  reportType: "电子对抗综合报",
                  objectName: objectName,
                  fileName: fileName
                },
                callback: res => {
                  if (res.data[0] == 1) {
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
      } else {
        message.warning(language[`improveECMSpecialReportTips_${this.props.language.getlanguages}`
          ]
        );
      }
    });
  };

  //点击成果发布成pdf按钮
  handlePublish = e => {
    e.preventDefault();
    //获取cookie是中文还是法文
    let getLanguage = getCookie("uop.locale") === "fr_FR" ? "fr" : "zh";
    let { dispatch } = this.props;
    let Values;
    let objectName = this.state.objectName;
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        if (!fieldsValue.reportName) {
          message.warning(
            language[
            `improveECMSpecialReportTips_${this.props.language.getlanguages}`
            ]
          );
        } else {
          if (objectName.length == 0) {
            message.warning(
              language[
              `importElectronicTarget_${this.props.language.getlanguages}`
              ]
            );
            return false;
          }
          // if(String(fieldsValue.actionId).length!=4){
          //   message.warning(language[`TheComprehensiveReportIDMustBeANumberOf4_${this.props.language.getlanguages}`]);
          //   return false;
          // }
          if (
            fieldsValue["startTime"].valueOf() >
            fieldsValue["endTime"].valueOf()
          ) {
            message.warning(
              language[
              `Start_time_less_than_end_time_${
              this.props.language.getlanguages
              }`
              ]
            );
            document.getElementById("startTime").style.border =
              "1px solid #f00";
            document.getElementById("endTime").style.border = "1px solid #f00";
            return false;
          } else {
            document.getElementById("startTime").style.border =
              "1px solid #d9d9d9";
            document.getElementById("endTime").style.border =
              "1px solid #d9d9d9";
          }
          if (!err) {
            Values = {
              ...fieldsValue,
              pubishTime: moment().format("YYYY-MM-DD HH:mm:ss"),
              startTime: fieldsValue["startTime"].format("YYYY-MM-DD HH:mm:ss"),
              endTime: fieldsValue["endTime"].format("YYYY-MM-DD HH:mm:ss")
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
            let Context = this.context;

            function a() {
              return new Promise(function (open, err) {
                if (getLanguage === "zh") {
                  dispatch({
                    type: "All/publish_ElectronicCo",
                    payload: {
                      ...Values,
                      reportType: "电子对抗综合报",
                      objectName: objectName,
                      fileName: fileName
                    },
                    callback: res => {
                      if (res.data[0]) {
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
                    type: "All/publish_ElectronicCo_fr",
                    payload: {
                      ...Values,
                      reportType: "电子对抗综合报",
                      objectName: objectName,
                      fileName: fileName
                    },
                    callback: res => {
                      if (res.data[0]) {
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
      } else {
        message.warning(language[`improveECMSpecialReportTips_${this.props.language.getlanguages}`
          ]
        );
      }
    });
  };

  //点击成果发布成JSON按钮
  handleResultsPublishJSON = e => {
    e.preventDefault();
    let { dispatch } = this.props;
    let Values;
    let objectName = this.state.objectName;
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        if (!fieldsValue.reportName) {
          message.warning(
            language[
            `improveECMSpecialReportTips_${this.props.language.getlanguages}`
            ]
          );
        } else {
          if (objectName.length == 0) {
            message.warning(
              language[
              `importElectronicTarget_${this.props.language.getlanguages}`
              ]
            );
            return false;
          }
          // if(String(fieldsValue.actionId).length!=4){
          //   message.warning(language[`TheComprehensiveReportIDMustBeANumberOf4_${this.props.language.getlanguages}`]);
          //   return false;
          // }
          if (
            fieldsValue["startTime"].valueOf() >
            fieldsValue["endTime"].valueOf()
          ) {
            message.warning(
              language[`Start_time_less_than_end_time_${this.props.language.getlanguages}`]
            );
            document.getElementById("startTime").style.border =
              "1px solid #f00";
            document.getElementById("endTime").style.border = "1px solid #f00";
            return false;
          } else {
            document.getElementById("startTime").style.border =
              "1px solid #d9d9d9";
            document.getElementById("endTime").style.border =
              "1px solid #d9d9d9";
          }
          if (!err) {
            Values = {
              ...fieldsValue,
              pubishTime: moment().format("YYYY-MM-DD HH:mm:ss"),
              startTime: fieldsValue["startTime"].format("YYYY-MM-DD HH:mm:ss"),
              endTime: fieldsValue["endTime"].format("YYYY-MM-DD HH:mm:ss")
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
            let Context = this.context;

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
                  url: urll + "/SynthInformationReorganize/publishCompreJSON",
                  data: {
                    ...Values,
                    reportType: "电子对抗综合报",
                    objectName: objectName,
                    fileName: fileName
                  }
                })
                  .then(response => {
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
            a()
              .then(b)
              .then(c);
          }
        }
      } else {
        message.warning(language[`improveECMSpecialReportTips_${this.props.language.getlanguages}`
          ]
        );
      }
    });
  };

  // //导出下载
  // download = (response) => {
  //     console.log("response", response)
  //     if (!response.data) {
  //         return;
  //     }
  //     let filename = response.headers["content-type"].substring(response.headers["content-type"].indexOf("filename=") + 9, response.headers["content-type"].indexOf("xlsx") + 4);
  //     let url = window.URL.createObjectURL(new Blob([response.data]));
  //     let link = document.createElement('a');
  //     link.style.display = 'none';
  //     link.href = url
  //     link.setAttribute('download', filename);
  //     document.body.appendChild(link)
  //     link.click()
  // }

  //报告名称失去焦点的时候
  handleReportName_blur = e => {
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
        url: urll + "/SynthInformationReorganize/selectCompreHaveReportName",
        params: { reportName: e.target.value }
      }).then(res => {
        if (res.data[0] == 1) {
          document.getElementById("reportName").style.border = "1px solid red";
          //报告名称已存在，请更改！
          message.warning(
            language[`nameRepeatMsg_${this.props.language.getlanguages}`]
          );
        } else {
          document.getElementById("reportName").style.border = "none";
        }
      }).catch(error => {
        error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
      });
    }
  };

  // 电子目标切换开始时间
  time_change_startTime = (date, dateString) => {
    this.props.form.validateFields((err, values) => {
      this.props.dispatch({
        type: "All/saveSpecialormMsg",
        payload: values
      });
    });
    this.setState({ startTime: dateString });
    if (
      this.state.endTime != "null" &&
      this.state.endTime != null &&
      dateString != null &&
      dateString > this.state.endTime
    ) {
      message.warning(
        language[
        `Start_time_less_than_end_time_${this.props.language.getlanguages}`
        ]
      );
      return false;
    } else {
      this.props.dispatch({
        type: "All/selectElectByTime",
        payload: {
          startTime: !dateString ? "null" : dateString,
          endTime: !this.state.endTime ? "null" : this.state.endTime
        }
      });
    }
  };

  time_change_endTime = (date, dateString) => {
    this.props.form.validateFields((err, values) => {
      this.props.dispatch({
        type: "All/saveSpecialormMsg",
        payload: values
      });
    });
    this.setState({ endTime: dateString });
    if (
      dateString != null &&
      this.state.startTime != null &&
      this.state.startTime != "null" &&
      dateString < this.state.startTime
    ) {
      message.warning(
        language[
        `Start_time_less_than_end_time_${this.props.language.getlanguages}`
        ]
      );
      return false;
    } else {
      this.props.dispatch({
        type: "All/selectElectByTime",
        payload: {
          startTime: !this.state.startTime ? "null" : this.state.startTime,
          endTime: !dateString ? "null" : dateString
        }
      });
    }
  };

  handleLookDetail = (record, objectName) => {
    this.setState({ visbleTargetDetail: true });
    this.props.dispatch({
      type: "ElectronicTarget/selectTargetModelMsg",
      payload: {
        objectName: objectName
      }
    });
  };

  handleTarget = () => {
    this.setState({ visbleTargetDetail: false });
  };

  handleStartAngle = e => {
    if (e.target.value < 0) {
      this.props.form.setFieldsValue({ startAngle: "0" });
    } else if (e.target.value > 360.0) {
      this.props.form.setFieldsValue({ startAngle: "360.0000" });
    }
  };

  handleEndAngle = e => {
    if (e.target.value < 0) {
      this.props.form.setFieldsValue({ endAngle: "0" });
    } else if (e.target.value > 360.0) {
      this.props.form.setFieldsValue({ endAngle: "360.0000" });
    }
  };

  handleMainAngle = e => {
    if (e.target.value < 0) {
      this.props.form.setFieldsValue({ mainAngle: "0" });
    } else if (e.target.value > 360.0) {
      this.props.form.setFieldsValue({ mainAngle: "360.0000" });
    }
  };

  disabledStartDate = startValue => {
    const endValue = this.state.endValue
      ? this.state.endValue
      : this.props.data && this.props.data.endTime
        ? moment(this.props.data.endTime)
        : null;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const startValue = this.state.startValue
      ? this.state.startValue
      : this.props.data && this.props.data.startTime
        ? moment(this.props.data.startTime)
        : null;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  //开始时间的切换
  onStartChange = value => {
    this.onChange("startValue", value);
  };

  //结束时间的切换
  onEndChange = (value, dateString) => {
    this.onChange("endValue", value);
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const FormItem = Form.Item;
    const Option = Select.Option;
    const dateFormat = "YYYY-MM-DD HH:mm:ss";
    const paginationProps = {
      pageSize: 5
    };
    const { startValue, endValue, endOpen } = this.state;
    const { selectedRowKeys } = this.state;
    const { TextArea } = Input;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        var arr = [];
        for (var i = 0; i < selectedRows.length; i++) {
          arr.push(selectedRows[i].objectName);
        }
        this.setState({ targetNameDiaList: arr, selectedRowKeys });
      },
      onSelect: (record, selected, selectedRows) => {
        var arr = [];
        for (var i = 0; i < selectedRows.length; i++) {
          arr.push(selectedRows[i].objectName);
        }
        this.setState({ targetNameDiaList: arr });
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        if (selected == true) {
          var arr = [];
          let data = this.state.targetDialogData;
          for (var i = 0; i < data.length; i++) {
            arr.push(data[i].objectName);
          }
          let dataLength = data.length;
          this.setState({
            selectedRowKeys: [...Array(dataLength + 1).keys()],
            targetNameDiaList: arr
          });
        } else {
          this.setState({
            selectedRowKeys: [],
            targetNameDiaList: ""
          });
        }
      }
    };

    const targeteColumn = [
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
      },
      {
        title: language[`detailedInformation_${this.props.language.getlanguages}`],
        dataIndex: "operate",
        render: (text, record) => (
          <div>
            <a onClick={() => this.handleLookDetail(record, record.objectName)}>
              {language[`lookOver_${this.props.language.getlanguages}`]}
            </a>
            &nbsp;&nbsp;
            {/* {this.state.targetData.length >= 1 ? ( */}
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => this.handleDelete(record, record.key)}
            >
              <a>{language[`delete_${this.props.language.getlanguages}`]}</a>
            </Popconfirm>
            {/* ) : null} */}
          </div>
        )
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
      },
      {
        title: language[`TargetTime_${this.props.language.getlanguages}`],
        dataIndex: "appearTime"
      },
      {
        title:language[`TargetDisappearanceTime_${this.props.language.getlanguages}`],
        dataIndex: "disappearTime"
      }
    ];

    let data = this.props.All.ElectronicTargetColumn_Special
      ? this.props.All.ElectronicTargetColumn_Special
      : [];
    let targeteColumnData = [];
    let threadName;
    let forName;
    let countryName;
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < language.threadLevel.length; j++) {
        //威胁
        if (
          data[i].threadName == language.threadLevel[j].name_zh ||
          data[i].threatName == language.threadLevel[j].name_fr
        ) {
          threadName =
            language.threadLevel[j][`name_${this.props.language.getlanguages}`];
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
            language.countryName[j][`name_${this.props.language.getlanguages}`];
        }
      }
      targeteColumnData.push({
        key: i + 1,
        objectName: data[i].objectName,
        modelName: data[i].modelName,
        countryName: countryName,
        forName: forName,
        threadName: threadName
      });
    }

    let data1 = this.state.targetDialogData ? this.state.targetDialogData : [];
    let targetDialogData = [];
    let threadName1;
    let forName1;
    let countryName1;
    for (let i = 0; i < data1.length; i++) {
      for (let j = 0; j < language.threadLevel.length; j++) {
        //威胁
        if (
          data1[i].threadName == language.threadLevel[j].name_zh ||
          data1[i].threatName == language.threadLevel[j].name_fr
        ) {
          threadName1 =
            language.threadLevel[j][`name_${this.props.language.getlanguages}`];
        }
      }
      for (let j = 0; j < language.EnemyAndFoeAttributes.length; j++) {
        //敌我属性
        if (
          data1[i].forName == language.EnemyAndFoeAttributes[j].name_zh ||
          data1[i].forName == language.EnemyAndFoeAttributes[j].name_fr
        ) {
          forName1 =
            language.EnemyAndFoeAttributes[j][
            `name_${this.props.language.getlanguages}`
            ];
        }
      }
      for (let j = 0; j < language.countryName.length; j++) {
        //国家地区
        if (
          data1[i].countryName == language.countryName[j].name_zh ||
          data1[i].countryName == language.countryName[j].name_fr
        ) {
          countryName1 =
            language.countryName[j][`name_${this.props.language.getlanguages}`];
        }
      }
      targetDialogData.push({
        key: i + 1,
        objectName: data1[i].objectName,
        modelName: data1[i].modelName,
        countryName: countryName1,
        forName: forName1,
        threadName: threadName1,
        appearTime: data1[i].appearTime,
        disappearTime: data1[i].disappearTime
      });
    }

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
              &nbsp;&nbsp;
              {/* 成果发布成json */}
              {/* {typeof window.getUrl !== "function" ? ( */}
              <FormItem style={{ float: "right", margin: "0 5px" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={this.handleResultsPublishJSON}
                >
                  {language[`ResultsReleasedAsJSON_${this.props.language.getlanguages}`]}
                </Button>
              </FormItem>
              {/* ) : null} */}
              {/* &nbsp;&nbsp; */}
              <FormItem style={{ float: "right", margin: "0 5px" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={this.handlePublish}
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
                {language[`ElectronicCountBulletin_${this.props.language.getlanguages}`]}
              </div>
            </div>
            <div className={style.ContentBasic}>
              <div className={style.subhead}>
                {/* 基本属性 */}
                <div style={{ margin: "5px 10px", float: "left" }}>
                  {language[`basicAttribute_${this.props.language.getlanguages}`]}
                </div>
              </div>

              <div className={style.Basic_Content_Wrap}>
                {/* 报告名称 */}
                <div>
                  <span
                    style={{
                      color: "red",
                      marginRight: "3px",
                      verticalAlign: "middle"
                    }}
                  >
                    *
                  </span>
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
                          {language[`ElectronicCountBulletin_${this.props.language.getlanguages}`]}
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
                      <Select disabled>
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
                        className={styleless.datePicker}
                        showTime={{ format: "HH:mm:ss" }}
                        format={dateFormat}
                        style={{ width: "320px" }}
                      />
                    )}
                  </FormItem>
                </div>
                {/* 开始时间 */}
                <div>
                  <span
                    style={{
                      color: "red",
                      marginRight: "3px",
                      verticalAlign: "middle"
                    }}
                  >
                    *
                  </span>
                  {language[`startTime_${this.props.language.getlanguages}`]}
                </div>
                <div>
                  <FormItem>
                    {getFieldDecorator("startTime", {
                      rules: [{ required: true }],
                      initialValue: startValue
                        ? startValue
                        : this.props.data != null && this.props.data.startTime
                          ? moment(this.props.data.startTime)
                          : null
                    })(
                      <DatePicker
                        className={styleless.datePicker}
                        showTime={{ format: "HH:mm:ss" }}
                        format={dateFormat}
                        style={{ width: "320px" }}
                        disabledDate={this.disabledStartDate}
                        showTime
                        placeholder="Start"
                        onChange={this.onStartChange}
                      // onOpenChange={this.handleStartOpenChange}
                      />
                    )}
                  </FormItem>
                </div>
                {/* 结束时间 */}
                <div>
                  <span
                    style={{
                      color: "red",
                      marginRight: "3px",
                      verticalAlign: "middle"
                    }}
                  >
                    *
                  </span>
                  {language[`endTime_${this.props.language.getlanguages}`]}
                </div>
                <div>
                  <FormItem>
                    {getFieldDecorator("endTime", {
                      rules: [{ required: true }],
                      initialValue: endValue
                        ? endValue
                        : this.props.data && this.props.data.endTime
                          ? moment(this.props.data.endTime)
                          : null
                    })(
                      <DatePicker
                        className={styleless.datePicker}
                        showTime={{ format: "HH:mm:ss" }}
                        format={dateFormat}
                        style={{ width: "320px" }}
                        disabledDate={this.disabledEndDate}
                        showTime
                        placeholder="End"
                        onChange={this.onEndChange}
                      // open={endOpen}
                      // onOpenChange={this.handleEndOpenChange}
                      />
                    )}
                  </FormItem>
                </div>
                {/* 起始方向 */}
                <div>
                  {language[`Orientation_${this.props.language.getlanguages}`]}
                </div>
                <div>
                  <FormItem>
                    {getFieldDecorator("startAngle", {
                      // rules: [{ required: true }],
                      getValueFromEvent: value => {
                        return String(value)
                          .replace(/[^\d.]/g, "")
                          .replace(/^\./g, "")
                          .replace(/\.{2,}/g, ".")
                          .replace(".", "$#$")
                          .replace(/\./g, "")
                          .replace("$#$", ".")
                          .replace(/^(\-)*(\d)\.(\d\d\d\d).*$/, "$1$2.$3");
                      }
                    })(
                      <InputNumber
                        className={styleless.input}
                        type="text"
                        autoComplete="off"
                        min={0}
                        max={360}
                        step={0.0001}
                        placeholder="0~360"
                        onBlur={this.handleStartAngle}
                      />
                    )}
                  </FormItem>
                </div>
                {/*终止方向 */}
                <div>
                  {language[`TerminationDirection_${this.props.language.getlanguages}`]}
                </div>
                <div>
                  <FormItem>
                    {getFieldDecorator("endAngle", {
                      // rules: [{ required: true }],
                      getValueFromEvent: value => {
                        return String(value)
                          .replace(/[^\d.]/g, "")
                          .replace(/^\./g, "")
                          .replace(/\.{2,}/g, ".")
                          .replace(".", "$#$")
                          .replace(/\./g, "")
                          .replace("$#$", ".")
                          .replace(/^(\-)*(\d)\.(\d\d\d\d).*$/, "$1$2.$3");
                      }
                    })(
                      <InputNumber
                        className={styleless.input}
                        autoComplete="off"
                        min={0}
                        max={360}
                        step={0.0001}
                        placeholder="0~360"
                        onBlur={this.handleEndAngle}
                      />
                    )}
                  </FormItem>
                </div>
                <div>
                  {language[`MainDirections_${this.props.language.getlanguages}`]}
                </div>
                <div>
                  <FormItem>
                    {getFieldDecorator("mainAngle", {
                      // rules: [{ required: true }],
                      getValueFromEvent: value => {
                        return String(value)
                          .replace(/[^\d.]/g, "")
                          .replace(/^\./g, "")
                          .replace(/\.{2,}/g, ".")
                          .replace(".", "$#$")
                          .replace(/\./g, "")
                          .replace("$#$", ".")
                          .replace(/^(\-)*(\d)\.(\d\d\d\d).*$/, "$1$2.$3");
                      }
                    })(
                      <InputNumber
                        className={styleless.input}
                        autoComplete="off"
                        min={0}
                        max={360}
                        step={0.0001}
                        placeholder="0~360"
                        onBlur={this.handleMainAngle}
                      />
                    )}
                  </FormItem>
                </div>

                <div style={{display:"none"}}>
                  <span style={{ color: "red", marginRight: "3px", verticalAlign: "middle" }}>*</span>
                  {language[`ComprehensiveReportIdentification_${this.props.language.getlanguages}`]}
                </div>
                <div style={{display:"none"}}>
                  <FormItem>
                    {getFieldDecorator("actionId", {
                      rules: [{ required: true }],
                      initialValue:this.props.All.ZHBId
                    })(
                      <Input
                        disabled
                        className={styleless.input}
                        maxLength={4}
                        autoComplete="off"
                      />
                    )}
                  </FormItem>
                </div>

                <div>
                  <span style={{ color: "red", marginRight: "3px", verticalAlign: "middle" }}>*</span>
                  {language[`GeneralReporter_${this.props.language.getlanguages}`]}
                </div>
                <div>
                  <FormItem>
                    {getFieldDecorator("compilationName", {
                      rules: [{ required: true }],
                      getValueFromEvent: event => {
                        return event.target.value.slice(0, 100);
                      }
                    })(
                      <Input
                        className={styleless.input}
                        type="text"
                        autoComplete="off"
                      />
                    )}
                  </FormItem>
                </div>
              </div>

              <div className={style.introduceBox}>
                <div className={style.BasicSituation}>
                  <span style={{ color: "red", marginRight: "3px", verticalAlign: "middle" }}>*</span>
                  {language[`CombatMission_${this.props.language.getlanguages}`]}
                </div>
                <div className={style.BasicSituation}>
                  <span style={{ color: "red", marginRight: "3px", verticalAlign: "middle" }}>*</span>
                  {language[`OperationalPurpose_${this.props.language.getlanguages}`]}
                </div>
                <div className={style.BasicSituation}>
                  <span style={{ color: "red", marginRight: "3px", verticalAlign: "middle" }}>*</span>
                  {language[`BriefDescriptionOfCombatResults_${this.props.language.getlanguages}`]}
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
                <div className={style.introduce}>
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
                <div className={style.introduce}>
                  <FormItem>
                    {getFieldDecorator("actionDescription", {
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

           
            {/* 电子目标列表 */}
            <div className={style.ContentParams}>
              <div className={style.subhead}>
                <div style={{ margin: "5px 10px", float: "left" }}>
                  {language[`ElectronicTargetList_${this.props.language.getlanguages}`]}
                </div>
                <div style={{ float: "right", marginRight: "50px" }}>
                  <Button type="primary" onClick={this.importTarge}>
                    {language[`ImportingElectronicTargets_${this.props.language.getlanguages }`]}
                  </Button>
                </div>
                {this.state.visbleTarget ? (
                  <Dialog
                    TitleText={language[`ImportTarget_${this.props.language.getlanguages}`]}
                    showDialog={this.state.visbleTarget}
                    onOk={this.handleOkTarget}
                    onCancel={this.handleCancelTarget}
                    className={styleless.mybob}
                    okText={language[`MakeSureImport_${this.props.language.getlanguages}`]}
                    cancelText={
                      language[`quit_${this.props.language.getlanguages}`]
                    }
                    showMask
                    BodyContent={
                      <div className={style.popFodderTypeMax}>
                        <div
                          className={style.select_condition_targetDialog_Target}
                        >
                          <div>
                            <span>
                              {language[`TargetTime_${this.props.language.getlanguages}`]}
                            </span>
                            {/* 开始时间 */}
                            <div>
                              <DatePicker
                                className={styleless.datePicker}
                                showTime={{ format: "HH:mm:ss" }}
                                format={dateFormat}
                                style={{ width: "240px" }}
                                onChange={this.time_change_startTime}
                                popupStyle={{ zIndex: 1054 }}
                              />
                            </div>
                          </div>
                          <div>
                            <span>
                              {language[`TargetDisappearanceTime_${this.props.language.getlanguages}`]}
                            </span>
                            {/* 结束时间 */}
                            <div>
                              <DatePicker
                                className={styleless.datePicker}
                                showTime={{ format: "HH:mm:ss" }}
                                format={dateFormat}
                                style={{ width: "240px" }}
                                onChange={this.time_change_endTime}
                                popupStyle={{ zIndex: 1054 }}
                              />
                            </div>
                          </div>
                        </div>

                        {/*上传后的文件列表*/}
                        <div className={style.uploadtable}>
                          <Table
                            rowSelection={rowSelection}
                            columns={targetColumnList}
                            dataSource={targetDialogData}
                            className={styleless.myClass}
                            rowClassName={(record, index) =>
                              index % 2 === 0 ? styleless.odd : styleless.even
                            } //奇偶行颜色交替变化
                            pagination={paginationProps}
                            mask={false}
                          />
                        </div>
                        <div
                          style={{
                            marginTop: "20px",
                            width: "200px",
                            height: "32px",
                            margin: "0 auto"
                          }}
                        >
                          <Button
                            type="primary"
                            onClick={this.handleCancelTarget}
                            style={{
                              display: "inline-block",
                              marginRight: "10px"
                            }}
                          >
                            {language[`cancel_${this.props.language.getlanguages}`]}
                          </Button>
                          <FormItem style={{ display: "inline-block" }}>
                            <Button
                              type="primary"
                              htmlType="submit"
                              disabled={
                                this.state.targetNameDiaList &&
                                  this.state.targetNameDiaList.length > 0
                                  ? false
                                  : true
                              }
                              onClick={this.handleOkTarget}
                            >
                              {language[`confirm_${this.props.language.getlanguages}`]}
                            </Button>
                          </FormItem>
                        </div>
                      </div>
                    }
                  />
                ) : null}
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
                  dataSource={targeteColumnData}
                  pagination={paginationProps}
                />
                <div>
                  {this.state.visbleTargetDetail ? (
                    <Dialog
                      TitleText={language[`ElectronicTarget_${this.props.language.getlanguages}`]}
                      showDialog={this.state.visbleTargetDetail}
                      onOk={this.handleOkAdd}
                      className={styleless.mybob}
                      okText={language[`SureToAdd_${this.props.language.getlanguages}`]}
                      cancelText={language[`quit_${this.props.language.getlanguages}`]}
                      onCancel={this.handleTarget}
                      LEFT="400px"
                      TOP="660px"
                      showMask
                      BodyContent={
                        <div style={{ height: "600px", overflowY: "scroll" }}>
                          <TargetOnlyLook
                            data={this.props.ElectronicTarget.TargetAllData}
                          />
                        </div>
                      }
                    />
                  ) : null}
                </div>
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
      </div>
    );
  }
}

ElectronicCo = Form.create({
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
        startAngle: Form.createFormField({
          ...props,
          value: data.startAngle
        }),
        endAngle: Form.createFormField({
          ...props,
          value: data.endAngle
        }),
        mainAngle: Form.createFormField({
          ...props,
          value: data.mainAngle
        }),
        actionId: Form.createFormField({
          ...props,
          value: data.actionId
        }),
        compilationName: Form.createFormField({
          ...props,
          value: data.compilationName
        }),
        actionTask: Form.createFormField({
          ...props,
          value: data.actionTask
        }),
        actionPurpose: Form.createFormField({
          ...props,
          value: data.actionPurpose
        }),
        actionDescription: Form.createFormField({
          ...props,
          value: data.actionDescription
        }),

        
      };
    }
  }
})(ElectronicCo);
export default ElectronicCo;
