// Get references to DOM elements that we'll interact with
const uploadArea = document.getElementById('uploadArea');  // The drag-and-drop area
const fileInput = document.getElementById('fileInput');    // Hidden file input element
const results = document.getElementById('results');        // Container to show processing results
const error = document.getElementById('error');            // Container to show error messages

const site = [
  "SampleID", "Site", "Treatment", "Lat", "Long", "Texture",
  "Irrigation", "SampleDepth", "Elevation", "SoilSeries", "Suborder",
  "Region", "Crop", "Slope", "GrowingDays", "MAP"
]
const tech = [
  "Season", "Mineral", "PMethod", "Weathering", "ECMethod"
]
const factor = [
  "OMClass", "TextureClass", "ClimateClass", "Fe2O3Class", 
  "SeasonCode",
]
const measure = [
  "Clay", "Sand", "WSA", "Bd", "pH", "EC", "SOC", "MBC", "PMN", "BG"
]
const crop = [
  "Crop", "CropCode", "Tsat", "T1", "dT", "m", "max"
]
const score = ['SampleID', 'SOC_Score', 'WSA_Score', 'BD_Score', 'pH_Score', 'EC_Score', 'MBC_Score', 'PMN_Score',
        'BG_Score', 'K_score', 'P_score', 'Physical_Score', 'Biological_Score', 'Chemical_Score', 'Nutrient_Score', 'Overall_Score']

