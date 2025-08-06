import React from "react";

function PortfolioOverview() {
    return (
        <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <div style={{ color: "#babec9" }}>Total Portfolio Value</div>
                    <div style={{ color: "#fff", fontSize: 32, fontWeight: 700 }}>$256,908</div>
                </div>
                <div>
                  <span style={{ color: "#35fa71", fontSize: 18, fontWeight: 600 }}>+6.05% </span>
                  <span style={{ color: "gray" }}>Today</span>
                </div>
            </div>
            <div style={{ marginTop: 18, display: 'flex', gap: 28 }}>
                <div>
                  <div style={{ color: "#babec9", fontSize: 13 }}>Contentment</div>
                  <div style={{ color: "#72fff9", fontWeight: 600 }}>92.5%</div>
                </div>
                <div>
                  <div style={{ color: "#babec9", fontSize: 13 }}>Medoacee</div>
                  <div style={{ color: "#fa8f35", fontWeight: 600 }}>74.3%</div>
                </div>
                <div>
                  <div style={{ color: "#babec9", fontSize: 13 }}>Jonuity</div>
                  <div style={{ color: "#35fa71", fontWeight: 600 }}>79.9%</div>
                </div>
                <div>
                  <div style={{ color: "#babec9", fontSize: 13 }}>Coutiogs</div>
                  <div style={{ color: "#ff3b3f", fontWeight: 600 }}>31.8%</div>
                </div>
            </div>
        </div>
    );
}
export default PortfolioOverview;
