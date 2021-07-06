import React, { Component, Fragment } from "react";
import styles from "./Radar.css";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { connect } from "dva";
import language from "../language/language";

@connect(({ table, language }) => ({ table, language }))
export default class View extends Component {
  render() {
    let { table } = this.props;
    return (
      <Fragment>
        <div className={styles.ContentInfo}>
          <div className={styles.Fodderinfo}>素材信息</div>
          <div className={styles.foddersubhead}>
            {language[`basicInformation_${this.props.language.getlanguages}`]}
          </div>
          <table style={{ background: "#ffff" }}>
            <tr className={styles.tableRow}>
              <td className={styles.tableCol}>
                {language[`materialNumber_${this.props.language.getlanguages}`]}
              </td>
              <td className={styles.tableColcontent}>{table.fileId}</td>
              <td className={styles.tableCol}>
                {language[`MaterialType_${this.props.language.getlanguages}`]}
              </td>
              <td className={styles.tableColcontent}>{table.type}</td>
              <td className={styles.tableCol}>
                {language[`MaterialGenerationTime_${this.props.language.getlanguages}`]}
              </td>
              <td className={styles.tableColcontent}>{table.time}</td>
            </tr>
            <tr>
              <td className={styles.tableCol}>
                {language[`materialSourceIdentification_${this.props.language.getlanguages}`]}
              </td>
              <td className={styles.tableColcontent}>
                {table.material_file_source_type_id}
              </td>
              <td className={styles.tableCol}>
                {language[`materialOriginalNumber_${this.props.language.getlanguages}`]}
              </td>
              <td className={styles.tableColcontent}>data.type</td>
              <td className={styles.tableCol}>
                {language[`MaterialSource_${this.props.language.getlanguages}`]}
              </td>
              <td className={styles.tableColcontent}>{table.source}</td>
            </tr>
            <tr>
              <td className={styles.tableCol}>
                {language[`materialName_${this.props.language.getlanguages}`]}
              </td>
              <td colspan="5" className={styles.tableCrossCol}>
                {table.name}
              </td>
            </tr>
            <tr>
              <td className={styles.tableCol}>
                {language[`MaterialStorageAddress_${this.props.language.getlanguages}`]}
              </td>
              <td colspan="5" className={styles.tableCrossCol}>
                {table.addr}
              </td>
            </tr>
            <tr>
              <td className={styles.tableColSketch}>
                {language[`BriefDescriptionOfMaterial_${this.props.language.getlanguages}`]}
              </td>
              <td colspan="5" className={styles.CrossRow}>
                {table.notes}
              </td>
            </tr>
          </table>
        </div>
        <div className={styles.Content}>
          <div className={styles.foddersubhead}>索引信息</div>
          <table style={{ background: "#ffff" }}>
            <tr className={styles.tableRow}>
              <td className={styles.tableCol}>装备型号</td>
              <td className={styles.tableColcontent}>data.id</td>
              <td className={styles.tableCol}>装备名称</td>
              <td className={styles.tableColcontent}>data.type</td>
              <td className={styles.tableCol}>国家地区</td>
              <td className={styles.tableColcontent}>data.time</td>
            </tr>
            <tr>
              <td className={styles.tableCol}>工作频段</td>
              <td className={styles.tableColcontent}>data.id</td>
              <td className={styles.tableCol}>文件名</td>
              <td className={styles.tableColcontent}>data.type</td>
              <td className={styles.tableCol} />
              <td className={styles.tableColcontent} />
            </tr>
          </table>
          <div className={styles.drag}>
            <div className={styles.foddersubhead}>附件信息</div>
            <div className={styles.fujian}>无附件信息</div>
          </div>
          <div
            style={{
              padding: "5px 5px 5px 20px",
              width: "1560px",
              height: "40px",
              float: "left"
            }}
          >
            <Link to="/radarinformation">
              <Button type="primary">
                {language[`ReturnTheMaterialList_${this.props.language.getlanguages}`]}
              </Button>
            </Link>
          </div>
          {/* <div className={styles.drag}>
                        <div className={styles.subhead}>索引信息</div>
                        <div className={styles.fujian}>无附件信息</div>
                    </div>
                    <div style={{ padding: '5px 5px 5px 20px', width: '1560px', height: '40px', float: 'left' }}>
                        <Link to="/radarinformation">
                            <Button type="primary">{language[`goBack_${this.props.language.getlanguages}`]}</Button>
                        </Link>
                    </div> */}
        </div>
      </Fragment>
    );
  }
}
