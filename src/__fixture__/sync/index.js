module.exports = {
  fileDefaults: {
    merge: true,
    overwrite: true
  },
  files: [
    {
      name: "file1",
      data: "index -> file1",
      overwrite: true
    },
    {
      name: "file2",
      data: { test: "index -> file2" },
      overwrite: false
    },
    {
      name: "file3",
      remove: true
    }
  ],
  include: ["./src/__fixture__/sync/include1", require("./include2")]
};
