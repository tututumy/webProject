import { message } from "antd";
import language from '../components/language/language';
const languageSign = window.getCookie('uop.locale') === 'fr_FR' ? "_fr" : "_zh";



// 状态码
const responseStatus = (data) => {
    let urll;let loginUrl;
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

export default responseStatus;
