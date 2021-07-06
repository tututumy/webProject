window.getUrl=function(){
  return 'http://'+window.location.host
}

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
// 获取登录信息
export async function getUserInfo() {
  //res.data.name
  let urll;
  if (typeof window.getUrl == "function") {
    //根据主站遥控本控模式设置（全局函数）
    urll = window.getUrl() + "/api";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/cus/userInfo"
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

// 查询整编对象列表
export async function selectZBList_aysnc(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/SynthInformationReorganize/selectAllBasicMes"
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

//点击编辑按钮，查询出来的对应的数据
export async function selectEditData_aysnc(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/SynthInformationReorganize/selectDetailsMes",
    params: {
      reportName: payload.reportName,
      reportType: payload.reportType
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function ClickResultsReleased_aysnc(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SynthInformationReorganize/insertReportElect",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function ClickResultsReleasedZH_aysnc(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SynthInformationReorganize/insertCompreElect",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function saveSpecialEditMsg_aysnc(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SynthInformationReorganize/updateSpecialDetailsMes",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function SaveResultsReleasedZH_aysnc(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SynthInformationReorganize/updateCompreDetailsMes",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectZBColumn_aysnc(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/SynthInformationReorganize/selectAllBasicMesByType",
    params: {
      a: payload.a,
      b: payload.b,
      c: payload.c,
      d: payload.d,
      e: payload.e
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function deleteZBColum_aysnc(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/SynthInformationReorganize/deleteSpecialElect",
    params: {
      reportName: payload.objectName
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function ClickSaveBtnEnemy_aysnc(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SynthInformationReorganize/insertIntoEnemy11",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function updateSaveBtnEnemy_aysnc(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SynthInformationReorganize/updateEnemyDetailsMes",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function publish_Special_aysnc(payload) {
  //专题报成果发布
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SynthInformationReorganize/publishSpecialTWO",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function publish_Special_fr_aysnc(payload) {
  //专题报成果发布==生成法文版pdf
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SynthInformationReorganize/publishSpecialTWOFrench",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function publish_ElectronicCo_aysnc(payload) {
  //综合报发布成pdf===中文版
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SynthInformationReorganize/publishCompreTWO",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function publish_ElectronicCo_fr_aysnc(payload) {
  //综合报发布成pdf===法文版
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SynthInformationReorganize/publishCompreTWOFrench",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectElectByTime_aysnc(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/SynthInformationReorganize/selectElectObjByTime",
    params: {
      startTime: payload.startTime,
      endingTime: payload.endTime
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function saveBasicMsg_aysnc(payload) {
  //地情报告的保存
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SynthInformationReorganize/insertIntoEnemy",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function saveBasicMsg_sendToops(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SynthInformationReorganize/insertFirstArmy",
    params: {
      reportName: payload.reportName,
      forceId: payload.forceId,
      forceName: payload.forceName
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function sendEquipment_aysnc(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SynthInformationReorganize/insertEquip",
    params: {
      reportName: payload.reportName,
      forceId: payload.forceId,
      equipId: payload.equipId,
      equipName: payload.equipName,
      equipType: payload.equipType,
      equipNum: payload.equipNum,
      equipDeployArea: payload.equipDeployArea,
      equipMission: payload.equipMission
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectEquipNum_aysnc(payload) {
  //保存装备
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SynthInformationReorganize/selectNumByEquipType",
    params: {
      equipType: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function deleteCacheEnemy_aysnc(payload) {
  //保存装备
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SynthInformationReorganize/deleteCache"
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function ClickPublishBtnEnemy_aysnc(payload) {
  //敌情报发布成果===中文版
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SynthInformationReorganize/enemyPdfAndJson",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function ClickPublishBtnEnemy_fr_aysnc(payload) {
  //敌情报发布成果===法文版
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SynthInformationReorganize/enemyPdfAndJsonFrench",
    data: payload
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function OneButtonImport_aysnc(payload) {
  //一键导入
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SynthInformationReorganize/oneKeyBoard",
    params: {
      equipType: payload
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function EditEquipmentData_aysnc(payload) {
  //一键导入
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SynthInformationReorganize/selectEquipDetails",
    params: {
      reportName: payload.reportName,
      equipId: payload.equipId
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function selectTargetColumnsMsg_aysnc(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SynthInformationReorganize/selectAirCacheFromObj",
    params: {
      objectName: payload.objectName
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
      fileType: "compre"
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

export async function publish_ElectronicCo_json_axios(payload) {
  //点击综合报成果发布成json接口
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SynthInformationReorganize/publishCompreJSON",
    data: payload,
    responseType: "arraybuffer"
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}


export async function CreateDataSpecial_axios(payload) {
  //点击创建电子对抗专题报
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SynthInformationReorganize/selectTopicSign",
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}


export async function CreateDataZH_axios(payload) {
  //点击创建电子对抗综合报
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/SynthInformationReorganize/selectComSign",
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}