/* ===== CROP VALUE LOOKUP INFO ===== */
const cropValues = new Map([
    ['alfalfa', {
        code: 1,
        tsat: 2,
        dt: 7.3,
        b: 6.8,
        c: 1.3,
        optp: 23
    }],
    ['almond', {
        code: 2,
        tsat: 1.5,
        dt: 19,
        b: 6.25,
        c: 0.75,
        optp: 19
    }],
    ['apples', {
        code: 3,
        tsat: 1.6,
        dt: 10,
        b: 6.3,
        c: 0.7,
        optp: 19
    }],
    ['apricot', {
        code: 4,
        tsat: 1.6,
        dt: 24,
        b: 6.25,
        c: 0.75,
        optp: 19
    }],
    ['asparagus', {
        code: 5,
        tsat: 7.1,
        dt: 10,
        b: 6.5,
        c: 0.6,
        optp: 19
    }],
    ['avocado', {
        code: 6,
        tsat: 1.6,
        dt: 10,
        b: 6.3,
        c: 2,
        optp: 19
    }],
    ['banana', {
        code: 7,
        tsat: 4.4,
        dt: 10,
        b: 6.3,
        c: 2,
        optp: 19
    }],
    ['barley, malt barley', {
        code: 8,
        tsat: 6,
        dt: 7.1,
        b: 6.25,
        c: 0.75,
        optp: 19
    }],
    ['beans, dried', {
        code: 9,
        tsat: 1,
        dt: 19,
        b: 6.15,
        c: 1.5,
        optp: 20
    }],
    ['bermuda grass, coastal', {
        code: 11,
        tsat: 6.9,
        dt: 6.4,
        b: 6.3,
        c: 2,
        optp: 19
    }],
    ['blackberry', {
        code: 12,
        tsat: 1.5,
        dt: 22,
        b: 6.25,
        c: 1.75,
        optp: 19
    }],
    ['blueberries', {
        code: 13,
        tsat: 2,
        dt: 10,
        b: 5.9,
        c: 1.1,
        optp: 19
    }],
    ['bluegrass', {
        code: 14,
        tsat: 9,
        dt: 5.1,
        b: 6.7,
        c: 1.5,
        optp: 12
    }],
    ['bluestem, big', {
        code: 15,
        tsat: 1.3,
        dt: 10,
        b: 6.5,
        c: 1,
        optp: 12
    }],
    ['bluestem, little', {
        code: 16,
        tsat: 1.3,
        dt: 10,
        b: 6.25,
        c: 2.5,
        optp: 12
    }],
    ['broccoli', {
        code: 18,
        tsat: 2.8,
        dt: 9.2,
        b: 6.3,
        c: 0.7,
        optp: 19
    }],
    ['buckwheat', {
        code: 19,
        tsat: 6,
        dt: 10,
        b: 6.65,
        c: 0.85,
        optp: 19
    }],
    ['cabbage', {
        code: 20,
        tsat: 1.8,
        dt: 9.7,
        b: 6.3,
        c: 0.7,
        optp: 19
    }],
    ['cantaloupe', {
        code: 21,
        tsat: 3,
        dt: 10,
        b: 6.1,
        c: 0.65,
        optp: 19
    }],
    ['carrot', {
        code: 22,
        tsat: 1,
        dt: 14,
        b: 6.3,
        c: 0.7,
        optp: 19
    }],
    ['cauliflower', {
        code: 23,
        tsat: 2.5,
        dt: 10,
        b: 6.3,
        c: 0.7,
        optp: 19
    }],
    ['cherries', {
        code: 25,
        tsat: 1.5,
        dt: 10,
        b: 6,
        c: 2,
        optp: 19
    }],
    ['clover, berseem', {
        code: 26,
        tsat: 1.5,
        dt: 5.7,
        b: 6.5,
        c: 1,
        optp: 19
    }],
    ['clover, red, alsike, ladino, strawberry', {
        code: 27,
        tsat: 1.5,
        dt: 12,
        b: 6.5,
        c: 0.7,
        optp: 20
    }],
    ['clover, white', {
        code: 28,
        tsat: 2.3,
        dt: 19,
        b: 6.25,
        c: 0.75,
        optp: 22
    }],
    ['coffee', {
        code: 29,
        tsat: 2,
        dt: 10,
        b: 6.15,
        c: 1.85,
        optp: 19
    }],
    ['corn, sweet', {
        code: 30,
        tsat: 1.7,
        dt: 12,
        b: 6.3,
        c: 2,
        optp: 16
    }],
    ['corn, grain', {
        code: 32,
        tsat: 1.8,
        dt: 7.4,
        b: 6.3,
        c: 2,
        optp: 19
    }],
    ['cotton', {
        code: 33,
        tsat: 7.7,
        dt: 5.2,
        b: 6.35,
        c: 2.05,
        optp: 19
    }],
    ['cowpea', {
        code: 34,
        tsat: 4.9,
        dt: 12,
        b: 5.5,
        c: 1,
        optp: 19
    }],
    ['cranberries', {
        code: 35,
        tsat: 2,
        dt: 10,
        b: 6,
        c: 1.5,
        optp: 19
    }],
    ['cucumber', {
        code: 36,
        tsat: 2.5,
        dt: 13,
        b: 6.5,
        c: 1,
        optp: 19
    }],
    ['date', {
        code: 37,
        tsat: 4,
        dt: 3.6,
        b: 6,
        c: 2,
        optp: 19
    }],
    ['fescue, tall', {
        code: 39,
        tsat: 3.9,
        dt: 5.3,
        b: 6.65,
        c: 1.85,
        optp: 12
    }],
    ['flaxseed; flax', {
        code: 40,
        tsat: 1.7,
        dt: 12,
        b: 6.55,
        c: 1.75,
        optp: 19
    }],
    ['garlic', {
        code: 42,
        tsat: 2,
        dt: 10,
        b: 6.4,
        c: 1.9,
        optp: 19
    }],
    ['grape', {
        code: 43,
        tsat: 1.5,
        dt: 9.6,
        b: 6.5,
        c: 2.2,
        optp: 19
    }],
    ['guava', {
        code: 45,
        tsat: 4,
        dt: 10,
        b: 6.5,
        c: 2.2,
        optp: 19
    }],
    ['hops', {
        code: 46,
        tsat: 4,
        dt: 10,
        b: 6.4,
        c: 1.9,
        optp: 19
    }],
    ['indian grass', {
        code: 47,
        tsat: 1.3,
        dt: 10,
        b: 6.5,
        c: 1,
        optp: 12
    }],
    ['johnsongrass', {
        code: 48,
        tsat: 4,
        dt: 10,
        b: 6.3,
        c: 2,
        optp: 19
    }],
    ['lentils', {
        code: 49,
        tsat: 1,
        dt: 10,
        b: 6.4,
        c: 1.9,
        optp: 19
    }],
    ['lettuce', {
        code: 50,
        tsat: 1.3,
        dt: 13,
        b: 6.45,
        c: 2.25,
        optp: 19
    }],
    ['macadamia orchards', {
        code: 51,
        tsat: 4,
        dt: 10,
        b: 6.5,
        c: 2,
        optp: 19
    }],
    ['melon', {
        code: 52,
        tsat: 2,
        dt: 10,
        b: 6,
        c: 1,
        optp: 19
    }],
    ['mulberry', {
        code: 54,
        tsat: 2,
        dt: 10,
        b: 6.5,
        c: 2.2,
        optp: 19
    }],
    ['oat', {
        code: 55,
        tsat: 2.5,
        dt: 10,
        b: 6,
        c: 2,
        optp: 19
    }],
    ['olive', {
        code: 56,
        tsat: 4.4,
        dt: 0,
        b: 6.25,
        c: 0.75,
        optp: 19
    }],
    ['onion', {
        code: 57,
        tsat: 1.2,
        dt: 16,
        b: 6.25,
        c: 1.95,
        optp: 19
    }],
    ['orchard grass', {
        code: 59,
        tsat: 1.5,
        dt: 6.2,
        b: 6.5,
        c: 0.5,
        optp: 20
    }],
    ['papaya', {
        code: 60,
        tsat: 4.4,
        dt: 10,
        b: 6.15,
        c: 1.85,
        optp: 19
    }],
    ['pea, field; peas', {
        code: 61,
        tsat: 1.6,
        dt: 10,
        b: 6.5,
        c: 1,
        optp: 19
    }],
    ['peach', {
        code: 62,
        tsat: 1.7,
        dt: 21,
        b: 6.55,
        c: 2.05,
        optp: 19
    }],
    ['peanut', {
        code: 63,
        tsat: 3.2,
        dt: 29,
        b: 6.3,
        c: 2,
        optp: 19
    }],
    ['pear', {
        code: 64,
        tsat: 1.6,
        dt: 10,
        b: 6.4,
        c: 1.9,
        optp: 19
    }],
    ['pecans', {
        code: 65,
        tsat: 2,
        dt: 10,
        b: 6.4,
        c: 1.9,
        optp: 19
    }],
    ['pepper', {
        code: 66,
        tsat: 1.5,
        dt: 14,
        b: 6,
        c: 1,
        optp: 19
    }],
    ['pine, lodgepole', {
        code: 67,
        tsat: 6,
        dt: 10,
        b: 5,
        c: 0.5,
        optp: 19
    }],
    ['pine, ponderosa', {
        code: 68,
        tsat: 6,
        dt: 10,
        b: 5,
        c: 0.5,
        optp: 19
    }],
    ['pine, slash', {
        code: 69,
        tsat: 6,
        dt: 10,
        b: 5.75,
        c: 1.25,
        optp: 19
    }],
    ['pineapple', {
        code: 70,
        tsat: 4.4,
        dt: 10,
        b: 5.65,
        c: 2.15,
        optp: 19
    }],
    ['plum', {
        code: 71,
        tsat: 1.5,
        dt: 18,
        b: 6.25,
        c: 0.75,
        optp: 19
    }],
    ['poppy', {
        code: 72,
        tsat: 4,
        dt: 0,
        b: 6.25,
        c: 0.75,
        optp: 19
    }],
    ['potato', {
        code: 73,
        tsat: 1.7,
        dt: 12,
        b: 6.25,
        c: 2.05,
        optp: 19
    }],
    ['raspberry', {
        code: 75,
        tsat: 1.6,
        dt: 10,
        b: 6.25,
        c: 1.25,
        optp: 19
    }],
    ['rice, paddy', {
        code: 76,
        tsat: 3,
        dt: 12,
        b: 6,
        c: 1,
        optp: 19
    }],
    ['ryegrass, perennial', {
        code: 78,
        tsat: 5.6,
        dt: 7.6,
        b: 6.5,
        c: 1.9,
        optp: 19
    }],
    ['safflower', {
        code: 79,
        tsat: 4.4,
        dt: 10,
        b: 6.85,
        c: 1.45,
        optp: 16
    }],
    ['sorghum x sudan grass', {
        code: 80,
        tsat: 5,
        dt: 8.1325,
        b: 6.25,
        c: 0.35,
        optp: 20
    }],
    ['sorghum, grain sorhum', {
        code: 81,
        tsat: 6,
        dt: 10,
        b: 6.5,
        c: 2.2,
        optp: 19
    }],
    ['soybean', {
        code: 82,
        tsat: 5,
        dt: 20,
        b: 6.25,
        c: 1.2,
        optp: 16
    }],
    ['spinach', {
        code: 83,
        tsat: 2,
        dt: 7.6,
        b: 6.5,
        c: 0.5,
        optp: 19
    }],
    ['strawberry', {
        code: 85,
        tsat: 1,
        dt: 33,
        b: 6.4,
        c: 1.9,
        optp: 19
    }],
    ['sugarbeet', {
        code: 87,
        tsat: 7,
        dt: 5.9,
        b: 6.25,
        c: 2.05,
        optp: 19
    }],
    ['sugarcane', {
        code: 88,
        tsat: 1.7,
        dt: 5.9,
        b: 6.35,
        c: 2.05,
        optp: 19
    }],
    ['sunflower', {
        code: 89,
        tsat: 2.5,
        dt: 10,
        b: 6.6,
        c: 2.1,
        optp: 19
    }],
    ['sweet potato', {
        code: 90,
        tsat: 1.5,
        dt: 11,
        b: 6.5,
        c: 2.2,
        optp: 19
    }],
    ['timothy', {
        code: 91,
        tsat: 2,
        dt: null, // No value provided
        b: 6.25,
        c: 0.75,
        optp: 20
    }],
    ['tobacco', {
        code: 92,
        tsat: 2,
        dt: 10,
        b: 6.5,
        c: 2.2,
        optp: 19
    }],
    ['tomato', {
        code: 93,
        tsat: 2.5,
        dt: 9.9,
        b: 6.5,
        c: 2.2,
        optp: 24
    }],
    ['tritcale', {
        code: 94,
        tsat: 7.1,
        dt: 0,
        b: 6.5,
        c: 1,
        optp: 19
    }],
    ['vetch, common or hairy', {
        code: 96,
        tsat: 3,
        dt: 11,
        b: 6.125,
        c: 0.625,
        optp: 19
    }],
    ['walnut', {
        code: 97,
        tsat: 2,
        dt: 10,
        b: 6.65,
        c: 1.65,
        optp: 19
    }],
    ['watermelon', {
        code: 98,
        tsat: 2.5,
        dt: 10,
        b: 7,
        c: 1.7,
        optp: 19
    }],
    ['winter wheat', {
        code: 101,
        tsat: 6,
        dt: 7.1,
        b: 6.25,
        c: 0.75,
        optp: 21
    }],
    ['pine, longleaf', {
        code: 103,
        tsat: 6,
        dt: 10,
        b: 5.75,
        c: 1.25,
        optp: 19
    }]
]);
/* ===== DRAG AND DROP EVENT HANDLERS ===== */

