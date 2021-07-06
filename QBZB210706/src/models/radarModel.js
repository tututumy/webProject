import {
  RadarModelMsg,
  WorkModelDetailMsg,
  RadarColumnsMsg,
  TargetColumnsMsg,
  select_TargetColumnsMsg,
  TargetModelMsg,
  ClickQBZB_axios,
  EditZBColum_axios,
  deleteZBColum_axios,
  update_target_WorkModel_main_axios,
  saveWorkModel_threePart_SP_axios,
  saveWorkModel_threePart_MK_axios,
  saveWorkModel_threePart_CFJG_axios,
  update_target_WorkModel_MNTZ_axios,
  ZBStart_send_axios,
  save_target_allData_axios,
  deleteWorkModel_axios,
  deleteCache_axios,
  publish_target_allData_axios,
  updateImgData_Special_axios,
  updateVideoData_Special_axios,
  updateHtmlData_Special_axios,
  updateDocData_Special_axios,
  deleteImgColumndata_send_axios,
  deleteVideoColumndata_send_axios,
  deleteHtmlColumndata_send_axios,
  deleteDocColumndata_send_axios,
  update_target_WorkModel_MNTZ_data_axios,
  selectAllChartsList_axios,
  selectInsertFromTargetChartsMsg_axios,
  updateAndSelectChartsData_axios,
  deleteCharts_axios,
  selectOnlyLookData_axios,
  selectRadarTypeRepeatName_axios,
  addRadarTechnicalParam_axios,
  selectAllRadarTypeData_axios,
  deleteRadarType_axios,
  selectRadarType_axios,
  selectRadarTypeDetails_axios,
  selectMaterialRepeat_axios,
  updateRadarTechnicalParam_axios,
  SelectDetailFreqPwPri_axios,
  select_ContinWave_axios,
  selectIsOrNotZB_axios
} from "../services/radarSaync";

