import React, { Component } from "react";
import { Table, Select, Button, Form, Input, message, InputNumber, Tooltip } from "antd";
import { connect } from "dva";
import Dialog from "../../utils/DialogMask/Dialog";
import language from "../language/language";
import style from "./Radar.css";
import styles from "./RadarType.less";
import styleless from "./test.less";
import "../../../src/index.less";
import DialogConfirm from "../../utils/DialogConfirmNoMask/Dialog";

@connect(({ language, radarModel, loading }) => ({
  language,
  radarModel,
  loading
}))
class RadarType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddDialog: false,
      dataSource: null,
      showConfirmDialog: false, //删除的弹出框的显示标记
      selectedRows: "",
      selectedRowKeys: "",
      tableDataLength: 0,
      currentpage: "1",
      zhORfr: "zh",
      chooseModel: null,
      addOrUpdateMark: "add", //新建或者修改的标识
      technologyNameMark: false //技术体制是否是连续波
    };
  }

  componentDidMount = () => {
    //页面加载的时候
    this.props.dispatch({
      type: "radarModel/selectAllRadarTypeData",
      callback: res => {
        if (res.data[0]) {
          let data = res.data[0];
          this.TableAddData(data);
        }
      }
    });
    this.props.form.resetFields(); //给form表单清空值
    this.props.dispatch({
      type: "radarModel/selectRadarTypeDetails_data",
      payload: null
    });
  };

  UNSAFE_componentWillReceiveProps({ language }) {
    if (this.state.zhORfr != language.getlanguages) {
      this.props.dispatch({
        type: "radarModel/selectAllRadarTypeData",
        callback: res => {
          if (res.data[0]) {
            let data = res.data[0];
            this.TableAddData(data);
          }
        }
      });
    }
    this.setState({ zhORfr: language.getlanguages });
  }

  //给表格赋值
  TableAddData = data => {
    let arr = [];
    let freqName;
    let pwName;
    let priName;
    let technologyName;
    let antiName;
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < language.RadiofrequencyType.length; j++) {
        //射频类型
        if (
          data[i] &&
          data[i].freqName == language.RadiofrequencyType[j].value
        ) {
          freqName =
            language.RadiofrequencyType[j][`name_${this.props.language.getlanguages}`];
        }
      }
      for (let j = 0; j < language.PulseWidthType.length; j++) {
        //脉宽类型
        if (data[i] && data[i].pwName == language.PulseWidthType[j].value) {
          pwName =
            language.PulseWidthType[j][
            `name_${this.props.language.getlanguages}`
            ];
        }
      }
      for (let j = 0; j < language.RepetitiveIntervalType.length; j++) {
        //重复间隔类型
        if (
          data[i] &&
          data[i].priName == language.RepetitiveIntervalType[j].value
        ) {
          priName =
            language.RepetitiveIntervalType[j][
            `name_${this.props.language.getlanguages}`
            ];
        }
      }
      //技术体制
      for (let j = 0; j < language.technologyName.length; j++) {
        //技术体制
        if (
          data[i] &&
          data[i].technologyName == language.technologyName[j].value
        ) {
          technologyName =
            language.technologyName[j][`name_${this.props.language.getlanguages}`];
        }
      }
      //抗干扰方式
      for (let j = 0; j < language.AntiInterferenceMode.length; j++) {
        //技术体制
        if (
          data[i] &&
          data[i].antiName == language.AntiInterferenceMode[j].value
        ) {
          antiName =
            language.AntiInterferenceMode[j][
            `name_${this.props.language.getlanguages}`
            ];
        }
      }

      arr.push({
        key: i + 1,
        antiName: antiName,
        categoryId: data[i].categoryId,
        freqName: freqName,
        innerKa: data[i].innerKa,
        maxAntennaGain: data[i].maxAntennaGain,
        maxDectectionRangeKm: data[i].maxDectectionRangeKm,
        maxPriUs: data[i].maxPriUs,
        maxPwUs: data[i].maxPwUs,
        maxTransmitPowerW: data[i].maxTransmitPowerW,
        maxWorkFreqHz: data[i].maxWorkFreqHz,
        minDetectablePowerDBm: data[i].minDetectablePowerDBm,
        minPriUs: data[i].minPriUs,
        minPwUs: data[i].minPwUs,
        minWorkFreqHz: data[i].minWorkFreqHz,
        model: data[i].model,
        noiseFigure: data[i].noiseFigure,
        objectTypeId: data[i].objectTypeId,
        priName: priName,
        pwName: pwName,
        radarPurpose: data[i].radarPurpose,
        radarRemark: data[i].radarRemark,
        receiverBwHz: data[i].receiverBwHz,
        sustemLoss: data[i].sustemLoss,
        technologyName: technologyName,
        manufacturer: data[i].manufacturer
      });
    }
    this.setState({ dataSource: arr, tableDataLength: data.length });
  };

  handleAdd = () => {
    //点击添加按钮
    this.setState({
      showAddDialog: true,
      addOrUpdateMark: "add",
      selectedRowKeys: "",
      chooseModel: null
    });
  };
  handleCancel = () => {
    //点击取消
    this.setState({ showAddDialog: false });
    this.props.form.resetFields(); //给form表单清空值
    this.props.dispatch({
      type: "radarModel/selectRadarTypeDetails_data",
      payload: null
    });
  };

  handleSubmit = () => {
    //点击弹出框的确定按钮
    this.props.form.validateFields((err, values) => {
      if (!err) {
        for (let i in values) {
          if (values[i] == "" || !values[i] || values[i] == "null") {
            values[i] = null;
          }
        }
        if (this.state.addOrUpdateMark === "add") {

          this.props.dispatch({
            type: "radarModel/selectRadarTypeRepeatName",
            payload: values.model,
            callback: res => {
              if (res.data[0] == 1) {
                message.warning(language[`radarOrTargetTypeRepeat_${this.props.language.getlanguages}`]);
                this.props.form.setFieldsValue({ model: "" });
                return false;
              } else {
                this.props.dispatch({
                  type: "radarModel/addRadarTechnicalParam",
                  payload: {
                    ...values,
                    objectTypeId: "null",
                    categoryId: "null",
                    radarPurpose: "null"
                  },
                  callback: res => {
                    if (res.data[0]) {
                      message.success(
                        language[`addSuccess_${this.props.language.getlanguages}`]
                      );
                      this.setState({ showAddDialog: false });
                      this.props.form.resetFields(); //给form表单清空值
                      let data = res.data[0];
                      this.TableAddData(data);
                    }
                  }
                })
              }
            }
          })
        } else if (this.state.addOrUpdateMark === "update") {
          this.props.dispatch({
            type: "radarModel/updateRadarTechnicalParam",
            payload: {
              ...values,
              objectTypeId: "null",
              categoryId: "null",
              radarPurpose: "null"
            },
            callback: res => {
              if (res.data[0]) {
                message.success(
                  language[`updateSuccess_${this.props.language.getlanguages}`]
                );
                this.setState({ showAddDialog: false });
                this.props.form.resetFields(); //给form表单清空值
                let data = res.data[0];
                this.TableAddData(data);
                this.props.dispatch({
                  //清空model层中的缓存值
                  type: "radarModel/selectRadarTypeDetails_data",
                  payload: null
                });
              }
            }
          });
        }
      } else {
        message.warning(language[`improveECMSpecialReportTips_${this.props.language.getlanguages}`
        ]
        );
      }
    });
  };

  //查询雷达型号是否重名
  // selectRepeatName = e => {

  // }

  //删除按钮
  deleteAll = () => {
    if (!this.state.chooseModel) {
      message.warning(
        language[`pleaseCheck_${this.props.language.getlanguages}`]
      );
    } else {
      this.setState({ showConfirmDialog: true });
    }
  };
  handleCancelConfirm = () => {
    this.setState({ showConfirmDialog: false });
  };
  //确定删除
  handleOkConfirm = () => {
    this.props.dispatch({
      type: "radarModel/deleteRadarType",
      payload: this.state.chooseModel,
      callback: res => {
        if (res.data && res.data.length > 1) {
          message.warning(
            this.props.language.getlanguages == "zh"
              ? `该雷达型号已被辐射源${res.data[0][0]}使用，暂不能删除！`
              : language[`radar_model_used_by_radiation_source_${this.props.language.getlanguages}`] + res.data[0][0]
          );
          this.setState({
            showConfirmDialog: false,
            selectedRowKeys: []
          });
        } else if (res.data && res.data.length == 1) {
          message.success(
            language[`deleteSuccess_${this.props.language.getlanguages}`]
          );
          this.setState({ selectedRows: "" });
          let data = res.data[0];
          this.TableAddData(data);
          this.setState({
            showConfirmDialog: false,
            selectedRowKeys: []
          });
        }
      }
    });
  };

  //修改平台型号
  updateData = () => {
    this.setState({ addOrUpdateMark: "update" });
    if (!this.state.chooseModel) {
      message.warning(
        language[`pleaseCheck_${this.props.language.getlanguages}`]
      );
    } else {
      this.setState({ showAddDialog: true });
      this.props.dispatch({
        type: "radarModel/selectRadarTypeDetails_update",
        payload: this.state.chooseModel
      });
    }
  };

  handleInputFreLower = e => {
    //工作频率下限失去焦点事件
    if (
      this.props.form.getFieldValue("maxWorkFreqHz") &&
      this.props.form.getFieldValue("minWorkFreqHz") &&
      Number(this.props.form.getFieldValue("maxWorkFreqHz")) <
      Number(this.props.form.getFieldValue("minWorkFreqHz"))
    ) {
      message.warning(
        language[
        `lowerFreqNotMoreThanUpperFreq_${this.props.language.getlanguages}`
        ]
      );
      this.props.form.setFieldsValue({ minWorkFreqHz: "" });
      document.getElementById("minWorkFreqHz").style.border = "1px solid #f00";
      return false;
    } else {
      document.getElementById("minWorkFreqHz").style.border =
        "1px solid #d9d9d9";
      document.getElementById("maxWorkFreqHz").style.border =
        "1px solid #d9d9d9";
    }
  };

  handleInputFreMax = e => {
    //工作频率上限失去焦点事件
    if (
      this.props.form.getFieldValue("minWorkFreqHz") &&
      this.props.form.getFieldValue("maxWorkFreqHz") &&
      Number(this.props.form.getFieldValue("maxWorkFreqHz")) <
      Number(this.props.form.getFieldValue("minWorkFreqHz"))
    ) {
      message.warning(
        language[
        `lowerFreqNotMoreThanUpperFreq_${this.props.language.getlanguages}`
        ]
      );
      this.props.form.setFieldsValue({ maxWorkFreqHz: "" });
      document.getElementById("maxWorkFreqHz").style.border = "1px solid #f00";
    } else {
      document.getElementById("maxWorkFreqHz").style.border =
        "1px solid #d9d9d9";
      document.getElementById("minWorkFreqHz").style.border =
        "1px solid #d9d9d9";
    }
  };

  checkMinPwUs = (rule, value, callback) => {
    if (value) {
      callback();
      return;
    }
    callback("Price must greater than zero!");
  };

  handleModelMinPwUs = e => {
    //脉宽下限
    if (
      this.props.form.getFieldValue("maxPwUs") &&
      Number(this.props.form.getFieldValue("minPwUs")) >
      Number(this.props.form.getFieldValue("maxPwUs"))
    ) {
      message.warning(language[`lowerPwNotMoreThanUpperPw_${this.props.language.getlanguages}`]);
      this.props.form.setFieldsValue({ minPwUs: "" });
      document.getElementById("minPwUs").style.border = "1px solid #f00";
    } else {
      document.getElementById("minPwUs").style.border = "1px solid #d9d9d9";
      document.getElementById("maxPwUs").style.border = "1px solid #d9d9d9";
    }
  };

  handleModelMaxPwUs = e => {
    //脉宽上限
    if (
      this.props.form.getFieldValue("minPwUs") &&
      Number(this.props.form.getFieldValue("minPwUs")) >
      Number(this.props.form.getFieldValue("maxPwUs"))
    ) {
      message.warning(
        language[`lowerPwNotMoreThanUpperPw_${this.props.language.getlanguages}`]
      );
      this.props.form.setFieldsValue({ maxPwUs: "" });
      document.getElementById("maxPwUs").style.border = "1px solid #f00";
    } else {
      document.getElementById("maxPwUs").style.border = "1px solid #d9d9d9";
      document.getElementById("minPwUs").style.border = "1px solid #d9d9d9";
    }
  };

  handleModelMinPriUs = () => {
    //重复间隔下限
    if (
      Number(this.props.form.getFieldValue("minPriUs")) >
      Number(this.props.form.getFieldValue("maxPriUs"))
    ) {
      message.warning(
        language[`lowerPriNotMoreThanUpperPri_${this.props.language.getlanguages}`]
      );
      this.props.form.setFieldsValue({ minPriUs: "" });
      document.getElementById("minPriUs").style.border = "1px solid #f00";
    } else {
      document.getElementById("minPriUs").style.border = "1px solid #d9d9d9";
    }
  };
  handleModelMaxPriUs = () => {
    //重复间隔上限
    if (
      Number(this.props.form.getFieldValue("minPriUs")) >
      Number(this.props.form.getFieldValue("maxPriUs"))
    ) {
      message.warning(
        language[`lowerPriNotMoreThanUpperPri_${this.props.language.getlanguages}`]
      );
      this.props.form.setFieldsValue({ maxPriUs: "" });
      document.getElementById("maxPriUs").style.border = "1px solid #f00";
    } else {
      document.getElementById("maxPriUs").style.border = "1px solid #d9d9d9";
    }
  };
  changeIndex = () => { };
  changePage = current => {
    //将当前的页数传递过来
    this.setState({
      currentpage: current
    });
  };
  selectionChange = (selectKey, selectRow) => {
    //表格单选
    const { key, model } = selectRow[0];
    this.setState({
      selectedRowKeys: key,
      chooseModel: model
    });
  };

  clickRow = record => {
    this.setState({ selectedRowKeys: record.key, chooseModel: record.model });
  };

  //切换技术体制
  handleChangetechnologyName = value => {
    if (value === "15") {
      this.setState({ technologyNameMark: true });
      this.props.form.setFieldsValue({
        minPwUs: "",
        maxPwUs: "",
        minPriUs: "",
        maxPriUs: ""
      });
    } else {
      this.setState({ technologyNameMark: false });
    }
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const FormItem = Form.Item;
    const Option = Select.Option;

    const rowSelection = {
      type: "radio",
      selectedRowKeys: [this.state.selectedRowKeys],
      onChange: this.selectionChange
    };
    const columns = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key",
        width: "3%"
      },
      {
        title:
          <Tooltip placement='top' title={language[`radarType_${this.props.language.getlanguages}`]}>
            {language[`radarType_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "model",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`RadioType_${this.props.language.getlanguages}`]}>
            {language[`RadioType_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "freqName",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`UpperOperatingFrequency_${this.props.language.getlanguages}`] + "[MHz]"}>
            {language[`UpperOperatingFrequency_${this.props.language.getlanguages}`] + "[MHz]"}
          </Tooltip>,
        dataIndex: "maxWorkFreqHz",
        ellipsis: true,
        width: "3%"
      },
      {
        title:
          <Tooltip placement='top' title={language[`LowerOperatingFrequency_${this.props.language.getlanguages}`] + "[MHz]"}>
            {language[`LowerOperatingFrequency_${this.props.language.getlanguages}`] + "[MHz]"}
          </Tooltip>,
        dataIndex: "minWorkFreqHz",
        ellipsis: true,
        width: "3%"
      },
      {
        title:
          <Tooltip placement='top' title={language[`PulseWidthType_${this.props.language.getlanguages}`]}>
            {language[`PulseWidthType_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "pwName",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`UpperPulseWidthLimit_${this.props.language.getlanguages}`] + "[μs]"}>
            {language[`UpperPulseWidthLimit_${this.props.language.getlanguages}`] + "[μs]"}
          </Tooltip>,
        dataIndex: "maxPwUs",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`LowerPulseWidthLimit_${this.props.language.getlanguages}`] + "[μs]"}>
            {language[`LowerPulseWidthLimit_${this.props.language.getlanguages}`] + "[μs]"}
          </Tooltip>,
        dataIndex: "minPwUs",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`RepetitionIntervalType_${this.props.language.getlanguages}`]}>
            {language[`RepetitionIntervalType_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "priName",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`UpperLimitInterval_${this.props.language.getlanguages}`] + "[μs]"}>
            {language[`UpperLimitInterval_${this.props.language.getlanguages}`] + "[μs]"}
          </Tooltip>,
        dataIndex: "maxPriUs",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`LowerLimitInterval_${this.props.language.getlanguages}`] + "[μs]"}>
            {language[`LowerLimitInterval_${this.props.language.getlanguages}`] + "[μs]"}
          </Tooltip>,
        dataIndex: "minPriUs",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`technicalSystem_${this.props.language.getlanguages}`]}>
            {language[`technicalSystem_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "technologyName",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`AntiInterferenceMode_${this.props.language.getlanguages}`]}>
            {language[`AntiInterferenceMode_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "antiName",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`MSTXPWR_${this.props.language.getlanguages}`] + "[W]"}>
            {language[`MSTXPWR_${this.props.language.getlanguages}`] + "[W]"}
          </Tooltip>,
        dataIndex: "maxTransmitPowerW",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`MaximumAntennaGain_${this.props.language.getlanguages}`] + "[dBm]"}>
            {language[`MaximumAntennaGain_${this.props.language.getlanguages}`] + "[dBm]"}
          </Tooltip>,
        dataIndex: "maxAntennaGain",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`MaximumOperatingDistance_${this.props.language.getlanguages}`] + "[km]"}>
            {language[`MaximumOperatingDistance_${this.props.language.getlanguages}`] + "[km]"}
          </Tooltip>,
        dataIndex: "maxDectectionRangeKm",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`ReceiverBandwidth_${this.props.language.getlanguages}`] + "[MHz]"}>
            {language[`ReceiverBandwidth_${this.props.language.getlanguages}`] + "[MHz]"}
          </Tooltip>,
        dataIndex: "receiverBwHz",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`CompressionCoefficient_${this.props.language.getlanguages}`]}>
            {language[`CompressionCoefficient_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "innerKa",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`systemLoss_${this.props.language.getlanguages}`]}>
            {language[`systemLoss_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "sustemLoss",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`noiseFactor_${this.props.language.getlanguages}`]}>
            {language[`noiseFactor_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "noiseFigure",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`sensitivity_${this.props.language.getlanguages}`] + "[dBm]"}>
            {language[`sensitivity_${this.props.language.getlanguages}`] + "[dBm]"}
          </Tooltip>,
        dataIndex: "minDetectablePowerDBm",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`producer_${this.props.language.getlanguages}`]}>
            {language[`producer_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "manufacturer",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`remark_${this.props.language.getlanguages}`]}>
            {language[`remark_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "radarRemark",
        ellipsis: true
      }
    ];
    return (
      <div className={styles.radarTypeWrap}>
        <div className={styles.radarTypeBox}>
          <Button
            type="primary"
            onClick={this.deleteAll}
            style={{ float: "right" }}
          >
            {language[`delete_${this.props.language.getlanguages}`]}
          </Button>
          <Button
            type="primary"
            onClick={this.updateData}
            style={{ float: "right", marginRight: "12px" }}
          >
            {language[`modification_${this.props.language.getlanguages}`]}
          </Button>
          <Button
            onClick={this.handleAdd}
            type="primary"
            style={{ float: "right", marginRight: "10px" }}
          >
            {language[`add_${this.props.language.getlanguages}`]}
          </Button>
        </div>
        {/* 文件列表 */}
        <div className={style.TableContent_radarType}>
          <Table
            loading={
              this.props.loading.effects["radarModel/selectAllRadarTypeData"]
            }
            rowSelection={rowSelection}
            rowKey={record => record.key}
            columns={columns}
            dataSource={this.state.dataSource}
            className={styleless.myClass}
            rowClassName={(record, index) =>
              index % 2 === 0 ? styleless.odd : styleless.even
            } //奇偶行颜色交替变化
            pagination={{
              // 分页
              onChange: this.changePage, //获取选中的页数
              pageSize: 15
            }}
            scroll={{ x: 4000 }}
            bordered
            onRow={record => {
              return {
                onClick: this.clickRow.bind(this, record) // 点击行
              };
            }}
          />
        </div>
        <div className={style.dataNum}>
          <span style={{ marginLeft: 8 }}>
            {language[`Altogether_${this.props.language.getlanguages}`]}
            &nbsp;&nbsp;
            {this.state.tableDataLength}
            &nbsp;&nbsp;
            {language[`BarData_${this.props.language.getlanguages}`]}
          </span>
          ,{/* 每页显示15条数据 */}
          {language[`current_${this.props.language.getlanguages}`]}
          &nbsp;&nbsp;
          {this.state.currentpage}/{Math.ceil(this.state.tableDataLength / 15)}
          &nbsp;&nbsp;
          {language[`Page_${this.props.language.getlanguages}`]}
        </div>
        <Form className={styleless.myBandForm}>
          {this.state.showAddDialog ? (
            <Dialog
              TitleText={language[`radarType_${this.props.language.getlanguages}`]}
              showDialog={this.state.showAddDialog}
              OkText={language[`DetermineTheInput_${this.props.language.getlanguages}`]}
              cancelText={language[`quit_${this.props.language.getlanguages}`]}
              mask={true}
              onCancel={this.handleCancel}
              className={styleless.Dialog_radarType}
              showMask
              BodyContent={
                <div
                  className={styles.popFodderType_workpop}
                  style={
                    this.props.language.getlanguages == "zh"
                      ? {}
                      : { width: "1300px" }
                  }
                >
                  <div
                    className={
                      this.props.language.getlanguages == "zh"
                        ? styles.popFodderType_workpop_ZHwrap
                        : styles.popFodderType_workpop_Frwrap
                    }
                  >
                    <div>
                      <FormItem label={language[`radarType_${this.props.language.getlanguages}`]}>
                        {getFieldDecorator("model", {
                          //雷达型号
                          rules: [{ required: true, whitespace: true }],
                          initialValue: this.state.nowTime,
                          getValueFromEvent: event => {
                            return event.target.value.slice(0, 40);
                          }
                        })(
                          <Input
                            type="text"
                            // onBlur={this.selectRepeatName}
                            autoComplete="off"
                            disabled={
                              this.state.addOrUpdateMark === "update"
                                ? true
                                : false
                            }
                          />
                        )}
                      </FormItem>
                    </div>

                    {/* 频率类型 */}
                    <div>
                      <FormItem label={language[`RadioType_${this.props.language.getlanguages}`]}>
                        {getFieldDecorator("freqName", {
                          rules: [{ required: true, whitespace: true }],
                          initialValue: "00"
                        })(
                          <Select dropdownStyle={{ zIndex: "1054" }}>
                            {language.RadiofrequencyType.map((v, k) => (
                              <Option value={v.value} key={v.value}>
                                {v[`name_${this.props.language.getlanguages}`]}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </div>

                    {/* 脉宽类型 */}
                    <div>
                      <FormItem label={language[`PulseWidthType_${this.props.language.getlanguages}`]}>
                        {getFieldDecorator("pwName", {
                          //脉宽类型
                          initialValue: "00",
                          rules: [
                            {
                              required: !this.state.technologyNameMark,
                              whitespace: !this.state.technologyNameMark
                            }
                          ]
                        })(
                          <Select
                            onChange={this.handleChangeMKLX}
                            dropdownStyle={{ zIndex: "1054" }}
                            disabled={this.state.technologyNameMark}
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
                    {/* 工作频率下限 */}
                    <div >
                      <FormItem label={language[`LowerOperatingFrequency_${this.props.language.getlanguages}`] + "[MHz]"}>
                        {getFieldDecorator("minWorkFreqHz", {
                          rules: [{ required: true, whitespace: true }],
                          getValueFromEvent: value => {
                            return String(value).replace(/\D/g, "");
                          }
                        })(
                          <InputNumber
                            min={50}
                            max={40050}
                            placeholder="50~40050"
                            onBlur={this.handleInputFreLower}
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>

                    {/* 脉宽下限 */}
                    <div>
                      <FormItem label={language[`LowerPulseWidthLimit_${this.props.language.getlanguages}`] + "[μs]"}>
                        {getFieldDecorator("minPwUs", {
                          //脉宽下限
                          rules: [
                            {
                              required: !this.state.technologyNameMark,
                              whitespace: !this.state.technologyNameMark
                            }
                          ],
                          getValueFromEvent: value => {
                            return String(value)
                              .replace(/[^\d.]/g, "")
                              .replace(/^\./g, "")
                              .replace(/\.{2,}/g, ".")
                              .replace(".", "$#$")
                              .replace(/\./g, "")
                              .replace("$#$", ".")
                              .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
                          }
                        })(
                          <InputNumber
                            min={0.05}
                            max={21000}
                            disabled={this.state.technologyNameMark}
                            placeholder="0.05~21000"
                            onBlur={this.handleModelMinPwUs}
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* 工作频率上限 */}
                    <div>
                      <FormItem label={language[`UpperOperatingFrequency_${this.props.language.getlanguages}`] + "[MHz]"}>
                        {getFieldDecorator("maxWorkFreqHz", {
                          rules: [{ required: true, whitespace: true }],
                          getValueFromEvent: value => {
                            return String(value).replace(/\D/g, "");
                          }
                        })(
                          <InputNumber
                            min={50}
                            max={40050}
                            placeholder="50~40050"
                            onBlur={this.handleInputFreMax}
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* 脉宽上限 */}
                    <div>
                      <FormItem label={language[`UpperPulseWidthLimit_${this.props.language.getlanguages}`] + "[μs]"}>
                        {getFieldDecorator("maxPwUs", {
                          rules: [
                            {
                              required: !this.state.technologyNameMark,
                              whitespace: !this.state.technologyNameMark
                            }
                          ],
                          getValueFromEvent: value => {
                            return String(value)
                              .replace(/[^\d.]/g, "")
                              .replace(/^\./g, "")
                              .replace(/\.{2,}/g, ".")
                              .replace(".", "$#$")
                              .replace(/\./g, "")
                              .replace("$#$", ".")
                              .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
                          }
                        })(
                          <InputNumber
                            min={0.05}
                            max={21000}
                            placeholder="0.05~21000"
                            disabled={this.state.technologyNameMark}
                            onBlur={this.handleModelMaxPwUs}
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* 重复间隔类型 */}
                    <div>
                      <FormItem label={language[`RepetitionIntervalType_${this.props.language.getlanguages}`]}>
                        {getFieldDecorator("priName", {
                          rules: [
                            {
                              required: !this.state.technologyNameMark,
                              whitespace: !this.state.technologyNameMark
                            }
                          ],
                          initialValue: "00"
                        })(
                          <Select
                            onChange={this.handleChangeCFJGLX}
                            dropdownStyle={{ zIndex: "1054" }}
                            disabled={this.state.technologyNameMark}
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
                    {/* 技术体制 */}
                    <div>
                      <FormItem label={language[`technicalSystem_${this.props.language.getlanguages}`]}>
                        {getFieldDecorator("technologyName", {
                          initialValue: "00"
                        })(
                          <Select
                            id="technologyName"
                            onChange={this.handleChangetechnologyName}
                            onBlur={this.saveFormMsg}
                            dropdownStyle={{ zIndex: "1054" }}
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
                    {/* 重复间隔下限 */}
                    <div>
                      <FormItem label={language[`LowerLimitInterval_${this.props.language.getlanguages}`] + "[μs]"}>
                        {getFieldDecorator("minPriUs", {
                          rules: [
                            {
                              required: !this.state.technologyNameMark,
                              whitespace: !this.state.technologyNameMark
                            }
                          ],
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
                            disabled={this.state.technologyNameMark}
                            min={2}
                            max={21000}
                            step={0.0001}
                            placeholder="2~21000"
                            onBlur={this.handleModelMinPriUs}
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* 抗干扰方式 */}
                    <div>
                      <FormItem label={language[`AntiInterferenceMode_${this.props.language.getlanguages}`]}>
                        {getFieldDecorator("antiName", {
                          initialValue: "00"
                        })(
                          <Select
                            onChange={this.handleChangeCFJGLX}
                            dropdownStyle={{ zIndex: "1054" }}
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

                    {/* 重复间隔上限 */}
                    <div>
                      <FormItem label={language[`UpperLimitInterval_${this.props.language.getlanguages}`] + "[μs]"}>
                        {getFieldDecorator("maxPriUs", {
                          rules: [
                            {
                              required: !this.state.technologyNameMark,
                              whitespace: !this.state.technologyNameMark
                            }
                          ],
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
                            disabled={this.state.technologyNameMark}
                            min={2}
                            max={21000}
                            step={0.0001}
                            placeholder="2~21000"
                            onBlur={this.handleModelMaxPriUs}
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* 最大发射功率 */}
                    <div>
                      <FormItem label={language[`MSTXPWR_${this.props.language.getlanguages}`] + "[W]"}>
                        {getFieldDecorator("maxTransmitPowerW", {
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
                            min={1}
                            max={99999999.9999}
                            step={0.0001}
                            placeholder="1~99999999.9999"
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* 最大天线增益 */}
                    <div>
                      <FormItem label={language[`MaximumAntennaGain_${this.props.language.getlanguages}`] + "[dBm]"}>
                        {getFieldDecorator("maxAntennaGain", {
                          getValueFromEvent: value => {
                            return String(value).replace(/\D/g, "");
                          }
                        })(
                          <InputNumber
                            min={1}
                            max={999}
                            placeholder="1~999"
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* 最大作用距离 */}
                    <div>
                      <FormItem label={language[`MaximumOperatingDistance_${this.props.language.getlanguages}`] + "[Km]"}>
                        {getFieldDecorator("maxDectectionRangeKm", {
                          getValueFromEvent: value => {
                            return String(value)
                              .replace(/[^\d.]/g, "")
                              .replace(/^\./g, "")
                              .replace(/\.{2,}/g, ".")
                              .replace(".", "$#$")
                              .replace(/\./g, "")
                              .replace("$#$", ".")
                              .replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, "$1$2.$3");
                          }
                        })(
                          <InputNumber
                            min={1}
                            max={99999999999.9999}
                            step={0.0001}
                            placeholder="1~99999999999.9999"
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* 接收机带宽 */}
                    <div>
                      <FormItem label={language[`ReceiverBandwidth_${this.props.language.getlanguages}`] + "[MHz]"}>
                        {getFieldDecorator("receiverBwHz", {
                          getValueFromEvent: value => {
                            return String(value)
                              .replace(/[^\d.]/g, "")
                              .replace(/^\./g, "")
                              .replace(/\.{2,}/g, ".")
                              .replace(".", "$#$")
                              .replace(/\./g, "")
                              .replace("$#$", ".")
                              .replace(/^(\-)*(\d)\.(\d\d).*$/, "$1$2.$3");
                          }
                        })(
                          <InputNumber
                            min={1}
                            max={99.9999}
                            step={0.0001}
                            placeholder="1~99.9999"
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* 压制系数 */}
                    <div>
                      <FormItem label={language[`CompressionCoefficient_${this.props.language.getlanguages}`]}>
                        {getFieldDecorator("innerKa", {
                          getValueFromEvent: value => {
                            return String(value)
                              .replace(/[^\d.]/g, "")
                              .replace(/^\./g, "")
                              .replace(/\.{2,}/g, ".")
                              .replace(".", "$#$")
                              .replace(/\./g, "")
                              .replace("$#$", ".")
                              .replace(/^(\-)*(\d)\.(\d\d).*$/, "$1$2.$3");
                          }
                        })(
                          <InputNumber
                            min={1}
                            max={999.99}
                            step={0.01}
                            placeholder="1~999.99"
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* 系统损耗 */}
                    <div>
                      <FormItem label={language[`systemLoss_${this.props.language.getlanguages}`]}>
                        {getFieldDecorator("sustemLoss", {
                          //重复间隔上限
                          getValueFromEvent: value => {
                            return String(value).replace(/\D/g, "");
                          }
                        })(
                          <InputNumber
                            placeholder="1~999"
                            min={1}
                            max={999}
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* 噪声系数 */}
                    <div>
                      <FormItem label={language[`noiseFactor_${this.props.language.getlanguages}`]}>
                        {getFieldDecorator("noiseFigure", {
                          getValueFromEvent: value => {
                            return String(value)
                              .replace(/[^\d.]/g, "")
                              .replace(/^\./g, "")
                              .replace(/\.{2,}/g, ".")
                              .replace(".", "$#$")
                              .replace(/\./g, "")
                              .replace("$#$", ".")
                              .replace(/^(\-)*(\d)\.(\d\d).*$/, "$1$2.$3");
                          }
                        })(
                          <InputNumber
                            className={styleless.input}
                            min={1}
                            max={999.99}
                            step={0.01}
                            placeholder="1~999.99"
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* 灵敏度 */}
                    <div>
                      <FormItem label={language[`sensitivity_${this.props.language.getlanguages}`] + "[dBm]"}>
                        {getFieldDecorator("minDetectablePowerDBm", {
                          getValueFromEvent: value => {
                            let str = String(value).replace(
                              /^(\-)*(\d+)\.(\d\d\d\d).*$/,
                              "$1$2.$3"
                            );
                            if (str == null || str == "null") str = "";
                            return str;
                          }
                        })(
                          <InputNumber
                            max={99999999.9999}
                            step={0.0001}
                            placeholder="-99999999.9999~99999999.9999"
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>

                    {/* 生产商 */}
                    <div>
                      <FormItem label={language[`producer_${this.props.language.getlanguages}`]}>
                        {getFieldDecorator("manufacturer", {
                          getValueFromEvent: event => {
                            return event.target.value.slice(0, 40);
                          }
                        })(<Input type="text" autoComplete="off" />)}
                      </FormItem>
                    </div>
                    {/* 备注 */}
                    <div>
                      <FormItem label={language[`remark_${this.props.language.getlanguages}`]}>
                        {getFieldDecorator("radarRemark", {
                          getValueFromEvent: event => {
                            return event.target.value.slice(0, 255);
                          }
                        })(<Input type="text" autoComplete="off" />)}
                      </FormItem>
                    </div>
                  </div>
                  <div
                    style={
                      this.props.language.getlanguages == "zh"
                        ? { margin: "20px auto", width: "140px" }
                        : { margin: "20px auto", width: "240px" }
                    }
                  >
                    <Button
                      type="primary"
                      onClick={this.handleCancel}
                      style={{ marginRight: "10px", display: "inline-block" }}
                    >
                      {language[`cancel_${this.props.language.getlanguages}`]}
                    </Button>
                    <Form.Item style={{ display: "inline-block" }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        onClick={this.handleSubmit}
                      >
                        {language[`confirm_${this.props.language.getlanguages}`]}
                      </Button>
                    </Form.Item>
                  </div>
                </div>
              }
            />
          ) : null}
        </Form>
        <DialogConfirm
          visible={this.state.showConfirmDialog}
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
      </div>
    );
  }
}
RadarType = Form.create({
  mapPropsToFields(props) {
    if (props.data != null && props.data[0]) {
      //点击情报整编表格的编辑 数据
      let basicData = props.data[0];
      return {
        model: Form.createFormField({
          ...props,
          value: basicData.model
        }),
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
        manufacturer: Form.createFormField({
          ...props,
          value: basicData.manufacturer
        }),
        radarRemark: Form.createFormField({
          ...props,
          value: basicData.radarRemark
        })
      };
    }
  }
})(RadarType);
export default RadarType;
