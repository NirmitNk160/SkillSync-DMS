
async function findMatches() {
    const skillsInput = document.getElementById("skills").value.trim();
    const resultsDiv = document.getElementById("results");
    const errorDiv = document.getElementById("error");
    const statsDiv = document.getElementById("stats");
    const searchDiv = document.getElementById("job-search");

    resultsDiv.innerHTML = "";
    errorDiv.textContent = "";

    if (!skillsInput) {
        errorDiv.textContent = "Please enter at least one skill.";
        return;
    }

    try {
        const response = await fetch("/match", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                skills: skillsInput
            })
        });

        if (!response.ok) {
            throw new Error("Server error");
        }

        const jobs = await response.json();

        // Calculate unique student skills
        const uniqueSkills = new Set(
            skillsInput
                .split(",")
                .map(skill => skill.trim().toLowerCase())
                .filter(skill => skill !== "")
        );

        // Best match percentage
        const bestMatch = jobs.length > 0
            ? jobs[0].percentage
            : 0;

        // Dashboard statistics
        statsDiv.style.display = "grid";

        statsDiv.innerHTML = `
            <div class="stat-card">
                <p>Total Opportunities</p>
                <h2>${jobs.length}</h2>
                <span>Available jobs and internships</span>
            </div>

            <div class="stat-card">
                <p>Best Match</p>
                <h2>${bestMatch}%</h2>
                <span>Highest skill compatibility</span>
            </div>

            <div class="stat-card">
                <p>Your Skills</p>
                <h2>${uniqueSkills.size}</h2>
                <span>Unique skills entered</span>
            </div>
        `;

        // Show search and reset controls
        searchDiv.style.display = "flex";

        // Results heading
        resultsDiv.innerHTML = `
            <h2 class="result-heading">
                Your Matching Opportunities
            </h2>

            <p class="result-subtitle">
                Opportunities ranked by skill compatibility
            </p>
        `;

        // Display job cards
        jobs.forEach((job, index) => {

            const matched = job.matched.length
                ? job.matched.join(", ")
                : "None";

            const missing = job.missing.length
                ? job.missing.join(", ")
                : "None";

            const studentSet = job.student_skills.join(", ");
            const requiredSet = job.required_skills.join(", ");

            resultsDiv.innerHTML += `
                <div class="job-card">

                    ${
                        index === 0 && job.percentage > 0
                        ? '<span class="best-match">⭐ Best Match</span>'
                        : ""
                    }

                    <h3>${job.title}</h3>

                    <p class="company">
                        ${job.company}
                    </p>

                    <div class="match">
                        ${job.percentage}% Match
                    </div>

                    <div class="progress">
                        <div class="progress-fill"
                             style="width: ${job.percentage}%">
                        </div>
                    </div>

                    <p class="skills">
                        <strong>Matched Skills:</strong>
                        ${matched}
                    </p>

                    <p class="skills">
                        <strong>Missing Skills:</strong>
                        ${missing}
                    </p>

                    <details class="dms-details">

                        <summary>
                            View DMS Set Theory Calculation
                        </summary>

                        <div class="math-panel">

                            <p><strong>Student Set A:</strong></p>
                            <code>A = {${studentSet}}</code>

                            <p><strong>Job Requirement Set B:</strong></p>
                            <code>B = {${requiredSet}}</code>

                            <p><strong>Intersection (A ∩ B):</strong></p>
                            <code>{${matched}}</code>

                            <p><strong>Set Difference (B − A):</strong></p>
                            <code>{${missing}}</code>

                            <p><strong>Cardinality:</strong></p>
                            <code>
                                |A ∩ B| = ${job.matched.length}
                            </code>

                            <p><strong>Match Formula:</strong></p>
                            <code>
                                (${job.matched.length} /
                                ${job.required_skills.length}) × 100
                                = ${job.percentage}%
                            </code>

                        </div>

                    </details>

                </div>
            `;
        });

    } catch (error) {
        console.error(error);

        errorDiv.textContent =
            "Unable to connect to server. Please try again.";
    }
}


// Search/filter jobs
function filterJobs() {

    const searchValue = document
        .getElementById("searchJob")
        .value
        .toLowerCase()
        .trim();

    const jobCards = document.querySelectorAll(".job-card");

    jobCards.forEach(card => {

        const text = card.textContent.toLowerCase();

        card.style.display = text.includes(searchValue)
            ? "block"
            : "none";

    });
}


// Reset SkillSync
function resetSkillSync() {

    // Clear student skills
    document.getElementById("skills").value = "";

    // Clear search
    document.getElementById("searchJob").value = "";

    // Clear results
    document.getElementById("results").innerHTML = "";

    // Clear dashboard
    document.getElementById("stats").innerHTML = "";
    document.getElementById("stats").style.display = "none";

    // Hide search
    document.getElementById("job-search").style.display = "none";

    // Clear error
    document.getElementById("error").textContent = "";

    // Focus input
    document.getElementById("skills").focus();

}
