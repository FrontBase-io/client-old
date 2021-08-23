import React, { useState } from "react";
import TabsMUI from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useHistory, Route, Switch } from "react-router-dom";
import { useEffect } from "react";
import Loading from "../../Loading";

interface TabType {
  label: string;
  key: string;
  component: React.FC;
}

const Tabs: React.FC<{
  tabs: TabType[];
  urlTrackable?: true;
  baseUrl?: string;
}> = ({ tabs, urlTrackable, baseUrl }) => {
  // Vars
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0].key);
  const history = useHistory();

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
        indicatorColor="primary"
        textColor="primary"
        aria-label="Tabs"
      >
        {tabs.map((tab) => (
          <Tab label={tab.label} key={tab.key} value={tab.key} />
        ))}
      </TabsMUI>
      {urlTrackable ? (
        <Switch>
          {tabs.map((tab) => (
            <Route
              path={`${baseUrl}/${tab.key}`}
              render={(args) => {
                const Component = tab.component;
                setSelectedTab(tab.key);
                return <Component />;
              }}
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
        "non-trackable"
      )}
    </>
  );
};

export default Tabs;
