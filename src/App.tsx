import { Provider } from 'react-redux';
import './App.css';
import { Header } from './components/Header/Header';
import { Layout } from './components/Layout/Layout';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { store } from './store/store';
import { Route, Routes } from 'react-router-dom';
import { RepoPage } from './pages/RepoPage/RepoPage';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Header></Header>
        <Layout>
          <>
            <Routes>
              <Route index path="/" element={<DashboardPage />} />
              <Route path="repo" element={<RepoPage />} />
            </Routes>
          </>
        </Layout>
      </div>
    </Provider>
  );
}

export default App;
