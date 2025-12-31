import React from "react";

import { getUserConversations } from "@/actions/user-actions";

const page = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const conversations = await getUserConversations();

  return <div>mes messages</div>;
};

export default page;
