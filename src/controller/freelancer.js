const Freelancer = require("../models/freelancer.model");
var csv = require('fast-csv');
const mongoose = require('mongoose')

//--------------------------------------------------------------------------------------------------------------
exports.createFreelancer = (req,res)=>{
    const {name,gender,location,skills,title,experience,industry,contacts,portfolios} =req.body
    const file = req.file

    if(!name || !gender ){
        return res.status(400).json({error:"name and gender is required"})
    }

    let _freelancer = new Freelancer({
        name,
        gender,
        location,
        skills,
        title,
        experience,
        industry,
        contacts:JSON.parse(contacts),
        portfolios:JSON.parse(portfolios),
        creator:req.user._id,
        profile: file ? file.path :''
    })

   // console.log(contacts,_freelancer)

    _freelancer.save()
    .then(freelancer=>{
        res.status(200).json({success:true,freelancer})
    })
    .catch(err=>{
        console.log(err)
        res.status(400).json({error:"Something went wrong"})
    })
}

//-----------------------------------------------------------------------------------------------------------------
exports.editFreelancer = (req,res)=>{
    const {name,gender,location,skills,title,experience,industry,contacts,portfolios} =req.body
    const file = req.file
    const freelancerId = req.params.freelancerid
console.log(name,gender)
    if(!name || !gender || !freelancerId ){
        return res.status(400).json({error:"name and gender is required"})
    }

    let options = {
        name,
        gender,
        location:location||'',
        skills:skills||'',
        title:title||'',
        experience:experience||'',
        industry:industry||'',
        title:title||'',
    }
 
  

   
    if(contacts){
        options.contacts = JSON.parse(contacts)
    }
    if(portfolios){
        options.portfolios = JSON.parse(portfolios)
    }
    if(file){
        options.profile = file.path
    }
   

    Freelancer.findByIdAndUpdate(freelancerId,{$set:options},{new:true})
    .then(freelancer=>{
        res.status(200).json({success:true,freelancer})
    })
    .catch(err=>{
        
        res.status(400).json({error:"Something went wrong"})
    })
}

//----------------------------------------------------------------------------------------------------------------
exports.getAll=(req,res)=>{
    Freelancer.find()
    .sort("-createdAt")
    .then(freelancers=>{
        res.status(200).json({success:true,freelancers})
    })
    .catch(err=>{
        res.status(400).json({error:"Something went wrong"})
    })
}
//------------------------------------------------------------------------------------------------------------------
exports.deleteFreelancer=(req,res)=>{
    let freelancerId = req.params.freelancerid
    Freelancer.findByIdAndDelete(freelancerId)
    .then(freelancer=>{
        res.status(200).json({success:true})
    })
    .catch(err=>{
        res.status(400).json({error:"Something went wrong"})
    })
}

//--------------------------------------------------------------------------------------------------------------

exports.bulkUpload=(req,res)=>{
    if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
var authorFile = req.files.file;

let csvData = [];


csv.parseString(authorFile.data.toString())
    .on('error', error => console.error(error))
    .on('data', data => {
        csvData.push({
            _id:new mongoose.Types.ObjectId(),
            name: data[0],
            gender: data[1],
            location: data[2],
            skills: data[3],
            title: data[4],
            experience: data[5],
            industry: data[6],
            //profile:[data[7],data[8],data[9]],
            profile:data[7],
            contacts:{phone:data[8],facebook:data[9],skype:data[10],linkedin:data[11],whatsapp:data[12],email:data[13]},
            portfolios:[
                {siteName:data[14],siteType:data[15],siteLink:data[16]},
                {siteName:data[17],siteType:data[18],siteLink:data[19]},
                {siteName:data[20],siteType:data[21],siteLink:data[22]},
                {siteName:data[23],siteType:data[24],siteLink:data[25]},
                {siteName:data[26],siteType:data[27],siteLink:data[28]},
            ],
            creator:req.user._id
          });
    })
    .on('end', rowCount => {
        csvData.shift();
    
         Freelancer.create(csvData, function(err, documents) {
             console.log(err)
             if (err) return res.status(400).json({error:"something went wrong"});
             res.status(200).json({
                success: true,
                documents
            })
         });
       
    });

// csv
//  .parseFile(authorFile.data.toString(), {
//      headers: true,
//      ignoreEmpty: true
//  })
//  .on("data", function(data){
//     //  data['_id'] = new mongoose.Types.ObjectId();
//       console.log(data)
//     //  authors.push(data);
//  })
//  .on("end", function(){
//     //  Author.create(authors, function(err, documents) {
//     //     if (err) throw err;
//     //  });
//     //res.send(authors)
//      //res.send(authors.length + ' authors have been successfully uploaded.');
//  });

}

