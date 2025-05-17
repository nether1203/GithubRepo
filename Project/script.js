const token = "";
const username = "YuraKhalus";

async function fetchRepos(){
   const url = `https://api.github.com/users/${username}/repos`;

   try {
      const response =  await fetch(url, {
         headers: {
            Authorization: `Bearer ${token}`
         }
      });

      if (!response.ok){
         throw new Error(`Error: ${response.status}`);
      }

      const repos = await response.json();

      console.log(repos);
      

      const repoList =  document.getElementById("repo-list");
      repos.forEach(repo => {
         const li = document.createElement("li");
         li.innerHTML = `
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>`

         repoList.appendChild(li);
      })

      const repoWithDesc = document.querySelector(".repo-with-desc");
      repos.forEach(repo => {
         if (repo.description ){
            console.log(repo);
            const li = document.createElement("li");
            li.className = "repo-item";
            let data = new Date(repo.updated_at);
            
            li.innerHTML = `
               <a href="${repo.html_url}" target="_blank">${repo.name}</a> </br>
               <a href="${repo.homepage}" target="_blank">Відвідати сайти</a>
               <p>${repo.description}</p>
               <p>Last update - ${data.toLocaleTimeString() + " " + data.toLocaleDateString()}</p>
               <p>${repo.languages_url}</p>
               <p>${repo.topics}</p>

            `;
            fetchReadme(repo.owner.login, repo.name);
            repoWithDesc.appendChild(li);
         }
      })

   } catch(error) {
      console.error("Error:", error);
      
   };
}

fetchRepos();


async function fetchUser() {
   const url = `https://api.github.com/users/${username}`;

   try {
      const response = await fetch(url, {
         headers: {
            Authorization: `Bearer ${token}`
         }
      });

      if (!response.ok) {
         throw new Error(`Error: ${response.status}`);
      }

      const user = await response.json();
      console.log(user);
      
      
      const userInfoDiv = document.getElementById("user-info");


      userInfoDiv.innerHTML = `
         <h2>${user.name || "No name"}</h2>
         <p><strong>Username:</strong>${user.login}</p>
         <p><strong>Bio:</strong>${user.bio}</p>
         <img src="${user.avatar_url}" alt="" style="width: 100px; border-radius: 50%;">
      `;

   } catch (error) {
      console.error("Error:", error);
      
   };
}

fetchUser();


function fetchReadme(owner, repo){
   const url = `https://api.github.com/repos/${owner}/${repo}/readme`

   fetch(url, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   })
   .then(response => response.json())
   .then(data => {
      if(data.content == null){
         return
      }
      const decode = atob(data.content);
      // console.log(decode);
      const mdImages = [...decode.matchAll(/!\[.*?\]\((.*?)\)/g)].map(m => m[1]);
      console.log(mdImages);

      let relative_path = mdImages[0];
      if(mdImages.length > 0){
         relative_path = relative_path.slice(2);
         console.log(relative_path);
      }
      

       
      const imgUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${relative_path}`
      console.log(imgUrl);

      getImg(imgUrl);
      
   })

   // console.log(url);
   
}

function getImg(url){
   let box = document.querySelector('.repo-item');
   // let img = document.createElement('img');
   // img.src = url;
   // box.appendChild(img);

   box.innerHTML += `<img src="${url}">`;
}