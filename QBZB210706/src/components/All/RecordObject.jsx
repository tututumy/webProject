import React, { Component } from "react";
import {
  Radio,
  Checkbox,
  Table,
  Select,
  Popconfirm,
  message,
  Button
} from "antd";
import style from "./Radar.css";
import styleless from "./test.less";
import PropTypes from "prop-types";
import Dialog from "../../utils/DialogMask/Dialog";
import DialogConfirm from "../../utils/DialogConfirmNoMask/Dialog";
import language from "../language/language";
import { connect } from "dva";
import axios from "axios";
import responseStatus from "../../utils/initCode"
@connect(({ language, All, ElectronicTarget, loading }) => ({
  language,
  All,
  ElectronicTarget,
  loading
}))
class RecordObject extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      loading: false,
      ModalText: "Content of the modal",
      visible: false,
      confirmLoading: false,
      currentpage: "1",
      count: null,
      visibleConfirm: false,
      selectZBList_data: null,

      selectedRowKeys: [],
      loading: false,
      currentpage: "1",
      visibleConfirm: false,
      colData: [],
      selectedRows: []
    };
  }

  componentDidMount() {
    let { dispatch } = this.props;
    dispatch({
      type: "All/selectZBList"
    });
  }

  changePage = current => {
    //将当前的页数传递过来
    this.setState({
      currentpage: current
    });
  };

  start = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
        pop: false
      });
    }, 1000);
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  // 显示上传文件弹窗
  handleClick = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    this.setState({
      visible: false
    });
    let { dispatch } = this.props;
    dispatch({
      type: "All/clearAllMsg"
    });
    let count = this.state.count;
    switch (count) {
      case "1":
        this.context.router.history.push("/all?id=1");
        dispatch({
          type: "All/CreateDataSpecial",
        });
        break;
      case "2":
        this.context.router.history.push("/all?id=2");
        dispatch({
          type: "All/CreateDataZH",
        });
        break;
      case "3":
        this.context.router.history.push("/all?id=3");
        break;
      default:
        break;
    }
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  onCancel = () => {
    this.setState({
      visible: false
    });
  };
  test = () => {
    this.setState({
      count: document.getElementById("radio1").value
    });
  };
  testTwo = () => {
    this.setState({
      count: document.getElementById("radio2").value
    });
  };
  testThree = () => {
    this.setState({
      count: document.getElementById("radio3").value
    });
  };

  // 全部删除
  deleteAll = () => {
    if (this.state.selectedRowKeys.length === 0) {
      message.warning(
        language[
          `PleaseSelectTheBGFObjectFirst_${this.props.language.getlanguages}`
        ]
      );
    } else {
      this.setState({
        visibleConfirm: true
      });
    }
  };

  //删除选中的整编对象，再二次确认弹出框中点击确定删除数据
  handleOkConfirm = () => {
    let urll;
    if (typeof window.getUrl == "function") {
      urll = window.getUrl() + "/api/LK-0313036/LK036";
    } else {
      urll = "http://192.168.0.107:8087";
    }
    axios({
      method: "get",
      url: urll + "/SynthInformationReorganize/deleteSomeSpecialElect",
      params: {
        //这个动态传进来的参数
        reportName: this.state.selectedRows.join(",")
      }
    })
      .then(res => {
        if (res.data[0] == 1) {
          message.success(
            language[`deleteSuccess_${this.props.language.getlanguages}`]
          );
          this.props.dispatch({
            type: "All/selectZBList"
          });
        }
      })
      .catch(error => {
        error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
      });
    this.setState({
      visibleConfirm: false,
      selectedRowKeys: []
    });
  };

  // 每一行中的删除
  deleteOneZBMsg = (text, objectName) => {
    let { dispatch } = this.props;
    dispatch({
      type: "All/deleteZBColum",
      payload: {
        objectName: objectName
      },
      callback: res => {
        if (res.data[0] == 1) {
          message.success(
            language[`deleteSuccess_${this.props.language.getlanguages}`]
          );
          dispatch({
            type: "All/selectZBList"
          });
        }
      }
    });
  };

  handleCancelConfirm = () => {
    this.setState({
      visibleConfirm: false
    });
  };

  //点击“编辑”按钮
  handleEdit = record => {
    let { dispatch } = this.props;
    let type = record.actionType;
    switch (type) {
      //电子对抗专题报
      case language[`ECMSpecialReport_${this.props.language.getlanguages}`]:
        this.context.router.history.push("/all?id=1");
        dispatch({
          type: "All/EditDataSpecial",
          payload: {
            reportName: record.reportName,
            reportType: "电子对抗专题报"
          }
        });
        break;
      // 电子对抗综合报
      case language[ `ElectronicCountBulletin_${this.props.language.getlanguages}`]:
        this.context.router.history.push("/all?id=2");
        dispatch({
          type: "All/EditDataSpecial",
          payload: {
            reportName: record.reportName,
            reportType: "电子对抗综合报"
          }
        });
        break;
      //敌情报告
      case language[`EnemyIntelligenceReport_${this.props.language.getlanguages}`]:
        this.context.router.history.push("/all?id=3");
        dispatch({
          type: "All/EditDataEnemy",
          payload: {
            reportName: record.reportName,
            reportType: "敌情报告"
          }
        });
        break;
      default:
        break;
    }
  };

  changeCurrentPage = () => {
    this.setState({ currentpage: 1 });
  };

  render() {
    //默认显示页数
    const { selectedRowKeys, visible, confirmLoading } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: (record, selected, selectedRows) => {
        var arr = [];
        for (var i = 0; i < selectedRows.length; i++) {
          arr.push(selectedRows[i].reportName);
        }
        this.setState({ selectedRows: arr });
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        let datalength = 0;
        let ZBListData = null;
        if (this.props.All.selectZBList_data) {
          let data = this.props.All.selectZBList_data;
          let arr = [];
          let count = 0;
          if (data.length) {
            for (let i = 0; i < data.length; i++) {
              for (let j = 0; j < data[i].length; j++) {
                if (
                  data[i][j].actionType == language[`ECMSpecialReport_zh`] ||
                  data[i][j].actionType == language[`ECMSpecialReport_fr`]
                ) {
                  data[i][j].actionType =
                    language[`ECMSpecialReport_${this.props.language.getlanguages}`];
                } else if (
                  data[i][j].actionType ==
                    language[`ElectronicCountBulletin_zh`] ||
                  data[i][j].actionType ==
                    language[`ElectronicCountBulletin_fr`]
                ) {
                  data[i][j].actionType =
                    language[    `ElectronicCountBulletin_${
                        this.props.language.getlanguages
                      }`];
                } else if (
                  data[i][j].actionType ==
                    language[`EnemyIntelligenceReport_zh`] ||
                  data[i][j].actionType ==
                    language[`EnemyIntelligenceReport_fr`]
                ) {
                  data[i][j].actionType =
                    language[`EnemyIntelligenceReport_${
                        this.props.language.getlanguages
                      }`];
                }

                if (
                  data[i][j].pubishStatus == language[`yes_zh`] ||
                  data[i][j].pubishStatus == language[`yes_fr`]
                ) {
                  data[i][j].pubishStatus =
                    language[`yes_${this.props.language.getlanguages}`];
                } else if (
                  data[i][j].pubishStatus == language[`no_zh`] ||
                  data[i][j].pubishStatus == language[`no_fr`]
                ) {
                  data[i][j].pubishStatus =
                    language[`no_${this.props.language.getlanguages}`];
                }

                arr.push({
                  orderNumber: count + 1,
                  reportName: data[i][j].reportName,
                  actionType: data[i][j].actionType,
                  pubishStatus: data[i][j].pubishStatus,
                  pubishTime: data[i][j].pubishTime
                });
                count++;
              }
            }
            ZBListData = arr;
            datalength = count;
          }
        }
        if (selected == true) {
          let data = ZBListData;
          let dataLength = data.length;
          var arr = [];
          for (var i = 0; i < data.length; i++) {
            arr.push(data[i].reportName);
          }
          this.setState({
            selectedRows: arr,
            selectedRowKeys: [...Array(dataLength + 1).keys()]
          });
        } else if (selected == false) {
          this.setState({ selectedRows: "", selectedRowKeys: [] });
        }
      }
    };

    const RadioGroup = Radio.Group; //定义一个单选框组

    const columns = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "orderNumber",
        width:"10%"
      },
      {
        title: language[`ReportName_${this.props.language.getlanguages}`],
        dataIndex: "reportName",
        ellipsis:true
      },
      {
        title: language[`ReportType_${this.props.language.getlanguages}`],
        dataIndex: "actionType",
        ellipsis:true
      },
      {
        title: language[`publishStatus_${this.props.language.getlanguages}`],
        dataIndex: "pubishStatus",
        ellipsis:true
      },
      {
        title: language[`ReleaseTime_${this.props.language.getlanguages}`],
        dataIndex: "pubishTime",
        ellipsis:true
      },
      {
        title: language[`detailedInformation_${this.props.language.getlanguages}`],
        dataIndex: "view",
        render: (text, record) => (
          <span>
            <a onClick={() => this.handleEdit(record, record.key)}>
              {language[`edit_${this.props.language.getlanguages}`]}
            </a>
            &nbsp;&nbsp;
            <Popconfirm
              title={language[`ConfirmDeleteMsg_${this.props.language.getlanguages}`]}
              cancelText={language[`cancel_${this.props.language.getlanguages}`]}
              okText={language[`confirm_${this.props.language.getlanguages}`]}
              className={styleless.popConfirm}
              onConfirm={() => this.deleteOneZBMsg(text, record.reportName)}
            >
              <a>
                <span>
                  {language[`delete_${this.props.language.getlanguages}`]}
                </span>
              </a>
            </Popconfirm>
          </span>
        )
      }
    ];
    let datalength = 0;
    let ZBListData = null;
    if (this.props.All.selectZBList_data) {
      let data = this.props.All.selectZBList_data;
      let arr = [];
      let count = 0;
      if (data.length) {
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].length; j++) {
            if (
              data[i][j].actionType == language[`ECMSpecialReport_zh`] ||
              data[i][j].actionType == language[`ECMSpecialReport_fr`]
            ) {
              data[i][j].actionType =
                language[`ECMSpecialReport_${this.props.language.getlanguages}`];
            } else if (
              data[i][j].actionType == language[`ElectronicCountBulletin_zh`] ||
              data[i][j].actionType == language[`ElectronicCountBulletin_fr`]
            ) {
              data[i][j].actionType =
                language[`ElectronicCountBulletin_${this.props.language.getlanguages}`];
            } else if (
              data[i][j].actionType == language[`EnemyIntelligenceReport_zh`] ||
              data[i][j].actionType == language[`EnemyIntelligenceReport_fr`]
            ) {
              data[i][j].actionType =
                language[`EnemyIntelligenceReport_${this.props.language.getlanguages}`];
            }

            if (
              data[i][j].pubishStatus == language[`yes_zh`] ||
              data[i][j].pubishStatus == language[`yes_fr`]
            ) {
              data[i][j].pubishStatus =
                language[`yes_${this.props.language.getlanguages}`];
            } else if (
              data[i][j].pubishStatus == language[`no_zh`] ||
              data[i][j].pubishStatus == language[`no_fr`]
            ) {
              data[i][j].pubishStatus =
                language[`no_${this.props.language.getlanguages}`];
            }

            arr.push({
              orderNumber: count + 1,
              reportName: data[i][j].reportName,
              actionType: data[i][j].actionType,
              pubishStatus: data[i][j].pubishStatus,
              pubishTime: data[i][j].pubishTime
            });
            count++;
          }
        }
        ZBListData = arr;
        datalength = count;
      }
    }

    return (
      <div className={style.material_wrap}>
        <div className={style.Side}>
          <SideBar changeCurrentPage={this.changeCurrentPage} />
        </div>
        <div className={style.Content}>
          <div className={style.Fodder_title}>
            {language[`WholeObjectList_${this.props.language.getlanguages}`]}
          </div>

          <div style={{ padding: "0 10px" }}>
            <Button type="primary" onClick={this.handleClick}>
              {/* 创建整编对象 */}
              {language[`CreateAnIntegrationObject_${this.props.language.getlanguages}`]}
            </Button>
            <Button
              type="primary"
              onClick={this.deleteAll}
              style={{ float: "right" }}
              className={styleless.bgcolor}
            >
              {/* 删除选中的整编对象 */}
              {language[`DeletesTheSelectedIntegerObject_${this.props.language.getlanguages}`]}
            </Button>
            {visible ? (
              <Dialog
                TitleText={language[`selectType_${this.props.language.getlanguages}`]}
                showDialog={visible}
                onOk={this.handleOk}
                confirmLoading={confirmLoading}
                onCancel={this.handleCancel}
                okText={language[`confirm_${this.props.language.getlanguages}`]}
                cancelText={language[`quit_${this.props.language.getlanguages}`]}
                showFooter
                BodyContent={
                  <div>
                    <div className={style.ObjectType}>
                      {language[`objectType_${this.props.language.getlanguages}`]}
                    </div>
                    <RadioGroup className={styleless.radioGroup}>
                      <Radio
                        id="radio1"
                        className={style.radio_Style}
                        className={`${["ant-radio-wrapper"]}`}
                        style={{ margin: "5px 50px 10px 50px" }}
                        value={1}
                        onClick={this.test}
                      >
                        {language[`ECMSpecialReport_${this.props.language.getlanguages}`]}
                      </Radio>
                      <Radio
                        id="radio2"
                        className={style.radio_Style}
                        className={`${["ant-radio-wrapper"]}`}
                        style={{ margin: "5px 50px 10px 50px" }}
                        value={2}
                        onClick={this.testTwo}
                      >
                        {language[`ElectronicCountBulletin_${this.props.language.getlanguages}`]}
                      </Radio>
                      <Radio
                        id="radio3"
                        className={style.radio_Style}
                        className={`${["ant-radio-wrapper"]}`}
                        style={{ margin: "5px 50px 10px 50px" }}
                        value={3}
                        onClick={this.testThree}
                      >
                        {language[`EnemyIntelligenceReport_${this.props.language.getlanguages}`]}
                      </Radio>
                    </RadioGroup>
                  </div>
                }
              />
            ) : null}

            <DialogConfirm
              visible={this.state.visibleConfirm}
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
          <div className={style.TableContent_material}>
            <Table
              loading={this.props.loading.effects["All/selectZBList"]}
              bordered
              rowKey={record => record.orderNumber}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={ZBListData}
              className={styleless.myClass}
              rowClassName={(record, index) =>
                index % 2 === 0 ? styleless.odd : styleless.even
              } //奇偶行颜色交替变化
              pagination={{
                // 分页
                showQuickJumper: true,
                onChange: this.changePage, //获取选中的页数
                current: Number(this.state.currentpage),
                pageSize: 15
              }}
            />
          </div>

          <div className={style.dataNum}>
            <span style={{ marginLeft: 8 }}>
              {language[`Altogether_${this.props.language.getlanguages}`]}
              &nbsp;&nbsp;
              {datalength}
              &nbsp;&nbsp;
              {language[`BarData_${this.props.language.getlanguages}`]}
            </span>
            ,{language[`current_${this.props.language.getlanguages}`]}
            &nbsp;&nbsp;
            {this.state.currentpage}/{Math.ceil(datalength / 15)}
            &nbsp;&nbsp;
            {language[`Page_${this.props.language.getlanguages}`]}
          </div>
        </div>
      </div>
    );
  }
}

