const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const UserOtps=require("../models/userOtpModel");
const nodemailer=require("nodemailer");
var dotenv = require("dotenv")
dotenv.config()

//email config
const transporter=nodemailer.createTransport({
service:"gmail",
auth:{
  user:process.env.EMAIL,
  pass:process.env.PASSWORD
}
});

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.json({ msg: "Incorrect Email or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Email or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.verifyOTP = async (req, res, next) => {

  try {
    // console.log("hello");
    const { email, otp } = req.body;
    const user = await UserOtps.findOne({ email });
    // console.log("user entered otp is "+otp);
    // console.log("original otp is "+user.otp);
    
    if(otp===user.otp){
      user.otp="";
      return res.json({ status: true, user });
    }
    else{
      return res.json({ msg: "Incorrect OTP", status: false });
    }
    
  } catch (ex) {
    next(ex);
  }
};








module.exports.sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.json({ msg: "User not exists  ", status: false });
    const OTP=Math.floor(100000+Math.random()*900000);

    const emailExist= await UserOtps.findOne({ email });
       if(emailExist){
        const updateData=await UserOtps.findByIdAndUpdate({_id:emailExist._id},{otp:OTP},{new:true});
        await updateData.save();

        const mailOptions={
          from:process.env.EMAIL,
          to:email,
          subject:"Sending Email for Otp Validation",
          text:`OTP:-${OTP}`
        }

        transporter.sendMail(mailOptions,(error,info)=>{
          if(error){
            console.log("error",error);
            return res.json({ msg: "OTP not Send", status: false });
          }
          else{
            console.log("Email Sent",info.response);
            return res.json({ msg: "OTP Sent Successfully", status: true });
          }
        })
      }
      else{
        const saveOtpData=new UserOtps({email,otp:OTP});
        await saveOtpData.save();

        const mailOptions={
          from:process.env.EMAIL,
          to:email,
          subject:"Sending Email for Otp Validation",
          text:`OTP:-${OTP}`
        }

        transporter.sendMail(mailOptions,(error,info)=>{
          if(error){
            console.log("error",error);
            return res.json({ msg: "OTP not Send", status: false });
          }
          else{
            console.log("Email Sent",info.response);
            return res.json({ msg: "OTP Sent Successfully", status: true });
          }
        })

      }
  } catch (ex) {
    next(ex);
  }
};


