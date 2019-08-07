import React from 'react';
import './App.scss';
import Header from './layout/header';
import Nav from './layout/nav';
import Footer from './layout/footer';
import Content from './layout/content';

function App() {

  

  return (
    <div className="app-content">
      <Header />
      
      <div className="row">
        <div className="col-md-2">
          <Nav />
        </div>
        <div className="col-md-10">
          <Content />
        </div>
      </div>
      

      
      <Footer />
    </div>
  );
}

export default App;
