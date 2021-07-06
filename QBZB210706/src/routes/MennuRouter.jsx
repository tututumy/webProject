import React, { Component, Fragment } from "react";
import { Route, Link, Switch } from "react-router-dom";
import All from "../components/All";
import Commit from "../components/Commit";
import RadarInformation from "../components/RadarInformation";
import Target from "../components/Target";
import IntelligenceProcessing from "../components/IntelligenceProcessing";
import styles from "./IndexPage.css";
import { connect } from "dva";
import language from "../components/language/language";
import axios from "axios";
import { Select } from "antd";

@connect(({ language }) => ({ language }))
export default class MennuRouter extends Component {
  constructor() {
    super();
    this.state = {
      backgroundColor: null,
      CommitbgColor: "#2884d8",
      RadarbgColor: "#2884d8",
      TargetbgColor: "#2884d8",
      AllbgColor: "#2884d8",
      IntellbgColor: "#2884d8",
      HelpbgColor: "#2884d8",
      show: false,
      userName: ""
    };
  }

  componentDidMount() {
    if (typeof window.getUrl == "function") {
      let urll;
      if (typeof window.getUrl == "function") {
        //根据主站遥控本控模式设置（全局函数）
        urll = window.getUrl() + "/api";
      } else {
        urll = "http://192.168.0.104:8000";
      }
      axios({
        method: "get",
        url: urll + "/cus/userInfo"
      }).then(res => {
        this.setState({ userName: res.data ? res.data.name : "" });
      });
    }
    // .catch(error => {
    //   message.error(`${error}` )
    // });
  }

  UNSAFE_componentWillMount() {
    if (getCookie("uop.locale") == "fr_FR") {
      this.props.dispatch({
        type: "language/GetLanguages",
        payload: "fr"
      });

      let country = language.countryName
        .sort(this.sortBy_fr(`name_fr`))
        .map((v, k) => (
          <Select.Option value={v.value} key={v.value}>
            {v[`name_fr`]}
          </Select.Option>
        ));
      this.props.dispatch({
        type: "language/saveCountry",
        payload: country
      });
    } else if (getCookie("uop.locale") == "en_EN") {
      this.props.dispatch({
        type: "language/GetLanguages",
        payload: "en"
      });

      let country = language.countryName
        .sort(this.sortBy_fr(`name_en`))
        .map((v, k) => (
          <Select.Option value={v.value} key={v.value}>
            {v[`name_en`]}
          </Select.Option>
        ));
      this.props.dispatch({
        type: "language/saveCountry",
        payload: country
      });
    } else {
      this.props.dispatch({
        type: "language/GetLanguages",
        payload: "zh"
      });

      let country = language.countryName
        .sort(this.sortBy_zh(`name_zh`))
        .map((v, k) => (
          <Select.Option value={v.value} key={v.value}>
            {v[`name_zh`]}
          </Select.Option>
        ));
      this.props.dispatch({
        type: "language/saveCountry",
        payload: country
      });
    }
  }

  changeColor = e => {
    this.setState({
      backgroundColor: e.target.id,
      HelpbgColor:"#2884d8"
    });
  };

  toNewPage = e => {
    this.setState({
      backgroundColor: e.target.id
    });
  };

  changeChinese = () => {
    let { dispatch } = this.props;
    dispatch({
      type: "language/changeLanguage",
      payload: {
        mark: "zh"
      }
    });
  };

  changeFrench = () => {
    let { dispatch } = this.props;
    dispatch({
      type: "language/changeLanguage",
      payload: {
        mark: "fr"
      }
    });
  };

