import React, { Component } from "react";
import { connect } from "dva";
import style from "./Edit.css";
import styleless from "./test.less";
import { Select, Input, Form, Table, Tabs, message } from "antd";
import language from "../language/language";
import Charts from "./TargetLibraryCharts";
import axios from "axios";
import Dialog from "../../utils/DialogMask/Dialog";
import responseStatus from "../../utils/initCode";
// 增加样本并实现tab切换效果
const TabPane = Tabs.TabPane;
@connect(({ language, radarModel }) => ({ language, radarModel }))
class OnlyLook extends Component {
  constructor(props) {
    super(props);
    this.newTabIndex = 1;
    let panes = [
      //初始样本，只有一个标签页，显示样本1
      {
        title: language[`Sample1_${this.props.language.getlanguages}`],
        key: "1"
      }
    ];
    this.state = {
      rowId: -1, //工作模式当前被点击的行
      modeId: null, //工作模式当前被点击的行的模式内码
      activeKey: panes[0].key, //当前显示的tabs的key
      panes, //tab的标签的名称和key
      visible: false,
      selectedRowKeysZC: "",
      selectedRowKeysZCName: "",
      data1: null,
      chartsData: [[]],
      mark: true,
      selectedRowMarkKey: "", //当前显示的tabs的key
      selectedRowMarkCode: "", //当前显示的tabs的code
      selectedRowMarkFileName: "", //当前显示的tabs的fileName
      selectedRowMarkElect: "",
      chartsList: null,
      name: "" //侦察信号名称
    };
  }

  componentWillUnmount() {
    //页面卸载的时候清除缓存
    this.props.dispatch({
      type: "radarModel/clearAllMsg"
    });
    this.props.dispatch({
      type: "radarModel/deleteCache"
    });
  }

