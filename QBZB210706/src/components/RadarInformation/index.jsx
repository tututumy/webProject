import React, { Component, Fragment } from "react";
import styles from "./Radar.css";
import Fodder from "./Radar_SideBar";
import RadarType from "./RadarType";
import RecordObject from "./RecordObject";
import RadarEditPage from "./RadarEditPage";
import { Link } from "react-router-dom";
import { connect } from "dva";
import language from "../language/language";

@connect(({ language, radarModel }) => ({ language, radarModel }))
export default class RadarInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      side: null,
      RadarTypebgcolor: "#909cb9", //背景色
      Fodderbgcolor: "#909cb9", //背景色
      Recordbgcolor: "#909cb9", //背景色
      hidden: false,
      targetDetailMsg: null,
      MBImportMark: false,
      stateInput: false,
      EditMark: false,
      ZBMark: false,
      comparativeAnalysisMark: false,
      ModelMsg: null,
      objectName: "",
      clearMsg: false,
      locationHref: ""
    };
  }
  //点击素材管理
  handleClick = e => {
    this.setState({
      side: e.target.id
      // locationHref:window.location.href
    });
  };
  //点击情报整编按钮
  handleClickQBZB = e => {
    this.setState({
      side: e.target.id
    });
    // let { dispatch } = this.props;
    // dispatch({
    //     type: 'radarModel/ClickQBZB',
    //     payload: {
    //         countryName: "null",
    //         publishStatus: "null",
    //         okPublishStatus: "null",
    //     }
    // })
  };

  changeImgArea = () => {
    this.setState({
      hidden: !this.state.hidden
    });
  };

  render() {
    let { side, RadarTypebgcolor, Fodderbgcolor, Recordbgcolor } = this.state;
    let component = null;
    switch (side) {
      //雷达型号管理
      case "radarType":
        component = (
          <RadarType data={this.props.radarModel.selectRadarTypeDetails} />
        );
        RadarTypebgcolor = "#fff";
        break;
      // 素材列表
      case "fodder":
        component = <Fodder />;
        Fodderbgcolor = "#fff";
        break;
      // language[`operation_${this.props.language.getlanguages}`]
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
          component = (
            <RadarEditPage
              data={
                this.props.radarModel
                  ? this.props.radarModel.targetDetailMsg
                  : null
              } //目标库中点击编辑的数据
              autoData={this.props.radarModel.ModelMsgRight} //自动整编的数据
              objectName={this.props.radarModel.objectName}
            />
          ); //编辑页面
          Recordbgcolor = "#fff";
        }
        //新建整编对象
        else if (hrefid === "add") {
          component = (
            <RadarEditPage
              data={
                this.props.radarModel
                  ? this.props.radarModel.targetDetailMsg
                  : null
              }
              autoData={
                this.props.radarModel.ModelMsgRight
                  ? this.props.radarModel.ModelMsgRight
                  : null
              }
              objectName={this.props.radarModel.objectName}
            />
          );
          Recordbgcolor = "#fff";
        } else {
          component = <RecordObject />;
          Recordbgcolor = "#fff";
        }
        break;
      default:
        component = (
          <RadarType data={this.props.radarModel?this.props.radarModel.selectRadarTypeDetails:""} />
        );
        RadarTypebgcolor = "#fff";

        // component = <RadarType />;
        // RadarTypebgcolor = '#fff';
        break;
    }
    return (
      <Fragment>
        <div className={styles.Tool}>
          {/* 1.工具栏 */}
          <div className={styles.ToolCol}>
            {/* <div className={styles.ToolButton}> */}
            {/* 子标题*/}
            <div className={styles.ToolButton_Title}>
              <Link
                to="/radarinformation"
                replace
                style={{ color: "#bbc4da", textDecoration: "none" }}
              >
                <div
                  className={styles.ToolButtonChildTitle}
                  style={{ color: RadarTypebgcolor }}
                  onClick={this.handleClick}
                  id="radarType"
                >
                  {/* 雷达型号管理 */}
                  {language[`RadarModelManagement_${this.props.language.getlanguages}`]}
                </div>
              </Link>
              <Link
                to="/radarinformation"
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
              {/* <Link to={this.state.locationHref.indexOf("add")!="-1"?"/radarinformation?id=add":"/radarinformation"} style={{ color: "#bbc4da", textDecoration: 'none' }}> */}
              <Link
                to="/radarinformation"
                replace
                style={{ color: "#bbc4da", textDecoration: "none" }}
              >
                {/* 情报整编 */}
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
          {/* </div> */}
        </div>

        {/*2.内容区*/}
        {component}
      </Fragment>
    );
  }
}
