import React, { Component } from "react";
import { Table, Select, Button, Form, Input, message, InputNumber,Tooltip } from "antd";
import { connect } from "dva";
import Dialog from "../../utils/DialogMask/Dialog";
import language from "../language/language";
import style from "./Radar.css";
import styles from "./TargetType.less";
import styleless from "./test.less";
import "../../../src/index.less";
import DialogConfirm from "../../utils/DialogConfirmNoMask/Dialog";

@connect(({ language, ElectronicTarget, loading }) => ({
  language,
  ElectronicTarget,
  loading
}))
class TargetType extends Component {
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
      chooseModel: null,
      addOrUpdateMark: "add" //新建或者修改的标识
    };
  }

  componentDidMount = () => {
    //页面加载的时候
    this.props.dispatch({
      type: "ElectronicTarget/selectAllTargetTypeData",
      callback: res => {
        if (res.data[0]) {
          let data = res.data[0];
          this.TableAddData(data);
        }
      }
    });
  };

  componentWillUnmount() {
    //页面卸载的时候清空model层存储的表单数据
    this.props.dispatch({
      type: "ElectronicTarget/selectTargetTypeDetails_data",
      payload: null
    });
  }

  //给表格赋值
  TableAddData = data => {
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      arr.push({
        key: i + 1,
        model: data[i].model,
        length: data[i].length,
        wingSpan: data[i].wingSpan,
        height: data[i].height,
        maxSpeed: data[i].maxSpeed,
        cruiseSpeed: data[i].cruiseSpeed,
        maxCeiling: data[i].maxCeiling,
        serviceCeiling: data[i].serviceCeiling,
        maxRange: data[i].maxRange,
        actionRadius: data[i].actionRadius,
        enduranceTime: data[i].enduranceTime,
        rcs: data[i].rcs,
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
    this.setState({ showAddDialog: false, addOrUpdateMark: "add" });
    this.props.form.resetFields(); //给form表单清空值
    this.props.dispatch({
      type: "ElectronicTarget/selectTargetTypeDetails_data",
      payload: null
    });
  };

  handleSubmit = () => {
    //点击弹出框的确定按钮
    this.props.form.validateFields((err, values) => {
      if (!err) {
        for(let i in values){
          if(values[i]===""){
            values[i]=null;
          }
        }
        if (this.state.addOrUpdateMark === "add") {

          // this.selectRepeatName(values.model)
          //查询平台型号是否重复
          this.props.dispatch({
            type: "ElectronicTarget/selectTargetTypeRepeatName",
            payload: values.model,
            callback: res => {
              if (res.data[0] == 1) {
                message.warning(language[`radarTypeOrPlatTypeRepeat_${this.props.language.getlanguages}`]);
                this.props.form.setFieldsValue({ model: "" });
                return false;
              }else{
                this.props.dispatch({
                  type: "ElectronicTarget/addTargetTechnicalParam",
                  payload: {
                    ...values,
                    objectTypeId: "null",
                    categoryId: "null"
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
                });
              }
            }
          });

          
        } else if (this.state.addOrUpdateMark === "update") {
          this.props.dispatch({
            type: "ElectronicTarget/updateTargetTechnicalParam",
            payload: {
              ...values,
              objectTypeId: "null",
              categoryId: "null"
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
                  type: "ElectronicTarget/selectTargetTypeDetails_data",
                  payload: null
                });
              }
            }
          });
        }
      } else {
        message.warning(language[`improveECMSpecialReportTips_${this.props.language.getlanguages}`]);
      }
    });
  };

  // //查询雷达型号是否重名
  // selectRepeatName = value => {
   
  // };

  //删除按钮
  deleteAll = () => {
    if (!this.state.chooseModel) {
      message.warning(language[`pleaseCheck_${this.props.language.getlanguages}`]);
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
      type: "ElectronicTarget/deleteTargetType",
      payload: this.state.chooseModel,
      callback: res => {
        if (res.data && res.data.length > 1) {
          message.warning(
            `${language[`ThePlatformModelHasBeenTargeted_${this.props.language.getlanguages}`]}
            ${res.data[0][0]}${language[`use_${this.props.language.getlanguages}`]}，
            ${language[`CannotDeleteAtThisTime_${this.props.language.getlanguages}`]}`
          );
          this.setState({
            showConfirmDialog: false,
            selectedRowKeys: []
          });
        } else if (res.data && res.data.length == 1) {
          message.success(language[`deleteSuccess_${this.props.language.getlanguages}`]);
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
        type: "ElectronicTarget/selectTargetTypeDetails_update",
        payload: this.state.chooseModel
      });
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

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const FormItem = Form.Item;
    const Option = Select.Option;
    const { selectedRowKeys } = this.state;

    const rowSelection = {
      type: "radio",
      selectedRowKeys: [this.state.selectedRowKeys],
      onChange: this.selectionChange
    };
    const columns = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key",
        width: "5%"
      },
      {
        title:
          <Tooltip title={language[`PlatformModel_${this.props.language.getlanguages}`]}>
            {language[`PlatformModel_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "model",
        ellipsis: true
      },
      {
        title:
          <Tooltip title={language[`PlaneLength_${this.props.language.getlanguages}`] + "[m]"}>
            {language[`PlaneLength_${this.props.language.getlanguages}`] + "[m]"}
          </Tooltip>,
        dataIndex: "length",
        ellipsis: true
      },
      {
        title:
          <Tooltip title={language[`Wingspan_${this.props.language.getlanguages}`] + "[m]"}>
            {language[`Wingspan_${this.props.language.getlanguages}`] + "[m]"}
          </Tooltip>,
        dataIndex: "wingSpan",
        ellipsis: true
      },
      {
        title:
          <Tooltip title={language[`PlaneHeight_${this.props.language.getlanguages}`] + "[m]"}>
            {language[`PlaneHeight_${this.props.language.getlanguages}`] + "[m]"}
          </Tooltip>,
        dataIndex: "height",
        ellipsis: true
      },
      {
        title:
          <Tooltip title={language[`MaximumSpeed_${this.props.language.getlanguages}`] + "[km]"}>
            {language[`MaximumSpeed_${this.props.language.getlanguages}`] + "[km]"}
          </Tooltip>,
        dataIndex: "maxSpeed",
        ellipsis: true
      },
      {
        title:
          <Tooltip title={language[`CruisingSpeed_${this.props.language.getlanguages}`] + "[km]"}>
            {language[`CruisingSpeed_${this.props.language.getlanguages}`] + "[km]"}
          </Tooltip>,
        dataIndex: "cruiseSpeed",
        ellipsis: true
      },
      {
        title:
          <Tooltip title={language[`maximumCeiling_${this.props.language.getlanguages}`] + "[m]"}>
            {language[`maximumCeiling_${this.props.language.getlanguages}`] + "[m]"}
          </Tooltip>,
        dataIndex: "maxCeiling",
        ellipsis: true
      },
      {
        title:
          <Tooltip title={language[`serviceCeiling_${this.props.language.getlanguages}`] + "[m]"}>
            {language[`serviceCeiling_${this.props.language.getlanguages}`] + "[m]"}
          </Tooltip>,
        dataIndex: "serviceCeiling",
        ellipsis: true
      },
      {
        title:
          <Tooltip title={language[`maximumRange_${this.props.language.getlanguages}`] + "[km]"}>
            {language[`maximumRange_${this.props.language.getlanguages}`] + "[km]"}
          </Tooltip>,
        dataIndex: "maxRange",
        ellipsis: true
      },
      {
        title:
          <Tooltip title={language[`actionRadius_${this.props.language.getlanguages}`] + "[km]"}>
            {language[`actionRadius_${this.props.language.getlanguages}`] + "[km]"}
          </Tooltip>,
        dataIndex: "actionRadius",
        ellipsis: true
      },
      {
        title:
          <Tooltip title={language[`XuHangTime_${this.props.language.getlanguages}`] + "[h]"}>
            {language[`XuHangTime_${this.props.language.getlanguages}`] + "[h]"}
          </Tooltip>,
        dataIndex: "enduranceTime",
        ellipsis: true
      },
      {
        title:
          <Tooltip title={language[`AverageRCS_${this.props.language.getlanguages}`] + "[㎡]"}>
            {language[`AverageRCS_${this.props.language.getlanguages}`] + "[㎡]"}
          </Tooltip>,
        dataIndex: "rcs",
        ellipsis: true
      },
      {
        title:
          <Tooltip title={language[`producer_${this.props.language.getlanguages}`]}>
            {language[`producer_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "manufacturer",
        ellipsis: true
      }
    ];
    return (
      <div className={styles.radarTypeWrap}>
        <div className={styles.radarTypeBox}>
          {/* 导入新素材 */}
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
            loading={this.props.loading.effects["ElectronicTarget/selectAllTargetTypeData"]}
            rowKey={record => record.key}
            columns={columns}
            dataSource={this.state.dataSource}
            rowSelection={rowSelection}
            className={styleless.myClass}
            rowClassName={(record, index) =>
              index % 2 === 0 ? styleless.odd : styleless.even
            } //奇偶行颜色交替变化
            pagination={{
              // 分页
              onChange: this.changePage, //获取选中的页数
              pageSize: 15
            }}
            scroll={{ x: 2200 }}
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
              TitleText={language[`PlatformType_${this.props.language.getlanguages}`]}
              showDialog={this.state.showAddDialog}
              OkText={language[`DetermineTheInput_${this.props.language.getlanguages}`]}
              cancelText={language[`quit_${this.props.language.getlanguages}`]}
              mask={false}
              onCancel={this.handleCancel}
              className={style.workpop}
              close={this.handleCancel}
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
                    {/* <div>
                      <span style={{ color: "red", marginRight: "3px" }}>
                        *
                      </span>
                      {language[`PlatformModel_${this.props.language.getlanguages}`]}
                    </div> */}
                    <div>
                      <FormItem label={language[`PlatformModel_${this.props.language.getlanguages}`]}>
                        {getFieldDecorator("model", {
                          //雷达型号
                          rules: [{ required: true, whitespace: true }],
                          initialValue: this.state.nowTime,
                          getValueFromEvent: event => {
                            return event.target.value.slice(0, 40);
                          }
                        })(
                          <Input
                            className={styleless.input}
                            type="text"
                            // onBlur={this.selectRepeatName}
                            disabled={
                              this.state.addOrUpdateMark == "update"
                                ? true
                                : false
                            }
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* <div>
                      {language[`PlaneLength_${this.props.language.getlanguages}`]}[m]
                    </div> */}
                    <div>
                      <FormItem label={language[`PlaneLength_${this.props.language.getlanguages}`]+"[m]"}>
                        {getFieldDecorator("length", {
                          // rules: [{ required: true, whitespace: true }],
                          getValueFromEvent: value => {
                            return String(value)
                              .replace(/[^\d.]/g, "")
                              .replace(/^\./g, "")
                              .replace(/\.{2,}/g, ".")
                              .replace(".", "$#$")
                              .replace(/\./g, "")
                              .replace("$#$", ".")
                              .replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3");
                          }
                        })(
                          <InputNumber
                            min={1.0}
                            max={999999999.999}
                            step={0.001}
                            placeholder="1.000~999999999.999"
                            id="length"
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* <div>
                      {language[`Wingspan_${this.props.language.getlanguages}`]}[m]
                    </div> */}
                    <div>
                      <FormItem label={language[`Wingspan_${this.props.language.getlanguages}`]+"[m]"}>
                        {getFieldDecorator("wingSpan", {
                          // rules: [{ required: true, whitespace: true }],
                          getValueFromEvent: value => {
                            return String(value)
                              .replace(/[^\d.]/g, "")
                              .replace(/^\./g, "")
                              .replace(/\.{2,}/g, ".")
                              .replace(".", "$#$")
                              .replace(/\./g, "")
                              .replace("$#$", ".")
                              .replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3");
                          }
                        })(
                          <InputNumber
                            min={1}
                            min={1.0}
                            max={999999999.999}
                            step={0.001}
                            placeholder="1.000~999999999.999"
                            id="wingSpan"
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* <div>
                      {language[`PlaneHeight_${this.props.language.getlanguages}`]}[m]
                    </div> */}
                    <div>
                      <FormItem label={language[`PlaneHeight_${this.props.language.getlanguages}`]+"[m]"}>
                        {getFieldDecorator("height", {
                          // rules: [{ required: true, whitespace: true }],
                          getValueFromEvent: value => {
                            return String(value)
                              .replace(/[^\d.]/g, "")
                              .replace(/^\./g, "")
                              .replace(/\.{2,}/g, ".")
                              .replace(".", "$#$")
                              .replace(/\./g, "")
                              .replace("$#$", ".")
                              .replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3");
                          }
                        })(
                          <InputNumber
                            min={1}
                            min={1.0}
                            max={999999999.999}
                            step={0.001}
                            placeholder="1.000~999999999.999"
                            id="height"
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* <div>
                      {language[`MaximumSpeed_${this.props.language.getlanguages}`]}[km]
                    </div> */}
                    <div>
                      <FormItem  label={language[`MaximumSpeed_${this.props.language.getlanguages}`]+"[km]"}>
                        {getFieldDecorator("maxSpeed", {
                          // rules: [{ required: true, whitespace: true }],
                          getValueFromEvent: value => {
                            return String(value)
                              .replace(/[^\d.]/g, "")
                              .replace(/^\./g, "")
                              .replace(/\.{2,}/g, ".")
                              .replace(".", "$#$")
                              .replace(/\./g, "")
                              .replace("$#$", ".")
                              .replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3");
                          }
                        })(
                          <InputNumber
                            min={1.0}
                            max={999999999999.999}
                            step={0.001}
                            placeholder="1.000~999999999999.999"
                            id="maxSpeed"
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* <div>
                      {language[`CruisingSpeed_${this.props.language.getlanguages}`]}[km]
                    </div> */}
                    <div>
                      <FormItem label={language[`CruisingSpeed_${this.props.language.getlanguages}`]+"[km]"}>
                        {getFieldDecorator("cruiseSpeed", {
                          // rules: [{ required: true, whitespace: true }],
                          getValueFromEvent: value => {
                            return String(value)
                              .replace(/[^\d.]/g, "")
                              .replace(/^\./g, "")
                              .replace(/\.{2,}/g, ".")
                              .replace(".", "$#$")
                              .replace(/\./g, "")
                              .replace("$#$", ".")
                              .replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3");
                          }
                        })(
                          <InputNumber
                            min={1.0}
                            max={999999999999.999}
                            step={0.001}
                            placeholder="1.000~999999999999.999"
                            id="cruiseSpeed"
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* <div>
                      {language[`maximumCeiling_${this.props.language.getlanguages}`]}[m]
                    </div> */}
                    <div>
                      <FormItem label={language[`maximumCeiling_${this.props.language.getlanguages}`]+"[m]"}>
                        {getFieldDecorator("maxCeiling", {
                          // rules: [{ required: true, whitespace: true }],
                          getValueFromEvent: value => {
                            return String(value)
                              .replace(/[^\d.]/g, "")
                              .replace(/^\./g, "")
                              .replace(/\.{2,}/g, ".")
                              .replace(".", "$#$")
                              .replace(/\./g, "")
                              .replace("$#$", ".")
                              .replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3");
                          }
                        })(
                          <InputNumber
                            min={1.0}
                            max={999999999.999}
                            step={0.001}
                            placeholder="1.000~999999999.999"
                            id="maxCeiling"
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* <div>
                      {language[`serviceCeiling_${this.props.language.getlanguages}`]}[m]
                    </div> */}
                    <div>
                      <FormItem label={language[`serviceCeiling_${this.props.language.getlanguages}`]+"[m]"}>
                        {getFieldDecorator("serviceCeiling", {
                          // rules: [{ required: true, whitespace: true }],
                          getValueFromEvent: value => {
                            return String(value)
                              .replace(/[^\d.]/g, "")
                              .replace(/^\./g, "")
                              .replace(/\.{2,}/g, ".")
                              .replace(".", "$#$")
                              .replace(/\./g, "")
                              .replace("$#$", ".")
                              .replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3");
                          }
                        })(
                          <InputNumber
                            min={1.0}
                            max={999999999.999}
                            step={0.001}
                            placeholder="1.000~999999999.999"
                            id="serviceCeiling"
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* <div>
                      {language[`maximumRange_${this.props.language.getlanguages}`]}[km]
                    </div> */}
                    <div>
                      <FormItem label={language[`maximumRange_${this.props.language.getlanguages}`]+"[km]"}>
                        {getFieldDecorator("maxRange", {
                          // rules: [{ required: true, whitespace: true }],
                          getValueFromEvent: value => {
                            return String(value)
                              .replace(/[^\d.]/g, "")
                              .replace(/^\./g, "")
                              .replace(/\.{2,}/g, ".")
                              .replace(".", "$#$")
                              .replace(/\./g, "")
                              .replace("$#$", ".")
                              .replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3");
                          }
                        })(
                          <InputNumber
                            min={1.0}
                            max={99999999.999}
                            step={0.001}
                            placeholder="1.000~99999999.999"
                            id="maxRange"
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* <div>
                      {language[`actionRadius_${this.props.language.getlanguages}`]}[km]
                    </div> */}
                    <div>
                      <FormItem label={language[`actionRadius_${this.props.language.getlanguages}`]+"[km]"}>
                        {getFieldDecorator("actionRadius", {
                          // rules: [{ required: true, whitespace: true }],
                          getValueFromEvent: value => {
                            return String(value)
                              .replace(/[^\d.]/g, "")
                              .replace(/^\./g, "")
                              .replace(/\.{2,}/g, ".")
                              .replace(".", "$#$")
                              .replace(/\./g, "")
                              .replace("$#$", ".")
                              .replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3");
                          }
                        })(
                          <InputNumber
                            min={1.0}
                            max={99999999.999}
                            step={0.001}
                            placeholder="1.000~99999999.999"
                            id="actionRadius"
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* <div>
                      {language[`XuHangTime_${this.props.language.getlanguages}`]}[h]
                    </div> */}
                    <div>
                      <FormItem label={language[`XuHangTime_${this.props.language.getlanguages}`]+"[h]"}>
                        {getFieldDecorator("enduranceTime", {
                          // rules: [{ required: true, whitespace: true }],
                          getValueFromEvent: value => {
                            return String(value)
                              .replace(/[^\d.]/g, "")
                              .replace(/^\./g, "")
                              .replace(/\.{2,}/g, ".")
                              .replace(".", "$#$")
                              .replace(/\./g, "")
                              .replace("$#$", ".")
                              .replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3");
                          }
                        })(
                          <InputNumber
                            min={1.0}
                            max={99999999.999}
                            step={0.001}
                            placeholder="1.000~99999999.999"
                            id="enduranceTime"
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* <div>
                      {language[`AverageRCS_${this.props.language.getlanguages}`]}[㎡]
                    </div> */}
                    <div>
                      <FormItem label={language[`AverageRCS_${this.props.language.getlanguages}`]+"[㎡]"}>
                        {getFieldDecorator("rcs", {
                          // rules: [{ required: true, whitespace: true }],
                          getValueFromEvent: value => {
                            return String(value)
                              .replace(/[^\d.]/g, "")
                              .replace(/^\./g, "")
                              .replace(/\.{2,}/g, ".")
                              .replace(".", "$#$")
                              .replace(/\./g, "")
                              .replace("$#$", ".")
                              .replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3");
                          }
                        })(
                          <InputNumber
                            min={1.0}
                            max={99999999.999}
                            step={0.001}
                            placeholder="1.000~99999999.999"
                            id="rcs"
                            autoComplete="off"
                          />
                        )}
                      </FormItem>
                    </div>
                    {/* 生产商 */}
                    {/* <div>
                      {language[`producer_${this.props.language.getlanguages}`]}
                    </div> */}
                    <div>
                      <FormItem label={language[`producer_${this.props.language.getlanguages}`]}>
                        {getFieldDecorator("manufacturer", {
                          // rules: [{ required: true, whitespace: true }],
                          getValueFromEvent: event => {
                            return event.target.value.slice(0, 40);
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
TargetType = Form.create({
  mapPropsToFields(props) {
    if (props.data != null && props.data[0]) {
      //点击情报整编表格的编辑 数据
      let basicData = props.data[0];
      return {
        model: Form.createFormField({
          ...props,
          value: basicData.model
        }),
        length: Form.createFormField({
          ...props,
          value: basicData.length
        }),
        wingSpan: Form.createFormField({
          ...props,
          value: basicData.wingSpan
        }),
        height: Form.createFormField({
          ...props,
          value: basicData.height
        }),
        maxSpeed: Form.createFormField({
          ...props,
          value: basicData.maxSpeed
        }),
        cruiseSpeed: Form.createFormField({
          ...props,
          value: basicData.cruiseSpeed
        }),
        maxCeiling: Form.createFormField({
          ...props,
          value: basicData.maxCeiling
        }),
        serviceCeiling: Form.createFormField({
          ...props,
          value: basicData.serviceCeiling
        }),
        maxRange: Form.createFormField({
          ...props,
          value: basicData.maxRange
        }),
        actionRadius: Form.createFormField({
          ...props,
          value: basicData.actionRadius
        }),
        enduranceTime: Form.createFormField({
          ...props,
          value: basicData.enduranceTime
        }),
        rcs: Form.createFormField({
          ...props,
          value: basicData.rcs
        }),
        manufacturer: Form.createFormField({
          ...props,
          value: basicData.manufacturer
        })
      };
    }
  }
})(TargetType);
export default TargetType;
