const { contactUsEmailOwner } = require("../utils/contactUsOwnerTemplater");
const { contactUsEmail } = require("../utils/contactUsTemplate");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

exports.contactUs = async(req, res) => {
    try {
        const { name, email, phoneNo, countrycode, message} = req.body;

        if(!name || !email || !phoneNo || !countrycode || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!",
            })
        }

        const properMessage = `From ${name} \n Email - ${email} \n Phone Number: ${countrycode + " " + phoneNo} \n\n ${message}`;

        // Send Message to the owner of the StudyNotion
        mailSender(process.env.MAIL_USER, "Ecommerce - Contact Us", contactUsEmailOwner(email, name, message, phoneNo, countrycode));

        // Send Message to the sender
        mailSender(email, "Thanks for Contacting Us!", contactUsEmail(email, name, message, phoneNo, countrycode));

        return res.status(200).json({
            success: true,
            message: "Mail Sent Successfully"
        });
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Cannot send message at this time, plaese try again later",
            error: error.message
        })
    }
}