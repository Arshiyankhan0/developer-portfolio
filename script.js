// 1. Set up the Observer (The Watcher)
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        // If the element crosses into the screen...
        if (entry.isIntersecting) {
            entry.target.classList.add('show'); // Add the 'show' class to trigger the CSS animation
        }
    });
});

// 2. Find all the hidden elements
const hiddenElements = document.querySelectorAll('.hidden');

// 3. Tell the observer to watch every single one of them
hiddenElements.forEach((el) => observer.observe(el));
// --- PROJECT FILTERING LOGIC --- //

// 1. Grab all the buttons and all the project cards
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

// 2. Add a click event to every single button
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        
        // Remove the 'active' styling from all buttons, then add it to the clicked one
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Find out which category the user clicked (e.g., 'all', 'css', or 'js')
        const filterValue = button.getAttribute('data-filter');

        // Loop through every project card
        projectCards.forEach(card => {
            // If the filter is 'all', or if the card's category matches the button's filter...
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block'; // Show it
            } else {
                card.style.display = 'none'; // Hide it
            }
        });
    });
});
// --- TYPEWRITER EFFECT LOGIC --- //

const typedTextSpan = document.querySelector(".typed-text");
const textArray = ["interactive websites.", "beautiful user interfaces.", "responsive web apps."];
const typingDelay = 100;    // Milliseconds between typing each letter
const erasingDelay = 50;    // Milliseconds between erasing each letter
const newTextDelay = 2000;  // How long to pause before erasing the word

let textArrayIndex = 0; // Tracks which word we are on
let charIndex = 0;      // Tracks which letter we are on

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        // Add the next letter
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        // Word is finished typing, wait a bit, then erase
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        // Remove the last letter
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        // Word is fully erased, move to the next word
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0; // Loop back to the start
        setTimeout(type, typingDelay + 500);
    }
}

// Start the effect exactly 1 second after the page loads
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(type, 1000);
});
// --- DARK MODE TOGGLE LOGIC --- //
const themeBtn = document.getElementById('theme-btn');
const body = document.body;

// Check if the user already chose dark mode in the past
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-theme');
    themeBtn.textContent = '☀️';
}

// Listen for the button click
themeBtn.addEventListener('click', () => {
    // Toggle the class on the body
    body.classList.toggle('dark-theme');
    
    // Check if the class is now there to swap the icon and save the choice
    if (body.classList.contains('dark-theme')) {
        themeBtn.textContent = '☀️';
        localStorage.setItem('theme', 'dark'); // Save to browser memory
    } else {
        themeBtn.textContent = '🌙';
        localStorage.setItem('theme', 'light'); // Save to browser memory
    }
});
// --- MODAL INJECTION LOGIC --- //

// 1. Grab the modal and its empty internal pieces
const modal = document.getElementById('project-modal');
const closeBtn = document.querySelector('.close-btn');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');

// 2. Grab all the "View Details" buttons
const detailButtons = document.querySelectorAll('.details-btn');

// 3. Add a click event to every button
detailButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Extract the hidden data from the button we just clicked
        const title = button.getAttribute('data-title');
        const image = button.getAttribute('data-image');
        const desc = button.getAttribute('data-desc');

        // Inject that data into the empty modal
        modalTitle.textContent = title;
        modalImg.src = image;
        modalDesc.textContent = desc;

        // Turn the modal on!
        modal.classList.add('show-modal');
    });
});

// 4. Close the modal when clicking the 'X'
closeBtn.addEventListener('click', () => {
    modal.classList.remove('show-modal');
});

// 5. BONUS: Close the modal if the user clicks the dark background outside the white box
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.remove('show-modal');
    }
});
// --- LIVE API DATA FETCHING --- //

const apiGrid = document.getElementById('api-grid');

// 1. Create an asynchronous function
async function getGitHubProjects() {
    try {
        // 2. Ask the GitHub API for the latest 3 public repositories from 'octocat'
        const response = await fetch('https://api.github.com/users/Arshiyankhan0/repos?per_page=3&sort=updated');
        
        // 3. Convert that response into JSON (data JavaScript can read)
        const projects = await response.json();
        
        // 4. Loop through each project and build an HTML card for it
        projects.forEach(project => {
            
            // Create a new empty div
            const card = document.createElement('div');
            card.classList.add('project-card'); 
            
            // A cool trick: Generate a consistent random image using the project's name!
            const imageUrl = `https://picsum.photos/seed/${project.name}/400/200`;
            
            // Inject the exact same HTML structure we used to have
            card.innerHTML = `
                <img src="${imageUrl}" alt="${project.name}">
                <div class="project-info">
                    <h3>${project.name}</h3>
                    <p>${project.description ? project.description : 'A live coding project from GitHub.'}</p>
                    <a href="${project.html_url}" target="_blank" class="cta-button">View on GitHub</a>
                </div>
            `;
            
            // Add this new card into our empty grid on the webpage
            apiGrid.appendChild(card);
        });
        
    } catch (error) {
        // If the internet goes down, show an error inside the grid
        apiGrid.innerHTML = '<p>Oops! Failed to load projects from GitHub.</p>';
        console.error(error);
    }
}

// 5. Fire the function!
getGitHubProjects();