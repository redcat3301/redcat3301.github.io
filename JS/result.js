//back button
function goBack() {
    window.history.back();
}
//JavaScript to check results
    function checkResult() {
        const subject = document.getElementById('subject').value;
        const examNo = document.getElementById('exam').value;
        const studentId = document.getElementById('studentId').value;

        // Map the subject to the short form
        const subjectMap = {
            "General Math": "gm",
            "Higher Math": "hm",
            "Physics": "phy",
            "Chemistry": "chem"
        };
        
        // Get the short form for the subject
        const subjectShortForm = subjectMap[subject];
        
        // Create the sheet name
        const sheetName = `${subjectShortForm}-${examNo.split('-')[1]}`;
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A:D?key=${apiKey}`;

        // Show the loading spinner
        document.getElementById('loading').style.display = 'block';
        document.getElementById('name').innerText = '';
        document.getElementById('score').innerText = '';
        document.getElementById('position').innerText = '';

        $.getJSON(url, function(data) {
            // Hide the loading spinner
            document.getElementById('loading').style.display = 'none';

            const rows = data.values;
            const headers = rows[0];
            const studentIndex = headers.indexOf('Your Phone Number = Student ID');
            const nameIndex = headers.indexOf('Name');
            const scoreIndex = headers.indexOf('Score');
            const positionIndex = headers.indexOf('Position');

            let resultFound = false;
            for (let i = 1; i < rows.length; i++) {
                if (rows[i][studentIndex] === studentId) {
                    document.getElementById('name').innerText = `Name: ${rows[i][nameIndex]}`;
                    document.getElementById('score').innerText = `Score: ${rows[i][scoreIndex]}`;
                    document.getElementById('position').innerText = `Position: ${rows[i][positionIndex]}`;
                    resultFound = true;
                    break;
                }
            }
            if (!resultFound) {
                document.getElementById('name').innerText = 'No result found for the given Student ID.Wait for 10 minutes & recheck again.';
                document.getElementById('score').innerText = '';
                document.getElementById('position').innerText = '';
            }
        }).fail(function() {
            // Hide the loading spinner in case of an error
            document.getElementById('loading').style.display = 'none';
            document.getElementById('name').innerText = 'Failed to retrieve results. Please try again.';
        });
    }