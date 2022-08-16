const { PrismaClient } = require("@prisma/client")
const { userOnPrivateChat, privateChat, user, message } = new PrismaClient()

const getPrivateChatById = async (privateChatId) => {
  try {
    const result = await privateChat.findFirst({
      where: { id: +privateChatId },
      select: {
        id: true,
        messages: {
          select: {
            id: true,
            contextOrSrc: true,
            type: true,
            createdAt: true,
            is_read: true,
            owner: {
              select: {
                id: true,
                profilePictureSrc: true,
              },
            },
          },
        },
        users: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                fullname: true,
                email: true,
                bio: true,
                profilePictureSrc: true,
                isOnline: true,
                lasntTimeOnline: true,
              },
            },
          },
        },
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

const getMyPrivateChat = async (userId) => {
  try {
    const result = await privateChat.findMany({
      where: {
        users: { some: { userId: +userId } },
      },
      select: {
        id: true,
        messages: {
          select: {
            id: true,
            contextOrSrc: true,
            type: true,
            createdAt: true,
            is_read: true,
            owner: {
              select: {
                id: true,
                profilePictureSrc: true,
              },
            },
          },
        },
        users: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                fullname: true,
                email: true,
                bio: true,
                profilePictureSrc: true,
                isOnline: true,
                lasntTimeOnline: true,
              },
            },
          },
        },
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

const getPrivateChatByIdAndUserId = async (privateChatId, userId) => {
  try {
    const result = await privateChat.findFirst({
      where: {
        id: +privateChatId,
        users: { some: { userId: +userId } },
      },
      select: {
        id: true,
        messages: {
          select: {
            id: true,
            contextOrSrc: true,
            type: true,
            createdAt: true,
            is_read: true,
            owner: {
              select: {
                id: true,
                profilePictureSrc: true,
              },
            },
          },
        },
        users: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                fullname: true,
                email: true,
                bio: true,
                profilePictureSrc: true,
                isOnline: true,
                lasntTimeOnline: true,
              },
            },
          },
        },
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

const createPrivateChat = async (starterUserId, reciverUserId) => {
  try {
    const createdPrivateChat = await privateChat.create({ data: {} })
    await userOnPrivateChat.createMany({
      data: [
        {
          isStarter: true,
          privateChatId: +createdPrivateChat.id,
          userId: +starterUserId,
        },
        {
          isStarter: false,
          privateChatId: +createdPrivateChat.id,
          userId: +reciverUserId,
        },
      ],
    })
    const createdPrivateChatWithUsers = getPrivateChatById(
      createdPrivateChat.id
    )
    return createdPrivateChatWithUsers
  } catch (error) {
    throw error
  }
}

const findPrivateChatByUsersId = async (starterUserId, reciverUserId) => {
  try {
    const result = await privateChat.findFirst({
      where: {
        AND: [
          {
            users: {
              some: {
                userId: +starterUserId,
              },
            },
          },
          {
            users: {
              some: {
                userId: +reciverUserId,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        messages: true,
        users: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                fullname: true,
                email: true,
                bio: true,
                profilePictureSrc: true,
                isOnline: true,
                lasntTimeOnline: true,
              },
            },
          },
        },
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

const findUserById = async (userId) => {
  try {
    const result = await user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        fullname: true,
        email: true,
        bio: true,
        profilePictureSrc: true,
        isOnline: true,
        lasntTimeOnline: true,
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

const createMessageInPrivateChat = async (
  contextOrSrc,
  type,
  ownerId,
  privateChatId
) => {
  try {
    const newMessage = await message.create({
      data: {
        contextOrSrc,
        type,
        owner: {
          connect: {
            id: ownerId,
          },
        },
        privateChat: { connect: { id: privateChatId } },
      },
    })
    return newMessage
  } catch (error) {
    throw error
  }
}

module.exports = {
  createPrivateChat,
  findPrivateChatByUsersId,
  findUserById,
  createMessageInPrivateChat,
  getPrivateChatById,
  getMyPrivateChat,
  getPrivateChatByIdAndUserId,
}
