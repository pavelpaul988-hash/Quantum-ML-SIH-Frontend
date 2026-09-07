
/* =========================================
   HEALTHQML DASHBOARD JAVASCRIPT
   ========================================= */


/* =========================================
   CHECK LOGIN
   ========================================= */

const loggedIn =
    localStorage.getItem("healthqmlLoggedIn");

if (loggedIn !== "true") {

    window.location.href = "login.html";

}


/* =========================================
   SHOW USER EMAIL
   ========================================= */

const userEmailElement =
    document.getElementById("userEmail");

const savedUser =
    localStorage.getItem("healthqmlUser");


if (userEmailElement && savedUser) {

    userEmailElement.textContent =
        savedUser;

}


/* =========================================
   CURRENT YEAR
   ========================================= */

const currentYear =
    document.getElementById("currentYear");


if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


/* =========================================
   MOBILE SIDEBAR
   ========================================= */

const menuButton =
    document.getElementById("menuButton");

const sidebar =
    document.getElementById("sidebar");


if (menuButton && sidebar) {

    menuButton.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle("open");

        }
    );

}


/* =========================================
   LOGOUT
   ========================================= */

const logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "healthqmlLoggedIn"
            );

            localStorage.removeItem(
                "healthqmlUser"
            );


            window.location.href =
                "login.html";

        }
    );

}


/* =========================================
   LOAD ASSESSMENT COUNT
   ========================================= */

const assessmentCount =
    document.getElementById("assessmentCount");


const assessmentHistory =
    JSON.parse(
        localStorage.getItem(
            "healthqmlAssessments"
        )
    ) || [];


if (assessmentCount) {

    assessmentCount.textContent =
        assessmentHistory.length;

}


/* =========================================
   LOAD LATEST RISK
   ========================================= */

const latestRisk =
    document.getElementById("latestRisk");


if (
    latestRisk &&
    assessmentHistory.length > 0
) {

    const latest =
        assessmentHistory[
            assessmentHistory.length - 1
        ];


    if (latest.risk) {

        latestRisk.textContent =
            latest.risk;

    }

}


/* =========================================
   CONSOLE
   ========================================= */

console.log(
    "HealthQML Dashboard loaded successfully."
);
