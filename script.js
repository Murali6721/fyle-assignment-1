const inputEl = document.getElementById("inputId");
const accessToken =
  "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";
document.getElementById("loader").style.display = "none";
const incrementEl = document.getElementById("increment")
const decrementEl = document.getElementById("decrement")
let currentpage = 1;
let apiOptions = {
    headers: {
        Authorization: `Bearer ${accessToken}`,
    },
};
const mainEl = document.getElementById("main")

const paginationContainer = document.getElementById("pagination");


async function fetchRepositories(username) {
  const perPage = 10;
  if (!username.trim()){
    return
  }

  const apiUrl = `https://api.github.com/users/${username}`;

  // Show loader
  document.getElementById("loader").style.display = "block";

  try {
    
    const userResponse = await fetch(apiUrl,);
    const user = await userResponse.json();
    displayUser(user);

    // Hide loader
    document.getElementById("loader").style.display = "none";
  } catch (error) {
    console.error("Error fetching repository details:", error);

  }
}

async function displayUser(user, currentpage = 1) {

  const {
    name,
    avatar_url,
    html_url,
    bio,
    twitter_username,
    location,
    repos_url,
    login,
  } = user;
  const repoEl = document.getElementById("repositories");
  const repoApi = `https://api.github.com/users/${login}/repos?per_page=10&page=${currentpage}`
  const results = await fetch(repoApi,);
  const repositories = await results.json();
//   console.log(repositories);
    // Show loader
    document.getElementById("loader").style.display = "none";
  const userDetails = document.getElementById("userDetails");
  userDetails.innerHTML = "";
  const userHtml = `
            <div class="repository">
                <div style="display: flex;flex-direction: row;padding: 10px;">
                    <div>
                        <img src="${avatar_url}" class="user-image"/>
                    </div>
                    <div>
                        <h1>${name}</h1>
                        <p>${bio || "Github User"} </p>
                        <div style="display: flex;flex-direction: row;padding: 10px;">
                            <img src="../images/location.webp" class="location-icon" />
                            <p>${location || "Not Found"}</p>
                        </div>
                        <p>Twitter :https://twitter.com/${
                          twitter_username || name
                        }</p>
                    </div>
                    
                </div>
                <a href="${html_url}">${html_url}</a>
                <div>
                    
                </div>
            </div>
        `;
    const errorHtml = `
            <div class="repository error">
                <div>
                    <h1 class="error">❌🤷‍♂️No Results Found!</h1>
                    <p class="error-desc"> Try with other Name Please.😊</p>
                </div>  
            </div>
        `;
    if(!name){
        userDetails.innerHTML += errorHtml;
        repoEl.innerHTML = "";
        paginationContainer.innerHTML=""
        return 
    }else{
        userDetails.innerHTML += userHtml;
        repoEl.innerHTML = "";
//   const currentItems = repositories.slice(startIndex, endIndex);
    repositories.forEach(async (repo) => {
        const { description, languages_url, full_name } = repo;
        const languages = await fetch(languages_url,);
        const langs = await languages.json()
        const langsArray = Object.keys(langs)
        // console.log(langsArray)

        const repoHtml = `
            <div class="repository" style="width:22vw; " >
                <h3 class="repo-heading">${full_name.split("/")[1]}</h3>
                <p>${description || "No description available."}</p>
                <div> ${langsArray.length == 0 ? "<p class='no-language'> No languages found</p>" : ""}
                </div>
                <div class="languages-container">
                    ${langsArray.map(lang => `<span class="language">${lang}</span>`).join(' ')}
                </div>
            </div>
            
        `;
        repoEl.innerHTML += repoHtml;
        displayPagination(10, user);
    
    })
};
 
}

function displayPagination(totalPages, user) {

  paginationContainer.innerHTML = '<li class="page-item"><<</li>';

  for (let i = 1; i <= totalPages; i++) {
    const pageLink = `<li class="page-item page-link" value="${i}">${i}</li>`;
    paginationContainer.innerHTML += pageLink;
  }
  paginationContainer.innerHTML += '<li class="page-item">>></li>';

  const pageLinks = document.querySelectorAll(".page-link");
  // currentpage =1

  
  pageLinks.forEach((link) => {
    if (link.textContent == currentpage) {
      link.classList.add("highlighted");
    }

    link.addEventListener("click", function (e) {
      pageLinks.forEach((element) => {
        element.classList.remove("highlighted");
      });
      e.preventDefault();
      currentpage = e.target.value;
      if (link.textContent == currentpage) {
        link.classList.add("highlighted");
      }
        
      displayUser(user, currentpage);
        // Show loader
        document.getElementById("loader").style.display = "block";
    });
      

  });
  
    
}

// Initial fetch on page load

inputEl.addEventListener("keyup", function () {
    currentpage=1
    fetchRepositories(inputEl.value);
});




