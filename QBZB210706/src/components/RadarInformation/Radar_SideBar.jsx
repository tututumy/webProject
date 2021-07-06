/*
 * @Author: mikey.zhaopeng 
 * @Date: 2020-05-29 11:09:01 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: yyyy-08-Mo 09:09:24
 */

import React, { Component, Fragment } from "react";
import {
  Checkbox,
  Table,
  Select,
  Button,
  Upload,
  message,
  Popconfirm,
  Tooltip
} from "antd";
import axios from "axios";
import { connect } from "dva";
import PropTypes from "prop-types";
import Dialog from "../../utils/DialogMask/Dialog";
import DialogDrag from "../../utils/DialogDrag/Dialog";
import DialogConfirm from "../../utils/DialogConfirmNoMask/Dialog";
import language from "../language/language";
import style from "./Radar.css";
import styleless from "./test.less";
import ViewNew from "./ViewNew";
import "../../index.less";
import responseStatus from "../../utils/initCode";

const fodderdataSource = [];
@connect(({ radarModel }) => ({ radarModel }))

// 整个页面
class Fodder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      a: 1,
      b: 1,
      c: 1,
      d: 1,
      e: 1,
      f: 1,
      g: 1,
      h: 0,
      MarkSideBar: false
    };
  }

  UNSAFE_componentWillReceiveProps(nextprops) {
    this.setState({ MarkSideBar: nextprops.radarModel.MarkSideBar });
  }
  handleclicka = msg => {
    this.setState({
      a: msg
    });
  };
  getChildData = res => {
    this.setState({
      msg: res
    });
  };
  render() {
    let component = null;
    let markLeft = true;
    var strmsg = window.location.href;
    var strmsgg = strmsg.substr(
      strmsg.indexOf("?") + 1,
      strmsg.length - strmsg.indexOf("?")
    );
    //获取所传参数的值
    var hrefid = strmsgg.substr(
      strmsgg.indexOf("=") + 1,
      strmsgg.length - strmsgg.indexOf("=")
    );
    //转码，防止编码错误
    hrefid = decodeURIComponent(hrefid);
    if (hrefid === "view") {
      // 查看侦察信号文件，data为点击查看的时候后端返回的值，这里传进去给ViewNew组件使用赋值
      component = <ViewNew data={this.props.radarModel.ZCSignMsg_data} />;
      markLeft = false;
    } else {
      component = <FodderContent />;
    }
    return (
      <div className={style.material_wrap}>
        <div className={style.Side}>
          <SideBar />
        </div>
        <div>{component}</div>
      </div>
    );
  }
}

