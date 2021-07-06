import React, { Component } from "react";
import styles from "./MouseRight.less";
import { connect } from "dva";

/*
 * admin:chenkr
 * data:2019.01
 * 右击菜单
 */
@connect(({ language, All }) => ({ language, All }))
export default class MouseRightMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  check = () => {
    // alert("下发编成调整信息")
    this.props.checkItem();
  };

  check1 = e => {
    this.props.checkItem();
    let { All } = this.props;
    if (e.target.id === "1") {
      //显示对应的部队信息页面
      this.props.dispatch({
        type: "All/sendTreeMsg",
        payload: "addTroops"
      });
    } else if (e.target.id === "2") {
      this.props.dispatch({
        type: "All/sendTreeMsg",
        payload: "addZB"
      });
    }
    // let { statecheck } = this.props;
    // if (statecheck.jamAreaRecord != null) {
    //   console.log("jamAreaRecord", statecheck.jamAreaRecord)
    //   if (e.target.id === "1") {//删除干扰显示区的干扰样式
    //     if (statecheck.jamAreaRecord.jamNum === "") {
    //       // alert(language[`freestyleDELAlert${this.props.statecheck.getlanguages}`]+"!");
    //     }
    //     else {
    //       this.props.dispatch({
    //         type: 'statecheck/DelJamStyle',
    //         payload: statecheck.jamAreaRecord.jamNum
    //       });
    //     }
    //   }
    //   else if (e.target.id === "2") {//修改干扰样式
    //     if (statecheck.jamAreaRecord.jamNum === "") {
    //       // alert(language[`freestyleModifyAlert${this.props.statecheck.getlanguages}`]+"!");
    //     }
    //     else {
    //       this.props.dispatch({
    //         type: 'statecheck/ModifyJamAreaStyle',
    //         payload: statecheck.jamAreaRecord.jamNum
    //       });
    //     }
    //   }
    // }
    // if (statecheck.JamStyleAreaRecord != null) {
    //   if (e.target.id === "3") { //删除干扰方案的样式
    //     console.log("statecheck.JamStyleAreaRecord====", statecheck.JamStyleAreaRecord)
    //     if (statecheck.JamStyleAreaRecord.name === "") {
    //       // alert(language[`freeSchemeDelAlert${this.props.statecheck.getlanguages}`]+"!");
    //     }
    //     else {
    //       this.props.dispatch({
    //         type: 'statecheck/SingleDelJamStyle',
    //         payload: statecheck.JamStyleAreaRecord.name
    //       });
    //     }
    //   }
    //   if (e.target.id === "4") {//干扰方案的样式全清
    //     console.log("statecheck.JamStyleAreaRecord====", statecheck.JamStyleAreaRecord)
    //     if (statecheck.JamStyleAreaRecord.name === "") {
    //       // alert(language[`freeSchemeAlldelAlert${this.props.statecheck.getlanguages}`]+"!");
    //     }
    //     else {
    //       this.props.dispatch({
    //         type: 'statecheck/AllDelJamStyle',
    //       });
    //     }
    //   }
    // }
  };

  addMenu = item => {
    return item.map(it => {
      return (
        <div
          id={it.key}
          key={it.key}
          onClick={this.check1}
          className={styles.menuCss}
        >
          {" "}
          <span id={it.key}>{it.value}</span>
        </div>
      );
    });
  };

  render() {
    const { menuArr } = this.props;
    const menuArray =
      menuArr === undefined || menuArr === null
        ? [
            { key: 1, value: "下发编成调整信息" },
            { key: 2, value: "生成编成文件" }
          ]
        : menuArr;
    const menu = (
      <div className={styles.menumain}> {this.addMenu(menuArray)} </div>
    );
    return menu;
  }
}
