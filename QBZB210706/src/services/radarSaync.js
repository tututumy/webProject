
import axios from "axios";
import { message } from "antd";
import language from '../components/language/language';

const languageSign = window.getCookie('uop.locale') === 'fr_FR' ? "_fr" : "_zh";

// 状态码
function responseStatus(data) {
  let urll; let loginUrl;
  let oldUrl = window.location.href;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl();
    loginUrl = `${urll}/login`;
  } else {
    urll = "http://192.168.0.104:8000";
    loginUrl = `${urll}`;
  }
  switch (data) {
    case 400:
      message.error(language[`thereWasAnErrorInTheRequest${languageSign}`]);
      break;
    case 401:
      message.error(language[`UserDoesNotHavePermission${languageSign}`]);
      window.location.href = `${loginUrl}?backUrl=${oldUrl}`;
      break;
    case 403:
      message.error(language[`theUserIsAuthorized${languageSign}`]);
      break;
    case 404:
      message.error(language[`theRequestWasMadeForANoExistentRecord${languageSign}`]);
      break;
    case 406:
      message.error(language[`TheFormatOfTheRequestIsNotAvailable${languageSign}`]);
      break;
    case 410:
      message.error(language[`theRequestedResourceWasPermanentlyDeleted${languageSign}`]);
      break;
    case 422:
      message.error(language[`WhenCreatingAnObject${languageSign}`]);
      break;
    case 500:
      message.error(language[`AnErrorOccurredOnTheServer${languageSign}`]);
      break;
    case 502:
      message.error(language[`BadGateway${languageSign}`]);
      break;
    case 503:
      message.error(language[`ServiceNonDisponible${languageSign}`]);
      break;
    case 504:
      message.error(language[`gatewayTimeout${languageSign}`]);
      break;
    default:
      break;
  }
}

