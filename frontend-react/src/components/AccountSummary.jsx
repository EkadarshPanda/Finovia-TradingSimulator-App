import React from "react";

function AccountSummary() {
    return (
        <div>
            <h2 style={{ color: "#fff", marginBottom: 4 }}>Account Balance</h2>
            <div style={{ fontSize: 28, fontWeight: 600, color: "#3cffa6" }}>$256,908</div>
            <div style={{ color: "#b0b8c1", fontSize: 14, marginTop: 8 }}>Active since: 2023</div>
        </div>
    );
}

export default AccountSummary;
