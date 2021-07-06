import React, { Component, Fragment } from "react";
import style from "./Edit.css";
import styles from "./ViewNew.css";
import styleless from "./test.less";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Input, Table, Button, Form, Tooltip } from "antd";
import { connect } from "dva";
import language from "../language/language";
import { Sample1 } from "./Sample1";

@connect(({ table, language, radarModel }) => ({ table, language, radarModel }))
class ViewNew extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      modelMark: "basicMsg",
      mark: true
    };
  }
  
  UNSAFE_componentWillReceiveProps(nextprops) {
    this.setState({ modelMark: nextprops.table.propType });
  }
  componentWillUnmount = () => {
    //清空界面数据
    this.props.dispatch({
      type: "radarModel/clearMsg_ViewNew"
    });
  };


  handleGoBack = () => {
    this.context.router.history.push("/radarinformation");
    // this.setState({mark:!this.state.mark})
    this.props.dispatch({
      type: "radarModel/changeMarkSideBar",
      payload: !this.state.mark
    });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const FormItem = Form.Item;
    const paginationProps = {
      pageSize: 5
    };

    //射频的列
    const columns_Frequency = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "id",
        render: index => {
          return <span>{index}</span>;
        }
      },
      {
        // 频率点值
        title: language[`FrequencyPointValue_${this.props.language.getlanguages}`],
        dataIndex: "FrequencyValues"
      }
    ];
    let dataSource_Frequency = [];
    if (
      this.props.radarModel.ZCSignMsg_data &&
      this.props.radarModel.ZCSignMsg_data["频率点值"]
    ) {
      let data = this.props.radarModel.ZCSignMsg_data["频率点值"];
      for (let i = 0; i < data.length; i++) {
        dataSource_Frequency.push({
          id: i + 1,
          FrequencyValues: data[i]["值"]
        });
      }
    }

    //重复周期
    const columns_WorkingModePluseWidth = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "id",
        render: index => {
          return <span>{index}</span>;
        }
      },
      {
        title: language[`RepetitivePeriodicPointValue_${this.props.language.getlanguages}`],
        dataIndex: "PulseWidthValue"
      }
    ];
    let dataSource_WorkingModePluseWidth = [];
    if (
      this.props.radarModel.ZCSignMsg_data &&
      this.props.radarModel.ZCSignMsg_data["重复周期点值"]
    ) {
      let data = this.props.radarModel.ZCSignMsg_data["重复周期点值"];
      for (let i = 0; i < data.length; i++) {
        dataSource_WorkingModePluseWidth.push({
          id: i + 1,
          PulseWidthValue: data[i]["值"]
        });
      }
    }
    //脉宽
    const columns_pulseWidth = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "id",
        render: index => {
          return <span>{index}</span>;
        }
      },
      {
        title: language[`PulseWidthPointValue_${this.props.language.getlanguages}`],
        dataIndex: "pulseWidthValue"
      }
    ];
    let dataSource_pulseWidth = [];
    if (
      this.props.radarModel.ZCSignMsg_data &&
      this.props.radarModel.ZCSignMsg_data["脉宽点值"]
    ) {
      let data = this.props.radarModel.ZCSignMsg_data["脉宽点值"];
      for (let i = 0; i < data.length; i++) {
        dataSource_pulseWidth.push({
          id: i + 1,
          pulseWidthValue: data[i]["值"]
        });
      }
    }
    const columnsMN = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`Eigencode_${this.props.language.getlanguages}`],
        dataIndex: "id"
      },
      {
        title: language[`pulseWidth_${this.props.language.getlanguages}`] + "[μs]",
        dataIndex: "MCWidth"
      },
      {
        title: language[`carrierFrequency_${this.props.language.getlanguages}`] + "[MHz]",
        dataIndex: "ZBFrequency"
      },
      {
        title: language[`centerFrequency_${this.props.language.getlanguages}`] +"[MHz]",
        dataIndex: "ZXFrequency"
      },
      {
        title: language[`BandwidthFrequency_${this.props.language.getlanguages}`] +"[MHz]",
        dataIndex: "DKFrequency"
      },
      {
        title: language[`IntrapulseModulaSlope_${this.props.language.getlanguages}`]+"[MHz/μs]",
        dataIndex: "MNFrequency"
      },
      {
        title: language[`CodeWidth_${this.props.language.getlanguages}`] + "[μs]",
        dataIndex: "MYWidth"
      },
      {
        title: language[`Codinglength_${this.props.language.getlanguages}`],
        dataIndex: "BMLength"
      },
      {
        title: language[`PhaseJumpCode_${this.props.language.getlanguages}`],
        dataIndex: "XWCode"
      }
    ];
    let MNdataSource = [];
    if (
      this.props.radarModel.ZCSignMsg_data &&
      this.props.radarModel.ZCSignMsg_data["脉内调制信息"]
    ) {
      let data = this.props.radarModel.ZCSignMsg_data["脉内调制信息"];
      MNdataSource.push({
        key: 1,
        id: data["脉内类型内码"],
        MCWidth: data["脉冲宽度_微妙"],
        // ZBFrequency: data["载波频率_赫兹"]?parseInt(data["载波频率_赫兹"]/100000):"",
        // ZXFrequency: data["中心频率_赫兹"]?parseInt(data["中心频率_赫兹"]/100000):"",
        // DKFrequency: data["带宽_赫兹"]?parseInt(data["带宽_赫兹"]/100000):"",
        ZBFrequency: data["载波频率_赫兹"] / 1000000,
        ZXFrequency: data["中心频率_赫兹"] / 1000000,
        DKFrequency: data["带宽_赫兹"] / 1000000,
        MNFrequency: data["脉内调制斜率"],
        MYWidth: data["码元宽度"],
        BMLength: data["编码长度"],
        XWCode: data["相位跳转码"]
      });
    }
    const columnsQMC = [
      {
        title: language[`PDWTypeInternalCode_${this.props.language.getlanguages}`],
        dataIndex: "id",
        render: index => {
          return <span>{index}</span>;
        }
      },
      {
        title: language[`ArrivalTime_${this.props.language.getlanguages}`],
        dataIndex: "time"
      },
      {
        title: "TOA",
        dataIndex: "toa"
      },
      {
        title: "MinRF",
        dataIndex: "MinRF"
      },
      {
        title: "MaxRF",
        dataIndex: "MaxRF"
      },
      {
        title: "PA",
        dataIndex: "PA"
      },
      {
        title: "PW",
        dataIndex: "PW"
      },
      {
        title: "DOA",
        dataIndex: "DOA"
      }
    ];
    const QMCdataSource = [];
    return (
      <Fragment>
        <div className={styles.ContentInfo}>
          {/* <div style={{ padding: '5px 5px 5px 20px', width: '1560px', height: '40px', float: 'right', marBottom: 40 }}>
                        <Button type="primary" onClick={this.handleGoBack} style={{ float: 'right', marginRight: 20 }}>{language[`ReturnTheMaterialList_${this.props.language.getlanguages}`]}</Button>
                    </div> */}
          <div className={styles.Fodderinfo}>
            <span>
              {language[`IntegratedSignalParameters_${this.props.language.getlanguages}`]}
            </span>
          </div>
          <Form className={styleless.myBandForm}>
            <div className={styles.Basic_Content_Wrap}>
              <div>
                <Tooltip title={language[`IntelligenceNumber_${this.props.language.getlanguages}`]}>
                  {language[`IntelligenceNumber_${this.props.language.getlanguages}`]}
                </Tooltip>
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("sign1", {
                    rules: [{}]
                  })(
                    <Input className={styleless.input} type="text" disabled />
                  )}
                </FormItem>
              </div>
              <div>
                <Tooltip title={language[`OperationalUnitNumber_${this.props.language.getlanguages}`]}>
                  {language[`OperationalUnitNumber_${this.props.language.getlanguages}`]}
                </Tooltip>
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("sign2", {
                    rules: [{}]
                  })(
                    <Input className={styleless.input} type="text" disabled />
                  )}
                </FormItem>
              </div>
              <div>
                <Tooltip title={language[`LongitudeStation_${this.props.language.getlanguages}`] + "[°]"}>
                  {language[`LongitudeStation_${this.props.language.getlanguages}`]}[°]
                </Tooltip>
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("sign3", {
                    rules: [{}]
                  })(
                    <Input className={styleless.input} type="text" disabled />
                  )}
                </FormItem>
              </div>
              <div>
                <Tooltip title={language[`StationLatitude_${this.props.language.getlanguages}`] + "[°]"}>
                  {language[`StationLatitude_${this.props.language.getlanguages}`]}[°]
                </Tooltip>
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("sign4", {
                    rules: [{}]
                  })(
                    <Input className={styleless.input} type="text" disabled />
                  )}
                </FormItem>
              </div>
              <div>
                <Tooltip title={language[`StationHeight_${this.props.language.getlanguages}`] + "[Km]"}>
                  {language[`StationHeight_${this.props.language.getlanguages}`]}[Km]
                </Tooltip>
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("sign5", {
                    rules: [{}]
                  })(
                    <Input className={styleless.input} type="text" disabled />
                  )}
                </FormItem>
              </div>
              <div>
                <Tooltip title={language[`ScanningTime_${this.props.language.getlanguages}`] + "[s]"}>
                  {language[`ScanningTime_${this.props.language.getlanguages}`]}[s]
                </Tooltip>
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("sign6", {
                    rules: [{}]
                  })(
                    <Input className={styleless.input} type="text" disabled />
                  )}
                </FormItem>
              </div>
              <div>
                <Tooltip title={language[`InterceptionTime_${this.props.language.getlanguages}`]}>
                  {language[`InterceptionTime_${this.props.language.getlanguages}`]}
                </Tooltip>
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("sign7", {
                    rules: [{}]
                  })(
                    <Input className={styleless.input} type="text" disabled />
                  )}
                </FormItem>
              </div>
            </div>
          </Form>
          <div className={style.Work_mode} style={{ marginTop: "30px" }}>
            <div
              className={style.Work_mode_Min}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div className={style.Work_mode_threePart}>
                <div className={style.subhea_Child}>
                  {language[`frequency_${this.props.language.getlanguages}`]}[MHz]
                </div>
                <Table
                  rowKey={record => record.id}
                  dataSource={dataSource_Frequency}
                  columns={columns_Frequency}
                  rowClassName={(record, index) =>
                    index % 2 === 0 ? styleless.odd : styleless.even
                  }
                  pagination={paginationProps}
                  style={{ height: "200px" }}
                  className={this.props.language.getlanguages=="fr"?styleless.view_threePart_table_fr:styleless.view_threePart_table}
                />
              </div>
              {console.log("this.props.language.getlanguages",this.props.language.getlanguages)}
              <div className={style.Work_mode_threePart}>
                <div className={style.subhea_Child}>
                  {language[`RepetitiveCycle_${this.props.language.getlanguages}`]}[μs]
                </div>
                <Table
                  rowKey={record => record.id}
                  dataSource={dataSource_WorkingModePluseWidth}
                  columns={columns_WorkingModePluseWidth}
                  rowClassName={(record, index) =>
                    index % 2 === 0 ? styleless.odd : styleless.even
                  }
                  pagination={paginationProps}
                  className={this.props.language.getlanguages=="fr"?styleless.view_threePart_table_fr:styleless.view_threePart_table}
                />
              </div>

              <div className={style.Work_mode_threePart}>
                <div className={style.subhea_Child}>
                  {language[`PulseWidth_${this.props.language.getlanguages}`]}
                  [μs]
                </div>
                <Table
                  rowKey={record => record.id}
                  dataSource={dataSource_pulseWidth}
                  columns={columns_pulseWidth}
                  rowClassName={(record, index) =>
                    index % 2 === 0 ? styleless.odd : styleless.even
                  }
                  pagination={paginationProps}
                  className={this.props.language.getlanguages=="fr"?styleless.view_threePart_table_fr:styleless.view_threePart_table}
                />
              </div>
            </div>
            <div className={styles.Work_mode_character}>
              <div className={styles.Work_mode_character_Title}>
                {language[`ModulationInformation_${this.props.language.getlanguages}`]}
              </div>
              <Table
                rowKey={record => record.id}
                dataSource={MNdataSource}
                columns={columnsMN}
                pagination={paginationProps}
                bordered
                // className={styleless.MNTable}
                className={styleless.view_threePart_table}
                rowClassName={(record, index) =>
                  index % 2 === 0 ? styleless.odd : styleless.even
                }
              />
            </div>
          </div>
          <div>
            <div className={styles.Fodderinfo}>
              <span>{language[`WaveformData_${this.props.language.getlanguages}`]}</span>
            </div>
            <div>
              <Sample1 />
            </div>
          </div>
          {/* <div className={styles.clearFloat}>
            <div className={styles.Fodderinfo}>
              <span>
                {language[`FullPulseData_${this.props.language.getlanguages}`]}
              </span>
            </div>
            <div>
              <Table
                rowKey={record => record.id}
                dataSource={QMCdataSource}
                columns={columnsQMC}
                // className={styleless.MNTable}
                className={styleless.view_threePart_table}
                rowClassName={(record, index) =>
                  index % 2 === 0 ? styleless.odd : styleless.even
                }
              />
            </div>
          </div>
        */}
        </div>
      </Fragment>
    );
  }
}

ViewNew = Form.create({
  mapPropsToFields(props) {
    if (props.data != null) {
      //点击情报整编表格的编辑 数据
      let data = props.data;
      return {
        sign1: Form.createFormField({
          ...props,
          value: data["情报编号"]
        }),
        sign2: Form.createFormField({
          ...props,
          value: data["作战单元编号"]
        }),
        sign3: Form.createFormField({
          ...props,
          value: data["站位置"] ? data["站位置"]["站经度"] : ""
        }),
        sign4: Form.createFormField({
          ...props,
          value: data["站位置"] ? data["站位置"]["站纬度"] : ""
        }),
        sign5: Form.createFormField({
          ...props,
          value: data["站位置"] ? data["站位置"]["高度"] : ""
        }),
        sign6: Form.createFormField({
          ...props,
          value: data["扫描时间"]
        }),
        sign7: Form.createFormField({
          ...props,
          value: data["截获时间"]
        })
      };
    }
  }
})(ViewNew);

export default ViewNew;
