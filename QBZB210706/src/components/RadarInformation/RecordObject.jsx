import React, { Component, Fragment } from "react";
import { Table, Button, Select, Popconfirm, Checkbox, message } from "antd";
import style from "./Radar.css";
import styleless from "./test.less";
import { Link } from "react-router-dom";
import Draggable from "react-draggable";
import DialogConfirm from "../../utils/DialogConfirmNoMask/Dialog";
import { connect } from "dva";
import language from "../language/language";
import axios from "axios";
import responseStatus  from "../../utils/initCode"

@connect(({ language, radarModel, loading }) => ({
  language,
  radarModel,
  loading
}))
class RecordObject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      loading: false,
      currentpage: 1,
      visibleConfirm: false,
      colData: [],
      selectedRows: [],
      visibleConfirmAdiidb: false,
      oneZBName: null, //单行删除  删除的行的整编对象名称
      currentRadar: null, //当前删除的雷达整编对象
      UsedTarget: null //当前雷达被某个电子目标使用
    };
  }

  componentDidMount() {
    let { dispatch } = this.props;
    dispatch({
      type: "radarModel/ClickQBZB",
      payload: {
        countryName: "null",
        publishStatus: "null",
        okPublishStatus: "null",
        modelName: "null"
      }
    });
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  changePage = current => {
    //将当前的页数传递过来
    this.setState({
      currentpage: current
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

  handleCancelConfirm = () => {
    this.setState({
      visibleConfirm: false
    });
  };

  //删除选中的整编对象，再二次确认弹出框中点击确定删除数据
  handleOkConfirm = (sign, name) => {
    if (sign == "one") {
      this.setState({ oneZBName: name });
    }
    let urll;
    if (typeof window.getUrl == "function") {
      urll = window.getUrl() + "/api/LK-0313036/LK036";
    } else {
      urll = "http://192.168.0.107:8087";
    }
    axios({
      method: "get",
      url: urll + "/RadarInformationReorganize/deleteOneObjs",
      params: {
        //这个动态传进来的参数
        objectName: sign == "one" ? name : this.state.selectedRows.join(",")
      }
    })
      .then(res => {
        if (res.data[0] === "1") {
          //调用删除接口返回值为1=>当前选中的雷达在目标情报整编中挂载
          axios({
            //查询雷达是否在adiidb库中，如果在弹出确认框是否确认删除
            method: "get",
            url: urll + "/RadarInformationReorganize/selectIfHavaRadarAtADIIDB",
            params: {
              //这个动态传进来的参数
              objectName:
                sign == "one" ? name : this.state.selectedRows.join(",")
            }
          })
            .then(res => {
              if (res.data[0] === "0") {
                //返回值为0=>选中的雷达在addidb库中，确认是否删除
                this.setState({ visibleConfirmAdiidb: true });
              } else if (res.data[0] == "1") {
                //返回值为1=>选中的雷达不在addidb库中，可以直接删除
                message.success(
                  language[`deleteSuccess_${this.props.language.getlanguages}`]
                );
                this.props.dispatch({
                  type: "radarModel/ClickQBZB",
                  payload: {
                    countryName: this.props.radarModel.seleleZBList_choise[0],
                    publishStatus: this.props.radarModel.seleleZBList_choise[1],
                    okPublishStatus: this.props.radarModel
                      .seleleZBList_choise[2],
                    modelName: "null"
                  }
                });
                this.setState({ selectedRowKeys: [], oneZBName: name });
              } else {
                message.error(
                  language[  `operationFailed_${this.props.language.getlanguages}`
                  ]
                );
              }
            })
            .catch(error => {
              message.error(`${error}` || "删除失败！");
            });
          // message.success(language[`deleteSuccess_${this.props.language.getlanguages}`])
          // this.props.dispatch({
          //   type: 'radarModel/ClickQBZB',
          //   payload: {
          //     countryName: this.props.radarModel.seleleZBList_choise[0],
          //     publishStatus: this.props.radarModel.seleleZBList_choise[1],
          //     okPublishStatus: this.props.radarModel.seleleZBList_choise[2],
          //     modelName:"null"
          //   }
          // })
        } else if (res.data[0] == "0") {
          this.setState({ currentRadar: res.data[1], UsedTarget: res.data[2] });
          message.warning(
            `${this.state.currentRadar}${
              language[`UsedByTarget_${this.props.language.getlanguages}`]
            }${this.state.UsedTarget}${
              language[`UsedNODelete_${this.props.language.getlanguages}`]
            }`
          );
        } else {
          message.error(
            language[`operationFailed_${this.props.language.getlanguages}`]
          );
        }
      })
      .catch(error => {
        error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
      });
    this.setState({
      visibleConfirm: false
    });
  };

  //删除选中的整编对象，有挂载在adiidb库中，确认不删除
  handleCancelConfirmAdiidb = () => {
    this.setState({ visibleConfirmAdiidb: false });
  };
  //删除选中的整编对象，有挂载在adiidb库中，确认删除
  handleOkConfirmAdiidb = () => {
    let urll;
    if (typeof window.getUrl == "function") {
      urll = window.getUrl() + "/api/LK-0313036/LK036";
    } else {
      urll = "http://192.168.0.107:8087";
    }
    axios({
      method: "get",
      url: urll + "/RadarInformationReorganize/deleteAtADIIDBandADRIDB",
      params: {
        //这个动态传进来的参数
        objectName: this.state.oneZBName
          ? this.state.oneZBName
          : this.state.selectedRows.join(",")
      }
    })
      .then(res => {
        if (res.data[0] == "1") {
          //返回值为1=>选中的雷达不在addidb库中，可以直接删除
          message.success(
            language[`deleteSuccess_${this.props.language.getlanguages}`]
          );
          this.props.dispatch({
            type: "radarModel/ClickQBZB",
            payload: {
              countryName: this.props.radarModel.seleleZBList_choise[0],
              publishStatus: this.props.radarModel.seleleZBList_choise[1],
              okPublishStatus: this.props.radarModel.seleleZBList_choise[2],
              modelName: "null"
            }
          });
          this.setState({
            visibleConfirmAdiidb: false,
            selectedRowKeys: [],
            // oneZBName: name
            oneZBName:this.state.oneZBName
          });
        } else {
          message.error(
            language[`operationFailed_${this.props.language.getlanguages}`]
          );
        }
      })
     .catch(error => {
        error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
      });
  };

  //点击编辑按钮
  getOneZBMsg = (text, name) => {
    let { dispatch } = this.props;
    dispatch({
      type: "radarModel/selectTargetModelMsg",
      payload: name,
      callback: res => {
        if (res.data[0] && res.data[0].sourceOfRadiationList) {
          this.props.dispatch({
            //将从目标库
            type: "radarModel/selectInsertFromTargetChartsMsg",
            payload: res.data[0].sourceOfRadiationList
          });
        }
      }
    });
  };

  onRef = ref => {
    this.child = ref;
  };
  deleteOneZBMsg = (text, name) => {
    let { dispatch } = this.props;
    dispatch({
      type: "radarModel/deleteZBColum",
      payload: {
        objectName: name
      },
      callback: res => {
        if (res.data[0] == 1) {
          message.success(
            language[`deleteSuccess_${this.props.language.getlanguages}`]
          );
          dispatch({
            type: "radarModel/ClickQBZB",
            payload: {
              countryName: this.props.radarModel.seleleZBList_choise[0],
              publishStatus: this.props.radarModel.seleleZBList_choise[1],
              okPublishStatus: this.props.radarModel.seleleZBList_choise[2],
              modelName: "null"
            }
          });
        } else if (res.data[0] == "0" || res.data[0] == "2") {
          message.warning(
            language[
              `radarAttachedElectronicTarget_${
                this.props.language.getlanguages
              }`
            ]
          );
        } else {
          message.error("删除失败！");
        }
      }
    });
    this.setState({
      selectedRowKeys: []
    });
  };
  changeIndex = () => {};

  changeCurrentPage = () => {
    this.setState({ currentpage: 1 });
  };
  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: (record, selected, selectedRows) => {
        var arr = [];
        for (var i = 0; i < selectedRows.length; i++) {
          arr.push(selectedRows[i].objectName);
        }
        this.setState({ selectedRows: arr });
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        if (selected == true) {
          let data = this.props.radarModel.ClickQBZB_Msg;
          let dataLength = data.length;
          var arr = [];
          for (var i = 0; i < data.length; i++) {
            arr.push(data[i].objectName);
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

    const columns = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "orderNumber",
        width: "5%"
      },
      {
        title: language[`ObjectName_${this.props.language.getlanguages}`],
        dataIndex: "objectName",
        ellipsis: true
      },
      {
        title: language[`radarType_${this.props.language.getlanguages}`],
        dataIndex: "modelName",
        ellipsis: true
      },
      {
        title: language[`countriesAndRegions_${this.props.language.getlanguages}`],
        dataIndex: "countryName",
        ellipsis: true
      },
      {
        title: language[`threatLevel_${this.props.language.getlanguages}`],
        dataIndex: "threadName",
        ellipsis: true
      },
      {
        title: language[`FriendOrFoeProperties_${this.props.language.getlanguages}`],
        dataIndex: "forName",
        ellipsis: true
      },
      {
        title: language[`publishStatus_${this.props.language.getlanguages}`],
        dataIndex: "publishStatus"
      },
      {
        title: language[`detailedInformation_${this.props.language.getlanguages}`],
        dataIndex: "",
        render: (text, record) => (
          <span>
            <Link to="/radarinformation?id=edit">
              <span onClick={() => this.getOneZBMsg(text, record.objectName)}>
                {language[`edit_${this.props.language.getlanguages}`]}
              </span>
            </Link>
            &nbsp;&nbsp;
            <Popconfirm
              title={language[`ConfirmDeleteMsg_${this.props.language.getlanguages}`]}
              cancelText={language[`cancel_${this.props.language.getlanguages}`]}
              okText={language[`confirm_${this.props.language.getlanguages}`]}
              className={styleless.popConfirm}
              // onConfirm={() => this.deleteOneZBMsg(text, record.objectName)}
              onConfirm={() => this.handleOkConfirm("one", record.objectName)}
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
    //model层的数据转换成table的dataSource
    let dataSourceZBList = [];
    if (this.props.radarModel.ClickQBZB_Msg) {
      let data = this.props.radarModel.ClickQBZB_Msg;
      let lanuageChange = ["zh", "en", "fr"];
      if (data && data.length) {
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < language.countryName.length; j++) {
            lanuageChange.map(value => {
              if (
                data[i].countryName == language.countryName[j][`name_${value}`]
              ) {
                data[i].countryName =
                  language.countryName[j][
                    `name_${this.props.language.getlanguages}`
                  ];
              }
            });
          }

          for (let j = 0; j < language.threadLevel.length; j++) {
            lanuageChange.map(value => {
              if (
                data[i].threadName == language.threadLevel[j][`name_${value}`]
              ) {
                data[i].threadName =
                  language.threadLevel[j][
                    `name_${this.props.language.getlanguages}`
                  ];
              }
            });
          }

          for (let j = 0; j < language.EnemyAndFoeAttributes.length; j++) {
            lanuageChange.map(value => {
              if (
                data[i].forName ==
                language.EnemyAndFoeAttributes[j][`name_${value}`]
              ) {
                data[i].forName =
                  language.EnemyAndFoeAttributes[j][
                    `name_${this.props.language.getlanguages}`
                  ];
              }
            });
          }

          if (
            data[i].publishStatus == language[`yes_zh`] ||
            data[i].publishStatus == language[`yes_fr`] ||
            data[i].publishStatus == language[`yes_en`]
          ) {
            data[i].publishStatus =language[`yes_${this.props.language.getlanguages}`];
          } else if (
            data[i].publishStatus == language[`no_zh`] ||
            data[i].publishStatus == language[`no_fr`] ||
            data[i].publishStatus == language[`no_en`]
          ) {
            data[i].publishStatus =language[`no_${this.props.language.getlanguages}`];
          }

          dataSourceZBList.push({
            orderNumber: i + 1,
            objectName: data[i].objectName,
            modelName: data[i].modelName,
            countryName: data[i].countryName,
            threadName: data[i].threadName,
            forName: data[i].forName,
            publishStatus: data[i].publishStatus
          });
        }
      }
    }
    let datalength = 0;
    if (this.props.radarModel.ClickQBZB_Msg) {
      datalength = this.props.radarModel.ClickQBZB_Msg.length;
    }

    return (
      <div className={style.material_wrap}>
        <div className={style.Side}>
          <SideBar changeCurrentPage={this.changeCurrentPage} />
        </div>
        <div className={style.Content}>
          {/* 整编管理 */}
          <div className={style.Fodder_title}>
            {language[`WholeObjectList_${this.props.language.getlanguages}`]}
          </div>
          <div style={{ padding: "0 10px" }}>
            {/* 创建整编对象 */}
            <Link to="/radarinformation?id=add">
              <Button type="primary">
                {language[`CreateAnIntegrationObject_${this.props.language.getlanguages}`]}
              </Button>
            </Link>
            {/* 删除选中的整编对象 */}
            <Button
              type="primary"
              onClick={this.deleteAll}
              style={{ float: "right" }}
              className={styleless.bgcolor}
            >
              {language[`DeletesTheSelectedIntegerObject_${this.props.language.getlanguages}`]}
            </Button>
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
                  id="ConfirmTips"
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
            <DialogConfirm
              visible={this.state.visibleConfirmAdiidb}
              index={1011}
              zIndex={1011}
              changeIndex={this.changeIndex}
              close={this.handleCancelConfirmAdiidb}
            >
              <div>
                <div
                  style={{
                    lineHeight: "25px",
                    marginBottom: "20px",
                    fontWeight: "bold"
                  }}
                  id="ConfirmTips"
                >
                  {language[`radar_in_target_database_${this.props.language.getlanguages}`]}
                </div>
                <div>
                  <Button
                    type="primary"
                    onClick={this.handleCancelConfirmAdiidb}
                  >
                    {language[`cancel_${this.props.language.getlanguages}`]}
                  </Button>
                  <Button
                    type="primary"
                    style={{ marginLeft: "10px" }}
                    onClick={this.handleOkConfirmAdiidb}
                  >
                    {language[`confirm_${this.props.language.getlanguages}`]}
                  </Button>
                </div>
              </div>
            </DialogConfirm>
          </div>

          <div className={style.TableContent_material}>
            <Table
              loading={this.props.loading.effects["radarModel/ClickQBZB"]}
              bordered
              rowKey={record => record.orderNumber}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={dataSourceZBList}
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
              {Math.ceil(
                this.props.radarModel.ClickQBZB_Msg &&
                this.props.radarModel.ClickQBZB_Msg.length
                  ? this.props.radarModel.ClickQBZB_Msg.length
                  : 0
              )}
              &nbsp;&nbsp;
              {language[`BarData_${this.props.language.getlanguages}`]}
            </span>
            ,{language[`current_${this.props.language.getlanguages}`]}
            {/* 每页显示15条数据 */}
            &nbsp;&nbsp;
            {this.state.currentpage}/
            {this.props.radarModel.ClickQBZB_Msg &&
            this.props.radarModel.ClickQBZB_Msg.length
              ? Math.ceil(this.props.radarModel.ClickQBZB_Msg.length / 15)
              : "1"}
            &nbsp;&nbsp;
            {language[`Page_${this.props.language.getlanguages}`]}
          </div>
        </div>
      </div>
    );
  }
}

@connect(({ language, radarModel }) => ({ language, radarModel }))
class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hiddenType: false,
      hiddenUnit: false,
      hiddenSend: false,
      country: "00",
      PublishState: false,
      NoPublishState: false,
      radarAllType: null,
      model: "-1"
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: "radarModel/selectRadarType",
      callback: res => {
        if (res.data[0]) {
          let data = res.data[0];
          this.setState({ radarAllType: data });
        }
      }
    });
  }

  componentWillUnmount() {
    //将选中的查询条件保存到model层
    this.props.dispatch({
      type: "radarModel/updata_ClickQBZB_selectMsg",
      payload: {
        countryName: "null",
        publishStatus: "null",
        okPublishStatus: "null",
        modelName: "null"
      }
    });
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

  //切换国家地区
  handleChange_GJDQ = value => {
    let momentValue = value;
    if (value === "00") {
      momentValue = "null";
    }
    this.setState({ country: momentValue });
  };

  //电子目标类型切换，查询对应的战技术参数
  selectTypeDetails = value => {
    let model = value;
    if (value === "-1") {
      model = "null";
    }
    this.setState({ model: model });
  };

  handleChangePublish = e => {
    this.setState({ PublishState: e.target.checked });
  };
  handleChangeNoPublish = e => {
    this.setState({ NoPublishState: e.target.checked });
  };
  // 点击查询按钮
  handleClickBtn = () => {
    this.props.changeCurrentPage();
    let { dispatch } = this.props;
    // 按条件查询整编对象
    dispatch({
      type: "radarModel/ClickQBZB",
      payload: {
        countryName: this.state.country === "00" ? "null" : this.state.country,
        publishStatus: this.state.NoPublishState === true ? "否" : "null",
        okPublishStatus: this.state.PublishState === true ? "是" : "null",
        modelName: this.state.model === "-1" ? "null" : this.state.model
      }
    });
    //将选中的查询条件保存到model层
    dispatch({
      type: "radarModel/updata_ClickQBZB_selectMsg",
      payload: {
        countryName: this.state.country === "00" ? "null" : this.state.country,
        publishStatus: this.state.NoPublishState === true ? "否" : "null",
        okPublishStatus: this.state.PublishState === true ? "是" : "null",
        modelName: this.state.model === "-1" ? "null" : this.state.model
      }
    });
  };

  sortBy_fr = propertyName => {
    return function(object1, object2) {
      var value1 = object1[propertyName];
      var value2 = object2[propertyName];
      if (value2 < value1) {
        return 1;
      } else if (value2 > value1) {
        return -1;
      } else {
        return 0;
      }
    };
  };

  sortBy_zh = propertyName => {
    return function(object1, object2) {
      var value1 = object1[propertyName];
      var value2 = object2[propertyName];
      return value1.localeCompare(value2, "zh");
    };
  };

  render() {
    const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
    const Option = Select.Option;
    return (
      <Fragment>
        {/* <Draggable handle="strong" {...dragHandlers}> */}
        <div className={style.Basic}>
          <strong>
            <div className={style.BasicFodder}>
              {language[`TargetScreening_${this.props.language.getlanguages}`]}
            </div>
          </strong>
          {/* 国家地区 */}
          <div className={style.FodderType}>
            <div
              className={style.FodderTypeTitle}
              onClick={this.handleClickSend}
            >
              {language[`countriesAndRegions_${this.props.language.getlanguages}`]}
            </div>
            <div
              className={style.FodderTypeChild}
              hidden={this.state.hiddenSend}
            >
              <div className={style.FodderTypeCountry}>
                {/* 国家地区 */}
                {/* { language[`countriesAndRegions_${this.props.language.getlanguages}`]==="国家地区"?<span style={{ marginRight: '10px' }}>{language[`countriesAndRegions_${this.props.language.getlanguages}`]}:</span>:"" } */}
                {/* <Select
                  defaultValue="00"
                  style={{ width: "150px" }}
                  className={styleless.country}
                  onChange={this.handleChange_GJDQ}
                >
                  <Option value="00">
                    --
                    {language[`DropdownSelection_${this.props.language.getlanguages}`]}
                    --
                  </Option>
                  {
                    this.props.language.countryName
                  }
                </Select> */}
                <Select
                showSearch
                optionFilterProp="children"
                style={{ width: "150px" }}
                className={styleless.country}
                onChange={this.handleChangeCountryName}
                filterOption={(input, option) =>
                  this.props.language.getlanguages==="zh"?
                  option.props.children.indexOf(input)>=0:
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                placeholder="Select a country"
              >
                {language.countryName.map((v, k) => (
                  <Option value={v.value} key={v.value}>
                    {v[`name_${this.props.language.getlanguages}`]}
                  </Option>
                ))}
              </Select>
              </div>
            </div>
          </div>
          {/* 平台型号 */}
          <div className={style.FodderType}>
            <div
              className={style.FodderTypeTitle}
              onClick={this.handleClickType}
            >
              {language[`radarType_${this.props.language.getlanguages}`]}
            </div>
            <div
              className={style.FodderTypeChild}
              hidden={this.state.hiddenType}
            >
              <div className={style.FodderTypeCountry}>
                <Select
                  defaultValue="-1"
                  style={{ width: "150px" }}
                  className={styleless.country}
                  onChange={this.selectTypeDetails}
                >
                  <Option value="-1">
                    --
                    {language[`DropdownSelection_${this.props.language.getlanguages}`]}
                    --
                  </Option>
                  {this.state.radarAllType
                    ? this.state.radarAllType.map(it => (
                        <Option key={it} value={it}>
                          {it}
                        </Option>
                      ))
                    : ""}
                </Select>
              </div>
            </div>
          </div>
          {/* 发布状态 */}
          <div className={style.FodderType}>
            <div
              className={style.FodderTypeTitle}
              onClick={this.handleClickUnit}
            >
              {language[`publishStatus_${this.props.language.getlanguages}`]}
            </div>
            <div
              className={style.FodderTypeChild}
              hidden={this.state.hiddenUnit}
            >
              <div className={style.checkStyle}>
                <Checkbox onChange={this.handleChangePublish}>
                  {language[`published_${this.props.language.getlanguages}`]}
                </Checkbox>
              </div>
              <div className={style.checkStyle}>
                <Checkbox onChange={this.handleChangeNoPublish}>
                  {language[`unpublished_${this.props.language.getlanguages}`]}
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
        {/* </Draggable> */}
      </Fragment>
    );
  }
}

RecordObject.propTypes = {};

export default RecordObject;
