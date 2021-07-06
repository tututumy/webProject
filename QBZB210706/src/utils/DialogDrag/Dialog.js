import React from "react";
import Draggable from "react-draggable";
import PropTypes from "prop-types";
import "./Dialog.less";

// const screenWidth = 1920;
// // const screenHeight = 1080;
// const screenHeight = this.props.screenHeight?this.props.screenHeight:1080;
let screenWidth = null;
let screenHeight = null;
function isEmpty(data) {
  if (data === "" || data === null || typeof data === "undefined") {
    return true;
  }
  return false;
}

class Dialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      activeDrags: 0,
      controlledPosition: {
        x: 0,
        y: 0
      },
      boundRight: null,
      boundBottom: null,
      isOK: false,
      flag: true
    };
    this.divSize = ref => {
      this.refDom = ref;
    };
  }

  UNSAFE_componentWillReceiveProps( nextprops ) {
    console.log("nextprops====",nextprops)
    if (nextprops && !isEmpty(nextprops.visible)) {
      this.setState({ visible: nextprops.visible });
    }

    // if (nextprops) {
    //   screenWidth = 1920;
    //   // const screenHeight = 1080;
    //   //屏幕高度
    //   screenHeight = nextprops.screenHeight ? nextprops.screenHeight : 1080;
  
    //   let _count = 0;
  
    //   this.timer = setInterval(() => {
    //     if (_count > 0) {
    //       clearInterval(this.timer);
    //       return;
    //     }
    //     if (this.refDom) {
    //       const { clientWidth, clientHeight } = this.refDom;
    //       this.setState({
    //         controlledPosition: {
    //           //弹出框在页面上的位置
    //           x: Math.round(screenWidth / 2 - clientWidth / 2),
    //           // y:Math.round(screenHeight/2-clientHeight/2)
    //           y: nextprops.TOP
    //             ? Number(nextprops.TOP)
    //             : Math.round(screenHeight / 2 - clientHeight / 2)
    //         },
    //         isOK: true
    //       });
    //       _count++;
    //     }
    //   }, 2);
    // }
  }
  

  componentDidMount() {
    this.setState({ visible: this.props.visible });
    console.log("加载了=============")
    //屏幕宽度
    screenWidth = 1920;
    // const screenHeight = 1080;
    //屏幕高度
    screenHeight = this.props.screenHeight ? this.props.screenHeight : 1080;

    let _count = 0;

    this.timer = setInterval(() => {
      if (_count > 0) {
        clearInterval(this.timer);
        return;
      }
      if (this.refDom) {
        const { clientWidth, clientHeight } = this.refDom;
        this.setState({
          controlledPosition: {
            //弹出框在页面上的位置
            x: Math.round(screenWidth / 2 - clientWidth / 2),
            // y:Math.round(screenHeight/2-clientHeight/2)
            y: this.props.TOP
              ? Number(this.props.TOP)
              : Math.round(screenHeight / 2 - clientHeight / 2)
          },
          isOK: true
        });
        _count++;
      }
    }, 2);
  }

  controlledPosition = (e, position) => {
    //拖动弹出框
    const { x, y } = position;
    this.setState({ controlledPosition: { x, y } });
    const { clientWidth, clientHeight } = this.refDom;
    this.setState({ boundRight: screenWidth - clientWidth });
    this.setState({ boundBottom: screenHeight - clientHeight });
  };

  //关闭弹出框
  close = e => {
    this.props.close(e);
  };

  minimize = e => {
    this.setState({ flag: !this.state.flag }, function () {
      //flag为true的时候为最大化   flag为false的时候为最小化
      this.props.minimize(this.state.flag);
    });
  };

  render() {
    const { title, children } = this.props;
    const { controlledPosition, boundRight, boundBottom, isOK } = this.state;
    const dialog = this.state.visible ? (
      <Draggable
        handle="strong"
        position={controlledPosition}
        onDrag={this.controlledPosition}
        bounds={{
          top: Number(this.props.TOTOP) ? Number(this.props.TOTOP) : 0,
          left: 0,
          right: boundRight,
          bottom: boundBottom
        }}
      >
        <div
          className="ch_dialog_box ch_dialog_no-cursor"
          style={{ position: "absolute", opacity: isOK ? 1 : 0, zIndex: 1000 }}
          ref={this.divSize}
        >
          <strong className="ch_dialog_cursor">
            <div className="ch_dialog_title">
              {title}
              <div //关闭按钮
                style={{
                  float: "right",
                  height: "16px",
                  width: "16px",
                  marginTop: "7px",
                  marginBottom: "7px",
                  marginRight: "6px",
                  textAlign: "center",
                  lineHeight: "16px",
                  color: "#ffffff",
                  cursor: "pointer"
                }}
                onClick={this.close.bind(this)}
              >
                <svg
                  viewBox="64 64 896 896"
                  data-icon="close"
                  width="10px"
                  height="10px"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />
                </svg>
              </div>

              <div //最小化最大化按钮
                style={{
                  display: this.props.minimize ? "inline-block" : "none",
                  float: "right",
                  height: "16px",
                  width: "16px",
                  marginTop: "7px",
                  marginBottom: "7px",
                  marginRight: "6px",
                  textAlign: "center",
                  lineHeight: "16px",
                  color: "#ffffff",
                  cursor: "pointer"
                }}
                onClick={this.minimize.bind(this)}
              >
                <svg
                  t="1576481279159"
                  display={this.state.flag ? "inline-block" : "none"}
                  className="icon"
                  fill="currentColor"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  p-id="875"
                  width="10px"
                  height="10px"
                >
                  <defs>
                    <style type="text/css" />
                  </defs>
                  <path
                    d="M298.49 680.255H119.834c-17.673 0-32-14.327-32-32 0-17.673 14.327-32 32-32h256c17.673 0 32 14.327 32 32v256c0 17.673-14.327 32-32 32-17.673 0-32-14.327-32-32V725.42L118.627 950.627c-12.496 12.497-32.758 12.497-45.254 0-12.497-12.496-12.497-32.758 0-45.254L298.49 680.255z m426.93-336.42h178.835c17.673 0 32 14.326 32 32 0 17.672-14.327 32-32 32h-256c-17.673 0-32-14.328-32-32v-256c0-17.674 14.327-32 32-32 17.673 0 32 14.326 32 32V298.49L905.373 73.373c12.496-12.497 32.758-12.497 45.254 0 12.497 12.496 12.497 32.758 0 45.254L725.421 343.834zM680.256 725.51v178.745c0 17.673-14.327 32-32 32-17.673 0-32-14.327-32-32v-256c0-17.673 14.327-32 32-32h256c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32H725.51l225.117 225.118c12.497 12.496 12.497 32.758 0 45.254-12.496 12.497-32.758 12.497-45.254 0L680.255 725.51z m-336.42-426.93V119.833c0-17.673 14.326-32 32-32 17.672 0 32 14.327 32 32v256c0 17.673-14.328 32-32 32h-256c-17.674 0-32-14.327-32-32 0-17.673 14.326-32 32-32h178.744L73.373 118.627c-12.497-12.496-12.497-32.758 0-45.254 12.496-12.497 32.758-12.497 45.254 0l225.207 225.206z"
                    p-id="876"
                  />
                </svg>

                <svg
                  t="1576482496498"
                  display={!this.state.flag ? "inline-block" : "none"}
                  className="icon"
                  fill="currentColor"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  p-id="1236"
                  width="10px"
                  height="10px"
                >
                  <defs>
                    <style type="text/css" />
                  </defs>
                  <path
                    d="M320 128 64 128C25.6 128 0 102.4 0 64l0 0c0-38.4 25.6-64 64-64l256 0c38.4 0 64 25.6 64 64l0 0C384 102.4 358.4 128 320 128z"
                    p-id="1237"
                  />
                  <path
                    d="M0 320l0-256c0-38.4 25.6-64 64-64l0 0c38.4 0 64 25.6 64 64l0 256c0 38.4-25.6 64-64 64l0 0C25.6 384 0 358.4 0 320z"
                    p-id="1238"
                  />
                  <path
                    d="M0 960l0-256c0-38.4 25.6-64 64-64l0 0c38.4 0 64 25.6 64 64l0 256c0 38.4-25.6 64-64 64l0 0C25.6 1024 0 998.4 0 960z"
                    p-id="1239"
                  />
                  <path
                    d="M320 1024 64 1024c-38.4 0-64-25.6-64-64l0 0c0-38.4 25.6-64 64-64l256 0c38.4 0 64 25.6 64 64l0 0C384 998.4 358.4 1024 320 1024z"
                    p-id="1240"
                  />
                  <path
                    d="M704 128l256 0c38.4 0 64-25.6 64-64l0 0c0-38.4-25.6-64-64-64l-256 0c-38.4 0-64 25.6-64 64l0 0C640 102.4 665.6 128 704 128z"
                    p-id="1241"
                  />
                  <path
                    d="M1024 320 1024 64c0-38.4-25.6-64-64-64l0 0c-38.4 0-64 25.6-64 64l0 256c0 38.4 25.6 64 64 64l0 0C998.4 384 1024 358.4 1024 320z"
                    p-id="1242"
                  />
                  <path
                    d="M1024 960l0-256c0-38.4-25.6-64-64-64l0 0c-38.4 0-64 25.6-64 64l0 256c0 38.4 25.6 64 64 64l0 0C998.4 1024 1024 998.4 1024 960z"
                    p-id="1243"
                  />
                  <path
                    d="M704 1024l256 0c38.4 0 64-25.6 64-64l0 0c0-38.4-25.6-64-64-64l-256 0c-38.4 0-64 25.6-64 64l0 0C640 998.4 665.6 1024 704 1024z"
                    p-id="1244"
                  />
                </svg>
              </div>
            </div>
          </strong>
          <div className="ch_dialog_content">
            <div style={{ textAlign: "center" }}>{children}</div>
          </div>
        </div>
      </Draggable>
    ) : null;

    return dialog;
  }
}

Dialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string,
  close: PropTypes.func.isRequired
};

export default Dialog;
