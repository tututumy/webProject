import {
  selectAllMaterical_axios,
  deleteMaterial_axios,
  deleteMaterials_axios
} from "../services/fodderSaync";

export default {
  namespace: "fodder",

  state: {
    nowData: null,
    datalength: 0,
    length: 0,
    height: 0,
    mark: "",
    a: 1,
    b: 1,
    c: 1,
    d: 1,
    e: 1,
    f: 1,
    g: 1,
    h: 0,
    propType: "",
    loadMap: "",
    AllMatericalData: null,
    clickMark: false //点击查询按钮
  },

  subscriptions: {
    setup({ dispatch, history }) {}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: "save" });
    },
    *ClickClose1({ payload }, { call, put }) {
      yield put({ type: "close1", payload: payload });
    },
    *ClickClose2({ payload }, { call, put }) {
      yield put({ type: "close2", payload: payload });
    },
    *LoadMap({ payload }, { call, put }) {
      yield put({ type: "close3", payload: payload });
    },
    *ClearMap({ payload }, { call, put }) {
      yield put({ type: "clear", payload: payload });
    },
    *selectAllMaterical({ payload }, { call, put }) {
      //素材模块查询所有的素材
      const data = yield call(selectAllMaterical_axios, payload);
      yield put({ type: "selectAllMaterical_data", payload: data.data });
    },
    *deleteMaterial({ payload, callback }, { call, put }) {
      //素材模块删除单个素材
      const data = yield call(deleteMaterial_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *deleteMaterials({ payload, callback }, { call, put }) {
      //素材模块删除多个素材
      const data = yield call(deleteMaterials_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    ClickBtn(state, { payload }) {
      return {
        ...state,
        a: payload.a,
        b: payload.b,
        c: payload.c,
        d: payload.d,
        e: payload.e,
        f: payload.f,
        g: payload.g,
        h: payload.h
      };
    },
    changeClickMark(state, { payload }) {
      return {
        ...state,
        clickMark: payload
      };
    },
    close1(state, { payload }) {
      return {
        ...state,
        mark: "first"
      };
    },
    close2(state, { payload }) {
      return {
        ...state,
        mark: "second"
      };
    },
    close3(state, { payload }) {
      return {
        ...state,
        loadMap: payload.mark
      };
    },
    clear(state, { payload }) {
      return {
        ...state,
        loadMap: payload.mark
      };
    },
    // 页面重新渲染的时候初始化选择条件
    updateChoose(state, { payload }) {
      return {
        ...state,
        a: payload.a,
        b: payload.b,
        c: payload.c,
        d: payload.d,
        e: payload.e,
        f: payload.f,
        g: payload.g,
        h: payload.h
      };
    },
    // 查询到所有的素材赋值
    selectAllMaterical_data(state, { payload }) {
      return {
        ...state,
        AllMatericalData: payload[0]
      };
    }
  }
};
