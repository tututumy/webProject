
import axios from "axios";
import { message } from "antd";
import language from '../components/language/language';
const languageSign = window.getCookie('uop.locale') === 'fr_FR' ? "_fr" : "_zh";

window.getCookie = cname => {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();

    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

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

// 查询所有的素材
export async function selectAllMaterical_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "get",
    url: urll + "/radarInformation/selectMaterialMessage",
    params: {
      fileType: payload.fileType,
      a: payload.a,
      b: payload.b,
      c: payload.c,
      d: payload.d,
      e: payload.e,
      f: payload.f,
      g: payload.g,
      h: payload.h
    }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

// 单选删除素材
export async function deleteMaterial_axios(payload) {
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "POST",
    url: urll + "/radarInformation/deleteOneMaterial",
    params: { fileId: payload }
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}

// 多选删除素材
export async function deleteMaterials_axios(payload) {
  console.log("payload.listAll===", payload.listAll)
  let urll;
  if (typeof window.getUrl == "function") {
    urll = window.getUrl() + "/api/LK-0313036/LK036";
  } else {
    urll = "http://192.168.0.107:8087";
  }
  return axios({
    method: "post",
    url: urll + "/radarInformation/deleteMaterials",
    data: payload.listAll
  }).catch(error => {
    error.response  && error.response.status? responseStatus(error.response.status) : message.error(`error: ${error}`)
  });
}
