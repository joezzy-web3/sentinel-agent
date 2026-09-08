import { NextResponse } from "next/server";

export async function GET() {
  const dummyLogs = [
    `[${new Date().toLocaleTimeString()}] System reset: Sentinel Gate Scan initialized.`,
    `[${new Date().toLocaleTimeString()}] Target: rAAPL (Arbitrum One - Backed 1:1 by Alpaca/SPV)`,
    `[${new Date().toLocaleTimeString()}] Gate 1 (Safety): Bitget MCP Security Check PASSED.`,
    `[${new Date().toLocaleTimeString()}] Gate 2 (Edge): Weekend Gap detected (+2.4% vs Fri close).`,
    `[${new Date().toLocaleTimeString()}] Gate 3 (Context): Qwen LLM evaluated zero macro blocking events.`,
    `[${new Date().toLocaleTimeString()}] Gate 4 (Execution): Trade Approved. Position size: 1.5% pool depth.`,
  ];

  return NextResponse.json({
    status: "success",
    timestamp: new Date().toISOString(),
    token: "rAAPL",
    gates: [
      { id: 1, name: "Safety Gate", status: "passed", detail: "Contract Verified" },
      { id: 2, name: "Edge Gate", status: "passed", detail: "+2.4% Spread" },
      { id: 3, name: "Context Gate", status: "passed", detail: "Macro Clear" },
      { id: 4, name: "Execution Gate", status: "passed", detail: "Order Ready" },
    ],
    logs: dummyLogs,
  });
}
