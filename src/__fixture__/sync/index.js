module.exports = {
  files: [
    {
      name: "file1",
      data: "overwritten",
      overwrite: true
    },
    {
      name: "file2",
      data: { some: "modified", more: "json" },
      merge: true
    }
  ],
  include: ["./src/__fixture__/sync/include1", require("./include2")]
};
