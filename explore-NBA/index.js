document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".carousel");
  const items = document.querySelectorAll(".carousel-item");
  const totalItems = items.length;
  const itemWidth = 100 / 6;
  let index = 0;

  function moveToNextSlide() {
    index++;


    if (index >= totalItems - 6) {
      index = 0;
      carousel.style.transition = "none";
      carousel.style.transform = `translateX(0)`;

      setTimeout(() => {
        carousel.style.transition = "transform 0.5s ease-in-out";
        moveToNextSlide(); 
      }, 50);
    } else {
      const offset = -(index * itemWidth);
      carousel.style.transform = `translateX(${offset}%)`;
    }
  }

  setInterval(moveToNextSlide, 3000);
});

const eastBtn = document.querySelector("#eastern");
const westBtn = document.querySelector("#western");
const back = document.querySelector("#back");

const mainDisplay = document.querySelector(".mainDisplay");
const footer = document.querySelector(".footer");
footer.innerHTML = `<p>©${new Date().getFullYear()}</p>`;

const easternConference = [
  "ATL",
  "BOS",
  "BKN",
  "CHI",
  "CLE",
  "DET",
  "IND",
  "MIA",
  "MIL",
  "NY",
  "ORL",
  "PHI",
  "TOR",
  "WSH",
  "CHA",
];

let eastTeams;
let westTeams;

async function fetchAllTeams() {
  try {
    const response = await fetch(
      "https://nba-api-free-data.p.rapidapi.com/nba-team-list",
      {
        headers: {
          "x-rapidapi-key":
            "bf617fd7ebmsh0502ce0bb23dfecp1c9adcjsn958d69cc1d2b",
          "x-rapidapi-host": "nba-api-free-data.p.rapidapi.com",
        },
      }
    );
    const allTeams = await response.json();
    eastTeams = allTeams.teams.filter((item) =>
      easternConference.includes(item.abbreviation)
    );
    westTeams = allTeams.teams.filter(
      (item) => !easternConference.includes(item.abbreviation)
    );
    return {
      eastTeams,
      westTeams,
    };
  } catch (e) {
    throw e;
  }
}

eastBtn?.addEventListener("click", () => {
  displayTeamInfo(eastTeams);
  mainDisplay.style.justifyContent = "left";
});

westBtn?.addEventListener("click", () => {
  displayTeamInfo(westTeams);
  mainDisplay.style.justifyContent = "right";
});

var target = document.querySelector(".team-container");

function displayTeamInfo(data) {
  const listContainer = document.querySelector(".team-container");
  listContainer.innerHTML = "";
  data?.map?.((item) => {
    const listElement = document.createElement("div");
    listElement.className = "team";

    listElement.addEventListener("click", function () {
      localStorage.setItem("selectedTeam", item.id);
      window.location.href = "details.html";
    });

    const innerElement = document.createElement("div");
    innerElement.className = "inner-team";
    const imageElement = document.createElement("div");
    imageElement.className = "team-image";
    const img = document.createElement("img");
    img.setAttribute("src", item.logos[0].href);
    const teamData = document.createElement("div");
    teamData.className = "team-data";
    teamData.innerHTML = `<div><h4>${item.shortDisplayName}</h4></div>`;
    const teamInfoLinks = document.createElement("div");
    teamInfoLinks.innerHTML = `<p>${item.nickname}</p>`;
    innerElement.appendChild(teamData);
    imageElement.appendChild(img);
    innerElement.appendChild(imageElement);
    listElement.appendChild(innerElement);
    listContainer.appendChild(listElement);
    innerElement.appendChild(teamData);
    teamData.appendChild(teamInfoLinks);
  });
}

function formatMoney(n = 0) {
  return (
    "$ " + n.toLocaleString().split(".")[0] + "." + n.toFixed(2).split(".")[1]
  );
}

if (window.location.pathname.endsWith("index.html")) {
  fetchAllTeams();
} else if (window.location.pathname.endsWith("details.html")) {

  back.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  function generateTable(data) {
    let table = "<table>";
    if (window.innerWidth <= 768) {
      table += "<tr><th></th><th>Full Name</th></tr>";
      data.forEach((item) => {
        const playerImage = `<img src="${item.headshot.href}" alt="Player Picture" style="width: 50px; height: 50px;" className='playerImage'>`;
        playerImage.className = "playerImage";
        table += `<tr><td>${playerImage}</td><td>${item.fullName}</td></tr>`;
      });
    } else {
      table +=
        "<tr><th></th><th>Full Name</th><th>Age</th><th>Position</th><th>Height</th><th>Weight</th><th>Years of experience</th><th>Salary</th></tr>";
      data.forEach((item) => {
        const formattedSalary = formatMoney(item?.contract?.salary);
        const playerImage = `<img src="${item?.headshot?.href}" alt="" style="width: 50px; height: 50px;">`;
        table += `<tr><td>${playerImage}</td><td>${item?.fullName}</td><td>${item?.age}</td><td>${item?.position?.name}</td><td>${item?.displayHeight}</td><td>${item?.displayWeight}</td><td>${item?.experience?.years}</td><td>${formattedSalary}</td></tr>`;
      });
    }
    table += "</table>";
    const tableContainer = document.querySelector(".table-container");
    tableContainer.innerHTML = table;
  }

  async function fetchSingleTeamRoster() {
    try {
      const teamId = localStorage.getItem("selectedTeam");
      const response = await fetch(
        `https://nba-api-free-data.p.rapidapi.com/nba-player-listing/v1/data?id=${teamId}`,
        {
          headers: {
            "x-rapidapi-key":
              "bf617fd7ebmsh0502ce0bb23dfecp1c9adcjsn958d69cc1d2b",
            "x-rapidapi-host": "nba-api-free-data.p.rapidapi.com",
          },
        }
      );
      const playersData = await response.json();
      generateTable(playersData.athletes);
    } catch (e) {
      throw e;
    }
  }

  fetchSingleTeamRoster();
}

