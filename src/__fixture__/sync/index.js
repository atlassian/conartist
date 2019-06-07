module.exports = {
  files: [{ name: "file1", data: "overwritten", overwrite: true }],
  include: ["./src/__fixture__/sync/include1", require("./include2")]
};
