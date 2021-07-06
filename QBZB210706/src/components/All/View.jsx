import React, { Component, Fragment } from "react";
import style from "./Edit.css";
import { Link } from "react-router-dom";
import { Button } from "antd";
import language from "../language/language";
import { connect } from "dva";

@connect(({ language }) => ({ language }))
export default class View extends Component {
  render() {
    return (
      <Fragment>
        <div className={style.Content}>
          <div className={style.Fodder}>素材信息</div>
          <div className={style.foddersubhead}>
            {language[`basicInformation_${this.props.language.getlanguages}`]}
          </div>
          <table style={{ background: "#ffff" }}>
            <tr className={style.tableRow}>
              <td className={style.tableCol}>
                {language[`materialNumber_${this.props.language.getlanguages}`]}
              </td>
              <td className={style.tableColcontent} />
              <td className={style.tableCol}>
                {language[`MaterialType_${this.props.language.getlanguages}`]}
              </td>
              <td className={style.tableColcontent}>data.type</td>
              <td className={style.tableCol}>
                {language[`MaterialGenerationTime_${this.props.language.getlanguages}`]}
              </td>
              <td className={style.tableColcontent}>data.time</td>
            </tr>
            <tr>
              <td className={style.tableCol}>
                {language[`materialSourceIdentification_${this.props.language.getlanguages}`]}
              </td>
              <td className={style.tableColcontent}>data.id</td>
              <td className={style.tableCol}>
                {language[`materialOriginalNumber_${this.props.language.getlanguages}`]}
              </td>
              <td className={style.tableColcontent}>data.type</td>
              <td className={style.tableCol}>
                {language[`MaterialSource_${this.props.language.getlanguages}`]}
              </td>
              <td className={style.tableColcontent}>data.time</td>
            </tr>
            <tr>
              <td className={style.tableCol}>
                {language[`materialName_${this.props.language.getlanguages}`]}
              </td>
              <td colSpan="5" className={style.tableCrossCol}>
                data.name
              </td>
            </tr>
            <tr>
              <td className={style.tableCol}>
                {language[`MaterialStorageAddress_${this.props.language.getlanguages}`]}
              </td>
              <td colSpan="5" className={style.tableCrossCol}>
                data.address
              </td>
            </tr>
            <tr>
              <td className={style.tableColSketch}>
                {language[`BriefDescriptionOfMaterial_${this.props.language.getlanguages}`]}
              </td>
              <td colSpan="5" className={style.CrossRow}>
                data.sketch
              </td>
            </tr>
          </table>
        </div>
        <div className={style.Content}>
          <div className={style.foddersubhead}>索引信息</div>
          <table style={{ background: "#ffff" }}>
            <tr className={style.tableRow}>
              <td className={style.tableCol}>装备型号</td>
              <td className={style.tableColcontent}>data.id</td>
              <td className={style.tableCol}>装备名称</td>
              <td className={style.tableColcontent}>data.type</td>
              <td className={style.tableCol}>国家地区</td>
              <td className={style.tableColcontent}>data.time</td>
            </tr>
            <tr>
              <td className={style.tableCol}>工作频段</td>
              <td className={style.tableColcontent}>data.id</td>
              <td className={style.tableCol}>文件名</td>
              <td className={style.tableColcontent}>data.type</td>
              <td className={style.tableCol} />
              <td className={style.tableColcontent} />
            </tr>
          </table>
          <div className={style.drag}>
            <div className={style.foddersubhead}>附件信息</div>
            <div className={style.fujian}>无附件信息</div>
          </div>
          {/* <div className={style.drag}>
                        <div className={style.foddersubhead}>附件信息</div>
                        <span>无附件信息</span>
                    </div> */}
          <div
            style={{
              padding: "5px 5px 5px 20px",
              width: "1560px",
              height: "40px",
              float: "left"
            }}
          >
            <Link to="/all">
              <Button type="primary">
                {language[`ReturnTheMaterialList_${this.props.language.getlanguages}`]}
              </Button>
            </Link>
          </div>
        </div>
      </Fragment>
    );
  }
}
