const redis = require("redis")
const projectConfig = require("../config/index")

const client = redis.createClient(
  projectConfig.serviceConfig.redis.host,
  projectConfig.serviceConfig.redis.port
)

client.on("error", (err) => console.log("Redis Client Error", err))

client.connect()

module.exports.setOnRedis = async (key, value, expiresIn = 1) => {
  return await client.set(key, value, { EX: expiresIn * 60 })
}

module.exports.getFromRedis = async (key) => {
  return await client.get(key)
}
