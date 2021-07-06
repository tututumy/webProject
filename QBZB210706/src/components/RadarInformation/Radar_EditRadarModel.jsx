/*
 * @Author: mikey.zhaopeng 
 * @Date: yyyy-08-Fr 09:57:15 
 * @Last Modified by:   mikey.zhaopeng 
 * @Last Modified time: yyyy-08-Fr 09:57:15 
 */


import React, { Component } from "react";
import style from "./Edit.css";
import styleless from "./test.less";
import "../../../src/index.less";
import { Select, Table, Input, Form } from "antd";
import AddTableRadar from "./Radar_QBWorkModel";
import { connect } from "dva";
import language from "../language/language";

@connect(({ changeComp, language, radarModel }) => ({
  changeComp,
  language,
  radarModel
}))
//从侦察情报库导入的内容页面
class SecondModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      targetvisible: false,
      infovisible: false,
      bigContent: true,
      radarAllType: null
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

  componentWillMount() {
    if (this.props.name === "aaa") {
      this.setState({ bigContent: false });
    }
  }

  UNSAFE_componentWillReceiveProps(nextprops) {
    //点击了自动分析并且从目标库和侦察情报库导入了内容
    if (nextprops.radarModel) {
      this.setState({ radarData: nextprops.radarModel.ModelMsg });
    }
  }

  targetShowModal = () => {
    this.setState({
      targetvisible: true
    });
  };

  infoShowModal = () => {
    this.setState({
      infovisible: true
    });
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
      targetvisible: false,
      infovisible: false
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
      targetvisible: false,
      infovisible: false
    });
  };

  //点击切换到目标情报库大模块
  handleClickClose = () => {
    let { dispatch } = this.props;
    dispatch({
      type: "changeComp/ClickCloseR",
      payload: {
        mark: "first"
      }
    });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const FormItem = Form.Item;
    const { TextArea } = Input;
    const Option = Select.Option;
    const paginationProps = {
      pageSize: 10
    };
    const columnsFS = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        //工作模式内码
        title: language[`WorkingModeInternalCode_${this.props.language.getlanguages}`],
        dataIndex: "modeId"
      },
      {
        //数据文件名称
        title: language[`DataFileName_${this.props.language.getlanguages}`],
        dataIndex: "fileName"
      }
    ];

    let FSData = [];
    if (this.props.radarModel.ModelMsg && this.props.radarModel.ModelMsg[7]) {
      let data = this.props.radarModel.ModelMsg[7];
      for (let i = 0; i < data.length; i++) {
        FSData.push({
          key: i + 1,
          modeId: data[i].modeId,
          fileName: data[i].fileName
        });
      }
    }
    //radarData 获取的雷达信息  this.props.targetFormMsg  目标库传过来的信息
    if (
      this.props.radarModel.targetDetailMsg &&
      this.props.radarModel.DBFX === true
    ) {
      let targetData = this.props.radarModel.targetDetailMsg[0];
      if (this.state.radarData[0][0]) {
        let radarData = this.state.radarData[0][0];
        if (radarData.objectName !== targetData.objectName) {
          document.getElementById("objectName_radar").style.border =
            "1px solid #f00";
        }
        if (radarData.objectModel !== targetData.model) {
          document.getElementById("objectModel_radar").style.border =
            "1px solid #f00";
        }
        if (radarData.appearTime !== targetData.appearTime) {
          document.getElementById("appearTime_radar").style.border =
            "1px solid #f00";
        }
        if (radarData.disAppearTime !== targetData.disAppearTime) {
          document.getElementById("disAppearTime_radar").style.border =
            "1px solid #f00";
        }
        if (radarData.countryName !== targetData.countryName) {
          document.getElementById("countryName_radar").firstChild.style.border =
            "1px solid #f00";
        }
        if (radarData.forName !== targetData.forName) {
          document.getElementById("forName_radar").firstChild.style.border =
            "1px solid #f00";
        }
        if (radarData.threadName !== targetData.threadName) {
          document.getElementById("threadName_radar").firstChild.style.border =
            "1px solid #f00";
        }
        if (radarData.purpose !== targetData.purpose) {
          document.getElementById("purpose_radar").style.border =
            "1px solid #f00";
        }
        if (radarData.maxWorkFreqHz !== targetData.maxWorkFreqHz) {
          document.getElementById("maxWorkFreqHz_radar").style.border =
            "1px solid #f00";
        }
        if (radarData.minWorkFreqHz !== targetData.minWorkFreqHz) {
          document.getElementById("minWorkFreqHz_radar").style.border =
            "1px solid #f00";
        }
      }
      if (this.state.radarData[1][0]) {
        let radarData_tec = this.state.radarData[1][0];
        if (radarData_tec.freqName !== targetData.freqName) {
          document.getElementById("freqName_radar").firstChild.style.border =
            "1px solid #f00";
        }
        if (radarData_tec.maxWorkFreqHz !== targetData.maxWorkFreqHz) {
          document.getElementById("maxWorkFreqHz_T_radar").style.border =
            "1px solid #f00";
        }
        if (radarData_tec.minWorkFreqHz !== targetData.minWorkFreqHz) {
          document.getElementById("minWorkFreqHz_T_radar").style.border =
            "1px solid #f00";
        }
        if (radarData_tec.pwName !== targetData.pwName) {
          document.getElementById("pwName_radar").firstChild.style.border =
            "1px solid #f00";
        }
        if (radarData_tec.maxPwUs !== targetData.maxPwUs) {
          document.getElementById("maxPwUs_radar").style.border =
            "1px solid #f00";
        }
        if (radarData_tec.minPwUs !== targetData.minPwUs) {
          document.getElementById("minPwUs_radar").style.border =
            "1px solid #f00";
        }
        if (radarData_tec.priName !== targetData.priName) {
          document.getElementById("priName_radar").firstChild.style.border =
            "1px solid #f00";
        }
        if (radarData_tec.maxPriUs !== targetData.maxPriUs) {
          document.getElementById("maxPriUs_radar").style.border =
            "1px solid #f00";
        }
        if (radarData_tec.minPriUs !== targetData.minPriUs) {
          document.getElementById("minPriUs_radar").style.border =
            "1px solid #f00";
        }
        if (radarData_tec.technologyName !== targetData.technologyName) {
          document.getElementById(
            "technologyName_radar"
          ).firstChild.style.border = "1px solid #f00";
        }
        if (radarData_tec.antiName !== targetData.antiName) {
          document.getElementById("antiName_radar").firstChild.style.border =
            "1px solid #f00";
        }
        if (radarData_tec.maxTransmitPowerW !== targetData.maxTransmitPowerW) {
          document.getElementById("maxTransmitPowerW_radar").style.border =
            "1px solid #f00";
        }
        if (radarData_tec.maxAntennaGain !== targetData.maxAntennaGain) {
          document.getElementById("maxAntennaGain_radar").style.border =
            "1px solid #f00";
        }
        if (
          radarData_tec.maxDectectionRangeKm !== targetData.maxDectectionRangeKm
        ) {
          document.getElementById("maxDectectionRangeKm_radar").style.border =
            "1px solid #f00";
        }
        if (radarData_tec.receiverBwHz !== targetData.receiverBwHz) {
          document.getElementById("receiverBwHz_radar").style.border =
            "1px solid #f00";
        }
        if (radarData_tec.innerKa !== targetData.innerKa) {
          document.getElementById("innerKa_radar").style.border =
            "1px solid #f00";
        }
        if (radarData_tec.sustemLoss !== targetData.sustemLoss) {
          document.getElementById("sustemLoss_radar").style.border =
            "1px solid #f00";
        }
        if (radarData_tec.noiseFigure !== targetData.noiseFigure) {
          document.getElementById("noiseFigure_radar").style.border =
            "1px solid #f00";
        }
        if (
          radarData_tec.minDetectablePowerDBm !==
          targetData.minDetectablePowerDBm
        ) {
          document.getElementById("minDetectablePowerDBm_radar").style.border =
            "1px solid #f00";
        }
        if (radarData_tec.radarRemark !== targetData.radarRemark) {
          document.getElementById("radarRemark_radar").style.border =
            "1px solid #f00";
        }
      }
    } else if (
      this.props.radarModel.ModelMsg &&
      this.props.radarModel.DBFX === false
    ) {
      document.getElementById("objectName_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("objectModel_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("appearTime_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("disAppearTime_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("countryName_radar").firstChild.style.border =
        "1px solid #d9d9d9";
      document.getElementById("forName_radar").firstChild.style.border =
        "1px solid #d9d9d9";
      document.getElementById("threadName_radar").firstChild.style.border =
        "1px solid #d9d9d9";
      document.getElementById("purpose_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("maxWorkFreqHz_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("minWorkFreqHz_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("maxWorkFreqHz_T_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("minWorkFreqHz_T_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("freqName_radar").firstChild.style.border =
        "1px solid #d9d9d9";
      document.getElementById("pwName_radar").firstChild.style.border =
        "1px solid #d9d9d9";
      document.getElementById("maxPwUs_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("minPwUs_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("priName_radar").firstChild.style.border =
        "1px solid #d9d9d9";
      document.getElementById("maxPriUs_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("minPriUs_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("technologyName_radar").firstChild.style.border =
        "1px solid #d9d9d9";
      document.getElementById("antiName_radar").firstChild.style.border =
        "1px solid #d9d9d9";
      document.getElementById("maxTransmitPowerW_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("maxAntennaGain_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("maxDectectionRangeKm_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("receiverBwHz_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("innerKa_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("sustemLoss_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("noiseFigure_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("minDetectablePowerDBm_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("radarRemark_radar").style.border =
        "1px solid #d9d9d9";
    }

    return (
      <div
        className={this.props.bigContent ? style.FirstBox : style.FirstBoxMin}
        style={
          this.props.bigContent ? null : { width: "951px", overflowX: "hidden" }
        }
      >
        <div className={style.FodderRadar}>
          {/* 从侦察情报库导入的内容 */}
          <span>
            {language[`ConImportedFromRadarLib_${this.props.language.getlanguages}`]}
          </span>
          <img
            src={require("./images/close.png")}
            className={style.closeBtn}
            onClick={this.handleClickClose}
            style={{
              width: 20,
              height: 20,
              marginTop: "5px",
              float: "right",
              marginRight: "30px",
              cursor: "pointer"
            }}
          />
        </div>
        {/* 基本信息 */}
        <Form className={styleless.myBandForm}>
          <div className={style.ContentBasic}>
            <div className={style.subhead}>
              <div style={{ marginLeft: "10px" }}>
                {language[`basicInformation_${this.props.language.getlanguages}`]}
              </div>
            </div>
            <div className={style.Basic_Content_Wrap}>
              <div>
                {language[`NameOfRadiationSource_${this.props.language.getlanguages}`]}
              </div>
              <div>
                {/* 辐射源名称 */}
                <FormItem>
                  {getFieldDecorator("objectName_radar", {
                    rules: [{}]
                  })(
                    <Input
                      className={styleless.input}
                      type="text"
                      id="objectName_radar"
                      disabled
                    />
                  )}
                </FormItem>
              </div>

              <div style={{ display: "none" }}>id</div>
              <div style={{ display: "none" }}>
                {/* 辐射源名称 */}
                <FormItem>
                  {getFieldDecorator("identifyObjectId", {
                    rules: [{}]
                  })(
                    <Input className={styleless.input} type="text" disabled />
                  )}
                </FormItem>
              </div>

              <div>
                {language[`RadiationSourceModel_${this.props.language.getlanguages}`]}
              </div>
              <div>
                {/* 辐射源型号 */}
                <FormItem>
                  {getFieldDecorator("objectModel_radar", {})(
                    <Input className={styleless.input} type="text" disabled />
                  )}
                </FormItem>
              </div>
              {/* 国家地区 */}
              <div>
                {language[`countriesAndRegions_${this.props.language.getlanguages}`]}
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("countryName_radar", {
                    initialValue: "004"
                  })(
                    <Select id="countryName_radar" disabled>
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
                  {getFieldDecorator("forName_radar", {
                    initialValue: "01"
                  })(
                    <Select id="forName_radar" disabled>
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
              {/* 威胁等级 */}
              <div>
                {language[`threatLevel_${this.props.language.getlanguages}`]}
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("threadName_radar", {
                    initialValue: "0"
                  })(
                    <Select id="threadName_radar" disabled>
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
              {/* 用途 */}
              <div>
                {language[`purpose_${this.props.language.getlanguages}`]}
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("purpose_radar", {
                    rules: [{}]
                  })(
                    <Input
                      className={styleless.input}
                      type="text"
                      disabled
                      id="purpose_radar"
                    />
                  )}
                </FormItem>
              </div>
              {/* 出现时间 */}
              <div>
                {language[`TimeOfAppearance_${this.props.language.getlanguages}`]}
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("appearTime_radar", {
                    rules: [{}]
                  })(
                    <Input
                      className={styleless.input}
                      type="text"
                      disabled
                      id="appearTime_radar"
                    />
                  )}
                </FormItem>
              </div>
              {/* 消失时间 */}
              <div>
                {language[`TimeOfMiss_${this.props.language.getlanguages}`]}
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("disAppearTime_radar", {
                    rules: [{}]
                  })(
                    <Input
                      className={styleless.input}
                      type="text"
                      disabled
                      id="disAppearTime_radar"
                    />
                  )}
                </FormItem>
              </div>
              {/* 工作频率上限 */}
              <div>
                {language[`UpperOperatingFrequency_${this.props.language.getlanguages}`]}[MHz]
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("maxWorkFreqHz_radar", {
                    rules: [{}]
                  })(
                    <Input
                      className={styleless.input}
                      type="text"
                      disabled
                      id="maxWorkFreqHz_radar"
                    />
                  )}
                </FormItem>
              </div>
              {/* 工作频率下限 */}
              <div>
                {language[`LowerOperatingFrequency_${this.props.language.getlanguages}`]}[MHz]
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("minWorkFreqHz_radar", {
                    rules: [{}]
                  })(
                    <Input
                      className={styleless.input}
                      type="text"
                      disabled
                      id="minWorkFreqHz_radar"
                    />
                  )}
                </FormItem>
              </div>
            </div>
          </div>

          {/* 战技术参数 */}
          <div className={style.ContentBattle}>
            <div className={style.subhead}>
              <div style={{ marginLeft: "10px" }}>
                {language[`TechnicalParameters_${this.props.language.getlanguages}`]}
              </div>
            </div>
            <div className={style.Basic_Content_Wrap}>
              {/* 射频类型 */}
              <div>
                {language[`RadioType_${this.props.language.getlanguages}`]}
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("freqName_radar", {
                    initialValue: "00"
                  })(
                    <Select id="freqName_radar" disabled>
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
                {language[`UpperOperatingFrequency_${this.props.language.getlanguages}`]}[MHz]
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("maxWorkFreqHz_T_radar", {
                    rules: [{}]
                  })(
                    <Input
                      className={styleless.input}
                      type="text"
                      disabled
                      id="maxWorkFreqHz_T_radar"
                    />
                  )}
                </FormItem>
              </div>
              <div>
                {language[`LowerOperatingFrequency_${this.props.language.getlanguages}`]}[MHz]
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("minWorkFreqHz_T_radar", {
                    rules: [{}]
                  })(
                    <Input
                      className={styleless.input}
                      type="text"
                      disabled
                      id="minWorkFreqHz_T_radar"
                    />
                  )}
                </FormItem>
              </div>
              {/* 脉宽类型 */}
              <div>
                {language[`PulseWidthType_${this.props.language.getlanguages}`]}
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("pwName_radar", {
                    initialValue: "00"
                  })(
                    <Select id="pwName" disabled>
                      {language.PulseWidthType.map((v, k) => (
                        <Option value={v.value} key={v.value}>
                          {v[`name_${this.props.language.getlanguages}`]}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </div>
              {/* 脉宽上限 */}
              <div>
                {language[`UpperPulseWidthLimit_${this.props.language.getlanguages}`]} [μs]
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("maxPwUs_radar", {
                    rules: [{}]
                  })(
                    <Input
                      className={styleless.input}
                      type="text"
                      disabled
                      id="maxPwUs_radar"
                    />
                  )}
                </FormItem>
              </div>
              {/* 脉宽下限 */}
              <div>
                {language[`LowerPulseWidthLimit_${this.props.language.getlanguages}`]}[μs]
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("minPwUs_radar", {
                    rules: [{}]
                  })(
                    <Input
                      className={styleless.input}
                      type="text"
                      disabled
                      id="minPwUs_radar"
                    />
                  )}
                </FormItem>
              </div>
              {/* 重复间隔类型 */}
              <div>
                {language[`RepetitionIntervalType_${this.props.language.getlanguages}`]}
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("priName_radar", {
                    initialValue: "00"
                  })(
                    <Select id="priName_radar" disabled>
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
                {language[`UpperLimitInterval_${this.props.language.getlanguages}`]}[μs]
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("maxPriUs_radar", {
                    rules: [{}]
                  })(
                    <Input
                      className={styleless.input}
                      type="text"
                      disabled
                      id="maxPriUs_radar"
                    />
                  )}
                </FormItem>
              </div>
              {/* 重复间隔下限 */}
              <div>
                {language[`LowerLimitInterval_${this.props.language.getlanguages}`]}[μs]
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("minPriUs_radar", {
                    rules: [{}]
                  })(
                    <Input
                      className={styleless.input}
                      type="text"
                      disabled
                      id="minPriUs_radar"
                    />
                  )}
                </FormItem>
              </div>
              {/* 技术体制 */}
              <div>
                {language[`technicalSystem_${this.props.language.getlanguages}`]}
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("technologyName_radar", {
                    initialValue: "00"
                  })(
                    <Select id="technologyName_radar" disabled>
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
                  {getFieldDecorator("antiName_radar", {
                    initialValue: "00"
                  })(
                    <Select id="antiName_radar" disabled>
                      {language.AntiInterferenceMode.map((v, k) => (
                        <Option value={v.value} key={v.value}>
                          {v[`name_${this.props.language.getlanguages}`]}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </div>
              {/* 最大发射功率 */}
              <div>
                {language[`MSTXPWR_${this.props.language.getlanguages}`]}[W]
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("maxTransmitPowerW_radar", {
                    rules: [{}]
                  })(
                    <Input
                      className={styleless.input}
                      type="text"
                      disabled
                      id="maxTransmitPowerW_radar"
                    />
                  )}
                </FormItem>
              </div>
              {/* 最大天线增益 */}
              <div>
                {language[`MaximumAntennaGain_${this.props.language.getlanguages}`]}[km]
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("maxAntennaGain_radar", {
                    rules: [{}]
                  })(
                    <Input
                      className={styleless.input}
                      type="text"
                      disabled
                      id="maxAntennaGain_radar"
                    />
                  )}
                </FormItem>
              </div>
              {/* 最大作用距离 */}
              <div>
                {language[`MaximumOperatingDistance_${this.props.language.getlanguages}`]}[km]
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("maxDectectionRangeKm_radar", {
                    rules: [{}]
                  })(
                    <Input
                      className={styleless.input}
                      type="text"
                      disabled
                      id="maxDectectionRangeKm_radar"
                    />
                  )}
                </FormItem>
              </div>
              {/* 接收机带宽 */}
              <div>
                {language[`ReceiverBandwidth_${this.props.language.getlanguages}`]}[MHz]
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("receiverBwHz_radar", {
                    rules: [{}]
                  })(
                    <Input
                      className={styleless.input}
                      type="text"
                      disabled
                      id="receiverBwHz_radar"
                    />
                  )}
                </FormItem>
              </div>
              {/* 压制系数 */}
              <div>
                {language[`CompressionCoefficient_${this.props.language.getlanguages}`]}
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("innerKa_radar", {
                    rules: [{}]
                  })(
                    <Input
                      className={styleless.input}
                      type="text"
                      disabled
                      id="innerKa_radar"
                    />
                  )}
                </FormItem>
              </div>
              {/* 系统损耗 */}
              <div>
                {language[`systemLoss_${this.props.language.getlanguages}`]}
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("sustemLoss_radar", {
                    rules: [{}]
                  })(
                    <Input
                      className={styleless.input}
                      type="text"
                      id="sustemLoss_radar"
                      disabled
                    />
                  )}
                </FormItem>
              </div>
              {/* 噪声系数 */}
              <div>
                {language[`noiseFactor_${this.props.language.getlanguages}`]}
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("noiseFigure_radar", {
                    rules: [{}]
                  })(
                    <Input
                      className={styleless.input}
                      type="text"
                      disabled
                      id="noiseFigure_radar"
                    />
                  )}
                </FormItem>
              </div>
              {/* 灵敏度[dBm] */}
              <div>
                {language[`sensitivity_${this.props.language.getlanguages}`]} [dBm]
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("minDetectablePowerDBm_radar", {
                    rules: [{}]
                  })(
                    <Input
                      className={styleless.input}
                      type="text"
                      disabled
                      id="minDetectablePowerDBm_radar"
                    />
                  )}
                </FormItem>
              </div>
              {this.props.bigContent === true ? (
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
                <FormItem>
                  {getFieldDecorator("radarRemark_radar", {
                    rules: [{}]
                  })(
                    <TextArea
                      className={style.tableColTextCon}
                      style={{
                        height: "72px",
                        overflowY: "scroll",
                        resize: "none"
                      }}
                      disabled
                      id="radarRemark_radar"
                    />
                  )}
                </FormItem>
              </div>
            </div>
          </div>
        </Form>
        {/* 工作模式 */}
        <div className={style.ContentParams}>
          <AddTableRadar name={this.props.bigContent ? "big" : "small"} />
        </div>

        {/* 辐射源信号参数 */}
        <div className={style.ContentSignMsg}>
          <div className={style.subhead}>
            <div style={{ marginLeft: "10px" }}>
              {language[`EmitterSignalParameters_${this.props.language.getlanguages}`]}
            </div>
          </div>
          <Table
            rowKey={record => record.id}
            dataSource={FSData}
            columns={columnsFS} //this.state.dataSource即为获取初始化dataSource数组
            className={styleless.myClass}
            rowClassName={(record, index) =>
              index % 2 === 0 ? styleless.odd : styleless.even
            } //奇偶行颜色交替变化
            pagination={paginationProps}
          />
        </div>
      </div>
    );
  }
}

SecondModel = Form.create({
  mapPropsToFields(props) {
    if (props.data != null) {
      let basicData;
      let TenData;
      if (props.data[0]) {
        basicData = props.data[0] && props.data[0][0] ? props.data[0][0] : [];
        TenData = props.data[1] && props.data[1][0] ? props.data[1][0] : [];
        return {
          // 基本信息
          objectName_radar: Form.createFormField({
            ...props,
            value: basicData.objectName
          }),
          identifyObjectId: Form.createFormField({
            ...props,
            value: basicData.objectId
          }),
          objectModel_radar: Form.createFormField({
            ...props,
            value: basicData.objectModel
          }),
          appearTime_radar: Form.createFormField({
            ...props,
            value: basicData.appearTime ? basicData.appearTime.slice(0, 19) : ""
          }),
          disAppearTime_radar: Form.createFormField({
            ...props,
            value: basicData.disAppearTime
              ? basicData.disAppearTime.slice(0, 19)
              : ""
          }),
          countryName_radar: Form.createFormField({
            ...props,
            value: basicData.countryName
          }),
          forName_radar: Form.createFormField({
            ...props,
            value: basicData.forName
          }),
          threadName_radar: Form.createFormField({
            ...props,
            value: basicData.threadName
          }),
          purpose_radar: Form.createFormField({
            ...props,
            value: basicData.purpose
          }),
          maxWorkFreqHz_radar: Form.createFormField({
            ...props,
            value: basicData.maxWorkFreqHz
          }),
          minWorkFreqHz_radar: Form.createFormField({
            ...props,
            value: basicData.minWorkFreqHz
          }),
          // 战技术参数
          freqName_radar: Form.createFormField({
            ...props,
            value: TenData.freqName
          }),
          maxWorkFreqHz_T_radar: Form.createFormField({
            ...props,
            value: TenData.maxWorkFreqHz
          }),
          minWorkFreqHz_T_radar: Form.createFormField({
            ...props,
            value: TenData.minWorkFreqHz
          }),
          pwName_radar: Form.createFormField({
            ...props,
            value: TenData.pwName
          }),
          maxPwUs_radar: Form.createFormField({
            ...props,
            value: TenData.maxPwUs
          }),
          minPwUs_radar: Form.createFormField({
            ...props,
            value: TenData.minPwUs
          }),
          priName_radar: Form.createFormField({
            ...props,
            value: TenData.priName
          }),
          maxPriUs_radar: Form.createFormField({
            ...props,
            value: TenData.maxPriUs
          }),
          minPriUs_radar: Form.createFormField({
            ...props,
            value: TenData.minPriUs
          }),
          technologyName_radar: Form.createFormField({
            ...props,
            value: TenData.technologyName
          }),
          antiName_radar: Form.createFormField({
            ...props,
            value: TenData.antiName
          }),
          maxTransmitPowerW_radar: Form.createFormField({
            ...props,
            value: TenData.maxTransmitPowerW
          }),
          maxAntennaGain_radar: Form.createFormField({
            ...props,
            value: TenData.maxAntennaGain
          }),
          maxDectectionRangeKm_radar: Form.createFormField({
            ...props,
            value: TenData.maxDectectionRangeKm
          }),
          receiverBwHz_radar: Form.createFormField({
            ...props,
            value: TenData.receiverBwHz
          }),
          innerKa_radar: Form.createFormField({
            ...props,
            value: TenData.innerKa
          }),
          sustemLoss_radar: Form.createFormField({
            ...props,
            value: TenData.sustemLoss
          }),
          noiseFigure_radar: Form.createFormField({
            ...props,
            value: TenData.noiseFigure
          }),
          minDetectablePowerDBm_radar: Form.createFormField({
            ...props,
            value: TenData.minDetectablePowerDBm
          }),
          radarPurpose_radar: Form.createFormField({
            ...props,
            value: TenData.radarPurpose
          }),
          radarRemark_radar: Form.createFormField({
            ...props,
            value: TenData.radarRemark
          })
        };
      }
    }
  }
})(SecondModel);

export default SecondModel;
