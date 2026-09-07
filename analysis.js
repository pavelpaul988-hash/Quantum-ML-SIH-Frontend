// ============================================================
// BREASTCANCERQML
// Analysis Page Controller
// ============================================================

const progressBar = document.getElementById("progressBar");
const progressPercent = document.getElementById("progressPercent");

const steps = [
    document.getElementById("step1"),
    document.getElementById("step2"),
    document.getElementById("step3"),
    document.getElementById("step4"),
    document.getElementById("step5")
];


// ============================================================
// UPDATE STEP
// ============================================================

function activateStep(index) {

    steps.forEach((step, i) => {

        const status = step.querySelector(".step-status");

        if (i < index) {

            step.classList.remove("active");
            step.classList.add("completed");

            status.textContent = "Completed";

        } else if (i === index) {

            step.classList.add("active");
            step.classList.remove("completed");

            status.textContent = "Processing";

        } else {

            step.classList.remove("active");
            step.classList.remove("completed");

            status.textContent = "Waiting";
        }
    });
}


// ============================================================
// UPDATE PROGRESS
// ============================================================

function updateProgress(value) {

    progressBar.style.width = `${value}%`;
    progressPercent.textContent = `${value}%`;
}


// ============================================================
// START ANALYSIS
// ============================================================

function startAnalysis() {

    let progress = 0;

    activateStep(0);
    updateProgress(0);

    const interval = setInterval(() => {

        progress += 5;

        updateProgress(progress);

        if (progress >= 20) {
            activateStep(1);
        }

        if (progress >= 40) {
            activateStep(2);
        }

        if (progress >= 60) {
            activateStep(3);
        }

        if (progress >= 80) {
            activateStep(4);
        }

        if (progress >= 100) {

            clearInterval(interval);

            steps.forEach(step => {

                step.classList.remove("active");
                step.classList.add("completed");

                step.querySelector(
                    ".step-status"
                ).textContent = "Completed";

            });

            setTimeout(() => {

                window.location.href = "results.html";

            }, 800);
        }

    }, 250);
}


// ============================================================
// START
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "BreastCancerQML analysis started."
        );

        startAnalysis();
    }
);