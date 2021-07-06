let urll;
if (typeof window.getUrl == "function") {
  urll = window.getUrl();
} else {
  urll = "http://192.168.0.107:8087";
}
export default {
  namespace: "language",

  state: {
    getlanguages: "zh", //获取语言环境 zh为中文环境，fr为法文环境
    // showMaterialIp:'192.168.43.203:8087',
    // showMaterialIp:'localhost'
    showMaterialIp: urll,
    countryName: null
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      // eslint-disable-line
      yield put({ type: "save" });
    },
    *changeLanguage({ payload }, { call, put }) {
      yield put({ type: "changeLang", payload: payload });
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    changeLang(state, { payload }) {
      return {
        ...state,
        getlanguages: payload.mark
      };
    },
    GetLanguages(state, { payload }) {
      return {
        ...state,
        getlanguages: payload
      };
    },
    saveCountry(state, { payload }) {
      return {
        ...state,
        countryName: payload
      };
    }
  }
};