let allFilesLength = 0; //上传文件个数
let showMsg = false;
@connect(({ fodder, table, language, radarModel, loading }) => ({
  fodder,
  table,
  language,
  radarModel,
  loading
}))
class FodderContent extends Component {
  // 右侧内容部分
  static contextTypes = {
    router: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      visible: false,
      childrenDrawer: false,
      currentpage: 1,
      getdata: [],
      getdatas: [],
      datalength: "",
      dataSource: [],
      dataSource1: [],
      unit: "上级",
      form: "网页",
      dataList: false,
      a: 1,
      b: 1,
      c: 1,
      d: 1,
      e: 1,
      f: 1,
      g: 1,
      h: 0,
      deleteMark: false,
      push: false,

      LookImg: false,
      LookVideo: false,
      LookDoc: false,
      LookHTML: false,
      LookZCDetail: false,
      visibleConfirm: false,
      selectedRows: "",
      imgSrc: "",
      fileFormat: ".html",
      uploadMsglength: 0,
      fileList: [], //上传的素材
      uploadLoadingMark: false //文件上传过程中表格处于loading状态
    };
  }

  //生命周期钩子，组件挂载到DOM树上的时候调用axios获取表格数据，取出后端给的值，展示到页面
  componentDidMount() {
    this.props.dispatch({
      type: "fodder/selectAllMaterical",
      payload: {
        fileType: "radar",
        a: 1,
        b: 1,
        c: 1,
        d: 1,
        e: 1,
        f: 1,
        g: 1,
        h: 0
      }
    });
  }

  UNSAFE_componentWillReceiveProps({ fodder }) {
    if (fodder.clickMark) {
      this.setState({
        currentpage: 1
      });
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: "fodder/updateChoose",
      payload: {
        a: 1,
        b: 1,
        c: 1,
        d: 1,
        e: 1,
        f: 1,
        g: 1,
        h: 0
      }
    });
    //清除后端的缓存文件夹中的素材文件
    this.clearMatericalCache();
  }

  clearMatericalCache = () => {
    let urll;
    if (typeof window.getUrl == "function") {
      urll = window.getUrl() + "/api/LK-0313036/LK036";
    } else {
      urll = "http://192.168.0.107:8087";
    }
    axios({
      method: "get",
      url: urll + "/radarInformation/backMaterial"
    })
      .then(res => {
        this.setState({ dataSource: [] });
      })
      .catch(error => {
        error.response !== undefined
          ? responseStatus(error.response.status)
          : message.error(`error: ${error}`);
      });
  };

  start = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false
      });
    }, 1000);
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  handleAdd = () => {
    this.setState({
      visible: true
    });
  };

  //点击确定录入
  handleOk = () => {
    allFilesLength = 0;
    this.setState({ uploadMsglength: 0 });
    let id = [];
    if (this.state.dataSource.length == 0) {
      message.warning(
        language[`noMaterialDataTips_${this.props.language.getlanguages}`]
      );
    } else {
      for (let i = 1; i <= this.state.uploadMsglength; i++) {
        id.push({ value: i });
      }
      let urll;
      if (typeof window.getUrl == "function") {
        urll = window.getUrl() + "/api/LK-0313036/LK036";
      } else {
        urll = "http://192.168.0.107:8087";
      }
      axios({
        method: "post",
        url: urll + "/radarInformation/goXML",
        params: {
          reorType: "radar",
          source: this.state.unit,
          type: this.state.form
        }
      })
        .then(res => {
          this.setState({ dataSource: [], visible: false });
          let a = this.props.fodder.a;
          let b = this.props.fodder.b;
          let c = this.props.fodder.c;
          let d = this.props.fodder.d;
          let e = this.props.fodder.e;
          let f = this.props.fodder.f;
          let g = this.props.fodder.g;
          this.props.dispatch({
            type: "fodder/selectAllMaterical",
            payload: {
              fileType: "radar",
              a: a,
              b: b,
              c: c,
              d: d,
              e: e,
              f: f,
              g: g,
              h: 0
            }
          });
        })
        .catch(error => {
          error.response !== undefined
            ? responseStatus(error.response.status)
            : message.error(`error: ${error}`);
        });
    }
  };

  handleCancel = () => {
    allFilesLength = 0;
    this.setState({
      visible: false,
      uploadMsglength: 0
    });
    let urll;
    if (typeof window.getUrl == "function") {
      urll = window.getUrl() + "/api/LK-0313036/LK036";
    } else {
      urll = "http://192.168.0.107:8087";
    }
    axios({
      method: "get",
      url: urll + "/radarInformation/backMaterial"
    })
      .then(res => {
        this.setState({ dataSource: [] });
      })
      .catch(error => {
        error.response !== undefined
          ? responseStatus(error.response.status)
          : message.error(`error: ${error}`);
      });
  };

  changePage = current => {
    //将当前的页数传递过来
    this.setState({
      currentpage: current
    });
  };

  filerName = (url) => {
    // 提取下载的文件名
    let a = url.split('/');
    return a[a.length - 1];
  }

  //点击查看素材
  handleClickLook = (key, name, type) => {
    var str = "";
    str = key + "," + name;
    let routerMsg;
    if (typeof window.getUrl == "function") {
      routerMsg = window.getUrl() + "/api";
    } else {
      routerMsg = "http://192.168.0.107:8087";
    }
    if (type === language[`webPage_${this.props.language.getlanguages}`]) {
      let urll;
      if (typeof window.getUrl == "function") {
        urll = window.getUrl() + "/api/LK-0313036/LK036";
      } else {
        urll = "http://192.168.0.107:8087";
      }
      axios({
        method: "post",
        url: urll + "/radarInformation/watchFile",
        params: { fileName: str, ip: this.props.language.showMaterialIp }
      })
        .then(res => {
          window.open(routerMsg + res.data[0], "_blank");
          // this.setState({ LookHTML: true }, () => {
          //   document.getElementById("HTMLBox").src = routerMsg + res.data[0];
          // });
        })
        .catch(error => {
          error.response !== undefined
            ? responseStatus(error.response.status)
            : message.error(`error: ${error}`);
        });
    } else if (
      type === language[`picture_${this.props.language.getlanguages}`]
    ) {
      let urll;
      if (typeof window.getUrl == "function") {
        urll = window.getUrl() + "/api/LK-0313036/LK036";
      } else {
        urll = "http://192.168.0.107:8087";
      }
      axios({
        method: "post",
        url: urll + "/radarInformation/watchFile",
        params: { fileName: str, ip: this.props.language.showMaterialIp }
      })
        .then(res => {
          this.setState({ LookImg: true }, () => {
            document.getElementById("showImg").src = routerMsg + res.data[0];
          });
        })
        .catch(error => {
          error.response !== undefined
            ? responseStatus(error.response.status)
            : message.error(`error: ${error}`);
        });
    } else if (type === language[`video_${this.props.language.getlanguages}`]) {
      let urll;
      if (typeof window.getUrl == "function") {
        urll = window.getUrl() + "/api/LK-0313036/LK036";
      } else {
        urll = "http://192.168.0.107:8087";
      }
      axios({
        method: "post",
        url: urll + "/radarInformation/watchFile",
        params: { fileName: str, ip: this.props.language.showMaterialIp }
      }).then(res => {
        this.setState({ LookVideo: true }, () => {
          document.getElementById("my_video").src = routerMsg + res.data[0];
          document.getElementById("my_video").play();
        });
      })
      .catch(error => {
        error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
      });
    } else if (
      type === language[`document_${this.props.language.getlanguages}`]
    ) {
      let urll;
      if (typeof window.getUrl == "function") {
        urll = window.getUrl() + "/api/LK-0313036/LK036";
      } else {
        urll = "http://192.168.0.107:8087";
      }
      axios({
        method: "post",
        url: urll + "/radarInformation/watchFile",
        params: { fileName: str, ip: this.props.language.showMaterialIp }
      })
        .then(res => {
          window.open(routerMsg + res.data[0], "_blank");
          // this.setState({ LookDoc: true }, () => {
          //   document.getElementById("DocBox").src = routerMsg + res.data[0];
          // });
        })
        .catch(error => {
          error.response !== undefined
            ? responseStatus(error.response.status)
            : message.error(`error: ${error}`);
        });
    } else if (
      type === language[`ReconnaissanceSignalData_${this.props.language.getlanguages}`]
    ) {
      this.setState({ loading: true });
      let urll;
      if (typeof window.getUrl == "function") {
        urll = window.getUrl() + "/api/LK-0313036/LK036";
      } else {
        urll = "http://192.168.0.107:8087";
      }
      axios({
        method: "post",
        url: urll + "/radarInformation/watchFile",
        params: { fileName: str, ip: this.props.language.showMaterialIp }
      })
        .then(res => {
          if (res) {
            this.setState({ LookZCDetail: true, loading: false });
            this.props.dispatch({
              type: "radarModel/ZCSignMsg",
              payload: res.data[0][0]
            });
          }
        })
        .catch(error => {
          error.response !== undefined
            ? responseStatus(error.response.status)
            : message.error(`error: ${error}`);
        });
    }
  };

  handleCancelLookImg = () => {
    this.setState({
      LookImg: false
    });
  };
  handleCancelLookVideo = () => {
    this.setState({
      LookVideo: false
    });
    document.getElementById("my_video").pause();
  };
  handleCancelLookDoc = () => {
    this.setState({
      LookDoc: false
    });
  };
  handleCancelLookHTML = () => {
    this.setState({
      LookHTML: false
    });
  };

  handleCancelLookZCDetail = () => {
    this.setState({
      LookZCDetail: false
    });
  };

  //文件上传之前的函数
  beforeUpload = (file, fileList) => {
    console.log("file====", file);
    console.log("fileList====", fileList);
    // if(fileList.length>10){
    //   message.warning("最多同时选择10条")
    //   return false;
    // }

    // 如果上传的文件和选定的类型不一致，不允许上传
    let type = this.state.fileFormat;
    let arr = type.split(","); //arr为存放指定的文件类型

    let index = file.name.lastIndexOf("."); //最后一个小数点出现的位置
    let HZ = file.name.slice(index, file.name.length); //截取后缀名

    let fileFormatCount = 0;
    for (var i = 0; i < arr.length; i++) {
      if (HZ === arr[i]) {
        fileFormatCount++;
      }
    }
    if (fileFormatCount == 0) {
      message.warning(`${file.name}${language[`typeMismatch_${this.props.language.getlanguages}`]}`);
      return false;
    }

    //判断当前导入到弹出框中的列表是否有重复
    let data = this.state.dataSource;
    console.log("data========", data)
    for (let i = 0; i < data.length; i++) {
      if (file.name == data[i].name) {
        message.warning(`${file.name}${language[`Uploaded_cannot_upload_repeatedly_${this.props.language.getlanguages}`]}`);
        return false;
      }
    }

    //判断文件大小
    const isLt100M = file.size / 1024 / 1024 < 100;
    if (!isLt100M) {
      message.warning(file.name + language[`Picture_size_out_of_limit_${this.props.language.getlanguages}`]);
      return isLt100M;
    }
    const isLength = this.isLength();
    const isRepeatName = this.isRepeatName(file);
    return isLt100M && isRepeatName && isLength;
  };

  isRepeatName = file => {
    let msg = `${file.name}${language[`Uploaded_cannot_upload_repeatedly_${this.props.language.getlanguages}`]}`;
    let data = this.props.fodder.AllMatericalData;
    if (data && data.length != 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].fileName === file.name) {
          message.warning(msg)
          return false;
        }
      }
    }
  };

  isLength = () => {
    if (allFilesLength < 10) {
      allFilesLength++;
      return true;
    } else {
      if (showMsg == false) {
        message.warning(
          language[`UpTo10Uploads_${this.props.language.getlanguages}`]
        );
        showMsg = true;
      }
      return false;
    }
  };

  clearbeforeUploadCounter = () => {
    showMsg = false;
  };

  //点击文件上传按钮
  handleChange = info => {
    this.setState({ fileList: info.fileList });
    let arr = [];
    if (info.file.status === "uploading") {
      document.getElementById("makeSureUpload").disabled = "disabled";
      this.setState({ uploadLoadingMark: true });
    } else {
      document.getElementById("makeSureUpload").disabled = false;
      this.setState({ uploadLoadingMark: false });
    }
    if (info.file.status === "done") {
      if (info.file.response[0].length) {
        for (var i = 0; i < info.file.response[0].length; i++) {
          arr.push({
            key: i + 1,
            name: info.file.response[0][i]
          });
        }
      }
      this.setState({
        uploadMsglength: info.file.response[0].length,
        dataSource: arr
      });
      fodderdataSource.push({
        name: `${info.file.name}`
      });
      message.success(
        `${info.file.name.slice(0, 15) + "..."}${
        language[`uploadSuccess_${this.props.language.getlanguages}`]
        }`
      );
    } else if (info.file.status === "error") {
      message.error(
        `${info.file.name.slice(0, 15) + "..."}${
        language[`UploadFailure_${this.props.language.getlanguages}`]
        }`
      );
    }
  };

  //模态框里上传文件得删除
  handleClickDel = (text, key, name) => {
    let urll;
    if (typeof window.getUrl == "function") {
      urll = window.getUrl() + "/api/LK-0313036/LK036";
    } else {
      urll = "http://192.168.0.107:8087";
    }
    axios({
      method: "post",
      url: urll + "/radarInformation/deleteFile",
      params: { name: name }
    })
      .then(res => {
        const dataSource = [...this.state.dataSource];
        this.setState({
          dataSource: dataSource.filter(item => item.name !== name)
        });
        allFilesLength--; //上传到模态框的数量-1
      })
      .catch(error => {
        error.response !== undefined
          ? responseStatus(error.response.status)
          : message.error(`error: ${error}`);
      });
  };

  //页面上的删除  单选删除
  handleClickDelete = fileId => {
    this.props.dispatch({
      type: "fodder/deleteMaterial",
      payload: fileId,
      callback: res => {
        if (res.data == "0") {
          message.warning(
            language[`materialUsedNoDelete_${this.props.language.getlanguages}`]
          );
        } else {
          message.success(
            language[
            `MaterialDeletedSuccessfully_${this.props.language.getlanguages}`
            ]
          );
          this.setState({ selectedRows: "" });
          let a = this.props.fodder.a;
          let b = this.props.fodder.b;
          let c = this.props.fodder.c;
          let d = this.props.fodder.d;
          let e = this.props.fodder.e;
          let f = this.props.fodder.f;
          let g = this.props.fodder.g;
          this.props.dispatch({
            type: "fodder/selectAllMaterical",
            payload: {
              fileType: "radar",
              a: a,
              b: b,
              c: c,
              d: d,
              e: e,
              f: f,
              g: g,
              h: 0
            }
          });
        }
      }
    });
    this.state.deleteMark = true;
  };

  //素材来源
  chooseUnit = value => {
    this.setState({ unit: `${value}` });
  };
  //选择素材类型
  chooseForm = value => {
    this.setState({ form: `${value}` });
    if (value === "图片") {
      this.setState({ fileFormat: ".png,.jpg,.jpeg" });
    } else if (value === "视频") {
      this.setState({ fileFormat: ".mp4" });
    } else if (value === "文档") {
      this.setState({ fileFormat: ".pdf" });
    } else if (value === "网页") {
      this.setState({ fileFormat: ".html" });
    } else if (value === "侦察信号数据") {
      this.setState({ fileFormat: ".json" });
    }
  };

  // 多选删除
  deleteAll = () => {
    if (this.state.selectedRowKeys.length === 0) {
      message.warning(
        language[
        `PleaseSelectTheMaterialFirst_${this.props.language.getlanguages}`
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

  //删除选中的素材，再二次确认弹出框中点击确定删除数据，复选框勾选删除
  handleOkConfirm = () => {
    let urll;
    if (typeof window.getUrl == "function") {
      urll = window.getUrl() + "/api/LK-0313036/LK036";
    } else {
      urll = "http://192.168.0.107:8087";
    }
    this.props.dispatch({
      type: "fodder/deleteMaterials",
      payload: {
        listAll: this.state.selectedRows
      },
      callback: res => {
        if (res.data == "0") {
          message.warning(
            language[`materialUsedNoDelete_${this.props.language.getlanguages}`]
          );
        } else {
          message.success(
            language[
            `MaterialDeletedSuccessfully_${this.props.language.getlanguages}`
            ]
          );
          this.setState({ selectedRows: "" });
          let a = this.props.fodder.a;
          let b = this.props.fodder.b;
          let c = this.props.fodder.c;
          let d = this.props.fodder.d;
          let e = this.props.fodder.e;
          let f = this.props.fodder.f;
          let g = this.props.fodder.g;
          this.props.dispatch({
            type: "fodder/selectAllMaterical",
            payload: {
              fileType: "radar",
              a: a,
              b: b,
              c: c,
              d: d,
              e: e,
              f: f,
              g: g,
              h: 0
            }
          });
        }
        this.setState({
          visibleConfirm: false,
          selectedRowKeys: []
        });
      }
    });
  };

  //图片的滚轮缩放
  handleZoom = e => {
    let { clientWidth, clientHeight, style } = this.refs.zoomImg;
    if (e.nativeEvent.deltaY <= 0 && clientWidth < 1400 && clientHeight < 900) {
      style.width = clientWidth + 15 + "px"; //图片宽度每次增加10
      style.left = style.left - (1 % +"px"); //随你设置
    } else if (e.nativeEvent.deltaY > 0) {
      if (clientWidth > 400) {
        style.width = clientWidth - 15 + "px"; //图片宽度
        style.left = style.left + (1 % +"px");
      } else {
        style.left = 0;
      }
    }
  };

  changeIndex = () => { };
  render() {
    const Option = Select.Option;
    const columns = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key",
        width: "5%",
      },
      {
        title:
          <Tooltip placement='top' title={language[`materialNumber_${this.props.language.getlanguages}`]}>
            {language[`materialNumber_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "num",
        width: "15%",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`materialName_${this.props.language.getlanguages}`]}>
            {language[`materialName_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "name",
        width: "13%",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`MaterialSource_${this.props.language.getlanguages}`]}>
            {language[`MaterialSource_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "unit",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`MaterialType_${this.props.language.getlanguages}`]}>
            {language[`MaterialType_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "type",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`MaterialGenerationTime_${this.props.language.getlanguages}`]}>
            {language[`MaterialGenerationTime_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "datatime",
        width: "15%",
        ellipsis: true
      },
      {
        title:
          <Tooltip placement='top' title={language[`InformationsViewer_${this.props.language.getlanguages}`]}>
            {language[`InformationsViewer_${this.props.language.getlanguages}`]}
          </Tooltip>,
        dataIndex: "",
        width: "15%",
        render: (text, record) => (
          <a
            onClick={() =>
              this.handleClickLook(record.num, record.name, record.type)
            }
          >
            {language[`lookOver_${this.props.language.getlanguages}`]}
          </a>
        ),
        ellipsis: true
      },
      {
        title: language[`delete_${this.props.language.getlanguages}`],
        dataIndex: "",
        render: (text, record) => (
          <Popconfirm
            title={
              language[`ConfirmDeleteMsg_${this.props.language.getlanguages}`]
            }
            cancelText={language[`cancel_${this.props.language.getlanguages}`]}
            okText={language[`confirm_${this.props.language.getlanguages}`]}
            className={styleless.popConfirm}
            onConfirm={() => this.handleClickDelete(record.num)}
          >
            <a>{language[`delete_${this.props.language.getlanguages}`]}</a>
          </Popconfirm>
        ),
        ellipsis: true
      }
    ];
    const foddercolumn = [
      {
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`materialName_${this.props.language.getlanguages}`],
        dataIndex: "name",
        ellipsis: true,
        render(text, record) {
          return <span title={text}>{text}</span>;
        }
      },
      {
        title: language[`operation_${this.props.language.getlanguages}`],
        dataIndex: "delete",
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm
              title={language[`ConfirmDeleteMsg_${this.props.language.getlanguages}`]}
              cancelText={language[`cancel_${this.props.language.getlanguages}`]}
              okText={language[`confirm_${this.props.language.getlanguages}`]}
              className={styleless.popConfirm}
              onConfirm={() =>
                this.handleClickDel(text, record.key, record.name)
              }
            >
              <a>{language[`delete_${this.props.language.getlanguages}`]}</a>
            </Popconfirm>
          ) : null
      }
    ];

    //默认显示页数
    const paginationProps = {
      pageSize: 5
    };
    const datalength = this.state.datalength;
    const { selectedRowKeys } = this.state;

    //文件上传按钮的部分代码
    let urll;
    if (typeof window.getUrl == "function") {
      urll = window.getUrl() + "/api/LK-0313036/LK036";
    } else {
      urll = "http://192.168.0.107:8087";
    }
    const props = {
      name: "file",
      action: urll + "/radarInformation/myTestUpload",
      headers: {
        authorization: "authorization-text"
      },
      multiple: true,
      showUploadList: false,
      onChange: this.handleChange,
      beforeUpload: this.beforeUpload
    };

    //所有的素材文件数据赋值
    let AllMatericalData = [];
    let dataSourcelength = 0;
    if (this.props.fodder.AllMatericalData) {
      let data = this.props.fodder.AllMatericalData;
      dataSourcelength = this.props.fodder.AllMatericalData.length;
      let source;
      let type;
      for (let i = 0; i < data.length; i++) {
        if (
          data[i].source === "上级" ||
          data[i].source ===
          language[`superior_${this.props.language.getlanguages}`]
        ) {
          source = language[`superior_${this.props.language.getlanguages}`];
        } else if (
          data[i].source === "本级" ||
          data[i].source ==
          language[`level_${this.props.language.getlanguages}`]
        ) {
          source = language[`level_${this.props.language.getlanguages}`];
        } else if (
          data[i].source === "其他" ||
          data[i].source ==
          language[`other_${this.props.language.getlanguages}`]
        ) {
          source = language[`other_${this.props.language.getlanguages}`];
        }
        if (
          data[i].type === "网页" ||
          data[i].type ==
          language[`webPage_${this.props.language.getlanguages}`]
        ) {
          type = language[`webPage_${this.props.language.getlanguages}`];
        } else if (
          data[i].type === "图片" ||
          data[i].type ==
          language[`picture_${this.props.language.getlanguages}`]
        ) {
          type = language[`picture_${this.props.language.getlanguages}`];
        } else if (
          data[i].type === "视频" ||
          data[i].type == language[`video_${this.props.language.getlanguages}`]
        ) {
          type = language[`video_${this.props.language.getlanguages}`];
        } else if (
          data[i].type === "文档" ||
          data[i].type ==
          language[`document_${this.props.language.getlanguages}`]
        ) {
          type = language[`document_${this.props.language.getlanguages}`];
        } else if (
          data[i].type === "侦察信号数据" ||
          data[i].type == language[`ReconnaissanceSignalData_${this.props.language.getlanguages}`
          ]
        ) {
          type =
            language[
            `ReconnaissanceSignalData_${this.props.language.getlanguages}`
            ];
        }
        AllMatericalData.push({
          key: i + 1,
          num: data[i].fileId,
          name: data[i].fileName,
          unit: source,
          type: type,
          datatime: data[i].time
        });
      }
    }

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: (record, selected, selectedRows) => {
        var arr = [];
        for (var i = 0; i < selectedRows.length; i++) {
          arr.push(selectedRows[i].num);
        }
        this.setState({ selectedRows: arr });
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        if (selected == true) {
          var arr = [];
          for (var i = 0; i < AllMatericalData.length; i++) {
            arr.push(AllMatericalData[i].num);
          }
          let dataLength = AllMatericalData.length;
          this.setState({
            selectedRowKeys: [...Array(dataLength + 1).keys()],
            selectedRows: arr
          });
        } else {
          this.setState({
            selectedRowKeys: [],
            selectedRows: ""
          });
        }
      }
    };

    let uploadDataSource = [];
    if (this.state.dataSource) {
      let data = this.state.dataSource;
      for (let i = 0; i < data.length; i++) {
        uploadDataSource.push({
          key: i + 1,
          name: data[i].name
        });
      }
    }

    return (
      <Fragment>
        {/* 素材管理 */}
        <div className={style.Content}>
          <div className={style.Fodder_title}>
            {language[`materialManagement_${this.props.language.getlanguages}`]}
          </div>
          <div
            style={{ padding: "0 10px" }}
            className={styleless.change_antd_style}
          >
            {/* 导入新素材 */}
            <Button onClick={this.handleAdd} type="primary">
              {language[`importRecentFootage_${this.props.language.getlanguages}`]}
            </Button>
            <Button
              type="primary"
              onClick={this.deleteAll}
              style={{ float: "right" }}
            >
              {language[`DeleteSelectedMaterial_${this.props.language.getlanguages}`]}
            </Button>
            <DialogDrag
              visible={this.state.visible}
              title={language[`importRecentFootage_${this.props.language.getlanguages}`]}
              close={this.handleCancel}
              TOTOP={95}
            >
              <div className={style.popFodderType}>
                {/* 素材来源 */}
                <div className={style.title_wrapper}>
                  <div className={style.popselect}>
                    <span style={{ marginRight: "10px" }}>
                      {language[`MaterialSource_${this.props.language.getlanguages}`]}
                      :
                    </span>
                    <Select
                      defaultValue={this.state.unit}
                      style={{ width: 200 }}
                      onChange={this.chooseUnit}
                    >
                      <Option value="本级">
                        {language[`level_${this.props.language.getlanguages}`]}
                      </Option>
                      <Option value="上级">
                        {language[`superior_${this.props.language.getlanguages}`]}
                      </Option>
                      {/* <Option value="其他">{language[`other_${this.props.language.getlanguages}`]}</Option> */}
                    </Select>
                  </div>
                  {/* 素材类型 */}
                  <div className={style.popselect}>
                    <span style={{ marginRight: "10px" }}>
                      {language[`MaterialType_${this.props.language.getlanguages}`]}
                      :
                    </span>
                    <Select
                      defaultValue={this.state.form}
                      style={{ width: 240, marginRight: 20 }}
                      onChange={this.chooseForm}
                      disabled={this.state.uploadMsglength > 0 ? true : false}
                    >
                      <Option value="网页">
                        {language[`webPage_${this.props.language.getlanguages}`]}
                      </Option>
                      <Option value="图片">
                        {language[`picture_${this.props.language.getlanguages}`]}
                      </Option>
                      <Option value="视频">
                        {language[`video_${this.props.language.getlanguages}`]}
                      </Option>
                      <Option value="文档">
                        {language[`document_${this.props.language.getlanguages}`]}
                      </Option>
                      <Option value="侦察信号数据">
                        {language[`ReconnaissanceSignalData_${
                          this.props.language.getlanguages
                          }`
                        ]
                        }
                      </Option>
                    </Select>
                  </div>
                  {/* 提供上传*/}
                  <div className={style.upload_Btn}>
                    {/* accept限制上传的文件格式 */}
                    <Upload {...props} accept={this.state.fileFormat}>
                      <Button
                        type="primary"
                        onClick={this.clearbeforeUploadCounter}
                      >
                        {language[`filesUpload_${this.props.language.getlanguages}`]}
                      </Button>
                    </Upload>
                  </div>
                </div>

                {/*上传后的文件列表*/}
                <div className={style.uploadtable}>
                  <Table
                    loading={this.state.uploadLoadingMark}
                    columns={foddercolumn}
                    dataSource={uploadDataSource}
                    className={styleless.myClass}
                    rowClassName={(record, index) =>
                      index % 2 === 0 ? styleless.odd : styleless.even
                    } //奇偶行颜色交替变化
                    pagination={paginationProps}
                  />
                </div>
                <div className={style.btnBox}>
                  <Button type="primary" onClick={this.handleCancel}>
                    {language[`quit_${this.props.language.getlanguages}`]}
                  </Button>
                  <Button
                    type="primary"
                    className={style.marksure}
                    id="makeSureUpload"
                    onClick={this.handleOk}
                  >
                    {language[`MakeSureImport_${this.props.language.getlanguages}`]}
                  </Button>
                </div>
              </div>
            </DialogDrag>

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
          {/* 文件列表 */}
          <div className={style.TableContent_material}>
            <Table
              loading={
                this.props.loading.effects["fodder/selectAllMaterical"] ||
                this.state.loading
              }
              bordered
              rowKey={record => record.key}
              columns={columns}
              dataSource={AllMatericalData}
              rowSelection={rowSelection}
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
              {dataSourcelength}
              &nbsp;&nbsp;
              {language[`BarData_${this.props.language.getlanguages}`]}
            </span>
            ,{/* 每页显示15条数据 */}
            {language[`current_${this.props.language.getlanguages}`]}
            &nbsp;&nbsp;
            {this.state.currentpage > Math.ceil(dataSourcelength / 15)
              ? "1"
              : this.state.currentpage}
            /{Math.ceil(dataSourcelength / 15)}
            &nbsp;&nbsp;
            {language[`Page_${this.props.language.getlanguages}`]}
          </div>

          {/* 点击信息查看应该弹出的对应内容 */}
          {/* 图片 */}
          {this.state.LookImg ? (
            <Dialog
              BodyContent={
                <div className={style.popFodderTypeImg}>
                  {/*上传后的文件列表*/}
                  <div className={style.uploadtableImg}>
                    <div
                      style={{
                        minWidth: "300px",
                        maxWidth: "1500px",
                        minHeight: "300px",
                        maxHeight: "800px",
                        overflow: "hidden",
                        position: "relative"
                      }}
                    >
                      <div id="imgBox">
                        <img
                          src=""
                          ref="zoomImg"
                          style={{ width: "600px", float: "left" }}
                          onWheel={this.handleZoom}
                          alt=""
                          id="showImg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              }
              showDialog={this.state.LookImg}
              showMask
              // bHeight="400px"
              TitleText={language[`viewPicture_${this.props.language.getlanguages}`]}
              okText={language[`confirm_${this.props.language.getlanguages}`]}
              CancleText={language[`cancel_${this.props.language.getlanguages}`]}
              onCancel={this.handleCancelLookImg}
              onOk={this.handleOk}
              className={styleless.basicpop}
            />
          ) : null}

          {/* 视频 */}
          {this.state.LookVideo ? (
            <Dialog
              BodyContent={
                <div className={style.popFodderType}>
                  {/*上传后的文件列表*/}
                  <div className={style.uploadtable}>
                    <div
                      style={{
                        width: "600px",
                        height: "300px",
                        overflow: "hidden",
                        position: "relative"
                      }}
                    >
                       <div id="my_div">
                        <video
                          id="my_video"
                          width="600"
                          height="300"
                          controls
                          controlsList="nodownload  noremoteplayback"
                          disablePictureInPicture="return true"
                          onContextMenu="return false"
                          muted="muted"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              }
              showDialog={this.state.LookVideo}
              showMask
              Width="655px"
              bHeight="400px"
              TitleText={language[`viewVideo_${this.props.language.getlanguages}`]}
              okText={language[`confirm_${this.props.language.getlanguages}`]}
              CancleText={language[`cancel_${this.props.language.getlanguages}`]}
              onCancel={this.handleCancelLookVideo}
              onOk={this.handleOk}
              className={styleless.basicpop}
            />
          ) : null}

          {/* 文档 */}
          {this.state.LookDoc ? (
            <Dialog
              BodyContent={
                <div className={style.popFodderType}>
                  {/*上传后的文件列表*/}
                  <div className={style.uploadtable}>
                    <div
                      style={{
                        width: "900px",
                        height: "600px",
                        overflow: "hidden"
                      }}
                    >
                      <iframe
                        id="DocBox"
                        frameBorder="0"
                        style={{
                          width: "850px",
                          height: "540px",
                          overflowX: "scroll"
                        }}
                      />
                    </div>
                  </div>
                </div>
              }
              showDialog={this.state.LookDoc}
              showMask
              Width="900px"
              bHeight="600px"
              TitleText="查看网页"
              okText={language[`confirm_${this.props.language.getlanguages}`]}
              CancleText={language[`cancel_${this.props.language.getlanguages}`]}
              onCancel={this.handleCancelLookDoc}
              onOk={this.handleOk}
              className={styleless.basicpop}
            />
          ) : null}

          {/* 网页 */}
          {this.state.LookHTML ? (
            <Dialog
              BodyContent={
                <div className={style.popFodderType}>
                  {/*上传后的文件列表*/}
                  <div className={style.uploadtable}>
                    <div
                      style={{
                        width: "900px",
                        height: "600px",
                        overflow: "hidden"
                      }}
                    >
                      <iframe
                        id="HTMLBox"
                        frameBorder="0"
                        style={{
                          width: "900px",
                          height: "100%",
                          overflowX: "scroll"
                        }}
                      />
                    </div>
                  </div>
                </div>
              }
              showDialog={this.state.LookHTML}
              showMask
              Width="900px"
              bHeight="600px"
              TitleText="查看网页"
              okText={language[`confirm_${this.props.language.getlanguages}`]}
              CancleText={language[`cancel_${this.props.language.getlanguages}`]}
              onCancel={this.handleCancelLookHTML}
              onOk={this.handleOk}
              className={styleless.basicpop}
            />
          ) : null}

          {/* 侦察信号数据 */}
          {this.state.LookZCDetail ? (
            <Dialog
              BodyContent={
                <div className={style.popFodderType}>
                  {/*上传后的文件列表*/}
                  <div className={style.uploadtable}>
                    <div
                      style={{
                        height: "600px",
                        overflowY: "scroll",
                        overflowX: "hidden"
                      }}
                    >
                      <ViewNew data={this.props.radarModel.ZCSignMsg_data} />
                    </div>
                  </div>
                </div>
              }
              showDialog={this.state.LookZCDetail}
              showMask
              Width="1015px"
              // bHeight="600px"
              TitleText={language[`ViewReconnaissanceSignalFile_${
                this.props.language.getlanguages
                }`]}
              okText={language[`confirm_${this.props.language.getlanguages}`]}
              CancleText={language[`cancel_${this.props.language.getlanguages}`]}
              onCancel={this.handleCancelLookZCDetail}
              onOk={this.handleOk}
              className={styleless.basicpop}
            />
          ) : null}
        </div>
      </Fragment>
    );
  }
}

@connect(({ fodder, language }) => ({ fodder, language }))
// 左边的侧边栏
class SideBar extends Component {
  constructor(props) {
    super(props);
    //3个状态，点击每个名字可以关起或者展开
    //再加上9个复选框的状态
    this.state = {
      hiddenType: false,
      hiddenUnit: false,
      hiddenSend: false,
      typeCheck1: true,
      typeCheck2: true,
      typeCheck3: true,
      typeCheck4: true,
      typeCheck5: true,
      unitCheck1: true,
      unitCheck2: true,
      unitCheck3: true,
      datalength: 0
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
    //切换复选框的状态
    var name = e.target.name;
    switch (name) {
      case "typeCheck1":
        this.setState({ typeCheck1: !this.state.typeCheck1 });
        break;
      case "typeCheck2":
        this.setState({ typeCheck2: !this.state.typeCheck2 });
        break;
      case "typeCheck3":
        this.setState({ typeCheck3: !this.state.typeCheck3 });
        break;
      case "typeCheck4":
        this.setState({ typeCheck4: !this.state.typeCheck4 });
        break;
      case "typeCheck5":
        this.setState({ typeCheck5: !this.state.typeCheck5 });
        break;
      case "unitCheck1":
        this.setState({ unitCheck1: !this.state.unitCheck1 });
        break;
      case "unitCheck2":
        this.setState({ unitCheck2: !this.state.unitCheck2 });
        break;
    }
  };

  handleClickBtn = () => {
    this.props.dispatch({
      type: "fodder/ClickBtn",
      payload: {
        a: this.state.typeCheck1 ? 1 : 0,
        b: this.state.typeCheck2 ? 1 : 0,
        c: this.state.typeCheck3 ? 1 : 0,
        d: this.state.typeCheck4 ? 1 : 0,
        e: this.state.typeCheck5 ? 1 : 0,
        f: this.state.unitCheck1 ? 1 : 0,
        g: this.state.unitCheck2 ? 1 : 0,
        h: 0
      }
    });
    //点击查询按钮，将勾选的复选框条件传到后端，查询出数据，展示到页面的table表格中，进行页面显示
    this.props.dispatch({
      type: "fodder/selectAllMaterical",
      payload: {
        fileType: "radar",
        a: this.state.typeCheck1 ? 1 : 0,
        b: this.state.typeCheck2 ? 1 : 0,
        c: this.state.typeCheck3 ? 1 : 0,
        d: this.state.typeCheck4 ? 1 : 0,
        e: this.state.typeCheck5 ? 1 : 0,
        f: this.state.unitCheck1 ? 1 : 0,
        g: this.state.unitCheck2 ? 1 : 0,
        h: 0
      }
    });

    this.props.dispatch({
      type: "fodder/changeClickMark",
      payload: true
    });
  };
  render() {
    return (
      <div className={style.Basic}>
        <div className={style.BasicFodder}>
          <strong>
            {language[`BasicMsgQuery_${this.props.language.getlanguages}`]}
          </strong>
        </div>
        <div className={style.FodderType}>
          {/* 素材类型 */}
          <div className={style.FodderTypeTitle} onClick={this.handleClickType}>
            {language[`MaterialType_${this.props.language.getlanguages}`]}
          </div>
          <div className={style.Material_check} hidden={this.state.hiddenType}>
            <div>
              <Checkbox
                name="typeCheck1"
                checked={this.state.typeCheck1}
                onChange={this.handleChange}
              >
                {language[`webPage_${this.props.language.getlanguages}`]}
              </Checkbox>
            </div>
            <div>
              <Checkbox
                name="typeCheck2"
                checked={this.state.typeCheck2}
                onChange={this.handleChange}
              >
                {language[`picture_${this.props.language.getlanguages}`]}
              </Checkbox>
            </div>
            <div>
              <Checkbox
                name="typeCheck3"
                checked={this.state.typeCheck3}
                onChange={this.handleChange}
              >
                {language[`video_${this.props.language.getlanguages}`]}
              </Checkbox>
            </div>
            <div>
              <Checkbox
                name="typeCheck4"
                checked={this.state.typeCheck4}
                onChange={this.handleChange}
              >
                {language[`document_${this.props.language.getlanguages}`]}
              </Checkbox>
            </div>
            <div>
              {/* 侦察信号数据 */}
              <Checkbox
                name="typeCheck5"
                checked={this.state.typeCheck5}
                onChange={this.handleChange}
              >
                {language[`ReconnaissanceSignalData_${
                  this.props.language.getlanguages
                  }`
                ]
                }
              </Checkbox>
            </div>
          </div>
        </div>

        <div className={style.FodderType}>
          <div className={style.FodderTypeTitle} onClick={this.handleClickUnit}>
            {language[`MaterialSource_${this.props.language.getlanguages}`]}
          </div>
          <div className={style.Material_check} hidden={this.state.hiddenUnit}>
            <div>
              <Checkbox
                name="unitCheck1"
                checked={this.state.unitCheck1}
                onChange={this.handleChange}
              >
                {language[`level_${this.props.language.getlanguages}`]}
              </Checkbox>
            </div>
            <div>
              <Checkbox
                name="unitCheck2"
                checked={this.state.unitCheck2}
                onChange={this.handleChange}
              >
                {language[`superior_${this.props.language.getlanguages}`]}
              </Checkbox>
            </div>
            {/* <div>
              <Checkbox name='unitCheck3' checked={this.state.unitCheck3} onChange={this.handleChange}>{language[`other_${this.props.language.getlanguages}`]}</Checkbox>
            </div> */}
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
          <Button type="primary" onClick={this.handleClickBtn}>
            {language[`query_${this.props.language.getlanguages}`]}
          </Button>
        </div>
      </div>
    );
  }
}
Fodder.propTypes = {};

export default Fodder;
