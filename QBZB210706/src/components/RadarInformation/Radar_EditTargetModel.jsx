import React, { Component } from "react";
import { connect } from "dva";
import style from "./Edit.css";
import styleless from "./test.less";
import { Select, Input, Form, message } from "antd";
import Radar_relateMsg from "./Radar_relateMsg";
import TabDemo from "./TargetLibraryTabs";
import AddTable from "./RadarWorkModel_Target";
import language from "../language/language";
import axios from "axios";
import DialogConfirmMask from "../../utils/DialogConfirmMask/Dialog";
import responseStatus from "../../utils/initCode";

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
class Radar_EditTargetModel extends Component {
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
      infodata: [],
      selectedInfoName: "",
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
      radarData_basic: [],
      radarData_tec: [],
      targetFormMsg: null,
      clearMsg: false,
      targetWorkModel_fromTar: null,
      WorkModelMsg_Target: null,
      ModelMsg: null,
      radarName: "",
      radarAllType: null, //所有的雷达型号
      model: "-1",
      technologyNameMark: false, //技术体制是否是连续波
      visibleConfirm: false, //切换雷达目标型号弹出框
      tecData: "-1",
      changeTecMark: false //是否切换了连续波和非连续波不同的雷达目标型号
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: "radarModel/selectRadarType",
      callback: res => {
        if (res.data[0]) {
          let data = res.data[0];
          this.setState({ radarAllType: data });
        }
      }
    });
  }

  //这里接受模块切换的信息
  UNSAFE_componentWillReceiveProps(nextprops) {
    if (nextprops.data && nextprops.data[0]) {
      this.setState({
        technologyNameMark:
          nextprops.data[0].technologyName === "15" ? true : false
      });
    }
    this.setState({
      model: nextprops.model,
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
          arr.push({
            key: i + 1,
            name: data[i].objectName,
            type: data[i].typeName,
            pttype: data[i].platfomName,
            level: data[i].modelName,
            info: data[i].threatName,
            note: data[i].remark
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
          arr1.push({
            key: data[i].electronicObjectId,
            name: data[i].objectName,
            type: data[i].model,
            level: data[i].threatName,
            yt: data[i].purpose,
            info: data[i].deployInformation
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
    if (this.props.goBackMark) {
      const { dispatch } = this.props;
      dispatch({
        type: "changeComp/openZhonghe",
        payload: {
          mark: "first"
        }
      });
      dispatch({
        type: "radarModel/clearAllMsg",
        payload: {
          clearMsg: true
        }
      });
    }
  }

  //当目标库的名称失去焦点的时候判断是否和数据库中的名称有重复
  selectRepeate = () => {
    this.props.form.validateFields((err, values) => {
      this.props.dispatch({
        type: "radarModel/updataRadarBasicMsg",
        payload: values
      });
    });
    let name = this.props.form.getFieldValue("objectName");
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
          this.props.dispatch({
            type: "radarModel/saveRadarName",
            payload: {
              name: name
            }
          });
          this.saveFormMsg();
        }
      })
      .catch(error => {
        error.response !== undefined
          ? responseStatus(error.response.status)
          : message.error(`error: ${error}`);
      });
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

  handleSubmit = e => {
    // e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: "radarModel/updataRadarBasicMsg",
          payload: values
        });
      }
    });
  };

  saveFormMsg = () => {
    this.props.form.validateFields((err, values) => {
      this.props.dispatch({
        type: "radarModel/updataRadarBasicMsg",
        payload: values
      });
    });
  };

  //电子目标类型切换，查询对应的战技术参数
  selectTypeDetails = value => {
    let tecData = this.props.form.getFieldValue("technologyName");
    let model = this.props.form.getFieldValue("model");
    this.setState({ model: value, tecData: model });
    if (value === "-1") {
      //如果类型是“请下拉选择”
      this.props.form.validateFields((err, values) => {
        this.props.dispatch({
          type: "radarModel/updataRadarBasicMsg",
          payload: {
            ...values,
            model: "-1",
            manufacturer: null,
            freqName: "00",
            maxWorkFreqHz: null,
            minWorkFreqHz: null,
            pwName: "00",
            maxPwUs: null,
            minPwUs: null,
            priName: "00",
            maxPriUs: null,
            minPriUs: null,
            technologyName: "00",
            antiName: "00",
            maxTransmitPowerW: null,
            maxAntennaGain: null,
            maxDectectionRangeKm: null,
            receiverBwHz: null,
            innerKa: null,
            sustemLoss: null,
            noiseFigure: null,
            minDetectablePowerDBm: null,
            radarPurpose: null,
            radarRemark: null
          }
        });
      });
    } else {
      //如果雷达目标型号不是请下拉选择，调用接口查询对应的战技术参数
      this.props.dispatch({
        type: "radarModel/selectRadarTypeDetails",
        payload: value,
        callback: res => {
          if (res.data[0]) {
            let data = res.data[0];
            let target_workModelMsg_Main = this.props.radarModel
              .target_workModelMsg_Main;
            this.props.form.validateFields((err, values) => {
              this.props.dispatch({
                type: "radarModel/updataRadarBasicMsg",
                payload: {
                  ...values,
                  model: value,
                  manufacturer: data.manufacturer,
                  freqName: data.freqName,
                  maxWorkFreqHz: data.maxWorkFreqHz,
                  minWorkFreqHz: data.minWorkFreqHz,
                  pwName: data.pwName,
                  maxPwUs: data.maxPwUs,
                  minPwUs: data.minPwUs,
                  priName: data.priName,
                  maxPriUs: data.maxPriUs,
                  minPriUs: data.minPriUs,
                  technologyName: data.technologyName,
                  antiName: data.antiName,
                  maxTransmitPowerW: data.maxTransmitPowerW,
                  maxAntennaGain: data.maxAntennaGain,
                  maxDectectionRangeKm: data.maxDectectionRangeKm,
                  receiverBwHz: data.receiverBwHz,
                  innerKa: data.innerKa,
                  sustemLoss: data.sustemLoss,
                  noiseFigure: data.noiseFigure,
                  minDetectablePowerDBm: data.minDetectablePowerDBm,
                  radarPurpose: data.radarPurpose,
                  radarRemark: data.radarRemark
                }
              });
            });

            if (
              (target_workModelMsg_Main &&
                target_workModelMsg_Main.length > 0 &&
                (tecData === "15" && data.technologyName !== "15")) ||
              (target_workModelMsg_Main &&
                target_workModelMsg_Main.length > 0 &&
                (tecData !== "15" && data.technologyName === "15"))
            ) {
              this.setState({ visibleConfirm: true });
            }
            //如果技术体制为连续波
            if (data.technologyName === "15") {
              this.setState({ technologyNameMark: true });
            } else {
              this.setState({ technologyNameMark: false });
            }
          }
        }
      });
    }
  };

  //类型切换的弹出框点击取消
  handleCancelConfirm = () => {
    this.setState({ visibleConfirm: false });
    this.props.form.setFieldsValue({ model: this.state.tecData });
    let value = this.state.tecData;

    if (value == "-1") {
      //如果类型是“请下拉选择”
      this.props.form.validateFields((err, values) => {
        this.props.dispatch({
          type: "radarModel/updataRadarBasicMsg",
          payload: {
            ...values,
            model: "-1",
            manufacturer: null,
            freqName: "00",
            maxWorkFreqHz: null,
            minWorkFreqHz: null,
            pwName: "00",
            maxPwUs: null,
            minPwUs: null,
            priName: "00",
            maxPriUs: null,
            minPriUs: null,
            technologyName: "00",
            antiName: "00",
            maxTransmitPowerW: null,
            maxAntennaGain: null,
            maxDectectionRangeKm: null,
            receiverBwHz: null,
            innerKa: null,
            sustemLoss: null,
            noiseFigure: null,
            minDetectablePowerDBm: null,
            radarPurpose: null,
            radarRemark: null
          }
        });
      });
    } else {
      this.props.dispatch({
        type: "radarModel/selectRadarTypeDetails",
        payload: value,
        callback: res => {
          if (res.data[0]) {
            let data = res.data[0];
            //如果技术体制为连续波
            if (data.technologyName === "15") {
              this.setState({ technologyNameMark: true });
            } else {
              this.setState({ technologyNameMark: false });
            }
            this.props.form.validateFields((err, values) => {
              this.props.dispatch({
                type: "radarModel/updataRadarBasicMsg",
                payload: {
                  ...values,
                  manufacturer: data.manufacturer,
                  freqName: data.freqName,
                  maxWorkFreqHz: data.maxWorkFreqHz,
                  minWorkFreqHz: data.minWorkFreqHz,
                  pwName: data.pwName,
                  maxPwUs: data.maxPwUs,
                  minPwUs: data.minPwUs,
                  priName: data.priName,
                  maxPriUs: data.maxPriUs,
                  minPriUs: data.minPriUs,
                  technologyName: data.technologyName,
                  antiName: data.antiName,
                  maxTransmitPowerW: data.maxTransmitPowerW,
                  maxAntennaGain: data.maxAntennaGain,
                  maxDectectionRangeKm: data.maxDectectionRangeKm,
                  receiverBwHz: data.receiverBwHz,
                  innerKa: data.innerKa,
                  sustemLoss: data.sustemLoss,
                  noiseFigure: data.noiseFigure,
                  minDetectablePowerDBm: data.minDetectablePowerDBm,
                  radarPurpose: data.radarPurpose,
                  radarRemark: data.radarRemark
                }
              });
            });
          }
        }
      });
    }
  };

  //类型切换的弹出框点击确定
  handleOkConfirm = () => {
    this.setState({ visibleConfirm: false, changeTecMark: true });
  };

  render() {
    const Option = Select.Option;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const FormItem = Form.Item;
    const { TextArea } = Input;
    if (this.props.radarModel.ModelMsg && this.props.radarModel.DBFX === true) {
      let basicData = this.state.radarData_basic;
      if (document.getElementById("objectName") && basicData) {
        if (
          basicData.objectName !== this.props.form.getFieldValue("objectName")
        ) {
          document.getElementById("objectName").style.border = "1px solid #f00";
        }
        if (basicData.objectModel !== this.props.form.getFieldValue("model")) {
          document.getElementById("model").firstChild.style.border =
            "1px solid #f00";
        }
        if (
          basicData.countryName !== this.props.form.getFieldValue("countryName")
        ) {
          document.getElementById("countryName").firstChild.style.border =
            "1px solid #f00";
        }
        if (basicData.forName !== this.props.form.getFieldValue("forName")) {
          document.getElementById("forName").firstChild.style.border =
            "1px solid #f00";
        }
        if (
          basicData.threadName !== this.props.form.getFieldValue("threadName")
        ) {
          document.getElementById("threadName").firstChild.style.border =
            "1px solid #f00";
        }
        if (basicData.purpose !== document.getElementById("purpose").value) {
          document.getElementById("purpose").style.border = "1px solid #f00";
        }
        // 部署信息
        if (
          basicData.deployInformation !==
          document.getElementById("deployInformation").value
        ) {
          document.getElementById("deployInformation").style.border =
            "1px solid #f00";
        }
        if (
          basicData.activeAreaDescription !==
          document.getElementById("activeAreaDescription").value
        ) {
          document.getElementById("activeAreaDescription").style.border =
            "1px solid #f00";
        }
        if (
          basicData.manufacturer !==
          document.getElementById("manufacturer").value
        ) {
          document.getElementById("manufacturer").style.border =
            "1px solid #f00";
        }
      }

      if (this.state.radarData_tec) {
        if (
          this.state.radarData_tec.freqName !==
          this.props.form.getFieldValue("freqName")
        ) {
          document.getElementById("freqName").firstChild.style.border =
            "1px solid #f00";
        }
        if (
          this.state.radarData_tec.maxWorkFreqHz !==
          document.getElementById("maxWorkFreqHz").value
        ) {
          document.getElementById("maxWorkFreqHz").style.border =
            "1px solid #f00";
        }
        if (
          this.state.radarData_tec.minWorkFreqHz !==
          document.getElementById("minWorkFreqHz").value
        ) {
          document.getElementById("minWorkFreqHz").style.border =
            "1px solid #f00";
        }
        if (
          this.state.radarData_tec.pwName !==
          this.props.form.getFieldValue("pwName")
        ) {
          document.getElementById("pwName").firstChild.style.border =
            "1px solid #f00";
        }
        if (
          this.state.radarData_tec.maxPwUs !==
          document.getElementById("maxPwUs").value
        ) {
          document.getElementById("maxPwUs").style.border = "1px solid #f00";
        }
        if (
          this.state.radarData_tec.minPwUs !==
          document.getElementById("minPwUs").value
        ) {
          document.getElementById("minPwUs").style.border = "1px solid #f00";
        }
        if (
          this.state.radarData_tec.priName !==
          this.props.form.getFieldValue("priName")
        ) {
          document.getElementById("priName").firstChild.style.border =
            "1px solid #f00";
        }
        if (
          this.state.radarData_tec.maxPriUs !==
          document.getElementById("maxPriUs").value
        ) {
          document.getElementById("maxPriUs").style.border = "1px solid #f00";
        }
        if (
          this.state.radarData_tec.minPriUs !==
          document.getElementById("minPriUs").value
        ) {
          document.getElementById("minPriUs").style.border = "1px solid #f00";
        }
        if (
          this.state.radarData_tec.technologyName !==
          this.props.form.getFieldValue("technologyName")
        ) {
          document.getElementById("technologyName").firstChild.style.border =
            "1px solid #f00";
        }
        if (
          this.state.radarData_tec.antiName !==
          this.props.form.getFieldValue("antiName")
        ) {
          document.getElementById("antiName").firstChild.style.border =
            "1px solid #f00";
        }
        if (
          this.state.radarData_tec.maxTransmitPowerW !==
          document.getElementById("maxTransmitPowerW").value
        ) {
          document.getElementById("maxTransmitPowerW").style.border =
            "1px solid #f00";
        }
        if (
          this.state.radarData_tec.maxAntennaGain !==
          document.getElementById("maxAntennaGain").value
        ) {
          document.getElementById("maxAntennaGain").style.border =
            "1px solid #f00";
        }
        if (
          this.state.radarData_tec.maxDectectionRangeKm !==
          document.getElementById("maxDectectionRangeKm").value
        ) {
          document.getElementById("maxDectectionRangeKm").style.border =
            "1px solid #f00";
        }
        if (
          this.state.radarData_tec.receiverBwHz !==
          document.getElementById("receiverBwHz").value
        ) {
          document.getElementById("receiverBwHz").style.border =
            "1px solid #f00";
        }
        if (
          this.state.radarData_tec.innerKa !==
          document.getElementById("innerKa").value
        ) {
          document.getElementById("innerKa").style.border = "1px solid #f00";
        }
        if (
          this.state.radarData_tec.sustemLoss !==
          document.getElementById("sustemLoss").value
        ) {
          document.getElementById("sustemLoss").style.border = "1px solid #f00";
        }
        if (
          this.state.radarData_tec.noiseFigure !==
          document.getElementById("noiseFigure").value
        ) {
          document.getElementById("noiseFigure").style.border =
            "1px solid #f00";
        }
        if (
          this.state.radarData_tec.minDetectablePowerDBm !==
          document.getElementById("minDetectablePowerDBm").value
        ) {
          document.getElementById("minDetectablePowerDBm").style.border =
            "1px solid #f00";
        }
        if (
          this.state.radarData_tec.radarRemark !==
          document.getElementById("radarRemark").value
        ) {
          document.getElementById("radarRemark").style.border =
            "1px solid #f00";
        }
      }
    } else if (
      this.props.radarModel.ModelMsg &&
      this.props.radarModel.DBFX === false
    ) {
      document.getElementById("objectName").style.border = "1px solid #d9d9d9";
      document.getElementById("model").firstChild.style.border =
        "1px solid #d9d9d9";
      document.getElementById("countryName").firstChild.style.border =
        "1px solid #d9d9d9";
      document.getElementById("forName").firstChild.style.border =
        "1px solid #d9d9d9";
      document.getElementById("threadName").firstChild.style.border =
        "1px solid #d9d9d9";
      document.getElementById("purpose").style.border = "1px solid #d9d9d9";
      document.getElementById("activeAreaDescription").style.border =
        "1px solid #d9d9d9";
      document.getElementById("deployInformation").style.border =
        "1px solid #d9d9d9";
      document.getElementById("manufacturer").style.border =
        "1px solid #d9d9d9";
      document.getElementById("freqName").firstChild.style.border =
        "1px solid #d9d9d9";
      document.getElementById("maxWorkFreqHz").style.border =
        "1px solid #d9d9d9";
      document.getElementById("minWorkFreqHz").style.border =
        "1px solid #d9d9d9";
      document.getElementById("pwName").firstChild.style.border =
        "1px solid #d9d9d9";
      document.getElementById("maxPwUs").style.border = "1px solid #d9d9d9";
      document.getElementById("minPwUs").style.border = "1px solid #d9d9d9";
      document.getElementById("priName").firstChild.style.border =
        "1px solid #d9d9d9";
      document.getElementById("maxPriUs").style.border = "1px solid #d9d9d9";
      document.getElementById("minPriUs").style.border = "1px solid #d9d9d9";
      document.getElementById("technologyName").firstChild.style.border =
        "1px solid #d9d9d9";
      document.getElementById("antiName").firstChild.style.border =
        "1px solid #d9d9d9";
      document.getElementById("maxTransmitPowerW").style.border =
        "1px solid #d9d9d9";
      document.getElementById("maxAntennaGain").style.border =
        "1px solid #d9d9d9";
      document.getElementById("maxDectectionRangeKm").style.border =
        "1px solid #d9d9d9";
      document.getElementById("receiverBwHz").style.border =
        "1px solid #d9d9d9";
      document.getElementById("innerKa").style.border = "1px solid #d9d9d9";
      document.getElementById("sustemLoss").style.border = "1px solid #d9d9d9";
      document.getElementById("noiseFigure").style.border = "1px solid #d9d9d9";
      document.getElementById("minDetectablePowerDBm").style.border =
        "1px solid #d9d9d9";
      document.getElementById("radarRemark").style.border = "1px solid #d9d9d9";
    }
    return (
      <div className={style.leftModelBox}>
        {/* 默认显示大的 */}
        <div className={style.clearFloat}>
          {this.state.modelMark === "first" ||
            this.state.modelMark === "third" ? (
            <div
              className={
                this.state.bigContent ? style.FirstBox : style.FirstBoxMin
              }
              style={
                this.state.bigContent
                  ? {}
                  : {
                    width: 950
                  }
              }
            >
              <div className={style.FodderRadar}>
                {/* 创建整编对象 */}
                <span
                  style={{
                    display:
                      this.props.radarModel.sn == "1" ? "none" : "inline-block"
                  }}
                >
                  {language[`CreateAnIntegrationObject_${this.props.language.getlanguages}`]}
                </span>
                {/* 从目标导入的内容 */}
                <span
                  style={{
                    display:
                      this.props.radarModel.sn == "1" ? "inline-block" : "none"
                  }}
                >
                  {language[`ImportReorganizationyContent_${this.props.language.getlanguages}`]}
                </span>
                <img
                  className={style.closeBtn}
                  src={require("./images/close.png")}
                  alt="img"
                  onClick={this.handleClickClose}
                  style={{
                    width: 20,
                    height: 20,
                    float: "right",
                    marginTop: "5px",
                    marginRight: "30px",
                    cursor: "pointer"
                  }}
                />
              </div>
              <Form
                className={styleless.myBandForm}
                onSubmit={this.handleSubmit}
              >
                {/* 基本信息 */}
                <div className={style.ContentBasic}>
                  <div className={style.subhead}>
                    <div style={{ marginLeft: "10px" }}>
                      {language[`basicInformation_${this.props.language.getlanguages}`]}
                    </div>
                  </div>
                  <div className={style.Basic_Content_Wrap}>
                    {/* 从目标库导入的内容 */}
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
                      {language[`ObjectName_${this.props.language.getlanguages}`]}
                    </div>
                    <div>
                      <FormItem>
                        {getFieldDecorator("objectName", {
                          rules: [{ required: true, whitespace: true }],
                          getValueFromEvent: event => {
                            return event.target.value
                              // .replace(/\s+/g, "")
                              .slice(0, 80);
                          }
                        })(
                          <Input
                            className={styleless.input}
                            type="text"
                            id="objectName"
                            disabled={
                              this.props.radarModel.sn == "1" ? true : false
                            }
                            autoComplete="off"
                            onBlur={this.selectRepeate}
                          />
                        )}
                      </FormItem>
                    </div>
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
                      {language[`radarType_${this.props.language.getlanguages}`]}
                    </div>
                    <div>
                      <FormItem>
                        {getFieldDecorator("model", {
                          initialValue: "-1"
                        })(
                          <Select
                            onChange={this.selectTypeDetails}
                            onBlur={this.saveFormMsg}
                            getPopupContainer={triggerNode =>
                              triggerNode.parentNode
                            } //将下拉列表的样式相对定位与父元素而不是body
                          >
                            <Option value="-1">--{" "}
                              {language[`DropdownSelection_${this.props.language.getlanguages}`]}
                              --
                            </Option>
                            {this.state.radarAllType
                              ? this.state.radarAllType.map(it => (
                                <Option key={it} value={it}>
                                  {it}
                                </Option>
                              ))
                              : ""}
                          </Select>
                        )}
                      </FormItem>
                    </div>

                    <div>
                      {language[`countriesAndRegions_${this.props.language.getlanguages}`]}
                    </div>
                    <div>
                      <FormItem>
                        {getFieldDecorator("countryName", {
                          initialValue: "004"
                        })(
                          <Select
                            id="countryName"
                            onBlur={this.saveFormMsg}
                            getPopupContainer={triggerNode =>
                              triggerNode.parentNode
                            } //将下拉列表的样式相对定位与父元素而不是body
                          >
                            {language.countryName.map((v, k) => (
                              <Option value={v.value} key={v.value}>
                                {v[`name_${this.props.language.getlanguages}`]}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                      <Input style={{ display: "none" }} autoComplete="off" />
                    </div>
                    <div>
                      {language[`FriendOrFoeProperties_${this.props.language.getlanguages}`]}
                    </div>
                    <div>
                      <FormItem>
                        {getFieldDecorator("forName", {
                          initialValue: "01"
                        })(
                          <Select
                            id="forName"
                            onBlur={this.saveFormMsg}
                            getPopupContainer={triggerNode =>
                              triggerNode.parentNode
                            } //将下拉列表的样式相对定位与父元素而不是body
                          >
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
                      <Input id="countryName" />
                    </div>
                    {/* 威胁等级 */}
                    <div>
                      {language[`threatLevel_${this.props.language.getlanguages}`]}
                    </div>
                    <div>
                      <FormItem>
                        {getFieldDecorator("threadName", {
                          initialValue: "0"
                        })(
                          <Select
                            id="threadName"
                            onBlur={this.saveFormMsg}
                            getPopupContainer={triggerNode =>
                              triggerNode.parentNode
                            } //将下拉列表的样式相对定位与父元素而不是body
                          >
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
                        )}
                      </FormItem>
                    </div>
                    <div>
                      {language[`purpose_${this.props.language.getlanguages}`]}
                    </div>
                    <div>
                      <FormItem>
                        {getFieldDecorator("purpose", {
                          rules: [{}],
                          getValueFromEvent: event => {
                            return event.target.value.slice(0, 255);
                          }
                        })(
                          <Input
                            className={styleless.input}
                            type="text"
                            id="purpose"
                            autoComplete="off"
                            onBlur={this.saveFormMsg}
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* 部署信息 */}
                    <div>
                      {language[`DeploymentInformation_${this.props.language.getlanguages}`]}
                    </div>
                    <div>
                      <FormItem>
                        {getFieldDecorator("deployInformation", {
                          rules: [{}],
                          getValueFromEvent: event => {
                            return event.target.value.slice(0, 255);
                          }
                        })(
                          <Input
                            className={styleless.input}
                            type="text"
                            id="deployInformation"
                            autoComplete="off"
                            onBlur={this.saveFormMsg}
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* 活动区域描述 */}
                    <div>
                      {language[`ActiveAreaDescription_${this.props.language.getlanguages}`]}
                    </div>
                    <div>
                      <FormItem>
                        {getFieldDecorator("activeAreaDescription", {
                          rules: [{}],
                          getValueFromEvent: event => {
                            return event.target.value.slice(0, 255);
                          }
                        })(
                          <Input
                            className={styleless.input}
                            type="text"
                            id="activeAreaDescription"
                            autoComplete="off"
                            onBlur={this.saveFormMsg}
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* 生产商 */}
                    <div>
                      {language[`producer_${this.props.language.getlanguages}`]}
                    </div>
                    <div>
                      <FormItem>
                        {getFieldDecorator("manufacturer", {
                          rules: [{}]
                        })(
                          <Input
                            className={styleless.input}
                            type="text"
                            id="manufacturer"
                            autoComplete="off"
                            onBlur={this.saveFormMsg}
                            disabled
                          />
                        )}
                      </FormItem>
                    </div>
                    {this.state.bigContent ? "" : <></>}
                  </div>
                </div>
                {/* 战技术参数 */}
                <div className={styleless.onlyLookBox}>
                  <div className={style.ContentBattle}>
                    <div className={style.subhead}>
                      <div style={{ marginLeft: "10px" }}>
                        {language[`TechnicalParameters_${this.props.language.getlanguages}`]}
                      </div>
                    </div>
                    <div
                      className={style.Basic_Content_Wrap}
                      style={{ background: "#ffff" }}
                    >
                      <div>
                        {language[`RadioType_${this.props.language.getlanguages}`]}
                      </div>
                      <div>
                        <FormItem>
                          {getFieldDecorator("freqName", {
                            initialValue: "00"
                          })(
                            <Select
                              id="freqName"
                              onBlur={this.saveFormMsg}
                              disabled
                            >
                              {language.RadiofrequencyType.map((v, k) => (
                                <Option value={v.value} key={v.value}>
                                  {
                                    v[`name_${this.props.language.getlanguages}`]
                                  }
                                </Option>
                              ))}
                            </Select>
                          )}
                        </FormItem>
                      </div>
                      <div>
                        {language[`UpperOperatingFrequency_${this.props.language.getlanguages}`]}
                        [MHz]
                      </div>
                      <div>
                        <FormItem>
                          {getFieldDecorator("maxWorkFreqHz", {
                            rules: [{}]
                          })(
                            <Input
                              className={styleless.input}
                              type="text"
                              id="maxWorkFreqHz"
                              onBlur={this.saveFormMsg}
                              autoComplete="off"
                              disabled
                            />
                          )}
                        </FormItem>
                      </div>
                      <div>
                        {language[`LowerOperatingFrequency_${this.props.language.getlanguages}`]}
                        [MHz]
                      </div>
                      <div>
                        <FormItem>
                          {getFieldDecorator("minWorkFreqHz", {
                            rules: [{}]
                          })(
                            <Input
                              className={styleless.input}
                              type="text"
                              id="minWorkFreqHz"
                              onBlur={this.saveFormMsg}
                              autoComplete="off"
                              disabled
                            />
                          )}
                        </FormItem>
                      </div>
                      <div>
                        {language[`PulseWidthType_${this.props.language.getlanguages}`]}
                      </div>
                      <div>
                        <FormItem>
                          {getFieldDecorator("pwName", {
                            initialValue: "00"
                          })(
                            <Select
                              id="pwName"
                              onBlur={this.saveFormMsg}
                              disabled
                            >
                              {language.PulseWidthType.map((v, k) => (
                                <Option value={v.value} key={v.value}>
                                  {v[`name_${this.props.language.getlanguages}`]}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </FormItem>
                      </div>
                      <div>
                        {language[`UpperPulseWidthLimit_${this.props.language.getlanguages}`]}
                        [μs]
                      </div>
                      <div>
                        <FormItem>
                          {getFieldDecorator("maxPwUs", {
                            rules: [{}]
                          })(
                            <Input
                              className={styleless.input}
                              type="text"
                              id="maxPwUs"
                              onBlur={this.saveFormMsg}
                              autoComplete="off"
                              disabled
                            />
                          )}
                        </FormItem>
                      </div>
                      <div>
                        {language[`LowerPulseWidthLimit_${this.props.language.getlanguages}`]}
                        [μs]
                      </div>
                      <div>
                        <FormItem>
                          {getFieldDecorator("minPwUs", {
                            rules: [{}]
                          })(
                            <Input
                              className={styleless.input}
                              type="text"
                              id="minPwUs"
                              onBlur={this.saveFormMsg}
                              autoComplete="off"
                              disabled
                            />
                          )}
                        </FormItem>
                      </div>
                      <div>
                        {language[`RepetitionIntervalType_${this.props.language.getlanguages}`]}
                      </div>
                      <div>
                        <FormItem>
                          {getFieldDecorator("priName", {
                            initialValue: "00"
                          })(
                            <Select
                              id="priName"
                              onBlur={this.saveFormMsg}
                              disabled
                            >
                              {language.RepetitiveIntervalType.map((v, k) => (
                                <Option value={v.value} key={v.value}>
                                  {v[`name_${this.props.language.getlanguages}`]}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </FormItem>
                      </div>
                      <div>
                        {language[`UpperLimitInterval_${this.props.language.getlanguages}`]}
                        [μs]
                      </div>
                      <div>
                        <FormItem>
                          {getFieldDecorator("maxPriUs", {
                            rules: [{}]
                          })(
                            <Input
                              className={styleless.input}
                              type="text"
                              id="maxPriUs"
                              onBlur={this.saveFormMsg}
                              autoComplete="off"
                              disabled
                            />
                          )}
                        </FormItem>
                      </div>
                      <div>
                        {language[`LowerLimitInterval_${this.props.language.getlanguages}`]}
                        [μs]
                      </div>
                      <div>
                        <FormItem>
                          {getFieldDecorator("minPriUs", {
                            rules: [{}]
                          })(
                            <Input
                              className={styleless.input}
                              type="text"
                              id="minPriUs"
                              onBlur={this.saveFormMsg}
                              autoComplete="off"
                              disabled
                            />
                          )}
                        </FormItem>
                      </div>
                      <div>
                        {language[`technicalSystem_${this.props.language.getlanguages}`]}
                      </div>
                      <div>
                        <FormItem>
                          {getFieldDecorator("technologyName", {
                            initialValue: "00"
                          })(
                            <Select
                              id="technologyName"
                              onBlur={this.saveFormMsg}
                              disabled
                            >
                              {language.technologyName.map((v, k) => (
                                <Option value={v.value} key={v.value}>
                                  {v[`name_${this.props.language.getlanguages}`]}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </FormItem>
                      </div>
                      {/* 抗干扰方式 */}
                      <div>
                        {language[`AntiInterferenceMode_${this.props.language.getlanguages}`]}
                      </div>
                      <div>
                        <FormItem>
                          {getFieldDecorator("antiName", {
                            initialValue: "00"
                          })(
                            <Select
                              id="antiName"
                              onBlur={this.saveFormMsg}
                              disabled
                            >
                              {language.AntiInterferenceMode.map((v, k) => (
                                <Option value={v.value} key={v.value}>
                                  {v[`name_${this.props.language.getlanguages}`]}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </FormItem>
                      </div>
                      <div>
                        {language[`MSTXPWR_${this.props.language.getlanguages}`]}
                        [W]
                      </div>
                      <div>
                        <FormItem>
                          {getFieldDecorator("maxTransmitPowerW", {
                            rules: [{}]
                          })(
                            <Input
                              className={styleless.input}
                              type="text"
                              id="maxTransmitPowerW"
                              onBlur={this.saveFormMsg}
                              autoComplete="off"
                              disabled
                            />
                          )}
                        </FormItem>
                      </div>
                      <div>
                        {language[`MaximumAntennaGain_${this.props.language.getlanguages}`]}
                        [km]
                      </div>
                      <div>
                        <FormItem>
                          {getFieldDecorator("maxAntennaGain", {
                            rules: [{}]
                          })(
                            <Input
                              className={styleless.input}
                              type="text"
                              id="maxAntennaGain"
                              onBlur={this.saveFormMsg}
                              autoComplete="off"
                              disabled
                            />
                          )}
                        </FormItem>
                      </div>
                      <div>
                        {language[`MaximumOperatingDistance_${this.props.language.getlanguages}`]}
                        [km]
                      </div>
                      <div>
                        <FormItem>
                          {getFieldDecorator("maxDectectionRangeKm", {
                            rules: [{}]
                          })(
                            <Input
                              className={styleless.input}
                              type="text"
                              id="maxDectectionRangeKm"
                              onBlur={this.saveFormMsg}
                              autoComplete="off"
                              disabled
                            />
                          )}
                        </FormItem>
                      </div>
                      <div>
                        {language[`ReceiverBandwidth_${this.props.language.getlanguages}`]}
                        [MHz]
                      </div>
                      <div>
                        <FormItem>
                          {getFieldDecorator("receiverBwHz", {
                            rules: [{}]
                          })(
                            <Input
                              className={styleless.input}
                              type="text"
                              id="receiverBwHz"
                              onBlur={this.saveFormMsg}
                              autoComplete="off"
                              disabled
                            />
                          )}
                        </FormItem>
                      </div>
                      <div>
                        {language[`CompressionCoefficient_${this.props.language.getlanguages}`]}
                      </div>
                      <div>
                        <FormItem>
                          {getFieldDecorator("innerKa", {
                            rules: [{}]
                          })(
                            <Input
                              className={styleless.input}
                              type="text"
                              id="innerKa"
                              onBlur={this.saveFormMsg}
                              autoComplete="off"
                              disabled
                            />
                          )}
                        </FormItem>
                      </div>
                      <div>
                        {language[`systemLoss_${this.props.language.getlanguages}`]}
                      </div>
                      <div>
                        <FormItem>
                          {getFieldDecorator("sustemLoss", {
                            rules: [{}]
                          })(
                            <Input
                              className={styleless.input}
                              type="text"
                              id="sustemLoss"
                              onBlur={this.saveFormMsg}
                              autoComplete="off"
                              disabled
                            />
                          )}
                        </FormItem>
                      </div>
                      <div>
                        {language[`noiseFactor_${this.props.language.getlanguages}`]}
                      </div>
                      <div>
                        <FormItem>
                          {getFieldDecorator("noiseFigure", {
                            rules: [{}]
                          })(
                            <Input
                              className={styleless.input}
                              type="text"
                              id="noiseFigure"
                              onBlur={this.saveFormMsg}
                              autoComplete="off"
                              disabled
                            />
                          )}
                        </FormItem>
                      </div>
                      <div>
                        {language[`sensitivity_${this.props.language.getlanguages}`]}
                        [dBm]
                      </div>
                      <div>
                        <FormItem>
                          {getFieldDecorator("minDetectablePowerDBm", {
                            rules: [{}]
                          })(
                            <Input
                              className={styleless.input}
                              type="text"
                              id="minDetectablePowerDBm"
                              onBlur={this.saveFormMsg}
                              autoComplete="off"
                              disabled
                            />
                          )}
                        </FormItem>
                      </div>
                      {this.state.bigContent ? (
                        <>
                          <div style={{ background: "#fff" }} />
                          <div />
                          <div style={{ background: "#fff" }} />
                          <div />
                        </>
                      ) : (
                        <>
                          <div style={{ background: "#fff" }} />
                          <div />
                        </>
                      )}
                      <div className={style.Textarea_title}>
                        {language[`remark_${this.props.language.getlanguages}`]}
                      </div>
                      <div className={style.Textarea_Content}>
                        {/* <FormItem  {...formItemLayout}> */}
                        <FormItem>
                          {getFieldDecorator("radarRemark", {
                            rules: [{}]
                          })(
                            <TextArea
                              className={style.tableColTextCon}
                              style={{
                                height: "72px",
                                overflowY: "scroll",
                                resize: "none"
                              }}
                              id="radarRemark"
                              onBlur={this.saveFormMsg}
                              disabled
                            />
                          )}
                        </FormItem>
                      </div>
                    </div>
                  </div>
                </div>
                {this.state.visibleConfirm ? (
                  <DialogConfirmMask
                    TitleText="切换该雷达目标型号会导致工作模式不可用，是否确认切换？"
                    showDialog={this.state.visibleConfirm}
                    onOk={this.handleOkConfirm}
                    okText="切换该雷达目标型号会导致工作模式不可用，是否确认切换？"
                    cancelText={
                      language[`quit_${this.props.language.getlanguages}`]
                    }
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
                          {language[`SwitchingRadarTargetModelWillResultInUnavailableWorkingMode_${this.props.language.getlanguages}`]}
                        </div>
                      </div>
                    }
                  />
                ) : null}
              </Form>
              {/* 工作模式 */}
              <div className={style.ContentParams}>
                <AddTable
                  name={this.state.bigContent ? "big" : "small"}
                  {...this.state}
                  stateInput={this.state.ZBStart}
                  data={this.props.radarModel.targetDetailMsg}
                  WorkModelMsg_MBMark={
                    this.props.radarModel.WorkModelMsg_MBMark
                  }
                  handleSubmit={this.handleSubmit}
                />
              </div>
              {/* 辐射源信号参数  */}
              <div className={style.ContentXHParams}>
                <div className={style.subheadJSON}>
                  <div style={{ margin: "5px 10px", float: "left" }}>
                    {language[`EmitterSignalParameters_${this.props.language.getlanguages
                      }`
                    ]
                    }
                  </div>
                </div>
                <TabDemo />
              </div>
              {/* 相关资料 */}
              <div className={style.ContentBasic}>
                <div className={style.subhead} style={{ marginBottom: "20px" }}>
                  <div style={{ margin: "5px 10px" }}>
                    {language[`relatedData_${this.props.language.getlanguages}`]}
                  </div>
                </div>
                <Radar_relateMsg
                  name={this.state.bigContent ? "bigPart" : "smallPart"}
                  data={this.state.targetDetailMsg}
                  radarName={this.state.radarName}
                />
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

Radar_EditTargetModel = Form.create({
  mapPropsToFields(props) {
    if (props.data != null && props.data[0]) {
      //点击情报整编表格的编辑 数据
      let basicData = props.data[0];
      return {
        // 基本信息
        objectName: Form.createFormField({
          ...props,
          value: basicData.objectName
        }),
        model: Form.createFormField({
          ...props,
          value: basicData.model ? basicData.model : "-1"
        }),
        countryName: Form.createFormField({
          ...props,
          value: basicData.countryName
        }),
        forName: Form.createFormField({
          ...props,
          value: basicData.forName
        }),
        threadName: Form.createFormField({
          ...props,
          value: basicData.threadName
        }),
        purpose: Form.createFormField({
          ...props,
          value: basicData.purpose
        }),
        deployInformation: Form.createFormField({
          ...props,
          value: basicData.deployInformation
        }),
        activeAreaDescription: Form.createFormField({
          ...props,
          value: basicData.activeAreaDescription
        }),
        manufacturer: Form.createFormField({
          ...props,
          value: basicData.manufacturer
        }),
        // 战技术参数
        freqName: Form.createFormField({
          ...props,
          value: basicData.freqName
        }),
        maxWorkFreqHz: Form.createFormField({
          ...props,
          value: basicData.maxWorkFreqHz
        }),
        minWorkFreqHz: Form.createFormField({
          ...props,
          value: basicData.minWorkFreqHz
        }),
        pwName: Form.createFormField({
          ...props,
          value: basicData.pwName
        }),
        maxPwUs: Form.createFormField({
          ...props,
          value: basicData.maxPwUs
        }),
        minPwUs: Form.createFormField({
          ...props,
          value: basicData.minPwUs
        }),
        priName: Form.createFormField({
          ...props,
          value: basicData.priName
        }),
        maxPriUs: Form.createFormField({
          ...props,
          value: basicData.maxPriUs
        }),
        minPriUs: Form.createFormField({
          ...props,
          value: basicData.minPriUs
        }),
        technologyName: Form.createFormField({
          ...props,
          value: basicData.technologyName
        }),
        antiName: Form.createFormField({
          ...props,
          value: basicData.antiName
        }),
        maxTransmitPowerW: Form.createFormField({
          ...props,
          value: basicData.maxTransmitPowerW
        }),
        maxAntennaGain: Form.createFormField({
          ...props,
          value: basicData.maxAntennaGain
        }),
        maxDectectionRangeKm: Form.createFormField({
          ...props,
          value: basicData.maxDectectionRangeKm
        }),
        receiverBwHz: Form.createFormField({
          ...props,
          value: basicData.receiverBwHz
        }),
        innerKa: Form.createFormField({
          ...props,
          value: basicData.innerKa
        }),
        sustemLoss: Form.createFormField({
          ...props,
          value: basicData.sustemLoss
        }),
        noiseFigure: Form.createFormField({
          ...props,
          value: basicData.noiseFigure
        }),
        minDetectablePowerDBm: Form.createFormField({
          ...props,
          value: basicData.minDetectablePowerDBm
        }),
        radarPurpose: Form.createFormField({
          ...props,
          value: basicData.radarPurpose
        }),
        radarRemark: Form.createFormField({
          ...props,
          value: basicData.radarRemark
        })
      };
    }
  }
})(Radar_EditTargetModel);

export default Radar_EditTargetModel;
