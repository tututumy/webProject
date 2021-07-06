import React, { Component } from "react";
import style from "./Edit.css";
import styleless from "./test.less";
import GisIndex from "../../pages/Gis/GisIndex";
import { Table, Button, Select, Input, Form, message } from "antd";
import DialogDrag from "../../utils/DialogDrag/Dialog";
import TargetRelateMsg from "./Target_relateMsg";
import { connect } from "dva";
import {
  ImportTargetTable,
  ImportTargetTableZB
} from "./Target_MountTargetMsg";
import language from "../language/language";

@connect(({ fodder, changeC, language, ElectronicTarget }) => ({
  fodder,
  changeC,
  language,
  ElectronicTarget
}))
class TargetTargetModel extends Component {
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
      bigContent: true,
      dataSourceHJD: null,
      activeIndex: -1,
      visbleCommit: false, //平台挂载通信装备信息
      visbleAdd_commit: false, //平台挂载通信装备信息弹出框的显示隐藏
      selectedRowsPTGZ_commit: null, //平台挂载雷达信息的选择的通信目标内码
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

  // 点击查看目标航迹态势图====显示地图===绘制航迹
  showMap = e => {
    this.setState({ showMapVisible: true });
    let { dispatch } = this.props;
    dispatch({
      type: "fodder/LoadMap",
      payload: {
        mark: "draw"
      }
    });
    this.props.dispatch({
      type: "ElectronicTarget/selectPlaneLineBtn",
      payload: 1
    });

    this.props.dispatch({
      type: "ElectronicTarget/selectPlaneLine",
      // callback: res => {
      // this.addMarker1(res.data, map);
      // }
    });
  };


  handleCancelMap = e => {
    this.setState({ showMapVisible: false });
    let { dispatch } = this.props;
    dispatch({
      type: "fodder/ClearMap",
      payload: {
        mark: "clear"
      }
    });
  };