export default {
  namespace: "radarModel",

  state: {
    ModelMsgRight: "", //雷达模块  从侦察情报库导入的数据后点击自动整编
    ModelMsg: null, //雷达模块  从侦察情报库导入的数据

    targetDetailMsg: null, //查询到的======目标库中的数据
    ZBMark: false, //整编标识
    DBFX: null, //对比分析的标识
    showRadarMsg: false,
    clearMsg: false, //雷达情报整编组件unmount
    WorkModelMsg_ZCMark: false, //侦察情报库中的工作模式列是否被点击标识
    WorkModelMsg_MBMark: true, //目标库中的工作模式列是否被点击标识
    MBImportMark: false, //从目标库导入标识

    targetWorkModel_fromTar: null, //目标库点击工作模式出现的数据
    WorkModelMsg_Target: null, //自动整编点击工作模式出现的数据

    //目标库中工作模式部分内容,这个值要在整编之后，点击了工作模式行之后才有值
    target_workModelMsg_Main: null,
    target_workModelMsg_SP: null, //射频的内容
    target_workModelMsg_MK: null, //脉宽的内容
    target_workModelMsg_CFJG: null, //重复间隔的内容

    WorkModelMsg: "", //侦察情报库点击工作模式出现的数据
    ClickQBZB_Msg: null, //点击情报整编查询出来的整编列表
    comparativeAnalysisMark: false, //对比分析标识
    EditMark: false, //点击了编辑按钮
    allMsg: "", //form中的所有数据
    radarName: "", //目标库的雷达目标名称
    radarType: "", //目标库的雷达目标型号
    objectName: "",
    WorkMode_Msg: null, //雷达情报工作模式添加的数据
    WorkMode_flag: false, //雷达情报工作模式添加的数据成功标志位，true添加成功

    RadarName: null, //目标库导入得内容页面的雷达目标名称
    sn: 0, //区分要保存的数据是编辑或者从目标库导入的或者手动输入的
    seleleZBList_choise: ["null", "null", "null"],
    ZCSignMsg_data: null, //素材点击侦察信号数据查询出来的数据
    MarkSideBar: false, //查看侦察信号文件点击返回素材列表

    ChartsList: null, //侦察信号文件的集合(弹出框里查询出来的)
    sourceOfRadiationList: null, //页面上显示的侦察信号文件
    ChartsJSONList: null, //页面上的请求回来的图表json数据
    ChartsJSONListMark: false,
    ChartsJSONListLast: null,
    selectRadarTypeDetails: null, //雷达型号对应的具体信息

    ActiveKey: null, //关闭样本的时候将保存实时activityKey

    totalCount: "",
    ZCtotalCount: "",

    deleteMark: false,  //射频数据是否触发了删除
    deleteMark_MK: false,  //脉宽数据是否触发了删除
    deleteMark_CFJG: false,  //脉宽数据是否触发了删除
  },

  subscriptions: {
    setup({ dispatch, history }) { }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: "save" });
    },
    //点击从侦察情报库导入的模态框中的确定
    *selectRadarModelMsg({ payload }, { call, put }) {
      const radarData = yield call(RadarModelMsg, payload);
      if (radarData && radarData.status === 200) {
        yield put({ type: "sendRadarModelMsg", payload: radarData.data });
      }
    },
    //从侦察情报库中导入的内容=====点击工作模式中的列
    *selectWorkModelDetailMsg({ payload }, { call, put }) {
      const WorkModelMsg = yield call(WorkModelDetailMsg, payload);
      if (WorkModelMsg && WorkModelMsg.status === 200) {
        yield put({ type: "sendWorkModelMsg", payload: WorkModelMsg.data });
      }
    },
    //根据筛选条件查询雷达弹出框中的列
    *selectRadarColumnsMsg({ payload, callback }, { call, put }) {
      const RadarColumns = yield call(RadarColumnsMsg, payload);
      if (RadarColumns && RadarColumns.status === 200) {
        yield put({ type: "sendRadarColumnsMsg", payload: RadarColumns.data });
        if (callback && typeof callback === "function") {
          callback(RadarColumns.data)
        }

      }
    },
    *importFromTarget({ payload }, { call, put }) {
      const TargetColumns = yield call(TargetColumnsMsg, payload);
      if (TargetColumns && TargetColumns.status === 200) {
        yield put({ type: "selectTargetColumns", payload: TargetColumns.data });
      }
    },
    //根据筛选条件查询目标弹出框中的列
    *selectTargetColumnsMsg({ payload }, { call, put }) {
      const TargetColumns_select = yield call(select_TargetColumnsMsg, payload);
      if (TargetColumns_select && TargetColumns_select.status === 200) {
        yield put({
          type: "sendTargetColumnsMsg",
          payload: TargetColumns_select.data
        });
      }
    },
    //从目标库导入的弹出框中选中一条数据点击确定====查询具体的数据填充到页面中
    *selectTargetModelMsg({ payload, callback }, { call, put }) {
      const targetData = yield call(TargetModelMsg, payload);
      if (targetData && targetData.status === 200) {
        if (callback && typeof callback === "function") {
          callback(targetData);
        }
        yield put({ type: "sendTargetModelMsg", payload: targetData.data });
      }
    },
    //点击雷达情报整编按钮
    *ClickQBZB({ payload }, { call, put }) {
      const data = yield call(ClickQBZB_axios, payload);
      if (data && data.status === 200) {
        yield put({ type: "ClickQBZB_data", payload: data.data });
      }
    },
    *comparativeAnalysis({ payload }, { call, put }) {
      yield put({ type: "comparativeAnalysis_data", payload: payload });
    },
    // 切换国家地区，点击查询按钮
    *selectZBColum({ payload }, { call, put }) {
      const data = yield call(ClickQBZB_axios, payload);
      if (data && data.status === 200) {
        yield put({ type: "ClickQBZB_data", payload: data.data });
      }
    },
    //点击编辑按钮
    *EditZBColum({ payload }, { call, put }) {
      const data = yield call(EditZBColum_axios, payload);
      if (data && data.status === 200) {
        yield put({ type: "select_qbzb_target_data", payload: data.data });
      }
    },
    //点击雷达整编列表中的删除按钮
    *deleteZBColum({ payload, callback }, { call, put }) {
      const data = yield call(deleteZBColum_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    //点击保存按钮
    *saveAllMsg({ payload }, { call, put }) {
      yield put({ type: "saveAllMsg_data", payload: payload });
    },
    *closeModelMsg_async({ payload }, { call, put }) {
      yield put({ type: "closeQbModelMsg", payload: payload });
      payload[2] = null;
      let modalmsg = [...payload];
      yield put({ type: "closeModelMsg", payload: modalmsg });
    },
    //目标库中工作模式的添加
    *update_target_WorkModel_main({ payload }, { call, put }) {
      const data = yield call(update_target_WorkModel_main_axios, payload);
    },

    //工作模式下的3个模块的保存
    *saveWorkModel_threePart_SP({ payload, callback }, { call, put }) {
      const data = yield call(saveWorkModel_threePart_SP_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          yield put({ type: "deleteMarkChange", payload: false });
          callback(data);
        }
      }
    },
    *saveWorkModel_threePart_MK({ payload, callback }, { call, put }) {
      const data = yield call(saveWorkModel_threePart_MK_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {

          yield put({ type: "deleteMarkChange_MK", payload: false });
          callback(data);
        }
      }
    },
    *saveWorkModel_threePart_CFJG({ payload, callback }, { call, put }) {
      const data = yield call(saveWorkModel_threePart_CFJG_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          yield put({ type: "deleteMarkChange_CFJG", payload: false });
          callback(data);
        }
      }
    },
    //点击了整编按钮
    *ZBStart_send({ payload, callback }, { call, put }) {
      const data = yield call(ZBStart_send_axios, payload);
      if (data && data.status === 200) {
        yield put({ type: "ZBStart_send_data", payload: data.data });
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    //保存按钮
    *save_target_allData({ payload, callback }, { call, put }) {
      const data = yield call(save_target_allData_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *publish_target_allData({ payload, callback }, { call, put }) {
      const data = yield call(publish_target_allData_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    // 删除目标库中的工作模式
    *deleteWorkModel({ payload }, { call, put }) {
      const data = yield call(deleteWorkModel_axios, payload);
    },
    *deleteCache({ payload }, { call, put }) {
      const data = yield call(deleteCache_axios, payload);
    },
    //更新缓存中的图片信息
    *updateImgData_Special({ payload }, { call, put }) {
      const data = yield call(updateImgData_Special_axios, payload);
    },
    *updateVideoData_Special({ payload }, { call, put }) {
      const data = yield call(updateVideoData_Special_axios, payload);
    },
    *updateHtmlData_Special({ payload }, { call, put }) {
      const data = yield call(updateHtmlData_Special_axios, payload);
    },
    *updateDocData_Special({ payload }, { call, put }) {
      const data = yield call(updateDocData_Special_axios, payload);
    },
    *deleteImgColumndata_send({ payload }, { call, put }) {
      const data = yield call(deleteImgColumndata_send_axios, payload);
    },
    *deleteVideoColumndata_send({ payload }, { call, put }) {
      const data = yield call(deleteVideoColumndata_send_axios, payload);
    },
    *deleteHtmlColumndata_send({ payload }, { call, put }) {
      const data = yield call(deleteHtmlColumndata_send_axios, payload);
    },
    *deleteDocColumndata_send({ payload }, { call, put }) {
      const data = yield call(deleteDocColumndata_send_axios, payload);
    },
    *update_target_WorkModel_MNTZ_data({ payload, callback }, { call, put }) {
      //将脉内特征修改的值保存到缓存
      const data = yield call(update_target_WorkModel_MNTZ_data_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *selectAllChartsList({ payload }, { call, put }) {
      //点击选用侦察信号文件，弹出框中显示的内容
      const data = yield call(selectAllChartsList_axios, payload);
      if (data && data.status === 200) {
        yield put({ type: "selectAllChartsList_data", payload: data.data });
      }
    },
    *selectInsertFromTargetChartsMsg({ payload, callback }, { call, put }) {
      //目标库导入或者点击编辑
      const data = yield call(selectInsertFromTargetChartsMsg_axios, payload);
      if (data && data.status === 200) {
        yield put({
          type: "selectInsertFromTargetChartsMsg_data",
          payload: data.data
        });
      }
      yield put({ type: "updateSourceOfRadiationList", payload: payload });
    },
    *updateAndSelectChartsData({ payload, callback }, { call, put }) {
      //侦察信号数据点击弹出框中的确定，更新缓存
      const data = yield call(updateAndSelectChartsData_axios, payload);
      if (data && data.status === 200) {
        yield put({
          type: "updateAndSelectChartsData_data",
          payload: data.data
        });
      }
    },
    *deleteCharts({ payload, callback }, { call, put }) {
      //侦察信号数据点击弹出框中的确定，删除缓存
      const data = yield call(deleteCharts_axios, payload);
    },
    *selectOnlyLookData({ payload, callback }, { call, put }) {
      //平台挂载雷达信息点击查看
      const data = yield call(selectOnlyLookData_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
        yield put({ type: "sendTargetModelMsg", payload: data.data });
      }
    },
    *selectRadarTypeRepeatName({ payload, callback }, { call, put }) {
      //查询雷达目标名称是否重复
      const data = yield call(selectRadarTypeRepeatName_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *addRadarTechnicalParam({ payload, callback }, { call, put }) {
      //添加雷达战技术参数
      const data = yield call(addRadarTechnicalParam_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *selectAllRadarTypeData({ payload, callback }, { call, put }) {
      //查询所有的雷达信息
      const data = yield call(selectAllRadarTypeData_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *deleteRadarType({ payload, callback }, { call, put }) {
      //删除雷达型号
      const data = yield call(deleteRadarType_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *selectRadarType({ payload, callback }, { call, put }) {
      //查询雷达型号
      const data = yield call(selectRadarType_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *selectRadarTypeDetails({ payload, callback }, { call, put }) {
      //查询雷达型号对应的具体的战技术参数
      const data = yield call(selectRadarTypeDetails_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *selectRadarTypeDetails_update({ payload, callback }, { call, put }) {
      //查询雷达型号对应的具体的战技术参数
      const data = yield call(selectRadarTypeDetails_axios, payload);
      if (data && data.status === 200) {
        yield put({ type: "selectRadarTypeDetails_data", payload: data.data });
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
    *updateRadarTechnicalParam({ payload, callback }, { call, put }) {
      //查询素材名称是否重复
      const data = yield call(updateRadarTechnicalParam_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *SelectDetailFreqPwPri({ payload, callback }, { call, put }) {
      //点击工作模式的行查询下方对应的频率脉宽射频
      const data = yield call(SelectDetailFreqPwPri_axios, payload);
      if (data && data.status === 200) {
        yield put({
          type: "sendTargetModelMsg_fromCache",
          payload: data.data[0]
        });

        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *select_ContinWave({ payload, callback }, { call, put }) {
      //查询连续波或者非连续波下面的射频、脉宽和重复间隔值输入是否正确
      const data = yield call(select_ContinWave_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *selectIsOrNotZB({ payload, callback }, { call, put }) {
      //点击自动整编调用的接口
      const data = yield call(selectIsOrNotZB_axios, payload);
      console.log("data========", data)
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data.data);
        }
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    //查询侦察情报库的数据                 的时候关闭侦察和目标中工作模式点击列的状态
    sendRadarModelMsg(state, { payload }) {
      return {
        ...state,
        ModelMsg: payload,
        // ModelMsgRight: payload,
        showRadarMsg: true,
        WorkModelMsg_ZCMark: false,
        WorkModelMsg_MBMark: false,
        clearMsg: false
      };
    },

    saveWorkModelMsg(state, { payload }) {
      return {
        ...state,
        WorkMode_Msg: payload,
        WorkMode_flag: true
      };
    },
    sendWorkModelMsg(state, { payload }) {
      return {
        ...state,
        WorkModelMsg: payload,
        WorkModelMsg_ZCMark: true
      };
    },
    sendWorkModelMsg_Target(state, { payload }) {
      return {
        ...state,
        WorkModelMsg_Target: payload, //自动整编
        WorkModelMsg_MBMark: true,

        target_workModelMsg_SP: payload[0], //射频的内容
        target_workModelMsg_MK: payload[1], //脉宽的内容
        target_workModelMsg_CFJG: payload[2], //重复间隔的内容

        deleteMark: false
      };
    },
    sendRadarColumnsMsg(state, { payload }) {
      return {
        ...state,
        RadarColumnsMsg: payload,
        ZCtotalCount: payload[1]
      };
    },
    //点击了整编按钮，则目标库中的数据不显示从目标库导入的，目标库中点击工作模式标识关闭
    ZBStart(state, { payload }) {
      return {
        ...state,
        ModelMsgRight: payload.data,
        targetDetailMsg: null, //避免数据冲突，将编辑数据置空
        ZBMark: payload.mark,
        MBImportMark: false,
        WorkModelMsg_MBMark: false,
        objectName: payload.name,
        comparativeAnalysisMark: false,
        targetWorkModel_fromTar: null
      };
    },
    clearAllMsg(state, { payload }) {
      return {
        ...state,
        ModelMsgRight: null,
        targetDetailMsg: null, //目标库中的数据
        // clearMsg: payload.clearMsg,
        MBImportMark: false,
        comparativeAnalysisMark: false,
        ZBMark: false,
        targetWorkModel_fromTar: null,
        WorkModelMsg_Target: null,
        target_workModelMsg_Main: null, //工作模式的主要行内容
        target_workModelMsg_SP: null, //射频的内容
        target_workModelMsg_MK: null, //脉宽的内容
        target_workModelMsg_CFJG: null, //重复间隔的内容
        RadarName: null,

        //素材的信息
        imgData_Special: null,
        videoData_Special: null,
        htmlData_Special: null,
        docData_Special: null,
        sn: 0,
        DBFX: null,
        ModelMsg: null,
        ChartsJSONList: null,
        sourceOfRadiationList: null,
        ChartsJSONListMark: false
      };
    },
    clearMsg_ViewNew(state, { payload }) {
      return {
        ...state,
        ZCSignMsg_data: null
      };
    },
    selectTargetColumns(state, { payload }) {
      return {
        ...state,
        TargetColumns: payload,
        EditMark: false,
        MBMark: true
      };
    },
    sendTargetColumnsMsg(state, { payload }) {
      console.log("payload===1111", payload)
      console.log("payload[0]?payload[0][1]", payload[1])
      return {
        ...state,
        TargetColumns: payload,
        totalCount: payload[1]
      };
    },

    //点击从目标库导入查询到的数据        的则不显示整编中的数据
    sendTargetModelMsg(state, { payload }) {
      return {
        ...state,
        targetDetailMsg: payload,
        RadarName: payload[0].objectName,
        target_workModelMsg_Main: payload[0].workModelList,
        ModelMsgRight: null,
        MBImportMark: true,
        ZBMark: false,
        WorkModelMsg_MBMark: false, //工作模式中点击行状态false
        EditMark: false,
        imgData_Special: payload[0].picList,
        videoData_Special: payload[0].videoList,
        htmlData_Special: payload[0].htmlList,
        docData_Special: payload[0].docList,
        sourceOfRadiationList: payload[0].sourceOfRadiationList, //侦察信号文件的集合
        ChartsJSONList: null, //侦察信号文件的JSON集合
        sn: 1 //点击了编辑或者从目标库导入
      };
    },
    //从目标库导入的数据点击行
    sendTargetModelMsg_fromTar(state, { payload }) {
      return {
        ...state,
        targetWorkModel_fromTar: payload.momentClickWorlModelMSg,
        WorkModelMsg_MBMark: true, //工作模式中点击行状态true
        WorkModelMsg_Target: false,

        target_workModelMsg_SP: payload.momentClickWorlModelMSg
          ? payload.momentClickWorlModelMSg.workModelFreqList
          : null, //射频的内容
        target_workModelMsg_MK: payload.momentClickWorlModelMSg
          ? payload.momentClickWorlModelMSg.workModelPWList
          : null, //脉宽的内容
        target_workModelMsg_CFJG: payload.momentClickWorlModelMSg
          ? payload.momentClickWorlModelMSg.workModelPriList
          : null, //重复间隔的内容

        deleteMark: false
      };
    },

    sendTargetModelMsg_fromCache(state, { payload }) {
      return {
        ...state,
        targetWorkModel_fromTar: payload,
        WorkModelMsg_MBMark: true, //工作模式中点击行状态true
        WorkModelMsg_Target: false,

        target_workModelMsg_SP: payload ? payload.workModelFreqList : null, //射频的内容
        target_workModelMsg_MK: payload ? payload.workModelPWList : null, //脉宽的内容
        target_workModelMsg_CFJG: payload ? payload.workModelPriList : null, //重复间隔的内容

        deleteMark: false
      };
    },

    ClickQBZB_data(state, { payload }) {
      return {
        ...state,
        ClickQBZB_Msg: payload[0]
      };
    },
    //点击了编辑按钮，查询到的数据
    select_qbzb_target_data(state, { payload }) {
      return {
        ...state,
        targetDetailMsg: payload,
        target_workModelMsg_Main: payload[2],
        EditMark: true,
        MBImportMark: false,
        clearMsg: false,
        imgData_Special: payload[3],
        videoData_Special: payload[4],
        htmlData_Special: payload[5],
        docData_Special: payload[6]
      };
    },
    comparativeAnalysis_data(state, { payload }) {
      return {
        ...state,
        comparativeAnalysisMark: payload.mark
      };
    },
    saveAllMsg_data(state, { payload }) {
      return {
        ...state,
        allMsg: payload
      };
    },
    closeWorkModelMsg_MBMark(state, { payload }) {
      return {
        ...state,
        WorkModelMsg_MBMark: false
      };
    },
    closeZBMark(state, { payload }) {
      return {
        ...state,
        ZBMark: false
      };
    },
    closeModelMsg(state, { payload }) {
      return {
        ...state,
        ModelMsg: payload
      };
    },
    saveRadarName(state, { payload }) {
      return {
        ...state,
        RadarName: payload.name
      };
    },
    // 更新主要工作模式的显示
    update_target_WorkModel_main_data(state, { payload }) {
      return {
        ...state,
        target_workModelMsg_Main: payload
      };
    },
    // 更新主要工作模式下射频的显示
    updateTarget_workModelMsg_SP(state, { payload }) {
      console.log("更新主要工作模式下射频的显示======================", payload)
      return {
        ...state,
        target_workModelMsg_SP: payload.target_workModelMsg_SP,
        deleteMark: payload.deleteMark
      };
    },
    // 更新主要工作模式下脉宽的显示
    updateTarget_workModelMsg_MK(state, { payload }) {
      return {
        ...state,
        target_workModelMsg_MK: payload.target_workModelMsg_MK,
        deleteMark_MK: payload.deleteMark
      };
    },
    // 更新主要工作模式下重复间隔的显示
    updateTarget_workModelMsg_CFJG(state, { payload }) {
      return {
        ...state,
        target_workModelMsg_CFJG: payload.target_workModelMsg_CFJG,
        deleteMark_CFJG: payload.deleteMark
      };
    },

    // 相关资料中的选用素材中点击确定
    insertImgData_Special(state, { payload }) {
      return {
        ...state,
        imgData_Special: payload.dataSource //更改图片的数据
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
    //点击自动整编返回来的数据
    ZBStart_send_data(state, { payload }) {
      return {
        ...state,
        targetDetailMsg: payload,
        target_workModelMsg_Main: payload[0].workModelList
      };
    },
    updataWorkModel_Main(state, { payload }) {
      return {
        ...state,
        target_workModelMsg_Main: payload
      };
    },

    updataRadarBasicMsg(state, { payload }) {
      //更新目标库中的基本信息和战技术参数
      return {
        ...state,
        targetDetailMsg: [payload]
      };
    },
    //点击了对比分析
    handleCompare(state, { payload }) {
      return {
        ...state,
        DBFX: payload.DBFX,
        targetDetailMsg: [payload.values]
      };
    },
    //将选中的条件保存起来
    updata_ClickQBZB_selectMsg(state, { payload }) {
      return {
        ...state,
        seleleZBList_choise: [
          payload.countryName,
          payload.publishStatus,
          payload.okPublishStatus,
          payload.modelName
        ]
      };
    },
    //点击查看侦察信号数据的返回值
    ZCSignMsg(state, { payload }) {
      return {
        ...state,
        ZCSignMsg_data: payload
      };
    },
    //查看侦察信号文件点击返回素材列表
    changeMarkSideBar(state, { payload }) {
      return {
        ...state,
        MarkSideBar: payload
      };
    },
    //返回侦察信号的数据集合
    selectAllChartsList_data(state, { payload }) {
      return {
        ...state,
        ChartsList: payload[0]
      };
    },
    //雷达情报页面显示的侦察信号的图表json数据
    selectInsertFromTargetChartsMsg_data(state, { payload }) {
      return {
        ...state,
        ChartsJSONList: payload,
        ChartsJSONListMark: true
      };
    },
    //雷达情报整编页面上侦察信号数据插入一条数据
    updateAndSelectChartsData_data(state, { payload }) {
      return {
        ...state,
        ChartsJSONList: payload,
        ChartsJSONListMark: true
      };
    },
    updateAndSelectChartsData_Add(state, { payload }) {
      return {
        ...state,
        ChartsJSONList: payload.data,
        sourceOfRadiationList: payload.data2,
        ChartsJSONListMark: true
      };
    },
    updateJsonList(state, { payload }) {
      return {
        ...state,
        ChartsJSONListLast: payload.dataJson,
        sourceOfRadiationList: payload.chartsList
      };
    },
    updateSourceOfRadiationList(state, { payload }) {
      return {
        ...state,
        sourceOfRadiationList: payload,
        ChartsJSONListMark: true
      };
    },
    selectRadarTypeDetails_data(state, { payload }) {
      //根据雷达型号查询全部数据
      return {
        ...state,
        selectRadarTypeDetails: payload
      };
    },
    updataMNCharacterMsg(state, { payload }) {
      //将脉内特征的数据保存起来
      return {
        ...state,
        targetWorkModel_fromTar: payload
      };
    },
    saveActiveKey(state, { payload }) {
      //关闭样本的时候将保存实时activityKey
      return {
        ...state,
        ActiveKey: payload
      };
    },
    deleteMarkChange(state, { payload }) {
      return {
        ...state,
        deleteMark: false
      };
    },
    deleteMarkChange_MK(state, { payload }) {
      return {
        ...state,
        deleteMark_MK: false
      };
    },
    deleteMarkChange_CFJG(state, { payload }) {
      return {
        ...state,
        deleteMark_CFJG: false
      };
    },
  }
};
