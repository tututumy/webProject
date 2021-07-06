import React, { Component } from "react";
import style from "./Edit.css";
import styleless from "./test.less";
import wmstyle from "./style/RadarWorkModel_Target.less"
import { Select, Table, Button, Input, Popconfirm, Form, message, InputNumber } from "antd";
import Dialog from "../../utils/DialogMask/Dialog";
import { connect } from "dva";
import language from "../language/language";

@connect(({ language, radarModel }) => ({ language, radarModel }))
//工作模式------点击“添加”按钮弹出添加荣作模式的内容框
class AddTable extends Component {
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
      MBImportMark: false,
      EditMark: false,
      WXDJ: language[`notClear_${this.props.language.getlanguages}`],
      SPLX: language[`unknown_${this.props.language.getlanguages}`],
      MKLX: language[`unknown_${this.props.language.getlanguages}`],
      CFJGLX: language[`unknown_${this.props.language.getlanguages}`],

      SPData: [],
      SPCount: 0,
      MKData: [],
      MKCount: 0,
      CFJGData: [],
      CFJGCount: 0,
      mark: "",
      nowTime: null, //当前时间
      rowId: -1, //工作模式当前被点击的行
      modeId: null, //工作模式当前被点击的行的模式内码

      clearMsg: false,
      targetWorkModel_fromTar: null,
      WorkModelMsg_Target: null,
      ModelMsg: null,
      selectedRowKeys: "", //工作模式是否选中
      modelMaxWorkFreqHz: 40050,
      modelMinWorkFreqHz: 50,
      modelMaxPwUs: 21000,
      modelMinPwUs: 0.05,
      modelMaxPriUs: 21000,
      modelMinPriUs: 2,
      freqChange: "",
      pwChange: "",
      priChange: "",


