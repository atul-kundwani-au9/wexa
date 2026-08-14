import { useEffect, useState } from "react";
import { api, ApiError } from "./api.js";
import { TopBar } from "./components/TopBar.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { TabNav } from "./components/TabNav.jsx";
import { PackageDetail } from "./components/PackageDetail.jsx";
import { BlastRadiusView } from "./components/BlastRadiusView.jsx";
import { ExposureView } from "./components/ExposureView.jsx";
import { ShortestPathView } from "./components/ShortestPathView.jsx";
import { CyclesView } from "./components/CyclesView.jsx";
import { BusFactorView } from "./components/BusFactorView.jsx";
import { ErrorState } from "./components/States.jsx";

export default function App() {
  const [overview, setOverview] = useState(null);
  const [overviewError, setOverviewError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("blast-radius");

  useEffect(() => {
    loadOverview();
  }, []);

  function loadOverview() {
    setOverviewError(null);
    api
      .overview()
      .then((res) => {
        setOverview(res);
        if (!selected && res.mostCritical?.length) {
          setSelected(res.mostCritical[0].name);
        }
      })
      .catch((err) => setOverviewError(err instanceof ApiError ? err.message : "Failed to load."));
  }

  if (overviewError) {
    return (
      <div className="app-shell">
        <TopBar stats={null} />
        <div className="main">
          <ErrorState
            title="Can't reach DepRadius"
            body={overviewError}
            onRetry={loadOverview}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <TopBar stats={overview?.stats} />
      <div className="layout">
        <Sidebar selected={selected} onSelect={setSelected} overview={overview} />
        <main className="main">
          {selected && <PackageDetail name={selected} />}

          <div className="panel panel-pad">
            <TabNav active={tab} onChange={setTab} />

            {tab === "blast-radius" && <BlastRadiusView packageName={selected} onSelect={setSelected} />}
            {tab === "exposure" && <ExposureView packageName={selected} />}
            {tab === "shortest-path" && <ShortestPathView defaultFrom={selected} />}
            {tab === "cycles" && <CyclesView />}
            {tab === "bus-factor" && <BusFactorView />}
          </div>
        </main>
      </div>
    </div>
  );
}
