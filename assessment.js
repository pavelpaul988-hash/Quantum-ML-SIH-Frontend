// BreastCancerQML - Assessment JavaScript

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("assessmentForm");
    const formMessage = document.getElementById("formMessage");

    if (!form) {
        console.error("assessmentForm not found.");
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (formMessage) {
            formMessage.textContent = "Analyzing sample...";
        }

        // Read the 10 breast cancer features
        const features = {
            meanRadius: Number(
                document.getElementById("meanRadius").value
            ),

            meanTexture: Number(
                document.getElementById("meanTexture").value
            ),

            meanPerimeter: Number(
                document.getElementById("meanPerimeter").value
            ),

            meanArea: Number(
                document.getElementById("meanArea").value
            ),

            meanSmoothness: Number(
                document.getElementById("meanSmoothness").value
            ),

            meanCompactness: Number(
                document.getElementById("meanCompactness").value
            ),

            meanConcavity: Number(
                document.getElementById("meanConcavity").value
            ),

            meanConcavePoints: Number(
                document.getElementById("meanConcavePoints").value
            ),

            meanSymmetry: Number(
                document.getElementById("meanSymmetry").value
            ),

            meanFractalDimension: Number(
                document.getElementById("meanFractalDimension").value
            )
        };

        // Check that all values are valid
        for (const [key, value] of Object.entries(features)) {
            if (!Number.isFinite(value)) {
                if (formMessage) {
                    formMessage.textContent =
                        `Please enter a valid value for ${key}.`;
                }
                return;
            }
        }

        try {
            // Send features to LIVE Render backend
            const response = await fetch(
                "https://quantum-ml-backend-sih.onrender.com/api/predict",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        features: features
                    })
                }
            );

            // Check HTTP response
            if (!response.ok) {
                throw new Error(
                    `Backend returned status ${response.status}`
                );
            }

            // Read backend response
            const result = await response.json();

            console.log("Backend prediction:", result);

            // Check API response
            if (result.status !== "success") {
                throw new Error(
                    result.message || "Prediction failed."
                );
            }

            // Create complete assessment object
            const assessment = {
                id: Date.now(),

                date: new Date().toLocaleString(),

                model: "BreastCancerQML",

                version: "1.0",

                features: features,

                prediction: {
                    classical_ml: result.classical_ml,

                    quantum_ml: result.quantum_ml,

                    hybrid: result.hybrid,

                    feature_importance:
                        result.feature_importance
                }
            };

            // Save current assessment
            localStorage.setItem(
                "healthqmlCurrentAssessment",
                JSON.stringify(assessment)
            );

            // Save assessment history
            let assessments = [];

            try {
                const savedHistory =
                    localStorage.getItem(
                        "healthqmlAssessments"
                    );

                if (savedHistory) {
                    assessments = JSON.parse(savedHistory);

                    if (!Array.isArray(assessments)) {
                        assessments = [];
                    }
                }
            } catch (error) {
                console.warn(
                    "Could not read assessment history."
                );

                assessments = [];
            }

            assessments.push(assessment);

            localStorage.setItem(
                "healthqmlAssessments",
                JSON.stringify(assessments)
            );

            console.log(
                "Saved BreastCancerQML assessment:",
                assessment
            );

            if (formMessage) {
                formMessage.textContent =
                    "Analysis complete. Opening results...";
            }

            // Open analysis page
            window.location.href = "analysis.html";

        } catch (error) {
            console.error(
                "Prediction error:",
                error
            );

            if (formMessage) {
                formMessage.textContent =
                    "Unable to connect to the AI backend. Please try again.";
            }

            alert(
                "Backend connection failed.\n\n" +
                "Please try again in a moment."
            );
        }
    });
});
