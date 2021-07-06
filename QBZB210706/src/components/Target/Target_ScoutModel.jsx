import React, { Component } from "react";
import style from "./Edit.css";
import styleless from "./test.less";
import { Table, Select, Input, Form } from "antd";
import { connect } from "dva";
import language from "../language/language";

@connect(({ changeC, language, ElectronicTarget }) => ({
  changeC,
  language,
  ElectronicTarget
}))
class TargetScoutModel extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: language[`radarNumber_${this.props.language.getlanguages}`],
        dataIndex: "name",
        width: "10%",
        editable: true
      },
      {
        title:language[`SubordinatePlatformNumber_${this.props.language.getlanguages}`],
        dataIndex: "age",
        width: "10%",
        editable: true
      },
      {
        title: language[`radarName_${this.props.language.getlanguages}`],
        dataIndex: "address",
        width: "10%",
        editable: true
      },
      {
        title: language[`radarType_${this.props.language.getlanguages}`],
        dataIndex: "address",
        width: "10%",
        editable: true
      },
      {
        title: language[`alias_${this.props.language.getlanguages}`],
        dataIndex: "address",
        width: "10%",
        editable: true
      },
      {
        title: language[`radarName_${this.props.language.getlanguages}`],
        dataIndex: "address",
        width: "10%",
        editable: true
      },
      {
        title: language[`radarName_${this.props.language.getlanguages}`],
        dataIndex: "address",
        width: "10%",
        editable: true
      }
    ];

    this.state = {
      path: {
        pathname: "/Map",
        hash: "#ahash",
        query: { foo: "foo", boo: "boo" },
        state: { data: "99" }
      },
      dataSource: [
        {
          key: "0",
          name: "Edward King 0",
          age: "32",
          address: "London, Park Lane no. 0"
        },
        {
          key: "1",
          name: "Edward King 1",
          age: "32",
          address: "London, Park Lane no. 1"
        }
      ],
      count: 2,
      side: null,
      visbleTarget: false,
      visbleInformation: false,
      visbleAdd: false,
      basicvisible: false,
      choosePage: "first",
      hideOne: "block",
      hideTwo: "none",
      hideThree: "none",
      selectedRowKeysMB: "",
      selectedRowKeys: "",
      basicvisibleLeft: false,
      basicvisibleRight: false,
      showMapVisible: false,
      leftMinTargetVisible: false,
      leftMinCommuVisible: false,
      rightMinTargetVisible: false,
      rightMinCommuVisible: false,
      modelMark: "second",
      bigContent: true,
      targetAllType: null
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

  UNSAFE_componentWillMount() {
    if (this.props.name === "aaa") {
      this.setState({ bigContent: false });
    }
  }

  showAddModal = () => {
    this.setState({
      visbleAdd: true
    });
  };
  handleOkAdd = () => {
    this.setState({
      visbleAdd: false,
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

  //点击切换到目标情报库大模块
  handleClickClose = () => {
    let { dispatch } = this.props;
    dispatch({
      type: "changeC/ClickCloseR",
      payload: {
        mark: "first"
      }
    });
  };

  //不能整编的数据背景变红显示
  showRedBg = (record, index) => {
    let radarOrCommuMsg = null;
    if (this.props.ElectronicTarget.selectRadarisZB_noZBRadarOrCommu) {
      radarOrCommuMsg = this.props.ElectronicTarget.selectRadarisZB_noZBRadarOrCommu;
      for (let i = 0; i < radarOrCommuMsg.length; i++) {
        if (radarOrCommuMsg[i] == record.radarCode) {
          return `${styleless.bgRed}`;
        }
      }
    }
  };

  showRedBgCommu = (record, index) => {
    let radarOrCommuMsg = null;
    if (this.props.ElectronicTarget.selectRadarisZB_noZBRadarOrCommu) {
      radarOrCommuMsg = this.props.ElectronicTarget
        .selectRadarisZB_noZBRadarOrCommu;
      for (let i = 0; i < radarOrCommuMsg.length; i++) {
        if (radarOrCommuMsg[i] == record.commuCode) {
          return `${styleless.bgRed}`;
        }
      }
    }
  };
  render() {
    const { TextArea } = Input;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const FormItem = Form.Item;
    const Option = Select.Option;
    const paginationProps = {
      pageSize: 5
    };

    // 平台挂载雷达信息数据
    let radarDataSourse = [];
    if (this.props.data && this.props.data[3]) {
      let data = this.props.data[3];
      let arr = [];
      let threaRadardName;
      let forRadarName;
      let countryRadarName;
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < language.threadLevel.length; j++) {
          //威胁等级
          if (
            data[i].threaRadardName == language.threadLevel[j].name_zh ||
            data[i].threaRadardName == language.threadLevel[j].name_fr
          ) {
            threaRadardName =language.threadLevel[j][`name_${this.props.language.getlanguages}`];
          }
        }
        for (let j = 0; j < language.EnemyAndFoeAttributes.length; j++) {
          //敌我属性
          if (
            data[i].forRadarName == language.EnemyAndFoeAttributes[j].name_zh ||
            data[i].forRadarName == language.EnemyAndFoeAttributes[j].name_fr
          ) {
            forRadarName =language.EnemyAndFoeAttributes[j][
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
            countryRadarName =language.countryName[j][
                `name_${this.props.language.getlanguages}`
              ];
          }
        }
        arr.push({
          key: i+1,
          radarCode: data[i].radarCode,
          objectRadarName: data[i].objectRadarName,
          modelRadarName: data[i].modelRadarName,
          forRadarName: forRadarName,
          threaRadardName: threaRadardName,
          countryRadarName: countryRadarName
        });
      }
      radarDataSourse = arr;
    }
    // 平台挂载通信装备信息
    let dataSourceZB = [];
    if (this.props.data && this.props.data[4]) {
      let data = this.props.data[4];
      let arr = [];
      let forcommuName;
      let threadcommuName;
      let countrycommuName;
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < language.threadLevel.length; j++) {
          //威胁等级
          if (
            data[i].threadcommuName == language.threadLevel[j].name_zh ||
            data[i].threadcommuName == language.threadLevel[j].name_fr
          ) {
            threadcommuName =language.threadLevel[j][
                `name_${this.props.language.getlanguages}`
              ];
          }
        }
        for (let j = 0; j < language.EnemyAndFoeAttributes.length; j++) {
          //敌我属性
          if (
            data[i].forcommuName == language.EnemyAndFoeAttributes[j].name_zh ||
            data[i].forcommuName == language.EnemyAndFoeAttributes[j].name_fr
          ) {
            forcommuName =language.EnemyAndFoeAttributes[j][
                `name_${this.props.language.getlanguages}`
              ];
          }
        }
        for (let j = 0; j < language.countryName.length; j++) {
          //国家地区
          if (
            data[i].countrycommuName == language.countryName[j].name_zh ||
            data[i].countrycommuName == language.countryName[j].name_fr
          ) {
            countrycommuName =language.countryName[j][
                `name_${this.props.language.getlanguages}`
              ];
          }
        }
        arr.push({
          key: i+1,
          commuCode: data[i].commuCode,
          objectcommuName: data[i].objectcommuName,
          modelcommuName: data[i].modelcommuName,
          forcommuName: forcommuName,
          threadcommuName: threadcommuName,
          countrycommuName: countrycommuName
        });
      }
      dataSourceZB = arr;
    }
    // 目标航迹信息
    let dataSourceMBHJ = [];
    if (this.props.data && this.props.data[2]) {
      let data = this.props.data[2];
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push({
          index: i,
          sn: i + 1,
          longItute: data[i].longItute,
          latItude: data[i].latItude,
          altitudeM: data[i].altitudeM,
          heading: data[i].heading,
          navigationalSpeed: data[i].navigationalSpeed
        });
      }
      dataSourceMBHJ = arr;
    }
    // 平台挂载雷达信息
    const columnsRadar = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key",
      },
      {
        title: language[`radarTargetCode_${this.props.language.getlanguages}`],
        dataIndex: "radarCode"
      },
      {
        title: language[`radarTargetName_${this.props.language.getlanguages}`],
        dataIndex: "objectRadarName"
      },
      {
        title: language[`radarType_${this.props.language.getlanguages}`],
        dataIndex: "modelRadarName"
      },
      {
        title: language[`FriendOrFoeProperties_${this.props.language.getlanguages}`],
        dataIndex: "forRadarName"
      },
      {
        title: language[`threatLevel_${this.props.language.getlanguages}`],
        dataIndex: "threaRadardName"
      },
      {
        title: language[`countryOrRegion_${this.props.language.getlanguages}`],
        dataIndex: "countryRadarName"
      }
    ];

    // 平台挂载通信装备信息
    const columnsZB = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key",
      },
      {
        title: language[`CommitCode_${this.props.language.getlanguages}`],
        dataIndex: "commuCode"
      },
      {
        title: language[`CommitTargetName_${this.props.language.getlanguages}`],
        dataIndex: "objectcommuName"
      },
      {
        title: language[`CommunicationModel_${this.props.language.getlanguages}`],
        dataIndex: "modelcommuName"
      },
      {
        title: language[`FriendOrFoeProperties_${this.props.language.getlanguages}`],
        dataIndex: "forcommuName"
      },
      {
        title: language[`threatLevel_${this.props.language.getlanguages}`],
        dataIndex: "threadcommuName"
      },
      {
        title: language[`countryOrRegion_${this.props.language.getlanguages}`],
        dataIndex: "countrycommuName"
      }
    ];
    //侦察情报库中航迹点信息
    const columnsHJDZC = [
      {
        title: language[`serialNumber_${this.props.language.getlanguages}`],
        dataIndex: "sn",
        width: "10%"
      },
      {
        title: language[`longitude_${this.props.language.getlanguages}`],
        dataIndex: "longItute"
      },
      {
        title: language[`latitude_${this.props.language.getlanguages}`],
        dataIndex: "latItude"
      },
      {
        title: language[`height_${this.props.language.getlanguages}`],
        dataIndex: "altitudeM"
      },
      {
        title: "航向",
        dataIndex: "heading"
      },
      {
        title: "航速",
        dataIndex: "navigationalSpeed"
      }
    ];
    // 点击了对比分析，高亮显示不同的部分
    if (
      this.props.ElectronicTarget.DBFX === true &&
      document.getElementById("objectName_radar")
    ) {
      let data = this.props.ElectronicTarget.MomentData;
      let radarData_basic = this.props.ElectronicTarget.ZCAllData[0][0];
      let radarData_tec = this.props.ElectronicTarget.ZCAllData[1][0];
      if (radarData_basic && data) {
        if (radarData_basic.objectName !== data.objectName) {
          document.getElementById("objectName_radar").style.border =
            "1px solid #f00";
        }
        if (radarData_basic.objectModel != data.modelName) {
          document.getElementById("objectModel_radar").firstChild.style.border =
            "1px solid #f00";
        }
        if (radarData_basic.countryName !== data.countryName) {
          document.getElementById("countryName_radar").firstChild.style.border =
            "1px solid #f00";
        }
        if (radarData_basic.forName !== data.forName) {
          document.getElementById("forName_radar").firstChild.style.border =
            "1px solid #f00";
        }
        if (radarData_basic.threadName !== data.threadName) {
          document.getElementById("threadName_radar").firstChild.style.border =
            "1px solid #f00";
        }
        document.getElementById("remark_radar").style.border = "1px solid #f00";
      }
      if (radarData_tec && data) {
        // 部署信息
        if (radarData_tec.length !== data.length) {
          document.getElementById("length_radar").style.border =
            "1px solid #f00";
        }
        if (radarData_tec.wingSpan !== data.wingSpan) {
          document.getElementById("wingSpan_radar").style.border =
            "1px solid #f00";
        }
        if (radarData_tec.height !== data.height) {
          document.getElementById("height_radar").style.border =
            "1px solid #f00";
        }
        if (radarData_tec.maxSpeed !== data.maxSpeed) {
          document.getElementById("maxSpeed_radar").style.border =
            "1px solid #f00";
        }
        if (radarData_tec.cruiseSpeed !== data.cruiseSpeed) {
          document.getElementById("cruiseSpeed_radar").style.border =
            "1px solid #f00";
        }
        if (radarData_tec.maxCeiling !== data.maxCeiling) {
          document.getElementById("maxCeiling_radar").style.border =
            "1px solid #f00";
        }
        if (radarData_tec.serviceCeiling !== data.serviceCeiling) {
          document.getElementById("serviceCeiling_radar").style.border =
            "1px solid #f00";
        }
        if (radarData_tec.maxRange !== data.maxRange) {
          document.getElementById("maxRange_radar").style.border =
            "1px solid #f00";
        }
        if (radarData_tec.actionRadius !== data.actionRadius) {
          document.getElementById("actionRadius_radar").style.border =
            "1px solid #f00";
        }
        if (radarData_tec.enduranceTime !== data.enduranceTime) {
          document.getElementById("enduranceTime_radar").style.border =
            "1px solid #f00";
        }
        if (radarData_tec.rcs !== data.rcs) {
          document.getElementById("rcs_radar").style.border = "1px solid #f00";
        }
      }
    } else if (
      this.props.ElectronicTarget.DBFX === false &&
      document.getElementById("objectName_radar")
    ) {
      document.getElementById("objectName_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("objectModel_radar").firstChild.style.border =
        "1px solid #d9d9d9";
      document.getElementById("platformType_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("countryName_radar").firstChild.style.border =
        "1px solid #d9d9d9";
      document.getElementById("forName_radar").firstChild.style.border =
        "1px solid #d9d9d9";
      document.getElementById("threadName_radar").firstChild.style.border =
        "1px solid #d9d9d9";
      document.getElementById("remark_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("length_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("wingSpan_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("height_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("maxSpeed_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("cruiseSpeed_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("maxCeiling_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("serviceCeiling_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("maxRange_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("actionRadius_radar").style.border =
        "1px solid #d9d9d9";
      document.getElementById("rcs_radar").style.border = "1px solid #d9d9d9";
      document.getElementById("enduranceTime_radar").style.border =
        "1px solid #d9d9d9";
    }

    return (
      <div
        className={
          this.props.modelMark === "third" ? style.FirstBoxMin : style.FirstBox
        }
        style={
          this.props.modelMark === "third"
            ? { width: "951px", overflowX: "hidden" }
            : {}
        }
      >
        <div className={style.FodderRadar}>
          <span>
            {
              language[`ConImportedFromRadarLib_${this.props.language.getlanguages}`
              ]
            }
          </span>
          <img
            className={style.closeBtn}
            alt="img"
            src={require("./images/close.png")}
            onClick={this.handleClickClose}
            style={{
              width: 20,
              height: 20,
              float: "right",
              marginRight: 30,
              cursor: "pointer"
            }}
          />
        </div>
        {/* 基本信息 */}
        <div className={styleless.myBandForm}>
          <div className={style.ContentGBasic}>
            <div className={style.subhead}>
              <div style={{ margin: "5px 10px", float: "left" }}>
                {language[`basicInformation_${this.props.language.getlanguages}`]}
              </div>
            </div>
            <div className={style.Basic_Content_Wrap}>
              <div>
                {language[`TargetName_${this.props.language.getlanguages}`]}
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("objectName_radar", {
                    rules: [{}]
                  })(<Input type="text" id="objectName_radar" disabled />)}
                </FormItem>
              </div>
              <div>
                {language[`TargetModel_${this.props.language.getlanguages}`]}
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("objectModel_radar", {
                    rules: [{}]
                  })(
                    <Select
                      id="modelName"
                      onBlur={this.FormData}
                      onChange={this.selectTypeDetails}
                      disabled
                    >
                      {this.state.targetAllType
                        ? this.state.targetAllType.map(it => (
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
                {language[`PlatformType_${this.props.language.getlanguages}`]}
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("platformType_radar", {
                    initialValue: "6"
                  })(
                    <Select disabled id="platformType_radar">
                      <Option value="6">
                        {language[`aircraft_${this.props.language.getlanguages}`]}
                      </Option>
                    </Select>
                  )}
                </FormItem>
              </div>
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
              {/* {this.state.modelMark === "third" ? `` : <><div /><div /></>} */}
              <div className={style.Textarea_title_scout}>
                {language[`remark_${this.props.language.getlanguages}`]}
              </div>
              <div
                className={style.Textarea_Content}
                style={{ height: "213px", overflow: "hidden" }}
              >
                <FormItem>
                  {getFieldDecorator("remark_radar", {
                    rules: [{}]
                  })(
                    <TextArea
                      className={style.tableColTextCon}
                      id="remark_radar"
                      style={{
                        height: "213px",
                        overflowY: "scroll",
                        resize: "none"
                      }}
                      disabled
                    />
                  )}
                </FormItem>
              </div>
            </div>
          </div>

          {/* 平台战技术特征 */}
          <div className={style.ContentPSkill}>
            <div className={style.subhead}>
              <div style={{ margin: "5px 10px", float: "left" }}>
                {language[`TechnicalParamPlatformWarfare_${this.props.language.getlanguages}`]}
              </div>
            </div>
            <div className={style.Basic_Content_Wrap}>
              <div>
                {language[`PlaneLength_${this.props.language.getlanguages}`]}
                [m]
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("length_radar", {
                    rules: [{}]
                  })(<Input type="text" id="length_radar" disabled />)}
                </FormItem>
              </div>
              <div>
                {language[`Wingspan_${this.props.language.getlanguages}`]}
                [m]
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("wingSpan_radar", {
                    rules: [{}]
                  })(<Input type="text" id="wingSpan_radar" disabled />)}
                </FormItem>
              </div>
              <div>
                {language[`PlaneHeight_${this.props.language.getlanguages}`]}
                [m]
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("height_radar", {
                    rules: [{}]
                  })(<Input type="text" id="height_radar" disabled />)}
                </FormItem>
              </div>
              <div>
                {language[`MaximumSpeed_${this.props.language.getlanguages}`]}
                [km]
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("maxSpeed_radar", {
                    rules: [{}]
                  })(<Input type="text" id="maxSpeed_radar" disabled />)}
                </FormItem>
              </div>
              <div>
                {language[`CruisingSpeed_${this.props.language.getlanguages}`]}
                [km]
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("cruiseSpeed_radar", {
                    rules: [{}]
                  })(<Input type="text" id="cruiseSpeed_radar" disabled />)}
                </FormItem>
              </div>
              <div>
                {language[`maximumCeiling_${this.props.language.getlanguages}`]}
                [m]
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("maxCeiling_radar", {
                    rules: [{}]
                  })(<Input type="text" id="maxCeiling_radar" disabled />)}
                </FormItem>
              </div>
              <div>
                {language[`serviceCeiling_${this.props.language.getlanguages}`]}
                [m]
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("serviceCeiling_radar", {
                    rules: [{}]
                  })(<Input type="text" disabled />)}
                </FormItem>
              </div>
              <div>
                {language[`maximumRange_${this.props.language.getlanguages}`]}
                [km]
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("maxRange_radar", {
                    rules: [{}]
                  })(<Input type="text" disabled />)}
                </FormItem>
              </div>
              <div>
                {language[`actionRadius_${this.props.language.getlanguages}`]}
                [km]
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("actionRadius_radar", {
                    rules: [{}]
                  })(<Input type="text" id="serviceCeiling_radar" disabled />)}
                </FormItem>
              </div>
              <div>
                {language[`XuHangTime_${this.props.language.getlanguages}`]}
                [h]
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("enduranceTime_radar", {
                    rules: [{}]
                  })(
                    <Input
                      type="text_radar"
                      id="enduranceTime_radar"
                      disabled
                    />
                  )}
                </FormItem>
              </div>
              <div>
                {language[`AverageRCS_${this.props.language.getlanguages}`]}
                [㎡]
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("rcs_radar", {
                    rules: [{}]
                  })(<Input type="text" id="rcs_radar" disabled />)}
                </FormItem>
              </div>
            </div>
          </div>
          {/* </Form> */}
        </div>

        {/* 平台挂载设备*/}
        <div className={style.tableBorder}>
          <div className={style.freqbw}>
            {/* 平台挂载雷达信息 */}
            <div className={style.subhead}>
              <div style={{ margin: "5px 10px", float: "left" }}>
                {language[`platformMountRadarInfo_${this.props.language.getlanguages}`]}
              </div>
            </div>
            <div className={style.radar}>
              <Table
                columns={columnsRadar}
                dataSource={radarDataSourse}
                rowKey={record=>record.radarCode}
                pagination={paginationProps}
                className={
                  this.props.changeC.mark === "third"
                    ? styleless.myClassLDMin
                    : styleless.myClass
                }
                rowClassName={(record, index) => this.showRedBg(record, index)}
              />
            </div>
            {/* 平台挂载通信装备信息 */}
            <div className={style.subhead}>
              <div style={{ margin: "5px 10px", float: "left" }}>
                {language[`platformMountCommitInfo_${this.props.language.getlanguages}`]}
              </div>
            </div>
            <div className={style.radar}>
              <Table
                columns={columnsZB}
                dataSource={dataSourceZB}
                rowKey={record=>record.commuCode}
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
          </div>
        </div>

        {/* 目标航迹信息 */}
        <div className={style.ContentPSkill}>
          <div className={style.subhead}>
            <div style={{ margin: "5px 10px", float: "left" }}>
              {language[`TargetTrackInformation_${this.props.language.getlanguages}`]}
            </div>
          </div>
          <div className={style.MuBiaoHJ}>
            <Table
              columns={columnsHJDZC}
              dataSource={dataSourceMBHJ}
              pagination={paginationProps}
              className={styleless.myClass}
            />
          </div>
        </div>
      </div>
    );
  }
}

