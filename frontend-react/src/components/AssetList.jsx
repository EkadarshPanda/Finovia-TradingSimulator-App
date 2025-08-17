import React from "react";
const assets = [
    { ticker: "ROM", name: "Robo Markets" },
    { ticker: "MAIS", name: "Mais World" },
    { ticker: "EUPNDQ", name: "Eurpond Quant" },
    { ticker: "SMAI", name: "Smart AI QOOM" }
];

function AssetList() {
    return (
        <div style={{ marginTop: 32 }}>
            <h3 style={{ color: "#87fff7" }}>Assets</h3>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {assets.map(a => (
                    <li key={a.ticker} style={{ padding: "8px 0", borderBottom: "1px solid #31343a" }}>
                        <span style={{ fontWeight: 500, color: "#fff" }}>{a.ticker}</span>
                        <span style={{ color: "#b0b8c1", marginLeft: 12 }}>{a.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default AssetList;
