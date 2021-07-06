import React, { Component, Fragment } from "react";
import style from "./Edit.css";
import styles from "./ViewNew.css";
import styleless from "./test.less";
import { Link } from "react-router-dom";
import { Input, Table, Button, Form } from "antd";
import { connect } from "dva";
import language from "../language/language";

@connect(({ table, language }) => ({ table, language }))
class ViewNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modelMark: "basicMsg"
    };
  }
  UNSAFE_componentWillReceiveProps(nextprops) {
    this.setState({ modelMark: nextprops.table.propType });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const FormItem = Form.Item;
    const paginationProps = {
      pageSize: 3
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
    const dataSource_Frequency = [
      { id: 1, FrequencyValues: 1100 },
      { id: 2, FrequencyValues: 1200 }
    ];
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
        title:language[`RepetitivePeriodicPointValue_${this.props.language.getlanguages}`],
        dataIndex: "PulseWidthValue"
      }
    ];
    const dataSource_WorkingModePluseWidth = [
      { id: 1, PulseWidthValue: 100 },
      { id: 2, PulseWidthValue: 200 }
    ];
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
    const dataSource_pulseWidth = [
      { id: 1, pulseWidthValue: 1100 },
      { id: 2, pulseWidthValue: 1100 }
    ];
    const columnsMN = [
      {
        title: language[`Eigencode_${this.props.language.getlanguages}`],
        dataIndex: "id",
        render: index => {
          return <span>{index}</span>;
        }
      },
      {
        title: language[`pulseWidth_${this.props.language.getlanguages}`] + "[μs]",
        dataIndex: "MCWidth"
      },
      {
        title: language[`carrierFrequency_${this.props.language.getlanguages}`] +"[Hz]",
        dataIndex: "ZBFrequency"
      },
      {
        title: language[`centerFrequency_${this.props.language.getlanguages}`] +"[Hz]",
        dataIndex: "ZXFrequency"
      },
      {
        title: language[`BandwidthFrequency_${this.props.language.getlanguages}`] +"[Hz]",
        dataIndex: "DKFrequency"
      },
      {
        title: language[`IntrapulseModulaSlope_${this.props.language.getlanguages}`],
        dataIndex: "MNFrequency"
      },
      {
        title: language[`CodeWidth_${this.props.language.getlanguages}`],
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
    const MNdataSource = [
      {
        id: 1,
        MCWidth: 1,
        ZBFrequency: 1,
        ZXFrequency: 3,
        DKFrequency: "",
        MNFrequency: "",
        MYWidth: "",
        BMLength: "",
        XWCode: ""
      }
    ];
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
    const QMCdataSource = [
      {
        id: 1,
        time: "2004-7-25 16:15:21.837000",
        toa: 148998,
        MinRF: "01310.0",
        MaxRF: "01310.0",
        PA: "4.50",
        PW: "003.2",
        DOA: "19.5"
      },
      {
        id: 2,
        time: "2004-7-25 16:15:21.837000",
        toa: 148999,
        MinRF: "01310.1",
        MaxRF: "01310.1",
        PA: "4.51",
        PW: "003.3",
        DOA: "19.6"
      }
    ];
    return (
      <Fragment>
        <div className={styles.ContentInfo}>
          <div
            style={{
              padding: "5px 5px 5px 20px",
              width: "1560px",
              height: "40px",
              float: "right",
              marBottom: 40
            }}
          >
            <Link to="/radarinformation">
              <Button
                type="primary"
                style={{ float: "right", marginRight: 20 }}
              >
                {language[`ReturnTheMaterialList_${this.props.language.getlanguages}`]}
              </Button>
            </Link>
          </div>
          <div className={styles.Fodderinfo}>
            <span>
              {language[`IntegratedSignalParameters_${this.props.language.getlanguages}`]}
            </span>
          </div>
          <Form className={styleless.myBandForm}>
            <div className={styles.Basic_Content_Wrap}>
              <div>
                {language[`IntelligenceNumber_${this.props.language.getlanguages}`]}
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("objectName", {
                    rules: [{}]
                  })(<Input className={styleless.input} type="text" />)}
                </FormItem>
              </div>
              <div>
                {language[`OperationalUnitNumber_${this.props.language.getlanguages}`]}
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("objectName", {
                    rules: [{}]
                  })(<Input className={styleless.input} type="text" />)}
                </FormItem>
              </div>
              <div>
                {language[`LongitudeStation_${this.props.language.getlanguages}`]}
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("objectName", {
                    rules: [{}]
                  })(<Input className={styleless.input} type="text" />)}
                </FormItem>
              </div>
              <div>
                {language[`StationLatitude_${this.props.language.getlanguages}`]}
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("objectName", {
                    rules: [{}]
                  })(<Input className={styleless.input} type="text" />)}
                </FormItem>
              </div>
              <div>
                {language[`StationHeight_${this.props.language.getlanguages}`]}
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("objectName", {
                    rules: [{}]
                  })(<Input className={styleless.input} type="text" />)}
                </FormItem>
              </div>
              <div>
                {language[`ScanningTime_${this.props.language.getlanguages}`]}
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("objectName", {
                    rules: [{}]
                  })(<Input className={styleless.input} type="text" />)}
                </FormItem>
              </div>
              <div>
                {language[`InterceptionTime_${this.props.language.getlanguages}`]}
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator("objectName", {
                    rules: [{}]
                  })(<Input className={styleless.input} type="text" />)}
                </FormItem>
              </div>
            </div>
          </Form>
          <div className={style.Work_mode} style={{ marginTop: "30px" }}>
            <div className={style.clearFloat}>
              <div className={style.Work_mode_threePart}>
                <div className={style.subhea_Child}>
                  {language[`frequency_${this.props.language.getlanguages}`]}
                </div>
                <Table
                  rowKey={record => record.id}
                  dataSource={dataSource_Frequency}
                  columns={columns_Frequency}
                  rowClassName={(record, index) =>
                    index % 2 === 0 ? styleless.odd : styleless.even
                  }
                  pagination={paginationProps}
                  className={styleless.threePart_table}
                />
              </div>

              <div className={style.Work_mode_threePart}>
                <div className={style.subhea_Child}>
                  {language[`RepetitiveCycle_${this.props.language.getlanguages}`]}
                </div>
                <Table
                  rowKey={record => record.id}
                  dataSource={dataSource_WorkingModePluseWidth}
                  columns={columns_WorkingModePluseWidth}
                  rowClassName={(record, index) =>
                    index % 2 === 0 ? styleless.odd : styleless.even
                  }
                  pagination={paginationProps}
                  className={styleless.threePart_table}
                />
              </div>

              <div className={style.Work_mode_threePart}>
                <div className={style.subhea_Child}>
                  {language[`PulseWidth_${this.props.language.getlanguages}`]}
                </div>
                <Table
                  rowKey={record => record.id}
                  dataSource={dataSource_pulseWidth}
                  columns={columns_pulseWidth}
                  rowClassName={(record, index) =>
                    index % 2 === 0 ? styleless.odd : styleless.even
                  }
                  pagination={paginationProps}
                  className={styleless.threePart_table}
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
                className={styleless.MNTable}
                rowClassName={(record, index) =>
                  index % 2 === 0 ? styleless.odd : styleless.even
                }
              />
            </div>
          </div>
          <div>
            <div className={styles.Fodderinfo}>
              <span>
                {language[`WaveformData_${this.props.language.getlanguages}`]}
              </span>
            </div>
          </div>
          <div>
            <div className={styles.Fodderinfo}>
              <span>
                {language[`FullPulseData_${this.props.language.getlanguages}`]}
              </span>
            </div>
            <Table
              rowKey={record => record.id}
              dataSource={QMCdataSource}
              columns={columnsQMC}
              className={styleless.MNTable}
              rowClassName={(record, index) =>
                index % 2 === 0 ? styleless.odd : styleless.even
              }
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

ViewNew = Form.create()(ViewNew);

export default ViewNew;
