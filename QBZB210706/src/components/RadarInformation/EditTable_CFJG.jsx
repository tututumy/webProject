import React from "react";
import styles from "./Edit.css";
import { Table, Input, Form, Button, Popconfirm } from "antd";
import language from "../language/language";
import { connect } from "dva";
import styleless from "./test.less";

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
  state = {
    editing: true //设置编辑状态为可编辑,
  };

  save = e => {
    //onBlur时保存数值
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        //若编辑出错则报错，停止报错值
        return;
      }
      handleSave({ ...record, ...values }); //同步保存值到表格数据上
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: " "
            }
          ],
          initialValue: record[dataIndex],
          getValueFromEvent: event => {
            var strlen = 0;
            for (var i = 0; i < event.target.value.length; i++) {
              if (event.target.value.charCodeAt(i) > 255) strlen++;
              if (strlen > 64) {
                strlen = 64;
              }
            }
            return event.target.value.slice(0, 128 - strlen);
          }
        })(
          <Input
            ref={node => (this.input = node)}
            onPressEnter={this.save}
            onBlur={this.save}
            style={{ textAlign: "center" }}
          />
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

@connect(({ radarModel }) => ({ radarModel }))
export default class EditTable_CFJG extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "序号",
        dataIndex: "key"
      },
      {
        title: "频率值",
        dataIndex: "freq",
        editable: true
      },
      {
        title: "操作",
        dataIndex: "operation",
        render: (text, record, index) => (
          <div>
            <Popconfirm
              title="确定删除吗"
              okText="Yes"
              cancelText="No"
              className={styleless.popConfirm}
              onConfirm={() => this.handleDel_SP(record.key)}
            >
              <a to="#" type="delete" data-index={index}>
                删除
              </a>
            </Popconfirm>
          </div>
        )
      }
    ];

    this.state = {
      dataSource: [],
      count: 1
    };

    this.props.onRef(this); //父组件调用子组件的方法
  }

  componentDidMount() {
    // 调用父组件方法把当前实例传给父组件
    this.props.onRef("friends", this);
  }

  // 点击删除
  ClickDelete = key => {
    let data1 = this.props.radarModel.target_workModelMsg_SP;
    let arr_SP1 = [];
    if (this.props.radarModel.target_workModelMsg_SP != null) {
      for (let i = 0; i < data1.length; i++) {
        arr_SP1.push({
          key: i,
          freq: data1[i].freq
        });
      }
    }
    const dataSource = [...arr_SP1];
    let data = dataSource.filter(item => item.key !== key - 1);
    this.props.dispatch({
      type: "radarModel/updateTarget_workModelMsg_SP",
      payload: {
        target_workModelMsg_SP: data
      }
    });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key); //获取修改的行号
    const item = newData[index]; //拿到修改后的行数据
    // 更新数据
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    let data = newData[index]; //获取修改更新后的行数据
    this.props.dispatch({
      type: "dataManagement/ChangeLocation",
      payload: {
        id: data.key,
        location: data.location
      }
    });
    this.setState({ dataSource: newData });
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      freq: ``
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1
    });
  };

  render() {
    const { dataSource } = this.state;

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      };
    });

    return (
      <div className="friends">
        <div className={styles.tableStyle}>
          {/* <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                        Add a row
                    </Button> */}
          <div className={styles.bodyCss_query}>
            <Table
              columns={columns}
              components={components}
              dataSource={dataSource}
              className={styleless.myClassAdd_zh}
              pagination={{ pageSize: 5 }}
              rowClassName={(record, index) =>
                index % 2 === 0 ? styles.odd : styles.even
              } //奇偶行颜色交替变化
            />
          </div>
        </div>
      </div>
    );
  }
}

// import React, { Component } from 'react'
// import { Form, Input, Table, Icon, Popconfirm } from 'antd';
// import { connect } from 'dva';
// import styles from '../DataManagementDialog.less';

// class EditTable extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {

//         }
//     }

