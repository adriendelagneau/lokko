import React from "react";

import { getUserConversations } from "@/actions/user-actions";

const page = async () => {
  const conversations = await getUserConversations();

  console.log(conversations)
  return <div>mes messages</div>;
};

export default page;