  changeEnglish = () => {
    let { dispatch } = this.props;
    dispatch({
      type: "language/changeLanguage",
      payload: {
        mark: "en"
      }
    });
  };
  sortBy_fr = propertyName => {
    return function (object1, object2) {
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
    return function (object1, object2) {
      var value1 = object1[propertyName];
      var value2 = object2[propertyName];
      return value1.localeCompare(value2, "zh");
    };
  };

  //点击关闭按钮
  handleClose = () => {
    if (typeof window.getUrl == "function") {
      let urll = window.getUrl() + "/api";
      let oldUrl = window.location.href;
      let loginUrl = `${urll}/login`;
      axios({
        method: "get",
        url: urll + "/cus/userInfo"
      }).then(res => {
        if (res.code == "401") {
          window.location.href = `${loginUrl}?backUrl=${oldUrl}`
        }
      });
    }
  };

  clickHelp = () => {
    this.setState({HelpbgColor:"#182445"})
    let urll;
    if (typeof window.getUrl === 'function') {
      // 根据主站遥控本控模式设置（全局函数）
      urll = window.getUrl() + "/LK-0313036";
    } else {
      urll = '';
    }
    let url = urll + "/pdf/web/情报整编软件帮助文档-cn.pdf"
    if (getCookie("uop.locale") == "fr_FR") {
      url = urll + "/pdf/web/Document d'aide du Logiciel de réorganisation d'informations.pdf"
    }else{
      url = urll + "/pdf/web/情报整编软件帮助文档-cn.pdf"
    }
    window.open(url, "_blank")
  }

  render() {
    let {
      backgroundColor,
      CommitbgColor,
      RadarbgColor,
      TargetbgColor,
      AllbgColor,
      IntellbgColor,
      HelpbgColor
    } = this.state;
    switch (backgroundColor) {
      case "Commit":
        CommitbgColor = "#182445";
        break;
      case "Radar":
        RadarbgColor = "#182445";
        break;
      case "Target":
        TargetbgColor = "#182445";
        break;
      case "All":
        AllbgColor = "#182445";
        break;
      case "IntelligenceProcessing":
        IntellbgColor = "#182445";
        break;
      default:
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
        if (hrefid === "1") {
          AllbgColor = "#182445";
        } else if (hrefid === "2") {
          AllbgColor = "#182445";
        } else if (hrefid === "3") {
          AllbgColor = "#182445";
        } else {
          const href = this.props.location.pathname;
          if (href == "/target") {
            TargetbgColor = "#182445";
          } else if (href == "/all") {
            AllbgColor = "#182445";
          } else if (href == "/radarinformation") {
            RadarbgColor = "#182445";
          } else if (href == "/commit") {
            CommitbgColor = "#182445";
          } else if (href == "/IntelligenceProcessing") {
            IntellbgColor = "#182445";
          } else {
            CommitbgColor = "#182445";
          }
        }
        break;
    }
    return (
      <Fragment>
        {/* 工具栏 */}
        {/* <BrowserRouter> */}
        <div className={styles.Info}>
          {/* 导航栏 */}
          <div className={styles.MenuBar}>
            <div className={styles.MenuTitle}>
              {/* 情报整编软件 */}
              {language[`intelligencePackageSoftware_${this.props.language.getlanguages
                }`]}
            </div>
            <div className={styles.menu}>
              <ul className={styles.clearFix}>
                <div>
                  <Link to="/" onClick={this.changeColor}>
                    <li
                      id="Commit"
                      onClick={this.toNewPage}
                      style={{ background: CommitbgColor }}
                    >
                      {/* 通信情报整编 */}
                      {language[`commitQBZB_${this.props.language.getlanguages}`]}
                    </li>
                  </Link>
                </div>
                <div>
                  <Link to="/radarinformation" onClick={this.changeColor}>
                    <li
                      id="Radar"
                      onClick={this.changeColor}
                      style={{ background: RadarbgColor }}
                    >
                      {/* 雷达情报整编 */}
                      {language[`radarQBZB_${this.props.language.getlanguages}`]}
                    </li>
                  </Link>
                </div>
                <div>
                  <Link to="/target" onClick={this.changeColor}>
                    <li
                      id="Target"
                      onClick={this.changeColor}
                      style={{ background: TargetbgColor }}
                    >
                      {/* 电子目标情报整编 */}
                      {language[`targetQBZB_${this.props.language.getlanguages}`]}
                    </li>
                  </Link>
                </div>
                <div>
                  <Link to="/all" onClick={this.changeColor}>
                    <li
                      id="All"
                      onClick={this.changeColor}
                      style={{ background: AllbgColor }}
                    >
                      {/* 综合情报整编 */}
                      {language[`allQBZB_${this.props.language.getlanguages}`]}
                    </li>
                  </Link>
                </div>
                <div>
                  <Link to="/IntelligenceProcessing" onClick={this.changeColor}>
                    <li
                      id="IntelligenceProcessing"
                      onClick={this.changeColor}
                      style={{ background: IntellbgColor }}
                    >
                      {/* 侦察情报管理 */}
                      {/* Reconnaissance */}
                      {language[`Reconnaissance_${this.props.language.getlanguages}`]}
                    </li>
                  </Link>
                </div>
                <div>
                  <li
                    id="Help"
                    onClick={this.clickHelp}
                    style={{ background: HelpbgColor }}
                    className={styles.help}
                  >
                    {/* 帮助 */}
                    {language[`assistance_${this.props.language.getlanguages}`]}
                  </li>
                </div>
              </ul>
            </div>
            <div className={styles.menuRight}>
              <div
                className={styles.languageBox}
                style={{ marginLeft: "15px", marginRight: "20px" }}
              >
                <span>
                  {language[`userName_${this.props.language.getlanguages}`]}:
                </span>
                <span>{this.state.userName}</span>
              </div>
              <div className={styles.imgBox} onClick={this.handleClose}>
                <img
                  src={require("../assets/png133_059.png")}
                  alt="图片"
                  className={styles.imagSize}
                />
              </div>
            </div>
          </div>
          <div className={styles.content}>
            {/* 路由组建 */}
            <Switch>
              <Route path="/" exact component={Commit} />
              <Route path="/commit" component={Commit} />
              <Route path="/radarinformation" component={RadarInformation} />
              <Route path="/target" component={Target} />
              <Route path="/all" component={All} />
              <Route
                path="/IntelligenceProcessing"
                component={IntelligenceProcessing}
              />
            </Switch>
          </div>
        </div>
        {/* </BrowserRouter> */}
      </Fragment>
    );
  }
}
// const UserPageComponent = dynamic({
//   app,// dva实例
//   models: () => [//models： 返回Promise， Promise返回 dva model
//     import('./models/users'),
//   ],
//   component: () => import('./routes/UserPage'),
// });
