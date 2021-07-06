import React, { Component, Fragment } from "react";
import {
  Radio,
  Checkbox,
  Table,
  Button,
  Select,
  Popconfirm,
  message
} from "antd";
import style from "./Radar.css";
import styleless from "./test.less";
import { Link } from "dva/router";
import DialogConfirm from "../../utils/DialogConfirmNoMask/Dialog";
import { connect } from "dva";
import language from "../language/language";

@connect(({ language, ElectronicTarget, loading }) => ({
  language,
  ElectronicTarget,
  loading
}))
class RecordObject extends Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    currentpage: 1,
    visibleConfirm: false,
    selectedRows: []
  };

  componentDidMount() {
    this.props.dispatch({
      type: "ElectronicTarget/selectZBList",
      payload: {
        countryName: "null",
        publishStatus: "null",
        okPublishStatus: "null",
        modelName: "null"
      }
    });
  }

  changePage = current => {
    //将当前的页数传递过来
    this.setState({
      currentpage: current
    });
  };

  // 删除
  deleteZBMsg = () => {
    if (this.state.selectedRowKeys.length === 0) {
      message.warning("请先选择");
    } else {
      this.setState({
        visibleConfirm: true
      });
    }
  };

  deleteOneZBMsg = (text, objectName) => {
    this.props.dispatch({
      type: "ElectronicTarget/deleteZBList",
      payload: {
        allObjectName: objectName
      },
      callback: res => {
        if (res.data[0] == "1") {
          message.success(
            language[`deleteSuccess_${this.props.language.getlanguages}`]
          );
          this.props.dispatch({
            type: "ElectronicTarget/selectZBList",
            payload: {
              countryName: "null",
              publishStatus: "null",
              okPublishStatus: "null",
              modelName: "null"
            }
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

  // 多选删除确认框中的确定
  handleOkConfirm = () => {
    this.props.dispatch({
      type: "ElectronicTarget/deleteZBList",
      payload: {
        allObjectName: this.state.selectedRows.join(",")
      },
      callback: res => {
        if (res.data[0] == "1") {
          message.success(
            language[`deleteSuccess_${this.props.language.getlanguages}`]
          );
          this.props.dispatch({
            type: "ElectronicTarget/selectZBList",
            payload: {
              countryName: "null",
              publishStatus: "null",
              okPublishStatus: "null",
              modelName: "null"
            }
          });
        }
      }
    });
    this.setState({
      visibleConfirm: false,
      selectedRowKeys: [],
      selectedRows: ""
    });
  };

  clickEditZBList = objectName => {
    this.props.dispatch({
      type: "ElectronicTarget/selectTargetModelMsg",
      payload: {
        objectName: objectName
      }
    });
  };
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  changeCurrentPage = () => {
    this.setState({ currentpage: 1 });
  };

  render() {
    //默认显示页数
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
          let data = this.props.ElectronicTarget.selectZBList_data;
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
    //整编对象列表
    const columns = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "orderNumber",
        width: "5%"
      },
      {
        title: language[`TargetName_${this.props.language.getlanguages}`],
        dataIndex: "objectName",
        ellipsis: true
      },
      {
        title: language[`PlatformModel_${this.props.language.getlanguages}`],
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
        render: (text, record) => (
          <span>
            <Link to="/target?id=edit">
              <span onClick={() => this.clickEditZBList(record.objectName)}>
                {language[`edit_${this.props.language.getlanguages}`]}
              </span>
            </Link>{" "}
            &nbsp;&nbsp;
            <Popconfirm
              title={language[`ConfirmDeleteMsg_${this.props.language.getlanguages}`]}
              cancelText={language[`cancel_${this.props.language.getlanguages}`]}
              okText={language[`confirm_${this.props.language.getlanguages}`]}
              className={styleless.popConfirm}
              onConfirm={() => this.deleteOneZBMsg(text, record.objectName)}
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
    if (this.props.ElectronicTarget.selectZBList_data) {
      datalength = this.props.ElectronicTarget.selectZBList_data.length;
    }
    //model层的数据转换成table的dataSource
    let dataSourceZBList = [];
    if (this.props.ElectronicTarget.selectZBList_data) {
      let data = this.props.ElectronicTarget.selectZBList_data;
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
    return (
      <div className={style.material_wrap}>
        <div className={style.Side}>
          <SideBar changeCurrentPage={this.changeCurrentPage} />
        </div>
        <div className={style.Content}>
          <div className={style.Fodder_title}>
            {/* 整编对象列表 */}
            {language[`WholeObjectList_${this.props.language.getlanguages}`]}
          </div>
          <div style={{ padding: "0 10px" }}>
            <Link to="/target?id=add">
              <Button type="primary" onClick={this.handleAdd}>
                {language[`CreateAnIntegrationObject_${this.props.language.getlanguages}`]}
              </Button>
            </Link>
            <Button
              type="primary"
              onClick={this.deleteZBMsg}
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
              loading={
                this.props.loading.effects["ElectronicTarget/selectZBList"]
              }
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

@connect(({ language, ElectronicTarget }) => ({ language, ElectronicTarget }))
class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hiddenType: false,
      hiddenUnit: false,
      hiddenSend: false,
      countryName: "00",
      PublishState: false,
      NoPublishState: false,
      model: "-1",
      targetAllType: null //电子目标的平台型号
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: "ElectronicTarget/selectTargetType",
      callback: res => {
        if (res.data[0]) {
          let data = res.data[0];
          this.setState({ targetAllType: data });
        }
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
  handleChangeCountryName = value => {
    this.setState({ countryName: value });
  };
  handleChangePublish = e => {
    this.setState({ PublishState: e.target.checked });
  };
  handleChangeNoPublish = e => {
    this.setState({ NoPublishState: e.target.checked });
  };
  //点击查询按钮
  selectZBListBtn = () => {
    this.props.changeCurrentPage();
    this.props.dispatch({
      type: "ElectronicTarget/selectZBList",
      payload: {
        countryName:
          this.state.countryName === "00" ? "null" : this.state.countryName,
        publishStatus: this.state.NoPublishState === true ? "否" : "null",
        okPublishStatus: this.state.PublishState === true ? "是" : "null",
        modelName: this.state.model === "-1" ? "null" : this.state.model
      }
    });
  };
  //切换平台型号
  selectTypeDetails = value => {
    let model = value;
    if (value === "-1") {
      model = "null";
    }
    this.setState({ model: model });
  };
  render() {
    const Option = Select.Option;
    return (
      <div className={style.Basic}>
        <div className={style.BasicFodder}>
          <strong>
            {language[`TargetScreening_${this.props.language.getlanguages}`]}
          </strong>
        </div>
        {/* 国家地区 */}
        <div className={style.FodderType}>
          {/* 国家地区 */}
          <div className={style.FodderTypeTitle} onClick={this.handleClickSend}>
            {
              language[`countriesAndRegions_${this.props.language.getlanguages}`
              ]
            }
          </div>
          <div className={style.FodderTypeChild} hidden={this.state.hiddenSend}>
            <div className={style.FodderTypeCountry}>
              {/* 国家地区 */}
              {/* { language[`countriesAndRegions_${this.props.language.getlanguages}`]==="国家地区"?<span style={{ marginRight: '10px' }}>{language[`countriesAndRegions_${this.props.language.getlanguages}`]}:</span>:"" } */}
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
          <div className={style.FodderTypeTitle} onClick={this.handleClickType}>
            {language[`PlatformModel_${this.props.language.getlanguages}`]}
          </div>
          <div className={style.FodderTypeChild} hidden={this.state.hiddenType}>
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
                {this.state.targetAllType
                  ? this.state.targetAllType.map(it => (
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
          <div className={style.FodderTypeTitle} onClick={this.handleClickUnit}>
            {language[`publishStatus_${this.props.language.getlanguages}`]}
          </div>
          <div className={style.FodderTypeChild} hidden={this.state.hiddenUnit}>
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
            onClick={this.selectZBListBtn}
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