// Handle dragover event - when user drags a file over the upload area
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();  // Prevent default browser behavior (opening the file)
    uploadArea.classList.add('drag-over');  // Add visual feedback class
});

// Handle dragleave event - when user drags file away from upload area
uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');  // Remove visual feedback
});

// Handle drop event - when user releases the file over the upload area
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();  // Prevent default browser behavior
    uploadArea.classList.remove('drag-over');  // Remove visual feedback
    
    const files = e.dataTransfer.files;  // Get the dropped files
    if (files.length > 0) {
        handleFile(files[0]);  // Process the first file only
    }
});

/* ===== CLICK-TO-SELECT FILE HANDLERS ===== */

// Handle click on upload area - triggers file selection dialog
uploadArea.addEventListener('click', () => {
    fileInput.click();  // Programmatically click the hidden file input
});

// Handle file selection through the file input dialog
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);  // Process the selected file
    }
});

/* ===== FILE PROCESSING FUNCTION ===== */

/**
 * Main function to handle file upload and processing
 * @param {File} file - The CSV file to be processed; 
 */
function handleFile(file) {
    // Validate file type - only accept CSV files
    if (!file.name.toLowerCase().endsWith('.csv')) {
        showError('Please select a CSV file.');
        return;
    }

    // Reset UI state - hide previous results and errors
    results.style.display = 'none';
    error.style.display = 'none';

    // Show loading state to user
    uploadArea.innerHTML = '<div class="loading">Processing file...</div>';

    // Prepare file for upload using FormData API
    const formData = new FormData();
    formData.append('csvFile', file);  // 'csvFile' matches the multer field name

    // Send file to server via POST request
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())  // Parse JSON response
    .then(data => {
        // Handle server response
        if (data.success) {
            // File processed successfully - display results
            displayResults(data.fileName, data.totalRows, data.sampleData);
        } else {
            // Server returned an error
            showError(data.error || 'An error occurred while processing the file.');
        }
    })
    .catch(err => {
        // Handle network or other fetch errors
        console.error('Error:', err);
        showError('Failed to upload file. Please try again.');
    })
    .finally(() => {
        // Always reset the upload area regardless of success/failure
        resetUploadArea();
    });
}

