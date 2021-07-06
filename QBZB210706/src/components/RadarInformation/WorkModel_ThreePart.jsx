import { Table, Input, Button, Popconfirm, Form } from "antd";
import React, { Component } from "react";

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: true,
    arr: []
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
      let arr = this.state.arr;
      if (arr.indexOf(record.serid) == -1) {
        arr.push({ PLZ: values });
      }
      this.setState({ arr: arr });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return (
      //  editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`
            }
          ],
          initialValue: record[dataIndex]
        })(
          <Input
            ref={node => (this.input = node)}
            onPressEnter={this.save}
            onBlur={this.save}
          />
        )}
      </Form.Item>
      // ) : (
      //   <div
      //     className="editable-cell-value-wrap"
      //     style={{ paddingRight: 24 }}
      //     onClick={this.toggleEdit}
      //   >
      //     {children}
      //   </div>
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

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "序号",
        dataIndex: "serid",
        width: "30%"
        // editable: true,
      },
      {
        title: "频率值",
        dataIndex: "PLZ",
        editable: true
      },
      {
        title: "删除",
        dataIndex: "operation",
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => this.handleDelete(record.key)}
            >
              <a>Delete</a>
            </Popconfirm>
          ) : null
      }
    ];

    this.state = {
      dataSource: [
        // {
        //   key: '0',
        //   name: 'Edward King 0',
        //   age: '32',
        //   address: 'London, Park Lane no. 0',
        // },
        // {
        //   key: '1',
        //   name: 'Edward King 1',
        //   age: '32',
        //   address: 'London, Park Lane no. 1',
        // },
      ],
      count: 0
    };
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      serid: count,
      PLZ: ``
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1
    });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    console.log("eeeeeeeeee", newData);
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    this.setState({ dataSource: newData });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
    console.log("dataSource: ", this.state.dataSource);
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
      <div>
        <Button
          onClick={this.handleAdd}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          {language[`add_${this.props.language.getlanguages}`]}
        </Button>
        <Form>
          <Button
            onClick={this.handleSubmit}
            type="primary"
            htmlType="submit"
            style={{ marginBottom: 16 }}
          >
            {language[`save_${this.props.language.getlanguages}`]}
          </Button>
          <Table
            components={components}
            rowClassName={() => "editable-row"}
            bordered
            dataSource={dataSource}
            columns={columns}
            style={{ width: "600px" }}
          />
        </Form>
      </div>
    );
  }
}

EditableTable = Form.create({})(EditableTable);

export default EditableTable;
