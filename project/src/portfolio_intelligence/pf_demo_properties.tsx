import React, { useEffect, useState } from "react";

type PropertyRecord = {
  Property: string;
  Location: string;
  Class: string;
  Units: number | string;
  Occupancy: string;
  "Rent/sqft": string;
  property_response: string;
};

const PfDemoProperties: React.FC = () => {
  const [data, setData] = useState<PropertyRecord[]>([]);
  const [selected, setSelected] = useState<PropertyRecord | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      setStatus("loading");
      try {
        const response = await fetch("/api/get_properties_data");
        if (!response.ok) {
          throw new Error("Request failed");
        }
        const payload = (await response.json()) as PropertyRecord[];
        if (isActive) {
          setData(payload);
          setSelected(payload[0] ?? null);
          setStatus("idle");
        }
      } catch (error) {
        if (isActive) {
          setStatus("error");
        }
      }
    };

    load();
    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Properties</h2>
          <p className="text-sm text-slate-500">Click a property to view the response.</p>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3">Units</th>
              <th className="px-4 py-3">Occupancy</th>
              <th className="px-4 py-3">Rent/sqft</th>
            </tr>
          </thead>
          <tbody>
            {status === "loading" ? (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={6}>
                  Loading...
                </td>
              </tr>
            ) : null}
            {status === "error" ? (
              <tr>
                <td className="px-4 py-4 text-red-500" colSpan={6}>
                  Failed to load properties.
                </td>
              </tr>
            ) : null}
            {status === "idle" && data.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={6}>
                  No properties available.
                </td>
              </tr>
            ) : null}
            {data.map((row) => {
              const isActive = selected?.Property === row.Property;
              return (
                <tr
                  key={`${row.Property}-${row.Location}`}
                  className={`cursor-pointer border-t border-slate-100 transition ${
                    isActive ? "bg-sky-50" : "hover:bg-slate-50"
                  }`}
                  onClick={() => setSelected(row)}
                >
                  <td className="px-4 py-3 font-semibold text-slate-900">{row.Property}</td>
                  <td className="px-4 py-3 text-slate-600">{row.Location}</td>
                  <td className="px-4 py-3 text-slate-600">{row.Class}</td>
                  <td className="px-4 py-3 text-slate-600">{row.Units}</td>
                  <td className="px-4 py-3 text-slate-600">{row.Occupancy}</td>
                  <td className="px-4 py-3 text-slate-600">{row["Rent/sqft"]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Property Response
        </p>
        <p className="mt-2 text-sm text-slate-700">
          {selected?.property_response ?? "Select a property to view the response."}
        </p>
      </div>
    </div>
  );
};

export default PfDemoProperties;