/* ===== RESULTS DISPLAY FUNCTION ===== */

/**
 * Display the CSV processing results to the user
 * @param {string} fileName - Original name of the uploaded file
 * @param {number} totalRows - Total number of rows processed
 * @param {Array} sampleData - Array of sample data objects 
 */


function displayResults(fileName, totalRows, sampleData) {
    const tabNav = document.getElementById('dataTab'); // Get the tab navigation element
    const TabContent = document.getElementById('dataTabContent'); // Get the tab

    if (sampleData && sampleData.length > 0) { // Check if sample data is available
        const headers = Object.keys(sampleData[0]);

        tabNav.innerHTML = ''; // Clear previous tabs
        TabContent.innerHTML = ''; // Clear previous tab content

        let tabIndex = 0; // Initialize tab index for unique IDs
        let firstTab = true; // Flag to track the first tab

        function createTab(tabId, TabName, tableElement) {
            const tabItem = document.createElement('li'); // Create a new list item for the tab
            tabItem.className = 'nav-item'; // Add class for styling
            tabItem.role = 'presentation'; // Set role for accessibility

            const tabButton = document.createElement('button'); // Create a button for the tab
            tabButton.className = `nav-link ${firstTab ? 'active' : ''}`; // Add active class to the first tab
            tabButton.id = `tab-${tabId}`; // Set unique ID for the tab button
            tabButton.setAttribute('data-bs-toggle', 'tab'); // Set Bootstrap data attribute for tab functionality
            tabButton.setAttribute('data-bs-target', `#${tabId}`); // Set target for tab content
            tabButton.type = 'button'; // Set button type
            tabButton.role = 'tab'; // Set role for accessibility
            tabButton.textContent = TabName; // Set the tab name

            tabItem.appendChild(tabButton); // Append the button to the tab item
            tabNav.appendChild(tabItem); // Append the tab item to the tab navigation

            // Create the tab content section
            const tabPane = document.createElement('div'); // Create a new div for tab content
            tabPane.className = `tab-pane fade ${firstTab ? 'show active' : ''}`; // Add classes for styling and active state
            tabPane.id = tabId; // Set unique ID for the tab content
            tabPane.role = 'tabpanel'; // Set role for accessibility
            tabPane.setAttribute('aria-labelledby', `tab-${tabId}`); // Set aria attribute for accessibility

            const tableContainer = document.createElement('div'); // Create a container for the table
            tableContainer.className = 'table-responsive mt-3'; // Add class for styling
            tableContainer.appendChild(tableElement); // Append the table element to the container

            tabPane.appendChild(tableContainer); // Append the table container to the tab content
            TabContent.appendChild(tabPane); // Append the tab content to the main content area

            firstTab = false; // Set the flag to false after the first tab is created
            tabIndex++; // Increment the tab index for the next tab
        }

        const scoresTable = createScoresTable(sampleData); // Create a scores table
        createTab('scores', 'Scores', scoresTable); // Create a tab for scores data
        
        //checks to for site table headers
        if (headers.some(header => site.includes(header))) {
            const siteTable = createSiteTable(sampleData); // Create site data table
            createTab('site', 'Site Information', siteTable); // Create a tab for site data
        }
        //checks to for tech table headers
        if (headers.some(header => tech.includes(header))) {
            const techTable = createTechTable(sampleData); // Create tech data table
            createTab('tech', 'Technical Details', techTable); // Create a tab for tech data
        }
        //checks to for factor table headers
        if (headers.some(header => factor.includes(header))) {
            const factorTable = createFactorTable(sampleData); // Create factor data table
            createTab('factor', 'Factor Classes', factorTable); // Create a tab for factor data
        }
        //checks to for measure table headers
        if (headers.some(header => measure.includes(header))) {
            const measureTable = createMeasureTable(sampleData); // Create measure data table
            createTab('measure', 'Measured Values', measureTable); // Create a tab for measure data
        }
        //checks to for crop table headers
        if (headers.some(header => crop.includes(header))) {
            const cropTable = createCropTable(sampleData); // Create crop data table
            createTab('crop', 'Crop Values Lookup', cropTable); // Create a tab for crop data
        } else {
            showError('No data available.'); // Show error if no crop data
        }

        //show the results section
        results.style.display = 'block';

        // Update the file name and total rows in the results section
        document.getElementById('fileName').textContent = fileName; // Display the
        document.getElementById('totalRows').textContent = totalRows; // Display the total number of rows

    }
}

