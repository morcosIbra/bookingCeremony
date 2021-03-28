import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import sty from './index.module.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Layout from '../../Components/Layout';
import Home from '../Home';
import Booking from '../Booking';
import Popup from '../../Components/Popup';
import LoadingPage from '../../Components/LoadingPage';
import InfoBar from '../../Components/InfoBar';
import Header from '../../Containers/Header';
import { getMetaData } from '../../store/actions/common';
import EditMember from '../EditMember';

function App({ action, loadingPage, response, getMetaData, isAdmin }) {
  useEffect(() => {
    getMetaData()
  }, [getMetaData])
  return (
    <Router>
      <Header />
      <Layout>
        {action.needed ? <Popup {...action} /> : null}
        {loadingPage ? <LoadingPage /> : null}
        <Switch>
          <Route path="/booking" component={Booking} />
          {isAdmin && <Route path='/editMember' component={EditMember} />}
          <Route path="/" component={Home} />
         
        </Switch>
        {response.length ? <InfoBar items={response} type='danger' classes={`${sty.sidePage} text-center`} />
          : null}
      </Layout>
    </Router >
  );
}
const mapStateToProps = state => ({
  action: state.common.action,
  loadingPage: state.common.loadingPage,
  response: state.common.response,
  isAdmin: state.auth.isAdmin
})
const mapDispatchToProps = { getMetaData }

export default connect(mapStateToProps, mapDispatchToProps)(App);
