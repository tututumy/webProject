import React, { Component, Fragment } from "react";
import styles from "./Radar.css";
import Fodder from "./Target_Material";
import RecordObject from "./RecordObject";
import SkyEditPage from "./Target_EditPage";
import TargetType from "./TargetType";
import { Link } from "dva/router";
import { connect } from "dva";
import language from "../language/language";

@connect(({ language, ElectronicTarget }) => ({ language, ElectronicTarget }))
export default class Target extends Component {
  constructor(props) {
    super(props);
    this.state = {
      side: null,
      targetTypebgcolor: "#909cb9", //背景色
      Fodderbgcolor: "#909cb9", //背景色
      Recordbgcolor: "#909cb9", //背景色
      hidden: false
    };
  }
  //点击素材管理
  handleClick = e => {
    this.setState({
      side: e.target.id
    });
  };
  handleClickQBZB = e => {
    this.setState({
      side: e.target.id
    });
  };

  changeImgArea = () => {
    this.setState({
      hidden: !this.state.hidden
    });
  };

  render() {
    let { side, targetTypebgcolor, Fodderbgcolor, Recordbgcolor } = this.state;
    let component = null;
    switch (side) {
      // 素材列表
      case "targetType":
        component = (
          <TargetType
            data={this.props.ElectronicTarget.selectTargetTypeDetails}
          />
        );
        targetTypebgcolor = "#fff";
        break;
      case "fodder":
        component = <Fodder />;
        Fodderbgcolor = "#fff";
        break;
      case "recordobject":
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
        if (hrefid === "edit") {
          component = <SkyEditPage />;
          Recordbgcolor = "#fff";
        } else if (hrefid === "add") {
          component = <SkyEditPage />;
          Recordbgcolor = "#fff";
        } else {
          component = <RecordObject />;
          Recordbgcolor = "#fff";
        }
        break;
      default:
        component = (
          <TargetType
            data={this.props.ElectronicTarget.selectTargetTypeDetails}
          />
        );
        targetTypebgcolor = "#fff";
        break;
    }
    return (
      <Fragment>
        {/* 1.工具栏 */}
        <div className={styles.Tool}>
          <div className={styles.ToolCol}>
            <div className={styles.ToolButton}>
              {/* 子标题*/}
              <div className={styles.ToolButton_Title}>
                <Link
                  to="/target"
                  replace
                  style={{ color: "#bbc4da", textDecoration: "none" }}
                >
                  <div
                    className={styles.ToolButtonChildTitle}
                    style={{ color: targetTypebgcolor }}
                    onClick={this.handleClick}
                    id="targetType"
                  >
                    {/* 平台型号管理 */}
                    {language[`PlatformModelManagement_${
                          this.props.language.getlanguages
                        }`
                      ]
                    }
                  </div>
                </Link>
                <Link
                  to="/target"
                  replace
                  style={{ color: "#bbc4da", textDecoration: "none" }}
                >
                  <div
                    className={styles.ToolButtonChildTitle}
                    style={{ color: Fodderbgcolor }}
                    onClick={this.handleClick}
                    id="fodder"
                  >
                    {language[`materialManagement_${this.props.language.getlanguages}`]}
                  </div>
                </Link>
                <Link
                  to="/target"
                  replace
                  style={{ color: "#bbc4da", textDecoration: "none" }}
                >
                  <div
                    className={styles.ToolButtonChildTitle}
                    style={{ color: Recordbgcolor, marginLeft: "10px" }}
                    onClick={this.handleClickQBZB}
                    id="recordobject"
                  >
                    {language[`theBGFObject_${this.props.language.getlanguages}`]}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 2.内容区 */}
        {component}
      </Fragment>
    );
  }
}