//从侦察情报库导入点击列显示数据
export async function RadarModelMsg(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/RadarInformationReorganize/selectInvesAllOfMes",
    params: {
      // objectName: payload.selectedInfoName
      identifyRadarId: payload.selectedIdentifyRadarId
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });

  // return fetch('http://192.168.1.105:8080/showInterfere', {method:'POST'
  //                       ,headers:{ 'Content-Type': 'application/json' }
  //                       ,body: JSON.stringify({ projectName: payload})
  //                    })
  //get方法请求
  // return fetch(`http://192.168.1.105:8080/showInterfere`, { //post方法请求
  //   method: 'post',
  //   headers: {
  //     'Content-Type': 'application/json; charset=utf-8'
  //   },
  //   body: JSON.stringify({
  //     projectName: payload
  //   })
  // })
}
//点击从侦察情报库导入的内容中的工作模式表中的列
export async function WorkModelDetailMsg(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/RadarInformationReorganize/getPwPriFreqPlu",
    params: {
      modeId: payload.modeId,
      modeName: payload.modeName
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}
//点击从侦察情报库导入弹出框中的筛选条件
export async function RadarColumnsMsg(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/RadarInformationReorganize/allDetailsBasicInvesMesssage",
    params: {
      countryName: payload.countryName,
      foeName: payload.foeName,
      threadName: payload.threadName,
      startTime: "null",
      endTime: "null",
      objectName: payload.objectName,
      identifyId: payload.identifyId,
      beginPage: payload.beginPage,
      pageSize: payload.pageSize
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}
//点击从目标库导入的按钮
export async function TargetColumnsMsg(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/RadarInformationReorganize/SelectBasicObjectMessage"
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}
//点击从目标库导入弹出框中的筛选条件
export async function select_TargetColumnsMsg(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/RadarInformationReorganize/selectAllBObjMes",
    params: {
      countryName: payload.countryName,
      foeName: payload.foeName,
      threadName: payload.threadName,
      objectType: payload.objectType,
      objectName: payload.objectName,
      beginPage: payload.beginPage,
      pageSize: payload.pageSize,
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}
//点击从目标库导入的确定
export async function TargetModelMsg(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarInformationReorganize/selectAllOfEle",
    params: {
      objectName: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

//从目标库导入的数据点击行
// export async function TargetModelMsg_fromTar(payload) {
//   return axios({
//     method: 'get',
//     url: urll+"/RadarInformationReorganize/selectObjectFreqPriPWIF",
//     params: {
//       modeId: payload.modeId
//     }
//   })
//     .catch(error => console.log('error is', error));
// }

//点击情报整编软件按钮
export async function ClickQBZB_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/RadarInformationReorganize/selectObjectRadarBasicMes",
    params: {
      countryName: payload.countryName,
      publishStatus: payload.publishStatus,
      okPublishStatus: payload.okPublishStatus,
      modelName: payload.modelName
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectZBColum_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/RadarInformationReorganize/selectAllobj",
    params: {
      countryName: payload.country
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function EditZBColum_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/RadarInformationReorganize/selectEdit",
    params: {
      objectName: payload.objectName
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}
//点击整编对象列表中的删除按钮
export async function deleteZBColum_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/RadarInformationReorganize/deleteOneObj",
    params: {
      objectName: payload.objectName,
      objectType: payload.objectType
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function update_target_WorkModel_main_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarInformationReorganize/updateWoModel",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function saveWorkModel_threePart_SP_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarInformationReorganize/updateModelFreq",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function saveWorkModel_threePart_MK_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarInformationReorganize/updateModelPW",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function saveWorkModel_threePart_CFJG_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarInformationReorganize/updateModelPri",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

//脉内特征保存
export async function update_target_WorkModel_MNTZ_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarInformationReorganize/insertPluse",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

//点击自动整编按钮调用接口告诉后端
export async function ZBStart_send_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/RadarInformationReorganize/selectAllOfRadarInformation",
    params: {
      // objectName: payload.objectName,
      realObjectName: payload.realObjectName,
      identifyObjectId: payload.identifyObjectId
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function save_target_allData_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarInformationReorganize/insertAllofMesToElect",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function deleteWorkModel_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarInformationReorganize/deleteWoModel",
    params: {
      modeId: payload.modeId
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function deleteCache_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/RadarInformationReorganize/deleteCache"
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function publish_target_allData_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarInformationReorganize/insertPublishAllofMesToElect",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function updateImgData_Special_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarInformationReorganize/updateEleFileAtPic",
    data: payload.dataSourceFileId
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function updateVideoData_Special_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarInformationReorganize/updateEleFileAtVideo",
    data: payload.dataSourceFileId
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function updateHtmlData_Special_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarInformationReorganize/updateEleFileAtHTML",
    data: payload.dataSourceFileId
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}
export async function updateDocData_Special_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarInformationReorganize/updateEleFileAtDoc",
    data: payload.dataSourceFileId
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function deleteImgColumndata_send_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarInformationReorganize/deleteFileByPic",
    params: {
      fileId: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}
export async function deleteVideoColumndata_send_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarInformationReorganize/deleteFileByVideo",
    params: {
      fileId: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}
export async function deleteHtmlColumndata_send_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarInformationReorganize/deleteFileByHTML",
    params: {
      fileId: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}
export async function deleteDocColumndata_send_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarInformationReorganize/deleteFileByDoc",
    params: {
      fileId: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function update_target_WorkModel_MNTZ_data_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarInformationReorganize/updatePluse",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectAllChartsList_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarInformationReorganize/selectAllOfSourceOfRadiation",
    params: {
      fileName: payload.fileName,
      fileType: payload.fileType
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectInsertFromTargetChartsMsg_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarInformationReorganize/selectSourceByCacheRadar",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function updateAndSelectChartsData_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarInformationReorganize/updateEleSourceRadiation",
    data: payload.dataSourceFileId
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function deleteCharts_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarInformationReorganize/deleteSourceByRadiation",
    params: {
      code: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectOnlyLookData_axios(payload) {
  //平台挂载雷达信息点击查看
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/SkyInformationReorganize/selectAllObjectByObjectName",
    params: {
      objectName: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectRadarTypeRepeatName_axios(payload) {
  //查询雷达目标名称是否重复
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarTechnParamController/selectIfHaveObjectName",
    params: {
      objectName: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function addRadarTechnicalParam_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarTechnParamController/insertRadarTechnicalParam",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function updateRadarTechnicalParam_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarTechnParamController/updateObjectTypeAndParam",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectAllRadarTypeData_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarTechnParamController/selectAllObjectTypeMes"
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function deleteRadarType_axios(payload) {
  //删除雷达型号
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarTechnParamController/deleteObjectTypeAndParam",
    params: {
      objectNames: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectRadarType_axios(payload) {
  //查询雷达型号
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/RadarInformationReorganize/selectAllOfModelName"
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectRadarTypeDetails_axios(payload) {
  //查询雷达型号
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/RadarInformationReorganize/selectDetailsTechnicalMes",
    params: {
      modelName: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectMaterialRepeat_axios(payload) {
  //查询要上传的素材名称是否重复
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/radarInformation/selectIfHaveSameName",
    params: {
      fileName: payload,
      fileType: "radar"
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function SelectDetailFreqPwPri_axios(payload) {
  //查询工作模式对应的具体信息
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/RadarInformationReorganize/selectFreqPWPriIp",
    params: {
      modeId: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function select_ContinWave_axios(payload) {
  //查询连续波或者非连续波下面的射频、脉宽和重复间隔值输入是否正确
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarInformationReorganize/selectIfHaveFreqPwPri",
    params: {
      param: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}


export async function selectIsOrNotZB_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/RadarInformationReorganize/selectIfHaveRadarId",
    params: {
      radarId: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}
