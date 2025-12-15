"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ControlRoomPage() {
  const trend = [
    { day: "Mon", gp: 67, labour: 31, cash: 54 },
    { day: "Tue", gp: 66, labour: 32, cash: 55 },
    { day: "Wed", gp: 65, labour: 31, cash: 53 },
    { day: "Thu", gp: 68, labour: 33, cash: 56 },
    { day: "Fri", gp: 69, labour: 32, cash: 58 },
    { day: "Sat", gp: 68, labour: 32, cash: 57 },
    { day: "Sun", gp: 67, labour: 31, cash: 56 },
  ];

  return (
    <main className="min-h-screen w-full px-10 py-10 text-white bg-[#070B14]">
      
      {/* HEADER */}
      <h1 className="text-4xl font-semibold">ODYAN Control Room V3</h1>
      <p className="text-slate-400 mt-2">
        One live brain for your entire restaurant. Ultra-premium, intelligent, real-time.
      </p>

      {/* TOP GRID */}
      <div className="mt-10 grid grid-cols-3 gap-8">
        
        {/* LEFT SIDE — CORE KPIs */}
        <div className="col-span-2 space-y-6">
          
          <div className="grid grid-cols-4 gap-4">
            {/* GP CARD */}
            <div className="p-5 rounded-xl bg-[#0A0F1C] border border-slate-800 shadow-md">
              <p className="uppercase text-xs text-slate-500 tracking-wide">Group GP Today</p>
              <p className="text-3xl font-semibold mt-2">67.4%</p>
              <p className="text-xs text-emerald-400 mt-1">+1.8 pts vs last week</p>
              <div className="mt-3 w-full h-1.5 bg-slate-700 rounded-full">
                <div className="h-full w-[67%] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
              </div>
            </div>

            {/* SUPPLIER SPEND */}
            <div className="p-5 rounded-xl bg-[#0A0F1C] border border-slate-800 shadow-md">
              <p className="uppercase text-xs text-slate-500 tracking-wide">Net Supplier Spend (WTD)</p>
              <p className="text-3xl font-semibold mt-2">£28.9k</p>
              <p className="text-xs text-emerald-400 mt-1">£3.2k above plan</p>
              <div className="mt-3 w-full h-1.5 bg-slate-700 rounded-full">
                <div className="h-full w-[60%] bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
              </div>
            </div>

            {/* GUEST RATING */}
            <div className="p-5 rounded-xl bg-[#0A0F1C] border border-slate-800 shadow-md">
              <p className="uppercase text-xs text-slate-500 tracking-wide">Guest Rating (7 days)</p>
              <p className="text-3xl font-semibold mt-2">4.5 ★</p>
              <p className="text-xs text-emerald-400 mt-1">126 new reviews</p>
              <div className="mt-3 w-full h-1.5 bg-slate-700 rounded-full">
                <div className="h-full w-[80%] bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
              </div>
            </div>

            {/* HEAT */}
            <div className="p-5 rounded-xl bg-[#0A0F1C] border border-slate-800 shadow-md">
              <p className="uppercase text-xs text-slate-500 tracking-wide">Operational Heat</p>
              <p className="text-3xl font-semibold mt-2">73 / 100</p>
              <p className="text-xs text-red-400 mt-1">2 venues above risk band</p>
              <div className="mt-3 w-full h-1.5 bg-slate-700 rounded-full">
                <div className="h-full w-[73%] bg-gradient-to-r from-red-400 to-red-600 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* TREND CHART */}
          <div className="rounded-xl bg-[#0A0F1C] border border-slate-800 shadow-lg p-5">
            <p className="uppercase text-xs text-slate-400 tracking-wide">Last 7 days</p>
            <p className="text-sm text-slate-300 mb-5">GP, labour and cashflow trend</p>

            <div className="w-full h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <CartesianGrid stroke="#1a2235" strokeDasharray="3 3" />
                  <XAxis dataKey="day" stroke="#526180" />
                  <YAxis stroke="#526180" />
                  <Tooltip />
                  <Line type="monotone" dataKey="gp" stroke="#2dd4bf" strokeWidth={3} dot={false}/>
                  <Line type="monotone" dataKey="labour" stroke="#fb923c" strokeWidth={3} dot={false}/>
                  <Line type="monotone" dataKey="cash" stroke="#60a5fa" strokeWidth={3} dot={false}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — ODYAN BRAIN */}
        <div className="p-6 rounded-xl bg-[#0A0F1C] border border-slate-800 shadow-xl">

          <p className="text-sm text-emerald-400 mb-1">● Brain status: active</p>
          <h2 className="text-xl font-semibold">ODYAN Brain</h2>
          <p className="text-slate-400 mb-4">Live data connections</p>

          <div className="relative mx-auto mt-4 mb-6 w-64 h-64 rounded-xl bg-[#0D1324] border border-slate-800 flex items-center justify-center">
            <div className="absolute text-center">
              <p className="text-lg font-semibold">Profit engine</p>
              <p className="text-sky-400">67.4%</p>
            </div>

            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-teal-300">Delivery</div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-blue-300">Sales</div>
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-300">Suppliers</div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-pink-300">Labour</div>
            <div className="absolute left-12 bottom-10 text-yellow-300">Inventory</div>
            <div className="absolute right-12 bottom-10 text-orange-300">Delivery</div>
          </div>

          {/* ASK ODYAN */}
          <p className="uppercase text-xs text-slate-400 mb-2">Ask ODYAN</p>
          <div className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 rounded-lg bg-[#111827] border border-slate-700 text-sm"
              placeholder="Example: Where am I losing GP this week?"
            />
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-sm font-semibold">
              Ask
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <button className="px-3 py-1 rounded-md bg-[#111827] border border-slate-700 text-xs">Biggest GP risk today</button>
            <button className="px-3 py-1 rounded-md bg-[#111827] border border-slate-700 text-xs">Overstaffed hours</button>
            <button className="px-3 py-1 rounded-md bg-[#111827] border border-slate-700 text-xs">Supplier price shocks</button>
          </div>

          <div className="mt-6 p-3 rounded-lg bg-[#111827] border border-slate-800">
            <p className="text-sm text-slate-300">
              <span className="text-sky-300 font-semibold">Today’s brain view:</span> dairy costs and evening labour creating GP pressure.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
