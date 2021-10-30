import React, { ReactElement, useState } from "react";
import TabsMUI from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useHistory, Route, Switch } from "react-router-dom";
import { useEffect } from "react";
import Loading from "../../Loading";
import { makeStyles } from "@material-ui/core";

interface TabType {
  label: string;
  key: string;
  component: ReactElement<any, any>;
}

const useStyles = makeStyles((theme) => ({
  scrollButtons: { color: "white" },
  indicator: { backgroundColor: "white" },
}));

const Tabs: React.FC<{
  tabs: TabType[];
  urlTrackable?: true;
  baseUrl?: string;
  white?: true;
}> = ({ tabs, urlTrackable, baseUrl, white }) => {
  // Vars
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0].key);
  const history = useHistory();
  const classes = useStyles();

  // Lifecycle

  // UI
  return (
    <>
      <TabsMUI
        value={selectedTab}
        onChange={(event: React.ChangeEvent<{}>, newValue: string) => {
          if (urlTrackable) {
            history.push(`${baseUrl}/${newValue}`);
          } else {
            setSelectedTab(newValue);
          }
        }}
        classes={white && classes}
        variant="scrollable"
        color="primary"
        indicatorColor="primary"
        aria-label="Tabs"
        scrollButtons={false}
      >
        {tabs.map((tab) => (
          <Tab
            label={tab.label}
            key={tab.key}
            value={tab.key}
            style={
              white
                ? selectedTab !== tab.key
                  ? { color: "white" }
                  : { color: "#aeaeae" }
                : {}
            }
          />
        ))}
      </TabsMUI>
      {urlTrackable ? (
        <Switch>
          {tabs.map((tab) => (
            <Route
              path={`${baseUrl}/${tab.key}`}
              render={(args) => (
                <CallbackComponent
                  tab={tab}
                  onCallback={() => setSelectedTab(tab.key)}
                />
              )}
            />
          ))}
          <Route
            path={baseUrl}
            exact
            render={() => {
              history.replace(`${baseUrl}/${tabs[0].key}`);
              return <Loading />;
            }}
          />
        </Switch>
      ) : (
        tabs.map((tab) => tab.key === selectedTab && tab.component)
      )}
    </>
  );
};

export default Tabs;

const CallbackComponent: React.FC<{
  tab: TabType;
  onCallback: () => void;
}> = ({ tab, onCallback }) => {
  useEffect(() => {
    onCallback();
  }, [onCallback, tab]);

  return tab.component;
};
