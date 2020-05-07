//////////////
//SEARCH BAR
//////////////

//Search params
document.addEventListener("click", (e) => {
  if (event.target.matches("#search")) {
    e.preventDefault();

    const searchForm = document.getElementById("searchForm");
    let type = searchForm.querySelectorAll("input")[0].checked;
    type = type ? "tag" : "person";

    const search = searchForm.querySelectorAll("input")[1].value;
    window.location.href = "/search/" + type + "/" + search;
  }
});

//Tags
window.addEventListener("load", () => {
  const tags = document.querySelector("input#tags");
  if (tags) {
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

// Like
document.addEventListener("click", () => {
  if (event.target.matches(".like")) {
    const id = event.target.parentNode.parentNode.querySelector("input").value;
    fetch("/yadda/like", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    }).then(() => {
      location.reload();
    });
  }
});
