const Yadda = require("../../models/Yadda");

module.exports.tagsOfTheWeek = async () => {
  // Get all tags created in th last week
  let tags = await Yadda.find(
    {
      createdAt: {
        $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      },
    },
    "-_id"
  ).select("tags");

  // Count how many times each tag was used
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

  // Sort tags by count
  let sortable = [];
  for (var tag in tagCount) {
    sortable.push([tag, tagCount[tag]]);
  }

  sortable.sort(function (a, b) {
    return b[1] - a[1];
  });

  let tagsOfTheWeek = [];
  // only return the top 10
  for (let i = 0; i < sortable.length && i < 10; i++) {
    const arr = sortable[i];
    tagsOfTheWeek.push(arr[0]);
  }

  return tagsOfTheWeek;
};
