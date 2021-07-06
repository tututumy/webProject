/*
 * @Author: mikey.zhaopeng 
 * @Date: 2020-05-29 11:10:49 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-05-29 11:12:52
 */

import React, { Component, Children } from "react";
import { connect } from "dva";
import style from "./Edit.css";
import styleless from "./test.less";
import { Table, Button, Popconfirm, Input, message } from "antd";
import Dialog from "../../utils/DialogMask/Dialog";
import language from "../language/language";
import axios from "axios";
import responseStatus from "../../utils/initCode";

@connect(({ language, radarModel, loading }) => ({
  language,
  radarModel,
  loading
}))
export default class Radar_relateMsg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleImg: false,
      visibleVedio: false,
      visibleHtml: false,
      visibleDoc: false,
      LookHtml: false,
      LookVideo: false,
      LookImg: false,
      LookDoc: false,
      isPlay: false,
      flagImg: false,
      flagVideo: false,
      flagHtml: false,
      flagDoc: false,
      bigContent: false,
      targetDetailMsg: null,
      targetLibraryMsg: null,
      targetdata: [],
      targetdataVedio: [],
      targetdataHTML: [],
      targetdataDoc: [],
      currentpage: "1",
      picLength: 0,
      videoLength: 0,
      htmlLength: 0,
      docLength: 0,

      relateMsg_Dialog_img_data: null, //图片查询素材弹出框列表内容
      relateMsg_Dialog_video_data: null, //图片查询素材弹出框列表内容
      relateMsg_Dialog_html_data: null, //图片查询素材弹出框列表内容
      relateMsg_Dialog_doc_data: null,

      selectedRowKeys: [],
      selectedRowsImg: [],
      selectedRowKeysImg: [],
      selectedRowsImg_column_data: null, //素材列表中的图片信息
      selectedRowsVideo: "",
      selectedRowKeysVideo: [],
      selectedRowsVideo_column_data: null, //素材列表中的视频信息
      selectedRowsHtml: "",
      selectedRowKeysHtml: [],
      selectedRowsHtml_column_data: null, //素材列表中的网页信息
      selectedRowsDoc: "",
      selectedRowKeysDoc: [],
      selectedRowsDoc_column_data: null, //素材列表中的文档信息

      objectName_Img: [], //把素材列表中已经有的列表的素材名称赋值给objectName
      objectName_Video: [],
      objectName_Html: [],
      objectName_Doc: [],
      materialLoading: false //点击选用素材的loading
    };
  }

  //图片的“选用素材”按钮
  handleSelectMaterial_btn = type => {
    this.setState({ materialLoading: true });
    if (type === "图片") {
      this.setState({
        visibleImg: true
      });
    } else if (type === "视频") {
      this.setState({
        visibleVedio: true
      });
    } else if (type === "网页") {
      this.setState({
        visibleHtml: true
      });
    } else if (type === "文档") {
      this.setState({
        visibleDoc: true
      });
    }
    let urll;
    if (typeof window.getUrl == "function") {
      urll = window.getUrl() + "/api/LK-0313036/LK036";
    } else {
      urll = "http://192.168.0.107:8087";
    }
    axios({
      method: "get",
      url: urll + "/SynthInformationReorganize/selectTopicAllMaterial",
      params: {
        type: "radar",
        fileName: "null",
        fileType: type
      }
    })
      .then(res => {
        this.setState({ materialLoading: false });
        if (res && res.data) {
          let arr = [];
          let source;
          for (let i = 0; i < res.data[0].length; i++) {
            if (
              res.data[0][i].fileSource === "上级" ||
              res.data[0][i].fileSource ===
                language[`superior_${this.props.language.getlanguages}`]
            ) {
              source = language[`superior_${this.props.language.getlanguages}`];
            } else if (
              res.data[0][i].fileSource === "本级" ||
              res.data[0][i].fileSource ==
                language[`level_${this.props.language.getlanguages}`]
            ) {
              source = language[`level_${this.props.language.getlanguages}`];
            }
            arr.push({
              SerialNumber: i + 1,
              number: res.data[0][i].fileId,
              fileName: res.data[0][i].fileName,
              fileSource: source
            });
          }
          if (type === "图片") {
            this.setState({ relateMsg_Dialog_img_data: arr });
          } else if (type === "视频") {
            this.setState({ relateMsg_Dialog_video_data: arr });
          } else if (type === "网页") {
            this.setState({ relateMsg_Dialog_html_data: arr });
          } else if (type === "文档") {
            this.setState({ relateMsg_Dialog_doc_data: arr });
          }
        }
      })
      .catch(error => {
        error.response !== undefined
          ? responseStatus(error.response.status)
          : message.error(`error: ${error}`);
      });
  };
  // 图片的“选用素材”弹出框中查询
  selectImg = () => {
    let imgName = document.getElementById("selectImg_input_name").value;
    if (!imgName) {
      imgName = "null";
    }
    let urll;
    if (typeof window.getUrl == "function") {
      urll = window.getUrl() + "/api/LK-0313036/LK036";
    } else {
      urll = "http://192.168.0.107:8087";
    }
    axios({
      method: "get",
      // url: "http://测试192.168.1.252/api/LK-0300041/LK041/SkyInformationReorganize/selectMaterial",
      url: urll + "/SynthInformationReorganize/selectTopicMaterial",
      params: {
        fileName: imgName,
        fileType: "图片",
        type: "radar"
      }
    })
      .then(res => {
        if (res && res.data) {
          let arr = [];
          let source;
          for (let i = 0; i < res.data[0].length; i++) {
            if (
              res.data[0][i].fileSource === "上级" ||
              res.data[0][i].fileSource ===
                language[`superior_${this.props.language.getlanguages}`]
            ) {
              source = language[`superior_${this.props.language.getlanguages}`];
            } else if (
              res.data[0][i].fileSource === "本级" ||
              res.data[0][i].fileSource ==
                language[`level_${this.props.language.getlanguages}`]
            ) {
              source = language[`level_${this.props.language.getlanguages}`];
            }
            arr.push({
              SerialNumber: i + 1,
              number: res.data[0][i].fileId,
              fileName: res.data[0][i].fileName,
              fileSource: source
            });
          }
          this.setState({ relateMsg_Dialog_img_data: arr });
        }
      })
      .catch(error => {
        error.response !== undefined
          ? responseStatus(error.response.status)
          : message.error(`error: ${error}`);
      });
  };

  handleCancelImg = () => {
    this.setState({
      visibleImg: false,
      selectedRowsImg: ""
    });
  };

  //图片得选用素材弹出框，点击确定按钮
  handleOkInsert = type => {
    this.setState({
      visibleImg: false,
      selectedRowsImg: "",
      selectedRowKeysImg: []
    });
    if (type === "图片") {
      this.setState({
        visibleImg: false
      });
      let data = this.state.selectedRowsImg; //弹出框中复选框选中的图片素材
      if (data.length > 0) {
        let arr = [];
        let dataSource = [];
        let dataSourceFileId = [];
        //model层图片的数据
        if (this.props.radarModel.imgData_Special) {
          let data_model = this.props.radarModel.imgData_Special;
          dataSource = this.props.radarModel.imgData_Special;
          for (let i = 0; i < data_model.length; i++) {
            arr.unshift(data_model[i].fileId); //arr存放了已经存在的图片列表中的图片名称
            dataSourceFileId.unshift({ fileId: data_model[i].fileId });
          }
        }
        for (let i = 0; i < data.length; i++) {
          //循环选中的素材
          if (arr.length === 0 || arr.indexOf(data[i].fileId) === -1) {
            //如果查询出来的图片素材为空或者选中的素材和已经存在的素材不重复则保存起来
            dataSource.unshift({
              key: data.length + i,
              fileId: data[i].fileId,
              fileName: data[i].fileName,
              fileSource: data[i].fileSource
            });
            dataSourceFileId.unshift({ fileId: data[i].fileId });
          } else {
            message.warning(
              `${data[i].fileName}${language[`Existing_${this.props.language.getlanguages}`]}`
            );
          }
          arr.unshift(data[i].fileId);
        }
        //把图片的编号发给后端更新缓存
        this.props.dispatch({
          type: "radarModel/updateImgData_Special",
          payload: {
            dataSourceFileId: dataSourceFileId
          }
        });
        this.props.dispatch({
          type: "radarModel/insertImgData_Special",
          payload: {
            dataSource: dataSource
          }
        });
      }
    } else if (type === "视频") {
      this.setState({
        visibleVedio: false,
        selectedRowsVideo: "",
        selectedRowKeysVideo: []
      });
      let data = this.state.selectedRowsVideo;
      if (data.length > 0) {
        let arr = [];
        let dataSource = [];
        let dataSourceFileId = []; //视频的id集合
        //model层图片的数据
        if (this.props.radarModel.videoData_Special) {
          let data_model = this.props.radarModel.videoData_Special;
          dataSource = this.props.radarModel.videoData_Special;
          for (let i = 0; i < data_model.length; i++) {
            arr.unshift(data_model[i].fileId); //arr存放了已经存在的图片列表中的图片名称
            dataSourceFileId.unshift({ fileId: data_model[i].fileId });
          }
        }
        for (let i = 0; i < data.length; i++) {
          if (arr.length === 0 || arr.indexOf(data[i].fileId) === -1) {
            dataSource.unshift({
              key: data.length + i,
              fileId: data[i].fileId,
              fileName: data[i].fileName,
              fileSource: data[i].fileSource
            });
            dataSourceFileId.unshift({ fileId: data[i].fileId });
          } else {
            message.warning(
              `${data[i].fileName}${language[`Existing_${this.props.language.getlanguages}`]}`
            );
          }
          //把图片的编号发给后端更新缓存
          this.props.dispatch({
            type: "radarModel/updateVideoData_Special",
            payload: {
              dataSourceFileId: dataSourceFileId
            }
          });
          this.props.dispatch({
            type: "radarModel/insertVideoData_Special",
            payload: {
              dataSource: dataSource
            }
          });
          arr.push(data[i].fileName);
        }
      }
    } else if (type === "网页") {
      this.setState({
        visibleHtml: false,
        selectedRowsHtml: "",
        selectedRowKeysHtml: []
      });
      let data = this.state.selectedRowsHtml;
      if (data.length > 0) {
        let arr = [];
        let dataSource = [];
        let dataSourceFileId = [];
        //model层图片的数据
        if (this.props.radarModel.htmlData_Special) {
          let data_model = this.props.radarModel.htmlData_Special;
          dataSource = this.props.radarModel.htmlData_Special;
          for (let i = 0; i < data_model.length; i++) {
            arr.unshift(data_model[i].fileId); //arr存放了已经存在的图片列表中的图片名称
            dataSourceFileId.unshift({ fileId: data_model[i].fileId });
          }
        }

        for (let i = 0; i < data.length; i++) {
          if (arr.length === 0 || arr.indexOf(data[i].fileId) === -1) {
            dataSource.unshift({
              key: data.length + i,
              fileId: data[i].fileId,
              fileName: data[i].fileName,
              fileSource: data[i].fileSource
            });
            dataSourceFileId.unshift({ fileId: data[i].fileId });
          } else {
            message.warning(
              `${data[i].fileName}${language[`Existing_${this.props.language.getlanguages}`]}`
            );
          }
          //把图片的编号发给后端更新缓存
          this.props.dispatch({
            type: "radarModel/updateHtmlData_Special",
            payload: {
              dataSourceFileId: dataSourceFileId
            }
          });
          this.props.dispatch({
            type: "radarModel/insertHtmlData_Special",
            payload: {
              dataSource: dataSource
            }
          });
          arr.unshift(data[i].fileName);
        }
      }
    } else if (type === "文档") {
      this.setState({
        visibleDoc: false,
        selectedRowsDoc: "",
        selectedRowKeysDoc: []
      });
      let data = this.state.selectedRowsDoc;
      if (data.length > 0) {
        let arr = [];
        let dataSource = [];
        let dataSourceFileId = [];
        //model层图片的数据
        if (this.props.radarModel.docData_Special) {
          let data_model = this.props.radarModel.docData_Special;
          dataSource = this.props.radarModel.docData_Special;
          for (let i = 0; i < data_model.length; i++) {
            arr.unshift(data_model[i].fileId); //arr存放了已经存在的图片列表中的图片名称
            dataSourceFileId.unshift({ fileId: data_model[i].fileId });
          }
        }

        for (let i = 0; i < data.length; i++) {
          if (arr.length === 0 || arr.indexOf(data[i].fileId) === -1) {
            dataSource.unshift({
              key: data.length + i,
              fileId: data[i].fileId,
              fileName: data[i].fileName,
              fileSource: data[i].fileSource
            });
            dataSourceFileId.unshift({ fileId: data[i].fileId });
          } else {
            message.warning(
              `${data[i].fileName}${language[`Existing_${this.props.language.getlanguages}`]}`
            );
          }
          //把图片的编号发给后端更新缓存
          this.props.dispatch({
            type: "radarModel/updateDocData_Special",
            payload: {
              dataSourceFileId: dataSourceFileId
            }
          });
          this.props.dispatch({
            type: "radarModel/insertDocData_Special",
            payload: {
              dataSource: dataSource
            }
          });
          arr.push(data[i].fileName);
        }
      }
    }
  };
  handleOkVideo = () => {
    this.setState({
      visibleVedio: false
    });
  };
  handleOkHtml = () => {
    this.setState({
      visibleHtml: false
    });
  };
  handleOkDoc = () => {
    this.setState({
      visibleDoc: false
    });
  };

  //查看具体图片
  LookImg = () => {
    this.setState({
      LookImg: true,
      flagImg: false
    });
  };

  handleCancelLookImg = () => {
    if (this.state.flagImg === true) {
      this.setState({
        LookImg: false,
        visibleImg: true
      });
    } else {
      this.setState({
        LookImg: false,
        visibleImg: false
      });
    }
  };

  // 视频的“选用素材”弹出框中查询
  selectVideo = () => {
    let name = document.getElementById("selectImg_input_video").value;
    if (name == "") {
      name = "null";
    }
    let urll;
    if (typeof window.getUrl == "function") {
      urll = window.getUrl() + "/api/LK-0313036/LK036";
    } else {
      urll = "http://192.168.0.107:8087";
    }
    axios({
      method: "get",
      url: urll + "/SynthInformationReorganize/selectTopicMaterial",
      params: {
        fileName: name,
        fileType: "视频",
        type: "radar"
      }
    })
      .then(res => {
        if (res && res.data) {
          let arr = [];
          for (let i = 0; i < res.data[0].length; i++) {
            arr.push({
              SerialNumber: i + 1,
              number: res.data[0][i].fileId,
              fileName: res.data[0][i].fileName,
              fileSource: res.data[0][i].fileSource
            });
          }
          this.setState({ relateMsg_Dialog_video_data: arr });
        }
      })
      .catch(error => {
        error.response !== undefined
          ? responseStatus(error.response.status)
          : message.error(`error: ${error}`);
      });
  };
  handleCancelVedio = () => {
    this.setState({
      visibleVedio: false,
      selectedRowsVideo: ""
    });
  };
  //查看具体视频
  LookVideo = () => {
    this.setState({
      LookVideo: true,
      flagVideo: false
    });
  };

  handleCancelLookVideo = () => {
    if (this.state.flagVideo === true) {
      this.setState({
        LookVideo: false,
        visibleVedio: true
      });
    } else {
      this.setState({
        LookVideo: false,
        visibleVedio: false
      });
    }
    document.getElementById("my_video").pause();
  };

  // 网页的“选用素材”弹出框中查询
  selectHtml = () => {
    let name = document.getElementById("selectImg_input_html").value;
    if (name == "") {
      name = "null";
    }
    let urll;
    if (typeof window.getUrl == "function") {
      urll = window.getUrl() + "/api/LK-0313036/LK036";
    } else {
      urll = "http://192.168.0.107:8087";
    }
    axios({
      method: "get",
      url: urll + "/SynthInformationReorganize/selectTopicMaterial",
      params: {
        fileName: name,
        fileType: "网页",
        type: "radar"
      }
    })
      .then(res => {
        if (res && res.data) {
          let arr = [];
          for (let i = 0; i < res.data[0].length; i++) {
            arr.push({
              SerialNumber: i + 1,
              number: res.data[0][i].fileId,
              fileName: res.data[0][i].fileName,
              fileSource: res.data[0][i].fileSource
            });
          }
          this.setState({ relateMsg_Dialog_html_data: arr });
        }
      })
      .catch(error => {
        error.response !== undefined
          ? responseStatus(error.response.status)
          : message.error(`error: ${error}`);
      });
  };
  handleCancelHtml = () => {
    this.setState({
      visibleHtml: false,
      selectedRowsHtml: ""
    });
  };
  //查看具体网页
  LookHtml = () => {
    this.setState({
      LookHtml: true
    });
  };

  handleCancelLookHtml = () => {
    this.setState({
      LookHtml: false
    });
  };

  // 文档的“选用素材”弹出框中查询
  selectDoc = () => {
    let name = document.getElementById("selectImg_input_doc").value;
    if (name == "") {
      name = "null";
    }
    let urll;
    if (typeof window.getUrl == "function") {
      urll = window.getUrl() + "/api/LK-0313036/LK036";
    } else {
      urll = "http://192.168.0.107:8087";
    }
    axios({
      method: "get",
      url: urll + "/SynthInformationReorganize/selectTopicMaterial",
      params: {
        fileName: name,
        fileType: "文档",
        type: "radar"
      }
    })
      .then(res => {
        if (res && res.data) {
          let arr = [];
          for (let i = 0; i < res.data[0].length; i++) {
            arr.push({
              SerialNumber: i + 1,
              number: res.data[0][i].fileId,
              fileName: res.data[0][i].fileName,
              fileSource: res.data[0][i].fileSource
            });
          }
          this.setState({ relateMsg_Dialog_doc_data: arr });
        }
      })
      .catch(error => {
        error.response !== undefined
          ? responseStatus(error.response.status)
          : message.error(`error: ${error}`);
      });
  };
  handleCancelDoc = () => {
    this.setState({
      visibleDoc: false,
      selectedRowsDoc: ""
    });
  };
  //查看具体文档
  LookDoc = () => {
    this.setState({
      LookDoc: true,
      flagDoc: false
    });
  };

  handleCancelLookDoc = () => {
    if (this.state.flagDoc === true) {
      this.setState({
        LookDoc: false,
        visibleDoc: true
      });
    } else {
      this.setState({
        LookDoc: false,
        visibleDoc: false
      });
    }
  };

  // turnLeft = () => {
  //   var leftNum = parseInt(document.getElementById("imgBox").style.left, 0);
  //   leftNum -= 600;
  //   if (leftNum <= -1800) {
  //     leftNum = 0;
  //   }
  //   document.getElementById("imgBox").style.left = leftNum + "px";

  // }
  // turnRight = () => {
  //   var leftNum = parseInt(document.getElementById("imgBox").style.left, 0);
  //   leftNum += 600;
  //   if (leftNum >= 0) {
  //     leftNum = -1800;
  //   }
  //   document.getElementById("imgBox").style.left = leftNum + "px";
  // }
  //删除图片素材
  handleClickDelete = (fileId, type) => {
    if (type === "图片") {
      const dataSource = [...this.props.radarModel.imgData_Special];
      let data = dataSource.filter(item => item.fileId !== fileId);
      this.props.dispatch({
        type: "radarModel/deleteImgColumndata",
        payload: data
      });
      this.props.dispatch({
        type: "radarModel/deleteImgColumndata_send",
        payload: fileId
      });
    } else if (type === "视频") {
      const dataSource = [...this.props.radarModel.videoData_Special];
      let data = dataSource.filter(item => item.fileId !== fileId);
      this.props.dispatch({
        type: "radarModel/deleteVideoColumndata",
        payload: data
      });
      this.props.dispatch({
        type: "radarModel/deleteVideoColumndata_send",
        payload: fileId
      });
    } else if (type === "网页") {
      const dataSource = [...this.props.radarModel.htmlData_Special];
      let data = dataSource.filter(item => item.fileId !== fileId);
      this.props.dispatch({
        type: "radarModel/deleteHtmlColumndata",
        payload: data
      });
      this.props.dispatch({
        type: "radarModel/deleteHtmlColumndata_send",
        payload: fileId
      });
    } else if (type === "文档") {
      const dataSource = [...this.props.radarModel.docData_Special];
      let data = dataSource.filter(item => item.fileId !== fileId);
      this.props.dispatch({
        type: "radarModel/deleteDocColumndata",
        payload: data
      });
      this.props.dispatch({
        type: "radarModel/deleteDocColumndata_send",
        payload: fileId
      });
    }
  };

  showDetailImg = () => {
    this.setState({
      LookImg: true,
      visibleImg: false,
      flagImg: true
    });
  };
  showDetailVideo = () => {
    this.setState({
      LookVideo: true,
      visibleVedio: false,
      flagVideo: true
    });
  };
  showDetailHtml = () => {
    this.setState({
      LookHtml: true,
      visibleHtml: false,
      flagHtml: true
    });
  };
  showDetailDoc = () => {
    this.setState({
      LookDoc: true,
      visibleDoc: false,
      flagDoc: true
    });
  };

  // 相关资料里面的操作列查看
  handleLookMsg = (num, name, type) => {
    let ip = this.props.language.showMaterialIp;
    var str = "";
    str = num + "," + name;
    let routerMsg;
    if (typeof window.getUrl == "function") {
      routerMsg = window.getUrl() + "/api";
    } else {
      routerMsg = "http://192.168.0.107:8087";
    }
    if (type === "图片") {
      this.setState({
        LookImg: true,
        flagImg: false
      });
      let urll;
      if (typeof window.getUrl == "function") {
        urll = window.getUrl() + "/api/LK-0313036/LK036";
      } else {
        urll = "http://192.168.0.107:8087";
      }
      axios({
        method: "get",
        url: urll + "/SynthInformationReorganize/watchFile",
        params: {
          fileName: str,
          ip: this.props.language.showMaterialIp
        }
      })
        .then(res => {
          if (res && res.data) {
            document.getElementById("showImg").src = routerMsg + res.data[0];
          }
        })
        .catch(error => {
          error.response !== undefined
            ? responseStatus(error.response.status)
            : message.error(`error: ${error}`);
        });
    } else if (type === "视频") {
      this.setState({
        LookVideo: true,
        flagVideo: false
      });
      let urll;
      if (typeof window.getUrl == "function") {
        urll = window.getUrl() + "/api/LK-0313036/LK036";
      } else {
        urll = "http://192.168.0.107:8087";
      }
      axios({
        method: "get",
        url: urll + "/SynthInformationReorganize/watchFile",
        params: {
          fileName: str,
          ip: this.props.language.showMaterialIp
        }
      })
        .then(res => {
          if (res && res.data) {
            document.getElementById("my_video").src = routerMsg + res.data[0];
            document.getElementById("my_video").play();
          }
        })
        .catch(error => {
          error.response !== undefined
            ? responseStatus(error.response.status)
            : message.error(`error: ${error}`);
        });
    } else if (type === "网页") {
      this.setState({
        LookHtml: true,
        flagHtml: false
      });
      let urll;
      if (typeof window.getUrl == "function") {
        urll = window.getUrl() + "/api/LK-0313036/LK036";
      } else {
        urll = "http://192.168.0.107:8087";
      }
      axios({
        method: "get",
        url: urll + "/SynthInformationReorganize/watchFile",
        params: {
          fileName: str,
          ip: this.props.language.showMaterialIp
        }
      })
        .then(res => {
          if (res && res.data) {
            window.open(routerMsg + res.data[0], "_blank");
          }
        })
        .catch(error => {
          error.response !== undefined
            ? responseStatus(error.response.status)
            : message.error(`error: ${error}`);
        });
    } else if (type === "文档") {
      this.setState({
        LookDoc: true,
        flagDoc: false
      });
      let urll;
      if (typeof window.getUrl == "function") {
        urll = window.getUrl() + "/api/LK-0313036/LK036";
      } else {
        urll = "http://192.168.0.107:8087";
      }
      axios({
        method: "get",
        url: urll + "/SynthInformationReorganize/watchFile",
        params: {
          fileName: str,
          ip: this.props.language.showMaterialIp
        }
      })
        .then(res => {
          if (res && res.data) {
            window.open(routerMsg + res.data[0], "_blank");
          }
        })
        .catch(error => {
          error.response !== undefined
            ? responseStatus(error.response.status)
            : message.error(`error: ${error}`);
        });
    }
  };

  handleLookDetailMsg = (number, name, type) => {
    let str = "";
    str = number + "," + name;
    let ip = this.props.language.showMaterialIp;
    let routerMsg;
    if (typeof window.getUrl == "function") {
      routerMsg = window.getUrl() + "/api";
    } else {
      routerMsg = "http://192.168.0.107:8087";
    }
    if (type === "图片") {
      this.setState({
        LookImg: true,
        visibleImg: false,
        flagImg: true
      });
      let urll;
      if (typeof window.getUrl == "function") {
        urll = window.getUrl() + "/api/LK-0313036/LK036";
      } else {
        urll = "http://192.168.0.107:8087";
      }
      axios({
        method: "get",
        url: urll + "/SynthInformationReorganize/watchFile",
        params: {
          fileName: str,
          ip: this.props.language.showMaterialIp
        }
      })
        .then(res => {
          if (res && res.data) {
            document.getElementById("showImg").src = routerMsg + res.data[0];
          }
        })
        .catch(error => {
          error.response !== undefined
            ? responseStatus(error.response.status)
            : message.error(`error: ${error}`);
        });
    } else if (type === "视频") {
      this.setState({
        LookVideo: true,
        visibleVedio: false,
        flagVideo: true
      });
      let urll;
      if (typeof window.getUrl == "function") {
        urll = window.getUrl() + "/api/LK-0313036/LK036";
      } else {
        urll = "http://192.168.0.107:8087";
      }
      axios({
        method: "get",
        url: urll + "/SynthInformationReorganize/watchFile",
        params: {
          fileName: str,
          ip: this.props.language.showMaterialIp
        }
      })
        .then(res => {
          if (res && res.data) {
            document.getElementById("my_video").src = routerMsg + res.data[0];
            document.getElementById("my_video").play();
          }
        })
        .catch(error => {
          error.response !== undefined
            ? responseStatus(error.response.status)
            : message.error(`error: ${error}`);
        });
    } else if (type === "网页") {
      this.setState({
        // LookHtml: true,
        // visibleHtml: false,
        flagHtml: true
      });
      let urll;
      if (typeof window.getUrl == "function") {
        urll = window.getUrl() + "/api/LK-0313036/LK036";
      } else {
        urll = "http://192.168.0.107:8087";
      }
      axios({
        method: "get",
        url: urll + "/SynthInformationReorganize/watchFile",
        params: {
          fileName: str,
          ip: this.props.language.showMaterialIp
        }
      })
        .then(res => {
          if (res && res.data) {
            window.open(routerMsg + res.data[0], "_blank");
          }
        })
        .catch(error => {
          error.response !== undefined
            ? responseStatus(error.response.status)
            : message.error(`error: ${error}`);
        });
    } else if (type === "文档") {
      this.setState({
        // LookDoc: true,
        // visibleDoc: false,
        flagDoc: true
      });
      let urll;
      if (typeof window.getUrl == "function") {
        urll = window.getUrl() + "/api/LK-0313036/LK036";
      } else {
        urll = "http://192.168.0.107:8087";
      }
      axios({
        method: "get",
        url: urll + "/SynthInformationReorganize/watchFile",
        params: {
          fileName: str,
          ip: this.props.language.showMaterialIp
        }
      })
        .then(res => {
          if (res && res.data) {
            window.open(routerMsg + res.data[0], "_blank");
          }
        })
        .catch(error => {
          error.response !== undefined
            ? responseStatus(error.response.status)
            : message.error(`error: ${error}`);
        });
    }
  };
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  onSelectChangeImg = selectedRowKeysImg => {
    this.setState({ selectedRowKeysImg });
  };
  onSelectChangeVideo = selectedRowKeysVideo => {
    this.setState({ selectedRowKeysVideo });
  };
  onSelectChangeHTML = selectedRowKeysHtml => {
    this.setState({ selectedRowKeysHtml });
  };
  onSelectChangeDoc = selectedRowKeysDoc => {
    this.setState({ selectedRowKeysDoc });
  };

  handleZoom = e => {
    let { clientWidth, style } = this.refs.zoomImg;
    if (e.nativeEvent.deltaY <= 0 && clientWidth < 1400) {
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

  render() {
    // 图片的复选
    const { selectedRowKeys, selectedRowKeysImg } = this.state;
    const rowSelectionImg = {
      selectedRowKeys: selectedRowKeysImg,
      onChange: this.onSelectChangeImg,
      onSelect: (record, selected, selectedRowsImg) => {
        var arr = [];
        for (var i = 0; i < selectedRowsImg.length; i++) {
          arr.push({
            fileId: selectedRowsImg[i].number,
            fileName: selectedRowsImg[i].fileName,
            fileSource: selectedRowsImg[i].fileSource
          });
        }
        this.setState({ selectedRowsImg: arr });
      },
      onSelectAll: (selected, selectedRowsImg, changeRows) => {
        if (selected == true) {
          var arr = [];
          let data = this.state.relateMsg_Dialog_img_data;
          let dataLength = data.length;
          for (var i = 0; i < data.length; i++) {
            arr.push({
              fileId: data[i].number,
              fileName: data[i].fileName,
              fileSource: data[i].fileSource
            });
          }
          this.setState({
            selectedRowsImg: arr,
            selectedRowKeysImg: [...Array(dataLength + 1).keys()]
          });
        } else if (selected == false) {
          this.setState({ selectedRowsImg: "", selectedRowKeysImg: [] });
        }
      }
    };
    // 视频的复选
    const { selectedRowKeysVideo } = this.state;
    const rowSelectionVideo = {
      selectedRowKeys: selectedRowKeysVideo,
      onSelect: (record, selected, selectedRowsVideo) => {
        var arr = [];
        for (var i = 0; i < selectedRowsVideo.length; i++) {
          arr.push({
            fileId: selectedRowsVideo[i].number,
            fileName: selectedRowsVideo[i].fileName,
            fileSource: selectedRowsVideo[i].fileSource
          });
        }
        this.setState({ selectedRowsVideo: arr });
      },
      onSelectAll: (selected, selectedRowsVideo, changeRows) => {
        if (selected == true) {
          var arr = [];
          let data = this.state.relateMsg_Dialog_video_data;
          let dataLength = data.length;
          for (var i = 0; i < data.length; i++) {
            arr.push({
              fileId: data[i].number,
              fileName: data[i].fileName,
              fileSource: data[i].fileSource
            });
          }
          this.setState({
            selectedRowsVideo: arr,
            selectedRowKeysVideo: [...Array(dataLength + 1).keys()]
          });
        } else if (selected == false) {
          this.setState({ selectedRowsVideo: "", selectedRowKeysVideo: [] });
        }
      },
      onChange: this.onSelectChangeVideo
    };
    // 网页的复选
    const { selectedRowKeysHtml } = this.state;
    const rowSelectionHtml = {
      selectedRowKeys: selectedRowKeysHtml,
      onSelect: (record, selected, selectedRowsHtml) => {
        var arr = [];
        for (var i = 0; i < selectedRowsHtml.length; i++) {
          arr.push({
            fileId: selectedRowsHtml[i].number,
            fileName: selectedRowsHtml[i].fileName,
            fileSource: selectedRowsHtml[i].fileSource
          });
        }
        this.setState({ selectedRowsHtml: arr });
      },
      onSelectAll: (selected, selectedRowsHtml, changeRows) => {
        if (selected == true) {
          let data = this.state.relateMsg_Dialog_html_data;
          let dataLength = data.length;
          var arr = [];
          for (var i = 0; i < data.length; i++) {
            arr.push({
              fileId: data[i].number,
              fileName: data[i].fileName,
              fileSource: data[i].fileSource
            });
          }
          this.setState({
            selectedRowsHtml: arr,
            selectedRowKeysHtml: [...Array(dataLength + 1).keys()]
          });
        } else if (selected == false) {
          this.setState({ selectedRowsHtml: "", selectedRowKeysHtml: [] });
        }
      },
      onChange: this.onSelectChangeHTML
    };
    // 文档的复选
    const { selectedRowKeysDoc } = this.state;
    const rowSelectionDoc = {
      selectedRowKeys: selectedRowKeysDoc,
      onSelect: (record, selected, selectedRowsDoc) => {
        var arr = [];
        for (var i = 0; i < selectedRowsDoc.length; i++) {
          arr.push({
            fileId: selectedRowsDoc[i].number,
            fileName: selectedRowsDoc[i].fileName,
            fileSource: selectedRowsDoc[i].fileSource
          });
        }
        this.setState({ selectedRowsDoc: arr });
      },
      onSelectAll: (selected, selectedRowsHtml, changeRows) => {
        if (selected == true) {
          let data = this.state.relateMsg_Dialog_doc_data;
          let dataLength = data.length;
          var arr = [];
          for (var i = 0; i < data.length; i++) {
            arr.push({
              fileId: data[i].number,
              fileName: data[i].fileName,
              fileSource: data[i].fileSource
            });
          }
          this.setState({
            selectedRowsDoc: arr,
            selectedRowKeysDoc: [...Array(dataLength + 1).keys()]
          });
        } else if (selected == false) {
          this.setState({ selectedRowsDoc: "", selectedRowKeysDoc: [] });
        }
      },
      onChange: this.onSelectChangeDoc
    };
    //图片
    const foddercolumnImg = [
      {
        //序号
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "SerialNumber"
      },
      {
        //编号
        title: language[`number_${this.props.language.getlanguages}`],
        dataIndex: "number",
        width: "30%"
      },
      {
        //名称
        title: language[`materialName_${this.props.language.getlanguages}`],
        dataIndex: "fileName",
        ellipsis: true,
        render(text, record) {
          return <span title={text}>{text}</span>;
        }
      },
      {
        title: language[`MaterialSource_${this.props.language.getlanguages}`],
        dataIndex: "fileSource"
      },
      {
        //查看
        title: language[`operation_${this.props.language.getlanguages}`],
        dataIndex: "see",
        render: (text, record) => (
          <div>
            <a
              onClick={() =>
                this.handleLookDetailMsg(record.number, record.fileName, "图片")
              }
            >
              {language[`lookOver_${this.props.language.getlanguages}`]}
            </a>
          </div>
        )
      }
    ];
    //视频
    const foddercolumnVideo = [
      {
        //序号
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "SerialNumber"
      },
      {
        //编号
        title: language[`number_${this.props.language.getlanguages}`],
        dataIndex: "number",
        width: "30%"
      },
      {
        //名称
        title: language[`materialName_${this.props.language.getlanguages}`],
        dataIndex: "fileName",
        ellipsis: true,
        render(text, record) {
          return <span title={text}>{text}</span>;
        }
      },
      {
        title: language[`MaterialSource_${this.props.language.getlanguages}`],
        dataIndex: "fileSource"
      },
      {
        //查看
        title: language[`operation_${this.props.language.getlanguages}`],
        dataIndex: "see",
        render: (text, record) => (
          <div>
            <a
              onClick={() =>
                this.handleLookDetailMsg(record.number, record.fileName, "视频")
              }
            >
              {language[`lookOver_${this.props.language.getlanguages}`]}
            </a>
          </div>
        )
      }
    ];
    //网页
    const foddercolumnHtml = [
      {
        //序号
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "SerialNumber"
      },
      {
        //编号
        title: language[`number_${this.props.language.getlanguages}`],
        dataIndex: "number",
        width: "30%"
      },
      {
        //名称
        title: language[`materialName_${this.props.language.getlanguages}`],
        dataIndex: "fileName",
        ellipsis: true,
        render(text, record) {
          return <span title={text}>{text}</span>;
        }
      },
      {
        title: language[`MaterialSource_${this.props.language.getlanguages}`],
        dataIndex: "fileSource"
      },
      {
        //查看
        title: language[`operation_${this.props.language.getlanguages}`],
        dataIndex: "see",
        render: (text, record) => (
          <div>
            <a
              onClick={() =>
                this.handleLookDetailMsg(record.number, record.fileName, "网页")
              }
            >
              {language[`lookOver_${this.props.language.getlanguages}`]}
            </a>
          </div>
        )
      }
    ];
    //文档
    const foddercolumnDoc = [
      {
        //序号
        title: language[`SerialNumber_${this.props.language.getlanguages}`],
        dataIndex: "SerialNumber"
      },
      {
        //编号
        title: language[`number_${this.props.language.getlanguages}`],
        dataIndex: "number",
        width: "30%"
      },
      {
        //名称
        title: language[`materialName_${this.props.language.getlanguages}`],
        dataIndex: "fileName",
        ellipsis: true,
        render(text, record) {
          return <span title={text}>{text}</span>;
        }
      },
      {
        title: language[`MaterialSource_${this.props.language.getlanguages}`],
        dataIndex: "fileSource"
      },
      {
        //查看
        title: language[`operation_${this.props.language.getlanguages}`],
        dataIndex: "see",
        render: (text, record) => (
          <div>
            <a
              onClick={() =>
                this.handleLookDetailMsg(record.number, record.fileName, "文档")
              }
            >
              {language[`lookOver_${this.props.language.getlanguages}`]}
            </a>
          </div>
        )
      }
    ];
    //默认显示页数
    const paginationProps = {
      pageSize: 5
    };

    //图片的列表
    const columnsImg = [
      {
        title: language[`number_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`materialNumber_${this.props.language.getlanguages}`],
        dataIndex: "fileId",
        width: "30%",
        ellipsis: true
      },
      {
        title: language[`materialName_${this.props.language.getlanguages}`],
        dataIndex: "fileName",
        ellipsis: true,
        render(text, record) {
          return <span title={text}>{text}</span>;
        }
      },
      {
        title: language[`MaterialSource_${this.props.language.getlanguages}`],
        dataIndex: "fileSource"
      },
      {
        title: language[`operation_${this.props.language.getlanguages}`],
        render: (text, record) => (
          <div>
            <a
              onClick={() =>
                this.handleLookMsg(record.fileId, record.fileName, "图片")
              }
            >
              {language[`lookOver_${this.props.language.getlanguages}`]}
            </a>
            &nbsp;&nbsp;
            <Popconfirm
              title="Sure to delete?"
              cancelText={language[`cancel_${this.props.language.getlanguages}`]}
              okText={language[`confirm_${this.props.language.getlanguages}`]}
              className={styleless.popConfirm}
              onConfirm={() => this.handleClickDelete(record.fileId, "图片")}
            >
              <a>{language[`delete_${this.props.language.getlanguages}`]}</a>
            </Popconfirm>
          </div>
        )
      }
    ];
    //视频的列表
    const columnsVideo = [
      {
        title: language[`number_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`materialNumber_${this.props.language.getlanguages}`],
        dataIndex: "fileId",
        width: "30%",
        ellipsis: true
      },
      {
        title: language[`materialName_${this.props.language.getlanguages}`],
        dataIndex: "fileName",
        key: "fileName",
        ellipsis: true,
        render(text, record) {
          return <span title={text}>{text}</span>;
        }
      },
      {
        title: language[`MaterialSource_${this.props.language.getlanguages}`],
        dataIndex: "fileSource",
        key: "fileSource"
      },
      {
        title: language[`operation_${this.props.language.getlanguages}`],
        render: (text, record) => (
          <div>
            <a
              onClick={() =>
                this.handleLookMsg(record.fileId, record.fileName, "视频")
              }
            >
              {language[`lookOver_${this.props.language.getlanguages}`]}
            </a>
            &nbsp;&nbsp;
            <Popconfirm
              title="Sure to delete?"
              cancelText={language[`cancel_${this.props.language.getlanguages}`]}
              okText={language[`confirm_${this.props.language.getlanguages}`]}
              className={styleless.popConfirm}
              onConfirm={() => this.handleClickDelete(record.fileId, "视频")}
            >
              <a>{language[`delete_${this.props.language.getlanguages}`]}</a>
            </Popconfirm>
          </div>
        )
      }
    ];
    //网页的列表
    const columnsHtml = [
      {
        title: language[`number_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`materialNumber_${this.props.language.getlanguages}`],
        dataIndex: "fileId",
        width: "30%",
        ellipsis: true
      },
      {
        title: language[`materialName_${this.props.language.getlanguages}`],
        dataIndex: "fileName",
        ellipsis: true,
        render(text, record) {
          return <span title={text}>{text}</span>;
        }
      },
      {
        title: language[`MaterialSource_${this.props.language.getlanguages}`],
        dataIndex: "fileSource"
      },
      {
        title: language[`operation_${this.props.language.getlanguages}`],
        render: (text, record) => (
          <div>
            <a
              onClick={() =>
                this.handleLookMsg(record.fileId, record.fileName, "网页")
              }
            >
              {language[`lookOver_${this.props.language.getlanguages}`]}
            </a>
            &nbsp;&nbsp;
            <Popconfirm
              title="Sure to delete?"
              cancelText={language[`cancel_${this.props.language.getlanguages}`]}
              okText={language[`confirm_${this.props.language.getlanguages}`]}
              className={styleless.popConfirm}
              onConfirm={() => this.handleClickDelete(record.fileId, "网页")}
            >
              <a>{language[`delete_${this.props.language.getlanguages}`]}</a>
            </Popconfirm>
          </div>
        )
      }
    ];
    //文档的列表
    const columnsDoc = [
      {
        title: language[`number_${this.props.language.getlanguages}`],
        dataIndex: "key"
      },
      {
        title: language[`materialNumber_${this.props.language.getlanguages}`],
        dataIndex: "fileId",
        width: "30%",
        ellipsis: true
      },
      {
        title: language[`materialName_${this.props.language.getlanguages}`],
        dataIndex: "fileName",
        ellipsis: true,
        render(text, record) {
          return <span title={text}>{text}</span>;
        }
      },
      {
        title: language[`MaterialSource_${this.props.language.getlanguages}`],
        dataIndex: "fileSource"
      },
      {
        title: language[`operation_${this.props.language.getlanguages}`],
        render: (text, record) => (
          <div>
            <a
              onClick={() =>
                this.handleLookMsg(record.fileId, record.fileName, "文档")
              }
            >
              {language[`lookOver_${this.props.language.getlanguages}`]}
            </a>
            &nbsp;&nbsp;
            <Popconfirm
              title="Sure to delete?"
              cancelText={language[`cancel_${this.props.language.getlanguages}`]}
              okText={language[`confirm_${this.props.language.getlanguages}`]}
              className={styleless.popConfirm}
              onConfirm={() => this.handleClickDelete(record.fileId, "文档")}
            >
              <a>{language[`delete_${this.props.language.getlanguages}`]}</a>
            </Popconfirm>
          </div>
        )
      }
    ];

    //页面中素材的表格的数据--图片
    let imgTabledata = [];
    let fileSourceImg;
    let imgTabledataCache = this.props.radarModel.imgData_Special
      ? this.props.radarModel.imgData_Special
      : [];
    for (let i = 0; i < imgTabledataCache.length; i++) {
      if (
        imgTabledataCache[i].fileSource === "上级" ||
        imgTabledataCache[i].fileSource ===
          language[`superior_${this.props.language.getlanguages}`]
      ) {
        fileSourceImg =
          language[`superior_${this.props.language.getlanguages}`];
      } else if (
        imgTabledataCache[i].fileSource === "本级" ||
        imgTabledataCache[i].fileSource ==
          language[`level_${this.props.language.getlanguages}`]
      ) {
        fileSourceImg = language[`level_${this.props.language.getlanguages}`];
      }
      imgTabledata.push({
        key: i + 1,
        fileId: imgTabledataCache[i].fileId,
        fileName: imgTabledataCache[i].fileName,
        fileSource: fileSourceImg
      });
    }
    //页面中素材的表格的数据--视频
    let videoTabledata = [];
    let fileSourceVideo;
    let videoTabledataCache = this.props.radarModel.videoData_Special
      ? this.props.radarModel.videoData_Special
      : [];
    for (let i = 0; i < videoTabledataCache.length; i++) {
      if (
        videoTabledataCache[i].fileSource === "上级" ||
        videoTabledataCache[i].fileSource ===
          language[`superior_${this.props.language.getlanguages}`]
      ) {
        fileSourceVideo =
          language[`superior_${this.props.language.getlanguages}`];
      } else if (
        videoTabledataCache[i].fileSource === "本级" ||
        videoTabledataCache[i].fileSource ==
          language[`level_${this.props.language.getlanguages}`]
      ) {
        fileSourceVideo = language[`level_${this.props.language.getlanguages}`];
      }
      videoTabledata.push({
        key: i + 1,
        fileId: videoTabledataCache[i].fileId,
        fileName: videoTabledataCache[i].fileName,
        fileSource: fileSourceVideo
      });
    }
    //页面中素材的表格的数据--网页
    let htmlTabledata = [];
    let fileSourceHtml;
    let htmlTabledataCache = this.props.radarModel.htmlData_Special
      ? this.props.radarModel.htmlData_Special
      : [];
    for (let i = 0; i < htmlTabledataCache.length; i++) {
      if (
        htmlTabledataCache[i].fileSource === "上级" ||
        htmlTabledataCache[i].fileSource ===
          language[`superior_${this.props.language.getlanguages}`]
      ) {
        fileSourceHtml =
          language[`superior_${this.props.language.getlanguages}`];
      } else if (
        htmlTabledataCache[i].fileSource === "本级" ||
        htmlTabledataCache[i].fileSource ==
          language[`level_${this.props.language.getlanguages}`]
      ) {
        fileSourceHtml = language[`level_${this.props.language.getlanguages}`];
      }
      htmlTabledata.push({
        key: i + 1,
        fileId: htmlTabledataCache[i].fileId,
        fileName: htmlTabledataCache[i].fileName,
        fileSource: fileSourceHtml
      });
    }

    //页面中素材的表格的数据--文档
    let docTabledata = [];
    let fileSourceDoc;
    let docTabledataCache = this.props.radarModel.docData_Special
      ? this.props.radarModel.docData_Special
      : [];
    for (let i = 0; i < docTabledataCache.length; i++) {
      if (
        docTabledataCache[i].fileSource === "上级" ||
        docTabledataCache[i].fileSource ===
          language[`superior_${this.props.language.getlanguages}`]
      ) {
        fileSourceDoc =
          language[`superior_${this.props.language.getlanguages}`];
      } else if (
        docTabledataCache[i].fileSource === "本级" ||
        docTabledataCache[i].fileSource ==
          language[`level_${this.props.language.getlanguages}`]
      ) {
        fileSourceDoc = language[`level_${this.props.language.getlanguages}`];
      }
      docTabledata.push({
        key: i + 1,
        fileId: docTabledataCache[i].fileId,
        fileName: docTabledataCache[i].fileName,
        fileSource: fileSourceDoc
      });
    }

    return (
      <div>
        <div
          className={
            this.props.name == "bigPart"
              ? style.relateMsg_Con
              : style.relateMsg_Con_Min
          }
        >
          {/* 左边的图片 */}
          <div>
            <div className={style.subhead_ralateMsg}>
              <div
                style={{ margin: "5px 10px", width: "100px", float: "left" }}
              >
                {language[`picture_${this.props.language.getlanguages}`]}
              </div>
              {/* 选用素材 */}
              <Button
                type="primary"
                style={{ margin: "5px 10px", float: "right" }}
                onClick={() => this.handleSelectMaterial_btn("图片")}
              >
                {language[`SelectMaterial_${this.props.language.getlanguages}`]}
              </Button>
            </div>
            {/* 图片列表中的查看功能 */}
            {this.state.visibleImg ? (
              <Dialog
                BodyContent={
                  <div className={style.popFodderType_relate}>
                    {/* 模糊查询 */}
                    <div
                      className={style.clearFloat}
                      style={{ marginBottom: "15px" }}
                    >
                      <div style={{ display: "inline-block", float: "left" }}>
                        <span>
                          {language[`materialName_${this.props.language.getlanguages}`]}
                        </span>
                        <Input
                          style={{ width: "200px", marginLeft: "10px" }}
                          id="selectImg_input_name"
                          placeholder={language[`Please_enter_a_name_${this.props.language.getlanguages}`]}
                        />
                      </div>
                      {/* 查询 */}
                      <Button
                        style={{ float: "right" }}
                        type="primary"
                        onClick={this.selectImg}
                      >
                        {language[`query_${this.props.language.getlanguages}`]}
                      </Button>
                    </div>
                    {/*上传后的文件列表*/}
                    <div className={style.uploadtable}>
                      <Table
                        loading={this.state.materialLoading}
                        rowKey={record => record.SerialNumber}
                        rowSelection={rowSelectionImg}
                        columns={foddercolumnImg}
                        dataSource={this.state.relateMsg_Dialog_img_data}
                        className={styleless.myClass}
                        rowClassName={(record, index) =>
                          index % 2 === 0 ? styleless.odd : styleless.even
                        } //奇偶行颜色交替变化
                        pagination={paginationProps}
                      />
                    </div>
                  </div>
                }
                showDialog={this.state.visibleImg}
                showFooter
                showMask
                TitleText={language[`SelectMaterial_${this.props.language.getlanguages}`]}
                okText={language[`confirm_${this.props.language.getlanguages}`]}
                CancleText={language[`cancel_${this.props.language.getlanguages}`]}
                onCancel={this.handleCancelImg}
                onOk={() => this.handleOkInsert("图片")}
                className={styleless.basicpop}
              />
            ) : null}

            {/* 文件列表 */}
            <div className={style.TableContent}>
              <Table
                rowKey={record => record.fileId}
                columns={columnsImg}
                dataSource={imgTabledata}
                className={styleless.myClass}
                rowClassName={(record, index) =>
                  index % 2 === 0 ? styleless.odd : styleless.even
                } //奇偶行颜色交替变化
                pagination={paginationProps}
              />
            </div>
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
                TitleText={language[`viewPicture_${this.props.language.getlanguages}`]}
                okText={language[`confirm_${this.props.language.getlanguages}`]}
                CancleText={language[`cancel_${this.props.language.getlanguages}`]}
                onCancel={this.handleCancelLookImg}
                onOk={this.handleOk}
                className={styleless.basicpop}
              />
            ) : null}
          </div>

          {/* 右边的视频 */}
          <div>
            <div className={style.subhead_ralateMsg}>
              <div
                style={{ margin: "5px 10px", width: "100px", float: "left" }}
              >
                {language[`video_${this.props.language.getlanguages}`]}
              </div>
              <Button
                type="primary"
                style={{ margin: "5px 10px", float: "right" }}
                onClick={() => this.handleSelectMaterial_btn("视频")}
              >
                {language[`SelectMaterial_${this.props.language.getlanguages}`]}
              </Button>
            </div>
            {this.state.visibleVedio ? (
              <Dialog
                BodyContent={
                  <div className={style.popFodderType_relate}>
                    {/* 模糊查询 */}
                    <div
                      className={style.clearFloat}
                      style={{ marginBottom: "15px" }}
                    >
                      <div style={{ display: "inline-block", float: "left" }}>
                        <span>
                          {language[`materialName_${this.props.language.getlanguages}`]}
                        </span>
                        <Input
                          style={{ width: "200px", marginLeft: "10px" }}
                          id="selectImg_input_video"
                          placeholder={language[`Please_enter_a_name_${this.props.language.getlanguages}`]}
                        />
                      </div>
                      <Button
                        style={{ float: "right" }}
                        type="primary"
                        onClick={this.selectVideo}
                      >
                        {language[`query_${this.props.language.getlanguages}`]}
                      </Button>
                    </div>
                    {/*上传后的文件列表*/}
                    <div className={style.uploadtable}>
                      <Table
                        loading={this.state.materialLoading}
                        rowKey={record => record.SerialNumber}
                        rowSelection={rowSelectionVideo}
                        columns={foddercolumnVideo}
                        dataSource={this.state.relateMsg_Dialog_video_data}
                        className={styleless.myClass}
                        rowClassName={(record, index) =>
                          index % 2 === 0 ? styleless.odd : styleless.even
                        } //奇偶行颜色交替变化
                        pagination={paginationProps}
                      />
                    </div>
                  </div>
                }
                showDialog={this.state.visibleVedio}
                showFooter
                showMask
                TitleText={language[`SelectMaterial_${this.props.language.getlanguages}`]}
                okText={language[`confirm_${this.props.language.getlanguages}`]}
                CancleText={language[`cancel_${this.props.language.getlanguages}`]}
                onCancel={this.handleCancelVedio}
                onOk={() => this.handleOkInsert("视频")}
                className={styleless.basicpop}
              />
            ) : null}

            {/* 文件列表 */}
            <div className={style.TableContent}>
              <Table
                rowKey={record => record.fileName}
                columns={columnsVideo}
                dataSource={videoTabledata}
                className={styleless.myClass}
                rowClassName={(record, index) =>
                  index % 2 === 0 ? styleless.odd : styleless.even
                } //奇偶行颜色交替变化
                pagination={paginationProps}
              />
            </div>
            {this.state.LookVideo ? (
              <Dialog
                BodyContent={
                  <div className={style.popFodderType_relate}>
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
                        <video
                          id="my_video"
                          width="600"
                          height="300"
                          controls
                          controlsList="nodownload  noremoteplayback"
                          disablePictureInPicture="return true"
                          onContextMenu="return false"
                        />
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
          </div>
        </div>
        <div
          className={
            this.props.name == "bigPart"
              ? style.relateMsg_Con
              : style.relateMsg_Con_Min
          }
          style={{ marginBottom: "90px" }}
        >
          {/* 左边的网页 */}
          <div>
            <div className={style.subhead_ralateMsg}>
              <div
                style={{ margin: "5px 10px", width: "100px", float: "left" }}
              >
                {language[`webPage_${this.props.language.getlanguages}`]}
              </div>
              <Button
                type="primary"
                style={{ margin: "5px 10px", float: "right" }}
                onClick={() => this.handleSelectMaterial_btn("网页")}
              >
                {language[`SelectMaterial_${this.props.language.getlanguages}`]}
              </Button>
            </div>
            {this.state.visibleHtml ? (
              <Dialog
                BodyContent={
                  <div className={style.popFodderType_relate}>
                    {/*上传后的文件列表*/}
                    <div className={style.uploadtable}>
                      {/* 模糊查询 */}
                      <div
                        className={style.clearFloat}
                        style={{ marginBottom: "15px" }}
                      >
                        <div style={{ display: "inline-block", float: "left" }}>
                          <span>
                            {language[`materialName_${
                                  this.props.language.getlanguages
                                }`
                              ]
                            }
                          </span>
                          <Input
                            style={{ width: "200px", marginLeft: "10px" }}
                            id="selectImg_input_html"
                            placeholder={language[`Please_enter_a_name_${
                                  this.props.language.getlanguages
                                }`
                              ]
                            }
                          />
                        </div>
                        <Button
                          style={{ float: "right" }}
                          type="primary"
                          onClick={this.selectHtml}
                        >
                          {language[`query_${this.props.language.getlanguages}`]}
                        </Button>
                      </div>
                      <Table
                        loading={this.state.materialLoading}
                        rowKey={record => record.SerialNumber}
                        rowSelection={rowSelectionHtml}
                        columns={foddercolumnHtml}
                        dataSource={this.state.relateMsg_Dialog_html_data}
                        className={styleless.myClass}
                        rowClassName={(record, index) =>
                          index % 2 === 0 ? styleless.odd : styleless.even
                        } //奇偶行颜色交替变化
                        pagination={paginationProps}
                      />
                    </div>
                  </div>
                }
                showDialog={this.state.visibleHtml}
                showFooter
                showMask
                TitleText={language[`SelectMaterial_${this.props.language.getlanguages}`]}
                okText={language[`confirm_${this.props.language.getlanguages}`]}
                CancleText={language[`cancel_${this.props.language.getlanguages}`]}
                onCancel={this.handleCancelHtml}
                onOk={() => this.handleOkInsert("网页")}
                className={styleless.basicpop}
              />
            ) : null}

            {/* 文件列表 */}
            <div className={style.TableContent}>
              <Table
                rowKey={record => record.fileName}
                columns={columnsHtml}
                dataSource={htmlTabledata}
                className={styleless.myClass}
                rowClassName={(record, index) =>
                  index % 2 === 0 ? styleless.odd : styleless.even
                } //奇偶行颜色交替变化
                pagination={paginationProps}
              />
            </div>
          </div>

          {/* 右边的文档 */}
          <div>
            <div className={style.subhead_ralateMsg}>
              <div
                style={{ margin: "5px 10px", width: "100px", float: "left" }}
              >
                {language[`document_${this.props.language.getlanguages}`]}
              </div>
              <Button
                type="primary"
                style={{ margin: "5px 10px", float: "right" }}
                onClick={() => this.handleSelectMaterial_btn("文档")}
              >
                {language[`SelectMaterial_${this.props.language.getlanguages}`]}
              </Button>
            </div>
            {this.state.visibleDoc ? (
              <Dialog
                BodyContent={
                  <div className={style.popFodderType_relate}>
                    {/* 模糊查询 */}
                    <div
                      className={style.clearFloat}
                      style={{ marginBottom: "15px" }}
                    >
                      <div style={{ display: "inline-block", float: "left" }}>
                        <span>
                          {language[`materialName_${this.props.language.getlanguages}`]}
                        </span>
                        <Input
                          style={{ width: "200px", marginLeft: "10px" }}
                          id="selectImg_input_doc"
                          placeholder={language[`Please_enter_a_name_${this.props.language.getlanguages}`]}
                        />
                      </div>
                      <Button
                        style={{ float: "right" }}
                        type="primary"
                        onClick={this.selectDoc}
                      >
                        {language[`query_${this.props.language.getlanguages}`]}
                      </Button>
                    </div>
                    {/*上传后的文件列表*/}
                    <div className={style.uploadtable}>
                      <Table
                        loading={this.state.materialLoading}
                        rowKey={record => record.SerialNumber}
                        rowSelection={rowSelectionDoc}
                        columns={foddercolumnDoc}
                        dataSource={this.state.relateMsg_Dialog_doc_data}
                        className={styleless.myClass}
                        rowClassName={(record, index) =>
                          index % 2 === 0 ? styleless.odd : styleless.even
                        } //奇偶行颜色交替变化
                        pagination={paginationProps}
                      />
                    </div>
                  </div>
                }
                showDialog={this.state.visibleDoc}
                showFooter
                showMask
                TitleText={language[`SelectMaterial_${this.props.language.getlanguages}`]}
                okText={language[`confirm_${this.props.language.getlanguages}`]}
                CancleText={language[`cancel_${this.props.language.getlanguages}`]}
                onCancel={this.handleCancelDoc}
                onOk={() => this.handleOkInsert("文档")}
                className={styleless.basicpop}
              />
            ) : null}

            {/* 文件列表 */}
            <div className={style.TableContent}>
              <Table
                rowKey={record => record.fileName}
                columns={columnsDoc}
                dataSource={docTabledata}
                className={styleless.myClass}
                rowClassName={(record, index) =>
                  index % 2 === 0 ? styleless.odd : styleless.even
                } //奇偶行颜色交替变化
                pagination={paginationProps}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
