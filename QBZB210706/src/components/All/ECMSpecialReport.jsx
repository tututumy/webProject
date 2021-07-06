import React, { Component } from "react";
import {
  Table,
  Form,
  Input,
  DatePicker,
  Popconfirm,
  Select,
  message,
  Button, InputNumber
} from "antd";
import style from "./Edit.css";
import styleless from "./test.less";
import { Link } from "dva/router";
import Dialog from "../../utils/DialogMask/Dialog";
import TargetOnlyLook from "../Target/Target_OnlyLook";
import { connect } from "dva";
import language from "../language/language";
import axios from "axios";
import moment from "moment";
import PropTypes from "prop-types";
import responseStatus from "../../utils/initCode"

//电子对抗专题报
@connect(({ language, All, ElectronicTarget }) => ({
  language,
  All,
  ElectronicTarget
}))
class EditPage extends Component {
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
      visbleTargetDetail: false, //查看电子目标具体信息的弹出框
      startTime: "null",
      endTime: "null",
      selectedRowKeys: [], //勾选电子目标的列表

      startValue: null, //活动开始时间
      endValue: null, //活动结束时间
      endOpen: false,
      targetDialogDataLoading: false //导入目标的弹出框的loading
    };
  }

  UNSAFE_componentWillReceiveProps({ All }) {
    if (All.ElectronicTargetColumn_Dialog_Special) {
      var nowData = [];
      var data = All.ElectronicTargetColumn_Dialog_Special;
      for (let i = 0; i < data.length; i++) {
        nowData.push({
          key: i + 1,
          objectName: data[i].objectName,
          modelName: data[i].modelName,
          plantType: data[i].plantType,
          countryName: data[i].countryName,
          forName: data[i].forName,
          threadName: data[i].threadName,
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

  //触发保存表单数据
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
            `${data[i].objectName}${
            language[`Existing_${this.props.language.getlanguages}`]
            }`
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
      visbleTarget: false
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
      if (!fieldsValue.reportName) {
        message.warning(language[`improveECMSpecialReportTips_${this.props.language.getlanguages}`]);
      } else {
        if (!err) {
          let objectName = this.state.objectName;
          if (objectName.length == 0) {
            message.warning(language[`importElectronicTarget_${this.props.language.getlanguages}`]);
            return false;
          }
          // if (String(fieldsValue.reportSignId).length != 4) {
          //   message.warning(language[`SpecialReportIdentificationMustBe4AsANumber_${this.props.language.getlanguages}`]);
          //   return false;
          // }
          if (
            fieldsValue["actionStartTime"].valueOf() > fieldsValue["actionEndTime"].valueOf()
          ) {
            message.warning(
              language[`ActivityStartTimeLessThanActivityEndTime_${this.props.language.getlanguages}`]
            );
            document.getElementById("actionStartTime").style.border = "1px solid #f00";
            document.getElementById("actionEndTime").style.border = "1px solid #f00";
            return false;
          } else {
            document.getElementById("actionStartTime").style.border =
              "1px solid #d9d9d9";
            document.getElementById("actionEndTime").style.border =
              "1px solid #d9d9d9";
          }
          Values = {
            ...fieldsValue,
            pubishTime: fieldsValue["pubishTime"]
              ? fieldsValue["pubishTime"].format("YYYY-MM-DD HH:mm:ss")
              : null,
            actionStartTime: fieldsValue["actionStartTime"]
              ? fieldsValue["actionStartTime"].format("YYYY-MM-DD HH:mm:ss")
              : "",
            actionEndTime: fieldsValue["actionEndTime"]
              ? fieldsValue["actionEndTime"].format("YYYY-MM-DD HH:mm:ss")
              : ""
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
                  type: "All/ClickResultsReleased",
                  payload: {
                    ...Values,
                    actionType: "电子对抗专题报",
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
                  type: "All/saveSpecialEditMsg",
                  payload: {
                    ...Values,
                    actionType: "电子对抗专题报",
                    objectName: objectName,
                    fileName: fileName //传过去一个fileId
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
          message.warning(
            language[
            `improveECMSpecialReportTips_${this.props.language.getlanguages}`
            ]
          );
        }
      }
    });
  };

  //点击成果发布按钮
  handlePublish = e => {
    e.preventDefault();
    //获取cookie是中文还是法文
    let getLanguage = getCookie("uop.locale") === "fr_FR" ? "fr" : "zh";
    let Values;
    let { dispatch } = this.props;
    this.props.form.validateFields((err, fieldsValue) => {
      if (!fieldsValue.reportName) {
        message.warning(language[`improveECMSpecialReportTips_${this.props.language.getlanguages}`
          ]
        );
      } else {
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
          // if (String(fieldsValue.reportSignId).length != 4) {
          //   message.warning(language[`SpecialReportIdentificationMustBe4AsANumber_${this.props.language.getlanguages}`]);
          //   return false;
          // }
          if (
            fieldsValue["actionStartTime"].valueOf() >
            fieldsValue["actionEndTime"].valueOf()
          ) {
            message.warning(
              language[
              `ActivityStartTimeLessThanActivityEndTime_${
              this.props.language.getlanguages
              }`
              ]
            );
            document.getElementById("actionStartTime").style.border =
              "1px solid #f00";
            document.getElementById("actionEndTime").style.border =
              "1px solid #f00";
            return false;
          } else {
            document.getElementById("actionStartTime").style.border =
              "1px solid #d9d9d9";
            document.getElementById("actionEndTime").style.border =
              "1px solid #d9d9d9";
          }
          Values = {
            ...fieldsValue,
            pubishTime: moment().format("YYYY-MM-DD HH:mm:ss"),
            actionStartTime: fieldsValue["actionStartTime"].format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            actionEndTime: fieldsValue["actionEndTime"].format(
              "YYYY-MM-DD HH:mm:ss"
            )
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
          let Context = this.context;
          let fileName = arr1
            .concat(arr2)
            .concat(arr3)
            .concat(arr4);
          function a() {
            return new Promise(function (open, err) {
              //根据cookie获取出来的中法文标识调用不同的后端接口====后端生成的pdf是中文版还是法文版
              if (getLanguage === "zh") {
                dispatch({
                  type: "All/publish_Special",
                  payload: {
                    ...Values,
                    actionType: "电子对抗专题报",
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
                  type: "All/publish_Special_fr",
                  payload: {
                    ...Values,
                    actionType: "电子对抗专题报",
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
        } else {
          message.warning(
            language[
            `improveECMSpecialReportTips_${this.props.language.getlanguages}`
            ]
          );
        }
      }
    });
  };

  //点击成果发布成JSON按钮
  handleResultsPublishJSON = e => {
    e.preventDefault();
    let Values;
    let { dispatch } = this.props;
    this.props.form.validateFields((err, fieldsValue) => {
      if (!fieldsValue.reportName) {
        message.warning(language[`improveECMSpecialReportTips_${this.props.language.getlanguages}`
          ]
        );
      } else {
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
          // if (String(fieldsValue.reportSignId).length != 4) {
          //   message.warning(language[`SpecialReportIdentificationMustBe4AsANumber_${this.props.language.getlanguages}`]);
          //   return false;
          // }
          if (
            fieldsValue["actionStartTime"].valueOf() >
            fieldsValue["actionEndTime"].valueOf()
          ) {
            message.warning(
              language[
              `ActivityStartTimeLessThanActivityEndTime_${
              this.props.language.getlanguages
              }`
              ]
            );
            document.getElementById("actionStartTime").style.border =
              "1px solid #f00";
            document.getElementById("actionEndTime").style.border =
              "1px solid #f00";
            return false;
          } else {
            document.getElementById("actionStartTime").style.border =
              "1px solid #d9d9d9";
            document.getElementById("actionEndTime").style.border =
              "1px solid #d9d9d9";
          }
          Values = {
            ...fieldsValue,
            // 'pubishTime': fieldsValue['pubishTime'].format('YYYY-MM-DD HH:mm:ss'),
            pubishTime: moment().format("YYYY-MM-DD HH:mm:ss"),
            actionStartTime: fieldsValue["actionStartTime"].format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            actionEndTime: fieldsValue["actionEndTime"].format(
              "YYYY-MM-DD HH:mm:ss"
            )
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
          let Context = this.context;
          let fileName = arr1
            .concat(arr2)
            .concat(arr3)
            .concat(arr4);
          function a() {
            return new Promise(function (open, err) {
              let urll;
              if (typeof window.getUrl == "function") {
                //根据主站遥控本控模式设置（全局函数）
                urll = window.getUrl() + "/api/LK-0313036/LK036";
              } else {
                urll = "http://192.168.0.107:8087";
              }
              let urlDEtail = window.getCookie('uop.locale') === 'fr_FR' ? "/SynthInformationReorganize/publishSpecialJsonFrench" : "/SynthInformationReorganize/publishSpecialJson";
              axios({
                method: "POST",
                url: urll + urlDEtail,
                data: {
                  ...Values,
                  actionType: "电子对抗专题报",
                  objectName: objectName,
                  fileName: fileName
                }
              })
                .then(response => {
                  console.log("response", response);
                  if (response && response.data) {
                    //下载为json文件
                    var Link = document.createElement("a");
                    Link.download = response.data[1];
                    Link.style.display = "none";
                    let jsonContent = response.data[0] && response.data[0][0] ? response.data[0][0] : "";
                    let jsonContentNew = JSON.stringify(jsonContent, null, "\t");
                    // 字符内容转变成blob地址
                    var blob = new Blob([jsonContentNew]);
                    Link.href = URL.createObjectURL(blob);
                    console.log("Link.href", Link.href)
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
        } else {
          message.warning(language[`improveECMSpecialReportTips_${this.props.language.getlanguages}`]);
        }
      }
    });
  };

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
        url: urll + "/SynthInformationReorganize/selectSpecialHaveReportName",
        params: { reportName: e.target.value }
      }).then(res => {
        if (res.data[0] == 1) {
          document.getElementById("reportName").style.border = "1px solid red";
          message.warning(
            language[`nameRepeatTips_${this.props.language.getlanguages}`]
          );
        } else {
          document.getElementById("reportName").style.border = "none";
        }
      }).catch(error => {
        error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
      });
    }
  };

  //电子目标弹出框切换国家地区
  handleChange_GJDQ = () => { };

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
        threadName: momentValue
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
      dateString &&
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
      dateString &&
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

  disabledStartDate = startValue => {
    const endValue = this.state.endValue
      ? this.state.endValue
      : this.props.data && this.props.data.actionEndTime
        ? moment(this.props.data.actionEndTime)
        : null;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const startValue = this.state.startValue
      ? this.state.startValue
      : this.props.data && this.props.data.actionStartTime
        ? moment(this.props.data.actionStartTime)
        : null;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: null
    });
  };

  //活动开始时间的切换
  onStartChange = value => {
    this.onChange("startValue", value);
  };

  //活动结束时间的切换
  onEndChange = value => {
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
    const { TextArea } = Input;
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
            {/* 查看 */}
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

    return (
      <div className={style.content_box} id="map_dragger_area">
        <Form
          className={styleless.myBandForm}
          id="myForm"
          onSubmit={this.handleSubmit}
        >
          <div className={style.subject}>
            <div className={style.head}>
              <Link to="/all?id=object" replace>
                <Button
                  type="primary"
                  style={{ float: "right", margin: "0 5px" }}
                >
                  {language[`goBack_${this.props.language.getlanguages}`]}
                </Button>
              </Link>
              {/* &nbsp;&nbsp; */}
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
              &nbsp;&nbsp;
              {/* 成果发布 */}
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
                {language[`ECMSpecialReport_${this.props.language.getlanguages}`]}
              </div>
            </div>
            <div className={style.ContentBasic_wrap}>
              <div className={style.ContentBasic}>
                <div className={style.subhead}>
                  {language[`basicAttribute_${this.props.language.getlanguages}`]}
                </div>
                <div className={style.Basic_Content_Wrap}>
                  {/* 报告名称 */}
                  <div>
                    <span style={{ color: "red", marginRight: "3px", verticalAlign: "middle" }}>*</span>
                    {language[`ReportName_${this.props.language.getlanguages}`]}
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("reportName", {
                        rules: [{ required: true, whitespace: true }], //不能为空
                        getValueFromEvent: event => {
                          return event.target.value.slice(0, 200);
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
                            {language[`ECMSpecialReport_${this.props.language.getlanguages}`]}
                          </Option>
                        </Select>
                      )}
                    </FormItem>
                  </div>
                  {/* 发布状态 */}
                  <div>{language[`publishStatus_${this.props.language.getlanguages}`]}</div>
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
                  <div>
                    {language[`TopicActivityName_${this.props.language.getlanguages}`]}
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("actionName", {
                        getValueFromEvent: event => {
                          return event.target.value.slice(0, 2000);
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
                  {/* 活动开始时间 */}
                  <div>
                    <span style={{ color: "red", marginRight: "3px", verticalAlign: "middle" }}>*</span>
                    {language[`ActivityStartTime_${this.props.language.getlanguages}`]}
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("actionStartTime", {
                        rules: [{ required: true }],
                        initialValue: startValue
                          ? startValue
                          : this.props.data != null &&
                            this.props.data.actionStartTime !== undefined &&
                            this.props.data.actionStartTime !== null
                            ? moment(this.props.data.actionStartTime)
                            : null
                      })(
                        <DatePicker
                          className={styleless.datePicker}
                          format={dateFormat}
                          style={{ width: "320px" }}
                          // disabledDate={this.disabledStartDate}
                          showTime
                          placeholder="Start"
                          onChange={this.onStartChange}
                        // onOpenChange={this.handleStartOpenChange}
                        />
                      )}
                    </FormItem>
                  </div>
                  {/* 活动结束时间 */}
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
                    {language[`ActivityEndTime_${this.props.language.getlanguages}`]}
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("actionEndTime", {
                        rules: [{ required: true }],
                        initialValue: endValue
                          ? endValue
                          : this.props.data != null &&
                            this.props.data.actionEndTime !== undefined &&
                            this.props.data.actionEndTime !== null
                            ? moment(this.props.data.actionEndTime)
                            : null
                      })(
                        <DatePicker
                          className={styleless.datePicker}
                          format={dateFormat}
                          style={{ width: "320px" }}
                          showTime
                          placeholder="End"
                          onChange={this.onEndChange}
                        />
                      )}
                    </FormItem>
                  </div>

                  <div style={{ display: "none" }}>
                    <span style={{ color: "red", marginRight: "3px", verticalAlign: "middle" }}>*</span>
                    {language[`SpecialReportIdentification_${this.props.language.getlanguages}`]}
                  </div>
                  <div style={{ display: "none" }}>
                    <FormItem>
                      {getFieldDecorator("reportSignId", {
                        rules: [{ required: true }],
                        initialValue: this.props.All.SpecialId
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
                    {language[`SpecialSpeaker_${this.props.language.getlanguages}`]}
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
              </div>

              <div className={style.objective}>
                <div className={style.activityObjective}>
                  <span style={{ color: "red", marginRight: "3px", verticalAlign: "middle" }}>*</span>
                  {language[`PurposeOfThematicActivities_${this.props.language.getlanguages}`]}
                </div>
                <div className={style.BasicSituation}>
                  <span style={{ color: "red", marginRight: "3px", verticalAlign: "middle" }}>*</span>
                  {language[`SpecialActivities_${this.props.language.getlanguages}`]}
                </div>
                <div className={style.introduce}>
                  <FormItem>
                    {getFieldDecorator("actionPurpose", {
                      rules: [{ required: true }],
                      getValueFromEvent: event => {
                        return event.target.value.slice(0, 1000);
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
                    {getFieldDecorator("actionDescription", {
                      rules: [{ required: true }],
                      getValueFromEvent: event => {
                        return event.target.value.slice(0, 1000);
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
                <div style={{ float: "left" }}>
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
                              onClick={this.handleOkTarget}
                              disabled={
                                this.state.targetNameDiaList &&
                                  this.state.targetNameDiaList.length > 0
                                  ? false
                                  : true
                              }
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

EditPage = Form.create({
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
        actionName: Form.createFormField({
          ...props,
          value: data.actionName
        }),
        actionType: Form.createFormField({
          ...props,
          value: data.actionType
        }),
        reportSignId: Form.createFormField({
          ...props,
          value: data.reportSignId
        }),
        compilationName: Form.createFormField({
          ...props,
          value: data.compilationName
        }),
        actionPurpose: Form.createFormField({
          ...props,
          value: data.actionPurpose
        }),
        actionDescription: Form.createFormField({
          ...props,
          value: data.actionDescription
        })
      };
    }
  }
})(EditPage);
export default EditPage;
