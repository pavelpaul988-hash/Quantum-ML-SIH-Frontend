// ============================================================
// BREASTCANCERQML - RESULTS
// ============================================================

document.addEventListener("DOMContentLoaded", loadResults);


// ============================================================
// HELPERS
// ============================================================

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


function setWidth(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.style.width = `${Number(value) || 0}%`;
    }
}


function formatPercent(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0.0%";
    }

    // Backend sends probabilities as decimals, e.g. 0.85
    // Convert them to percentages.
    if (number <= 1) {
        return `${(number * 100).toFixed(1)}%`;
    }

    return `${number.toFixed(1)}%`;
}


function percentValue(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    if (number <= 1) {
        return number * 100;
    }

    return number;
}


function formatFeatureName(name) {

    const names = {
        meanRadius: "Mean Radius",
        meanTexture: "Mean Texture",
        meanPerimeter: "Mean Perimeter",
        meanArea: "Mean Area",
        meanSmoothness: "Mean Smoothness",
        meanCompactness: "Mean Compactness",
        meanConcavity: "Mean Concavity",
        meanConcavePoints: "Mean Concave Points",
        meanSymmetry: "Mean Symmetry",
        meanFractalDimension: "Mean Fractal Dimension"
    };

    return names[name] || name;
}


// ============================================================
// LOAD DATA
// ============================================================

function loadResults() {

    console.log("Loading BreastCancerQML results...");

    const stored =
        localStorage.getItem("healthqmlCurrentAssessment");


    if (!stored) {

        console.error(
            "healthqmlCurrentAssessment not found."
        );

        showError(
            "No assessment data was found. Please perform a new analysis."
        );

        return;
    }


    let assessment;


    try {

        assessment = JSON.parse(stored);

    } catch (error) {

        console.error(
            "Invalid localStorage data:",
            error
        );

        showError(
            "The saved assessment data could not be read."
        );

        return;
    }


    console.log(
        "Saved assessment:",
        assessment
    );


    // --------------------------------------------------------
    // Find prediction data
    // --------------------------------------------------------

    let prediction =
        assessment.prediction;


    if (!prediction && assessment.classical_ml) {

        prediction = assessment;

    }


    if (!prediction) {

        console.error(
            "Prediction missing:",
            assessment
        );

        showError(
            "Prediction data is unavailable. Please run the analysis again."
        );

        return;
    }


    console.log(
        "Prediction:",
        prediction
    );


    // --------------------------------------------------------
    // Extract model results
    // --------------------------------------------------------

    const classical =
        prediction.classical_ml;

    const quantum =
        prediction.quantum_ml;

    const hybrid =
        prediction.hybrid;


    if (!classical || !quantum || !hybrid) {

        console.error(
            "Incomplete prediction:",
            prediction
        );

        showError(
            "The backend returned incomplete model results."
        );

        return;
    }


    // ========================================================
    // HYBRID RESULT
    // ========================================================

    const hybridConfidence =
        percentValue(hybrid.confidence);


    setText(
        "hybridPrediction",
        hybrid.classification || hybrid.prediction
    );


    setText(
        "hybridConfidence",
        formatPercent(hybrid.confidence)
    );


    setWidth(
        "hybridConfidenceBar",
        hybridConfidence
    );


    setText(
        "hybridCardPrediction",
        hybrid.classification || hybrid.prediction
    );


    setText(
        "hybridCardConfidence",
        formatPercent(hybrid.confidence)
    );


    // ========================================================
    // CLASSICAL ML
    // ========================================================

    const classicalConfidence =
        percentValue(classical.confidence);


    setText(
        "classicalPrediction",
        classical.classification || classical.prediction
    );


    setText(
        "classicalConfidence",
        formatPercent(classical.confidence)
    );


    // --------------------------------------------------------
    // Classical probabilities
    // --------------------------------------------------------

    const classicalBenign =
        percentValue(
            classical.benign_probability
        );


    const classicalMalignant =
        percentValue(
            classical.malignant_probability
        );


    setText(
        "classicalBenign",
        `${classicalBenign.toFixed(1)}%`
    );


    setText(
        "classicalMalignant",
        `${classicalMalignant.toFixed(1)}%`
    );


    setWidth(
        "classicalBenignBar",
        classicalBenign
    );


    setWidth(
        "classicalMalignantBar",
        classicalMalignant
    );


    // ========================================================
    // QUANTUM ML
    // ========================================================

    const quantumConfidence =
        percentValue(quantum.confidence);


    setText(
        "quantumPrediction",
        quantum.classification || quantum.prediction
    );


    setText(
        "quantumConfidence",
        formatPercent(quantum.confidence)
    );


    // --------------------------------------------------------
    // Quantum probabilities
    // --------------------------------------------------------

    const quantumBenign =
        percentValue(
            quantum.benign_probability
        );


    const quantumMalignant =
        percentValue(
            quantum.malignant_probability
        );


    setText(
        "quantumBenign",
        `${quantumBenign.toFixed(1)}%`
    );


    setText(
        "quantumMalignant",
        `${quantumMalignant.toFixed(1)}%`
    );


    setWidth(
        "quantumBenignBar",
        quantumBenign
    );


    setWidth(
        "quantumMalignantBar",
        quantumMalignant
    );


    // ========================================================
    // HYBRID PROBABILITY
    // ========================================================

    const hybridBenign =
        percentValue(
            hybrid.benign_probability
        );


    const hybridMalignant =
        percentValue(
            hybrid.malignant_probability
        );


    setText(
        "hybridProbability",
        formatPercent(hybrid.confidence)
    );


    setText(
        "hybridBenign",
        `${hybridBenign.toFixed(1)}%`
    );


    setText(
        "hybridMalignant",
        `${hybridMalignant.toFixed(1)}%`
    );


    updateProbabilityCircle(
        hybridConfidence
    );


    // ========================================================
    // RESULT MESSAGE
    // ========================================================

    const classification =
        String(
            hybrid.classification ||
            hybrid.prediction ||
            ""
        ).toLowerCase();


    if (classification === "benign") {

        setText(
            "resultMessage",
            "The hybrid model classified this sample as benign based on the supplied features."
        );

    } else {

        setText(
            "resultMessage",
            "The hybrid model classified this sample as malignant based on the supplied features."
        );
    }


    // ========================================================
    // MODEL CHART
    // ========================================================

    createModelChart(
        classicalConfidence,
        quantumConfidence,
        hybridConfidence
    );


    // ========================================================
    // FEATURE IMPORTANCE
    // ========================================================

    createFeatureImportance(
        prediction.feature_importance
    );


    // ========================================================
    // INPUT FEATURES
    // ========================================================

    createFeatureValues(
        assessment.features
    );


    console.log(
        "BreastCancerQML results loaded successfully."
    );
}


