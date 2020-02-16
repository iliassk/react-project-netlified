import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./index.css";
import { ThemeProvider, ThemeConsumer } from "./contexts/Theme.jsx";
import { Nav } from "./components/Nav.jsx";
import Loading from "./components/Loading.jsx";


const Popular = React.lazy(() => import("./components/Popular.jsx"));
const Battle = React.lazy(() => import("./components/Battle.jsx"));
const Results = React.lazy(() => import("./components/Results.jsx"));

//Component
//+ State
//+ Lifecycle
//+ UI

class App extends React.Component {
    state = {
        theme: 'light',
        toggleTheme: () => {
            this.setState(({ theme }) => {
                return {
                    theme: theme === 'light' ? 'dark' : 'light'
                }
            })
        }
    };

    render() {
    return (
        <Router>
            <ThemeProvider value={this.state}>
                <div className={this.state.theme}>
                    <div className='container'>
                        <Nav />
                        <React.Suspense fallback={<Loading />}>
                            <Switch>
                                <Route exact path="/" component={Popular} />
                                <Route exact path="/battle" component={Battle} />
                                <Route path="/battle/results" component={Results}/>
                                <Route render={() => (<h1>404</h1>)} />
                            </Switch>
                        </React.Suspense>
                    </div>
                </div>
            </ThemeProvider>
        </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
