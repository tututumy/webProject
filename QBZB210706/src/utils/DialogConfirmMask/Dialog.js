import React, { PureComponent } from "react";
import { Button, Icon } from "antd";
import styles from "./Dialog.less";
import { connect } from "dva";
import language from "../../components/language/language";

/**
 * 弹窗、对话框
 */
@connect(({ language }) => ({ language }))
export default class Dialog extends PureComponent {
  // 弹窗
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    let count = this.state.count;
    if (this.props.showDialog == true) {
      count++;
    }
    this.setState({ count: count }, function() {
      if (this.state.count > 0) {
        document.body.style.overflow = "hidden";
      } else if (this.state.count == 0) {
        document.body.style.overflow = "scroll";
      }
    });
  }

  componentWillUnmount() {
    document.body.style.overflow = "scroll";
  }

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
        ? ""
        : TitleText;
    const BodyContent1 =
      BodyContent === undefined || BodyContent === "" || BodyContent === null
        ? "请定义你的内容!"
        : BodyContent;
    const showFooter1 = showFooter === true ? "block" : "none";
    const showMask1 = showMask === true ? "unset" : "none";
    const showDialog1 = showDialog === true ? "block" : "none";
    const mask = {
      position: "absolute",
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
    const mainCss1 = {
      display: `${showDialog1}`,
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 1052,
      overflow: "auto",
      outline: 0
    };
    const contentCss = {
      boxSizing: "border-box",
      margin: 0,
      padding: 0,
      color: "rgba(0, 0, 0, 0.65)",
      fontSize: "14px",
      fontVariant: "tabular-nums",
      lineHeight: 1.5,
      listStyle: "none",
      position: "relative",
      top: "100px",
      width: "auto",
      margin: "0 auto"
    };
    const antModelMask = {
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 1052,
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.45)"
    };
    return (
      <div>
        <div style={{ antModelMask }} />
        <div style={mainCss1} className={this.props.className}>
          <div role="document" className={styles.modal} style={{ contentCss }}>
            <div
              className={styles["modal-content"]}
              style={{ width: this.props.Width, height: this.props.height }}
            >
              <Button
                aria-label="Close"
                className={styles["modal-close"]}
                onClick={this.props.onCancel}
              >
                <Icon
                  type="close"
                  style={{
                    color: "#fff",
                    width: "10px",
                    height: "10px",
                    marginTop: "-2px",
                    marginRight: "6px",
                    marginBottom: "10px"
                  }}
                />
              </Button>
              {/* <div className={styles["modal-header"]}>
              <div id="DialogTitle" className={styles["modal-title"]}>{TitleText1}</div>
            </div> */}
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
                <Button
                  onClick={this.props.onOk}
                  disabled={this.props.Disabled}
                >
                  {OkText1}
                </Button>
              </div>
            </div>
          </div>
          <div style={mask} />
        </div>
      </div>
    );
  }
}
