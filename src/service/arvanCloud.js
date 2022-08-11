const { S3Client } = require("@aws-sdk/client-s3")
const { createPresignedPost } = require("@aws-sdk/s3-presigned-post")
const { v4: uuidv4 } = require("uuid")
const projectConfig = require("../config/index")
const s3 = new S3Client({
  region: "default",
  endpoint: projectConfig.serviceConfig.arvanCloud.endPointUrl,
  credentials: {
    accessKeyId: projectConfig.serviceConfig.arvanCloud.accessKey,
    secretAccessKey: projectConfig.serviceConfig.arvanCloud.secretKey,
  },
})

module.exports.getPresignedUrlToUploadProfilePicture = async (
  userId,
  fileSpecification
) => {
  const Key = `${userId}/profile-picture.${fileSpecification.type}`
  const Fields = {
    acl: "public-read",
  }
  const Conditions = [
    { acl: "public-read" },
    { bucket: projectConfig.serviceConfig.arvanCloud.bucket },
    ["starts-with", "$key", `${userId}/`],
  ]
  const result = await createPresignedPost(s3, {
    Bucket: projectConfig.serviceConfig.arvanCloud.bucket,
    Key,
    Conditions,
    Expires: projectConfig.serviceConfig.arvanCloud.expiresTime, //Seconds before the presigned post expires. 3600 by default.
    Fields,
  })
  // result = {url , fields}
  return result
}

// const applayBucketCorsPolicy = async () => {
//   try {
//     const cors = {
//       Bucket: projectConfig.serviceConfig.arvanCloud.bucket,
//       CORSConfiguration: {
//         CORSRules: [
//           {
//             AllowedHeaders: ["*"],
//             AllowedMethods: ["POST"],
//             AllowedOrigins: ["*"],
//           },
//         ],
//       },
//     }
//     const response = await s3.send(new PutBucketCorsCommand(cors))
//     console.log("Success", response)
//   } catch (err) {
//     console.log("Error", err)
//   }
// }
