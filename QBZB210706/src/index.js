import dva from "dva";
import "./index.less";

import createHistory from "history/createHashHistory";
import createLoading from "dva-loading";

const app = dva({
  history: createHistory()
});

app.use(createLoading());

app.model(require("./models/Model").default);
app.model(require("./models/example").default);
app.model(require("./models/table").default);
app.model(require("./models/changeComp").default);
app.model(require("./models/changeC").default);
app.model(require("./models/language").default);
app.model(require("./models/radarModel").default);
app.model(require("./models/ElectronicTarget").default);
app.model(require("./models/All").default);

app.router(require("./router").default);

app.start("#root");
