const path = require("path");

// Controller function to render the home page
const getHomePage = (req, res, next) => {
  // Serve the HTML file for the home page
  res.sendFile(path.join(__dirname, "../", "public", "html", "chatHome.html"));
};

module.exports = {
    getHomePage,
};