import React, { Component } from "react";
import { connect } from "dva";
import style from "./Edit.css";
import styleless from "./test.less";
import { Select, Input, Form, Table, Tabs, Button } from "antd";
import language from "../language/language";
@connect(({ language, ElectronicTarget }) => ({ language, ElectronicTarget }))
class CommitLook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowId: -1, //工作模式当前被点击的行
      modeId: null, //工作模式当前被点击的行的模式内码
      selectedRowKeys: "", //工作模式点击的行
      FreqHoppingPointSet: null //频率点集的数据
    };
  }

  UNSAFE_componentWillReceiveProps(nextprops) {
    if (nextprops.showDialog == false) {
      this.setState({
        selectedRowKeys: "",
        FreqHoppingPointSet: null
      });
    }
  }

  //点击工作模式中的行  显示对应的工作模式详细内容
  clickRow = record => {
    this.setState(
      { modeId: record.modeId, selectedRowKeys: record.key - 1 },
      function () {
        this.props.dispatch({
          type: "ElectronicTarget/selectFreqHoppingPointSet",
          payload: this.state.modeId,
          callback: res => {
            if (res.data && res.data[0]) {
              let data = res.data[0];
              this.setState({ FreqHoppingPointSet: data });
            }
          }
        });
      }
    );

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
          type: "ElectronicTarget/sendTargetModelMsg_fromTar",
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

  selectionChange = (selectKey, selectRow) => {
    //工作模式单击单选按钮
    const { modeId, key } = selectRow[0];
    this.setState({
      selectedRowKeys: key - 1
    });
    this.props.dispatch({
      type: "ElectronicTarget/selectFreqHoppingPointSet",
      payload: modeId,
      callback: res => {
        if (res.data && res.data[0]) {
          let data = res.data[0];
          this.setState({ FreqHoppingPointSet: data });
        }
      }
    });
  };

  render() {
    const rowSelection = {
      type: "radio",
      selectedRowKeys: [this.state.selectedRowKeys],
      onChange: this.selectionChange
    };

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
        //序号
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        // 工作模式内码
        title: language[`ModelCode_${this.props.language.getlanguages}`],
        dataIndex: "modeId"
      },
      {
        // 系统类型
        title: language[`systemType_${this.props.language.getlanguages}`],
        dataIndex: "systemTypeId"
      },
      {
        // 调制样式
        title: language[`ModulationStyleInternal_${this.props.language.getlanguages}`],
        dataIndex: "modulateTypeId"
      },
      {
        // 模式名称
        title: language[`patternName_${this.props.language.getlanguages}`],
        dataIndex: "modeName"
      },
      {
        // 是否跳频
        title: language[`FrequencyHopping_${this.props.language.getlanguages}`],
        dataIndex: "isFreqHop"
      },
      {
        // 频率上限
        title: language[`upperFrequencyLimit_${this.props.language.getlanguages}`] + "[MHz]",
        dataIndex: "maxWorkFreqHz"
      },
      {
        // 频率下限
        title: language[`LowerFrequencyLimit_${this.props.language.getlanguages}`] + "[MHz]",
        dataIndex: "minWorkFreqHz"
      },
      {
        //中心频率
        title: language[`centerFrequency_${this.props.language.getlanguages}`] + "[MHz]",
        dataIndex: "centerFreqHz"
      },
      {
        //带宽上限
        title: language[`BandwidthUpperLimit_${this.props.language.getlanguages}`] + "[MHz]",
        dataIndex: "maxBwHz"
      },
      {
        //带宽下限
        title: language[`LowerBandWidthLimit_${this.props.language.getlanguages}`] + "[MHz]",
        dataIndex: "minBwHz"
      },
      {
        //中心带宽
        title: language[`CentralBandwidth_${this.props.language.getlanguages}`] + "[MHz]",
        dataIndex: "centerBwHz"
      },
      {
        //跳频频点数
        title: language[`NumberOfHops_${this.props.language.getlanguages}`],
        dataIndex: "fhFreqNum"
      },
      {
        //跳频速度
        title: language[`FrequencyHoppingSpeed_${this.props.language.getlanguages}`],
        dataIndex: "fh_speed"
      },
      {
        //备注
        title: language[`remark_${this.props.language.getlanguages}`],
        dataIndex: "remark"
      }
    ];
    // 工作模式-传输系统类型
    const columns_radioFrequency = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`name_${this.props.language.getlanguages}`],
        dataIndex: "freq"
      }
    ];

    //工作模式-通信调制样式
    const columns_WorkingModePluseWidth = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`name_${this.props.language.getlanguages}`],
        dataIndex: "pw"
      }
    ];
    //通信装备_工作模式_跳频点集
    const columns_WorkingModeRepetInter = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`frequency_${this.props.language.getlanguages}`],
        dataIndex: "freq"
      }
    ];
    let WorkModelData = [];
    if (this.props.data && this.props.data[1]) {
      let data = this.props.data[1];
      for (let i = 0; i < data.length; i++) {
        WorkModelData.push({
          key: i + 1,
          modeId: data[i].modeId,
          systemTypeId: data[i].systemTypeId,
          modulateTypeId: data[i].modulateTypeId,
          modeName: data[i].modeName,
          isFreqHop: data[i].isFreqHop,
          maxWorkFreqHz: data[i].maxWorkFreqHz ? data[i].maxWorkFreqHz / 1000000 : "",
          minWorkFreqHz: data[i].minWorkFreqHz ? data[i].minWorkFreqHz / 1000000 : "",
          centerFreqHz: data[i].centerFreqHz ? data[i].centerFreqHz / 1000000 : "",
          maxBwHz: data[i].maxBwHz ? data[i].maxBwHz / 1000000 : "",
          minBwHz: data[i].minBwHz ? data[i].minBwHz / 1000000 : "",
          centerBwHz: data[i].centerBwHz ? data[i].centerBwHz / 1000000 : "",
          fhFreqNum: data[i].fhFreqNum,
          fh_speed: data[i].fh_speed,
          remark: data[i].remark
        });
      }
    }

    let FreqHoppingPointSet = [];
    if (this.state.FreqHoppingPointSet) {
      let data = this.state.FreqHoppingPointSet;
      for (let i = 0; i < data.length; i++) {
        FreqHoppingPointSet.push({
          key: i + 1,
          freq: data[i].freq
        });
      }
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
            {/* 名称 */}
            <div>{language[`name_${this.props.language.getlanguages}`]}</div>
            <div>
              <FormItem>
                {getFieldDecorator("commName", {})(
                  <Input className={styleless.input} type="text" disabled />
                )}
              </FormItem>
            </div>
            <div>{language[`countriesAndRegions_${this.props.language.getlanguages}`]}</div>
            <div>
              <FormItem>
                {getFieldDecorator("countryId", {})(
                  <Select  disabled className={styleless.input}>
                  {language.countryName.map((v, k) => (
                    <Option value={v.value} key={v.value}>
                      {v[`name_${this.props.language.getlanguages}`]}
                    </Option>
                  ))}
                </Select>
                )}
              </FormItem>
            </div>
            <div>{language[`FriendOrFoeProperties_${this.props.language.getlanguages}`]}</div>
            <div>
              <FormItem>
                {getFieldDecorator("forId", {})(
                   <Select
                   disabled
                   className={styleless.input}
                   dropdownStyle={{ zIndex: "1054" }}
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

            {/* <div>{language[`purpose_${this.props.language.getlanguages}`]}</div>
            <div>
              <FormItem>
                {getFieldDecorator("purpose", {})(
                  <Input className={styleless.input} type="text" disabled />
                )}
              </FormItem>
            </div>
            
            <div>
              {language[`DeploymentInformation_${this.props.language.getlanguages}`]}
            </div>
            <div>
              <FormItem>
                {getFieldDecorator("deployInformation")(
                  <Input className={styleless.input} type="text" disabled />
                )}
              </FormItem>
            </div>
            <div>
              {language[`ActiveAreaDescription_${this.props.language.getlanguages}`]}
            </div>
            <div>
              <FormItem>
                {getFieldDecorator("activeAreaDescription", {})(
                  <Input className={styleless.input} type="text" disabled />
                )}
              </FormItem>
            </div>
            <div>
              {language[`LoadDescription_${this.props.language.getlanguages}`]}
            </div>
            <div>
              <FormItem>
                {getFieldDecorator("loadDescription", {})(
                  <Input className={styleless.input} type="text" disabled />
                )}
              </FormItem>
            </div>
          */}
          </div>
        </div>

        {/* 工作模式 */}
        <div className={style.ContentParamsMin}>
          <div className={style.subhead}>
            <div style={{ marginLeft: "10px", float: "left" }}>
              {language[`WorkingMode_${this.props.language.getlanguages}`]}
            </div>
          </div>
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
              rowSelection={rowSelection}
            />
          </div>
          <div className={style.clearFloat}>
            <div className={style.Work_mode_Min}>
              {/* <div className={style.Work_mode_threePart}>
                <div className={style.subhea_Child}>
                  <span>传输系统类型</span>
                </div>
                <div>
                  {/* 传输系统类型 */}
              {/* <Table
                    className={styleless.myClassAdd_zh}
                    pagination={paginationProps_threePart}
                    columns={columns_radioFrequency}
                    dataSource={arr_SP}
                    rowClassName={(record, index) => index % 2 === 0 ? styleless.odd : styleless.even}
                    rowKey={record => record.key}
                  />
                </div>
              </div>
              <div className={style.Work_mode_threePart}>
                <div className={style.subhea_Child}>
                  <span>通信调制样式</span>
                </div>
                <div>
                  {/* 通信调制样式 */}
              {/* <Table
                    rowKey={record => record.key}
                    dataSource={arr_MK}
                    columns={columns_WorkingModePluseWidth}
                    rowClassName={(record, index) => index % 2 === 0 ? styleless.odd : styleless.even}
                    pagination={paginationProps_threePart}
                    className={styleless.myClassAdd_zh}
                  />
                </div>
              </div> */}

              <div className={style.Work_mode_threePart}>
                <div
                  className={style.subhea_Child}
                  style={{ width: "943px", marginLeft: "0" }}
                >
                  <span>
                    {language[`Communication_equipment_working_mode_frequency_hopping_point_${this.props.language.getlanguages}`]}
                  </span>
                </div>
                <div>
                  {/* 通信装备_工作模式_跳频点集 */}
                  <Table
                    style={{ width: "943px" }}
                    rowKey={record => record.key}
                    dataSource={FreqHoppingPointSet}
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
        </div>
      </div>
    );
  }
}

CommitLook = Form.create({
  mapPropsToFields(props) {
    //1.目标库导入的数据
    if (props.data != null && props.data[0]) {
      let data = props.data[0];
      return {
        // 基本信息
        commName: Form.createFormField({
          ...props,
          value: data.commName
        }),
        countryId: Form.createFormField({
          ...props,
          value: data.countryId
        }),
        forId: Form.createFormField({
          ...props,
          value: data.forId
        }),
        // purpose: Form.createFormField({
        //   ...props,
        //   value: data.purpose
        // }),
        // deployInformation: Form.createFormField({
        //   ...props,
        //   value: data.deployInformation
        // }),
        // activeAreaDescription: Form.createFormField({
        //   ...props,
        //   value: data.activeAreaDescription
        // }),
        // loadDescription: Form.createFormField({
        //   ...props,
        //   value: data.loadDescription
        // })
      };
    }
  }
})(CommitLook);

export default CommitLook;
