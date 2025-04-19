const getProfilePic = (chat, userId) => {
  console.log(userId);
  
  if (chat.isGroupChat) return chat.groupIcon;

  const firstUser = chat.users[0],
    secondUser = chat.users[1];

  if (firstUser._id == userId) return secondUser.profilePic;

  return firstUser.profilePic;
};

const getChatName = (chat, userId) => {
  if (chat.isGroupChat) return chat.chatName;

  const firstUser = chat.users[0],
    secondUser = chat.users[1];

  if (firstUser._id == userId) return secondUser.name;

  return firstUser.name;
};

export { getChatName, getProfilePic };
