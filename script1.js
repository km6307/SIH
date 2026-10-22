
const search = document.getElementById("search");
const table = document.getElementById("feedbackTable");

// Search student feedback
search.addEventListener("input", function () {
    const value = search.value.toLowerCase();
    const rows = table.querySelectorAll("tr");

    rows.forEach(function (row) {
        const name = row.cells[1].textContent.toLowerCase();
        row.style.display = name.includes(value) ? "" : "none";
    });
});

// View feedback details
function viewFeedback(button) {
    const row = button.closest("tr");

    const name = row.cells[1].textContent;
    const faculty = row.cells[2].textContent;
    const rating = row.cells[3].textContent;
    const feedback = row.cells[4].textContent;

    alert(
        "Student: " + name +
        "\nFaculty: " + faculty +
        "\nRating: " + rating +
        "\nFeedback: " + feedback
    );
}

// Delete a row from the displayed table
function deleteFeedback(button) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this feedback?"
    );

    if (confirmDelete) {
        button.closest("tr").remove();
        updateStatistics();
    }
}

// Update dashboard statistics
function updateStatistics() {
    const rows = [...table.querySelectorAll("tr")].filter(
        row => row.style.display !== "none"
    );

    const allRows = table.querySelectorAll("tr");
    const total = allRows.length;

    let sum = 0;

    allRows.forEach(function (row) {
        sum += Number(row.cells[3].textContent.split("/")[0]);
    });

    document.getElementById("studentCount").textContent = total;
    document.getElementById("feedbackCount").textContent = total;

    document.getElementById("averageRating").textContent =
        total ? (sum / total).toFixed(1) + "/5" : "0/5";
}

updateStatistics();
