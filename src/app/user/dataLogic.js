const { PrismaClient } = require("@prisma/client")
const { user } = new PrismaClient()
const bcrypt = require("bcrypt")
const findUserByEmail = async (email) => {
  try {
    const result = await user.findFirst({
      where: {
        email,
      },
    })

    return result
  } catch (error) {
    throw error
  }
}

const findUserByUsername = async (username) => {
  try {
    const result = await user.findFirst({
      where: {
        username,
      },
    })

    return result
  } catch (error) {
    throw error
  }
}

const createUser = async ({
  email,
  username,
  fullname,
  password,
  profilePictureType,
  bio,
}) => {
  try {
    const hashedPass = await bcrypt.hash(password, 10)
    const result = await user.create({
      data: {
        email,
        username,
        fullname,
        password: hashedPass,
        bio,
      },
    })
    if (profilePictureType) {
      await updateProfilePictureUrlById(
        `${result.id}/profile-picture.${profilePictureType}`
      )
    }

    return result
  } catch (error) {
    throw error
  }
}

const updateProfilePictureUrlById = async (newUrl) => {
  try {
    const result = await user.update({
      where: {
        id: result.id,
      },
      data: {
        profilePictureSrc: newUrl,
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

module.exports = {
  findUserByEmail,
  findUserByUsername,
  createUser,
  updateProfilePictureUrlById,
}