TargetScoutModel = Form.create({
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
          objectModel_radar: Form.createFormField({
            ...props,
            value: basicData.objectModel
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
          platformType_radar: Form.createFormField({
            ...props,
            value: "6"
          }),
          remark_radar: Form.createFormField({
            ...props,
            value: basicData.remark
          }),
          // 战技术参数
          actionRadius_radar: Form.createFormField({
            ...props,
            value: TenData.actionRadius
          }),
          cruiseSpeed_radar: Form.createFormField({
            ...props,
            value: TenData.cruiseSpeed
          }),
          height_radar: Form.createFormField({
            ...props,
            value: TenData.height
          }),
          length_radar: Form.createFormField({
            ...props,
            value: TenData.length == "0" ? null : TenData.length
          }),
          maxCeiling_radar: Form.createFormField({
            ...props,
            value: TenData.maxCeiling
          }),
          maxRange_radar: Form.createFormField({
            ...props,
            value: TenData.maxRange
          }),
          maxSpeed_radar: Form.createFormField({
            ...props,
            value: TenData.maxSpeed
          }),
          enduranceTime_radar: Form.createFormField({
            ...props,
            value: TenData.enduranceTime
          }),
          rcs_radar: Form.createFormField({
            ...props,
            value: TenData.rcs
          }),
          serviceCeiling_radar: Form.createFormField({
            ...props,
            value: TenData.serviceCeiling
          }),
          wingSpan_radar: Form.createFormField({
            ...props,
            value: TenData.wingSpan
          })
        };
      }
    }
  }
})(TargetScoutModel);

export default TargetScoutModel;
