const Yadda = require("../../models/Yadda");

module.exports.tagsOfTheWeek = async () => {
  let tags = await Yadda.find({}, "-_id").select("tags");
  let tagCount = {};
  tags.forEach((tagsArr) => {
    tagsArr.tags.forEach((tag) => {
      if (tagCount[tag] || tagCount[tag] === 0) {
        tagCount[tag]++;
      } else {
        tagCount[tag] = 0;
      }
    });
  });

  // Sort
  let sortable = [];
  for (var tag in tagCount) {
    sortable.push([tag, tagCount[tag]]);
  }

  sortable.sort(function (a, b) {
    return b[1] - a[1];
  });

  let tagsOfTheWeek = [];
  for (let i = 0; i < sortable.length && i < 10; i++) {
    const arr = sortable[i];
    tagsOfTheWeek.push(arr[0]);
  }

  return tagsOfTheWeek;
};
