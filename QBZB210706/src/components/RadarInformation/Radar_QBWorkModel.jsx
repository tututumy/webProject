import React, { Component } from "react";
import style from "./Edit.css";
import styleless from "./test.less";
import { Table } from "antd";
import { connect } from "dva";
import language from "../language/language";

@connect(({ language, radarModel }) => ({ language, radarModel }))
//工作模式------点击“添加”按钮弹出添加荣作模式的内容框
export default class AddTableRadar extends Component {
  //es6中定义的一个Details类
  constructor(props) {
    //构造函数
    super(props);
    this.state = {
      visible: false,
      bigContent: false,
      dataSource: [],
      dataSource_radioFrequency: [],
      dataSource_WorkingModePluseWidth: [],
      dataSource_WorkingModeRepetInter: [],
      dataSource_MNCharacter: [],
      rowId: -1, //工作模式当前被点击的行
      selectedRowKeys: ""
    };
  }

  componentDidMount() {
    const data = this.props.radarModel.ModelMsg;
    //当清除雷达整编数据关闭，整编状态打开 才显示数据
    if (data) {
      if (data[2].length) {
        let workModelData = data[2];
        let arr = [];
        for (let i = 0; i < workModelData.length; i++) {
          arr.push({
            id: i + 1,
            modeId: workModelData[i].modeId,
            modeName: workModelData[i].modeName,
            purposeName: workModelData[i].purposeName, //模式用途
            modelFreqName: workModelData[i].modelFreqName, //射频类型
            modelMaxPriUs: workModelData[i].modelMaxPriUs,
            modelMaxPwUs: workModelData[i].modelMaxPwUs,
            modelMaxWorkFreqHz: workModelData[i].modelMaxWorkFreqHz,
            modelMinPriUs: workModelData[i].modelMinPriUs,
            modelMinPwUs: workModelData[i].modelMinPwUs,
            modelMinWorkFreqHz: workModelData[i].modelMinWorkFreqHz,
            modelPriName: workModelData[i].modelPriName,
            modelPwName: workModelData[i].modelPwName,
            modelScanName: workModelData[i].modelScanName,
            modelThreadName: workModelData[i].modelThreadName,
            modulateName: workModelData[i].modulateName
          });
        }
        this.setState({ dataSource: arr });
      } else {
        this.setState({ dataSource: [] });
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextprops) {
    let arr = [];
    let FirstPart = [];
    let SecondPart = [];
    let ThirdPart = [];
    let LastPart = [];
    //工作模式的内容生成
    if (nextprops.radarModel.ModelMsg) {
      if (
        nextprops.radarModel.ModelMsg[2] &&
        nextprops.radarModel.ModelMsg[2].length
      ) {
        const workModelData = nextprops.radarModel.ModelMsg[2];
        for (let i = 0; i < workModelData.length; i++) {
          arr.push({
            id: i + 1,
            modeId: workModelData[i].modeId,
            modeName: workModelData[i].modeName,
            modelFreqName: workModelData[i].modelFreqName,
            modelMaxPriUs: workModelData[i].modelMaxPriUs,
            modelMaxPwUs: workModelData[i].modelMaxPwUs,
            modelMaxWorkFreqHz: workModelData[i].modelMaxWorkFreqHz,
            modelMinPriUs: workModelData[i].modelMinPriUs,
            modelMinPwUs: workModelData[i].modelMinPwUs,
            modelMinWorkFreqHz: workModelData[i].modelMinWorkFreqHz,
            modelPriName: workModelData[i].modelPriName,
            modelPwName: workModelData[i].modelPwName,
            modelScanName: workModelData[i].modelScanName,
            modelThreadName: workModelData[i].modelThreadName,
            modulateName: workModelData[i].modulateName,
            purposeName: workModelData[i].purposeName
          });
        }
        this.setState({ dataSource: arr });
        // this.props.dispatch({
        //   type: 'radarModel/closeModelMsg_async',
        //   payload:nextprops.radarModel.ModelMsg
        // })
      } else {
        this.setState({ dataSource: [] });
      }
    }

    //详细工作模式的生成 必须要点击事件之后才能显示
    if (
      nextprops.radarModel.WorkModelMsg_ZCMark === true &&
      nextprops.radarModel.WorkModelMsg
    ) {
      const workModelDetailData = nextprops.radarModel.WorkModelMsg;
      if (workModelDetailData[0].length > 0) {
        for (let i = 0; i < workModelDetailData[0].length; i++) {
          FirstPart.push({
            id: i + 1,
            FrequencyValues: workModelDetailData[0][i].frequencyHz
          });
        }
      }
      if (workModelDetailData[1].length > 0) {
        for (let i = 0; i < workModelDetailData[1].length; i++) {
          SecondPart.push({
            id: i + 1,
            PulseWidthValue: workModelDetailData[1][i].pwUs
          });
        }
      }
      if (workModelDetailData[2].length > 0) {
        for (let i = 0; i < workModelDetailData[2].length; i++) {
          ThirdPart.push({
            id: i + 1,
            RepeatIntervalValue: workModelDetailData[2][i].priUs
          });
        }
      }
      if (workModelDetailData[3][0]) {
        LastPart.push({
          encodeLength: workModelDetailData[3][0].encodeLength,
          symbolWidth: workModelDetailData[3][0].symbolWidth,
          inpulseModulateSlope: workModelDetailData[3][0].inpulseModulateSlope,
          startFrequencyHz: workModelDetailData[3][0].startFrequencyHz,
          endFrequencyHz: workModelDetailData[3][0].endFrequencyHz,
          centerFrequencyHz: workModelDetailData[3][0].centerFrequencyHz,
          inpulseFrequencyHz: workModelDetailData[3][0].inpulseFrequencyHz,
          inpulsePwUs: workModelDetailData[3][0].inpulsePwUs,
          stepLengthHz: workModelDetailData[3][0].stepLengthHz,
          frequencyOffsetHz: workModelDetailData[3][0].frequencyOffsetHz
        });
      }
      this.setState({
        dataSource_radioFrequency: FirstPart,
        dataSource_WorkingModePluseWidth: SecondPart,
        dataSource_WorkingModeRepetInter: ThirdPart,
        dataSource_MNCharacter: LastPart
      });
    } else {
      this.setState({
        dataSource_radioFrequency: [],
        dataSource_WorkingModePluseWidth: [],
        dataSource_WorkingModeRepetInter: [],
        dataSource_MNCharacter: []
      });
    }
  }

  //删除
  handleDel = (event, record, key) => {
    let DelDataSource = this.state.dataSource;
    DelDataSource.splice(event.target.getAttribute("data-index"), 1); //data-index为获取索引，后面的1为一次去除几行
    this.setState({
      dataSource: DelDataSource
    });
  };

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
  //点击侦察情报整编中的工作模式中的行  点击了之后WorkModelMsg里面就有了点击的一行对应的工作模式的详细数据
  //只有点击了行才出现数据，不然有数据也不能显示
  clickRow = record => {
    const { dispatch } = this.props;
    dispatch({
      type: "radarModel/selectWorkModelDetailMsg",
      payload: { modeId: record.modeId, modeName: record.modeName }
    });
    this.setState({ rowId: record.modeId, selectedRowKeys: record.id });
  };

  //给点击的行设置一个背景色
  setRowClassName = record => {
    return record.modeId === this.state.rowId
      ? `${style["l_table_row_active"]}`
      : "";
  };

  selectionChange = (selectKey, selectRow) => {
    //工作模式单击单选按钮
    const { modeId, id, modeName } = selectRow[0];
    const { dispatch } = this.props;
    dispatch({
      type: "radarModel/selectWorkModelDetailMsg",
      payload: { modeId: modeId, modeName: modeName }
    });
    this.setState({ rowId: modeId, selectedRowKeys: id });
  };

  render() {
    //工作模式
    const paginationProps = {
      pageSize: 3
    };
    const paginationProps_threePart = {
      pageSize: 5
    };

    //工作模式的单击选择
    const rowSelectionGZMS = {
      type: "radio",
      selectedRowKeys: [this.state.selectedRowKeys],
      onChange: this.selectionChange
    };
    // 工作模式的列
    const columns = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "id",
        width: "5%",
        ellipsis: true
      },
      {
        // 模式内码
        title: language[`ModelCode_${this.props.language.getlanguages}`],
        dataIndex: "modeId",
        ellipsis: true
      },
      {
        // 模式名称
        title: language[`patternName_${this.props.language.getlanguages}`],
        dataIndex: "modeName",
        ellipsis: true
      },
      {
        // 模式用途
        title: language[`ModelUSES_${this.props.language.getlanguages}`],
        dataIndex: "purposeName",
        ellipsis: true
      },
      {
        title: language[`threatLevel_${this.props.language.getlanguages}`],
        dataIndex: "modelThreadName",
        ellipsis: true
      },
      {
        // 射频类型
        title: language[`RadioType_${this.props.language.getlanguages}`],
        dataIndex: "modelFreqName",
        ellipsis: true
      },
      {
        // 频率上限
        title: language[`upperFrequencyLimit_${this.props.language.getlanguages}`] +"[MHz]",
        dataIndex: "modelMaxWorkFreqHz",
        ellipsis: true
      },
      {
        // 频率下限
        title: language[`LowerFrequencyLimit_${this.props.language.getlanguages}`] +"[MHz]",
        dataIndex: "modelMinWorkFreqHz",
        ellipsis: true
      },
      {
        //脉宽类型
        title: language[`PulseWidthType_${this.props.language.getlanguages}`],
        dataIndex: "modelPwName",
        ellipsis: true
      },
      {
        //脉宽上限
        title: language[`UpperPulseWidthLimit_${this.props.language.getlanguages}`] +"[μs]",
        dataIndex: "modelMaxPwUs",
        ellipsis: true
      },
      {
        //脉宽下限
        title: language[`LowerPulseWidthLimit_${this.props.language.getlanguages}`] +"[μs]",
        dataIndex: "modelMinPwUs",
        ellipsis: true
      },
      {
        //重复间隔类型
        title:language[`RepetitionIntervalType_${this.props.language.getlanguages}`],
        dataIndex: "modelPriName",
        ellipsis: true
      },
      {
        //重复间隔上限
        title: language[`UpperLimitInterval_${this.props.language.getlanguages}`] +"[μs]",
        dataIndex: "modelMaxPriUs",
        ellipsis: true
      },
      {
        title: language[`LowerLimitInterval_${this.props.language.getlanguages}`] +"[μs]",
        dataIndex: "modelMinPriUs",
        ellipsis: true
      },
      {
        //脉内调制
        title: language[`IntraPulseModulation_${this.props.language.getlanguages}`],
        dataIndex: "modulateName",
        ellipsis: true
      },
      {
        //天线扫描
        title: language[`AntennaScanning_${this.props.language.getlanguages}`],
        dataIndex: "modelScanName",
        ellipsis: true
      }
    ];
    //工作模式-射频的列
    const columns_radioFrequency = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "id"
      },
      {
        // 频率值
        title: language[`FrequencyValues_${this.props.language.getlanguages}`],
        dataIndex: "FrequencyValues"
      }
    ];
    //工作模式-脉宽的列
    const columns_WorkingModePluseWidth = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "id"
      },
      {
        title: language[`PulseWidthValue_${this.props.language.getlanguages}`],
        dataIndex: "PulseWidthValue"
      }
    ];

    //工作模式-重复间隔的列
    const columns_WorkingModeRepetInter = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "id"
      },
      {
        title: language[`RepeatIntervalValue_${this.props.language.getlanguages}`],
        dataIndex: "RepeatIntervalValue"
      }
    ];

    //工作模式-脉内特征的列
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
        title: language[`InitialFrequency_${this.props.language.getlanguages}`] +"[MHz]",
        dataIndex: "startFrequencyHz"
      },
      {
        title: language[`TerminationFrequency_${this.props.language.getlanguages}`] +"[MHz]",
        dataIndex: "endFrequencyHz"
      },
      {
        title: language[`centerFrequency_${this.props.language.getlanguages}`] +"[MHz]",
        dataIndex: "centerFrequencyHz"
      },
      {
        title:language[`FineFrequencyMeasurement_${this.props.language.getlanguages}`
          ] + "[MHz]",
        dataIndex: "inpulseFrequencyHz"
      },
      {
        title: language[`FinePulseWidth_${this.props.language.getlanguages}`] +"[μs]",
        dataIndex: "inpulsePwUs"
      },
      {
        title: language[`InsertionLength_${this.props.language.getlanguages}`] +"[MHz]",
        dataIndex: "stepLengthHz"
      },
      {
        title: language[`frequencyOffset_${this.props.language.getlanguages}`] +"[MHz]",
        dataIndex: "frequencyOffsetHz"
      }
    ];

    let WorkModelData = [];
    if (this.state.dataSource) {
      let data = this.state.dataSource;
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
          if (
            data[i].purposeName == language.modelUse[j][`name_zh`] ||
            data[i].purposeName == language.modelUse[j][`name_fr`]
          ) {
            purposeName =language.modelUse[j][`name_${this.props.language.getlanguages}`];
          }
        }
        for (let j = 0; j < language.threadLevel.length; j++) {
          //威胁等级
          if (
            data[i].modelThreadName == language.threadLevel[j][`name_zh`] ||
            data[i].modelThreadName == language.threadLevel[j][`name_fr`]
          ) {
            modelThreadName =language.threadLevel[j][
                `name_${this.props.language.getlanguages}`
              ];
          }
        }
        for (let j = 0; j < language.RadiofrequencyType.length; j++) {
          //射频类型
          if (
            data[i].modelFreqName ==language.RadiofrequencyType[j][`name_zh`] ||
            data[i].RadiofrequencyType ==language.RadiofrequencyType[j][`name_fr`]
          ) {
            modelFreqName =language.RadiofrequencyType[j][
                `name_${this.props.language.getlanguages}`
              ];
          }
        }
        for (let j = 0; j < language.PulseWidthType.length; j++) {
          //脉宽类型
          if (
            data[i].modelPwName == language.PulseWidthType[j][`name_zh`] ||
            data[i].modelPwName == language.PulseWidthType[j][`name_fr`]
          ) {
            modelPwName =language.PulseWidthType[j][
                `name_${this.props.language.getlanguages}`
              ];
          }
        }
        for (let j = 0; j < language.RepetitiveIntervalType.length; j++) {
          //重复间隔类型
          if (
            data[i].modelPriName ==language.RepetitiveIntervalType[j][`name_zh`] ||
            (data[i] &&
              data[i].modelPriName ==
                language.RepetitiveIntervalType[j][`name_fr`])
          ) {
            modelPriName =language.RepetitiveIntervalType[j][
                `name_${this.props.language.getlanguages}`
              ];
          }
        }
        for (let j = 0; j < language.IntraPulseModulation.length; j++) {
          //脉内调制
          if (
            data[i].modulateName ==language.IntraPulseModulation[j][`name_zh`] ||
            (data[i] &&
              data[i].modulateName ==
                language.IntraPulseModulation[j][`name_fr`])
          ) {
            modulateName =language.IntraPulseModulation[j][
                `name_${this.props.language.getlanguages}`
              ];
          }
        }
        for (let j = 0; j < language.AntennaScanning.length; j++) {
          //天线扫描
          if (
            data[i].modelScanName == language.AntennaScanning[j][`name_zh`] ||
            data[i].modelScanName == language.AntennaScanning[j][`name_fr`]
          ) {
            modelScanName =language.AntennaScanning[j][
                `name_${this.props.language.getlanguages}`
              ];
          }
        }
        WorkModelData.push({
          id: i + 1,
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
    }

    let freqArr = this.state.dataSource_radioFrequency;
    console.log("freqArr==", freqArr);
    for (let i = 0; i < freqArr.length; i++) {
      let WZ = freqArr[i].FrequencyValues.indexOf(".");
      let AfterPoint = freqArr[i].FrequencyValues.substring(
        WZ,
        freqArr[i].length
      );
      let beforePoint = freqArr[i].FrequencyValues.substring(0, WZ);
      if (WZ != -1 && AfterPoint.length > 3) {
        freqArr[i].FrequencyValues = beforePoint + AfterPoint.slice(0, 4);
      } else if (WZ != -1 && AfterPoint.length == 2) {
        freqArr[i].FrequencyValues = freqArr[i].FrequencyValues + "00";
      } else if (WZ != -1 && AfterPoint.length == 1) {
        freqArr[i].FrequencyValues = freqArr[i].FrequencyValues + "000";
      } else {
        freqArr[i].FrequencyValues = freqArr[i].FrequencyValues + ".000";
      }
    }

    let pwArr = this.state.dataSource_WorkingModePluseWidth;

    return (
      <div
        className={
          this.props.name === "big" ? style.Work_mode : style.Work_mode_Min
        }
      >
        <div className={style.subhead}>
          {/* 工作模式 */}
          <div style={{ marginLeft: "10px" }}>
            {language[`WorkingMode_${this.props.language.getlanguages}`]}
          </div>
        </div>
        <div className={styleless.tableBorder} style={{ height: "250px" }}>
          <Table
            rowKey={record => record.id}
            rowSelection={rowSelectionGZMS}
            dataSource={WorkModelData}
            columns={columns} //this.state.dataSource即为获取初始化dataSource数组
            // className={language[`WorkingMode_${this.props.language.getlanguages}`] === "工作模式" ? styleless.myClassAdd_zh : styleless.myClassAdd_fr}
            className={styleless.myClassAdd_zh}
            rowClassName={(record, index) =>
              index % 2 === 0 ? styleless.odd : styleless.even
            } //奇偶行颜色交替变化
            pagination={paginationProps}
            rowClassName={this.setRowClassName}
            scroll={{ x: 1920 }}
            bordered
            onRow={record => {
              return {
                onClick: this.clickRow.bind(this, record) // 点击行
              };
            }}
          />
        </div>

        <div className={style.Work_mode_threePart_wrap}>
          <div className={style.Work_mode_threePart}>
            <div className={style.subhea_Child}>
              {language[`WorkingModeRadiore_${this.props.language.getlanguages}`]}
              [MHz]
            </div>
            <Table
              rowKey={record => record.id}
              dataSource={freqArr}
              columns={columns_radioFrequency}
              rowClassName={(record, index) =>
                index % 2 === 0 ? styleless.odd : styleless.even
              }
              pagination={paginationProps_threePart}
              className={styleless.myClassAdd_zh}
            />
          </div>

          <div className={style.Work_mode_threePart}>
            <div className={style.subhea_Child}>
              {language[`WorkingModePluseWidth_${this.props.language.getlanguages}`]}
              [μs]
            </div>
            <Table
              rowKey={record => record.id}
              dataSource={this.state.dataSource_WorkingModePluseWidth}
              columns={columns_WorkingModePluseWidth}
              rowClassName={(record, index) =>
                index % 2 === 0 ? styleless.odd : styleless.even
              }
              pagination={paginationProps_threePart}
              className={styleless.myClassAdd_zh}
            />
          </div>

          <div className={style.Work_mode_threePart}>
            <div className={style.subhea_Child}>
              {language[`WorkingModeRepetInter_${this.props.language.getlanguages}`]}
              [μs]
            </div>
            <Table
              rowKey={record => record.id}
              dataSource={this.state.dataSource_WorkingModeRepetInter}
              columns={columns_WorkingModeRepetInter}
              rowClassName={(record, index) =>
                index % 2 === 0 ? styleless.odd : styleless.even
              }
              pagination={paginationProps_threePart}
              className={styleless.myClassAdd_zh}
            />
          </div>
        </div>
        <div className={style.Work_mode_character}>
          <div className={style.Work_mode_character_Title}>
            {language[`WorkModeIntraChara_${this.props.language.getlanguages}`]}
          </div>
          <div
            className={
              language[`WorkModeIntraChara_${this.props.language.getlanguages}`
              ] === "工作模式-脉内特征"
                ? style.addTable_box_zh
                : style.addTable_box_fr
            }
          >
            <Table
              className={styleless.myClassAdd_zh}
              rowKey={record => record.id}
              dataSource={this.state.dataSource_MNCharacter}
              columns={columns_MNCharacter}
              rowClassName={(record, index) =>
                index % 2 === 0 ? styleless.odd : styleless.even
              }
              pagination={false}
              scroll={{ x: 1920 }}
            />
          </div>
        </div>
      </div>
    );
  }
}
