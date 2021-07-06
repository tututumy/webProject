import {
  selectZBList_aysnc,
  selectEditData_aysnc,
  ClickResultsReleased_aysnc,
  ClickResultsReleasedZH_aysnc,
  saveSpecialEditMsg_aysnc,
  SaveResultsReleasedZH_aysnc,
  selectZBColumn_aysnc,
  deleteZBColum_aysnc,
  ClickSaveBtnEnemy_aysnc,
  updateSaveBtnEnemy_aysnc,
  publish_Special_aysnc,
  publish_ElectronicCo_aysnc,
  selectElectByTime_aysnc,
  saveBasicMsg_aysnc,
  saveBasicMsg_sendToops,
  sendEquipment_aysnc,
  selectEquipNum_aysnc,
  deleteImgColumndata_send_axios,
  deleteVideoColumndata_send_axios,
  deleteHtmlColumndata_send_axios,
  deleteDocColumndata_send_axios,
  deleteCacheEnemy_aysnc,
  ClickPublishBtnEnemy_aysnc,
  OneButtonImport_aysnc,
  EditEquipmentData_aysnc,
  selectTargetModelMsg_aysnc,
  selectMaterialRepeat_axios,
  publish_ElectronicCo_json_axios,
  publish_Special_fr_aysnc,
  ClickPublishBtnEnemy_fr_aysnc,
  publish_ElectronicCo_fr_aysnc,CreateDataSpecial_axios,CreateDataZH_axios
} from "../services/allSaync";

