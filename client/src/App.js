import React from 'react';
import './App.scss';
import Header from './layout/header';
import Footer from './layout/footer';
import Content from './layout/content';

function App() {

  

  return (
    <div className="app-content">
      <Header />
      <Content />
      <Footer />
    </div>
  );
}

export default App;
