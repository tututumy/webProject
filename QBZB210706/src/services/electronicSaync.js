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



export async function selectRightModalColumns(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/SkyInformationReorganize/selectBasInvesMesAir",
    params: {
      countryName: payload.countryName,
      fofName: payload.fofName,
      threadName: payload.threadName,
      beginPage: payload.beginPage,
      pageSize: payload.pageSize,
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function loadZCDataDetail(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/SkyInformationReorganize/selectAllMessage",
    params: {
      fuseObjectId: payload.fuseObjectId
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function loadTargetDataDetail(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SkyInformationReorganize/selectAirCacheFromObj",
    params: {
      objectName: payload.objectName
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectPlaneMsg_aysnc(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/SkyInformationReorganize/selectObjectTrackPt",
    params: {
      objectName: payload.objectName,
      trackId: payload.trackId
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function add_PTGZ_radarMsg_aysnc(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/SkyInformationReorganize/selectRadarMes"
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function add_PTGZ_commitMsg_aysnc(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/SkyInformationReorganize/selectCommuMes"
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectZBList_aysnc(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/SkyInformationReorganize/selectObjectElectBasicMes",
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

export async function deleteZBList_aysnc(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/SkyInformationReorganize/deleteAllObjeByObjeName",
    params: {
      allObjectName: payload.allObjectName
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectZBListEditMsg_aysnc(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/SkyInformationReorganize/selectTargetImport",
    params: {
      objectName: payload.objectName
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function ZBStart_aysnc(payload) {
  //自动整编
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SkyInformationReorganize/selectAllOfIdentElect",
    params: {
      objectName: payload.objectName,
      realObjectName: payload.realObjectName
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function send_selectedRowsPTGZ_radar_aysnc(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SkyInformationReorganize/updateRadarMessage",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function deleteGZPTRadarColumndata_cache_aysnc(payload) {
  //删除后端缓存中的平台挂载雷达信息
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SkyInformationReorganize/deleteRadarCache",
    params: {
      radarId: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function send_insertPTGZ_commitData_aysnc(payload) {
  //更新后端平台挂载通信装备信息
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SkyInformationReorganize/updateCommuMessage",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function deleteGZPTCommitColumndata_cache_aysnc(payload) {
  //删除后端平台挂载通信装备信息
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SkyInformationReorganize/deleteCommCache",
    params: {
      commId: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function save_target_allData_aysnc(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SkyInformationReorganize/insertAllIntoElect",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectTargetColumnsMsg_aysnc(payload) {
  //从目标库导入弹出框根据条件查询
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/SkyInformationReorganize/selectObjectMessage",
    params: {
      countryName: payload.countryName,
      fofName: payload.fofName,
      threadName: payload.threadName,
      objectName: payload.objectName,
      startTime: "null",
      endTime: "null"
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectPlaneLine_aysnc(payload) {
  //点击查看地图按钮
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SkyInformationReorganize/selectPicByTrack"
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function handleCompareShowMap_axios(payload) {
  //点击对比分析的时候弹出地图的弹出框，显示航迹线
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SkyInformationReorganize/compareTrackPT",
    params: {
      objectName: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectRadarisZB_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SkyInformationReorganize/selectIfHaveRadarOrComm",
    params: {
      allNames: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectIfHaveRadarOrCommAtADIBI_axios(payload) {
  //点击成果发布之前先调用查询当前的挂载雷达和通信是否在整编库
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/SkyInformationReorganize/selectIfHaveRadarOrCommAtADIDB",
    params: {
      allNames: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function ResultsReleased_axios(payload) {
  //点击成果发布
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SkyInformationReorganize/insertPublishAllofMesToElect",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function clearCache_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/SkyInformationReorganize/deleteCacheAir"
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
    url: urll + "/SkyInformationReorganize/updateEleFileAtPic",
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
    url: urll + "/SkyInformationReorganize/updateEleFileAtVideo",
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
    url: urll + "/SkyInformationReorganize/updateEleFileAtHTML",
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
    url: urll + "/SkyInformationReorganize/updateEleFileAtDoc",
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
    url: urll + "/SkyInformationReorganize/deleteFileByPic",
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
    url: urll + "/SkyInformationReorganize/deleteFileByVideo",
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
    url: urll + "/SkyInformationReorganize/deleteFileByHTML",
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
    url: urll + "/SkyInformationReorganize/deleteFileByDoc",
    params: {
      fileId: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectOnlyLookCommitData_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/SkyInformationReorganize/selectCommMes",
    params: {
      coummId: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectFreqHoppingPointSet_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/SkyInformationReorganize/selectCommHOP",
    params: {
      wModelId: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectIfHaveName_axios(payload) {
  //查询电子目标名称是否已经存在
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SkyInformationReorganize/selectIfHaveEleAtEle",
    params: {
      objectName: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectAllTargetTypeData_axios(payload) {
  //查询平台型号
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SkyTechnParamController/selectAllObjectTypeMes"
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function addTargetTechnicalParam_axios(payload) {
  //查询平台型号
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SkyTechnParamController/insertSkyTechnicalParam",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectTargetTypeRepeatName_axios(payload) {
  //查询平台型号是否重复
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SkyTechnParamController/selectIfHaveObjectName",
    params: {
      objectName: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function deleteTargetType_axios(payload) {
  //删除平台型号
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SkyTechnParamController/deleteObjectTypeAndParam",
    params: {
      objectNames: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectTargetType_axios(payload) {
  //查询平台型号
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/SkyInformationReorganize/selectAllOfModel"
  }).catch(error => {
    console.log("error=====",error)
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectTargetTypeDetails_axios(payload) {
  //查询平台型号对应的战技术参数
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/SkyInformationReorganize/selectSkyTechnicalParam",
    params: {
      modelName: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function updateTargetTechnicalParam_axios(payload) {
  //查询平台型号对应的战技术参数
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SkyTechnParamController/updateSkyTechnicalAndInfo",
    data: payload
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
      fileType: "target"
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}
