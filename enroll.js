document.getElementById("inmateForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
        Name: document.getElementById("name").value,
        DOB: document.getElementById("dob").value,
        Gender: document.getElementById("gender").value,
        Address: document.getElementById("address").value,
        Sentence_Duration: document.getElementById("sentence_duration").value
    };

    try {
        const response = await fetch("http://localhost:5000/prisoners/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error("❌ Error:", error);
        alert("⚠️ Failed to add inmate.");
    }
});