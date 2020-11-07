import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import DamlLedger from "@daml/react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Properties from "../../pages/Properties";
import Bookings from "../../pages/Bookings";
import MyProperties from "../../pages/MyProperties";
import Verifications from "../../pages/Verifications";
import { useUserState } from "../../context/UserContext";
import { wsBaseUrl, httpBaseUrl } from "../../config";
import useStyles from "./styles";
import { WellKnownPartiesProvider, PublicLedger } from "@daml/dabl-react"
import { useDablParties } from "../../common/parties"
import { computeCredentials } from "../../Credentials"

const Layout: React.FC = () => {
  const classes = useStyles();
  const user = useUserState();

  if (!user.isAuthenticated) {
    return null;
  } else {
    return (
      <DamlLedger party={user.party} token={user.token} httpBaseUrl={httpBaseUrl} wsBaseUrl={wsBaseUrl}>
        <WellKnownPartiesProvider>
          <PublicProvider>
            <div className={classes.root}>
              <>
                <Header />
                <Sidebar />
                <div className={classes.content}>
                  <div className={classes.fakeToolbar} />
                  <Switch>
                    <Route path="/app/properties" component={Properties} />
                    <Route path="/app/bookings" component={Bookings} />
                    <Route path="/app/my-properties" component={MyProperties} />
                    <Route path="/app/verifications" component={Verifications} />
                  </Switch>
                </div>
              </>
            </div>
          </PublicProvider>
        </WellKnownPartiesProvider>
      </DamlLedger>
    );
  }
}

const PublicProvider: React.FC = ({ children }) => {
  const { parties, loading } = useDablParties()
  const { party, ledgerId, token } = computeCredentials(parties.publicParty)

  return loading ? <>"Loading Ledger"</> : (
    <PublicLedger
      ledgerId={ledgerId}
      publicParty={party}
      defaultToken={token}
      httpBaseUrl={httpBaseUrl}
      wsBaseUrl={wsBaseUrl}>
      {children}
    </PublicLedger>
  )
}

export default withRouter(Layout);
