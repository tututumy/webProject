import React, { Component } from "react";
import style from "./Radar.css";
import styleless from "./test.less";
import { Select, Modal, Table, Button, message } from "antd";
import axios from "axios";
import language from "../language/language";
import { connect } from "dva";
import responseStatus from "../../utils/initCode"

const data = [];
for (let i = 0; i < 3; i++) {
  data.push({
    key: i,
    path: `AN/APG- ${i}基本情况`
  });
}
@connect(({ language }) => ({ language }))
export default class UploadFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ModalText: "Content of the modal",
      visible: false,
      confirmLoading: false,
      dataSource: [
        {
          datatime: this.props.datatime, //这里的this.props.datatime可直接在这里赋值，在这里赋的值为初始值，会显示在文本框中，下面同理
          applytype: this.props.applytype,
          applyproject: this.props.applyproject,
          money: this.props.money,
          operation: this.props.operation
        }
      ]
    };
  }

  //删除表格
  //删除
  handleDel = e => {
    const DelDataSource = this.state.data;
    DelDataSource.splice(e.target.getAttribute("data-index"), 1); //data-index为获取索引，后面的1为一次去除几行
    this.setState({
      data: DelDataSource
    });
  };

  // 显示上传文件弹窗
  showModal = e => {
    this.setState({
      visible: true
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  handleClick = () => {
    let file = document.getElementById("file").files[0]; //获取当前选中的文件
    let a = file.name; //获取当前选中的文件名
    let urll;
    if (typeof window.getUrl == "function") {
      urll = window.getUrl() + "/api/LK-0313036/LK036";
    } else {
      urll = "http://192.168.0.107:8087";
    }
    axios({
      method: "post",
      url: "http://192.168.1.102:8080/test/add",
      params: { a: a }
    })
      .then(res => {
        message.success("upload successfully.");
        this.setState({
          postsdata: res.data,
          datalength: res.data[0].length
        });
      })
      .catch(error => {
        error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
      });
  };

  render() {
    //模拟数据
    const columns = [
      {
        title: language[`number_${this.props.language.getlanguages}`],
        dataIndex: "key",
        render: (text, record, index) => {
          return <span>{index + 1}</span>; //索引从零开始，所以第一行为index+1，index为render方法里面的参数，可自动获取到下标，在ant design里面有详情解释，可参考
        }
      },
      {
        title: language[`SourceMaterialPath_${this.props.language.getlanguages}`],
        dataIndex: "path"
      },
      {
        title: language[`operation_${this.props.language.getlanguages}`],
        dataIndex: "operation",
        render: (text, record, index) =>
          data.length >= 1 ? (
            <a href="###" data-index={index} onClick={this.handleDel}>
              删除
            </a>
          ) : null
      }
    ];
    let { visible, confirmLoading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys
    };
    const Option = Select.Option;
    for (let i = 0; i < this.state.datalength; i++) {
      data.push({
        key: this.state.postsdata[0][i].material_id,
        name: this.state.postsdata[0][i].material_name
      });
    }

    return (
      <div className={style.PopUp}>
        <Button type="primary" onClick={this.showModal}>
          导入新素材
        </Button>
        <Modal
          title="Title"
          visible={visible}
          onOk={this.handleOk}
          OkText={
            language[`DetermineTheInput_${this.props.language.getlanguages}`]
          }
          cancelText={language[`quit_${this.props.language.getlanguages}`]}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          className={styleless.mypop}
        >
          <div className={style.popFodderType}>
            {/* 提供单位 */}
            <div className={style.popselect}>
              <span style={{ marginRight: "10px" }}>提供单位:</span>
              <Select defaultValue="lucy" style={{ width: 120 }}>
                <Option value="jack">
                  {language[`level_${this.props.language.getlanguages}`]}
                </Option>
                <Option value="lucy">
                  {language[`superior_${this.props.language.getlanguages}`]}
                </Option>
                <Option value="Yiminghe">友邻部队</Option>
              </Select>
            </div>
            {/* 格式类型 */}
            <div className={style.popselect}>
              <span style={{ marginRight: "10px" }}>格式类型:</span>
              <Select defaultValue="lucy" style={{ width: 120 }}>
                <Option value="jack">电子战斗序列情报</Option>
                <Option value="lucy">侦察活动报告</Option>
              </Select>
            </div>
            {/* 提供上传*/}
            <div className={style.popselectupload}>
              <Button type="primary" onClick={this.handleClick}>
                文件上传
              </Button>
            </div>
            {/*上传后的文件列表*/}
            <div className={style.uploadtable}>
              <Table
                columns={columns}
                dataSource={data}
                className={styleless.myClass}
                rowClassName={(record, index) =>
                  index % 2 === 0 ? styleless.odd : styleless.even
                } //奇偶行颜色交替变化
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