  closeDialog = e => {
    this.setState({ showMapVisible: false });
    this.props.CancelMap()
    let { dispatch } = this.props;
    dispatch({
      type: "fodder/ClearMap",
      payload: {
        mark: "clear"
      }
    });
  };
  minimizeDialog = flag => {
    if (!flag) {
      document.getElementById("imgBox").style.width = "300px";
      document.getElementById("imgBox").style.height = "300px";
    } else {
      document.getElementById("imgBox").style.width = "1200px";
      document.getElementById("imgBox").style.height = "500px";
    }
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
      rightMinCommuVisible: false,
      visbleAdd_commit: false
    });
  };
  //点击切换到目标情报库大模块
  handleClickClose = () => {
    let { dispatch } = this.props;
    dispatch({
      type: "changeC/ClickCloseL",
      payload: {
        mark: "second"
      }
    });
  };
  //点击一条目标航迹信息显示对应的目标航迹点信息
  clickRow = record => {
    this.setState({ activeIndex: record.key });
    let data; //工作模式原来有值
    if (this.props.ElectronicTarget.airTrackList) {
      data = this.props.ElectronicTarget.airTrackList;
    }
    let momentAirTrackListMSg;
    if (data) {
      for (let i = 0; i < data.length; i++) {
        if (record.trackId == data[i].trackId) {
          momentAirTrackListMSg = data[i];
        }
      }
      //编辑过来的数据点击行
      if (this.props.ElectronicTarget.TargetAllData != null) {
        this.props.dispatch({
          type: "ElectronicTarget/selectAirTrackListMSgPoint",
          payload: {
            trackId: record.trackId,
            momentAirTrackListMSg: momentAirTrackListMSg
          }
        });
      }
    }
  };
  //给点击的行设置一个背景色
  setClassName = (record, index) => {
    return index === this.state.activeIndex
      ? `${style["l-table-row-active"]}`
      : "";
  };
  //点击查看按钮
  handleLookRadar = () => {
    this.setState({ visbleRadar: true });
  };
  handleRadar = () => {
    this.setState({ visbleRadar: false });
  };
  //触发保存表单数据
  FormData = () => {
    this.props.form.validateFields((err, values) => {
      this.props.dispatch({
        type: "ElectronicTarget/saveSpecialormMsg",
        payload: values
      });
    });
  };
  //名称失去焦点的时候查询是否重复
  selectRepeat = e => {
    this.FormData();
    this.props.dispatch({
      type: "ElectronicTarget/selectIfHaveName",
      payload: e.target.value,
      callback: res => {
        if (res.data == "0") {
          message.warning(
            language[`nameRepeatMsg_${this.props.language.getlanguages}`]
          );
          return false;
        }
      }
    });
  };

  //电子目标类型切换，查询对应的战技术参数
  selectTypeDetails = value => {
    if (value == "-1") {
      //如果类型是“请下拉选择”
      this.props.form.validateFields((err, values) => {
        this.props.dispatch({
          type: "ElectronicTarget/saveSpecialormMsg",
          payload: {
            ...values,
            modelName: "-1",
            length: null,
            wingSpan: null,
            height: null,
            maxSpeed: null,
            cruiseSpeed: null,
            maxCeiling: null,
            serviceCeiling: null,
            maxRange: null,
            actionRadius: null,
            enduranceTime: null,
            rcs: null,
            manufacturer: null
          }
        });
      });
    } else {
      this.props.dispatch({
        type: "ElectronicTarget/selectTargetTypeDetails",
        payload: value,
        callback: res => {
          if (res.data[0]) {
            let data = res.data[0];
            this.props.form.validateFields((err, values) => {
              console.log("values", values);
              this.props.dispatch({
                type: "ElectronicTarget/saveSpecialormMsg",
                payload: {
                  ...values,
                  length: data.length,
                  wingSpan: data.wingSpan,
                  height: data.height,
                  maxSpeed: data.maxSpeed,
                  cruiseSpeed: data.cruiseSpeed,
                  maxCeiling: data.maxCeiling,
                  serviceCeiling: data.serviceCeiling,
                  maxRange: data.maxRange,
                  actionRadius: data.actionRadius,
                  enduranceTime: data.enduranceTime,
                  rcs: data.rcs,
                  manufacturer: data.manufacturer
                }
              });
            });
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

    //目标库中航迹信息数据
    const dataSource = [];
    if (this.props.ElectronicTarget.airTrackList) {
      let data = this.props.ElectronicTarget.airTrackList;
      for (let i = 0; i < data.length; i++) {
        dataSource.push({
          key: i,
          index: i + 1,
          trackId: data[i].trackId,
          appearTime: data[i].appearTime.slice(0, 19),
          disappearTime: data[i].disappearTime.slice(0, 19),
          durationMin: data[i].durationMin,
          trackDescription: data[i].trackDescription
        });
      }
    }
    const columns = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "index",
        width: "10%",
        editable: true
      },
      {
        title: language[`HangJiCode_${this.props.language.getlanguages}`],
        dataIndex: "trackId",
        width: "18%",
        editable: true
      },
      {
        title: language[`TimeOfAppearance_${this.props.language.getlanguages}`],
        dataIndex: "appearTime",
        width: "18%",
        editable: true
      },
      {
        title: language[`TimeOfMiss_${this.props.language.getlanguages}`],
        dataIndex: "disappearTime",
        width: "18%",
        editable: true
      },
      {
        title: language[`Duration_${this.props.language.getlanguages}`] +"【" +
          language[`minute_${this.props.language.getlanguages}`] +"】",
        dataIndex: "durationMin",
        width: "18%",
        editable: true
      },
      {
        title: language[`TrackDescription_${this.props.language.getlanguages}`],
        dataIndex: "trackDescription",
        width: "18%",
        editable: true
      }
    ];
    const paginationPropsHJ = {
      pageSize: 5
    };
    const columnsHJD = [
      {
        title: language[`serialNumber_${this.props.language.getlanguages}`],
        dataIndex: "sn",
        width: "10%",
        editable: true
      },
      {
        title: language[`longitude_${this.props.language.getlanguages}`],
        dataIndex: "longitute",
        width: "18%",
        editable: true
      },
      {
        title: language[`latitude_${this.props.language.getlanguages}`],
        dataIndex: "latitude",
        width: "18%",
        editable: true
      },
      {
        title: language[`height_${this.props.language.getlanguages}`],
        dataIndex: "altitudeM",
        width: "18%",
        editable: true
      },
      {
        title: language[`placeNameDescription_${this.props.language.getlanguages}`],
        dataIndex: "notes",
        editable: true
      }
    ];

    let AirTrackListMSgPointData = [];
    if (this.props.ElectronicTarget.AirTrackListMSgPoint) {
      let data = this.props.ElectronicTarget.AirTrackListMSgPoint;
      for (let i = 0; i < data.length; i++) {
        AirTrackListMSgPointData.push({
          key: i + 1,
          sn: data[i].sn,
          longitute: data[i].longitute,
          latitude: data[i].latitude,
          altitudeM: data[i].altitudeM,
          notes: data[i].notes
        });
      }
    }
    const paginationPropsHJD = {
      pageSize: 5
    };
    // 点击了对比分析，高亮显示不同的部分
    if (
      this.props.ElectronicTarget.ZCAllData &&
      this.props.ElectronicTarget.DBFX === true
    ) {
      let radarData_basic = this.props.ElectronicTarget.ZCAllData[0][0];
      let radarData_tec = this.props.ElectronicTarget.ZCAllData[1][0];
      if (document.getElementById("objectName") && radarData_basic) {
        if (
          radarData_basic.objectName !==
          this.props.form.getFieldValue("objectName")
        ) {
          document.getElementById("objectName").style.border = "1px solid #f00";
        }
        if (
          radarData_basic.objectModel !=
          this.props.form.getFieldValue("modelName")
        ) {
          document.getElementById("modelName").firstChild.style.border =
            "1px solid #f00";
        }

        if (
          radarData_basic.countryName !==
          this.props.form.getFieldValue("countryName")
        ) {
          document.getElementById("countryName").firstChild.style.border =
            "1px solid #f00";
        }
        if (
          radarData_basic.forName !== this.props.form.getFieldValue("forName")
        ) {
          document.getElementById("forName").firstChild.style.border =
            "1px solid #f00";
        }
        if (
          radarData_basic.threadName !==
          this.props.form.getFieldValue("threadName")
        ) {
          document.getElementById("threadName").firstChild.style.border =
            "1px solid #f00";
        }
        // document.getElementById("tacanSignalModeId").firstChild.style.border =
        //   "1px solid #f00";
        // document.getElementById("tacanSignalSypeId").firstChild.style.border =
        //   "1px solid #f00";
        // document.getElementById("tacanIcommModeId").firstChild.style.border =
        //   "1px solid #f00";
        document.getElementById("purpose").style.border = "1px solid #f00";
        document.getElementById("deployInformation").style.border =
          "1px solid #f00";
        document.getElementById("manufacturer").style.border = "1px solid #f00";
        document.getElementById("activeAreaDescription").style.border =
          "1px solid #f00";
        document.getElementById("loadDescription").style.border =
          "1px solid #f00";
      }
      if (document.getElementById("length") && radarData_tec) {
        // 部署信息
        if (radarData_tec.length !== this.props.form.getFieldValue("length")) {
          document.getElementById("length").style.border = "1px solid #f00";
        }
        if (
          radarData_tec.wingSpan !== this.props.form.getFieldValue("wingSpan")
        ) {
          document.getElementById("wingSpan").style.border = "1px solid #f00";
        }
        if (radarData_tec.height !== this.props.form.getFieldValue("height")) {
          document.getElementById("height").style.border = "1px solid #f00";
        }
        if (
          radarData_tec.maxSpeed !== this.props.form.getFieldValue("maxSpeed")
        ) {
          document.getElementById("maxSpeed").style.border = "1px solid #f00";
        }
        if (
          radarData_tec.cruiseSpeed !==
          this.props.form.getFieldValue("cruiseSpeed")
        ) {
          document.getElementById("cruiseSpeed").style.border =
            "1px solid #f00";
        }
        if (
          radarData_tec.maxCeiling !==
          this.props.form.getFieldValue("maxCeiling")
        ) {
          document.getElementById("maxCeiling").style.border = "1px solid #f00";
        }
        if (
          radarData_tec.serviceCeiling !==
          this.props.form.getFieldValue("serviceCeiling")
        ) {
          document.getElementById("serviceCeiling").style.border =
            "1px solid #f00";
        }
        if (
          radarData_tec.maxRange !== this.props.form.getFieldValue("maxRange")
        ) {
          document.getElementById("maxRange").style.border = "1px solid #f00";
        }
        if (
          radarData_tec.actionRadius !==
          this.props.form.getFieldValue("actionRadius")
        ) {
          document.getElementById("actionRadius").style.border =
            "1px solid #f00";
        }
        if (
          radarData_tec.enduranceTime !==
          this.props.form.getFieldValue("enduranceTime")
        ) {
          document.getElementById("enduranceTime").style.border =
            "1px solid #f00";
        }
        if (radarData_tec.rcs !== this.props.form.getFieldValue("rcs")) {
          document.getElementById("rcs").style.border = "1px solid #f00";
        }
      }
    } else if (
      this.props.ElectronicTarget.ZCAllData &&
      this.props.ElectronicTarget.DBFX === false &&
      document.getElementById("objectName")
    ) {
      document.getElementById("objectName").style.border = "1px solid #d9d9d9";
      document.getElementById("modelName").firstChild.style.border =
        "1px solid #d9d9d9";
      // document.getElementById("plantType").style.border = "1px solid #d9d9d9";
      document.getElementById("countryName").firstChild.style.border =
        "1px solid #d9d9d9";
      document.getElementById("forName").firstChild.style.border =
        "1px solid #d9d9d9";
      document.getElementById("threadName").firstChild.style.border =
        "1px solid #d9d9d9";
      document.getElementById("purpose").style.border = "1px solid #d9d9d9";
      document.getElementById("deployInformation").style.border =
        "1px solid #d9d9d9";
      document.getElementById("manufacturer").style.border =
        "1px solid #d9d9d9";
      document.getElementById("activeAreaDescription").style.border =
        "1px solid #d9d9d9";
      document.getElementById("loadDescription").style.border =
        "1px solid #d9d9d9";
      document.getElementById("length").style.border = "1px solid #d9d9d9";
      document.getElementById("wingSpan").style.border = "1px solid #d9d9d9";
      document.getElementById("height").style.border = "1px solid #d9d9d9";
      document.getElementById("maxSpeed").style.border = "1px solid #d9d9d9";
      document.getElementById("cruiseSpeed").style.border = "1px solid #d9d9d9";
      document.getElementById("maxCeiling").style.border = "1px solid #d9d9d9";
      document.getElementById("serviceCeiling").style.border =
        "1px solid #d9d9d9";
      document.getElementById("maxRange").style.border = "1px solid #d9d9d9";
      document.getElementById("actionRadius").style.border =
        "1px solid #d9d9d9";
      document.getElementById("enduranceTime").style.border =
        "1px solid #d9d9d9";
      document.getElementById("rcs").style.border = "1px solid #d9d9d9";
      // document.getElementById("tacanSignalModeId").firstChild.style.border =
      //   "1px solid #d9d9d9";
      // document.getElementById("tacanSignalSypeId").firstChild.style.border =
      //   "1px solid #d9d9d9";
      // document.getElementById("tacanIcommModeId").firstChild.style.border =
      //   "1px solid #d9d9d9";
    }
    return (
      <div>
        {/* 从目标库导入的内容 */}
        <div
          className={
            this.props.modelMark === "third"
              ? style.FirstBoxMin
              : style.FirstBox
          }
        >
          <div style={{ position: "relative" }}>
            <div className={style.FodderRadar}>
              {/* 创建整编对象 */}
              <span
                style={{
                  display:
                    this.props.ElectronicTarget.sn == "1"
                      ? "none"
                      : "inline-block"
                }}
              >
                {language[`CreateAnIntegrationObject_${
                  this.props.language.getlanguages
                  }`
                  ]
                }
              </span>
              {/* 从目标导入的内容 */}
              <span
                style={{
                  display:
                    this.props.ElectronicTarget.sn == "1"
                      ? "inline-block"
                      : "none"
                }}
              >
                {language[`ImportReorganizationyContent_${this.props.language.getlanguages}`]}
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
            <Form className={styleless.myBandForm}>
              {/* 基本信息 */}
              <div className={style.ContentGBasic}>
                <div className={style.subhead}>
                  <div style={{ margin: "5px 10px", float: "left" }}>
                    {language[`basicInformation_${this.props.language.getlanguages}`]}
                  </div>
                </div>
                <div className={style.Basic_Content_Wrap}>
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
                    {language[`TargetName_${this.props.language.getlanguages}`]}
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
                          type="text"
                          id="objectName"
                          disabled={
                            this.props.ElectronicTarget.sn == "1" ? true : false
                          }
                          autoComplete="off"
                          onBlur={this.selectRepeat}
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
                    {language[`PlatformModel_${this.props.language.getlanguages}`]}
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("modelName", {
                        initialValue: "-1"
                      })(
                        <Select
                          onBlur={this.FormData}
                          onChange={this.selectTypeDetails}
                          getPopupContainer={triggerNode =>
                            triggerNode.parentNode
                          } //将下拉列表的样式相对定位与父元素而不是body
                        >
                          <Option value="-1">
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
                      )}
                    </FormItem>
                  </div>
                  <div>
                    {language[`PlatformType_${this.props.language.getlanguages}`]}
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("plantType", {
                        initialValue: "6"
                      })(
                        <Select
                          id="plantType"
                          onBlur={this.FormData}
                          getPopupContainer={triggerNode =>
                            triggerNode.parentNode
                          } //将下拉列表的样式相对定位与父元素而不是body
                        >
                          <Option value="6">
                            {language[`aircraft_${this.props.language.getlanguages}`]}
                          </Option>
                        </Select>
                      )}
                    </FormItem>
                  </div>
                  <div>
                    {language[`countriesAndRegions_${this.props.language.getlanguages }`]}
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("countryName", {
                        initialValue: "004"
                      })(
                        <Select
                          id="countryName"
                          onBlur={this.FormData}
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
                  </div>
                  <div>
                    {language[`FriendOrFoeProperties_${this.props.language.getlanguages }`]}
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("forName", {
                        initialValue: "01"
                      })(
                        <Select
                          id="forName"
                          onBlur={this.FormData}
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
                  </div>
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
                          onBlur={this.FormData}
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
                  {/* <div >
                    {language[`TACANSignalMode_${this.props.language.getlanguages}`]}
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("tacanSignalModeId", {
                        initialValue: "00"
                      })(
                        <Select
                          onBlur={this.FormData}
                          getPopupContainer={triggerNode =>
                            triggerNode.parentNode
                          } //将下拉列表的样式相对定位与父元素而不是body
                        >
                          {language.TACANSignalMode.map((v, k) => (
                            <Option value={v.value} key={v.value}>
                              {v[`name_${this.props.language.getlanguages}`]}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </div>
                  <div>
                    {language[`TACANSignalType_${this.props.language.getlanguages}`]}
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("tacanSignalSypeId", {
                        initialValue: "00"
                      })(
                        <Select
                          onBlur={this.FormData}
                          getPopupContainer={triggerNode =>
                            triggerNode.parentNode
                          } //将下拉列表的样式相对定位与父元素而不是body
                        >
                          {language.TACANSignalType.map((v, k) => (
                            <Option value={v.value} key={v.value}>
                              {v[`name_${this.props.language.getlanguages}`]}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </div>
                  <div>
                    {language[`TACANCommunicationMode_${this.props.language.getlanguages }`]}
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("tacanIcommModeId", {
                        initialValue: "00"
                      })(
                        <Select
                          onBlur={this.FormData}
                          getPopupContainer={triggerNode =>
                            triggerNode.parentNode
                          } //将下拉列表的样式相对定位与父元素而不是body
                        >
                          {language.TACANCommunicationMode.map((v, k) => (
                            <Option value={v.value} key={v.value}>
                              {v[`name_${this.props.language.getlanguages}`]}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </div> */}
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
                          type="text"
                          id="purpose"
                          onBlur={this.FormData}
                        />
                      )}
                    </FormItem>
                  </div>
                  <div>
                    {language[`DeploymentInformation_${this.props.language.getlanguages }`]}
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
                          type="text"
                          id="deployInformation"
                          autoComplete="off"
                          onBlur={this.FormData}
                        />
                      )}
                    </FormItem>
                  </div>
                  <div>
                    {language[`producer_${this.props.language.getlanguages}`]}
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("manufacturer", {
                        rules: [{}]})(
                        <Input
                          type="text"
                          id="manufacturer"
                          autoComplete="off"
                          onBlur={this.FormData}
                          disabled
                        />
                      )}
                    </FormItem>
                  </div>
                  {this.props.modelMark === "third" ? <><div style={{ background: '#fff' }} /><div /></> : ``}
                  <div className={style.Textarea_title}>
                    {language[`ActiveAreaDescription_${this.props.language.getlanguages }`]}
                  </div>
                  <div className={style.Textarea_Content}>
                    <FormItem>
                      {getFieldDecorator("activeAreaDescription", {
                        rules: [{}],
                        getValueFromEvent: event => {
                          return event.target.value.slice(0, 255);
                        }
                      })(
                        <TextArea
                          onBlur={this.FormData}
                          className={style.tableColTextCon}
                          style={{
                            height: "70px",
                            overflowY: "scroll",
                            resize: "none"
                          }}
                          id="activeAreaDescription"
                        />
                      )}
                    </FormItem>
                  </div>
                  <div className={style.Textarea_title}>
                    {language[`LoadDescription_${this.props.language.getlanguages}`]}
                  </div>
                  <div className={style.Textarea_Content}>
                    <FormItem>
                      {getFieldDecorator("loadDescription", {
                        rules: [{}],
                        getValueFromEvent: event => {
                          return event.target.value.slice(0, 255);
                        }
                      })(
                        <TextArea
                          onBlur={this.FormData}
                          className={style.tableColTextCon}
                          style={{
                            height: "72px",
                            overflowY: "scroll",
                            resize: "none"
                          }}
                          id="loadDescription"
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
                    {language[`TechnicalParamPlatformWarfare_${this.props.language.getlanguages }`]}
                  </div>
                </div>
                <div
                  className={style.Basic_Content_Wrap}
                  style={{ background: "#ffff" }}
                >
                  <div>
                    {language[`PlaneLength_${this.props.language.getlanguages}`]}[m]
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("length", {
                        rules: [{}]})(
                        <Input
                          type="text"
                          id="length"
                          autoComplete="off"
                          onBlur={this.FormData}
                          disabled
                        />
                      )}
                    </FormItem>
                  </div>
                  <div>
                    {language[`Wingspan_${this.props.language.getlanguages}`]}[m]
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("wingSpan", {
                        rules: [{}]})(
                        <Input
                          type="text"
                          id="wingSpan"
                          autoComplete="off"
                          onBlur={this.FormData}
                          disabled
                        />
                      )}
                    </FormItem>
                  </div>
                  <div>
                    {language[`PlaneHeight_${this.props.language.getlanguages}`]}[m]
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("height", {
                        rules: [{}]})(
                        <Input
                          type="text"
                          id="height"
                          autoComplete="off"
                          onBlur={this.FormData}
                          disabled
                        />
                      )}
                    </FormItem>
                  </div>
                  <div>
                    {language[`MaximumSpeed_${this.props.language.getlanguages}`]}[km]
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("maxSpeed", {
                        rules: [{}]})(
                        <Input
                          type="text"
                          id="maxSpeed"
                          autoComplete="off"
                          onBlur={this.FormData}
                          disabled
                        />
                      )}
                    </FormItem>
                  </div>
                  <div>
                    {language[`CruisingSpeed_${this.props.language.getlanguages}`]}[km]
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("cruiseSpeed", {
                        rules: [{}]})(
                        <Input
                          type="text"
                          id="cruiseSpeed"
                          autoComplete="off"
                          onBlur={this.FormData}
                          disabled
                        />
                      )}
                    </FormItem>
                  </div>
                  <div>
                    {language[`maximumCeiling_${this.props.language.getlanguages}`]}[m]
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("maxCeiling", {
                        rules: [{}]})(
                        <Input
                          type="text"
                          id="maxCeiling"
                          autoComplete="off"
                          onBlur={this.FormData}
                          disabled
                        />
                      )}
                    </FormItem>
                  </div>
                  <div>
                    {language[`serviceCeiling_${this.props.language.getlanguages}`]}[m]
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("serviceCeiling", {
                        rules: [{}]})(
                        <Input
                          type="text"
                          id="serviceCeiling"
                          autoComplete="off"
                          onBlur={this.FormData}
                          disabled
                        />
                      )}
                    </FormItem>
                  </div>
                  <div>
                    {language[`maximumRange_${this.props.language.getlanguages}`]}[km]
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("maxRange", {
                        rules: [{}]})(
                        <Input
                          type="text"
                          id="maxRange"
                          autoComplete="off"
                          onBlur={this.FormData}
                          disabled
                        />
                      )}
                    </FormItem>
                  </div>
                  <div>
                    {language[`actionRadius_${this.props.language.getlanguages}`]}[km]
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("actionRadius", {
                        rules: [{}]})(
                        <Input
                          type="text"
                          id="actionRadius"
                          autoComplete="off"
                          onBlur={this.FormData}
                          disabled
                        />
                      )}
                    </FormItem>
                  </div>
                  <div>
                    {language[`XuHangTime_${this.props.language.getlanguages}`]}[h]
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("enduranceTime", {
                        rules: [{}]})(
                        <Input
                          type="text"
                          id="enduranceTime"
                          autoComplete="off"
                          onBlur={this.FormData}
                          disabled
                        />
                      )}
                    </FormItem>
                  </div>
                  <div>
                    {language[`AverageRCS_${this.props.language.getlanguages}`]}[m2]
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("rcs", {
                        rules: [{}]})(
                        <Input
                          type="text"
                          id="rcs"
                          autoComplete="off"
                          onBlur={this.FormData}
                          disabled
                        />
                      )}
                    </FormItem>
                  </div>
                  <div style={{ background: "#ffff" }} />
                  <div />
                </div>
              </div>

              {/* 平台挂载雷达信息*/}
              <div className={style.ContentPSkill}>
                <ImportTargetTable FormData={this.FormData} />
              </div>

              {/* 平台挂载通信装备信息*/}
              <div className={style.ContentPSkill}>
                <ImportTargetTableZB FormData={this.FormData} />
              </div>
              {/* 目标航迹信息 */}
              <div className={style.ContentPSkill}>
                <div className={style.subhead}>
                  <div style={{ margin: "5px 10px", float: "left" }}>
                    {
                      language[`TargetTrackInformation_${this.props.language.getlanguages}`]
                    }
                  </div>
                </div>
                <div className={style.clearFloat}>
                  {/* 左边的两个表格 */}
                  <div>
                    <div className={style.clearFloat}>
                      <div
                        style={{
                          float: "left",
                          margin: "20px 20px 5px",
                          height: 30
                        }}
                      >
                        {language[`TargetTrackInformation_${this.props.language.getlanguages}`]}
                      </div>
                      {/* 右边的部分 */}
                      <div
                        className={style.clearFloat}
                        style={{
                          float: "right",
                          margin: "11px 20px 5px",
                          height: 30
                        }}
                      >
                        {/* 查看地图按钮 */}
                        <Button
                          type="primary"
                          className={style.mapBtn}
                          onClick={this.showMap}
                        >
                          {language[`LookTargetatrackMap_${this.props.language.getlanguages}`]}
                        </Button>
                        {(this.state.showMapVisible || this.props.visibleMap) ?
                          <DialogDrag
                            visible={this.state.showMapVisible || this.props.visibleMap}
                            title={language[`TargetTrackSituationMap_${this.props.language.getlanguages}`]}
                            close={this.closeDialog}
                            screenHeight={this.state.showMapVisible ? "2223" : "3101"}
                            TOP={this.state.showMapVisible ? "1300" : "100"}
                            minimize={true}
                            minimize={this.minimizeDialog}
                          >
                            <div className={style.popFodderTypeImg}>
                              {/*上传后的文件列表*/}
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
                                  
                                  {/* <div id="imgBox" style={{ height: (this.state.showMapVisible || this.props.visibleMap) ? "500px" : 0 }}> */}
                                  <div id="imgBox" style={{ height: (this.state.showMapVisible || this.props.visibleMap) ? "500px" : 0 }}>
                                    <GisIndex />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogDrag>
                          : null} 

                      </div>
                    </div>
                    <div className={style.tablecon}>
                      <Table
                        columns={columns}
                        dataSource={dataSource}
                        pagination={paginationPropsHJ}
                        bordered={true}
                        className={
                          this.props.changeC.mark === "third"
                            ? styleless.myClassLDMin
                            : styleless.myClass
                        }
                        rowClassName={this.setClassName}
                        onRow={record => {
                          return {
                            onClick: this.clickRow.bind(this, record) // 点击行
                          };
                        }}
                      />
                    </div>
                    <div
                      className={style.subheadTitle}
                      style={{ backgroundColor: "#ccc" }}
                    >
                      <div
                        style={{
                          margin: "10px 20px 5px",
                          float: "left",
                          height: 30
                        }}
                      >
                        {language[    `TargetTrackPointInformation_${
                          this.props.language.getlanguages
                          }`
                          ]
                        }
                      </div>
                    </div>
                    <div className={style.tablecon}>
                      {/* 目标航迹点信息 */}
                      <Table
                        columns={columnsHJD}
                        dataSource={AirTrackListMSgPointData}
                        pagination={paginationPropsHJD}
                        bordered={true}
                        className={styleless.myClass}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Form>

            {/* 相关资料 */}
            <div className={style.ContentGBasic}>
              <div className={style.subhead} style={{ marginBottom: "20px" }}>
                <div style={{ margin: "5px 10px", float: "left" }}>
                  {language[`relatedData_${this.props.language.getlanguages}`]}
                </div>
              </div>
              <TargetRelateMsg
                name={
                  this.props.modelMark === "third" ? "smallPart" : "bigPart"
                }
                FormData={this.FormData}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TargetTargetModel = Form.create({
  mapPropsToFields(props) {
    //1.目标库导入的数据
    if (props.data != null) {
      let data = props.data;
      return {
        // 基本信息
        objectName: Form.createFormField({
          ...props,
          value: data.objectName == "null" ? "" : data.objectName
        }),
        modelName: Form.createFormField({
          ...props,
          value:
            data.modelName == "null"
              ? ""
              : data.modelName
                ? data.modelName
                : "-1"
        }),
        plantType: Form.createFormField({
          ...props,
          // value: data.plantType,
          value: "6"
        }),
        countryName: Form.createFormField({
          ...props,
          value: data.countryName == "null" ? "" : data.countryName
        }),
        forName: Form.createFormField({
          ...props,
          value: data.forName == "null" ? "" : data.forName
        }),
        threadName: Form.createFormField({
          ...props,
          value: data.threadName == "null" ? "" : data.threadName
        }),
        // tacanSignalModeId: Form.createFormField({
        //   ...props,
        //   value: !data.tacanSignalModeId ? "0" : data.tacanSignalModeId
        // }),
        // tacanSignalSypeId: Form.createFormField({
        //   ...props,
        //   value: !data.tacanSignalSypeId ? "0" : data.tacanSignalSypeId
        // }),
        // tacanIcommModeId: Form.createFormField({
        //   ...props,
        //   value: !data.tacanIcommModeId ? "0" : data.tacanIcommModeId
        // }),
        purpose: Form.createFormField({
          ...props,
          value: data.purpose == "null" ? "" : data.purpose
        }),
        deployInformation: Form.createFormField({
          ...props,
          value: data.deployInformation == "null" ? "" : data.deployInformation
        }),
        manufacturer: Form.createFormField({
          ...props,
          value: data.manufacturer == "null" ? "" : data.manufacturer
        }),
        activeAreaDescription: Form.createFormField({
          ...props,
          value:
            data.activeAreaDescription == "null"
              ? ""
              : data.activeAreaDescription
        }),
        loadDescription: Form.createFormField({
          ...props,
          value: data.loadDescription == "null" ? "" : data.loadDescription
        }),
        // 战技术参数
        length: Form.createFormField({
          ...props,
          value: data.length == "null" ? "" : data.length
        }),
        wingSpan: Form.createFormField({
          ...props,
          value: data.wingSpan == "null" ? "" : data.wingSpan
        }),
        height: Form.createFormField({
          ...props,
          value: data.height == "null" ? "" : data.height
        }),
        maxSpeed: Form.createFormField({
          ...props,
          value: data.maxSpeed == "null" ? "" : data.maxSpeed
        }),
        cruiseSpeed: Form.createFormField({
          ...props,
          value: data.cruiseSpeed == "null" ? "" : data.cruiseSpeed
        }),
        maxCeiling: Form.createFormField({
          ...props,
          value: data.maxCeiling == "null" ? "" : data.maxCeiling
        }),
        serviceCeiling: Form.createFormField({
          ...props,
          value: data.serviceCeiling == "null" ? "" : data.serviceCeiling
        }),
        maxRange: Form.createFormField({
          ...props,
          value: data.maxRange == "null" ? "" : data.maxRange
        }),
        actionRadius: Form.createFormField({
          ...props,
          value: data.actionRadius == "null" ? "" : data.actionRadius
        }),
        enduranceTime: Form.createFormField({
          ...props,
          value: data.enduranceTime == "null" ? "" : data.enduranceTime
        }),
        rcs: Form.createFormField({
          ...props,
          value: data.rcs == "null" ? "" : data.rcs
        })
      };
    }
  }
})(TargetTargetModel);

export default TargetTargetModel;