  UNSAFE_componentWillReceiveProps({ radarModel }) {
    this.setState({ chartsList: radarModel.sourceOfRadiationList }); //如果点击从目标库导入或者编辑查询到的图表list

    // 1.根据查询出来的有多少条数据，渲染出来多少个tabs(json数据不一定存在，list数据一定存在)
    if (radarModel.sourceOfRadiationList) {
      let data = radarModel.sourceOfRadiationList;
      let panes = [];
      let activeKey = data.length + ""; //设置activeKey为panes数据数组中最后一个key+1
      let name = data[data.length - 1] ? data[data.length - 1].fileName : "";
      for (let i = 0; i < data.length; i++) {
        panes.push({
          title: `${language[`WaveformData_${this.props.language.getlanguages}`]
            }${i + 1}`, //设置title为panes数据数组中最后一个key+1
          key: i + 1
        });
      }
      this.setState({ panes, activeKey, name });

      if (radarModel.ChartsJSONList) {
        let data = radarModel.ChartsJSONList;
        let dataSource = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i] != null) {
            dataSource[i + 1] = [];
            if (data[i][0]) {
              dataSource[i + 1][0] = data[i][0]["波形数据_雷抗"]["幅度时间图"];
              dataSource[i + 1][1] = data[i][0]["波形数据_雷抗"]["频率时间图"];
              dataSource[i + 1][2] = data[i][0]["波形数据_雷抗"]["相位时间图"];
              dataSource[i + 1][3] = data[i][0]["波形数据_雷抗"]["包络时间图"];
              dataSource[i + 1][4] = data[i][0]["波形数据_雷抗"]["功率谱图"];
              dataSource[i + 1][5] = data[i][0]["波形数据_雷抗"]["频谱图"];
              dataSource[i + 1][6] = data[i][0]["波形数据_雷抗"]["STFT图"];
              dataSource[i + 1][7] = data[i][0]["波形数据_雷抗"]["STFT叠加图"];
              dataSource[i + 1][8] = data[i][0]["全脉冲序列"]["频率时间图"];
              dataSource[i + 1][9] = data[i][0]["全脉冲序列"]["脉宽时间图"];
              dataSource[i + 1][10] = data[i][0]["全脉冲序列"]["幅度时间图"];
              dataSource[i + 1][11] =
                data[i][0]["全脉冲序列"]["脉冲间隔时间图"];
            }
          }
        }
        this.setState({ chartsData: dataSource, mark: !this.state.mark });
      }
    } else {
      this.setState({
        panes: [
          //初始样本，只有一个标签页，显示样本1
          {
            title: language[`Sample1_${this.props.language.getlanguages}`],
            key: "1"
          }
        ],
        activeKey: "1",
        name: "",
        chartsData: []
      });
      return false;
    }
  }

  onChange = activeKey => {
    //切换Tab时的key
    this.setState({ activeKey }, function () {
      let name = "";
      if (this.props.radarModel.sourceOfRadiationList) {
        let data = this.props.radarModel.sourceOfRadiationList;
        if (data[this.state.activeKey - 1]) {
          name = data[this.state.activeKey - 1].fileName;
          this.setState({ name: name });
        }
      }
    });
  };

  //点击工作模式中的行  显示对应的工作模式详细内容
  clickRow = record => {
    this.setState({ modeId: record.modeId });
    let data; //工作模式原来有值
    if (this.props.data) {
      data = this.props.data.workModelList;
    }
    let momentClickWorlModelMSg;
    if (data) {
      for (let i = 0; i < data.length; i++) {
        if (record.modeId == data[i].modeId) {
          momentClickWorlModelMSg = data[i];
        }
      }
      //编辑过来的数据点击行
      if (this.props.data != null) {
        this.props.dispatch({
          type: "radarModel/sendTargetModelMsg_fromTar",
          payload: {
            modeId: record.modeId,
            momentClickWorlModelMSg: momentClickWorlModelMSg
          }
        });
      }
    }
    // 将点击的工作模式一行中的模式内码保存起来
    this.setState({ rowId: record.modeId });
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
            document.getElementById("showImg").src = routerMsg + res.data[0];
          }
        })
        .catch(error => {
          error.response !== undefined
            ? responseStatus(error.response.status)
            : message.error(`error: ${error}`);
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
            document.getElementById("my_video").src = routerMsg + res.data[0];
            document.getElementById("my_video").play();
          }
        })
        .catch(error => {
          error.response !== undefined
            ? responseStatus(error.response.status)
            : message.error(`error: ${error}`);
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
          error.response !== undefined
            ? responseStatus(error.response.status)
            : message.error(`error: ${error}`);
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
          error.response !== undefined
            ? responseStatus(error.response.status)
            : message.error(`error: ${error}`);
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
    document.getElementById("my_video").pause();
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
    const { TextArea } = Input;
    const Option = Select.Option;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const FormItem = Form.Item;
    const paginationProps = {
      pageSize: 5
    };
    const paginationProps_threePart = {
      pageSize: 5
    };
    // 工作模式的列
    const WorkModelColumns = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        // 模式内码
        title: language[`ModelCode_${this.props.language.getlanguages}`],
        dataIndex: "modeId"
      },
      {
        // 模式名称
        title: language[`patternName_${this.props.language.getlanguages}`],
        dataIndex: "modeName"
      },
      {
        // 模式用途
        title: language[`ModelUSES_${this.props.language.getlanguages}`],
        dataIndex: "purposeName"
      },
      {
        title: language[`threatLevel_${this.props.language.getlanguages}`],
        dataIndex: "modelThreadName"
      },
      {
        // 射频类型
        title: language[`RadioType_${this.props.language.getlanguages}`],
        dataIndex: "modelFreqName"
      },
      {
        // 频率上限
        title: language[`upperFrequencyLimit_${this.props.language.getlanguages}`] + "[MHz]",
        dataIndex: "modelMaxWorkFreqHz"
      },
      {
        // 频率下限
        title: language[`LowerFrequencyLimit_${this.props.language.getlanguages}`] + "[MHz]",
        dataIndex: "modelMinWorkFreqHz"
      },
      {
        //脉宽类型
        title: language[`PulseWidthType_${this.props.language.getlanguages}`],
        dataIndex: "modelPwName"
      },
      {
        //脉宽上限
        title: language[`UpperPulseWidthLimit_${this.props.language.getlanguages}`] + "[μs]",
        dataIndex: "modelMaxPwUs"
      },
      {
        //脉宽下限
        title: language[`LowerPulseWidthLimit_${this.props.language.getlanguages}`] + "[μs]",
        dataIndex: "modelMinPwUs"
      },
      {
        //重复间隔类型
        title: language[`RepetitionIntervalType_${this.props.language.getlanguages}`],
        dataIndex: "modelPriName"
      },
      {
        //重复间隔上限
        title: language[`UpperLimitInterval_${this.props.language.getlanguages}`] + "[μs]",
        dataIndex: "modelMaxPriUs"
      },
      {
        title: language[`LowerLimitInterval_${this.props.language.getlanguages}`] + "[μs]",
        dataIndex: "modelMinPriUs"
      },
      {
        //脉内调制
        title: language[`IntraPulseModulation_${this.props.language.getlanguages}`],
        dataIndex: "modulateName"
      },
      {
        //天线扫描
        title: language[`AntennaScanning_${this.props.language.getlanguages}`],
        dataIndex: "modelScanName"
      }
    ];
    // 工作模式-射频的列
    const columns_radioFrequency = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`frequency_${this.props.language.getlanguages}`],
        dataIndex: "freq"
      }
    ];

    //工作模式-脉宽的列
    const columns_WorkingModePluseWidth = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`frequency_${this.props.language.getlanguages}`],
        dataIndex: "pw"
      }
    ];
    //工作模式-重复间隔的列
    const columns_WorkingModeRepetInter = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`RepeatIntervalValue_${this.props.language.getlanguages}`],
        dataIndex: "pri"
      }
    ];
    const columns_MNCharacter = [
      {
        title: language[`Codinglength_${this.props.language.getlanguages}`],
        dataIndex: "encodeLength"
      },
      {
        title: language[`CodeWidth_${this.props.language.getlanguages}`],
        dataIndex: "symbolWidth"
      },
      {
        title: language[`IntrapulseModulaSlope_${this.props.language.getlanguages}`],
        dataIndex: "inpulseModulateSlope"
      },
      {
        title: language[`InitialFrequency_${this.props.language.getlanguages}`] + "[MHz]",
        dataIndex: "startFrequencyHz"
      },
      {
        title: language[`TerminationFrequency_${this.props.language.getlanguages}`] + "[MHz]",
        dataIndex: "endFrequencyHz"
      },
      {
        title: language[`centerFrequency_${this.props.language.getlanguages}`] + "[MHz]",
        dataIndex: "centerFrequencyHz"
      },
      {
        title: language[`FineFrequencyMeasurement_${this.props.language.getlanguages}`
        ] + "[MHz]",
        dataIndex: "inpulseFrequencyHz"
      },
      {
        title: language[`FinePulseWidth_${this.props.language.getlanguages}`] + "[μs]",
        dataIndex: "inpulsePwUs"
      },
      {
        title: language[`InsertionLength_${this.props.language.getlanguages}`] + "[MHz]",
        dataIndex: "stepLengthHz"
      },
      {
        title: language[`frequencyOffset_${this.props.language.getlanguages}`] + "[MHz]",
        dataIndex: "frequencyOffsetHz"
      }
    ];

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


    let WorkModelData = [];
    let dataSource_MNCharacter = [];
    if (this.props.data && this.props.data.workModelList) {
      let data = this.props.data.workModelList;
      console.log("data=========", data)
      let purposeName;
      let modelThreadName;
      let modelFreqName;
      let modelPwName;
      let modelPriName;
      let modulateName;
      let modelScanName;
      for (var i = 0; i < data.length; i++) {
        for (let j = 0; j < language.modelUse.length; j++) {
          //模式用途
          if (data[i] && data[i].purposeName == language.modelUse[j].value) {
            purposeName = language.modelUse[j][`name_${this.props.language.getlanguages}`];
          }
        }
        for (let j = 0; j < language.threadLevel.length; j++) {
          //威胁等级
          if (
            data[i] && data[i].modelThreadName == language.threadLevel[j].value
          ) {
            modelThreadName = language.threadLevel[j][`name_${this.props.language.getlanguages}`];
          }
        }
        for (let j = 0; j < language.RadiofrequencyType.length; j++) {
          //射频类型
          if (
            data[i] && data[i].modelFreqName == language.RadiofrequencyType[j].value
          ) {
            modelFreqName = language.RadiofrequencyType[j][`name_${this.props.language.getlanguages}`];
          }
        }
        for (let j = 0; j < language.PulseWidthType.length; j++) {
          //脉宽类型
          if (
            data[i] && data[i].modelPwName == language.PulseWidthType[j].value
          ) {
            modelPwName = language.PulseWidthType[j][`name_${this.props.language.getlanguages}`];
          }
        }
        for (let j = 0; j < language.RepetitiveIntervalType.length; j++) {
          //重复间隔类型
          if (
            data[i] && data[i].modelPriName == language.RepetitiveIntervalType[j].value
          ) {
            modelPriName = language.RepetitiveIntervalType[j][`name_${this.props.language.getlanguages}`];
          }
        }
        for (let j = 0; j < language.IntraPulseModulation.length; j++) {
          //脉内调制
          if (
            data[i] && data[i].modulateName == language.IntraPulseModulation[j].value
          ) {
            modulateName = language.IntraPulseModulation[j][`name_${this.props.language.getlanguages}`];
          }
        }
        for (let j = 0; j < language.AntennaScanning.length; j++) {
          //天线扫描
          if (
            data[i] && data[i].modelScanName == language.AntennaScanning[j].value
          ) {
            modelScanName = language.AntennaScanning[j][`name_${this.props.language.getlanguages}`];
          }
        }
        WorkModelData.push({
          key: i + 1,
          modeId: data[i].modeId,
          modeName: data[i].modeName,
          purposeName: purposeName,
          modelThreadName: modelThreadName,
          modelFreqName: modelFreqName,
          modelMaxWorkFreqHz: data[i].modelMaxWorkFreqHz,
          modelMinWorkFreqHz: data[i].modelMinWorkFreqHz,
          modelPwName: modelPwName,
          modelMaxPwUs: data[i].modelMaxPwUs,
          modelMinPwUs: data[i].modelMinPwUs,
          modelPriName: modelPriName,
          modelMaxPriUs: data[i].modelMaxPriUs,
          modelMinPriUs: data[i].modelMinPriUs,
          modulateName: modulateName,
          modelScanName: modelScanName
        });
      }

      console.log("WorkModelData=========", WorkModelData)
    }

    let data1 = this.props.radarModel.target_workModelMsg_SP;
    let data2 = this.props.radarModel.target_workModelMsg_MK;
    let data3 = this.props.radarModel.target_workModelMsg_CFJG;
    let arr_SP = [];
    let arr_MK = [];
    let arr_CFJG = [];
    let MN_mark = false;
    if (
      this.props.radarModel.target_workModelMsg_Main &&
      this.props.radarModel.target_workModelMsg_Main.length == 0
    ) {
      MN_mark = true;
      arr_SP = [];
      arr_MK = [];
      arr_CFJG = [];
    } else {
      if (this.props.radarModel.target_workModelMsg_SP != null) {
        for (let i = 0; i < data1.length; i++) {
          arr_SP.push({
            key: i + 1,
            freq: data1[i].freq
          });
        }
      }
      if (this.props.radarModel.target_workModelMsg_MK != null) {
        for (let i = 0; i < data2.length; i++) {
          arr_MK.push({
            key: i + 1,
            pw: data2[i].pw
          });
        }
      }
      if (this.props.radarModel.target_workModelMsg_CFJG != null) {
        for (let i = 0; i < data3.length; i++) {
          arr_CFJG.push({
            key: i + 1,
            pri: data3[i].pri
          });
        }
      }
    }
    if (this.props.radarModel.targetWorkModel_fromTar) {
      let data = this.props.radarModel.targetWorkModel_fromTar;
      dataSource_MNCharacter.push({
        encodeLength: data.encodeLength,
        symbolWidth: data.symbolWidth,
        inpulseModulateSlope: data.inpulseModulateSlope,
        startFrequencyHz: data.startFrequencyHz,
        endFrequencyHz: data.endFrequencyHz,
        centerFrequencyHz: data.centerFrequencyHz,
        inpulseFrequencyHz: data.inpulseFrequencyHz,
        inpulsePwUs: data.inpulsePwUs,
        stepLengthHz: data.stepLengthHz,
        frequencyOffsetHz: data.frequencyOffsetHz
      });
    }

    //页面中素材的表格的数据--图片
    let imgTabledata = [];
    let fileSourceImg;
    let imgTabledataCache = this.props.radarModel.imgData_Special
      ? this.props.radarModel.imgData_Special
      : [];
    for (let i = 0; i < imgTabledataCache.length; i++) {
      if (
        imgTabledataCache[i].fileSource === "上级" ||
        imgTabledataCache[i].fileSource ===
        language[`superior_${this.props.language.getlanguages}`]
      ) {
        fileSourceImg =
          language[`superior_${this.props.language.getlanguages}`];
      } else if (
        imgTabledataCache[i].fileSource === "本级" ||
        imgTabledataCache[i].fileSource ==
        language[`level_${this.props.language.getlanguages}`]
      ) {
        fileSourceImg = language[`level_${this.props.language.getlanguages}`];
      }
      imgTabledata.push({
        key: i + 1,
        fileId: imgTabledataCache[i].fileId,
        fileName: imgTabledataCache[i].fileName,
        fileSource: fileSourceImg
      });
    }
    //页面中素材的表格的数据--视频
    let videoTabledata = [];
    let fileSourceVideo;
    let videoTabledataCache = this.props.radarModel.videoData_Special
      ? this.props.radarModel.videoData_Special
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
    let htmlTabledataCache = this.props.radarModel.htmlData_Special
      ? this.props.radarModel.htmlData_Special
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
    let docTabledataCache = this.props.radarModel.docData_Special
      ? this.props.radarModel.docData_Special
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
      <div
        className={style.FirstBoxMin}
        style={{ width: "940px", overflowX: "hidden" }}
      >
        {/* <Form className={styleless.myBandForm} onSubmit={this.handleSubmit}> */}
        {/* 基本信息 */}
        <div className={styleless.onlyLookBox}>
          <div className={style.subhead}>
            <div style={{ marginLeft: "10px" }}>
              {language[`basicInformation_${this.props.language.getlanguages}`]}
            </div>
          </div>
          <div className={style.Basic_Content_Wrap}>
            {/* 从目标库导入的内容 */}
            <div>
              {language[`radarTargetName_${this.props.language.getlanguages}`]}
            </div>
            <div>
              <FormItem>
                {getFieldDecorator("objectName", {})(
                  <Input className={styleless.input} type="text" disabled />
                )}
              </FormItem>
            </div>
            <div>
              {language[`RadarTargetModel_${this.props.language.getlanguages}`]}
            </div>
            <div>
              <FormItem>
                {getFieldDecorator("model", {
                  initialValue: "1"
                })(
                  <Select disabled>
                    <Option value="1">
                      {language[`notClear_${this.props.language.getlanguages}`]}
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
            <div>{language[`purpose_${this.props.language.getlanguages}`]}</div>
            <div>
              <FormItem>
                {getFieldDecorator("purpose", {
                  rules: [{}]
                })(<Input className={styleless.input} type="text" disabled />)}
              </FormItem>
            </div>
            {/* 部署信息 */}
            <div>
              {language[`DeploymentInformation_${this.props.language.getlanguages}`]}
            </div>
            <div>
              <FormItem>
                {getFieldDecorator("deployInformation", {
                  rules: [{}]
                })(<Input className={styleless.input} type="text" disabled />)}
              </FormItem>
            </div>
            {/* 活动区域描述 */}
            <div>
              {language[`ActiveAreaDescription_${this.props.language.getlanguages}`]}
            </div>
            <div>
              <FormItem>
                {getFieldDecorator("activeAreaDescription", {
                  rules: [{}]
                })(<Input className={styleless.input} type="text" disabled />)}
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
                })(<Input className={styleless.input} type="text" disabled />)}
              </FormItem>
            </div>
            {this.state.bigContent ? (
              ""
            ) : (
              <div>
                <div />
                <div />
              </div>
            )}
          </div>
        </div>
        {/* 战技术参数 */}
        <div className={styleless.onlyLookBox}>
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
                  <Select disabled>
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
                })(<Input className={styleless.input} type="text" disabled />)}
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
                })(<Input className={styleless.input} type="text" disabled />)}
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
            <div>
              {language[`UpperPulseWidthLimit_${this.props.language.getlanguages}`]}
              [μs]
            </div>
            <div>
              <FormItem>
                {getFieldDecorator("maxPwUs", {
                  rules: [{}]
                })(<Input className={styleless.input} type="text" disabled />)}
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
                })(<Input className={styleless.input} type="text" disabled />)}
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
                  <Select disabled>
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
                })(<Input className={styleless.input} type="text" disabled />)}
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
                })(<Input className={styleless.input} type="text" disabled />)}
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
                  <Select disabled>
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
                  <Select disabled>
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
                })(<Input className={styleless.input} type="text" disabled />)}
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
                })(<Input className={styleless.input} type="text" disabled />)}
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
                })(<Input className={styleless.input} type="text" disabled />)}
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
                })(<Input className={styleless.input} type="text" disabled />)}
              </FormItem>
            </div>
            <div>
              {language[`CompressionCoefficient_${this.props.language.getlanguages}`]}
            </div>
            <div>
              <FormItem>
                {getFieldDecorator("innerKa", {
                  rules: [{}]
                })(<Input className={styleless.input} type="text" disabled />)}
              </FormItem>
            </div>
            <div>
              {language[`systemLoss_${this.props.language.getlanguages}`]}
            </div>
            <div>
              <FormItem>
                {getFieldDecorator("sustemLoss", {
                  rules: [{}]
                })(<Input className={styleless.input} type="text" disabled />)}
              </FormItem>
            </div>
            <div>
              {language[`noiseFactor_${this.props.language.getlanguages}`]}
            </div>
            <div>
              <FormItem>
                {getFieldDecorator("noiseFigure", {
                  rules: [{}]
                })(<Input className={styleless.input} type="text" disabled />)}
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
                })(<Input className={styleless.input} type="text" disabled />)}
              </FormItem>
            </div>
            {
              <>
                <div style={{ background: "#fff" }} />
                <div />
              </>
            }
            <div className={style.Textarea_title}>
              {language[`remark_${this.props.language.getlanguages}`]}
            </div>
            <div className={style.Textarea_Content} style={{ width: "705px" }}>
              <FormItem>
                {getFieldDecorator("radarRemark", {
                  rules: [{}]
                })(
                  <TextArea
                    className={style.tableColTextCon}
                    style={{
                      width: "705px",
                      height: "72px",
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
        {/* </Form> */}
        {/* 工作模式 */}
        <div className={style.ContentParams}>
          <div className={styleless.tableBorder}>
            <Table
              rowKey={record => record.id}
              dataSource={WorkModelData}
              columns={WorkModelColumns} //this.state.dataSource即为获取初始化dataSource数组
              className={language[`WorkingMode_${this.props.language.getlanguages}`] ===
                "工作模式"
                ? styleless.myClassAdd_zh
                : styleless.myClassAdd_fr
              }
              rowClassName={this.setRowClassName}
              pagination={paginationProps}
              scroll={{ x: 1920 }}
              bordered
              onRow={record => {
                return {
                  onClick: this.clickRow.bind(this, record) // 点击行
                };
              }}
            />
          </div>
          <div className={style.Work_mode_Min}>
            <div className={style.Work_mode_threePart_wrap}>
              <div className={style.Work_mode_threePart}>
                <div className={style.subhea_Child}>
                  <span>
                    {language[`WorkingModeRadiore_${this.props.language.getlanguages}`]}[MHz]
                  </span>
                </div>
                <div>
                  {/* 射频的表格 */}
                  <Table
                    className={styleless.myClassAdd_zh}
                    pagination={paginationProps_threePart}
                    columns={columns_radioFrequency}
                    dataSource={arr_SP}
                    rowClassName={(record, index) =>
                      index % 2 === 0 ? styleless.odd : styleless.even
                    }
                    rowKey={record => record.key}
                  />
                </div>
              </div>
              <div className={style.Work_mode_threePart}>
                <div className={style.subhea_Child}>
                  <span>
                    {language[`WorkingModePluseWidth_${this.props.language.getlanguages
                      }`
                    ]
                    }
                    [μs]
                  </span>
                </div>
                <div>
                  {/* 脉宽的表格 */}
                  <Table
                    rowKey={record => record.key}
                    dataSource={arr_MK}
                    columns={columns_WorkingModePluseWidth}
                    rowClassName={(record, index) =>
                      index % 2 === 0 ? styleless.odd : styleless.even
                    }
                    pagination={paginationProps_threePart}
                    className={styleless.myClassAdd_zh}
                  />
                </div>
              </div>

              <div className={style.Work_mode_threePart}>
                <div className={style.subhea_Child}>
                  <span>
                    {language[`WorkingModeRepetInter_${this.props.language.getlanguages
                      }`
                    ]
                    }
                    [μs]
                  </span>
                </div>
                <div>
                  {/* 重复间隔的表格 */}
                  <Table
                    rowKey={record => record.key}
                    dataSource={arr_CFJG}
                    columns={columns_WorkingModeRepetInter}
                    rowClassName={(record, index) =>
                      index % 2 === 0 ? styleless.odd : styleless.even
                    }
                    pagination={paginationProps_threePart}
                    className={styleless.myClassAdd_zh}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={style.Work_mode_character} style={{ height: "none" }}>
            <Table
              rowKey={record => record.id}
              className={styleless.MNCharacter_tableStyle}
              dataSource={dataSource_MNCharacter}
              columns={columns_MNCharacter}
              rowClassName={(record, index) =>
                index % 2 === 0 ? styleless.odd : styleless.even
              }
              pagination={false}
              scroll={{ x: 1920 }}
              bordered
            />
          </div>
        </div>
        {/* 辐射源信号参数  */}
        <div className={style.ContentXHParams}>
          <div className={style.subhead}>
            <div style={{ marginLeft: "10px" }}>
              {language[`EmitterSignalParameters_${this.props.language.getlanguages}`]}
            </div>
          </div>
          <div>
            <div style={{ marginBottom: "10px", marginTop: "10px" }}>
              {/* 添加样本 */}
              {/* <Button type="primary" onClick={this.add} >{language[`AddSample_${this.props.language.getlanguages}`]}</Button> */}
            </div>
            <Tabs
              hideAdd
              onChange={this.onChange}
              activeKey={this.state.activeKey}
              type="card"
              onEdit={this.onEdit}
            >
              {this.state.panes.map((pane, index) => (
                <TabPane tab={pane.title} key={pane.key} />
              ))}
            </Tabs>
            <div style={{ height: 50, margin: "5px 20px" }}>
              <div style={{ display: "inline-block" }}>
                <span>
                  {language[`name_${this.props.language.getlanguages}`]}：
                </span>
                <Input
                  type="text"
                  style={{ width: "200px", margin: "5px 20px" }}
                  readOnly
                  value={this.state.name}
                />
              </div>
            </div>

            <Charts
              chartsData={this.state.chartsData}
              activeKey={this.state.activeKey}
              mark={this.state.mark}
            />
          </div>
        </div>
        {/* 相关资料 */}
        <div className={style.ContentBasic}>
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
                    rowKey={record => record.fileName}
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
                    // <div className={style.popFodderType_relate}>
                    //   {/*上传后的文件列表*/}
                    //   <div className={style.uploadtable}>
                    //     <div style={{ width: "600px", height: "300px", overflow: 'hidden', position: 'relative' }}>
                    //       <img id="showImg" style={{ width: "600px", float: 'left' }} />
                    //     </div>
                    //   </div>
                    // </div>
                    <div className={style.popFodderTypeImg}>
                      {/*上传后的文件列表*/}
                      <div className={style.uploadtableImg}>
                        <div
                          style={{
                            minWidth: "300px",
                            maxWidth: "900px",
                            minHeight: "300px",
                            maxHeight: "500px",
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
                              id="showImg"
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
                    rowKey={record => record.fileName}
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
                        <div style={{ width: "600px", height: "300px", overflow: "hidden", position: "relative" }}>
                          <video
                            id="my_video"
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
              className={
                this.state.bigContent
                  ? style.relateMsg_Con
                  : style.relateMsg_Con_Min
              }
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
                    rowKey={record => record.fileName}
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
                    rowKey={record => record.fileName}
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
    );
  }
}

OnlyLook = Form.create({
  mapPropsToFields(props) {
    //1.目标库导入的数据
    if (props.data != null) {
      let data = props.data;
      return {
        // 基本信息
        objectName: Form.createFormField({
          ...props,
          value: data.objectName
        }),
        model: Form.createFormField({
          ...props,
          value: data.model
        }),
        countryName: Form.createFormField({
          ...props,
          value: data.countryName
        }),
        forName: Form.createFormField({
          ...props,
          value: data.forName
        }),
        threadName: Form.createFormField({
          ...props,
          value: data.threadName
        }),
        purpose: Form.createFormField({
          ...props,
          value: data.purpose
        }),
        deployInformation: Form.createFormField({
          ...props,
          value: data.deployInformation
        }),
        activeAreaDescription: Form.createFormField({
          ...props,
          value: data.activeAreaDescription
        }),
        manufacturer: Form.createFormField({
          ...props,
          value: data.manufacturer
        }),
        // 战技术参数
        freqName: Form.createFormField({
          ...props,
          value: data.freqName
        }),
        maxWorkFreqHz: Form.createFormField({
          ...props,
          value: data.maxWorkFreqHz
        }),
        minWorkFreqHz: Form.createFormField({
          ...props,
          value: data.minWorkFreqHz
        }),
        pwName: Form.createFormField({
          ...props,
          value: data.pwName
        }),
        maxPwUs: Form.createFormField({
          ...props,
          value: data.maxPwUs
        }),
        minPwUs: Form.createFormField({
          ...props,
          value: data.minPwUs
        }),
        priName: Form.createFormField({
          ...props,
          value: data.priName
        }),
        maxPriUs: Form.createFormField({
          ...props,
          value: data.maxPriUs
        }),
        minPriUs: Form.createFormField({
          ...props,
          value: data.minPriUs
        }),
        technologyName: Form.createFormField({
          ...props,
          value: data.technologyName
        }),
        antiName: Form.createFormField({
          ...props,
          value: data.antiName
        }),
        maxTransmitPowerW: Form.createFormField({
          ...props,
          value: data.maxTransmitPowerW
        }),
        maxAntennaGain: Form.createFormField({
          ...props,
          value: data.maxAntennaGain
        }),
        maxDectectionRangeKm: Form.createFormField({
          ...props,
          value: data.maxDectectionRangeKm
        }),
        receiverBwHz: Form.createFormField({
          ...props,
          value: data.receiverBwHz
        }),
        innerKa: Form.createFormField({
          ...props,
          value: data.innerKa
        }),
        sustemLoss: Form.createFormField({
          ...props,
          value: data.sustemLoss
        }),
        noiseFigure: Form.createFormField({
          ...props,
          value: data.noiseFigure
        }),
        minDetectablePowerDBm: Form.createFormField({
          ...props,
          value: data.minDetectablePowerDBm
        }),
        radarPurpose: Form.createFormField({
          ...props,
          value: data.radarPurpose
        }),
        radarRemark: Form.createFormField({
          ...props,
          value: data.radarRemark
        })
      };
    }
  }
})(OnlyLook);

export default OnlyLook;
