
const API_URL = "/api/Jobs";

let editingJobId = null;

// Load all jobs
async function loadJobs() {
    const table = document.getElementById("jobsTable");

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch jobs");
        }

        const jobs = await response.json();

        table.innerHTML = "";

        if (jobs.length === 0) {
            table.innerHTML = `<tr><td colspan="6">No jobs available</td></tr>`;
            return;
        }

        jobs.forEach(job => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${job.id}</td>
                <td>${escapeHtml(job.title)}</td>
                <td>${escapeHtml(job.company)}</td>
                <td>${escapeHtml(job.location)}</td>
                <td>${job.salary}</td>
                <td>
                    <button class="edit-btn" onclick="editJob(${job.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteJob(${job.id})">Delete</button>
                </td>
            `;

            table.appendChild(row);
        });
    }
    catch (error) {
        table.innerHTML = `<tr><td colspan="6">Unable to load jobs. Check API.</td></tr>`;
        console.error(error);
    }
}

// Prevent HTML injection in text fields
function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Add or Update Job
document.getElementById("jobForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const job = {
        title: document.getElementById("title").value.trim(),
        company: document.getElementById("company").value.trim(),
        location: document.getElementById("location").value.trim(),
        salary: Number(document.getElementById("salary").value)
    };

    const isEditing = editingJobId !== null;
    const url = isEditing ? `${API_URL}/${editingJobId}` : API_URL;
    const method = isEditing ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(job)
        });

        if (!response.ok) {
            throw new Error("Unable to save job");
        }

        showMessage(isEditing ? "Job updated successfully!" : "Job added successfully!", "green");

        resetForm();
        await loadJobs();
    }
    catch (error) {
        showMessage(error.message, "red");
        console.error(error);
    }
});

// Edit Job
async function editJob(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error("Unable to fetch job");
        }

        const job = await response.json();

        editingJobId = id;

        document.getElementById("title").value = job.title;
        document.getElementById("company").value = job.company;
        document.getElementById("location").value = job.location;
        document.getElementById("salary").value = job.salary;

        document.getElementById("formTitle").textContent = "Update Job";
        document.getElementById("submitBtn").textContent = "Update Job";
        document.getElementById("cancelBtn").hidden = false;

        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    catch (error) {
        showMessage(error.message, "red");
    }
}

// Delete Job
async function deleteJob(id) {
    if (!confirm("Are you sure you want to delete this job?")) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Unable to delete job");
        }

        showMessage("Job deleted successfully!", "green");
        await loadJobs();
    }
    catch (error) {
        showMessage(error.message, "red");
    }
}

// Reset form
function resetForm() {
    editingJobId = null;
    document.getElementById("jobForm").reset();
    document.getElementById("formTitle").textContent = "Add New Job";
    document.getElementById("submitBtn").textContent = "Add Job";
    document.getElementById("cancelBtn").hidden = true;
}

document.getElementById("cancelBtn").addEventListener("click", resetForm);

// Display message
function showMessage(message, color) {
    const element = document.getElementById("message");
    element.textContent = message;
    element.style.color = color;
}

// Load jobs when page opens
loadJobs();
