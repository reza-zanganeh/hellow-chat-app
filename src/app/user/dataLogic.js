const { PrismaClient } = require("@prisma/client")
const { user } = new PrismaClient()
const searchOnUsersByUsername = async (username) => {
  try {
    const result = await user.findMany({
      where: {
        username: {
          contains: username,
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullname: true,
        bio: true,
        isOnline: true,
        lasntTimeOnline: true,
        profilePictureSrc: true,
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

module.exports = {
  searchOnUsersByUsername,
}