      FloatBlur_SP_flag: false,//工作模式-射频的输入框失去焦点值填写的是否符合的标识
      FloatBlur_CFJG_flag: false,//工作模式-重复间隔的输入框失去焦点值填写的是否符合的标识
    };
  }

  UNSAFE_componentWillMount() {
    //当清除雷达整编数据关闭，整编状态打开才显示数据
    if (
      this.props.radarModel.clearMsg === false &&
      this.props.radarModel.ZBMark === true
    ) {
      let data = this.props.radarModel.ModelMsg;
      if (data) {
        if (data[2].length) {
          let workModelData = data[2];
          let arr = [];
          for (let i = 0; i < workModelData.length; i++) {
            arr.push({
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
        } else {
          this.setState({ dataSource: [] });
        }
      }
    } else if (
      (this.props.radarModel.clearMsg === false &&
        this.props.radarModel.MBImportMark === true) ||
      (this.props.radarModel.clearMsg === false &&
        this.props.radarModel.EditMark)
    ) {
      let data = this.props.radarModel.targetDetailMsg;
      if (data && data[2]) {
        if (data[2].length) {
          let workModelData = data[2];
          let arr = [];
          for (let i = 0; i < workModelData.length; i++) {
            arr.push({
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
        } else {
          this.setState({ dataSource: [] });
        }
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextprops) {
    this.setState({
      clearMsg: nextprops.radarModel.clearMsg,
      targetWorkModel_fromTar: nextprops.radarModel.targetWorkModel_fromTar, //从目标库导入的内容
      WorkModelMsg_Target: nextprops.radarModel.WorkModelMsg_Target, //整编导入的内容
      ModelMsg: nextprops.radarModel.ModelMsg
    });
  }
  //删除工作模式
  handleDel = modeId => {
    this.props.dispatch({
      type: "radarModel/deleteWorkModel",
      payload: {
        modeId: modeId
      }
    });

    const dataSource = [...this.props.radarModel.target_workModelMsg_Main];
    let data = dataSource.filter(item => item.modeId !== modeId);
    this.props.dispatch({
      type: "radarModel/updataWorkModel_Main",
      payload: data
    });
  };

  //点击添加按钮，打开新增工作模式的弹出框
  showModal = () => {
    if (!document.getElementById("objectName").value) {
      message.warning(language[`improveECMSpecialReportTips_${this.props.language.getlanguages}`]);
      return false;
    }
    if (this.props.model == "-1") {
      message.warning(language[`select_radar_target_model_${this.props.language.getlanguages}`]
      );
      return false;
    }
    var data = new Date().getTime();
    this.setState({
      visible: true,
      nowTime: String(data)
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };
  handleChangeWXDJ = value => {
    this.setState({ WXDJ: value });
  };
  handleChangeSPLX = value => {
    this.setState({ SPLX: value });
  };
  handleChangeMKLX = value => {
    this.setState({ MKLX: value });
  };
  handleChangeCFJGLX = value => {
    this.setState({ CFJGLX: value });
  };

  //点击工作模式中的行  显示对应的工作模式详细内容
  clickRow = record => {
    this.setState({
      modeId: record.modeId,
      selectedRowKeys: record.id,
      modelMaxWorkFreqHz: Number(record.modelMaxWorkFreqHz),
      modelMinWorkFreqHz: Number(record.modelMinWorkFreqHz),
      freqChange: `${Number(record.modelMinWorkFreqHz)}~${Number(
        record.modelMaxWorkFreqHz
      )}`,
      modelMaxPwUs: Number(record.modelMaxPwUs),
      modelMinPwUs: Number(record.modelMinPwUs),
      pwChange: `${Number(record.modelMinPwUs)}~${Number(record.modelMaxPwUs)}`,
      modelMaxPriUs: Number(record.modelMaxPriUs),
      modelMinPriUs: Number(record.modelMinPriUs),
      priChange: `${Number(record.modelMinPriUs)}~${Number(
        record.modelMaxPriUs
      )}`,
      rowId: record.modeId // 将点击的工作模式一行中的模式内码保存起来
    });

    //点击工作模式中的行  显示对应的工作模式详细内容
    this.props.dispatch({
      type: "radarModel/SelectDetailFreqPwPri",
      payload: record.modeId,
      callback: res => {
        if (res.data[0]) {
          let arr_SP = res.data[0].workModelFreqList;
          let arr_PW = res.data[0].workModelPWList;
          let arr_CFJG = res.data[0].workModelPriList;

          //动态变量给form赋值
          let obj = {};
          for (let i = 1; i <= arr_SP.length; i++) {
            obj["valueA" + i] = arr_SP[i - 1].freq;
          }
          for (let i = 1; i <= arr_PW.length; i++) {
            obj["valueB" + i] = arr_PW[i - 1].pw;
          }
          for (let i = 1; i <= arr_CFJG.length; i++) {
            obj["valueC" + i] = arr_CFJG[i - 1].pri;
          }
          this.props.form.setFieldsValue(obj);
        }
      }
    });
  };

  //给点击的行设置一个背景色
  setRowClassName = record => {
    return record.modeId === this.state.rowId
      ? `${style["l_table_row_active"]}`
      : "";
  };

  //射频添加数据
  addData_SP = e => {
    if (this.state.rowId === -1) {//如果没有选择一条工作模式，则提示
      message.warning(language[`select_a_working_mode_first_${this.props.language.getlanguages}`]);
      return false;
    }
    let tempdata =
      this.props.radarModel.target_workModelMsg_SP == null
        ? []
        : this.props.radarModel.target_workModelMsg_SP;
    console.log("tempdata==========", tempdata)
    let SPCount = tempdata.length;
    if (SPCount >= 32) {
      // 最多只能添加32个射频数据！
      message.warning(language[`RF_data_can_be_added_at_most_${this.props.language.getlanguages}`]);
    } else {
      let count = 0;
      if (tempdata.length > 0) {
        //如果射频的数据不为空           //如果上一条频率值没有输入禁止再点击添加
        for (let i = 0; i < tempdata.length; i++) {
          if (!tempdata[i].freq || tempdata[i].freq === ".000") {
            //如果有某一个频率值为空则count统计数量+1
            count += 1;
          }
        }
        if (count > 0) {
          //如果count大于0则提示先输入上一条的频率值
          // 请先输入上一条中的频率值
          message.warning(language[`enter_the_value_of_the_previous_input_box_first_${this.props.language.getlanguages}`]);
          return false;
        }
      }

      tempdata.push({
        key: SPCount + 1,
        freq: ""
      });

      this.props.dispatch({
        type: "radarModel/updateTarget_workModelMsg_SP",
        payload: {
          target_workModelMsg_SP: tempdata,
          deleteMark: false
        }
      });
    }
  };

  //射频获取表单改变事件
  FloatBlur_SP = (e, key) => {
    let tempdata = this.props.radarModel.target_workModelMsg_SP == null     //存储在model层的射频值缓存
      ? []
      : this.props.radarModel.target_workModelMsg_SP;
    tempdata.map(item => {               //将射频值缓存格式化成标准格式
      if (item.freq.indexOf(".") == -1) {
        item.freq = item.freq + ".000";
      } else if (item.freq.split(".")[1].length == 1) {
        item.freq = item.freq + "00";
      } else if (item.freq.split(".")[1].length == 2) {
        item.freq = item.freq + "0";
      }
    })

    let values = this.props.form.getFieldValue(e); //获取当前改变的值

    if (values) {  //当前值不为空
      if (values.indexOf(".") == -1) {  //将当前的值格式化成标准格式
        values = values + ".000";
      } else if (values.split(".")[1].length == 1) {
        values = values + "00";
      } else if (values.split(".")[1].length == 2) {
        values = values + "0";
      }

      //1.先判断当前输入的值是否在范围之内
      let min = this.state.modelMinWorkFreqHz;  //输入框最小值
      let max = this.state.modelMaxWorkFreqHz;  //输入框最大值
      if (values < min || values > max) {    //输入范围超限
        message.warning(language[`TheInputValueIsOutOfRange_${this.props.language.getlanguages}`]);
        this.props.form.setFieldsValue({ [e]: "" }); //输入值超出范围，则把当前的输入框置空
        //设置一个标识说明触发了失去焦点事件
        this.setState({ FloatBlur_SP_flag: true })
        return false;
      }



      tempdata[key - 1].freq = values; //赋值给表单
      let arr = [];
      for (let i in tempdata) {
        arr.push(tempdata[i].freq);
      }

      //检查输入是否有重复值，如果有则提示
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[i] == arr[j]) {
            message.warning(language[`InputRepetition_${this.props.language.getlanguages}`]);
            this.props.form.setFieldsValue({ [e]: "" }); //有重复，则把当前的输入框置空
            tempdata[key - 1].freq = "";
            values = ""; //赋值给表单
            return false;
          }
        }
      }

      this.props.dispatch({
        type: "radarModel/updateTarget_workModelMsg_SP",
        payload: {
          target_workModelMsg_SP: tempdata,
          deleteMark: false
        }
      });
    } else {
      tempdata[key - 1].freq = "";
      this.props.dispatch({
        type: "radarModel/updateTarget_workModelMsg_SP",
        payload: {
          target_workModelMsg_SP: tempdata,
          deleteMark: false
        }
      });
    }
  };

  //删除射频信息
  handleDel_SP = key => {
    let tempdata =
      this.props.radarModel.target_workModelMsg_SP == null
        ? []
        : this.props.radarModel.target_workModelMsg_SP;
    let arr = [];
    for (let i in tempdata) {
      arr.push(tempdata[i].freq);
    }
    arr.splice(key - 1, 1);

    //动态变量给form赋值
    let obj = {};
    for (let i = 1; i <= arr.length; i++) {
      obj["valueA" + i] = arr[i - 1];
    }
    this.props.form.setFieldsValue(obj);

    let data1 = this.props.radarModel.target_workModelMsg_SP;
    let arr_SP = [];
    if (this.props.radarModel.target_workModelMsg_SP != null) {
      for (let i = 0; i < data1.length; i++) {
        arr_SP.push({
          key: i,
          freq: data1[i].freq
        });
      }
    }
    const dataSource = [...arr_SP];
    let data = dataSource.filter(item => item.key !== key - 1);
    this.props.dispatch({
      type: "radarModel/updateTarget_workModelMsg_SP",
      payload: {
        target_workModelMsg_SP: data,
        deleteMark: true
      }
    });
  };

  // 脉宽添加数据
  addData_MK = e => {
    if (this.state.rowId === -1) {
      //请先选择一条工作模式
      message.warning(
        language[
        `select_a_working_mode_first_${this.props.language.getlanguages}`
        ]
      );
      return false;
    }

    //如果技术体制为连续波则不允许输入重复间隔和脉宽
    if (this.props.technologyNameMark === true) {
      //技术体制为连续波不能添加脉宽
      message.warning(
        language[
        `TechnicalSystemWithoutAddingPulseWidth_${
        this.props.language.getlanguages
        }`
        ]
      );
      return false;
    }

    let tempdata =
      this.props.radarModel.target_workModelMsg_MK == null
        ? []
        : this.props.radarModel.target_workModelMsg_MK;
    let MKCount = tempdata.length;
    if (MKCount >= 1) {
      //最多只能添加1个脉宽数据！
      message.warning(language[`PW_data_can_be_added_at_most_${this.props.language.getlanguages}`]);
    } else {
      let count = 0;
      if (tempdata.length > 0) {
        for (let i = 0; i < tempdata.length; i++) {
          if (tempdata[i].pw == "") {
            count += 1;
          }
        }
        if (count > 0) {
          // message.warning("请先输入上一条中的脉宽值");
          message.warning(language[`enter_the_value_of_the_previous_input_box_first_${this.props.language.getlanguages}`]);
          return false;
        }
      }

      tempdata.push({
        key: MKCount + 1,
        number: MKCount + 1,
        pw: ""
      });

      this.props.dispatch({
        type: "radarModel/updateTarget_workModelMsg_MK",
        payload: {
          target_workModelMsg_MK: tempdata,
          deleteMark: false
        }
      });
    }
  };

  // 脉宽获取表单改变事件
  FloatBlur_MK = (e, key) => {
    let tempdata =
      this.props.radarModel.target_workModelMsg_MK == null
        ? []
        : this.props.radarModel.target_workModelMsg_MK;
    let values = this.props.form.getFieldValue(e); //获取当前改变的值
    let min = this.state.modelMinPwUs;
    let max = this.state.modelMaxPwUs;
    if (values < min || values > max) {
      message.warning(language[`TheInputValueIsOutOfRange_${this.props.language.getlanguages}`]);
      this.props.form.setFieldsValue({ [e]: "" }); //有重复，则把当前的输入框置空
      return;
    }
    tempdata[key - 1].pw = values; //赋值给表单
    this.props.dispatch({
      type: "radarModel/updateTarget_workModelMsg_MK",
      payload: {
        target_workModelMsg_MK: tempdata,
        deleteMark: false
      }
    });
  };

  //删除脉宽信息
  handleDel_MK = key => {
    let data1 = this.props.radarModel.target_workModelMsg_MK;
    let arr_MK = [];
    if (this.props.radarModel.target_workModelMsg_MK != null) {
      for (let i = 0; i < data1.length; i++) {
        arr_MK.push({
          key: i,
          pw: data1[i].pw
        });
      }
    }
    const dataSource = [...arr_MK];
    let data = dataSource.filter(item => item.key !== key - 1);
    this.props.dispatch({
      type: "radarModel/updateTarget_workModelMsg_MK",
      payload: {
        target_workModelMsg_MK: data,
        deleteMark: true
      }
    });
  };

  // 重复间隔添加数据
  addData_CFJG = e => {
    if (this.state.rowId === -1) {
      //请先选择一条工作模式
      message.warning(language[`select_a_working_mode_first_${this.props.language.getlanguages}`]);
      return false;
    }

    //如果技术体制为连续波则不允许输入重复间隔和脉宽
    if (this.props.technologyNameMark === true) {
      //技术体制为连续波不能添加重复间隔！
      message.warning(language[`TechnicalSystemNotAddRepetitionInterval_${this.props.language.getlanguages}`]);
      return false;
    }

    let tempdata =
      this.props.radarModel.target_workModelMsg_CFJG == null
        ? []
        : this.props.radarModel.target_workModelMsg_CFJG;
    let CFJGCount = tempdata.length;
    if (CFJGCount >= 32) {
      //最多只能添加32个重复间隔数据
      message.warning(language[`PRI_data_can_be_added_at_most_${this.props.language.getlanguages}`]);
    } else {
      let count = 0;
      if (tempdata.length > 0) {
        for (let i = 0; i < tempdata.length; i++) {
          if (tempdata[i].pri == "" || tempdata[i].pri === ".0000") {
            count += 1;
          }
        }
        if (count > 0) {
          // 请先输入上一条中的重复间隔值
          message.warning(language[`enter_the_value_of_the_previous_input_box_first_${this.props.language.getlanguages}`]);
          return false;
        }
      }

      tempdata.push({
        key: CFJGCount + 1,
        number: CFJGCount + 1,
        pri: ""
      });

      this.props.dispatch({
        type: "radarModel/updateTarget_workModelMsg_CFJG",
        payload: {
          target_workModelMsg_CFJG: tempdata,
          deleteMark: false
        }
      });
    }
  };

  // 重复间隔获取表单改变事件
  FloatBlur_CFJG = (e, key) => {
    let tempdata =
      this.props.radarModel.target_workModelMsg_CFJG == null
        ? []
        : this.props.radarModel.target_workModelMsg_CFJG;
    tempdata.map(item => {
      if (item.pri.indexOf(".") == -1) {
        item.pri = item.pri + ".0000";
      } else if (item.pri.split(".")[1].length == 1) {
        item.pri = item.pri + "000";
      } else if (item.pri.split(".")[1].length == 2) {
        item.pri = item.pri + "00";
      } else if (item.pri.split(".")[1].length == 3) {
        item.pri = item.pri + "0";
      }
    })
    let values = this.props.form.getFieldValue(e); //获取当前改变的值
    if (values) {
      if (values.indexOf(".") == -1) {
        values = values + ".0000";
      } else if (values.split(".")[1].length == 1) {
        values = values + "000";
      } else if (values.split(".")[1].length == 2) {
        values = values + "00";
      } else if (values.split(".")[1].length == 3) {
        values = values + "0";
      }

      let min = this.state.modelMinPriUs;
      let max = this.state.modelMaxPriUs;
      if (values < min || values > max) {
        message.warning(language[`TheInputValueIsOutOfRange_${this.props.language.getlanguages}`]);
        this.props.form.setFieldsValue({ [e]: "" }); //有重复，则把当前的输入框置空
        this.setState({ FloatBlur_CFJG_flag: true });
        return false;
      }

      tempdata[key - 1].pri = values; //赋值给表单
      let arr = [];
      for (let i in tempdata) {
        arr.push(tempdata[i].pri);
      }

      //检查输入是否有重复值，如果有则提示
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[i] == arr[j]) {
            message.warning(
              language[`InputRepetition_${this.props.language.getlanguages}`]
            );
            this.props.form.setFieldsValue({ [e]: "" }); //有重复，则把当前的输入框置空
            tempdata[key - 1].pri = "";
            values = ""; //赋值给表单
            return false;
          }
        }
      }

      this.props.dispatch({
        type: "radarModel/updateTarget_workModelMsg_CFJG",
        payload: {
          target_workModelMsg_CFJG: tempdata,
          deleteMark: false
        }
      });
    } else {
      tempdata[key - 1].pri = ""; //赋值给表单
      this.props.dispatch({
        type: "radarModel/updateTarget_workModelMsg_CFJG",
        payload: {
          target_workModelMsg_CFJG: tempdata,
          deleteMark: false
        }
      });
    }
  };

  //删除重复间隔信息
  handleDel_CFJG = key => {
    let tempdata =
      this.props.radarModel.target_workModelMsg_CFJG == null
        ? []
        : this.props.radarModel.target_workModelMsg_CFJG;
    let arr = [];
    for (let i in tempdata) {
      arr.push(tempdata[i].pri);
    }
    arr.splice(key - 1, 1);

    //动态变量给form赋值
    let obj = {};
    for (let i = 1; i <= arr.length; i++) {
      obj["valueC" + i] = arr[i - 1];
    }
    this.props.form.setFieldsValue(obj);

    let data1 = this.props.radarModel.target_workModelMsg_CFJG;
    let arr_CFJG = [];
    if (this.props.radarModel.target_workModelMsg_CFJG != null) {
      for (let i = 0; i < data1.length; i++) {
        arr_CFJG.push({
          key: i,
          pri: data1[i].pri
        });
      }
    }
    const dataSource = [...arr_CFJG];
    let data = dataSource.filter(item => item.key !== key - 1);
    this.props.dispatch({
      type: "radarModel/updateTarget_workModelMsg_CFJG",
      payload: {
        target_workModelMsg_CFJG: data,
        deleteMark: true
      }
    });
  };

  //添加工作模式弹出框中的确定按钮事件
  handleSubmit = e => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let data = [];
        if (this.props.radarModel.targetDetailMsg) {
          data = this.props.radarModel.targetDetailMsg[0];
        }
        let arr = this.props.radarModel.target_workModelMsg_Main
          ? this.props.radarModel.target_workModelMsg_Main
          : [];
        arr.push(values);
        this.props.dispatch({
          type: "radarModel/update_target_WorkModel_main",
          payload: {
            workModelList: [values],
            objectName: data.objectName,
            model: data.model,
            countryName: data.countryName,
            forName: data.forName,
            threadName: data.threadName,
            purpose: data.purpose,
            activeAreaDescription: data.activeAreaDescription,
            deployInformation: data.deployInformation,
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
            innerKa: data.maxDectectionRangeKm,
            sustemLoss: data.sustemLoss,
            noiseFigure: data.noiseFigure,
            minDetectablePowerDBm: data.minDetectablePowerDBm,
            radarRemark: data.radarRemark
          }
        });
        this.props.dispatch({
          type: "radarModel/update_target_WorkModel_main_data",
          payload: arr
        });
        this.props.form.resetFields(); //给form表单清空值
        this.setState({
          visible: false
        });
      } else {
        message.warning(language[`improveECMSpecialReportTips_${this.props.language.getlanguages}`]);
      }
    });
  };

  //保存添加射频、脉宽和重复间隔值
  saveData = type => {
    if (type === "射频") {
      if (this.state.FloatBlur_SP_flag) {
        this.setState({ FloatBlur_SP_flag: false })
        return false;
      }

      let data = this.props.radarModel.target_workModelMsg_SP
        ? this.props.radarModel.target_workModelMsg_SP
        : [];


      console.log("this.props.radarModel.deleteMark", this.props.radarModel.deleteMark)

      if (data.length == 0) {
        message.warning(language[`FrequencyValueCannotBeEmpty_${this.props.language.getlanguages}`])
        return false;
      }

      console.log("data==========", data)
      for (let j = 0; j < data.length; j++) {
        if (!data[j].freq || data[j].freq === ".000") {
          // 值不能为空！
          message.warning(language[`FrequencyValueCannotBeEmpty_${this.props.language.getlanguages}`]);
          return false;
        }
      }
      let arr = [];
      if (data.length == 0) {
        this.props.dispatch({
          type: "radarModel/saveWorkModel_threePart_SP",
          payload: [{ modeId: this.state.modeId, sn: -1 }],
          callback: res => {
            if (res.data && res.data[0] == "1") {
              message.success(language[`saveSuccess_${this.props.language.getlanguages}`]);
            } else {
              message.error(
                language[`saveFailure_${this.props.language.getlanguages}`]
              );
            }
          }
        });
      } else {
        for (let i = 0; i < data.length; i++) {
          arr.push({
            modeId: this.state.modeId,
            sn: i + 1,
            freq: data[i].freq
          });
        }
        this.props.dispatch({
          type: "radarModel/saveWorkModel_threePart_SP",
          payload: arr,
          callback: res => {
            if (res.data && res.data[0] == "1") {
              message.success(language[`saveSuccess_${this.props.language.getlanguages}`]);
            } else {
              message.error(language[`saveFailure_${this.props.language.getlanguages}`]);
            }
          }
        });
      }
    } else if (type === "脉宽") {
      let data = this.props.radarModel.target_workModelMsg_MK
        ? this.props.radarModel.target_workModelMsg_MK
        : [];

      if (data.length == 0) {
        message.warning(language[`PulseWidthValueCannotBeEmpty_${this.props.language.getlanguages}`])
        return false;
      }

      for (let j = 0; j < data.length; j++) {
        if (!data[j].pw || data[j].pw === ".0000") {
          // 值不能为空！
          message.warning(
            language[`PulseWidthValueCannotBeEmpty_${this.props.language.getlanguages}`]
          );
          return false;
        }
      }
      let arr = [];
      if (data.length == 0) {
        this.props.dispatch({
          type: "radarModel/saveWorkModel_threePart_MK",
          payload: [{ modeId: this.state.modeId, sn: -1 }],
          callback: res => {
            if (res.data && res.data[0] == "1") {
              message.success(
                language[`saveSuccess_${this.props.language.getlanguages}`]
              );
            } else {
              message.error(
                language[`saveFailure_${this.props.language.getlanguages}`]
              );
            }
          }
        });
      } else {
        for (let i = 0; i < data.length; i++) {
          arr.push({
            modeId: this.state.modeId,
            sn: i + 1,
            pw: data[i].pw
          });
        }
        this.props.dispatch({
          type: "radarModel/saveWorkModel_threePart_MK",
          payload: arr,
          callback: res => {
            if (res.data && res.data[0] == "1") {
              message.success(
                language[`saveSuccess_${this.props.language.getlanguages}`]
              );
            } else {
              message.error(
                language[`saveFailure_${this.props.language.getlanguages}`]
              );
            }
          }
        });
      }
    } else if (type === "重复间隔") {
      if (this.state.FloatBlur_CFJG_flag) {
        this.setState({ FloatBlur_CFJG_flag: false })
        return false;
      }
      let data = this.props.radarModel.target_workModelMsg_CFJG
        ? this.props.radarModel.target_workModelMsg_CFJG
        : [];

      if (data.length == 0) {
        message.warning(language[`RepeatIntervalValueCannotBeEmpty_${this.props.language.getlanguages}`])
        return false;
      }
      for (let j = 0; j < data.length; j++) {
        if (!data[j].pri || data[j].pri === ".0000") {
          //值不能为空！
          message.warning(
            language[`RepeatIntervalValueCannotBeEmpty_${this.props.language.getlanguages}`]
          );
          return false;
        }
      }
      let arr = [];
      if (data.length == 0) {
        this.props.dispatch({
          type: "radarModel/saveWorkModel_threePart_CFJG",
          payload: [{ modeId: this.state.modeId, sn: -1 }],
          callback: res => {
            if (res.data && res.data[0] == "1") {
              message.success(
                language[`saveSuccess_${this.props.language.getlanguages}`]
              );
            } else {
              message.error(
                language[`saveFailure_${this.props.language.getlanguages}`]
              );
            }
          }
        });
      } else {
        for (let i = 0; i < data.length; i++) {
          arr.push({
            modeId: this.state.modeId,
            sn: i + 1,
            pri: data[i].pri
          });
        }
        this.props.dispatch({
          type: "radarModel/saveWorkModel_threePart_CFJG",
          payload: arr,
          callback: res => {
            if (res.data && res.data[0] == "1") {
              message.success(
                language[`saveSuccess_${this.props.language.getlanguages}`]
              );
            } else {
              message.error(
                language[`saveFailure_${this.props.language.getlanguages}`]
              );
            }
          }
        });
      }
    }
  };

  //保存脉内特征的值
  saveData_MNTZ = () => {
    if (this.state.rowId === -1) {
      message.warning(
        language[
        `select_a_working_mode_first_${this.props.language.getlanguages}`
        ]
      );
      return false;
    }
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: "radarModel/update_target_WorkModel_MNTZ",
          payload: {
            modeId: this.state.modeId,
            encodeLength: values.encodeLength,
            symbolWidth: values.symbolWidth,
            inpulseModulateSlope: values.inpulseModulateSlope,
            startFrequencyHz: values.startFrequencyHz,
            endFrequencyHz: values.endFrequencyHz,
            centerFrequencyHz: values.centerFrequencyHz,
            inpulseFrequencyHz: values.inpulseFrequencyHz,
            inpulsePwUs: values.inpulsePwUs,
            stepLengthHz: values.stepLengthHz,
            frequencyOffsetHz: values.frequencyOffsetHz
          },
          callback: res => {
            if (res.data && res.data[0] == "1") {
              message.success(
                language[`saveSuccess_${this.props.language.getlanguages}`]
              );
            } else {
              message.errror(
                language[`saveFailure_${this.props.language.getlanguages}`]
              );
            }
          }
        });
        // this.props.dispatch({
        //   type: 'radarModel/update_target_WorkModel_MNTZ_data',
        //   payload: arr
        // })
      }
    });
  };

  getNowFormatDate = () => {
    //获取当前时间
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    var strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if (hour < 10) {
      hour = "0" + hour;
    }
    if (minute < 10) {
      minute = "0" + minute;
    }
    if (second < 10) {
      second = "0" + second;
    }
    var currentdate =
      date.getFullYear() +
      seperator1 +
      month +
      seperator1 +
      strDate +
      " " +
      hour +
      seperator2 +
      minute +
      seperator2 +
      second;
    return currentdate;
  };

  handleInputFreLower = e => {
    //工作频率下限失去焦点事件
    if (Number(e.target.value) < 50 || !e.target.value) {
      this.props.form.setFieldsValue({ modelMinWorkFreqHz: "50" });
    } else if (Number(e.target.value) > 40050) {
      this.props.form.setFieldsValue({ modelMinWorkFreqHz: "40050" });
    } else {
      document.getElementById("modelMinWorkFreqHz").style.border =
        "1px solid #d9d9d9";
    }
    if (
      Number(this.props.form.getFieldValue("modelMaxWorkFreqHz")) &&
      Number(this.props.form.getFieldValue("modelMaxWorkFreqHz")) <
      Number(this.props.form.getFieldValue("modelMinWorkFreqHz"))
    ) {
      message.warning(
        language[
        `lowerFreqNotMoreThanUpperFreq_${this.props.language.getlanguages}`
        ]
      );
      this.props.form.setFieldsValue({ modelMinWorkFreqHz: "" });
      document.getElementById("modelMinWorkFreqHz").style.border =
        "1px solid #f00";
      return false;
    } else {
      document.getElementById("modelMinWorkFreqHz").style.border =
        "1px solid #d9d9d9";
      document.getElementById("modelMaxWorkFreqHz").style.border =
        "1px solid #d9d9d9";
    }
  };

  handleInputFreMax = e => {
    //工作频率上限失去焦点事件
    if (Number(e.target.value) < 50) {
      this.props.form.setFieldsValue({ modelMaxWorkFreqHz: "50" });
    } else if (Number(e.target.value) > 40050) {
      this.props.form.setFieldsValue({ modelMaxWorkFreqHz: "40050" });
    } else {
      document.getElementById("modelMaxWorkFreqHz").style.border =
        "1px solid #d9d9d9";
    }
    if (
      Number(this.props.form.getFieldValue("modelMinWorkFreqHz")) &&
      Number(this.props.form.getFieldValue("modelMaxWorkFreqHz")) <
      Number(this.props.form.getFieldValue("modelMinWorkFreqHz"))
    ) {
      message.warning(
        language[
        `lowerFreqNotMoreThanUpperFreq_${this.props.language.getlanguages}`
        ]
      );
      this.props.form.setFieldsValue({ modelMaxWorkFreqHz: "" });
      document.getElementById("modelMaxWorkFreqHz").style.border =
        "1px solid #f00";
    } else {
      document.getElementById("modelMaxWorkFreqHz").style.border =
        "1px solid #d9d9d9";
      document.getElementById("modelMinWorkFreqHz").style.border =
        "1px solid #d9d9d9";
    }
  };

  handleModelMinPwUs = e => {
    //脉宽下限
    if (Number(e.target.value) < 0.05 || !e.target.value) {
      this.props.form.setFieldsValue({ modelMinPwUs: "0.05" });
    } else if (Number(e.target.value) > 21000) {
      this.props.form.setFieldsValue({ modelMinPwUs: "21000" });
    } else {
      document.getElementById("modelMinPwUs").style.border =
        "1px solid #d9d9d9";
    }
    if (
      this.props.form.getFieldValue("modelMaxPwUs") &&
      Number(this.props.form.getFieldValue("modelMinPwUs")) >
      Number(this.props.form.getFieldValue("modelMaxPwUs"))
    ) {
      message.warning(
        language[
        `lowerPwNotMoreThanUpperPw_${this.props.language.getlanguages}`
        ]
      );
      this.props.form.setFieldsValue({ modelMinPwUs: "" });
      document.getElementById("modelMinPwUs").style.border = "1px solid #f00";
    } else {
      document.getElementById("modelMinPwUs").style.border =
        "1px solid #d9d9d9";
      document.getElementById("modelMaxPwUs").style.border =
        "1px solid #d9d9d9";
    }
  };

  handleModelMaxPwUs = e => {
    //脉宽上限
    if (Number(e.target.value) < 0.05) {
      this.props.form.setFieldsValue({ modelMaxPwUs: "0.05" });
    } else if (Number(e.target.value) > 21000) {
      this.props.form.setFieldsValue({ modelMaxPwUs: "21000" });
    } else {
      document.getElementById("modelMaxPwUs").style.border =
        "1px solid #d9d9d9";
    }

    if (
      this.props.form.getFieldValue("modelMinPwUs") &&
      Number(this.props.form.getFieldValue("modelMinPwUs")) >
      Number(this.props.form.getFieldValue("modelMaxPwUs"))
    ) {
      message.warning(
        language[
        `lowerPwNotMoreThanUpperPw_${this.props.language.getlanguages}`
        ]
      );
      this.props.form.setFieldsValue({ modelMaxPwUs: "" });
      document.getElementById("modelMaxPwUs").style.border = "1px solid #f00";
    } else {
      document.getElementById("modelMaxPwUs").style.border =
        "1px solid #d9d9d9";
      document.getElementById("modelMinPwUs").style.border =
        "1px solid #d9d9d9";
    }
  };

  handleModelMinPriUs = e => {
    //重复间隔下限
    if (Number(e.target.value) < 2 || !e.target.value) {
      this.props.form.setFieldsValue({ modelMinPriUs: "2" });
    } else if (Number(e.target.value) > 21000) {
      this.props.form.setFieldsValue({ modelMinPriUs: "21000" });
    } else {
      document.getElementById("modelMinPriUs").style.border =
        "1px solid #d9d9d9";
    }

    if (
      Number(this.props.form.getFieldValue("modelMaxPriUs")) &&
      Number(this.props.form.getFieldValue("modelMinPriUs")) >
      Number(this.props.form.getFieldValue("modelMaxPriUs"))
    ) {
      message.warning(
        language[
        `lowerPriNotMoreThanUpperPri_${this.props.language.getlanguages}`
        ]
      );
      this.props.form.setFieldsValue({ modelMinPriUs: "" });
      document.getElementById("modelMinPriUs").style.border = "1px solid #f00";
    } else {
      document.getElementById("modelMinPriUs").style.border =
        "1px solid #d9d9d9";
    }
  };

  handleModelMaxPriUs = e => {
    //重复间隔上限
    if (Number(e.target.value) < 2) {
      this.props.form.setFieldsValue({ modelMaxPriUs: "2" });
    } else if (Number(e.target.value) > 21000) {
      this.props.form.setFieldsValue({ modelMaxPriUs: "21000" });
    } else {
      document.getElementById("modelMaxPriUs").style.border =
        "1px solid #d9d9d9";
    }

    if (
      Number(this.props.form.getFieldValue("modelMinPriUs")) &&
      Number(this.props.form.getFieldValue("modelMinPriUs")) >
      Number(this.props.form.getFieldValue("modelMaxPriUs"))
    ) {
      message.warning(
        language[
        `lowerPriNotMoreThanUpperPri_${this.props.language.getlanguages}`
        ]
      );
      this.props.form.setFieldsValue({ modelMaxPriUs: "" });
      document.getElementById("modelMaxPriUs").style.border = "1px solid #f00";
    } else {
      document.getElementById("modelMaxPriUs").style.border =
        "1px solid #d9d9d9";
    }
  };

  selectionChange = (selectKey, selectRow) => {
    //工作模式单击单选按钮
    const { modeId, id } = selectRow[0];
    this.setState({
      modeId: modeId,
      selectedRowKeys: id,
      modelMaxWorkFreqHz: Number(selectRow[0].modelMaxWorkFreqHz),
      modelMinWorkFreqHz: Number(selectRow[0].modelMinWorkFreqHz),
      freqChange: `${Number(selectRow[0].modelMinWorkFreqHz)}~${Number(
        selectRow[0].modelMaxWorkFreqHz
      )}`,
      modelMaxPwUs: Number(selectRow[0].modelMaxPwUs),
      modelMinPwUs: Number(selectRow[0].modelMinPwUs),
      pwChange: `${Number(selectRow[0].modelMinPwUs)}~${Number(
        selectRow[0].modelMaxPwUs
      )}`,
      modelMaxPriUs: Number(selectRow[0].modelMaxPriUs),
      modelMinPriUs: Number(selectRow[0].modelMinPriUs),
      priChange: `${Number(selectRow[0].modelMinPriUs)}~${Number(
        selectRow[0].modelMaxPriUs
      )}`,
      rowId: selectRow[0].modeId // 将点击的工作模式一行中的模式内码保存起来
    });

    //点击工作模式中的行  显示对应的工作模式详细内容
    this.props.dispatch({
      type: "radarModel/SelectDetailFreqPwPri",
      payload: selectRow[0].modeId,
      callback: res => {
        if (res.data[0]) {
          let arr_SP = res.data[0].workModelFreqList;
          let arr_PW = res.data[0].workModelPWList;
          let arr_CFJG = res.data[0].workModelPriList;

          //动态变量给form赋值
          let obj = {};
          for (let i = 1; i <= arr_SP.length; i++) {
            obj["valueA" + i] = arr_SP[i - 1].freq;
          }
          for (let i = 1; i <= arr_PW.length; i++) {
            obj["valueB" + i] = arr_PW[i - 1].pw;
          }
          for (let i = 1; i <= arr_CFJG.length; i++) {
            obj["valueC" + i] = arr_CFJG[i - 1].pri;
          }
          this.props.form.setFieldsValue(obj);
        }
      }
    });



    // this.setState({
    //   modeId: record.modeId,
    //   selectedRowKeys: record.id,
    //   modelMaxWorkFreqHz: Number(record.modelMaxWorkFreqHz),
    //   modelMinWorkFreqHz: Number(record.modelMinWorkFreqHz),
    //   freqChange: `${Number(record.modelMinWorkFreqHz)}~${Number(
    //     record.modelMaxWorkFreqHz
    //   )}`,
    //   modelMaxPwUs: Number(record.modelMaxPwUs),
    //   modelMinPwUs: Number(record.modelMinPwUs),
    //   pwChange: `${Number(record.modelMinPwUs)}~${Number(record.modelMaxPwUs)}`,
    //   modelMaxPriUs: Number(record.modelMaxPriUs),
    //   modelMinPriUs: Number(record.modelMinPriUs),
    //   priChange: `${Number(record.modelMinPriUs)}~${Number(
    //     record.modelMaxPriUs
    //   )}`,
    //   rowId: record.modeId // 将点击的工作模式一行中的模式内码保存起来
    // });

    // //点击工作模式中的行  显示对应的工作模式详细内容
    // this.props.dispatch({
    //   type: "radarModel/SelectDetailFreqPwPri",
    //   payload: record.modeId,
    //   callback: res => {
    //     if (res.data[0]) {
    //       let arr_SP = res.data[0].workModelFreqList;
    //       let arr_PW = res.data[0].workModelPWList;
    //       let arr_CFJG = res.data[0].workModelPriList;

    //       //动态变量给form赋值
    //       let obj = {};
    //       for (let i = 1; i <= arr_SP.length; i++) {
    //         obj["valueA" + i] = arr_SP[i - 1].freq;
    //       }
    //       for (let i = 1; i <= arr_PW.length; i++) {
    //         obj["valueB" + i] = arr_PW[i - 1].pw;
    //       }
    //       for (let i = 1; i <= arr_CFJG.length; i++) {
    //         obj["valueC" + i] = arr_CFJG[i - 1].pri;
    //       }
    //       this.props.form.setFieldsValue(obj);
    //     }
    //   }
    // });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const FormItem = Form.Item;
    const Option = Select.Option;
    //工作模式
    const paginationProps = {
      pageSize: 5
    };
    const paginationProps_threePart = {
      pageSize: 5,
      size: "small"
    };

    //工作模式的单击选择
    const rowSelectionGZMS = {
      type: "radio",
      selectedRowKeys: [this.state.selectedRowKeys],
      onChange: this.selectionChange
    };

    // 工作模式的列
    const WorkModelColumns = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "id",
        width: 50
      },
      {
        // 模式内码
        title: language[`ModelCode_${this.props.language.getlanguages}`],
        dataIndex: "modeId",
        width: 200,
        ellipsis: true
      },
      {
        // 模式名称
        title: language[`patternName_${this.props.language.getlanguages}`],
        dataIndex: "modeName",
        width: 200,
        ellipsis: true
      },
      {
        // 模式用途
        title: language[`ModelUSES_${this.props.language.getlanguages}`],
        dataIndex: "purposeName",
        width: 170,
        ellipsis: true
      },
      {
        title: language[`threatLevel_${this.props.language.getlanguages}`],
        dataIndex: "modelThreadName",
        width: 170,
        ellipsis: true
      },
      {
        // 射频类型
        title: language[`RadioType_${this.props.language.getlanguages}`],
        dataIndex: "modelFreqName",
        width: 170,
        ellipsis: true
      },
      {
        // 频率下限
        title: language[`LowerFrequencyLimit_${this.props.language.getlanguages}`] +"[MHz]",
        dataIndex: "modelMinWorkFreqHz",
        width: 170,
        ellipsis: true
      },
      {
        // 频率上限
        title: language[`upperFrequencyLimit_${this.props.language.getlanguages}`] +"[MHz]",
        dataIndex: "modelMaxWorkFreqHz",
        width: 170,
        ellipsis: true
      },
      {
        //脉宽类型
        title: language[`PulseWidthType_${this.props.language.getlanguages}`],
        dataIndex: "modelPwName",
        width: 170,
        ellipsis: true
      },
      {
        //脉宽下限
        title: language[`LowerPulseWidthLimit_${this.props.language.getlanguages}`] +"[μs]",
        dataIndex: "modelMinPwUs",
        width: 170,
        ellipsis: true
      },
      {
        //脉宽上限
        title: language[`UpperPulseWidthLimit_${this.props.language.getlanguages}`] +"[μs]",
        dataIndex: "modelMaxPwUs",
        width: 170,
        ellipsis: true
      },
      {
        //重复间隔类型
        title:language[`RepetitionIntervalType_${this.props.language.getlanguages}`],
        dataIndex: "modelPriName",
        width: 170,
        ellipsis: true
      },
      {
        title: language[`LowerLimitInterval_${this.props.language.getlanguages}`] +"[μs]",
        dataIndex: "modelMinPriUs",
        width: 170,
        ellipsis: true
      },
      {
        //重复间隔上限
        title: language[`UpperLimitInterval_${this.props.language.getlanguages}`] +"[μs]",
        dataIndex: "modelMaxPriUs",
        width: 170,
        ellipsis: true
      },
      {
        //脉内调制
        title: language[`IntraPulseModulation_${this.props.language.getlanguages}`],
        dataIndex: "modulateName",
        width: 140,
        ellipsis: true
      },
      {
        //天线扫描
        title: language[`AntennaScanning_${this.props.language.getlanguages}`],
        dataIndex: "modelScanName",
        ellipsis: true
      },
      {
        title: language[`operation_${this.props.language.getlanguages}`],
        width: 100,
        render: (text, record, index) => (
          <div>
            {/* <a to="#" type="delete" data-index={index} onClick={this.showEditDialog}>
              {language[`edit_${this.props.language.getlanguages}`]}
            </a>
            &nbsp;&nbsp; */}

            <Popconfirm
              title={language[`ConfirmDeleteMsg_${this.props.language.getlanguages}`]}
              okText="Yes"
              cancelText="No"
              className={styleless.popConfirm}
              onConfirm={() => this.handleDel(record.modeId)}
            >
              <a to="#" type="delete" data-index={index}>
                {language[`delete_${this.props.language.getlanguages}`]}
              </a>
            </Popconfirm>
          </div>
        ),
        fixed: "right"
      }
    ];

    let WorkModelData = [];
    if (this.props.radarModel.target_workModelMsg_Main) {
      let data = this.props.radarModel.target_workModelMsg_Main;
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
            purposeName =language.modelUse[j][`name_${this.props.language.getlanguages}`];
          }
        }
        for (let j = 0; j < language.threadLevel.length; j++) {
          //威胁等级
          if (
            data[i] &&data[i].modelThreadName == language.threadLevel[j].value
          ) {
            modelThreadName =language.threadLevel[j][`name_${this.props.language.getlanguages}`];
          }
        }
        for (let j = 0; j < language.RadiofrequencyType.length; j++) {
          //射频类型
          if (
            data[i] &&data[i].modelFreqName == language.RadiofrequencyType[j].value
          ) {
            modelFreqName =language.RadiofrequencyType[j][`name_${this.props.language.getlanguages}`];
          }
        }
        for (let j = 0; j < language.PulseWidthType.length; j++) {
          //脉宽类型
          if (
            data[i] &&data[i].modelPwName == language.PulseWidthType[j].value
          ) {
            modelPwName =language.PulseWidthType[j][`name_${this.props.language.getlanguages}`];
          }
        }
        for (let j = 0; j < language.RepetitiveIntervalType.length; j++) {
          //重复间隔类型
          if (
            data[i] &&data[i].modelPriName == language.RepetitiveIntervalType[j].value
          ) {
            modelPriName =language.RepetitiveIntervalType[j][`name_${this.props.language.getlanguages}`];
          }
        }
        for (let j = 0; j < language.IntraPulseModulation.length; j++) {
          //脉内调制
          if (
            data[i] &&data[i].modulateName == language.IntraPulseModulation[j].value
          ) {
            modulateName =language.IntraPulseModulation[j][`name_${this.props.language.getlanguages}`];
          }
        }
        for (let j = 0; j < language.AntennaScanning.length; j++) {
          //天线扫描
          if (
            data[i] &&data[i].modelScanName == language.AntennaScanning[j].value
          ) {
            modelScanName =language.AntennaScanning[j][`name_${this.props.language.getlanguages}`];
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

    // 工作模式-射频的列
    const columns_radioFrequency = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`FrequencyValues_${this.props.language.getlanguages}`],
        dataIndex: "freq",
        render: (text, record, index) => {
          return (
            <FormItem>
              {getFieldDecorator("valueA" + Number(record.key), {
                getValueFromEvent: value => {
                  return String(value)
                    .replace(/[^\d.]/g, "")
                    .replace(/^\./g, "")
                    .replace(/\.{3,}/g, ".")
                    .replace(".", "$#$")
                    .replace(/\./g, "")
                    .replace("$#$", ".")
                    .replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3");
                },
                initialValue: record.freq
              })(
                <InputNumber
                  onBlur={e =>
                    this.FloatBlur_SP("valueA" + Number(record.key), record.key)
                  }
                  style={{ border: "none", textAlign: "center" }}
                  // min={this.state.modelMinWorkFreqHz}
                  // max={this.state.modelMaxWorkFreqHz}
                  placeholder={this.state.freqChange}
                  autoComplete="off"
                  step={0.001}
                />
              )}
            </FormItem>
          );
        }
      },
      {
        title: language[`operation_${this.props.language.getlanguages}`],
        dataIndex: "operation",
        render: (text, record, index) => (
          <div>
            <Popconfirm
              title={language[`ConfirmDeleteMsg_${this.props.language.getlanguages}`]}
              okText="Yes"
              cancelText="No"
              className={styleless.popConfirm}
              onConfirm={() => this.handleDel_SP(record.key)}
            >
              <a to="#" type="delete" data-index={index}>
                {language[`delete_${this.props.language.getlanguages}`]}
              </a>
            </Popconfirm>
          </div>
        )
      }
    ];

    //工作模式-脉宽的列
    const columns_WorkingModePluseWidth = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`PulseWidthValue_${this.props.language.getlanguages}`],
        dataIndex: "pw",
        render: (text, record, index) => {
          return (
            <FormItem>
              {getFieldDecorator("valueB" + Number(record.key), {
                getValueFromEvent: value => {
                  return String(value)
                    .replace(/[^\d.]/g, "")
                    .replace(/^\./g, "")
                    .replace(/\.{3,}/g, ".")
                    .replace(".", "$#$")
                    .replace(/\./g, "")
                    .replace("$#$", ".")
                    .replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, "$1$2.$3");
                },
                initialValue: record.pw
              })(
                <InputNumber
                  onBlur={e =>
                    this.FloatBlur_MK("valueB" + Number(record.key), record.key)
                  }
                  // onKeyUp={e =>
                  //   this.FloatBlur_MK("valueB" + Number(record.key), record.key)
                  // }
                  placeholder={this.state.pwChange}
                  style={{ border: "none", textAlign: "center" }}
                  autoComplete="off"
                  step={0.0001}
                />
              )}
            </FormItem>
          );
        }
      },
      {
        title: language[`operation_${this.props.language.getlanguages}`],
        dataIndex: "operation",
        render: (text, record, index) => (
          <div>
            <Popconfirm
              title={language[`ConfirmDeleteMsg_${this.props.language.getlanguages}`]}
              okText="Yes"
              cancelText="No"
              className={styleless.popConfirm}
              onConfirm={() => this.handleDel_MK(record.key)}
            >
              <a to="#" type="delete" data-index={index}>
                {language[`delete_${this.props.language.getlanguages}`]}
              </a>
            </Popconfirm>
          </div>
        )
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
        dataIndex: "pri",
        render: (text, record, index) => {
          return (
            <FormItem>
              {getFieldDecorator("valueC" + Number(record.key), {
                getValueFromEvent: value => {
                  return String(value)
                    .replace(/[^\d.]/g, "")
                    .replace(/^\./g, "")
                    .replace(/\.{4,}/g, ".")
                    .replace(".", "$#$")
                    .replace(/\./g, "")
                    .replace("$#$", ".")
                    .replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, "$1$2.$3");
                },
                initialValue: record.pri
              })(
                <InputNumber
                  onBlur={e => this.FloatBlur_CFJG("valueC" + Number(record.key), record.key)}
                  // onKeyUp={e =>
                  //   this.FloatBlur_CFJG(
                  //     "valueC" + Number(record.key),
                  //     record.key
                  //   )
                  // }
                  style={{ border: "none", textAlign: "center" }}
                  placeholder={this.state.priChange}
                  autoComplete="off"
                  step={0.0001}
                />
              )}
            </FormItem>
          );
        }
      },
      {
        title: language[`operation_${this.props.language.getlanguages}`],
        dataIndex: "operation",
        render: (text, record, index) => (
          <div>
            <Popconfirm
              title={language[`ConfirmDeleteMsg_${this.props.language.getlanguages}`]}
              okText="Yes"
              cancelText="No"
              className={styleless.popConfirm}
              onConfirm={() => this.handleDel_CFJG(record.key)}
            >
              <a to="#" type="delete" data-index={index}>
                {language[`delete_${this.props.language.getlanguages}`]}
              </a>
            </Popconfirm>
          </div>
        )
      }
    ];

    let { visible } = this.state;
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

    return (
      <div
        className={
          this.props.name === "big" ? style.Work_mode : style.Work_mode_Min
        }
      >
        <Form className={styleless.myBandForm}>
          <div className={style.subheadAdd}>
            {/* 工作模式 */}
            <div style={{ float: "left", marginLeft: "15px" }}>
              {language[`WorkingMode_${this.props.language.getlanguages}`]}
            </div>
            <div style={{ float: "right", marginRight: "30px" }}>
              <Button type="primary" onClick={this.showModal}>
                {language[`add_${this.props.language.getlanguages}`]}
              </Button>
            </div>
            {visible ? (
              <Dialog
                TitleText={language[`WorkingMode_${this.props.language.getlanguages}`]}
                showDialog={visible}
                OkText={language[`DetermineTheInput_${this.props.language.getlanguages}`]}
                cancelText={language[`quit_${this.props.language.getlanguages}`]}
                mask={false}
                onCancel={this.handleCancel}
                className={style.workpop}
                showMask
                BodyContent={
                  <div
                    className={style.popFodderType_workpop}
                    style={this.props.language.getlanguages == "zh" ? {width:"1000px"} : { width: "1350px" }
                    }
                  >
                    <div className={
                       this.props.language.getlanguages == "zh"
                       ? wmstyle.popFodderType_workpop_ZHwrap
                       : wmstyle.popFodderType_workpop_FRwrap
                      }>
                      <div>
                        <FormItem label={language[`ModelCode_${this.props.language.getlanguages}`]}>
                          {getFieldDecorator("modeId", {
                            //模式内码
                            rules: [{ required: true, whitespace: true }],
                            initialValue: this.state.nowTime
                          })(
                            <Input
                              className={styleless.input}
                              type="text"
                              id="ModeCode"
                              onBlur={this.handleInput}
                              autoComplete="off"
                              disabled
                            />
                          )}
                        </FormItem>
                      </div>
                      <div>
                        <FormItem label={language[`patternName_${this.props.language.getlanguages}`]}>
                          {getFieldDecorator("modeName", {
                            //模式名称
                            rules: [{ required: true, whitespace: true }],
                            getValueFromEvent: event => {
                              return event.target.value.slice(0, 40);
                            }
                          })(
                            <Input
                              className={styleless.input}
                              type="text"
                              id="ModeName"
                              onBlur={this.handleInput}
                              autoComplete="off"
                            />
                          )}
                        </FormItem>
                      </div>
                      <div>
                        <FormItem label={language[`ModelUSES_${this.props.language.getlanguages}`]}>
                          {getFieldDecorator("purposeName", {
                            //模式用途
                            rules: [{ required: true, whitespace: true }],
                            initialValue: "00"
                          })(
                            <Select dropdownStyle={{ zIndex: "1054" }}>
                              {language.modelUse.map((v, k) => (
                                <Option value={v.value} key={v.value}>
                                  {v[`name_${this.props.language.getlanguages}`]}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </FormItem>
                      </div>
                      <div>
                        <FormItem label={language[`threatLevel_${this.props.language.getlanguages}`]}>
                          {getFieldDecorator("modelThreadName", {
                            //威胁等级
                            initialValue: "0"
                          })(
                            <Select dropdownStyle={{ zIndex: "1054" }}>
                              {language.threadLevel.map((v, k) => (
                                <Option value={v.value} key={v.value}>
                                  {v[`name_${this.props.language.getlanguages}`]}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </FormItem>
                      </div>
                      <div>
                        <FormItem label={language[`RadioType_${this.props.language.getlanguages}`]}>
                          {getFieldDecorator("modelFreqName", {
                            //射频类型
                            rules: [{ required: !this.props.technologyNameMark, whitespace: !this.props.technologyNameMark }],
                            initialValue: "00"
                          })(
                            <Select dropdownStyle={{ zIndex: "1054" }}>
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
                        <FormItem label={language[`PulseWidthType_${this.props.language.getlanguages}`]}>
                          {getFieldDecorator("modelPwName", {
                            //脉宽类型
                            rules: [{ required: !this.props.technologyNameMark, whitespace: !this.props.technologyNameMark }],
                            initialValue: "00"
                          })(
                            <Select
                              disabled={this.props.technologyNameMark}
                              dropdownStyle={{ zIndex: "1054" }}
                            >
                              {language.PulseWidthType.map((v, k) => (
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
                        <FormItem label={language[`LowerFrequencyLimit_${this.props.language.getlanguages}`] + "[MHz]"}>
                          {getFieldDecorator("modelMinWorkFreqHz", {
                            //频率下限
                            rules: [{ required: true, whitespace: true }],
                            getValueFromEvent: event => {
                              return event.target.value
                                .replace(/[^\d.]/g, "")
                                .replace(/^\./g, "")
                                .replace(/\.{3,}/g, ".")
                                .replace(".", "$#$")
                                .replace(/\./g, "")
                                .replace("$#$", ".")
                                .replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3");
                            }
                          })(
                            <Input
                              className={styleless.input}
                              type="text"
                              placeholder="50~40050"
                              onBlur={this.handleInputFreLower}
                              autoComplete="off"
                            />
                          )}
                        </FormItem>
                      </div>
                      <div>
                        <FormItem label={language[`LowerPulseWidthLimit_${this.props.language.getlanguages}`] + "[μs]"}>
                          {getFieldDecorator("modelMinPwUs", {
                            //脉宽下限
                            rules: [
                              {
                                required: !this.props.technologyNameMark,
                                whitespace: !this.props.technologyNameMark
                              }
                            ],
                            getValueFromEvent: event => {
                              return event.target.value
                                .replace(/[^\d.]/g, "")
                                .replace(/^\./g, "")
                                .replace(/\.{3,}/g, ".")
                                .replace(".", "$#$")
                                .replace(/\./g, "")
                                .replace("$#$", ".")
                                .replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3");
                            }
                          })(
                            <Input
                              disabled={this.props.technologyNameMark}
                              className={styleless.input}
                              type="text"
                              placeholder="0.05~21000"
                              onBlur={this.handleModelMinPwUs}
                              autoComplete="off"
                            />
                          )}
                        </FormItem>
                      </div>
                      <div>
                        <FormItem label={language[`upperFrequencyLimit_${this.props.language.getlanguages}`] + "[MHz]"}>
                          {getFieldDecorator("modelMaxWorkFreqHz", {
                            //频率上限
                            rules: [{ required: true, whitespace: true }],
                            getValueFromEvent: event => {
                              return event.target.value
                                .replace(/[^\d.]/g, "")
                                .replace(/^\./g, "")
                                .replace(/\.{3,}/g, ".")
                                .replace(".", "$#$")
                                .replace(/\./g, "")
                                .replace("$#$", ".")
                                .replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3");
                            }
                          })(
                            <Input
                              className={styleless.input}
                              type="text"
                              placeholder="50~40050"
                              onBlur={this.handleInputFreMax}
                              autoComplete="off"
                            />
                          )}
                        </FormItem>
                      </div>
                      <div>
                        <FormItem label={language[`UpperPulseWidthLimit_${this.props.language.getlanguages}`] + "[μs]"}>
                          {getFieldDecorator("modelMaxPwUs", {
                            //脉宽上限
                            rules: [
                              {
                                required: !this.props.technologyNameMark,
                                whitespace: !this.props.technologyNameMark
                              }
                            ],
                            getValueFromEvent: event => {
                              return event.target.value
                                .replace(/[^\d.]/g, "")
                                .replace(/^\./g, "")
                                .replace(/\.{3,}/g, ".")
                                .replace(".", "$#$")
                                .replace(/\./g, "")
                                .replace("$#$", ".")
                                .replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3");
                            }
                          })(
                            <Input
                              disabled={this.props.technologyNameMark}
                              className={styleless.input}
                              type="text"
                              placeholder="0.05~21000"
                              onBlur={this.handleModelMaxPwUs}
                              autoComplete="off"
                            />
                          )}
                        </FormItem>
                      </div>
                      <div>
                        <FormItem label={language[`RepetitionIntervalType_${this.props.language.getlanguages}`]}>
                          {getFieldDecorator("modelPriName", {
                            //重复间隔类型
                            rules: [{ required: !this.props.technologyNameMark, whitespace: !this.props.technologyNameMark }],
                            initialValue: "00"
                          })(
                            <Select
                              dropdownStyle={{ zIndex: "1054" }}
                              disabled={this.props.technologyNameMark}
                            >
                              {language.RepetitiveIntervalType.map((v, k) => (
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
                        <FormItem label={language[`IntraPulseModulation_${this.props.language.getlanguages}`]}>
                          {getFieldDecorator("modulateName", {
                            //脉内调制
                            initialValue: "00"
                          })(
                            <Select dropdownStyle={{ zIndex: "1054" }}>
                              {language.IntraPulseModulation.map((v, k) => (
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
                        <FormItem label={language[`LowerLimitInterval_${this.props.language.getlanguages}`] + "[μs]"}>
                          {getFieldDecorator("modelMinPriUs", {
                            //重复间隔下限
                            rules: [
                              {
                                required: !this.props.technologyNameMark,
                                whitespace: !this.props.technologyNameMark
                              }
                            ],
                            getValueFromEvent: value => {
                              return String(value)
                                .replace(/[^\d.]/g, "")
                                .replace(/^\./g, "")
                                .replace(/\.{4,}/g, ".")
                                .replace(".", "$#$")
                                .replace(/\./g, "")
                                .replace("$#$", ".")
                                .replace(
                                  /^(\-)*(\d+)\.(\d\d\d\d).*$/,
                                  "$1$2.$3"
                                );
                            }
                          })(
                            <InputNumber
                              disabled={this.props.technologyNameMark}
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
                      <div>
                        <FormItem label={language[`AntennaScanning_${this.props.language.getlanguages}`]}>
                          {getFieldDecorator("modelScanName", {
                            //天线扫描
                            // rules: [{ required: true, whitespace: true }],
                            initialValue: "00"
                          })(
                            <Select dropdownStyle={{ zIndex: "1054" }}>
                              {language.AntennaScanning.map((v, k) => (
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
                        <FormItem label={language[`UpperLimitInterval_${this.props.language.getlanguages}`] + "[μs]"}>
                          {getFieldDecorator("modelMaxPriUs", {
                            //重复间隔上限
                            rules: [
                              {
                                required: !this.props.technologyNameMark,
                                whitespace: !this.props.technologyNameMark
                              }
                            ],
                            getValueFromEvent: value => {
                              return String(value)
                                .replace(/[^\d.]/g, "")
                                .replace(/^\./g, "")
                                .replace(/\.{4,}/g, ".")
                                .replace(".", "$#$")
                                .replace(/\./g, "")
                                .replace("$#$", ".")
                                .replace(
                                  /^(\-)*(\d+)\.(\d\d\d\d).*$/,
                                  "$1$2.$3"
                                );
                            }
                          })(
                            <InputNumber
                              disabled={this.props.technologyNameMark}
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
                    </div>
                    <div
                      style={
                        this.props.language.getlanguages == "zh"
                          ? { margin: "20px auto", width: "140px" }
                          : { margin: "20px auto", width: "190px" }
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
          </div>
          {/* 主要的工作模式数据 */}
          <div
            className={styleless.tableBorder}
            style={{ cursor: "pointer", height: "250px" }}
          >
            <Table
              rowSelection={rowSelectionGZMS}
              rowKey={record => record.id}
              dataSource={WorkModelData}
              columns={WorkModelColumns} //this.state.dataSource即为获取初始化dataSource数组
              // className={language[`WorkingMode_${this.props.language.getlanguages}`] === "工作模式" ? styleless.myClassAdd_zh : styleless.myClassAdd_fr}
              className={styleless.myClassAdd_zh}
              rowClassName={this.setRowClassName}
              pagination={paginationProps}
              scroll={{ x: 2700 }}
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
                <span>
                  {language[`WorkingModeRadiore_${this.props.language.getlanguages}`]}[MHz]
                </span>
                <Button
                  type="primary"
                  style={{ float: "right", marginRight: "10px" }}
                  className={styleless.minButton}
                  onClick={() => this.saveData("射频")}
                >
                  {language[`save_${this.props.language.getlanguages}`]}
                </Button>
                <Button
                  type="primary"
                  style={{ float: "right", marginRight: "10px" }}
                  className={styleless.minButton}
                  onClick={this.addData_SP}
                >
                  {language[`add_${this.props.language.getlanguages}`]}
                </Button>
              </div>
              <div className={styleless.threePartBox}>
                {/* 射频的表格 */}
                <Table
                  rowKey={record => record.key}
                  dataSource={arr_SP}
                  columns={columns_radioFrequency}
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
                  {language[`WorkingModePluseWidth_${this.props.language.getlanguages}`]}[μs]
                </span>
                <Button
                  type="primary"
                  style={{ float: "right", marginRight: "10px" }}
                  className={styleless.minButton}
                  onClick={() => this.saveData("脉宽")}
                >
                  {language[`save_${this.props.language.getlanguages}`]}
                </Button>
                <Button
                  type="primary"
                  style={{ float: "right", marginRight: "10px" }}
                  className={styleless.minButton}
                  onClick={this.addData_MK}
                >
                  {language[`add_${this.props.language.getlanguages}`]}
                </Button>
              </div>
              <div className={styleless.Work_mode_threePartBox}>
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
                  {language[`WorkingModeRepetInter_${this.props.language.getlanguages}`]}[μs]
                </span>
                <Button
                  type="primary"
                  style={{ float: "right", marginRight: "10px" }}
                  className={styleless.minButton}
                  onClick={() => this.saveData("重复间隔")}
                >
                  {language[`save_${this.props.language.getlanguages}`]}
                </Button>
                <Button
                  type="primary"
                  style={{ float: "right", marginRight: "10px" }}
                  className={styleless.minButton}
                  onClick={this.addData_CFJG}
                >
                  {language[`add_${this.props.language.getlanguages}`]}
                </Button>
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
        </Form>
        <MNCharacter
          data1={MN_mark ? null : this.props.radarModel.targetWorkModel_fromTar} //目标库中点击编辑的数据
          {...this.state}
          technologyNameMark={this.props.technologyNameMark}
        />
      </div>
    );
  }
}

AddTable = Form.create({})(AddTable);
export default AddTable;



@connect(({ language, radarModel }) => ({ language, radarModel }))
class MNCharacter extends Component {
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
      dataSource_MNCharacter: []
    };
  }

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  //保存脉内特征的值
  saveData_MNTZ = () => {
    if (this.props.rowId === -1) {
      //请先选择一条工作模式
      message.warning(
        language[`select_a_working_mode_first_${this.props.language.getlanguages}`]
      );
      return false;
    } else {
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.props.dispatch({
            type: "radarModel/update_target_WorkModel_MNTZ_data",
            payload: {
              modeId: this.props.modeId,
              encodeLength: values.encodeLength,
              symbolWidth: values.symbolWidth,
              inpulseModulateSlope: values.inpulseModulateSlope,
              startFrequencyHz: values.startFrequencyHz,
              endFrequencyHz: values.endFrequencyHz,
              centerFrequencyHz: values.centerFrequencyHz,
              inpulseFrequencyHz: values.inpulseFrequencyHz,
              inpulsePwUs: values.inpulsePwUs,
              stepLengthHz: values.stepLengthHz,
              frequencyOffsetHz: values.frequencyOffsetHz
            },
            callback: res => {
              if (res.data && res.data[0] == "1") {
                message.success(
                  language[`saveSuccess_${this.props.language.getlanguages}`]
                );
              } else {
                message.error(
                  language[`saveFailure_${this.props.language.getlanguages}`]
                );
              }
            }
          });
          // this.props.dispatch({
          //   type: 'radarModel/update_target_WorkModel_MNTZ_data',
          //   payload: arr
          // })
        }
      });
    }
  };

  handleStartFrequencyHz = e => {
    //起始频率失去焦点事件
    if (Number(e.target.value) < 50 || !e.target.value) {
      this.props.form.setFieldsValue({ startFrequencyHz: 50 });
    } else if (e.target.value > 40050) {
      this.props.form.setFieldsValue({ startFrequencyHz: 40050 });
    } else {
      document.getElementById("startFrequencyHz").style.border =
        "1px solid #d9d9d9";
    }
    if (
      this.props.form.getFieldValue("endFrequencyHz") &&
      Number(this.props.form.getFieldValue("startFrequencyHz")) >
      Number(this.props.form.getFieldValue("endFrequencyHz"))
    ) {
      // 起始频率应小于或等于终止频率！
      message.warning(
        language[`startFreqMinEndFreq_${this.props.language.getlanguages}`]
      );
      this.props.form.setFieldsValue({ startFrequencyHz: "" });
      document.getElementById("startFrequencyHz").style.border =
        "1px solid #f00";
      return false;
    } else {
      document.getElementById("startFrequencyHz").style.border =
        "1px solid #d9d9d9";
      document.getElementById("endFrequencyHz").style.border =
        "1px solid #d9d9d9";
    }
    this.saveFormMsg();
  };

  handleEndFrequencyHz = e => {
    //终止频率失去焦点
    if (e.target.value < 50) {
      this.props.form.setFieldsValue({ endFrequencyHz: 50 });
    } else if (e.target.value > 40050) {
      this.props.form.setFieldsValue({ endFrequencyHz: 40050 });
    } else {
      document.getElementById("endFrequencyHz").style.border =
        "1px solid #d9d9d9";
    }
    if (
      this.props.form.getFieldValue("startFrequencyHz") &&
      Number(this.props.form.getFieldValue("startFrequencyHz")) >
      Number(this.props.form.getFieldValue("endFrequencyHz"))
    ) {
      // 起始频率应小于或等于终止频率！
      message.warning(
        language[`startFreqMinEndFreq_${this.props.language.getlanguages}`]
      );
      this.props.form.setFieldsValue({ endFrequencyHz: "" });
      document.getElementById("endFrequencyHz").style.border = "1px solid #f00";
      return false;
    } else {
      document.getElementById("endFrequencyHz").style.border =
        "1px solid #d9d9d9";
      document.getElementById("startFrequencyHz").style.border =
        "1px solid #d9d9d9";
    }
    this.saveFormMsg();
  };

  handleCenterFrequencyHz = e => {
    //中心频率失去焦点
    if (e.target.value < 50) {
      this.props.form.setFieldsValue({ centerFrequencyHz: 50 });
    } else if (e.target.value > 40050) {
      this.props.form.setFieldsValue({ centerFrequencyHz: 40050 });
    } else {
      document.getElementById("centerFrequencyHz").style.border =
        "1px solid #d9d9d9";
    }
    this.saveFormMsg();
  };

  saveFormMsg = () => {
    //保存脉内特征的表单值
    this.props.form.validateFields((err, values) => {
      this.props.dispatch({
        type: "radarModel/updataMNCharacterMsg",
        payload: values
      });
    });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const FormItem = Form.Item;
    const columns_MNCharacter = [
      {
        title: language[`Codinglength_${this.props.language.getlanguages}`], //编码长度
        dataIndex: "encodeLength",
        render: (text, record, index) => (
          <FormItem>
            {getFieldDecorator("encodeLength", {
              rules: [{ pattern: "^[0-9]*$", message: null }],
              getValueFromEvent: value => {
                return String(value).replace(/\D/g, "");
              }
            })(
              <InputNumber
                disabled={this.props.technologyNameMark}
                min={0}
                max={999999999999}
                autoComplete="off"
                onBlur={this.saveFormMsg}
                placeholder="0~999999999999"
              />
            )}
          </FormItem>
        )
      },
      {
        title: language[`CodeWidth_${this.props.language.getlanguages}`] + "[μs]", //码元宽度
        dataIndex: "symbolWidth",
        render: (text, record, index) => (
          <FormItem>
            {getFieldDecorator("symbolWidth", {
              rules: [{ pattern: "^[0-9]*$", message: null }],
              getValueFromEvent: value => {
                return String(value)
                  .replace(/[^\d.]/g, "")
                  .replace(/^\./g, "")
                  .replace(/\.{3,}/g, ".")
                  .replace(".", "$#$")
                  .replace(/\./g, "")
                  .replace("$#$", ".")
                  .replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, "$1$2.$3");
              }
            })(
              <InputNumber
                disabled={this.props.technologyNameMark}
                autoComplete="off"
                placeholder="0~99999999.9999"
                onBlur={this.saveFormMsg}
                min={0}
                max={99999999.9999}
              />
            )}
          </FormItem>
        )
      },
      {
        title: language[`IntrapulseModulaSlope_${this.props.language.getlanguages}`], //脉内调制斜率
        dataIndex: "inpulseModulateSlope",
        render: (text, record, index) => (
          <FormItem>
            {getFieldDecorator("inpulseModulateSlope", {
              rules: [{ pattern: "^[0-9]*$", message: null }],
              getValueFromEvent: value => {
                return String(value)
                  .replace(/[^\d.]/g, "")
                  .replace(/^\./g, "")
                  .replace(/\.{3,}/g, ".")
                  .replace(".", "$#$")
                  .replace(/\./g, "")
                  .replace("$#$", ".")
                  .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
              }
            })(
              <InputNumber
                autoComplete="off"
                disabled={this.props.technologyNameMark}
                onBlur={this.saveFormMsg}
                min={0}
                max={999.99}
                placeholder="0~999.99"
              />
            )}
          </FormItem>
        )
      },
      {
        title: language[`InitialFrequency_${this.props.language.getlanguages}`] +"[MHz]", //起始频率
        dataIndex: "startFrequencyHz",
        render: (text, record, index) => (
          <FormItem>
            {getFieldDecorator("startFrequencyHz", {
              rules: [],
              getValueFromEvent: value => {
                return String(value)
                  .replace(/[^\d.]/g, "")
                  .replace(/^\./g, "")
                  .replace(/\.{3,}/g, ".")
                  .replace(".", "$#$")
                  .replace(/\./g, "")
                  .replace("$#$", ".")
                  .replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3");
              }
            })(
              <InputNumber
                onBlur={this.handleStartFrequencyHz}
                disabled={this.props.technologyNameMark}
                min={50}
                max={40050}
                step={0.001}
                autoComplete="off"
                placeholder="50~40050"
                placeholder="50~40050"
              />
            )}
          </FormItem>
        )
      },
      {
        title: language[`TerminationFrequency_${this.props.language.getlanguages}`] +"[MHz]", //终止频率
        dataIndex: "endFrequencyHz",
        render: (text, record, index) => (
          <FormItem>
            {getFieldDecorator("endFrequencyHz", {
              rules: [],
              getValueFromEvent: value => {
                return String(value)
                  .replace(/[^\d.]/g, "")
                  .replace(/^\./g, "")
                  .replace(/\.{3,}/g, ".")
                  .replace(".", "$#$")
                  .replace(/\./g, "")
                  .replace("$#$", ".")
                  .replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3");
              }
            })(
              <InputNumber
                onBlur={this.handleEndFrequencyHz}
                disabled={this.props.technologyNameMark}
                autoComplete="off"
                placeholder="50~40050"
                min={50}
                max={40050}
                step={0.001}
              />
            )}
          </FormItem>
        )
      },
      {
        title: language[`centerFrequency_${this.props.language.getlanguages}`] +"[MHz]",
        dataIndex: "centerFrequencyHz",
        render: (text, record, index) => (
          <FormItem>
            {getFieldDecorator("centerFrequencyHz", {
              rules: [],
              getValueFromEvent: value => {
                return String(value)
                  .replace(/[^\d.]/g, "")
                  .replace(/^\./g, "")
                  .replace(/\.{3,}/g, ".")
                  .replace(".", "$#$")
                  .replace(/\./g, "")
                  .replace("$#$", ".")
                  .replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3");
              }
            })(
              <InputNumber
                autoComplete="off"
                disabled={this.props.technologyNameMark}
                placeholder="50~40050"
                onBlur={this.handleCenterFrequencyHz}
                min={50}
                max={40050}
                step={0.001}
              />
            )}
          </FormItem>
        )
      },
      {
        title:language[`FineFrequencyMeasurement_${this.props.language.getlanguages}`
          ] + "[MHz]",
        dataIndex: "inpulseFrequencyHz",
        render: (text, record, index) => (
          <FormItem>
            {getFieldDecorator("inpulseFrequencyHz", {
              rules: [{ pattern: "^[0-9]*$", message: null }],
              getValueFromEvent: value => {
                return String(value)
                  .replace(/[^\d.]/g, "")
                  .replace(/^\./g, "")
                  .replace(/\.{3,}/g, ".")
                  .replace(".", "$#$")
                  .replace(/\./g, "")
                  .replace("$#$", ".")
                  .replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3");
              }
            })(
              <InputNumber
                min={50}
                max={40050}
                step={0.001}
                disabled={this.props.technologyNameMark}
                autoComplete="off"
                placeholder="50~40050"
                onBlur={this.saveFormMsg}
              />
            )}
          </FormItem>
        )
      },
      {
        title: language[`FinePulseWidth_${this.props.language.getlanguages}`] +"[μs]",
        dataIndex: "inpulsePwUs",
        render: (text, record, index) => (
          <FormItem>
            {getFieldDecorator("inpulsePwUs", {
              rules: [{ pattern: "^[0-9]*$", message: null }],
              getValueFromEvent: value => {
                return String(value)
                  .replace(/[^\d.]/g, "")
                  .replace(/^\./g, "")
                  .replace(/\.{3,}/g, ".")
                  .replace(".", "$#$")
                  .replace(/\./g, "")
                  .replace("$#$", ".")
                  .replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, "$1$2.$3");
              }
            })(
              <InputNumber
                disabled={this.props.technologyNameMark}
                min={0.05}
                max={21000}
                step={0.0001}
                autoComplete="off"
                onBlur={this.saveFormMsg}
                placeholder="0.05~21000"
              />
            )}
          </FormItem>
        )
      },
      {
        title: language[`InsertionLength_${this.props.language.getlanguages}`] +"[MHz]",
        dataIndex: "stepLengthHz",
        render: (text, record, index) => (
          <FormItem>
            {getFieldDecorator("stepLengthHz", {
              rules: [{ pattern: "^[0-9]*$", message: null }],
              getValueFromEvent: value => {
                return String(value)
                  .replace(/[^\d.]/g, "")
                  .replace(/^\./g, "")
                  .replace(/\.{3,}/g, ".")
                  .replace(".", "$#$")
                  .replace(/\./g, "")
                  .replace("$#$", ".")
                  .replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3");
              }
            })(
              <InputNumber
                autoComplete="off"
                disabled={this.props.technologyNameMark}
                onBlur={this.saveFormMsg}
                min={0}
                max={999999.999}
                step={0.001}
                placeholder="0~999999.999"
              />
            )}
          </FormItem>
        )
      },
      {
        title: language[`frequencyOffset_${this.props.language.getlanguages}`] +"[MHz]",
        dataIndex: "frequencyOffsetHz",
        render: (text, record, index) => (
          <FormItem>
            {getFieldDecorator("frequencyOffsetHz", {
              rules: [{ pattern: "^[0-9]*$", message: null }],
              getValueFromEvent: value => {
                return String(value)
                  .replace(/[^\d.]/g, "")
                  .replace(/^\./g, "")
                  .replace(/\.{3,}/g, ".")
                  .replace(".", "$#$")
                  .replace(/\./g, "")
                  .replace("$#$", ".")
                  .replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3");
              }
            })(
              <InputNumber
                autoComplete="off"
                disabled={this.props.technologyNameMark}
                onBlur={this.saveFormMsg}
                min={0}
                max={999999.999}
                step={0.001}
                placeholder="0~999999.999"
              />
            )}
          </FormItem>
        )
      }
    ];
    const dataSource_MNCharacter = [
      {
        encodeLength: "5",
        symbolWidth: "data",
        inpulseModulateSlope: "data",
        startFrequencyHz: "data",
        endFrequencyHz: "data",
        centerFrequencyHz: "data",
        inpulseFrequencyHz: "data",
        inpulsePwUs: "data",
        stepLengthHz: "data",
        frequencyOffsetHz: "data"
      }
    ];

    return (
      <div
        className={
          language[`WorkModeIntraChara_${this.props.language.getlanguages}`] ===
            "工作模式-脉内特征"
            ? style.addTable_box_zh
            : style.addTable_box_fr
        }
      >
        <div>
          <Form className={styleless.myBandForm}>
            <div className={style.Work_mode_character_Title}>
              <span>
                {language[`WorkModeIntraChara_${this.props.language.getlanguages}`]}
              </span>
              <Form.Item style={{ display: "inline-block", float: "right" }}>
                <Button
                  type="primary"
                  style={{ marginRight: "10px" }}
                  className={styleless.minButton}
                  onClick={this.saveData_MNTZ}
                >
                  {language[`save_${this.props.language.getlanguages}`]}
                </Button>
              </Form.Item>
            </div>
            <div className={style.Work_mode_character}>
              <Table
                rowKey={record => record.encodeLength}
                className={styleless.MNCharacter_tableStyle}
                dataSource={dataSource_MNCharacter}
                columns={columns_MNCharacter}
                rowClassName={(record, index) =>
                  index % 2 === 0 ? styleless.odd : styleless.even
                }
                pagination={false}
                scroll={{ x: 2500 }}
                bordered
              />
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

MNCharacter = Form.create({
  mapPropsToFields(props) {
    let data = props.data1;
    if (data != null) {
      return {
        encodeLength: Form.createFormField({
          ...props,
          value: data.encodeLength
        }),
        symbolWidth: Form.createFormField({
          ...props,
          value: data.symbolWidth
        }),
        inpulseModulateSlope: Form.createFormField({
          ...props,
          value: data.inpulseModulateSlope
        }),
        startFrequencyHz: Form.createFormField({
          ...props,
          value: data.startFrequencyHz
        }),
        endFrequencyHz: Form.createFormField({
          ...props,
          value: data.endFrequencyHz
        }),
        centerFrequencyHz: Form.createFormField({
          ...props,
          value: data.centerFrequencyHz
        }),
        inpulseFrequencyHz: Form.createFormField({
          ...props,
          value: data.inpulseFrequencyHz
        }),
        inpulsePwUs: Form.createFormField({
          ...props,
          value: data.inpulsePwUs
        }),
        stepLengthHz: Form.createFormField({
          ...props,
          value: data.stepLengthHz
        }),
        frequencyOffsetHz: Form.createFormField({
          ...props,
          value: data.frequencyOffsetHz
        })
      };
    }
  }
})(MNCharacter);
