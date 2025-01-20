document.addEventListener("DOMContentLoaded", function() {
    // Fetch the JSON data
    fetch('companies_with_websites.json')
        .then(response => response.json())
        .then(data => {
            // Populate filters and table
            populateFilters(data);
            displayTable(data);
        });

    // Populate the date and program filters
    function populateFilters(data) {
        const dateFilter = document.getElementById('dateFilter');
        const programFilter = document.getElementById('programFilter');

        const uniqueDates = [...new Set(data.map(item => item.date))];
        const uniquePrograms = [...new Set(removeDuplicate(data.flatMap(item => item.departments)))].sort();
        const uniqueProgramsExplication = removeDuplicate(uniquePrograms, true);

        uniqueDates.forEach(date => {
            const option = document.createElement('option');
            option.value = date;
            option.textContent = date;
            dateFilter.appendChild(option);
        });

        uniquePrograms.forEach((program, i) => {
            const option = document.createElement('option');
            option.value = program;
            option.textContent = uniqueProgramsExplication[i];
            programFilter.appendChild(option);
        });

        programFilter.style.height = (uniquePrograms.length * 20).toString() + "px";

        // Add event listeners for the filter changes
        dateFilter.addEventListener('change', filterData);
        programFilter.addEventListener('change', filterData);
    }

    // Filter and display data based on selected filters
    function filterData() {
        const selectedDates = Array.from(document.getElementById('dateFilter').selectedOptions).map(option => option.value);
        const selectedPrograms = Array.from(document.getElementById('programFilter').selectedOptions).map(option => option.value);

        fetch('companies_with_websites.json')
            .then(response => response.json())
            .then(data => {
                const filteredData = data.filter(item => {
                    const dateMatch = selectedDates.length === 0 || selectedDates.includes(item.date);
                    const programMatch = selectedPrograms.length === 0 || removeDuplicate(item.departments).some(program => selectedPrograms.includes(program));
                    return dateMatch && programMatch;
                });
                displayTable(filteredData);
            });
    }
    
    // Function to update the number of displayed results
    function updateResultsCount(results) {
        const resultsCount = document.getElementById("resultsCount");
        resultsCount.textContent = `Displaying ${results.length} results`;
    }

    // Display the data in the table format
    function displayTable(data) {
        const tableContainer = document.getElementById('data-table-container');
        tableContainer.innerHTML = '';

        if (data.length === 0) {
            tableContainer.innerHTML = '<p>No matching data found.</p>';
            updateResultsCount(data);
            return;
        }

        let tableHTML = '<table><thead><tr><th>Date</th><th>Company Name</th><th>Programs</th><!--<th>Website</th>--></tr></thead><tbody>';

        data.forEach(item => {
            tableHTML += `
                <tr>
                    <td>${item.date}</td>
                    <td>${item.employer_name}</td>
                    <td>${removeDuplicate(item.departments).sort().join(', ')}</td>
                    <!--<td><a href="${item.website}" target="_blank">${item.website || 'Not found'}</a></td>-->
                </tr>
            `;
        });

        tableHTML += '</tbody></table>';
        tableContainer.innerHTML = tableHTML;

        updateResultsCount(data);
    }

    /**
     * 
     * @param {string[]} list 
     */
    function removeDuplicate(list, explication = false) {
        var mappedList = list.map((item) => {
            if (item === "Doctorat" || item === "DOC")
                return explication ? "DOC (Doctorat)" : "DOC";

            if (item === "Maîtrise" || item === "Maitrise" || item === "MAI")
                return explication ? "MAI (Maîtrise)" : "MAI";

            if (item === "ÉLÉ")
                return "ELE";

            if (item === "CONS")
                return "CTN"

            return item;
        })
        return mappedList;
    }
});