// ============================================================
// ERROR
// ============================================================

function showError(message) {

    setText(
        "resultMessage",
        message
    );
}


// ============================================================
// PROBABILITY CIRCLE
// ============================================================

function updateProbabilityCircle(
    confidence
) {

    const circle =
        document.querySelector(".prob-circle");


    if (!circle) {
        return;
    }


    const degrees =
        Number(confidence) * 3.6;


    circle.style.background =
        `conic-gradient(
            #5268b2 0deg,
            #5268b2 ${degrees}deg,
            #e9edf3 ${degrees}deg,
            #e9edf3 360deg
        )`;
}


// ============================================================
// MODEL CHART
// ============================================================

function createModelChart(
    classical,
    quantum,
    hybrid
) {

    const chart =
        document.getElementById(
            "modelChart"
        );


    if (!chart) {
        return;
    }


    chart.innerHTML = "";


    const models = [

        {
            name: "Classical ML",
            value: Number(classical)
        },

        {
            name: "Quantum ML",
            value: Number(quantum)
        },

        {
            name: "Hybrid AI",
            value: Number(hybrid)
        }

    ];


    models.forEach(model => {

        const column =
            document.createElement("div");


        column.className =
            "chart-column";


        const value =
            document.createElement("div");


        value.className =
            "chart-value";


        value.textContent =
            `${model.value.toFixed(1)}%`;


        const bar =
            document.createElement("div");


        bar.className =
            "chart-bar";


        bar.style.height =
            `${Math.max(model.value, 3)}%`;


        const label =
            document.createElement("div");


        label.className =
            "chart-label";


        label.textContent =
            model.name;


        column.appendChild(value);

        column.appendChild(bar);

        column.appendChild(label);


        chart.appendChild(column);

    });
}


// ============================================================
// FEATURE IMPORTANCE
// ============================================================

function createFeatureImportance(
    features
) {

    const container =
        document.getElementById(
            "featureImportance"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!features) {

        container.innerHTML =
            `<div class="loading">
                Feature importance unavailable.
            </div>`;

        return;
    }


    // --------------------------------------------------------
    // Backend sends feature importance as an object:
    //
    // {
    //   "Mean Radius": 0.12,
    //   "Mean Texture": 0.08
    // }
    //
    // Convert it into an array for the existing UI.
    // --------------------------------------------------------

    let featureArray = [];


    if (Array.isArray(features)) {

        featureArray = features;

    } else if (
        typeof features === "object"
    ) {

        featureArray =
            Object.entries(features)
                .map(
                    ([feature, importance]) => ({
                        feature,
                        importance
                    })
                );
    }


    if (
        featureArray.length === 0
    ) {

        container.innerHTML =
            `<div class="loading">
                Feature importance unavailable.
            </div>`;

        return;
    }


    const max =
        Math.max(
            ...featureArray.map(
                item =>
                    Number(item.importance) || 0
            )
        );


    featureArray.forEach(item => {

        const importance =
            Number(item.importance) || 0;


        const displayImportance =
            importance <= 1
                ? importance * 100
                : importance;


        const width =
            max > 0
                ? (importance / max) * 100
                : 0;


        const row =
            document.createElement("div");


        row.className =
            "feature-row";


        const name =
            document.createElement("div");


        name.className =
            "feature-name";


        name.textContent =
            formatFeatureName(
                item.feature
            );


        const track =
            document.createElement("div");


        track.className =
            "feature-track";


        const bar =
            document.createElement("div");


        bar.className =
            "feature-bar";


        bar.style.width =
            `${width}%`;


        const value =
            document.createElement("div");


        value.className =
            "feature-value";


        value.textContent =
            `${displayImportance.toFixed(2)}%`;


        track.appendChild(bar);


        row.appendChild(name);

        row.appendChild(track);

        row.appendChild(value);


        container.appendChild(row);

    });
}


// ============================================================
// INPUT FEATURES
// ============================================================

function createFeatureValues(
    features
) {

    const container =
        document.getElementById(
            "featureValues"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!features) {
        return;
    }


    Object.entries(features)
        .forEach(([name, value]) => {

            const item =
                document.createElement("div");


            item.className =
                "input-item";


            const label =
                document.createElement("span");


            label.textContent =
                formatFeatureName(name);


            const number =
                document.createElement("strong");


            const numericValue =
                Number(value);


            number.textContent =
                Number.isFinite(
                    numericValue
                )
                    ? numericValue.toFixed(4)
                    : value;


            item.appendChild(label);

            item.appendChild(number);


            container.appendChild(item);

        });
}