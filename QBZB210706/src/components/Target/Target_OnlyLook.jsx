import React, { Component } from "react";
import style from "./Edit.css";
import styleless from "./test.less";
import GisIndex from "../../pages/Gis/GisIndex";
import { Table, Button, Select, Input, Form, Popconfirm,message } from "antd";
import { connect } from "dva";
import language from "../language/language";
import OnlyLook from "../RadarInformation/Radar_OnlyLook";
import CommitLook from "../RadarInformation/CommitLook";
import Dialog from "../../utils/DialogMask/Dialog";
import axios from "axios";
import responseStatus  from "../../utils/initCode"

@connect(({ fodder, changeC, language, ElectronicTarget }) => ({
  fodder,
  changeC,
  language,
  ElectronicTarget
}))
class TargetOnlyLook extends Component {
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
      selectedRowsPTGZ_commit: null //平台挂载雷达信息的选择的通信目标内码
    };
  }

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
    this.props.dispatch({
      type: "ElectronicTarget/selectPlaneLineBtn",
      payload: 1
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
    let { dispatch } = this.props;
    dispatch({
      type: "fodder/ClearMap",
      payload: {
        mark: "clear"
      }
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

  // 相关资料里面的操作列查看
  handleLookMsg = (num, name, type) => {
    let ip = this.props.language.showMaterialIp;
    var str = "";
    str = num + "," + name;
    let routerMsg;
    if (typeof window.getUrl == "function") {
      routerMsg = window.getUrl() + "/api";
    } else {
      routerMsg = "http://192.168.0.107:8087";
    }
    if (type === "图片") {
      this.setState({
        LookImg: true,
        flagImg: false
      });
      let urll;
      if (typeof window.getUrl == "function") {
        urll = window.getUrl() + "/api/LK-0313036/LK036";
      } else {
        urll = "http://192.168.0.107:8087";
      }
      axios({
        method: "get",
        url: urll + "/SynthInformationReorganize/watchFile",
        params: {
          fileName: str,
          ip: this.props.language.showMaterialIp
        }
      })
        .then(res => {
          if (res && res.data) {
            document.getElementById("showImgTarget").src =
              routerMsg + res.data[0];
          }
        })
        .catch(error => {
          error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
        });
    } else if (type === "视频") {
      this.setState({
        LookVideo: true,
        flagVideo: false
      });
      let urll;
      if (typeof window.getUrl == "function") {
        urll = window.getUrl() + "/api/LK-0313036/LK036";
      } else {
        urll = "http://192.168.0.107:8087";
      }
      axios({
        method: "get",
        url: urll + "/SynthInformationReorganize/watchFile",
        params: {
          fileName: str,
          ip: this.props.language.showMaterialIp
        }
      })
        .then(res => {
          if (res && res.data) {
            document.getElementById("videoTarget").src =
              routerMsg + res.data[0];
            document.getElementById("videoTarget").play();
          }
        })
        .catch(error => {
          error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
        });
    } else if (type === "网页") {
      this.setState({
        LookHtml: true,
        flagHtml: false
      });
      let urll;
      if (typeof window.getUrl == "function") {
        urll = window.getUrl() + "/api/LK-0313036/LK036";
      } else {
        urll = "http://192.168.0.107:8087";
      }
      axios({
        method: "get",
        url: urll + "/SynthInformationReorganize/watchFile",
        params: {
          fileName: str,
          ip: this.props.language.showMaterialIp
        }
      })
        .then(res => {
          if (res && res.data) {
            window.open(routerMsg + res.data[0], "_blank");
          }
        })
        .catch(error => {
          error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
        });
    } else if (type === "文档") {
      this.setState({
        LookDoc: true,
        flagDoc: false
      });
      let urll;
      if (typeof window.getUrl == "function") {
        urll = window.getUrl() + "/api/LK-0313036/LK036";
      } else {
        urll = "http://192.168.0.107:8087";
      }
      axios({
        method: "get",
        url: urll + "/SynthInformationReorganize/watchFile",
        params: {
          fileName: str,
          ip: this.props.language.showMaterialIp
        }
      })
        .then(res => {
          if (res && res.data) {
            window.open(routerMsg + res.data[0], "_blank");
          }
        })
        .catch(error => {
          error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
        });
    }
  };

  handleCancelLookImg = () => {
    if (this.state.flagImg === true) {
      this.setState({
        LookImg: false,
        visibleImg: true
      });
    } else {
      this.setState({
        LookImg: false,
        visibleImg: false
      });
    }
  };
  handleCancelLookVideo = () => {
    if (this.state.flagVideo === true) {
      this.setState({
        LookVideo: false,
        visibleVedio: true
      });
    } else {
      this.setState({
        LookVideo: false,
        visibleVedio: false
      });
    }
    document.getElementById("videoTarget").pause();
  };

  handleCancelLookHtml = () => {
    this.setState({
      LookHtml: false
    });
  };

  handleCancelLookDoc = () => {
    if (this.state.flagDoc === true) {
      this.setState({
        LookDoc: false,
        visibleDoc: true
      });
    } else {
      this.setState({
        LookDoc: false,
        visibleDoc: false
      });
    }
  };
  handleZoom = e => {
    let { clientWidth, style } = this.refs.zoomImg;
    if (e.nativeEvent.deltaY <= 0 && clientWidth < 900) {
      style.width = clientWidth + 15 + "px"; //图片宽度每次增加10
      style.left = style.left - (1 % +"px"); //随你设置
    } else if (e.nativeEvent.deltaY > 0) {
      if (clientWidth > 400) {
        style.width = clientWidth - 15 + "px"; //图片宽度
        style.left = style.left + (1 % +"px");
      } else {
        style.left = 0;
      }
    }
  };
  render() {
    const paginationProps = {
      pageSize: 5
    };
    const { TextArea } = Input;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const FormItem = Form.Item;
    const Option = Select.Option;

    //平台挂载通信装备信息的多选
    const { selectedRowKeysPTGZ_commit } = this.state;
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

    //平台挂载雷达信息的多选
    const { selectedRowKeysPTGZ_radar } = this.state;
    const rowSelectionPTGZ_radar = {
      selectedRowKeysPTGZ_radar,
      onSelect: (record, selected, selectedRowsPTGZ_radar) => {
        let arr = [];
        let data = selectedRowsPTGZ_radar;
        for (var i = 0; i < selectedRowsPTGZ_radar.length; i++) {
          let modelRadarName;
          let forRadarName;
          let threadRadarName;
          let countryRadarName;
          for (let j = 0; j < language.targetType.length; j++) {
            //目标型号
            if (
              data[i] &&
              data[i].modelRadarName ==
                language.targetType[j][
                  `name_${this.props.language.getlanguages}`
                ]
            ) {
              modelRadarName = language.targetType[j].value;
            }
          }
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
            modelRadarName: modelRadarName,
            forRadarName: forRadarName,
            threadRadarName: threadRadarName,
            countryRadarName: countryRadarName
          });
        }
        this.setState({ selectedRowsPTGZ_radar: arr });
      },
      onSelectAll: (selected, selectedRowsPTGZ_radar, changeRows) => {
        let arr = [];
        let data = selectedRowsPTGZ_radar;
        for (var i = 0; i < selectedRowsPTGZ_radar.length; i++) {
          let modelRadarName;
          let forRadarName;
          let threadRadarName;
          let countryRadarName;
          for (let j = 0; j < language.targetType.length; j++) {
            //目标型号
            if (
              data[i] &&
              data[i].modelRadarName ==
                language.targetType[j][
                  `name_${this.props.language.getlanguages}`
                ]
            ) {
              modelRadarName = language.targetType[j].value;
            }
          }
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
            modelRadarName:
              modelRadarName || selectedRowsPTGZ_radar[i].modelRadarName,
            forRadarName:
              forRadarName || selectedRowsPTGZ_radar[i].forRadarName,
            threadRadarName:
              threadRadarName || selectedRowsPTGZ_radar[i].threadRadarName,
            countryRadarName:
              countryRadarName || selectedRowsPTGZ_radar[i].countryRadarName
          });
        }
        this.setState({ selectedRowsPTGZ_radar: arr });
      }
    };
    // 平台挂载雷达信息==添加弹出框中的
    const column_PDGZ_radarMsg = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`radarTargetCode_${this.props.language.getlanguages}`],
        dataIndex: "radarCode"
      },
      {
        title: language[`radarName_${this.props.language.getlanguages}`],
        dataIndex: "objectRadarName"
      },
      {
        title: language[`TargetModel_${this.props.language.getlanguages}`],
        dataIndex: "modelRadarName"
      },
      {
        title: language[`FriendOrFoeProperties_${this.props.language.getlanguages}`],
        dataIndex: "forRadarName"
      },
      {
        title: language[`threatLevel_${this.props.language.getlanguages}`],
        dataIndex: "threadRadarName"
      },
      {
        title: language[`countryOrRegion_${this.props.language.getlanguages}`],
        dataIndex: "countryRadarName"
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
        dataIndex: "radarCode"
      },
      {
        title: language[`radarName_${this.props.language.getlanguages}`],
        dataIndex: "objectRadarName"
      },
      {
        title: language[`TargetModel_${this.props.language.getlanguages}`],
        dataIndex: "modelRadarName"
      },
      {
        title: language[`FriendOrFoeProperties_${this.props.language.getlanguages}`],
        dataIndex: "forRadarName"
      },
      {
        title: language[`threatLevel_${this.props.language.getlanguages}`],
        dataIndex: "threadRadarName"
      },
      {
        title: language[`countryOrRegion_${this.props.language.getlanguages}`],
        dataIndex: "countryRadarName"
      }
      //  {
      //     title: language[`detailedInformation_${this.props.language.getlanguages}`],
      //     dataIndex: 'operate',
      //     render: (text, record) => (
      //         <div>
      //             <a onClick={() => this.handleLookRadar(record.objectRadarName)}>{language[`lookOver_${this.props.language.getlanguages}`]}</a>&nbsp;&nbsp;
      //         </div>
      //     )
      // }
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
        let modelRadarName;
        let forRadarName;
        let threadRadarName;
        let countryRadarName;
        for (let j = 0; j < language.targetType.length; j++) {
          //目标型号
          if (
            data[i] &&data[i].modelRadarName == language.targetType[j].value
          ) {
            modelRadarName =language.targetType[j][
                `name_${this.props.language.getlanguages}`
              ];
          }
        }
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
          modelRadarName: modelRadarName || data[i].modelRadarName,
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
      for (let i = 0; i < data.length; i++) {
        dataSource_Dialog.push({
          key: i + 1,
          radarCode: data[i].radarCode,
          objectRadarName: data[i].objectRadarName,
          modelRadarName: data[i].modelRadarName,
          forRadarName: data[i].forRadarName,
          threadRadarName: data[i].threadRadarName,
          countryRadarName: data[i].countryRadarName
        });
      }
    }

    //平台挂载通信装备信息的多选
    const rowSelectionPTGZ_commit = {
      selectedRowKeysPTGZ_commit,
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
      }
    };
    //平台挂在通信装备信息
    const column_PDGZ_commitMsg = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`CommitCode_${this.props.language.getlanguages}`],
        dataIndex: "commuCode"
      },
      {
        title: language[`CommitTargetName_${this.props.language.getlanguages}`],
        dataIndex: "objectCommuName"
      },
      {
        title: language[`TargetModel_${this.props.language.getlanguages}`],
        dataIndex: "modelCommuName"
      },
      {
        title: language[`FriendOrFoeProperties_${this.props.language.getlanguages}`],
        dataIndex: "forCommuName"
      },
      {
        title: language[`threatLevel_${this.props.language.getlanguages}`],
        dataIndex: "threadCommuName"
      },
      {
        title: language[`countryOrRegion_${this.props.language.getlanguages}`],
        dataIndex: "countryCommuName"
      }
    ];
    const column_PDGZ_commitMsg_pageTable = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`CommitCode_${this.props.language.getlanguages}`],
        dataIndex: "commuCode"
      },
      {
        title: language[`CommitTargetName_${this.props.language.getlanguages}`],
        dataIndex: "objectCommuName"
      },
      {
        title: language[`TargetModel_${this.props.language.getlanguages}`],
        dataIndex: "modelCommuName"
      },
      {
        title: language[`FriendOrFoeProperties_${this.props.language.getlanguages}`],
        dataIndex: "forCommuName"
      },
      {
        title: language[`threatLevel_${this.props.language.getlanguages}`],
        dataIndex: "threadCommuName"
      },
      {
        title: language[`countryOrRegion_${this.props.language.getlanguages}`],
        dataIndex: "countryCommuName"
      }
      // {
      //     title: language[`detailedInformation_${this.props.language.getlanguages}`],
      //     dataIndex: 'operate',
      //     render: (text, record) => (
      //         <div>
      //             <a onClick={() => this.handleLookCommit(record.commuCode)}>{language[`lookOver_${this.props.language.getlanguages}`]}</a>&nbsp;&nbsp;
      //         </div>
      //     )
      // }
    ];
    //目标库中航迹信息数据
    // const dataSource = [];
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
    // const dataSource_Dialog = [];
    if (this.props.ElectronicTarget.PTGZ_commitMsg_dialog_data) {
      let data = this.props.ElectronicTarget.PTGZ_commitMsg_dialog_data;
      for (let i = 0; i < data.length; i++) {
        dataSource_Dialog.push({
          key: i + 1,
          index: i + 1,
          commuCode: data[i].commuCode,
          objectCommuName: data[i].objectCommuName,
          modelCommuName: data[i].modelCommuName,
          forCommuName: data[i].forCommuName,
          threadCommuName: data[i].threadCommuName,
          countryCommuName: data[i].countryCommuName
        });
      }
    }
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

    //图片的列表
    const columnsImg = [
      {
        title: language[`number_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`materialNumber_${this.props.language.getlanguages}`],
        dataIndex: "fileId"
      },
      {
        title: language[`materialName_${this.props.language.getlanguages}`],
        dataIndex: "fileName"
      },
      {
        title: language[`MaterialSource_${this.props.language.getlanguages}`],
        dataIndex: "fileSource"
      },
      {
        title: language[`operation_${this.props.language.getlanguages}`],
        render: (text, record) => (
          <div>
            <a
              onClick={() =>
                this.handleLookMsg(record.fileId, record.fileName, "图片")
              }
            >
              {language[`lookOver_${this.props.language.getlanguages}`]}
            </a>
            &nbsp;&nbsp;
          </div>
        )
      }
    ];
    //视频的列表
    const columnsVideo = [
      {
        title: language[`number_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`materialNumber_${this.props.language.getlanguages}`],
        dataIndex: "fileId"
      },
      {
        title: language[`materialName_${this.props.language.getlanguages}`],
        dataIndex: "fileName",
        key: "fileName"
      },
      {
        title: language[`MaterialSource_${this.props.language.getlanguages}`],
        dataIndex: "fileSource",
        key: "fileSource"
      },
      {
        title: language[`operation_${this.props.language.getlanguages}`],
        render: (text, record) => (
          <div>
            <a
              onClick={() =>
                this.handleLookMsg(record.fileId, record.fileName, "视频")
              }
            >
              {language[`lookOver_${this.props.language.getlanguages}`]}
            </a>
            &nbsp;&nbsp;
          </div>
        )
      }
    ];
    //网页的列表
    const columnsHtml = [
      {
        title: language[`number_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`materialNumber_${this.props.language.getlanguages}`],
        dataIndex: "fileId"
      },
      {
        title: language[`materialName_${this.props.language.getlanguages}`],
        dataIndex: "fileName"
      },
      {
        title: language[`MaterialSource_${this.props.language.getlanguages}`],
        dataIndex: "fileSource"
      },
      {
        title: language[`operation_${this.props.language.getlanguages}`],
        render: (text, record) => (
          <div>
            <a
              onClick={() =>
                this.handleLookMsg(record.fileId, record.fileName, "网页")
              }
            >
              {language[`lookOver_${this.props.language.getlanguages}`]}
            </a>
            &nbsp;&nbsp;
          </div>
        )
      }
    ];
    //文档的列表
    const columnsDoc = [
      {
        title: language[`number_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`materialNumber_${this.props.language.getlanguages}`],
        dataIndex: "fileId"
      },
      {
        title: language[`materialName_${this.props.language.getlanguages}`],
        dataIndex: "fileName"
      },
      {
        title: language[`MaterialSource_${this.props.language.getlanguages}`],
        dataIndex: "fileSource"
      },
      {
        title: language[`operation_${this.props.language.getlanguages}`],
        render: (text, record) => (
          <div>
            <a
              onClick={() =>
                this.handleLookMsg(record.fileId, record.fileName, "文档")
              }
            >
              {language[`lookOver_${this.props.language.getlanguages}`]}
            </a>
            &nbsp;&nbsp;
          </div>
        )
      }
    ];

    //页面中素材的表格的数据--图片
    let imgTabledata = [];
    let fileSource;
    let imgTabledataCache = this.props.ElectronicTarget.imgData_Special
      ? this.props.ElectronicTarget.imgData_Special
      : [];
    for (let i = 0; i < imgTabledataCache.length; i++) {
      if (
        imgTabledataCache[i].fileSource === "上级" ||
        imgTabledataCache[i].fileSource ===
          language[`superior_${this.props.language.getlanguages}`]
      ) {
        fileSource = language[`superior_${this.props.language.getlanguages}`];
      } else if (
        imgTabledataCache[i].fileSource === "本级" ||
        imgTabledataCache[i].fileSource ==
          language[`level_${this.props.language.getlanguages}`]
      ) {
        fileSource = language[`level_${this.props.language.getlanguages}`];
      }
      imgTabledata.push({
        key: i + 1,
        fileId: imgTabledataCache[i].fileId,
        fileName: imgTabledataCache[i].fileName,
        fileSource: fileSource
      });
    }
    //页面中素材的表格的数据--视频
    let videoTabledata = [];
    let fileSourceVideo;
    let videoTabledataCache = this.props.ElectronicTarget.videoData_Special
      ? this.props.ElectronicTarget.videoData_Special
      : [];
    for (let i = 0; i < videoTabledataCache.length; i++) {
      if (
        videoTabledataCache[i].fileSource === "上级" ||
        videoTabledataCache[i].fileSource ===
          language[`superior_${this.props.language.getlanguages}`]
      ) {
        fileSourceVideo =
          language[`superior_${this.props.language.getlanguages}`];
      } else if (
        videoTabledataCache[i].fileSource === "本级" ||
        videoTabledataCache[i].fileSource ==
          language[`level_${this.props.language.getlanguages}`]
      ) {
        fileSourceVideo = language[`level_${this.props.language.getlanguages}`];
      }
      videoTabledata.push({
        key: i + 1,
        fileId: videoTabledataCache[i].fileId,
        fileName: videoTabledataCache[i].fileName,
        fileSource: fileSourceVideo
      });
    }
    //页面中素材的表格的数据--网页
    let htmlTabledata = [];
    let fileSourceHtml;
    let htmlTabledataCache = this.props.ElectronicTarget.htmlData_Special
      ? this.props.ElectronicTarget.htmlData_Special
      : [];
    for (let i = 0; i < htmlTabledataCache.length; i++) {
      if (
        htmlTabledataCache[i].fileSource === "上级" ||
        htmlTabledataCache[i].fileSource ===
          language[`superior_${this.props.language.getlanguages}`]
      ) {
        fileSourceHtml =
          language[`superior_${this.props.language.getlanguages}`];
      } else if (
        htmlTabledataCache[i].fileSource === "本级" ||
        htmlTabledataCache[i].fileSource ==
          language[`level_${this.props.language.getlanguages}`]
      ) {
        fileSourceHtml = language[`level_${this.props.language.getlanguages}`];
      }
      htmlTabledata.push({
        key: i + 1,
        fileId: htmlTabledataCache[i].fileId,
        fileName: htmlTabledataCache[i].fileName,
        fileSource: fileSourceHtml
      });
    }

    //页面中素材的表格的数据--文档
    let docTabledata = [];
    let fileSourceDoc;
    let docTabledataCache = this.props.ElectronicTarget.docData_Special
      ? this.props.ElectronicTarget.docData_Special
      : [];
    for (let i = 0; i < docTabledataCache.length; i++) {
      if (
        docTabledataCache[i].fileSource === "上级" ||
        docTabledataCache[i].fileSource ===
          language[`superior_${this.props.language.getlanguages}`]
      ) {
        fileSourceDoc =
          language[`superior_${this.props.language.getlanguages}`];
      } else if (
        docTabledataCache[i].fileSource === "本级" ||
        docTabledataCache[i].fileSource ==
          language[`level_${this.props.language.getlanguages}`]
      ) {
        fileSourceDoc = language[`level_${this.props.language.getlanguages}`];
      }
      docTabledata.push({
        key: i + 1,
        fileId: docTabledataCache[i].fileId,
        fileName: docTabledataCache[i].fileName,
        fileSource: fileSourceDoc
      });
    }

    return (
      <div>
        {/* 从目标库导入的内容 */}
        <div className={style.FirstBoxMin} style={{ width: "943px" }}>
          <div>
            <Form className={styleless.myBandForm}>
              <div className={styleless.onlyLookBox}>
                {/* 基本信息 */}
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
                        {getFieldDecorator("objectName", {
                          rules: [{}]
                        })(<Input type="text" id="objectName" disabled />)}
                      </FormItem>
                    </div>
                    <div>
                      {language[`TargetModel_${this.props.language.getlanguages}`]}
                    </div>
                    <div>
                      <FormItem>
                        {getFieldDecorator("modelName", {
                          initialValue: "1"
                        })(
                          <Select id="modelName" disabled>
                            <Option value="1">
                              {language[`notClear_${this.props.language.getlanguages}`]}
                            </Option>
                            <Option value="2">E-2K</Option>
                            <Option value="3">这是电子目标型号</Option>
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
                          <Select disabled>
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
                        {getFieldDecorator("countryName", {
                          initialValue: "004"
                        })(
                          <Select disabled>
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
                        {getFieldDecorator("forName", {
                          initialValue: "01"
                        })(
                          <Select disabled>
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
                          <Select disabled>
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
                          rules: [{}]
                        })(<Input type="text" disabled />)}
                      </FormItem>
                    </div>
                    <div>
                      {language[`DeploymentInformation_${this.props.language.getlanguages}`]}
                    </div>
                    <div>
                      <FormItem>
                        {getFieldDecorator("deployInformation", {
                          rules: [{}]
                        })(<Input type="text" disabled />)}
                      </FormItem>
                    </div>
                    <div>
                      {language[`producer_${this.props.language.getlanguages}`]}
                    </div>
                    <div>
                      <FormItem>
                        {getFieldDecorator("manufacturer", {
                          rules: [{}]
                        })(<Input type="text" disabled />)}
                      </FormItem>
                    </div>
                    {
                      <>
                        <div />
                        <div />
                      </>
                    }
                    <div className={style.Textarea_title}>
                      {language[`ActiveAreaDescription_${this.props.language.getlanguages}`]}
                    </div>
                    <div className={style.Textarea_Content}>
                      <FormItem>
                        {getFieldDecorator("activeAreaDescription", {
                          rules: [{}]
                        })(
                          <TextArea
                            disabled
                            className={style.tableColTextCon}
                            style={{
                              height: "72px",
                              overflowY: "scroll",
                              resize: "none"
                            }}
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
                          rules: [{}]
                        })(
                          <TextArea
                            disabled
                            className={style.tableColTextCon}
                            style={{
                              height: "72px",
                              overflowY: "scroll",
                              resize: "none"
                            }}
                          />
                        )}
                      </FormItem>
                    </div>
                  </div>
                </div>
              </div>
              {/* 平台战技术特征 */}
              <div className={style.ContentPSkill}>
                <div className={style.subhead}>
                  <div style={{ margin: "5px 10px", float: "left" }}>
                    {language[`TechnicalParamPlatformWarfare_${
                          this.props.language.getlanguages
                        }`
                      ]
                    }
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
                        rules: [{}]})(<Input type="text" disabled />)}
                    </FormItem>
                  </div>
                  <div>
                    {language[`Wingspan_${this.props.language.getlanguages}`]}[m]
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("wingSpan", {
                        rules: [{}]})(<Input type="text" disabled />)}
                    </FormItem>
                  </div>
                  <div>
                    {language[`PlaneHeight_${this.props.language.getlanguages}`]}[m]
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("height", {
                        rules: [{}]})(<Input type="text" disabled />)}
                    </FormItem>
                  </div>
                  <div>
                    {language[`MaximumSpeed_${this.props.language.getlanguages}`]}[km]
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("maxSpeed", {
                        rules: [{}]})(<Input type="text" disabled />)}
                    </FormItem>
                  </div>
                  <div>
                    {language[`CruisingSpeed_${this.props.language.getlanguages}`]}[km]
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("cruiseSpeed", {
                        rules: [{}]})(<Input type="text" disabled />)}
                    </FormItem>
                  </div>
                  <div>
                    {language[`maximumCeiling_${this.props.language.getlanguages}`]}[m]
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("maxCeiling", {
                        rules: [{}]})(<Input type="text" disabled />)}
                    </FormItem>
                  </div>
                  <div>
                    {language[`serviceCeiling_${this.props.language.getlanguages}`]}[m]
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("serviceCeiling", {
                        rules: [{}]})(<Input type="text" disabled />)}
                    </FormItem>
                  </div>
                  <div>
                    {language[`maximumRange_${this.props.language.getlanguages}`]}[km]
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("maxRange", {
                        rules: [{}]})(<Input type="text" disabled />)}
                    </FormItem>
                  </div>
                  <div>
                    {language[`actionRadius_${this.props.language.getlanguages}`]}[km]
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("actionRadius", {
                        rules: [{}]})(<Input type="text" disabled />)}
                    </FormItem>
                  </div>
                  <div>
                    {language[`XuHangTime_${this.props.language.getlanguages}`]}[h]
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("enduranceTime", {
                        rules: [{}]})(<Input type="text" disabled />)}
                    </FormItem>
                  </div>
                  <div>
                    {language[`AverageRCS_${this.props.language.getlanguages}`]}[㎡]
                  </div>
                  <div>
                    <FormItem>
                      {getFieldDecorator("rcs", {
                        rules: [{}]})(<Input type="text" disabled />)}
                    </FormItem>
                  </div>
                  <div />
                  <div />
                </div>
              </div>

              {/* 平台挂载雷达信息*/}
              <div className={style.ContentPSkill}>
                <div>
                  <div className={style.subhead}>
                    {/* 平台挂载雷达信息 */}
                    <div style={{ margin: "5px 10px", float: "left" }}>
                      {language[`platformMountRadarInfo_${this.props.language.getlanguages}`]}
                    </div>
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
                      />
                    </div>
                    <div>
                      <Dialog
                        TitleText={language[`platformMountRadarInfo_${this.props.language.getlanguages}`]}
                        showDialog={this.state.visbleRadar}
                        onOk={this.handleOkAdd}
                        onCancel={this.handleRadar}
                        className={styleless.mybob}
                        okText={language[`SureToAdd_${this.props.language.getlanguages}`]}
                        cancelText={language[`quit_${this.props.language.getlanguages}`]
                        }
                        closeDialog={this.handleRadar}
                        showMask
                        BodyContent={
                          <div style={{ height: "600px", overflowY: "scroll" }}>
                            <OnlyLook data={this.state.PTGZRadarData} />
                          </div>
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 平台挂载通信装备信息*/}
              <div className={style.ContentPSkill}>
                <div>
                  <div className={style.subhead}>
                    <div style={{ margin: "5px 10px", float: "left" }}>
                      {language[`platformMountCommitInfo_${this.props.language.getlanguages}`]}
                    </div>
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
                      />
                    </div>
                    <Dialog
                      TitleText={language[`platformMountCommitInfo_${this.props.language.getlanguages}`]}
                      showDialog={this.state.visbleCommit}
                      onOk={this.handleOkAdd}
                      onCancel={this.handleCommit}
                      className={styleless.mybob}
                      okText={language[`SureToAdd_${this.props.language.getlanguages}`]}
                      cancelText={language[`quit_${this.props.language.getlanguages}`]}
                      closeDialog={this.handleCommit}
                      LEFT="400px"
                      TOP="660px"
                      BodyContent={
                        <div style={{ height: "600px", overflowY: "scroll" }}>
                          <CommitLook
                            data={this.state.PTGZCommitData}
                            showDialog={this.state.visbleCommit}
                          />
                        </div>
                      }
                    />
                  </div>
                </div>
              </div>

              {/* 目标航迹信息 */}
              <div className={style.ContentPSkill}>
                <div className={style.subhead}>
                  <div style={{ margin: "5px 10px", float: "left" }}>
                    {language[`TargetTrackInformation_${
                          this.props.language.getlanguages
                        }`
                      ]
                    }
                  </div>
                </div>
                <div className={style.clearFloat}>
                  {/* 左边的两个表格 */}
                  <div style={{ float: "left" }}>
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
                        {/* <Button type="primary" className={style.mapBtn} onClick={this.showMap}>{language[`LookTargetatrackMap_${this.props.language.getlanguages}`]}</Button> */}
                        <Dialog
                          TitleText={language[`TargetTrackSituationMap_${this.props.language.getlanguages}`]}
                          showDialog={this.state.showMapVisible}
                          onOk={this.handleOkAdd}
                          onCancel={this.handleCancelMap}
                          className={styleless.mybob}
                          okText={language[`SureToAdd_${this.props.language.getlanguages}`]}
                          cancelText={
                            language[`quit_${this.props.language.getlanguages}`]
                          }
                          closeDialog={this.closeDialog}
                          LEFT="282px"
                          TOP={
                            this.props.modelMark === "third"
                              ? "1335px"
                              : "1200px"
                          }
                          BodyContent={
                            <div
                              style={{
                                width: "1261px",
                                height: "500px",
                                border: "1px solid #ddd",
                                overflow: "hidden"
                              }}
                            >
                              {/* <Map show={this.state.showMapVisible} /> */}
                              {this.state.showMapVisible ? <GisIndex /> : null}
                            </div>
                          }
                        />
                      </div>
                    </div>
                    <div className={style.tablecon_target}>
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
                        {language[`TargetTrackPointInformation_${this.props.language.getlanguages}`]}
                      </div>
                    </div>
                    <div
                      className={style.tablecon_target}
                      style={{ marginBottom: "20px" }}
                    >
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
            <div className={style.ContentBasic} style={{ width: "943px" }}>
              <div className={style.subhead} style={{ marginBottom: "20px" }}>
                <div style={{ margin: "5px 10px" }}>
                  {language[`relatedData_${this.props.language.getlanguages}`]}
                </div>
              </div>
              <div>
                <div className={style.relateMsg_Con_Min}>
                  {/* 左边的图片 */}
                  <div>
                    <div className={style.subhead_ralateMsg}>
                      <div
                        style={{
                          margin: "5px 10px",
                          width: "100px",
                          float: "left"
                        }}
                      >
                        {language[`picture_${this.props.language.getlanguages}`]}
                      </div>
                    </div>
                    {/* 文件列表 */}
                    <div className={style.TableContent}>
                      <Table
                        rowKey={record => record.fileId}
                        columns={columnsImg}
                        dataSource={imgTabledata}
                        className={styleless.myClass}
                        rowClassName={(record, index) =>
                          index % 2 === 0 ? styleless.odd : styleless.even
                        } //奇偶行颜色交替变化
                        pagination={paginationProps}
                      />
                    </div>
                    <Dialog
                      BodyContent={
                        <div className={style.popFodderTypeImg}>
                          {/*上传后的文件列表*/}
                          <div className={style.uploadtableImg}>
                            <div
                              style={{
                                minWidth: "300px",
                                maxWidth: "900px",
                                minHeight: "300px",
                                maxHeight: "600px",
                                overflow: "hidden",
                                position: "relative"
                              }}
                            >
                              <div id="imgBox">
                                <img
                                  src=""
                                  ref="zoomImg"
                                  style={{ width: "600px", float: "left" }}
                                  onWheel={this.handleZoom}
                                  alt=""
                                  id="showImgTarget"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      }
                      showDialog={this.state.LookImg}
                      showMask
                      TitleText={language[`viewPicture_${this.props.language.getlanguages}`]}
                      okText={language[`confirm_${this.props.language.getlanguages}`]}
                      CancleText={language[`cancel_${this.props.language.getlanguages}`]}
                      onCancel={this.handleCancelLookImg}
                      onOk={this.handleOk}
                      className={styleless.basicpop}
                    />
                  </div>

                  {/* 右边的视频 */}
                  <div>
                    <div className={style.subhead_ralateMsg}>
                      <div
                        style={{
                          margin: "5px 10px",
                          width: "100px",
                          float: "left"
                        }}
                      >
                        {language[`video_${this.props.language.getlanguages}`]}
                      </div>
                    </div>
                    {/* 文件列表 */}
                    <div className={style.TableContent}>
                      <Table
                        rowKey={record => record.fileId}
                        columns={columnsVideo}
                        dataSource={videoTabledata}
                        className={styleless.myClass}
                        rowClassName={(record, index) =>
                          index % 2 === 0 ? styleless.odd : styleless.even
                        } //奇偶行颜色交替变化
                        pagination={paginationProps}
                      />
                    </div>
                    <Dialog
                      BodyContent={
                        <div className={style.popFodderType_relate}>
                          {/*上传后的文件列表*/}
                          <div className={style.uploadtable}>
                            <div
                              style={{
                                width: "600px",
                                height: "300px",
                                overflow: "hidden",
                                position: "relative"
                              }}
                            >
                              <video
                                id="videoTarget"
                                width="600"
                                height="300"
                                controls
                                controlsList="nodownload  noremoteplayback"
                                disablePictureInPicture="return true"
                                onContextMenu="return false"
                              />
                            </div>
                          </div>
                        </div>
                      }
                      showDialog={this.state.LookVideo}
                      showMask
                      Width="655px"
                      bHeight="400px"
                      TitleText={language[`viewVideo_${this.props.language.getlanguages}`]}
                      okText={language[`confirm_${this.props.language.getlanguages}`]}
                      CancleText={language[`cancel_${this.props.language.getlanguages}`]}
                      onCancel={this.handleCancelLookVideo}
                      onOk={this.handleOk}
                      className={styleless.basicpop}
                    />
                  </div>
                </div>

                <div
                  className={style.relateMsg_Con_Min}
                  style={{ marginBottom: "90px" }}
                >
                  {/* 左边的网页 */}
                  <div>
                    <div className={style.subhead_ralateMsg}>
                      <div
                        style={{
                          margin: "5px 10px",
                          width: "100px",
                          float: "left"
                        }}
                      >
                        {language[`webPage_${this.props.language.getlanguages}`]}
                      </div>
                    </div>
                    {/* 文件列表 */}
                    <div className={style.TableContent}>
                      <Table
                        rowKey={record => record.fileId}
                        columns={columnsHtml}
                        dataSource={htmlTabledata}
                        className={styleless.myClass}
                        rowClassName={(record, index) =>
                          index % 2 === 0 ? styleless.odd : styleless.even
                        } //奇偶行颜色交替变化
                        pagination={paginationProps}
                      />
                    </div>
                  </div>

                  {/* 右边的文档 */}
                  <div>
                    <div className={style.subhead_ralateMsg}>
                      <div
                        style={{
                          margin: "5px 10px",
                          width: "100px",
                          float: "left"
                        }}
                      >
                        {language[`document_${this.props.language.getlanguages}`]}
                      </div>
                    </div>
                    {/* 文件列表 */}
                    <div className={style.TableContent}>
                      <Table
                        rowKey={record => record.fileId}
                        columns={columnsDoc}
                        dataSource={docTabledata}
                        className={styleless.myClass}
                        rowClassName={(record, index) =>
                          index % 2 === 0 ? styleless.odd : styleless.even
                        } //奇偶行颜色交替变化
                        pagination={paginationProps}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TargetOnlyLook = Form.create({
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
          value: data.modelName == "null" ? "" : data.modelName
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
})(TargetOnlyLook);

export default TargetOnlyLook;
