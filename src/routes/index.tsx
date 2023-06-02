import { Route, Switch } from "react-router-dom";
import { useRouteMatch } from "react-router-dom";

//list
import AirportsList from '../pages/Airports/AirportsList/index';
import TerminalList from "../pages/Terminal/TerminalsList/index";
import ATRSList from '../pages/ATRS/ATRSList/index';
//form
import Airport from "../pages/Airports/AirportForm/index";
import Terminal from '../pages/Terminal/TerminalForm/index';
import ATRS from '../pages/ATRS/ATRSForm/index';

// PAGE IMPORTS

const App = () => {
    const match = useRouteMatch();

    return (
        <div className="gx-main-content-wrapper">
            <Switch>
                <Route exact path={`${match.path}example`} component={() => <h1>Kshitij</h1>} />

                <Route exact path={`${match.path}airports/list`} component={AirportsList} />
                <Route exact path={`${match.path}airports/addairport`} component={Airport} />
                <Route exact path={`${match.path}airports/updateairport/:id`} component={Airport} />
                <Route exact path={`${match.path}airports/viewairport/:viewairport/:id`} component={Airport} />

                <Route exact path={`${match.path}terminals/list`} component={TerminalList} />
                <Route exact path={`${match.path}terminals/addterminal`} component={Terminal} />
                <Route exact path={`${match.path}terminals/updateterminal/:id`} component={Terminal} />
                <Route exact path={`${match.path}terminals/viewterminal/:viewterminal/:id`} component={Terminal} />

                <Route exact path={`${match.path}atrs/list`} component={ATRSList} />
                <Route exact path={`${match.path}atrs/addatrs`} component={ATRS} />
                <Route exact path={`${match.path}atrs/updateatrs/:id`} component={ATRS} />
                <Route exact path={`${match.path}atrs/viewatrs/:viewatrs/:id`} component={ATRS} />

            </Switch>
        </div>
    );
};

export default App;
