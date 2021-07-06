import React, { Component, Fragment } from "react";
import styles from "./Radar.css";
import downimg from "../../assets/png133_043.png";
import leftimg from "../../assets/png133_059.png";
import Fodder from "./All_Material";
import { Link } from "react-router-dom";
import RecordObject from "./RecordObject";
import EditPage from "./ECMSpecialReport";
import ElectronicCo from "./ElectronicCo";
import EnemyReportEdit from "./EnemyReportEdit";
import language from "../language/language";
import { connect } from "dva";

@connect(({ language, All }) => ({ language, All }))
export default class All extends Component {
  constructor(props) {
    super(props);
    this.state = {
      side: null,
      Fodderbgcolor: "#909cb9", //背景色
      Recordbgcolor: "#909cb9", //背景色
      hidden: false
    };
  }

  handleClick = e => {
    this.setState({
      side: e.target.id
    });
    let { dispatch } = this.props;
    dispatch({
      type: "All/selectZBList"
    });
  };
  handleClickZB = e => {
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
    let { side, Fodderbgcolor, Recordbgcolor } = this.state;
    let component = null;
    switch (side) {
      // 素材列表
      case "fodder":
        component = <Fodder />;
        Fodderbgcolor = "#ffff";
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

        if (hrefid === "1") {
          //电子对抗专题报
          component = (
            <EditPage data={this.props.All.selectEditSpecialData_data} />
          ); //专题报页面
          Recordbgcolor = "#fff";
        } else if (hrefid === "2") {
          component = (
            <ElectronicCo data={this.props.All.selectEditSpecialData_data} />
          ); //综合报页面
          Recordbgcolor = "#fff";
        } else if (hrefid === "3") {
          component = (
            <EnemyReportEdit data={this.props.All.selectEditData_data} />
          ); //敌情报页面
          Recordbgcolor = "#fff";
        } else {
          component = <RecordObject />;
          Recordbgcolor = "#fff";
        }
        break;
      default:
        var sstrmsg = window.location.href;
        var sstrmsgg = sstrmsg.substr(
          sstrmsg.indexOf("?") + 1,
          sstrmsg.length - sstrmsg.indexOf("?")
        );
        //获取所传参数的值
        var urlid = sstrmsgg.substr(
          sstrmsgg.indexOf("=") + 1,
          sstrmsgg.length - sstrmsgg.indexOf("=")
        );
        //转码，防止编码错误
        urlid = decodeURIComponent(urlid);
        if (urlid === "1") {
          component = (
            <EditPage data={this.props.All.selectEditSpecialData_data} />
          );
          Recordbgcolor = "#ffff";
        } else if (urlid === "2") {
          component = (
            <ElectronicCo data={this.props.All.selectEditSpecialData_data} />
          );
          Recordbgcolor = "#ffff";
        } else if (urlid === "3") {
          component = (
            <EnemyReportEdit data={this.props.All.selectEditData_data} />
          );
          Recordbgcolor = "#ffff";
        } else if (urlid === "object") {
          component = <RecordObject />;
          Recordbgcolor = "#ffff";
        } else {
          component = <Fodder />;
          Fodderbgcolor = "#ffff";
        }
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
                  to="/all"
                  replace
                  style={{ color: "#bbc4da", textDecoration: "none" }}
                >
                  <div
                    className={styles.ToolButtonChildTitle}
                    style={{ color: Fodderbgcolor }}
                    onClick={this.handleClick}
                    id="fodder"
                  >
                    {/* 素材管理 */}
                    {language[`materialManagement_${this.props.language.getlanguages}`]}
                  </div>
                </Link>
                <Link
                  to="/all"
                  replace
                  style={{ color: "#bbc4da", textDecoration: "none" }}
                >
                  <div
                    className={styles.ToolButtonChildTitle}
                    style={{ color: Recordbgcolor, marginLeft: "10px" }}
                    onClick={this.handleClickZB}
                    id="recordobject"
                  >
                    {language[`ComprehensiveBGF_${this.props.language.getlanguages}`]}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/*2.内容区*/}
        {component}
      </Fragment>
    );
  }
}
