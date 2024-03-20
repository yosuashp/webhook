const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "dvkcmkxpe",
    api_key: "217725728144716",
    api_secret: "53z28VG5q8KzxujhvcqxMU6xjHA",
    secure: true,
});

// Edit where picture will be saved in cloudinary (folder)
const config = {
    dir: "bcr_car-management-api"
}

module.exports = { cloudinary, config };