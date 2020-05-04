//////////////
//SEARCH BAR
//////////////

//Search params
document.addEventListener("click", (e) => {
  if (event.target.matches("#search")) {
    e.preventDefault();

    const searchForm = document.getElementById("searchForm");

    const type = searchForm.querySelector("select").value;
    const search = searchForm.querySelector("input").value;
    console.log(type, search);
    window.location.href = "/search/" + type + "/" + search;
  }
});

//Tags
window.addEventListener("load", () => {
  const tags = document.querySelector("input#tags");
  console.log(tags);
  if (tags) {
    console.log("s");
    tags.addEventListener("input", () => {
      let tagsArr = tags.value.split(" ");
      const tagDisplay = document.getElementById("tagDisplay");

      let tagString = "";
      tagsArr.forEach((tag) => {
        if (tag) {
          tagString += " #" + tag;
        }
      });

      tagDisplay.textContent = tagString;
    });
  }
});