//     render() {
//         const { form } = this.props;

//         const FormItem = Form.Item;
//         const { getFieldDecorator } = form;
//         const formItemLayout = {
//             labelCol: {
//             },
//             wrapperCol: {
//                 span: 10
//             },
//         };
//         const columns = [
//             {
//                 title: '尺寸名称',
//                 dataIndex: 'key',
//                 filterDropdown: true,
//                 filterIcon: <Icon type="edit" />,
//                 render: () => <Input />,
//             },
//             {
//                 title: '标准尺寸',
//                 dataIndex: 'standard',
//                 filterDropdown: true,
//                 filterIcon: <Icon type="edit" />,
//                 // render: () => <Input />,
//                 render: (text, record) => <Input value={text} onChange={(e) => this.handleChange({ name: e.target.value }, record)} />
//             },
//             {
//                 title: '上偏差',
//                 dataIndex: 'upper_deviation',
//                 filterDropdown: true,
//                 filterIcon: <Icon type="edit" />,
//                 render: () => <Input />,
//             },
//             {
//                 title: '下偏差',
//                 dataIndex: 'lower_deviation',
//                 filterDropdown: true,
//                 filterIcon: <Icon type="edit" />,
//                 render: () => <Input />,
//             },
//             {
//                 title: '工序',
//                 dataIndex: 'procedure',
//                 filterDropdown: true,
//                 filterIcon: <Icon type="edit" />,
//                 render: () => <Input />,
//             },
//             {
//                 title: '操作',
//                 dataIndex: 'operation',
//                 // render: (text, record) => (
//                 // this.state.size.length >= 1
//                 //     ? (
//                 //         <Popconfirm title="确定删除该信息?" onConfirm={() => this.handleDelete(record.key)}>
//                 //             <a href="javascript:;">删除</a>
//                 //         </Popconfirm>
//                 //     ) : null
//                 // ),
//             }
//         ];

//         let data = [];
//         let tableData = [
//             {
//                 key: '1',
//                 standard: '1',
//                 upper_deviation: '1',
//                 lower_deviation: '1',
//                 procedure: '1',
//             }, {
//                 key: '2',
//                 standard: '2',
//                 upper_deviation: '1',
//                 lower_deviation: '1',
//                 procedure: '1',
//             },
//             {
//                 key: '3',
//                 standard: '3',
//                 upper_deviation: '1',
//                 lower_deviation: '1',
//                 procedure: '1',
//             }
//             , {
//                 key: '4',
//                 standard: '4',
//                 upper_deviation: '1',
//                 lower_deviation: '1',
//                 procedure: '1',
//             },
//             {
//                 key: '5',
//                 standard: '5',
//                 upper_deviation: '1',
//                 lower_deviation: '1',
//                 procedure: '1',
//             }
//         ];
//         for (let i = 0; i < tableData.length; i++) {
//             data.push({
//                 key: tableData[i].key,
//                 standard: tableData[i].standard,
//                 upper_deviation: tableData[i].upper_deviation,
//                 lower_deviation: tableData[i].lower_deviation,
//                 procedure: tableData[i].procedure
//             });
//         }

//         return (
//             <div style={{width:'300px'}}>
//                 <Table
//                     pagination={false}
//                     className={styles.myClass}
//                     bordered
//                     columns={columns}
//                     dataSource={data}
//                     rowClassName={(record, index) => index % 2 === 0 ? styles.odd : styles.even}
//                     // rowKey={record => record.number1}
//                 />
//             </div>

//         )
//     }

//     handleChange = (value, record) => {
//         for (var i in value) {
//             record[i] = value[i];//这一句是必须的，不然状态无法更改
//             this.setState({
//                 size: this.state.size.map((item, key) => item.key == record.key ? { ...item, [i]: value[i] } : item)
//             })
//         }
//     }

// }

// EditTable = Form.create({

//     mapPropsToFields(props) {

//     }

// })(EditTable);

// export default connect()(EditTable);
