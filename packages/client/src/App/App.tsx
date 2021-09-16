import * as React from "react";

import styles from "./App.module.scss";

import ServerStatus from "./serverStatus";


const App: React.FC = () => {

  return (
    <main className={styles.container}>
      <ServerStatus />
    </main>
  );
};

export default App;