export default {
  namespace: "All",

  state: {
    selectZBList_data: null, //点击了情报整编按钮，加载整编对象list    整编对象列表数据
    selectEditData_data: null, //点击编辑按钮，查询出来的电子对抗敌情报告数据
    selectEditData_dataMark: false, //是否点击了编辑
    selectEditSpecialData_data: null, //点击编辑按钮，查询出来的电子对抗专题报数据

    SpecialFormData_data: null, //专题报的表单是数据

    sendTreeMsg_data: null, //右键电子战斗序列的树形结构

    ElectronicTargetColumn_Special: null, //电子目标列表的信息
    ElectronicTargetColumn_Dialog_Special: null, //电子目标弹出框的信息
    imgData_Special: null, //电子对抗专题报的图片
    videoData_Special: null, //电子对抗专题报的视频
    htmlData_Special: null, //电子对抗专题报的网页
    docData_Special: null, //电子对抗专题报的文档

    saveEditDataMark: false,

    treeNodeKey: "", //树当前右键的菜单的key
    treeNodeKeyChildren: "", //树当前右键的菜单的子节点数量
    treeData: [
      //树的初始数据
      { title: "01_OperationalForce", key: "01" }
    ],
    TroopsDataList: null,
    EquipmentDataList: null,
    TargetAllData: null, //目标库中的所有数据

    SpecialId: null,
    ZHBId:null
  },

  subscriptions: {
    setup({ dispatch, history }) {}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: "save" });
    },
    //整编对象默认查询全部
    *selectZBList({ payload, callback }, { call, put }) {
      const data = yield call(selectZBList_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
        yield put({ type: "selectZBList_data", payload: data.data });
      }
    },

    // 每一行中的删除按钮
    *deleteZBColum({ payload, callback }, { call, put }) {
      const data = yield call(deleteZBColum_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },

    *EditDataEnemy({ payload, callback }, { call, put }) {
      //点击编辑查询到的数据
      const data = yield call(selectEditData_aysnc, payload);
      if (data && data.status === 200) {
        console.log("点击编辑敌情报的数据====",data.data)
        if (callback && typeof callback === "function") {
          callback(data);
        }
        yield put({ type: "selectEditData_data", payload: data.data });
      }
    },
    *EditDataSpecial({ payload, callback }, { call, put }) {
      //点击编辑查询到的专题报数据
      const data = yield call(selectEditData_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
        yield put({ type: "selectEditSpecialData_send", payload: data.data });
      }
    },

    //电子对抗专题报点击保存====新建
    *ClickResultsReleased({ payload, callback }, { call, put }) {
      const data = yield call(ClickResultsReleased_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    //电子对抗专题报点击保存====编辑
    *saveSpecialEditMsg({ payload, callback }, { call, put }) {
      const data = yield call(saveSpecialEditMsg_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
        yield put({ type: "saveSpecialEditMsg_data", payload: data.data });
      }
    },
    //电子对抗综合报点击保存====新建
    *ClickResultsReleasedZH({ payload, callback }, { call, put }) {
      const data = yield call(ClickResultsReleasedZH_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    //电子对抗综合报点击保存====编辑
    *SaveResultsReleasedZH({ payload, callback }, { call, put }) {
      const data = yield call(SaveResultsReleasedZH_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    //敌情报告新建时点击保存
    *ClickSaveBtnEnemy({ payload, callback }, { call, put }) {
      console.log("点击敌情报的保存按钮发送的参数===",payload)
      const data = yield call(ClickSaveBtnEnemy_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    //敌情报告编辑时点击保存
    *updateSaveBtnEnemy({ payload, callback }, { call, put }) {
      const data = yield call(updateSaveBtnEnemy_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },

    // 综合整编点击"查询"按钮
    *selectZBColumn({ payload, callback }, { call, put }) {
      const data = yield call(selectZBColumn_aysnc, payload);
      yield put({ type: "selectZBList_data", payload: data.data });
    },
    *publish_Special({ payload, callback }, { call, put }) {
      const data = yield call(publish_Special_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *publish_Special_fr({ payload, callback }, { call, put }) {
      const data = yield call(publish_Special_fr_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *publish_ElectronicCo({ payload, callback }, { call, put }) {
      //综合报成果发布成pdf====中文版
      const data = yield call(publish_ElectronicCo_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *publish_ElectronicCo_fr({ payload, callback }, { call, put }) {
      //综合报成果发布成pdf====法文版
      const data = yield call(publish_ElectronicCo_fr_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    //根据开始时间和结束时间查询电子目标
    *selectElectByTime({ payload, callback }, { call, put }) {
      const data = yield call(selectElectByTime_aysnc, payload);
      if (data && data.status === 200) {
        yield put({ type: "selectElectByTime_data", payload: data.data[0] });
      }
    },
    //点击电子战斗序列的部队的保存按钮 先对基本信息进行保存
    *saveBasicMsg({ payload, callback }, { call, put }) {
      const data = yield call(saveBasicMsg_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *sendToops({ payload, callback }, { call, put }) {
      const data = yield call(saveBasicMsg_sendToops, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *sendEquipment({ payload, callback }, { call, put }) {
      yield call(sendEquipment_aysnc, payload);
    },
    *selectEquipNum({ payload, callback }, { call, put }) {
      const data = yield call(selectEquipNum_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *deleteCacheEnemy({ payload, callback }, { call, put }) {
      yield call(deleteCacheEnemy_aysnc, payload);
    },
    *ClickPublishBtnEnemy({ payload, callback }, { call, put }) {
      //敌情报告的成果发布==中文版pdf
      const data = yield call(ClickPublishBtnEnemy_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *ClickPublishBtnEnemy_fr({ payload, callback }, { call, put }) {
      //敌情报告的成果发布===法文版pdf
      const data = yield call(ClickPublishBtnEnemy_fr_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *OneButtonImport({ payload, callback }, { call, put }) {
      //一键导入
      const data = yield call(OneButtonImport_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *EditEquipmentData({ payload, callback }, { call, put }) {
      //查询装备的具体信息
      const data = yield call(EditEquipmentData_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *selectTargetModelMsg({ payload, callback }, { call, put }) {
      //目标库弹出框中查询
      const data = yield call(selectTargetModelMsg_aysnc, payload);
      if (data.status === 200)
        if (callback && typeof callback === "function") {
          callback(data);
        }
    },
    *selectMaterialRepeat({ payload, callback }, { call, put }) {
      //查询素材名称是否重复
      const data = yield call(selectMaterialRepeat_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *publish_ElectronicCo_json({ payload, callback }, { call, put }) {
      //点击综合报成果发布成json
      const data = yield call(publish_ElectronicCo_json_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *CreateDataSpecial({ payload, callback }, { call, put }) {
      //点击创建专题报
      const data = yield call(CreateDataSpecial_axios, payload);
      if (data&&data.data) {
        yield put({ type: "CreateDataSpecial_data", payload: data.data[0] });
      }
    },
    *CreateDataZH({ payload, callback }, { call, put }) {
      //点击创建综合报
      const data = yield call(CreateDataZH_axios, payload);
      if (data&&data.data) {
        yield put({ type: "CreateDataZH_data", payload: data.data[0] });
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    //点击了情报整编按钮，加载整编对象list
    selectZBList_data(state, { payload }) {
      return {
        ...state,
        selectZBList_data: payload
      };
    },
    selectEditSpecialData_send(state, { payload }) {
      return {
        ...state,
        selectEditData_dataMark: true,
        selectEditSpecialData_data: payload[0][0],
        ElectronicTargetColumn_Special: payload[1],
        imgData_Special: payload[2],
        videoData_Special: payload[3],
        htmlData_Special: payload[4],
        docData_Special: payload[5]
      };
    },
    selectEditData_data(state, { payload }) {
      console.log("dddddddddddddd", payload[2]);
      return {
        ...state,
        selectEditData_dataMark: true,
        selectEditData_data: payload[0][0],
        treeData: JSON.parse(payload[1]),
        imgData_Special: payload[3],
        videoData_Special: payload[4],
        htmlData_Special: payload[5],
        docData_Special: payload[6],
        TroopsDataList: payload[2].enemyEquList,
        EquipmentDataList: payload[2].enemyAList
      };
    },
    sendTreeMsg(state, { payload }) {
      return {
        ...state,
        sendTreeMsg_data: payload
      };
    },
    clearSpecialMsg(state, { payload }) {
      return {
        ...state,
        treeData: [
          //树的初始数据
          { title: "01_OperationalForce", key: "01" }
        ],
        TroopsDataList: null,
        EquipmentDataList: null,
        selectEditData_data: null,
        selectEditSpecialData_data: null,
        imgData_Special: null, //电子对抗专题报的图片
        videoData_Special: null, //电子对抗专题报的视频
        htmlData_Special: null, //电子对抗专题报的网页
        docData_Special: null, //电子对抗专题报的文档
        ElectronicTargetColumn_Special: null,
        SpecialId: null,
        ZHBId:null
      };
    },
    clearAllMsg(state, { payload }) {
      return {
        ...state,
        selectEditData_data: null,
        selectEditData_dataMark: false
      };
    },
    saveSpecialEditMsg_data(state, { payload }) {
      return {
        ...state,
        saveEditDataMark: true
      };
    },

    // 相关资料中的选用素材中点击确定
    insertImgData_Special(state, { payload }) {
      return {
        ...state,
        imgData_Special: payload.dataSource
      };
    },
    insertVideoData_Special(state, { payload }) {
      return {
        ...state,
        videoData_Special: payload.dataSource
      };
    },
    insertHtmlData_Special(state, { payload }) {
      return {
        ...state,
        htmlData_Special: payload.dataSource
      };
    },
    insertDocData_Special(state, { payload }) {
      return {
        ...state,
        docData_Special: payload.dataSource
      };
    },
    deleteImgColumndata(state, { payload }) {
      return {
        ...state,
        imgData_Special: payload
      };
    },
    deleteVideoColumndata(state, { payload }) {
      return {
        ...state,
        videoData_Special: payload
      };
    },
    deleteHtmlColumndata(state, { payload }) {
      return {
        ...state,
        htmlData_Special: payload
      };
    },
    deleteDocColumndata(state, { payload }) {
      return {
        ...state,
        docData_Special: payload
      };
    },
    deleteElectronicTargetColumn_Special(state, { payload }) {
      return {
        ...state,
        ElectronicTargetColumn_Special: payload
      };
    },
    clearSpecialRelateMsg(state, { payload }) {
      return {
        ...state,
        imgData_Special: null,
        videoData_Special: null,
        htmlData_Special: null,
        docData_Special: null,
        ElectronicTargetColumn_Special: null,
        selectEditData_dataMark: false,
        selectEditData_data: null
      };
    },
    insetElectronicTargetColumn_Special(state, { payload }) {
      //导入电子目标
      return {
        ...state,
        ElectronicTargetColumn_Special: payload.dataSource
      };
    },

    saveSpecialormMsg(state, { payload }) {
      //导入电子目标的确定按钮===将表单的数据保存一下
      return {
        ...state,
        selectEditSpecialData_data: payload,
        selectEditData_data: payload
      };
    },
    selectElectByTime_data(state, { payload }) {
      //电子目标按照时间查询
      return {
        ...state,
        ElectronicTargetColumn_Dialog_Special: payload
      };
    },

    saveTreeNodeKey(state, { payload }) {
      //树节点的右键操作
      return {
        ...state,
        treeNodeKey: payload.key,
        treeNodeKeyChildren: payload.length
      };
    },
    saveTreeData(state, { payload }) {
      //树节点的右键操作
      return {
        ...state,
        treeData: payload
      };
    },
    saveTroopsData(state, { payload }) {
      //保存部队的信息
      return {
        ...state,
        TroopsDataList: payload
      };
    },
    saveEquipmentData(state, { payload }) {
      //保存装备的信息
      return {
        ...state,
        EquipmentDataList: payload
      };
    },
    CreateDataSpecial_data(state, { payload }) {
      console.log("payload====",payload)
      //保存专题报的标识
      return {
        ...state,
        SpecialId: payload
      };
    },
    CreateDataZH_data(state, { payload }) {
      //保存综合报的标识
      return {
        ...state,
        ZHBId: payload
      };
    },
  }
};