/* ===== TABLE CREATION FUNCTION ===== */

/**
 * Create an HTML table from CSV data array
 * @param {Array} data - Array of objects representing CSV rows
 * @returns {HTMLTableElement} - Complete HTML table element
 */

function createSiteTable(data) {
    const table = document.createElement('table'); // Create a new table element
    const thead = document.createElement('thead'); // Create a table header element
    const headerRow = document.createElement('tr'); // Create a row for the header
    site.forEach(col => { // Loop through each column defined in the site array
        const th = document.createElement('th'); // Create a new table header cell
        th.textContent = col;  // Set column header text
        headerRow.appendChild(th); // Append the header cell to the header row
    });
    thead.appendChild(headerRow); // Append the header row to the table header
    table.appendChild(thead); // Append the header to the table
    const tbody = document.createElement('tbody'); // Create a table body element
    data.forEach(row => { // Loop through each row of data
        const tr = document.createElement('tr'); // Create a new table row
        site.forEach(col => { // Loop through each column defined in the site array
            const td = document.createElement('td'); // Create a new table cell
            td.textContent = row[col] || '';  // Set cell text, handle empty values
            tr.appendChild(td); // Append the cell to the row
        });
        tbody.appendChild(tr); // Append the row to the table body
    });
    table.appendChild(tbody); // Append the body to the table
    return table; // Return the complete table element
}
function createTechTable(data) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    tech.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;  // Set column header text
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    data.forEach(row => {
        const tr = document.createElement('tr');
        tech.forEach(col => {
            const td = document.createElement('td');
            td.textContent = row[col] || '';  // Set cell text, handle empty values
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    return table;
}
function createFactorTable(data) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    factor.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;  // Set column header text
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    data.forEach(row => {
        const tr = document.createElement('tr');
        factor.forEach(col => {
            const td = document.createElement('td');
            td.textContent = row[col] || '';  // Set cell text, handle empty values
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    return table;
}
function createMeasureTable(data) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    measure.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;  // Set column header text
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    data.forEach(row => {
        const tr = document.createElement('tr');
        measure.forEach(col => {
            const td = document.createElement('td');
            td.textContent = row[col] || '';  // Set cell text, handle empty values
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    return table;
}

function createScoresTable(data) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    //specific columns for scores and appropriate data
    const scoreColumns = [
        {header: score[0], getValue: row => row.SampleID},
        {header: score[1], getValue: row => SOCScore(row)},
        {header: score[2], getValue: row => WSAScore(row)},
        {header: score[3], getValue: row => BDScore(row)},
        {header: score[4], getValue: row => pHScore(row)},
        {header: score[5], getValue: row => ECScore(row)},
        {header: score[6], getValue: row => MBCScore(row)},
        {header: score[7], getValue: row => PMNScore(row)},
        {header: score[8], getValue: row => BGScore(row)},
        {header: score[9], getValue: row => KScore(row)},
        {header: score[10], getValue: row => PScore(row)},
        {header: score[11], getValue: row => PhysicalScore(row)},
        {header: score[12], getValue: row => BiologicalScore(row)},
        {header: score[13], getValue: row => ChemicalScore(row)},
        {header: score[14], getValue: row => NutrientScore(row)},
        {header: score[15], getValue: row => OverallScore(row)}
    ];

    scoreColumns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col.header;  // Set column header text
        headerRow.appendChild(th); // Append the header cell to the header row
    });
    thead.appendChild(headerRow); // Append the header row to the table header
    table.appendChild(thead); // Append the header to the table

    // Create the table body
    const tbody = document.createElement('tbody');
    data.forEach(row => { //loop through each row of data
        const tr = document.createElement('tr'); // Create a new table row
        
        scoreColumns.forEach(col => { // Loop through each score column
            const td = document.createElement('td'); // Create a new table cell
            td.textContent = col.getValue(row) || '';  // Set cell text using the getValue function, handle empty values
            tr.appendChild(td); // Append the cell to the row
        });
        tbody.appendChild(tr); // Append the row to the table body
    });
    table.appendChild(tbody); // Append the body to the table
    return table; // Return the complete table element
}
function createCropTable(data) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Create table headers
    crop.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    
    // Mapping crop columns to cropData properties
    const columnMapping = {
        'Crop': (cropName, cropData) => cropName,
        'CropCode': (cropName, cropData) => cropData.code,
        'Tsat': (cropName, cropData) => cropData.tsat,
        'T1': (cropName, cropData) => cropData.optp,
        'dT': (cropName, cropData) => cropData.dt,
        'm': (cropName, cropData) => cropData.c,
        'max': (cropName, cropData) => cropData.b
    };
    
    // Loop through the cropValues Map
    for (const [cropName, cropData] of cropValues) {
        const tr = document.createElement('tr');
        
        crop.forEach(col => {
            const td = document.createElement('td');
            const getValue = columnMapping[col];
            
            if (getValue) {
                const value = getValue(cropName, cropData);
                td.textContent = (value !== undefined && value !== null) ? value : ''; // Set cell text, handle undefined/null values
            } else {
                td.textContent = ''; // If no mapping exists, set cell text to empty
            }
            tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    }
    
    table.appendChild(tbody);
    return table;
}

/* ===== SCORES CALCULATIONS ===== */

function SOCScore(row) {
    let a = 1
    let b = 50.1
    const c1Arr = [0.3, 1.55, 2.17, 3.81]
    const c2Arr = [1.6, 1.25, 1.1, 1.05, 1]
    const c3Arr = [0.15, 0.05, -0.05, -0.1]

    const om = parseFloat(row.OMClass);
    const texture = parseFloat(row.TextureClass);
    const climate = parseFloat(row.ClimateClass);
    const socValue = parseFloat(row.SOC); // converts string to floating point number

    const c1 = c1Arr[om - 1]; // Get c1 based on OMClass (1-4)
    const c2 = c2Arr[texture - 1]; // Get c2 based on TextureClass (1-5)
    const c3 = c3Arr[climate - 1]; // Get c3 based on ClimateClass (1-4)
    
    const c = (c1 * c2) + (c1 * c2 * c3)
    // Calculate the SOC score based on the formula
    const socScore = a / (1 + b * Math.exp(-c * (socValue)));
    return Math.round(socScore * 100) / 100; // Round to 2 decimal places


}

function WSAScore(row) {
    let a = -0.793
    let b = 1.7993
    let c = 0.0196
    const d1Arr = [1.22110539, 1.0715387, 1.01991117, 0.89993808]
    const d2Arr = [0.87, 1.06, 1, 1.16, 1.25]
    const d3Arr = [1.343216, 1.221105]

    const om = parseFloat(row.OMClass);
    const texture = parseFloat(row.TextureClass);
    const fe02 = parseFloat(row.Fe2O3Class);
    const wsasValue = parseFloat(row.WSA); // converts string to floating point number


    const d1 = d1Arr[om - 1]; // Get d1 based on OMClass (1-4)
    const d2 = d2Arr[texture - 1]; // Get d2 based on TextureClass (1-5)
    const d3 = d3Arr[fe02 - 1]; // Get d3 based on Fe2O3Class (1-2)

    // Calculate the WSAScore using the formula
    const d = d1 * d2 * d3;
    const wsaScore = a + (b * Math.cos(c * wsasValue - (d)));
    return Math.round(wsaScore * 100) / 100; // Round to 2 decimal places
}

function BDScore(row) {
    const a = 0.994;
    const texture = parseFloat(row.TextureClass);
    const minClass = parseFloat(row.MineralClass);
    const bdValue = parseFloat(row.Bd);
    
    let bd;

    if (texture < 4) {
        
        let b1, c1, d1;

        if (texture === 1) {
            b1 = 0.792
            c1 = 321.34
            d1 = -12.99
        } else if (texture === 2) {
            b1 = 0.794
            c1 = 88.025
            d1 = -12.061
        } else if (texture === 3) {
            b1 = 0.796
            c1 = 32.189
            d1 = -11.297
        }

        bd = a - b1 * Math.exp(-c1 * (bdValue ** d1));
    }
    else if (texture >= 4) {
        
        
        let b2, c2, d2;

        if (texture === 4 && minClass === 1) {
            b2 = 0.7965
            c2 = 13.2653523069364
            d2 = -10.53032
        } else if (texture === 4 && minClass === 2) {
            b2 = 0.797
            c2 = 5.87777316281169
            d2 = -9.935796
        } else if (texture === 4 && minClass === 3) {
            b2 = 0.796
            c2 = 23.7259194060919
            d2 = -10.95498
        } else if (texture === 5 && minClass === 1) {
            b2 = 0.7995
            c2 = 5.23253291794314
            d2 = -9.850864
        } else if (texture === 5 && minClass === 2) {
            b2 = 0.8
            c2 = 2.31849413773451
            d2 = -9.25634
        } else if (texture === 5 && minClass === 3) {
            b2 = 0.799
            c2 = 9.35871520245459
            d2 = -10.275524
        }
        bd = a - b2 * Math.exp(-c2 * (bdValue ** d2));
    }

    return Math.round(bd * 100) / 100; // Round to 2 decimal places
}

function pHScore(row) {
    const a = 1;
    const cropName = row.Crop;
    let b;
    if (cropValues.has(cropName)) {
        b = cropValues.get(cropName).b; // Get the 'b' value for the crop
    }
    let c;
    if (cropValues.has(cropName)) {
        c = cropValues.get(cropName).c; // Get the 'c' value for the crop
    }

    const pHValue = a * Math.exp(-((row.pH - b) ** 2) / (2 * (c ** 2)))

    return Math.round(pHValue * 100) / 100; // Round to 2 decimal places

}

function ECScore(row) {
    const cropName = row.Crop;
    const ecValue = parseFloat(row.EC);
    const ecMethod = parseFloat(row.ECMethodC); // 1 = Sat Paste, 2 = 1:1
    const textureClass = parseFloat(row.TextureClass);

    // Get crop-specific values
    let t, dt;
    if (cropValues.has(cropName)) {
        t = cropValues.get(cropName).tsat;  
        dt = cropValues.get(cropName).dt;   
    } 

    // Calculate m value for crop
    const m = (0.5091 - 161.58 * dt) / (1 + 484.2 * dt - 16.14 * (dt * dt));

    let ecScore = 0;

    if (ecMethod === 1) {
        // SAT PASTE METHOD (ECsat)
        
        if (ecValue <= 0.3) {
            // Eq 1: When EC is below common threshold
            ecScore = 3.33 * ecValue;
            
        } else if (ecValue > 0.3 && ecValue < t) {
            // Eq 2: EC might be of concern but below crop threshold
            ecScore = 1;
            
        } else if (ecValue >= t) {
            // Eq 3: EC above crop-specific threshold
            ecScore = m * ecValue + (1 - m * t);
        }
        
    } else if (ecMethod === 2) {
        // 1:1 METHOD (EC1:1)
        
        const textureVals = [1, 1.07, 1.18, 1.22, 1.25];
        const textureVal = textureVals[textureClass - 1];

        // Calculate adjusted threshold for 1:1 method
        const t1to1 = (t / 1.77) * textureVal;
        
        if (ecValue <= 0.0017) {
            // Eq 4: When EC is below common threshold
            ecScore = 5.88 * ecValue;
            
        } else if (ecValue > 0.0017 && ecValue < t1to1) {
            // Eq 5: EC might be of concern but below adjusted threshold
            ecScore = 1;
            
        } else if (ecValue >= t1to1) {
            // Eq 6: EC above adjusted crop-specific threshold
            ecScore = m * ecValue + (1 - m * t1to1);
        }
    }

    // Constrain score between 0 and 1
    if (ecScore < 0) ecScore = 0;
    if (ecScore > 1) ecScore = 1;

    return Math.round(ecScore * 100) / 100; // Round to 2 decimal places
}

function MBCScore(row) {
    const a = 1
    const b = 40.748
    
    const om = parseFloat(row.OMClass);
    const texture = parseFloat(row.TextureClass);
    const season = parseFloat(row.SeasonCode);
    const climate = parseFloat(row.ClimateClass);

    const omVal = [0.0062097, 0.012419, 0.02, 0.03];
    const c1 = omVal[om - 1];

    const textureVal = [1.5, 1.35, 1.2, 1, 0.9];
    const c2 = textureVal[texture - 1];

    let c3
    if (season === 1 && climate === 1) {
        c3 = 1
    } else if (season === 2 && climate === 1) {
        c3 = 1.08
    } else if (season === 2 && climate === 2) {
        c3 = 1.07
    } else if (season === 2 && climate === 3) {
        c3 = 1.06
    } else if (season === 2 && climate === 4) {
        c3 = 1.05
    } else if (season === 3 && climate === 1) {
        c3 = 1.02
    } else if (season === 3 && climate === 2) {
        c3 = 1.025
    } else if (season === 3 && climate === 3) {
        c3 = 1.03
    } else if (season === 3 && climate === 4) {
        c3 = 1.035
    } else if (season === 4 && climate === 1) {
        c3 = 1.12
    } else if (season === 4 && climate === 2) {
        c3 = 1.1
    } else if (season === 4 && climate === 3) {
        c3 = 1.08
    } else if (season === 4 && climate === 4) {
        c3 = 1.06
    }

    const c = c1 * c2 * c3;

    const MBC = a / (1 + b * Math.exp(-c * (row.MBC)));
    return Math.round(MBC * 100) / 100; // Round to 2 decimal places

}

function PMNScore(row) {
    const a = 1
    const b = 161.32
    
    const om = parseFloat(row.OMClass);
    const texture = parseFloat(row.TextureClass);
    const climate = parseFloat(row.ClimateClass);

    const omVal = [0.254995, 0.299255, 0.35467, 0.432275];
    const c1 = omVal[om - 1];

    const textureVal = [1.15, 1, 1, 0.9, 0.85];
    const c2 = textureVal[texture - 1];

    const climateVal = [0.9, 0.95, 1, 1.05];
    const c3 = climateVal[climate - 1];

    const c = (c1 * c2) + (c1 * c2 * c3);

    const PMN = a / (1 + b * Math.exp(-c * (row.PMN)));
    return Math.round(PMN * 100) / 100; // Round to 2 decimal places
}

function BGScore(row) {
    const a = 1.01;
    const b = 48.4;

    const om = parseFloat(row.OMClass);
    const texture = parseFloat(row.TextureClass);
    const climate = parseFloat(row.ClimateClass);

    const omVal = [0.9, 2.9, 3.8, 5.8];
    const c1 = omVal[om - 1];

    const textureVal = [4, 2.9, 2.8, 2.7, 1.3];
    const c2 = textureVal[texture - 1];

    const climateVal = [2.1, 0.85, 0.7, 0.45];
    const c3 = climateVal[climate - 1];

    const c = (c1 * c2) + (c1 * c2 * c3);

    const BG = a / (1 + b * Math.exp(-(c * (row.BG/1000))));
    return Math.round(BG * 100) / 100; // Round to 2 decimal places
}

function KScore(row) {
    const texture = parseFloat(row.TextureClass);
    const potassium = parseFloat(row.K);

    const aTexture = [1.0541, 1.0541, 1.0745, 1.0745, 1.0745];
    const a = aTexture[texture - 1];

    const bTexture = [-0.00981, -0.00981, -0.01343, -0.01343, -0.01343];
    const b = bTexture[texture - 1];

    const k = a * (1 - Math.exp(b * potassium));
    return Math.round(k * 100) / 100; // Round to 2 decimal places

}

function PScore(row) {
    const testP = parseFloat(row.P);
    const pMethod = parseFloat(row.PMethodC);
    const weatherClass = parseFloat(row.WeatheringClass);
    const cropName = row.Crop;
    const soc = parseFloat(row.SOC);
    const slope = parseFloat(row.SlopeClass);
    const texture = parseFloat(row.TextureClass);

    let opt;
    if (cropValues.has(cropName)) {
        opt = cropValues.get(cropName).optp; // Get the 'optp' value for the crop
    }
    let methodFactor;
    if (pMethod === 1 && weatherClass === 1) methodFactor = 2;
    else if (pMethod === 2 && weatherClass === 1) methodFactor = 1;
    else if (pMethod === 3 && weatherClass === 1) methodFactor = 1.9;
    else if (pMethod === 4 && weatherClass === 1) methodFactor = 2.4;
    else if (pMethod === 5 && weatherClass === 1) methodFactor = 2.1;
    else if (pMethod === 6 && weatherClass === 1) methodFactor = 2.3;
    else if (pMethod === 1 && weatherClass === 2) methodFactor = 1.4;
    else if (pMethod === 2 && weatherClass === 2) methodFactor = 1;
    else if (pMethod === 3 && weatherClass === 2) methodFactor = 0.66;
    else if (pMethod === 4 && weatherClass === 2) methodFactor = 1.8;
    else if (pMethod === 5 && weatherClass === 2) methodFactor = 3.1;
    else if (pMethod === 6 && weatherClass === 2) methodFactor = 3.66;
    else if (pMethod === 1 && weatherClass === 3) methodFactor = 1.35;
    else if (pMethod === 2 && weatherClass === 3) methodFactor = 1;
    else if (pMethod === 3 && weatherClass === 3) methodFactor = 1;
    else if (pMethod === 4 && weatherClass === 3) methodFactor = 1.7;
    else if (pMethod === 5 && weatherClass === 3) methodFactor = 1.25;
    else if (pMethod === 6 && weatherClass === 3) methodFactor = 1.5;

    const threshold1a = testP * methodFactor;
    const threshold1b = opt + 6;
    const cropVal = 213.96744 + 39.579185 * opt + 2.3020512 * opt * opt;

    const textVal = [[0.98, 0.9], [0.99, 1], [1, 1.1], [1.01, 1.4], [1.03, 1.6]];
    const text1 = textVal[texture - 1][0]; // Get the first value based on texture
    const text2 = textVal[texture - 1][1]; // Get the second value based on texture

    const slopeData = [[160, 110000], [140, 90000], [115, 70000], [85, 35000], [60, 20000]];
    const slopeThreshold = slopeData[slope - 1][0];
    const slopeValue = slopeData[slope - 1][1];

    const parameter = cropVal + (cropVal * (soc / 100)) * text1;
    const socValue = (slopeValue + slopeValue * (soc / 100)) * text2;

    let pScore;
    if (threshold1a <= threshold1b) {
        // Equation 1: Low P condition
        pScore = (0.00000925 * parameter + Math.pow(testP * methodFactor, 3.06)) / (parameter + Math.pow(testP * methodFactor, 3.06));
        
    } else if (threshold1a > threshold1b && threshold1a > slopeThreshold) {
        // Equation 2: High P condition
        pScore = 1 - 4.5 * Math.exp(-socValue * Math.pow(testP * methodFactor, -2));
        
    } else if (threshold1a > threshold1b && threshold1a <= slopeThreshold) {
        // Equation 3: Medium P condition - "Always correct to 1/1"
        pScore = 1.0;
    }

    return Math.round(pScore * 100) / 100; // Round to 2 decimal places
}

function PhysicalScore(row) {
    // Calculate individual scores for the row
    const wsaScore = WSAScore(row);
    const bdScore = BDScore(row);
    
    // Average the two physical scores
    const physicalScore = (wsaScore + bdScore) / 2;
    
    return Math.round(physicalScore * 100) / 100;
}

function BiologicalScore(row) {
    const socScore = SOCScore(row);
    const mbcScore = MBCScore(row);
    const pmnScore = PMNScore(row);
    const bgScore = BGScore(row);

    const bioScore = (socScore + mbcScore + pmnScore + bgScore) / 4;
    return Math.round(bioScore * 100) / 100; // Round to 2 decimal places
}

function ChemicalScore(row) {
    const phScore = pHScore(row);
    const ecScore = ECScore(row);

    const chemScore = (phScore + ecScore) / 2;
    return Math.round(chemScore * 100) / 100; // Round to 2 decimal places
}

function NutrientScore(row) {
    const pScoreValue = PScore(row);
    const kScoreValue = KScore(row);

    const nutrientScore = (pScoreValue + kScoreValue) / 2;
    return Math.round(nutrientScore * 100) / 100; // Round to 2 decimal places
}

function OverallScore(row) {
    const wsaScore = WSAScore(row);
    const bdScore = BDScore(row);
    const phScore = pHScore(row);
    const ecScore = ECScore(row);
    const socScore = SOCScore(row);
    const mbcScore = MBCScore(row);
    const pmnScore = PMNScore(row);
    const bgScore = BGScore(row);
    const pScoreValue = PScore(row);
    const kScoreValue = KScore(row);

    const OverallScore = (wsaScore + bdScore + phScore + ecScore + socScore + mbcScore + pmnScore + bgScore + pScoreValue + kScoreValue) / 10;
    return Math.round(OverallScore * 100) / 100; // Round to 2 decimal places
}


/* ===== ERROR HANDLING AND UI RESET FUNCTIONS ===== */

/**
 * Display error message to the user
 * @param {string} message - Error message to display
 */
function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    error.style.display = 'block';  // Show error container
    resetUploadArea();  // Reset the upload area to initial state
}

/**
 * Reset the upload area to its initial state
 * Restores the drag-and-drop interface after file processing
 */
function resetUploadArea() {
    uploadArea.innerHTML = `
        <div class="upload-icon">📁</div>
        <div class="upload-text">
            <p>Drag & drop your CSV file here</p>
            <p>or</p>
            <button class="select-file-btn" onclick="document.getElementById('fileInput').click()">Select File</button>
        </div>
    `;
}
