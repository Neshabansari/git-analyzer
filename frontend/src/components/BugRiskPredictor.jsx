import { useEffect, useState } from "react";

export default function BugRiskPredictor({ analysisId }) {

  const [riskData, setRiskData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRiskData = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:8080/N/api/bug-risk?analysisId=${analysisId}`
      );

      const data = await response.json();

      setRiskData(data.bugRisk || []);
    } catch (error) {
      console.error("Error fetching bug risk:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (analysisId) {
      fetchRiskData();
    }
  }, [analysisId]);

  // Get top 3 risky files
   const topRiskFiles = [...riskData]
  .filter(file => file.riskScore >= 0.6)
  .sort((a, b) => b.riskScore - a.riskScore)
  .slice(0, 3);

  return (
    <div className="p-4">

      <div className="mb-4">

  <h2 className="text-xl font-bold">
    Bug Risk Predictor
  </h2>

  <div className="flex gap-6 mt-2 text-sm">

    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-full bg-red-500"></span>
      High Risk
    </div>

    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-full bg-orange-500"></span>
      Medium Risk
    </div>

    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-full bg-green-500"></span>
      Low Risk
    </div>

  </div>

</div>

      {loading && <p>Analyzing risk...</p>}

      {/* Top Risk Files Section */}
      {topRiskFiles.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">

          <h3 className="font-semibold text-red-700 mb-3">
             Top Risk Files
          </h3>

          {topRiskFiles.map((file, index) => (

            <div
              key={index}
              className="flex justify-between py-1 text-sm"
            >

              <span className="font-medium">
                {file.file}
              </span>

              <span className="font-semibold text-red-600">
                {file.riskScore.toFixed(2)}
              </span>

            </div>

          ))}

        </div>
      )}

      {/* Full Risk List */}

      <div className="space-y-3">

        {[...riskData]
          .sort((a, b) => b.riskScore - a.riskScore)
          .map((item, index) => {

            let color = "bg-green-500";

            if (item.riskScore > 0.8) color = "bg-red-500";
            else if (item.riskScore > 0.5) color = "bg-orange-500";

            return (

              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 border rounded-md p-3 shadow-sm"
              >

                <span className="font-medium text-gray-800">
                  {item.file}
                </span>

                <span className="flex items-center gap-2 font-semibold">

                  <span
                    className={`w-3 h-3 rounded-full ${color}`}
                  />

                  {item.riskScore.toFixed(2)}

                </span>

              </div>

            );

          })}

      </div>

    </div>
  );
}