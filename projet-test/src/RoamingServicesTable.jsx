import React, { useEffect, useState } from "react";

const getColor = (val) => {
  if (!val || val === "NOK") return "text-red-600";
  if (val === "OK") return "text-green-600";
  return "text-yellow-500";
};

function RoamingServicesTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5177/roaming-services")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🛰️ Test 3.1 – Partenaires Roaming et Services</h2>
        <p className="text-gray-600 mt-2">Vue d'ensemble des services roaming par partenaire</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pays</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Opérateur</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Accord</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">GSM</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">CAMEL</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">GPRS</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">3G</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">LTE</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">IMSI Prefix</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">GT</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.pays}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.operateur}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.accord}</td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${getColor(row.gsm)}`}>{row.gsm}</td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${getColor(row.camel)}`}>{row.camel}</td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${getColor(row.gprs)}`}>{row.gprs}</td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${getColor(row["3g"])}`}>{row["3g"]}</td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${getColor(row.lte)}`}>{row.lte}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.imsi_prefix || "❌"}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.gt || "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RoamingServicesTable;
