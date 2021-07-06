import React, { PureComponent } from "react";
import { Button, Icon } from "antd";
import styles from "./Dialog.less";
import { connect } from "dva";
import language from "../components/language/language";

/**
 * admin:chenkr
 * data:2019.01
 * 弹窗、对话框
 */
@connect(({ language }) => ({ language }))
export default class Dialog extends PureComponent {
  // 弹窗
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const {
      OkText,
      CancleText,
      TitleText,
      BodyContent,
      showFooter,
      showMask,
      showDialog
    } = this.props;

    const OkText1 =
      OkText === undefined || OkText === "" || OkText === null
        ? language[`confirm_${this.props.language.getlanguages}`]
        : OkText;
    const CancleText1 =
      CancleText === undefined || CancleText === "" || CancleText === null
        ? language[`cancel_${this.props.language.getlanguages}`]
        : CancleText;
    const TitleText1 =
      TitleText === undefined || TitleText === "" || TitleText === null
        ? "告警信息"
        : TitleText;
    const BodyContent1 =
      BodyContent === undefined || BodyContent === "" || BodyContent === null
        ? "请定义你的内容!"
        : BodyContent;
    const showFooter1 = showFooter === true ? "block" : "none";
    const showMask1 = showMask === true ? "unset" : "none";
    const showDialog1 = showDialog === true ? "block" : "none";
    // const showDialog1 = showDialog === true?'visible':'hidden'
    // const mask = { position:'absolute', top:0,left:0,right:0,bottom:0, height:'100%', width:'100%', background:'#000', opacity:0.4, zIndex:97, display:`${showMask1}`};
    //tmy 修改之后的
    const mask = {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      height: "100%",
      width: "100%",
      background: "#000",
      opacity: 0.4,
      zIndex: 97,
      display: `${showMask1}`
    };
    // const mainCss1 = { display: `${showDialog1}`, zIndex: 140, position: 'absolute', width: '100%', height: 1080 };
    const mainCss1 = {
      display: `${showDialog1}`,
      zIndex: 140,
      position: "absolute",
      top: "100px",
      left: "50%"
    };
    const contentCss = {
      zIndex: 99,
      position: "relative",
      transform: "translateY(50%)"
    };

    return (
      <div style={mainCss1} className={this.props.className}>
        <div
          role="document"
          className={styles.modal}
          style={{
            contentCss,
            position: "fixed",
            width: "1920px",
            height: "100%",
            left: 0,
            top: 0,
            zIndex: 999
          }}
        >
          <div
            className={styles["modal-content"]}
            style={{ height: "700px", overflowY: "scroll" }}
          >
            <Button
              aria-label="Close"
              className={styles["modal-close"]}
              onClick={this.props.onCancel}
            >
              {/* <span className={styles["modal-close-x"]} /> */}
              <Icon
                type="close"
                style={{
                  color: "#fff",
                  width: "10px",
                  height: "10px",
                  marginTop: "10px",
                  marginRight: "6px",
                  marginBottom: "10px"
                }}
              />
            </Button>
            <div className={styles["modal-header"]}>
              <div id="DialogTitle" className={styles["modal-title"]}>
                {TitleText1}
              </div>
            </div>
            <div
              id="body"
              className={styles["modal-body"]}
              style={{ height: this.props.bHeight }}
            >
              {BodyContent1}
            </div>
            <div
              id="footer"
              className={styles["modal-footer"]}
              style={{ display: `${showFooter1}` }}
            >
              <Button onClick={this.props.onCancel}>{CancleText1}</Button>
              <Button onClick={this.props.onOk} disabled={this.props.Disabled}>
                {OkText1}
              </Button>
            </div>
          </div>
        </div>
        <div style={mask} />
      </div>
    );
  }
}
