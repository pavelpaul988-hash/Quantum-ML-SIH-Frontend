
/* ==========================================
   HEALTHQML - MAIN JAVASCRIPT
   SIH IH26139
   ========================================= */


/* =========================================
   MOBILE MENU
   ========================================= */

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

if (menuToggle && mobileMenu) {

    menuToggle.addEventListener("click", function () {

        mobileMenu.classList.toggle("active");

    });


    /* Close mobile menu after clicking a link */

    const mobileLinks = mobileMenu.querySelectorAll("a");

    mobileLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            mobileMenu.classList.remove("active");

        });

    });

}


/* =========================================
   NAVBAR SCROLL EFFECT
   ========================================= */

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", function () {

    if (!navbar) {
        return;
    }

    if (window.scrollY > 20) {

        navbar.style.boxShadow =
            "0 8px 30px rgba(23, 32, 51, 0.08)";

    } else {

        navbar.style.boxShadow = "none";

    }

});


/* =========================================
   SMOOTH SCROLL
   ========================================= */

const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

        const targetId = this.getAttribute("href");

        if (targetId === "#") {
            return;
        }

        const target = document.querySelector(targetId);

        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});


/* =========================================
   CURRENT YEAR
   ========================================= */

const currentYear = document.getElementById("currentYear");

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


/* =========================================
   PAGE LOAD MESSAGE
   ========================================= */

console.log(
    "HealthQML website loaded successfully."
);

console.log(
    "SIH Problem Statement: IH26139"
);


/* =========================================
   BACKEND CONNECTION TEST
   ========================================= */

async function testBackend() {

    try {

        const response = await fetch(
            "https://quantum-ml-backend-sih.onrender.com/api/health"
        );

        if (!response.ok) {

            throw new Error(
                "Backend returned status: " + response.status
            );

        }

        const data = await response.json();

        console.log(
            "Backend response:",
            data
        );

    } catch (error) {

        console.error(
            "Backend connection failed:",
            error
        );

    }

}


/* Start backend connection test */

testBackend();
