import React from 'react';
import { useGlobal } from 'reactn';
import ReactGA from 'react-ga';
import { Route, Redirect, Switch, Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Layout from './Layout';
import HomePage from './HomePage';
import AccountPage from './AccountPage';
import MarketPage from './MarketPage';
import BlockPage from './BlockPage';
import OperationPage from './OperationPage';
import PrivacyPage from './PrivacyPage';
import TermsPage from './TermsPage';
import ElectionPage from './ElectionPage';
import CyclePage from './CyclePage';
import AnalyticPage from './AnalyticPage';

import history from '../hooks/history';
import { isMainnet, getHashType } from '../utils';
import '../styles/css/index.css';
import { GOOGLE_ANALYTICS_API_KEY } from '../config/index';

ReactGA.initialize(GOOGLE_ANALYTICS_API_KEY);
ReactGA.pageview(window.location.pathname + window.location.search);
const theme = {};
const App = () => {
  const [config] = useGlobal('config');
  return (
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <Layout>
          <Switch>
            <Route exact path="/" component={HomePage} />
            {isMainnet(config) && <Redirect path="/markets" to="/market" />}
            {isMainnet(config) && <Route path="/market" component={MarketPage} />}
            <Route path="/terms" component={TermsPage} />
            <Route path="/analytics" component={AnalyticPage} />
            <Route path="/privacy" component={PrivacyPage} />
            <Redirect exact from="/election" to="/election/head" />
            <Route path="/election/:id" component={ElectionPage} />
            <Redirect exact from="/cycle" to="/cycle/head" />
            <Route path="/cycle/:id" component={CyclePage} />
            <Redirect from="/account/:hash" to="/:hash" />
            <Redirect from="/block/:hash" to="/:hash" />
            <Redirect from="/operation/:hash" to="/:hash" />
            <Route path="/:hash" render={({ match }) => {
              const height = parseInt(match.params.hash);
              const type = getHashType(match.params.hash, 0) || (!isNaN(height)?'block':null);
              switch (type) {
              case 'account':
                return <AccountPage match={match}/>;
              case 'block':
                return <BlockPage match={match}/>;
              case 'operation':
                return <OperationPage match={match} />;
              case 'protocol':
                return <ElectionPage match={match} />;
              default:
                return <Redirect to="/" />;
              }
            }} />
          </Switch>
        </Layout>
      </ThemeProvider>
    </Router>
  );
};
export default App;
