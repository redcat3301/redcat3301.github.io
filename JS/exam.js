//Back Button
function goBack() {
    window.history.back();
}
// Function to toggle box content visibility
function toggleBoxContent(boxNumber) {
    var boxContent = document.getElementById('box' + boxNumber + '-content');
    var icon = document.querySelector('.box:nth-of-type(' + boxNumber + ') .icon');
    if (boxContent.style.display === 'none' || boxContent.style.display === '') {
        boxContent.style.display = 'block';
        icon.classList.add('expanded');
    } else {
        boxContent.style.display = 'none';
        icon.classList.remove('expanded');
    }
}

// Fetch data from the Google Sheet
async function fetchSheetData() {
    // const sheet name get from html
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${examSheetID}/values/${sheetName}?key=${API_KEY}`; // Replace with your API key

    try {
        const response = await fetch(url);
        const data = await response.json();
        updatePageContent(data.values);
    } catch (error) {
        console.error('Error fetching sheet data:', error);
    }
}

// Update the page content based on the fetched data
function updatePageContent(data) {
    const container = document.getElementById('box-container');

    // Group data by chapters
    const chapters = data.reduce((acc, row) => {
        const [chapter, className, classLink] = row;
        if (!acc[chapter]) {
            acc[chapter] = [];
        }
        acc[chapter].push({ className, classLink });
        return acc;
    }, {});

    // Create HTML elements for each chapter and class
    Object.keys(chapters).forEach((chapter, index) => {
        const chapterBox = document.createElement('div');
        chapterBox.className = 'box';
        chapterBox.onclick = () => toggleBoxContent(index + 1);
        
        const boxTitle = document.createElement('div');
        boxTitle.className = 'box-title';
        boxTitle.textContent = chapter;
        
        const boxContent = document.createElement('div');
        boxContent.className = 'box-content';
        boxContent.id = `box${index + 1}-content`;

        const classList = document.createElement('ol');
        chapters[chapter].forEach(({ className, classLink }) => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = classLink;
            link.target = '_blank';
            link.textContent = className;
            listItem.appendChild(link);
            classList.appendChild(listItem);
        });

        boxContent.appendChild(classList);
        chapterBox.appendChild(boxTitle);
        chapterBox.appendChild(boxContent);

        const icon = document.createElement('i');
        icon.className = 'icon';
        chapterBox.appendChild(icon);

        container.appendChild(chapterBox);
    });
}

// Initialize the page with sheet data
document.addEventListener('DOMContentLoaded', fetchSheetData);