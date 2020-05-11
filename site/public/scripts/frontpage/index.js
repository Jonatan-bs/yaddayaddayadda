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

    const searchField = searchForm.querySelectorAll("input")[1];

    if (!searchField.checkValidity()) return searchField.reportValidity();

    window.location.href = "/search/" + type + "/" + searchField.value;
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

//////////////
// Upload image
//////////////
document.addEventListener("click", () => {
  if (event.target.matches("#imgButton")) {
    document.getElementById("imgUpload").click();
  }
});

window.addEventListener("load", () => {
  if (!document.getElementById("imgUpload")) return;

  //Show image preview
  document.getElementById("imgUpload").addEventListener("change", (e) => {
    document.getElementById("imgPreview").classList.add("hidden");
    if (e.target.files && e.target.files[0]) {
      var reader = new FileReader();

      reader.addEventListener("load", (e) => {
        document.getElementById(
          "imgPreview"
        ).style.backgroundImage = `URL(${e.target.result})`;
        document.getElementById("imgPreview").classList.remove("hidden");
      });

      reader.readAsDataURL(e.target.files[0]);
    }

    // const form = document.getElementById("imageForm");
    // const formData = new FormData(form);
    // fetch("http://localhost:3000/tempimageCloudinary", {
    //   method: "post",
    //   body: formData,
    // })
    //   .then((res) => {
    //     return res.json();
    //   })
    //   .then((res) => {
    //     console.log(res);
    //     if (res.success) {
    //       // let name = this.props.image.name ? this.props.image.name : "";
    //       // this.props.callback({ public_id: res.public_id, name: name });
    //     } else {
    //       // this.props.callback(res);
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     // this.setState({ uploading: false });
    //     // this.props.callback(err);
    //   });
    // // document.getElementById("imageForm").submit();
  });
});