@connect(({ language, All }) => ({ language, All }))
class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hiddenType: false,
      hiddenUnit: false,
      hiddenSend: false,

      typeCheck1: true,
      typeCheck2: true,
      typeCheck3: true,
      unitCheck1: true,
      unitCheck2: true
    };
  }

  handleClickType = () => {
    this.setState(state => ({
      hiddenType: !state.hiddenType
    }));
  };

  handleClickUnit = () => {
    this.setState(state => ({
      hiddenUnit: !state.hiddenUnit
    }));
  };
  handleClickSend = () => {
    this.setState(state => ({
      hiddenSend: !state.hiddenSend
    }));
  };

  handleChange = e => {
    if (e.target.name === "typeCheck1") {
      this.setState({ typeCheck1: !this.state.typeCheck1 });
    } else if (e.target.name === "typeCheck2") {
      this.setState({ typeCheck2: !this.state.typeCheck2 });
    } else if (e.target.name === "typeCheck3") {
      this.setState({ typeCheck3: !this.state.typeCheck3 });
    } else if (e.target.name === "unitCheck1") {
      this.setState({ unitCheck1: !this.state.unitCheck1 });
    } else if (e.target.name === "unitCheck2") {
      this.setState({ unitCheck2: !this.state.unitCheck2 });
    }
  };

  // 点击查询按钮
  handleClickBtn = () => {
    this.props.changeCurrentPage();
    let { dispatch } = this.props;
    dispatch({
      type: "All/selectZBColumn",
      payload: {
        a: this.state.typeCheck1 ? 1 : 0,
        b: this.state.typeCheck2 ? 1 : 0,
        c: this.state.typeCheck3 ? 1 : 0,
        d: this.state.unitCheck1 ? 1 : 0,
        e: this.state.unitCheck2 ? 1 : 0
      }
    });
  };

  //弹窗拖动
  onControlledDrag = (e, position) => {
    const { x, y } = position;
    this.setState({ controlledPosition: { x, y } });
  };

  onControlledDragStop = (e, position) => {
    this.onControlledDrag(e, position);
  };

  adjustXPos = e => {
    e.preventDefault();
    e.stopPropagation();
    const { controlledPosition } = this.state;
    const { x, y } = controlledPosition;
    this.setState({ controlledPosition: { x: x - 10, y } });
  };

  adjustYPos = e => {
    e.preventDefault();
    e.stopPropagation();
    const { controlledPosition } = this.state;
    const { x, y } = controlledPosition;
    this.setState({ controlledPosition: { x, y: y - 10 } });
  };

  handleDrag = (e, ui) => {
    const { deltaPosition } = this.state;
    const { x, y } = deltaPosition;
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY
      }
    });
  };
  render() {
    const RadioGroup = Radio.Group; //定义一个单选框组
    const Option = Select.Option;

    return (
      <div className={style.Basic}>
        <div className={style.BasicFodder}>
          <strong>
            {language[`TargetScreening_${this.props.language.getlanguages}`]}
          </strong>
        </div>
        <div className={style.FodderType}>
          <div className={style.FodderTypeTitle} onClick={this.handleClickType}>
            {language[`objectType_${this.props.language.getlanguages}`]}
          </div>
          <div className={style.FodderTypeChild} hidden={this.state.hiddenType}>
            <div className={style.checkStyle}>
              <Checkbox
                name="typeCheck1"
                checked={this.state.typeCheck1}
                onChange={this.handleChange}
              >
                {language[`ECMSpecialReport_${this.props.language.getlanguages}`]}
              </Checkbox>
            </div>
            <div className={style.checkStyle}>
              <Checkbox
                name="typeCheck2"
                checked={this.state.typeCheck2}
                onChange={this.handleChange}
              >
                {language[`ElectronicCountBulletin_${this.props.language.getlanguages}`]}
              </Checkbox>
            </div>
            <div className={style.checkStyle}>
              <Checkbox
                name="typeCheck3"
                checked={this.state.typeCheck3}
                onChange={this.handleChange}
              >
                {language[`EnemyIntelligenceReport_${this.props.language.getlanguages}`]}
              </Checkbox>
            </div>
          </div>
        </div>

        <div className={style.FodderType}>
          <div className={style.FodderTypeTitle} onClick={this.handleClickUnit}>
            {language[`publishStatus_${this.props.language.getlanguages}`]}
          </div>
          <div className={style.FodderTypeChild} hidden={this.state.hiddenUnit}>
            <div className={style.checkStyle}>
              <Checkbox
                name="unitCheck1"
                checked={this.state.unitCheck1}
                onChange={this.handleChange}
              >
                {language[`unpublished_${this.props.language.getlanguages}`]}
              </Checkbox>
            </div>
            <div className={style.checkStyle}>
              <Checkbox
                name="unitCheck2"
                checked={this.state.unitCheck2}
                onChange={this.handleChange}
              >
                {language[`published_${this.props.language.getlanguages}`]}
              </Checkbox>
            </div>
          </div>
        </div>

        <div
          className={style.SelctBtn}
          style={
            language[`query_${this.props.language.getlanguages}`] === "查询"
              ? { paddingLeft: "118px" }
              : { paddingLeft: "99px" }
          }
        >
          <Button
            type="primary"
            className={styleless.bgcolor}
            onClick={this.handleClickBtn}
          >
            {language[`query_${this.props.language.getlanguages}`]}
          </Button>
        </div>
      </div>
    );
  }
}

RecordObject.propTypes = {};

export default RecordObject;
