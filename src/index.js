import 'babel-polyfill';
import dva from 'dva';
import { message } from 'antd';
import createLoading from 'dva-loading';
import createLogger from 'redux-logger';
import createHistory from 'history/createBrowserHistory';
import './index.css';


// 1. Initialize
const app = dva({
  ...createLoading({
    effects: true,
  }),
  history: createHistory(),
  onError(error) {
    message.error(error.message);
  },
  onAction: createLogger,
});
app.model(require('./models/login'));
app.model(require('./models/article'));
app.model(require('./models/users'));
// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
